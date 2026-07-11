var backgroundPage;
function getBackgroundPageProxy() {
    var frame = document.getElementById('backgroundFrame');
    return (frame && frame.contentWindow) ? frame.contentWindow : window;
}
var opt_link = 'options.html'
var bug_link = 'https://chrome.google.com/webstore/support/hcamnijgggppihioleoenjmlnakejdph'
var rln_link = 'https://docs.google.com/View?docid=dhfscm8k_780x6nkpwgk'
var doc_link = 'https://docs.google.com/View?id=dhfscm8k_764dnw3srhd'
var xmk_link = 'https://chrome.google.com/webstore/detail/ajpgkpeckebdhofmmjfgcjjiiejpodla'
var faq_link = 'https://docs.google.com/document/d/1xkhZUUh-ezevyxEtpynfF5iUBTEJD-dGWzRaFelLuW4/edit'
var gcb_link = 'https://code.google.com/p/chromium/issues/detail?id=261140'
function init() {
	backgroundPage = getBackgroundPageProxy();
	window.addEventListener("contextmenu", function () {return false;}, false);
	rn1.addEventListener("click", function () {showUrl(rln_link, false);}, false);
	xmk.addEventListener("click", function () {showUrl(xmk_link, false);}, false);
	rn2.addEventListener("click", function () {showUrl(rln_link, false);}, false);
	rn3.addEventListener("click", function () {showUrl(rln_link, false);}, false);
	faq.addEventListener("click", function () {showUrl(faq_link, false);}, false);
	doc.addEventListener("click", function () {showUrl(doc_link, false);}, false);
	bug.addEventListener("click", function () {showUrl(bug_link, false);}, false);
	opt.addEventListener("click", function () {showUrl(opt_link, false);}, false);
	gcb.addEventListener("click", function () {showUrl(gcb_link, false);}, false);
	
	if (backgroundPage && backgroundPage.manifest) {
		rssllVersion.innerHTML = backgroundPage.manifest.version;
	} else {
		rssllVersion.innerHTML = chrome.runtime.getManifest().version;
	}
	// MV3: action.setPopup must be called from service worker
	try { chrome.runtime.sendMessage({greeting: "setPopupToPopup"}); }
	catch(e) { console.error("Failed to set popup in MV3: " + e); }
}
function showUrl(url, focus, reuse, callback) {
	if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
		chrome.tabs.create({url: url});
	} else if (backgroundPage && backgroundPage.openInTab) {
		backgroundPage.openInTab(url, false, true, false);
	}
}
window.onload = init;

chrome.runtime.sendMessage({greeting: "loadedWelcomePage"},
    function (response) {
});




