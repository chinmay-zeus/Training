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
const hamburger = document.querySelector('.hamburger-menu-icon');
const menu = document.getElementById('hamburger-menu-preview');
const alertReads = document.querySelectorAll('.green-check');
alertReads.forEach(read => {
    read.addEventListener('click', function () {
        const icon = this.querySelector('img');
        if (icon) {
            icon.src = "../Assests/icons/green_check.svg";
            icon.style.pointerEvents = 'none';
        }
        this.style.cursor = 'default';
        const container = this.closest('.alert-container');
        if (container) {
            container.classList.add('read');
        }
    });
});
const cardIcons = document.querySelectorAll('.card-icon');
cardIcons.forEach(icon => {
    icon.addEventListener('click', function () {
        this.classList.toggle('disable');
    });
});

async function renderCourses() {
  try {
    const res = await fetch('../JsonData/DashboradData.json');
    const data = await res.json();

    const container = document.querySelector('.courses');
    container.innerHTML = '';

    data.courses.forEach(course => {
      const card = document.createElement('div');
      card.className = 'course-card';

      card.innerHTML = `
        <div class="course-info">
          <img src="${course.image}" alt="">
          <div class="course-details">
            <div class="course-detials-header">
              <div class="course-title">${course.title}</div>
              <div class="favourite-icon">
                <img src="../Assests/icons/favourite.svg" alt="">
              </div>
            </div>
            <div class="course-details-small">${course.subject} &nbsp; | &nbsp; ${course.grade}</div>
            <div class="course-details-small">
              <strong>${course.units}</strong> Units 
              <strong>${course.lessons}</strong> Lessons 
              <strong>${course.topics}</strong> Topics
            </div>
            <div class="teacher-input">
              <select class="custom-select" style="background-color: #FFFFFF; height: 27px; width: 264px;" ${course.classes.length ? '' : 'disabled'}>
                ${course.classes.length 
                  ? course.classes.map(cls => `<option>${cls}</option>`).join('')
                  : `<option>No Classes</option>`}
              </select>
            </div>
            <div class="course-details-small">
              ${course.students > 0 ? `${course.students} students &nbsp; ${course.startDate? `${course.startDate} -` : ``}  ${course.endDate || ``}` : ''}
            </div>
          </div>
        </div>
        <div class="card-icons">
          <div class="preview-icon icon-container"><img class="card-icon" src="../Assests/icons/preview.svg" alt="View"></div>
          <div class="manage-course-icon icon-container"><img class="card-icon" src="../Assests/icons/manage course.svg" alt="Manage"></div>
          <div class="grade-submissions-icon icon-container"><img class="card-icon" src="../Assests/icons/grade submissions.svg" alt="Grade"></div>
          <div class="reports-icon icon-container"><img class="card-icon" src="../Assests/icons/reports.svg" alt="Reports"></div>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading courses:', error);
  }
}

document.addEventListener('DOMContentLoaded', function () {
    renderCourses();
  });

