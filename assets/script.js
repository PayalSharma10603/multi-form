let step3Timeout;
let selectedImportanceOptions = [];
let selectedSurveyMethods = [];  
let lastVisitedStep = 3; // Default to Step 3

function selectPricingPlan(plan) {
    document.getElementById('selected_pricing_plan_hidden').value = plan; // Store the selected plan in the hidden field
    console.log("Selected pricing plan:", plan);
    nextStep(10); 
}

// Function to handle selecting a payment method
function selectPaymentMethod(method) {
    document.getElementById('payment_method_hidden').value = method;
    localStorage.setItem('selectedPaymentMethod', method); // Save payment method
    console.log("Selected payment method:", method); 
    // Hide error message once a method is selected
    document.getElementById('payment-method-error').style.display = 'none';
  }

  // Listen for the continue button click event
  document.querySelector('#continue-btn-7').addEventListener('click', function() {
    const selectedPaymentMethod = document.getElementById('payment_method_hidden').value;
    const paymentMethodError = document.getElementById('payment-method-error');

    if (selectedPaymentMethod) {
      // If a payment method is selected, proceed to the next step
      nextStep(8);  // Move to the next step
    } else {
      // Show error message if no payment method is selected
      paymentMethodError.style.display = 'block';
    }
  });

function updatePricingLayout() {
    const paymentMethod = document.getElementById('payment_method_hidden').value;
    const pricingPlans = document.getElementById('pricing-plans');
    const standardPlan = document.getElementById('plan-standard');
    const basicPlan = document.getElementById('plan-basic');
    const premiumPlan = document.getElementById('plan-premium');

    // Reset background colors and order
    standardPlan.classList.remove('centered');
    basicPlan.classList.remove('centered');
    premiumPlan.classList.remove('centered');
    standardPlan.style.order = '';
    basicPlan.style.order = '';
    premiumPlan.style.order = '';

    // Update layout based on payment method
    if (paymentMethod === 'Bulk purchasing for the most savings') {
        basicPlan.classList.add('centered');
        // Default layout (no changes)
    } else if (paymentMethod === 'Pay as you go for convenience') {
        // Center Premium
        premiumPlan.style.order = 1;
        standardPlan.style.order = 0;
        basicPlan.style.order = 2;
        premiumPlan.classList.add('centered');  // Add the 'centered' class to premium plan
    } else if (paymentMethod === 'Net payment terms even if it is the most expensive') {
        // Center Standard
        standardPlan.style.order = 1;
        basicPlan.style.order = 0;
        premiumPlan.style.order = 2;
        standardPlan.classList.add('centered');  // Add the 'centered' class to standard plan
    }
}

function adjustPricingPlanLayout() {
    const method = localStorage.getItem('selectedPaymentMethod');
    const pricingPlans = document.querySelector('.pricing-plans');
    
    // Reset layout and remove background colors
    pricingPlans.style.display = 'flex';
    pricingPlans.style.justifyContent = 'space-between';
    const plans = document.querySelectorAll('.pricing-plan');
    plans.forEach(plan => plan.classList.remove('centered'));

    // Adjust layout based on payment method
    if (method === 'Pay as you go for convenience') {
        pricingPlans.style.justifyContent = 'center';
        document.getElementById('plan-premium').style.order = '1';
        document.getElementById('plan-basic').style.order = '2';
        document.getElementById('plan-standard').style.order = '3';
        document.getElementById('plan-premium').classList.add('centered'); // Add class to premium plan
    } else if (method === 'Net payment terms even if it is the most expensive') {
        pricingPlans.style.justifyContent = 'center';
        document.getElementById('plan-standard').style.order = '1';
        document.getElementById('plan-premium').style.order = '2';
        document.getElementById('plan-basic').style.order = '3';
        document.getElementById('plan-standard').classList.add('centered'); // Add class to standard plan
    } else {
        pricingPlans.style.justifyContent = 'space-between';
        document.getElementById('plan-standard').style.order = '1';
        document.getElementById('plan-basic').style.order = '2';
        document.getElementById('plan-premium').style.order = '3';
    }
}


// Call this function when Step 9 is shown
document.querySelector('#step-9 button[onclick="nextStep(10)"]').addEventListener('click', adjustPricingPlanLayout);

// Select survey method for Step 4
function selectSurveyMethod(method) {
    const methodValue = method.value;
    if (method.checked) {
        // Add to the array if it's checked
        if (!selectedSurveyMethods.includes(methodValue)) {
            selectedSurveyMethods.push(methodValue);
        }
    } else {
        // Remove from the array if unchecked
        const index = selectedSurveyMethods.indexOf(methodValue);
        if (index !== -1) {
            selectedSurveyMethods.splice(index, 1);
        }
    }
    // Hide the error message when the user makes a valid selection
    if (selectedSurveyMethods.length > 0) {
        document.getElementById('survey-error-message').style.display = 'none';
    }
}
// Step 4 Continue Button Logic
document.getElementById('step4-continue-btn').addEventListener('click', function() {
    if (selectedSurveyMethods.length > 0) {
        nextStep(5); // Move to Step 5
    } else {
        document.getElementById('survey-error-message').innerText = 'Please select at least one survey method.';
        document.getElementById('survey-error-message').style.display = 'block';
    }
});

function addImportanceOption(option) {
    if (!selectedImportanceOptions.includes(option)) {
        selectedImportanceOptions.push(option);
    }
    updateHiddenFields(); // Update hidden fields after adding each option
    console.log("Current importance options:", selectedImportanceOptions); // Debugging
}
// Toggle importance option for Step 5 with a two-option limit
function toggleImportanceOption(option) {
    const index = selectedImportanceOptions.indexOf(option);
    if (index === -1) {
        if (selectedImportanceOptions.length < 2) {
            selectedImportanceOptions.push(option);
        } else {
            document.getElementById('importance_error').innerText = 'Select up to 2 options only.';
            return;
        }
    } else {
        selectedImportanceOptions.splice(index, 1);
        document.getElementById('importance_error').innerText = '';
    }
    document.getElementById('importance_selection').value = selectedImportanceOptions.join(', ');
}
// Limit the number of selected options to 2
function limitSelection(checkbox, maxSelections) {
    const selectedOptions = document.querySelectorAll('input[name="important_aspects[]"]:checked');
    if (selectedOptions.length > maxSelections) {
        checkbox.checked = false;
        document.getElementById('important_aspects_error').innerText = `You can only select up to ${maxSelections} options.`;
        document.getElementById('important_aspects_error').style.display = 'block';
    } else {
        document.getElementById('important_aspects_error').style.display = 'none';
    }
}

// Step 5 Continue Button Logic
document.getElementById('step5-continue-btn').addEventListener('click', function() {
    const selectedOptions = Array.from(document.querySelectorAll('input[name="important_aspects[]"]:checked')).map(input => input.value);
    
    if (selectedOptions.length > 0) {
        nextStep(6); // Move to Step 6
    } else {
        document.getElementById('important_aspects_error').innerText = 'Please select at least one option.';
        document.getElementById('important_aspects_error').style.display = 'block';
    }
});

function nextStep(step, businessType = null) {
    clearTimeout(step3Timeout);
    document.querySelectorAll('.form-step').forEach(step => step.style.display = 'none');
    document.getElementById('step-' + step).style.display = 'block';
    if (businessType) {
        document.getElementById('business_type').value = businessType;
    }
    // Update pricing layout when reaching Step 9
    if (step === 9) {
        updatePricingLayout();
    }
    // Track the last visited step
    if (step === 5) {
        lastVisitedStep = currentStep; // Save the step before moving to Step 5
    }
    // Update current step
    currentStep = step;
}

function prevStep(step) {
    document.querySelectorAll('.form-step').forEach(step => step.style.display = 'none');
    // document.getElementById('step-' + step).style.display = 'block';
    // Show the appropriate step
    if (currentStep === 5) {
        document.getElementById(`step-${lastVisitedStep}`).style.display = 'block';
        currentStep = lastVisitedStep; // Update the current step
    } else {
        document.getElementById(`step-${step}`).style.display = 'block';
        currentStep = step;
    }
}

let selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];

function selectService(checkbox) {
    const service = checkbox.value;
    if (checkbox.checked) {
        if (!selectedServices.includes(service)) {
            selectedServices.push(service);
        }
    } else {
        selectedServices = selectedServices.filter(s => s !== service);
    }
    localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
    console.log("Updated selected services:", selectedServices);

    updateStep8Services();
}

function updateStep8Services() {
    const servicesDropdownsContainer = document.getElementById('selected-services-dropdowns');
    servicesDropdownsContainer.innerHTML = ''; // Clear the container

    const selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];
    let totalRangeValue = 0; // Initialize total range value

    const rangeMapping = {
        "1-50": 50,
        "51-100": 100,
        "101-150": 150,
        "151-200": 200,
        "201-250": 250,
        "251-300": 300,
        "301-400": 400
    };

    if (selectedServices.length > 0) {
        selectedServices.forEach((service) => {
            const serviceDiv = document.createElement('div');
            serviceDiv.classList.add('dropdown-service-range-here'); // Add the class here
            const label = document.createElement('label');
            label.innerText = service;

            const selectElement = document.createElement('select');
            selectElement.name = `${service}_range`;
            selectElement.required = true;

            const ranges = [
                "1-50", "51-100", "101-150", "151-200", "201-250", "251-300", "301-400"
            ];
            ranges.forEach(range => {
                const option = document.createElement('option');
                option.value = range;
                option.innerHTML = range;
                selectElement.appendChild(option);
            });

            // Listen for changes in the selected range
            selectElement.addEventListener('change', function () {
                calculateTotal(rangeMapping);
            });

            serviceDiv.appendChild(label);
            serviceDiv.appendChild(selectElement);
            servicesDropdownsContainer.appendChild(serviceDiv);
        });
    } else {
        const message = document.createElement('p');
        message.textContent = 'No services selected.';
        servicesDropdownsContainer.appendChild(message);
    }

    // Calculate and display total
    calculateTotal(rangeMapping);
}

function calculateTotal(rangeMapping) {
    const selectElements = document.querySelectorAll('#selected-services-dropdowns select');
    let total = 0;

    selectElements.forEach(selectElement => {
        const selectedRange = selectElement.value;
        if (rangeMapping[selectedRange]) {
            total += rangeMapping[selectedRange];
        }
    });

    // Determine the correct display value based on the total
    let displayTotal = '';
    if (total >= 1 && total <= 50) {
        displayTotal = '50+';
    } else if (total >= 51 && total <= 150) {
        displayTotal = '100+';
    } else if (total >= 151 && total <= 250) {
        displayTotal = '200+';
    } else if (total >= 251 && total <= 350) {
        displayTotal = '300+';
    } else if (total >= 351 && total <= 450) {
        displayTotal = '400+';
    } else if (total >= 451 && total <= 550) {
        displayTotal = '500+';
    } else if (total >= 551 && total <= 650) {
        displayTotal = '600+';
    } else if (total > 650) {
        displayTotal = '650+';
    }
// Update the frontend display
//const totalDisplayElement = document.getElementById('.range-total-display');
const totalDisplayElements = document.querySelectorAll('.range-total-display');
// totalDisplayElement.textContent = `${displayTotal}`;
totalDisplayElements.forEach(element => {
        element.textContent = `${displayTotal}`;
    });

}

function updatePricingPlans() {
    const selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];
    const allPricingElements = document.querySelectorAll('.para-monthly');

    // Hide all pricing elements initially
    allPricingElements.forEach(element => {
        element.style.display = 'none';
    });

    // Show only the pricing elements that match selected services
    selectedServices.forEach(service => {
        const matchingElements = document.querySelectorAll(`.para-monthly[data-service="${service}"]`);
        matchingElements.forEach(element => {
            element.style.display = 'block';
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    localStorage.removeItem('selectedServices');
    updateStep8Services();
    updatePricingPlans(); // Ensure the pricing plan updates on load
});

document.getElementById('step3-continue-btn').addEventListener('click', function () {
    const selectedServices = JSON.parse(localStorage.getItem('selectedServices')) || [];
    const siteSurveySelected = selectedServices.some(service => service === "Site Surveys");
    const servicesError = document.getElementById('services_error');

    if (selectedServices.length > 0) {
        if (siteSurveySelected) {
            nextStep(4); // Proceed to Step 4 if "Site Surveys" is selected
        } else {
            nextStep(5); // Proceed to Step 5 if "Site Surveys" is NOT selected
        }
        servicesError.innerText = ''; // Clear error message
    } else {
        servicesError.innerText = 'Please select at least one service.'; // Show error if no services are selected
    }
});

function validateStep2() {
    let isValid = true;
    const companyName = document.getElementById('company_name');
    const fullName = document.getElementById('full_name');
    const phoneNumber = document.getElementById('phone_number');
    const email = document.getElementById('email');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{3,}$/;
    const phonePattern = /^\d{10}$/;

    // Validate Company Name
    if (!companyName.value) {
        document.getElementById('company_name_error').innerText = 'Company name is required.';
        isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(companyName.value)) {
        document.getElementById('company_name_error').innerText = 'Please enter a valid company name (letters and spaces only).';
        isValid = false;
    } else {
        document.getElementById('company_name_error').innerText = '';
    }

    // Validate Full Name
    if (!fullName.value) {
        document.getElementById('full_name_error').innerText = 'Full name is required.';
        isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(fullName.value)) {
        document.getElementById('full_name_error').innerText = 'Please enter a valid name (letters and spaces only).';
        isValid = false;
    } else {
        document.getElementById('full_name_error').innerText = '';
    }

    // Validate Phone Number
    if (!phoneNumber.value) {
        document.getElementById('phone_number_error').innerText = 'Phone number is required.';
        isValid = false;
    } else if (!phonePattern.test(phoneNumber.value)) {
        document.getElementById('phone_number_error').innerText = 'Please enter a valid 10-digit phone number.';
        isValid = false;
    } else {
        document.getElementById('phone_number_error').innerText = '';
    }

    // Validate Email Address
    if (!email.value) {
        document.getElementById('email_error').innerText = 'Email is required.';
        isValid = false;
    } else if (!emailPattern.test(email.value)) {
        document.getElementById('email_error').innerText = 'Please enter a valid email address.';
        isValid = false;
    } else {
        document.getElementById('email_error').innerText = '';
    }

    // Disable the continue button if validation fails, otherwise enable it
    if (isValid) {
        document.getElementById('continue-btn').disabled = false; // Enable the continue button
    } else {
        document.getElementById('continue-btn').disabled = true; // Keep it disabled if validation fails
    }
}

// When the user clicks "Continue" on Step 2
document.getElementById('continue-btn').addEventListener('click', function() {
    const companyName = document.getElementById('company_name').value;
    const fullName = document.getElementById('full_name').value;
    const phoneNumber = document.getElementById('phone_number').value;
    const email = document.getElementById('email').value;
    const errorMessageContainer = document.getElementById('error-message');

    // Show error message if any fields are empty or invalid
    if (!companyName || !fullName || !phoneNumber || !email) {
        errorMessageContainer.style.display = 'block';
        errorMessageContainer.textContent = 'Please fill all the required fields.';
    } else {
        nextStep(3); 
        startStep3Timeout();
        errorMessageContainer.style.display = 'none';
    }
});

function submitForm() {
    const ordersPerMonth = document.querySelector('input[name="orders_per_month"]').value; // New input for Step 8 data
    document.getElementById('business_type_hidden').value = document.getElementById('business_type').value;
    document.getElementById('company_name_hidden').value = document.getElementById('company_name').value;
    document.getElementById('full_name_hidden').value = document.getElementById('full_name').value;
    document.getElementById('phone_number_hidden').value = document.getElementById('phone_number').value;
    document.getElementById('email_hidden').value = document.getElementById('email').value;
    document.getElementById('services_hidden').value = selectedServices.join(', '); 
    document.getElementById('survey_method_hidden').value = selectedSurveyMethods.join(', ');
    const selectedImportantAspects = Array.from(document.querySelectorAll('input[name="important_aspects[]"]:checked'))
        .map(input => input.value);
    document.getElementById('important_aspects_hidden').value = selectedImportantAspects.join(', ');
   // document.getElementById('selected-state-hidden').value = document.getElementById('selected-state').value;
 
   // Ensure that the selected states are passed as a hidden input
   const selectedStateField = document.getElementById('selected-state');
   document.getElementById('selected-state-hidden').value = selectedStateField.value; 

    const selectedDropdowns = document.querySelectorAll('#selected-services-dropdowns select');
    const dropdownValues = Array.from(selectedDropdowns).map(select => select.options[select.selectedIndex].text);

    console.log('Selected Values:', dropdownValues); 
    document.getElementById('orders_per_month_hidden').value = JSON.stringify(dropdownValues);
    // Submit the form
    document.getElementById('final-form').submit();
}
// Declare selectedStates in the global scope so it can be accessed in both functions
const selectedStates = new Set();

document.addEventListener("DOMContentLoaded", function () {
    const stateNameDiv = document.getElementById("state-name");

    // Check if the #usa-map element exists before proceeding
    const usaMap = document.getElementById("usa-map");
    if (usaMap) {
        const statePaths = usaMap.querySelectorAll(".state");

        statePaths.forEach((state) => {
            const stateText = state.nextElementSibling; // Get the text element next to the path

            state.addEventListener("click", function () {
                const stateId = state.getAttribute("id");
                const stateName = state.getAttribute("data-name") || stateId;
        
                // Toggle state selection
                if (selectedStates.has(stateName)) {
                    selectedStates.delete(stateName);
                    state.style.fill = "#ffffff"; // Unselect state color
                    stateText.style.fill = "#184a5b"; // Unselected text color (blue)
                } else {
                    selectedStates.add(stateName);
                    state.style.fill = "#184a5b"; // Selected state color
                    stateText.style.fill = "#ffffff"; // Selected text color (white)
                }

                // Update the state-name div
                stateNameDiv.textContent = Array.from(selectedStates).join(", ");
            });
        });
    }
});

// Make sure the selected states are saved to a hidden input field
function saveSelectedStates() {
    const selectedStateField = document.getElementById('selected-state');
    selectedStateField.value = Array.from(selectedStates).join(', '); // Join all selected states as a comma-separated string
}

// Handle form submission
document.querySelector('#continue-btn-6').addEventListener('click', function() {
    // Save selected states before checking if it's empty
    saveSelectedStates();
    
    const selectedState = document.getElementById('selected-state').value;
    const stateError = document.getElementById('state-error');

    if (selectedState) {
        // Show loader and proceed with form submission
        document.getElementById('loader').style.display = 'block';  // Show the loader
        setTimeout(function() {
            document.getElementById('loader').style.display = 'none';  // Hide the loader
            nextStep(7);  // Move to the next step
        }, 3000);  // Adjust the delay as needed
    } else {
        // Display error if no state is selected
        stateError.style.display = 'block';
    }
});

function showLoaderAndProceed() {
    document.getElementById('loader1').style.display = 'block'; // Show the loader
    setTimeout(function() {
        document.getElementById('loader1').style.display = 'none'; // Hide the loader after delay
        nextStep(9);
        updatePricingPlans();  // Proceed to Step 9
    }, 3000); 
}
