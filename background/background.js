//Rear end of the backend
//We must do connection and image gatherings here
//Also, if we need to communicate with other blockers, we must do it here. 

//user decision to block ads
chrome.storage.sync.set({switchKey: true}, function() {
  console.log('Value is set to ' + true);
});

//main listener for extension
chrome.runtime.onInstalled.addListener(function(  ) {

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({})],
          actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
      });
});

//get images from api here
//store it to extention storage on browser side