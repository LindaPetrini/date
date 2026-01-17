/**
 * Knot SVG Generation
 * Creates visual representations of mathematical knots
 */

const KnotSVG = {
    // SVG namespace
    ns: 'http://www.w3.org/2000/svg',

    // Color palette
    colors: {
        stroke: '#914F62',      // burgundy
        strokeLight: '#C09882', // terracotta
        bg: 'none'
    },

    /**
     * Create base SVG element
     */
    createSVG(width = 100, height = 100, viewBox = '0 0 100 100') {
        const svg = document.createElementNS(this.ns, 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', viewBox);
        return svg;
    },

    /**
     * Create a path element
     */
    createPath(d, options = {}) {
        const path = document.createElementNS(this.ns, 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', options.fill || 'none');
        path.setAttribute('stroke', options.stroke || this.colors.stroke);
        path.setAttribute('stroke-width', options.strokeWidth || 4);
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        return path;
    },

    /**
     * Trefoil Knot (3₁) - View 1 (standard)
     * The classic three-lobed knot
     */
    trefoil1() {
        const svg = this.createSVG();

        // Background path (under crossings)
        const bgPath = this.createPath(
            'M 50 15 ' +
            'C 75 15, 90 35, 85 55 ' +
            'C 80 75, 55 85, 35 75 ' +
            'C 15 65, 10 40, 25 25 ' +
            'C 35 15, 45 15, 50 15',
            { stroke: this.colors.strokeLight, strokeWidth: 8 }
        );

        // Main knot path with crossings
        const mainPath = this.createPath(
            // First loop
            'M 50 20 ' +
            'C 30 20, 20 40, 30 55 ' +
            // Cross under (gap)
            'M 38 62 ' +
            'C 50 75, 75 70, 80 50 ' +
            // Cross under (gap)
            'M 75 42 ' +
            'C 70 25, 55 20, 50 20 ' +
            // Second strand
            'M 30 55 C 35 60, 36 61, 38 62 ' +
            'M 80 50 C 78 45, 76 43, 75 42',
            { strokeWidth: 4 }
        );

        // Crossing overlaps (foreground)
        const cross1 = this.createPath(
            'M 42 35 C 55 45, 60 55, 55 65',
            { strokeWidth: 4 }
        );

        const cross2 = this.createPath(
            'M 60 30 C 65 40, 62 50, 50 55',
            { strokeWidth: 4 }
        );

        svg.appendChild(bgPath);
        svg.appendChild(mainPath);
        svg.appendChild(cross1);
        svg.appendChild(cross2);

        return svg;
    },

    /**
     * Trefoil Knot - View 2 (rotated ~120°)
     */
    trefoil2() {
        const svg = this.createSVG();

        // Rotated trefoil - different projection
        const bgPath = this.createPath(
            'M 50 85 ' +
            'C 25 85, 10 65, 15 45 ' +
            'C 20 25, 45 15, 65 25 ' +
            'C 85 35, 90 60, 75 75 ' +
            'C 65 85, 55 85, 50 85',
            { stroke: this.colors.strokeLight, strokeWidth: 8 }
        );

        const mainPath = this.createPath(
            'M 50 80 ' +
            'C 70 80, 80 60, 70 45 ' +
            'M 62 38 ' +
            'C 50 25, 25 30, 20 50 ' +
            'M 25 58 ' +
            'C 30 75, 45 80, 50 80 ' +
            'M 70 45 C 67 42, 64 39, 62 38 ' +
            'M 20 50 C 22 53, 23 55, 25 58',
            { strokeWidth: 4 }
        );

        const cross1 = this.createPath(
            'M 58 65 C 45 55, 40 45, 45 35',
            { strokeWidth: 4 }
        );

        const cross2 = this.createPath(
            'M 40 70 C 35 60, 38 50, 50 45',
            { strokeWidth: 4 }
        );

        svg.appendChild(bgPath);
        svg.appendChild(mainPath);
        svg.appendChild(cross1);
        svg.appendChild(cross2);

        return svg;
    },

    /**
     * Trefoil Knot - View 3 (different perspective)
     */
    trefoil3() {
        const svg = this.createSVG();

        // More compact trefoil view
        const bgPath = this.createPath(
            'M 50 20 ' +
            'C 80 30, 85 70, 55 80 ' +
            'C 25 90, 10 50, 35 30 ' +
            'C 45 20, 50 20, 50 20',
            { stroke: this.colors.strokeLight, strokeWidth: 8 }
        );

        // Three-lobed structure
        const lobe1 = this.createPath(
            'M 50 25 C 35 25, 25 40, 35 50',
            { strokeWidth: 4 }
        );

        const lobe2 = this.createPath(
            'M 42 55 C 55 70, 75 65, 75 50',
            { strokeWidth: 4 }
        );

        const lobe3 = this.createPath(
            'M 70 42 C 65 30, 55 25, 50 25',
            { strokeWidth: 4 }
        );

        // Connectors with crossings
        const conn1 = this.createPath('M 35 50 C 38 52, 40 54, 42 55', { strokeWidth: 4 });
        const conn2 = this.createPath('M 75 50 C 73 47, 71 44, 70 42', { strokeWidth: 4 });

        // Central crossings
        const center = this.createPath(
            'M 45 40 C 55 45, 58 52, 52 60 ' +
            'M 55 38 C 48 48, 45 55, 48 62',
            { strokeWidth: 4 }
        );

        svg.appendChild(bgPath);
        svg.appendChild(lobe1);
        svg.appendChild(lobe2);
        svg.appendChild(lobe3);
        svg.appendChild(conn1);
        svg.appendChild(conn2);
        svg.appendChild(center);

        return svg;
    },

    /**
     * Figure-Eight Knot (4₁)
     * Has 4 crossings, looks like an 8
     */
    figureEight() {
        const svg = this.createSVG();

        // Background
        const bgPath = this.createPath(
            'M 50 15 C 20 15, 15 45, 35 55 C 55 65, 55 85, 30 85 ' +
            'C 10 85, 10 65, 35 55 C 55 45, 55 25, 50 15',
            { stroke: this.colors.strokeLight, strokeWidth: 8 }
        );

        // Upper loop
        const upper = this.createPath(
            'M 50 20 C 30 20, 25 35, 35 45',
            { strokeWidth: 4 }
        );

        // Middle crossing area
        const mid1 = this.createPath(
            'M 40 50 C 50 55, 60 55, 65 45',
            { strokeWidth: 4 }
        );

        const mid2 = this.createPath(
            'M 60 50 C 50 45, 40 45, 35 55',
            { strokeWidth: 4 }
        );

        // Lower loop
        const lower = this.createPath(
            'M 65 55 C 75 65, 70 80, 50 80 C 30 80, 25 65, 35 55',
            { strokeWidth: 4 }
        );

        // Connect back
        const connect = this.createPath(
            'M 65 45 C 75 35, 70 20, 50 20',
            { strokeWidth: 4 }
        );

        svg.appendChild(bgPath);
        svg.appendChild(upper);
        svg.appendChild(mid1);
        svg.appendChild(mid2);
        svg.appendChild(lower);
        svg.appendChild(connect);

        return svg;
    },

    /**
     * Figure-Eight Knot - Alternate View
     */
    figureEight2() {
        const svg = this.createSVG();

        const bgPath = this.createPath(
            'M 25 50 C 25 25, 50 15, 75 30 C 90 40, 85 65, 65 70 ' +
            'C 45 75, 35 70, 35 50 C 35 30, 55 25, 75 50 ' +
            'C 85 65, 75 85, 50 85 C 25 85, 15 65, 25 50',
            { stroke: this.colors.strokeLight, strokeWidth: 8 }
        );

        // Main figure-8 shape rotated
        const path1 = this.createPath(
            'M 30 50 C 30 30, 50 20, 70 35',
            { strokeWidth: 4 }
        );

        const path2 = this.createPath(
            'M 75 42 C 85 55, 75 75, 55 75',
            { strokeWidth: 4 }
        );

        const path3 = this.createPath(
            'M 48 72 C 35 68, 30 55, 40 45',
            { strokeWidth: 4 }
        );

        const path4 = this.createPath(
            'M 47 40 C 60 35, 75 45, 70 60',
            { strokeWidth: 4 }
        );

        const path5 = this.createPath(
            'M 65 65 C 55 75, 40 75, 30 60 C 20 45, 25 35, 30 50',
            { strokeWidth: 4 }
        );

        svg.appendChild(bgPath);
        svg.appendChild(path1);
        svg.appendChild(path2);
        svg.appendChild(path3);
        svg.appendChild(path4);
        svg.appendChild(path5);

        return svg;
    },

    /**
     * Cinquefoil Knot (5₁)
     * Five-lobed knot, more complex
     */
    cinquefoil() {
        const svg = this.createSVG();

        // Star-like five lobed pattern
        const bgPath = this.createPath(
            'M 50 10 L 60 40 L 90 45 L 65 60 L 75 90 L 50 70 L 25 90 L 35 60 L 10 45 L 40 40 Z',
            { stroke: this.colors.strokeLight, strokeWidth: 8 }
        );

        // Weaving pattern
        const weave = this.createPath(
            'M 50 15 C 55 30, 58 38, 85 43 ' +
            'M 78 48 C 68 55, 72 75, 72 85 ' +
            'M 65 82 C 55 72, 45 72, 35 82 ' +
            'M 28 85 C 28 75, 32 55, 22 48 ' +
            'M 15 43 C 42 38, 45 30, 50 15',
            { strokeWidth: 4 }
        );

        // Crossings
        const cross1 = this.createPath('M 58 38 C 65 40, 72 42, 78 48', { strokeWidth: 4 });
        const cross2 = this.createPath('M 72 85 C 70 83, 68 82, 65 82', { strokeWidth: 4 });
        const cross3 = this.createPath('M 35 82 C 32 83, 30 84, 28 85', { strokeWidth: 4 });
        const cross4 = this.createPath('M 22 48 C 20 46, 18 44, 15 43', { strokeWidth: 4 });

        // Central weave
        const center = this.createPath(
            'M 45 45 C 48 50, 52 50, 55 45 ' +
            'M 58 52 C 55 55, 52 58, 50 62 ' +
            'M 42 58 C 45 55, 48 52, 50 50 ' +
            'M 50 50 C 52 52, 55 55, 58 58',
            { strokeWidth: 3 }
        );

        svg.appendChild(bgPath);
        svg.appendChild(weave);
        svg.appendChild(cross1);
        svg.appendChild(cross2);
        svg.appendChild(cross3);
        svg.appendChild(cross4);
        svg.appendChild(center);

        return svg;
    },

    /**
     * Unknot that looks tangled
     * This is actually just a circle with fake crossings
     */
    fakeKnot1() {
        const svg = this.createSVG();

        // This looks like a knot but can be untangled
        const bgPath = this.createPath(
            'M 50 15 C 80 15, 90 50, 75 70 C 60 90, 30 85, 25 60 ' +
            'C 20 35, 35 15, 50 15',
            { stroke: this.colors.strokeLight, strokeWidth: 8 }
        );

        // Loop that goes over then back under - actually unknotted
        const main = this.createPath(
            'M 50 20 C 25 20, 20 50, 35 65 ' +
            'C 50 80, 75 75, 80 55 ' +
            'C 85 35, 70 20, 50 20',
            { strokeWidth: 4 }
        );

        // Fake crossing (both strands go same direction)
        const loop1 = this.createPath(
            'M 40 40 C 55 35, 65 45, 55 55',
            { strokeWidth: 4 }
        );

        const loop2 = this.createPath(
            'M 60 40 C 50 45, 45 55, 55 60',
            { strokeWidth: 4 }
        );

        svg.appendChild(bgPath);
        svg.appendChild(main);
        svg.appendChild(loop1);
        svg.appendChild(loop2);

        return svg;
    },

    /**
     * Another unknot that looks tangled
     * More complex looking but still unknottable
     */
    fakeKnot2() {
        const svg = this.createSVG();

        const bgPath = this.createPath(
            'M 30 25 C 70 15, 85 40, 75 65 C 65 85, 35 90, 25 70 ' +
            'C 15 50, 20 30, 30 25',
            { stroke: this.colors.strokeLight, strokeWidth: 8 }
        );

        // Twisted loop that can be untwisted
        const outer = this.createPath(
            'M 35 30 C 60 20, 80 40, 70 60 ' +
            'C 60 80, 35 80, 30 65 ' +
            'C 25 50, 30 35, 35 30',
            { strokeWidth: 4 }
        );

        // Inner twists (all same-direction crossings)
        const twist1 = this.createPath('M 45 35 C 55 40, 55 50, 45 55', { strokeWidth: 4 });
        const twist2 = this.createPath('M 55 38 C 48 45, 48 52, 55 58', { strokeWidth: 4 });
        const twist3 = this.createPath('M 40 50 C 50 48, 60 52, 55 60', { strokeWidth: 4 });

        svg.appendChild(bgPath);
        svg.appendChild(outer);
        svg.appendChild(twist1);
        svg.appendChild(twist2);
        svg.appendChild(twist3);

        return svg;
    },

    /**
     * Simple circle (obvious unknot)
     */
    circle() {
        const svg = this.createSVG();

        const circle = document.createElementNS(this.ns, 'circle');
        circle.setAttribute('cx', 50);
        circle.setAttribute('cy', 50);
        circle.setAttribute('r', 35);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', this.colors.stroke);
        circle.setAttribute('stroke-width', 4);

        svg.appendChild(circle);
        return svg;
    },

    /**
     * Trefoil shown more symmetrically
     */
    trefoilSymmetric() {
        const svg = this.createSVG();

        // Three-fold symmetric view
        const bgPath = this.createPath(
            'M 50 20 C 70 20, 85 50, 70 70 C 55 90, 25 80, 20 60 ' +
            'C 15 40, 30 20, 50 20',
            { stroke: this.colors.strokeLight, strokeWidth: 8 }
        );

        // Three lobes
        const lobe1 = this.createPath(
            'M 50 25 C 40 30, 35 45, 45 50',
            { strokeWidth: 4 }
        );

        const lobe2 = this.createPath(
            'M 52 55 C 65 65, 70 60, 70 50',
            { strokeWidth: 4 }
        );

        const lobe3 = this.createPath(
            'M 65 42 C 60 30, 55 25, 50 25',
            { strokeWidth: 4 }
        );

        // Connecting strands
        const c1 = this.createPath('M 45 50 C 48 52, 50 54, 52 55', { strokeWidth: 4 });
        const c2 = this.createPath('M 70 50 C 68 47, 66 44, 65 42', { strokeWidth: 4 });

        // Center crossing
        const center = this.createPath(
            'M 48 42 C 55 48, 55 55, 48 58 ' +
            'M 55 45 C 50 50, 47 55, 50 62',
            { strokeWidth: 4 }
        );

        svg.appendChild(bgPath);
        svg.appendChild(lobe1);
        svg.appendChild(lobe2);
        svg.appendChild(lobe3);
        svg.appendChild(c1);
        svg.appendChild(c2);
        svg.appendChild(center);

        return svg;
    },

    /**
     * A truly knotted figure (not unknottable)
     * Simple overhand knot
     */
    overhand() {
        const svg = this.createSVG();

        const bgPath = this.createPath(
            'M 20 50 C 20 30, 40 20, 60 25 C 80 30, 85 50, 75 65 ' +
            'C 65 80, 40 80, 30 65 C 20 50, 30 35, 50 35 ' +
            'C 70 35, 80 55, 70 70',
            { stroke: this.colors.strokeLight, strokeWidth: 8 }
        );

        // Main overhand structure
        const strand1 = this.createPath(
            'M 25 50 C 25 35, 40 25, 55 28',
            { strokeWidth: 4 }
        );

        const strand2 = this.createPath(
            'M 62 32 C 78 38, 80 55, 72 68',
            { strokeWidth: 4 }
        );

        const strand3 = this.createPath(
            'M 65 73 C 50 80, 35 75, 32 60',
            { strokeWidth: 4 }
        );

        // This goes UNDER (gap)
        const strand4 = this.createPath(
            'M 35 52 C 45 42, 60 42, 68 52',
            { strokeWidth: 4 }
        );

        // Connect the gaps with proper over/under
        const conn1 = this.createPath('M 55 28 C 58 30, 60 31, 62 32', { strokeWidth: 4 });
        const conn2 = this.createPath('M 72 68 C 70 70, 67 72, 65 73', { strokeWidth: 4 });
        const conn3 = this.createPath('M 32 60 C 33 57, 34 54, 35 52', { strokeWidth: 4 });

        // The crossing that makes it a true knot
        const over = this.createPath(
            'M 45 48 C 52 55, 58 55, 62 50',
            { strokeWidth: 4 }
        );

        svg.appendChild(bgPath);
        svg.appendChild(strand1);
        svg.appendChild(strand2);
        svg.appendChild(strand3);
        svg.appendChild(strand4);
        svg.appendChild(conn1);
        svg.appendChild(conn2);
        svg.appendChild(conn3);
        svg.appendChild(over);

        return svg;
    },

    /**
     * Get a knot by name
     */
    getKnot(name) {
        const knots = {
            'trefoil1': () => this.trefoil1(),
            'trefoil2': () => this.trefoil2(),
            'trefoil3': () => this.trefoil3(),
            'trefoilSymmetric': () => this.trefoilSymmetric(),
            'figureEight': () => this.figureEight(),
            'figureEight2': () => this.figureEight2(),
            'cinquefoil': () => this.cinquefoil(),
            'fakeKnot1': () => this.fakeKnot1(),
            'fakeKnot2': () => this.fakeKnot2(),
            'circle': () => this.circle(),
            'overhand': () => this.overhand()
        };

        return knots[name] ? knots[name]() : this.circle();
    }
};

// Export for use in other files
window.KnotSVG = KnotSVG;
