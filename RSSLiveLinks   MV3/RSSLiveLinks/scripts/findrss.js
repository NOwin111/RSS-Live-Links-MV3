function findRSSLinks() {
	var links =[]; 
	linkEls = document.getElementsByTagName('link');
	var altTitle;
	var altTitleCount = 0;
	if (linkEls.length > 0) {
		var titleEl = document.getElementsByTagName('title')[0];
		if (titleEl) {
			altTitle = titleEl.innerText;
		}
	}

	for (var i =0; i<linkEls.length; ++i){
		var link = linkEls[i]; 
		if ((link.type == 'application/rss+xml' || link.type == 'application/atom+xml') && link.href) {
			var myTitle = link.title;
			if (!myTitle) {
				myTitle = altTitle;
				if (myTitle && (altTitleCount > 0) ) {
					myTitle += (altTitleCount+1);
				}
				altTitleCount++;
			}
			if (myTitle) {
				links.push({name: myTitle, url: link.href});
			}
		}
	}
	if (links.length > 0) {
		chrome.runtime.sendMessage({type: 'RSS_LINKS', links: links});
	}
} 

findRSSLinks();
