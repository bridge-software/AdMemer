chrome.runtime.onInstalled.addListener(function(  ) {

    
    //Page actions represent actions that can be taken on the current page, but that aren't applicable to all pages. 
    //Page actions appear grayed out when inactive.
    //So The Declarative Content API allows you to show your extension's page action depending on the URL of a web page and the CSS selectors its content matches, 
    //without needing to take a host permission or inject a content script. 
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            //pageUrl: {hostEquals: 'developer.chrome.com'},
          })
          ],
              actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
      });
  
});