const questions = [
  {
    question: "What’s the main benefit of PARTITION BY over GROUP BY?",
    options: [
      "It collapses data",
      "It avoids using indexes",
      "It lets you calculate over groups while keeping all rows",
      "It optimizes joins"
    ],
    answer: 2
  },
  {
    question: "Which query is generally faster for counting grouped data?",
    options: [
      "GROUP BY with COUNT(*)",
      "PARTITION BY with COUNT(*) OVER()"
    ],
    answer: 0
  },
  {
    question: "Best SQL approach to get the most recent order per customer while keeping all rows?",
    options: [
      "GROUP BY with MAX()",
      "DISTINCT",
      "PARTITION BY + ROW_NUMBER()",
      "INNER JOIN on latest date"
    ],
    answer: 2
  },
  {
    question: "What’s wrong with this query: SELECT dept, emp_id, AVG(salary) FROM employees GROUP BY dept?",
    options: [
      "Nothing — it works fine",
      "emp_id is not aggregated or grouped",
      "AVG() is incorrect",
      "HAVING is missing"
    ],
    answer: 1
  },
  {
    question: "True or False: GROUP BY and PARTITION BY can be used in the same query.",
    options: ["True", "False"],
    answer: 0
  }
];

let currentQuestion = 0;
let score = 0;

const quizBox = document.getElementById("quiz-box");
const nextBtn = document.getElementById("next-btn");

function showQuestion() {
  const q = questions[currentQuestion];
  quizBox.innerHTML = `
    <h2>${q.question}</h2>
    <div>
      ${q.options.map((opt, i) => `
        <button class="option-btn" onclick="selectOption(${i})">${opt}</button>
      `).join("")}
    </div>
  `;
}

function selectOption(selected) {
  const correct = questions[currentQuestion].answer;
  const buttons = document.querySelectorAll(".option-btn");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    btn.style.backgroundColor = (i === correct)
      ? "#4CAF50"
      : (i === selected && i !== correct) ? "#E53935" : "#444";
  });

  if (selected === correct) score++;

  nextBtn.style.display = "inline-block";
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
    nextBtn.style.display = "none";
  } else {
    showResult();
  }
});

function showResult() {
  document.querySelector(".quiz-container").classList.add("hidden");
  document.getElementById("result-box").classList.remove("hidden");
  document.getElementById("score").innerText = score;
}

function submitScore() {
  const name = document.getElementById("name").value.trim();
  if (!name) return;
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  renderLeaderboard();
}

function renderLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  const list = document.getElementById("leaderboard-list");
  list.innerHTML = leaderboard.slice(0, 5).map(entry =>
    `<li>${entry.name}: ${entry.score}/5</li>`).join("");
}

function restartQuiz() {
  score = 0;
  currentQuestion = 0;
  document.getElementById("result-box").classList.add("hidden");
  document.querySelector(".quiz-container").classList.remove("hidden");
  showQuestion();
  nextBtn.style.display = "none";
}

window.onload = () => {
  showQuestion();
  renderLeaderboard();
};