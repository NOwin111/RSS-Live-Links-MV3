var contextMenuDefs;
function getMenuDefs() {
	if (!contextMenuDefs) {
		contextMenuDefs = {
			"ctxItemLink": {
				"ctxItemOpen": {
					"definition": {
						"type": "normal",
						"title": "Open item",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/item/*/*"]
					}
				},
				"ctxItemMarkRead": {
					"definition": {
						"type": "normal",
						"title": "Mark item read",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/item/*/*"]
					}
				},
				"ctxItemMarkUnread": {
					"definition": {
						"type": "normal",
						"title": "Mark item unread",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/item/*/*"]
					}
				},
			},
			"ctxFeedLink": {
				"ctxFeedReload": {
					"definition": {
						"type": "normal",
						"title": "Reload feed",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/feed/*"]
					}
				},
				"ctxFeedHome": {
					"definition": {
						"type": "normal",
						"title": "Open feed home page",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/feed/*"]
					}
				},
				"_separator1": {
					"definition": {
						"type": "separator",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/feed/*"]
					}
				},
				"ctxFeedOpenUnseen": {
					"definition": {
						"type": "normal",
						"title": "Open all unseen items",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/feed/*"]
					}
				},
				"ctxFeedOpenUnread": {
					"definition": {
						"type": "normal",
						"title": "Open all unread items",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/feed/*"]
					}
				},
				"ctxFeedOpenAll": {
					"definition": {
						"type": "normal",
						"title": "Open all items",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/feed/*"]
					}
				},
				"_separator2": {
					"definition": {
						"type": "separator",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/feed/*"]
					}
				},
				"ctxFeedMarkSeen": {
					"definition": {
						"type": "normal",
						"title": "Mark feed seen",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/feed/*"]
					}
				},
				"ctxFeedMarkRead": {
					"definition": {
						"type": "normal",
						"title": "Mark feed read",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/feed/*"]
					}
				}
			},
			"ctxGroupLink": {
				"ctxGroupReload": {
					"definition": {
						"type": "normal",
						"title": "Reload group",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/group/*"]
					}
				},
				"_separator2": {
					"definition": {
						"type": "separator",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/group/*"]
					}
				},
				"ctxGroupOpenUnseen": {
					"definition": {
						"type": "normal",
						"title": "Open all unseen items",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/group/*"]
					}
				},
				"ctxGroupOpenUnread": {
					"definition": {
						"type": "normal",
						"title": "Open all unread items",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/group/*"]
					}
				},
				"_separator1": {
					"definition": {
						"type": "separator",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/group/*"]
					}
				},
				"ctxGroupMarkSeen": {
					"definition": {
						"type": "normal",
						"title": "Mark group seen",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/group/*"]
					}
				},
				"ctxGroupMarkRead": {
					"definition": {
						"type": "normal",
						"title": "Mark group read",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/group/*"]
					}
				}
			},
			"ctxToolActions": {
				"ctxOpenAllUnseenItems": {
					"definition": {
						"type": "normal",
						"title": "Open all unseen items",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/tool/read"]
					}
				},
				"ctxOpenAllUnreadItems": {
					"definition": {
						"type": "normal",
						"title": "Open all unread items",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/tool/read"]
					}
				},
				"ctxMarkAllFeedsSeen": {
					"definition": {
						"type": "normal",
						"title": "Mark all feeds as seen",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/tool/mark"]
					}
				},
				"ctxMarkAllFeedsRead": {
					"definition": {
						"type": "normal",
						"title": "Mark all feeds as read",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/tool/mark"]
					}
				}
			},
			"ctxPageActions": {
				"ctxReloadAllFeeds": {
					"definition": {
						"type": "normal",
						"title": "Reload all feeds",
						"contexts": ["page"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
					}
				},
				"_separator1": {
					"definition": {
						"type": "separator",
						"contexts": ["page"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
					}
				},
				"ctxOpenAllUnseenItems": {
					"definition": {
						"type": "normal",
						"title": "Open all unseen items",
						"contexts": ["page"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
					}
				},
				"ctxOpenAllUnreadItems": {
					"definition": {
						"type": "normal",
						"title": "Open all unread items",
						"contexts": ["page"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
					}
				},
				"_separator2": {
					"definition": {
						"type": "separator",
						"contexts": ["page"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
					}
				},
				"ctxMarkAllFeedsSeen": {
					"definition": {
						"type": "normal",
						"title": "Mark all feeds as seen",
						"contexts": ["page"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
					}
				},
				"ctxMarkAllFeedsRead": {
					"definition": {
						"type": "normal",
						"title": "Mark all feeds as read",
						"contexts": ["page"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
					}
				},
				"_separator3": {
					"definition": {
						"type": "separator",
						"contexts": ["page"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
					}
				},
				"ctxSoundNotifications": {
					"group": "soundMenuItems",
					"definition": {
						"type": "checkbox",
						"title": "Sound notifications",
						"checked": true,
						"enabled": options.playSound,
						"contexts": ["page"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
					}
				},
				"_separator4": {
					"definition": {
						"type": "separator",
						"contexts": ["page"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
					}
				},
				"ctxOpenOptionsPage": {
					"definition": {
						"type": "normal",
						"title": "Options",
						"contexts": ["page"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
					}
				},
				"ctxOpenAboutPage": {
					"definition": {
						"type": "normal",
						"title": "About RSS Live Links",
						"contexts": ["page"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
					}
				}
			},
			"ctxGlobalActions": {
				"_separator1": {
					"definition": {
						"type": "separator",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/feed/*","chrome://rssll/item/*", "chrome://rssll/group/*"]
					}
				},
				"_globalActionMenu": {
					"definition": {
						"type": "normal",
						"title": "Global actions",
						"contexts": ["link"],
						"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
						"targetUrlPatterns": ["chrome://rssll/feed/*","chrome://rssll/item/*", "chrome://rssll/group/*"]
					},
					"subItems": {
						"ctxReloadAllFeeds": {
							"definition": {
								"type": "normal",
								"title": "Reload all feeds",
								"contexts": ["all"],
								"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
							}
						},
						"_separator1": {
							"definition": {
								"type": "separator",
								"contexts": ["all"],
								"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
							}
						},
						"ctxOpenAllUnseenItems": {
							"definition": {
								"type": "normal",
								"title": "Open all unseen items",
								"contexts": ["all"],
								"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
							}
						},
						"ctxOpenAllUnreadItems": {
							"definition": {
								"type": "normal",
								"title": "Open all unread items",
								"contexts": ["all"],
								"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
							}
						},
						"_separator2": {
							"definition": {
								"type": "separator",
								"contexts": ["all"],
								"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
							}
						},
						"ctxMarkAllFeedsSeen": {
							"definition": {
								"type": "normal",
								"title": "Mark all feeds as seen",
								"contexts": ["all"],
								"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
							}
						},
						"ctxMarkAllFeedsRead": {
							"definition": {
								"type": "normal",
								"title": "Mark all feeds as read",
								"contexts": ["all"],
								"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
							}
						},
						"_separator3": {
							"definition": {
								"type": "separator",
								"contexts": ["all"],
								"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
								"targetUrlPatterns": ["chrome://rssll/*"]
							}
						},
						"ctxSoundNotifications": {
							"group": "soundMenuItems",
							"definition": {
								"type": "checkbox",
								"title": "Sound notifications",
								"checked": true,
								"enabled": options.playSound,
								"contexts": ["all"],
								"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
								"targetUrlPatterns": ["chrome://rssll/*"]
							}
						},
						"_separator4": {
							"definition": {
								"type": "separator",
								"contexts": ["all"],
								"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
								"targetUrlPatterns": ["chrome://rssll/*"]
							}
						},
						"ctxOpenOptionsPage": {
							"definition": {
								"type": "normal",
								"title": "Options",
								"contexts": ["all"],
								"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
								"targetUrlPatterns": ["chrome://rssll/*"]
							}
						},
						"ctxOpenAboutPage": {
							"definition": {
								"type": "normal",
								"title": "About RSS Live Links",
								"contexts": ["all"],
								"documentUrlPatterns": [chrome.runtime.getURL("popup.html")],
								"targetUrlPatterns": ["chrome://rssll/*"]
							}
						}
					}
				}
			}
		};
	}
	return contextMenuDefs;
}
var contextMenus = {};

function reportCtxError() {
	var rte = chrome.runtime.lastError;
	if (rte) {
		logMsg("Menu item creation error: " + rte.message);
	}
}

function initContextMenus() {

	chrome.contextMenus.removeAll(function() {
		contextMenus = {};
	});

	var myMenuDefs = getMenuDefs();

	for (var ctxTypeName in myMenuDefs) {
		var ctxType = myMenuDefs[ctxTypeName];
		for (ctxItemName in ctxType) {
			createCtxMenuItem(ctxTypeName, ctxItemName, ctxType[ctxItemName]);
		}
	}
}

function createCtxMenuItem(ctxItemIdPrefix, ctxItemId, ctxItem, parentId) {
	var itemDef = ctxItem.definition;
	var fullId = "" + ctxItemIdPrefix + "/" + ctxItemId;
	itemDef.id = fullId;
	if (parentId) {
		itemDef.parentId = parentId;
	}
	var returnedId = chrome.contextMenus.create(itemDef, reportCtxError);
	if (ctxItemId.substr(0,1) != "_") {
		contextMenus[fullId] = returnedId;
	}

	if (ctxItem.group) {
		var groupName = ctxItem.group;
		if( !window[groupName]) {
			window[groupName] = [];
		}
		window[groupName].push(fullId);
	}

	var subItems = ctxItem.subItems;
	if (subItems) {
		for (ctxItemName in subItems) {
			createCtxMenuItem(fullId, ctxItemName, subItems[ctxItemName], fullId);
		}
	}
}