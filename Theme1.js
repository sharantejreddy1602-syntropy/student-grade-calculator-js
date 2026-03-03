
const SUBJECTS = [
  "DSA",
  "Web Programming",
  "DAA",
  "MPMC",
  "Calculus",
  "Mathematics",
  "Physics",
  "Chemistry",
  "English",
  "Biology"
];

const MOTIVATION = {
  distinction: [
    "🌟 Absolutely Outstanding! You're shining like a star — keep blazing the trail!",
    "🚀 Distinction! Your hard work has paid off spectacularly. The sky is just the beginning!",
    "🏆 Brilliant work! You've achieved Distinction — true excellence personified!"
  ],
  first: [
    "🎉 First Class! You're among the best — a little more push and you'll hit the top!",
    "👏 Great job! First Class honours — keep that momentum going strong!",
    "💪 Well done! First Class — consistency and effort are your superpowers!"
  ],
  pass: [
    "😊 You Passed! Every journey begins with a step. Keep going — you can do even better!",
    "✅ Pass secured! Believe in yourself — improvement is just around the corner.",
    "🌱 You made it through! Grow, learn, and aim higher next time!"
  ],
  fail: [
    "💡 Don't give up! Every setback is a setup for an even greater comeback.",
    "🔥 Failure is not the end — it's the beginning of a stronger story. Revise, retry, rise!",
    "❤️ It's okay. Take a breath, regroup, and come back stronger. You've got this!"
  ]
};


function generateSubjectRows() {
  var countSelect = document.getElementById("subjectCount");
  var count       = parseInt(countSelect.value);
  var container   = document.getElementById("subjectRows");
  var section     = document.getElementById("subjectSection");
  var metricsSection = document.getElementById("metricsSection");

  container.innerHTML = "";
  metricsSection.classList.add("hidden");

  if (isNaN(count) || count < 1) return;

  section.classList.remove("hidden");

  for (var i = 1; i <= count; i++) {
    var rowDiv = document.createElement("div");
    rowDiv.classList.add("subject-row");
    rowDiv.setAttribute("id", "row-" + i);

    var optionsHtml = '<option value="" disabled selected>— Select Subject —</option>';
    for (var j = 0; j < SUBJECTS.length; j++) {
      optionsHtml += `<option value="${SUBJECTS[j]}">${SUBJECTS[j]}</option>`;
    }

    rowDiv.innerHTML = `
      <span class="row-number">${i}.</span>
      <select id="subject-${i}" class="subject-select" onchange="clearRowError(${i})">
        ${optionsHtml}
      </select>
      <input
        type="number"
        id="marks-${i}"
        placeholder="Enter marks (0–100)"
        min="0"
        max="100"
        oninput="validateMarks(${i})"
        onfocus="clearRowError(${i})"
      />
      <span class="error-msg" id="err-${i}"></span>
    `;

    container.appendChild(rowDiv);

    rowDiv.style.animationDelay = (i * 0.07) + "s";
  }

  section.scrollIntoView({ behavior: "smooth", block: "start" });

  var firstInput = document.getElementById("marks-1");
  if (firstInput) firstInput.focus();
}

function validateMarks(rowIndex) {
  var input = document.getElementById("marks-" + rowIndex);
  var errEl = document.getElementById("err-" + rowIndex);
  var val   = parseFloat(input.value);

  if (val > 100) {
    errEl.textContent = "⚠ Maximum marks allowed is 100!";
    errEl.classList.add("show");
    input.value = "";
    input.focus();
  } else if (val < 0) {
    errEl.textContent = "⚠ Marks cannot be negative!";
    errEl.classList.add("show");
    input.value = "";
    input.focus();
  } else {
    clearRowError(rowIndex);
  }
}


function clearRowError(rowIndex) {
  var errEl = document.getElementById("err-" + rowIndex);
  if (errEl) {
    errEl.textContent = "";
    errEl.classList.remove("show");
  }
}


function calculateGrade() {
  var countSelect = document.getElementById("subjectCount");
  var count = parseInt(countSelect.value);

  if (isNaN(count) || count < 1) {
    alert("Please select the number of subjects first.");
    return;
  }

  var totalMarks  = 0;
  var hasError    = false;
  var marksArray  = [];

  for (var i = 1; i <= count; i++) {
    var subjectEl = document.getElementById("subject-" + i);
    var marksEl   = document.getElementById("marks-" + i);
    var errEl     = document.getElementById("err-" + i);

    if (!subjectEl.value) {
      errEl.textContent = "⚠ Please select a subject!";
      errEl.classList.add("show");
      hasError = true;
      continue;
    }

    var marksVal = marksEl.value.trim();
    if (marksVal === "") {
      errEl.textContent = "⚠ Please enter marks for " + subjectEl.value + "!";
      errEl.classList.add("show");
      hasError = true;
      continue;
    }

    var marks = parseFloat(marksVal);

    if (marks < 0 || marks > 100) {
      errEl.textContent = "⚠ Marks must be between 0 and 100!";
      errEl.classList.add("show");
      hasError = true;
      continue;
    }

    totalMarks += marks;
    marksArray.push(marks);
    clearRowError(i);
  }

  if (hasError) {
    var firstErr = document.querySelector(".error-msg.show");
    if (firstErr) firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  var avgMarks = (totalMarks / count).toFixed(2);

  var gradeText, gradeClass, motivationKey;

  if (avgMarks >= 75) {
    gradeText     = "Distinction";
    gradeClass    = "grade-distinction";
    motivationKey = "distinction";
  } else if (avgMarks >= 60) {
    gradeText     = "First Class";
    gradeClass    = "grade-first";
    motivationKey = "first";
  } else if (avgMarks >= 50) {
    gradeText     = "Pass";
    gradeClass    = "grade-pass";
    motivationKey = "pass";
  } else {
    gradeText     = "Fail";
    gradeClass    = "grade-fail";
    motivationKey = "fail";
  }

  document.getElementById("totalMarks").innerHTML =
    `${totalMarks} <small style="font-size:0.6em;opacity:0.6">/ ${count * 100}</small>`;

  document.getElementById("avgMarks").innerHTML =
    `${avgMarks} <small style="font-size:0.6em;opacity:0.6">/ 100</small>`;

  var gradeEl = document.getElementById("gradeDisplay");
  gradeEl.textContent  = gradeText;
  gradeEl.className    = "grade-badge " + gradeClass;

  var metricsSection = document.getElementById("metricsSection");
  metricsSection.classList.remove("hidden");

  var messages     = MOTIVATION[motivationKey];
  var randomMsg    = messages[Math.floor(Math.random() * messages.length)];
  var quoteEl      = document.getElementById("motivationQuote");
  quoteEl.textContent = randomMsg;
  quoteEl.classList.remove("hidden");

  var quoteColorMap = {
    distinction: "#00e676",
    first:       "#40c4ff",
    pass:        "#ffab40",
    fail:        "#ff5252"
  };
  quoteEl.style.color       = quoteColorMap[motivationKey];
  quoteEl.style.borderColor = quoteColorMap[motivationKey];
  quoteEl.style.boxShadow   =
    `0 0 20px ${quoteColorMap[motivationKey]}40`;

  metricsSection.scrollIntoView({ behavior: "smooth", block: "start" });
}


function resetAll() {
  var countSelect = document.getElementById("subjectCount");
  countSelect.selectedIndex = 0;

  var container = document.getElementById("subjectRows");
  container.innerHTML = "";

  document.getElementById("subjectSection").classList.add("hidden");
  document.getElementById("metricsSection").classList.add("hidden");
  document.getElementById("motivationQuote").classList.add("hidden");

  document.getElementById("totalMarks").innerHTML  = "—";
  document.getElementById("avgMarks").innerHTML    = "—";
  var gradeEl = document.getElementById("gradeDisplay");
  gradeEl.textContent = "—";
  gradeEl.className   = "grade-badge";

  countSelect.focus();

  window.scrollTo({ top: 0, behavior: "smooth" });
}


function btnHoverIn(btn) {
  btn.style.background   = "linear-gradient(135deg, #e879a0, #f5d76e)";
  btn.style.color        = "#2a0845";
  btn.style.transform    = "scale(1.06)";
  btn.style.boxShadow    = "0 8px 30px rgba(232,121,160,0.55)";
}

function btnHoverOut(btn) {
  btn.style.background   = "linear-gradient(135deg, #7b3fa0, #b060d8)";
  btn.style.color        = "#fff";
  btn.style.transform    = "scale(1)";
  btn.style.boxShadow    = "0 6px 24px rgba(160,80,255,0.4)";
}

function showTooltip() {
  var tooltip = document.getElementById("gradeTooltip");
  tooltip.classList.add("visible");
}

function hideTooltip() {
  var tooltip = document.getElementById("gradeTooltip");
  tooltip.classList.remove("visible");
}