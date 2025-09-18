// renderers/galleryRenderer.js

export function renderGallery(skills, certifications) {
    // --- GENERATE HTML ---
    const skillCategories = ['All', ...new Set(skills.map(skill => skill.category).filter(Boolean))];

    const filterButtonsHTML = skillCategories.map(category => `
        <button class="filter-btn" data-filter="${category}">${category}</button>
    `).join('');

    const skillsCarouselHTML = skills.map(skill => `
        <div class="skill-card" data-category="${skill.category}">
            <img src="${skill.imageUrl}" alt="${skill.title} Logo" class="skill-logo">
            <span class="skill-name">${skill.title}</span>
        </div>
    `).join('');

    const certsListHTML = certifications.map(cert => `
        <div class="cert-plaque">
            <h4 class="cert-title">${cert.title}</h4>
            <p class="cert-institution">${cert.institution}</p>
            <a href="${cert.certificationUrl}" target="_blank" class="cert-link">View Credential</a>
        </div>
    `).join('');

    
    const galleryHTML = `
        <div class="gallery-wrapper">
            <div class="skills-exhibit">
                <h3 class="pixel-heading">Skills</h3>
                <div class="filter-bar">${filterButtonsHTML}</div>
                <div class="skills-carousel-wrapper">
                    <button class="carousel-nav-btn prev">&lt;</button>
                    <div class="skills-carousel-container">${skillsCarouselHTML}</div>
                    <button class="carousel-nav-btn next">&gt;</button>
                </div>
            </div>
            <div class="certs-wall">
                <h3 class="pixel-heading">Certifications</h3>
                <div class="certs-list">${certsListHTML}</div>
            </div>
        </div>
    `;

    // --- ATTACH EVENT LISTENERS ---
    setTimeout(() => {
        const filterBar = document.querySelector('.filter-bar');
        const skillCards = document.querySelectorAll('.skill-card');
        const filterButtons = document.querySelectorAll('.filter-btn');
        

        if (filterButtons.length > 0) {
            filterButtons[0].classList.add('active');
        }

        filterBar.addEventListener('click', (event) => {
            const clickedButton = event.target.closest('.filter-btn');
            if (!clickedButton) return;

            filterButtons.forEach(btn => btn.classList.remove('active'));
            clickedButton.classList.add('active');

            const filter = clickedButton.dataset.filter;

            
            skillCards.forEach(card => {
                if (filter === 'All' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    }, 0);

    return galleryHTML;
}