// renderers/officeRenderer.js

/**
 * Renders the Work Experience section with an interactive directory layout.
 * @param {Array} experiences - The array of work experience objects from Sanity.
 */
export function renderOffice(experiences) {
    if (!experiences || experiences.length === 0) {
        return "<p>No work experience listed yet.</p>";
    }

    // --- 1. GENERATE THE HTML STRUCTURE ---
    // Create the list of jobs for the left-hand directory.
    // We add a 'data-index' to each item to know which one was clicked.
    const directoryListHTML = experiences.map((exp, index) => `
        <div class="directory-item" data-index="${index}">
            <h4 class="job-title">${exp.title}</h4>
            <p class="company-name">${exp.institution}</p>
        </div>
    `).join('');

    // Create the full two-panel layout. The right panel starts empty.
    const officeHTML = `
        <div class="office-wrapper">
            <div class="directory-panel">${directoryListHTML}</div>
            <div class="detail-panel">
                <div class="detail-placeholder pixel-heading">Select a role to view details</div>
            </div>
        </div>
    `;

    // --- 2. ATTACH EVENT LISTENERS ---
    setTimeout(() => {
        const directoryPanel = document.querySelector('.directory-panel');
        const detailPanel = document.querySelector('.detail-panel');
        const items = document.querySelectorAll('.directory-item');

        directoryPanel.addEventListener('click', (event) => {
            const clickedItem = event.target.closest('.directory-item');
            if (!clickedItem) return;

            // Remove 'active' class from all other items
            items.forEach(item => item.classList.remove('active'));
            // Add 'active' class to the one that was clicked
            clickedItem.classList.add('active');

            // Get the index and display the details
            const experienceIndex = clickedItem.dataset.index;
            displayExperienceDetails(experiences[experienceIndex], detailPanel);
        });

        // Optional: Automatically click the first item to show details on load
        if (items.length > 0) {
            items[0].click();
        }
    }, 0);

    return officeHTML;
}

/**
 * A helper function to populate the right-hand detail panel.
 * @param {object} exp - The specific experience object to display.
 * @param {HTMLElement} panel - The detail panel element.
 */
function displayExperienceDetails(exp, panel) {
    // Format dates for display
    const startDate = new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    const endDate = exp.endDate 
        ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) 
        : 'Present';
    
    // Sanity rich text descriptions are arrays of blocks
    const responsibilitiesHTML = exp.description
        ? exp.description.map(block => `<li>${block.children.map(child => child.text).join('')}</li>`).join('')
        : '';

    panel.innerHTML = `
        <div class="detail-content">
            <h3 class="pixel-heading">${exp.title}</h3>
            <div class="detail-subheading">
                <span class="company-name">${exp.institution}</span>
                <span class="job-dates">${startDate} - ${endDate}</span>
            </div>
            <ul class="responsibilities-list">
                ${responsibilitiesHTML}
            </ul>
        </div>
    `;
}