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

    // Define resume content paths and IDs
    const BUILDING_IDS = ['home', 'office', 'gallery', 'workshop', 'school', 'park']; // Matches your Tiled object names and HTML file names
    const RESUME_CONTENT_PATH = 'resume-sections/'; // Path to your content files

    // Define your resume content here. (No changes from previous version)
    // Cache for fetched resume content
    const resumeContentCache = {};

    // Titles for the modal windows
    const resumeTitles = {
        home: "About Me & Contact",
        office: "Work Experience",
        gallery: "Skills & Technologies",
        workshop: "Projects",
        school: "Education",
        park: "Hobbies & Interests"
    };

    // Add this new object
    const buildingVideos = {
        home: 'anim/videos/home.mp4',
        office: 'anim/videos/office.mp4',
        gallery: 'anim/videos/gallery.mp4',
        workshop: 'anim/videos/workshop.mp4',
        school: 'anim/videos/school.mp4',
        park: 'anim/videos/park.mp4'
    };

    // Get a reference to the modal's video element at the top with other constants
    const modalVideo = document.querySelector('.modal-background-video');
    const modalVideoSource = modalVideo.querySelector('source');

    // NEW showModal function
    function showModal(section) {
        const title = resumeTitles[section];
        const content = resumeContentCache[section];
        const videoSrc = buildingVideos[section];

        if (title && content && videoSrc) {
            // Set content first
            modalTitle.textContent = title;
            modalBody.innerHTML = content;

            // Set and play the new video
            modalVideoSource.src = videoSrc;
            modalVideo.load(); // Important: load the new source
            modalVideo.play().catch(e => console.error("Video play failed:", e)); // Play video

            // Show the modal
            resumeModal.classList.add('visible');

        } else {
            console.error(`Data for section "${section}" not found.`);
        }
    }

    // NEW hideModal function
    function hideModal() {
        // Hide the modal
        resumeModal.classList.remove('visible');

        // Stop the video to save resources
        modalVideo.pause();
        modalVideoSource.src = ""; // Unload the video source
    }

    // Event listeners for modal close (No changes)
    modalCloseBtn.addEventListener('click', hideModal);
    resumeModal.addEventListener('click', (event) => {
        if (event.target === resumeModal) {
            hideModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        // Check if the Escape key was pressed and if the modal is currently visible
        if (event.key === 'Escape' && resumeModal.classList.contains('visible')) {
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
    const SPRITE_FRAME_WIDTH = 16; // Width of a single animation frame (from your tiled map)
    const SPRITE_FRAME_HEIGHT = 16; // Height of a single animation frame (from your tiled map)
    const SPRITE_SHEET_COLS = 3; // Number of columns in the sprite sheet for walking frames (e.g., normal, left, right step)
    // Removed SPRITE_SHEET_ROWS as it's not directly used in the current updatePersonSpriteFrame logic for calculating Y offset

    // Define the frame indices for each direction and step within your sprite sheet
    const WALK_FRAMES = {
        'left': [0, 1, 2],
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

    function preloadResumeContent() {
        console.log("Starting to preload resume content...");
        const fetchPromises = BUILDING_IDS.map(id => {
            const url = `${RESUME_CONTENT_PATH}${id}.html`;
            return fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok for ${url}`);
                    }
                    return response.text();
                })
                .then(html => {
                    resumeContentCache[id] = html;
                    console.log(`Cached content for: ${id}.html`);
                })
                .catch(error => {
                    console.error(`Failed to fetch and cache ${url}:`, error);
                    resumeContentCache[id] = `<p>Error: Could not load content for this section.</p>`; // Provide fallback content
                });
        });

        return Promise.all(fetchPromises).then(() => {
            console.log("All resume content has been preloaded and cached.");
        });
    }


    // --- CRUCIAL ADDITION: Clickable Area Definitions from Tiled Map ---
    // Extract these directly from your map.json object layer
    const clickableAreaDefinitions = [
        { id: 'park', originalX: 1.26984126984127, originalY: 1.76160751441651, originalWidth: 108.792580702693, originalHeight: 124.249450092147 },
        { id: 'workshop', originalX: 35.1560549313358, originalY: 257.988942393437, originalWidth: 202.128292015932, originalHeight: 107.009095773141 },
        { id: 'home', originalX: 258.686166101896, originalY: 244.315557933535, originalWidth: 42.8036383092563, originalHeight: 103.442125914036 },
        { id: 'office', originalX: 401.364960466084, originalY: 242.532073003983, originalWidth: 45.1816182153261, originalHeight: 90.9577314071696 },
        { id: 'school', originalX: 306.84025919981, originalY: 18.407466856905, originalWidth: 107.009095773141, originalHeight: 124.843945068664 },
        { id: 'gallery', originalX: 211.126567980501, originalY: 51.6991855418822, originalWidth: 74.3118720646811, originalHeight: 89.1742464776173 }
    ];

    // Define paths for each car in Tiled pixel coordinates
    // Ensure these are based on the 544x384 map. The *16 is correct for tile-based Tiled coordinates.
    const carPaths = {
        taxi: [
            { x: -5*16, y: 13*16, direction: 'right', stopDuration: 0 },
            { x: 17*16, y: 13*16, direction: 'right', stopDuration: 1000 },
            { x: 22*16, y: 13*16, direction: 'right', stopDuration: 0 },
            { x: 22*16, y: 28*16, direction: 'down', stopDuration: 0 }, // Assuming 28*16 is within reasonable bounds (384 height)
            { x: -5*16, y: 28*16, direction: 'left', stopDuration: 0 },
        ],
        green: [
            { x: 35*16, y: 11*16, direction: 'left', stopDuration: 0 },
            { x: 14*16, y: 11*16, direction: 'left', stopDuration: 1000 },
            { x: 11*16, y: 11*16, direction: 'left', stopDuration: 0 },
            { x: 11*16, y: 9.9*16, direction: 'up', stopDuration: 1000 },
            { x: 11*16, y: 10*16, direction: 'up', stopDuration: 0 },
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
        { id: 'red-moving-car', element: redCar, path: carPaths.red, speed: 0.05, currentWaypointIndex: 1, currentX: 0, currentY: 0, startTime: null, animationId: null, isStopped: false, stopUntil: 0, type: 'red' },
        { id: 'green-moving-car', element: greenCar, path: carPaths.green, speed: 0.05, currentWaypointIndex: 1, currentX: 0, currentY: 0, startTime: null, animationId: null, isStopped: false, stopUntil: 0, type: 'green' }
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

        // Scale the original coordinates from Tiled's pixel values
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
        // Car elements should have their origin (0,0) at their top-left.
        // If your car images are centered, you might need translate(-50%, -50%).
        // But for top-left aligned, usually no transform needed or just for rotation.
        // Based on your CSS `background-size: contain`, the image inside the div is centered.
        // The div itself needs to be positioned.
        // If the car sprite's hotspot is its center, use translate(-50%, -50%) to align its center
        // with the (currentX, currentY) point.
        carData.element.style.transform = `translate(-50%, -50%)`; // Assuming car image center is its hotspot


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

    // --- CRUCIAL CORRECTION for peoplePaths ---
    // Update raw pixel coordinates to match your 544x384 map, or convert to tile * 16
    // Assuming you got actual pixel coordinates for the boy, but the others were placeholders.
    // If you used Tiled for boy path, then his coordinates are likely fine.
    // For girl, man, worker1, worker2, you need to revisit Tiled and get valid pixel coordinates.
    // I'm using placeholder values here for girl, man, workers that *fit* a 544x384 map,
    // but you need to replace them with your actual desired paths.
    const peoplePaths = {
        boy: [
            // Your existing tile-based coordinates are good for a 16px tile map
            { x: 28.5*16, y: -2*16, direction: 'down', stopDuration: 0 ,hide: false, speed: 0.05, frameRate: 100},
            { x: 28.5*16, y: 4*16, direction: 'down', stopDuration: 0 ,hide: false, speed: 0.1, frameRate: 100},
            { x: 28.5*16, y: 8*16, direction: 'down', stopDuration: 1000 },
            { x: 26.5*16, y: 8*16, direction: 'left', stopDuration: 0 },
            { x: 26.5*16, y: 7*16, direction: 'up', stopDuration: 1000 ,hide: true, speed: 100},
        ],
        girl: [
            // DUMMY VALUES - REPLACE WITH ACTUAL PIXEL COORDINATES FROM YOUR MAP
            { x: 450, y: 50, direction: 'right', stopDuration: 0 },
            { x: 450, y: 300, direction: 'right', stopDuration: 0 },
            { x: 300, y: 300, direction: 'right', stopDuration: 1000 },
            { x: 300, y: 50, direction: 'right', stopDuration: 0 },
            { x: 450, y: 50, direction: 'right', stopDuration: 0 }
        ],
        man: [
            // DUMMY VALUES - REPLACE WITH ACTUAL PIXEL COORDINATES FROM YOUR MAP
            { x: 100, y: 350, direction: 'right', stopDuration: 0 },
            { x: 100, y: 200, direction: 'right', stopDuration: 0 },
            { x: 200, y: 200, direction: 'right', stopDuration: 0 },
            { x: 200, y: 350, direction: 'right', stopDuration: 0 },
            { x: 100, y: 350, direction: 'right', stopDuration: 0 }
        ],
        worker1: [
            // DUMMY VALUES - REPLACE WITH ACTUAL PIXEL COORDINATES FROM YOUR MAP
            { x: 20, y: 20, direction: 'right', stopDuration: 0 },
            { x: 20, y: 250, direction: 'right', stopDuration: 0 },
            { x: 20, y: 20, direction: 'right', stopDuration: 0 }
        ],
        worker2: [
            // DUMMY VALUES - REPLACE WITH ACTUAL PIXEL COORDINATES FROM YOUR MAP
            { x: 500, y: 300, direction: 'right', stopDuration: 0 },
            { x: 500, y: 100, direction: 'right', stopDuration: 0 },
            { x: 500, y: 300, direction: 'right', stopDuration: 0 }
        ]
    };

    // Store animation details for each person instance
    const peopleInstances = [
        {
            id: 'boy-walking-sprite',
            element: boySprite,
            path: peoplePaths.boy,
            speed: 0.05,
            currentWaypointIndex: 1,
            currentX: 0,
            currentY: 0,
            startTime: null,
            animationId: null,
            isStopped: false,
            stopUntil: 0,
            type: 'boy',
            currentFrameIndex: 0,
            lastFrameTime: 0,
            frameRate: 150,
            lastUpdateTime: 0,
            isHidden: false
        },
        {
            id: 'girl-walking-sprite',
            element: girlSprite,
            path: peoplePaths.girl,
            speed: 0.04,
            currentWaypointIndex: 0,
            currentX: 0,
            currentY: 0,
            startTime: null,
            animationId: null,
            isStopped: false,
            stopUntil: 0,
            type: 'girl',
            currentFrameIndex: 0,
            lastFrameTime: 0,
            frameRate: 180,
            lastUpdateTime: 0,
            isHidden: false
        },
        {
            id: 'man-walking-sprite',
            element: manSprite,
            path: peoplePaths.man,
            speed: 0.045,
            currentWaypointIndex: 0,
            currentX: 0,
            currentY: 0,
            startTime: null,
            animationId: null,
            isStopped: false,
            stopUntil: 0,
            type: 'man',
            currentFrameIndex: 0,
            lastFrameTime: 0,
            frameRate: 160,
            lastUpdateTime: 0,
            isHidden: false
        },
        {
            id: 'worker-walking-sprite-1',
            element: workerSprite1,
            path: peoplePaths.worker1,
            speed: 0.03,
            currentWaypointIndex: 0,
            currentX: 0,
            currentY: 0,
            startTime: null,
            animationId: null,
            isStopped: false,
            stopUntil: 0,
            type: 'worker',
            currentFrameIndex: 0,
            lastFrameTime: 0,
            frameRate: 200,
            lastUpdateTime: 0,
            isHidden: false
        },
        {
            id: 'worker-walking-sprite-2',
            element: workerSprite2,
            path: peoplePaths.worker2,
            speed: 0.03,
            currentWaypointIndex: 0,
            currentX: 0,
            currentY: 0,
            startTime: null,
            animationId: null,
            isStopped: false,
            stopUntil: 0,
            type: 'worker',
            currentFrameIndex: 0,
            lastFrameTime: 0,
            frameRate: 200,
            lastUpdateTime: 0,
            isHidden: true
        },
    ];

    /**
     * Updates a person's sprite frame based on direction and animation progress.
     * @param {HTMLElement} personElement The person's DOM element.
     * @param {string} direction The direction ('right', 'left', 'up', 'down').
     * @param {number} frameIndex The index of the frame within the direction's animation sequence (0, 1, 2).
     */
    function updatePersonSpriteFrame(personElement, direction, frameIndex) {
        const frameOffset = WALK_FRAMES[direction][frameIndex];

        const col = frameOffset % SPRITE_SHEET_COLS;
        const row = Math.floor(frameOffset / SPRITE_SHEET_COLS);

        const backgroundX = -col * SPRITE_FRAME_WIDTH;
        const backgroundY = -row * SPRITE_FRAME_HEIGHT;

        personElement.style.backgroundPosition = `${backgroundX}px ${backgroundY}px`;
    }

    /**
     * Animates a single person element along its predefined path with walking frames.
     * @param {object} personData Object containing element, path, speed, etc.
     * @param {DOMHighResTimeStamp} currentTime The current time provided by requestAnimationFrame.
     */
    function animatePersonPath(personData, currentTime) {
        // 1. Control visibility based on `personData.isHidden`
        if (personData.isHidden) {
            personData.element.classList.add('hidden-by-flag');
        } else {
            personData.element.classList.remove('hidden-by-flag');
        }

        // 2. Handle stopped state
        if (personData.isStopped) {
            if (currentTime < personData.stopUntil) {
                const currentDirection = personData.path[personData.currentWaypointIndex].direction;
                updatePersonSpriteFrame(personData.element, currentDirection, 0);
                personData.animationId = requestAnimationFrame((ts) => animatePersonPath(personData, ts));
                return;
            } else {
                console.log(`${personData.id}: Stop ended. Resuming movement.`);
                personData.isStopped = false;
                personData.startTime = null;
                personData.currentWaypointIndex = (personData.currentWaypointIndex + 1) % personData.path.length;
                personData.currentFrameIndex = 0;
                personData.lastFrameTime = 0;
                personData.lastUpdateTime = 0;
            }
        }

        // 3. Scaling and Waypoint data setup
        const mapContainerWidth = mapContainer.offsetWidth;
        const mapContainerHeight = mapContainer.offsetHeight;
        const originalMapWidth = parseFloat(mapContainer.dataset.originalMapWidth);
        const originalMapHeight = parseFloat(mapContainer.dataset.originalMapHeight);
        const scaleX = mapContainerWidth / originalMapWidth;
        const scaleY = mapContainerHeight / originalMapHeight;

        const targetWaypoint = personData.path[personData.currentWaypointIndex];
        // Scale the original coordinates from Tiled's pixel values
        const targetScaledX = targetWaypoint.x * scaleX;
        const targetScaledY = targetWaypoint.y * scaleY;

        // 4. Initialize position for new segment
        if (!personData.startTime) {
            personData.startTime = currentTime;
            const prevWaypointIndex = (personData.currentWaypointIndex === 0) ? personData.path.length - 1 : personData.currentWaypointIndex - 1;
            const prevWaypoint = personData.path[prevWaypointIndex];
            // Scale the original coordinates from Tiled's pixel values
            personData.currentX = prevWaypoint.x * scaleX;
            personData.currentY = prevWaypoint.y * scaleY;
            updatePersonSpriteFrame(personData.element, targetWaypoint.direction, 0);
            console.log(`${personData.id}: Segment #${personData.currentWaypointIndex} started. From (${prevWaypoint.x},${prevWaypoint.y}) to (${targetWaypoint.x},${targetWaypoint.y}).`);
        }

        // 5. Calculate movement for this frame
        if (personData.lastUpdateTime === 0) {
            personData.lastUpdateTime = currentTime;
        }
        const deltaTime = currentTime - personData.lastUpdateTime;
        personData.lastUpdateTime = currentTime;
        const maxDeltaTime = 200;
        const actualDeltaTime = Math.min(deltaTime, maxDeltaTime);

        const remainingDx = targetScaledX - personData.currentX;
        const remainingDy = targetScaledY - personData.currentY;
        const remainingDistance = Math.sqrt(remainingDx * remainingDx + remainingDy * remainingDy);

        const distanceToTravelThisFrame = personData.speed * actualDeltaTime;

        // 6. Update position and handle waypoint arrival
        if (remainingDistance > distanceToTravelThisFrame) {
            // Still moving along the segment (visible or hidden)
            const ratio = distanceToTravelThisFrame / remainingDistance;
            personData.currentX += remainingDx * ratio;
            personData.currentY += remainingDy * ratio;

            // Animate walking frames
            if (currentTime - personData.lastFrameTime > personData.frameRate) {
                personData.currentFrameIndex = (personData.currentFrameIndex + 1) % WALK_FRAMES[targetWaypoint.direction].length;
                personData.lastFrameTime = currentTime;
            }
            updatePersonSpriteFrame(personData.element, targetWaypoint.direction, personData.currentFrameIndex);

        } else {
            // Reached or passed the target waypoint, snap to it
            personData.currentX = targetScaledX;
            personData.currentY = targetScaledY;
            console.log(`${personData.id}: Reached waypoint ${personData.currentWaypointIndex}.`);

            // --- Apply hide/show, speed, and frameRate from waypoint ---
            if (typeof targetWaypoint.hide !== 'undefined') {
                personData.isHidden = targetWaypoint.hide;
                console.log(`${personData.id}: Visibility changed to ${personData.isHidden ? 'hidden' : 'visible'} at waypoint ${personData.currentWaypointIndex}.`);
            }

            if (typeof targetWaypoint.speed !== 'undefined') {
                personData.speed = targetWaypoint.speed;
                console.log(`${personData.id}: Speed changed to ${personData.speed} at waypoint ${personData.currentWaypointIndex}.`);
            }

            if (typeof targetWaypoint.frameRate !== 'undefined') {
                personData.frameRate = targetWaypoint.frameRate;
                console.log(`${personData.id}: Frame rate changed to ${personData.frameRate} at waypoint ${personData.currentWaypointIndex}.`);
            }
            // --- END NEW ---

            // Handle stopping or moving to next waypoint
            if (targetWaypoint.stopDuration > 0) {
                console.log(`${personData.id}: Stopping for ${targetWaypoint.stopDuration}ms.`);
                personData.isStopped = true;
                personData.stopUntil = currentTime + targetWaypoint.stopDuration;
                updatePersonSpriteFrame(personData.element, targetWaypoint.direction, 0);
            } else {
                console.log(`${personData.id}: Moving to next waypoint.`);
                personData.currentWaypointIndex = (personData.currentWaypointIndex + 1) % personData.path.length;
                personData.startTime = null;
                personData.currentFrameIndex = 0;
                personData.lastFrameTime = 0;
                personData.lastUpdateTime = 0;
                const nextWaypoint = personData.path[personData.currentWaypointIndex];
                updatePersonSpriteFrame(personData.element, nextWaypoint.direction, 0);
            }
        }

        // 7. Apply position to DOM (adjusted for sprite's center/bottom-center)
        // Assuming your person sprites are 16x16, and you want their feet to be at the coordinate.
        // If your CSS defines a background-size for the sprite div that changes its displayed size,
        // you'll need to adjust SPRITE_FRAME_WIDTH/HEIGHT by that scaling too.
        // For 16x16 sprites, we position the bottom-center.
        const spriteWidthScaled = SPRITE_FRAME_WIDTH * scaleX;
        const spriteHeightScaled = SPRITE_FRAME_HEIGHT * scaleY;
        personData.element.style.left = `${personData.currentX - spriteWidthScaled / 2}px`;
        personData.element.style.top = `${personData.currentY - spriteHeightScaled}px`;

        personData.animationId = requestAnimationFrame((ts) => animatePersonPath(personData, ts));
    }


    // --- Main Initialization and Resize Handler ---
    function initializeAndResizeElements() {
        // Get current scaled dimensions of the map container
        const mapContainerWidth = mapContainer.offsetWidth;
        const mapContainerHeight = mapContainer.offsetHeight;
        const originalMapWidth = parseFloat(mapContainer.dataset.originalMapWidth);
        const originalMapHeight = parseFloat(mapContainer.dataset.originalMapHeight);

        // Calculate current scaling factors
        const scaleX = mapContainerWidth / originalMapWidth;
        const scaleY = mapContainerHeight / originalMapHeight;

        // --- Create/Update Clickable Areas ---
        clickableAreaDefinitions.forEach(areaData => {
            let areaElement = document.getElementById(`clickable-${areaData.id}`);
            if (!areaElement) {
                // Create if it doesn't exist
                areaElement = document.createElement('div');
                areaElement.id = `clickable-${areaData.id}`;
                areaElement.classList.add('clickable-area');
                mapContainer.appendChild(areaElement);

                // Add event listener only once when created
                areaElement.addEventListener('click', () => {
                    showModal(areaData.id);
                    animateClickableArea(areaElement); // Apply pulse animation on click
                });
            }

            // Apply scaled positions and dimensions from Tiled data
            areaElement.style.left = `${areaData.originalX * scaleX}px`;
            areaElement.style.top = `${areaData.originalY * scaleY}px`;
            areaElement.style.width = `${areaData.originalWidth * scaleX}px`;
            areaElement.style.height = `${areaData.originalHeight * scaleY}px`;
            console.log(`Updated ${areaData.id}: Left=${areaElement.style.left}, Top=${areaElement.style.top}, Width=${areaElement.style.width}, Height=${areaElement.style.height}`);
        });

        // --- Snap Cars and People to current scaled position on resize ---
        // This is important because ongoing animations will continue to use the old scale
        // until the next segment starts or it's explicitly updated.
        carInstances.forEach(carData => {
            // Find the current actual original waypoint coordinates based on its path and current index
            // If it's midway, it's trickier, but snapping to the 'previous' waypoint is generally safe
            // to prevent large jumps and rely on the next animation frame to smooth it out.
            const currentPathSegmentStart = carData.path[(carData.currentWaypointIndex === 0 ? carData.path.length - 1 : carData.currentWaypointIndex - 1)];
            carData.currentX = currentPathSegmentStart.x * scaleX;
            carData.currentY = currentPathSegmentStart.y * scaleY;
            carData.element.style.left = `${carData.currentX}px`;
            carData.element.style.top = `${carData.currentY}px`;
            carData.startTime = null; // Force animation to re-initialize segment on next frame
            carData.lastUpdateTime = 0;
            console.log(`Snapped ${carData.id} to new scale. CurrentX: ${carData.currentX}, CurrentY: ${carData.currentY}`);
        });

        peopleInstances.forEach(personData => {
            const currentPathSegmentStart = personData.path[(personData.currentWaypointIndex === 0 ? personData.path.length - 1 : personData.currentWaypointIndex - 1)];
            // Apply original X/Y from path, scaled.
            personData.currentX = currentPathSegmentStart.x * scaleX;
            personData.currentY = currentPathSegmentStart.y * scaleY;

            // Adjust for sprite hotpot (bottom-center for people)
            const spriteWidthScaled = SPRITE_FRAME_WIDTH * scaleX;
            const spriteHeightScaled = SPRITE_FRAME_HEIGHT * scaleY;
            personData.element.style.left = `${personData.currentX - spriteWidthScaled / 2}px`;
            personData.element.style.top = `${personData.currentY - spriteHeightScaled}px`;

            personData.startTime = null; // Force animation to re-initialize segment on next frame
            personData.lastUpdateTime = 0;
            personData.lastFrameTime = 0; // Reset sprite animation frame timing too
            console.log(`Snapped ${personData.id} to new scale. CurrentX: ${personData.currentX}, CurrentY: ${personData.currentY}`);
        });
    }

    // --- Event Listeners ---
    // Wait for the DOM to be ready, then start preloading everything.
    const preloader = document.getElementById('preloader');

    Promise.all([
        preloadAnimImages(),
        preloadResumeContent()
    ]).then(() => {
        console.log("All assets loaded. Initializing the scene.");

        // Hide the preloader with a fade-out effect
        if(preloader) {
            preloader.classList.add('hidden');
        }

        // Initialize element positions and start animations
        initializeAndResizeElements();
        carInstances.forEach(car => requestAnimationFrame((ts) => animateCarPath(car, ts)));
        peopleInstances.forEach(person => requestAnimationFrame((ts) => animatePersonPath(person, ts)));

    }).catch(error => {
        console.error("A critical error occurred during preloading:", error);
        if(preloader) {
            preloader.innerHTML = "Failed to load assets. Please refresh the page.";
        }
    });
});