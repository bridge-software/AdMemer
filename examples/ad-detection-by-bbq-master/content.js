//This is content script
'use strict';
const adFinderURL = chrome.runtime.getURL("/library/adFinder.js");


//self trigger promise



//Listens message events, When changeColor command comes changes the color.(wow genius)
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    console.log("GREETINGs INCOMING = "+request.command);
    (async () => {
      const adFinder = await import(adFinderURL);
      adFinder.locateAdTag();

    })();
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

    if (request.command == "replaceAds")
    {
     
      console.log("replace bool "+ request.replace);
      
      if(request.replace == true)
      {
        //find places to replace
      }
      else
      {
        console.log(" replace is false ");
      }
    
      sendResponse({farewell: "Hi extension im contentScript, ur request has been granted."});
    }
    else
    {
      console.log("what is this?");
    }
  });


    