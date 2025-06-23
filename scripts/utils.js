export function showError(message) {
    let errorAlert = document.getElementById("errorAlert");
    let errorMessage;

    // If the alert box doesn't exist, create it
    if (!errorAlert) {
        errorAlert = document.createElement("div");
        errorAlert.id = "errorAlert";
        errorAlert.className = "error-alert";

        errorMessage = document.createElement("span");
        errorMessage.id = "errorMessage";
        errorAlert.appendChild(errorMessage);

        const dismissBtn = document.createElement("button");
        dismissBtn.className = "dismiss-button";
        dismissBtn.innerHTML = "&times;";
        dismissBtn.onclick = () => errorAlert.style.display = "none";
        errorAlert.appendChild(dismissBtn);

        document.body.appendChild(errorAlert);
    } else {
        errorMessage = document.getElementById("errorMessage");
    }

    // Set the message
    errorMessage.textContent = message;
    errorAlert.style.display = "flex";

    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorAlert.style.display = "none";
        errorMessage.textContent = "";
    }, 5000);
}

export function dismissError() {
    const errorAlert = document.getElementById("errorAlert");
    if (errorAlert) {
        errorAlert.style.display = "none";
        const message = document.getElementById("errorMessage");
        if (message) message.textContent = "";
    }
}

window.showError = showError;
window.dismissError = dismissError;