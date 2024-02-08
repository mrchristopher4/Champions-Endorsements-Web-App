//Firebase Intialization of Native Source Methods
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

//Find & Create/Declare all inherent HTML Elements needing to be retrieved 
//or appended to in the future lines below
const inputEl = document.getElementById("input-field");
const endorseListEl = document.getElementById("endorsement-list");
const addButtonEl = document.getElementById("add-button");

//Create/Declare a constant variable to initialize/pull the initial source 
//Firebase database origin Warning - contains the arrays of key:value pairs 
//within the larger overall array that is housed within the origin Firebase 
//database more post-processing involved...
//Reference: https://firebase.google.com/docs/database/web/start#web-modular-api
const coreDatabaseCall = {
    databaseURL: "https://realtime-database-206c3-default-rtdb.firebaseio.com/"
}
console.log(coreDatabaseCall);

//
const appStarted = initializeApp(coreDatabaseCall);
console.log(appStarted);

//
//Reference: https://modularfirebase.web.app/reference/database.getdatabase
const database = getDatabase(appStarted);
console.log(database);

//Find & Create/Declare all inherent HTML Element containing Unordered List
//to be appended to w/ database value of key:value pairs in array
const endorsementListInDB = ref(database, "endorsement-list");
console.log(endorsementListInDB);

let fromEl = document.getElementById("from-field");
let toEl = document.getElementById("to-field");

//The below local function is the 'click' call function to execute grabbing the
//input field's value from the User and adding it to the existing database
//before clearing the User used input field to prep it for the next input value
addButtonEl.addEventListener('click', function() {

        //Create/Declare a variable representing/storing the value of the input field
        let inputValue = inputEl.value;
        let fromValue = fromEl.value;
        let toValue = toEl.value;
        
        const arrayInputObject = { 
             endorsement: inputValue,
             from: fromValue,
             to: toValue
        }

            //Target the retrieved reference branch within the database
            push(endorsementListInDB, arrayInputObject);          

            //Clear the User's entered input field value after they've clicked the button
            //to active the function lines above this line that take & enter their value
            //so that we can prepare the input field anew / blank for the next value to be 
            //entered
            clearInputEl();
})



//Reference: https://modularfirebase.web.app/reference/database.onvalue
onValue(endorsementListInDB, function(snapshot) {
    console.log(snapshot);
    if (snapshot.exists()) {
        
        //Create/Declare the variable to hold the live database representation
        //'Snapshot' and turn it into a manipulatable object for further down
        //using '.val' to grab the "key:value" pairs of the mother snapshot
        //array to get/assemble all the "key:value" pairs that are values of
        //that mother snapshot array into another array -> The one we've created here
        let endorsementDBItemsArray = Object.entries(snapshot.val());
        console.log(endorsementDBItemsArray);

        //Clear all the old database <li> append entries from before the database was
        //changed, that would prompt/cause the 'snapshot' live database connection
        //to re-spit the entire new database w/ the changed values so it does not
        //display both the old dataset (before any changes) and the new dataset 
        //(after any changes)
        clearEndorseListEl();

        //Iterating FOR Loop aiming to grab the keys & value for each stored 
        //database array line item
        for (let i=0; i < endorsementDBItemsArray.length; i++) {
            
            //
            let currentItem = endorsementDBItemsArray[i];
            console.log(currentItem);

            //
            //let currentItemKey = currentItem[0];
            //console.log(currentItemKey);

            //
            //let currentItemValue = endorsementDBItemsArray[1];
            //console.log(currentItemValue);
            
            //Feed the current iterated mother array position line in the
            //Unique [ ID: [key:value]pair ] line position into the Append 
            //Function to be separated out
            appendCurrentItemValueToEndorseListEl(currentItem);
        } 
    } else {
        endorseListEl.innerHTML = "Nothing is here...yet";
    }

})



//Clear the User Input Field
function clearInputEl() {
    inputEl.value ="";
}



//Clear the Endorsement List which is the unordered <ul> HTML element holding/displaying
//all the database grabbed values which represent the endorsements
function clearEndorseListEl() {
    endorseListEl.innerHTML = "";
}



//Take in the key:value pairs, create & append a new <li> element 
//with the item's value to <ul>
//Optional commented-out section of code included to be optionally activated 
//to add easier ability to remove database entries upon click if desired 
function appendCurrentItemValueToEndorseListEl(item) {
    //console.log(item);
    let itemKey = item[0];
    console.log(itemKey);



    let itemValue = Object.values(item[1]);
    console.log(item[1]);
    console.log(itemValue);

    //THIS IS THE CHOP-SHOP WAY OF DOING IT -> UNTESTED YET
    //We are passing in the value into the database but its not being rendered
    //CAUTION NOTE - BUT YEA.....Don't use this method of innerHTML
    //text literals because it requires many many extra lines of code to 
    //make a dedicated separate delete function to call w/ onclick="" that would be added
    //endorseListEl.innerHTML += `<li>${itemValue}</li>`;


        //CLEAN WAY BELOW
        let createNewListElement = document.createElement("li");
        createNewListElement.innerHTML = `<p class="DBItemSpacing">From: ${itemValue[1]}</p>${itemValue[0]}<p class="DBItemSpacing heartunique">To: ${itemValue[2]}</p><div class="heart">♥</div>`;

        let fromValue = fromEl.value;
        let toValue = toEl.value;


        //Alternate Method: createNewListElement.append("${itemValue}");
        //Source: https://developer.mozilla.org/en-US/docs/Web/API/Element/append

        //NOTE - We did not activate the lines below for easier database removal 
        //to each <li> element (unless we un-comment out the lines below)
        createNewListElement.addEventListener('click', function() {
            let clickedItemsLocationInDB = ref(database, `endorsement-list/${itemKey}`);
            remove(clickedItemsLocationInDB);
        });

        //Add the created <li> element w/ itemValue (the endorsement) to the <ul>
        endorseListEl.append(createNewListElement);
}
