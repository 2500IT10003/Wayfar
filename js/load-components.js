document.addEventListener("DOMContentLoaded", function() {
    // Load Header
    fetch("components/header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-placeholder").innerHTML = data;
            
            // Immediately update the navbar state the millisecond the header loads
            if (typeof updateNavbarAuthState === 'function') {
                updateNavbarAuthState();
            }
        });

    // Load Footer
    fetch("components/footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        });
});