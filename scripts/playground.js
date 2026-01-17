/**
 * Playground - Interactive Toys
 * A scattered collection of small interactions
 */

const Playground = {
    // Store responses
    responses: {},

    init() {
        this.loadResponses();
        this.reorderToys();
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
        this.initRoomSlider();
        this.initCryingScenario();
        this.initSpeedReading();
        this.initSpiritSlider();
        this.initNeuroQuiz();
        this.initLeadFollow();
        this.initTherapy();
        this.initGod();
        this.initFood();
        this.initPrecision();
        this.initHold();
        this.initFunQuestion();
        this.initMeta();
        this.initShare();
    },

    // ========== Reorder toys based on CONTENT.toyOrder ==========
    reorderToys() {
        if (!CONTENT.toyOrder) return;

        const container = document.querySelector('.playground-container');
        const pathHint = document.querySelector('.path-hint');

        // Map toy IDs to their elements
        const toyMap = {
            color: document.getElementById('toy-color'),
            body: document.getElementById('toy-body'),
            shades: document.getElementById('toy-shades'),
            emotion: document.getElementById('toy-emotion'),
            autocomplete: document.getElementById('toy-autocomplete'),
            texture: document.getElementById('toy-texture'),
            toes: document.getElementById('toy-toes'),
            sequence: document.getElementById('toy-sequence'),
            images: document.getElementById('toy-images'),
            message: document.getElementById('toy-message'),
            music: document.getElementById('toy-music'),
            nature: document.getElementById('toy-nature'),
            upside: document.getElementById('toy-upside'),
            ai: document.getElementById('toy-ai'),
            room: document.getElementById('toy-room'),
            crying: document.getElementById('toy-crying'),
            reading: document.getElementById('toy-reading'),
            spirit: document.getElementById('toy-spirit'),
            neuro: document.getElementById('toy-neuro'),
            lead: document.getElementById('toy-lead'),
            therapy: document.getElementById('toy-therapy'),
            god: document.getElementById('toy-god'),
            food: document.getElementById('toy-food'),
            precision: document.getElementById('toy-precision'),
            hold: document.getElementById('toy-hold'),
            fun: document.getElementById('toy-fun'),
            meta: document.getElementById('toy-meta')
        };

        // Reorder toys after the path hint
        let insertAfter = pathHint;
        CONTENT.toyOrder.forEach((toyId, index) => {
            const toy = toyMap[toyId];
            if (toy) {
                // Update the number
                const numEl = toy.querySelector('.toy-number');
                if (numEl) {
                    numEl.textContent = String(index + 1).padStart(2, '0');
                }
                // Move element
                insertAfter.after(toy);
                insertAfter = toy;
            }
        });
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
        const C = CONTENT.body;

        options.forEach(btn => {
            btn.addEventListener('click', () => {
                options.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                const answer = btn.dataset.answer;
                response.textContent = C.responses[answer];
                this.responses.body = answer;
                this.saveResponses();
            });
        });

        // Restore if saved
        if (this.responses.body) {
            const saved = document.querySelector(`.body-option[data-answer="${this.responses.body}"]`);
            if (saved) {
                saved.classList.add('selected');
                response.textContent = C.responses[this.responses.body];
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
                result.textContent = CONTENT.shades.responses.correct;
                result.style.color = 'var(--color-petrol)';
            } else {
                result.textContent = CONTENT.shades.responses.incorrect;
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
        const inputs = ['auto-1', 'auto-2', 'auto-3', 'auto-4', 'auto-5'];

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
        const C = CONTENT.toes;

        const proofSection = document.getElementById('toe-proof');
        const uploadInput = document.getElementById('toe-upload');
        const preview = document.getElementById('toe-preview');

        options.forEach(btn => {
            btn.addEventListener('click', () => {
                options.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                const answer = btn.dataset.answer;
                response.textContent = C.responses[answer];
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
                response.textContent = C.responses[this.responses.toes];
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
                    feedback.textContent = CONTENT.sequence.responses.correct;
                    feedback.style.color = 'var(--color-petrol)';
                    mystery.textContent = num;
                    mystery.classList.remove('mystery');
                } else {
                    feedback.textContent = CONTENT.sequence.responses.incorrect;
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
        const C = CONTENT.message;

        options.forEach(btn => {
            btn.addEventListener('click', () => {
                options.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                const choice = btn.dataset.choice;
                response.textContent = C.responses[choice];
                this.responses.message = choice;
                this.saveResponses();
            });
        });

        // Restore if saved
        if (this.responses.message) {
            const saved = document.querySelector(`.message-option[data-choice="${this.responses.message}"]`);
            if (saved) {
                saved.classList.add('selected');
                response.textContent = C.responses[this.responses.message];
            }
        }
    },

    // ========== Toy 11: Fun Question ==========
    initFunQuestion() {
        const options = document.querySelectorAll('.fun-option');
        const response = document.getElementById('fun-response');
        const C = CONTENT.fun;

        options.forEach(btn => {
            btn.addEventListener('click', () => {
                options.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                const answer = btn.dataset.answer;
                response.textContent = C.responses[answer];
                this.responses.fun = answer;
                this.saveResponses();
            });
        });

        // Restore if saved
        if (this.responses.fun) {
            const saved = document.querySelector(`.fun-option[data-answer="${this.responses.fun}"]`);
            if (saved) {
                saved.classList.add('selected');
                response.textContent = C.responses[this.responses.fun];
            }
        }
    },

    // ========== Toy 27: Meta ==========
    initMeta() {
        const options = document.querySelectorAll('.meta-option');
        const response = document.getElementById('meta-response');
        const C = CONTENT.meta;

        if (!C) return;

        options.forEach(btn => {
            btn.addEventListener('click', () => {
                options.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                const answer = btn.dataset.answer;
                response.textContent = C.responses[answer];
                this.responses.meta = answer;
                this.saveResponses();
            });
        });

        // Restore if saved
        if (this.responses.meta) {
            const saved = document.querySelector(`.meta-option[data-answer="${this.responses.meta}"]`);
            if (saved) {
                saved.classList.add('selected');
                response.textContent = C.responses[this.responses.meta];
            }
        }
    },

    // ========== Toy 11: Music Dial ==========
    initMusicDial() {
        const dial = document.getElementById('music-dial');
        const response = document.getElementById('music-response');
        const C = CONTENT.music;

        const updateResponse = (value) => {
            let text;
            if (value < 15) {
                text = C.responses[0];
            } else if (value < 35) {
                text = C.responses[25];
            } else if (value < 55) {
                text = C.responses[50];
            } else if (value < 75) {
                text = C.responses[75];
            } else {
                text = C.responses[100];
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
            response.textContent = CONTENT.nature.responses[order[0]];
        });

        // Restore if saved
        if (this.responses.nature) {
            const order = this.responses.nature;
            order.forEach(itemName => {
                const item = container.querySelector(`[data-item="${itemName}"]`);
                if (item) container.appendChild(item);
            });
            response.textContent = CONTENT.nature.responses[order[0]];
        }
    },

    // ========== Toy 13: Upside Down ==========
    initUpsideDown() {
        const options = document.querySelectorAll('.upside-option');
        const response = document.getElementById('upside-response');
        const C = CONTENT.upside;

        options.forEach(btn => {
            btn.addEventListener('click', () => {
                options.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                const answer = btn.dataset.answer;
                response.textContent = C.responses[answer];
                this.responses.upside = answer;
                this.saveResponses();
            });
        });

        // Restore if saved
        if (this.responses.upside) {
            const saved = document.querySelector(`.upside-option[data-answer="${this.responses.upside}"]`);
            if (saved) {
                saved.classList.add('selected');
                response.textContent = C.responses[this.responses.upside];
            }
        }
    },

    // ========== Toy 14: AI Quiz ==========
    initAIQuiz() {
        const checkboxes = document.querySelectorAll('.ai-option input[type="checkbox"]');
        const response = document.getElementById('ai-response');
        const C = CONTENT.ai;

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
                response.textContent = C.responses.many;
            } else if (checked.includes('polite')) {
                response.textContent = C.responses.polite;
            } else if (checked.includes('sentient')) {
                response.textContent = C.responses.sentient;
            } else if (checked.includes('autoencoder')) {
                response.textContent = C.responses.autoencoder;
            } else {
                response.textContent = C.responses.default;
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

    // ========== Toy 15: Room Slider ==========
    initRoomSlider() {
        const dial = document.getElementById('room-dial');
        const response = document.getElementById('room-response');
        const C = CONTENT.room;

        const updateResponse = (value) => {
            let text;
            if (value < 20) {
                text = C.responses[0];
            } else if (value < 40) {
                text = C.responses[25];
            } else if (value < 60) {
                text = C.responses[50];
            } else if (value < 80) {
                text = C.responses[75];
            } else {
                text = C.responses[100];
            }
            response.textContent = text;
        };

        dial.addEventListener('input', () => {
            this.responses.room = dial.value;
            updateResponse(dial.value);
        });

        dial.addEventListener('change', () => {
            this.saveResponses();
        });

        if (this.responses.room !== undefined) {
            dial.value = this.responses.room;
            updateResponse(this.responses.room);
        }
    },

    // ========== Toy 16: Crying Scenario ==========
    initCryingScenario() {
        const options = document.querySelectorAll('.scenario-option');
        const response = document.getElementById('crying-response');
        const C = CONTENT.crying;

        options.forEach(btn => {
            btn.addEventListener('click', () => {
                options.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                const answer = btn.dataset.answer;
                response.textContent = C.responses[answer];
                this.responses.crying = answer;
                this.saveResponses();
            });
        });

        if (this.responses.crying) {
            const saved = document.querySelector(`.scenario-option[data-answer="${this.responses.crying}"]`);
            if (saved) {
                saved.classList.add('selected');
                response.textContent = C.responses[this.responses.crying];
            }
        }
    },

    // ========== Toy 17: Speed Reading ==========
    initSpeedReading() {
        const startBtn = document.getElementById('start-reading');
        const doneBtn = document.getElementById('done-reading');
        const textDiv = document.getElementById('reading-text');
        const timerDiv = document.getElementById('reading-timer');
        const questionDiv = document.getElementById('reading-question');
        const questionText = document.getElementById('question-text');
        const questionOptions = document.getElementById('question-options');
        const resultDiv = document.getElementById('reading-result');

        const passage = `The octopus has three hearts. Two pump blood to the gills, while the third pumps it to the rest of the body. When an octopus swims, the heart that delivers blood to the body stops beating, which is why these creatures prefer crawling—swimming exhausts them. Their blood is blue because it contains copper-based hemocyanin, which is more efficient at transporting oxygen in cold, low-oxygen environments. Each of their eight arms has its own mini-brain, a cluster of neurons that can act independently, allowing an arm to taste, touch, and even make decisions without consulting the central brain.`;

        const wordCount = passage.split(/\s+/).length;
        let startTime;
        let timerInterval;

        const question = {
            text: "Why do octopuses prefer crawling to swimming?",
            options: [
                { text: "Their arms work better on surfaces", correct: false },
                { text: "Swimming stops one of their hearts", correct: true },
                { text: "They can't see well while swimming", correct: false },
                { text: "Their blood flows better when crawling", correct: false }
            ]
        };

        startBtn.addEventListener('click', () => {
            startBtn.classList.add('hidden');
            textDiv.textContent = passage;
            textDiv.classList.add('show');
            doneBtn.classList.remove('hidden');
            startTime = Date.now();

            timerInterval = setInterval(() => {
                const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                timerDiv.textContent = `${elapsed}s`;
            }, 100);
        });

        doneBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            const elapsed = (Date.now() - startTime) / 1000;
            const wpm = Math.round((wordCount / elapsed) * 60);

            textDiv.classList.remove('show');
            doneBtn.classList.add('hidden');
            timerDiv.textContent = '';

            this.responses.readingWpm = wpm;

            questionDiv.classList.remove('hidden');
            questionText.textContent = question.text;

            question.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'question-option';
                btn.textContent = opt.text;
                btn.addEventListener('click', () => {
                    questionDiv.classList.add('hidden');
                    const correct = opt.correct;
                    this.responses.readingCorrect = correct;
                    this.saveResponses();

                    if (correct) {
                        resultDiv.textContent = `${wpm} words per minute, and you got it right.`;
                    } else {
                        resultDiv.textContent = `${wpm} words per minute, but the answer was wrong. speed vs comprehension.`;
                    }
                });
                questionOptions.appendChild(btn);
            });
        });

        if (this.responses.readingWpm) {
            startBtn.classList.add('hidden');
            const correct = this.responses.readingCorrect;
            if (correct) {
                resultDiv.textContent = `${this.responses.readingWpm} wpm, correct answer. already done.`;
            } else {
                resultDiv.textContent = `${this.responses.readingWpm} wpm, wrong answer. already done.`;
            }
        }
    },

    // ========== Toy 18: Spirit Slider ==========
    initSpiritSlider() {
        const dial = document.getElementById('spirit-dial');
        const response = document.getElementById('spirit-response');
        const C = CONTENT.spirit;

        const updateResponse = (value) => {
            let text;
            if (value < 15) {
                text = C.responses[0];
            } else if (value < 35) {
                text = C.responses[25];
            } else if (value < 55) {
                text = C.responses[50];
            } else if (value < 75) {
                text = C.responses[75];
            } else {
                text = C.responses[100];
            }
            response.textContent = text;
        };

        dial.addEventListener('input', () => {
            this.responses.spirit = dial.value;
            updateResponse(dial.value);
        });

        dial.addEventListener('change', () => {
            this.saveResponses();
        });

        if (this.responses.spirit !== undefined) {
            dial.value = this.responses.spirit;
            updateResponse(this.responses.spirit);
        }
    },

    // ========== Toy 19: Neuro Quiz ==========
    initNeuroQuiz() {
        const checkboxes = document.querySelectorAll('.neuro-option input[type="checkbox"]');
        const response = document.getElementById('neuro-response');
        const C = CONTENT.neuro;

        const updateResponse = () => {
            const checked = [...checkboxes].filter(cb => cb.checked).map(cb => cb.dataset.item);
            this.responses.neuro = checked;
            this.saveResponses();

            checkboxes.forEach(cb => {
                cb.closest('.neuro-option').classList.toggle('checked', cb.checked);
            });

            if (checked.includes('normal') && checked.length === 1) {
                response.textContent = C.responses.normal;
            } else if (checked.length === 0) {
                response.textContent = "";
            } else if (checked.length >= 4) {
                response.textContent = C.responses.many;
            } else if (checked.includes('swings')) {
                response.textContent = C.responses.swings;
            } else if (checked.includes('hyperfocus')) {
                response.textContent = C.responses.hyperfocus;
            } else {
                response.textContent = C.responses.default;
            }
        };

        checkboxes.forEach(cb => {
            cb.addEventListener('change', updateResponse);
        });

        if (this.responses.neuro) {
            this.responses.neuro.forEach(item => {
                const cb = document.querySelector(`.neuro-option input[data-item="${item}"]`);
                if (cb) {
                    cb.checked = true;
                    cb.closest('.neuro-option').classList.add('checked');
                }
            });
            updateResponse();
        }
    },

    // ========== Toy 20: Lead/Follow ==========
    initLeadFollow() {
        const options = document.querySelectorAll('.lead-option');
        const response = document.getElementById('lead-response');
        const C = CONTENT.lead;

        options.forEach(btn => {
            btn.addEventListener('click', () => {
                options.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                const answer = btn.dataset.answer;
                response.textContent = C.responses[answer];
                this.responses.lead = answer;
                this.saveResponses();
            });
        });

        if (this.responses.lead) {
            const saved = document.querySelector(`.lead-option[data-answer="${this.responses.lead}"]`);
            if (saved) {
                saved.classList.add('selected');
                response.textContent = C.responses[this.responses.lead];
            }
        }
    },

    // ========== Toy 21: Therapy ==========
    initTherapy() {
        const hoursInput = document.getElementById('therapy-hours');
        const moneyInput = document.getElementById('therapy-money');
        const response = document.getElementById('therapy-response');
        const C = CONTENT.therapy;

        const updateResponse = () => {
            const hours = parseInt(hoursInput.value) || 0;
            const money = parseInt(moneyInput.value) || 0;

            this.responses.therapyHours = hours;
            this.responses.therapyMoney = money;
            this.saveResponses();

            if (hours === 0 && money === 0) {
                response.textContent = "";
            } else if (hours > 500) {
                response.textContent = C.responses.lots;
            } else if (hours > 100) {
                response.textContent = C.responses.some;
            } else if (hours > 0) {
                response.textContent = C.responses.default;
            }
        };

        hoursInput.addEventListener('change', updateResponse);
        moneyInput.addEventListener('change', updateResponse);

        if (this.responses.therapyHours) hoursInput.value = this.responses.therapyHours;
        if (this.responses.therapyMoney) moneyInput.value = this.responses.therapyMoney;
        if (this.responses.therapyHours || this.responses.therapyMoney) updateResponse();
    },

    // ========== Toy 22: God ==========
    initGod() {
        const input = document.getElementById('god-input');
        const response = document.getElementById('god-response');
        const C = CONTENT.god;

        input.addEventListener('blur', () => {
            const value = input.value.trim();
            if (value) {
                this.responses.god = value;
                this.saveResponses();
                response.textContent = C.response;
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });

        if (this.responses.god) {
            input.value = this.responses.god;
            response.textContent = C.response;
        }
    },

    // ========== Toy 23: Food ==========
    initFood() {
        const checkboxes = document.querySelectorAll('.food-option input[type="checkbox"]');
        const response = document.getElementById('food-response');
        const C = CONTENT.food;

        const updateResponse = () => {
            const checked = [...checkboxes].filter(cb => cb.checked).map(cb => cb.dataset.item);
            this.responses.food = checked;
            this.saveResponses();

            checkboxes.forEach(cb => {
                cb.closest('.food-option').classList.toggle('checked', cb.checked);
            });

            if (checked.length === 0) {
                response.textContent = "";
            } else if (checked.includes('joy') && checked.includes('cook')) {
                response.textContent = C.responses.cookJoy;
            } else if (checked.includes('fuel') && !checked.includes('joy')) {
                response.textContent = C.responses.fuel;
            } else if (checked.includes('ingredients')) {
                response.textContent = C.responses.ingredients;
            } else {
                response.textContent = C.responses.default;
            }
        };

        checkboxes.forEach(cb => {
            cb.addEventListener('change', updateResponse);
        });

        if (this.responses.food) {
            this.responses.food.forEach(item => {
                const cb = document.querySelector(`.food-option input[data-item="${item}"]`);
                if (cb) {
                    cb.checked = true;
                    cb.closest('.food-option').classList.add('checked');
                }
            });
            updateResponse();
        }
    },

    // ========== Toy 24: Precision ==========
    initPrecision() {
        const slider = document.getElementById('precision-slider');
        const valueDiv = document.getElementById('precision-value');
        const checkBtn = document.getElementById('check-precision');
        const response = document.getElementById('precision-response');
        const C = CONTENT.precision;

        slider.addEventListener('input', () => {
            valueDiv.textContent = slider.value;
        });

        checkBtn.addEventListener('click', () => {
            const value = parseInt(slider.value);
            this.responses.precision = value;
            this.saveResponses();

            if (value === 50) {
                response.textContent = C.responses.perfect;
            } else if (value >= 49 && value <= 51) {
                response.textContent = C.responses.close.replace('{value}', value);
            } else if (value >= 45 && value <= 55) {
                response.textContent = C.responses.near.replace('{value}', value);
            } else {
                response.textContent = C.responses.off.replace('{value}', value);
            }
        });

        if (this.responses.precision !== undefined) {
            slider.value = this.responses.precision;
            valueDiv.textContent = this.responses.precision;
            if (this.responses.precision === 50) {
                response.textContent = C.responses.perfect;
            } else {
                response.textContent = C.responses.restored.replace('{value}', this.responses.precision);
            }
        }
    },

    // ========== Toy 25: Hold ==========
    initHold() {
        const button = document.getElementById('hold-button');
        const timerSpan = document.getElementById('hold-timer');
        const response = document.getElementById('hold-response');
        const C = CONTENT.hold;

        let startTime = null;
        let interval = null;
        let completed = false;

        const startHold = () => {
            if (completed) return;
            startTime = Date.now();
            button.classList.add('holding');

            interval = setInterval(() => {
                const elapsed = (Date.now() - startTime) / 1000;
                timerSpan.textContent = `${elapsed.toFixed(1)}s`;

                if (elapsed >= 10) {
                    endHold(true);
                }
            }, 100);
        };

        const endHold = (success = false) => {
            clearInterval(interval);
            button.classList.remove('holding');
            const elapsed = (Date.now() - startTime) / 1000;

            if (success || elapsed >= 10) {
                completed = true;
                timerSpan.textContent = "10.0s";
                response.textContent = C.responses.complete;
                this.responses.hold = 'completed';
            } else {
                timerSpan.textContent = `${elapsed.toFixed(1)}s`;
                response.textContent = C.responses.incomplete.replace('{seconds}', elapsed.toFixed(1));
                this.responses.hold = elapsed.toFixed(1);
            }
            this.saveResponses();
        };

        button.addEventListener('mousedown', startHold);
        button.addEventListener('touchstart', (e) => { e.preventDefault(); startHold(); });
        button.addEventListener('mouseup', () => { if (!completed && startTime) endHold(); });
        button.addEventListener('mouseleave', () => { if (!completed && startTime) endHold(); });
        button.addEventListener('touchend', () => { if (!completed && startTime) endHold(); });

        if (this.responses.hold === 'completed') {
            completed = true;
            timerSpan.textContent = "10.0s";
            response.textContent = C.responses.complete;
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
                <p class="copy-hint">${CONTENT.end.copyHint}</p>
            `;

            // Also copy to clipboard
            navigator.clipboard.writeText(summary).catch(() => {
                // Clipboard might not be available, that's ok
            });
        });

        // Calculate and show score
        this.updateScore();
    },

    // ========== Scorecard ==========
    updateScore() {
        const scoreValue = document.getElementById('score-value');
        const scoreNote = document.getElementById('score-note');

        if (!scoreValue) return;

        const r = this.responses;
        let points = 0;
        let maxPoints = 0;
        let notes = [];

        // Score based on Linda's preferences (edit these!)
        // Each match adds points, mismatches subtract or add 0

        // Music: Linda likes silence/quiet
        if (r.music !== undefined) {
            maxPoints += 10;
            if (r.music < 35) { points += 10; notes.push("quiet person"); }
            else if (r.music < 55) { points += 5; }
        }

        // Upside down: Linda loves it
        if (r.upside) {
            maxPoints += 10;
            if (r.upside === 'love') { points += 10; notes.push("upside down buddy"); }
            else if (r.upside === 'fine') { points += 5; }
        }

        // AI: Linda is very online
        if (r.ai && r.ai.length > 0) {
            maxPoints += 10;
            if (r.ai.length >= 4) { points += 10; notes.push("AI nerd"); }
            else if (r.ai.length >= 2) { points += 5; }
        }

        // Spirituality: Linda is spiritual
        if (r.spirit !== undefined) {
            maxPoints += 10;
            if (r.spirit >= 55) { points += 10; notes.push("open to mystery"); }
            else if (r.spirit >= 35) { points += 5; }
        }

        // Lead/follow: flexible is good
        if (r.lead) {
            maxPoints += 10;
            if (r.lead === 'both' || r.lead === 'neither') { points += 10; }
            else { points += 5; }
        }

        // Crying: emotional availability
        if (r.crying) {
            maxPoints += 10;
            if (r.crying === 'cry' || r.crying === 'ask') { points += 10; notes.push("emotionally present"); }
            else if (r.crying === 'hug') { points += 7; }
            else { points += 3; }
        }

        // Nature: sea is Linda's fave
        if (r.nature && r.nature.length > 0) {
            maxPoints += 10;
            if (r.nature[0] === 'sea') { points += 10; notes.push("sea lover"); }
            else if (r.nature[0] === 'forest') { points += 8; }
            else { points += 5; }
        }

        // Food: cooking joy
        if (r.food && r.food.length > 0) {
            maxPoints += 10;
            if (r.food.includes('joy') && r.food.includes('cook')) { points += 10; notes.push("cooking together"); }
            else if (r.food.includes('ingredients')) { points += 7; }
            else { points += 3; }
        }

        // Calculate percentage
        if (maxPoints === 0) {
            scoreValue.textContent = "--";
            scoreNote.textContent = "answer some things first";
            return;
        }

        const percentage = Math.round((points / maxPoints) * 100);

        // Fun labels instead of numbers
        let label;
        if (percentage >= 85) label = "intriguing";
        else if (percentage >= 70) label = "promising";
        else if (percentage >= 50) label = "curious";
        else if (percentage >= 30) label = "different";
        else label = "wildcard";

        scoreValue.textContent = label;

        // Show one random note
        if (notes.length > 0) {
            const randomNote = notes[Math.floor(Math.random() * notes.length)];
            scoreNote.textContent = randomNote;
        } else {
            scoreNote.textContent = "";
        }
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

        if (r.room !== undefined) {
            lines.push(`room preference: ${r.room}/100 (0=one room, 100=mansion)`);
        }

        if (r.crying) {
            lines.push(`crying scenario: ${r.crying}`);
        }

        if (r.readingWpm) {
            lines.push(`reading: ${r.readingWpm} wpm, ${r.readingCorrect ? 'correct' : 'wrong'}`);
        }

        if (r.spirit !== undefined) {
            lines.push(`spirituality: ${r.spirit}/100 (0=materialist, 100=believer)`);
        }

        if (r.neuro && r.neuro.length > 0) {
            lines.push(`neuro: ${r.neuro.join(', ')}`);
        }

        if (r.lead) {
            lines.push(`lead/follow: ${r.lead}`);
        }

        if (r.therapyHours || r.therapyMoney) {
            lines.push(`therapy: ${r.therapyHours || 0} hours, $${r.therapyMoney || 0}`);
        }

        if (r.god) {
            lines.push(`god/source: "${r.god}"`);
        }

        if (r.food && r.food.length > 0) {
            lines.push(`food: ${r.food.join(', ')}`);
        }

        if (r.precision !== undefined) {
            lines.push(`precision slider: ${r.precision} (target: 50)`);
        }

        if (r.hold) {
            lines.push(`hold button: ${r.hold}`);
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
