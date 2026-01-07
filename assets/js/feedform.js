
/***********************
 * INPUT SANITIZATION
 ***********************/
document.getElementById("name").addEventListener("input", function () {
  this.value = this.value.replace(/[^A-Za-z\s]/g, "");
});

document.getElementById("contact_number").addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "");
});

document.getElementById("faculty").addEventListener("input", function () {
  this.value = this.value.replace(/[^A-Za-z\s]/g, "");
});

document.getElementById("department").addEventListener("input", function () {
  this.value = this.value.replace(/[^A-Za-z\s]/g, "");
});

/***********************
 * FACULTY AUTOCOMPLETE
 ***********************/
const faculties = [
  "Jemidas J",
  "Athulya C",
  "Anna Benny",
  "Rahul P R",
  "Tintu Chackochan",
  "Affreena T Anas",
  "Dona Elizabeth Sabu",
  "Anju Jose",
  "Rahul Gopal",
  "Praveena Shajith",
  "Sadiq Abdul Nassir",
  "Darsana P",
  "Zareel Rayam Kalam",
  "Ranjith Kumar Nair",
  "Nidhin M",
  "Joji Jose",
  "Sulfikar N"
];

const facultyInput = document.getElementById("faculty");
const facultyList = document.getElementById("facultyList");

facultyList.style.display = "none";

facultyInput.addEventListener("input", () => {
  facultyList.innerHTML = "";
  const value = facultyInput.value.trim().toLowerCase();

  if (!value) {
    facultyList.style.display = "none";
    return;
  }

  const matches = faculties.filter(name =>
    name.toLowerCase().includes(value)
  );

  if (matches.length === 0) {
    facultyList.style.display = "none";
    return;
  }

  matches.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    li.onclick = () => {
      facultyInput.value = name;
      facultyList.innerHTML = "";
      facultyList.style.display = "none";
    };
    facultyList.appendChild(li);
  });

  facultyList.style.display = "block";
});

/**************************
 * DEPARTMENT AUTOCOMPLETE
 **************************/
const departments = [
  "Hospital Administration",
  "Programming Languages",
  "Python Development",
  "Networking & Security",
  "Professional Accounting",
  "HRM / CRM",
  "Data Science",
  "AI & ML",
  "Digital Marketing with AI",
  "Software Testing",
  "SAP End User & Consultant",
  "Medical Coding",
  "Hardware Engineering",
  "Logistics & Supply Chain Management",
  "Cyber Security & Ethical Hacking",
  "Architectural Softwares (Mechanical, Civil)",
  "Hospitality Management",
  "Flutter Development",
  "MEAN / MERN Stack"
];

const deptInput = document.getElementById("department");
const deptList = document.getElementById("departmentList");

deptList.style.display = "none";

deptInput.addEventListener("input", () => {
  deptList.innerHTML = "";
  const value = deptInput.value.trim().toLowerCase();

  if (!value) {
    deptList.style.display = "none";
    return;
  }

  const matches = departments.filter(dept =>
    dept.toLowerCase().includes(value)
  );

  if (matches.length === 0) {
    deptList.style.display = "none";
    return;
  }

  matches.forEach(dept => {
    const li = document.createElement("li");
    li.textContent = dept;
    li.onclick = () => {
      deptInput.value = dept;
      deptList.innerHTML = "";
      deptList.style.display = "none";
    };
    deptList.appendChild(li);
  });

  deptList.style.display = "block";
});

/*********************************
 * CLOSE AUTOCOMPLETE ON OUTSIDE CLICK
 *********************************/
document.addEventListener("click", (e) => {
  if (!facultyInput.contains(e.target)) {
    facultyList.style.display = "none";
  }
  if (!deptInput.contains(e.target)) {
    deptList.style.display = "none";
  }
});

/***********************
 * ACCORDION (if used)
 ***********************/
document.querySelectorAll(".accordion-head").forEach(head => {
  head.addEventListener("click", () => {
    const accordion = head.parentElement;

    document.querySelectorAll(".accordion").forEach(item => {
      if (item !== accordion) {
        item.classList.remove("active");
      }
    });

    accordion.classList.toggle("active");
  });
});

/***********************
 * FORM SUBMISSION (AJAX)
 ***********************/
$("#faculty-feedback").submit((e) => {
  e.preventDefault();

  $("#form-submit").prop("disabled", true).text("Sending...");

  $.ajax({
    url: "https://script.google.com/macros/s/AKfycby5JXsoA4S4fZ2nXLEndISHnjZSgmTcZDZuOHSbhS2da_S8xBIqsZSnrCVXITMzjvOC/exec",
    data: $("#faculty-feedback").serialize(),
    method: "POST",

    success: function () {
      alert("Form submitted successfully");
      $("#form-submit").prop("disabled", false).text("Submit Feedback");
      window.location.reload();
    },

    error: function (err) {
      alert("Something went wrong");
      $("#form-submit").prop("disabled", false).text("Submit Feedback");
      console.error(err);
    }
  });
});
