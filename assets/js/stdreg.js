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
  "Haripriya M N",
  "Gopika Krishna",
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

/* =========================
   6-DIGIT VERIFICATION
========================= */

// CHANGE THIS CODE AS REQUIRED
const VALID_CODE = "123456";

const codeInput = document.getElementById("verificationCode");
const verifyBtn = document.getElementById("verifyBtn");
const verifySection = document.getElementById("verification-section");
const formContent = document.getElementById("form-content");
const verifyMsg = document.getElementById("verifyMsg");

// Allow only numbers
codeInput.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "");
});

verifyBtn.addEventListener("click", function () {

  if (codeInput.value.length !== 6) {
    verifyMsg.textContent = "Please enter a valid 6-digit code.";
    verifyMsg.style.color = "red";
    return;
  }

  if (codeInput.value === VALID_CODE) {

    // Hide verification section
    verifySection.style.display = "none";

    // Show form
    formContent.style.display = "block";

  } else {
    verifyMsg.textContent = "Invalid verification code ✖";
    verifyMsg.style.color = "red";
  }

});
