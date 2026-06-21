chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install' || details.reason === 'update') {
        chrome.action.setPopup({popup: 'popup.html'});
    }
    chrome.alarms.create('feedAutoUpdate', { periodInMinutes: 1 });
});

chrome.runtime.onStartup.addListener(() => {
    chrome.alarms.create('feedAutoUpdate', { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name !== 'feedAutoUpdate') return;

    try {
        // 读取所有feed的expire信息
        const allData = await chrome.storage.local.get(null);
        const now = Date.now();
        const expiredFeeds = [];

        for (const key in allData) {
            if (key.startsWith('swExpire:')) {
                const url = key.substring('swExpire:'.length);
                const info = allData[key];
                if (info && info.expire && info.expire < now) {
                    expiredFeeds.push({ url, ...info });
                }
            }
        }

        if (expiredFeeds.length === 0) return;

        console.log('SW alarm: checking ' + expiredFeeds.length + ' expired feeds');

        // 对每个过期feed发fetch请求，只检查是否有变化
        for (const feed of expiredFeeds) {
            try {
                const response = await fetch(feed.url, {
                    method: 'GET',
                    cache: 'no-cache'
                });

                if (response.ok) {
                    const txt = await response.text();
                    // 读取上次的内容hash或txt做比较
                    const lastTxtKey = 'swLastTxt:' + feed.url;
                    const lastData = await chrome.storage.local.get(lastTxtKey);
                    const lastTxt = lastData[lastTxtKey];

                    if (txt !== lastTxt) {
                        // 内容有变化，保存新内容并设标记
                        const updateData = {};
                        updateData[lastTxtKey] = txt;
                        updateData['swHasUpdate:' + feed.url] = true;
                        await chrome.storage.local.set(updateData);
                        console.log('SW: ' + feed.name + ' has updates');
                    }

                    // 更新expire时间
                    const refreshTime = parseInt(feed.refreshTime) || 60;
                    const expireData = {};
                    expireData['swExpire:' + feed.url] = {
                        expire: now + refreshTime * 60 * 1000,
                        refreshTime: feed.refreshTime,
                        name: feed.name
                    };
                    await chrome.storage.local.set(expireData);
                }
            } catch(e) {
                console.warn('SW fetch error for ' + feed.name + ': ' + e.message);
                // 错误时5分钟后重试
                const expireData = {};
                expireData['swExpire:' + feed.url] = {
                    expire: now + 5 * 60 * 1000,
                    refreshTime: feed.refreshTime,
                    name: feed.name
                };
                await chrome.storage.local.set(expireData);
            }
        }
    } catch(e) {
        console.error('SW alarm error: ' + e);
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.greeting === 'loadedWelcomePage') {
        chrome.action.setPopup({popup: 'popup.html'});
        sendResponse({status: 'ok'});
    }

    if (message && message.greeting === 'showUpdatedPage') {
        chrome.action.setPopup({popup: 'updated.html'});
        chrome.action.openPopup();
    }

    if (message && message.greeting === 'setPopupToPopup') {
        chrome.action.setPopup({popup: 'popup.html'});
    }

    if (message && message.greeting === 'offscreenDone') {
        chrome.offscreen.closeDocument().catch(() => {});
        sendResponse({status: 'ok'});
    }

    return true;
});