//This is background script for extension


//main listener for extension
chrome.runtime.onInstalled.addListener(function(  ) {
    //extension storage syncher (sets color green to extension storage)
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log("The color is green.");      
    });
    
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


/*

//gets background html (useles why do we need backpage html pfff)
chrome.runtime.getBackgroundPage(function (backPage){
  
  chrome.storage.sync.set({backPage:  backPage.document.all[0].outerHTML}, function() {
    console.log("page "+backPage);      
  });
});

*/


