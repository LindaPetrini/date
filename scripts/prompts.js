/**
 * Prompt System
 * Handles the reflection prompts that replace puzzles
 */

const Prompts = {
    // Store user responses (kept in localStorage)
    responses: {},

    /**
     * Initialize prompt system
     */
    init() {
        this.loadResponses();
    },

    /**
     * Show a prompt modal
     */
    show(promptNum) {
        const promptSection = document.getElementById(`prompt-${promptNum}`);
        if (promptSection) {
            promptSection.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Generate abstract pattern for prompt 1
            if (promptNum === 1) {
                this.generatePattern();
            }

            // Focus first input
            setTimeout(() => {
                const firstInput = promptSection.querySelector('input, textarea');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    },

    /**
     * Close a prompt modal
     */
    close(promptNum) {
        const promptSection = document.getElementById(`prompt-${promptNum}`);
        if (promptSection) {
            promptSection.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    /**
     * Submit a prompt response
     */
    submit(promptNum) {
        let response;
        let isValid = false;

        if (promptNum === 1) {
            // Three separate inputs
            const input1 = document.getElementById('prompt-1-input-1').value.trim();
            const input2 = document.getElementById('prompt-1-input-2').value.trim();
            const input3 = document.getElementById('prompt-1-input-3').value.trim();

            response = { first: input1, second: input2, third: input3 };
            // At least one thing entered
            isValid = input1 || input2 || input3;
        } else {
            // Single textarea
            const input = document.getElementById(`prompt-${promptNum}-input`);
            response = input ? input.value.trim() : '';
            isValid = response.length > 0;
        }

        if (!isValid) {
            // Gentle nudge - don't block, but encourage
            const container = document.querySelector(`#prompt-${promptNum} .prompt-container`);
            container.classList.add('nudge');
            setTimeout(() => container.classList.remove('nudge'), 500);
            return;
        }

        // Save response
        this.responses[promptNum] = response;
        this.saveResponses();

        // Close prompt and unlock next stage
        this.close(promptNum);
        unlockStage(promptNum);
        saveProgress(promptNum);
    },

    /**
     * Generate abstract pattern for prompt 1
     * Creates an organic, flowing pattern that invites interpretation
     */
    generatePattern() {
        const canvas = document.getElementById('pattern-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const size = 280;
        canvas.width = size;
        canvas.height = size;

        // Background
        ctx.fillStyle = '#FAF7F5';
        ctx.fillRect(0, 0, size, size);

        // Generate flowing organic shapes
        const colors = ['#8B4A5E', '#2D6A6A', '#C4A4A4', '#6B3A49'];

        // Draw several overlapping organic shapes
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.globalAlpha = 0.15 + Math.random() * 0.2;

            const color = colors[Math.floor(Math.random() * colors.length)];
            ctx.fillStyle = color;

            // Create organic blob using bezier curves
            const cx = size * (0.3 + Math.random() * 0.4);
            const cy = size * (0.3 + Math.random() * 0.4);
            const radius = size * (0.15 + Math.random() * 0.2);

            ctx.moveTo(cx + radius, cy);

            // Draw blob with random bezier curves
            const points = 6 + Math.floor(Math.random() * 4);
            for (let j = 0; j < points; j++) {
                const angle = (j / points) * Math.PI * 2;
                const nextAngle = ((j + 1) / points) * Math.PI * 2;
                const midAngle = (angle + nextAngle) / 2;

                const r = radius * (0.7 + Math.random() * 0.6);
                const r2 = radius * (0.8 + Math.random() * 0.4);

                const cpX = cx + Math.cos(midAngle) * r * 1.3;
                const cpY = cy + Math.sin(midAngle) * r * 1.3;
                const endX = cx + Math.cos(nextAngle) * r2;
                const endY = cy + Math.sin(nextAngle) * r2;

                ctx.quadraticCurveTo(cpX, cpY, endX, endY);
            }

            ctx.closePath();
            ctx.fill();
        }

        // Add some flowing lines
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = '#2D6A6A';
        ctx.lineWidth = 2;

        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            let x = Math.random() * size;
            let y = Math.random() * size;
            ctx.moveTo(x, y);

            for (let j = 0; j < 5; j++) {
                const cpX = x + (Math.random() - 0.5) * 100;
                const cpY = y + (Math.random() - 0.5) * 100;
                x = x + (Math.random() - 0.5) * 80;
                y = y + (Math.random() - 0.5) * 80;
                ctx.quadraticCurveTo(cpX, cpY, x, y);
            }

            ctx.stroke();
        }

        ctx.globalAlpha = 1;
    },

    /**
     * Save responses to localStorage
     */
    saveResponses() {
        try {
            localStorage.setItem('dateme_responses', JSON.stringify(this.responses));
        } catch (e) {
            console.log('Could not save responses:', e);
        }
    },

    /**
     * Load responses from localStorage
     */
    loadResponses() {
        try {
            const saved = localStorage.getItem('dateme_responses');
            if (saved) {
                this.responses = JSON.parse(saved);
            }
        } catch (e) {
            console.log('Could not load responses:', e);
            this.responses = {};
        }
    }
};

// Global functions for onclick handlers
function showPrompt(num) {
    Prompts.show(num);
}

function closePrompt(num) {
    Prompts.close(num);
}

function submitPrompt(num) {
    Prompts.submit(num);
}

// Initialize
window.Prompts = Prompts;
