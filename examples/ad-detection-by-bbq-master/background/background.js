//This is background script for extension


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

