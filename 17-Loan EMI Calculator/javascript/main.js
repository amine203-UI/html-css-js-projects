function calculateEMI() {
  let principal = parseFloat(document.getElementById("principal").value);
  let annualRate = parseFloat(document.getElementById("rate").value);
  let years = parseFloat(document.getElementById("years").value);

  if (
    isNaN(principal) ||
    isNaN(annualRate) ||
    isNaN(years) ||
    principal <= 0 ||
    annualRate <= 0 ||
    years <= 0
  ) {
    alert("⚠️ Please enter valid positive values.");
    return;
  }

  // Convert annual rate to monthly rate
  let monthlyRate = annualRate / 100 / 12;
  let months = years * 12;

  // EMI Formula
  let emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  // Fill result values
  document.getElementById("resPrincipal").innerText = principal.toFixed(2);
  document.getElementById("resRate").innerText = annualRate.toFixed(2);
  document.getElementById("resYears").innerText = years;
  document.getElementById("resEMI").innerText = emi.toFixed(2);

  // Show result with animation
  let resultDiv = document.getElementById("result");
  resultDiv.classList.remove("hidden");
  setTimeout(() => {
    resultDiv.classList.add("show");
  }, 50);
}
