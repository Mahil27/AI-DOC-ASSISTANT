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

/* =========================
   DRAG & DROP + FILE SELECT
========================= */

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

    // ✅ SHOW FILE NAME IMMEDIATELY
    docNameEl.innerText = file.name;
    docInfo.classList.remove("hidden");
  }
});

// Browse PDF selection
fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    uploadText.innerText = "File selected ✔";

    // ✅ SHOW FILE NAME IMMEDIATELY
    docNameEl.innerText = file.name;
    docInfo.classList.remove("hidden");
  }
});

/* =========================
   ASSISTANT FORMATTING
========================= */

function formatAssistant(text) {
  let html = text;

  html = html.replace(/\*\*(.+?)\*\*/g, "<h2 class='ans-heading'>$1</h2>");
  html = html.replace(/• (.+)/g, "<li>$1</li>");
  html = html.replace(/- (.+)/g, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>)/gs, "<ul class='ans-list'>$1</ul>");
  html = html.replace(/INR\s?[0-9,]+\/-/g, "<span class='highlight'>$&</span>");

  return html;
}

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
    <div style="font-size:12px;color:#777;margin-bottom:4px;">
      📄 Answer from: <strong>${source}</strong>
    </div>
    ${formatAssistant(text)}
  `;

  chatBox.appendChild(d);
}

/* =========================
   UPLOAD DOCUMENT
========================= */

async function uploadFile() {
  const file = fileInput.files[0];

  if (!file) {
    status.innerText = "Please select a document.";
    status.className = "status error";
    return;
  }

  status.innerText = "Processing document...";
  status.className = "status";

  const fd = new FormData();
  fd.append("file", file);

  try {
    const res = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: fd
    });

    const data = await res.json();

    // Backend-confirmed document name
    docNameEl.innerText = data.document_name || file.name;
    docInfo.classList.remove("hidden");

    activeDocName.innerText = data.document_name || file.name;
    activeDoc.classList.remove("hidden");

    chatBox.innerHTML = "";
    status.innerText = "Document indexed successfully ✅";

  } catch (err) {
    status.innerText = "Indexing failed. Please try again.";
    status.className = "status error";
  }
}

/* =========================
   CHAT
========================= */

async function sendMessage() {
  const qInput = document.getElementById("question");
  const q = qInput.value.trim();

  if (!q) return;

  addUser(q);
  qInput.value = "";
  typing.classList.remove("hidden");

  try {
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q })
    });

    const data = await res.json();
    typing.classList.add("hidden");

    addBot(data.answer);

  } catch (err) {
    typing.classList.add("hidden");
    addBot("❌ Unable to get response. Please try again.");
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}
