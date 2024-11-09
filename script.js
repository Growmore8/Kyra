// Sample staff data
const staffData = [
    { name: "Mailwaganam Niranjan", target: 8, achievedSale: 2, deposit: 1346.50, image: "assets/Mailwaganam_Niranjan.png" },
    { name: "Pushparaja Sathurshika", target: 8, achievedSale: 2, deposit: 1407.00, image: "assets/Pushparaja_Sathurshika.png" },
    { name: "Thangaras Dinushan", target: 8, achievedSale: 2, deposit: 490.00, image: "assets/Thangaras_Dinushan.png" },
    { name: "Venujan Purusothaman", target: 8, achievedSale: 3, deposit: 1300.00, image: "assets/Venujan_Purusothaman.png" },
    { name: "Ramalingam Kushalini", target: 8, achievedSale: 1, deposit: 200.00, image: "assets/Ramalingam_Kushalini.png" },
    { name: "Karunasegar Sharmila", target: 8, achievedSale: 1, deposit: 200.00, image: "assets/Karunasegar_Sharmila.png" },
    { name: "Trainee 6", target: 0, achievedSale: 0, deposit: 0.00, image: "assets/219983.png" },
    { name: "Trainee 7", target: 0, achievedSale: 0, deposit: 0.00, image: "assets/219983.png" },
    { name: "Trainee 8", target: 0, achievedSale: 0, deposit: 0.00, image: "assets/219983.png" },
    { name: "Trainee 9", target: 0, achievedSale: 0, deposit: 0.00, image: "assets/219983.png" },
    { name: "Trainee 10", target: 0, achievedSale: 0, deposit: 0.00, image: "assets/219983.png" },
    { name: "Trainee 11", target: 0, achievedSale: 0, deposit: 0.00, image: "assets/219983.png" },
];

// Function to calculate total sales, deposits, and targets
function calculateTotals(staff) {
    let totalSale = 0;
    let totalDeposit = 0;
    let totalTarget = 0;

    staff.forEach(member => {
        totalSale += member.achievedSale;
        totalDeposit += member.deposit;
        totalTarget += member.target; // Calculate total target
    });

    return { totalSale, totalDeposit, totalTarget };
}

// Function to calculate progress percentage
function calculateProgress(achievedSale, target) {
    return target > 0 ? ((achievedSale / target) * 100).toFixed(2) : 0;
}

// Function to sort staff data by progress percentage, then by achieved sales and deposits
function sortStaffData(staff) {
    return staff.sort((a, b) => {
        const progressA = calculateProgress(a.achievedSale, a.target);
        const progressB = calculateProgress(b.achievedSale, b.target);

        // First sort by progress
        if (progressB !== progressA) {
            return progressB - progressA;
        }

        // If progress is the same, sort by achieved sales
        if (b.achievedSale !== a.achievedSale) {
            return b.achievedSale - a.achievedSale;
        }

        // If both are the same, sort by deposit
        return b.deposit - a.deposit;
    });
}

// Function to render staff cards
function renderStaffCards() {
    const sortedStaff = sortStaffData(staffData);
    const slides = [[], [], []]; // Create three slides

    // Find the highest progress and sale amount for styling
    let highestProgress = 0;
    let highestSale = Math.max(...sortedStaff.map(s => s.achievedSale));
    let highestProgressCard = null;

    // Distributing staff cards across the slides
    sortedStaff.forEach((staff, index) => {
        const progressPercentage = calculateProgress(staff.achievedSale, staff.target);
        
        // Update the highest progress and track the card
        if (progressPercentage > highestProgress && index < 4) { // Only consider the first four cards for slide one
            highestProgress = progressPercentage;
            highestProgressCard = staff;
        }

        // Determine stars based on sale and progress
        const starHTML = staff.achievedSale === highestSale 
            ? '<div class="star-container">' + '⭐'.repeat(3) + '</div>' // 3 stars for highest sale
            : (staff === highestProgressCard ? '<div class="star-container">' + '🥇'.repeat(1).replace(/★/g, '<span style="color: green;">★</span>') + '</div>' : ''); // Orange stars for highest progress

        const cardHTML = `
            <div class="staff-card ${staff === highestProgressCard ? 'highest-progress' : ''}" 
                 data-sale="${staff.achievedSale}" 
                 data-deposit="${staff.deposit}" 
                 style="animation-delay: ${index * 0.1}s;">
                <img src="${staff.image}" alt="${staff.name}">
                <h3>${staff.name}</h3>
                <p>Target: ${staff.target}</p>
                <p class="achieved-sales">Achieved Sale: ${staff.achievedSale}</p>
                <p>Deposit: $${staff.deposit.toFixed(2)}</p>
                <p>Progress: <span class="progress">${progressPercentage}%</span></p>
                ${starHTML} <!-- Include stars if applicable -->
            </div>
        `;

        // Assign to slides based on index
        slides[Math.floor(index / 4)].push(cardHTML);
    });

    // Insert cards into the slides
    slides.forEach((slideHTML, slideIndex) => {
        document.querySelector(`#slide${slideIndex + 1} .staff-container`).innerHTML = slideHTML.join('');
    });

    // Update totals in the header
    const { totalSale, totalDeposit, totalTarget } = calculateTotals(sortedStaff);
    document.getElementById('total-sale').innerText = totalSale;
    document.getElementById('total-target').innerText = totalTarget; // Update total target
    // Format the total deposit as USD
    document.getElementById('total-deposit').innerText = totalDeposit.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
}

// Function to display the current month and year
function displayCurrentDate() {
    const now = new Date();
    const options = { month: 'long', year: 'numeric' };
    const currentDate = now.toLocaleDateString('en-US', options);
    document.getElementById('current-date').innerText = currentDate;
}

// Slideshow logic
let slideIndex = 0;

function showSlides() {
    const slides = document.querySelectorAll('.slide');
    const header = document.getElementById('header'); // Get the header element

    slides.forEach((slide, index) => {
        slide.style.display = index === slideIndex ? 'block' : 'none'; // Show or hide slides
        slide.classList.toggle('active', index === slideIndex); // Add 'active' class for transitions
    });

    // Hide the header for slides 4-7 and slide 12
    if ((slideIndex >= 3 && slideIndex <= 6) || slideIndex === 11) { 
        header.classList.add('header-hidden'); // Hide the header
    } else {
        header.classList.remove('header-hidden'); // Show the header for other slides
    }

    slideIndex = (slideIndex + 1) % slides.length; // Loop through slides
}

// Call render function on page load
document.addEventListener('DOMContentLoaded', () => {
    renderStaffCards();
    displayCurrentDate();
    showSlides();
    setInterval(showSlides, 5000); // Change slide every 5 seconds
});

// JavaScript to calculate and set progress
document.addEventListener("DOMContentLoaded", function() {
    const targetSales = 8; // Target sales
    const actualSales = 3; // Actual sales made
    const progressBar = document.getElementById("salesProgress");
    const progressText = document.getElementById("progressText");

    // Calculate the progress percentage
    const progressPercentage = (actualSales / targetSales) * 100;

    // Set the progress value
    progressBar.value = progressPercentage;

    // Display the progress percentage text
    progressText.textContent = `${Math.round(progressPercentage)}%`;
});
