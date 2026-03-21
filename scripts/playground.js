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
        this.initDay();
        this.initEmbodiment();
        this.initPatterns();
        this.initBabies();
        this.initUntangle();
        this.initShare();
        this.populateAnswerSections();
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

    // ========== Toy 28: Assemble a Day (Draggable) ==========
    initDay() {
        const activityList = document.getElementById('activity-list');
        const newActivityInput = document.getElementById('new-activity-input');
        const addActivityBtn = document.getElementById('add-activity-btn');
        const response = document.getElementById('day-response');
        const C = CONTENT.day;

        if (!C || !activityList) return;

        // Initialize responses storage
        if (!this.responses.day) {
            this.responses.day = {
                morning: null,
                afternoon: null,
                evening: null,
                night: null,
                customActivities: []
            };
        } else {
            // Ensure customActivities exists for old saves
            if (!this.responses.day.customActivities) {
                this.responses.day.customActivities = [];
            }
        }

        let draggedElement = null;

        // Render initial activities
        const renderActivities = () => {
            activityList.innerHTML = '';
            const allActivities = [...C.activities, ...(this.responses.day.customActivities || [])];

            allActivities.forEach((activity, index) => {
                const isCustom = index >= C.activities.length;
                const item = document.createElement('div');
                item.className = 'activity-item' + (isCustom ? ' custom' : '');
                item.draggable = true;
                item.textContent = activity;
                item.dataset.activity = activity;

                // Add remove button for custom activities
                if (isCustom) {
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'remove-activity';
                    removeBtn.textContent = '×';
                    removeBtn.onclick = (e) => {
                        e.stopPropagation();
                        this.responses.day.customActivities = this.responses.day.customActivities.filter(a => a !== activity);
                        this.saveResponses();
                        renderActivities();
                    };
                    item.appendChild(removeBtn);
                }

                // Drag events
                item.addEventListener('dragstart', (e) => {
                    draggedElement = item;
                    item.classList.add('dragging');
                });

                item.addEventListener('dragend', () => {
                    item.classList.remove('dragging');
                    draggedElement = null;
                });

                activityList.appendChild(item);
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

        // Setup drop zones
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

                if (draggedElement) {
                    const phase = zone.dataset.phase;
                    const activity = draggedElement.dataset.activity;

                    // Clear existing activity in this slot
                    zone.innerHTML = '';

                    // Create non-draggable copy for the slot
                    const slotItem = document.createElement('div');
                    slotItem.className = 'activity-item';
                    slotItem.textContent = activity;
                    zone.appendChild(slotItem);

                    zone.classList.add('filled');

                    // Save
                    this.responses.day[phase] = activity;
                    this.saveResponses();

                    // Check if all slots filled
                    const allFilled = ['morning', 'afternoon', 'evening', 'night'].every(
                        p => this.responses.day[p]
                    );
                    if (allFilled) {
                        response.textContent = C.response;
                    }
                }
            });
        });

        // Initial render
        renderActivities();

        // Touch support for dragging activities to drop zones
        this.addTouchDragToDropZones(activityList, '.activity-item', dropZones, (zone, item) => {
            const phase = zone.dataset.phase;
            const activity = item.dataset.activity;

            zone.innerHTML = '';
            const slotItem = document.createElement('div');
            slotItem.className = 'activity-item';
            slotItem.textContent = activity;
            zone.appendChild(slotItem);
            zone.classList.add('filled');

            this.responses.day[phase] = activity;
            this.saveResponses();

            const allFilled = ['morning', 'afternoon', 'evening', 'night'].every(
                p => this.responses.day[p]
            );
            if (allFilled) {
                response.textContent = C.response;
            }
        });

        // Restore saved state
        if (this.responses.day) {
            ['morning', 'afternoon', 'evening', 'night'].forEach(phase => {
                const activity = this.responses.day[phase];
                if (activity) {
                    const zone = document.querySelector(`.time-drop-zone[data-phase="${phase}"]`);
                    if (zone) {
                        const slotItem = document.createElement('div');
                        slotItem.className = 'activity-item';
                        slotItem.textContent = activity;
                        zone.appendChild(slotItem);
                        zone.classList.add('filled');
                    }
                }
            });

            const allFilled = ['morning', 'afternoon', 'evening', 'night'].every(
                p => this.responses.day[p]
            );
            if (allFilled) {
                response.textContent = C.response;
            }
        }
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

        if (typeof THREE === 'undefined') return;

        // Setup Three.js scene — small 180x180 canvas
        const width = 180;
        const height = 180;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
        camera.position.z = 4.2;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        wrap.appendChild(renderer.domElement);

        // Create complex torus knot — high p,q for visual intricacy
        const geometry = new THREE.TorusKnotGeometry(1.4, 0.35, 300, 32, 11, 7);
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

        // Button click handlers
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
            const body = `Email: ${email}\n\nMessage:\n${message}\n\n=== Answers ===\n${answers}`;

            window.location.href = `mailto:linda.petrini@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

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

        // Calculate compatibility label
        if (compatMax === 0) {
            scoreValue.textContent = "--";
            scoreNote.textContent = "answer some things to see your character card";
        } else {
            const percentage = Math.round((compatPoints / compatMax) * 100);
            let label;
            if (percentage >= 85) label = "intriguing";
            else if (percentage >= 70) label = "promising";
            else if (percentage >= 50) label = "curious";
            else if (percentage >= 30) label = "different";
            else label = "wildcard";

            scoreValue.textContent = label;
            scoreNote.textContent = `${percentage}% compatibility with linda`;
        }

        // Draw the image/pattern in canvas
        if (scoreCanvas && r.color) {
            const ctx = scoreCanvas.getContext('2d');
            const size = 120;
            scoreCanvas.width = size;
            scoreCanvas.height = size;

            const { h, s, l } = r.color;
            const color = `hsl(${h}, ${s}%, ${l}%)`;

            // Use the selected image pattern or color-based pattern
            if (r.image !== undefined) {
                // Redraw the selected pattern
                if (r.image === 0) this.drawSpirals(scoreCanvas);
                else if (r.image === 1) this.drawFlowField(scoreCanvas);
                else if (r.image === 2) this.drawOrganicBlobs(scoreCanvas);
            } else {
                // Draw a color-based pattern
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, size, size);
                ctx.globalAlpha = 0.5;
                for (let i = 0; i < 5; i++) {
                    ctx.beginPath();
                    ctx.arc(
                        Math.random() * size,
                        Math.random() * size,
                        Math.random() * 40 + 10,
                        0,
                        Math.PI * 2
                    );
                    ctx.fillStyle = `hsl(${h}, ${Math.max(0, s - 20)}%, ${Math.min(100, l + 10)}%)`;
                    ctx.fill();
                }
            }
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

        if (r.therapyHours) {
            lines.push(`therapy: ${r.therapyHours} hours`);
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

        if (r.untangle) {
            lines.push(`can this be untangled: ${r.untangle}`);
        }

        if (r.babies !== undefined) {
            const babyLabels = CONTENT.babies ? CONTENT.babies.labels : [];
            lines.push(`babies: ${babyLabels[r.babies] || r.babies}`);
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

    // ========== Populate Answer Sections ==========
    populateAnswerSections() {
        // Populate YOUR answers
        const yourAnswersContent = document.getElementById('your-answers-content');

        if (yourAnswersContent) {
            yourAnswersContent.innerHTML = '';
            const r = this.responses;

            const addAnswer = (label, value) => {
                if (value !== undefined && value !== null && value !== '') {
                    const div = document.createElement('div');
                    div.className = 'my-answer';
                    div.innerHTML = `<strong>${label}:</strong> ${value}`;
                    yourAnswersContent.appendChild(div);
                }
            };

            // Format responses
            if (r.color) {
                addAnswer('color', `hsl(${r.color.h}, ${r.color.s}%, ${r.color.l}%)`);
            }
            if (r.body) addAnswer('pelvis', r.body);
            if (r.texture) addAnswer('texture', r.texture);
            if (r.toes) addAnswer('toes', r.toes);
            if (r.music !== undefined) addAnswer('music', `${r.music}/100`);
            if (r.nature) addAnswer('nature', r.nature.join(' > '));
            if (r.upside) addAnswer('upside down', r.upside);
            if (r.ai) addAnswer('AI', r.ai.join(', '));
            if (r.room !== undefined) addAnswer('living space', `${r.room}/100`);
            if (r.crying) addAnswer('crying scenario', r.crying);
            if (r.spirit !== undefined) addAnswer('spirituality', `${r.spirit}/100`);
            if (r.lead) addAnswer('lead/follow', r.lead);
            if (r.therapyHours) addAnswer('therapy hours', r.therapyHours);
            if (r.god) addAnswer('god/source', r.god);
            if (r.food) addAnswer('food', r.food.join(', '));
            if (r.message) addAnswer('message preference', r.message);
            if (r.precision !== undefined) addAnswer('precision', `${r.precision}/100`);
            if (r.hold) addAnswer('hold button', r.hold);
            if (r.fun) addAnswer('having fun', r.fun);
            if (r.meta) addAnswer('going meta', r.meta);
            if (r.embodiment) addAnswer('learning physical things', r.embodiment);
            if (r.patterns) addAnswer('meeting someone interesting', r.patterns);
            if (r.untangle) addAnswer('can this be untangled', r.untangle);
            if (r.babies !== undefined) {
                const babyLabels = CONTENT.babies ? CONTENT.babies.labels : [];
                addAnswer('babies', babyLabels[r.babies] || r.babies);
            }
            if (r.day && r.day.morning) {
                const dayParts = [];
                if (r.day.morning) dayParts.push(`morning: ${r.day.morning}`);
                if (r.day.afternoon) dayParts.push(`afternoon: ${r.day.afternoon}`);
                if (r.day.evening) dayParts.push(`evening: ${r.day.evening}`);
                if (r.day.night) dayParts.push(`night: ${r.day.night}`);
                if (dayParts.length > 0) addAnswer('perfect day', dayParts.join(' | '));
            }

            // Autocomplete answers
            if (r['auto-1']) addAnswer('in the middle of the night I', r['auto-1']);
            if (r['auto-2']) addAnswer('pleasure is', r['auto-2']);
            if (r['auto-3']) addAnswer('all parts of me', r['auto-3']);
            if (r['auto-4']) addAnswer('the point of life is', r['auto-4']);
            if (r['auto-5']) addAnswer('I never leave the house without', r['auto-5']);

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

    // ========== Storage ==========
    saveResponses() {
        try {
            localStorage.setItem('playground_responses', JSON.stringify(this.responses));
            this.populateAnswerSections(); // Update answer sections when saved
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
