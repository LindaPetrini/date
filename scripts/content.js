/**
 * =====================================================
 * PLAYGROUND CONTENT - Edit all text here
 * =====================================================
 *
 * This file contains ALL editable text for the playground.
 * Change any copy here and it will update on the page.
 *
 * Structure:
 *   - headers: title/subtitle text for each toy
 *   - responses: what appears after user interaction
 *   - buttons: button and option labels
 *   - misc: share text, intro, etc.
 */

const CONTENT = {

    // =====================================================
    // INTRO / HEADER
    // =====================================================
    intro: {
        title: "play",
        subtitle: "date me docs are boring. here's a playground instead.",
        description: "get to know some things about me. for dating or otherwise.",
        pathHint: "suggested start",

        // The hover/click disqualifiers box
        disqualifiers: {
            label: "obvious disqualifiers",
            tooltip: "hover for the basics",
            items: [
                "F looking for M",
                "29",
                "monogamous",
                "wants kids",
                "omnivore",
                "europe-based"
            ]
        },

        // Your profile pic (put in assets/)
        profilePic: "assets/linda.jpg"
    },

    // =====================================================
    // END SECTION
    // =====================================================
    end: {
        main: "that's all for now.",
        note: "if you made it here, maybe we'd get along.",
        shareButton: "share your answers with me",
        copyHint: "copy and paste this into an email to lindapetrini@gmail.com",
        backLink: "or say hello another way",

        // Link to your own answers
        myAnswersLink: "see my answers",
        myAnswersUrl: "#my-answers", // change to actual URL or section

        // Make your own section
        makeYourOwn: {
            title: "make your own",
            text: "if you liked this, ask Claude to make you one.",
            repoUrl: "https://github.com/lindapetrini/dateme-playground",
            repoLabel: "github repo",
            note: "feel free to share this with your friends, I wanna meet more humans I vibe with.."
        }
    },

    // =====================================================
    // TOY ORDER - Change this array to reorder toys
    // =====================================================
    toyOrder: [
        "texture",    // 6
        "day",        // 28 - assemble a day
        "shades",     // 3
        "autocomplete", // 5
        "ai",         // 14
        "toes",       // 7
        "untangle",   // untangle this
        "sequence",   // 8
        "images",     // 9
        "message",    // 10
        "music",      // 11
        "hold",       // 25
        "nature",     // 12
        "babies",     // babies slider
        "color",      // 1
        "precision",  // 24
        "upside",     // 13
        "room",       // 15
        "body",       // 2 - moved later, after trust is built
        "crying",     // 16
        "reading",    // 17
        "spirit",     // 18
        "emotion",    // 4
        "neuro",      // 19
        "lead",       // 20
        "embodiment", // 29 - learning with body
        "therapy",    // 21
        "god",        // 22
        "food",       // 23
        "patterns",   // 30 - meeting someone interesting
        "meta",       // 27
        "fun"         // 26
    ],

    // =====================================================
    // TOY 1: COLOR
    // =====================================================
    color: {
        title: "make a color you like",
        labels: { hue: "hue", saturation: "saturation", lightness: "lightness" },
        button: "this one",
        response: "the page is now tinted with your color",
        responseRestored: "tinted with your color"
    },

    // =====================================================
    // TOY 2: PELVIS / BODY
    // =====================================================
    body: {
        title: "where is your pelvis pointing right now?",
        options: {
            forward: "forward, like a good citizen",
            tucked: "tucked under, protecting something",
            tilted: "tilted to one side",
            back: "pushed back, perhaps in a chair",
            unsure: "I genuinely don't know"
        },
        responses: {
            forward: "interesting. most people don't think about it at all.",
            tucked: "that's a common protective posture. nothing wrong with it.",
            tilted: "asymmetry is normal. thanks for checking.",
            back: "fair enough, chairs will do that.",
            unsure: "that's honest. most people have no idea where their pelvis is."
        }
    },

    // =====================================================
    // TOY 3: SHADES
    // =====================================================
    shades: {
        title: "order these by hue",
        hint: "warmest to coolest. click to swap.",
        button: "check",
        responses: {
            correct: "perfect. you have good eyes.",
            incorrect: "not quite. want to try again?"
        }
    },

    // =====================================================
    // TOY 4: EMOTION / NVC
    // =====================================================
    emotion: {
        title: "feeling or not?",
        hint: "feeling or thinking? — 6 quick rounds",
        buttons: { yes: "yes, a feeling", no: "no, something else" },
        endText: "that's all of them",
        summary: "you got {correct} out of {total}. turns out a lot of what we call feelings are actually thoughts about what someone else did. most people find this weird at first.",
        items: [
            { text: "I feel abandoned", isFeeling: false, explanation: "that's more about what you think happened than how you feel inside." },
            { text: "I feel like you don't care", isFeeling: false, explanation: "that's a thought about someone else, not a feeling." },
            { text: "I feel manipulated", isFeeling: false, explanation: "that's a story about what someone did to you." },
            { text: "I feel curious", isFeeling: true, explanation: "yes, curiosity counts." },
            { text: "I feel tender", isFeeling: true, explanation: "yes, tenderness is a feeling." },
            { text: "I feel restless", isFeeling: true, explanation: "yes, restlessness is a feeling." }
        ]
    },

    // =====================================================
    // TOY 5: AUTOCOMPLETE
    // =====================================================
    autocomplete: {
        title: "complete these",
        prompts: [
            "in the middle of the night I",
            "pleasure is",
            "all parts of me",
            "the point of life is",
            "I never leave the house without"
        ]
    },

    // =====================================================
    // TOY: BABIES
    // =====================================================
    babies: {
        title: "how many?",
        hint: "kids. the big question.",
        labels: [
            "0 — not for me",
            "1 — maybe one",
            "2 — a pair",
            "3 — the sweet spot",
            "4 — go big",
            "5 — full house",
            "6+ — are you serious"
        ],
        responses: {
            0: "that's honest. we might not be a match on this one — but I appreciate you saying it straight.",
            1: "one can be everything.",
            2: "classic. there's a reason it's popular.",
            3: "that's my number too.",
            4: "I like your ambition.",
            5: "I mean... I said 3-4 but you're making me reconsider.",
            6: "I mean... I said 3-4 but you're making me reconsider."
        }
    },

    // =====================================================
    // TOY 6: TEXTURE
    // =====================================================
    texture: {
        title: "pick a texture",
        options: ["linen", "wool", "silk", "stone", "wood", "water"]
    },

    // =====================================================
    // TOY 7: TOES
    // =====================================================
    toes: {
        title: "can you separate all of your toes?",
        hint: "like, spread them apart individually",
        options: {
            yes: "yes, easily",
            some: "some of them",
            no: "not really",
            trying: "hold on, I'm trying right now"
        },
        responses: {
            yes: "that's actually rare. good proprioception.",
            some: "the big toe is usually easiest. the little one... less so.",
            no: "most people can't. our feet spend too much time in shoes.",
            trying: "I appreciate the commitment to empirical investigation."
        },
        proofInvite: "pic or it didn't happen",
        uploadButton: "upload toe pic"
    },

    // =====================================================
    // TOY 8: SEQUENCE
    // =====================================================
    sequence: {
        title: "what comes next?",
        responses: {
            correct: "yes. you see the pattern.",
            incorrect: "not that one. look again?"
        }
    },

    // =====================================================
    // TOY 9: IMAGE CHOICE
    // =====================================================
    images: {
        title: "pick one",
        names: ["spirals", "flow", "organic"]
    },

    // =====================================================
    // TOY 10: MESSAGE PREFERENCE
    // =====================================================
    message: {
        title: "which would you rather receive?",
        options: {
            direct: '"I need some time alone tonight."',
            soft: '"I\'m feeling a bit drained, would it be okay if we had a quiet evening apart?"'
        },
        responses: {
            direct: "you like clarity. me too.",
            soft: "you appreciate the care in how things are said."
        }
    },

    // =====================================================
    // TOY 11: MUSIC
    // =====================================================
    music: {
        title: "music volume",
        labels: { min: "silence", max: "loud" },
        responses: {
            0: "silence. I like you.",
            25: "quiet background. gentle.",
            50: "moderate. fair enough.",
            75: "you like your music present.",
            100: "loud. we might have to negotiate."
        }
    },

    // =====================================================
    // TOY 12: NATURE
    // =====================================================
    nature: {
        title: "rank these (best to worst)",
        hint: "drag to reorder",
        items: ["sea", "mountain", "lake", "river", "forest"],
        button: "this order",
        responses: {
            sea: "the sea. endless, wild. I understand.",
            mountain: "mountains. solid ground, big views.",
            lake: "a lake. still and reflecting.",
            river: "rivers. always moving somewhere.",
            forest: "forest. enclosed, alive, mysterious."
        }
    },

    // =====================================================
    // TOY 13: UPSIDE DOWN
    // =====================================================
    upside: {
        title: "how do you feel about being upside down?",
        options: {
            love: "I love it",
            fine: "it's fine",
            uncomfortable: "uncomfortable",
            never: "I actively avoid it",
            when: "when was the last time I was upside down?"
        },
        responses: {
            love: "me too. there's something great about a change of perspective.",
            fine: "practical. blood to the head is fine sometimes.",
            uncomfortable: "understandable. not everyone's thing.",
            never: "fair. it's not for everyone.",
            when: "that's the real question. childhood? yoga? falling?"
        }
    },

    // =====================================================
    // TOY 14: AI QUIZ
    // =====================================================
    ai: {
        title: "select all that apply",
        options: [
            { key: "autoencoder", text: "I know what an autoencoder is" },
            { key: "polite", text: "I say please and thank you to AI" },
            { key: "credits", text: "I spent more than $50 on API credits last month" },
            { key: "sentient", text: "AI might be sentient" },
            { key: "alignment", text: "I've thought about AI alignment" },
            { key: "claude", text: "I have a favorite AI model" }
        ],
        responses: {
            many: "oh. you're one of us.",
            polite: "the politeness matters, I think.",
            sentient: "an interesting position to hold.",
            autoencoder: "technical foundations. nice.",
            default: "noted."
        }
    },

    // =====================================================
    // TOY 15: ROOM SLIDER
    // =====================================================
    room: {
        title: "ideal living space",
        labels: {
            min: "one room",
            minSub: "everything happens here",
            max: "mansion",
            maxSub: "a room for each mood"
        },
        responses: {
            0: "one room. everything within reach. I get it.",
            25: "cozy. a few distinct spaces but close together.",
            50: "balanced. room to spread out but not too much.",
            75: "you like having space to yourself.",
            100: "a room for each mood. ambitious."
        }
    },

    // =====================================================
    // TOY 16: CRYING
    // =====================================================
    crying: {
        title: "someone starts crying in the room",
        options: {
            hug: "go hug them",
            ask: "ask what they need",
            space: "give them space, look away",
            cry: "also start crying",
            depends: "it really depends on who"
        },
        responses: {
            hug: "physical comfort first. warm.",
            ask: "checking in before acting. respectful.",
            space: "not everyone wants to be seen crying. you know this.",
            cry: "emotional contagion. you feel things.",
            depends: "context matters. that's fair."
        }
    },

    // =====================================================
    // TOY 17: SPEED READING
    // =====================================================
    reading: {
        title: "speed reading test",
        hint: "read this as fast as you can, then answer",
        startButton: "start",
        doneButton: "done reading",
        passage: `The octopus has three hearts. Two pump blood to the gills, while the third pumps it to the rest of the body. When an octopus swims, the heart that delivers blood to the body stops beating, which is why these creatures prefer crawling—swimming exhausts them. Their blood is blue because it contains copper-based hemocyanin, which is more efficient at transporting oxygen in cold, low-oxygen environments. Each of their eight arms has its own mini-brain, a cluster of neurons that can act independently, allowing an arm to taste, touch, and even make decisions without consulting the central brain.`,
        question: {
            text: "Why do octopuses prefer crawling to swimming?",
            options: [
                { text: "Their arms work better on surfaces", correct: false },
                { text: "Swimming stops one of their hearts", correct: true },
                { text: "They can't see well while swimming", correct: false },
                { text: "Their blood flows better when crawling", correct: false }
            ]
        },
        responses: {
            correct: "{wpm} words per minute, and you got it right.",
            incorrect: "{wpm} words per minute, but the answer was wrong. speed vs comprehension.",
            alreadyDoneCorrect: "{wpm} wpm, correct answer. already done.",
            alreadyDoneIncorrect: "{wpm} wpm, wrong answer. already done."
        }
    },

    // =====================================================
    // TOY 18: SPIRITUALITY
    // =====================================================
    spirit: {
        title: "where do you land?",
        labels: {
            min: "materialist",
            minSub: "atoms all the way down",
            max: "believer",
            maxSub: "something's going on"
        },
        responses: {
            0: "pure materialism. physics all the way down.",
            25: "mostly materialist. open to mystery though.",
            50: "agnostic zone. not sure, and okay with that.",
            75: "something's going on. you feel it.",
            100: "believer. there's more to this."
        }
    },

    // =====================================================
    // TOY 19: NEURO
    // =====================================================
    neuro: {
        title: "is your brain normal?",
        options: [
            { key: "swings", text: "I love swings (still, as an adult)" },
            { key: "silence", text: "I need silence to think" },
            { key: "systems", text: "I make systems for everything" },
            { key: "fidget", text: "I fidget constantly" },
            { key: "texture", text: "some textures are unbearable" },
            { key: "hyperfocus", text: "I can hyperfocus for hours" },
            { key: "normal", text: "my brain is pretty normal actually" }
        ],
        responses: {
            normal: "nothing wrong with that. steady is underrated.",
            many: "your brain is interesting.",
            swings: "swings are great. never too old for that.",
            hyperfocus: "hyperfocus is a superpower (and a curse).",
            default: "noted."
        }
    },

    // =====================================================
    // TOY 20: LEAD/FOLLOW
    // =====================================================
    lead: {
        title: "generally speaking",
        options: {
            lead: "I'd rather decide what's happening",
            follow: "pls take me on a ride",
            both: "depends on the context",
            neither: "I'd rather we figure it out together"
        },
        responses: {
            lead: "you like to steer. good to know.",
            follow: "you like to be taken somewhere. noted.",
            both: "context-dependent. flexible.",
            neither: "collaborative. building together."
        }
    },

    // =====================================================
    // TOY 21: THERAPY
    // =====================================================
    therapy: {
        title: "therapy",
        labels: {
            hours: "hours spent in therapy (lifetime estimate)"
        },
        responses: {
            lots: "you've done the work.",
            some: "significant investment in yourself.",
            default: "noted."
        }
    },

    // =====================================================
    // TOY 22: GOD
    // =====================================================
    god: {
        title: "if you had to name it",
        hint: "god, the universe, source, nothing, consciousness, love, physics...",
        placeholder: "I call it...",
        response: "noted."
    },

    // =====================================================
    // TOY 23: FOOD
    // =====================================================
    food: {
        title: "food",
        options: [
            { key: "cook", text: "I cook most of my meals" },
            { key: "ingredients", text: "I care about ingredient quality" },
            { key: "restrictions", text: "I have dietary restrictions" },
            { key: "joy", text: "cooking brings me joy" },
            { key: "fuel", text: "food is mostly fuel to me" }
        ],
        responses: {
            cookJoy: "we could cook together.",
            fuel: "functional approach.",
            ingredients: "quality matters.",
            default: "noted."
        }
    },

    // =====================================================
    // TOY 24: PRECISION
    // =====================================================
    precision: {
        title: "put the slider exactly in the middle",
        button: "check",
        responses: {
            perfect: "perfect. exactly 50.",
            close: "{value}. so close.",
            near: "{value}. close enough?",
            off: "{value}. not quite the middle.",
            restored: "you got {value}."
        }
    },

    // =====================================================
    // TOY 25: HOLD
    // =====================================================
    hold: {
        title: "hold this for 10 seconds",
        buttonText: "hold",
        responses: {
            complete: "patience. you have it.",
            incomplete: "{seconds} seconds. try again?"
        }
    },

    // =====================================================
    // TOY 26: FUN
    // =====================================================
    fun: {
        title: "are you having fun?",
        options: {
            yes: "yes",
            "kind-of": "kind of",
            "not-sure": "I'm not sure what this is",
            no: "no"
        },
        responses: {
            yes: "good. that was the point.",
            "kind-of": "fair enough. not everything lands.",
            "not-sure": "that's okay. neither am I sometimes.",
            no: "thank you for your honesty. I genuinely appreciate it."
        }
    },

    // =====================================================
    // TOY 28: ASSEMBLE A DAY
    // =====================================================
    day: {
        title: "assemble a good day",
        hint: "drag activities to your timetable, or add your own",
        activities: [
            "slow start, minimal talking",
            "movement first",
            "coffee + reading",
            "jump straight into work",
            "focused solo work",
            "wandering with no plan",
            "making something with hands",
            "long conversation",
            "cooking together",
            "being around people",
            "quiet parallel time",
            "one intense activity",
            "early sleep",
            "music, lights low",
            "talking until too late",
            "alone with thoughts"
        ],
        response: "interesting. this tells me more than you think."
    },

    // =====================================================
    // TOY 29: EMBODIMENT
    // =====================================================
    embodiment: {
        title: "how do you learn a physical thing?",
        options: [
            "by copying someone",
            "by trying and failing",
            "by understanding the mechanics",
            "by being guided",
            "I tend to avoid physical learning"
        ],
        response: "noted."
    },

    // =====================================================
    // TOY 30: PATTERNS
    // =====================================================
    patterns: {
        title: "what usually happens when you meet someone interesting?",
        options: [
            "we talk for hours",
            "we do something together",
            "we disappear and reappear",
            "we overthink it",
            "it really varies"
        ],
        response: "patterns are funny things."
    },

    // =====================================================
    // TOY 27: META
    // =====================================================
    meta: {
        title: "how do you feel about going meta?",
        options: {
            hate: "hate it",
            loveHating: "I love hating it",
            hateLove: "I hate loving it",
            dontStart: "don't get me started"
        },
        responses: {
            hate: "fair. this whole thing is pretty meta.",
            loveHating: "a connoisseur of contradictions.",
            hateLove: "the recursive trap.",
            dontStart: "too late."
        }
    },

    // =====================================================
    // TOY: UNTANGLE THIS
    // =====================================================
    untangle: {
        title: "can this be untangled?",
        options: {
            yes: "yes",
            no: "no"
        },
        responses: {
            yes: "optimist.",
            no: "realist."
        }
    },

    // =====================================================
    // LINDA'S ANSWERS - Fill these in!
    // =====================================================
    myAnswers: {
        color: "a muted teal, like the sea on a cloudy day",
        body: "usually tilted, if I'm honest",
        texture: "linen in summer, wool in winter",
        toes: "yes — barefoot life",
        music: "10/100 — I love silence",
        nature: "sea > river > forest > mountain > lake > ",
        upside: "I love it. handstands are how I reset.",
        ai: "all of them really. I don't wanna talk about my API usage.",
        room: "5/100 - I love multi functional spaces",
        crying: "ask, I value giving people agency a lot",
        spirit: "85/100 — something's def going on",
        lead: "depends on the context, but I lean follow",
        therapy: "500+ hours",
        god: "to my big surprise, these days the answer is Jesus",
        food: "cook, joy, ingredients — food is connection",
        untangle: "yes. everything can.",
        babies: "3-4. this one isn't negotiable.",
        autocomplete: [
            "in the middle of the night I breath and chat with AI",
            "pleasure is paying attention to what feels good",
            "all parts of me are trying their best",
            "the point of life is to keep living",
            "I never leave the house without earplugs"
        ]
    }
};

// Make it available globally
window.CONTENT = CONTENT;
