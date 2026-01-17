/**
 * Puzzle Logic
 * Handles all three knot puzzle types with 3D rendering
 */

const Puzzles = {
    // Track puzzle state
    puzzles: {
        1: {
            type: 'rotation',
            hints: [
                'Look at the overall shape and number of crossings...',
                'A trefoil knot has three lobes.',
                'Try to trace the path mentally.'
            ],
            successMessage: 'You found the same knot from a different view.',
            attempts: 0,
            scenes: []
        },
        2: {
            type: 'equivalence',
            hints: [
                'Count the crossings in each...',
                'Look at the overall structure.',
                'These are the same type of knot, just rotated.'
            ],
            successMessage: 'They are the same knot, seen differently.',
            attempts: 0,
            scenes: []
        },
        3: {
            type: 'unknotting',
            hints: [
                'Trace the strand with your mind...',
                'Does it actually cross over itself in a knotted way?',
                'This tangle can be smoothed out.'
            ],
            successMessage: 'This tangle can indeed be undone.',
            attempts: 0,
            scenes: []
        }
    },

    /**
     * Initialize a puzzle
     */
    init(puzzleNum) {
        const puzzle = this.puzzles[puzzleNum];
        if (!puzzle) return;

        // Clean up any existing scenes
        puzzle.scenes.forEach(s => {
            if (s.renderer) s.renderer.dispose();
            if (s.frameId) cancelAnimationFrame(s.frameId);
        });
        puzzle.scenes = [];
        puzzle.attempts = 0;

        switch (puzzle.type) {
            case 'rotation':
                this.initRotationPuzzle(puzzleNum, puzzle);
                break;
            case 'equivalence':
                this.initEquivalencePuzzle(puzzleNum, puzzle);
                break;
            case 'unknotting':
                this.initUnknottingPuzzle(puzzleNum, puzzle);
                break;
        }
    },

    /**
     * Initialize rotation puzzle (Puzzle 1)
     */
    initRotationPuzzle(num, puzzle) {
        const config = Knots3D.getPuzzle1Config();

        // Set reference knot
        const refContainer = document.getElementById(`reference-knot-${num}`);
        if (refContainer) {
            refContainer.innerHTML = '';
            const scene = Knots3D.createKnotScene(refContainer, config.reference.type, {
                size: 150,
                rotation: config.reference.rotation,
                color: config.reference.color,
                animate: true
            });
            puzzle.scenes.push(scene);
        }

        // Set options (shuffled)
        const optionsContainer = document.getElementById(`options-${num}`);
        if (optionsContainer) {
            optionsContainer.innerHTML = '';

            // Shuffle options
            const shuffledOptions = [...config.options].sort(() => Math.random() - 0.5);

            shuffledOptions.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'knot-option';
                optionDiv.dataset.correct = option.correct;
                optionDiv.dataset.index = index;

                const scene = Knots3D.createKnotScene(optionDiv, option.type, {
                    size: 100,
                    rotation: option.rotation,
                    color: option.color,
                    animate: false
                });
                puzzle.scenes.push(scene);

                optionDiv.addEventListener('click', () => {
                    this.checkRotation(num, optionDiv, option.correct);
                });

                optionsContainer.appendChild(optionDiv);
            });
        }
    },

    /**
     * Check rotation puzzle answer
     */
    checkRotation(num, element, isCorrect) {
        const puzzle = this.puzzles[num];
        puzzle.attempts++;

        // Clear previous selections
        const options = document.querySelectorAll(`#options-${num} .knot-option`);
        options.forEach(opt => {
            opt.classList.remove('selected', 'correct', 'incorrect');
        });

        element.classList.add('selected');

        const feedback = document.getElementById(`feedback-${num}`);
        const feedbackText = feedback.querySelector('.feedback-text');

        if (isCorrect) {
            element.classList.add('correct');
            feedbackText.className = 'feedback-text success';
            feedbackText.textContent = puzzle.successMessage;

            setTimeout(() => {
                this.completePuzzle(num);
            }, 1500);
        } else {
            element.classList.add('incorrect');
            const hintIndex = Math.min(puzzle.attempts - 1, puzzle.hints.length - 1);
            feedbackText.className = 'feedback-text hint';
            feedbackText.textContent = puzzle.hints[hintIndex];
        }
    },

    /**
     * Initialize equivalence puzzle (Puzzle 2)
     */
    initEquivalencePuzzle(num, puzzle) {
        const config = Knots3D.getPuzzle2Config();
        puzzle.areSame = config.areSame;

        const pairContainer = document.getElementById(`knot-pair-${num}`);
        if (pairContainer) {
            pairContainer.innerHTML = '';

            // Knot A
            const knotADiv = document.createElement('div');
            knotADiv.className = 'knot-display';
            const sceneA = Knots3D.createKnotScene(knotADiv, config.knotA.type, {
                size: 120,
                rotation: config.knotA.rotation,
                color: config.knotA.color,
                animate: true
            });
            puzzle.scenes.push(sceneA);

            // Knot B
            const knotBDiv = document.createElement('div');
            knotBDiv.className = 'knot-display';
            const sceneB = Knots3D.createKnotScene(knotBDiv, config.knotB.type, {
                size: 120,
                rotation: config.knotB.rotation,
                color: config.knotB.color,
                animate: true
            });
            puzzle.scenes.push(sceneB);

            pairContainer.appendChild(knotADiv);
            pairContainer.appendChild(knotBDiv);
        }
    },

    /**
     * Initialize unknotting puzzle (Puzzle 3)
     */
    initUnknottingPuzzle(num, puzzle) {
        const config = Knots3D.getPuzzle3Config();
        puzzle.canBeUnknotted = config.canBeUnknotted;

        const displayContainer = document.getElementById(`unknot-${num}`);
        if (displayContainer) {
            displayContainer.innerHTML = '';

            const scene = Knots3D.createKnotScene(displayContainer, config.knot.type, {
                size: 180,
                rotation: config.knot.rotation,
                color: config.knot.color,
                animate: true
            });
            puzzle.scenes.push(scene);
        }
    },

    /**
     * Check equivalence answer
     */
    checkEquivalence(num, userSaysSame) {
        const puzzle = this.puzzles[num];
        puzzle.attempts++;

        const feedback = document.getElementById(`feedback-${num}`);
        const feedbackText = feedback.querySelector('.feedback-text');

        const isCorrect = (userSaysSame === puzzle.areSame);

        if (isCorrect) {
            feedbackText.className = 'feedback-text success';
            feedbackText.textContent = puzzle.successMessage;

            setTimeout(() => {
                this.completePuzzle(num);
            }, 1500);
        } else {
            const hintIndex = Math.min(puzzle.attempts - 1, puzzle.hints.length - 1);
            feedbackText.className = 'feedback-text hint';
            feedbackText.textContent = puzzle.hints[hintIndex];
        }
    },

    /**
     * Check unknotting answer
     */
    checkUnknot(num, userSaysUnknottable) {
        const puzzle = this.puzzles[num];
        puzzle.attempts++;

        const feedback = document.getElementById(`feedback-${num}`);
        const feedbackText = feedback.querySelector('.feedback-text');

        const isCorrect = (userSaysUnknottable === puzzle.canBeUnknotted);

        if (isCorrect) {
            feedbackText.className = 'feedback-text success';
            feedbackText.textContent = puzzle.successMessage;

            setTimeout(() => {
                this.completePuzzle(num);
            }, 1500);
        } else {
            const hintIndex = Math.min(puzzle.attempts - 1, puzzle.hints.length - 1);
            feedbackText.className = 'feedback-text hint';
            feedbackText.textContent = puzzle.hints[hintIndex];
        }
    },

    /**
     * Complete a puzzle and unlock content
     */
    completePuzzle(num) {
        // Clean up puzzle scenes
        const puzzle = this.puzzles[num];
        puzzle.scenes.forEach(s => {
            if (s.frameId) cancelAnimationFrame(s.frameId);
        });

        closePuzzle(num);
        unlockStage(num);
        saveProgress(num);
    }
};

// Global functions for onclick handlers
function checkEquivalence(num, userSaysSame) {
    Puzzles.checkEquivalence(num, userSaysSame);
}

function checkUnknot(num, userSaysUnknottable) {
    Puzzles.checkUnknot(num, userSaysUnknottable);
}

window.Puzzles = Puzzles;
