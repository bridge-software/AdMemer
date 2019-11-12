
/**
 * Slices the links via "https://",".com" and "/"
 * @param {String} link 
 * @returns {String} sliced link
 */
const linkSlicer = (link) =>{
    let tempSTR = "";
    let tempStartIndex = 0; 
    let tempEndIndex = 0; 
    let tempSTR_holder = "";

    tempStartIndex = link.indexOf("https://") + 8;//!!!!! WARNING !!!!! we also need http
    tempEndIndex = link.indexOf(".com") + 4;
    if(tempEndIndex < 5)
    {
        tempSTR_holder = link.slice(tempStartIndex);
        console.log("tempSTR_holder "+tempSTR_holder);
        
        tempEndIndex = tempSTR_holder.indexOf("/") + tempStartIndex;
        console.log("tempEndIndex "+tempEndIndex);
        
    }
    tempSTR = link.slice(tempStartIndex,tempEndIndex);
    console.log("\nlink = "+link+"  sliced link "+tempSTR);
    tempStartIndex = 0; 
    tempEndIndex = 0; 
    tempSTR_holder = "";
    return tempSTR;
}

export { linkSlicer }