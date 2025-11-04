/**
 * Custom Alert System
 * Standardized alert and confirm dialogs matching website theme
 */

// Show custom alert
function showCustomAlert(message, type = 'info', title = null) {
    return new Promise((resolve) => {
        const overlay = document.getElementById('customAlertOverlay');
        const icon = document.getElementById('customAlertIcon');
        const titleEl = document.getElementById('customAlertTitle');
        const messageEl = document.getElementById('customAlertMessage');
        const okBtn = document.getElementById('customAlertOkBtn');

        // Set icon based on type
        const icons = {
            success: '<i class="fa fa-check-circle"></i>',
            error: '<i class="fa fa-times-circle"></i>',
            warning: '<i class="fa fa-exclamation-triangle"></i>',
            info: '<i class="fa fa-info-circle"></i>'
        };

        icon.innerHTML = icons[type] || icons.info;
        icon.className = `custom-alert-icon ${type}`;

        // Set title
        const titles = {
            success: 'Success!',
            error: 'Error',
            warning: 'Warning',
            info: 'Information'
        };
        titleEl.textContent = title || titles[type] || 'Alert';

        // Set message
        messageEl.textContent = message;

        // Show overlay
        overlay.classList.add('show');

        // Handle OK button
        const handleOk = () => {
            overlay.classList.remove('show');
            okBtn.removeEventListener('click', handleOk);
            overlay.removeEventListener('click', handleOverlayClick);
            resolve(true);
        };

        // Handle clicking outside
        const handleOverlayClick = (e) => {
            if (e.target === overlay) {
                handleOk();
            }
        };

        okBtn.addEventListener('click', handleOk);
        overlay.addEventListener('click', handleOverlayClick);
    });
}

// Show custom confirm dialog
function showCustomConfirm(message, title = 'Confirm') {
    return new Promise((resolve) => {
        const overlay = document.getElementById('customAlertOverlay');
        const icon = document.getElementById('customAlertIcon');
        const titleEl = document.getElementById('customAlertTitle');
        const messageEl = document.getElementById('customAlertMessage');
        const buttonsContainer = document.getElementById('customAlertButtons');

        // Set icon for confirmation
        icon.innerHTML = '<i class="fa fa-question-circle"></i>';
        icon.className = 'custom-alert-icon warning';

        // Set title and message
        titleEl.textContent = title;
        messageEl.textContent = message;

        // Create Yes/No buttons
        buttonsContainer.innerHTML = `
            <button class="custom-alert-btn secondary" id="customAlertNoBtn">Cancel</button>
            <button class="custom-alert-btn" id="customAlertYesBtn">Confirm</button>
        `;

        // Show overlay
        overlay.classList.add('show');

        const yesBtn = document.getElementById('customAlertYesBtn');
        const noBtn = document.getElementById('customAlertNoBtn');

        const handleYes = () => {
            overlay.classList.remove('show');
            cleanup();
            resolve(true);
        };

        const handleNo = () => {
            overlay.classList.remove('show');
            cleanup();
            resolve(false);
        };

        const cleanup = () => {
            yesBtn.removeEventListener('click', handleYes);
            noBtn.removeEventListener('click', handleNo);
            overlay.removeEventListener('click', handleOverlayClick);
            // Reset to single OK button
            buttonsContainer.innerHTML = '<button class="custom-alert-btn" id="customAlertOkBtn">OK</button>';
        };

        const handleOverlayClick = (e) => {
            if (e.target === overlay) {
                handleNo();
            }
        };

        yesBtn.addEventListener('click', handleYes);
        noBtn.addEventListener('click', handleNo);
        overlay.addEventListener('click', handleOverlayClick);
    });
}

// Initialize alert modal HTML on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if alert modal already exists
    if (!document.getElementById('customAlertOverlay')) {
        const alertHTML = `
            <div class="custom-alert-overlay" id="customAlertOverlay">
                <div class="custom-alert-box">
                    <div class="custom-alert-icon" id="customAlertIcon">
                        <i class="fa fa-info-circle"></i>
                    </div>
                    <h3 class="custom-alert-title" id="customAlertTitle">Alert</h3>
                    <p class="custom-alert-message" id="customAlertMessage"></p>
                    <div class="custom-alert-btn-group" id="customAlertButtons">
                        <button class="custom-alert-btn" id="customAlertOkBtn">OK</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', alertHTML);
    }
});
