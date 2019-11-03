//This is extension script

replaceAds.onclick = function(element) {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      console.log("TAB NAME "+tabs[0].title);
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: "replaceAds", replace: true }, function(response) {
          console.log("RESPONSE INCOMING "+response.farewell);
        });

      });

    });
};

/*
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });
*/
