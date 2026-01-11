const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzabEl3qjr_ULFsJVL7Em5Oq7RIBub13jEFWRYvbMW8YaHD6goIHaG7AyBiM-iERluN/exec";

  /* ===== LOGIN ===== */
  function login() {
  const user = document.getElementById("staffUser").value.trim();
  const pass = document.getElementById("staffPass").value.trim();
  const btn = document.querySelector("#loginSection button");
  const msg = document.getElementById("loginMsg");

  if (!user || !pass) {
    msg.style.color = "red";
    msg.innerText = "Please enter user ID and password";
    return;
  }

  // UI: loading state
  btn.disabled = true;
  btn.innerText = "Logging in...";
  msg.innerText = "";

  fetch(`${WEB_APP_URL}?user=${encodeURIComponent(user)}&pass=${encodeURIComponent(pass)}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        msg.style.color = "green";
        msg.innerText = "Login successful";

        sessionStorage.setItem("staffUser", data.staffUser);

        setTimeout(() => {
          document.getElementById("loginSection").classList.add("hidden");
          document.getElementById("studentSection").classList.remove("hidden");
        }, 800);

      } else {
        msg.style.color = "red";
        msg.innerText = "Wrong credentials";
        btn.disabled = false;
        btn.innerText = "Login";
      }
    })
    .catch(() => {
      msg.style.color = "red";
      msg.innerText = "Server error. Try again.";
      btn.disabled = false;
      btn.innerText = "Login";
    });
}
  /* ===== GENERATE STUDENT ID ===== */
  function generateStudentId() {
    const staff = sessionStorage.getItem("staffUser");
    const name = document.getElementById("studentName").value;
    const mobile = document.getElementById("studentMobile").value;

    if (!name || !mobile) {
      alert("Please fill all fields");
      return;
    }

    fetch(WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "generateStudent",
        staff: staff,
        name: name,
        mobile: mobile
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const result = document.getElementById("result");
        result.classList.remove("hidden");
        result.innerText = "Generated Student ID: " + data.studentId;

        document.getElementById("studentName").value = "";
        document.getElementById("studentMobile").value = "";
      }
    });
  }

  /* ===== LOGOUT ===== */
  function logout() {
    sessionStorage.clear();
    location.reload();
  }

  /* ===== AUTO LOGIN CHECK ===== */
  if (sessionStorage.getItem("staffUser")) {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("studentSection").classList.remove("hidden");
  }