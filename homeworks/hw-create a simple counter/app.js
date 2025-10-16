let count = 0;

const countEl = document.getElementById("count");
const minusBtn = document.getElementById("minus");
const resetBtn = document.getElementById("reset");

function render() {
  countEl.textContent = count;
  const atZero = count === 0;
  if (minusBtn) minusBtn.disabled = atZero;
  if (resetBtn) resetBtn.disabled = atZero;
}

function increase() {
  count = count + 1;
  render();
}

function decrease() {
  count = Math.max(0, count - 1);
  render();
}

function reset() {
  count = 0;
  render();
}

document.getElementById("plus").addEventListener("click", increase);
document.getElementById("minus").addEventListener("click", decrease);
document.getElementById("reset").addEventListener("click", reset);

render(); // initial paint
