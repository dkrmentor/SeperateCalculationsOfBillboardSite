function validateFeetInput(input) {
  // Remove any non-numeric characters
  let value = input.value.replace(/[^0-9]/g, "");

  // Update the input value with the cleaned value
  input.value = value;
}

function validateInchInput(input) {
  // Remove any non-numeric characters
  let value = input.value.replace(/[^0-9]/g, "");
  value = Math.min(value, 11); // Limit the value to 11

  // Update the input value with the cleaned value
  input.value = value;
}

function banner() {
  // Variables to store element references
  const quantityInput = document.getElementById("tab2quantity");
  const imageInput = document.getElementById("tab2image");
  const ajaxPriceInput = document.getElementById("tab2ajaxPrice");
  const material7ozCheckbox = document.getElementById("tab2material7oz");
  const material13ozCheckbox = document.getElementById("tab2material13oz");
  const material9ozCheckbox = document.getElementById("tab2material9oz");
  const lengthFeetInput = document.getElementById("tab2length-feet");
  const lengthInchInput = document.getElementById("tab2length-inch");
  const widthFeetInput = document.getElementById("tab2width-feet");
  const widthInchInput = document.getElementById("tab2width-inch");
  const hemSwitchCheckbox = document.getElementById("tab2hemSwitch");
  const grommetsSwitchCheckbox = document.getElementById("tab2grommetsSwitch");
  const polepocketCheckbox = document.getElementById("tab2polepocketSwitch");
  const straightcutedgeSwitchCheckbox = document.getElementById(
    "tab2straightcutedgeSwitch"
  );
  const webbingSwitchCheckbox = document.getElementById("tab2webbingSwitch");
  const proofSwitchCheckbox = document.getElementById("tab2proofSwitch");
  const hqPrintingSwitchCheckbox = document.getElementById(
    "tab2hqPrintingSwitch"
  );
  const expressPrintSwitchCheckbox = document.getElementById(
    "tab2expressPrintSwitch"
  );
  const artServiceSwitchCheckbox = document.getElementById(
    "tab2artServiceSwitch"
  );
  const orderNotesTextarea = document.getElementById("tab2orderNotes");

  function calculateLengthInInches() {
    const lengthFeet = parseFloat(lengthFeetInput.value);
    const lengthInch = parseFloat(lengthInchInput.value);
    return lengthFeet * 12 + lengthInch;
  }

  // Function to calculate width in inches
  function calculateWidthInInches() {
    const widthFeet = parseFloat(widthFeetInput.value);
    const widthInch = parseFloat(widthInchInput.value);
    return widthFeet * 12 + widthInch;
  }

  function calculateTotalSquareFeet() {
    const length = calculateLengthInInches();
    const width = calculateWidthInInches();
    return (length * width) / 144;
  }

  function calculateLengthInFeet() {
    const length = calculateLengthInInches();
    const lengthInFeet = parseFloat((length / 12).toFixed(2));
    return lengthInFeet;
  }

  function calculateWidthInFeet() {
    const width = calculateWidthInInches();
    const widthInFeet = parseFloat((width / 12).toFixed(2));
    return widthInFeet;
  }

  function calculateGrommetCount() {
    const lengthInFeet = calculateLengthInFeet();
    const widthInFeet = calculateWidthInFeet();
    const grommetslen = (lengthInFeet / 2 + 1).toFixed(2);
    const grommetswid = (widthInFeet / 2 - 1).toFixed(2);
    const grommetsCount =
      (parseFloat(grommetslen) + parseFloat(grommetswid)) * 2;
    return Math.ceil(grommetsCount / 2) * 2;
  }

  function calculateAJAXPrice() {
    // Get input values
    const quantity = parseFloat(quantityInput.value);
    const material7oz = material7ozCheckbox.checked;
    const material13oz = material13ozCheckbox.checked;
    const material9oz = material9ozCheckbox.checked;
    const grommetsSwitch = grommetsSwitchCheckbox.checked;
    const webbingSwitch = webbingSwitchCheckbox.checked;
    const proofSwitch = proofSwitchCheckbox.checked;
    const hqPrintingSwitch = hqPrintingSwitchCheckbox.checked;
    const expressPrintSwitch = expressPrintSwitchCheckbox.checked;
    const artServiceSwitch = artServiceSwitchCheckbox.checked;
    const totalSqFt = calculateTotalSquareFeet();

    let bpo7,
      bpo13,
      bpo9,
      basePrice = 0;

    // Calculate base price
    if (totalSqFt <= 100) {
      bpo7 = 0.99;
      bpo13 = 1.13;
      bpo9 = totalSqFt <= 99 ? 1.43 : 1.17;
    } else if (totalSqFt >= 101 && totalSqFt <= 287) {
      bpo7 = 0.84;
      bpo13 = 0.98;
      bpo9 = 1.17;
    } else if (totalSqFt >= 288 && totalSqFt <= 671) {
      bpo7 = 0.82;
      bpo13 = 0.96;
      bpo9 = 1.17;
    } else if (totalSqFt >= 672) {
      bpo7 = 0.8;
      bpo13 = 0.94;
      bpo9 = 1.17;
    } else {
      bpo7 = 0;
      bpo13 = 0;
      bpo9 = 0;
    }

    const basePrice7oz = bpo7 * totalSqFt;
    const basePrice13oz = bpo13 * totalSqFt;
    const basePrice9oz = bpo9 * totalSqFt;

    // Choose pricing based on material
    basePrice = material7oz ? basePrice7oz : basePrice;
    basePrice = material13oz ? basePrice13oz : basePrice;
    basePrice = material9oz ? basePrice9oz : basePrice;

    const lengthInFeet = calculateLengthInFeet();
    const widthInFeet = calculateWidthInFeet();

    const webbing = (lengthInFeet + widthInFeet) * 2 * 1.25 + basePrice;
    basePrice = webbingSwitch ? webbing : basePrice;

    const grommetsCount = calculateGrommetCount();
    const roundedGrommetsCount = Math.ceil((grommetsCount / 2) * 2);
    const grommets = basePrice + roundedGrommetsCount * 0.75;
    basePrice = grommetsSwitch ? grommets : basePrice;

    // Apply HQ Printing
    const hqPrinting = totalSqFt * 0.2 + basePrice; // Adjust the cost as needed
    basePrice = hqPrintingSwitch ? hqPrinting : basePrice;

    const expressPrintCost = Math.max(totalSqFt * 0.05, 7.5) + basePrice;
    basePrice = expressPrintSwitch ? expressPrintCost : basePrice;

    const artServiceCost = basePrice + 95;
    basePrice = artServiceSwitch ? artServiceCost : basePrice;
    // Apply upgrades
    const proof = basePrice + 5;
    basePrice = proofSwitch ? proof : basePrice;
    basePrice = basePrice * quantity;
    const ajaxPrice = basePrice;

    // Display the AJAX price
    ajaxPriceInput.value = ajaxPrice.toFixed(2);
  }

  function calculateShippingCost(material) {
    const totalSqFt = calculateTotalSquareFeet();

    // Minimum shipping cost
    const minShippingCost = 25;
    // Shipping rates per material
    const rate12 = 0.12;
    const rate15 = 0.15;
    // Calculate total shipping cost
    let shippingCost = 0;

    if (material === "7oz" || material === "9oz") {
      shippingCost = Math.max(totalSqFt * rate12, minShippingCost);
    } else if (material === "13oz") {
      shippingCost = Math.max(totalSqFt * rate15, minShippingCost);
    }

    return shippingCost;
  }

  function showOrderSummary() {
    // Collect all form field values
    const quantity = quantityInput.value;
    const image = imageInput.value;
    const ajaxPrice = ajaxPriceInput.value;
    const material7oz = material7ozCheckbox.checked ? "7oz" : "";
    const material13oz = material13ozCheckbox.checked ? "13oz" : "";
    const material9oz = material9ozCheckbox.checked ? "9oz" : "";
    const lengthFeet = lengthFeetInput.value;
    const lengthInch = lengthInchInput.value;
    const widthFeet = widthFeetInput.value;
    const widthInch = widthInchInput.value;
    const hemSwitch = hemSwitchCheckbox.checked ? "Yes" : "No";
    const grommetsSwitch = grommetsSwitchCheckbox.checked ? "Yes" : "No";
    const polepocketSwitch = polepocketCheckbox.checked ? "Yes" : "No";
    const straightcutedgeSwitch = straightcutedgeSwitchCheckbox.checked
      ? "Yes"
      : "No";
    const webbingSwitch = webbingSwitchCheckbox.checked ? "Yes" : "No";

    const proofSwitch = proofSwitchCheckbox.checked ? "Yes" : "No";
    const hqPrintingSwitch = hqPrintingSwitchCheckbox.checked ? "Yes" : "No";
    const expressPrintSwitch = expressPrintSwitchCheckbox.checked
      ? "Yes"
      : "No";
    const artServiceSwitch = artServiceSwitchCheckbox.checked ? "Yes" : "No";
    const orderNotes = orderNotesTextarea.value;

    // Calculate shipping cost based on material and total square footage
    const shippingCost = calculateShippingCost(
      material7oz ? "7oz" : material13oz ? "13oz" : "",
      calculateTotalSquareFeet()
    );

    // Calculate total price with shipping
    const basePriceWithShipping = parseFloat(ajaxPrice) + shippingCost;

    const grommetsCount = calculateGrommetCount();

    // Display the order details
    const option = `
      Image: ${image},
      Material: ${material7oz} ${material13oz} ${material9oz},
      Dimensions: Length - ${lengthFeet} feet ${lengthInch} inch, Width - ${widthFeet} feet ${widthInch} inch,
      Hem: ${hemSwitch},
      Grommets: ${grommetsSwitch},
      Grommets Count: ${grommetsCount},
      Pole Pocket: ${polepocketSwitch},
      Straight Cut Edge: ${straightcutedgeSwitch},
      Webbing: ${webbingSwitch},
      Proof: ${proofSwitch},
      HQ Printing: ${hqPrintingSwitch},
      Express Print: ${expressPrintSwitch},
      Art Service: ${artServiceSwitch},
      Order Notes: ${orderNotes},
      AJAX Price: ${ajaxPrice},
      Shipping Cost: ${shippingCost.toFixed(2)}
  `;

    // Create the price string
    const price = `Total Price (with shipping): ${basePriceWithShipping.toFixed(
      2
    )}`;

    // Get the HTML elements by their IDs
    const quantityElement = document.getElementById("tab2quantityvalue");
    const optionElement = document.getElementById("tab2option");
    const priceElement = document.getElementById("tab2pricing");

    // Update the HTML content with the calculated values
    quantityElement.innerHTML = `<p><strong>Quantity:</strong> ${quantity}</p>`;
    optionElement.innerHTML = `<p><strong>Option:</strong> ${option}</p>`;
    priceElement.innerHTML = `<p><strong>Price:</strong> ${price}</p>`;

    console.log(quantity);
    console.log(option);
    console.log(price);

    // Show the order summary
    document.getElementById("tab2orderSummary").style.display = "block";
  }

  // Add event listener to the "Order Now" button
  document
    .getElementById("tab2orderNowBtn")
    .addEventListener("click", function () {
      // Calculate the AJAX price
      calculateAJAXPrice();

      // Show the order summary
      showOrderSummary();
    });

  // Add input event listeners to relevant form fields
  document
    .getElementById("tab2quantity")
    .addEventListener("input", calculateAJAXPrice);
  document
    .getElementById("tab2length-feet")
    .addEventListener("input", calculateAJAXPrice);
  document
    .getElementById("tab2length-inch")
    .addEventListener("input", calculateAJAXPrice);
  document
    .getElementById("tab2width-feet")
    .addEventListener("input", calculateAJAXPrice);
  document
    .getElementById("tab2width-inch")
    .addEventListener("input", calculateAJAXPrice);
  //material7oz
  document
    .getElementById("tab2material7oz")
    .addEventListener("change", calculateAJAXPrice);
  document
    .getElementById("tab2material13oz")
    .addEventListener("change", calculateAJAXPrice);
  document
    .getElementById("tab2material9oz")
    .addEventListener("change", calculateAJAXPrice);
  document
    .getElementById("tab2proofSwitch")
    .addEventListener("change", calculateAJAXPrice);
  document
    .getElementById("tab2hqPrintingSwitch")
    .addEventListener("change", calculateAJAXPrice);
  document
    .getElementById("tab2expressPrintSwitch")
    .addEventListener("change", calculateAJAXPrice);
  document
    .getElementById("tab2artServiceSwitch")
    .addEventListener("change", calculateAJAXPrice);
  document
    .getElementById("tab2hemSwitch")
    .addEventListener("change", calculateAJAXPrice);
  document
    .getElementById("tab2grommetsSwitch")
    .addEventListener("change", calculateAJAXPrice);
  document
    .getElementById("tab2polepocketSwitch")
    .addEventListener("change", calculateAJAXPrice);
  document
    .getElementById("tab2straightcutedgeSwitch")
    .addEventListener("change", calculateAJAXPrice);
  document
    .getElementById("tab2webbingSwitch")
    .addEventListener("change", calculateAJAXPrice);

  // Initialize calculation on page load
  calculateAJAXPrice();
}

banner();
