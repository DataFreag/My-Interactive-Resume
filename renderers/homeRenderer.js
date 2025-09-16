/**
 * Generates HTML for the projects section.
 */
// renderers/homeRenderer.js

// --- 1. YOUR PERSONAL DATA ---
// Update this object with your own details.
const profileData = {
    name: "Your Name",
    role: "Role Role Role",
    location: "Ames, Iowa",
    status: "Open to new opportunities",
    profilePicUrl: "https://via.placeholder.com/250", // TODO: Replace with a URL to your actual photo
    bio: `BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO BIO `,
    contact: {
        email: "mailto:your.email@example.com",
        linkedin: "https://www.linkedin.com/in/yourprofile/",
        github: "https://github.com/yourusername"
    },
    highlights: [
        "Proficient in building full-stack applications with JavaScript, React, and Node.js.",
        "Experienced in creating and consuming RESTful APIs for dynamic content.",
        "A strong believer in clean code, modular architecture, and user-centric design.",
        "Always learning and currently exploring WebGL and game development."
    ]
};


/**
 * Renders the entire HTML structure for the "Home" (About Me) modal.
 */
export function renderHome() {
    // --- 2. GENERATE THE HTML ---
    const highlightsHTML = profileData.highlights.map(item => `<li>${item}</li>`).join('');

    const homeHTML = `
        <div class="profile-wrapper">
            <div class="profile-sidebar">
                <img src="${profileData.profilePicUrl}" alt="Profile Picture" class="profile-picture">
                <div class="profile-stats">
                    <div class="stat-item">
                        <span class="stat-label pixel-heading">Name</span>
                        <span class="stat-value">${profileData.name}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label pixel-heading">Role</span>
                        <span class="stat-value">${profileData.role}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label pixel-heading">Location</span>
                        <span class="stat-value">${profileData.location}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label pixel-heading">Status</span>
                        <span class="stat-value status-available">${profileData.status}</span>
                    </div>
                </div>
            </div>

            <div class="profile-main-content">
                <div class="tab-buttons">
                    <button class="tab-btn active" data-tab="bio">Bio</button>
                    <button class="tab-btn" data-tab="highlights">Highlights</button>
                    <button class="tab-btn" data-tab="contact">Contact</button>
                </div>
                <div class="tab-content">
                    <div class="tab-panel active" id="bio">
                        <h3 class="pixel-heading">About Me</h3>
                        <p>${profileData.bio}</p>
                    </div>
                    <div class="tab-panel" id="highlights">
                        <h3 class="pixel-heading">Key Highlights</h3>
                        <ul>${highlightsHTML}</ul>
                    </div>
                    <div class="tab-panel" id="contact">
                        <h3 class="pixel-heading">Get In Touch</h3>
                        <div class="contact-links">
                            <a href="${profileData.contact.email}" class="contact-link">Email</a>
                            <a href="${profileData.contact.linkedin}" target="_blank" class="contact-link">LinkedIn</a>
                            <a href="${profileData.contact.github}" target="_blank" class="contact-link">GitHub</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // --- 3. ATTACH EVENT LISTENERS ---
    // We use a timeout to ensure the HTML is in the DOM before we add listeners.
    setTimeout(() => {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and panels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));

                // Add active class to the clicked button and corresponding panel
                button.classList.add('active');
                const tabId = button.dataset.tab;
                document.getElementById(tabId).classList.add('active');
            });
        });
    }, 0);

    return homeHTML;
}