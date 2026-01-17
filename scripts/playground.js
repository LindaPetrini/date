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
        this.initMusicDial();
        this.initNatureRank();
        this.initUpsideDown();
        this.initAIQuiz();
        this.initFunQuestion();
        this.initShare();
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
            saved.textContent = `the page is now tinted with your color`;

            // Apply as subtle background tint
            const lightColor = `hsl(${h}, ${Math.min(30, s)}%, ${Math.max(85, l)}%)`;
            document.body.style.background = lightColor;
            document.querySelector('.background-decoration').style.background =
                `radial-gradient(ellipse at 20% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
                 radial-gradient(ellipse at 80% 80%, ${color}22 0%, transparent 50%)`;
        });

        // Restore if saved
        if (this.responses.color) {
            const { h, s, l } = this.responses.color;
            hueSlider.value = h;
            satSlider.value = s;
            lightSlider.value = l;
            updateColor();

            // Restore background tint
            const color = `hsl(${h}, ${s}%, ${l}%)`;
            const lightColor = `hsl(${h}, ${Math.min(30, s)}%, ${Math.max(85, l)}%)`;
            document.body.style.background = lightColor;
            document.querySelector('.background-decoration').style.background =
                `radial-gradient(ellipse at 20% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
                 radial-gradient(ellipse at 80% 80%, ${color}22 0%, transparent 50%)`;
            saved.textContent = `tinted with your color`;
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

        const proofSection = document.getElementById('toe-proof');
        const uploadInput = document.getElementById('toe-upload');
        const preview = document.getElementById('toe-preview');

        options.forEach(btn => {
            btn.addEventListener('click', () => {
                options.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                const answer = btn.dataset.answer;
                response.textContent = responses[answer];
                this.responses.toes = answer;
                this.saveResponses();

                // Show proof section for certain answers
                if (answer === 'yes' || answer === 'some' || answer === 'trying') {
                    proofSection.classList.add('show');
                } else {
                    proofSection.classList.remove('show');
                }
            });
        });

        // Handle file upload
        uploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    preview.innerHTML = '';
                    preview.appendChild(img);
                    this.responses.toeImage = event.target.result;
                    this.saveResponses();
                };
                reader.readAsDataURL(file);
            }
        });

        // Restore if saved
        if (this.responses.toes) {
            const saved = document.querySelector(`.toe-option[data-answer="${this.responses.toes}"]`);
            if (saved) {
                saved.classList.add('selected');
                response.textContent = responses[this.responses.toes];
                if (['yes', 'some', 'trying'].includes(this.responses.toes)) {
                    proofSection.classList.add('show');
                }
            }
        }

        // Restore image if saved
        if (this.responses.toeImage) {
            const img = document.createElement('img');
            img.src = this.responses.toeImage;
            preview.appendChild(img);
        }
    },

    // ========== Toy 8: Sequence ==========
    initSequence() {
        const display = document.getElementById('sequence-display');
        const options = document.getElementById('sequence-options');
        const feedback = document.getElementById('sequence-feedback');

        // Harder sequence puzzles
        const puzzles = [
            { sequence: [1, 1, 2, 3, 5, 8], answer: 13, wrong: [11, 12, 14] }, // fibonacci
            { sequence: [2, 3, 5, 7, 11], answer: 13, wrong: [12, 14, 15] }, // primes
            { sequence: [1, 4, 9, 16, 25], answer: 36, wrong: [30, 35, 49] }, // squares
            { sequence: [1, 8, 27, 64], answer: 125, wrong: [100, 81, 216] }, // cubes
            { sequence: [2, 6, 12, 20, 30], answer: 42, wrong: [36, 40, 44] }, // n(n+1)
            { sequence: [1, 2, 4, 7, 11], answer: 16, wrong: [14, 15, 17] }, // +1, +2, +3, +4, +5
            { sequence: [3, 4, 6, 9, 13], answer: 18, wrong: [16, 17, 19] }, // +1, +2, +3, +4, +5
            { sequence: [0, 1, 1, 2, 4, 7], answer: 13, wrong: [11, 12, 14] }, // tribonacci
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

    // ========== Toy 11: Music Dial ==========
    initMusicDial() {
        const dial = document.getElementById('music-dial');
        const response = document.getElementById('music-response');

        const updateResponse = (value) => {
            let text;
            if (value < 15) {
                text = "silence. I like you.";
            } else if (value < 35) {
                text = "quiet background. gentle.";
            } else if (value < 55) {
                text = "moderate. fair enough.";
            } else if (value < 75) {
                text = "you like your music present.";
            } else {
                text = "loud. we might have to negotiate.";
            }
            response.textContent = text;
        };

        dial.addEventListener('input', () => {
            this.responses.music = dial.value;
            updateResponse(dial.value);
        });

        dial.addEventListener('change', () => {
            this.saveResponses();
        });

        // Restore if saved
        if (this.responses.music !== undefined) {
            dial.value = this.responses.music;
            updateResponse(this.responses.music);
        }
    },

    // ========== Toy 12: Nature Ranking ==========
    initNatureRank() {
        const container = document.getElementById('nature-rank');
        const saveBtn = document.getElementById('save-nature');
        const response = document.getElementById('nature-response');
        const items = container.querySelectorAll('.rank-item');

        let draggedItem = null;

        items.forEach(item => {
            item.addEventListener('dragstart', () => {
                draggedItem = item;
                item.classList.add('dragging');
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                items.forEach(i => i.classList.remove('drag-over'));
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (item !== draggedItem) {
                    item.classList.add('drag-over');
                }
            });

            item.addEventListener('dragleave', () => {
                item.classList.remove('drag-over');
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                item.classList.remove('drag-over');
                if (item !== draggedItem) {
                    const allItems = [...container.querySelectorAll('.rank-item')];
                    const draggedIdx = allItems.indexOf(draggedItem);
                    const dropIdx = allItems.indexOf(item);

                    if (draggedIdx < dropIdx) {
                        item.after(draggedItem);
                    } else {
                        item.before(draggedItem);
                    }
                }
            });
        });

        saveBtn.addEventListener('click', () => {
            const order = [...container.querySelectorAll('.rank-item')].map(i => i.dataset.item);
            this.responses.nature = order;
            this.saveResponses();

            // Comment based on top choice
            const comments = {
                sea: "the sea. endless, wild. I understand.",
                mountain: "mountains. solid ground, big views.",
                lake: "a lake. still and reflecting.",
                river: "rivers. always moving somewhere.",
                forest: "forest. enclosed, alive, mysterious."
            };
            response.textContent = comments[order[0]];
        });

        // Restore if saved
        if (this.responses.nature) {
            const order = this.responses.nature;
            order.forEach(itemName => {
                const item = container.querySelector(`[data-item="${itemName}"]`);
                if (item) container.appendChild(item);
            });

            const comments = {
                sea: "the sea. endless, wild. I understand.",
                mountain: "mountains. solid ground, big views.",
                lake: "a lake. still and reflecting.",
                river: "rivers. always moving somewhere.",
                forest: "forest. enclosed, alive, mysterious."
            };
            response.textContent = comments[order[0]];
        }
    },

    // ========== Toy 13: Upside Down ==========
    initUpsideDown() {
        const options = document.querySelectorAll('.upside-option');
        const response = document.getElementById('upside-response');

        const responses = {
            'love': "me too. handstands, hanging, all of it.",
            'fine': "practical. blood to the head is fine sometimes.",
            'uncomfortable': "your vestibular system has opinions.",
            'never': "fair. it's not for everyone.",
            'when': "that's the real question. childhood? yoga? falling?"
        };

        options.forEach(btn => {
            btn.addEventListener('click', () => {
                options.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                const answer = btn.dataset.answer;
                response.textContent = responses[answer];
                this.responses.upside = answer;
                this.saveResponses();
            });
        });

        // Restore if saved
        if (this.responses.upside) {
            const saved = document.querySelector(`.upside-option[data-answer="${this.responses.upside}"]`);
            if (saved) {
                saved.classList.add('selected');
                response.textContent = responses[this.responses.upside];
            }
        }
    },

    // ========== Toy 14: AI Quiz ==========
    initAIQuiz() {
        const checkboxes = document.querySelectorAll('.ai-option input[type="checkbox"]');
        const response = document.getElementById('ai-response');

        const updateResponse = () => {
            const checked = [...checkboxes].filter(cb => cb.checked).map(cb => cb.dataset.item);
            this.responses.ai = checked;
            this.saveResponses();

            // Update visual state
            checkboxes.forEach(cb => {
                cb.closest('.ai-option').classList.toggle('checked', cb.checked);
            });

            // Generate response based on selections
            if (checked.length === 0) {
                response.textContent = "";
            } else if (checked.length >= 4) {
                response.textContent = "oh. you're one of us.";
            } else if (checked.includes('polite')) {
                response.textContent = "the politeness matters, I think.";
            } else if (checked.includes('sentient')) {
                response.textContent = "an interesting position to hold.";
            } else if (checked.includes('autoencoder')) {
                response.textContent = "technical foundations. nice.";
            } else {
                response.textContent = "noted.";
            }
        };

        checkboxes.forEach(cb => {
            cb.addEventListener('change', updateResponse);
        });

        // Restore if saved
        if (this.responses.ai) {
            this.responses.ai.forEach(item => {
                const cb = document.querySelector(`.ai-option input[data-item="${item}"]`);
                if (cb) {
                    cb.checked = true;
                    cb.closest('.ai-option').classList.add('checked');
                }
            });
            updateResponse();
        }
    },

    // ========== Share Results ==========
    initShare() {
        const btn = document.getElementById('share-results');
        const output = document.getElementById('share-output');

        btn.addEventListener('click', () => {
            const summary = this.generateSummary();
            output.innerHTML = `
                <pre>${summary}</pre>
                <p class="copy-hint">copy and paste this into an email to linda.petrini@gmail.com</p>
            `;

            // Also copy to clipboard
            navigator.clipboard.writeText(summary).catch(() => {
                // Clipboard might not be available, that's ok
            });
        });
    },

    generateSummary() {
        const r = this.responses;
        let lines = [];

        lines.push("=== playground results ===\n");

        if (r.color) {
            lines.push(`color: hsl(${r.color.h}, ${r.color.s}%, ${r.color.l}%)`);
        }

        if (r.body) {
            lines.push(`pelvis: ${r.body}`);
        }

        if (r.shades) {
            lines.push(`shade ordering: ${r.shades}`);
        }

        if (r.texture) {
            lines.push(`texture: ${r.texture}`);
        }

        if (r.toes) {
            lines.push(`toes: ${r.toes}`);
        }

        if (r.sequence) {
            lines.push(`sequence: ${r.sequence}`);
        }

        if (r.image !== undefined) {
            const names = ['spirals', 'flow', 'organic'];
            lines.push(`image: ${names[r.image]}`);
        }

        if (r.message) {
            lines.push(`message style: ${r.message}`);
        }

        if (r.music !== undefined) {
            lines.push(`music volume: ${r.music}/100`);
        }

        if (r.nature) {
            lines.push(`nature ranking: ${r.nature.join(' > ')}`);
        }

        if (r.upside) {
            lines.push(`upside down: ${r.upside}`);
        }

        if (r.ai && r.ai.length > 0) {
            lines.push(`ai quiz: ${r.ai.join(', ')}`);
        }

        if (r.fun) {
            lines.push(`having fun: ${r.fun}`);
        }

        // Autocomplete responses
        if (r['auto-1']) {
            lines.push(`\n"in the middle of the night I ${r['auto-1']}"`);
        }
        if (r['auto-2']) {
            lines.push(`"my pleasure is ${r['auto-2']}"`);
        }
        if (r['auto-3']) {
            lines.push(`"all parts of me ${r['auto-3']}"`);
        }

        lines.push("\n===");

        return lines.join('\n');
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
