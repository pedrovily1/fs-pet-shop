#!/usr/bin/env node
//hashbang indicating the interpreter to be used to execute the script
// In this case we are using node.js
 

const fs = require('fs'); //Import the fs Module to work with the file system
const path = require('path'); //Import the path module to handle file paths

const command = process.argv[2]; //Get the command from command-line arguments
const petsPath = path.join(__dirname, 'pets.json'); //Construct the path to the pets.json file __dirname is the current directory we are in
// and pets.json is the JSON file.

if (!command) { //If no command is provided then ->
  console.error('Usage: node pets.js [read | create | update | destroy]');//We will log an error message using console.error indicating the correct usage
  process.exit(1); // Lets exit the process with a non-zero exit code "1" to indicate a failure
}

function readPets(index) { // Lets define the Function that will read the Pets.json data and display it on the terminal

  const pets = JSON.parse(fs.readFileSync(petsPath, 'utf8')); // Declaring a variable pets that will read and parse the contents of Pets.json file
  
  if (index === undefined) { // "If no index is provided to the terminal"
    console.log(pets); // I want to just log the entire "Pets" array
  } else if (index < 0 || index >= pets.length) { //This is saying if the index inputed doesnt exist or is "Out of bounds"
    console.error('Usage: node pets.js read INDEX');// I want the terminal to log an error message using console.error (or console.log doesnt really matter)
    process.exit(1); //And again I want to exit this process using a non-zero exit code to indicate a failure of usage
  } else { 
    console.log(pets[index]); // Else i want to display the pet object at the index that the user specified
  }
}

function writePetsToFile(pets) { // We need to define a function to write pets to the pets file or "save" to the file
  fs.writeFileSync(petsPath, JSON.stringify(pets, null, 2), 'utf8'); // Write the pets array to the pets.json
}


function createPet(age, kind, name) { // Declare the function to create a new Pet
  if (!age || !kind || !name) { // If any of the required Parameters are missing 
    console.error('Usage: node pets.js create AGE KIND NAME'); // I want to display an error message indicating the correct usage to our user
    process.exit(1); // And once again exit the process with a code indicating failure
  }

  const pets = JSON.parse(fs.readFileSync(petsPath, 'utf8')); // declaring a variable called "pets" that Reads and parses the contents of pets.json file 
  const pet = { age: parseInt(age), kind, name }; // And here I created a new pet object with the age, kind and name
  pets.push(pet); // And I want to push the new pet to our pets array.

  writePetsToFile(pets); // And before we close our function I want to "save" or write the updated pets array to the file.

  console.log(pet); // And display the newly created pet to our user.
}

function updatePet(index, age, kind, name) { //Define the function to update a pet
  if (!index || isNaN(parseInt(index)) || !age || !kind || !name) { // Again same thing if any parameter is missing
    console.error('Usage: node pets.js update INDEX AGE KIND NAME'); // Log an error message indicating correct usage
    process.exit(1); // exit the process
  }

  const pets = JSON.parse(fs.readFileSync(petsPath, 'utf8')); // Read and parse the contents of pets.json

 if (index < 0 || index >= pets.length) { //Again if the provided index is out of bounds
    console.error('Usage: node pets.js update INDEX AGE KIND NAME'); // return the error message
    process.exit(1); // exit the process
  }

  const updatedPet = { age: parseInt(age), kind, name }; // updatedPet object 
  pets[index] = updatedPet; // Replace the pet at the specified index with our updated pet that we just created

  writePetsToFile(pets); // Write the updated pets array to the file

  console.log(updatedPet); // And then we want to log the object to the terminal
}

function destroyPet(index) { // Declare a destroyPet function which takes an index as a parameter
  if (!index || isNaN(parseInt(index))) { //If the index is missing or its not a number
    console.error('Usage: node pets.js destroy INDEX'); //I log a error message reminding the user of the correct usage of this function
    process.exit(1); //Exit the process
  }

  const pets = JSON.parse(fs.readFileSync(petsPath, 'utf8')); // Again I want to read and parse the contents of pets.json

  if (index < 0 || index >= pets.length) { // if the provided index by the user is out of bounds
    console.error('Usage: node pets.js destroy INDEX'); // Another error message will be displayed
    process.exit(1); // Exit the process with code 1
  }

  const removedPet = pets.splice(index, 1)[0]; // Declare a removedPet at the specified index from the pets array

  writePetsToFile(pets); // Write the updated pets array to the file

  console.log(removedPet); // Log our removed pet object
}

switch (command) { // Handle the command based on its value
  case 'read': { // If the value of command is read
    const readIndex = parseInt(process.argv[3]); // get the index argument for the command read
    if (isNaN(readIndex)){ //if the readIndex is not a number, for example just "read" with no index after
      readPets(); //I want to just run the readPets function to display all pets
    } else { // otherwise 
      readPets(readIndex) //Read the specified index
     }
    break;
  }
  case 'create': { //If the command is "create"
    const createAge = process.argv[3]; //Get the age argument for the create command
    const createKind = process.argv[4]; //Get the king argument
    const createName = process.argv[5];// get the name argument
    createPet(createAge, createKind, createName); //Call the createPet function with age,kind and name arguments
    break;
  }
  case 'update': { //If the command given is "update"
    const updateIndex = process.argv[3]; // Get the index that you want to update
    const updateAge = process.argv[4]; // Get the age
    const updateKind = process.argv[5]; // Get the Kind
    const updateName = process.argv[6]; // And then the name
    updatePet(updateIndex, updateAge, updateKind, updateName); //Call the upatePet function with the order of index,age,kind and name 
    break;
  }
  case 'destroy': { // If the command is "destroy"
    const destroyIndex = process.argv[3];// Get the index that you want to destroy
    destroyPet(destroyIndex); // call the destroyPet function with the index argument
    break;
  }
  default:
    console.error('Usage: node pets.js [read | create | update | destroy]'); //Log an error message for any command not given on this switch statement
    process.exit(1); // exit the process with code 1 to indicate failure
}
  