const placeholder = document.getElementById("navbar-placeholder");

fetch("../components/navbar.html")
    .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.text();
    })
    .then(html => {
        placeholder.innerHTML = html;
    })
    .catch(error => {
        console.error("Failed to load navbar:", error);
    });
