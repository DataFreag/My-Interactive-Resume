document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('map-container');
    const resumeModal = document.getElementById('resume-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalCloseBtn = document.querySelector('.modal-close-btn');

    // Get references to all car elements
    const taxiCar = document.getElementById('taxi-moving-car');
    const redCar = document.getElementById('red-moving-car');
    const greenCar = document.getElementById('green-moving-car');

    // Get references to all walking sprite elements
    const boySprite = document.getElementById('boy-walking-sprite');
    const girlSprite = document.getElementById('girl-walking-sprite');
    const manSprite = document.getElementById('man-walking-sprite');
    const workerSprite1 = document.getElementById('worker-walking-sprite-1');
    const workerSprite2 = document.getElementById('worker-walking-sprite-2');

    // Define your resume content here. (No changes from previous version)
    const resumeContent = {
        home: {
            title: "About Me & Contact",
            content: `
                <p>Hello! I'm [Your Name], a passionate [Your Profession] with a knack for [Your Key Skill]. I love creating engaging experiences and solving complex problems with elegant solutions.</p>
                <p><strong>Contact:</strong></p>
                <ul>
                    <li>Email: your.email@example.com</li>
                    <li>LinkedIn: <a href="https://linkedin.com/in/yourprofile" target="_blank" class="text-blue-600 hover:underline">linkedin.com/in/yourprofile</a></li>
                    <li>GitHub: <a href="https://github.com/yourprofile" target="_blank" class="text-blue-600 hover:underline">github.com/yourprofile</a></li>
                    <li>Phone: (123) 456-7890</li>
                </ul>
                <p>Feel free to explore my interactive resume by clicking on different buildings!</p>
            `
        },
        office: {
            title: "Work Experience",
            content: `
                <h3>[Job Title 1] at [Company Name 1]</h3>
                <p><strong>[Start Date] – [End Date]</strong></p>
                <ul>
                    <li>[Achievement 1]: Briefly describe a key accomplishment and its impact.</li>
                    <li>[Responsibility 1]: Detail a significant responsibility.</li>
                    <li>[Technology 1]: Mention technologies used.</li>
                </ul>
                <h3>[Job Title 2] at [Company Name 2]</h3>
                <p><strong>[Start Date] – [End Date]</strong></p>
                <ul>
                    <li>[Achievement 2]: Another key accomplishment.</li>
                    <li>[Responsibility 2]: Another significant responsibility.</li>
                    <li>[Technology 2]: More technologies.</li>
                </ul>
            `
        },
        gallery: {
            title: "Skills & Technologies",
            content: `
                <p>My technical toolkit includes:</p>
                <ul>
                    <li><strong>Programming Languages:</strong> JavaScript, Python, Java, C++</li>
                    <li><strong>Frameworks/Libraries:</strong> React, Node.js, Express, Django, Spring Boot</li>
                    <li><strong>Databases:</strong> MongoDB, PostgreSQL, MySQL, Firestore</li>
                    <li><strong>Tools & Platforms:</strong> Git, Docker, AWS, Google Cloud Platform, Figma</li>
                    <li><strong>Other:</strong> RESTful APIs, Agile Methodologies, UI/UX Design Principles</li>
                </ul>
            `
        },
        workshop: {
            title: "Projects",
            content: `
                <h3>[Project Name 1]</h3>
                <p><strong>Description:</strong> [Brief description of the project, what it does, and your role.]</p>
                <p><strong>Technologies:</strong> [List technologies used, e.g., React, Node.js, MongoDB]</p>
                <p><strong>Link:</strong> <a href="[Project URL]" target="_blank" class="text-blue-600 hover:underline">[Live Demo / GitHub Repo]</a></p>

                <h3>[Project Name 2]</h3>
                <p><strong>Description:</strong> [Brief description of the project, what it does, and your role.]</p>
                <p><strong>Technologies:</strong> [List technologies used, e.g., Python, Django, PostgreSQL]</p>
                <p><strong>Link:</strong> <a href="[Project URL]" target="_blank" class="text-blue-600 hover:underline">[Live Demo / GitHub Repo]</a></p>
            `
        },
        school: {
            title: "Education",
            content: `
                <h3>[Degree Name], [Major]</h3>
                <p><strong>[University Name], [City, State]</strong></p>
                <p><strong>[Graduation Year]</strong></p>
                <ul>
                    <li>Relevant Coursework: [List a few relevant courses]</li>
                    <li>Awards/Honors: [Any academic achievements]</li>
                </ul>
            `
        },
        park: {
            title: "Hobbies & Interests",
            content: `
                <p>When I'm not coding, you can find me [Your Hobby 1], [Your Hobby 2], or [Your Hobby 3]. I believe a well-rounded individual brings more to the table!</p>
                <ul>
                    <li>Reading sci-fi novels</li>
                    <li>Hiking in national parks</li>
                    <li>Playing strategic board games</li>
                </ul>
            `
        }
    };

    // Function to show the modal with content (No changes)
    function showModal(section) {
        const content = resumeContent[section];
        if (content) {
            modalTitle.textContent = content.title;
            modalBody.innerHTML = content.content;
            resumeModal.classList.add('visible');
        } else {
            console.error(`Content for section "${section}" not found.`);
        }
    }

    // Function to hide the modal (No changes)
    function hideModal() {
        resumeModal.classList.remove('visible');
    }

    // Event listeners for modal close (No changes)
    modalCloseBtn.addEventListener('click', hideModal);
    resumeModal.addEventListener('click', (event) => {
        if (event.target === resumeModal) {
            hideModal();
        }
    });

    // --- Animation Logic for Clickable Areas (No changes) ---
    let activeAreaAnimation = null;

    function animateClickableArea(element, duration = 300, scaleFactor = 1.05) {
        if (activeAreaAnimation) {
            cancelAnimationFrame(activeAreaAnimation);
        }

        const startTime = performance.now();

        function animate(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            let easedProgress;
            if (progress < 0.5) {
                easedProgress = 2 * progress * progress;
            } else {
                easedProgress = (-2 * progress * progress) + (4 * progress) - 1;
            }

            let currentScale;
            if (progress <= 0.5) {
                currentScale = 1 + (scaleFactor - 1) * (easedProgress * 2);
            } else {
                currentScale = scaleFactor - (scaleFactor - 1) * ((progress - 0.5) * 2);
            }

            element.style.transform = `scale(${currentScale})`;

            if (progress < 1) {
                activeAreaAnimation = requestAnimationFrame(animate);
            } else {
                element.style.transform = 'scale(1)';
                activeAreaAnimation = null;
            }
        }

        activeAreaAnimation = requestAnimationFrame(animate);
    }
    // --- End Animation Logic for Clickable Areas ---


    // --- JavaScript Animation Logic for City using requestAnimationFrame ---
    // Define sprite sheet configurations
    const SPRITE_FRAME_WIDTH = 16; // Width of a single animation frame
    const SPRITE_FRAME_HEIGHT = 16; // Height of a single animation frame
    const SPRITE_SHEET_COLS = 3; // Number of columns in the sprite sheet for walking frames (e.g., normal, left, right step)
    const SPRITE_SHEET_ROWS = 4;

    // Define the frame indices for each direction and step within your sprite sheet
    const WALK_FRAMES = {
        'left': [0, 1, 2], // Indices for normal, left foot, right foot when moving right
        'down': [3, 4, 5],
        'up': [6, 7, 8],
        'right': [9, 10, 11]
    };

    // Preload people sprite sheets
    const peopleImagePaths = {
        'boy-walk': 'anim/people/boy.png',
        'girl-walk': 'anim/people/girl.png',
        'man-walk': 'anim/people/man.png',
        'worker-walk': 'anim/people/worker.png',
    };

    // Preload car images to ensure smooth swapping
    const carImagePaths = {
        'taxi-right': 'anim/car/taxi-right.png',
        'taxi-left': 'anim/car/taxi-left.png',
        'taxi-up': 'anim/car/taxi-up.png',
        'taxi-down': 'anim/car/taxi-down.png',
        'red-right': 'anim/car/red-car-right.png',
        'red-left': 'anim/car/red-car-left.png',
        'red-up': 'anim/car/red-car-up.png',
        'red-down': 'anim/car/red-car-down.png',
        'green-right': 'anim/car/green-car-right.png',
        'green-left': 'anim/car/green-car-left.png',
        'green-up': 'anim/car/green-car-up.png',
        'green-down': 'anim/car/green-car-down.png',
    };

    const allAnimImagePaths = { ...carImagePaths, ...peopleImagePaths };

    const preloadedImages = {};
    let imagesLoadedCount = 0;
    const totalImagesToLoad = Object.keys(allAnimImagePaths).length;

    function preloadAnimImages() {
        return new Promise((resolve, reject) => {
            if (totalImagesToLoad === 0) {
                console.warn("No animation images defined to load.");
                resolve();
                return;
            }

            console.log(`Starting to preload ${totalImagesToLoad} animation images...`);

            for (const key in allAnimImagePaths) {
                const img = new Image();
                img.src = allAnimImagePaths[key];
                img.onload = () => {
                    preloadedImages[key] = img; // Store the loaded Image object
                    imagesLoadedCount++;
                    console.log(`Loaded: ${allAnimImagePaths[key]} (${imagesLoadedCount}/${totalImagesToLoad})`);
                    if (imagesLoadedCount === totalImagesToLoad) {
                        console.log("All animation images preloaded successfully.");
                        resolve();
                    }
                };
                img.onerror = () => {
                    console.error(`Failed to load image: ${allAnimImagePaths[key]}`);
                    imagesLoadedCount++; // Still increment to prevent infinite loading
                    if (imagesLoadedCount === totalImagesToLoad) {
                        console.warn("Some animation images failed to load, proceeding anyway.");
                        resolve(); // Resolve even if some fail, to allow the application to proceed
                    }
                };
            }
        });
    }


    // Define paths for each car in Tiled pixel coordinates
    // IMPORTANT: Replace these with actual coordinates from your Tiled map!
    // Each waypoint can have a 'stopDuration' in milliseconds.
    const carPaths = {
        taxi: [
            { x: -5*16, y: 13*16, direction: 'right', stopDuration: 0 },
            { x: 17*16, y: 13*16, direction: 'right', stopDuration: 1000 },
            { x: 22*16, y: 13*16, direction: 'right', stopDuration: 0 },
            { x: 22*16, y: 28*16, direction: 'down', stopDuration: 0 },
            { x: -5*16, y: 28*16, direction: 'left', stopDuration: 0 },
        ],
        green: [
            { x: 35*16, y: 11*16, direction: 'left', stopDuration: 0 },
            { x: 14*16, y: 11*16, direction: 'left', stopDuration: 1000 },
            { x: 11*16, y: 11*16, direction: 'left', stopDuration: 0 },
            { x: 11*16, y: 10*16, direction: 'up', stopDuration: 1000 },
            { x: 9*16, y: 10*16, direction: 'left', stopDuration: 0 },
            { x: 9*16, y: 11*16, direction: 'down', stopDuration: 0 },
            { x: -5*16, y: 11*16, direction: 'left', stopDuration: 0 },
            { x: -5*16, y: 28*16, direction: 'left', stopDuration: 0 },
            { x: 35*16, y: 28*16, direction: 'left', stopDuration: 0 },

        ],
        red: [
            { x: 30*16, y: -5*16, direction: 'down', stopDuration: 0 },
            { x: 30*16, y: 8*16, direction: 'down', stopDuration: 1000 },
            { x: 30*16, y: 16*16, direction: 'down', stopDuration: 0 },
            { x: 32*16, y: 16*16, direction: 'right', stopDuration: 3000 },
            { x: 30*16, y: 16*16, direction: 'right', stopDuration: 0 },
            { x: 30*16, y: 18*16, direction: 'up', stopDuration: 300 },
            { x: 30*16, y: 10*16, direction: 'up', stopDuration: 0 },
            { x: 31*16, y: 10*16, direction: 'right', stopDuration: 0 },
            { x: 31*16, y: -5*16, direction: 'up', stopDuration: 0 },
        ]
    };

    // Store animation details for each car instance
    const carInstances = [
        { id: 'taxi-moving-car', element: taxiCar, path: carPaths.taxi, speed: 0.05, currentWaypointIndex: 1, currentX: 0, currentY: 0, startTime: null, animationId: null, isStopped: false, stopUntil: 0, type: 'taxi' },
        { id: 'red-moving-car', element: redCar, path: carPaths.red, speed: 0.5, currentWaypointIndex: 1, currentX: 0, currentY: 0, startTime: null, animationId: null, isStopped: false, stopUntil: 0, type: 'red' },
        { id: 'green-moving-car', element: greenCar, path: carPaths.green, speed: 0.5, currentWaypointIndex: 1, currentX: 0, currentY: 0, startTime: null, animationId: null, isStopped: false, stopUntil: 0, type: 'green' }
    ];

    /**
     * Updates a car's image based on its direction.
     * @param {HTMLElement} carElement
     * @param {string} carType
     * @param {string} direction
     */
    function updateCarImage(carElement, carType, direction) {
        const imageKey = `${carType}-${direction}`;
        const imageUrl = carImagePaths[imageKey];
        if (imageUrl && carElement.style.backgroundImage !== `url("${imageUrl}")`) {
            carElement.style.backgroundImage = `url("${imageUrl}")`;
        }
    }

    /**
     * Animates a single car element along its predefined path.
     * @param {object} carData Object containing element, path, speed, etc.
     * @param {DOMHighResTimeStamp} currentTime The current time provided by requestAnimationFrame.
     */
    function animateCarPath(carData, currentTime) {
        // If the car is supposed to be stopped, check if stop duration has passed
        if (carData.isStopped) {
            if (currentTime < carData.stopUntil) {
                // Still stopping, request next frame without moving
                carData.animationId = requestAnimationFrame((ts) => animateCarPath(carData, ts));
                return;
            } else {
                // Stop duration over, resume movement
                carData.isStopped = false;
                carData.startTime = currentTime; // Reset start time for next segment
                carData.currentWaypointIndex = (carData.currentWaypointIndex + 1) % carData.path.length;
            }
        }

        // Determine the current segment's start and end waypoints
        // The previous waypoint is the start of the current segment
        const prevWaypointIndex = (carData.currentWaypointIndex === 0) ? carData.path.length - 1 : carData.currentWaypointIndex - 1;
        const prevWaypoint = carData.path[prevWaypointIndex];
        const targetWaypoint = carData.path[carData.currentWaypointIndex];

        // Ensure startTime is set for the current segment
        if (!carData.startTime) {
            carData.startTime = currentTime;
            // Initialize car's position to the start of the current segment
            carData.currentX = prevWaypoint.x;
            carData.currentY = prevWaypoint.y;
            // Set initial image and rotation for the current segment
            updateCarImage(carData.element, carData.type, targetWaypoint.direction); // Use target's direction for current segment
        }

        // Get scaled map dimensions
        const mapContainerWidth = mapContainer.offsetWidth;
        const mapContainerHeight = mapContainer.offsetHeight;
        const originalMapWidth = parseFloat(mapContainer.dataset.originalMapWidth);
        const originalMapHeight = parseFloat(mapContainer.dataset.originalMapHeight);
        const scaleX = mapContainerWidth / originalMapWidth;
        const scaleY = mapContainerHeight / originalMapHeight;

        const prevScaledX = prevWaypoint.x * scaleX;
        const prevScaledY = prevWaypoint.y * scaleY;
        const targetScaledX = targetWaypoint.x * scaleX;
        const targetScaledY = targetWaypoint.y * scaleY;

        // Calculate distance for the current segment
        const segmentDx = targetScaledX - prevScaledX;
        const segmentDy = targetScaledY - prevScaledY;
        const segmentDistance = Math.sqrt(segmentDx * segmentDx + segmentDy * segmentDy);

        // Calculate elapsed time for the current segment
        const segmentElapsedTime = currentTime - carData.startTime;

        // Calculate progress along the current segment
        let segmentProgress = 0;
        if (segmentDistance > 0) { // Avoid division by zero
            segmentProgress = Math.min((carData.speed * segmentElapsedTime) / segmentDistance, 1);
        }

        // Interpolate current position
        carData.currentX = prevScaledX + segmentDx * segmentProgress;
        carData.currentY = prevScaledY + segmentDy * segmentProgress;

        // Update car's visual position
        carData.element.style.left = `${carData.currentX}px`;
        carData.element.style.top = `${carData.currentY}px`;

        // Apply transform: center the origin, then rotate
        carData.element.style.transform = `translate(-50%, -50%)`;

        // Check if car has reached the target waypoint
        if (segmentProgress >= 1) {
            // Car reached target, now handle stopping or moving to next
            carData.currentX = targetScaledX; // Snap to target
            carData.currentY = targetScaledY;

            if (targetWaypoint.stopDuration > 0) {
                carData.isStopped = true;
                carData.stopUntil = currentTime + targetWaypoint.stopDuration;
                console.log(`${carData.id} stopping at (${targetWaypoint.x}, ${targetWaypoint.y}) for ${targetWaypoint.stopDuration}ms`);
            } else {
                // No stop, move to next waypoint immediately
                carData.currentWaypointIndex = (carData.currentWaypointIndex + 1) % carData.path.length;
                carData.startTime = currentTime; // Reset start time for the new segment
                const nextWaypoint = carData.path[carData.currentWaypointIndex];
                updateCarImage(carData.element, carData.type, nextWaypoint.direction);
            }
        }

        carData.animationId = requestAnimationFrame((ts) => animateCarPath(carData, ts));
    }

    // Replace these with actual coordinates from your Tiled map!
    const peoplePaths = {
        boy: [
            { x: 28.5*16, y: -2*16, direction: 'down', stopDuration: 0 },
            { x: 28.5*16, y: 8*16, direction: 'down', stopDuration: 1000 },
            { x: 26.5*16, y: 8*16, direction: 'left', stopDuration: 0 },
            { x: 26.5*16, y: 7*16, direction: 'up', stopDuration: 1000 },


        ],
        girl: [
            { x: 700, y: 50, direction: 'right', stopDuration: 0 },
            { x: 700, y: 350, direction: 'right', stopDuration: 0 },
            { x: 500, y: 350, direction: 'right', stopDuration: 1000 },
            { x: 500, y: 50, direction: 'right', stopDuration: 0 },
            { x: 700, y: 50, direction: 'right', stopDuration: 0 }
        ],
        man: [
            { x: 450, y: 600, direction: 'right', stopDuration: 0 },
            { x: 450, y: 400, direction: 'right', stopDuration: 0 },
            { x: 600, y: 400, direction: 'right', stopDuration: 0 },
            { x: 600, y: 600, direction: 'right', stopDuration: 0 },
            { x: 450, y: 600, direction: 'right', stopDuration: 0 }
        ],
        worker1: [
            { x: 200, y: 50, direction: 'right', stopDuration: 0 },
            { x: 200, y: 400, direction: 'right', stopDuration: 0 },
            { x: 200, y: 50, direction: 'right', stopDuration: 0 }
        ],
        worker2: [
            { x: 800, y: 600, direction: 'right', stopDuration: 0 },
            { x: 800, y: 200, direction: 'right', stopDuration: 0 },
            { x: 800, y: 600, direction: 'right', stopDuration: 0 }
        ]
    };

    // Store animation details for each person instance
    const peopleInstances = [
        { id: 'boy-walking-sprite', element: boySprite, path: peoplePaths.boy, speed: 0.04, currentWaypointIndex: 1, currentX: 0, currentY: 0, startTime: null, animationId: null, isStopped: false, stopUntil: 0, type: 'boy', currentFrameIndex: 0, lastFrameTime: 0, frameRate: 150 }, // frameRate in ms
        { id: 'girl-walking-sprite', element: girlSprite, path: peoplePaths.girl, speed: 0.035, currentWaypointIndex: 0, currentX: 0, currentY: 0, startTime: null, animationId: null, isStopped: false, stopUntil: 0, type: 'girl', currentFrameIndex: 0, lastFrameTime: 0, frameRate: 180 },
        { id: 'man-walking-sprite', element: manSprite, path: peoplePaths.man, speed: 0.04, currentWaypointIndex: 0, currentX: 0, currentY: 0, startTime: null, animationId: null, isStopped: false, stopUntil: 0, type: 'man', currentFrameIndex: 0, lastFrameTime: 0, frameRate: 160 },
        { id: 'worker-walking-sprite-1', element: workerSprite1, path: peoplePaths.worker1, speed: 0.03, currentWaypointIndex: 0, currentX: 0, currentY: 0, startTime: null, animationId: null, isStopped: false, stopUntil: 0, type: 'worker', currentFrameIndex: 0, lastFrameTime: 0, frameRate: 200 },
        { id: 'worker-walking-sprite-2', element: workerSprite2, path: peoplePaths.worker2, speed: 0.03, currentWaypointIndex: 0, currentX: 0, currentY: 0, startTime: null, animationId: null, isStopped: false, stopUntil: 0, type: 'worker', currentFrameIndex: 0, lastFrameTime: 0, frameRate: 200 },
    ];

    /**
     * Updates a person's sprite frame based on direction and animation progress.
     * @param {HTMLElement} personElement The person's DOM element.
     * @param {string} direction The direction ('right', 'left', 'up', 'down').
     * @param {number} frameIndex The index of the frame within the direction's animation sequence (0, 1, 2).
     */
    function updatePersonSpriteFrame(personElement, direction, frameIndex) {
        const frameOffset = WALK_FRAMES[direction][frameIndex]; // Get the absolute frame index on the sheet

        const col = frameOffset % SPRITE_SHEET_COLS;
        const row = Math.floor(frameOffset / SPRITE_SHEET_COLS); // This calculates the row based on the frameOffset

        const backgroundX = -col * SPRITE_FRAME_WIDTH;
        const backgroundY = -row * SPRITE_FRAME_HEIGHT; // This correctly gets the Y offset

        personElement.style.backgroundPosition = `${backgroundX}px ${backgroundY}px`;
        console.log(personElement.style.backgroundPosition);
    }

    /**
     * Animates a single person element along its predefined path with walking frames.
     * @param {object} personData Object containing element, path, speed, etc.
     * @param {DOMHighResTimeStamp} currentTime The current time provided by requestAnimationFrame.
     */
    function animatePersonPath(personData, currentTime) {
        // If the person is supposed to be stopped, check if stop duration has passed
        if (personData.isStopped) {
            if (currentTime < personData.stopUntil) {
                // Still stopping, show the "normal" (non-walking) frame for current direction
                const currentDirection = personData.path[personData.currentWaypointIndex].direction;
                updatePersonSpriteFrame(personData.element, currentDirection, 0); // Show static frame
                personData.animationId = requestAnimationFrame((ts) => animatePersonPath(personData, ts));
                return;
            } else {
                // Stop duration over, resume movement
                personData.isStopped = false;
                personData.startTime = currentTime; // Reset start time for next segment
                personData.currentWaypointIndex = (personData.currentWaypointIndex + 1) % personData.path.length;
                personData.currentFrameIndex = 0; // Reset frame index when starting new movement
                personData.lastFrameTime = currentTime;
            }
        }

        // Determine the current segment's start and end waypoints
        const prevWaypointIndex = (personData.currentWaypointIndex === 0) ? personData.path.length - 1 : personData.currentWaypointIndex - 1;
        const prevWaypoint = personData.path[prevWaypointIndex];
        const targetWaypoint = personData.path[personData.currentWaypointIndex];

        // Ensure startTime is set for the current segment
        if (!personData.startTime) {
            personData.startTime = currentTime;
            // Initialize person's position to the start of the current segment
            personData.currentX = prevWaypoint.x;
            personData.currentY = prevWaypoint.y;
            // Set initial sprite frame
            updatePersonSpriteFrame(personData.element, targetWaypoint.direction, 0); // Start with static frame
        }

        // Get scaled map dimensions
        const mapContainerWidth = mapContainer.offsetWidth;
        const mapContainerHeight = mapContainer.offsetHeight;
        const originalMapWidth = parseFloat(mapContainer.dataset.originalMapWidth);
        const originalMapHeight = parseFloat(mapContainer.dataset.originalMapHeight);
        const scaleX = mapContainerWidth / originalMapWidth;
        const scaleY = mapContainerHeight / originalMapHeight;

        const prevScaledX = prevWaypoint.x * scaleX;
        const prevScaledY = prevWaypoint.y * scaleY;
        const targetScaledX = targetWaypoint.x * scaleX;
        const targetScaledY = targetWaypoint.y * scaleY;

        // Calculate distance for the current segment
        const segmentDx = targetScaledX - prevScaledX;
        const segmentDy = targetScaledY - prevScaledY;
        const segmentDistance = Math.sqrt(segmentDx * segmentDx + segmentDy * segmentDy);

        // Calculate elapsed time for the current segment
        const segmentElapsedTime = currentTime - personData.startTime;

        // Calculate progress along the current segment
        let segmentProgress = 0;
        if (segmentDistance > 0) { // Avoid division by zero
            segmentProgress = Math.min((personData.speed * segmentElapsedTime) / segmentDistance, 1);
        }

        // Interpolate current position
        personData.currentX = prevScaledX + segmentDx * segmentProgress;
        personData.currentY = prevScaledY + segmentDy * segmentProgress;

        // Adjust position to center the sprite at the waypoint's feet (bottom-center)
        personData.element.style.left = `${personData.currentX - (SPRITE_FRAME_WIDTH / 2)}px`;
        personData.element.style.top = `${personData.currentY - SPRITE_FRAME_HEIGHT}px`;

        // Animate walking frames only if moving
        if (segmentProgress < 1) { // Only animate frames if not at the end of the segment
            if (currentTime - personData.lastFrameTime > personData.frameRate) {
                personData.currentFrameIndex = (personData.currentFrameIndex + 1) % WALK_FRAMES[targetWaypoint.direction].length;
                personData.lastFrameTime = currentTime;
            }
            updatePersonSpriteFrame(personData.element, targetWaypoint.direction, personData.currentFrameIndex);
        } else {
            // Person reached target, now handle stopping or moving to next
            personData.currentX = targetScaledX; // Snap to target
            personData.currentY = targetScaledY;

            if (targetWaypoint.stopDuration > 0) {
                personData.isStopped = true;
                personData.stopUntil = currentTime + targetWaypoint.stopDuration;
                // Show static frame when stopped
                updatePersonSpriteFrame(personData.element, targetWaypoint.direction, 0);
                console.log(`${personData.id} stopping at (${targetWaypoint.x}, ${targetWaypoint.y}) for ${targetWaypoint.stopDuration}ms`);
            } else {
                // No stop, move to next waypoint immediately
                personData.currentWaypointIndex = (personData.currentWaypointIndex + 1) % personData.path.length;
                personData.startTime = currentTime; // Reset start time for the new segment
                personData.currentFrameIndex = 0; // Reset frame index for new segment
                personData.lastFrameTime = currentTime;
                const nextWaypoint = personData.path[personData.currentWaypointIndex];
                updatePersonSpriteFrame(personData.element, nextWaypoint.direction, 0); // Set initial frame for new direction
            }
        }

        personData.animationId = requestAnimationFrame((ts) => animatePersonPath(personData, ts));
    }

    // --- End JavaScript Animation Logic for Multiple Cars ---


    // --- JavaScript Animation Logic for Multiple sprites using requestAnimationFrame ---
    // Preload sprite images to ensure smooth swapping

    // Fetch the Tiled map JSON data
    fetch('map.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(mapData => {
            // Store original map dimensions in dataset for scaling calculations
            mapContainer.dataset.originalMapWidth = mapData.width * mapData.tilewidth;
            mapContainer.dataset.originalMapHeight = mapData.height * mapData.tileheight;

            const objectLayer = mapData.layers.find(layer => layer.type === 'objectgroup');

            if (objectLayer && objectLayer.objects) {
                const mapWidth = mapData.width * mapData.tilewidth;
                const mapHeight = mapData.height * mapData.tileheight;

                mapContainer.style.paddingBottom = `${(mapHeight / mapWidth) * 100}%`;

                objectLayer.objects.forEach(obj => {
                    const clickableArea = document.createElement('div');
                    clickableArea.classList.add('clickable-area');

                    clickableArea.style.left = `${(obj.x / mapWidth) * 100}%`;
                    clickableArea.style.top = `${(obj.y / mapHeight) * 100}%`;
                    clickableArea.style.width = `${(obj.width / mapWidth) * 100}%`;
                    clickableArea.style.height = `${(obj.height / mapHeight) * 100}%`;

                    clickableArea.dataset.section = obj.name;

                    clickableArea.addEventListener('click', () => {
                        animateClickableArea(clickableArea, 400, 1.1);
                        showModal(obj.name);
                    });

                    mapContainer.appendChild(clickableArea);
                });

                // Start preloading images, then start car animations
                preloadAnimImages().then(() => {
                    carInstances.forEach(carData => {
                        if (carData.element) {
                            // Set initial position based on first waypoint
                            // Note: The first waypoint in the path is the *starting point* of the first segment.
                            // The `prevWaypoint` logic inside animateCarPath will handle the correct
                            // interpolation from this initial point to the *next* waypoint in the path.
                            const initialWaypoint = carData.path[0]; // Get the very first point of the path
                            carData.currentX = initialWaypoint.x * (mapContainer.offsetWidth / parseFloat(mapContainer.dataset.originalMapWidth));
                            carData.currentY = initialWaypoint.y * (mapContainer.offsetHeight / parseFloat(mapContainer.dataset.originalMapHeight));
                            carData.element.style.left = `${carData.currentX}px`;
                            carData.element.style.top = `${carData.currentY}px`;

                            // Set initial image based on the direction of the *first segment*
                            const firstSegmentTarget = carData.path[1] || carData.path[0]; // If only one point, use it
                            updateCarImage(carData.element, carData.type, firstSegmentTarget.direction);

                            // Start animation loop for this car
                            requestAnimationFrame((ts) => animateCarPath(carData, ts));
                        } else {
                            console.warn(`Car element with ID '${carData.id}' not found. Check HTML.`);
                        }
                    });
                    // Start walking animations for people
                    peopleInstances.forEach(personData => {
                        if (personData.element) {
                            const initialWaypoint = personData.path[0];
                            personData.currentX = initialWaypoint.x * (mapContainer.offsetWidth / parseFloat(mapContainer.dataset.originalMapWidth));
                            personData.currentY = initialWaypoint.y * (mapContainer.offsetHeight / parseFloat(mapContainer.dataset.originalMapHeight));

                            personData.element.style.left = `${personData.currentX - (SPRITE_FRAME_WIDTH / 2)}px`;
                            personData.element.style.top = `${personData.currentY - SPRITE_FRAME_HEIGHT}px`;

                            const firstSegmentTarget = personData.path[1] || personData.path[0];
                            updatePersonSpriteFrame(personData.element, firstSegmentTarget.direction, 0);

                            requestAnimationFrame((ts) => animatePersonPath(personData, ts));
                        } else {
                            console.warn(`Person element with ID '${personData.id}' not found. Check HTML.`);
                        }
                    });

                });

                

            } else {
                console.warn("No object layer found in map.json or it's empty.");
            }
        })
        .catch(error => {
            console.error('Error loading or parsing map.json:', error);
            mapContainer.innerHTML = '<p style="color: red; text-align: center;">Failed to load interactive map. Please check the `map.json` file path and content.</p>';
        });
});
