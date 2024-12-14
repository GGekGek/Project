let nbPlayers = 0;
const questions = await fetch("questions.json").then(questions => questions.json());

class Player {
    constructor(name, score) {
        this.name = name;
        this.score = score;
    }
}
let myPromise = new Promise((resolve) => {
    document.getElementById("p-1").addEventListener("click", function () {
        nbPlayers = 1;
        resolve();
    });
    document.getElementById("p-2").addEventListener("click", function () {
        nbPlayers = 2;
        resolve();
    });
    document.getElementById("p-3").addEventListener("click", function () {
        nbPlayers = 3;
        resolve();
    });
    document.getElementById("p-4").addEventListener("click", function () {
        nbPlayers = 4;
        resolve();
    });
});
myPromise.then(function () {
    const main = document.querySelector("main");
    const ButtonP = document.querySelector(".Button-p");
    ButtonP.innerHTML="<h1>Name the first player !</h1>";
    let stringForm = `<form id="form">`;
    const players = [];
    for (let i=1; i<=nbPlayers;i++)
    {
        stringForm+=`<label for="${i}player">Player ${i}: </label><input type="text" name="${i}player" id="${i}player" class="inputs" required><br>`
    }
    stringForm+=`<input type="submit" value="Submit"></form>`;
    main.innerHTML=stringForm;
    let insertName = new Promise((resolve) => {
        const form = document.getElementById("form");      
        form.addEventListener("submit", function (event) {
            event.preventDefault(); 
            const inputs = document.getElementsByClassName("inputs");
            for (let i = 0; i < inputs.length; i++) {
                const playerName = inputs[i].value.trim();
                if (playerName) {
                    players.push(new Player(playerName, 0));
                }
            }
            resolve(players); 
        });
    });
    insertName.then(async function () {
        console.log(players);
        main.innerHTML = "";
        const body = document.querySelector("body");
        const PlayerName = document.createElement("PlayerName");
        PlayerName.className="formating";
        body.appendChild(PlayerName);
        const boxTimer = document.createElement("Timer");
        boxTimer.className="formating";
        boxTimer.id="timer";
        body.appendChild(boxTimer);
        const questionElement = document.createElement("Question");
        questionElement.className="formating";
        let currentPlayerIndex = 0;
        for (let i = 1; i <= nbPlayers*4; i++) {
            main.appendChild(questionElement);
            PlayerName.innerHTML = `<h2>${players[currentPlayerIndex].name}</h2>`;
            if (currentPlayerIndex==0){
                PlayerName.style.backgroundColor = "red";
            } else if (currentPlayerIndex==1){
                PlayerName.style.backgroundColor = "blue";
            } else if (currentPlayerIndex==2){
                PlayerName.style.backgroundColor = "green";
            } else {
                PlayerName.style.backgroundColor = "yellow";
            }
            var question = null;
            if (i<=nbPlayers){
                question = questions.css[currentPlayerIndex];
            } else if (i<=nbPlayers*2) {
                question = questions.javascript[currentPlayerIndex];
            } else if (i<=nbPlayers*3) {
                question = questions.html[currentPlayerIndex];
            } else {
                question = questions.mixed[currentPlayerIndex];
            }
            const answers = [
                question.answerA,
                question.answerB,
                question.answerC,
                question.answerD,
            ];
            questionElement.innerHTML = `<h2>${question.question}</h2>`;
            ButtonP.innerHTML=`<h2>Question ${i}:</h2>`;
            const shuffledAnswers = answers
                .map((answer, index) => ({ answer, originalIndex: index }))
                .sort(() => Math.random() - 0.5);
            const formId = "answerForm";
            main.innerHTML += `
                <form id="${formId}">
                    ${shuffledAnswers
                        .map(
                            (item, idx) => `
                        <label>
                            <input type="radio" name="answer" value="${item.originalIndex}">
                            ${item.answer}
                        </label><br>
                    `
                        )
                        .join("")}
                    <input type="submit" value="Submit">
                </form>
            `;
            await new Promise((resolve) => {
                const form = document.getElementById(formId);
                let timer = 15;
            const timerElement = document.getElementById("timer");
            const countdown = setInterval(() => {
                timer--;
                timerElement.textContent = `Time left: ${timer}s`;
                if (timer <= 0) {
                    clearInterval(countdown);
                    resolve();
                }
            }, 1000);
                form.addEventListener(
                    "submit",
                    function (event) {
                        event.preventDefault();
                        clearInterval(countdown);
                        const selectedAnswer = form.querySelector(
                            'input[name="answer"]:checked'
                        );
                        try {
                            const selectedIndex = parseInt(selectedAnswer.value, 10);
                            if (selectedIndex === 0) {
                                players[currentPlayerIndex].score += 10;
                            }
                        } catch (error) {}
                        resolve(); 
                    },
                    { once: true }
                );
            });
            main.innerHTML = "";
            if (currentPlayerIndex == nbPlayers-1){
                currentPlayerIndex = 0;
            } else {
                currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
            }
        }
        ButtonP.innerHTML="<h2>Results</h2>";
        console.log(players);
        players.sort((a, b) => b.score - a.score);
        console.log(players);
        for (var i=0;i<players.length;i++)
        {
            main.innerHTML+=`<Score>${i+1}: ${players[i].name} (${players[i].score})</Score>`;
        }
        PlayerName.innerHTML=`<h2>${players[0].name}</h2>`;
        PlayerName.style.backgroundColor = "aquamarine";
        const finalScore = document.createElement("FinalScore");
        finalScore.className="formating";
        finalScore.innerHTML=`<h2>Winner(s):</h2><h2>${players[0].name} !</h2>`;
        var escapeScore = false;
        var count = 0;
        while (escapeScore == false && count < (nbPlayers-1)){
            if (players[count].score==players[count+1].score){
                finalScore.innerHTML+=`<h2>${players[count+1].name} !</h2>`;
            } else {
                escapeScore = true;
            }
            count++;
        }
        main.appendChild(finalScore);
        const finalButton = document.createElement("div");
        finalButton.className="Button-s";
        finalButton.innerHTML=`<h2><a href="index.html">Return to Home Screen</a></h2>`;
        body.appendChild(finalButton);
    });
});