document.addEventListener("DOMContentLoaded", () => {
    const body = document.getElementById("body");
    const prompt = document.getElementById("prompt");
    const cursor = document.getElementById("cursor");
    const input = document.getElementById("input");

    let history = [];
    let index_history = -1;
    let currentinput = "";

    const commands = {
    help: `Available commands:<br> - about<br> - skills<br> - projects<br> - contact<br> - clear`,
    about: `Hi, I'm Mahi Mahatab. I'm a high school student and aspiring software engineer with interests in computer engineering, AI, and electronics.`,
    skills: `Languages: HTML, CSS, JavaScript, Python, Lua<br>Tools: GitHub, VS Code, Tinkercad, PROS, Fritzing, KiCad`,
    projects: `1. Virtual Assistant (Python)<br>2. Logic Gate Circuits (Tinkercad)<br>3. Portfolio Website<br>4. AI Snake Game<br>4. 4-bit Calculator`,
    contact: `Email:<a href="mailto:md.mahatabmahimn@gmail.com" target="_blank">md.mahatabmahimn@gmail.com</a><br>GitHub: <a href="https://github.com/Astral-Viscount" target="_blank">Astral-Viscount</a>`,
    clear: 'clear'
    };

    prompt.insertBefore(input, cursor);

    function updateinput() {
        input.textContent = currentinput;
    }

    function output(content) {
        const output = document.createElement("div");
        output.innerHTML = content;
        body.insertBefore(output, prompt);
        body.scrollTop = body.scrollHeight;
    }

    document.addEventListener("keydown", (event) => {
        const key = event.key;

        

    });
});