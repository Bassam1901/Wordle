// Setting Game Name 
let gameName = "WORDLE";
document.title = gameName;
document.querySelector("h1").innerHTML=gameName;
document.querySelector("footer").innerHTML=`${gameName} Game Created By Bassam Eldawy`;

// Setting Game Options
let numberOfTries = 5;
let wordLength = 5;
let currentTry = 1;
let hints =1;

// Words Manageing
let wordToGuess = "";
const words = ["henry" , "messi" , "pogba" , "treka" , "tevez" , "ahmed","salah","zidan","Essam","maged","james","walker"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");
console.log(wordToGuess);

// Manage Hints
document.querySelector(".hint span").innerHTML = hints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);



function generateInput(){
    const inputsContainer = document.querySelector(".inputs");
    // Create Main Try Div
    for (let i=1;i<= numberOfTries;i++)
    {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;

        if(i !== 1) tryDiv.classList.add("disabled-inputs");
        // Create inputs
        for (let j=1 ; j<= wordLength;j++){
            const input = document.createElement("input");
            input.type="text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlength","1");
            tryDiv.appendChild(input);
        }

        inputsContainer.appendChild(tryDiv);
    }
    // Focus on first input in first try element
    inputsContainer.children[0].children[1].focus();

    // Disable All Inputs Except First One
    const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
    inputsInDisabledDiv.forEach((input) => (input.disabled = true));

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input,index) => {
        // Convert Letters To Upper Case
        input.addEventListener("input", function(){
            this.value = this.value.toUpperCase();
            const nextInput= inputs[index+1];
            if (nextInput) nextInput.focus();
        });

        input.addEventListener("keydown", function(event){
            //console.log(event);
            const currentIndex = Array.from(inputs).indexOf(event.target);
            if (event.key == "ArrowRight"){
                const nextInput = currentIndex +1;
                if(nextInput<inputs.length) inputs[nextInput].focus();
            }
            if (event.key == "ArrowLeft"){
                const previousInput = currentIndex -1;
                if(previousInput>=0) inputs[previousInput].focus();
            }
        });
    });
}

// Guesses Handling
const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

function handleGuesses() {
    // console.log(wordToGuess);
    let successGuess = true;
    for(let i =1; i<=wordLength ; i++){
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter=wordToGuess[i-1];

        // Game Logic
        if(letter === actualLetter){
            //Letter is Correct and in Place
            inputField.classList.add("CC"); 
    } 
        else if (wordToGuess.includes(letter) &&letter !==""){
            //Letter is Correct but not in Place
            inputField.classList.add("CN");
            successGuess = false;
    }
        else {
            inputField.classList.add("NN");
            successGuess=false;
        }

    }
    // check if win or lose
    if (successGuess){
        if (hints===1){
            messageArea.innerHTML=`WOW!! You Did It Without Using Hints <p>CONGRATZ</p> `;
        }
        else{
            messageArea.innerHTML=`You Win !!, After ${currentTry} Tries, The Word Is <p>${wordToGuess}</p> `;
        }
        
        //Add Disabled Class To All Tries Boxes And Buttons
        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tryDiv)=> tryDiv.classList.add("disabled-inputs"));
        guessButton.disabled = true;
        getHintButton.disabled=true;
    }


    else{
        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
        const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach((input) => (input.disabled = true));
        
        currentTry++;
        
        const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach((input) => (input.disabled =false));

        let element = document.querySelector(`.try-${currentTry}`);
        if(element){
            document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
            element.children[1].focus();
        }
        else{
            guessButton.disabled=true;
            messageArea.innerHTML=`What a Loser !! the word is <span>${wordToGuess}</span>`;

        }
    
    
    }

}


function getHint(){
    if (hints>0){
        hints--;
        document.querySelector(".hint span").innerHTML = hints;
        const enabledInputs = document.querySelectorAll("input:not([disabled])");
        const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");
    
        if (emptyEnabledInputs.length > 0){
            const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
            const randomInput = emptyEnabledInputs[randomIndex];
            const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
            const letter = wordToGuess[indexToFill];
    
            if (indexToFill !== -1){
                randomInput.value = letter.toUpperCase();
            }       
        }
    }
    if(hints===0){
        getHintButton.addEventListener("click", cheater);
        
        
    }



}

function cheater(){
    messageArea.innerHTML=`Stop Trying To Cheat <span>NOOB</span>`;
    getHintButton.disabled=true;
}

function handleBackSpace(event){
    if (event.key === "Backspace"){
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    if (currentIndex > 0 ){
        const currentInput = inputs[currentIndex];
        const previousInput = inputs[currentIndex - 1];

        currentInput.value ="";
        previousInput.value="";
        previousInput.focus();
    }
    
    }
}


document.addEventListener("keydown",handleBackSpace);
document.addEventListener("keydown",Enter);
function Enter(event){
    if (event.key ==="Enter"){
        handleGuesses();
    }
}

window.onload= function() {
    generateInput();
}
