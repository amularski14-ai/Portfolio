const icon = document.querySelectorAll(".framework-icon");

icon.forEach((val) => {

  async function addSpinClass(ele) {
    const spinActive = val.classList.contains("spin");
    if (spinActive) return;
    val.classList.add("spin");
    await sleep(1000); // Animation is 1s long.
    val.classList.remove("spin");
  }

  val.addEventListener("mouseenter", () => {
    addSpinClass(val)
  })

  // on phone this will register as a click event.
  val.addEventListener("click", () => {
    addSpinClass(val)
  })
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
