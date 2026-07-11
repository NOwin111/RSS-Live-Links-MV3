window.addEventListener("load", init, false);

var manifest = {version: "unknown"};
var versionChanged = false;

var noAutoUpdates = false;

var inWorker = false;

var options = {
	subscriptions: [],
	groups: {},
	maxItems: 10,
	defaultTtl: 5,
	defaultTimeout: 45,
	unlimitedItems: false,
	sortItemsByDate: false,
	showUnseenFirst: false,
	hideOthersOnOpen: false,
	animateButton: true,
	playSound: true,
	singleItem: false,
	focusFirstTab: false,
	useAvailableIcon: false,
	soundFile: "sounds/boing.mp3",
	popupWidth: 360,
	popupHeight: 504,
	maxConcurrentRequests: 4,
	unlimitedRequests: false,
	showAvailable: true,
	useGroups: false,
	maintainBadge: true,
	storageSizeWarningMade: false,
	sortItems: 0,
	fixPopupClosesBug: false,
	popupDensity: 0,
	styleOptions: {}
};

var fontStrings = {
	sans_serif: "Sans-serif",
	serif: "Serif",
	arial: "Arial, Helvetica, sans-serif",
	arial_black: "'Arial Black', Gadget, sans-serif",
	bookman_old_style: "'Bookman Old Style', serif",
	comic_sans_ms: "'Comic Sans MS', cursive",
	garamond: "Garamond, serif",
	geneva: "Geneva, sans-serif",
	georgia: "Georgia, serif",
	impact: "Impact, Charcoal, sans-serif",
	lucida_sans_unicode: "'Lucida Sans Unicode', 'Lucida Grande', sans-serif",
	ms_sans_serif: "'MS Sans Serif', Geneva, sans-serif",
	ms_serif: "'MS Serif', 'New York', sans-serif",
	palatino_linotype: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
	tahoma: "Tahoma, Geneva, sans-serif",
	times_new_roman: "'Times New Roman', Times, serif",
	trebuchet_ms: "'Trebuchet MS', Helvetica, sans-serif",
	verdana: "Verdana, Geneva, sans-serif"
};

var currentTimer;

var feedInfo = {feeds: [], feedsByURL: {}};

var lastPopupTab;

var loaded = false;

var updatingCount = 0;

var updating = false;

var seenStates = {}; 

var lastOpenedFeed;

var delayedTabs = [];

var popupStateInfo = {};

var unseenFeedCount = 0;
var errorFeedCount = 0;
var storageSizeWarningMade = false;

var extensionFS;

var xmlHttpRequestManager;
var rssllWebWorker;

function init() {
	initExtensionFS();
	initGraphics();
	getManifest();
	earlyInitBookmarks();
	loadSavedState();
	initContextMenus();
	setWorkerStrategy();
	changeMaxConcurrentRequests();

	autoUpdateFeeds();
	try {
		chrome.tabs.query({currentWindow: true}, addAllTabs);
	} catch(e) { console.error("Error in addAllTabs: " + e); }
	console.log("RSS Live Links loaded");
	try {
		initBookmarks();
	} catch(e) { console.error("Error in 'initBookmarks': " + e); }
	saveOptions();
	loaded = true;

		// MV3: popup打开时检查service worker是否检测到有feed更新
	// 如果有，立即触发刷新并清除标记
	checkServiceWorkerUpdates();
	
	// MV3: 每次popup打开时同步所有feed的expire到SW
	syncAllExpiresToSW();

	// MV3: 同步seenStates到SW，让SW能正确计算角标
	try {
		chrome.runtime.sendMessage({
			greeting: 'saveSeenStates',
			data: seenStates,
			maxItems: options.unlimitedItems ? -1 : options.maxItems
		}).catch(function(){});
	} catch(e) {}
}

function checkServiceWorkerUpdates() {
	if (!chrome.storage || !chrome.storage.local) return;
	chrome.storage.local.get(null, function(allData) {
		var hasUpdates = false;
		var updateKeys = [];

		// 检查swHasUpdate标记——SW后台更新feed后会设这个标记
		feedInfo.feeds.forEach(function(feed) {
			var hasUpdateKey = 'swHasUpdate:' + feed.url;
			if (!allData[hasUpdateKey]) return;

			updateKeys.push(hasUpdateKey);

			var swFeedData = allData['swFeed:' + feed.url];
			if (!swFeedData || !swFeedData.txt) return;

			console.log("SW has update for " + feed.name + ", restoring");
			// 把SW的新数据写入localStorage
			try {
				saveToLocalStorage("feed:" + feed.url, swFeedData.txt);
			} catch(e) {}
			// 恢复到feed对象
			restoreFeedFromCache(feed, swFeedData.txt);
			hasUpdates = true;
		});

		// 同步expire时间
		feedInfo.feeds.forEach(function(feed) {
			var swExpireInfo = allData['swExpire:' + feed.url];
			if (swExpireInfo && swExpireInfo.expire) {
				var currentExpire = feed.expire ? feed.expire.getTime() : 0;
				if (swExpireInfo.expire > currentExpire) {
					feed.expire = new Date(swExpireInfo.expire);
					feed.updated = new Date(swExpireInfo.expire - (parseInt(swExpireInfo.refreshTime) || 60) * 60 * 1000);
				}
			}
		});

		// 清除swHasUpdate标记
		if (updateKeys.length > 0) {
			chrome.storage.local.remove(updateKeys);
		}

		if (hasUpdates) {
			console.log("SW updates applied, refreshing UI");
			updateSeenStates();
			setButtonTitle(unseenFeedCount, errorFeedCount);
			try {
				chrome.runtime.sendMessage({ greeting: 'updateBadge' }).catch(function(){});
			} catch(e) {}
		}
	});
}

function initExtensionFS() {
	window.webkitRequestFileSystem(window.TEMPORARY, 1024 *1024, 
		function (fs) {
			console.log('Opened file system: ' + fs.name);
			extensionFS = fs;
		},

		function failFS(e) {
			console.error('Failed to open file system: ' + e);
		}
	);
}

function popupClosed() {

	// MV3: 防止多次调用（visibilitychange+pagehide+onunload可能重复触发）
	if (popupClosed._called) return;
	popupClosed._called = true;

	popupStateInfo.inPopUp = false;

	// 立即保存已读状态，防止iframe销毁导致状态丢失
	updateSeenStates();

	openDelayedTabs();

	if (popupStateInfo.firstTab != undefined) {
		chrome.tabs.update(popupStateInfo.firstTab, {active: true});
	}
	popupStateInfo.firstTab = undefined;
	
	feedInfo.feeds.forEach(function(feed){delete feed.popupUpdateCallback});

	if (lastOpenedFeed) {
		lastOpenedFeed.getItems().forEach(function(item) {
			if (item.displayed) {
				lastOpenedFeed.setSeen(item.guid);
				delete item.displayed;
			}
		});
		lastOpenedFeed = undefined;
	}
	updateSeenStates();
	setButtonTitle(unseenFeedCount, errorFeedCount);
}

function openDelayedTabs() {
	
	var lim = delayedTabs.length;

	var unfixedTabs = [];

	for (var i = 0; i < lim; ++i) {
		var newTab = delayedTabs[i];
		if (i == 0) {
			newTab.active = true;
			chrome.tabs.create(newTab, function(tab) {
				popupStateInfo.firstTab = tab.id;
			});
		} else {
			newTab.active = false;
			chrome.tabs.create(newTab);
		}
	}
	delayedTabs = [];
}

function updateSeenStates() {
	seenStates = {};
	feedInfo.feeds.forEach(function(feed) {
		seenStates[feed.url] = feed.getSeenStates();
	});
	saveSeenStates();
}

/*
 * This function is a work-around for the "disappearing feeds" issue
 * in Chrome versions where extension storage is deleted when browser
 * history is deleted.
 */
function checkLocalStorageIntegrity() {
	var lastVersion = localStorage["version"];
	if (!lastVersion) {
		console.warn("Extension local storage has been deleted. Rebuilding");
		cleanLocalStorage();
	}
}

function saveToLocalStorage(key, data) {
	try {
		localStorage[key] = data;
	} catch(e) { 
		console.error("Local storage update failed for \"" + key + "\": " + e); 
	}
}

function saveSeenStates() {
	saveToLocalStorage("seenStates", JSON.stringify(seenStates));
	// 通知service worker更新角标，同时传maxItems让SW角标计算和popup一致
	try {
		chrome.runtime.sendMessage({
			greeting: 'saveSeenStates',
			data: seenStates,
			maxItems: options.unlimitedItems ? -1 : options.maxItems
		}).catch(function(){});
	} catch(e) {}
}

function fixGroupIndexing() {
	//HACKING
	//
	//There appears to be a problem with group indexing - we TRY to fix
	//it here while we cannot find the root cause.
	
	var groupArray = [];
	var newGroups = {};
	for (var groupName in options.groups)
	{
		var idx = options.groups[groupName];
		groupArray[idx] = groupName;
	}

	var nextIdx = 0;
	var warned = false;
	for (var i = 0; i < groupArray.length; ++i) {
		if (!groupArray[i]) {
			if (!warned) {
				console.warn("Group indexes have been corrupted - recalculating");
				warned = true;
			}
		} else {
			newGroups[groupArray[i]] = nextIdx++;
		}
	}

	if (warned) {
		options.groups = newGroups;
	}

	//END HACK
}

function saveBookmarkFolderIds() {
	for (var i = 0; i < options.subscriptions.length; ++i) {
		var sub = options.subscriptions[i];
		if (feedInfo.feedsByURL[sub.url] != undefined) {
			var feed = feedInfo.feeds[feedInfo.feedsByURL[sub.url]];
			if (feed) {
				sub.useBookmarkFolder = feed.useBookmarkFolder;
			}
		}
	}
}

function saveOptions() {
	fixGroupIndexing();
	saveBookmarkFolderIds();
	saveToLocalStorage("options", JSON.stringify(options));
}

function getManifest() {
	if (chrome.runtime.getManifest) {
		/*
		 * do it the clean way!
		 */
		manifest = chrome.runtime.getManifest();
		checkVersion();
	} else {
		/*
		 * do it the yucky way!
		 */
		var request = new XMLHttpRequest();
		/*
		 * Deliberately sync since it is local
		 */
		request.open("GET", chrome.runtime.getURL("manifest.json"), false);
		request.onload = function() {
			manifest = JSON.parse(this.responseText);
			checkVersion();
		};
		request.send();
	}
}

function checkVersion() {
	var lastVersion = localStorage["version"];
	if (lastVersion != manifest.version) {
		saveToLocalStorage("version", manifest.version);
		versionChanged = true;
		// Cannot call action.setPopup from extension page in MV3, send message to service worker
		try {
			chrome.runtime.sendMessage({greeting: "showUpdatedPage"});
		} catch(e) { console.error("Failed to send showUpdatedPage message: " + e); }
	}
}

function loadOptions() {
	var optionsJSON = localStorage["options"];
	if (optionsJSON) {
		var saveXMLFound = false;
		var storedOptions = JSON.parse(optionsJSON);
		for (var key in storedOptions) {
			if (key == "longFormat") { //replace longFormat option
				options["popupHeight"] = 560;
			} else if (key != "delayTabOpen") {
				options[key] = storedOptions[key];
			}
			if (key == "saveFeedXML") {
				saveXMLFound = true;
			}
		}
		if (options.popupHeight > 560) {
			options.popupHeight = 560;
		}
		if (options.popupWidth > 750) {
			options.popupWidth = 750;
		}
		if (!saveXMLFound) {
			delete storedOptions.saveFeedXML;
		}
		document.getElementById('audioNotify').src = options.soundFile;
	}
	syncSoundOptionsToSW();
}

function loadAndSetSeenStates() {
	var mySeenStatesJSON = localStorage["seenStates"];

	if (mySeenStatesJSON) {
		seenStates = JSON.parse(mySeenStatesJSON);
	}

	feedInfo.feeds.forEach(initializeFeed);

	saveSeenStates();

	setButtonTitle(unseenFeedCount, errorFeedCount);
}

function restoreFeedFromCache(feed, txt) {
	// 模拟feedWorker的handleResponse，但直接用缓存XML，不发网络请求
	try {
		var parser = new DOMParser();
		var doc = parser.parseFromString(txt, "text/xml");
		if (!doc || doc.querySelector("parsererror")) {
			console.log("Cached XML parse error for " + feed.name + " (stale cache, clearing and will refresh)");
			// 缓存的XML已损坏/过期，清掉这条坏数据，
			// 避免下次启动时反复用同一份坏文本解析、反复报错。
			// 后续 checkServiceWorkerUpdates() 或下一次后台刷新
			// 拿到新的有效数据后会重新写入。
			try {
				delete localStorage["feed:" + feed.url];
			} catch(e) {}
			return;
		}
		var data = {
			feed: feed.data,
			url: feed.url,
			name: feed.name,
			response: {
				feed: {
					updateCycleId: feed.data.updateCycleId,
					baseURL: feed.data.baseURL,
					parentURL: feed.data.parentURL,
					itemGuids: feed.data.itemGuids,
					itemsByGuid: feed.data.itemsByGuid,
					deletedItems: feed.data.deletedItems,
					moreStories: feed.data.moreStories,
					txt: null, // 设null强制populate认为内容有变化
					ttl: feed.data.ttl,
					pubDate: feed.data.pubDate,
					stats: feed.data.stats,
					faviconURL: feed.data.faviconURL
				}
			},
			testing: { feed: feed }
		};
		// 调populate解析XML，结果写入data.response.feed
		var changed = populate(data, doc, txt);
		// 必须设changed:true，否则handleUpdate会跳过populate
		data.response.changed = true;
		// 把解析结果通过handleUpdate应用到feed
		feed.handleUpdate(data.response);
		// 修复：populate传入时txt被强制设为null（见上方注释），
		// handleUpdate内部会把这个null写回feed.data.txt。
		// 如果feed.data.txt保持null，之后saveFeedText()里
		// `if (feed && feed.data && feed.data.txt)` 判断为假，
		// 就不会覆盖localStorage里的旧缓存——导致这份原本已经能正常
		// parse的txt写不进去，一旦旧缓存本身是坏的，就会反复触发parse error。
		// 这里显式回填，确保下次保存时能用这份好的txt覆盖旧缓存。
		if (feed.data) {
			feed.data.txt = txt;
		}
		// handleUpdate/populate内部可能清除部分_seenStates（删除条目时）
		// 重新把seenStates应用一次，确保已读状态正确
		var feedSeenStates = seenStates[feed.url];
		if (feedSeenStates) {
			for (var guid in feedSeenStates) {
				feed.setSeenStateByGuid(guid, feedSeenStates[guid]);
			}
		}
		// 恢复expire时间：优先从localStorage读取上次保存的expire
		var savedExpire = localStorage.getItem("feedExpire:" + feed.url);
		if (savedExpire) {
			var expireTime = parseInt(savedExpire);
			if (!isNaN(expireTime)) {
				feed.expire = new Date(expireTime);
				feed.updated = new Date(expireTime - (feed.refreshTime != "TTL" ? feed.refreshTime * 60000 : 300000));
			}
		} else {
			// 没有保存的expire，设为当前时间（立即可以刷新）
			feed.updated = new Date(0);
			feed.setExpireTime();
		}
	} catch(e) {
		console.error("Error restoring cached feed for " + feed.name + ": " + e);
	}
}

function initializeFeed(feed) {
	// MV3: 先恢复seenStates到feed._seenStates，
	// 这样restoreFeedFromCache里_setState()计算时能正确识别已读状态
	var feedSeenStates = seenStates[feed.url];
	if (feedSeenStates) {
		for (var guid in feedSeenStates) {
			feed.setSeenStateByGuid(guid, feedSeenStates[guid]);
		}
	}
	// 先设置callback，再恢复feed内容
	// 这样restoreFeedFromCache触发的_setState()会通过callback正确更新unseenFeedCount
	// 不需要在这里再手动累加
	feed.unseenStateCallback = feedUnseenStateCallback;
	feed.errorStateCallback = feedErrorStateCallback;
	feed.updateCallback = feedUpdateCallback;
	// 再恢复feed内容（会调用_setState()→callback→更新unseenFeedCount）
	var oldFeedTxt = localStorage["feed:" + feed.url];
	if (oldFeedTxt) {
		restoreFeedFromCache(feed, oldFeedTxt);
	} else if (feed.hasUnseen()) {
		// 没有缓存内容时，手动累加
		unseenFeedCount++;
	}
	seenStates[feed.url] = feed.getSeenStates();
}

function loadSavedState() {
	loadOptions();
	buildFeedInfo();
	loadAndSetSeenStates();
	// Clean local storage only when version changes
	// to avoid wiping saved subscriptions on every startup
	if (versionChanged) {
		cleanLocalStorage();
	}
}

function changeMaxConcurrentRequests(num) {
	if (num == undefined) {
		if (options.unlimitedRequests) {
			num = feedInfo.feeds.length;
		} else {
			num = options.maxConcurrentRequests;
		}
	}
	if (rssllWebWorker) {
		rssllWebWorker.runRequest("set_max_cncrnt_rqsts", num);
	} else {
		xmlHttpRequestManager.setMaxRunning(num);
	}
}

function cleanLocalStorage() {
	try {
		localStorage.clear();
		saveAllLocalStorage();
	} catch(e) { console.error("Local storage clean failed: " + e); }
}

function saveAllLocalStorage() {
	saveToLocalStorage("version", manifest.version);
	saveOptions();
	saveSeenStates();
	saveFolderIds();
	feedInfo.feeds.forEach(saveFeedText);
}

function getConfigJSON() {
	var config = {};
	config.id = "RSS Live Links";
	config.version = manifest.version;
	config.options = options;
	config.seenStates = seenStates;
	return JSON.stringify(config);
}

function replaceConfig(configJSON) {
	var myOptions = {};
	myOptions.subscriptions = [];
	myOptions.groups = {};
	var newConfig = JSON.parse(configJSON);
	var id = newConfig.id
	if (id != "RSS Live Links") {
		throw new Error(chrome.i18n.getMessage("import_error"));
	}
	if (newConfig.options) {
		for (var key in newConfig.options) {
			myOptions[key] = newConfig.options[key];
		}
	}

	// MV3: 直接把styleOptions等设置合并到options并保存，
	// 避免getStyleFields()因为UI是默认值而跳过保存
	if (myOptions.styleOptions) {
		options.styleOptions = myOptions.styleOptions;
	}
	for (var key in myOptions) {
		if (key !== 'subscriptions' && key !== 'groups' && key !== 'styleOptions') {
			options[key] = myOptions[key];
		}
	}
	saveOptions();

	seenStates = newConfig.seenStates;
	if (seenStates) {
		saveSeenStates()
	} else {
		seenStates = {};
		try {
			delete localStorage["seenStates"];
		} catch(e) { console.error("Local storage seenState deletion failed: " + e); }
	}
	updateOptions(myOptions);
}

function mergeConfig(configJSON) {
	var newConfig = JSON.parse(configJSON);
	var id = newConfig.id
	if (id != "RSS Live Links") {
		throw new Error(chrome.i18n.getMessage("import_error"));
	}
	var mods = false
	var myOptions = {};
	myOptions.subscriptions = [];
	myOptions.groups = {};
	options.subscriptions.forEach( function(feed) {
		myOptions.subscriptions.push(feed);
	});
	if (newConfig.options && newConfig.options.subscriptions) {
		newConfig.options.subscriptions.forEach( function(feed) {
			if (feedInfo.feedsByURL[feed.url] == undefined) {
				myOptions.subscriptions.push(feed);
				mods = true;
			}
		});
	}

	if (newConfig.seenStates) {
		for (var url in newConfig.seenStates) {
			if (seenStates[url] == undefined) {
				seenStates[url] =  newConfig.seenStates[url];
			}
		}
		saveSeenStates();
	}
	if (mods) {
		updateOptions(myOptions);
	}
}

function updateOptions(newOptions) {
	checkLocalStorageIntegrity();
	var mods = false;
	var doClean = false;
	var doBuildFeeds = false;
	var subMods = {additions: false, deletions: false};

	for(var key in newOptions) {
		if (key == "maxItems" || key == "unlimitedItems" || key == "defaultTtl") {
			if (options[key] != newOptions[key]) {
				options[key] = newOptions[key];
				mods = true;
			}
		} else if (key == "useAvailableIcon" || key == "maintainBadge") {
			if (options[key] != newOptions[key]) {
				options[key] = newOptions[key];
				checkBrowserIcon((key == "maintainBadge"));
			}
		} else if (key == "saveFeedXML") {
		} else if (key == "subscriptions") {
			options.subscriptions = newOptions.subscriptions;
			doBuildFeeds = true;
		} else { 
			options[key] = newOptions[key];
			if (key == "soundFile") {
				document.getElementById('audioNotify').src = options.soundFile;
			}
		}
	}

/*	if (doClean) {
		cleanLocalStorage();
	} */

	if (mods) {
		feedInfo.feeds.forEach(function(feed) {
			feed.setDefaultTtl(options.defaultTtl);
			feed.setMaxItems(options.unlimitedItems ? -1 : options.maxItems);
		});
	}

	if (doBuildFeeds) {
		subMods = buildFeedInfo();
		checkBrowserIcon();
	}

	if (mods || subMods.additions || subMods.deletions) {
		if (subMods.additions) {
			updateFeeds();
		} else {
			saveSeenStates();
		}
	}
	saveOptions();
	changeMaxConcurrentRequests();
	syncSoundOptionsToSW();
}

function createNewFeed(data) {
	var newFeed = new Feed(data.name, 
			               data.url, 
						   (options.unlimitedItems ? -1 : options.maxItems),
						   (data.refreshTime ? data.refreshTime :"TTL"),
						   options.defaultTtl, data.faviconURL);
	newFeed.group = data.group;
	newFeed.autoopenNew = data.autoopenNew;
	newFeed.sortItems = data.sortItems ? data.sortItems : 0;
	newFeed.changesUnseen = (data.changesUnseen == true);
	newFeed.networkTimeout = (data.networkTimeout ? data.networkTimeout : 0);
	var flag = (data.useBookmarkFolder == undefined ? (hasBookmarkFolder(data) ? true : false ) : data.useBookmarkFolder);
	newFeed.useBookmarkFolder = flag;
	var feedSeenStates = seenStates[newFeed.url];
	if (feedSeenStates) {
		for (var guid in feedSeenStates) {
			newFeed.setSeenStateByGuid(guid, feedSeenStates[guid]);
		}
	}
	if (loaded) {	
		newFeed.unseenStateCallback = feedUnseenStateCallback;
		newFeed.errorStateCallback = feedErrorStateCallback;
		newFeed.updateCallback = feedUpdateCallback;
		seenStates[newFeed.url] = newFeed.getSeenStates();
	}
	return newFeed;
}

function addSubscriptionFromPopup(subscriptionData, doLoad) {
	if (feedInfo.feedsByURL[subscriptionData.url]) {
		return;
	}
	options.subscriptions.push(subscriptionData);
	var newFeed = createNewFeed(subscriptionData);
	feedInfo.feedsByURL[newFeed.url] = feedInfo.feeds.length;
	feedInfo.feeds.push(newFeed);
	if (loaded) {
		changeMaxConcurrentRequests();
		if (subscriptionData.useBookmarkFolder) {

			var func = (doLoad ? 
				function (feed, folder) {
					saveOptions();
					feed.loadFeed(options.defaultTimeout);
				} : function (feed, folder) {saveOptions();});

			createBookmarkFolder(newFeed, func);
		} else {
			saveOptions();
		   	if (doLoad) {
				newFeed.loadFeed(options.defaultTimeout);
			}
		}
	}
	checkBrowserIcon();
	return newFeed;
}

function sortFeedItems(feedObject, itemArray) {
	var algorithm = (feedObject.sortItems ? (feedObject.sortItems - 1) : options.sortItems);
	if (!algorithm)
		return;

	if (algorithm == 1) {
		itemArray.sort(
			function(item1, item2) {
				var title1 = getItemTitle(item1)
				var title2 = getItemTitle(item2);
				return (title1 ? (title2 ? title1.localeCompare(title2) : 1) : (title2 ? -1 : 0));
			}
		);
	} else if (algorithm < 4) {
		itemArray.sort(
			function(item1, item2) {
				var date1 = item1.pubDate;
				var date2 = item2.pubdate;
				var val = (date1 ? (date2 ? date1.getTime() - date2.getTime() : 1) : (date2 ? -1 : 0));
				return (algorithm == 2 ? val : (0-val));
			}
		);
	}
}


function saveFeedText(feed) {
	try {
		if (feed && feed.data && feed.data.txt) {
			saveToLocalStorage("feed:" + feed.url, feed.data.txt);
			// 保存expire时间到localStorage
			if (feed.expire) {
				saveToLocalStorage("feedExpire:" + feed.url, feed.expire.getTime().toString());
			}
			// 通知service worker保存feed数据和expire（供后台刷新用）
			try {
				var refreshTimeVal = feed.refreshTime;
				// 确保refreshTime有效：如果是数字字符串，转成数字；如果是"TTL"保留
				var expireTimeMs = feed.expire ? feed.expire.getTime() : (Date.now() + 60 * 60 * 1000);
				var expireInfo = {
					expire: expireTimeMs,
					refreshTime: refreshTimeVal,
					name: feed.name
				};
				chrome.runtime.sendMessage({
					greeting: 'saveFeedData',
					url: feed.url,
					feedData: feed.data,
					expireInfo: expireInfo
				}).catch(function(){});
			} catch(e) {}
		} else if (feed) {
			// 即使没有feed data，也同步expire时间到SW（确保options设置后SW能知道刷新频率）
			try {
				if (feed.expire) {
					saveToLocalStorage("feedExpire:" + feed.url, feed.expire.getTime().toString());
				}
				var expireTimeMs = feed.expire ? feed.expire.getTime() : (Date.now() + 60 * 60 * 1000);
				chrome.runtime.sendMessage({
					greeting: 'saveFeedExpire',
					url: feed.url,
					expireInfo: {
						expire: expireTimeMs,
						refreshTime: feed.refreshTime,
						name: feed.name
					}
				}).catch(function(){});
			} catch(e) {}
		}
	} catch(e) {
		console.error("Error saving feed text for " + feed.name + ": " + e);
	}
}

function feedUpdateCallback(feed, isUpdated) {
	if (feed.autoopenNew && feed.hasUnseen()) {
		console.log("Auto opening " + feed.name);
		feed.getItems().forEach(function(item) {
			var guid = item.guid;
			if (!feed.isSeen(guid)) {
				console.log("Auto opening " + item.url);
				openInTab(item.url, false, true);
				feed.setSeen(guid);
			}
		});
	}

	if (feed.popupUpdateCallback) {
		feed.popupUpdateCallback(feed, isUpdated);
	}
	if (feed.error) {
		console.error(feed.name + " has an error: " + feed.error);
	} else if (isUpdated) {
		saveFeedText(feed);
		if (feed.hasUnseen()) {
			console.log(feed.name + " has unseen updates");
		}
		if (hasBookmarkFolder(feed)) {
			updateBookmarkFolder(feed);
		}
	}
}

function feedUnseenStateCallback(feed) {
	if (feed.hasUnseen()) {
		unseenFeedCount++;
	} else {
		unseenFeedCount--;
	}
	seenStates[feed.url] = feed.getSeenStates();
	saveSeenStates();
	setButtonTitle(unseenFeedCount, errorFeedCount);
}

function feedErrorStateCallback(feed) {
	if (feed.error) {
		errorFeedCount++;
	} else {
		errorFeedCount--;
	}
	setButtonTitle(unseenFeedCount, errorFeedCount);
}

function buildFeedInfo() {
	var myFeeds = [];
	var myFeedsByURL = {};
	// MV3: 记录本次buildFeedInfo的时间，用于给新feed设置初始expire
	var buildTime = new Date();

	options.subscriptions.forEach(function(myFeed) {
		if (myFeed.url && myFeed.name) {
			myFeedsByURL[myFeed.url] = myFeeds.length;
			myFeeds.push(myFeed);
		}
	});

	/*
	 * Now see if we already have some of these feeds, and if so
	 * replace the new info with that info at the new position.
	 */
	var adds = false;
	for(var url in myFeedsByURL) {
		var myFeedIndex = myFeedsByURL[url];
		var myFeed = myFeeds[myFeedIndex];

		if (feedInfo.feedsByURL[url] != undefined) {
			var feedIndex = feedInfo.feedsByURL[url];
			var oldFeed = feedInfo.feeds[feedIndex];
			if (myFeed.refreshTime && oldFeed.refreshTime != myFeed.refreshTime) {
				oldFeed.setRefreshTime(myFeed.refreshTime);
			}
			if (myFeed.networkTimeout && oldFeed.networkTimeout != myFeed.networkTimeout) {
				oldFeed.networkTimeout = myFeed.networkTimeout;
			}
			if (oldFeed.name != myFeed.name) {
				renameBookmarkFolder(oldFeed, myFeed.name);
				oldFeed.name = myFeed.name; 
			}
			oldFeed.group = myFeed.group;
			oldFeed.sortItems = myFeed.sortItems ? myFeed.sortItems : 0;
			var flag = (myFeed.useBookmarkFolder == undefined ? (hasBookmarkFolder(myFeed) ? true : false ) : myFeed.useBookmarkFolder);
			oldFeed.useBookmarkFolder = flag;

			myFeeds[myFeedIndex] = oldFeed;
			delete feedInfo.feedsByURL[url];
		} else {
			adds = true;
			var newFeed = createNewFeed(myFeed);
			// 新建feed时expire为空，restoreFeedFromCache会从localStorage恢复expire
			// 如果没有缓存的expire，updateFeeds会立即刷新
			myFeeds[myFeedIndex] = newFeed;
		}
	}

	var dels = false;
	for (var url in feedInfo.feedsByURL) {
		var deletedFeed = feedInfo.feeds[feedInfo.feedsByURL[url]];
		deletedFeed.unseenStateCallback = undefined;
		deletedFeed.errorStateCallback = undefined;
		deletedFeed.updateCallback = undefined;
		if (deletedFeed.hasUnseen()) {
			unseenFeedCount--;
		}
		if (deletedFeed.error) {
			errorFeedCount--;
		}
		try {
			delete seenStates[url];
		} catch(e) { console.error("Local storage seenState deletion failed: " + e); }
		try {
			delete localStorage["feed:" + url];
		} catch(e) { console.error("Local storage feed URL deletion failed for feed:" + url + ": " + e); }
		deleteBookmarkFolder(deletedFeed);
		dels = true;
	}

	if (loaded && (adds || dels)) {
		changeMaxConcurrentRequests();
		saveSeenStates();
		setButtonTitle(unseenFeedCount, errorFeedCount);
	}

	if (loaded) {
		applyBookmarkFolderChanges(myFeeds);
	}

	feedInfo.feeds = myFeeds;
	feedInfo.feedsByURL = myFeedsByURL;
	return {additions: adds, deletions: dels};
}

function applyBookmarkFolderChanges(myFeeds) {
	var count = myFeeds.length;
	var doneFunction = function (feed, folder) {
		if (feed && feed.useBookmarkFolder && folder) {
			loadBookmarkFolder(feed, folder);
		}
		if (--count <= 0) {
			saveOptions();
		}
	};

	var savedCount = count;
	for (var i = 0; i < savedCount; ++i) {
		var feed = myFeeds[i];
		if (feed.useBookmarkFolder && !hasBookmarkFolder(feed)) {
			createBookmarkFolder(feed, doneFunction);
		} else if (hasBookmarkFolder(feed) && !feed.useBookmarkFolder) { 
			deleteBookmarkFolder(feed, doneFunction);
		} else {
			if (--count <= 0) {
				saveOptions();
			}
		}
	}
}

function autoUpdateFeeds() {
	checkLocalStorageIntegrity();
	if (!noAutoUpdates) {
		updateFeeds();
		// MV3: 每次popup打开时，把当前所有feed的expire信息同步到Service Worker
		syncAllExpiresToSW();
		window.setTimeout(autoUpdateFeeds, 30000);
	}
}

// MV3: 将所有feed的expire/refreshTime同步到Service Worker
function syncAllExpiresToSW() {
	try {
		var subscriptions = [];
		feedInfo.feeds.forEach(function(feed) {
			if (feed.url) {
				subscriptions.push({
					url: feed.url,
					name: feed.name,
					refreshTime: feed.refreshTime
				});
			}
		});
		if (subscriptions.length > 0) {
			chrome.runtime.sendMessage({
				greeting: 'syncAllFeedsExpiry',
				subscriptions: subscriptions
			}).catch(function(){});
		}
	} catch(e) {
		console.error("Error syncing expires to SW: " + e);
	}
}

function updateFeeds() {
	var feeds = feedInfo.feeds;
	var now = new Date();
	for (var i = 0; i < feeds.length; ++i) {
		var feed = feeds[i];
		if (!feed.updating && (!feed.expire || feed.expire.getTime() < now.getTime())) {
			console.log("Fetching feed \"" + feed.name + "\"");
			feed.loadFeed(options.defaultTimeout);
		}
	}
}

function openExtensionPage(page, focus, win) {
	if (focus == undefined)
	{
		focus = true;
	}
	var URL = chrome.runtime.getURL(page);
	if (win) {
		win.location = URL;
	} else {
		openInTab(URL, focus);
	}
}

function applyStyleOptions(styleSheets) {
	for (var styleClass in options.styleOptions) {
		var styles = options.styleOptions[styleClass];
		var declaration = "";
		for (var property in styles) {
			var propertyValue = styles[property];
			if (property == "font-family" && fontStrings[propertyValue]) {
				propertyValue = fontStrings[propertyValue];
			}
			declaration += property +":"+propertyValue+";";
		}

		styleSheets[styleSheets.length-1].addRule("." + styleClass, declaration);
	}
}

function openInTab(url, focus, reuseTab, delay, callback) {
	chrome.tabs.query({currentWindow: true},
		function(views) {
			var i;
			for (i = 0; i < views.length && views[i].url != url; ++i);
			if (i < views.length) {
				chrome.tabs.update(views[i].id, {active: focus}, callback);
			} else if (!(delay && options.fixPopupClosesBug)) {
				chrome.tabs.create({url: url, active: focus, index: 5000}, callback);
			} else {
				delayedTabs.push({url: url, active: focus, index: 5000});
			}
		}
	);
}

function updateButtonTitle() {
	var errors = 0;
	var updates = 0;
	feedInfo.feeds.forEach(function(feed) {
		if (feed.error) {
			errors++;
		} else if (feed.hasUnseen()) {
			updates++
		}
	});
	if (errors != badgeErrors || updates != badgeCount) {
		setButtonTitle(updates, errors);
	}
}

var badgeCount = 0;
var badgeErrors = 0;
var badgeText = "";
var animatedIconPath = "img/rssll_19x19.png";

function setButtonTitle(upds, errors) {
	if (upds < 0)
		upds = 0;
	if (errors < 0)
		errors = 0;
	var doBoing = (badgeCount < upds);
	var goingToNonZero =(badgeCount <= 0 && upds != 0);
	var goingToZero =(badgeCount > 0 && upds == 0);
	badgeCount = upds;
	badgeErrors = errors;
	if (!options.maintainBadge) {
		badgeText = "";
	} else if (goingToZero) {
		badgeText = (errors > 0 ? "!" : "");
		stopAnimateLoop();
	} else if (upds > 0) {
		badgeText = ""+upds;
		// 提示音已统一由SW的playNotificationSound()负责(见service_worker.js)，
		// 这里不再调用playBoing()，避免同一次更新前台+后台各响一次
	} else if (errors > 0) {
		badgeText = "!";
	} else {
		badgeText = "";
	}
	if (goingToNonZero || animatedIconPath != gfx.src) {
		animatedIconPath = gfx.src;
		if (badgeCount > 0)
			startAnimate();
		else
			stopAnimate();
	}

	if (options.maintainBadge) {
		var backGndClr = (errors > 0 ? [255, 165, 0, 255] : [255, 0, 0, 255]);
		chrome.action.setBadgeBackgroundColor({color: backGndClr});
	}
	// 修复：不再由前台(background.js)直接调用 chrome.action.setBadgeText。
	// 之前这里会用 popup/iframe 里算出来的 unseenFeedCount 直接覆盖角标，
	// 而 SW 后台(service_worker.js的updateBadge)也会各自独立计算并写角标，
	// 两边数据不一定同步(尤其SW刚抓到新内容、feedInfo还没来得及从缓存恢复时)，
	// 谁最后调用就覆盖谁，导致角标出现"先显示正确数字、又被错误数字覆盖回去"的抖动。
	// 现在角标只由SW的updateBadge()作为唯一权威来源写入，
	// 这里只负责在状态变化后通知SW用它自己的数据重新计算一次。
	try {
		chrome.runtime.sendMessage({ greeting: 'updateBadge' }).catch(function(){});
	} catch(e) {}

	var title = "";
	if (upds == 1) {
		title += chrome.i18n.getMessage("icon_1_feed_updated");
	} else {
		title += chrome.i18n.getMessage("icon_n_feeds_updated", [""+upds]);
	}
	if (errors == 1) {
		title += "\n" + chrome.i18n.getMessage("icon_1_feed_error");
	} else if (errors > 0 ){
		title += "\n" + chrome.i18n.getMessage("icon_n_feeds_error", [""+errors]);
	}

	chrome.action.setTitle({title: title});
}

/*
 * Another rip-off alert - this is ALL from GMail Checker Plus!
 */

var canvasContext;
var rotation = 1;
var factor = 1;
var animTimer;
var loopTimer;
var animDelay = 10;

function initGraphics() {
	canvasContext = canvas.getContext('2d', { willReadFrequently: true });
}

function startAnimate() {
  // Animation disabled
  stopAnimate();
}

function stopAnimate() {
  if(animTimer != null)
    clearInterval(animTimer);

  // Animation disabled - immediate stop
  var finishAnim = function() {
    // rotation在0.98~1.02之间认为是正立
    if (rotation > 0.98 && rotation < 1.02) {
      rotation = 1;
      factor = 1;
      try {
        canvasContext.save();
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        canvasContext.drawImage(gfx, 0, 0);
        canvasContext.restore();
        chrome.action.setIcon({imageData: canvasContext.getImageData(0, 0, canvas.width, canvas.height)});
      } catch(e) {
        chrome.action.setIcon({path: 'img/rssll_19x19.png'});
      }
    } else {
      doAnimate();
      setTimeout(finishAnim, animDelay);
    }
  };
  finishAnim();
}

function stopAnimateLoop() {
  if(loopTimer != null)
    clearTimeout(loopTimer);
    
  stopAnimate();
}

function doAnimate() {
  canvasContext.save();
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.translate(
   Math.ceil(canvas.width/2),
   Math.ceil(canvas.height/2));
  canvasContext.rotate(rotation*2*Math.PI);
  canvasContext.drawImage(gfx,
   -Math.ceil(canvas.width/2),
   -Math.ceil(canvas.height/2));
  canvasContext.restore();
  
  rotation += 0.01 * factor;
  
  if(rotation <= 0.9 && factor < 0)
    factor = 1;
  else if(rotation >= 1.1 && factor > 0)
    factor = -1;        
    
  chrome.action.setIcon({imageData:canvasContext.getImageData(0, 0,
   canvas.width,canvas.height)});
}

var nextPlay = 0;

function setPopupMuteState(state, notifyingMenuItemInfo) {
	popupStateInfo.muteSound = state;
	if (window["soundMenuItems"]) {
		for (idx in window["soundMenuItems"]) {
			var id = window["soundMenuItems"][idx];
			if (id && ((!notifyingMenuItemInfo) || (id != notifyingMenuItemInfo.menuItemId))) {
				chrome.contextMenus.update(id, {"type": "checkbox", "checked": !state},reportCtxError);
			}
		}
	}
	syncSoundOptionsToSW();
}

// 将声音选项同步到 Service Worker，确保后台刷新时也能播放提示音
function syncSoundOptionsToSW() {
	try {
		chrome.runtime.sendMessage({
			greeting: 'saveSoundOptions',
			playSound: options.playSound,
			soundFile: options.soundFile,
			muteSound: popupStateInfo.muteSound
		}).catch(function() {
			// SW 可能尚未启动，忽略错误
		});
	} catch(e) {}
}

function playBoing() {
	if (options.playSound && !popupStateInfo.muteSound) {
		var now = (new Date()).getTime();
		
		if (now > nextPlay) {
			nextPlay = now + 3000;
			try {
				document.getElementById('audioNotify').load();
				document.getElementById('audioNotify').play();			
			}
			catch(e) { console.error(e); }
		} else {
		}
	}
}

function setWorkerStrategy() {

	if (options.useWebWorker) {
		if (!rssllWebWorker) {
			rssllWebWorker = new WebWorker();
		}
		xmlHttpRequestManager = undefined;
	} else {
		if (!xmlHttpRequestManager) {
			xmlHttpRequestManager = new XMLHttpRequestManager();
		}
		if (rssllWebWorker) {
			rssllWebWorker.terminate();
			rssllWebWorker = undefined;
		}
	}
}

function logMsg(msg) {
	console.log(msg);
}

function getContextMenuItem(type, item) {
	var ctxItem = null;
	var ctxType = contextMenus[type];
	if (ctxType) {
		ctxItem = ctxType[item];
	}
	return ctxItem;
}

chrome.runtime.onMessage.addListener( function(request,sender,sendResponse)
{
    if( request.greeting === "loadedWelcomePage" )
    {
        chrome.action.setPopup({"popup": "popup.html"});
    }
    // MV3: 接收service worker的alarm消息，触发feed自动刷新
    if (request.greeting === "alarmUpdateFeeds") {
        autoUpdateFeeds();
        sendResponse({status: 'ok'});
    }
});