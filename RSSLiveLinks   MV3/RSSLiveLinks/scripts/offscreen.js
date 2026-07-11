// offscreen.js
// 运行在 offscreen document 里，唯一职责：接收 service_worker.js 发来的
// "playSound" 消息，播放提示音，然后通知 SW 关闭这个 offscreen document。

// 通知 SW：offscreen 文档已加载完毕，可以接收消息
chrome.runtime.sendMessage({ greeting: 'offscreenReady' }).catch(function () {});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (!message || message.target !== 'offscreen') {
        return false;
    }

    if (message.type === 'playSound') {
        var audio = document.getElementById('audioNotify');
        try {
            audio.src = message.soundFile || 'sounds/boing.mp3';
            audio.currentTime = 0;

            // 关键修复：play() 的 promise 只代表"已开始播放"，不代表播放完毕。
            // 之前在这里就调用 notifyDone()，导致 SW 立刻 closeDocument()，
            // 把还没播完（甚至刚起头）的音频硬切断——这就是听不到提示音的原因。
            // 现在改为等待 'ended' 事件（真正播放完）再通知完成，并保留超时兜底。
            var finished = false;
            var finish = function () {
                if (finished) return;
                finished = true;
                audio.removeEventListener('ended', onEnded);
                audio.removeEventListener('error', onError);
                notifyDone();
            };
            var onEnded = function () { finish(); };
            var onError = function (e) {
                console.error('offscreen: audio error: ' + e);
                finish();
            };
            audio.addEventListener('ended', onEnded);
            audio.addEventListener('error', onError);

            var playPromise = audio.play();
            if (playPromise && playPromise.then) {
                playPromise.catch(function (e) {
                    console.error('offscreen: play() failed: ' + e);
                    finish();
                });
            }
            // 硬性超时兜底，避免异常情况下 offscreen 文档一直不关闭
            setTimeout(finish, 5000);
        } catch (e) {
            console.error('offscreen: error playing sound: ' + e);
            notifyDone();
        }
        sendResponse({ status: 'ok' });
        return true;
    }

    return false;
});

function notifyDone() {
    chrome.runtime.sendMessage({ greeting: 'offscreenDone' }).catch(function () {});
}