/**
 * Playground - Interactive Toys
 * A scattered collection of small interactions
 */

const Playground = {
    // Store responses
    responses: {},
    viewingMode: false, // true when viewing someone else's results via ?r= param

    init() {
        // Check for shared results URL first
        const sharedData = this._checkSharedUrl();
        if (sharedData) {
            this.viewingMode = true;
            this.responses = sharedData;
            this._showViewingMode();
        } else {
            this.loadResponses();
        }
        this.reorderToys();
        this.initColorMaker();
        this.initBodyCheck();
        this.initShadeOrder();
        this.initEmotionGame();
        this.initTexturePicker();
        this.initToeTest();
        this.initSequence();
        this.initAutocomplete();
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
        this.initDay();
        this.initEmbodiment();
        this.initPatterns();
        this.initBabies();
        this.initUntangle();
        this.initShare();
        this.populateAnswerSections();
        this.initResultsCard();
        this.initShareLink();
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
            meta: document.getElementById('toy-meta'),
            day: document.getElementById('toy-day'),
            embodiment: document.getElementById('toy-embodiment'),
            patterns: document.getElementById('toy-patterns'),
            untangle: document.getElementById('toy-untangle'),
            babies: document.getElementById('toy-babies')
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

    // ========== Touch Drag Polyfill ==========
    // Makes draggable elements work on touch devices
    addTouchDragToReorderable(container, itemSelector, onReorder) {
        let draggedItem = null;
        let placeholder = null;
        let startY = 0;
        let startX = 0;
        let itemRect = null;

        const getItemAtPoint = (x, y) => {
            const items = [...container.querySelectorAll(itemSelector)];
            return items.find(item => {
                if (item === placeholder) return false;
                const rect = item.getBoundingClientRect();
                return y >= rect.top && y <= rect.bottom && x >= rect.left && x <= rect.right;
            });
        };

        container.addEventListener('touchstart', (e) => {
            const item = e.target.closest(itemSelector);
            if (!item || !container.contains(item)) return;

            draggedItem = item;
            itemRect = item.getBoundingClientRect();
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;

            // Create placeholder
            placeholder = item.cloneNode(true);
            placeholder.style.opacity = '0.3';
            placeholder.style.pointerEvents = 'none';
            item.after(placeholder);

            // Style dragged item
            item.style.position = 'fixed';
            item.style.zIndex = '1000';
            item.style.width = itemRect.width + 'px';
            item.style.left = itemRect.left + 'px';
            item.style.top = itemRect.top + 'px';
            item.style.transition = 'none';
            item.classList.add('dragging');
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            if (!draggedItem) return;
            e.preventDefault();

            const touch = e.touches[0];
            const dy = touch.clientY - startY;
            const dx = touch.clientX - startX;

            draggedItem.style.top = (itemRect.top + dy) + 'px';
            draggedItem.style.left = (itemRect.left + dx) + 'px';

            const target = getItemAtPoint(touch.clientX, touch.clientY);
            if (target && target !== placeholder) {
                const targetRect = target.getBoundingClientRect();
                const midY = targetRect.top + targetRect.height / 2;
                if (touch.clientY < midY) {
                    target.before(placeholder);
                } else {
                    target.after(placeholder);
                }
            }
        }, { passive: false });

        const endDrag = () => {
            if (!draggedItem) return;

            // Move dragged item to placeholder position
            placeholder.before(draggedItem);
            placeholder.remove();

            // Reset styles
            draggedItem.style.position = '';
            draggedItem.style.zIndex = '';
            draggedItem.style.width = '';
            draggedItem.style.left = '';
            draggedItem.style.top = '';
            draggedItem.style.transition = '';
            draggedItem.classList.remove('dragging');

            if (onReorder) onReorder();

            draggedItem = null;
            placeholder = null;
        };

        container.addEventListener('touchend', endDrag);
        container.addEventListener('touchcancel', endDrag);
    },

    // Touch drag for day builder (drag from pool to drop zones)
    addTouchDragToDropZones(sourceContainer, itemSelector, dropZones, onDrop) {
        let draggedItem = null;
        let clone = null;
        let startY = 0;
        let startX = 0;

        sourceContainer.addEventListener('touchstart', (e) => {
            const item = e.target.closest(itemSelector);
            if (!item) return;

            draggedItem = item;
            const rect = item.getBoundingClientRect();
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;

            clone = item.cloneNode(true);
            clone.style.position = 'fixed';
            clone.style.zIndex = '1000';
            clone.style.width = rect.width + 'px';
            clone.style.left = rect.left + 'px';
            clone.style.top = rect.top + 'px';
            clone.style.opacity = '0.8';
            clone.style.pointerEvents = 'none';
            clone.style.transition = 'none';
            document.body.appendChild(clone);

            item.style.opacity = '0.3';
        }, { passive: true });

        sourceContainer.addEventListener('touchmove', (e) => {
            if (!clone) return;
            e.preventDefault();

            const touch = e.touches[0];
            const rect = draggedItem.getBoundingClientRect();
            clone.style.top = (touch.clientY - 20) + 'px';
            clone.style.left = (touch.clientX - 60) + 'px';

            // Highlight drop zones
            dropZones.forEach(zone => {
                const zr = zone.getBoundingClientRect();
                if (touch.clientX >= zr.left && touch.clientX <= zr.right &&
                    touch.clientY >= zr.top && touch.clientY <= zr.bottom) {
                    zone.classList.add('drag-over');
                } else {
                    zone.classList.remove('drag-over');
                }
            });
        }, { passive: false });

        const endDrag = (e) => {
            if (!clone) return;

            const touch = e.changedTouches[0];
            clone.remove();
            draggedItem.style.opacity = '';

            // Find which drop zone we're over
            dropZones.forEach(zone => {
                zone.classList.remove('drag-over');
                const zr = zone.getBoundingClientRect();
                if (touch.clientX >= zr.left && touch.clientX <= zr.right &&
                    touch.clientY >= zr.top && touch.clientY <= zr.bottom) {
                    onDrop(zone, draggedItem);
                }
            });

            draggedItem = null;
            clone = null;
        };

        sourceContainer.addEventListener('touchend', endDrag);
        sourceContainer.addEventListener('touchcancel', () => {
            if (clone) clone.remove();
            if (draggedItem) draggedItem.style.opacity = '';
            draggedItem = null;
            clone = null;
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

        // Generate colors from pink/rose through red to green/teal
        const generateShades = () => {
            const shades = [];
            // Pick a random starting hue, then span ~60 degrees (subtle range)
            const startHue = Math.floor(Math.random() * 360);
            const totalRange = 60;
            // Fixed saturation and lightness so only hue varies
            const sat = 40 + Math.floor(Math.random() * 15); // fixed per round
            const lit = 50 + Math.floor(Math.random() * 10); // fixed per round
            for (let i = 0; i < 8; i++) {
                const base = startHue + (totalRange / 7) * i;
                const offset = (Math.random() - 0.5) * 4; // ±2 jitter
                const sortKey = base + offset;
                const hue = ((sortKey % 360) + 360) % 360;
                shades.push({
                    hue,
                    sortKey,
                    color: `hsl(${hue}, ${sat}%, ${lit}%)`
                });
            }
            // Shuffle randomly for the user to sort
            for (let i = shades.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shades[i], shades[j]] = [shades[j], shades[i]];
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
            // Check if sorted by sortKey (warmest/pink to coolest/green)
            let correct = true;
            for (let i = 1; i < shades.length; i++) {
                if (shades[i].sortKey < shades[i - 1].sortKey) {
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

        // Feelings vs thoughts disguised as feelings
        const items = [
            { text: "I feel abandoned", isFeeling: false, explanation: "that's more about what you think happened than how you feel inside." },
            { text: "I feel like you don't care", isFeeling: false, explanation: "that's a thought about someone else, not a feeling." },
            { text: "I feel manipulated", isFeeling: false, explanation: "that's a story about what someone did to you." },
            { text: "I feel curious", isFeeling: true, explanation: "yes, curiosity counts." },
            { text: "I feel tender", isFeeling: true, explanation: "yes, tenderness is a feeling." },
            { text: "I feel restless", isFeeling: true, explanation: "yes, restlessness is a feeling." },
        ];

        let shuffled = [...items].sort(() => Math.random() - 0.5);
        let current = 0;
        let correct = 0;

        const showItem = () => {
            if (current >= shuffled.length) {
                text.textContent = "that's all of them";
                yesBtn.style.display = 'none';
                noBtn.style.display = 'none';
                feedback.textContent = `you got ${correct} out of ${shuffled.length}. turns out a lot of what we call feelings are actually thoughts about what someone else did. most people find this weird at first.`;
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
            sandstone: 'honed sandstone',
            plaster: 'textured plaster',
            concrete: 'concrete slate-teal'
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

    // ========== Toy 28: Assemble a Day (Multi-item slots) ==========
    initDay() {
        const activityList = document.getElementById('activity-list');
        const newActivityInput = document.getElementById('new-activity-input');
        const addActivityBtn = document.getElementById('add-activity-btn');
        const response = document.getElementById('day-response');
        const phaseSelector = document.getElementById('phase-selector');
        const C = CONTENT.day;

        if (!C || !activityList) return;

        // Viewing mode: render day as read-only
        if (this.viewingMode) {
            // Hide interactive elements
            const activityPool = activityList.closest('.activity-pool');
            if (activityPool) activityPool.style.display = 'none';

            // Render schedule as read-only text
            const dayData = this.responses.day;
            if (dayData) {
                const zones = document.querySelectorAll('.time-drop-zone');
                zones.forEach(zone => {
                    const phase = zone.dataset.phase;
                    const items = dayData[phase] || [];
                    zone.innerHTML = '';
                    items.forEach(activity => {
                        const chip = document.createElement('div');
                        chip.className = 'slot-chip';
                        chip.style.cursor = 'default';
                        const text = document.createElement('span');
                        text.textContent = activity;
                        chip.appendChild(text);
                        zone.appendChild(chip);
                    });
                    zone.classList.toggle('filled', items.length > 0);
                    // Disable drop functionality
                    zone.style.pointerEvents = 'none';
                    zone.style.cursor = 'default';
                });
            }
            return; // Skip all interactive setup
        }

        let selectedPhase = 'morning';

        // Migrate old single-value format to arrays
        const migrateOldFormat = (data) => {
            ['morning', 'afternoon', 'evening', 'night'].forEach(phase => {
                if (data[phase] && !Array.isArray(data[phase])) {
                    data[phase] = [data[phase]];
                }
            });
            return data;
        };

        // Initialize responses storage
        if (!this.responses.day) {
            this.responses.day = {
                morning: [],
                afternoon: [],
                evening: [],
                night: [],
                customActivities: []
            };
        } else {
            migrateOldFormat(this.responses.day);
            if (!this.responses.day.customActivities) {
                this.responses.day.customActivities = [];
            }
            ['morning', 'afternoon', 'evening', 'night'].forEach(phase => {
                if (!this.responses.day[phase]) this.responses.day[phase] = [];
            });
        }

        // Phase selector buttons
        if (phaseSelector) {
            const phaseBtns = phaseSelector.querySelectorAll('.phase-btn');
            phaseBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    phaseBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    selectedPhase = btn.dataset.phase;
                });
            });
        }

        // Add activity to a phase
        const addToPhase = (phase, activity) => {
            if (!this.responses.day[phase]) this.responses.day[phase] = [];
            if (this.responses.day[phase].includes(activity)) return;
            this.responses.day[phase].push(activity);
            this.saveResponses();
            renderSlots();
            checkCompletion();
        };

        // Remove activity from a phase
        const removeFromPhase = (phase, activity) => {
            if (!this.responses.day[phase]) return;
            this.responses.day[phase] = this.responses.day[phase].filter(a => a !== activity);
            this.saveResponses();
            renderSlots();
            checkCompletion();
        };

        // Check if all slots have at least one item
        const checkCompletion = () => {
            const allFilled = ['morning', 'afternoon', 'evening', 'night'].every(
                p => this.responses.day[p] && this.responses.day[p].length > 0
            );
            response.textContent = allFilled ? C.response : '';
        };

        // Render activity pool
        const renderActivities = () => {
            activityList.innerHTML = '';
            const allActivities = [...C.activities, ...(this.responses.day.customActivities || [])];

            allActivities.forEach((activity, index) => {
                const isCustom = index >= C.activities.length;
                const item = document.createElement('div');
                item.className = 'activity-item' + (isCustom ? ' custom' : '');
                item.draggable = true;
                item.dataset.activity = activity;

                const textSpan = document.createElement('span');
                textSpan.className = 'activity-text';
                textSpan.textContent = activity;
                item.appendChild(textSpan);

                if (isCustom) {
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'remove-activity';
                    removeBtn.textContent = '\u00d7';
                    removeBtn.onclick = (e) => {
                        e.stopPropagation();
                        ['morning', 'afternoon', 'evening', 'night'].forEach(phase => {
                            if (this.responses.day[phase]) {
                                this.responses.day[phase] = this.responses.day[phase].filter(a => a !== activity);
                            }
                        });
                        this.responses.day.customActivities = this.responses.day.customActivities.filter(a => a !== activity);
                        this.saveResponses();
                        renderActivities();
                        renderSlots();
                        checkCompletion();
                    };
                    item.appendChild(removeBtn);
                }

                // Tap to add to selected phase
                item.addEventListener('click', (e) => {
                    if (e.target.classList.contains('remove-activity')) return;
                    addToPhase(selectedPhase, activity);
                    item.classList.add('just-added');
                    setTimeout(() => item.classList.remove('just-added'), 300);
                });

                // Drag events (desktop)
                item.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', activity);
                    item.classList.add('dragging');
                });
                item.addEventListener('dragend', () => {
                    item.classList.remove('dragging');
                });

                activityList.appendChild(item);
            });
        };

        // Render all drop zone slots
        const renderSlots = () => {
            const zones = document.querySelectorAll('.time-drop-zone');
            zones.forEach(zone => {
                const phase = zone.dataset.phase;
                const items = this.responses.day[phase] || [];
                zone.innerHTML = '';

                items.forEach(activity => {
                    const chip = document.createElement('div');
                    chip.className = 'slot-chip';

                    const text = document.createElement('span');
                    text.textContent = activity;
                    chip.appendChild(text);

                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'slot-chip-remove';
                    removeBtn.textContent = '\u00d7';
                    removeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        removeFromPhase(phase, activity);
                    });
                    chip.appendChild(removeBtn);

                    zone.appendChild(chip);
                });

                zone.classList.toggle('filled', items.length > 0);
            });
        };

        // Add custom activity
        const addCustomActivity = () => {
            const text = newActivityInput.value.trim();
            if (text && text.length > 0) {
                if (!this.responses.day.customActivities) {
                    this.responses.day.customActivities = [];
                }
                this.responses.day.customActivities.push(text);
                newActivityInput.value = '';
                this.saveResponses();
                renderActivities();
            }
        };

        addActivityBtn.addEventListener('click', addCustomActivity);
        newActivityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addCustomActivity();
        });

        // Setup drop zones for drag-and-drop (desktop)
        const dropZones = document.querySelectorAll('.time-drop-zone');
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                const activity = e.dataTransfer.getData('text/plain');
                if (activity) {
                    addToPhase(zone.dataset.phase, activity);
                }
            });

            // Tap on empty drop zone to select it as target phase
            zone.addEventListener('click', (e) => {
                if (e.target.classList.contains('slot-chip-remove')) return;
                if (e.target.closest('.slot-chip')) return;
                const phase = zone.dataset.phase;
                selectedPhase = phase;
                if (phaseSelector) {
                    const phaseBtns = phaseSelector.querySelectorAll('.phase-btn');
                    phaseBtns.forEach(b => b.classList.remove('active'));
                    const btn = phaseSelector.querySelector(`.phase-btn[data-phase="${phase}"]`);
                    if (btn) btn.classList.add('active');
                }
            });
        });

        // Touch support for dragging activities to drop zones
        this.addTouchDragToDropZones(activityList, '.activity-item', dropZones, (zone, item) => {
            const phase = zone.dataset.phase;
            const activity = item.dataset.activity;
            addToPhase(phase, activity);
        });

        // Initial render
        renderActivities();
        renderSlots();
        checkCompletion();
    },

    // ========== Toy 29: Embodiment ==========
    initEmbodiment() {
        const options = document.querySelectorAll('.embodiment-option');
        const response = document.getElementById('embodiment-response');
        const C = CONTENT.embodiment;

        if (!C) return;

        options.forEach(btn => {
            btn.addEventListener('click', () => {
                options.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                response.textContent = C.response;
                this.responses.embodiment = btn.dataset.answer;
                this.saveResponses();
            });
        });

        // Restore if saved
        if (this.responses.embodiment) {
            const saved = document.querySelector(`.embodiment-option[data-answer="${this.responses.embodiment}"]`);
            if (saved) {
                saved.classList.add('selected');
                response.textContent = C.response;
            }
        }
    },

    // ========== Toy 30: Patterns ==========
    initPatterns() {
        const options = document.querySelectorAll('.patterns-option');
        const response = document.getElementById('patterns-response');
        const C = CONTENT.patterns;

        if (!C) return;

        options.forEach(btn => {
            btn.addEventListener('click', () => {
                options.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                response.textContent = C.response;
                this.responses.patterns = btn.dataset.answer;
                this.saveResponses();
            });
        });

        // Restore if saved
        if (this.responses.patterns) {
            const saved = document.querySelector(`.patterns-option[data-answer="${this.responses.patterns}"]`);
            if (saved) {
                saved.classList.add('selected');
                response.textContent = C.response;
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

        // Touch support for reordering
        this.addTouchDragToReorderable(container, '.rank-item');

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
        const response = document.getElementById('therapy-response');
        const C = CONTENT.therapy;

        const updateResponse = () => {
            const hours = parseInt(hoursInput.value) || 0;

            this.responses.therapyHours = hours;
            this.saveResponses();

            if (hours === 0) {
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

        if (this.responses.therapyHours) hoursInput.value = this.responses.therapyHours;
        if (this.responses.therapyHours) updateResponse();
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
            // don't show the number — that's the challenge
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
            response.textContent = '';

            interval = setInterval(() => {
                const elapsed = (Date.now() - startTime) / 1000;
                timerSpan.textContent = `${elapsed.toFixed(2)}s`;
            }, 50);
        };

        const endHold = () => {
            clearInterval(interval);
            button.classList.remove('holding');
            const elapsed = (Date.now() - startTime) / 1000;
            const diff = Math.abs(elapsed - 10);
            timerSpan.textContent = `${elapsed.toFixed(2)}s`;

            if (diff <= 0.05) {
                completed = true;
                response.textContent = C.responses.perfect.replace('{elapsed}', elapsed.toFixed(2));
                this.responses.hold = 'perfect';
            } else if (diff <= 0.20) {
                completed = true;
                response.textContent = C.responses.close.replace('{elapsed}', elapsed.toFixed(2));
                this.responses.hold = 'close';
            } else if (diff <= 0.50) {
                completed = true;
                response.textContent = C.responses.decent.replace('{elapsed}', elapsed.toFixed(2));
                this.responses.hold = 'decent';
            } else {
                response.textContent = C.responses.miss.replace('{elapsed}', elapsed.toFixed(2));
                this.responses.hold = elapsed.toFixed(2);
            }
            this.saveResponses();
        };

        button.addEventListener('mousedown', startHold);
        button.addEventListener('touchstart', (e) => { e.preventDefault(); startHold(); });
        button.addEventListener('mouseup', () => { if (!completed && startTime) endHold(); });
        button.addEventListener('mouseleave', () => { if (!completed && startTime) endHold(); });
        button.addEventListener('touchend', () => { if (!completed && startTime) endHold(); });

        if (['perfect', 'close', 'decent'].includes(this.responses.hold)) {
            completed = true;
            const storedPrecision = this.responses.hold;
            response.textContent = C.responses[storedPrecision].replace('{elapsed}', '');
            // Clean up the display for restored state
            response.textContent = `completed (${storedPrecision})`;
        }
    },

    // ========== Toy: Untangle This (3D Knot) ==========
    // ========== Toy: Babies ==========
    initBabies() {
        const slider = document.getElementById('babies-slider');
        const current = document.getElementById('babies-current');
        const response = document.getElementById('babies-response');
        const labelsContainer = document.getElementById('babies-labels');
        const C = CONTENT.babies;

        if (!slider || !C) return;

        const updateBabies = (value) => {
            const val = parseInt(value);
            if (current) current.textContent = C.labels[val];
            if (response) response.textContent = C.responses[val];

            // Highlight the active label
            if (labelsContainer) {
                const labels = labelsContainer.querySelectorAll('span');
                labels.forEach(label => {
                    label.classList.toggle('active', parseInt(label.dataset.value) === val);
                });
            }
        };

        slider.addEventListener('input', () => {
            updateBabies(slider.value);
        });

        slider.addEventListener('change', () => {
            this.responses.babies = parseInt(slider.value);
            this.saveResponses();
        });

        // Restore if saved
        if (this.responses.babies !== undefined) {
            slider.value = this.responses.babies;
            updateBabies(this.responses.babies);
        } else {
            updateBabies(slider.value);
        }
    },

    initUntangle() {
        const wrap = document.getElementById('untangle-canvas-wrap');
        const buttonsDiv = document.getElementById('untangle-buttons');
        const response = document.getElementById('untangle-response');
        const C = CONTENT.untangle;

        if (!wrap || !buttonsDiv || !response) return;

        // If already completed, hide buttons and show response
        if (this.responses.untangle) {
            buttonsDiv.style.display = 'none';
            response.textContent = C.responses[this.responses.untangle] || '';
        }

        // Button click handlers (attach before THREE check so buttons always work)
        buttonsDiv.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.value;
                response.textContent = C.responses[value];
                this.responses.untangle = value;
                this.saveResponses();
                buttonsDiv.style.display = 'none';
                this.populateAnswerSections();
            });
        });

        if (typeof THREE === 'undefined') return;

        // Setup Three.js scene — small 180x180 canvas
        const width = 180;
        const height = 180;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
        camera.position.z = 10;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        wrap.appendChild(renderer.domElement);

        // Create complex torus knot — high p,q for visual intricacy
        const geometry = new THREE.TorusKnotGeometry(2.2, 0.18, 300, 20, 5, 3);
        const material = new THREE.MeshStandardMaterial({
            color: 0x2D6A6A,
            roughness: 0.5,
            metalness: 0.15
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Lighting
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        const mainLight = new THREE.DirectionalLight(0xfff5e6, 1.0);
        mainLight.position.set(5, 5, 5);
        scene.add(mainLight);
        const fillLight = new THREE.DirectionalLight(0xe6f0ff, 0.4);
        fillLight.position.set(-3, 2, -3);
        scene.add(fillLight);

        // Auto-rotation only, no interaction
        const animate = () => {
            requestAnimationFrame(animate);
            mesh.rotation.y += 0.003;
            mesh.rotation.x += 0.001;
            renderer.render(scene, camera);
        };
        animate();
    },

    // ========== Toy: Patience Test (3D Knot) ==========
    // ========== Share Results (Contact Form) ==========
    initShare() {
        const toggleBtn = document.getElementById('share-toggle');
        const formContainer = document.getElementById('share-form-container');
        const form = document.getElementById('share-form');
        const answersInput = document.getElementById('share-answers');
        const responseDiv = document.getElementById('form-response');

        if (!toggleBtn || !formContainer || !form) {
            console.log('Share form elements not found');
            this.updateScore();
            return;
        }

        // Toggle form visibility
        toggleBtn.addEventListener('click', () => {
            const isVisible = formContainer.style.display !== 'none';
            formContainer.style.display = isVisible ? 'none' : 'block';

            // Pre-fill answers in hidden field
            if (!isVisible) {
                answersInput.value = this.generateSummary();
            }
        });

        // Copy to clipboard button
        const copyBtn = document.getElementById('copy-answers-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const email = document.getElementById('share-email').value;
                const message = document.getElementById('share-message').value;
                const answers = answersInput.value;

                const text = `From: ${email}\n\n${message ? 'Message:\n' + message + '\n\n' : ''}${answers}`;

                navigator.clipboard.writeText(text).then(() => {
                    responseDiv.className = 'form-response success';
                    responseDiv.textContent = 'copied! send it however you like.';
                    copyBtn.textContent = 'copied';
                    setTimeout(() => { copyBtn.textContent = 'copy to clipboard'; }, 2000);
                }).catch(() => {
                    // Fallback for older browsers
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    responseDiv.className = 'form-response success';
                    responseDiv.textContent = 'copied! send it however you like.';
                });
            });
        }

        // Handle form submission (mailto fallback)
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('share-email').value;
            const message = document.getElementById('share-message').value;
            const answers = answersInput.value;

            const subject = 'Playground Answers';
            const resultsUrl = this._getResultsUrl();
            const urlLine = resultsUrl ? `\n\nView my visual card: ${resultsUrl}` : '';
            const body = `Email: ${email}\n\nMessage:\n${message}\n\n=== Answers ===\n${answers}${urlLine}`;

            window.location.href = `mailto:lindapetrini@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            responseDiv.className = 'form-response success';
            responseDiv.textContent = "opening your email client...";
        });

        // Calculate and show score
        this.updateScore();
    },

    // ========== Visual Scorecard ==========
    updateScore() {
        const scoreValue = document.getElementById('score-value');
        const scoreNote = document.getElementById('score-note');
        const scoreStats = document.getElementById('score-stats');
        const scoreCanvas = document.getElementById('score-canvas');

        if (!scoreValue || !scoreStats) return;

        const r = this.responses;

        // Calculate character stats (0-100 scale)
        const stats = {};

        // Quietness (based on music preference)
        if (r.music !== undefined) {
            stats.quietness = 100 - parseInt(r.music);
        }

        // Playfulness (based on upside down + hold button + fun)
        let playfulness = 0;
        let playCount = 0;
        if (r.upside) {
            playCount++;
            if (r.upside === 'love') playfulness += 100;
            else if (r.upside === 'fine') playfulness += 60;
            else playfulness += 20;
        }
        if (r.hold === 'completed') {
            playCount++;
            playfulness += 80;
        }
        if (playCount > 0) stats.playfulness = Math.round(playfulness / playCount);

        // Tech Affinity (based on AI quiz)
        if (r.ai && r.ai.length > 0) {
            stats['tech affinity'] = Math.min(100, (r.ai.length / 6) * 100);
        }

        // Spirituality
        if (r.spirit !== undefined) {
            stats.spirituality = parseInt(r.spirit);
        }

        // Emotional Openness (crying + message preference)
        let emotional = 0;
        let emotionalCount = 0;
        if (r.crying) {
            emotionalCount++;
            if (r.crying === 'cry' || r.crying === 'ask') emotional += 100;
            else if (r.crying === 'hug') emotional += 70;
            else emotional += 40;
        }
        if (r.message) {
            emotionalCount++;
            emotional += r.message === 'soft' ? 80 : 60;
        }
        if (emotionalCount > 0) stats['emotional openness'] = Math.round(emotional / emotionalCount);

        // Adventurousness (nature preference + patterns)
        if (r.nature && r.nature.length > 0) {
            const adventureMap = { sea: 85, mountain: 90, river: 75, forest: 70, lake: 60 };
            stats.adventurousness = adventureMap[r.nature[0]] || 70;
        }

        // Calculate overall compatibility
        let compatPoints = 0;
        let compatMax = 0;

        if (r.music !== undefined) {
            compatMax += 10;
            if (r.music < 35) compatPoints += 10;
            else if (r.music < 55) compatPoints += 5;
        }
        if (r.upside === 'love') { compatMax += 10; compatPoints += 10; }
        else if (r.upside) { compatMax += 10; compatPoints += 5; }
        if (r.ai && r.ai.length >= 4) { compatMax += 10; compatPoints += 10; }
        else if (r.ai && r.ai.length > 0) { compatMax += 10; compatPoints += 5; }
        if (r.spirit !== undefined) {
            compatMax += 10;
            if (r.spirit >= 55) compatPoints += 10;
            else if (r.spirit >= 35) compatPoints += 5;
        }
        if (r.crying) {
            compatMax += 10;
            if (r.crying === 'cry' || r.crying === 'ask') compatPoints += 10;
            else if (r.crying === 'hug') compatPoints += 7;
            else compatPoints += 3;
        }

        // Render stats
        if (Object.keys(stats).length > 0) {
            scoreStats.innerHTML = '';
            Object.entries(stats).forEach(([label, value]) => {
                const row = document.createElement('div');
                row.className = 'stat-row';

                row.innerHTML = `
                    <span class="stat-label">${label}</span>
                    <div class="stat-bar-container">
                        <div class="stat-bar" style="width: ${value}%"></div>
                    </div>
                    <span class="stat-value">${Math.round(value)}</span>
                `;
                scoreStats.appendChild(row);
            });
        }

        // Calculate character archetype based on stat profile
        if (compatMax === 0) {
            scoreValue.textContent = "--";
            scoreNote.textContent = "answer some things to see your character card";
        } else {
            const percentage = Math.round((compatPoints / compatMax) * 100);

            // Determine archetype from stat profile
            const high = (stat) => (stats[stat] || 50) > 60;
            const low = (stat) => (stats[stat] || 50) < 40;

            let archetype;
            if (high('playfulness') && high('spirituality')) archetype = "the fool";
            else if (high('tech affinity') && high('emotional openness')) archetype = "the alchemist";
            else if (high('adventurousness') && high('playfulness')) archetype = "the explorer";
            else if (high('quietness') && high('spirituality')) archetype = "the hermit";
            else if (high('emotional openness') && high('adventurousness')) archetype = "the lover";
            else if (high('tech affinity') && low('emotional openness')) archetype = "the architect";
            else if (high('playfulness') && low('spirituality')) archetype = "the trickster";
            else archetype = "the magician";

            scoreValue.textContent = archetype;
            scoreNote.textContent = `${percentage}% compatibility with linda`;
        }

        // Draw the image/pattern in canvas
        if (scoreCanvas && r.color) {
            const ctx = scoreCanvas.getContext('2d');
            const size = 80;
            scoreCanvas.width = size;
            scoreCanvas.height = size;

            const { h, s, l } = r.color;
            const color = `hsl(${h}, ${s}%, ${l}%)`;

            // Draw a color-based pattern
            {
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, size, size);
                ctx.globalAlpha = 0.5;
                for (let i = 0; i < 5; i++) {
                    ctx.beginPath();
                    ctx.arc(
                        Math.random() * size,
                        Math.random() * size,
                        Math.random() * 25 + 8,
                        0,
                        Math.PI * 2
                    );
                    ctx.fillStyle = `hsl(${h}, ${Math.max(0, s - 20)}%, ${Math.min(100, l + 10)}%)`;
                    ctx.fill();
                }
            }
        }
    },

    // ========== Summary Helpers ==========
    _describeColor(color) {
        if (!color) return null;
        const { h, s, l } = color;
        // Temperature
        const temp = (h >= 0 && h < 70) || h > 330 ? 'warm' : (h >= 70 && h < 170) ? 'fresh' : 'cool';
        // Rough color name from hue
        let name;
        if (h < 15) name = 'red';
        else if (h < 40) name = 'orange';
        else if (h < 65) name = 'yellow';
        else if (h < 90) name = 'lime';
        else if (h < 150) name = 'green';
        else if (h < 180) name = 'teal';
        else if (h < 210) name = 'cyan';
        else if (h < 250) name = 'blue';
        else if (h < 280) name = 'indigo';
        else if (h < 310) name = 'purple';
        else if (h < 340) name = 'pink';
        else name = 'red';
        // Modifiers
        if (s < 20) name = 'grey';
        else if (s < 40) name = 'muted ' + name;
        if (l < 30) name = 'dark ' + name;
        else if (l > 70) name = 'light ' + name;
        return `a ${temp} ${name}`;
    },

    _describeMusicVolume(val) {
        const v = parseInt(val);
        if (v === 0) return 'silence';
        if (v < 20) return 'barely there';
        if (v < 40) return 'quiet background';
        if (v < 60) return 'moderate';
        if (v < 80) return 'fairly loud';
        return 'blasting';
    },

    _describeRoom(val) {
        const v = parseInt(val);
        if (v < 15) return 'minimal';
        if (v < 35) return 'cozy';
        if (v < 55) return 'balanced';
        if (v < 75) return 'spacious';
        return 'mansion-sized';
    },

    _describeSpirit(val) {
        const v = parseInt(val);
        if (v < 15) return 'pure materialist';
        if (v < 35) return 'mostly materialist';
        if (v < 55) return 'agnostic';
        if (v < 75) return 'leaning believer';
        return 'believer';
    },

    _describePrecision(val) {
        const v = parseInt(val);
        if (v === 50) return 'nailed it (50/50)';
        if (v >= 49 && v <= 51) return `close (${v}/50)`;
        return `off by ${Math.abs(v - 50)} (${v}/50)`;
    },

    _describeHold(val) {
        if (val === 'perfect') return 'perfect timing';
        if (val === 'close') return 'so close';
        if (val === 'decent') return 'not bad';
        // Numeric string like "10.42"
        const num = parseFloat(val);
        if (!isNaN(num)) return `${num}s`;
        return val;
    },

    _getArchetypeAndCompat() {
        const r = this.responses;
        // Replicate stat calculation from updateScore
        const stats = {};
        if (r.music !== undefined) stats.quietness = 100 - parseInt(r.music);
        let playfulness = 0, playCount = 0;
        if (r.upside) {
            playCount++;
            if (r.upside === 'love') playfulness += 100;
            else if (r.upside === 'fine') playfulness += 60;
            else playfulness += 20;
        }
        if (r.hold === 'completed') { playCount++; playfulness += 80; }
        if (playCount > 0) stats.playfulness = Math.round(playfulness / playCount);
        if (r.ai && r.ai.length > 0) stats['tech affinity'] = Math.min(100, (r.ai.length / 6) * 100);
        if (r.spirit !== undefined) stats.spirituality = parseInt(r.spirit);
        let emotional = 0, emotionalCount = 0;
        if (r.crying) {
            emotionalCount++;
            if (r.crying === 'cry' || r.crying === 'ask') emotional += 100;
            else if (r.crying === 'hug') emotional += 70;
            else emotional += 40;
        }
        if (r.message) {
            emotionalCount++;
            emotional += r.message === 'soft' ? 80 : 60;
        }
        if (emotionalCount > 0) stats['emotional openness'] = Math.round(emotional / emotionalCount);
        if (r.nature && r.nature.length > 0) {
            const adventureMap = { sea: 85, mountain: 90, river: 75, forest: 70, lake: 60 };
            stats.adventurousness = adventureMap[r.nature[0]] || 70;
        }
        // Compatibility
        let compatPoints = 0, compatMax = 0;
        if (r.music !== undefined) { compatMax += 10; if (r.music < 35) compatPoints += 10; else if (r.music < 55) compatPoints += 5; }
        if (r.upside === 'love') { compatMax += 10; compatPoints += 10; } else if (r.upside) { compatMax += 10; compatPoints += 5; }
        if (r.ai && r.ai.length >= 4) { compatMax += 10; compatPoints += 10; } else if (r.ai && r.ai.length > 0) { compatMax += 10; compatPoints += 5; }
        if (r.spirit !== undefined) { compatMax += 10; if (r.spirit >= 55) compatPoints += 10; else if (r.spirit >= 35) compatPoints += 5; }
        if (r.crying) { compatMax += 10; if (r.crying === 'cry' || r.crying === 'ask') compatPoints += 10; else if (r.crying === 'hug') compatPoints += 7; else compatPoints += 3; }
        if (compatMax === 0) return null;
        const percentage = Math.round((compatPoints / compatMax) * 100);
        const high = (stat) => (stats[stat] || 50) > 60;
        const low = (stat) => (stats[stat] || 50) < 40;
        let archetype;
        if (high('playfulness') && high('spirituality')) archetype = 'the fool';
        else if (high('tech affinity') && high('emotional openness')) archetype = 'the alchemist';
        else if (high('adventurousness') && high('playfulness')) archetype = 'the explorer';
        else if (high('quietness') && high('spirituality')) archetype = 'the hermit';
        else if (high('emotional openness') && high('adventurousness')) archetype = 'the lover';
        else if (high('tech affinity') && low('emotional openness')) archetype = 'the architect';
        else if (high('playfulness') && low('spirituality')) archetype = 'the trickster';
        else archetype = 'the magician';
        return { archetype, percentage };
    },

    generateSummary() {
        const r = this.responses;
        let lines = [];

        lines.push('\u2726 playground results \u2726\n');

        // Archetype + compatibility
        const card = this._getArchetypeAndCompat();
        if (card) {
            lines.push(`[ ${card.archetype} \u2014 ${card.percentage}% compatibility ]\n`);
        }

        // ---- the senses ----
        const senses = [];
        if (r.color) senses.push(`picked color: ${this._describeColor(r.color)}`);
        if (r.texture) senses.push(`texture: ${r.texture}`);
        if (r.music !== undefined) senses.push(`music when working: ${this._describeMusicVolume(r.music)} (${r.music}/100)`);
        if (r.nature) senses.push(`nature: ${r.nature.join(' > ')}`);
        if (r.body) {
            const bodyLabels = { forward: 'forward', tucked: 'tucked under', tilted: 'tilted to one side', back: 'pushed back', unsure: 'no idea' };
            senses.push(`pelvis: ${bodyLabels[r.body] || r.body}`);
        }
        if (r.toes) {
            const toeLabels = { yes: 'yes, easily', some: 'some of them', no: 'not really', trying: 'tried it right now' };
            senses.push(`toes: ${toeLabels[r.toes] || r.toes}`);
        }
        if (r.food && r.food.length > 0) senses.push(`food: ${r.food.join(', ')}`);
        if (senses.length > 0) {
            lines.push('\u2014\u2014 the senses \u2014\u2014');
            senses.forEach(l => lines.push(l));
            lines.push('');
        }

        // ---- the mind ----
        const mind = [];
        if (r.ai && r.ai.length > 0) mind.push(`AI knowledge: ${r.ai.join(', ')} (${r.ai.length}/6)`);
        if (r.readingWpm) {
            let readLine = `reading speed: ${r.readingWpm} wpm`;
            readLine += r.readingCorrect ? ' (got the question right)' : ' (got the question wrong though)';
            mind.push(readLine);
        }
        if (r.sequence) mind.push(`sequence puzzle: ${r.sequence}`);
        if (r.precision !== undefined) mind.push(`precision challenge: ${this._describePrecision(r.precision)}`);
        if (r.hold) mind.push(`hold at 10s: ${this._describeHold(r.hold)}`);
        if (r.shades) mind.push(`shade ordering: ${r.shades}`);
        if (r.neuro && r.neuro.length > 0) mind.push(`neuro: ${r.neuro.join(', ')}`);
        if (r.untangle) mind.push(`can this be untangled: ${r.untangle}`);
        if (mind.length > 0) {
            lines.push('\u2014\u2014 the mind \u2014\u2014');
            mind.forEach(l => lines.push(l));
            lines.push('');
        }

        // ---- the feels ----
        const feels = [];
        if (r.crying) {
            const cryLabels = { hug: 'goes to hug them', ask: 'asks what they need', space: 'gives them space', cry: 'also starts crying', depends: 'depends on who' };
            feels.push(`when someone cries: ${cryLabels[r.crying] || r.crying}`);
        }
        if (r.message) {
            feels.push(`message preference: ${r.message === 'soft' ? 'soft' : 'direct'}`);
        }
        if (r.upside) {
            const upsideLabels = { love: 'loves it', fine: 'it\'s fine', uncomfortable: 'uncomfortable', never: 'actively avoids it', when: 'can\'t even remember' };
            feels.push(`upside down: ${upsideLabels[r.upside] || r.upside}`);
        }
        if (r.spirit !== undefined) feels.push(`spirituality: ${this._describeSpirit(r.spirit)} (${r.spirit}/100)`);
        if (r.meta) {
            const metaLabels = { hate: 'hates it', loveHating: 'loves hating it', hateLove: 'hates loving it', dontStart: 'don\'t get them started' };
            feels.push(`going meta: ${metaLabels[r.meta] || r.meta}`);
        }
        if (r.god) feels.push(`calls it: "${r.god}"`);
        if (feels.length > 0) {
            lines.push('\u2014\u2014 the feels \u2014\u2014');
            feels.forEach(l => lines.push(l));
            lines.push('');
        }

        // ---- the vibes ----
        const vibes = [];
        if (r.lead) {
            const leadLabels = { lead: 'leads', follow: 'follows', both: 'depends on context', neither: 'figures it out together' };
            vibes.push(`lead or follow: ${leadLabels[r.lead] || r.lead}`);
        }
        if (r.room !== undefined) vibes.push(`living space: ${this._describeRoom(r.room)} (${r.room}/100)`);
        if (r.babies !== undefined) {
            const babyLabels = CONTENT.babies ? CONTENT.babies.labels : [];
            vibes.push(`babies: ${babyLabels[r.babies] || r.babies}`);
        }
        if (r.therapyHours) vibes.push(`therapy: ${r.therapyHours} hours`);
        if (r.embodiment) vibes.push(`learning physical things: ${r.embodiment}`);
        if (r.patterns) vibes.push(`meeting someone interesting: ${r.patterns}`);
        if (r.fun) {
            const funLabels = { yes: 'yes', 'kind-of': 'kind of', 'not-sure': 'not sure what this is', no: 'no' };
            vibes.push(`having fun: ${funLabels[r.fun] || r.fun}`);
        }
        if (vibes.length > 0) {
            lines.push('\u2014\u2014 the vibes \u2014\u2014');
            vibes.forEach(l => lines.push(l));
            lines.push('');
        }

        // ---- perfect day ----
        if (r.day) {
            const dayParts = [];
            const fmt = (arr) => Array.isArray(arr) ? arr.join(', ') : arr;
            ['morning', 'afternoon', 'evening', 'night'].forEach(phase => {
                const val = r.day[phase];
                if (val && (Array.isArray(val) ? val.length > 0 : true)) {
                    dayParts.push(`  ${phase}: ${fmt(val)}`);
                }
            });
            if (dayParts.length > 0) {
                lines.push('\u2014\u2014 a good day \u2014\u2014');
                dayParts.forEach(l => lines.push(l));
                lines.push('');
            }
        }

        // ---- in their own words ----
        const prompts = CONTENT.autocomplete ? CONTENT.autocomplete.prompts : [];
        const words = [];
        if (r['auto-1']) words.push(`"${prompts[0] || 'in the middle of the night I'} ${r['auto-1']}"`);
        if (r['auto-2']) words.push(`"${prompts[1] || 'pleasure is'} ${r['auto-2']}"`);
        if (r['auto-3']) words.push(`"${prompts[2] || 'all parts of me'} ${r['auto-3']}"`);
        if (r['auto-4']) words.push(`"${prompts[3] || 'the point of life is'} ${r['auto-4']}"`);
        if (r['auto-5']) words.push(`"${prompts[4] || 'I never leave the house without'} ${r['auto-5']}"`);
        if (words.length > 0) {
            lines.push('\u2014\u2014 in their own words \u2014\u2014');
            words.forEach(l => lines.push(l));
            lines.push('');
        }

        lines.push('\u2726');

        return lines.join('\n');
    },

    // ========== Populate Answer Sections ==========
    populateAnswerSections() {
        // Populate YOUR answers
        const yourAnswersContent = document.getElementById('your-answers-content');

        if (yourAnswersContent) {
            yourAnswersContent.innerHTML = '';
            const r = this.responses;

            const addSectionHeader = (title) => {
                const h = document.createElement('h4');
                h.className = 'answer-section-header';
                h.textContent = title;
                h.style.cssText = 'margin: 1.2em 0 0.4em; font-family: var(--font-display, "Cinzel Decorative", serif); font-size: 0.85em; letter-spacing: 0.08em; text-transform: lowercase; opacity: 0.7;';
                yourAnswersContent.appendChild(h);
            };

            const addAnswer = (label, value) => {
                if (value !== undefined && value !== null && value !== '') {
                    const div = document.createElement('div');
                    div.className = 'my-answer';
                    div.innerHTML = `<strong>${label}:</strong> ${value}`;
                    yourAnswersContent.appendChild(div);
                }
            };

            // Archetype + compatibility at top
            const card = this._getArchetypeAndCompat();
            if (card) {
                const cardDiv = document.createElement('div');
                cardDiv.className = 'my-answer';
                cardDiv.style.cssText = 'font-style: italic; margin-bottom: 0.8em;';
                cardDiv.innerHTML = `<strong>${card.archetype}</strong> \u2014 ${card.percentage}% compatibility`;
                yourAnswersContent.appendChild(cardDiv);
            }

            // ---- the senses ----
            const hasSenses = r.color || r.texture || r.music !== undefined || r.nature || r.body || r.toes || (r.food && r.food.length > 0);
            if (hasSenses) {
                addSectionHeader('the senses');
                if (r.color) {
                    const colorSwatch = `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:hsl(${r.color.h},${r.color.s}%,${r.color.l}%);vertical-align:middle;margin-right:4px;"></span>`;
                    addAnswer('color', `${colorSwatch} ${this._describeColor(r.color)}`);
                }
                if (r.texture) addAnswer('texture', r.texture);
                if (r.music !== undefined) addAnswer('music', `${this._describeMusicVolume(r.music)} (${r.music}/100)`);
                if (r.nature) addAnswer('nature', r.nature.join(' > '));
                if (r.body) {
                    const bodyLabels = { forward: 'forward', tucked: 'tucked under', tilted: 'tilted to one side', back: 'pushed back', unsure: 'no idea' };
                    addAnswer('pelvis', bodyLabels[r.body] || r.body);
                }
                if (r.toes) {
                    const toeLabels = { yes: 'yes, easily', some: 'some of them', no: 'not really', trying: 'tried it right now' };
                    addAnswer('toes', toeLabels[r.toes] || r.toes);
                }
                if (r.food && r.food.length > 0) addAnswer('food', r.food.join(', '));
            }

            // ---- the mind ----
            const hasMind = (r.ai && r.ai.length > 0) || r.readingWpm || r.sequence || r.precision !== undefined || r.hold || r.shades || (r.neuro && r.neuro.length > 0) || r.untangle;
            if (hasMind) {
                addSectionHeader('the mind');
                if (r.ai && r.ai.length > 0) addAnswer('AI', `${r.ai.join(', ')} (${r.ai.length}/6)`);
                if (r.readingWpm) {
                    const readResult = r.readingCorrect ? 'correct' : 'wrong answer';
                    addAnswer('reading speed', `${r.readingWpm} wpm (${readResult})`);
                }
                if (r.sequence) addAnswer('sequence puzzle', r.sequence);
                if (r.precision !== undefined) addAnswer('precision', this._describePrecision(r.precision));
                if (r.hold) addAnswer('hold at 10s', this._describeHold(r.hold));
                if (r.shades) addAnswer('shade ordering', r.shades);
                if (r.neuro && r.neuro.length > 0) addAnswer('neuro', r.neuro.join(', '));
                if (r.untangle) addAnswer('untangle', r.untangle);
            }

            // ---- the feels ----
            const hasFeels = r.crying || r.message || r.upside || r.spirit !== undefined || r.meta || r.god;
            if (hasFeels) {
                addSectionHeader('the feels');
                if (r.crying) {
                    const cryLabels = { hug: 'goes to hug them', ask: 'asks what they need', space: 'gives them space', cry: 'also starts crying', depends: 'depends on who' };
                    addAnswer('when someone cries', cryLabels[r.crying] || r.crying);
                }
                if (r.message) addAnswer('message preference', r.message === 'soft' ? 'soft' : 'direct');
                if (r.upside) {
                    const upsideLabels = { love: 'loves it', fine: 'it\'s fine', uncomfortable: 'uncomfortable', never: 'actively avoids it', when: 'can\'t even remember' };
                    addAnswer('upside down', upsideLabels[r.upside] || r.upside);
                }
                if (r.spirit !== undefined) addAnswer('spirituality', `${this._describeSpirit(r.spirit)} (${r.spirit}/100)`);
                if (r.meta) {
                    const metaLabels = { hate: 'hates it', loveHating: 'loves hating it', hateLove: 'hates loving it', dontStart: 'don\'t get them started' };
                    addAnswer('going meta', metaLabels[r.meta] || r.meta);
                }
                if (r.god) addAnswer('calls it', `"${r.god}"`);
            }

            // ---- the vibes ----
            const hasVibes = r.lead || r.room !== undefined || r.babies !== undefined || r.therapyHours || r.embodiment || r.patterns || r.fun;
            if (hasVibes) {
                addSectionHeader('the vibes');
                if (r.lead) {
                    const leadLabels = { lead: 'leads', follow: 'follows', both: 'depends on context', neither: 'figures it out together' };
                    addAnswer('lead or follow', leadLabels[r.lead] || r.lead);
                }
                if (r.room !== undefined) addAnswer('living space', `${this._describeRoom(r.room)} (${r.room}/100)`);
                if (r.babies !== undefined) {
                    const babyLabels = CONTENT.babies ? CONTENT.babies.labels : [];
                    addAnswer('babies', babyLabels[r.babies] || r.babies);
                }
                if (r.therapyHours) addAnswer('therapy', `${r.therapyHours} hours`);
                if (r.embodiment) addAnswer('learning physical things', r.embodiment);
                if (r.patterns) addAnswer('meeting someone interesting', r.patterns);
                if (r.fun) {
                    const funLabels = { yes: 'yes', 'kind-of': 'kind of', 'not-sure': 'not sure what this is', no: 'no' };
                    addAnswer('having fun', funLabels[r.fun] || r.fun);
                }
            }

            // ---- a good day ----
            if (r.day) {
                const fmt = (arr) => Array.isArray(arr) ? arr.join(', ') : arr;
                const phases = ['morning', 'afternoon', 'evening', 'night'];
                const hasDay = phases.some(p => r.day[p] && (Array.isArray(r.day[p]) ? r.day[p].length > 0 : true));
                if (hasDay) {
                    addSectionHeader('a good day');
                    phases.forEach(phase => {
                        const val = r.day[phase];
                        if (val && (Array.isArray(val) ? val.length > 0 : true)) {
                            addAnswer(phase, fmt(val));
                        }
                    });
                }
            }

            // ---- in their own words ----
            const hasAuto = r['auto-1'] || r['auto-2'] || r['auto-3'] || r['auto-4'] || r['auto-5'];
            if (hasAuto) {
                addSectionHeader('in their own words');
                const addQuote = (text) => {
                    const div = document.createElement('div');
                    div.className = 'my-answer';
                    div.innerHTML = `<em>"${text}"</em>`;
                    yourAnswersContent.appendChild(div);
                };
                if (r['auto-1']) addQuote(`in the middle of the night I ${r['auto-1']}`);
                if (r['auto-2']) addQuote(`pleasure is ${r['auto-2']}`);
                if (r['auto-3']) addQuote(`all parts of me ${r['auto-3']}`);
                if (r['auto-4']) addQuote(`the point of life is ${r['auto-4']}`);
                if (r['auto-5']) addQuote(`I never leave the house without ${r['auto-5']}`);
            }

            if (yourAnswersContent.children.length === 0) {
                yourAnswersContent.innerHTML = '<p style="opacity: 0.6; font-style: italic;">answer some things first</p>';
            }
        }

        // Populate LINDA'S answers
        const lindaAnswersContent = document.getElementById('linda-answers-content');
        if (lindaAnswersContent && CONTENT.myAnswers) {
            lindaAnswersContent.innerHTML = '';
            const m = CONTENT.myAnswers;

            const addAnswer = (label, value) => {
                const div = document.createElement('div');
                div.className = 'my-answer';
                div.innerHTML = `<strong>${label}:</strong> ${value}`;
                lindaAnswersContent.appendChild(div);
            };

            if (m.color) addAnswer('color', m.color);
            if (m.body) addAnswer('pelvis', m.body);
            if (m.texture) addAnswer('texture', m.texture);
            if (m.toes) addAnswer('toes', m.toes);
            if (m.music) addAnswer('music', m.music);
            if (m.nature) addAnswer('nature', m.nature);
            if (m.upside) addAnswer('upside down', m.upside);
            if (m.ai) addAnswer('AI', m.ai);
            if (m.room) addAnswer('living space', m.room);
            if (m.crying) addAnswer('crying scenario', m.crying);
            if (m.spirit) addAnswer('spirituality', m.spirit);
            if (m.lead) addAnswer('lead/follow', m.lead);
            if (m.therapy) addAnswer('therapy', m.therapy);
            if (m.god) addAnswer('god/source', m.god);
            if (m.food) addAnswer('food', m.food);
            if (m.babies) addAnswer('babies', m.babies);
            if (m.untangle) addAnswer('can this be untangled', m.untangle);
            if (m.autocomplete && m.autocomplete.length > 0) {
                m.autocomplete.forEach((answer, i) => {
                    const prompts = [
                        'in the middle of the night I',
                        'pleasure is',
                        'all parts of me',
                        'the point of life is',
                        'I never leave the house without'
                    ];
                    if (prompts[i]) addAnswer(prompts[i], answer);
                });
            }
        }
    },

    // ========== URL-Encoded Results Sharing ==========
    _encodeResponses() {
        try {
            const json = JSON.stringify(this.responses);
            // Use btoa for base64, make it URL-safe
            const base64 = btoa(unescape(encodeURIComponent(json)));
            return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        } catch (e) {
            console.log('Could not encode responses:', e);
            return null;
        }
    },

    _decodeResponses(encoded) {
        try {
            // Restore standard base64 from URL-safe version
            let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
            // Add padding back
            while (base64.length % 4) base64 += '=';
            const json = decodeURIComponent(escape(atob(base64)));
            return JSON.parse(json);
        } catch (e) {
            console.log('Could not decode responses:', e);
            return null;
        }
    },

    _checkSharedUrl() {
        const params = new URLSearchParams(window.location.search);
        const encoded = params.get('r');
        if (!encoded) return null;
        return this._decodeResponses(encoded);
    },

    _getResultsUrl() {
        const encoded = this._encodeResponses();
        if (!encoded) return null;
        return window.location.origin + window.location.pathname + '?r=' + encoded;
    },

    _showViewingMode() {
        const banner = document.getElementById('viewing-banner');
        if (banner) {
            banner.style.display = 'block';
            // Set play yourself link to clean URL
            const playBtn = banner.querySelector('.viewing-play-btn');
            if (playBtn) {
                playBtn.href = window.location.origin + window.location.pathname;
            }
        }
    },

    // ========== Share Link Button ==========
    initShareLink() {
        const btn = document.getElementById('share-link-btn');
        const responseDiv = document.getElementById('share-link-response');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const url = this._getResultsUrl();
            if (!url) {
                if (responseDiv) responseDiv.textContent = 'answer some things first';
                return;
            }
            navigator.clipboard.writeText(url).then(() => {
                if (responseDiv) responseDiv.textContent = 'link copied!';
                btn.textContent = 'copied!';
                setTimeout(() => { btn.textContent = 'copy share link'; }, 2000);
            }).catch(() => {
                // Fallback
                const ta = document.createElement('textarea');
                ta.value = url;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                if (responseDiv) responseDiv.textContent = 'link copied!';
            });
        });
    },

    // ========== Visual Results Card (Canvas) ==========
    initResultsCard() {
        const saveBtn = document.getElementById('save-card-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const canvas = document.getElementById('results-card-canvas');
                if (!canvas) return;
                const link = document.createElement('a');
                link.download = 'playground-results.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }
        this.renderResultsCard();
    },

    // Count meaningful answers (excludes empty day object and similar non-answers)
    _countMeaningfulAnswers() {
        const r = this.responses;
        let count = 0;
        for (const key of Object.keys(r)) {
            if (key === 'day') {
                // Day only counts if at least one phase has items
                const d = r.day;
                if (d && ['morning', 'afternoon', 'evening', 'night'].some(
                    p => Array.isArray(d[p]) && d[p].length > 0
                )) count++;
            } else {
                count++;
            }
        }
        return count;
    },

    renderResultsCard() {
        const canvas = document.getElementById('results-card-canvas');
        if (!canvas) return;

        const section = document.getElementById('results-card-section');
        const card = this._getArchetypeAndCompat();
        const meaningfulCount = this._countMeaningfulAnswers();

        if (meaningfulCount < 3) {
            if (section) section.style.display = 'none';
            return;
        }
        if (section) section.style.display = '';
        canvas.style.display = 'block';

        const r = this.responses;

        // Pre-calculate answers to determine card height
        const preAnswers = [];
        if (r.texture) preAnswers.push(1);
        if (r.nature) preAnswers.push(1);
        if (r.babies !== undefined) preAnswers.push(1);
        if (r.music !== undefined) preAnswers.push(1);
        if (r.spirit !== undefined) preAnswers.push(1);
        if (r.crying) preAnswers.push(1);
        if (r.god) preAnswers.push(1);
        if (r.lead) preAnswers.push(1);
        if (r.therapyHours) preAnswers.push(1);
        if (r.upside) preAnswers.push(1);
        const answerRows = Math.ceil(preAnswers.length / 2);
        const preAutoAnswers = [r['auto-1'], r['auto-2'], r['auto-4']].filter(Boolean).length;
        const statsCount = Object.keys(this._calculateStats()).length;

        // Calculate dynamic height: base sections + stats + answers + auto-answers + footer
        let estimatedH = 60 + 35 + 28 + 30; // top through archetype
        if (r.color) estimatedH += 20;
        estimatedH += 30; // divider
        if (statsCount > 0) estimatedH += 18 + statsCount * 28; // stats header + bars
        estimatedH += 25; // divider
        estimatedH += 18 + answerRows * 36; // key answers header + rows
        estimatedH += 15; // gap
        if (preAutoAnswers > 0) estimatedH += 16 + 15 + preAutoAnswers * 20; // auto-answers section
        estimatedH += 60; // footer watermark

        // Handle devicePixelRatio for crisp text
        const dpr = window.devicePixelRatio || 1;
        const W = 600;
        const H = Math.max(600, estimatedH);

        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';

        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        // Polyfill roundRect for older browsers
        if (!ctx.roundRect) {
            ctx.roundRect = function(x, y, w, h, r) {
                if (typeof r === 'number') r = [r, r, r, r];
                this.beginPath();
                this.moveTo(x + r[0], y);
                this.lineTo(x + w - r[1], y);
                this.quadraticCurveTo(x + w, y, x + w, y + r[1]);
                this.lineTo(x + w, y + h - r[2]);
                this.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h);
                this.lineTo(x + r[3], y + h);
                this.quadraticCurveTo(x, y + h, x, y + h - r[3]);
                this.lineTo(x, y + r[0]);
                this.quadraticCurveTo(x, y, x + r[0], y);
                this.closePath();
            };
        }

        // Colors
        const cream = '#FAF7F5';
        const petrol = '#2D6A6A';
        const petrolLight = '#4A8B8B';
        const burgundy = '#8B4A5E';
        const rosaLight = '#E0D0D0';
        const textColor = '#2D2D2D';
        const textLight = '#5A5A5A';

        // Fonts (with fallbacks for canvas)
        const fontDisplay = '"Playfair Display", Georgia, serif';
        const fontMono = '"JetBrains Mono", "Courier New", monospace';
        const fontBody = '"Playfair Display", Georgia, serif';

        // Background
        ctx.fillStyle = cream;
        ctx.fillRect(0, 0, W, H);

        // Subtle border
        ctx.strokeStyle = rosaLight;
        ctx.lineWidth = 2;
        ctx.roundRect(4, 4, W - 8, H - 8, 16);
        ctx.stroke();

        // Top accent line
        ctx.fillStyle = petrol;
        ctx.fillRect(30, 30, W - 60, 3);

        let y = 60;

        // Title
        ctx.fillStyle = petrol;
        ctx.font = `11px ${fontMono}`;
        ctx.textAlign = 'left';
        ctx.fillText('PLAYGROUND RESULTS', 30, y);

        // Archetype + compatibility
        y += 35;
        if (card) {
            ctx.fillStyle = textColor;
            ctx.font = `italic 32px ${fontDisplay}`;
            ctx.fillText(card.archetype, 30, y);

            ctx.fillStyle = burgundy;
            ctx.font = `16px ${fontBody}`;
            y += 28;
            ctx.fillText(`${card.percentage}% compatibility with linda`, 30, y);
        } else {
            ctx.fillStyle = textLight;
            ctx.font = `italic 20px ${fontBody}`;
            ctx.fillText('in progress...', 30, y);
        }

        // Color swatch
        y += 30;
        if (r.color) {
            const { h, s, l } = r.color;
            const colorStr = `hsl(${h}, ${s}%, ${l}%)`;
            ctx.fillStyle = colorStr;
            ctx.beginPath();
            ctx.arc(50, y, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = rosaLight;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = textColor;
            ctx.font = `13px ${fontBody}`;
            ctx.fillText(this._describeColor(r.color), 75, y + 5);
            y += 20;
        }

        // Divider
        y += 10;
        ctx.fillStyle = rosaLight;
        ctx.fillRect(30, y, W - 60, 1);
        y += 20;

        // Stat bars
        const stats = this._calculateStats();
        if (Object.keys(stats).length > 0) {
            ctx.fillStyle = petrol;
            ctx.font = `11px ${fontMono}`;
            ctx.fillText('STATS', 30, y);
            y += 18;

            const barX = 170;
            const barW = 340;
            const barH = 16;

            Object.entries(stats).forEach(([label, value]) => {
                // Label
                ctx.fillStyle = textColor;
                ctx.font = `12px ${fontMono}`;
                ctx.textAlign = 'right';
                ctx.fillText(label, barX - 12, y + 12);

                // Bar background
                ctx.fillStyle = rosaLight;
                ctx.beginPath();
                ctx.roundRect(barX, y, barW, barH, 8);
                ctx.fill();

                // Bar fill
                const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
                grad.addColorStop(0, petrol);
                grad.addColorStop(1, burgundy);
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.roundRect(barX, y, barW * (value / 100), barH, 8);
                ctx.fill();

                // Value (right-aligned for consistent number alignment)
                ctx.fillStyle = textLight;
                ctx.font = `10px ${fontMono}`;
                ctx.textAlign = 'right';
                ctx.fillText(Math.round(value), barX + barW + 32, y + 12);

                y += 28;
            });
        }

        // Divider
        y += 5;
        ctx.fillStyle = rosaLight;
        ctx.fillRect(30, y, W - 60, 1);
        y += 20;

        // Key answers section
        ctx.textAlign = 'left';
        ctx.fillStyle = petrol;
        ctx.font = `11px ${fontMono}`;
        ctx.fillText('KEY ANSWERS', 30, y);
        y += 18;

        const answers = [];
        if (r.texture) answers.push(['texture', r.texture]);
        if (r.nature) answers.push(['nature', r.nature.join(' > ')]);
        if (r.babies !== undefined) {
            const babyLabels = CONTENT.babies ? CONTENT.babies.labels : [];
            answers.push(['babies', babyLabels[r.babies] || String(r.babies)]);
        }
        if (r.music !== undefined) answers.push(['music', `${this._describeMusicVolume(r.music)} (${r.music}/100)`]);
        if (r.spirit !== undefined) answers.push(['spirituality', `${this._describeSpirit(r.spirit)} (${r.spirit}/100)`]);
        if (r.crying) {
            const cryLabels = { hug: 'goes to hug them', ask: 'asks what they need', space: 'gives them space', cry: 'also starts crying', depends: 'depends on who' };
            answers.push(['when someone cries', cryLabels[r.crying] || r.crying]);
        }
        if (r.god) answers.push(['calls it', `"${r.god}"`]);
        if (r.lead) {
            const leadLabels = { lead: 'leads', follow: 'follows', both: 'context-dependent', neither: 'collaborative' };
            answers.push(['lead/follow', leadLabels[r.lead] || r.lead]);
        }
        if (r.therapyHours) answers.push(['therapy', `${r.therapyHours} hours`]);
        if (r.upside) {
            const upsideLabels = { love: 'loves it', fine: 'fine', uncomfortable: 'uncomfortable', never: 'avoids it', when: 'can\'t remember' };
            answers.push(['upside down', upsideLabels[r.upside] || r.upside]);
        }

        // Render answers in two columns
        const colW = (W - 60) / 2;
        const startY = y;
        let col = 0;
        let maxY = y;

        answers.forEach((pair, i) => {
            const [label, value] = pair;
            col = i % 2;
            const cx = 30 + col * colW;
            const cy = startY + Math.floor(i / 2) * 36;

            ctx.fillStyle = textLight;
            ctx.font = `11px ${fontMono}`;
            ctx.fillText(label + ':', cx, cy);

            ctx.fillStyle = textColor;
            ctx.font = `12px ${fontBody}`;
            // Truncate if too long
            let displayVal = value;
            ctx.font = `12px ${fontBody}`;
            while (ctx.measureText(displayVal).width > colW - 10 && displayVal.length > 10) {
                displayVal = displayVal.slice(0, -4) + '...';
            }
            ctx.fillText(displayVal, cx, cy + 15);

            maxY = cy + 36;
        });

        y = maxY + 15;

        // Autocomplete answers
        const autoAnswers = [];
        if (r['auto-1']) autoAnswers.push(`"in the middle of the night I ${r['auto-1']}"`);
        if (r['auto-2']) autoAnswers.push(`"pleasure is ${r['auto-2']}"`);
        if (r['auto-4']) autoAnswers.push(`"the point of life is ${r['auto-4']}"`);

        if (autoAnswers.length > 0 && y < H - 80) {
            ctx.fillStyle = rosaLight;
            ctx.fillRect(30, y, W - 60, 1);
            y += 15;

            ctx.fillStyle = petrol;
            ctx.font = `11px ${fontMono}`;
            ctx.fillText('IN THEIR OWN WORDS', 30, y);
            y += 16;

            ctx.fillStyle = textColor;
            ctx.font = `italic 12px ${fontBody}`;
            autoAnswers.forEach(line => {
                if (y < H - 60) {
                    // Truncate if needed
                    let display = line;
                    while (ctx.measureText(display).width > W - 70 && display.length > 15) {
                        display = display.slice(0, -4) + '..."';
                    }
                    ctx.fillText(display, 30, y);
                    y += 20;
                }
            });
        }

        // Bottom watermark
        ctx.fillStyle = rosaLight;
        ctx.fillRect(30, H - 45, W - 60, 1);

        ctx.fillStyle = textLight;
        ctx.font = `10px ${fontMono}`;
        ctx.textAlign = 'center';
        ctx.fillText('lindapetrini.com/dateme', W / 2, H - 22);

        // Petrol accent line at bottom
        ctx.fillStyle = petrol;
        ctx.fillRect(30, H - 33, W - 60, 2);
    },

    // Helper to calculate stats (shared between updateScore and renderResultsCard)
    _calculateStats() {
        const r = this.responses;
        const stats = {};

        if (r.music !== undefined) stats.quietness = 100 - parseInt(r.music);

        let playfulness = 0, playCount = 0;
        if (r.upside) {
            playCount++;
            if (r.upside === 'love') playfulness += 100;
            else if (r.upside === 'fine') playfulness += 60;
            else playfulness += 20;
        }
        if (r.hold === 'completed') { playCount++; playfulness += 80; }
        if (playCount > 0) stats.playfulness = Math.round(playfulness / playCount);

        if (r.ai && r.ai.length > 0) stats['tech affinity'] = Math.min(100, (r.ai.length / 6) * 100);
        if (r.spirit !== undefined) stats.spirituality = parseInt(r.spirit);

        let emotional = 0, emotionalCount = 0;
        if (r.crying) {
            emotionalCount++;
            if (r.crying === 'cry' || r.crying === 'ask') emotional += 100;
            else if (r.crying === 'hug') emotional += 70;
            else emotional += 40;
        }
        if (r.message) {
            emotionalCount++;
            emotional += r.message === 'soft' ? 80 : 60;
        }
        if (emotionalCount > 0) stats['emotional openness'] = Math.round(emotional / emotionalCount);

        if (r.nature && r.nature.length > 0) {
            const adventureMap = { sea: 85, mountain: 90, river: 75, forest: 70, lake: 60 };
            stats.adventurousness = adventureMap[r.nature[0]] || 70;
        }

        return stats;
    },

    // ========== Storage ==========
    saveResponses() {
        if (this.viewingMode) return; // Don't save when viewing someone else's results
        try {
            localStorage.setItem('playground_responses', JSON.stringify(this.responses));
            this.populateAnswerSections(); // Update answer sections when saved
            this.updateScore(); // Update character card when answers change
            this.renderResultsCard(); // Update visual results card
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

// Render results card after everything has settled (window.onload fires after all resources)
window.addEventListener('load', () => Playground.renderResultsCard());

window.Playground = Playground;
