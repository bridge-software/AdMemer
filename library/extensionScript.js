

console.log("\nThis is extensionScript");

function initListeners (){


    //make this a switch button,if user wants addblock true else false
    chrome.storage.sync.set({switchKey: false}, function() {
        console.log('Value is set to ' + false);
      });

    chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
            
            console.log("Sender Tab "+ sender.tab);
            console.log("Incoming  = "+request.check);
            
            //this process must be done in some statements
            sendResponse( {result: true});
            
        })
}

//self reminder, there might be some more switches like: adult memes, horror memes, explicit content memes, etc 

initListeners();

