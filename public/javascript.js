console.log("Hola Mundo");

const exerciseForm = document.getElementById("exercise-form");
const submit = document.getElementById("submit");

exerciseForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita que el formulario se recargue

  const userId = document.getElementById("id-e").value;
  const username = document.getElementById("uname-e").value;
  const description = document.getElementById("description-e").value;
  const duration = document.getElementById("duration-e").value;
  const date = document.getElementById("date-e").value;
  try {
    const response = await fetch(`/api/users/${userId}/exercises`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, description, duration, date }),
    });
    const data = await response.json();
    console.log(data);
    alert("¡Ejercicio agregado con éxito!");
  } catch (err) {
    console.log("Error: ", err);
  }
});
