// ==============================
// ELEMENTS
// ==============================

const form = document.getElementById("qrForm");
const loader = document.getElementById("loader");
const toast = document.getElementById("toast");

const type = document.getElementById("type");
const input = document.getElementById("dataInput");

const size = document.getElementById("size");
const sizeValue = document.getElementById("sizeValue");

const copyBtn = document.getElementById("copyBtn");
const themeBtn = document.getElementById("themeBtn");

// ==============================
// QR SIZE
// ==============================

if (size && sizeValue) {
  sizeValue.textContent = size.value;

  size.addEventListener("input", () => {
    sizeValue.textContent = size.value;
  });
}

// ==============================
// INPUT TYPE CHANGE
// ==============================

function updateInput() {
  input.value = "";

  switch (type.value) {
    case "url":
      input.type = "url";
      input.placeholder = "https://google.com";

      break;

    case "email":
      input.type = "email";
      input.placeholder = "example@gmail.com";

      break;

    case "phone":
      input.type = "tel";
      input.placeholder = "9876543210";

      break;

    case "text":
      input.type = "text";
      input.placeholder = "Enter Text";

      break;

    case "wifi":
      input.type = "text";
      input.placeholder = "WiFi Name";

      break;
  }
}

type.addEventListener("change", updateInput);

updateInput();
input.style.width = "100%";
input.style.display = "block";
input.style.boxSizing = "border-box";

// ==============================
// COPY BUTTON
// ==============================

copyBtn.addEventListener("click", () => {
  if (input.value.trim() === "") {
    alert("Please enter something first.");

    return;
  }

  navigator.clipboard.writeText(input.value);

  copyBtn.innerHTML = "✅ Copied";

  setTimeout(() => {
    copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> Copy Input';
  }, 1500);
});

// ==============================
// AUTO FOCUS
// ==============================

window.addEventListener("load", () => {
  input.focus();
});

// ==============================
// VALIDATION
// ==============================

form.addEventListener("submit", function (e) {
  const value = input.value.trim();

  // URL

  if (type.value === "url") {
    try {
      const url = new URL(value);

      if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error();
      }
    } catch {
      e.preventDefault();

      alert("❌ Invalid URL\nExample:\nhttps://google.com");

      input.focus();

      return;
    }
  }

  // EMAIL

  if (type.value === "email") {
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.test(value)) {
      e.preventDefault();

      alert("❌ Invalid Email");

      input.focus();

      return;
    }
  }

  // PHONE

  if (type.value === "phone") {
    if (!/^[0-9]{10}$/.test(value)) {
      e.preventDefault();

      alert("❌ Enter 10 digit Mobile Number");

      input.focus();

      return;
    }
  }

  // TEXT

  if (type.value === "text") {
    if (value.length < 2) {
      e.preventDefault();

      alert("❌ Please enter text");

      input.focus();

      return;
    }
  }

  loader.style.display = "flex";
});

// ==============================
// SUCCESS TOAST
// ==============================

window.addEventListener("load", () => {
  if (loader) {
    loader.style.display = "none";
  }

  const qrImage = document.querySelector(".preview img");

  if (qrImage && toast) {
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
});

// ==============================
// PAGE REFRESH
// ==============================

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});

// ==============================
// DARK / LIGHT MODE
// ==============================

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  document.body.classList.add("light-mode");

  themeBtn.textContent = "☀️";
} else {
  document.body.classList.remove("light-mode");

  themeBtn.textContent = "🌙";
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  if (document.body.classList.contains("light-mode")) {
    localStorage.setItem("theme", "light");

    themeBtn.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "dark");

    themeBtn.textContent = "🌙";
  }
});

// ==============================
// BUTTON HOVER
// ==============================

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    btn.style.transform = "translateY(-3px)";
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translateY(0)";
  });
});

// ==============================
// BUTTON CLICK
// ==============================

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", function () {
    this.style.transform = "scale(.96)";

    setTimeout(() => {
      this.style.transform = "scale(1)";
    }, 150);
  });
});

// ==============================
// ENTER KEY EFFECT
// ==============================

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const btn = document.querySelector(".generate-btn");

    if (btn) {
      btn.style.opacity = ".8";

      setTimeout(() => {
        btn.style.opacity = "1";
      }, 150);
    }
  }
});

// ==============================
// INPUT LENGTH LIMIT
// ==============================

input.addEventListener("input", () => {
  if (type.value === "phone") {
    input.value = input.value.replace(/\D/g, "");

    input.value = input.value.substring(0, 10);
  }
});

// ==============================
// CONSOLE MESSAGE
// ==============================

console.log("✅ QR Generator Loaded Successfully");
