


//This is content script
'use strict';
const adRemoverURL = chrome.runtime.getURL("/adDetectFunction.js");


//Listens message events, When changeColor command comes changes the color.(wow genius)
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {

    console.log("GREETINGs INCOMING = "+request.command);
    //self trigger promise
    (async () => {
      const adReplacer = await import(adRemoverURL);
      adReplacer.removeAds();
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