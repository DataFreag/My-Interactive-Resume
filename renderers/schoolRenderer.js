// renderers/schoolRenderer.js

/**
 * Renders the Education section as a showcase of diploma-style cards.
 * @param {Array} educationList - The array of education objects from Sanity.
 */
export function renderSchool(educationList) {
    if (!educationList || educationList.length === 0) {
        return "<p>No education details available.</p>";
    }

    // --- GENERATE THE HTML FOR EACH DIPLOMA CARD ---
    const educationHTML = educationList.map(edu => {
        // Format dates
        const startDate = new Date(edu.startDate).getFullYear();
        const endDate = edu.endDate ? new Date(edu.endDate).getFullYear() : 'Ongoing';
        
        // Sanity rich text descriptions are arrays of blocks
        const descriptionHTML = edu.description
            ? edu.description.map(block => `<p>${block.children.map(child => child.text).join('')}</p>`).join('')
            : '';

        return `
            <div class="diploma-card">
                <div class="diploma-header">
                    <img src="${edu.institutionCoverImage?.asset?.url || ''}" alt="${edu.institution} logo" class="institution-logo">
                </div>
                <div class="diploma-body">
                    <h3 class="pixel-heading">${edu.title}</h3>
                    <p class="institution-name">${edu.institution}</p>
                    <p class="education-dates">${startDate} - ${endDate}</p>
                    <div class="education-description">
                        ${descriptionHTML}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Wrap everything in a container
    return `<div class="education-wrapper">${educationHTML}</div>`;
}