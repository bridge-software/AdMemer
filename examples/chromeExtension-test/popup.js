//This is extension script


//button (not benjamin one)
let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
  });


changeColor.onclick = function(element) {

    let colorVal = element.target.value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      console.log("TAB NAME "+tabs[0].title);
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        //Sending a message to contentscript as event trigger
        //This message should be a JSON-ifiable object.
        chrome.tabs.sendMessage(tabs[0].id, {command: "changeColor", color: colorVal }, function(response) {
          colorVal
          console.log("RESPONSE INCOMING "+response.farewell);
        });

        /*chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello contentScript im extension."}, function(response) {
          console.log("RESPONSE INCOMING "+response.farewell);
        });*/

      });

      /*
      //we are using "activeTab" here  to allow the extension temporary access to the "tabs" API
      //tabs = Use the chrome.tabs API to interact with the browser's tab system. You can use this API to create, modify, and rearrange tabs in the browser.
      //we need .tabs.executeScript to Injects JavaScript code into a page.
      chrome.tabs.executeScript(
            tabs[0].id,
            {code: 'document.body.style.backgroundColor = "' + colorVal + '";'}
        );
      */

    });
};

//listens a message/event from content script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });
