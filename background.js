chrome.browserAction.onClicked.addListener(function () {
	chrome.tabs.create({url:"http://miped.ru/f"});
});