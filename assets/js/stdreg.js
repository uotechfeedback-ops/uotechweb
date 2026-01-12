const courses = [
  "Professional Diploma in Python",
  "PHP / Java",
  "Data Analytics",
  "MEAN / MERN Stack",
  "Flutter",
  "Software Testing",
  "Artificial Intelligence",
  "Data Science with Generative AI",
  "Medical Coding",
  "Diploma in Architectural Software",
  "AI & Data Science",
  "UI / UX",

  "Certificate in Digital Marketing with AI",
  "Diploma in Digital Marketing with AI",
  "Advanced Diploma in Digital Marketing with AI",

  "Diploma in Hardware Engineering",
  "Diploma in Smartphone Engineering / Laptop Technician",
  "Diploma in Desktop Engineering / CCTV Technician",

  "CCNA",
  "MCSE",
  "RHCE",
  "AWS / AZURE",
  "Ethical Hacking + Cyber Security + CCNA + RedHat",
  "Cyber Security",

  "Professional Diploma in Networking",

  "Certificate in Tally with GST + DTP",
  "SAP (FICO / MM / SD)",
  "Professional Diploma in Accounting",
  "SAP S4 HANA Consultant",

  "Diploma in Logistics & SCM",
  "PG Diploma in Logistics & SCM",
  "Advanced Diploma in Logistics & SCM",

  "Diploma in Hospital Administration",
  "PG Diploma in Hospital Administration",
  "Advanced Diploma in Hospital Administration",

  "Diploma in HRM",
  "PG Diploma in HRM",
  "Diploma in Hospitality Management"
];

const courseInput = document.getElementById("courseInput");
const courseList = document.getElementById("courseList");

courseInput.addEventListener("input", () => {
  const value = courseInput.value.trim().toLowerCase();
  courseList.innerHTML = "";

  if (!value) {
    courseList.style.display = "none";
    return;
  }

  const matches = courses.filter(course =>
    course.toLowerCase().includes(value)
  );

  if (matches.length === 0) {
    courseList.style.display = "none";
    return;
  }

  matches.forEach(course => {
    const li = document.createElement("li");
    li.textContent = course;
    li.onclick = () => {
      courseInput.value = course;
      courseList.style.display = "none";
    };
    courseList.appendChild(li);
  });

  courseList.style.display = "block";
});

/* Close dropdown when clicking outside */
document.addEventListener("click", (e) => {
  if (!courseInput.contains(e.target)) {
    courseList.style.display = "none";
  }
});

/* =========================
   BDM & Counsellor AUTOCOMPLETE
========================= */

// Example data (replace with your real staff list)
const bdmNames = [
  "Ligi T L",
  "Salu Ajmal",
];

const counsellorNames = [
  "Anusree Uthasan",
  "Varna M",
  "Kiran Yesudas",
  "Shariba Thasneem",
  "Jayalakshmi Jayan",
  "Sneha Manoj",
  "Lettisha Stanly",
  "Stebin sajan",
  "Haripriya M N",
  "Gopika Krishna",
];

// Generic autocomplete function
function setupAutocomplete(inputId, listId, data) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);

  if (!input || !list) return;

  input.addEventListener("input", () => {
    const value = input.value.toLowerCase();
    list.innerHTML = "";

    if (!value) {
      list.style.display = "none";
      return;
    }

    data
      .filter(item => item.toLowerCase().includes(value))
      .forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        li.onclick = () => {
          input.value = item;
          list.style.display = "none";
        };
        list.appendChild(li);
      });

    list.style.display = list.children.length ? "block" : "none";
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !list.contains(e.target)) {
      list.style.display = "none";
    }
  });
}

// Initialize
setupAutocomplete("bdmInput", "bdmList", bdmNames);
setupAutocomplete("counsellorInput", "counsellorList", counsellorNames);


/* =========================
   Documents - Other field toggle
========================= */

const otherCheck = document.getElementById("otherDocCheck");
const otherInput = document.getElementById("otherDocInput");

if (otherCheck && otherInput) {
  otherCheck.addEventListener("change", () => {
    if (otherCheck.checked) {
      otherInput.style.display = "block";
      otherInput.focus();
    } else {
      otherInput.style.display = "none";
      otherInput.value = "";
    }
  });
}


/* Check Student ID Verification */
const codeInput = document.getElementById("verificationCode");
const verifyBtn = document.getElementById("verifyBtn");
const verifySection = document.getElementById("verification-section");
const formContent = document.getElementById("form-content");
const verifyMsg = document.getElementById("verifyMsg");

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbziInm0EodJPHyOAQN2nxRq2QEeflhbpzhWX948RmXSu-9wxC0b4-ewhJJ84iUQlwUX/exec";

verifyBtn.addEventListener("click", async function () {

  const code = codeInput.value.trim();

  if (!code) {
    verifyMsg.textContent = "Please enter your Student ID";
    verifyMsg.style.color = "red";
    return;
  }

  verifyMsg.textContent = "Verifying...";
  verifyMsg.style.color = "#555";

  try {
    const res = await fetch(
      `${SCRIPT_URL}?action=verify&code=${encodeURIComponent(code)}`
    );

    const result = await res.json();

    if (result.success) {
      verifySection.style.display = "none";
      formContent.style.display = "block";
    } else {
      verifyMsg.textContent = "Invalid Student ID ✖";
      verifyMsg.style.color = "red";
    }

  } catch (err) {
    verifyMsg.textContent = "Verification failed. Try again.";
    verifyMsg.style.color = "red";
  }
});
codeInput.addEventListener("keypress", e => {
  if (e.key === "Enter") verifyBtn.click();
});
