

/*
FAILED DUE TO;
You can't pass functions through the Message Passing API because it uses serialized JSON as the data interchange format, which doesn't support functions as a basic type. 
Ideally, you would already have the function available in the context upon which you need it (i.e. background/event page, popup page, etc.) but,
in a case where you need to pass a function from one part of your extension to another,
you would need to use JSON.stringify to serialize the function into a JSON string and, 
at the other end, use JSON.parse to deserialize the JSON string back into the original function, upon which you can then utilize it.Also html elements are not serializable so
FUCK THIS!
*/
function tester(){
    let srcNodeList = document.querySelectorAll('[src],[href]');
    console.log("\n\n\nsrcNodeList\n\n\n");
    console.log(srcNodeList);
    let srcAndHrefJSON = []//JSON.stringify(srcNodeList);


    for (let i = 0; i < srcNodeList.length; ++i) {
        let item = srcNodeList[i];
        console.log(item);

          if(item.getAttribute('src') != undefined){
              console.log("FOUND THAT TAG BEFORE BLOCK (SRC)");
              
              srcAndHrefJSON.push(item);
          }
          else if(item.getAttribute('href') != undefined ){
              console.log("FOUND THAT TAG BEFORE BLOCK (HREF)");
              srcAndHrefJSON.push(item);
          }
          if (i == srcNodeList.length-1)
          {
              console.log(srcAndHrefJSON);
              chrome.runtime.sendMessage("pmdmppononicklapakdodkpfjadohfmg",{tagArray: document.links }, function(response) {
                  console.log("response.result");
                  console.log(response.result);
              });
          } 
      }
}

//tester();




