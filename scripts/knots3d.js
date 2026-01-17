/**
 * 3D Knot Rendering with Three.js
 * Creates realistic tube-based mathematical knots
 */

const Knots3D = {
    // Store renderers to clean up later
    renderers: [],
    animationFrames: [],

    // Warm earth tone colors matching CSS palette
    colors: {
        primary: 0xC17F59,      // terracotta
        secondary: 0xA66B47,    // terracotta dark
        accent: 0x8B5A2B,       // brown
        light: 0xE8DFD5,        // sand
        dark: 0x5D3A1A,         // brown dark
        sage: 0x87A878          // sage green
    },

    /**
     * Generate points for a trefoil knot
     * Parametric: (sin(t) + 2*sin(2t), cos(t) - 2*cos(2t), -sin(3t))
     */
    trefoilPoints(segments = 100, scale = 1, rotation = { x: 0, y: 0, z: 0 }) {
        const points = [];
        for (let i = 0; i <= segments; i++) {
            const t = (i / segments) * Math.PI * 2;
            let x = (Math.sin(t) + 2 * Math.sin(2 * t)) * scale;
            let y = (Math.cos(t) - 2 * Math.cos(2 * t)) * scale;
            let z = -Math.sin(3 * t) * scale;

            // Apply rotation
            const point = this.rotatePoint({ x, y, z }, rotation);
            points.push(new THREE.Vector3(point.x, point.y, point.z));
        }
        return points;
    },

    /**
     * Generate points for a figure-eight knot
     * Parametric: (2 + cos(2t)) * cos(3t), (2 + cos(2t)) * sin(3t), sin(4t)
     */
    figureEightPoints(segments = 100, scale = 1, rotation = { x: 0, y: 0, z: 0 }) {
        const points = [];
        for (let i = 0; i <= segments; i++) {
            const t = (i / segments) * Math.PI * 2;
            let x = (2 + Math.cos(2 * t)) * Math.cos(3 * t) * scale * 0.4;
            let y = (2 + Math.cos(2 * t)) * Math.sin(3 * t) * scale * 0.4;
            let z = Math.sin(4 * t) * scale * 0.6;

            const point = this.rotatePoint({ x, y, z }, rotation);
            points.push(new THREE.Vector3(point.x, point.y, point.z));
        }
        return points;
    },

    /**
     * Generate points for a cinquefoil (5,2) torus knot
     */
    cinquefoilPoints(segments = 100, scale = 1, rotation = { x: 0, y: 0, z: 0 }) {
        const points = [];
        const p = 5, q = 2;
        for (let i = 0; i <= segments; i++) {
            const t = (i / segments) * Math.PI * 2;
            const r = Math.cos(q * t) + 2;
            let x = r * Math.cos(p * t) * scale * 0.35;
            let y = r * Math.sin(p * t) * scale * 0.35;
            let z = -Math.sin(q * t) * scale * 0.6;

            const point = this.rotatePoint({ x, y, z }, rotation);
            points.push(new THREE.Vector3(point.x, point.y, point.z));
        }
        return points;
    },

    /**
     * Generate an unknot (circle with twists that look like a knot but isn't)
     */
    unknotPoints(segments = 100, scale = 1, rotation = { x: 0, y: 0, z: 0 }) {
        const points = [];
        for (let i = 0; i <= segments; i++) {
            const t = (i / segments) * Math.PI * 2;
            // Circle with some wobble that makes it look twisted
            let x = Math.cos(t) * scale * 1.5;
            let y = Math.sin(t) * scale * 1.5;
            let z = Math.sin(3 * t) * scale * 0.5 + Math.cos(2 * t) * scale * 0.3;

            const point = this.rotatePoint({ x, y, z }, rotation);
            points.push(new THREE.Vector3(point.x, point.y, point.z));
        }
        return points;
    },

    /**
     * Generate a more complex-looking unknot
     */
    complexUnknotPoints(segments = 100, scale = 1, rotation = { x: 0, y: 0, z: 0 }) {
        const points = [];
        for (let i = 0; i <= segments; i++) {
            const t = (i / segments) * Math.PI * 2;
            // Twisted circle that can still be unknotted
            let x = (1.5 + 0.5 * Math.cos(3 * t)) * Math.cos(t) * scale;
            let y = (1.5 + 0.5 * Math.cos(3 * t)) * Math.sin(t) * scale;
            let z = 0.5 * Math.sin(3 * t) * scale;

            const point = this.rotatePoint({ x, y, z }, rotation);
            points.push(new THREE.Vector3(point.x, point.y, point.z));
        }
        return points;
    },

    /**
     * Rotate a point by euler angles
     */
    rotatePoint(point, rotation) {
        let { x, y, z } = point;
        const { x: rx, y: ry, z: rz } = rotation;

        // Rotate around X
        if (rx) {
            const cos = Math.cos(rx), sin = Math.sin(rx);
            const newY = y * cos - z * sin;
            const newZ = y * sin + z * cos;
            y = newY; z = newZ;
        }
        // Rotate around Y
        if (ry) {
            const cos = Math.cos(ry), sin = Math.sin(ry);
            const newX = x * cos + z * sin;
            const newZ = -x * sin + z * cos;
            x = newX; z = newZ;
        }
        // Rotate around Z
        if (rz) {
            const cos = Math.cos(rz), sin = Math.sin(rz);
            const newX = x * cos - y * sin;
            const newY = x * sin + y * cos;
            x = newX; y = newY;
        }

        return { x, y, z };
    },

    /**
     * Create a Three.js scene with a knot
     */
    createKnotScene(container, knotType, options = {}) {
        const {
            size = 150,
            rotation = { x: 0, y: 0, z: 0 },
            color = this.colors.primary,
            animate = false,
            tubeRadius = 0.12
        } = options;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
        camera.position.z = 6;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(size, size);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Get knot points based on type
        let points;
        switch (knotType) {
            case 'trefoil':
                points = this.trefoilPoints(150, 1, rotation);
                break;
            case 'figureEight':
                points = this.figureEightPoints(150, 1, rotation);
                break;
            case 'cinquefoil':
                points = this.cinquefoilPoints(200, 1, rotation);
                break;
            case 'unknot':
                points = this.unknotPoints(100, 1, rotation);
                break;
            case 'complexUnknot':
                points = this.complexUnknotPoints(150, 1, rotation);
                break;
            default:
                points = this.trefoilPoints(150, 1, rotation);
        }

        // Create tube geometry from points
        const curve = new THREE.CatmullRomCurve3(points);
        curve.closed = true;
        const geometry = new THREE.TubeGeometry(curve, 200, tubeRadius, 16, true);

        // Material with nice lighting
        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.4,
            metalness: 0.1,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
        backLight.position.set(-5, -5, -5);
        scene.add(backLight);

        // Animation loop
        let frameId;
        const animateLoop = () => {
            frameId = requestAnimationFrame(animateLoop);
            if (animate) {
                mesh.rotation.y += 0.005;
                mesh.rotation.x += 0.002;
            }
            renderer.render(scene, camera);
        };

        // Initial render
        renderer.render(scene, camera);

        if (animate) {
            animateLoop();
            this.animationFrames.push(frameId);
        }

        this.renderers.push(renderer);

        return { scene, camera, renderer, mesh, frameId };
    },

    /**
     * Create a small knot for progress indicator
     */
    createProgressKnot(container, unlocked = false) {
        const size = 48;
        const color = unlocked ? this.colors.sage : this.colors.light;

        return this.createKnotScene(container, 'trefoil', {
            size,
            color,
            tubeRadius: 0.15,
            rotation: { x: 0.3, y: 0.5, z: 0 }
        });
    },

    /**
     * Clean up all renderers
     */
    cleanup() {
        this.animationFrames.forEach(id => cancelAnimationFrame(id));
        this.renderers.forEach(renderer => renderer.dispose());
        this.animationFrames = [];
        this.renderers = [];
    },

    /**
     * Get knot for puzzle 1 options
     * Returns { type, rotation } for creating consistent but different views
     */
    getPuzzle1Config() {
        return {
            reference: {
                type: 'trefoil',
                rotation: { x: 0, y: 0, z: 0 },
                color: this.colors.primary
            },
            options: [
                {
                    type: 'figureEight',  // Different knot
                    rotation: { x: 0.3, y: 0.5, z: 0 },
                    color: this.colors.primary,
                    correct: false
                },
                {
                    type: 'trefoil',  // Same knot, rotated
                    rotation: { x: Math.PI / 3, y: Math.PI / 4, z: 0 },
                    color: this.colors.primary,
                    correct: true
                },
                {
                    type: 'cinquefoil',  // Different knot
                    rotation: { x: 0, y: 0.3, z: 0.2 },
                    color: this.colors.primary,
                    correct: false
                },
                {
                    type: 'unknot',  // Different (not even a knot)
                    rotation: { x: 0.2, y: 0.4, z: 0 },
                    color: this.colors.primary,
                    correct: false
                }
            ]
        };
    },

    /**
     * Get config for puzzle 2 (equivalence)
     */
    getPuzzle2Config() {
        return {
            knotA: {
                type: 'trefoil',
                rotation: { x: 0, y: 0, z: 0 },
                color: this.colors.primary
            },
            knotB: {
                type: 'trefoil',
                rotation: { x: Math.PI / 2, y: Math.PI / 3, z: Math.PI / 4 },
                color: this.colors.secondary
            },
            areSame: true
        };
    },

    /**
     * Get config for puzzle 3 (unknotting)
     */
    getPuzzle3Config() {
        return {
            knot: {
                type: 'complexUnknot',  // Looks complex but can be unknotted
                rotation: { x: 0.3, y: 0.2, z: 0.1 },
                color: this.colors.primary
            },
            canBeUnknotted: true
        };
    }
};

// Export globally
window.Knots3D = Knots3D;
