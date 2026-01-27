/* ============================
   ELEMENTS
============================ */

const chatBox = document.getElementById("chatBox");
const status = document.getElementById("status");
const typing = document.getElementById("typing");

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");

const docInfo = document.getElementById("docInfo");
const docNameEl = document.getElementById("docName");

const activeDoc = document.getElementById("activeDoc");
const activeDocName = document.getElementById("activeDocName");

const uploadText = document.getElementById("uploadText");


/* ============================
   BACKEND URL (Hugging Face)
============================ */

const BACKEND_URL =
  "https://Mahil27-ai-document-assistant.hf.space";


/* ============================
   DRAG & DROP + FILE SELECT
============================ */

// Click to browse
dropZone.onclick = () => fileInput.click();

// Drag over
dropZone.addEventListener("dragover", e => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

// Drag leave
dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

// Drop file
dropZone.addEventListener("drop", e => {
  e.preventDefault();
  dropZone.classList.remove("dragover");

  fileInput.files = e.dataTransfer.files;

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];

    uploadText.innerText = "File selected ✔";

    // ✅ Show file name instantly
    docNameEl.innerText = file.name;
    docInfo.classList.remove("hidden");
  }
});

// Browse selection
fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];

    uploadText.innerText = "File selected ✔";

    // ✅ Show file name instantly
    docNameEl.innerText = file.name;
    docInfo.classList.remove("hidden");
  }
});


/* ============================
   ASSISTANT FORMATTING
============================ */

function formatAssistant(text) {
  let html = text;

  // Headings
  html = html.replace(/\*\*(.+?)\*\*/g, "<h2 class='ans-heading'>$1</h2>");

  // Bullet points
  html = html.replace(/• (.+)/g, "<li>$1</li>");
  html = html.replace(/- (.+)/g, "<li>$1</li>");

  // Wrap list items inside <ul>
  html = html.replace(/(<li>.*<\/li>)/gs, "<ul class='ans-list'>$1</ul>");

  // Highlight currency/numbers
  html = html.replace(
    /INR\s?[0-9,]+\/-/g,
    "<span class='highlight'>$&</span>"
  );

  // Line breaks for readability
  html = html.replace(/\n/g, "<br>");

  return html;
}


/* ============================
   CHAT UI HELPERS
============================ */

function addUser(text) {
  const d = document.createElement("div");
  d.className = "user-msg";
  d.innerText = "You:\n" + text;
  chatBox.appendChild(d);
}

function addBot(text) {
  const d = document.createElement("div");
  d.className = "bot-msg";

  const source = activeDocName.innerText || "Uploaded Document";

  d.innerHTML = `
    <div class="source-line">
      📄 Answer from: <strong>${source}</strong>
    </div>
    ${formatAssistant(text)}
  `;

  chatBox.appendChild(d);

  // Auto scroll
  chatBox.scrollTop = chatBox.scrollHeight;
}


/* ============================
   UPLOAD DOCUMENT
============================ */

async function uploadFile() {
  const file = fileInput.files[0];

  if (!file) {
    status.innerText = "❌ Please select a PDF document.";
    status.className = "status error";
    return;
  }

  status.innerText = "⏳ Processing document...";
  status.className = "status";

  const fd = new FormData();
  fd.append("file", file);

  try {
    const res = await fetch(`${BACKEND_URL}/upload`, {
      method: "POST",
      body: fd
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();

    // Show uploaded doc name
    docNameEl.innerText = data.document_name || file.name;
    docInfo.classList.remove("hidden");

    // Show active doc name in chat
    activeDocName.innerText = data.document_name || file.name;
    activeDoc.classList.remove("hidden");

    chatBox.innerHTML = "";
    status.innerText = "✅ Document indexed successfully!";
  } catch (err) {
    console.error(err);
    status.innerText = "❌ Upload failed. Try again.";
    status.className = "status error";
  }
}


/* ============================
   SEND CHAT MESSAGE
============================ */

async function sendMessage() {
  const qInput = document.getElementById("question");
  const q = qInput.value.trim();

  if (!q) return;

  addUser(q);
  qInput.value = "";

  typing.classList.remove("hidden");

  try {
    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q })
    });

    if (!res.ok) throw new Error("Chat failed");

    const data = await res.json();

    typing.classList.add("hidden");
    addBot(data.answer);
  } catch (err) {
    console.error(err);
    typing.classList.add("hidden");
    addBot("❌ Unable to get response. Please try again.");
  }
}
