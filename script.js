// Sanity client setup
import {createClient} from 'https://esm.sh/@sanity/client'

const client = createClient({
  projectId: 'zuw9r623',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2025-09-07', // use current date (YYYY-MM-DD) to target the latest API version. Note: this should always be hard coded. Setting API version based on a dynamic value (e.g. new Date()) may break your application at a random point in the future.
})


// Main JavaScript Code for Interactive Resume
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
    const boySprite1 = document.getElementById('boy-walking-sprite-1');
    const boySprite2 = document.getElementById('boy-walking-sprite-2');
    const boySprite3 = document.getElementById('boy-walking-sprite-3');
    const girlSprite1 = document.getElementById('girl-walking-sprite-1');
    const girlSprite2 = document.getElementById('girl-walking-sprite-2');
    const kidSprite1 = document.getElementById('kid-walking-sprite-1');

    const manSprite = document.getElementById('man-walking-sprite');
    const workerSprite1 = document.getElementById('worker-walking-sprite-1');
    const workerSprite2 = document.getElementById('worker-walking-sprite-2');

    // Titles for the modal windows
    const resumeTitles = {
        home: "About Me & Contact",
        office: "Work Experience",
        gallery: "Skills & Technologies",
        workshop: "Projects",
        school: "Education",
        park: "Hobbies & Interests"
    };

    // showModal function
    async function showModal(section) {
        // Clear previous content and theme classes
        resumeModal.classList.remove('workshop-theme', 'another-theme-class');
        // Add a specific theme class based on the section.
        if (section === 'workshop') {
            resumeModal.classList.add('workshop-theme');
    }

        const title = resumeTitles[section];
        const data = resumeContentCache[section];

        modalTitle.innerText = title || "Resume Section";

        // Dynamic HTML content
        let contentHTML = ""
        switch(section) {
            case 'home':
                const { renderHome } = await import('./renderers/homeRenderer.js');
                contentHTML = renderHome();
                break;
            case 'office':
                const { renderOffice } = await import('./renderers/officeRenderer.js');
                contentHTML = renderOffice(resumeContentCache.workExperience);
                break;
            case 'gallery':
                const { renderGallery } = await import('./renderers/galleryRenderer.js');
                contentHTML = renderGallery(resumeContentCache.skills, resumeContentCache.certifications);
                break;
            case 'workshop':
                const { renderWorkshop } = await import('./renderers/workshopRenderer.js');
                contentHTML = renderWorkshop(resumeContentCache.projects);
                break;
            case 'school':
                const { renderSchool } = await import('./renderers/schoolRenderer.js');
                contentHTML = renderSchool(resumeContentCache.education);
                break;
            case 'park':
                const { renderPark } = await import('./renderers/parkRenderer.js');
                contentHTML = renderPark();
                break;
            default:
                contentHTML = "<p>Error: Unknown section.</p>";
        }
        modalBody.innerHTML = data || contentHTML;
        resumeModal.classList.add('visible');
    }

    // hideModal function
    function hideModal() {
        // Hide the modal
        resumeModal.classList.remove('visible');

        setTimeout(() => {
            resumeModal.classList.remove('workshop-theme');
        }, 500);
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
    const SPRITE_FRAME_WIDTH = 16; 
    const SPRITE_FRAME_HEIGHT = 16;
    const SPRITE_SHEET_COLS = 3;

    // Add these constants near the top
    const BASE_CAR_WIDTH = 32;
    const BASE_CAR_HEIGHT = 32;
    const BASE_SPRITE_WIDTH = 16;
    const BASE_SPRITE_HEIGHT = 16;
    const BASE_SPRITE_SCALE_MULTIPLIER = 1;

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
                    preloadedImages[key] = img;
                    imagesLoadedCount++;
                    console.log(`Loaded: ${allAnimImagePaths[key]} (${imagesLoadedCount}/${totalImagesToLoad})`);
                    if (imagesLoadedCount === totalImagesToLoad) {
                        console.log("All animation images preloaded successfully.");
                        resolve();
                    }
                };
                img.onerror = () => {
                    console.error(`Failed to load image: ${allAnimImagePaths[key]}`);
                    imagesLoadedCount++;
                    if (imagesLoadedCount === totalImagesToLoad) {
                        console.warn("Some animation images failed to load, proceeding anyway.");
                        resolve();
                    }
                };
            }
        });
    }

    // clickable area definitions
    const clickableAreaDefinitions = [
        { id: 'park', originalX: 1.26984126984127, originalY: 1.76160751441651, originalWidth: 108.792580702693, originalHeight: 124.249450092147 },
        { id: 'workshop', originalX: 35.1560549313358, originalY: 257.988942393437, originalWidth: 202.128292015932, originalHeight: 107.009095773141 },
        { id: 'home', originalX: 258.686166101896, originalY: 244.315557933535, originalWidth: 42.8036383092563, originalHeight: 103.442125914036 },
        { id: 'office', originalX: 401.364960466084, originalY: 242.532073003983, originalWidth: 45.1816182153261, originalHeight: 90.9577314071696 },
        { id: 'school', originalX: 306.84025919981, originalY: 18.407466856905, originalWidth: 107.009095773141, originalHeight: 124.843945068664 },
        { id: 'gallery', originalX: 211.126567980501, originalY: 51.6991855418822, originalWidth: 74.3118720646811, originalHeight: 89.1742464776173 }
    ];

    // Define paths for each car in Tiled pixel coordinates
    const carPaths = {
        taxi: [
            { x: -5*16, y: 13*16, direction: 'right', stopDuration: 0 },
            { x: 17*16, y: 13*16, direction: 'right', stopDuration: 13000 },
            { x: 22*16, y: 13*16, direction: 'right', stopDuration: 0 },
            { x: 22*16, y: 28*16, direction: 'down', stopDuration: 0 },
            { x: -5*16, y: 28*16, direction: 'left', stopDuration: 0 },
        ],
        green: [
            { x: 36*16, y: 11*16, direction: 'left', stopDuration: 0 },
            { x: 35*16, y: 11*16, direction: 'left', stopDuration: 25000 },
            { x: 14*16, y: 11*16, direction: 'left', stopDuration: 0 },
            { x: 11*16, y: 11*16, direction: 'left', stopDuration: 0 },
            { x: 11*16, y: 9.9*16, direction: 'up', stopDuration: 8000 },
            { x: 11*16, y: 10*16, direction: 'up', stopDuration: 0 },
            { x: 9*16, y: 10*16, direction: 'left', stopDuration: 0 },
            { x: 9*16, y: 11*16, direction: 'down', stopDuration: 0 },
            { x: -5*16, y: 11*16, direction: 'left', stopDuration: 0 },
            { x: -5*16, y: 28*16, direction: 'left', stopDuration: 0 },
            { x: 35*16, y: 28*16, direction: 'left', stopDuration: 0 },
        ],
        red: [
            { x: 30.25*16, y: -5*16, direction: 'down', stopDuration: 35000 },
            { x: 30.25*16, y: 8*16, direction: 'down', stopDuration: 1000 },
            { x: 30.25*16, y: 16*16, direction: 'down', stopDuration: 0 },
            { x: 32*16, y: 16*16, direction: 'right', stopDuration: 45000 },
            { x: 30.25*16, y: 16*16, direction: 'right', stopDuration: 0 },
            { x: 30.25*16, y: 18*16, direction: 'up', stopDuration: 300 },
            { x: 30.25*16, y: 10*16, direction: 'up', stopDuration: 0 },
            { x: 31.75*16, y: 10*16, direction: 'right', stopDuration: 0 },
            { x: 31.75*16, y: -5*16, direction: 'up', stopDuration: 0 },
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
                carData.animationId = requestAnimationFrame((ts) => animateCarPath(carData, ts));
                return;
            } else {
                carData.isStopped = false;
                carData.startTime = currentTime;
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
            // Set initial position to the previous waypoint
            carData.currentX = prevWaypoint.x;
            carData.currentY = prevWaypoint.y;
            //  Update the car's image based on the initial direction
            updateCarImage(carData.element, carData.type, targetWaypoint.direction);
        }

        // Get scaled map dimensions
        const mapContainerWidth = mapContainer.offsetWidth;
        const mapContainerHeight = mapContainer.offsetHeight;
        const originalMapWidth = parseFloat(mapContainer.dataset.originalMapWidth);
        const originalMapHeight = parseFloat(mapContainer.dataset.originalMapHeight);
        const scaleX = mapContainerWidth / originalMapWidth;
        const scaleY = mapContainerHeight / originalMapHeight;

        // Calculate scaled positions for the waypoints
        const prevScaledX = prevWaypoint.x * scaleX;
        const prevScaledY = prevWaypoint.y * scaleY;
        const targetScaledX = targetWaypoint.x * scaleX;
        const targetScaledY = targetWaypoint.y * scaleY;

        // Calculate distance for the current segment
        const segmentDx = targetScaledX - prevScaledX;
        const segmentDy = targetScaledY - prevScaledY;
        const segmentDistance = Math.sqrt(segmentDx * segmentDx + segmentDy * segmentDy);

        // Calculate elapsed time since the start of the segment
        const segmentElapsedTime = currentTime - carData.startTime;

        // Calculate progress based on speed and elapsed time
        let segmentProgress = 0;
        if (segmentDistance > 0) {
            segmentProgress = Math.min((carData.speed * segmentElapsedTime) / segmentDistance, 1);
        }

        // Calculate the new position of the car based on progress
        carData.currentX = prevScaledX + segmentDx * segmentProgress;
        carData.currentY = prevScaledY + segmentDy * segmentProgress;

        // Update car's visual position
        carData.element.style.left = `${carData.currentX}px`;
        carData.element.style.top = `${carData.currentY}px`;
        carData.element.style.transform = `translate(-50%, -50%)`;


        // Update the car's image based on its direction
        if (segmentProgress >= 1) {
            // Car has reached the target waypoint, update position to exact target
            carData.currentX = targetScaledX;
            carData.currentY = targetScaledY;

            if (targetWaypoint.stopDuration > 0) {
                carData.isStopped = true;
                carData.stopUntil = currentTime + targetWaypoint.stopDuration;
            } else {
                // Move to the next waypoint
                carData.currentWaypointIndex = (carData.currentWaypointIndex + 1) % carData.path.length;
                carData.startTime = currentTime;
                const nextWaypoint = carData.path[carData.currentWaypointIndex];
                updateCarImage(carData.element, carData.type, nextWaypoint.direction);
            }
        }

        carData.animationId = requestAnimationFrame((ts) => animateCarPath(carData, ts));
    }

    // --- Animation Logic for People Walking Sprites ---
    // Define paths for each person in Tiled pixel coordinates
    const peoplePaths = {
        boy1: [
            { x: 28.5*16, y: -2*16, direction: 'down', stopDuration: 54000 ,hide: false, speed: 0.05, frameRate: 100},
            { x: 28.5*16, y: -2*16, direction: 'down', stopDuration: 2000 ,hide: false, speed: 0.05, frameRate: 100},
            { x: 28.5*16, y: 4*16, direction: 'down', stopDuration: 3000 ,hide: false, speed: 0.1, frameRate: 60},
            { x: 28.5*16, y: 8.5*16, direction: 'down', stopDuration: 0 },
            { x: 26.75*16, y: 8.5*16, direction: 'left', stopDuration: 0 },
            { x: 26.75*16, y: 8.2*16, direction: 'up', stopDuration: 10000 ,hide: true, speed: 100, frameRate: 100},
            { x: 22.75*16, y: 10*16, direction: 'down', stopDuration: 0 ,hide: false, speed: 0.05},
            { x: 22.75*16, y: 10.25*16, direction: 'down', stopDuration: 0 ,hide: false, speed: 0.05},
            { x: 26*16, y: 10.25*16, direction: 'right', stopDuration: 0 ,hide: false, speed: 0.05},
            { x: 26*16, y: 10.25*16, direction: 'down', stopDuration: 1000 ,hide: false, speed: 0.05},
            { x: 26*16, y: 11*16, direction: 'down', stopDuration: 0 ,hide: false, speed: 0.05},
            { x: 27.75*16, y: 11*16, direction: 'right', stopDuration: 0 ,hide: false, speed: 0.05},
            { x: 27.75*16, y: 12.5*16, direction: 'down', stopDuration: 0 ,hide: false, speed: 0.05},
            { x: 27.75*16, y: 12.5*16, direction: 'right', stopDuration: 1000 ,hide: false, speed: 0.05},
            { x: 27.75*16, y: 15.5*16, direction: 'down', stopDuration: 0 ,hide: false, speed: 0.1, frameRate: 60},
            { x: 27.75*16, y: 15.5*16, direction: 'up', stopDuration: 0 ,hide: false, speed: 0.05, frameRate: 100},
            { x: 31.75*16, y: 15.5*16, direction: 'right', stopDuration: 6000 ,hide: false, speed: 0.05, frameRate: 100},
            { x: 27.75*16, y: 15.5*16, direction: 'left', stopDuration: 0 ,hide: false, speed: 0.05, frameRate: 100},
            { x: 27.75*16, y: 11*16, direction: 'up', stopDuration: 0 ,hide: false, speed: 0.05, frameRate: 100},
            { x: 28.5*16, y: 11*16, direction: 'right', stopDuration: 0 ,hide: false, speed: 0.05, frameRate: 100},
            { x: 28.5*16, y: -3*16, direction: 'up', stopDuration: 0 ,hide: false, speed: 0.05, frameRate: 100},
        ],
        boy2: [
            { x: 19.75*16, y: 3.75*16, direction: 'left', stopDuration: 0 ,hide: false, speed: 0.05, frameRate: 100},
            { x: 19.75*16, y: 3.75*16, direction: 'up', stopDuration: 0 ,hide: false, speed: 0.05, frameRate: 100},
            { x: 19.75*16, y: 3.75*16, direction: 'left', stopDuration: 1000 ,hide: false, speed: 0.05, frameRate: 100},
            { x: 25.75*16, y: 3.75*16, direction: 'right', stopDuration: 1000 ,hide: false, speed: 0.03, frameRate: 100},
            { x: 25.75*16, y: 6.1*16, direction: 'down', stopDuration: 1000 },
            { x: 25.75*16, y: 3.75*16, direction: 'up', stopDuration: 0 },
            { x: 25.75*16, y: 3.75*16, direction: 'right', stopDuration: 1000 },
        ],
        boy3: [
            { x: 32.25*16, y: 17.75*16, direction: 'up', stopDuration: 58000, hide: true, speed: 0.04, frameRate: 180 },
            { x: 32.25*16, y: 17.75*16, direction: 'down', stopDuration: 17000, hide: true, speed: 0.04, frameRate: 180 },
            { x: 32.25*16, y: 17.75*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },//door car
            { x: 32.25*16, y: 18.75*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 32.25*16, y: 18.75*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 28.75*16, y: 18.75*16, direction: 'left', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 28.75*16, y: 22.25*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 26.75*16, y: 22.25*16, direction: 'left', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 26.75*16, y: 21.75*16, direction: 'up', stopDuration: 23000, hide: true, speed: 0.04, frameRate: 180 },
            { x: 26.75*16, y: 21.75*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 26.75*16, y: 22.25*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 32.25*16, y: 22.25*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
        ],
        girl1: [
            { x: 2.75*16, y: 6.5*16, direction: 'down', stopDuration: 1000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 2.75*16, y: 6.5*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 5.75*16, y: 6.5*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 5.75*16, y: 6.5*16, direction: 'down', stopDuration: 1000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 5.75*16, y: 2.5*16, direction: 'up', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 5.75*16, y: 2.5*16, direction: 'right', stopDuration: 1000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 5.75*16, y: 8.5*16, direction: 'down', stopDuration: 1000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 2.75*16, y: 8.5*16, direction: 'left', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 2.75*16, y: 6.5*16, direction: 'up', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
        ],
        girl2: [
            { x: 21.75*16, y: 10.5*16, direction: 'up', stopDuration: 250, hide: false, speed: 0.04, frameRate: 180 },
            { x: 21.75*16, y: 10.5*16, direction: 'left', stopDuration: 10000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 22.75*16, y: 10.5*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 22.75*16, y: 9.5*16, direction: 'up', stopDuration: 15000, hide: true, speed: 0.04, frameRate: 180 },
            { x: 22.75*16, y: 9.5*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 22.75*16, y: 10.5*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 20.75*16, y: 10.5*16, direction: 'left', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 20.75*16, y: 10.5*16, direction: 'right', stopDuration: 4250, hide: false, speed: 0.04, frameRate: 180 },
            { x: 20.75*16, y: 11.25*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 11.75*16, y: 11.25*16, direction: 'left', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 11.75*16, y: 10.25*16, direction: 'up', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 11.75*16, y: 10.25*16, direction: 'left', stopDuration: 2000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 11.75*16, y: 11.25*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 13.75*16, y: 11.25*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 13.75*16, y: 10.25*16, direction: 'up', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 13.75*16, y: 10.25*16, direction: 'right', stopDuration: 5000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 15.75*16, y: 10.25*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 15.75*16, y: 9.25*16, direction: 'up', stopDuration: 18250, hide: true, speed: 0.04, frameRate: 180 },
            { x: 15.75*16, y: 9.25*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 15.75*16, y: 11.25*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 17.75*16, y: 11.25*16, direction: 'right', stopDuration: 1000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 18.75*16, y: 11.25*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 18.75*16, y: 15.25*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 20.75*16, y: 15.25*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 20.75*16, y: 20.25*16, direction: 'down', stopDuration: 6000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 20.75*16, y: 15.25*16, direction: 'up', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 18.75*16, y: 15.25*16, direction: 'left', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 18.75*16, y: 15.25*16, direction: 'up', stopDuration: 2000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 18.75*16, y: 11.5*16, direction: 'up', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 21.75*16, y: 11.5*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
        ],
        kid1: [
            { x: 20.75*16, y: 10.5*16, direction: 'up', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 20.75*16, y: 10.5*16, direction: 'right', stopDuration: 10000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 22.75*16, y: 10.5*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 22.75*16, y: 9.5*16, direction: 'up', stopDuration: 15250, hide: true, speed: 0.04, frameRate: 180 },
            { x: 22.75*16, y: 9.5*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 22.75*16, y: 10.5*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 21.75*16, y: 10.5*16, direction: 'left', stopDuration: 4000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 21.75*16, y: 11.25*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 11.75*16, y: 11.25*16, direction: 'left', stopDuration: 2000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 14.75*16, y: 11.25*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 14.75*16, y: 10.25*16, direction: 'up', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 14.75*16, y: 10.25*16, direction: 'left', stopDuration: 5000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 15.75*16, y: 10.25*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 15.75*16, y: 9.25*16, direction: 'up', stopDuration: 18000, hide: true, speed: 0.04, frameRate: 180 },
            { x: 15.75*16, y: 9.25*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 15.75*16, y: 11.25*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 18.75*16, y: 11.25*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 18.75*16, y: 11.25*16, direction: 'left', stopDuration: 1250, hide: false, speed: 0.04, frameRate: 180 },
            { x: 18.75*16, y: 15.25*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 20.75*16, y: 15.25*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 20.75*16, y: 21.25*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 20.75*16, y: 21.25*16, direction: 'up', stopDuration: 6000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 20.75*16, y: 15.25*16, direction: 'up', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 19.75*16, y: 15.25*16, direction: 'left', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 19.75*16, y: 15.25*16, direction: 'up', stopDuration: 2000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 18.75*16, y: 15.25*16, direction: 'left', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 18.75*16, y: 11.5*16, direction: 'up', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 20.75*16, y: 11.5*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
        ],
        man: [
            { x: 18.75*16, y: 11*16, direction: 'down', stopDuration: 1000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 18.75*16, y: 15*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 19.75*16, y: 15.25*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 19.75*16, y: 18.25*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 19.75*16, y: 18.26*16, direction: 'right', stopDuration: 1000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 24.75*16, y: 18.26*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 24.75*16, y: 15.5*16, direction: 'up', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 31.75*16, y: 15.5*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 31.75*16, y: 16.05*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 33.55*16, y: 16.05*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 33.55*16, y: 15.25*16, direction: 'up', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 33.55*16, y: 15.25*16, direction: 'left', stopDuration: 10000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 33.55*16, y: 15.25*16, direction: 'up', stopDuration: 2000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 33.55*16, y: 15.25*16, direction: 'left', stopDuration: 10000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 33.55*16, y: 15.25*16, direction: 'up', stopDuration: 2000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 33.55*16, y: 15.25*16, direction: 'left', stopDuration: 10000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 33.55*16, y: 15.25*16, direction: 'up', stopDuration: 2000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 33.55*16, y: 15.25*16, direction: 'left', stopDuration: 10000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 33.55*16, y: 15.25*16, direction: 'up', stopDuration: 2000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 33.55*16, y: 15.25*16, direction: 'left', stopDuration: Infinity, hide: false, speed: 0.04, frameRate: 180 },
        ],
        worker1: [
            { x: 11.75*16, y: -1*16, direction: 'down', stopDuration: 45000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 7.75*16, y: -1*16, direction: 'down', stopDuration: 35000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 7.75*16, y: 1*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 7.75*16, y: 3*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.1, frameRate: 180 },
            { x: 7.75*16, y: 9.75*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.1, frameRate: 100 },
            { x: 10.25*16, y: 9.75*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 10.25*16, y: 9.75*16, direction: 'down', stopDuration: 8000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 11.75*16, y: 9.75*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 11.75*16, y: -1*16, direction: 'up', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
        ],
        worker2: [
            { x: 3.75*16, y: 23.5*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 3.75*16, y: 24.5*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 0.75*16, y: 24.5*16, direction: 'left', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 0.75*16, y: 20.5*16, direction: 'up', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 0.75*16, y: 20.5*16, direction: 'right', stopDuration: 5000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 0.75*16, y: 15.5*16, direction: 'up', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 20.75*16, y: 15.5*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 20.75*16, y: 16.5*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 24.75*16, y: 16.5*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 24.75*16, y: 15.5*16, direction: 'up', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 31.75*16, y: 15.5*16, direction: 'right', stopDuration: 8000, hide: false, speed: 0.04, frameRate: 180 },
            { x: 24.75*16, y: 15.5*16, direction: 'left', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 24.75*16, y: 16.5*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 20.75*16, y: 16.5*16, direction: 'left', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 20.75*16, y: 15.5*16, direction: 'up', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 0.75*16, y: 15.5*16, direction: 'left', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 0.75*16, y: 24.5*16, direction: 'down', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 3.75*16, y: 24.5*16, direction: 'right', stopDuration: 0, hide: false, speed: 0.04, frameRate: 180 },
            { x: 3.75*16, y: 23.5*16, direction: 'up', stopDuration: 23000, hide: true, speed: 0.04, frameRate: 180 },
        ]
    };

    // Define people instances with their paths and properties
    const peopleInstances = [
        {
            id: 'boy-walking-sprite-1',
            element: boySprite1,
            path: peoplePaths.boy1,
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
            isHidden: false,
            currentScale: BASE_SPRITE_SCALE_MULTIPLIER,
        },
        {
            id: 'boy-walking-sprite-2',
            element: boySprite2,
            path: peoplePaths.boy2,
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
            isHidden: false,
            currentScale: BASE_SPRITE_SCALE_MULTIPLIER,
        },
        {
            id: 'boy-walking-sprite-3',
            element: boySprite3,
            path: peoplePaths.boy3,
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
            isHidden: true,
            currentScale: BASE_SPRITE_SCALE_MULTIPLIER,
        },
        {
            id: 'girl-walking-sprite-1',
            element: girlSprite1,
            path: peoplePaths.girl1,
            speed: 0.04,
            currentWaypointIndex: 1,
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
            isHidden: false,
            currentScale: BASE_SPRITE_SCALE_MULTIPLIER,
        },
        {
            id: 'girl-walking-sprite-2',
            element: girlSprite2,
            path: peoplePaths.girl2,
            speed: 0.04,
            currentWaypointIndex: 1,
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
            isHidden: false,
            currentScale: BASE_SPRITE_SCALE_MULTIPLIER,
        },
        {
            id: 'kid-walking-sprite-1',
            element: kidSprite1,
            path: peoplePaths.kid1,
            speed: 0.04,
            currentWaypointIndex: 1,
            currentX: 0,
            currentY: 0,
            startTime: null,
            animationId: null,
            isStopped: false,
            stopUntil: 0,
            type: 'kid',
            currentFrameIndex: 0,
            lastFrameTime: 0,
            frameRate: 180,
            lastUpdateTime: 0,
            isHidden: false,
            currentScale: BASE_SPRITE_SCALE_MULTIPLIER,
        },
        {
            id: 'man-walking-sprite',
            element: manSprite,
            path: peoplePaths.man,
            speed: 0.045,
            currentWaypointIndex: 1,
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
            isHidden: false,
            currentScale: BASE_SPRITE_SCALE_MULTIPLIER,
        },
        {
            id: 'worker-walking-sprite-1',
            element: workerSprite1,
            path: peoplePaths.worker1,
            speed: 0.03,
            currentWaypointIndex: 1,
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
            isHidden: false,
            currentScale: BASE_SPRITE_SCALE_MULTIPLIER,
        },
        {
            id: 'worker-walking-sprite-2',
            element: workerSprite2,
            path: peoplePaths.worker2,
            speed: 0.03,
            currentWaypointIndex: 1,
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
            isHidden: false,
            currentScale: BASE_SPRITE_SCALE_MULTIPLIER
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
        // Control visibility based on `personData.isHidden`
        if (personData.isHidden) {
            personData.element.classList.add('hidden-by-flag');
        } else {
            personData.element.classList.remove('hidden-by-flag');
        }

        // Handle stopped state
        if (personData.isStopped) {
            if (currentTime < personData.stopUntil) {
                const currentDirection = personData.path[personData.currentWaypointIndex].direction;
                updatePersonSpriteFrame(personData.element, currentDirection, 0);
                personData.animationId = requestAnimationFrame((ts) => animatePersonPath(personData, ts));
                return;
            } else {
                personData.isStopped = false;
                personData.startTime = null;
                personData.currentWaypointIndex = (personData.currentWaypointIndex + 1) % personData.path.length;
                personData.currentFrameIndex = 0;
                personData.lastFrameTime = 0;
                personData.lastUpdateTime = 0;
            }
        }

        // Scaling and Waypoint data setup
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

        // Initialize position for new segment
        if (!personData.startTime) {
            personData.startTime = currentTime;
            const prevWaypointIndex = (personData.currentWaypointIndex === 0) ? personData.path.length - 1 : personData.currentWaypointIndex - 1;
            const prevWaypoint = personData.path[prevWaypointIndex];
            // Set initial position to the previous waypoint
            personData.currentX = prevWaypoint.x * scaleX;
            personData.currentY = prevWaypoint.y * scaleY;
            updatePersonSpriteFrame(personData.element, targetWaypoint.direction, 0);
        }

        // Calculate movement for this frame
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

        // Move towards the target waypoint
        if (remainingDistance > distanceToTravelThisFrame) {
            // Not yet at the waypoint, move towards it
            const ratio = distanceToTravelThisFrame / remainingDistance;
            personData.currentX += remainingDx * ratio;
            personData.currentY += remainingDy * ratio;

            // Update sprite frame based on direction and frame index
            if (currentTime - personData.lastFrameTime > personData.frameRate) {
                personData.currentFrameIndex = (personData.currentFrameIndex + 1) % WALK_FRAMES[targetWaypoint.direction].length;
                personData.lastFrameTime = currentTime;
            }
            updatePersonSpriteFrame(personData.element, targetWaypoint.direction, personData.currentFrameIndex);

        } else {
            // Reached the waypoint
            personData.currentX = targetScaledX;
            personData.currentY = targetScaledY;

            // Handle visibility, speed, and frame rate changes at the waypoint
            if (typeof targetWaypoint.hide !== 'undefined') {
                personData.isHidden = targetWaypoint.hide;
            }

            if (typeof targetWaypoint.speed !== 'undefined') {
                personData.speed = targetWaypoint.speed;
            }

            if (typeof targetWaypoint.frameRate !== 'undefined') {
                personData.frameRate = targetWaypoint.frameRate;
            }

            // Handle stopping or moving to next waypoint
            if (targetWaypoint.stopDuration > 0) {
                personData.isStopped = true;
                personData.stopUntil = currentTime + targetWaypoint.stopDuration;
                updatePersonSpriteFrame(personData.element, targetWaypoint.direction, 0);
            } else {
                personData.currentWaypointIndex = (personData.currentWaypointIndex + 1) % personData.path.length;
                personData.startTime = null;
                personData.currentFrameIndex = 0;
                personData.lastFrameTime = 0;
                personData.lastUpdateTime = 0;
                const nextWaypoint = personData.path[personData.currentWaypointIndex];
                updatePersonSpriteFrame(personData.element, nextWaypoint.direction, 0);
            }
        }

        // Calculate the visual dimensions for positioning using the stored scale property
        const visualWidth = BASE_SPRITE_WIDTH * personData.currentScale;
        const visualHeight = BASE_SPRITE_HEIGHT * personData.currentScale;

        personData.element.style.left = `${personData.currentX - visualWidth / 2}px`;
        personData.element.style.top = `${personData.currentY - visualHeight}px`;

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
                areaElement = document.createElement('div');
                areaElement.id = `clickable-${areaData.id}`;
                areaElement.classList.add('clickable-area');
                mapContainer.appendChild(areaElement);
                areaElement.addEventListener('click', () => {
                    showModal(areaData.id);
                    animateClickableArea(areaElement);
                });
            }
            areaElement.style.left = `${areaData.originalX * scaleX}px`;
            areaElement.style.top = `${areaData.originalY * scaleY}px`;
            areaElement.style.width = `${areaData.originalWidth * scaleX}px`;
            areaElement.style.height = `${areaData.originalHeight * scaleY}px`;
        });

        // --- Scale and Snap Cars to new positions ---
        carInstances.forEach(carData => {
            // Apply scaled width and height
            carData.element.style.width = `${BASE_CAR_WIDTH * scaleX}px`;
            carData.element.style.height = `${BASE_CAR_HEIGHT * scaleY}px`;

            // Snap position
            const currentPathSegmentStart = carData.path[(carData.currentWaypointIndex === 0 ? carData.path.length - 1 : carData.currentWaypointIndex - 1)];
            carData.currentX = currentPathSegmentStart.x * scaleX;
            carData.currentY = currentPathSegmentStart.y * scaleY;
            carData.element.style.left = `${carData.currentX}px`;
            carData.element.style.top = `${carData.currentY}px`;
            carData.startTime = null; 
            carData.lastUpdateTime = 0;
        });

        // --- Scale and Snap People to new positions ---
        peopleInstances.forEach(personData => {
            // Calculate the new scale based on map width and store it
            personData.currentScale = BASE_SPRITE_SCALE_MULTIPLIER * scaleX;
            personData.element.style.transform = `scale(${personData.currentScale})`;

            // Calculate the effective visual size for positioning
            const visualWidth = BASE_SPRITE_WIDTH * personData.currentScale;
            const visualHeight = BASE_SPRITE_HEIGHT * personData.currentScale;

            // Snap position
            const currentPathSegmentStart = personData.path[(personData.currentWaypointIndex === 0 ? personData.path.length - 1 : personData.currentWaypointIndex - 1)];
            personData.currentX = currentPathSegmentStart.x * scaleX;
            personData.currentY = currentPathSegmentStart.y * scaleY;

            // This positioning now correctly accounts for the new dynamic scale
            personData.element.style.left = `${personData.currentX - visualWidth / 2}px`;
            personData.element.style.top = `${personData.currentY - visualHeight}px`;

            // Reset animation timers
            personData.startTime = null;
            personData.lastUpdateTime = 0;
            personData.lastFrameTime = 0;
        });
    }

    // --- Event Listeners ---
    // Preload assets and initialize the scene
    const preloader = document.getElementById('preloader');

    // Resize event listener to handle dynamic resizing of the map container
    window.addEventListener('resize', initializeAndResizeElements);

    Promise.all([
        preloadAnimImages(),
        preloadResumeContent()
    ]).then(() => {
        console.log("All assets loaded. Initializing the scene.");

        // Hide preloader
        if(preloader) {
            preloader.classList.add('hidden');
        }

        // Initialize map container with original dimensions
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

// --- Data Fetching Functions ---

const resumeContentCache = {};   // Dont forgot to remove older caches. TODO

function preloadResumeContent() {
    console.log("Starting to preload resume content from Sanity...");

    // Use the imported client instance here instead of a locally defined one
    const queryCertifications = `*[_type == "certifications"]{
        title,
        institution,
        description,
        certificationUrl,
    }`;

    const queryProjects = `*[_type == "project"]{
        title,
        projectStartDate,
        projectEndDate,
        coverImage,
        shortDescription,
        longDescription,
        technologies,
        githubLink,
        liveDemoLink
    } | order(projectStartDate desc)`;

    const queryWorkExperience = `*[_type == "workExperience"]{
        title,
        institution,
        description,
        startDate,
        endDate,
    } | order(startDate desc)`;

    const queryEducation = `*[_type == "education"]{
        title,
        institution,
        degreeType,
        startDate,
        endDate,
        institutionCoverImage,
        description,
    } | order(startDate desc)`;

    const querySkills = `*[_type == "skills"]{
        title,
        institution,
        description,
        proficiency,
    }`;

    return Promise.all([
        client.fetch(queryCertifications).then(data => {
            resumeContentCache.certifications = data;
            console.log("Certifications data loaded:", data);
        }),
        client.fetch(queryProjects).then(data => {
            resumeContentCache.projects = data;
            console.log("Projects data loaded:", data);
        }),
        client.fetch(queryWorkExperience).then(data => {
            resumeContentCache.workExperience = data;
            console.log("Work experience data loaded:", data);
        }),
        client.fetch(queryEducation).then(data => {
            resumeContentCache.education = data;
            console.log("Education data loaded:", data);
        }),
        client.fetch(querySkills).then(data => {
            resumeContentCache.skills = data;
            console.log("Skills data loaded:", data);
        })
    ]).then(() => {
        console.log("All resume content preloaded successfully.");
    }).catch(error => {
        console.error("Error preloading resume content:", error);
        throw error;
    });
}
