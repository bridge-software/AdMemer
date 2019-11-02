// This file is a guide to coding standarts for JAVASCRIPT

//LANGUAGE

//Everything must be in english.
//Even if you have a proverb, translate it to english and than write it.!


//COMMENTS : 

//Title for a section must be all captions like above

//Every function must have explanatory comment like

/*
What does the function do?
Good: Handles a click on X element.
Bad: Included for back-compat for X element.
*/

//And also generic comment for function like this example below

/**
 * Description here ...
 * 
 * You can observe this method by hovering over function name
 * 
 * This method must be used for every function
 * 
 * Also this method prevents some interpretation bugs for javascript, like static-class 
 * 
 * @param {number} arg1 this is a integer
 * @param {String} arg2 this is string
 * @param {Array}  arg3 this is a array
 * @returns {number} returning var comment here.Also type indicates the type of func 
 */
function foo (arg1,arg2,arg3) {
    
    //does something then returns
    return implementedArg;

}

//If you have a reusable function but also you dont want that function on your runtime atm 
//take it in comment like;

/*
//This does bla bla
function reusable (){
    //stuff stuff
}
*/

//If you have something important to say for after reader, us this;
//  !!!!! WARNING !!!!!


//VARIABLES

//Example usage of variables and naming order

var color;   //DONT USE IT (old)
let color;   //local variable
const color; //constant variable

let thisIsAVeryLongVariable;    //BAD
let longVariable;               //GOOD

//Always start with lower case and go with capital for first at every other word
//divide long variable names with underline

let tempColor;
let jsonArray_toParse;

//Global variables

const MAPPING_NUMBER;
const AUTHENTICATION_STATE_USER;


//FUNCTIONS

//Example naming for functions (might be little longer than variable names)

function connectionEvent () {}
function httpRequestForPost () {}

//Name meaning example
// BAD
function name(firstName, lastName) {
    return `${firstName} ${lastName}`;
}
// GOOD
function getName(firstName, lastName) {
    return `${firstName} ${lastName}`;
}

//Arrow functions (use these mostly on callbacks)

const createPattern = (arg1,arg2) => {
    //stuff stuff
}

//Or predefined
const preArrow;

//stuff stuff
preArrow = (arg1,arg2) =>{
    //does stuff
}

//Function parameters must be meaningful
function setHeight (heightHolder) {
    let height = heightHolder;
}


//CLASS

//Class naming starts with capitol letter then goes with capitol letter for every new word

class SoftwareDeveloper {
    constructor(firstName, lastName) {
      this.firstName = firstName;
      this.lastName = lastName;
    }
  }
let me = new SoftwareDeveloper('Berkay', 'KOÇAK');

//There is multiple ways to define a class but above one is most generic one.
//In below we can see diffrent ways to define a class

//unnamed
let rectangle = class {
    constructor(height, width) {
      this.height = height;
      this.width = width;
    }
  };

//named
let rectangle = class Rectangle2 {
    constructor(height, width) {
      this.height = height;
      this.width = width;
    }
  };

//We can define a single object
const pastor = { name:"Branson",position:"free",location:"USA",previousState:"captive"};

//We can even write methods to this object solely
const shepperd = { 
    name:"Branson",
    position:"free",
    location:"USA",
    previousState:"captive",

    //Below statements was a case of 2015 and it changes nearly every year.So we still do stuff like below to avoid renewing the code every year!
    getName(){

        //return this.name; //BAD.calling via this here creates variable overlapping of lexicality on c level.So it returns the pointer.
        return name;        //GOOD
    },
    setName(nameHolder)
    {
        name = nameHolder
    },

    // !!!!! WARNING !!!!!
    //Dont use arrow functions here as;
    setPosition = (positionHolder) =>
    {
        position = positionHolder;
    }
    //Arrow functions cannot be used to write object methods because, 
    //since arrow functions close over the "this" of the lexically enclosing context, 
    //the "this" within the arrow is the one that was current where you defined the object.
     

};

