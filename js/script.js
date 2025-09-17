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
        contact: `Email:<a href="mailto:md.mahatabmahimn@gmail.com" target="_blank">md.mahatabmahimn@gmail.com</a><br>GitHub: <a href="https://github.com/Astral-Viscount" target="_blank">Astral-Viscount</a>`
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

        body.scrollTop = body.scrollHeight;;
    }

    function output(content) {
        const output = document.createElement("div");
        output.id = "output"
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
                }

                else {
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
            } 

            else if (history_index === history.length - 1) {
                event.preventDefault();
                history_index = history.length;
                current_input = "";
                updateinput();
            }
        } 

        else if (key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
            current_input += key;
            updateinput();
        }
    });
});