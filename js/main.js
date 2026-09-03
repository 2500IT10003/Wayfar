document.addEventListener("DOMContentLoaded", () => {
    // Because the header is loaded dynamically via fetch, 
    // we use a slight delay or event delegation to capture the login button click
    setTimeout(() => {
        const loginModal = document.getElementById("loginModal");
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

        window.addEventListener("click", (e) => {
            if (e.target === loginModal) {
                loginModal.style.display = "none";
            }
        });
    }, 500); 
});

document.addEventListener("click", (e) => {
    const loginModal = document.getElementById("loginModal");
    const loginBtn = e.target.closest("#loginBtn");
    const closeBtn = e.target.closest("#closeLoginModal");

    if (loginBtn) {
        e.preventDefault();
        if (loginModal) {
            loginModal.style.display = "flex";
        }
    }

    if (closeBtn) {
        if (loginModal) {
            loginModal.style.display = "none";
        }
    }

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
        localStorage.setItem('transitHubUser', JSON.stringify({ user: fullPhone }));
        
        const loginModal = document.getElementById('loginModal');
        if (loginModal) loginModal.style.display = 'none';
        
        if (typeof updateNavbarAuthState === 'function') updateNavbarAuthState();
        alert(`Successfully logged in as ${fullPhone}`);
    }

    if (event.target && (event.target.classList.contains('google-login-btn') || event.target.closest('.google-login-btn'))) {
        localStorage.setItem('transitHubUser', JSON.stringify({ user: 'Google User' }));
        
        const loginModal = document.getElementById('loginModal');
        if (loginModal) loginModal.style.display = 'none';

        if (typeof updateNavbarAuthState === 'function') updateNavbarAuthState();
        alert('Successfully logged in with Google!');
    }
});

window.updateNavbarAuthState = function() {
    const savedUser = localStorage.getItem('transitHubUser');
    const loginBtn = document.getElementById('loginBtn') || document.querySelector('.login-btn');

    if (savedUser && loginBtn) {
        const userData = JSON.parse(savedUser);
        loginBtn.innerText = 'My Account';
        
        loginBtn.onclick = (e) => {
            e.preventDefault();
            if (confirm(`Logged in as: ${userData.user}\nDo you want to log out?`)) {
                localStorage.removeItem('transitHubUser');
                location.reload();
            }
        };
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.updateNavbarAuthState();
});

let activeInputId = null;

// Listen for clicks anywhere on the document (supports bus, train, and flight inputs)
document.addEventListener('click', function(event) {
    if (event.target && (event.target.id === 'startPoint' || event.target.id === 'train-origin' || event.target.id === 'flight-origin')) {
        activeInputId = event.target.id;
        const modalTitle = document.getElementById('modal-title') || document.getElementById('modal-title-heading');
        if (modalTitle) modalTitle.innerText = 'Select Departure City';
        
        const locationModal = document.getElementById('locationModal') || document.getElementById('station-picker-modal');
        if (locationModal) locationModal.style.display = 'flex';
    }
    
    if (event.target && (event.target.id === 'destination' || event.target.id === 'train-destination' || event.target.id === 'flight-destination')) {
        activeInputId = event.target.id;
        const modalTitle = document.getElementById('modal-title') || document.getElementById('modal-title-heading');
        if (modalTitle) modalTitle.innerText = 'Select Destination';
        
        const locationModal = document.getElementById('locationModal') || document.getElementById('station-picker-modal');
        if (locationModal) locationModal.style.display = 'flex';
    }
});

function selectCity(cityName) {
    if (activeInputId) {
        const inputField = document.getElementById(activeInputId);
        if (inputField) {
            inputField.value = cityName;
        }
    }
    closeLocationModal();
}

function closeLocationModal() {
    const modal = document.getElementById('locationModal') || document.getElementById('station-picker-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    activeInputId = null;
}

// Set default date for search banner immediately on page load
document.addEventListener("DOMContentLoaded", () => {
    const dateInputs = ['travelDate', 'train-date', 'bus-date', 'flight-date'];
    dateInputs.forEach(id => {
        const dateInput = document.getElementById(id);
        if (dateInput && !dateInput.value) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    });
});

function swapLocations() {
    const startInput = document.getElementById('startPoint') || document.getElementById('train-origin') || document.getElementById('flight-origin');
    const destInput = document.getElementById('destination') || document.getElementById('train-destination') || document.getElementById('flight-destination');
    
    if (startInput && destInput) {
        const tempValue = startInput.value;
        startInput.value = destInput.value;
        destInput.value = tempValue;
    }
}

// Handle Search button click and validation dynamically for Bus, Train, and Flight pages
document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('search-btn')) {
        const startElem = document.getElementById('startPoint') || document.getElementById('train-origin') || document.getElementById('flight-origin');
        const destElem = document.getElementById('destination') || document.getElementById('train-destination') || document.getElementById('flight-destination');
        const dateElem = document.getElementById('travelDate') || document.getElementById('train-date') || document.getElementById('bus-date') || document.getElementById('flight-date');

        if (!startElem && !destElem) return;

        const startPoint = startElem ? startElem.value.trim() : '';
        const destination = destElem ? destElem.value.trim() : '';
        const travelDate = dateElem ? dateElem.value : '';

        if (!startPoint || !destination || !travelDate) {
            alert('Please select a start point, destination, and date.');
            return;
        }

        if (startPoint === destination) {
            alert('Start point and destination cannot be the same.');
            return;
        }

        // Dynamically choose the correct results page based on current URL path
        let resultsPage = 'bus-results.html';
        if (window.location.pathname.includes('train')) {
            resultsPage = 'train-results.html';
        } else if (window.location.pathname.includes('flight')) {
            resultsPage = 'flight-results.html';
        }

        window.location.href = `${resultsPage}?start=${encodeURIComponent(startPoint)}&dest=${encodeURIComponent(destination)}&date=${encodeURIComponent(travelDate)}`;
    }
});

let selectedSeats = [];

document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('book-now-btn')) {
        const seatModal = document.getElementById('seatModal');
        if (seatModal) {
            seatModal.style.display = 'flex';
            resetBookingModal();
        }
    }
});

function closeSeatModal() {
    const seatModal = document.getElementById('seatModal');
    if (seatModal) seatModal.style.display = 'none';
}

function toggleSeat(element, seatNum) {
    if (element.classList.contains('booked')) return;

    const index = selectedSeats.indexOf(seatNum);
    
    if (index > -1) {
        selectedSeats.splice(index, 1);
        element.classList.remove('selected');
    } else {
        selectedSeats.push(seatNum);
        element.classList.add('selected');
    }
    
    const proceedBtn = document.getElementById('proceedBtn');
    if (proceedBtn) proceedBtn.disabled = selectedSeats.length === 0;
}

function showPassengerForm() {
    const seatSelectionView = document.getElementById('seatSelectionView');
    const passengerFormView = document.getElementById('passengerFormView');
    const displaySelectedSeat = document.getElementById('displaySelectedSeat');
    const seatModalTitle = document.getElementById('seatModalTitle');

    if (seatSelectionView) seatSelectionView.style.display = 'none';
    if (passengerFormView) passengerFormView.style.display = 'block';
    if (displaySelectedSeat) displaySelectedSeat.innerText = selectedSeats.join(', ');
    if (seatModalTitle) seatModalTitle.innerText = 'Passenger Information';
}

function handleBookingSubmit(event) {
    event.preventDefault();
    const nameInput = document.getElementById('passengerName');
    const phoneInput = document.getElementById('passengerPhone');
    const name = nameInput ? nameInput.value : '';
    const phone = phoneInput ? phoneInput.value : '';

    const passengerFormView = document.getElementById('passengerFormView');
    const successView = document.getElementById('successView');
    const seatModalTitle = document.getElementById('seatModalTitle');
    const successDetails = document.getElementById('successDetails');

    if (passengerFormView) passengerFormView.style.display = 'none';
    if (successView) successView.style.display = 'block';
    if (seatModalTitle) seatModalTitle.innerText = 'Confirmation';
    if (successDetails) {
        successDetails.innerText = `Seats (${selectedSeats.join(', ')}) successfully reserved for ${name}${phone ? ' (' + phone + ')' : ''}.`;
    }
}

function resetBookingModal() {
    selectedSeats = [];
    document.querySelectorAll('.seat').forEach(s => s.classList.remove('selected'));
    
    const proceedBtn = document.getElementById('proceedBtn');
    if (proceedBtn) proceedBtn.disabled = true;

    const seatSelectionView = document.getElementById('seatSelectionView');
    const passengerFormView = document.getElementById('passengerFormView');
    const successView = document.getElementById('successView');
    const seatModalTitle = document.getElementById('seatModalTitle');
    const bookingForm = document.getElementById('bookingForm');

    if (seatSelectionView) seatSelectionView.style.display = 'block';
    if (passengerFormView) passengerFormView.style.display = 'none';
    if (successView) successView.style.display = 'none';
    if (seatModalTitle) seatModalTitle.innerText = 'Select Your Seat';
    if (bookingForm) bookingForm.reset();
}

document.addEventListener('DOMContentLoaded', () => {
    const dealCards = document.querySelectorAll('.deal-card');
    const detailModal = document.getElementById('deal-detail-modal');
    const closeDetailBtn = document.getElementById('close-deal-detail-btn');
    const bookNowBtn = document.getElementById('book-now-modal-btn');

    const detailTitle = document.getElementById('detail-title');
    const detailBreadcrumbTitle = document.getElementById('detail-breadcrumb-title');
    const detailBanner = document.getElementById('detail-banner');
    const detailPromoCode = document.getElementById('detail-promo-code');

    dealCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-title') || 'DEAL DETAILS';
            const img = card.getAttribute('data-img') || './images/MandalayAirPort.jpg';
            const code = card.getAttribute('data-code') || 'MBAYLV826';

            if (detailTitle) detailTitle.textContent = title;
            if (detailBreadcrumbTitle) detailBreadcrumbTitle.textContent = title;
            if (detailBanner) detailBanner.src = img;
            if (detailPromoCode) detailPromoCode.textContent = `DEAL BAY SALARY BACK - CODE: ${code}`;

            if (detailModal) {
                detailModal.classList.add('active');
                window.scrollTo({ top: 0 });
            }
        });
    });

    if (closeDetailBtn && detailModal) {
        closeDetailBtn.addEventListener('click', () => {
            detailModal.classList.remove('active');
        });
    }

    if (bookNowBtn && detailModal) {
        bookNowBtn.addEventListener('click', () => {
            detailModal.classList.remove('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("voucher-modal");
  const closeBtn = document.getElementById("close-voucher-btn");
  const ticketCards = document.querySelectorAll(".voucher-ticket");

  ticketCards.forEach((ticket) => {
    ticket.addEventListener("click", () => {
      const title = ticket.querySelector("h3")?.innerText;
      const subtitle = ticket.querySelector("p")?.innerText;

      const discountTitle = document.getElementById("modal-discount-title");
      const discountSubtitle = document.getElementById("modal-discount-subtitle");

      if (title && discountTitle) discountTitle.innerText = title;
      if (subtitle && discountSubtitle) discountSubtitle.innerText = subtitle;

      if (modal) modal.classList.add("active");
    });
  });

  if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
      });
  }

  if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active");
        }
      });
  }
});