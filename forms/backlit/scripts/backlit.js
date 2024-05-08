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


  function backlit() {
    // Variables to store element references
    const quantityInput = document.getElementById("tab3quantity");
    const imageInput = document.getElementById("tab3image");
    const ajaxPriceInput = document.getElementById("tab3ajaxPrice");
    const material15ozCheckbox = document.getElementById("tab3material15oz");
    const lengthFeetInput = document.getElementById("tab3length-feet");
    const lengthInchInput = document.getElementById("tab3length-inch");
    const widthFeetInput = document.getElementById("tab3width-feet");
    const widthInchInput = document.getElementById("tab3width-inch");
    const bleedInput = document.getElementById("tab3bleed");
    const hemSwitchCheckbox = document.getElementById("tab3hemSwitch");
    const straightcutedgeSwitchCheckbox = document.getElementById(
      "tab3straightcutedgeSwitch"
    );
  
    const proofSwitchCheckbox = document.getElementById("tab3proofSwitch");
  
    const artServiceSwitchCheckbox = document.getElementById(
      "tab3artServiceSwitch"
    );
    const orderNotesTextarea = document.getElementById("tab3orderNotes");
  
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
  
    function calculateAJAXPrice() {
      // Get input values
      const quantity = parseFloat(quantityInput.value);
      const material15oz = material15ozCheckbox.checked;
      const proofSwitch = proofSwitchCheckbox.checked;
      const artServiceSwitch = artServiceSwitchCheckbox.checked;
      const totalSqFt = calculateTotalSquareFeet();
  
      let bpo15,
        basePrice = 0;
  
      // Calculate base price
      if (totalSqFt >= 50 && totalSqFt <= 199) {
        bpo15 = 4.38;
      } else if (totalSqFt >= 200 && totalSqFt <= 1200) {
        bpo15 = 3.28;
      } else if (totalSqFt > 1200) {
        bpo15 = 3.28;
      } else {
        bpo15 = 0;
      }
  
      const basePrice15oz = bpo15 * totalSqFt;
  
      basePrice = material15oz ? basePrice15oz : basePrice;
  
      // Apply upgrades
      const proof = basePrice + 5;
      basePrice = proofSwitch ? proof : basePrice;
  
      const artServiceCost = basePrice + 95;
      basePrice = artServiceSwitch ? artServiceCost : basePrice;
  
      basePrice = basePrice * quantity;
  
      const ajaxPrice = basePrice;
  
      // Display the AJAX price
      ajaxPriceInput.value = ajaxPrice.toFixed(2);
    }
    // Adjust the rate according to your shipping cost calculation
  
    function showShippingText() {
      let bleed = 0;
  
      bleed = bleedInput.value === "" ? 0 : parseFloat(bleedInput.value);
  
      const length = calculateLengthInInches() + (bleed*2);
      const width = calculateWidthInInches() + (bleed*2);
  
      if (length > 106 || width > 106) {
        return "Note: This order will be shipped in a larger freight truck and will be charged differently. Shortly, one of our representatives will be emailing you with the additional shipping charges.";
      } else {
        return "";
      }
    }
    function calculateShippingCost(material) {
      const totalSqFt = calculateTotalSquareFeet();
      console.log(totalSqFt);
  
      // Minimum shipping cost
      const minShippingCost = 25;
      // Shipping rates per material
      const rate36 = 0.36;
      // Calculate total shipping cost
      let shippingCost = 0;
      if (material === "15oz") {
        shippingCost = Math.max(totalSqFt * rate36, minShippingCost);
      } else {
        shippingCost = minShippingCost; // Consider the minimum shipping cost for other materials
      }
      return shippingCost;
    }
  
    function showOrderSummary() {
      // Collect all form field values
      const quantity = quantityInput.value;
      const image = imageInput.value;
      const ajaxPrice = ajaxPriceInput.value;
      const material15oz = material15ozCheckbox.checked ? "15oz" : "";
      const lengthFeet = lengthFeetInput.value;
      const lengthInch = lengthInchInput.value;
      const widthFeet = widthFeetInput.value;
      const widthInch = widthInchInput.value;
      const hemSwitch = hemSwitchCheckbox.checked ? "Yes" : "No";
      const straightcutedgeSwitch = straightcutedgeSwitchCheckbox.checked
        ? "Yes"
        : "No";
  
      const proofSwitch = proofSwitchCheckbox.checked ? "Yes" : "No";
  
      const artServiceSwitch = artServiceSwitchCheckbox.checked ? "Yes" : "No";
      const orderNotes = orderNotesTextarea.value;
      const shippingCost = calculateShippingCost(material15oz);
  
      // Calculate shipping cost based on material and total square footage
  
      // Calculate total price with shipping
      const basePriceWithShipping = parseFloat(ajaxPrice) + shippingCost;
  
      // Display the order details
      const shippingText = showShippingText();
  
      const option = `
      Image: ${image},
      Material: ${material15oz},
      Dimensions: Length - ${lengthFeet} feet ${lengthInch} inch, Width - ${widthFeet} feet ${widthInch} inch,
      Hem: ${hemSwitch},
      Straight Cut Edge: ${straightcutedgeSwitch},
      Proof: ${proofSwitch},
      Art Service: ${artServiceSwitch},
      Order Notes: ${orderNotes},
      AJAX Price: ${ajaxPrice},
      Shipping Cost: ${shippingCost.toFixed(2)},
      ${shippingText},
  `;
  

    // Create the price string
    const price = `Total Price (with shipping): ${basePriceWithShipping.toFixed(
      2
    )}`;

    // Get the HTML elements by their IDs
    const quantityElement = document.getElementById("tab3quantityvalue");
    const optionElement = document.getElementById("tab3option");
    const priceElement = document.getElementById("tab3pricing");

    // Update the HTML content with the calculated values
    quantityElement.innerHTML = `<p><strong>Quantity:</strong> ${quantity}</p>`;
    optionElement.innerHTML = `<p><strong>Option:</strong> ${option}</p>`;
    priceElement.innerHTML = `<p><strong>Price:</strong> ${price}</p>`;

    console.log(quantity);
    console.log(option);
    console.log(price);

    // Show the order summary
    document.getElementById("tab3orderSummary").style.display = "block";
  }    
  
    // Add event listener to the "Order Now" button
    document
      .getElementById("tab3orderNowBtn")
      .addEventListener("click", function () {
        // Calculate the AJAX price
        calculateAJAXPrice();
  
        // Show the order summary
        showOrderSummary();
      });
  
    // Add input event listeners to relevant form fields
    document
      .getElementById("tab3quantity")
      .addEventListener("input", calculateAJAXPrice);
    document
      .getElementById("tab3length-feet")
      .addEventListener("input", calculateAJAXPrice);
    document
      .getElementById("tab3length-inch")
      .addEventListener("input", calculateAJAXPrice);
    document
      .getElementById("tab3width-feet")
      .addEventListener("input", calculateAJAXPrice);
    document
      .getElementById("tab3width-inch")
      .addEventListener("input", calculateAJAXPrice);
    document
      .getElementById("tab3material15oz")
      .addEventListener("change", calculateAJAXPrice);
    document
      .getElementById("tab3bleed")
      .addEventListener("input", calculateAJAXPrice);
  
    document
      .getElementById("tab3proofSwitch")
      .addEventListener("change", calculateAJAXPrice);
  
    document
      .getElementById("tab3hemSwitch")
      .addEventListener("change", calculateAJAXPrice);
  
    document
      .getElementById("tab3straightcutedgeSwitch")
      .addEventListener("change", calculateAJAXPrice);
    //artServiceSwitch
    document
      .getElementById("tab3artServiceSwitch")
      .addEventListener("change", calculateAJAXPrice);
  
    // Initialize calculation on page load
    calculateAJAXPrice();
  }
  
  backlit();