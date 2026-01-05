const purpose = document.getElementById("purpose");
const conditionalFields = document.querySelectorAll(".conditional");

// Show / Hide fields
purpose.addEventListener("change", () => {
  conditionalFields.forEach(el => el.style.display = "none");

  if (purpose.value) {
    document.querySelectorAll("." + purpose.value).forEach(el => {
      el.style.display = "block";
    });
  }
});

// Faculty autocomplete
const faculties = [
"Jemidas J",
"Athulya c",
"Anna Benny",
"Rahul P R",
"Tintu Chackochan",
"Affreena T Anas",
"Dona Elizabeth Sabu",
"Anju Jose",
"Rahul Gopal",
"Praveena Shajith",
"Sadiq Abdul Nassir",
"Darsana p",
"Zareel Rayam Kalam",
"Ranjith Kumar Nair",
"Nidhin M",
"Joji Jose",
"Sulfikar N"

];

const facultyInput = document.getElementById("faculty");
const facultyList = document.getElementById("facultyList");

facultyInput.addEventListener("input", () => {
  facultyList.innerHTML = "";
  const value = facultyInput.value.toLowerCase();

  if (!value) return;

  faculties
    .filter(name => name.toLowerCase().includes(value))
    .forEach(name => {
      const li = document.createElement("li");
      li.textContent = name;
      li.onclick = () => {
        facultyInput.value = name;
        facultyList.innerHTML = "";
      };
      facultyList.appendChild(li);
    });
});

/* Department autocomplete */
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

deptInput.addEventListener("input", () => {
  deptList.innerHTML = "";
  const value = deptInput.value.toLowerCase();

  if (!value) return;

  departments
    .filter(dept => dept.toLowerCase().includes(value))
    .forEach(dept => {
      const li = document.createElement("li");
      li.textContent = dept;
      li.onclick = () => {
        deptInput.value = dept;
        deptList.innerHTML = "";
      };
      deptList.appendChild(li);
    });
});

/* Close dropdown when clicking outside */
document.addEventListener("click", (e) => {
  if (!deptInput.contains(e.target)) {
    deptList.innerHTML = "";
  }
});


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

document.querySelectorAll(".accordion-head").forEach(head => {
    head.addEventListener("click", () => {
      const accordion = head.parentElement;

      // Close others (optional)
      document.querySelectorAll(".accordion").forEach(item => {
        if (item !== accordion) {
          item.classList.remove("active");
        }
      });

      // Toggle current
      accordion.classList.toggle("active");
    });
  });
$("#contact").submit((e) => {
    e.preventDefault();
    $("#form-submit").prop("disabled", true).text("Sending...");

    $.ajax({
        url: "https://script.google.com/macros/s/AKfycbwnfP333qQip-ih-BX0Vvugb-b0IVpPFYz6WCQ22uqYRFi9_ss9_hpgeFRtoIfK3-de/exec",
        data: $("#contact").serialize(),
        method: "POST",

        success: function (response) {
            alert("Form submitted successfully");

            $("#form-submit").prop("disabled", false).text("SEND MESSAGE NOW");

            // Optional reload
            window.location.reload();
            // OR redirect
            // window.location.href = "https://google.com";
        },

        error: function (err) {
            alert("Something went wrong");
            $("#form-submit").prop("disabled", false).text("SEND MESSAGE NOW");
            console.error(err);
        }
    });
});
