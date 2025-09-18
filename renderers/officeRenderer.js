// renderers/officeRenderer.js

/**
 * Renders the Work Experience section with an interactive directory layout.
 * @param {Array} experiences - The array of work experience objects from Sanity.
 */
export function renderOffice(experiences) {
    if (!experiences || experiences.length === 0) {
        return "<p>No work experience listed yet.</p>";
    }

    // --- GENERATE THE HTML STRUCTURE ---
    console.log(experiences);
    const directoryListHTML = experiences.map((exp, index) => `
        <div class="directory-item" data-index="${index}">
            <img src="${exp.companyLogoUrl}" alt="${exp.companyName} Logo" class="company-logo"/>

            <div class="job-info">
                <h4 class="job-title">${exp.title}</h4>
                <p class="company-name">${exp.companyName}</p>
            </div>
        </div>
    `).join('');

    
    const officeHTML = `
        <div class="office-wrapper">
            <div class="directory-panel">${directoryListHTML}</div>
            <div class="detail-panel">
                <div class="detail-placeholder pixel-heading">Select a role to view details</div>
            </div>
        </div>
    `;

    // --- ATTACH EVENT LISTENERS ---
    setTimeout(() => {
        const directoryPanel = document.querySelector('.directory-panel');
        const detailPanel = document.querySelector('.detail-panel');
        const items = document.querySelectorAll('.directory-item');

        directoryPanel.addEventListener('click', (event) => {
            const clickedItem = event.target.closest('.directory-item');
            if (!clickedItem) return;

            
            items.forEach(item => item.classList.remove('active'));
            
            clickedItem.classList.add('active');

            
            const experienceIndex = clickedItem.dataset.index;
            displayExperienceDetails(experiences[experienceIndex], detailPanel);
        });

        
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
    
    const startDate = new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    const endDate = exp.endDate 
        ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) 
        : 'Present';
    
    
    const responsibilitiesHTML = exp.description
        ? exp.description.map(block => `<li>${block.children.map(child => child.text).join('')}</li>`).join('')
        : '';

    panel.innerHTML = `
        <div class="detail-content">
            <h3 class="pixel-heading">${exp.title}</h3>
            <div class="detail-subheading">
                <span class="company-name">${exp.companyName}</span>
                <span class="job-dates">${startDate} - ${endDate}</span>
            </div>
            <ul class="responsibilities-list">
                ${responsibilitiesHTML}
            </ul>
        </div>
    `;
}