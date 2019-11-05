
//Rear end of the backend
//We must do connection and image gatherings here
//Also, if we need to communicate with other blockers, we must do it here. 


const HttpClientURL = chrome.runtime.getURL("/utilities/HttpClient.js");


//user decision to block ads
chrome.storage.sync.set({switchKey: true}, function() {
  console.log('Value is set to ' + true);
  
  
  
  
  
  
  
});

async function getMaMeme(){
  const HttpClientObj = await import(HttpClientURL);
  
  
  HttpClientObj.httpClientGet('https://meme-api.herokuapp.com/gimme', function(response) {
  console.log("GOT THE MEME");
  console.log("THE MEME URL : " + JSON.parse(response).url);
  
  chrome.runtime.sendMessage({giveMeme: true,
                              memeLink: JSON.parse(response).url},function (){
                                console.log("SENT MEME")
                              })
})

}

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
 
    
    getMaMeme();
    console.log("get ma meme");
    
  
})


chrome.runtime.onConnect.addListener(port => {
  console.log('connected ', port);

  if (port.name === 'hi') {
    port.onMessage.addListener(
      (request, sender, sendResponse) => {
          
          // console.log("Sender Tab "+ sender.tab);
          // console.log("Incoming  = "+request.check);
          if (request.giveMeme) {
            console.log("RECEIVED MEME " + request.memeLink)
            chrome.runtime.sendMessage({giveMeme: false,
              memeLink: JSON.parse(response).url})
          }
          //this process must be done in some statements
         sendResponse( {result: true});
          
      })
  }
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