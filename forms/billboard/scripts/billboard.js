function validateFeetInput(input) {
  // Remove any non-numeric characters
  let value = input.value.replace(/[^0-9]/g, '');

  // Update the input value with the cleaned value
  input.value = value;
}

function validateInchInput(input) {
  // Remove any non-numeric characters
  let value = input.value.replace(/[^0-9]/g, '');
  value = Math.min(value, 11); // Limit the value to 11

  // Update the input value with the cleaned value
  input.value = value;
}






function billboard() {
  // Variables to store element references
  const quantityInput = document.getElementById('tab1quantity');
  const imageInput = document.getElementById('tab1image');
  const ajaxPriceInput = document.getElementById('tab1ajaxPrice');
  const material7ozCheckbox = document.getElementById('tab1material7oz');
  const material13ozCheckbox = document.getElementById('tab1material13oz');
  const lengthFeetInput = document.getElementById('tab1length-feet');
  const lengthInchInput = document.getElementById('tab1length-inch');
  const widthFeetInput = document.getElementById('tab1width-feet');
  const widthInchInput = document.getElementById('tab1width-inch');
  const proofSwitchCheckbox = document.getElementById('tab1proofSwitch');
  const hqPrintingSwitchCheckbox = document.getElementById('tab1hqPrintingSwitch');
  const expressPrintSwitchCheckbox = document.getElementById('tab1expressPrintSwitch');
  const artServiceSwitchCheckbox = document.getElementById('tab1artServiceSwitch');
  const orderNotesTextarea = document.getElementById('tab1orderNotes');

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

  // Function to calculate and update AJAX price
  function calculateAJAXPrice() {
    // Get input values
    const quantity = parseFloat(quantityInput.value);
    const material7oz = material7ozCheckbox.checked;
    const material13oz = material13ozCheckbox.checked;
    const proofSwitch = proofSwitchCheckbox.checked;
    const hqPrintingSwitch = hqPrintingSwitchCheckbox.checked;
    const expressPrintSwitch = expressPrintSwitchCheckbox.checked;
    const artServiceSwitch = artServiceSwitchCheckbox.checked;

    const totalSqFt = calculateTotalSquareFeet();

    let bpo7, bpo13, basePrice = 0;
    // Calculate base price
    if (totalSqFt <= 287) {
      bpo7 = 0.74;
      bpo13 = 0.89;
    } else if (totalSqFt >= 288 && totalSqFt <= 671) {
      bpo7 = 0.69;
      bpo13 = 0.79;
    } else if (totalSqFt >= 672) {
      bpo7 = 0.59;
      bpo13 = 0.69;
    } else {
      bpo7 = 0;
      bpo13 = 0;
    }

    const basePrice7oz = bpo7 * totalSqFt;
    const basePrice13oz = bpo13 * totalSqFt;
    // Choose pricing based on material
    basePrice = material7oz ? basePrice7oz : basePrice;
    basePrice = material13oz ? basePrice13oz : basePrice;

    // Apply upgrades
    const proof = basePrice + 5;
    basePrice = proofSwitch ? proof : basePrice;

    // Apply HQ Printing
    const hqPrinting = totalSqFt * 0.20 + basePrice; // Adjust the cost as needed
    basePrice = hqPrintingSwitch ? hqPrinting : basePrice;

    const expressPrintCost = Math.max(totalSqFt * 0.05, 7.5) + basePrice;
    basePrice = expressPrintSwitch ? expressPrintCost : basePrice;

    const artServiceCost = basePrice + 95;
    basePrice = artServiceSwitch ? artServiceCost : basePrice;

    basePrice = basePrice * quantity;

    const ajaxPrice = basePrice;

    // Display the AJAX price
    ajaxPriceInput.value = ajaxPrice.toFixed(2);
  }

  function calculateShippingCost(material) {
    const totalSqFt = calculateTotalSquareFeet();
    console.log(totalSqFt);
    // Minimum shipping cost
    const minShippingCost = 25;
    // Shipping rates per material
    const rate7oz = 0.12;
    const rate13oz = 0.15;
    // Calculate total shipping cost
    let shippingCost = 0;
    if (material === '7oz') {
      shippingCost = Math.max(totalSqFt * rate7oz, minShippingCost);
    } else if (material === '13oz') {
      shippingCost = Math.max(totalSqFt * rate13oz, minShippingCost);
    }
    return shippingCost;
  }

  function showOrderSummary() {
    // Collect all form field values
    const quantity = quantityInput.value;
    const image = imageInput.value;
    const ajaxPrice = ajaxPriceInput.value;
    const material7oz = material7ozCheckbox.checked ? '7oz' : '';
    const material13oz = material13ozCheckbox.checked ? '13oz' : '';
    const lengthFeet = lengthFeetInput.value;
    const lengthInch = lengthInchInput.value;
    const widthFeet = widthFeetInput.value;
    const widthInch = widthInchInput.value;
    const bleedSwitch = document.getElementById('tab1bleedSwitch').checked ? 'Yes' : 'No';
    const proofSwitch = proofSwitchCheckbox.checked ? 'Yes' : 'No';
    const hqPrintingSwitch = hqPrintingSwitchCheckbox.checked ? 'Yes' : 'No';
    const expressPrintSwitch = expressPrintSwitchCheckbox.checked ? 'Yes' : 'No';
    const artServiceSwitch = artServiceSwitchCheckbox.checked ? 'Yes' : 'No';
    const orderNotes = orderNotesTextarea.value;

    // Calculate shipping cost based on material and total square footage
    const shippingCost = calculateShippingCost(material7oz || material13oz);

    // Calculate total price with shipping
    const basePriceWithShipping = parseFloat(ajaxPrice) + shippingCost;

    // Construct the option string
    const option = `
        Image: ${image},
        Dimensions: Length - ${lengthFeet} feet ${lengthInch} inch, Width - ${widthFeet} feet ${widthInch} inch,
        Includes Bleed: ${bleedSwitch},
        Proof: ${proofSwitch},
        Order Notes: ${orderNotes},
        Material: ${material7oz} ${material13oz},
        HQ Printing: ${hqPrintingSwitch},
        Express Print: ${expressPrintSwitch},
        Art Service: ${artServiceSwitch},
        Ajax Price: ${ajaxPrice},
        Shipping Cost: ${shippingCost.toFixed(2)}
    `;

    // Create the price string
    const price =
      `Total Price (with shipping): ${basePriceWithShipping.toFixed(2)}`;

    // Get the HTML elements by their IDs
    const quantityElement = document.getElementById('tab1quantityvalue');
    const optionElement = document.getElementById('tab1option');
    const priceElement = document.getElementById('tab1pricing');

    // Update the HTML content with the calculated values
    quantityElement.innerHTML = `<p><strong>Quantity:</strong> ${quantity}</p>`;
    optionElement.innerHTML = `<p><strong>Option:</strong> ${option}</p>`;
    priceElement.innerHTML = `<p><strong>Price:</strong> ${price}</p>`;



    console.log(quantity);
    console.log(option);
    console.log(price);



    // Show the order summary
    document.getElementById('tab1orderSummary').style.display = 'block';


  }

  // Add event listener to the "Order Now" button
  document.getElementById('tab1orderNowBtn').addEventListener('click', function () {
    // Calculate the AJAX price
    calculateAJAXPrice();

    // Show the order summary
    showOrderSummary();
  });

  // Add input event listeners to relevant form fields
  document.getElementById('tab1quantity').addEventListener('input', calculateAJAXPrice);

  document.getElementById('tab1length-feet').addEventListener('input', calculateAJAXPrice);
  document.getElementById('tab1length-inch').addEventListener('input', calculateAJAXPrice);
  document.getElementById('tab1width-feet').addEventListener('input', calculateAJAXPrice);
  document.getElementById('tab1width-inch').addEventListener('input', calculateAJAXPrice);
  //material7oz
  document.getElementById('tab1material7oz').addEventListener('change', calculateAJAXPrice);
  document.getElementById('tab1material13oz').addEventListener('change', calculateAJAXPrice);

  document.getElementById('tab1proofSwitch').addEventListener('change', calculateAJAXPrice);
  document.getElementById('tab1hqPrintingSwitch').addEventListener('change', calculateAJAXPrice);

  document.getElementById('tab1expressPrintSwitch').addEventListener('change', calculateAJAXPrice);
  document.getElementById('tab1artServiceSwitch').addEventListener('change', calculateAJAXPrice);

  // Initialize calculation on page load
  calculateAJAXPrice();
}

billboard();
