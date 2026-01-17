/**
 * Playground - Interactive Toys
 * A scattered collection of small interactions
 */

const Playground = {
    // Store responses
    responses: {},

    init() {
        this.loadResponses();
        this.initColorMaker();
        this.initBodyCheck();
        this.initShadeOrder();
        this.initEmotionGame();
        this.initTexturePicker();
        this.initToeTest();
        this.initSequence();
        this.initAutocomplete();
        this.initImageChoice();
        this.initMessagePreference();
        this.initFunQuestion();
    },

    // ========== Toy 1: Color Maker ==========
    initColorMaker() {
        const preview = document.getElementById('color-preview');
        const hueSlider = document.getElementById('hue-slider');
        const satSlider = document.getElementById('sat-slider');
        const lightSlider = document.getElementById('light-slider');
        const saveBtn = document.getElementById('save-color');
        const saved = document.getElementById('color-saved');

        const updateColor = () => {
            const h = hueSlider.value;
            const s = satSlider.value;
            const l = lightSlider.value;
            preview.style.background = `hsl(${h}, ${s}%, ${l}%)`;
        };

        [hueSlider, satSlider, lightSlider].forEach(slider => {
            slider.addEventListener('input', updateColor);
        });

        saveBtn.addEventListener('click', () => {
            const h = hueSlider.value;
            const s = satSlider.value;
            const l = lightSlider.value;
            const color = `hsl(${h}, ${s}%, ${l}%)`;
            this.responses.color = { h, s, l };
            this.saveResponses();
            saved.textContent = `saved: ${color}`;
            saved.style.color = color;
        });

        // Restore if saved
        if (this.responses.color) {
            const { h, s, l } = this.responses.color;
            hueSlider.value = h;
            satSlider.value = s;
            lightSlider.value = l;
            updateColor();
        }
    },

    // ========== Toy 2: Body Check ==========
    initBodyCheck() {
        const options = document.querySelectorAll('.body-option');
        const response = document.getElementById('body-response');

        const responses = {
            forward: "interesting. most people don't think about it at all.",
            tucked: "that's a common protective posture. nothing wrong with it.",
            tilted: "bodies find their own balance. thanks for noticing.",
            back: "the chair shapes us more than we shape it.",
            unsure: "that's honest. most people have no idea where their pelvis is."
        };

        options.forEach(btn => {
            btn.addEventListener('click', () => {
                options.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                const answer = btn.dataset.answer;
                response.textContent = responses[answer];
                this.responses.body = answer;
                this.saveResponses();
            });
        });

        // Restore if saved
        if (this.responses.body) {
            const saved = document.querySelector(`.body-option[data-answer="${this.responses.body}"]`);
            if (saved) {
                saved.classList.add('selected');
                response.textContent = responses[this.responses.body];
            }
        }
    },

    // ========== Toy 3: Shade Order ==========
    initShadeOrder() {
        const container = document.getElementById('shade-container');
        const checkBtn = document.getElementById('check-shades');
        const result = document.getElementById('shade-result');

        // Generate random grey shades
        const generateShades = () => {
            const shades = [];
            for (let i = 0; i < 5; i++) {
                const lightness = 20 + Math.random() * 60; // 20-80%
                shades.push({
                    lightness,
                    color: `hsl(0, 0%, ${lightness}%)`
                });
            }
            return shades;
        };

        let shades = generateShades();
        let selected = null;

        const render = () => {
            container.innerHTML = '';
            shades.forEach((shade, index) => {
                const box = document.createElement('div');
                box.className = 'shade-box';
                box.style.background = shade.color;
                box.dataset.index = index;

                box.addEventListener('click', () => {
                    if (selected === null) {
                        selected = index;
                        box.classList.add('selected');
                    } else {
                        // Swap
                        const temp = shades[selected];
                        shades[selected] = shades[index];
                        shades[index] = temp;
                        selected = null;
                        render();
                    }
                });

                container.appendChild(box);
            });
        };

        render();

        checkBtn.addEventListener('click', () => {
            // Check if sorted by lightness (dark to light)
            let correct = true;
            for (let i = 1; i < shades.length; i++) {
                if (shades[i].lightness < shades[i - 1].lightness) {
                    correct = false;
                    break;
                }
            }

            if (correct) {
                result.textContent = "perfect. you have good eyes.";
                result.style.color = 'var(--color-petrol)';
            } else {
                result.textContent = "not quite. want to try again?";
                result.style.color = 'var(--color-burgundy)';
            }

            this.responses.shades = correct ? 'correct' : 'attempted';
            this.saveResponses();
        });
    },

    // ========== Toy 4: Emotion Game ==========
    initEmotionGame() {
        const text = document.getElementById('emotion-text');
        const yesBtn = document.getElementById('emotion-yes');
        const noBtn = document.getElementById('emotion-no');
        const feedback = document.getElementById('emotion-feedback');
        const correctEl = document.getElementById('emotion-correct');
        const totalEl = document.getElementById('emotion-total');

        // NVC: feelings vs thoughts/evaluations
        const items = [
            { text: "I feel abandoned", isFeeling: false, explanation: "That's an interpretation of what others did to you." },
            { text: "I feel sad", isFeeling: true, explanation: "Yes, sadness is a feeling." },
            { text: "I feel like you don't care", isFeeling: false, explanation: "That's a thought about someone else." },
            { text: "I feel anxious", isFeeling: true, explanation: "Yes, anxiety is a feeling." },
            { text: "I feel manipulated", isFeeling: false, explanation: "That's a judgment about someone's actions." },
            { text: "I feel curious", isFeeling: true, explanation: "Yes, curiosity is a feeling." },
            { text: "I feel unheard", isFeeling: false, explanation: "That's about how others are treating you." },
            { text: "I feel peaceful", isFeeling: true, explanation: "Yes, peace is a feeling." },
            { text: "I feel betrayed", isFeeling: false, explanation: "That's an interpretation of someone's behavior." },
            { text: "I feel tender", isFeeling: true, explanation: "Yes, tenderness is a feeling." },
            { text: "I feel attacked", isFeeling: false, explanation: "That's a perception of others' intent." },
            { text: "I feel restless", isFeeling: true, explanation: "Yes, restlessness is a feeling." },
        ];

        let shuffled = [...items].sort(() => Math.random() - 0.5);
        let current = 0;
        let correct = 0;

        const showItem = () => {
            if (current >= shuffled.length) {
                text.textContent = "that's all of them";
                yesBtn.style.display = 'none';
                noBtn.style.display = 'none';
                feedback.textContent = `you got ${correct} out of ${shuffled.length}. in NVC, feelings are different from thoughts about what others did.`;
                return;
            }
            text.textContent = `"${shuffled[current].text}"`;
            feedback.textContent = '';
        };

        const answer = (guessedFeeling) => {
            const item = shuffled[current];
            const isCorrect = guessedFeeling === item.isFeeling;

            if (isCorrect) {
                correct++;
                feedback.textContent = `yes. ${item.explanation}`;
                feedback.style.color = 'var(--color-petrol)';
            } else {
                feedback.textContent = `not quite. ${item.explanation}`;
                feedback.style.color = 'var(--color-burgundy)';
            }

            current++;
            correctEl.textContent = correct;
            totalEl.textContent = current;

            setTimeout(showItem, 2000);
        };

        yesBtn.addEventListener('click', () => answer(true));
        noBtn.addEventListener('click', () => answer(false));

        showItem();
    },

    // ========== Toy 5: Autocomplete ==========
    initAutocomplete() {
        const inputs = ['auto-1', 'auto-2', 'auto-3'];

        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                // Restore saved
                if (this.responses[id]) {
                    input.value = this.responses[id];
                }

                input.addEventListener('blur', () => {
                    if (input.value.trim()) {
                        this.responses[id] = input.value.trim();
                        this.saveResponses();
                    }
                });
            }
        });
    },

    // ========== Toy 6: Texture Picker ==========
    initTexturePicker() {
        const options = document.querySelectorAll('.texture-option');
        const chosen = document.getElementById('texture-chosen');

        const names = {
            linen: 'linen',
            wool: 'wool',
            silk: 'silk',
            stone: 'stone',
            wood: 'wood',
            water: 'water'
        };

        options.forEach(opt => {
            opt.addEventListener('click', () => {
                options.forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                const texture = opt.dataset.texture;
                chosen.textContent = names[texture];
                this.responses.texture = texture;
                this.saveResponses();
            });
        });

        // Restore if saved
        if (this.responses.texture) {
            const saved = document.querySelector(`.texture-option[data-texture="${this.responses.texture}"]`);
            if (saved) {
                saved.classList.add('selected');
                chosen.textContent = names[this.responses.texture];
            }
        }
    },

    // ========== Toy 7: Toe Test ==========
    initToeTest() {
        const options = document.querySelectorAll('.toe-option');
        const response = document.getElementById('toe-response');

        const responses = {
            yes: "that's actually rare. good proprioception.",
            some: "the big toe is usually easiest. the little one... less so.",
            no: "most people can't. our feet spend too much time in shoes.",
            trying: "I appreciate the commitment to empirical investigation."
        };

        options.forEach(btn => {
            btn.addEventListener('click', () => {
                options.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                const answer = btn.dataset.answer;
                response.textContent = responses[answer];
                this.responses.toes = answer;
                this.saveResponses();
            });
        });

        // Restore if saved
        if (this.responses.toes) {
            const saved = document.querySelector(`.toe-option[data-answer="${this.responses.toes}"]`);
            if (saved) {
                saved.classList.add('selected');
                response.textContent = responses[this.responses.toes];
            }
        }
    },

    // ========== Toy 8: Sequence ==========
    initSequence() {
        const display = document.getElementById('sequence-display');
        const options = document.getElementById('sequence-options');
        const feedback = document.getElementById('sequence-feedback');

        // Generate a simple sequence puzzle
        const puzzles = [
            { sequence: [2, 4, 6, 8], answer: 10, wrong: [9, 11, 12] },
            { sequence: [1, 1, 2, 3, 5], answer: 8, wrong: [6, 7, 9] },
            { sequence: [3, 6, 9, 12], answer: 15, wrong: [14, 16, 18] },
            { sequence: [1, 4, 9, 16], answer: 25, wrong: [20, 24, 30] },
            { sequence: [2, 6, 12, 20], answer: 30, wrong: [24, 28, 32] },
        ];

        const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

        // Render sequence
        puzzle.sequence.forEach(num => {
            const item = document.createElement('div');
            item.className = 'sequence-item';
            item.textContent = num;
            display.appendChild(item);
        });

        // Add mystery box
        const mystery = document.createElement('div');
        mystery.className = 'sequence-item mystery';
        mystery.textContent = '?';
        display.appendChild(mystery);

        // Render options
        const allOptions = [puzzle.answer, ...puzzle.wrong].sort(() => Math.random() - 0.5);

        allOptions.forEach(num => {
            const btn = document.createElement('button');
            btn.className = 'sequence-option';
            btn.textContent = num;

            btn.addEventListener('click', () => {
                if (num === puzzle.answer) {
                    feedback.textContent = "yes. you see the pattern.";
                    feedback.style.color = 'var(--color-petrol)';
                    mystery.textContent = num;
                    mystery.classList.remove('mystery');
                } else {
                    feedback.textContent = "not that one. look again?";
                    feedback.style.color = 'var(--color-burgundy)';
                }

                this.responses.sequence = num === puzzle.answer ? 'correct' : 'attempted';
                this.saveResponses();
            });

            options.appendChild(btn);
        });
    },

    // ========== Toy 9: Image Choice ==========
    initImageChoice() {
        const canvases = [
            document.getElementById('image-1'),
            document.getElementById('image-2'),
            document.getElementById('image-3')
        ];
        const chosen = document.getElementById('image-chosen');

        // Generate three different abstract patterns
        const patterns = [
            this.drawSpirals,
            this.drawFlowField,
            this.drawOrganicBlobs
        ];

        canvases.forEach((canvas, index) => {
            if (canvas) {
                patterns[index].call(this, canvas);

                canvas.addEventListener('click', () => {
                    canvases.forEach(c => c.classList.remove('selected'));
                    canvas.classList.add('selected');
                    const names = ['spirals', 'flow', 'organic'];
                    chosen.textContent = names[index];
                    this.responses.image = index;
                    this.saveResponses();
                });
            }
        });

        // Restore if saved
        if (this.responses.image !== undefined) {
            canvases[this.responses.image]?.classList.add('selected');
            const names = ['spirals', 'flow', 'organic'];
            chosen.textContent = names[this.responses.image];
        }
    },

    drawSpirals(canvas) {
        const ctx = canvas.getContext('2d');
        const size = canvas.width;

        ctx.fillStyle = '#FAF7F5';
        ctx.fillRect(0, 0, size, size);

        ctx.strokeStyle = '#8B4A5E';
        ctx.lineWidth = 1.5;

        for (let s = 0; s < 3; s++) {
            const cx = size * (0.3 + Math.random() * 0.4);
            const cy = size * (0.3 + Math.random() * 0.4);

            ctx.beginPath();
            for (let i = 0; i < 100; i++) {
                const angle = i * 0.2;
                const radius = i * 0.5;
                const x = cx + Math.cos(angle) * radius;
                const y = cy + Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.globalAlpha = 0.4;
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    },

    drawFlowField(canvas) {
        const ctx = canvas.getContext('2d');
        const size = canvas.width;

        ctx.fillStyle = '#FAF7F5';
        ctx.fillRect(0, 0, size, size);

        ctx.strokeStyle = '#2D6A6A';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;

        for (let i = 0; i < 40; i++) {
            let x = Math.random() * size;
            let y = Math.random() * size;

            ctx.beginPath();
            ctx.moveTo(x, y);

            for (let j = 0; j < 20; j++) {
                const angle = Math.sin(x * 0.02) * Math.cos(y * 0.02) * Math.PI * 2;
                x += Math.cos(angle) * 3;
                y += Math.sin(angle) * 3;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    },

    drawOrganicBlobs(canvas) {
        const ctx = canvas.getContext('2d');
        const size = canvas.width;

        ctx.fillStyle = '#FAF7F5';
        ctx.fillRect(0, 0, size, size);

        const colors = ['#C4A4A4', '#8B4A5E', '#2D6A6A'];

        for (let b = 0; b < 5; b++) {
            ctx.beginPath();
            ctx.globalAlpha = 0.2 + Math.random() * 0.15;
            ctx.fillStyle = colors[b % 3];

            const cx = size * (0.2 + Math.random() * 0.6);
            const cy = size * (0.2 + Math.random() * 0.6);
            const radius = size * (0.1 + Math.random() * 0.15);

            const points = 6;
            for (let i = 0; i <= points; i++) {
                const angle = (i / points) * Math.PI * 2;
                const r = radius * (0.7 + Math.random() * 0.6);
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;

                if (i === 0) ctx.moveTo(x, y);
                else {
                    const prevAngle = ((i - 1) / points) * Math.PI * 2;
                    const cpAngle = (angle + prevAngle) / 2;
                    const cpR = radius * 1.2;
                    ctx.quadraticCurveTo(
                        cx + Math.cos(cpAngle) * cpR,
                        cy + Math.sin(cpAngle) * cpR,
                        x, y
                    );
                }
            }
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    },

    // ========== Toy 10: Message Preference ==========
    initMessagePreference() {
        const options = document.querySelectorAll('.message-option');
        const response = document.getElementById('message-response');

        const responses = {
            direct: "you like clarity. me too.",
            soft: "you appreciate the care in how things are said."
        };

        options.forEach(btn => {
            btn.addEventListener('click', () => {
                options.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                const choice = btn.dataset.choice;
                response.textContent = responses[choice];
                this.responses.message = choice;
                this.saveResponses();
            });
        });

        // Restore if saved
        if (this.responses.message) {
            const saved = document.querySelector(`.message-option[data-choice="${this.responses.message}"]`);
            if (saved) {
                saved.classList.add('selected');
                response.textContent = responses[this.responses.message];
            }
        }
    },

    // ========== Toy 11: Fun Question ==========
    initFunQuestion() {
        const options = document.querySelectorAll('.fun-option');
        const response = document.getElementById('fun-response');

        const responses = {
            'yes': "good. that was the point.",
            'kind-of': "fair enough. not everything lands.",
            'not-sure': "that's okay. neither am I sometimes.",
            'no': "thank you for your honesty. I genuinely appreciate it."
        };

        options.forEach(btn => {
            btn.addEventListener('click', () => {
                options.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                const answer = btn.dataset.answer;
                response.textContent = responses[answer];
                this.responses.fun = answer;
                this.saveResponses();
            });
        });

        // Restore if saved
        if (this.responses.fun) {
            const saved = document.querySelector(`.fun-option[data-answer="${this.responses.fun}"]`);
            if (saved) {
                saved.classList.add('selected');
                response.textContent = responses[this.responses.fun];
            }
        }
    },

    // ========== Storage ==========
    saveResponses() {
        try {
            localStorage.setItem('playground_responses', JSON.stringify(this.responses));
        } catch (e) {
            console.log('Could not save responses:', e);
        }
    },

    loadResponses() {
        try {
            const saved = localStorage.getItem('playground_responses');
            if (saved) {
                this.responses = JSON.parse(saved);
            }
        } catch (e) {
            console.log('Could not load responses:', e);
            this.responses = {};
        }
    },

    reset() {
        this.responses = {};
        localStorage.removeItem('playground_responses');
        location.reload();
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Playground.init());
} else {
    Playground.init();
}

window.Playground = Playground;
