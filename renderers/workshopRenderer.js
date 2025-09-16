// workshopRenderer.js

let activeProjectElement = null;
const detailView = document.getElementById('project-detail-view');
let scrollObserver = null;
const modalContent = document.querySelector('.modal-content');

/**
 * Generates HTML for the projects section.
 * @param {Array} projects - An array of project objects fetched from Sanity.
 */
export function renderWorkshop(projects) {
    if (!projects || projects.length === 0) {
        return "<p>Implement Projects</p>";
    }

    // Filter projects into the two lists
    const inProgressProjects = projects.filter(p => !p.projectEndDate);
    const completedProjects = projects.filter(p => p.projectEndDate);

    let timelineColumnHTML = '';
    if (inProgressProjects.length > 0) {
        timelineColumnHTML += `<h2 class="pixel-heading section-title">▶ In Progress</h2>`;
        timelineColumnHTML += `<div class="timeline-container" id="inprogress-timeline">${inProgressProjects.map(createProjectCardHTML).join('')}</div>`;
    }
    if (completedProjects.length > 0) {
        timelineColumnHTML += `<h2 class="pixel-heading section-title">✔ Completed</h2>`;
        timelineColumnHTML += `<div class="timeline-container" id="completed-timeline">${completedProjects.map(createProjectCardHTML).join('')}</div>`;
    }

    const workshopWrapperHTML = `
        <div class="workshop-wrapper">
            <div class="timeline-column">${timelineColumnHTML}</div>
            <div id="project-detail-view"></div>
            <div id="timeline-connector"></div>
        </div>
    `;
    
    setTimeout(() => {
        const workshopWrapper = document.querySelector('.workshop-wrapper');
        const detailView = document.getElementById('project-detail-view');
        setupLazyLoading();
        // Wait for all lazy images to be loaded before positioning timeline items
        const lazyImages = document.querySelectorAll('.lazy');
        if (lazyImages.length === 0) {
            positionTimelineItems();
        } else {
            let loadedCount = 0;
            lazyImages.forEach(img => {
            img.addEventListener('load', () => {
                loadedCount++;
                if (loadedCount === lazyImages.length) {
                positionTimelineItems();
                }
            }, { once: true });
            });
        }
        setupClickListeners(projects, workshopWrapper, detailView);
    }, 0);

    return workshopWrapperHTML;
}

function createProjectCardHTML(project) {
    const startDate = new Date(project.projectStartDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    const endDate = project.projectEndDate ? new Date(project.projectEndDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'In-Progress';
    console.log(project.shortDescription);
    return `
        <div class="timeline-item" data-project-id="${project.title}">
            <div class="timeline-content">
                <img data-src="https://www.mygreatlearning.com/blog/wp-content/uploads/2025/04/rag.jpg" class="project-cover-image lazy" alt="${project.title} cover">
                <h3 class="pixel-heading">${project.title}</h3>
                <div class="timeline-date">${startDate} - ${endDate}</div>
                <p>${project.shortDescription || ''}</p>
            </div>
        </div>
    `;
}

/**
 * Calculates and applies the 'top' position for each timeline item for the compact layout.
 */
function positionTimelineItems() {
    document.querySelectorAll('.timeline-container').forEach(container => {
        let leftHeight = 0;
        let rightHeight = 0;
        const items = container.querySelectorAll('.timeline-item');

        items.forEach((item, index) => {
            if (index % 2 === 0) {
                item.style.top = `${leftHeight}px`;
                leftHeight += item.offsetHeight + 20;
            } else {
                item.style.top = `${rightHeight}px`;
                rightHeight += item.offsetHeight + 20;
            }
        });
        container.style.height = `${Math.max(leftHeight, rightHeight)}px`;
    });
}

/**
 * Sets up the Intersection Observer to lazy load images.
 */
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => observer.observe(img));
}

/**
 * Adds click listeners to each timeline card.
 */
function setupClickListeners(projects, workshopWrapper, detailView) {
    workshopWrapper.addEventListener('click', (event) => {
        const item = event.target.closest('.timeline-item');
        
        if (item) {
            const projectId = item.dataset.projectId;
            const projectData = projects.find(p => p.title === projectId);
            showProjectDetail(projectData, item, workshopWrapper, detailView);
            return;
        }

        if (event.target.closest('.timeline-column')) {
            hideProjectDetail(workshopWrapper, detailView);
        }
    });
}

/**
 * Handles the logic to display the detail view and animate the timeline.
 */
function showProjectDetail(project, element, workshopWrapper, detailView) {
    if (activeProjectElement === element) return;

    workshopWrapper.classList.add('timeline-active');

    if (activeProjectElement) {
        activeProjectElement.classList.remove('active');
    }
    activeProjectElement = element;
    activeProjectElement.classList.add('active');

    requestAnimationFrame(() => {
        // Reposition all cards into their final stacked layout
        document.querySelectorAll('.timeline-container').forEach(container => {
            let stackedHeight = 0;
            container.querySelectorAll('.timeline-item').forEach(item => {
                item.style.top = `${stackedHeight}px`;
                stackedHeight += item.offsetHeight + 20;
            });
            container.style.height = `${stackedHeight}px`;
        });

        const modalContent = document.querySelector('.modal-content');
        const modalRect = modalContent.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const elementTopInScrollableContent = elementRect.top - modalRect.top + modalContent.scrollTop;
        const desiredScrollTop = elementTopInScrollableContent - 30;
        const maxScrollTop = modalContent.scrollHeight - modalContent.clientHeight;
        const finalScrollTop = Math.min(desiredScrollTop, maxScrollTop);

        modalContent.scrollTo({
            top: finalScrollTop,
            behavior: 'smooth'
        });
        
        const connector = document.getElementById('timeline-connector');
        if (connector) {
            const connectorTop = element.offsetTop + element.offsetParent.offsetTop + (element.offsetHeight / 2) - 15;
            connector.style.top = `${connectorTop}px`;
            connector.classList.add('visible');
        }

        if (scrollObserver) scrollObserver.disconnect();
        scrollObserver = new IntersectionObserver((entries) => {
            if (!entries[0].isIntersecting) {
                hideProjectDetail(workshopWrapper, detailView);
            }
        }, { root: modalContent, threshold: 0.1 });
        scrollObserver.observe(activeProjectElement);

        const technologiesHTML = project.technologies?.map(tech => `<span class="tech-tag">${tech}</span>`).join('') || '';
        detailView.innerHTML = `
            <button class="detail-close-btn">&times;</button>
            <h2 class="pixel-heading">${project.title}</h2>
            <div class="project-description">
                ${project.longDescription?.map(block => `<p>${block.children.map(child => child.text).join('')}</p>`).join('') || ''}
            </div>
            <div class="tech-container">${technologiesHTML}</div>
            <div class="project-links">
                ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" class="timeline-button">View Code</a>` : ''}
                ${project.liveDemoLink ? `<a href="${project.liveDemoLink}" target="_blank" class="timeline-button">Live Demo</a>` : ''}
            </div>
        `;
        detailView.scrollTop = 0;
        detailView.querySelector('.detail-close-btn').addEventListener('click', () => {
            hideProjectDetail(workshopWrapper, detailView);
        });
    });
}

/**
 * Hides the detail view and returns the timeline to its original state.
 */
function hideProjectDetail(workshopWrapper, detailView) {
    if (!workshopWrapper.classList.contains('timeline-active')) return;

    workshopWrapper.classList.remove('timeline-active');

    if (activeProjectElement) {
        activeProjectElement.classList.remove('active');
        activeProjectElement = null;
    }

    setTimeout(() => {
        positionTimelineItems();
    }, 500);
}

/**
 * Sets up the observer for auto-collapsing the detail view.
 */
function setupAutoCollapseObserver(element, workshopWrapper, detailView) {
    if (scrollObserver) {
        scrollObserver.disconnect();
    }

    scrollObserver = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) {
            hideProjectDetail(workshopWrapper, detailView);
        }
    }, { 
        root: modalContent,
        threshold: 0.1
    });

    if (element) {
        scrollObserver.observe(element);
    }
}
