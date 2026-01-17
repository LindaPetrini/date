/**
 * Easter Eggs
 * Hidden interactive elements for the curious
 */

const EasterEggs = {
    found: new Set(),
    messages: {
        strange: "You clicked on 'strange.' I like that you noticed. There are more secrets here if you keep looking...",
        dragTitle: "You found something! The title was hiding a secret. I appreciate people who try things.",
        secretWord: "You typed the magic word. You're the kind of person who experiments. I like that."
    },

    /**
     * Initialize easter eggs
     */
    init() {
        this.loadFound();
        this.setupStrangeWord();
        this.setupDraggableTitle();
        this.setupSecretWord();
    },

    /**
     * Easter Egg 1: The word "strange" is clickable
     */
    setupStrangeWord() {
        const strangeWord = document.getElementById('strange-word');
        if (strangeWord) {
            strangeWord.addEventListener('click', () => {
                if (!this.found.has('strange')) {
                    this.trigger('strange');
                }
            });
        }
    },

    /**
     * Easter Egg 2: Dragging the title to a hidden drop zone
     */
    setupDraggableTitle() {
        const title = document.getElementById('draggable-title');
        const dropZone = document.getElementById('drop-zone');

        if (title && dropZone) {
            title.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', 'title');
                title.classList.add('dragging');
                dropZone.classList.add('visible');
            });

            title.addEventListener('dragend', () => {
                title.classList.remove('dragging');
                setTimeout(() => {
                    dropZone.classList.remove('visible');
                }, 300);
            });

            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('hover');
            });

            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('hover');
            });

            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('hover');
                if (!this.found.has('dragTitle')) {
                    this.trigger('dragTitle');
                }
            });
        }
    },

    /**
     * Easter Egg 3: Typing a secret word anywhere on the page
     */
    setupSecretWord() {
        const secretWords = ['untangle', 'knot', 'strange'];
        let typed = '';

        document.addEventListener('keydown', (e) => {
            // Don't trigger when typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            typed += e.key.toLowerCase();

            // Keep only last 10 characters
            if (typed.length > 15) {
                typed = typed.slice(-15);
            }

            // Check for secret words
            for (const word of secretWords) {
                if (typed.includes(word) && !this.found.has('secretWord')) {
                    this.trigger('secretWord');
                    typed = '';
                    break;
                }
            }
        });
    },

    /**
     * Trigger an easter egg
     */
    trigger(eggId) {
        this.found.add(eggId);
        this.saveFound();
        this.showMessage(this.messages[eggId]);

        // Add sparkle effect to the page
        this.sparkle();
    },

    /**
     * Show easter egg message
     */
    showMessage(message) {
        const popup = document.getElementById('easter-egg-message');
        const text = popup.querySelector('.easter-egg-text');

        if (popup && text) {
            text.textContent = message;
            popup.classList.add('active');
        }
    },

    /**
     * Close easter egg popup
     */
    close() {
        const popup = document.getElementById('easter-egg-message');
        if (popup) {
            popup.classList.remove('active');
        }
    },

    /**
     * Create sparkle effect
     */
    sparkle() {
        const colors = ['#8B4A5E', '#2D6A6A', '#C4A4A4'];

        for (let i = 0; i < 20; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * window.innerWidth + 'px';
            sparkle.style.top = Math.random() * window.innerHeight + 'px';
            sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            sparkle.style.animationDelay = Math.random() * 0.5 + 's';
            document.body.appendChild(sparkle);

            setTimeout(() => sparkle.remove(), 1500);
        }
    },

    /**
     * Save found easter eggs
     */
    saveFound() {
        try {
            localStorage.setItem('dateme_eggs', JSON.stringify([...this.found]));
        } catch (e) {
            console.log('Could not save easter eggs:', e);
        }
    },

    /**
     * Load found easter eggs
     */
    loadFound() {
        try {
            const saved = localStorage.getItem('dateme_eggs');
            if (saved) {
                this.found = new Set(JSON.parse(saved));
            }
        } catch (e) {
            console.log('Could not load easter eggs:', e);
            this.found = new Set();
        }
    },

    /**
     * Check how many eggs found
     */
    getFoundCount() {
        return this.found.size;
    },

    /**
     * Reset (for testing)
     */
    reset() {
        this.found = new Set();
        localStorage.removeItem('dateme_eggs');
        console.log('Easter eggs reset');
    }
};

// Global function for close button
function closeEasterEgg() {
    EasterEggs.close();
}

window.EasterEggs = EasterEggs;
