// renderers/parkRenderer.js

/**
 * Renders the "Park" (Hobbies & Interests) section as a simple dashboard.
 */
export function renderPark() {
    // This is all static HTML. You can easily edit the text here.
    const parkHTML = `
        <div class="dashboard-grid">

            <div class="hobby-card">
                <h3 class="pixel-heading">Off-Time</h3>
                <p>
                    When I'm not coding, I'm usually diving into the world of gaming. I love the blend of storytelling, strategy, and artistry in games. It's the same passion for building and creating that drives me in software development.
                </p>
                <p>
                    Favorite Genres: RPGs, Strategy, and Indie Games.
                </p>
            </div>

            <div class="hobby-card">
                <h3 class="pixel-heading">Continuous Learning</h3>
                <p>
                    I believe in staying sharp. I regularly solve problems on platforms like LeetCode and contribute to personal projects on GitHub to explore new technologies.
                </p>
                <div class="placeholder-text">[ LeetCode & GitHub Stats Coming Soon ]</div>
            </div>

            <div class="hobby-card">
                <h3 class="pixel-heading">Game Tracker</h3>
                <p>
                    Here's a look at what I'm currently playing.
                </p>
                <div class="placeholder-text">[ Live Game Activity Tracker Coming Soon ]</div>
            </div>

        </div>
    `;

    return parkHTML;
}