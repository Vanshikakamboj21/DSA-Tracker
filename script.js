lucide.createIcons();

let questions =
JSON.parse(localStorage.getItem("dsaQuestions")) || [];

let darkMode = true;

let editId = null;


/* =========================
   THEME TOGGLE
========================= */

document.getElementById("themeBtn")
.addEventListener("click", () => {

  darkMode = !darkMode;

  const body =
  document.getElementById("body");

  const navbar =
  document.getElementById("navbar");

  const cards =
  document.querySelectorAll(".card");

  if(darkMode){

    body.classList.remove("light-mode");

    body.classList.add(
      "bg-[#020817]",
      "text-white"
    );

    navbar.classList.remove("bg-white");

    navbar.classList.add("bg-[#081225]");

    cards.forEach(card => {

      card.classList.remove("light-card");

    });

  }else{

    body.classList.add("light-mode");

    body.classList.remove(
      "bg-[#020817]",
      "text-white"
    );

    navbar.classList.remove("bg-[#081225]");

    navbar.classList.add("bg-white");

    cards.forEach(card => {

      card.classList.add("light-card");

    });

  }

});


/* =========================
   MODAL
========================= */

function openModal(){

  clearForm();

  editId = null;

  document.getElementById("modal")
  .classList.add("show");

}

function closeModal(){

  document.getElementById("modal")
  .classList.remove("show");

}


/* =========================
   CLOSE NOTES
========================= */

function closeNotes(){

  document.getElementById("notesModal")
  .classList.remove("show");

}


/* =========================
   CLEAR FORM
========================= */

function clearForm(){

  document.getElementById("questionName").value = "";

  document.getElementById("platform").value = "LeetCode";

  document.getElementById("tags").value = "";

  document.getElementById("complexity").value = "";

  document.getElementById("confidence").value = "1";

  document.getElementById("date").value = "";

  document.getElementById("approach").value = "";

  document.getElementById("mistakes").value = "";

}


/* =========================
   NEXT REVISION
========================= */

function calculateNextRevision(date, confidence){

  if(!date){

    return "No Date";

  }

  let days = {

    1:2,
    2:3,
    3:5,
    4:7,
    5:10

  };

  let d = new Date(date);

  d.setDate(
    d.getDate() + days[confidence]
  );

  return d.toISOString().split("T")[0];

}


/* =========================
   SAVE QUESTION
========================= */

function saveQuestion(){

  let question = {

    id: editId ? editId : Date.now(),

    name:
    document.getElementById("questionName").value.trim(),

    platform:
    document.getElementById("platform").value,

    tags:
    document.getElementById("tags").value.trim(),

    complexity:
    document.getElementById("complexity").value.trim(),

    confidence:
    document.getElementById("confidence").value,

    date:
    document.getElementById("date").value,

    approach:
    document.getElementById("approach").value.trim(),

    mistakes:
    document.getElementById("mistakes").value.trim()

  };


  if(question.name === ""){

    alert("Enter Question Name");

    return;

  }

  if(question.date === ""){

    alert("Select Date");

    return;

  }


  /* EDIT */

  if(editId){

    questions = questions.map(q => {

      if(q.id === editId){

        return question;

      }

      return q;

    });

  }

  /* NEW */

  else{

    questions.push(question);

  }


  localStorage.setItem(
    "dsaQuestions",
    JSON.stringify(questions)
  );

  editId = null;

  clearForm();

  closeModal();

  renderQuestions();

}


/* =========================
   CONFIDENCE COLOR
========================= */

function confidenceColor(conf){

  if(conf <= 2){

    return "bg-red-500";

  }

  if(conf == 3){

    return "bg-yellow-500";

  }

  return "bg-green-500";

}


/* =========================
   RENDER QUESTIONS
========================= */

function renderQuestions(){

  let table =
  document.getElementById("questionTable");

  table.innerHTML = "";

  let searchValue =
  document.getElementById("searchInput")
  .value
  .toLowerCase();

  let platformValue =
  document.getElementById("platformFilter")
  .value;

  let filteredQuestions =
  questions.filter(q => {

    let matchSearch =
    q.name.toLowerCase().includes(searchValue) ||

    q.tags.toLowerCase().includes(searchValue);

    let matchPlatform =
    platformValue === "" ||
    q.platform === platformValue;

    return matchSearch && matchPlatform;

  });

  filteredQuestions.forEach(q => {

    let nextRevision =
    calculateNextRevision(
      q.date,
      q.confidence
    );

    let today =
    new Date().toISOString().split("T")[0];

    let reviseNow =
    nextRevision <= today;

    table.innerHTML += `

    <tr class="border-b border-slate-800 hover:bg-[#0f172a]">

      <td class="p-4 font-semibold">
        ${q.name}
      </td>

      <td class="p-4">
        ${q.platform}
      </td>

      <td class="p-4">

        <span class="bg-slate-700 px-3 py-1 rounded-lg">

          ${q.tags}

        </span>

      </td>

      <td class="p-4">

        <span class="${confidenceColor(q.confidence)} text-black px-3 py-1 rounded-lg font-bold">

          ${q.confidence}

        </span>

      </td>

      <td class="p-4">
        ${q.date}
      </td>

      <td class="p-4">

        ${nextRevision}

        ${reviseNow ? `

        <span class="bg-red-500 text-xs px-2 py-1 rounded-lg ml-2">

          Revise Now

        </span>

        ` : ""}

      </td>

      <td class="p-4 flex gap-2 flex-wrap">

        <button
        onclick="viewNotes(
        \`${q.approach}\`,
        \`${q.mistakes}\`,
        \`${q.complexity}\`
        )"
        class="bg-cyan-500 text-black px-3 py-1 rounded-lg">

          Notes

        </button>

        <button
        onclick="markRevised(${q.id})"
        class="bg-green-500 text-black px-3 py-1 rounded-lg">

          Revised

        </button>

        <button
        onclick="editQuestion(${q.id})"
        class="bg-yellow-500 text-black px-3 py-1 rounded-lg">

          Edit

        </button>

        <button
        onclick="deleteQuestion(${q.id})"
        class="bg-red-500 px-3 py-1 rounded-lg">

          Delete

        </button>

      </td>

    </tr>

    `;

  });

  updateDashboard();

}


/* =========================
   DELETE
========================= */

function deleteQuestion(id){

  questions =
  questions.filter(q => q.id !== id);

  localStorage.setItem(
    "dsaQuestions",
    JSON.stringify(questions)
  );

  renderQuestions();

}


/* =========================
   MARK REVISED
========================= */

function markRevised(id){

  let today =
  new Date().toISOString().split("T")[0];

  questions = questions.map(q => {

    if(q.id === id){

      q.date = today;

    }

    return q;

  });

  localStorage.setItem(
    "dsaQuestions",
    JSON.stringify(questions)
  );

  renderQuestions();

}


/* =========================
   EDIT QUESTION
========================= */

function editQuestion(id){

  let q =
  questions.find(q => q.id === id);

  if(!q){

    return;

  }

  editId = id;

  document.getElementById("questionName").value =
  q.name;

  document.getElementById("platform").value =
  q.platform;

  document.getElementById("tags").value =
  q.tags;

  document.getElementById("complexity").value =
  q.complexity;

  document.getElementById("confidence").value =
  q.confidence;

  document.getElementById("date").value =
  q.date;

  document.getElementById("approach").value =
  q.approach;

  document.getElementById("mistakes").value =
  q.mistakes;

  document.getElementById("modal")
  .classList.add("show");

}


/* =========================
   DASHBOARD
========================= */

function updateDashboard(){

  document.getElementById("totalQuestions")
  .innerText = questions.length;

  let weak =
  questions.filter(q => q.confidence <= 2).length;

  let strong =
  questions.filter(q => q.confidence >= 4).length;

  document.getElementById("weakQuestions")
  .innerText = weak;

  document.getElementById("strongQuestions")
  .innerText = strong;

  let tags = [];

  questions.forEach(q => {

    if(q.confidence <= 2){

      let splitTags =
      q.tags.split(",");

      splitTags.forEach(tag => {

        tags.push(tag.trim());

      });

    }

  });

  let freq = {};

  tags.forEach(tag => {

    if(tag !== ""){

      freq[tag] =
      (freq[tag] || 0) + 1;

    }

  });

  let weakest = "-";
  let max = 0;

  for(let key in freq){

    if(freq[key] > max){

      max = freq[key];

      weakest = key;

    }

  }

  document.getElementById("weakestTag")
  .innerText = weakest;

}


/* =========================
   VIEW NOTES
========================= */

function viewNotes(approach,mistakes,complexity){

  document.getElementById("notesContent")
  .innerHTML = `

  <div class="space-y-5">

    <div>

      <h3 class="text-cyan-400 text-xl font-bold">

        Approach

      </h3>

      <p class="mt-2">

        ${approach || "No Notes"}

      </p>

    </div>

    <div>

      <h3 class="text-cyan-400 text-xl font-bold">

        Time Complexity

      </h3>

      <p class="mt-2">

        ${complexity || "Not Added"}

      </p>

    </div>

    <div>

      <h3 class="text-cyan-400 text-xl font-bold">

        Mistakes

      </h3>

      <p class="mt-2">

        ${mistakes || "No Mistakes Added"}

      </p>

    </div>

  </div>

  `;

  document.getElementById("notesModal")
  .classList.add("show");

}


/* =========================
   SEARCH FILTER
========================= */

document.getElementById("searchInput")
.addEventListener("input", renderQuestions);

document.getElementById("platformFilter")
.addEventListener("change", renderQuestions);


/* =========================
   START
========================= */

renderQuestions();