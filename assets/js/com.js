document.addEventListener("DOMContentLoaded", () => {

  const container = document.getElementById("form-content");
  if (!container) return;

  container.querySelectorAll("input, textarea, select").forEach(field => {

    const key = "student_" + (field.name || field.id);
    if (!key) return;

    // Restore
    const saved = localStorage.getItem(key);
    if (saved !== null) {
      if (field.type === "checkbox") {
        field.checked = saved === "true";
      } else {
        field.value = saved;
      }
    }

    // Save
    field.addEventListener("input", () => {
      if (field.type === "checkbox") {
        localStorage.setItem(key, field.checked);
      } else {
        localStorage.setItem(key, field.value);
      }
    });
  });

});
