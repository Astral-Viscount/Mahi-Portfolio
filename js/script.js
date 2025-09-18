// This code has been refined with AI as my original code had lots of repeating logic and bad vector computation. 
// No new features were added or any functionalities were added by AI other than some design and web development conventions (like webkit and browser control)
// Most of the id card calculations were taken from stack overlfow and some YT tutorials

document.addEventListener("DOMContentLoaded", () => {
    const body = document.getElementById("body");
    const prompt = document.getElementById("prompt");
    const cursor = document.getElementById("cursor");
    const input = document.getElementById("input");

    let history = [];
    let history_index = -1;
    let current_input = "";

    const commands = {
        help: `<b>Available commands:</b><br> - about<br> - skills<br> - projects<br> - contact<br> - clear`,
        about: `Hi, I'm Mahi Mahatab. I'm a high school student and aspiring software engineer with interests in computer engineering, AI, and electronics.`,
        skills: `Languages: HTML, CSS, JavaScript, Python, Lua<br>Tools: GitHub, VS Code, Tinkercad, PROS, Fritzing, KiCad`,
        projects: `1. Virtual Assistant (Python)<br>2. Logic Gate Circuits (Tinkercad)<br>3. Portfolio Website<br>4. AI Snake Game<br>4. 4-bit Calculator`,
        contact: `Email: <a href="mailto:md.mahatabmahimn@gmail.com" target="_blank">md.mahatabmahimn@gmail.com</a><br>GitHub: <a href="https://github.com/Astral-Viscount" target="_blank">Astral-Viscount</a>`
    };

    prompt.insertBefore(input, cursor);
    input.focus();

    function updateinput() {
        input.textContent = current_input;

        if (current_input.length > 0) {
            input.appendChild(cursor); 
        } else {
            prompt.appendChild(cursor);
        }

        body.scrollTop = body.scrollHeight;
    }

    function output(content) {
        const output = document.createElement("div");
        output.id = "output";
        output.innerHTML = content;
        body.insertBefore(output, prompt);
        body.scrollTop = body.scrollHeight;
    }

    document.addEventListener("keydown", (event) => {
        input.focus();
        const key = event.key;

        if (key === "Enter") {
            event.preventDefault();
            const command = current_input.trim();
            output(`<span id="user">mahi@ubuntu:</span><span id="wavy">~</span><span id="dollar">$</span> ${current_input}`);

            if (command === "clear") {
                const outputLines = body.querySelectorAll("div");
                outputLines.forEach(line => {
                    if (line.id !== "prompt") {
                        line.remove();
                    }
                });

                current_input = "";
                history = [];
                history_index = -1;

            } else if (command) {
                
                if (commands[command]) {
                    output(commands[command]);
                } else {
                    output(`<b>Command not found:</b> ${command}. <br><b>Type 'help' for a list of commands.</b>`);
                }

                history.push(command);
                history_index = history.length;
            }

            current_input = "";
            updateinput();
            body.scrollTop = body.scrollHeight;

        } else if (key === "Backspace") {
            event.preventDefault();
            current_input = current_input.slice(0, -1);
            updateinput();

        } else if (key === "ArrowUp") {
            event.preventDefault();

            if (history_index > 0) {
                history_index--;
                current_input = history[history_index];
                updateinput();
            }

        } else if (key === "ArrowDown") {
            event.preventDefault();

            if (history_index < history.length - 1) {
                history_index++;
                current_input = history[history_index];
                updateinput();
            } else if (history_index === history.length - 1) {
                event.preventDefault();
                history_index = history.length;
                current_input = "";
                updateinput();
            }
        } else if (key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
            current_input += key;
            updateinput();
        }
    });

    // ID-card physics

    (function ID_Card() {
        const card_container = document.getElementById('id-card-container');
        const card = document.getElementById('id-card');
        const lanyard = document.getElementById('lanyard-line');
        const terminal = document.getElementById('terminal');

        if (!card_container || !card || !lanyard || !terminal) {
            return;
        }

        // inner flip container
        const card_inner = card.querySelector('.card-inner');

        let dragging = false;
        let drag_offset_x = 0;
        let drag_offset_y = 0;

        let container_rectangle = card_container.getBoundingClientRect();
        let anchor_x = container_rectangle.width / 2;
        let anchor_y = 0;

        // card center
        let card_x = anchor_x;
        let card_y = 220;
        let velocity_x = 0;
        let velocity_y = 0;

        const stiffness = 0.2;
        const damping = 0.9;
        const length = 100;
        const gap = 18; // px gap so card doesn't touch terminal visually 

        // lanyard anchor
        lanyard.setAttribute('x1', anchor_x);
        lanyard.setAttribute('y1', anchor_y);

        function updatecontainer_rectangle() {
            container_rectangle = card_container.getBoundingClientRect();
            // anchor point
            anchor_x = container_rectangle.width;
            anchor_y = 20;
            lanyard.setAttribute('x1', anchor_x);
            lanyard.setAttribute('y1', anchor_y);
        }

        window.addEventListener('resize', () => {
            updatecontainer_rectangle();
        });

        card.addEventListener('mousedown', (e) => {
            // left button only
            if (e.button !== 0) return;
            dragging = true;
            card.classList.add('dragging');
            updatecontainer_rectangle();

            // compute offset so card stays under pointer
            drag_offset_x = e.clientX - container_rectangle.left - card_x;
            drag_offset_y = e.clientY - container_rectangle.top - card_y;
            e.preventDefault();
        });

        window.addEventListener('mouseup', () => {
            dragging = false;
            card.classList.remove('dragging');
        });

        window.addEventListener('mousemove', (e) => {
            if (dragging) {
                updatecontainer_rectangle();
                const terminal_rectangle = terminal.getBoundingClientRect();

                const card_half_width = card.offsetWidth / 2;
                const terminal_left = terminal_rectangle.left - container_rectangle.left;
                // compute window right boundary for card center
                const window_right_boundary = window.innerWidth - container_rectangle.left - card_half_width - 20;

                // compute allowed max x so the card's right side never crosses the terminal's left side
                let allowed_max_x = Math.min(terminal_left - card_half_width - gap, window_right_boundary);
                // leftmost allowed X (keep it in viewport)
                const allowed_min_x = Math.max(card_half_width, -container_rectangle.left + card_half_width);

                if (allowed_max_x < allowed_min_x) {
                    allowed_max_x = Math.max(allowed_min_x, container_rectangle.width - card_half_width);
                }

                // set card position so it cannot be dragged into terminal
                let newcard_x = e.clientX - container_rectangle.left - drag_offset_x;
                newcard_x = Math.max(allowed_min_x, Math.min(allowed_max_x, newcard_x));
                card_x = newcard_x;

                // vertical (clamp while dragging)
                const card_half_height = card.offsetHeight / 2;
                const allowed_min_y = card_half_height;
                const allowed_max_y = window.innerHeight - container_rectangle.top - card_half_height;
                let newcard_y = e.clientY - container_rectangle.top - drag_offset_y;
                newcard_y = Math.max(allowed_min_y, Math.min(allowed_max_y, newcard_y));
                card_y = newcard_y;

                // zero velocities for stable release
                velocity_x = 0;
                velocity_y = 0;
            }
        });

        card.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            // stop dragging to avoid weirdness
            dragging = false;
            card.classList.remove('dragging');

            // toggle flipped state
            card.classList.toggle('flipped');

            updatecontainer_rectangle();
            lanyard.setAttribute('x2', card_x);
            lanyard.setAttribute('y2', card_y);
        });

        function updatePhysics() {
            updatecontainer_rectangle();
            const terminal_rectangle = terminal.getBoundingClientRect();

            const card_half_width = card.offsetWidth / 2;
            const card_half_height = card.offsetHeight / 2;

            if (!dragging) {
                const distance_x = card_x - anchor_x;
                const distance_y = card_y - anchor_y;
                const distance = Math.sqrt(distance_x * distance_x + distance_y * distance_y) || 0.0001;
                const stretch = distance - length;

                const force_x = -stiffness * stretch * (distance_x / distance);
                let force_y = -stiffness * stretch * (distance_y / distance);

                // gravity
                force_y += 0.5;

                velocity_x += force_x;
                velocity_y += force_y;

                velocity_x *= damping;
                velocity_y *= damping;

                card_x += velocity_x;
                card_y += velocity_y;
            }

            // invisible boundary
            const terminal_left = terminal_rectangle.left - container_rectangle.left;
            const window_right_boundary = window.innerWidth - container_rectangle.left - card_half_width - 20;
            const terminal_boundary = terminal_left - card_half_width - gap;
            let allowed_max_x = Math.min(terminal_boundary, window_right_boundary);
            const allowed_min_x = Math.max(card_half_width, -container_rectangle.left + card_half_width);

            if (allowed_max_x < allowed_min_x) {
                allowed_max_x = Math.max(allowed_min_x, container_rectangle.width - card_half_width);
            }

            if (card_x < allowed_min_x) {
                card_x = allowed_min_x;
                velocity_x *= -0.6;
            } else if (card_x > allowed_max_x) {
                card_x = allowed_max_x;
                velocity_x *= -0.6;
            }

            const allowed_min_y = card_half_height;
            const allowed_max_y = window.innerHeight - container_rectangle.top - card_half_height;
            if (card_y < allowed_min_y) {
                card_y = allowed_min_y;
                velocity_y *= -0.6;
            } else if (card_y > allowed_max_y) {
                card_y = allowed_max_y;
                velocity_y *= -0.6;
            }

            // update visual position and rotation
            card.style.left = `${card_x}px`;
            card.style.top = `${card_y}px`;
            const angle = Math.atan2(card_x - anchor_x, card_y - anchor_y) * (180 / Math.PI);
            card.style.transform = `translateX(-50%) rotate(${-angle}deg)`;

            // update lanyard
            lanyard.setAttribute('x2', card_x);
            lanyard.setAttribute('y2', card_y);

            requestAnimationFrame(updatePhysics);
        }

        updatePhysics();
    })();
});
