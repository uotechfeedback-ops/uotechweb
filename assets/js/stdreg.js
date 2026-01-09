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
