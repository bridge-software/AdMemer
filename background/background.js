
//Rear end of the backend
//We must do connection and image gatherings here
//Also, if we need to communicate with other blockers, we must do it here. 

const HttpClientURL = chrome.runtime.getURL("/utilities/httpClient.js");
const linkSlicerURL = chrome.runtime.getURL("./utilities/linkSlicer.js");

let jsonOBJ;
let HttpClientObj;
let curMemes = [];

(async () => {
  HttpClientObj = await import(HttpClientURL);
  const httpCall =  await import(HttpClientURL);
  const jsonFile =  await httpCall.xhrGetFileLocal("/resources/hosts.json");
  jsonOBJ = JSON.parse(jsonFile);

  //requestBlocker(jsonOBJ);

})();

/*async function requestBlocker (){

  let slicer = await import(linkSlicerURL);
  let imgUrlToLook = "";
  console.log("INSIDE TEST ");
    chrome.webRequest.onHeadersReceived.addListener(
      function(details) {
        let url = slicer.linkSlicer(details.url);
        let searchResult = jsonOBJ.advertisementLinks.indexOf(url)
        
        if(searchResult > -1)
        {
          console.log("BLOCK GELDI FAUL DEDI ");
          imgUrlToLook = details.url
          console.log(imgUrlToLook);
        }
        return {cancel: jsonOBJ.advertisementLinks.indexOf(url)  != -1};//we can use redirect here, it works as same as our div filter.
        //redirectUrl:"https://raw.githubusercontent.com/bridge-software/AdMemer/master/resources/placeholders/adnoneplaceholder.jpg"
        //Tho redirect seems more solid since it looks wider dataset(host.json) then divfilter(adsID.json).
        //But redirecting needs very good filtering because it causes redirect blocking by the website.Because it redirects everytime the site element to a url when a blocking elemet comes.
        //and scaling images is very hard  with it!
        
        //TRY REQUEST HEADERS
        //HttpHeaders	(optional) requestHeaders	
        //Only used as a response to the onBeforeSendHeaders event. If set, the request is made with these request headers instead.

      },
      {urls: ["<all_urls>"]},//filter
      ["blocking"] //response
      );
    
let tabsGLOBAL;
   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    
    tabsGLOBAL = tabs[0].id;
    chrome.webNavigation.getAllFrames( {tabId: tabs[0].id}, function (frameArray){
      console.log("FRAMES = ");
      console.log(frameArray);
    });

    chrome.webNavigation.onCommitted.addListener(function (details){
      console.log("details = ");
      console.log(details);
      console.log("tabs = "+tabsGLOBAL);
      
      chrome.webNavigation.getFrame({tabId:tabsGLOBAL , frameId:details.frameId}, function (gotFrame){
        console.log("tabs = "+tabsGLOBAL);
        console.log("gotFrame = ");
        console.log(gotFrame);
      })
    },{TransitionQualifier: ["client_redirect"]}
    );

  });
}*/


/**
*  The function for getting memes via API.
*/
function getMaMeme(memeAmount){
  
  console.log("memeAmount " + memeAmount)
  
  HttpClientObj.httpClientGet('https://ad-memer-web-scraper.herokuapp.com/getMemes/' + memeAmount , function(response) 
  {
    console.log("GOT THE MEME RAW " + response);
    console.log("THE MEME URL : " + JSON.parse(response).memes[0]);

    curMemes = JSON.parse(response).memes
    chrome.storage.sync.set({memes:curMemes}, function(){
      console.log('Memes are saved to storage')
    })
    
    chrome.storage.sync.set({memeWidths:JSON.parse(response).width}, function(){
      console.log('MemeWidths are saved to storage' + JSON.parse(response).width)
    })

    chrome.storage.sync.set({memeHeights:JSON.parse(response).height}, function(){
      console.log('MemeHeights are saved to storage' + JSON.parse(response).height)
    })
  })
}


/**
*  Listener for content scripts requests
*/
chrome.runtime.onMessage.addListener(
   (request, sender, sendResponse) =>  {
    if(request.command === "giveMeme")
    {
      getMaMeme(request.memeAmount);
      sendResponse( {result: curMemes});
    }
    else if( request.command === "startBlocker")
    {
      //requestBlocker();
      sendResponse( {result: "blockerStarted"});
    }
    else
    {sendResponse( {result: true});}
  })
  
  
  //main listener for extension
  chrome.runtime.onInstalled.addListener(function(  ) {
    //user decision to block ads
    chrome.storage.sync.set({switchKey: true}, function() {
      console.log('Value is set to ' + true);
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({})],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  });
