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


  
  function disable6mm() {
    document.addEventListener('DOMContentLoaded', function () {
        // Get the quantity and 6mm radio button elements
        var quantitySelect = document.getElementById('tab4quantity');
        var radio6mm = document.getElementById('tab4material6mm');

        // Add an event listener to the quantity select element
        quantitySelect.addEventListener('change', function () {
            // Get the selected quantity value
            var selectedQuantity = parseInt(quantitySelect.value);

            // Disable the 6mm radio button if the quantity is 300, 400, or 500; otherwise, enable it
            if (selectedQuantity === 300 || selectedQuantity === 400 || selectedQuantity === 500) {
                radio6mm.disabled = true;
            } else {
                radio6mm.disabled = false;
            }
        });
    });
  }
  disable6mm();


function yards() {
  // Variables to store element references
  const quantityInput = document.getElementById('tab4quantity');
  const imageInput = document.getElementById('tab4image');
  const ajaxPriceInput = document.getElementById('tab4ajaxPrice');
  const dimensionInput = document.getElementById('tab4dimension');
  const material4mmCheckbox = document.getElementById('tab4material4mm');
  const material6mmCheckbox = document.getElementById('tab4material6mm');
  const proofSwitchCheckbox = document.getElementById('tab4proofSwitch');
  const verticleFlutesSwitchCheckbox = document.getElementById('tab4verticleFlutesSwitch');
  const grommetsSwitchCheckbox = document.getElementById('tab4grommetsSwitch');
  const hStakesSwitchCheckbox = document.getElementById('tab4hStakesSwitch');
  const artServiceSwitchCheckbox = document.getElementById('tab4artServiceSwitch');
  const orderNotesTextarea = document.getElementById('tab4orderNotes');

  // Function to calculate and update AJAX price
  function calculateAJAXPrice() {
    // Get input values
    const quantity = quantityInput.value;
    const dimension = dimensionInput.value;
    const proofSwitch = proofSwitchCheckbox.checked;
    const grommetsSwitch = grommetsSwitchCheckbox.checked;
    const hStakesSwitch = hStakesSwitchCheckbox.checked;
    const material4mm = material4mmCheckbox.checked;
    const material6mm = material6mmCheckbox.checked;


    let material = material4mm ? '4mm' : (material6mm ? '6mm' : '4mm');  // Default to '4mm' if neither is selected



    let basePrice = calculatePriceForDimension(dimension, quantity, material);

    const proof = basePrice + 5 * quantity;
    basePrice = proofSwitch ? proof : basePrice;

    const hStakes = basePrice + 1.5 * quantity;
    basePrice = hStakesSwitch ? hStakes : basePrice;

    const grommets = basePrice + 3 * quantity;
    basePrice = grommetsSwitch ? grommets : basePrice;

    const artServiceCost = basePrice + 95 * quantity;
    basePrice = artServiceSwitchCheckbox.checked ? artServiceCost : basePrice;

    const ajaxPrice = basePrice;

    // Display the AJAX price
    ajaxPriceInput.value = ajaxPrice.toFixed(2);
  }
  function calculateShippingCost(dimension, hStakesSwitch) {
    console.log("dimension", dimension);
    console.log("hStakesSwitch", hStakesSwitch);
    const quantity = quantityInput.value;

    // Minimum shipping cost
    const minShippingCost = 25;
    // Shipping rates per material
    const rate40 = 0.40;
    const rate50 = 0.55;
    // Calculate total shipping cost
    let shippingCost = 0;
    console.log("shippingCost", shippingCost);

    console.log(quantity);
    console.log("dd", dimension);
    console.log("hStakesSwitch", hStakesSwitch);

    if (hStakesSwitch = "true") {
        shippingCost = 0.25 * quantity;
    }

    // Move this block after the hStakesSwitch check
    if (dimension === '18x24') {
        shippingCost = Math.max((quantity * rate40)+shippingCost, minShippingCost);
    } else if (dimension === '24x36') {
        shippingCost = Math.max((quantity * rate50)+shippingCost, minShippingCost);
    } else {
        shippingCost = minShippingCost;
    }

    return shippingCost;
}


  function showOrderSummary() {
    // Collect all form field values
    const quantity = quantityInput.value;
    const image = imageInput.value;
    const ajaxPrice = ajaxPriceInput.value;
    const proofSwitch = proofSwitchCheckbox.checked ? 'Yes' : 'No';
    const artServiceSwitch = artServiceSwitchCheckbox.checked ? 'Yes' : 'No';
    const orderNotes = orderNotesTextarea.value;

    // Calculate shipping cost based on material and total square footage
    const shippingCost = calculateShippingCost(dimensionInput.value,hStakesSwitchCheckbox.checked);

    // Calculate total price with shipping
    const basePriceWithShipping = parseFloat(ajaxPrice) + shippingCost;

    const option = `
    Image: ${image},
    Proof: ${proofSwitch},
    Art Service: ${artServiceSwitch},
    Order Notes: ${orderNotes},
    AJAX Price: ${ajaxPrice},
    Shipping Cost: ${shippingCost.toFixed(2)},
`;


    const price = `Total Price (with shipping): ${basePriceWithShipping.toFixed(
      2
    )}`;

    // Get the HTML elements by their IDs
    const quantityElement = document.getElementById("tab4quantityvalue");
    const optionElement = document.getElementById("tab4option");
    const priceElement = document.getElementById("tab4pricing");

    // Update the HTML content with the calculated values
    quantityElement.innerHTML = `<p><strong>Quantity:</strong> ${quantity}</p>`;
    optionElement.innerHTML = `<p><strong>Option:</strong> ${option}</p>`;
    priceElement.innerHTML = `<p><strong>Price:</strong> ${price}</p>`;

    console.log(quantity);
    console.log(option);
    console.log(price);

    // Show the order summary
    document.getElementById("tab4orderSummary").style.display = "block";
  }

  // Add event listener to the "Order Now" button
  document.getElementById('tab4orderNowBtn').addEventListener('click', function () {
    // Calculate the AJAX price
    calculateAJAXPrice();

    // Show the order summary
    showOrderSummary();
  });

  // Add input event listeners to relevant form fields
  document.getElementById('tab4quantity').addEventListener('input', calculateAJAXPrice);
  document.getElementById('tab4image').addEventListener('input', calculateAJAXPrice);
  document.getElementById('tab4ajaxPrice').addEventListener('input', calculateAJAXPrice);
  document.getElementById('tab4dimension').addEventListener('input', calculateAJAXPrice);
  document.getElementById('tab4material4mm').addEventListener('change', calculateAJAXPrice);
  document.getElementById('tab4material6mm').addEventListener('change', calculateAJAXPrice);
  document.getElementById('tab4verticleFlutesSwitch').addEventListener('change', calculateAJAXPrice);
  document.getElementById('tab4grommetsSwitch').addEventListener('change', calculateAJAXPrice);
  document.getElementById('tab4hStakesSwitch').addEventListener('change', calculateAJAXPrice);
  document.getElementById('tab4proofSwitch').addEventListener('change', calculateAJAXPrice);
  document.getElementById('tab4artServiceSwitch').addEventListener('change', calculateAJAXPrice);

  // Initialize calculation on page load
  calculateAJAXPrice();
}

yards();

function calculatePriceForDimension(dimension, quantity, material) {
  const prices = {
    '4mm': {
        '18x24': [9.70, 16.13, 22.90, 29.67, 36.45, 43.23, 49.99, 56.77, 63.54, 70.31, 71.20, 77.68, 84.15, 90.63, 92.23, 98.39, 104.54, 110.69, 116.83, 122.99, 174.77, 220.08, 258.92, 291.29, 317.17, 362.48, 407.79, 389, 679.64, 922.40, 1383.60, 1844.80, 2306.00],
        '24x36': [18.43, 33.67, 48.92, 64.18, 64.73, 77.68, 90.63, 103.57, 116.52, 129.45, 142.40, 155.34, 168.29, 181.24, 184.48, 196.78, 209.07, 221.37, 233.67, 245.97, 349.54, 440.15, 517.83, 582.57, 634.35, 724.98, 815.59, 906.21, 1359.31, 1751.73, 2627.60, 3503.47, 4379.33],
        '24x24': [11.88, 20.59, 29.30, 38.00, 46.72, 55.43, 64.14, 72.85, 77.68, 86.31, 94.93, 103.57, 112.20, 120.83, 122.96, 131.18, 139.39, 147.58, 155.78, 163.98, 186.42, 234.75, 345.22, 388.38, 422.90, 483.31, 543.73, 604.14, 906.21, 1146.26, 1719.39, 2292.52, 2865.65],
        '12x18': [6.47, 9.69, 13.20, 16.70, 20.20, 23.69, 27.20, 30.70, 34.20, 37.69, 41.20, 44.70, 48.20, 51.71, 55.20, 58.70, 62.19, 65.70, 69.20, 72.70, 93.04, 114.48, 130.18, 155.67, 172.61, 196.87, 215.06, 238.65, 343.28, 485.46, 728.19, 970.92, 1213.65],
        '24x32': [14.74, 25.57, 37.42, 48.84, 60.26, 71.69, 80.51, 92.03, 103.53, 115.03, 126.58, 138.04, 149.54, 161.04, 172.54, 184.05, 195.55, 207.05, 218.55, 230.05, 345.09, 460.12, 575.14, 690.17, 805.21, 920.24, 1035.26, 1150.29, 1725.45, 2021.44, 3030.80, 4042.87, 5053.59],
        '36x48': [32.24, 57.16, 80.46, 105.37, 130.28, 155.18, 180.10, 205.01, 222.70, 246.81, 270.92, 295.03, 319.13, 343.24, 367.35, 391.46, 375.75, 397.51, 419.27, 441.05, 603.29, 802.47, 922.37, 1095.38, 1276.99, 1458.61, 1640.21, 1821.81, 2712.66, 3614.98, 5422.46, 7229.95, 9037.44],
        '12x24': [10.87, 16.00, 21.14, 26.27, 31.40, 36.54, 41.67, 46.82, 50.75, 55.74, 60.75, 65.75, 70.75, 75.75, 80.76, 85.75, 88.49, 93.35, 98.23, 103.09, 151.77, 200.45, 242.45, 279.48, 325.09, 370.72, 416.34, 422.94, 614.34, 755.65, 1133.47, 1511.30, 1889.12],
        '24x48': [23.69, 41.66, 58.01, 75.44, 90.19, 107.08, 123.98, 140.87, 157.76, 174.66, 191.55, 208.44, 218.39, 234.75, 251.10, 267.46, 283.82, 300.19, 316.55, 332.90, 449.64, 597.60, 684.02, 809.35, 869.29, 992.66, 1160.02, 1239.38, 1839.00, 2450.12, 3675.17, 4900.23, 6125.29],
        '12x12': [8.73, 11.73, 15.21, 17.73, 20.72, 23.72, 27.20, 29.71, 32.71, 35.71, 39.19, 41.70, 44.70, 47.70, 51.18, 53.69, 55.55, 58.48, 61.88, 64.34, 93.65, 120.29, 148.93, 167.24, 194.16, 221.09, 248.01, 268.25, 382.31, 505.71, 758.57, 1011.42, 1264.28],
        '32x48': [29.39, 51.62, 74.57, 94.68, 116.92, 139.16, 161.39, 183.63, 205.86, 220.98, 242.50, 264.02, 285.55, 307.07, 328.60, 350.12, 371.66, 393.17, 375.14, 394.58, 589.02, 717.77, 825.30, 978.90, 1141.09, 1303.28, 1465.48, 1627.67, 2421.45, 3226.69, 4840.03, 6453.38, 8066.72],
    },
    '6mm': {
        '18x24': [17.63, 28.51, 39.39, 50.27, 61.16, 70.19, 80.76, 91.34, 101.91, 112.48, 119.66, 129.92, 140.20, 150.46, 160.73, 170.99, 181.26, 191.52, 201.78, 212.06, 314.71, 405.03, 504.60, 592.04, 636.28, 726.22, 816.14, 906.08, 1243.12, 1547.42],
        '24x36': [30.20, 53.65, 74.99, 97.74, 118.80, 139.04, 161.08, 183.13, 205.17, 227.23, 249.28, 271.32, 288.99, 310.70, 332.41, 354.12, 369.64, 390.99, 412.34, 433.69, 637.04, 796.34, 976.87, 1100.02, 1258.63, 1437.48, 1542.04, 1712.62, 2545.34, 3391.55],
        '24x24': [20.91, 35.09, 49.26, 63.44, 75.55, 89.32, 103.07, 116.84, 126.90, 140.25, 153.60, 166.94, 180.29, 193.64, 207.00, 220.35, 233.70, 247.05, 260.40, 273.75, 394.92, 524.31, 602.92, 710.03, 827.24, 944.45, 987.75, 1096.75, 1513.73, 2016.04],
        '12x18': [13.37, 19.98, 26.61, 33.22, 39.85, 46.47, 53.10, 59.71, 65.57, 72.12, 77.65, 84.09, 90.54, 96.98, 103.44, 109.88, 114.89, 121.26, 127.62, 133.97, 194.86, 257.57, 316.06, 365.78, 419.26, 478.20, 537.11, 587.61, 810.20, 1061.15],
        '24x32': [28.90, 51.06, 72.20, 92.72, 112.54, 133.69, 152.59, 173.42, 194.25, 215.10, 235.93, 256.76, 273.21, 293.71, 314.21, 334.71, 355.20, 375.71, 390.04, 410.22, 601.84, 755.06, 925.26, 1096.83, 1194.01, 1363.61, 1533.22, 1,629.46, 2420.60, 3225.23],
        '36x48': [47.24, 85.27, 120.83, 158.85, 196.88, 234.91, 272.94, 310.97, 337.89, 374.69, 411.48, 448.28, 485.07, 521.87, 558.66, 595.46, 580.46, 614.21, 647.96, 681.71, 945.28, 1258.12, 1463.16, 1742.30, 1812.87, 2070.89, 2328.90, 2899.33, 3856.79, 5764.96],
        '12x24': [14.34, 21.92, 29.52, 37.11, 44.70, 52.30, 59.89, 67.49, 73.22, 80.61, 87.99, 95.38, 102.76, 110.16, 117.54, 124.93, 128.82, 136.00, 143.18, 150.36, 222.17, 293.98, 355.51, 413.13, 480.86, 548.57, 616.30, 633.27, 926.29, 1150.69, 1719.39],
        '24x48': [34.07, 61.41, 86.28, 112.79, 135.19, 160.88, 186.57, 212.26, 237.95, 263.64, 289.33, 315.01, 330.01, 354.87, 379.74, 404.61, 429.48, 454.34, 479.21, 504.08, 691.82, 920.19, 1066.42, 1266.22, 1375.49, 1571.04, 1766.57, 1962.10, 2919.56, 3890.51],
        '12x12': [11.04, 15.35, 20.99, 23.95, 28.26, 32.55, 38.21, 41.16, 45.45, 49.76, 55.42, 58.36, 62.67, 66.97, 72.62, 75.57, 78.12, 82.32, 87.83, 90.72, 132.71, 170.59, 211.56, 240.38, 279.32, 318.25, 357.18, 385.84, 555.17, 687.20, 758.57],
        '32x48': [42.85, 76.76, 111.78, 142.40, 176.32, 210.24, 244.15, 278.07, 311.99, 334.94, 367.75, 400.57, 433.39, 466.21, 499.03, 531.85, 564.66, 597.48, 578.85, 608.96, 910.06, 1123.58, 1306.95, 1554.85, 1812.87, 2070.89, 2328.90, 2586.92, 3856.79, 5140.13],
    }
};


const getQuantityIndex = (qty) => {
  if (qty <= 20) {
    console.log(`Quantity ${qty}: Returning ${qty - 1}`);
    return qty - 1;
  } else if (qty <= 100) {
    console.log(`Quantity ${qty}: Returning ${Math.floor((qty - 20) / 10) + 19}`);
    return Math.floor((qty - 20) / 10) + 19;
  }else if (qty <= 200) {
    const index = Math.floor((qty - 100) / 50) + 27;
    console.log(`Quantity ${qty}: Returning ${index}`);
    return index;
  } 
  else if (qty <= 500) {
    const index = Math.floor((qty - 100) / 100) + 28;
    console.log(`Quantity ${qty}: Returning ${index}`);
    return index;
  } else {
    console.log(`Quantity ${qty}: Returning 0`);
    return 0; // Default to the lowest quantity tier
  }
};


    
    console.log('Material:', material);
  console.log('Available Dimensions:', Object.keys(prices[material])); // Log available dimensions

  const priceIndex = getQuantityIndex(quantity);
  console.log('Selected Dimension:', dimension);

  // Check if the selected dimension exists in the available dimensions for the material
  if (!(dimension in prices[material])) {
    console.error(`Error: Dimension '${dimension}' not found for material '${material}'.`);
    return 0; // or handle the error appropriately
  }

  return prices[material][dimension][priceIndex];
  }