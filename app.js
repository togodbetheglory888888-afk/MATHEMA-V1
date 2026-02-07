let score = 0;
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");

function generateQuestion() {
    const operations = ["+", "-", "*", "/"];
    const op = operations[Math.floor(Math.random() * operations.length)];
    let a = Math.floor(Math.random() * 20) + 1;
    let b = Math.floor(Math.random() * 20) + 1;

    // Ensure whole-number answers and no negatives
    if (op === "-") {
        if (a < b) [a, b] = [b, a];
    }
    if (op === "/") {
        a = a * b; // ensures a / b is whole number
    }

    questionEl.textContent = `What is ${a} ${op} ${b}?`;
    return eval(`${a} ${op} ${b}`);
}

let currentAnswer = generateQuestion();

document.getElementById("submit").addEventListener("click", () => {
    const userAnswer = parseInt(answerEl.value);
    if (userAnswer === currentAnswer) {
        feedbackEl.textContent = "Correct! 🎉";
        score++;
        scoreEl.textContent = score;
    } else {
        feedbackEl.textContent = "Try again ❌";
    }
    answerEl.value = "";
    currentAnswer = generateQuestion();
});
