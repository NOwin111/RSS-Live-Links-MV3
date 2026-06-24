var tabFeeds = {};

/*
 * feed URL -> {feed: feed object, tabCount: number of tabs publishing it}
 */
var tabFeedsByURL = {};

function tabUpdated(tabId, info, tab) {
	if (info.status == "complete") {
		tabRemoved(tabId);
		addTabDetails(tab);
	}
}

function tabRemoved(tabId) {
	var closedId = "tab_" + tabId;
	var closedTabFeeds = tabFeeds[closedId];
	if (closedTabFeeds)	{
		for (var i = 0; i < closedTabFeeds.length; ++i) {
			var feed = closedTabFeeds[i];
			var tabsForURL = tabFeedsByURL[feed.url];
			tabsForURL.tabCount--;
			if (tabsForURL.tabCount <= 0) {
				delete(tabFeedsByURL[feed.url]);
			}
		}
		delete(tabFeeds[closedId]);
	}
	checkBrowserIcon();
}

var unsubscribedIcon = false;

function checkBrowserIcon(force) {
	var needUpdate = force;
	if (options.useAvailableIcon) {
		var unsubscribed = false;
		for (url in tabFeedsByURL) {
			if (feedInfo.feedsByURL[url] == undefined) {
				unsubscribed = true;
			}
		}
		if (unsubscribed != unsubscribedIcon) {
			gfx.src = (unsubscribed ? "img/rssll_plus_rss19x19.png" : "img/rssll_19x19.png");
			needUpdate = true;
			unsubscribedIcon = unsubscribed;
		}
	} else {
		if (gfx.src != "img/rssll_19x19.png") {
			gfx.src = "img/rssll_19x19.png";
			needUpdate = true;
		}
	}
	if (needUpdate) {
		setButtonTitle(badgeCount, badgeErrors);
	}
}

chrome.tabs.onUpdated.addListener(tabUpdated);
chrome.tabs.onRemoved.addListener(tabRemoved);

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) 
	{
		if (!sender.tab) {
			return;
		}
		if (!request || request.type !== 'RSS_LINKS') {
			return;
		}
		var tabId = sender.tab.id;
		var links = request.links;
		if (!links) {
			return;
		}
		var modLinks = [];
		for (var i = 0; i < links.length; ++i) {
			var link = links[i];
			if (!(link.name===undefined || link.url===undefined)) {
				if (sender.tab.favIconUrl) {
					link.faviconURL = sender.tab.favIconUrl;
				}
				modLinks.push(link);
				var tabsForURL = tabFeedsByURL[link.url];
				if (!tabsForURL) {
					tabFeedsByURL[link.url] = {feed: link, tabCount: 1};
				} else {
					tabsForURL.tabCount++;
				}
			}
		}
		if (modLinks.length > 0) {
			tabFeeds["tab_" + tabId] = modLinks;   
		}
		checkBrowserIcon();
	}
); 

function addTabDetails(tab) {
	if (tab.url && (tab.url.indexOf("http://") == 0 || tab.url.indexOf("https://") == 0)) {
		getTabRSS(tab.id);
	}
}

function getTabRSS(tabId) {
	chrome.scripting.executeScript({
		target: {tabId: tabId, allFrames: true},
		files: ["scripts/findrss.js"]
	});
}

function addAllTabs(tabs) {
	for (var i = 0; i < tabs.length; ++i) {
		addTabDetails(tabs[i]);
	}       
}
