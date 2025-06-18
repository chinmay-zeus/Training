
const links = document.querySelectorAll('.nav-links');

links.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        links.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

const dashboardLinks = document.querySelectorAll('.dashboard-header-tabs');

dashboardLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        dashboardLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

const favIcons = document.querySelectorAll(".favourite-icon");

favIcons.forEach(icon => {
    icon.addEventListener("click", function () {
        this.classList.toggle("active");
    });
});

// Helper to show/hide preview with animation
function setupPreview(triggerSelector, previewId) {
    const trigger = document.querySelector(triggerSelector);
    const preview = document.getElementById(previewId);

    if (!trigger || !preview) {
        console.warn(`Trigger or preview element not found for selector: ${triggerSelector} or ID: ${previewId}`);
        return;
    }

    let hideTimeout;

    function showPreview() {
        clearTimeout(hideTimeout);
        preview.classList.add('show');
    }

    function hidePreview() {
        hideTimeout = setTimeout(() => {
            preview.classList.remove('show');
        }, 120); // small delay for smoothness
    }

    trigger.addEventListener('mouseenter', showPreview);
    trigger.addEventListener('mouseleave', hidePreview);
    preview.addEventListener('mouseenter', showPreview);
    preview.addEventListener('mouseleave', hidePreview);
}

// Setup for hamburger, alert, and announcement

setupPreview('#alert-icon', 'alert-preview');
setupPreview('#announcement-icon', 'announcement-preview');
setupPreview('#hamburger-icon', 'hamburger-menu-preview');

const hamburger = document.querySelector('.hamburger-menu-icon');
const menu = document.getElementById('hamburger-menu-preview');

const alertReads =  document.querySelectorAll('.green-check');
alertReads.forEach(read => {
    read.addEventListener('click', function() {
        const icon = this.querySelector('img');
        icon.src = "Assests/icons/green_check.svg";
        icon.style.pointerEvents = 'none';
        this.style.cursor = 'default';
        this.closest('.alert-container').classList.add('read');
    });
});
