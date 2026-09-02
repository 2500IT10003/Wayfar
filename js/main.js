document.addEventListener("DOMContentLoaded", () => {
    // Because the header is loaded dynamically via fetch, 
    // we use a slight delay or event delegation to capture the login button click
    setTimeout(() => {
        const loginModal = document.getElementById("loginModal");
        // Update this selector to match your header's actual login button ID or class
        const loginBtn = document.querySelector(".login-btn") || document.getElementById("loginBtn"); 
        const closeBtn = document.getElementById("closeLoginModal");

        if (loginBtn && loginModal) {
            loginBtn.addEventListener("click", (e) => {
                e.preventDefault();
                loginModal.style.display = "flex";
            });
        }

        if (closeBtn && loginModal) {
            closeBtn.addEventListener("click", () => {
                loginModal.style.display = "none";
            });
        }

        // Close modal when clicking outside the white box content
        window.addEventListener("click", (e) => {
            if (e.target === loginModal) {
                loginModal.style.display = "none";
            }
        });
    }, 500); // 500ms allows load-components.js time to inject the header HTML first
});

document.addEventListener("click", (e) => {
    const loginModal = document.getElementById("loginModal");
    const loginBtn = e.target.closest("#loginBtn");
    const closeBtn = e.target.closest("#closeLoginModal");

    // Open Modal when clicking "Log in" in the header
    if (loginBtn) {
        e.preventDefault();
        if (loginModal) {
            loginModal.style.display = "flex";
        }
    }

    // Close Modal when clicking the 'X' button
    if (closeBtn) {
        if (loginModal) {
            loginModal.style.display = "none";
        }
    }

    // Close Modal when clicking the dark background overlay outside the box
    if (e.target === loginModal) {
        loginModal.style.display = "none";
    }
});

// Handle phone number login submission
document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('modal-login-btn')) {
        const phoneInput = document.getElementById('loginPhone');
        if (!phoneInput || !phoneInput.value.trim()) {
            alert('Please enter your phone number.');
            return;
        }

        const fullPhone = `+95 ${phoneInput.value.trim()}`;
        
        // Save to localStorage
        localStorage.setItem('transitHubUser', JSON.stringify({ user: fullPhone }));
        
        // Close modal and refresh navbar state
        document.getElementById('loginModal').style.display = 'none';
        updateNavbarAuthState();
        alert(`Successfully logged in as ${fullPhone}`);
    }

    // Handle Google login simulation button
    if (event.target && (event.target.classList.contains('google-login-btn') || event.target.closest('.google-login-btn'))) {
        localStorage.setItem('transitHubUser', JSON.stringify({ user: 'Google User' }));
        
        document.getElementById('loginModal').style.display = 'none';
        updateNavbarAuthState();
        alert('Successfully logged in with Google!');
    }
});


// Global function so component loaders can call it immediately
window.updateNavbarAuthState = function() {
    const savedUser = localStorage.getItem('transitHubUser');
    const loginBtn = document.getElementById('loginBtn') || document.querySelector('.login-btn');

    if (savedUser && loginBtn) {
        const userData = JSON.parse(savedUser);
        loginBtn.innerText = 'My Account';
        
        // Let them log out if they click "My Account"
        loginBtn.onclick = (e) => {
            e.preventDefault();
            if (confirm(`Logged in as: ${userData.user}\nDo you want to log out?`)) {
                localStorage.removeItem('transitHubUser');
                location.reload();
            }
        };
    }
};

// Also run it on standard DOM load just in case pages have a static header
document.addEventListener('DOMContentLoaded', () => {
    window.updateNavbarAuthState();
});

let activeInputId = null;

// Listen for clicks anywhere on the document (handles dynamically loaded inputs)
document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'startPoint') {
        activeInputId = 'startPoint';
        document.getElementById('modal-title').innerText = 'Select Departure City';
        document.getElementById('locationModal').style.display = 'flex';
    }
    
    if (event.target && event.target.id === 'destination') {
        activeInputId = 'destination';
        document.getElementById('modal-title').innerText = 'Select Destination';
        document.getElementById('locationModal').style.display = 'flex';
    }
});

// Function when a city is clicked from the modal list
function selectCity(cityName) {
    if (activeInputId) {
        const inputField = document.getElementById(activeInputId);
        if (inputField) {
            inputField.value = cityName;
        }
    }
    closeLocationModal();
}

// Function to close the modal
function closeLocationModal() {
    const modal = document.getElementById('locationModal');
    if (modal) {
        modal.style.display = 'none';
    }
    activeInputId = null;
}

// Set default date for the search banner immediately on page load
document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById('travelDate');
    if (dateInput && !dateInput.value) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
});

// Function to swap Start point and Destination values
function swapLocations() {
    const startInput = document.getElementById('startPoint');
    const destInput = document.getElementById('destination');
    
    console.log("Swap clicked!", startInput, destInput); // Check your F12 console
    
    if (startInput && destInput) {
        const tempValue = startInput.value;
        startInput.value = destInput.value;
        destInput.value = tempValue;
    }
}

// Handle Search button click and validation
document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('search-btn')) {
        const startPoint = document.getElementById('startPoint').value.trim();
        const destination = document.getElementById('destination').value.trim();
        const travelDate = document.getElementById('travelDate').value;

        // Validation check
        if (!startPoint || !destination || !travelDate) {
            alert('Please select a start point, destination, and date.');
            return;
        }

        // Prevent searching the same city for start and destination
        if (startPoint === destination) {
            alert('Start point and destination cannot be the same.');
            return;
        }

        // Redirect to search results page with parameters
        window.location.href = `bus-results.html?start=${encodeURIComponent(startPoint)}&dest=${encodeURIComponent(destination)}&date=${encodeURIComponent(travelDate)}`;
    }
});

let selectedSeats = [];

// Open modal when clicking "Select Seat" on any bus card
document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('book-now-btn')) {
        document.getElementById('seatModal').style.display = 'flex';
        resetBookingModal();
    }
});

function closeSeatModal() {
    document.getElementById('seatModal').style.display = 'none';
}

function toggleSeat(element, seatNum) {
    if (element.classList.contains('booked')) return;

    const index = selectedSeats.indexOf(seatNum);
    
    if (index > -1) {
        // If already selected, remove it (deselect)
        selectedSeats.splice(index, 1);
        element.classList.remove('selected');
    } else {
        // Otherwise, add it to the selection
        selectedSeats.push(seatNum);
        element.classList.add('selected');
    }
    
    // Enable proceed button only if at least one seat is selected
    document.getElementById('proceedBtn').disabled = selectedSeats.length === 0;
}

function showPassengerForm() {
    document.getElementById('seatSelectionView').style.display = 'none';
    document.getElementById('passengerFormView').style.display = 'block';
    // Display all selected seats separated by commas
    document.getElementById('displaySelectedSeat').innerText = selectedSeats.join(', ');
    document.getElementById('seatModalTitle').innerText = 'Passenger Information';
}

function handleBookingSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('passengerName').value;
    const phone = document.getElementById('passengerPhone').value;

    // Switch to success view
    document.getElementById('passengerFormView').style.display = 'none';
    document.getElementById('successView').style.display = 'block';
    document.getElementById('seatModalTitle').innerText = 'Confirmation';
    document.getElementById('successDetails').innerText = `Seats (${selectedSeats.join(', ')}) successfully reserved for ${name} (${phone}).`;
}

function resetBookingModal() {
    selectedSeats = [];
    document.querySelectorAll('.seat').forEach(s => s.classList.remove('selected'));
    document.getElementById('proceedBtn').disabled = true;
    document.getElementById('seatSelectionView').style.display = 'block';
    document.getElementById('passengerFormView').style.display = 'none';
    document.getElementById('successView').style.display = 'none';
    document.getElementById('seatModalTitle').innerText = 'Select Your Seat';
    document.getElementById('bookingForm').reset();
}

