/**
 * Project Popup Menu
 * Enhances the Projects section with interactive popups
 */

const projects_data = {
  "Tomato.C": {
    title: "Tomato.C",
    description: "A minimalist Pomodoro timer written in pure C, designed for efficiency and low resource consumption. This terminal-based tool helps users manage their work sessions using the Pomodoro technique.",
    image: "./images/tomatoc.jpg?height=500&width=900",
    year: "2022",
    github: "https://github.com/gabrielzschmitz/Tomato.C",
    learnings: [
      "Implemented precise timer mechanisms in C",
      "Built a responsive terminal UI using NCurses",
      "Developed a custom notification system",
      "Integrated an audio playback feature",
      "Created engaging ASCII art animations"
    ]
  },
  "Root Finder": {
    title: "Root Finder",
    description: "An application for solving equations numerically using methods like Bisection, Newton-Raphson, and Secant. Includes interactive visualizations to demonstrate the convergence process.",
    image: "./images/rootfinder.jpg?height=500&width=900",
    year: "2025",
    github: "https://github.com/gabrielzschmitz/root-finder",
    learnings: [
      "Implemented multiple numerical methods",
      "Created interactive convergence visualizations",
      "Designed a user-friendly interface for mathematical operations",
      "Optimized performance for complex equations"
    ]
  },
  "Pendulum Tracker": {
    title: "Pendulum Tracker",
    description: "A real-time pendulum tracking application using computer vision. Captures and analyzes pendulum motion via webcam, extracting key physical properties.",
    image: "./images/pendulumtracker.jpg?height=500&width=900",
    year: "2024",
    github: "https://github.com/gabrielzschmitz/Pendulum-Tracker",
    learnings: [
      "Applied computer vision techniques with OpenCV",
      "Implemented real-time motion tracking algorithms",
      "Developed data visualizations for physical measurements",
      "Integrated webcam input processing and object masking"
    ]
  },
  "ZKPop Go": {
    title: "ZKPop Go",
    description: "A Go wrapper for KEM-NIZKPoP (Key Encapsulation Mechanism with Non-Interactive Zero-Knowledge Proofs of Possession), focusing on post-quantum cryptography.",
    image: "https://placehold.co/900x500/gray/1A1A1A?text=ZKPop+Go&font=raleway",
    year: "2024",
    github: "https://github.com/gabrielzschmitz/zkpop-go",
    learnings: [
      "Created C-to-Go bindings for cryptographic libraries",
      "Implemented post-quantum cryptographic mechanisms",
      "Designed secure key exchange protocols",
      "Optimized performance for cryptographic operations"
    ]
  },
  "Research": {
    title: "Research",
    description: "A collection of research materials, presentations, and implementations produced during my undergraduate research projects.",
    image: "https://placehold.co/900x500/gray/1A1A1A?text=Research&font=raleway",
    year: "2024",
    github: "https://github.com/gabrielzschmitz/research",
    learnings: [
      "Created LaTeX-generated PDFs for research documentation",
      "Implemented and analyzed post-quantum algorithms",
      "Authored clear documentation for complex cryptographic concepts",
      "Contributed to academic research in cryptography"
    ]
  },
  "Bujoshell": {
    title: "Bujoshell",
    description: "A terminal-based bullet journal application that helps users organize tasks, notes, and schedules directly from the command line.",
    image: "./images/bujoshell.jpg?height=500&width=900",
    year: "2023",
    github: "https://github.com/gabrielzschmitz/bujoshell",
    learnings: [
      "Designed an intuitive terminal user interface",
      "Implemented efficient data storage and retrieval with SQLite",
      "Handled large user inputs in C using dynamic buffers and safe resizing",
      "Built cross-platform compatibility for Linux and macOS terminal environments"
    ]
  },
  "BessyAdventure": {
    title: "BessyAdventure",
    description: "A text-based RPG adventure game written in Prolog, showcasing logical programming paradigms through an interactive storytelling experience.",
    image: "./images/bessyadventures.jpg?height=500&width=900",
    year: "2022",
    github: "https://github.com/gabrielzschmitz/BessyAdventure",
    learnings: [
      "Applied logical programming concepts in Prolog",
      "Developed a dynamic storytelling engine",
      "Implemented decision trees for game progression",
      "Designed text-based user interactions and game mechanics"
    ]
  }
};

/**
 * Initialize the project popup functionality
 */
function InitProjectPopup() {
  const popup_html = `
    <div class="project-popup-overlay">
      <div class="project-popup-container">
        <div class="project-popup-close"></div>
        <div class="project-popup-image-container">
          <img class="project-popup-image" src="./images/placeholder.png" alt="Project preview">
        </div>
        <div class="project-popup-content">
          <h2 class="project-popup-title"></h2>
          <p class="project-popup-description"></p>
          <div class="project-popup-learnings">
            <h3>Key Learnings</h3>
            <ul class="project-popup-learnings-list"></ul>
          </div>
        </div>
        <div class="project-popup-footer">
          <div class="project-popup-year"></div>
          <a href="#" class="project-popup-github" target="_blank">
            <img style="width:16px;filter: invert(100%) brightness(50%); padding-right:10px" src="./images/githubicon.png" alt="Github"> View on GitHub
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', popup_html);

  const popup_overlay = document.querySelector('.project-popup-overlay');
  const popup_close = document.querySelector('.project-popup-close');
  const popup_image = document.querySelector('.project-popup-image');
  const popup_title = document.querySelector('.project-popup-title');
  const popup_description = document.querySelector('.project-popup-description');
  const popup_learnings_list = document.querySelector('.project-popup-learnings-list');
  const popup_year = document.querySelector('.project-popup-year');
  const popup_github = document.querySelector('.project-popup-github');

  const project_elements = document.querySelectorAll('.Project');

  project_elements.forEach(project => {
    project.addEventListener('click', (e) => {
      e.preventDefault();

      const project_title = project.querySelector('p[id="p1"]').textContent.trim();
      const project_data = projects_data[project_title.trim()];

      if (project_data) {
        popup_image.src = project_data.image;
        popup_image.alt = project_data.title;
        popup_title.textContent = project_data.title;
        popup_description.textContent = project_data.description;

        popup_learnings_list.innerHTML = '';
        project_data.learnings.forEach(learning => {
          const li = document.createElement('li');
          li.textContent = learning;
          popup_learnings_list.appendChild(li);
        });

        popup_year.textContent = project_data.year;
        popup_github.href = project_data.github;

        popup_overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      return false;
    });
  });

  popup_close.addEventListener('click', () => {
    popup_overlay.classList.remove('active');
    document.body.style.overflow = ''; 
  });

  popup_overlay.addEventListener('click', (e) => {
    if (e.target === popup_overlay) {
      popup_overlay.classList.remove('active');
      document.body.style.overflow = ''; 
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup_overlay.classList.contains('active')) {
      popup_overlay.classList.remove('active');
      document.body.style.overflow = ''; 
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  InitProjectPopup();
});
