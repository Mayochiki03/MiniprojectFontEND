let currentStep = 1;
let selectedImages = []; // Array to store selected images for each step

// Function to update the main image with overlays
function updateMainImage(step) {
    const mainImageContainer = document.querySelector(`#container-${step} .main-image`);
    if (!mainImageContainer) return;

    // Clear existing overlays but keep the base image
    const baseImage = document.createElement('img');
    baseImage.src = 'BG/BG1.png'; // Default image for each step
    baseImage.classList.add('base-image');
    mainImageContainer.innerHTML = ''; // Clear the container first
    mainImageContainer.appendChild(baseImage); // Add the base image

    // Loop through selected images and add them as overlays
    selectedImages.forEach((imageSrc, index) => {
        if (imageSrc && index < step) { // Ensure only images up to the current step are added
            const imgElement = document.createElement('img');
            imgElement.src = imageSrc;
            imgElement.classList.add('overlay-image'); // Add a class for styling
            mainImageContainer.appendChild(imgElement);
        }
    });
}

// Function to handle image selection for each step
function selectImage(imagePath, step) {
    // Store the selected image for this step in the array
    selectedImages[step - 1] = imagePath;

    // Update the main image with all selected images up to the current step
    updateMainImage(step);
}

// Next step function
function nextStep() {
    if (currentStep < 7) { // Ensure we don't go beyond the last step
        document.getElementById('container-' + currentStep).style.display = 'none';
        currentStep++;
        document.getElementById('container-' + currentStep).style.display = 'block';
        updateMainImage(currentStep); // Update main image for the new step
        updateProgressBar();
    }
}

// Previous step function
function prevStep() {
    if (currentStep > 1) { // Ensure we don't go below the first step
        document.getElementById('container-' + currentStep).style.display = 'none';
        currentStep--;
        document.getElementById('container-' + currentStep).style.display = 'block';
        updateMainImage(currentStep); // Update main image for the previous step
        updateProgressBar();
    }
}

// Function to update the progress bar
function updateProgressBar() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index < currentStep) {
            step.classList.add('completed');
        } else {
            step.classList.remove('completed');
        }
    });
}

// Initialize step 1 on page load
document.addEventListener('DOMContentLoaded', () => {
    showStep(currentStep);
    updateMainImage(currentStep); // Update the main image when the page loads
    attachOptionEventListeners(); // Attach event listeners to images in the options
});

// Function to display the current step
function showStep(step) {
    // Hide all steps
    for (let i = 1; i <= 7; i++) {
        document.getElementById('container-' + i).style.display = 'none';
    }

    // Show the current step
    document.getElementById('container-' + step).style.display = 'block';
    updateMainImage(step); // Update the main image when changing steps
}

// Function to attach event listeners to each option image
function attachOptionEventListeners() {
    document.querySelectorAll('.option img').forEach((imgElement) => {
        imgElement.addEventListener('click', (event) => {
            const imagePath = event.target.src;
            const step = parseInt(event.target.closest('.container').id.split('-')[1]);
            selectImage(imagePath, step);
        });
    });
}
