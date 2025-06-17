document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll('.nav-links');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll('.dashboard-header-tabs');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const favIcons = document.querySelectorAll(".favourite-icon");

    favIcons.forEach(icon => {
        icon.addEventListener("click", function () {
            this.classList.toggle("active");
        });
    });
});