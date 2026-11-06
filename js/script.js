
// This code has been refined with AI as my original code had lots of repeating logic and bad vector computation it also had a slower runtime.
// No new features or any functionalities were added by AI other than some design and web development conventions (like webkit and browser control)
// Most of the id card calculations were copied from stack overlfow and some YT tutorials
// The aeshtetic output is inspired from another project similar to this

document.addEventListener("DOMContentLoaded", () => {
    // Gets the terminal elements from the page
    const body = document.getElementById("body");
    const prompt = document.getElementById("prompt");
    const cursor = document.getElementById("cursor");
    const input = document.getElementById("input");
    const input_capture = document.getElementById("terminal-input-capture");

    // History and current input state
    let history = [];
    let history_index = -1;
    let current_input = "";

    input_capture.focus({ preventScroll: true });

    function updateinput() {
        const selection_start = input_capture.selectionStart;
        const selection_end = input_capture.selectionEnd;

        input.replaceChildren();

        const before_selection = current_input.slice(0, selection_start);
        const selected_text = current_input.slice(selection_start, selection_end);
        const after_selection = current_input.slice(selection_end);

        input.appendChild(document.createTextNode(before_selection));

        if (selection_start !== selection_end) {
            const selection = document.createElement("span");
            selection.className = "terminal-selection";
            selection.textContent = selected_text;
            input.appendChild(selection);
        }

        input.appendChild(cursor);

        input.appendChild(document.createTextNode(after_selection));

        body.scrollTop = body.scrollHeight;
    }

    function create_output_element(html) {
        const output_el = document.createElement("div");
        output_el.className = "terminal-output";
        output_el.innerHTML = html;
        body.insertBefore(output_el, prompt);
        body.scrollTop = body.scrollHeight;
    }

    (function add_stuff() {
        const card_back = document.querySelector('#id-card .card-back');

        // Ignores white spaces
        if (!card_back || (card_back.innerHTML && card_back.innerHTML.trim().length > 20)) {
            return;
        }

        const template = document.getElementById('id-card-back-template');

        if(template) {
            const clone = template.content.cloneNode(true);
            card_back.appendChild(clone);
        }

    })();

    // Main logic to handle a command
    function process_command(command_raw) {
        const command = command_raw.trim().toLowerCase();
        const promptLine = `<span id="user">mahi@ubuntu:</span><span id="wavy">~</span><span id="dollar">$</span> ${escape_html(command_raw)}`;

        create_output_element(promptLine);

        if (!command) {
            return;
        }

        // Calls the function based on the command
        if (command === "help") {
            show_help();
        }

        else if (command === "about") {
            show_about();
        }

        else if (command === "skills") {
            show_skills();
        }

        else if (command === "projects") {
            show_projects();
        }

        else if (command === "tools") {
            show_tools();
        }

        else if (command === "contact") {
            show_contact();
        }

        else if (command == "awards") {
            show_awards();
        }

        else if (command == "activities") {
            show_activities();
        }

        else if (command === "clear") {
            body.querySelectorAll(".terminal-output").forEach(o => o.remove());
        }

        else {
            create_output_element(`<b>Command not found:</b> ${escape_html(command_raw)}. Type 'help' for commands.`);
        }
    }

    // Runs a command and records it in the history (used by Enter and by the tappable command bar)
    function run_command(text) {
        process_command(text);

        const trimmed = text.trim();

        if (trimmed && history[history.length - 1] !== trimmed) {
            history.push(trimmed);
        }

        history_index = history.length;
    }

    // Added by ai to make the output lesss weird
    function escape_html(s) {
        return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Displays the available commands
    function show_help() {
        const template = document.getElementById('help-output-template');
        if (!template) {
            return;
        }

        create_output_element(template.innerHTML);
    }

    // Displays the projects
    function show_projects() {
        const template = document.getElementById('projects-output-template');

        if (!template) {
            return;
        }

        create_output_element(template.innerHTML);
    }

    // Displays the tools
    function show_tools() {
        const template = document.getElementById('tools-output-template');

        if (!template) {
            return;
        }

        create_output_element(template.innerHTML);
    }

    // Displays the about
    function show_about() {
        const template = document.getElementById('about-output-template');

        if (!template) {
            return;
        }

        create_output_element(template.innerHTML);
    }

    // Displays the skills
    function show_skills() {
        const template = document.getElementById('skills-output-template');

        if (!template) {
            return;
        }

        create_output_element(template.innerHTML);
    }

    // Displays the contact
    function show_contact() {
        const template = document.getElementById('contact-output-template');

        if (!template) {
            return;
        }

        create_output_element(template.innerHTML);
    }

    // Displays the awards
    function show_awards() {
        const template = document.getElementById('awards-output-template');

        if (!template) {
            return;
        }

        create_output_element(template.innerHTML);
    }

    // Displays extracurricular activities
    function show_activities() {
        const template = document.getElementById('activities-output-template');

        if (!template) {
            return;
        }

        create_output_element(template.innerHTML);
    }

    input_capture.addEventListener("input", () => {
        current_input = input_capture.value;
        updateinput();
    });

    // Handles pasting text into the terminal
    input_capture.addEventListener("paste", (event) => {
        event.preventDefault();

        const pasted_text = event.clipboardData
            .getData("text")
            .replace(/[\r\n]+/g, " ");

        const start = input_capture.selectionStart;
        const end = input_capture.selectionEnd;

        input_capture.setRangeText(pasted_text, start, end, "end");

        current_input = input_capture.value;
        updateinput();
    });

    document.addEventListener("selectionchange", () => {
        if (document.activeElement === input_capture) {
            updateinput();
        }
    });

    input_capture.addEventListener("keyup", updateinput);

    // All keyboard input for the terminal
    document.addEventListener("keydown", (event) => {
        // Let keyboard users activate the tappable command buttons normally
        if (event.target.closest && event.target.closest("#quick-commands")) {
            return;
        }

        if (document.activeElement !== input_capture) {
            input_capture.focus();
        }

        const key = event.key;

        if (key === "Enter" && !event.shiftKey) {
            event.preventDefault();

            run_command(current_input);

            current_input = "";
            input_capture.value = "";
            input_capture.setSelectionRange(0, 0);
        }

        else if (key === "ArrowUp" && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
            event.preventDefault();

            if (history_index > 0) {
                history_index--;
                current_input = history[history_index] || "";
                input_capture.value = current_input;
                input_capture.setSelectionRange(current_input.length, current_input.length);
            }
        }

        else if (key === "ArrowDown" && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
            event.preventDefault();

            if (history_index < history.length - 1) {
                history_index++;
                current_input = history[history_index] || "";
            }

            else {
                history_index = history.length;
                current_input = "";
            }

            input_capture.value = current_input;
            input_capture.setSelectionRange(current_input.length, current_input.length);
        }

        updateinput();

    });

    body.addEventListener("click", (ev) => {
        if (ev.target.closest("a, .tool-card")) {
            return;
        }

        // Don't steal focus while the user is selecting text to copy
        if (window.getSelection && window.getSelection().toString().length > 0) {
            return;
        }

        input_capture.focus({ preventScroll: true });
    });

    const quick_commands = document.getElementById("quick-commands");

    if (quick_commands) {
        // Keeps focus where it is, so tapping a button doesn't close an open keyboard
        quick_commands.addEventListener("mousedown", (ev) => ev.preventDefault());

        quick_commands.addEventListener("click", (ev) => {
            const button = ev.target.closest("button[data-cmd]");

            if (!button) {
                return;
            }

            run_command(button.dataset.cmd);
        });
    }

    (function keep_prompt_above_keyboard() {
        const vv = window.visualViewport;

        if (!vv) {
            return;
        }

        const root = document.documentElement;

        function sync() {
            if (vv.scale > 1.05) {
                return;
            }

            const keyboard_open = window.innerHeight - vv.height > 120;

            root.classList.toggle("keyboard-open", keyboard_open);

            if (keyboard_open) {
                root.style.setProperty("--app-h", `${Math.round(vv.height)}px`);
                window.scrollTo(0, 0);
            }

            else {
                root.style.removeProperty("--app-h");
            }

            body.scrollTop = body.scrollHeight;
        }

        vv.addEventListener("resize", sync);
        sync();
    })();

    // Listens for clicks on the tool cards
    document.body.addEventListener('click', (ev) => {
        const toolCard = ev.target.closest('.tool-card');

        if (toolCard) {
            const url = toolCard.dataset.toolUrl;

            if (url) {
                window.open(url, '_blank', 'noopener');
            }
        }
    });

    // ID Card main Physics (Mostly taken from others)
    // Works in both layouts: side-by-side (card is left of the terminal) and stacked (card hangs in a strip above it).
    // Mouse, touch and pen all use pointer events. Right-click (mouse) or double-tap (touch) flips the card.
    (function ID_Card_Physics() {
        const card_container = document.getElementById('id-card-container');
        const card = document.getElementById('id-card');
        const lanyard = document.getElementById('lanyard-line');
        const terminal = document.getElementById('terminal');

        if (!card_container || !card || !lanyard || !terminal) return;

        // Dragging state and movement variables
        let dragging = false;
        let active_pointer = null;
        let last_pointer_type = 'mouse';
        let drag_offset_x = 0, drag_offset_y = 0;
        let card_x, card_y, velocity_x = 0, velocity_y = 0;

        // Double-tap detection (touch)
        let tap = null;
        let last_tap_time = 0;

        // Spring and gravity (the length, gap and gravity are for a full size card and get scaled with it)
        const stiffness = 0.2, damping = 0.9, base_length = 100, base_gap = 18, base_gravity = 0.5;

        // Works out where the card is allowed to be and where the lanyard is attached.
        // The container is position:fixed in the side-by-side layout and position:relative when stacked (see style.css).
        function get_geometry() {
            const rect = card_container.getBoundingClientRect();
            const side_by_side = getComputedStyle(card_container).position === 'fixed';

            const scale = (card.offsetWidth / 300) || 1;
            const card_width = card.offsetWidth;
            const card_height = card.offsetHeight;

            let anchor_x, anchor_y, min_x, max_x, min_y, max_y;

            if (side_by_side) {
                // Stays left of terminal
                const terminal_left = terminal.getBoundingClientRect().left - rect.left;

                anchor_x = rect.width;
                anchor_y = 20;

                min_x = card_width / 2;
                max_x = terminal_left - card_width / 2 - base_gap * scale;

                min_y = card_height / 2;
                max_y = rect.height - card_height;
            }

            else {
                // Stays inside the strip above the terminal
                anchor_x = rect.width / 2;
                anchor_y = 0;

                min_x = card_width / 2;
                max_x = rect.width - card_width / 2;

                min_y = 40 * scale;
                max_y = rect.height - card_height;
            }

            lanyard.setAttribute('x1', anchor_x);
            lanyard.setAttribute('y1', anchor_y);

            return { rect, side_by_side, scale, anchor_x, anchor_y, min_x, max_x, min_y, max_y };
        }

        // The card swings around its lanyard, so its bottom corners stick out sideways when it hangs at an angle.
        // In the stacked layout (where the card shares the full width of a phone) stop it being dragged so far
        // sideways that most of it ends up off screen. A little overhang is allowed so it still feels like it swings.
        // The side-by-side layout keeps its simple limits.
        function fit_x(x, y, g) {
            x = clamp(x, g.min_x, g.max_x);

            if (g.side_by_side) {
                return x;
            }

            const half_w = card.offsetWidth / 2;
            const height = card.offsetHeight;
            const overhang = card.offsetWidth * 0.5;

            // Does the swung card stay within the strip (plus the allowed overhang)?
            function fits(candidate_x) {
                const theta = Math.atan2(candidate_x - g.anchor_x, y - g.anchor_y);
                const sin = Math.sin(theta), cos = Math.cos(theta);

                // The card is rotated by -theta around its top centre; check the four corners
                for (const [cx, cy] of [[-half_w, 0], [half_w, 0], [-half_w, height], [half_w, height]]) {
                    const corner_x = candidate_x + cx * cos + cy * sin;

                    if (corner_x < -overhang || corner_x > g.rect.width + overhang) {
                        return false;
                    }
                }

                return true;
            }

            if (fits(x)) {
                return x;
            }

            // Find how far from hanging straight down the card can go in this direction
            let low = 0, high = 1;

            for (let i = 0; i < 14; i++) {
                const mid = (low + high) / 2;

                if (fits(g.anchor_x + (x - g.anchor_x) * mid)) {
                    low = mid;
                }

                else {
                    high = mid;
                }
            }

            return g.anchor_x + (x - g.anchor_x) * low;
        }

        function clamp(value, min, max) {
            return Math.max(min, Math.min(max, value));
        }

        // Initial position of card
        {
            const { scale, anchor_x } = get_geometry();
            card_x = anchor_x;
            card_y = 220 * scale;
        }

        // Dragging starts on left mouse button, or any touch / pen contact
        card.addEventListener('pointerdown', (e) => {
            last_pointer_type = e.pointerType;

            if (e.pointerType === 'mouse' && e.button !== 0) {
                return;
            }

            if (dragging) {
                return;
            }

            dragging = true;
            active_pointer = e.pointerId;

            // Keeps sending move/up events to the card even if the finger or cursor leaves it
            try {
                card.setPointerCapture(e.pointerId);
            } catch (err) { /* pointer already gone */ }

            card.classList.add('dragging');

            const { rect } = get_geometry();

            drag_offset_x = e.clientX - rect.left - card_x;
            drag_offset_y = e.clientY - rect.top - card_y;

            tap = { x: e.clientX, y: e.clientY, time: performance.now(), moved: false };

            e.preventDefault();
        });

        // Updates card position during dragging
        card.addEventListener('pointermove', (e) => {
            if (!dragging || e.pointerId !== active_pointer) {
                return;
            }

            const g = get_geometry();

            card_y = clamp(e.clientY - g.rect.top - drag_offset_y, g.min_y, g.max_y);
            card_x = fit_x(e.clientX - g.rect.left - drag_offset_x, card_y, g);

            // Cancel velocity while dragging
            velocity_x = 0;
            velocity_y = 0;

            if (tap && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) > 10) {
                tap.moved = true;
            }
        });

        // Dragging stops when the pointer is released
        function end_drag(e) {
            if (!dragging || e.pointerId !== active_pointer) {
                return;
            }

            dragging = false;
            active_pointer = null;
            card.classList.remove('dragging');

            // Two quick taps with a finger flip the card
            if (e.type === 'pointerup' && e.pointerType !== 'mouse' && tap && !tap.moved) {
                const now = performance.now();

                if (now - tap.time < 300) {
                    if (now - last_tap_time < 350) {
                        card.classList.toggle('flipped');
                        last_tap_time = 0;
                    }

                    else {
                        last_tap_time = now;
                    }
                }
            }

            tap = null;
        }

        card.addEventListener('pointerup', end_drag);
        card.addEventListener('pointercancel', end_drag);
        card.addEventListener('lostpointercapture', end_drag);

        // Right-click flips the card. (A long-press on a phone also fires this, so only react to the mouse.)
        card.addEventListener('contextmenu', (e) => {
            e.preventDefault();

            if (last_pointer_type === 'mouse') {
                card.classList.toggle('flipped');
            }
        });

        // Spring motion and gravity
        function physics() {
            const g = get_geometry();

            if (!dragging) {
                // Calculate spring forces and gravity
                const length = base_length * g.scale;
                const distance_x = card_x - g.anchor_x;
                const distance_y = card_y - g.anchor_y;
                const distance = Math.sqrt(distance_x * distance_x + distance_y * distance_y) || 0.001;
                const stretch = distance - length;
                const force_x = -stiffness * stretch * (distance_x / distance);
                const force_y = -stiffness * stretch * (distance_y / distance) + base_gravity * g.scale; // Gravity

                // Apply velocity with damping
                velocity_x = (velocity_x + force_x) * damping;
                velocity_y = (velocity_y + force_y) * damping;
                card_x += velocity_x;
                card_y += velocity_y;
            }

            // Side collision checks
            const fitted_x = fit_x(card_x, card_y, g);

            if (fitted_x !== card_x) {
                card_x = fitted_x;
                velocity_x *= -0.6;
            }

            // Top/Bottom collision checks
            if (card_y < g.min_y) {
                card_y = g.min_y;
                velocity_y *= -0.6;
            }

            if (card_y > g.max_y) {
                card_y = g.max_y;
                velocity_y *= -0.6;
            }

            // Apply position and rotation
            card.style.left = `${card_x}px`;
            card.style.top = `${card_y}px`;

            const angle = Math.atan2(card_x - g.anchor_x, card_y - g.anchor_y) * (180 / Math.PI);

            card.style.transform = `translateX(-50%) rotate(${-angle}deg)`;

            // Update lanyard line
            lanyard.setAttribute('x2', card_x);
            lanyard.setAttribute('y2', card_y);

            // animation
            requestAnimationFrame(physics);
        }

        physics();

    })();

});
