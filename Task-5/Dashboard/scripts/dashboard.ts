const links = document.querySelectorAll<HTMLElement>('.nav-links');
links.forEach(link => {
    link.addEventListener('click', function (e: Event) {
        e.preventDefault();
        links.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

const dashboardLinks = document.querySelectorAll<HTMLElement>('.dashboard-header-tabs');
dashboardLinks.forEach(link => {
    link.addEventListener('click', function (e: Event) {
        e.preventDefault();
        dashboardLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

const favIcons = document.querySelectorAll<HTMLElement>(".favourite-icon");
favIcons.forEach(icon => {
    icon.addEventListener("click", function () {
        this.classList.toggle("active");
    });
});

function setupPreview(triggerSelector: string, previewId: string): void {
    const trigger = document.querySelector(triggerSelector) as HTMLElement | null;
    const preview = document.getElementById(previewId) as HTMLElement | null;

    if (!trigger || !preview) {
        console.warn(`Trigger or preview element not found for selector: ${triggerSelector} or ID: ${previewId}`);
        return;
    }

    let hideTimeout: ReturnType<typeof setTimeout>;

    function showPreview() {
        clearTimeout(hideTimeout);
        if (preview) {
            preview.classList.add('show');
        }
    }

    function hidePreview() {
        hideTimeout = setTimeout(() => {
            if (preview) {
                preview.classList.remove('show');
            }
        }, 120);
    }

    trigger.addEventListener('mouseenter', showPreview);
    trigger.addEventListener('mouseleave', hidePreview);
    preview.addEventListener('mouseenter', showPreview);
    preview.addEventListener('mouseleave', hidePreview);
}

setupPreview('#alert-icon', 'alert-preview');
setupPreview('#announcement-icon', 'announcement-preview');
setupPreview('#hamburger-icon', 'hamburger-menu-preview');

const hamburger = document.querySelector('.hamburger-menu-icon') as HTMLElement | null;
const menu = document.getElementById('hamburger-menu-preview') as HTMLElement | null;

const alertReads = document.querySelectorAll<HTMLElement>('.green-check');
alertReads.forEach(read => {
    read.addEventListener('click', function () {
        const icon = this.querySelector('img') as HTMLImageElement | null;
        if (icon) {
            icon.src = "../Assests/icons/green_check.svg";
            icon.style.pointerEvents = 'none';
        }
        this.style.cursor = 'default';
        const container = this.closest('.alert-container') as HTMLElement | null;
        if (container) {
            container.classList.add('read');
        }
    });
});

const cardIcons = document.querySelectorAll<HTMLElement>('.card-icon');
cardIcons.forEach(icon => {
    icon.addEventListener('click', function () {
        this.classList.toggle('disable');
    });
});
