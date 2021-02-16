// EVENT LISTENERS

document
  .getElementById("main_box_button")
  .addEventListener("click", calculateSalaryNet);
document
  .getElementById("pop_up_box_button")
  .addEventListener("click", resetSalary);

// VARIABLES GLOBAL

var salaryGross = document.querySelector("#main_box_input");
var checkBox = document.getElementById("main_box_bonus");
var untaxable = 375.95;
var minimumSalary = 623;
var data = [];

// FUNCTIONS

function calculateSalaryNet() {
  // Conditions
  if (salaryGross.value === "") {
    alert("Zadajte váš plat číslom v eurách.");
  } else if (salaryGross.value < minimumSalary) {
    alert(
      `Zadajte hodnotu, ktorá je vyššia alebo rovná minimálnej mzde ${minimumSalary} Eur.`
    );
  } else {
    document.getElementById("pop_up").style.visibility = "visible";
    document.getElementById("hruba_mzda").innerHTML =
      salaryGross.value + " Eur";

    // Calculation Function Calls
    var insuranceTotal = calculateInsurance(salaryGross.value);
    var taxTotal = calculateTax(insuranceTotal);

    // Salary Net Calculation
    var salaryNet = parseInt(salaryGross.value) - insuranceTotal - taxTotal;

    // Push to the Array
    data.push(
      {
        item: insuranceTotal,
        color: "rgb(0, 162, 232)",
        name: "ODVODY",
      },
      { item: taxTotal, color: "rgb(237, 28, 36)", name: "DAŇ Z PRÍJMU" },
      { item: salaryNet, color: "rgb(18, 191, 40)", name: "ČISTÁ MZDA" }
    );

    // Salary Net Output
    document.getElementById("čistá").innerHTML =
      salaryNet.toFixed(2) + " " + "€";
  }

  // Draw Function
  drawChart();
}

// CALCULATE INSURANCE

function calculateInsurance(grossSalary) {
  // Variables
  let starobne = grossSalary * 0.04;
  let invalidne = grossSalary * 0.03;
  let nemocenske = grossSalary * 0.014;
  let nezam = grossSalary * 0.01;
  let zdravotne = grossSalary * 0.04;
  let zamestnanec = starobne + invalidne + nemocenske + nezam + zdravotne;
  // Output
  document.getElementById("zamestnanec").innerHTML =
    zamestnanec.toFixed(2) + " " + "€";
  document.getElementById("starobne").innerHTML =
    starobne.toFixed(2) + " " + "€";
  document.getElementById("invalidne").innerHTML =
    invalidne.toFixed(2) + " " + "€";
  document.getElementById("nemocenske").innerHTML =
    nemocenske.toFixed(2) + " " + "€";
  document.getElementById("nezamestnanosti").innerHTML =
    nezam.toFixed(2) + " " + "€";
  document.getElementById("zdravotne").innerHTML =
    zdravotne.toFixed(2) + " " + "€";

  return zamestnanec;
}

// CALCULATE TAX

function calculateTax(TotalInsurance) {
  // Variables
  var tax;
  // Conditions
  if (checkBox.checked == true) {
    tax = (salaryGross.value - TotalInsurance - untaxable) * 0.19;
  } else if (checkBox.checked == false) {
    tax = (salaryGross.value - TotalInsurance) * 0.19;
  }
  // Output
  document.getElementById("daň").innerHTML = tax.toFixed(2) + " " + "€";

  return tax;
}

// DRAW FUNCTION

function drawChart() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 850;
  canvas.height = 800;
  ctx.fillStyle = "rgba(239, 239, 239, 1)"; // POZADIE SEDA
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let total = data.reduce((a, b) => {
    return a + b.item;
  }, 0);

  let startAngle = 0;
  let radius = 250;
  let cx = canvas.width / 2;
  let cy = canvas.height / 2;

  // Draw the charts
  data.forEach((chart) => {
    // Setting the style
    ctx.fillStyle = chart.color;
    ctx.lineWidth = "0.05";
    ctx.beginPath();
    // draw the charts
    let endAngle = (chart.item / total) * Math.PI * 2 + startAngle;
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, endAngle, false);
    ctx.lineTo(cx, cy);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    // Adding labels
    ctx.beginPath();
    ctx.font = "30px Helvetica, Calibri";
    ctx.textAlign = "center";
    ctx.fillStyle = "rebeccapurple";
    let theta = (startAngle + endAngle) / 2;
    let deltaY = Math.sin(theta) * 1.5 * radius;
    let deltaX = Math.cos(theta) * 1.5 * radius;
    ctx.fillText(chart.name, deltaX + cx, deltaY + cy);
    ctx.closePath();
    startAngle = endAngle;
  });
}

// RESET

function resetSalary() {
  // Hide
  document.getElementById("pop_up").style.visibility = "hidden";
  // Reset the values
  salaryGross.value = "";
  data = [];
  document.getElementById("main_box_bonus").checked = false;
}
