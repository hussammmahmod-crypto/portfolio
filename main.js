var typed = new Typed(".text", {
    strings: ["AI Engineer", "Machine Learning", "Software Developer","Image Processing"],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});

// Highlight active nav link based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Contact form submit feedback
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        formStatus.textContent = "Thank you! Your message has been noted.";
        contactForm.reset();
    });
}
const revealSections = document.querySelectorAll("section");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        } else {
            entry.target.classList.remove("show");
        }
    });
}, {
    threshold: 0.25
});

revealSections.forEach((section) => {
    observer.observe(section);
});

const orbitRotator = document.getElementById("orbitRotator");
const orbitPoints = document.querySelectorAll(".orbit-point");
const orbitContent = document.getElementById("orbitContent");
const academicSection = document.getElementById("academic");

const defaultAcademicContent = `
    <h3>Academic Journey</h3>
    <p>Select one option to view details.</p>
`;

const educationData = {
    university: {
        title: "Bachelor of Artificial Intelligence Engineering",
        text: "Universiti Teknikal Malaysia Melaka (UTeM)<br>Expected Graduation: 2028"
    },
    school: {
        title: "Secondary School Education",
        text: "Al-Amal Generations Secondary School, Syria<br>2022 – 2023"
    }
};

orbitPoints.forEach(point => {
    point.addEventListener("click", () => {
        const stage = point.getAttribute("data-stage");

        orbitRotator.classList.add("paused");

        orbitPoints.forEach(p => p.classList.remove("active"));
        point.classList.add("active");

        orbitContent.innerHTML = `
            <h3>${educationData[stage].title}</h3>
            <p>${educationData[stage].text}</p>
        `;
    });
});

window.addEventListener("scroll", () => {
    const rect = academicSection.getBoundingClientRect();

    if (rect.bottom < 100 || rect.top > window.innerHeight - 100) {
        orbitRotator.classList.remove("paused");
        orbitPoints.forEach(p => p.classList.remove("active"));
        orbitContent.innerHTML = defaultAcademicContent;
    }
});
//

//
const projectsContainer = document.querySelector(".projects-container");
let projectCards = document.querySelectorAll(".project-card");
const prevProject = document.querySelector(".prev-project");
const nextProject = document.querySelector(".next-project");
const projectDots = document.querySelectorAll(".projects-dots .dot");

let isDraggingProject = false;
let projectStartX = 0;
let projectScrollLeft = 0;
let isAdjusting = false;

if (projectsContainer) {
    const originalCards = Array.from(projectCards);
    const originalCardsCount = originalCards.length;

    for (let i = 0; i < 3; i++) {
        originalCards.forEach(card => {
            projectsContainer.appendChild(card.cloneNode(true));
        });
    }

    projectCards = document.querySelectorAll(".project-card");

    function getOriginalWidth() {
        return projectsContainer.scrollWidth / 4;
    }

    function getProjectStep() {
        const gap = parseInt(window.getComputedStyle(projectsContainer).gap) || 30;
        return projectCards[0].offsetWidth + gap;
    }

    function updateDots() {
        if (!projectDots.length) return;

        const step = getProjectStep();
        const originalWidth = getOriginalWidth();

        let index = Math.round((projectsContainer.scrollLeft - originalWidth) / step);
        index = ((index % originalCardsCount) + originalCardsCount) % originalCardsCount;

        projectDots.forEach(dot => dot.classList.remove("active"));

        if (projectDots[index]) {
            projectDots[index].classList.add("active");
        }
    }

    function checkInfinitePosition() {
        if (isAdjusting) return;

        const originalWidth = getOriginalWidth();
        const left = projectsContainer.scrollLeft;

        if (left >= originalWidth * 3) {
            isAdjusting = true;
            projectsContainer.scrollLeft = left - originalWidth;
            isAdjusting = false;
        }

        if (left <= originalWidth * 0.5) {
            isAdjusting = true;
            projectsContainer.scrollLeft = left + originalWidth;
            isAdjusting = false;
        }

        updateDots();
    }

    projectsContainer.scrollLeft = getOriginalWidth();
    updateDots();

    projectsContainer.addEventListener("pointerdown", (e) => {
        if (e.target.closest(".project-btn")) return;

        isDraggingProject = true;
        projectsContainer.classList.add("dragging");
        projectsContainer.setPointerCapture(e.pointerId);

        projectStartX = e.pageX;
        projectScrollLeft = projectsContainer.scrollLeft;
    });

    projectsContainer.addEventListener("pointerup", (e) => {
        isDraggingProject = false;
        projectsContainer.classList.remove("dragging");

        try {
            projectsContainer.releasePointerCapture(e.pointerId);
        } catch {}
    });

    projectsContainer.addEventListener("pointerleave", () => {
        isDraggingProject = false;
        projectsContainer.classList.remove("dragging");
    });

    projectsContainer.addEventListener("pointermove", (e) => {
        if (!isDraggingProject) return;
        if (e.target.closest(".project-btn")) return;

        e.preventDefault();

        const walk = (e.pageX - projectStartX) * 1.2;
        projectsContainer.scrollLeft = projectScrollLeft - walk;

        checkInfinitePosition();
    });

    projectsContainer.addEventListener("scroll", () => {
        requestAnimationFrame(checkInfinitePosition);
    });

    projectsContainer.addEventListener("wheel", () => {
        requestAnimationFrame(checkInfinitePosition);
    });

    if (nextProject) {
        nextProject.addEventListener("click", () => {
            projectsContainer.scrollBy({
                left: getProjectStep(),
                behavior: "smooth"
            });

            setTimeout(checkInfinitePosition, 500);
        });
    }

    if (prevProject) {
        prevProject.addEventListener("click", () => {
            projectsContainer.scrollBy({
                left: -getProjectStep(),
                behavior: "smooth"
            });

            setTimeout(checkInfinitePosition, 500);
        });
    }
}

document.querySelectorAll(".project-btn").forEach(btn => {
    btn.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
    });

    btn.addEventListener("click", (e) => {
        e.stopPropagation();

        const link = btn.getAttribute("href");
        window.open(link, "_blank");
    });
});

const achievementItems = document.querySelectorAll(".achievement-item");

achievementItems.forEach(item => {
    const header = item.querySelector(".achievement-header");

    header.addEventListener("click", () => {

        achievementItems.forEach(other => {
            if (other !== item) {
                other.classList.remove("active");
            }
        });

        item.classList.toggle("active");
    });
});

// ============ IN-PAGE CERTIFICATE VIEWER ============
const certModal = document.getElementById('certModal');
const certModalImg = document.getElementById('certModalImg');
const certModalFrame = document.getElementById('certModalFrame');
const certModalClose = document.querySelector('.cert-modal-close');

document.querySelectorAll('.achievement-content a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const certUrl = this.getAttribute('href');
        
        // Convert to lowercase to check the file extension type safely
        const isPdf = certUrl.toLowerCase().endsWith('.pdf');
        
        // Reset display states first
        certModalImg.style.display = 'none';
        certModalFrame.style.display = 'none';
        
        if (isPdf) {
            // It's a PDF -> Use the iframe loader
            certModalFrame.src = certUrl;
            certModalFrame.style.display = 'block';
        } else {
            // It's an image (.jpg, .png) -> Use the direct image tag loader
            certModalImg.src = certUrl;
            certModalImg.style.display = 'block';
        }
        
        certModal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    });
});

function closeCertModal() {
    certModal.classList.remove('open');
    // Flush both targets to save device memory
    certModalFrame.src = "";
    certModalImg.src = "";
    document.body.style.overflow = ''; // Restore page scroll
}

if (certModalClose) {
    certModalClose.addEventListener('click', closeCertModal);
}

if (certModal) {
    certModal.addEventListener('click', function(e) {
        if (e.target === certModal) {
            closeCertModal();
        }
    });
}