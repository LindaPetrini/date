/**
 * Main Application Logic
 * Handles state, localStorage, and UI interactions
 */

// Constants
const STORAGE_KEY = 'dateme_progress';

// State
let currentProgress = 0;
let progressKnotScenes = [];

/**
 * Initialize the application
 */
function init() {
    // Load saved progress
    loadProgress();

    // Initialize systems
    if (typeof Prompts !== 'undefined') Prompts.init();
    if (typeof EasterEggs !== 'undefined') EasterEggs.init();

    // Initialize progress indicator knots
    initProgressKnots();

    // Update UI based on progress
    updateUI();

    // Set up keyboard listeners
    document.addEventListener('keydown', handleKeydown);
}

/**
 * Initialize the 3D knots in the progress bar
 */
function initProgressKnots() {
    // Clean up any existing scenes
    progressKnotScenes.forEach(scene => {
        if (scene.renderer) scene.renderer.dispose();
    });
    progressKnotScenes = [];

    // Create mini knots for each stage
    for (let i = 0; i <= 3; i++) {
        const container = document.getElementById(`knot-stage-${i}`);
        if (container && typeof Knots3D !== 'undefined') {
            container.innerHTML = '';
            const isUnlocked = i <= currentProgress;
            const color = isUnlocked ? Knots3D.colors.petrol : Knots3D.colors.light;

            const scene = Knots3D.createKnotScene(container, 'trefoil', {
                size: 48,
                color: color,
                tubeRadius: 0.22,
                rotation: { x: 0.3 + i * 0.2, y: 0.5 + i * 0.3, z: i * 0.1 },
                animate: false
            });
            progressKnotScenes.push(scene);
        }
    }
}

/**
 * Load progress from localStorage
 */
function loadProgress() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            currentProgress = parseInt(saved, 10);
            if (isNaN(currentProgress) || currentProgress < 0 || currentProgress > 3) {
                currentProgress = 0;
            }
        }
    } catch (e) {
        console.log('Could not load progress:', e);
        currentProgress = 0;
    }
}

/**
 * Save progress to localStorage
 */
function saveProgress(stageCompleted) {
    try {
        if (stageCompleted > currentProgress) {
            currentProgress = stageCompleted;
            localStorage.setItem(STORAGE_KEY, currentProgress.toString());
        }
    } catch (e) {
        console.log('Could not save progress:', e);
    }
}

/**
 * Update UI based on current progress
 */
function updateUI() {
    // Update progress indicator states
    for (let i = 0; i <= 3; i++) {
        const progressKnot = document.querySelector(`.progress-knot[data-stage="${i}"]`);
        const icon = progressKnot?.querySelector('.knot-icon');

        if (icon) {
            icon.classList.remove('active', 'locked', 'unlocked');

            if (i <= currentProgress) {
                icon.classList.add('unlocked');
            } else if (i === currentProgress + 1) {
                icon.classList.add('active');
            } else {
                icon.classList.add('locked');
            }
        }

        // Update progress lines
        const line = document.querySelector(`.progress-line[data-after="${i}"]`);
        if (line) {
            if (i <= currentProgress) {
                line.classList.add('completed');
            } else {
                line.classList.remove('completed');
            }
        }
    }

    // Unlock content sections
    for (let i = 1; i <= 3; i++) {
        const section = document.querySelector(`.content-section.stage-${i}`);
        if (section) {
            if (i <= currentProgress) {
                section.classList.remove('locked');
            } else {
                section.classList.add('locked');
            }
        }
    }

    // Re-render progress knots with updated colors
    if (typeof Knots3D !== 'undefined') {
        initProgressKnots();
    }
}

/**
 * Unlock a stage with animation
 */
function unlockStage(stageNum) {
    const section = document.querySelector(`.content-section.stage-${stageNum}`);
    if (section) {
        section.classList.remove('locked');
        section.classList.add('unlocking');

        // Scroll to the new section
        setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        // Remove animation class after it completes
        setTimeout(() => {
            section.classList.remove('unlocking');
        }, 700);
    }

    // Update progress indicators
    updateUI();
}

/**
 * Handle keyboard events
 */
function handleKeydown(e) {
    // Escape closes any open prompt
    if (e.key === 'Escape') {
        for (let i = 1; i <= 3; i++) {
            const promptSection = document.getElementById(`prompt-${i}`);
            if (promptSection && promptSection.classList.contains('active')) {
                closePrompt(i);
                break;
            }
        }
    }
}

/**
 * Reset progress (for testing)
 */
function resetProgress() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('dateme_responses');
        localStorage.removeItem('dateme_eggs');
        currentProgress = 0;
        updateUI();

        // Re-lock all sections
        for (let i = 1; i <= 3; i++) {
            const section = document.querySelector(`.content-section.stage-${i}`);
            if (section) {
                section.classList.add('locked');
            }
        }

        console.log('Progress reset');
    } catch (e) {
        console.log('Could not reset progress:', e);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Expose functions globally
window.unlockStage = unlockStage;
window.saveProgress = saveProgress;
window.resetProgress = resetProgress;
