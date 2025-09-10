/**
 * Generates HTML for the projects section.
 * @param {Array} projects - An array of project objects fetched from Sanity.
 */
export function renderWorkshop(projects) {
    if (!projects || projects.length === 0) {
        return "<p>No projects found. Check back soon!</p>";
    }

    const projectHTML = projects.map(project => {
        const technologiesHTML = project.technologies 
            ? project.technologies.map(tech => `<li>${tech}</li>`).join('') 
            : '';

        return `
            <div class="project-card">
                <h3>${project.title}</h3>
                <div class="project-content">
                    <div class="project-description">
                        ${project.description ? project.description.map(block => `<p>${block.children.map(child => child.text).join('')}</p>`).join('') : ''}
                    </div>
                    <ul class="project-tech-list">
                        ${technologiesHTML}
                    </ul>
                    <div class="project-links">
                        ${project.githubLink ? `<a href="${project.githubLink}" target="_blank">View Code</a>` : ''}
                        ${project.liveDemoLink ? `<a href="${project.liveDemoLink}" target="_blank">Live Demo</a>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    return projectHTML;
}