/**
 * Puzzle Logic
 * Handles all three knot puzzle types
 */

const Puzzles = {
    // Puzzle definitions
    puzzles: {
        // Puzzle 1: Visual Rotation
        // Show trefoil1, correct answer is trefoil2 (same knot, different view)
        1: {
            type: 'rotation',
            reference: 'trefoil1',
            options: [
                { knot: 'figureEight', correct: false },
                { knot: 'trefoil2', correct: true },
                { knot: 'cinquefoil', correct: false },
                { knot: 'fakeKnot1', correct: false }
            ],
            hints: [
                'Count the crossings in each knot...',
                'A trefoil has exactly 3 crossings.',
                'Look at how the loops interweave.'
            ],
            successMessage: 'You recognized the trefoil from a different angle.',
            attempts: 0
        },

        // Puzzle 2: Knot Equivalence
        // Two knots shown - are they the same?
        2: {
            type: 'equivalence',
            knotA: 'trefoil3',
            knotB: 'trefoilSymmetric',
            areSame: true,  // They're both trefoils
            hints: [
                'Both have the same number of crossings...',
                'Try tracing the path with your finger.',
                'Count the lobes - how many does each have?'
            ],
            successMessage: 'Both are the trefoil knot, just drawn differently.',
            attempts: 0
        },

        // Puzzle 3: Unknotting
        // Is this knot unknottable (can become a simple circle)?
        3: {
            type: 'unknotting',
            knot: 'fakeKnot2',
            isUnknottable: true,  // This one CAN be untangled
            hints: [
                'Follow each strand carefully...',
                'At each crossing, which strand is on top?',
                'Can you mentally slide the loops apart?'
            ],
            successMessage: 'This tangle can be completely undone with patience.',
            attempts: 0
        }
    },

    /**
     * Initialize a puzzle
     */
    init(puzzleNum) {
        const puzzle = this.puzzles[puzzleNum];
        if (!puzzle) return;

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
        // Set reference knot
        const refContainer = document.getElementById(`reference-knot-${num}`);
        if (refContainer) {
            refContainer.innerHTML = '';
            const refKnot = KnotSVG.getKnot(puzzle.reference);
            refKnot.setAttribute('width', '150');
            refKnot.setAttribute('height', '150');
            refContainer.appendChild(refKnot);
        }

        // Set options (shuffled)
        const optionsContainer = document.getElementById(`options-${num}`);
        if (optionsContainer) {
            optionsContainer.innerHTML = '';

            // Shuffle options
            const shuffledOptions = [...puzzle.options].sort(() => Math.random() - 0.5);

            shuffledOptions.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'knot-option';
                optionDiv.dataset.correct = option.correct;
                optionDiv.dataset.index = index;

                const knotSvg = KnotSVG.getKnot(option.knot);
                optionDiv.appendChild(knotSvg);

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

            // Delay then complete puzzle
            setTimeout(() => {
                this.completePuzzle(num);
            }, 1500);
        } else {
            element.classList.add('incorrect');

            // Show hint based on attempts
            const hintIndex = Math.min(puzzle.attempts - 1, puzzle.hints.length - 1);
            feedbackText.className = 'feedback-text hint';
            feedbackText.textContent = puzzle.hints[hintIndex];
        }
    },

    /**
     * Initialize equivalence puzzle (Puzzle 2)
     */
    initEquivalencePuzzle(num, puzzle) {
        const pairContainer = document.getElementById(`knot-pair-${num}`);
        if (pairContainer) {
            pairContainer.innerHTML = '';

            // Knot A
            const knotADiv = document.createElement('div');
            knotADiv.className = 'knot-display';
            const knotA = KnotSVG.getKnot(puzzle.knotA);
            knotADiv.appendChild(knotA);

            // Knot B
            const knotBDiv = document.createElement('div');
            knotBDiv.className = 'knot-display';
            const knotB = KnotSVG.getKnot(puzzle.knotB);
            knotBDiv.appendChild(knotB);

            pairContainer.appendChild(knotADiv);
            pairContainer.appendChild(knotBDiv);
        }
    },

    /**
     * Initialize unknotting puzzle (Puzzle 3)
     */
    initUnknottingPuzzle(num, puzzle) {
        const displayContainer = document.getElementById(`unknot-${num}`);
        if (displayContainer) {
            displayContainer.innerHTML = '';

            const knot = KnotSVG.getKnot(puzzle.knot);
            knot.setAttribute('width', '180');
            knot.setAttribute('height', '180');
            displayContainer.appendChild(knot);
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

        const isCorrect = (userSaysUnknottable === puzzle.isUnknottable);

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
        // Close puzzle modal
        closePuzzle(num);

        // Unlock next stage
        unlockStage(num);

        // Save progress
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

// Export
window.Puzzles = Puzzles;
