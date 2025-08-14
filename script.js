const preview = document.getElementById("preview");
const runBtn = document.getElementById("run-btn");
const saveBtn = document.getElementById("save-btn");
const loadBtn = document.getElementById("load-btn");
const resetBtn = document.getElementById("reset-btn");
const exportBtn = document.getElementById("export-btn");
const themeSelect = document.getElementById("theme-select");

let htmlEditor, cssEditor, jsEditor;

function debounce(fn, delay = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

function runCode() {
  const html = htmlEditor.getValue();
  const css = `<style>${cssEditor.getValue()}</style>`;
  const js  = `<script>${jsEditor.getValue()}<\/script>`;
  preview.srcdoc = `<!DOCTYPE html><html><head>${css}</head><body>${html}${js}</body></html>`;
}

function saveCode() {
  localStorage.setItem("htmlCode", htmlEditor.getValue());
  localStorage.setItem("cssCode", cssEditor.getValue());
  localStorage.setItem("jsCode", jsEditor.getValue());
  toast("Kodlar kaydedildi ✅");
}

function loadCode() {
  const h = localStorage.getItem("htmlCode") || "";
  const c = localStorage.getItem("cssCode") || "";
  const j = localStorage.getItem("jsCode") || "";
  htmlEditor.setValue(h);
  cssEditor.setValue(c);
  jsEditor.setValue(j);
  runCode();
  toast("Kodlar yüklendi 📂");
}

function resetCode() {
  htmlEditor.setValue("");
  cssEditor.setValue("");
  jsEditor.setValue("");
  runCode();
  toast("Temizlendi ♻️");
}

function exportCode() {
  const content = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>${cssEditor.getValue()}</style></head>
<body>${htmlEditor.getValue()}<script>${jsEditor.getValue()}<\/script></body></html>`;

  const blob = new Blob([content], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "index.html";
  a.click();
  URL.revokeObjectURL(url);
  toast("HTML indirildi ⬇️");
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);

  const cmTheme = isDark ? "dracula" : "neo";
  [htmlEditor, cssEditor, jsEditor].forEach(ed => ed.setOption("theme", cmTheme));
}

function toast(msg) {
  const el = document.createElement("div");
  el.textContent = msg;
  Object.assign(el.style, {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(15,23,42,.9)",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "10px",
    fontWeight: "600",
    boxShadow: "0 10px 24px rgba(2,6,23,.35)",
    zIndex: 9999,
    opacity: 0,
    transition: "opacity .25s ease"
  });
  document.body.appendChild(el);
  requestAnimationFrame(() => el.style.opacity = 1);
  setTimeout(() => {
    el.style.opacity = 0;
    setTimeout(() => el.remove(), 250);
  }, 1400);
}

function initEditors() {
  htmlEditor = CodeMirror.fromTextArea(document.getElementById("html-code"), {
    mode: "htmlmixed",
    lineNumbers: true,
    tabSize: 2,
    indentUnit: 2,
    lineWrapping: true,
    autoCloseBrackets: true,
    autoCloseTags: true,
    matchBrackets: true,
    theme: "neo"
  });

  cssEditor = CodeMirror.fromTextArea(document.getElementById("css-code"), {
    mode: "css",
    lineNumbers: true,
    tabSize: 2,
    indentUnit: 2,
    lineWrapping: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    theme: "neo"
  });

  jsEditor = CodeMirror.fromTextArea(document.getElementById("js-code"), {
    mode: "javascript",
    lineNumbers: true,
    tabSize: 2,
    indentUnit: 2,
    lineWrapping: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    theme: "neo"
  });


  const live = debounce(runCode, 200);
  htmlEditor.on("change", live);
  cssEditor.on("change", live);
  jsEditor.on("change", live);

  
  if (!localStorage.getItem("htmlCode") &&
      !localStorage.getItem("cssCode") &&
      !localStorage.getItem("jsCode")) {
    htmlEditor.setValue(`<!-- Örnek -->
<div class="card">
  <h1>Merhaba 👋</h1>
  <p>Bu alanı düzenleyin ve sağdaki önizlemede sonucu görün.</p>
  <button onclick="alert('Çalışıyor!')">Tıkla</button>
</div>`);
    cssEditor.setValue(`body { font-family: system-ui, sans-serif; padding: 24px; }
.card { max-width: 520px; padding: 20px; border-radius: 14px;
  background: #fff; box-shadow: 0 10px 30px rgba(2,6,23,.08); }
button { background:#2563eb; color:#fff; border:0; padding:10px 14px;
  border-radius: 10px; cursor:pointer; }
button:hover { background:#1d4ed8; }`);
    jsEditor.setValue(`console.log("Hoş geldin!");`);
  }

  runCode(); 
}

runBtn.addEventListener("click", runCode);
saveBtn.addEventListener("click", saveCode);
loadBtn.addEventListener("click", loadCode);
resetBtn.addEventListener("click", resetCode);
exportBtn.addEventListener("click", exportCode);
themeSelect.addEventListener("change", () => applyTheme(themeSelect.value));

window.addEventListener("DOMContentLoaded", () => {
  initEditors();
  const initialTheme = localStorage.getItem("uiTheme") || "light";
  themeSelect.value = initialTheme;
  applyTheme(initialTheme);
});


themeSelect.addEventListener("change", () => {
  localStorage.setItem("uiTheme", themeSelect.value);
});
