/**
 * Main Application Logic
 * Handles state, localStorage, and UI interactions
 */

// Constants
const STORAGE_KEY = 'dateme_progress';

// State
let currentProgress = 0;  // 0 = intro only, 1-3 = puzzles completed

/**
 * Initialize the application
 */
function init() {
    // Load saved progress
    loadProgress();

    // Update UI based on progress
    updateUI();

    // Set up keyboard listeners
    document.addEventListener('keydown', handleKeydown);
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
    // Update progress indicators
    for (let i = 0; i <= 3; i++) {
        const progressKnot = document.querySelector(`.progress-knot[data-stage="${i}"]`);
        const icon = progressKnot?.querySelector('.knot-icon');

        if (icon) {
            icon.classList.remove('active', 'locked', 'unlocked');

            if (i <= currentProgress) {
                icon.classList.add('unlocked');
                icon.textContent = '✓';
            } else if (i === currentProgress + 1) {
                icon.classList.add('active');
                icon.textContent = '?';
            } else {
                icon.classList.add('locked');
                icon.textContent = '?';
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

    // Special case for intro (stage 0)
    const introIcon = document.querySelector('.progress-knot[data-stage="0"] .knot-icon');
    if (introIcon) {
        introIcon.classList.remove('locked');
        introIcon.classList.add(currentProgress >= 0 ? 'unlocked' : 'active');
        introIcon.textContent = currentProgress > 0 ? '✓' : '∞';
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
 * Start a puzzle
 */
function startPuzzle(puzzleNum) {
    const puzzleSection = document.getElementById(`puzzle-${puzzleNum}`);
    if (puzzleSection) {
        // Initialize the puzzle
        Puzzles.init(puzzleNum);

        // Show the puzzle modal
        puzzleSection.classList.add('active');

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close a puzzle
 */
function closePuzzle(puzzleNum) {
    const puzzleSection = document.getElementById(`puzzle-${puzzleNum}`);
    if (puzzleSection) {
        puzzleSection.classList.remove('active');

        // Restore body scroll
        document.body.style.overflow = '';

        // Clear feedback
        const feedback = document.getElementById(`feedback-${puzzleNum}`);
        if (feedback) {
            const feedbackText = feedback.querySelector('.feedback-text');
            if (feedbackText) {
                feedbackText.textContent = '';
                feedbackText.className = 'feedback-text';
            }
        }
    }
}

/**
 * Handle keyboard events
 */
function handleKeydown(e) {
    // Escape closes any open puzzle
    if (e.key === 'Escape') {
        for (let i = 1; i <= 3; i++) {
            const puzzleSection = document.getElementById(`puzzle-${i}`);
            if (puzzleSection && puzzleSection.classList.contains('active')) {
                closePuzzle(i);
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

// Expose functions globally for onclick handlers
window.startPuzzle = startPuzzle;
window.closePuzzle = closePuzzle;
window.unlockStage = unlockStage;
window.saveProgress = saveProgress;
window.resetProgress = resetProgress;
