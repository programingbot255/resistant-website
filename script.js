const colors = [
  { name: "Black", hex: "#000000" },
  { name: "Brown", hex: "#7c4a0a" },
  { name: "Red", hex: "#dc2626" },
  { name: "Orange", hex: "#f97316" },
  { name: "Yellow", hex: "#fde047" },
  { name: "Green", hex: "#16a34a" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Violet", hex: "#7c3aed" },
  { name: "Gray", hex: "#6b7280" },
  { name: "White", hex: "#ffffff" },
  { name: "Gold", hex: "#fbbf24" },
  { name: "Silver", hex: "#9ca3af" },
  { name: "None", hex: "#f3f4f6" }
];

const colorMap = {
  Black: 0, Brown: 1, Red: 2, Orange: 3, Yellow: 4,
  Green: 5, Blue: 6, Violet: 7, Gray: 8, White: 9,
  Gold: -1, Silver: -2
};

const multiplierMap = {
  Black: 1, Brown: 10, Red: 100, Orange: 1000, Yellow: 10000,
  Green: 100000, Blue: 1e6, Violet: 1e7, Gray: 1e8, White: 1e9,
  Gold: 0.1, Silver: 0.01
};

function populateColorSelects() {
  ["c1", "c2", "c3", "c4", "c5"].forEach(id => {
    const select = document.getElementById(id);
    select.innerHTML = "";
    colors.forEach(c => {
      const option = document.createElement("option");
      option.value = c.name;
      option.text = c.name;
      select.appendChild(option);
    });
  });
}

populateColorSelects();

function convertToColor() {
  const input = document.getElementById("resistorValue").value.trim().toLowerCase();
  const bandCount = parseInt(document.getElementById("bandCount").value);

  let multiplier = 1;
  let num = input;

  if (input.endsWith("k")) {
    multiplier = 1000;
    num = input.slice(0, -1);
  } else if (input.endsWith("m")) {
    multiplier = 1000000;
    num = input.slice(0, -1);
  }

  const value = parseFloat(num) * multiplier;
  if (isNaN(value)) {
    document.getElementById("colorResult").innerText = "Invalid input!";
    return;
  }

  const digits = Math.floor(value).toString();
  const first = parseInt(digits[0]);
  const second = parseInt(digits[1] || 0);
  const zeroCount = digits.length - 2;

  let multiplierColor = Object.keys(multiplierMap).find(
    key => multiplierMap[key] === Math.pow(10, zeroCount)
  ) || "Gold";

  let output = [first, second, multiplierColor];
  if (bandCount >= 4) output.push("Gold");
  if (bandCount === 5) output.push("Brown");

  const formatted = output.map(c => {
    const col = typeof c === 'string' ? colors.find(x => x.name === c) : colors[c];
    return `<div class='color-sample'><div class='color-box' style='background:${col.hex}'></div>${col.name}</div>`;
  }).join("<br>");

  document.getElementById("colorResult").innerHTML = formatted;
}

function convertToValue() {
  const c1 = document.getElementById("c1").value;
  const c2 = document.getElementById("c2").value;
  const c3 = document.getElementById("c3").value;

  if (!(c1 in colorMap) || !(c2 in colorMap) || !(c3 in multiplierMap)) {
    document.getElementById("valueResult").innerText = "Invalid colors selected!";
    return;
  }

  const val = ((colorMap[c1] * 10) + colorMap[c2]) * multiplierMap[c3];
  document.getElementById("valueResult").innerText = `Value: ${val} Ω`;
}

document.getElementById("valueToColorBtn").onclick = () => {
  document.getElementById("valueToColor").classList.add("active");
  document.getElementById("colorToValue").classList.remove("active");
  document.getElementById("valueToColorBtn").classList.add("active");
  document.getElementById("colorToValueBtn").classList.remove("active");
};

document.getElementById("colorToValueBtn").onclick = () => {
  document.getElementById("colorToValue").classList.add("active");
  document.getElementById("valueToColor").classList.remove("active");
  document.getElementById("colorToValueBtn").classList.add("active");
  document.getElementById("valueToColorBtn").classList.remove("active");
};
