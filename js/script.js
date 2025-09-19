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

    // History and current input state
    let history = [];
    let history_index = -1;
    let current_input = "";

    input.focus();

    // Updates the input and cursor position
    function updateinput() {
        input.textContent = current_input;
        input.appendChild(cursor);
        body.scrollTop = body.scrollHeight;
    }

    // Creates a new div to display output in the terminal
    function create_output_element(html) {
        const output_el = document.createElement("div");
        output_el.className = "terminal-output";
        output_el.innerHTML = html;
        body.insertBefore(output_el, prompt);
        body.scrollTop = body.scrollHeight;
    }

    // Fills the back of the ID card using the HTML template
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
        
        else if (command === "clear") {
            body.querySelectorAll(".terminal-output").forEach(o => o.remove());
        } 
        
        else {
            create_output_element(`<b>Command not found:</b> ${escape_html(command_raw)}. Type 'help' for commands.`);
        }
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

    // All keyboard input for the terminal
    document.addEventListener("keydown", (event) => {
        input.focus();
        const key = event.key;

        if (key === "Enter") {
            event.preventDefault();

            process_command(current_input);

            if (current_input.trim() && history[history.length - 1] !== current_input.trim()) {
                history.push(current_input.trim());
            }

            history_index = history.length;
            current_input = "";

        } 
        
        else if (key === "Backspace") {
            event.preventDefault();

            current_input = current_input.slice(0, -1);

        } 
        
        else if (key === "ArrowUp") {
            event.preventDefault();

            if (history_index > 0) {
                history_index--;
                current_input = history[history_index] || "";
            }

        } 
        
        else if (key === "ArrowDown") {
            event.preventDefault();

            if (history_index < history.length - 1) {
                history_index++;
                current_input = history[history_index] || "";
            } 
            
            else {
                history_index = history.length;
                current_input = "";
            }
        } 
        
        else if (key.length === 1 && !event.ctrlKey && !event.metaKey) {
            current_input += key;
        }

        updateinput();

    });

    // ID Card main Physics (Mostly taken from others)
    (function ID_Card_Physics() {
        const card_container = document.getElementById('id-card-container');
        const card = document.getElementById('id-card');
        const lanyard = document.getElementById('lanyard-line');
        const terminal = document.getElementById('terminal');

        if (!card_container || !card || !lanyard || !terminal) return;

        // Dragging state and movement variables
        let dragging = false;
        let drag_offset_x = 0, drag_offset_y = 0;
        let card_x, card_y, velocity_x = 0, velocity_y = 0;

        // Spring and gravity
        const stiffness = 0.2, damping = 0.9, length = 100, gap = 18;

        // Updates container rectancgle and anchor point (the top of the lanyard)
        function update_container_rect() {
            const rect = card_container.getBoundingClientRect();
            const anchor_x = rect.width;
            const anchor_y = 20;

            lanyard.setAttribute('x1', anchor_x);
            lanyard.setAttribute('y1', anchor_y);

            return { rect, anchor_x, anchor_y };
        }

        // Initial position of card
        let { rect: container_rectangle, anchor_x } = update_container_rect();
        card_x = anchor_x;
        card_y = 220;

        // Dragging starts when left mouse button pressed
        card.addEventListener('mousedown', (e) => {

            // Only allow left-click drags
            if (e.button !== 0) {
                return; 
            }

            dragging = true;

            card.classList.add('dragging');

            let { rect } = update_container_rect();

            container_rectangle = rect;
            drag_offset_x = e.clientX - container_rectangle.left - card_x;
            drag_offset_y = e.clientY - container_rectangle.top - card_y;

            e.preventDefault();
        });

        // Dragging stops when mouse released
        window.addEventListener('mouseup', () => {
            dragging = false;
            card.classList.remove('dragging');
        });

        // Updates card position during dragging
        window.addEventListener('mousemove', (e) => {
            if (!dragging) {
                return;
            }

            let { rect } = update_container_rect();
            container_rectangle = rect;

            const terminal_rect = terminal.getBoundingClientRect();
            
            // Stays left of terminal
            const card_half_width = card.offsetWidth / 2;
            const terminal_left = terminal_rect.left - container_rectangle.left;
            const max_x = terminal_left - card_half_width - gap;
            const min_x = card_half_width;

            let new_card_x = e.clientX - container_rectangle.left - drag_offset_x;
            card_x = Math.max(min_x, Math.min(max_x, new_card_x));
            
            // Stays within window height
            const card_half_height = card.offsetHeight / 2;
            const min_y = card_half_height;
            const max_y = window.innerHeight - container_rectangle.top - card_half_height;

            let new_card_y = e.clientY - container_rectangle.top - drag_offset_y;
            card_y = Math.max(min_y, Math.min(max_y, new_card_y));

            // Cancel velocity while dragging
            velocity_x = 0;
            velocity_y = 0;
        });

        // Right-click flips the card
        card.addEventListener('contextmenu', (e) => {
            e.preventDefault();

            card.classList.toggle('flipped');
        });

        // Spring motion and gravity
        function physics() {
            let { rect, anchor_x, anchor_y } = update_container_rect();
            container_rectangle = rect;

            if (!dragging) {
                // Calculate spring forces and gravity
                const distance_x = card_x - anchor_x;
                const distance_y = card_y - anchor_y;
                const distance = Math.sqrt(distance_x * distance_x + distance_y * distance_y) || 0.001;
                const stretch = distance - length;
                const force_x = -stiffness * stretch * (distance_x / distance);
                const force_y = -stiffness * stretch * (distance_y / distance) + 0.5; // Gravity

                // Apply velocity with damping
                velocity_x = (velocity_x + force_x) * damping;
                velocity_y = (velocity_y + force_y) * damping;
                card_x += velocity_x;
                card_y += velocity_y;
            }
            
            // Side collision checks
            const card_half_width = card.offsetWidth / 2;
            const terminal_left = terminal.getBoundingClientRect().left - container_rectangle.left;
            const max_x = terminal_left - card_half_width - gap;
            const min_x = card_half_width;

            if (card_x < min_x) { 
                card_x = min_x; 
                velocity_x *= -0.6; 
            }

            if (card_x > max_x) { 
                card_x = max_x; 
                velocity_x *= -0.6; 
            }
            
            // Top/Bottom collision checks
            const card_half_height = card.offsetHeight / 2;
            const min_y = card_half_height;
            const max_y = window.innerHeight - container_rectangle.top - card_half_height;

            if (card_y < min_y) { 
                card_y = min_y; 
                velocity_y *= -0.6; 
            }

            if (card_y > max_y) { 
                card_y = max_y; 
                velocity_y *= -0.6; 
            }
            
            // Apply position and rotation
            card.style.left = `${card_x}px`;
            card.style.top = `${card_y}px`;

            const angle = Math.atan2(card_x - anchor_x, card_y - anchor_y) * (180 / Math.PI);

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
