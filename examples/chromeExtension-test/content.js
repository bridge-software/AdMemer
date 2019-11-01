
//send message to extension from content script as a event trigger
/*chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
  console.log(response.farewell);
});*/

//    !!!!!! WARNING !!!!!!
//holding state as global var, try to evolve this as in "REACT"
//cuz even conctent script has a isolated world, it is still vulnerable to software bugs.
let currentColor;


//Listens message events, When changeColor command comes changes the color.(wow genius)
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {//arrow func [USE AND LEARN THIS ADDDDDDDDDNONE]
    console.log("GREETING INCOMING = "+request.command);
    
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

    if (request.command == "changeColor")
    {
      let backgroundColor = rgbToHex(document.body.style.backgroundColor);
      console.log("backgroundColor "+backgroundColor +" request.color "+ request.color);
      

      if(backgroundColor == request.color || backgroundColor == NaN || currentColor == request.color)
      {
        currentColor = "#000000"
        document.body.style.backgroundColor ="#000000";
      }
      else
      {
        currentColor = request.color;
        document.body.style.backgroundColor = request.color;
      }
      console.log("backgroundColor "+backgroundColor +" request.color "+ request.color);
      sendResponse({farewell: "Hi extension im contentScript, ur request has been granted."});
    }
    else
    {
      console.log("what is this?");
    }
  });


//listens a message/event from extension
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.greeting == "hello contentScript im extension.")
      {
        console.log("GREETING INCOMING = "+request.greeting);
        console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
        sendResponse({farewell: "Hi extension im contentScript"});
      }
    });


//jeez who uses still rgb in css.
const rgbToHex = (rgbString) => {
  
  var hex = Number(rgbString).toString(16);
  if (hex.length < 2) {
       hex = "0" + hex;
  }
  return hex;

}
    