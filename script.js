/* ============ DATA STORE ============ */
const Store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
};

let notes = Store.get('notes', []);
let flashcards = Store.get('flashcards', [
  { front: 'What is HTML?', back: 'HyperText Markup Language - structure of web pages' },
  { front: 'What is CSS?', back: 'Cascading Style Sheets - styling of web pages' },
  { front: 'What is JavaScript?', back: 'A programming language for interactive web pages' }
]);
let quizHistory = Store.get('quizHistory', []);
let stats = Store.get('stats', { sessions: 0, gamesPlayed: 0, lastVisit: null, streak: 0 });

/* ============ COURSES DATA ============ */
const courses = [
  { icon: '🌐', title: 'Web Development', desc: 'HTML, CSS & JavaScript fundamentals', lessons: 24, color: '#4f46e5' },
  { icon: '🐍', title: 'Python Programming', desc: 'Learn Python from scratch', lessons: 30, color: '#10b981' },
  { icon: '📐', title: 'Mathematics', desc: 'Algebra, geometry & calculus', lessons: 40, color: '#f59e0b' },
  { icon: '🔬', title: 'Science', desc: 'Physics, chemistry & biology', lessons: 35, color: '#06b6d4' },
  { icon: '🗣️', title: 'English', desc: 'Grammar, writing & vocabulary', lessons: 28, color: '#ef4444' },
  { icon: '🏛️', title: 'History', desc: 'World history & civilizations', lessons: 22, color: '#8b5cf6' },
  { icon: '💻', title: 'C Programming', desc: 'Foundation of programming with C language', lessons: 15, color: '#ef4444'},
  { icon: '☕', title: 'Java Programming', desc: 'Object-oriented programming with Java', lessons: 15, color: '#f97316'},
  { icon: '⚙️', title: 'C++ Programming', desc: 'Powerful OOP & systems programming with C++', lessons: 15, color: '#0ea5e9'},
  { icon: '🟨', title: 'JavaScript Programming', desc: 'Modern JavaScript for the web and beyond', lessons: 15, color: '#eab308'},
  { icon: '🐘', title: 'PHP Programming', desc: 'Server-side web development with PHP', lessons: 15, color: '#6366f1'},
  { icon: '🦀', title: 'Rust Programming', desc: 'Safe, fast systems programming with Rust', lessons: 15, color: '#f97316'},
  { icon: '🐹', title: 'Go Programming', desc: 'Simple & efficient programming with Go', lessons: 15, color: '#06b6d4'},
  { icon: '🔒', title: 'Cyber Security', desc: 'Protect systems, networks & data from attacks', lessons: 15, color: '#dc2626'},
  { icon: '🕵️', title: 'Ethical Hacking', desc: 'Learn how attackers think to defend better', lessons: 15, color: '#7c3aed'},
  { icon: '🏗️', title: 'Software Engineering', desc: 'Build, manage & ship quality software', lessons: 15, color: '#0d9488'},
  { icon: '🌳', title: 'Data Structures & Algorithms', desc: 'Core CS fundamentals for problem solving', lessons: 15, color: '#2563eb'},
  { icon: '🗄️', title: 'DBMS', desc: 'Database design, SQL & management systems', lessons: 15, color: '#ca8a04'}
];

function toggleChatbot() {
    const bot = document.getElementById("chatbot-container");

    bot.style.display =
        bot.style.display === "flex"
            ? "none"
            : "flex";
}

function addMessage(text, type) {

    const messages = document.getElementById("chat-messages");

    if (!messages) {
        console.error("chat-messages div not found");
        return;
    }

    const div = document.createElement("div");

    div.className =
        type === "user"
            ? "user-msg"
            : "bot-msg";

    div.innerText = text;

    messages.appendChild(div);

    messages.scrollTop = messages.scrollHeight;

    console.log("Message Added:", text);
}

async function sendMessage() {

    const input = document.getElementById("chat-input");

    const message = input.value.trim();

    if (!message) return;

    addMessage(message, "user");

    input.value = "";

    try {

        const response = await fetch(
            "http://localhost:5000/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message
                })
            }
        );

        const data = await response.json();

        console.log("Server Response:", data);

        addMessage(
            data.reply || data.error || "No response received",
            "bot"
        );

    } catch (error) {

        console.error("Fetch Error:", error);

        addMessage(
            "Unable to connect to AI server.",
            "bot"
        );
    }
}
/* ============ QUIZ DATA ============ */
const quizzes = {
  'Web Development': [
    { q: 'Which tag creates a hyperlink?', options: ['<link>', '<a>', '<href>', '<url>'], answer: 1 },
    { q: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Creative Style System', 'Cascading Style Sheets', 'Colorful Style Sheets'], answer: 2 },
    { q: 'Which is a JavaScript data type?', options: ['Float', 'String', 'Character', 'Decimal'], answer: 1 },
    { q: 'Which symbol is used for IDs in CSS?', options: ['.', '#', '*', '&'], answer: 1 },
    { q: 'What does DOM stand for?', options: ['Document Object Model', 'Data Object Method', 'Digital Ordinance Model', 'Display Object Manager'], answer: 0 }
  ],
  'General Knowledge': [
    { q: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Rome'], answer: 2 },
    { q: 'How many continents are there?', options: ['5', '6', '7', '8'], answer: 2 },
    { q: 'What is the largest planet?', options: ['Earth', 'Jupiter', 'Saturn', 'Mars'], answer: 1 },
    { q: 'Who painted the Mona Lisa?', options: ['Van Gogh', 'Picasso', 'Da Vinci', 'Monet'], answer: 2 }
  ],
  'Mathematics': [
    { q: 'What is 7 × 8?', options: ['54', '56', '64', '48'], answer: 1 },
    { q: 'What is the square root of 144?', options: ['11', '12', '13', '14'], answer: 1 },
    { q: 'What is 15% of 200?', options: ['25', '30', '35', '40'], answer: 1 },
    { q: 'What is π approximately?', options: ['3.14', '2.72', '1.61', '4.13'], answer: 0 }
  ],
  'Python Programming': [
    { q: 'How do you print in Python?', options: ['echo()', 'print()', 'console.log()', 'write()'], answer: 1 },
    { q: 'Which symbol starts a comment?', options: ['//', '#', '/*', '--'], answer: 1 },
    { q: 'What type is [1, 2, 3]?', options: ['Tuple', 'Dictionary', 'List', 'Set'], answer: 2 },
    { q: 'Which keyword defines a function?', options: ['function', 'func', 'def', 'define'], answer: 2 },
    { q: 'What does len() return?', options: ['Last item', 'Length', 'Sum', 'Type'], answer: 1 }
  ],
  'Science': [
    { q: 'What gas do plants absorb?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], answer: 2 },
    { q: 'What is H₂O?', options: ['Salt', 'Water', 'Oxygen', 'Hydrogen'], answer: 1 },
    { q: 'How many bones in adult human body?', options: ['206', '201', '212', '198'], answer: 0 },
    { q: 'What planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Mercury'], answer: 1 },
    { q: 'What is the speed of light approx?', options: ['300,000 km/s', '150,000 km/s', '1,000 km/s', '30,000 km/s'], answer: 0 }
  ],
  'History': [
    { q: 'Who was the first US President?', options: ['Lincoln', 'Washington', 'Jefferson', 'Adams'], answer: 1 },
    { q: 'In which year did WWII end?', options: ['1943', '1945', '1947', '1950'], answer: 1 },
    { q: 'Which civilization built the pyramids?', options: ['Romans', 'Greeks', 'Egyptians', 'Mayans'], answer: 2 },
    { q: 'Who discovered America in 1492?', options: ['Magellan', 'Columbus', 'Vasco da Gama', 'Cook'], answer: 1 }
  ],
  'C Programming': [
    { q: 'Which function is the entry point of a C program?', options: ['start()', 'main()', 'init()', 'run()'], answer: 1 },
    { q: 'Which symbol is used to get the address of a variable?', options: ['*', '&', '#', '%'], answer: 1 },
    { q: 'Which header file is needed for printf()?', options: ['<string.h>', '<stdlib.h>', '<stdio.h>', '<math.h>'], answer: 2 },
    { q: 'What does malloc() do?', options: ['Frees memory', 'Allocates memory dynamically', 'Declares a variable', 'Compiles code'], answer: 1 },
    { q: 'Which data type is used to store a single character?', options: ['int', 'float', 'char', 'string'], answer: 2 }
  ],
  'Java Programming': [
    { q: 'Which keyword is used to create a class in Java?', options: ['class', 'struct', 'object', 'define'], answer: 0 },
    { q: 'Which method is the entry point of a Java program?', options: ['start()', 'run()', 'main()', 'init()'], answer: 2 },
    { q: 'Which keyword is used to inherit a class?', options: ['implements', 'extends', 'inherits', 'super'], answer: 1 },
    { q: 'Which collection does NOT allow duplicate elements?', options: ['ArrayList', 'LinkedList', 'HashSet', 'Vector'], answer: 2 },
    { q: 'What is used to handle exceptions in Java?', options: ['if-else', 'try-catch', 'switch-case', 'for-loop'], answer: 1 }
  ],
  'C++ Programming': [
    { q: 'Which symbol is used for output in C++?', options: ['>>', '<<', '::', '->'], answer: 1 },
    { q: 'Which keyword is used to define a class?', options: ['struct', 'class', 'object', 'type'], answer: 1 },
    { q: 'What is the default access specifier in a class?', options: ['public', 'protected', 'private', 'internal'], answer: 2 },
    { q: 'Which operator is used to allocate memory dynamically in C++?', options: ['malloc', 'alloc', 'new', 'create'], answer: 2 },
    { q: 'Which feature allows a function to be defined multiple times with different parameters?', options: ['Inheritance', 'Polymorphism', 'Overloading', 'Encapsulation'], answer: 2 }
  ],
  'JavaScript Programming': [
    { q: 'Which keyword declares a block-scoped variable?', options: ['var', 'let', 'global', 'static'], answer: 1 },
    { q: 'Which method converts a JSON string to an object?', options: ['JSON.stringify()', 'JSON.parse()', 'JSON.convert()', 'Object.parse()'], answer: 1 },
    { q: 'What does "===" check in JavaScript?', options: ['Value only', 'Type only', 'Value and type', 'Reference only'], answer: 2 },
    { q: 'Which function is used to handle asynchronous code with promises?', options: ['await', 'sync', 'defer', 'pause'], answer: 0 },
    { q: 'Which array method creates a new array by transforming each element?', options: ['forEach()', 'map()', 'filter()', 'reduce()'], answer: 1 }
  ],
  'PHP Programming': [
    { q: 'Which symbol is used to declare a variable in PHP?', options: ['#', '$', '@', '&'], answer: 1 },
    { q: 'Which function is used to output text in PHP?', options: ['print', 'echo', 'write', 'display'], answer: 1 },
    { q: 'Which superglobal array holds form data sent via POST?', options: ['$_GET', '$_POST', '$_FORM', '$_REQUEST'], answer: 1 },
    { q: 'Which symbol marks the start of a PHP block?', options: ['<%', '<?php', '<script>', '<#'], answer: 1 },
    { q: 'Which function connects to a MySQL database using PDO?', options: ['mysql_connect()', 'new PDO()', 'db_connect()', 'mysql_open()'], answer: 1 }
  ],
  'Rust Programming': [
    { q: 'Which keyword declares an immutable variable in Rust?', options: ['var', 'let', 'const', 'fix'], answer: 1 },
    { q: 'What system does Rust use to manage memory without a garbage collector?', options: ['Reference counting only', 'Manual free()', 'Ownership & borrowing', 'Stack-only allocation'], answer: 2 },
    { q: 'Which keyword is used to make a variable mutable?', options: ['mut', 'var', 'change', 'edit'], answer: 0 },
    { q: 'What is the entry point function in a Rust program?', options: ['start()', 'main()', 'run()', 'init()'], answer: 1 },
    { q: 'Which type represents a value that may or may not exist?', options: ['Result', 'Option', 'Maybe', 'Nullable'], answer: 1 }
  ],
  'Go Programming': [
    { q: 'What is the entry point function in a Go program?', options: ['start()', 'main()', 'run()', 'init()'], answer: 1 },
    { q: 'Which keyword is used to declare a variable in Go?', options: ['var', 'let', 'dim', 'declare'], answer: 0 },
    { q: 'Which keyword is used to run a function concurrently?', options: ['async', 'go', 'thread', 'parallel'], answer: 1 },
    { q: 'Which built-in type is used for communication between goroutines?', options: ['queue', 'channel', 'pipe', 'buffer'], answer: 1 },
    { q: 'Which package is commonly used for formatted I/O in Go?', options: ['"io"', '"fmt"', '"os"', '"strings"'], answer: 1 }
  ],
  'Cyber Security': [
    { q: 'What does CIA stand for in cyber security?', options: ['Central Intelligence Agency', 'Confidentiality, Integrity, Availability', 'Cyber Internet Access', 'Code Injection Attack'], answer: 1 },
    { q: 'Which of these is a strong password practice?', options: ['Using your name', 'Using the same password everywhere', 'Using long, unique passwords with a manager', 'Writing it on a sticky note'], answer: 2 },
    { q: 'What is malware that demands payment to restore access to data called?', options: ['Spyware', 'Ransomware', 'Adware', 'Worm'], answer: 1 },
    { q: 'Which device monitors and controls incoming/outgoing network traffic?', options: ['Router', 'Firewall', 'Switch', 'Modem'], answer: 1 },
    { q: 'What is the process of converting data into an unreadable format called?', options: ['Compression', 'Encryption', 'Formatting', 'Tokenizing'], answer: 1 }
  ],
  'Ethical Hacking': [
    { q: 'What is the first phase of ethical hacking?', options: ['Scanning', 'Reconnaissance', 'Exploitation', 'Reporting'], answer: 1 },
    { q: 'Which tool is widely used for network scanning?', options: ['Wireshark', 'Nmap', 'Photoshop', 'Excel'], answer: 1 },
    { q: 'What does SQL Injection target?', options: ['Operating system', 'Database queries', 'Network cables', 'Printers'], answer: 1 },
    { q: 'A "white hat" hacker is best described as?', options: ['A malicious attacker', 'An authorized security tester', 'A virus creator', 'A spammer'], answer: 1 },
    { q: 'Which attack relies on tricking a person rather than a system?', options: ['Buffer overflow', 'Social engineering', 'SQL injection', 'DNS spoofing'], answer: 1 }
  ],
  'Software Engineering': [
    { q: 'Which SDLC model follows a strict sequential design process?', options: ['Agile', 'Waterfall', 'Spiral', 'Scrum'], answer: 1 },
    { q: 'What does UML stand for?', options: ['Unified Modeling Language', 'Universal Markup Language', 'User Manual Language', 'Unit Module Layer'], answer: 0 },
    { q: 'Which testing checks if individual units of code work correctly?', options: ['Integration testing', 'Unit testing', 'System testing', 'Acceptance testing'], answer: 1 },
    { q: 'Which tool is commonly used for version control?', options: ['Git', 'Photoshop', 'Excel', 'Figma'], answer: 0 },
    { q: 'In Agile, a short development cycle is called a?', options: ['Milestone', 'Sprint', 'Phase', 'Release'], answer: 1 }
  ],
  'Data Structures & Algorithms': [
    { q: 'Which data structure follows LIFO (Last In First Out)?', options: ['Queue', 'Stack', 'Array', 'Linked List'], answer: 1 },
    { q: 'What is the time complexity of binary search on a sorted array?', options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(1)'], answer: 2 },
    { q: 'Which sorting algorithm has the best average time complexity?', options: ['Bubble Sort', 'Quick Sort', 'Selection Sort', 'Insertion Sort'], answer: 1 },
    { q: 'A tree where each node has at most two children is called?', options: ['Binary Tree', 'Linked List', 'Graph', 'Hash Table'], answer: 0 },
    { q: 'Which technique solves problems by breaking them into overlapping subproblems and storing results?', options: ['Recursion', 'Dynamic Programming', 'Sorting', 'Hashing'], answer: 1 }
  ],
  'DBMS': [
    { q: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Logic', 'Server Query Link', 'Standard Question Language'], answer: 0 },
    { q: 'Which key uniquely identifies a record in a table?', options: ['Foreign Key', 'Primary Key', 'Candidate Key', 'Composite Key'], answer: 1 },
    { q: 'Which SQL clause is used to filter rows?', options: ['SELECT', 'WHERE', 'ORDER BY', 'GROUP BY'], answer: 1 },
    { q: 'What is the process of organizing data to reduce redundancy called?', options: ['Normalization', 'Indexing', 'Replication', 'Encryption'], answer: 0 },
    { q: 'Which type of join returns only matching rows from both tables?', options: ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL OUTER JOIN'], answer: 2 }
  ]
};

/* ============ NAVIGATION ============ */
function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  document.getElementById('sidebar').classList.remove('open');
  if (id === 'progress') renderProgress();
  if (id === 'leaderboard') renderLeaderboard();
  if (id === 'study') renderStudy();
}


function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  Store.set('darkMode', document.body.classList.contains('dark'));
}

/* ============ DASHBOARD ============ */
function updateDashboard() {
  document.getElementById('statNotes').textContent = notes.length;
  document.getElementById('statQuizzes').textContent = quizHistory.length;
  const avg = quizHistory.length
    ? Math.round(quizHistory.reduce((s, q) => s + q.percent, 0) / quizHistory.length)
    : 0;
  document.getElementById('statScore').textContent = avg + '%';
  document.getElementById('statStreak').textContent = stats.streak;
  renderTodaysGoal();
}

/* ============ TODAY'S GOAL ============ */
// A rotating set of daily goals, one per day-of-week, with a fallback
// task suggestion based on the user's current progress.
const todaysGoals = [
  { icon: '🃏', text: 'Review 10 flashcards to keep your memory sharp.' },          // Sunday
  { icon: '📋', text: 'Take one quiz today and beat your average score.' },          // Monday
  { icon: '📖', text: 'Complete one lesson from any of your enrolled courses.' },    // Tuesday
  { icon: '⏱️', text: 'Finish a 25-minute Pomodoro focus session.' },                // Wednesday
  { icon: '🎮', text: 'Play a brain game to sharpen your reflexes.' },               // Thursday
  { icon: '📝', text: 'Write a quick note summarizing what you learned this week.' },// Friday
  { icon: '🏆', text: 'Check the leaderboard and try to climb a spot today.' }       // Saturday
];

function getTodaysGoal() {
  const dayIndex = new Date().getDay(); // 0 (Sun) - 6 (Sat)
  let goal = todaysGoals[dayIndex];

  // Personalize fallback: if the user has no enrolled courses yet,
  // nudge them to start one instead of reviewing flashcards/quizzes.
  const hasCourses = Object.keys(courseProgress).length > 0;
  if (!hasCourses && (dayIndex === 1 || dayIndex === 2)) {
    goal = { icon: '🚀', text: 'Enroll in a course and complete its first lesson.' };
  }
  return goal;
}

function renderTodaysGoal() {
  const el = document.getElementById('todaysGoal');
  if (!el) return; // element not present on this page
  const goal = getTodaysGoal();
  el.innerHTML = `<span style="font-size:1.4rem; margin-right:0.5rem;">${goal.icon}</span>${goal.text}`;
}

/* ============ COURSES ============ */
function renderCourses() {
  document.getElementById('coursesGrid').innerHTML = courses.map(c => {
    const done = (courseProgress[c.title] || []).length;
    const total = (courseLessons[c.title] || []).length;
    const enrolled = courseProgress[c.title];
    return `
    <div class="card" style="border-top:4px solid ${c.color}">
      <div style="font-size:3rem">${c.icon}</div>
      <h3 style="margin:0.5rem 0">${c.title}</h3>
      <p style="color:var(--text-light)">${c.desc}</p>
      <p class="badge mt-1">${c.lessons} lessons</p>
      ${enrolled ? `<p style="color:var(--success); font-size:0.85rem; margin-top:0.5rem;">✓ Enrolled · ${done}/${total} done</p>` : ''}
      <button class="btn mt-1" style="width:100%" onclick="enrollCourse('${c.title}')">
        ${enrolled ? '▶ Continue' : 'Enroll Now'}
      </button>
    </div>`;
  }).join('');
}

/* ============ NOTES ============ */
let editingNoteId = null;

function openNoteModal(id = null) {
  editingNoteId = id;
  if (id !== null) {
    const note = notes.find(n => n.id === id);
    document.getElementById('noteModalTitle').textContent = 'Edit Note';
    document.getElementById('noteTitle').value = note.title;
    document.getElementById('noteContent').value = note.content;
    document.getElementById('noteCategory').value = note.category;
  } else {
    document.getElementById('noteModalTitle').textContent = 'New Note';
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    document.getElementById('noteCategory').value = 'General';
  }
  document.getElementById('noteModal').classList.add('active');
}

function saveNote() {
  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();
  const category = document.getElementById('noteCategory').value;
  if (!title) { alert('Please enter a title'); return; }

  if (editingNoteId !== null) {
    const note = notes.find(n => n.id === editingNoteId);
    note.title = title; note.content = content; note.category = category;
    note.date = new Date().toLocaleString();
  } else {
    notes.unshift({ id: Date.now(), title, content, category, date: new Date().toLocaleString() });
  }
  Store.set('notes', notes);
  closeModal('noteModal');
  renderNotes();
  updateDashboard();
}

function deleteNote(id) {
  if (!confirm('Delete this note?')) return;
  notes = notes.filter(n => n.id !== id);
  Store.set('notes', notes);
  renderNotes();
  updateDashboard();
}

function renderNotes() {
  const search = document.getElementById('noteSearch').value.toLowerCase();
  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search) || n.content.toLowerCase().includes(search));
  const grid = document.getElementById('notesGrid');
  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-state-icon">📝</div>
      <p>No notes yet. Click "New Note" to get started!</p></div>`;
    return;
  }
  grid.innerHTML = filtered.map(n => `
    <div class="note-card">
      <span class="badge">${n.category}</span>
      <h3>${escapeHtml(n.title)}</h3>
      <p>${escapeHtml(n.content)}</p>
      <div class="note-meta">🕒 ${n.date}</div>
      <div class="note-actions">
        <button class="btn btn-sm" onclick="openNoteModal(${n.id})">✏️ Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteNote(${n.id})">🗑️ Delete</button>
      </div>
    </div>
  `).join('');
}

/* ============ QUIZZES ============ */
let currentQuiz = null, currentQ = 0, score = 0, quizName = '';

function renderQuizSelect() {
  document.getElementById('quizSelect').innerHTML = Object.keys(quizzes).map(name => `
    <div class="card text-center">
      <div style="font-size:2.5rem">📋</div>
      <h3>${name}</h3>
      <p style="color:var(--text-light)">${quizzes[name].length} questions</p>
      <button class="btn mt-1" onclick="startQuiz('${name}')">Start Quiz</button>
    </div>
  `).join('');
}

function startQuiz(name) {
  currentQuiz = quizzes[name];
  quizName = name;
  currentQ = 0;
  score = 0;
  document.getElementById('quizSelect').classList.add('hidden');
  document.getElementById('quizArea').classList.remove('hidden');
  renderQuestion();
}

function renderQuestion() {
  const q = currentQuiz[currentQ];
  const progress = ((currentQ) / currentQuiz.length) * 100;
  document.getElementById('quizArea').innerHTML = `
    <div class="card">
      <div class="flex-between">
        <span class="badge">${quizName}</span>
        <span class="badge">Question ${currentQ + 1}/${currentQuiz.length}</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
      <h2 style="margin:1rem 0">${q.q}</h2>
      <div id="options">
        ${q.options.map((opt, i) => `
          <label class="quiz-option" onclick="selectOption(${i})" data-i="${i}">${opt}</label>
        `).join('')}
      </div>
      <button class="btn mt-1 hidden" id="nextBtn" onclick="nextQuestion()">Next →</button>
    </div>`;
}

let answered = false;
function selectOption(i) {
  if (answered) return;
  answered = true;
  const q = currentQuiz[currentQ];
  const opts = document.querySelectorAll('.quiz-option');
  opts.forEach(o => o.style.pointerEvents = 'none');
  if (i === q.answer) {
    opts[i].classList.add('correct');
    score++;
  } else {
    opts[i].classList.add('wrong');
    opts[q.answer].classList.add('correct');
  }
  document.getElementById('nextBtn').classList.remove('hidden');
}

function nextQuestion() {
  answered = false;
  currentQ++;
  if (currentQ < currentQuiz.length) {
    renderQuestion();
  } else {
    finishQuiz();
  }
}

function finishQuiz() {
  const percent = Math.round((score / currentQuiz.length) * 100);
  quizHistory.unshift({ name: quizName, score, total: currentQuiz.length, percent, date: new Date().toLocaleString() });
  Store.set('quizHistory', quizHistory);
  updateDashboard();
  let msg = percent >= 80 ? '🏆 Excellent!' : percent >= 50 ? '👍 Good job!' : '📚 Keep practicing!';
  document.getElementById('quizArea').innerHTML = `
    <div class="card text-center">
      <div style="font-size:4rem">${percent >= 80 ? '🎉' : '📊'}</div>
      <h2>${msg}</h2>
      <div class="stat-value">${percent}%</div>
      <p>You scored ${score} out of ${currentQuiz.length}</p>
      <button class="btn mt-1" onclick="backToQuizzes()">Back to Quizzes</button>
    </div>`;
}

function backToQuizzes() {
  document.getElementById('quizArea').classList.add('hidden');
  document.getElementById('quizSelect').classList.remove('hidden');
}

/* ============ FLASHCARDS ============ */
let currentCard = 0;

function renderFlashcard() {
  if (!flashcards.length) {
    document.getElementById('flashcardContainer').innerHTML =
      `<div class="empty-state"><div class="empty-state-icon">🃏</div><p>No flashcards yet!</p></div>`;
    document.getElementById('flashcardControls').innerHTML = '';
    return;
  }
  if (currentCard >= flashcards.length) currentCard = 0;
  const card = flashcards[currentCard];
  document.getElementById('flashcardContainer').innerHTML = `
    <div class="flashcard" id="fc" onclick="this.classList.toggle('flipped')">
      <div class="flashcard-inner">
        <div class="flashcard-front">${escapeHtml(card.front)}</div>
        <div class="flashcard-back">${escapeHtml(card.back)}</div>
      </div>
    </div>`;
  document.getElementById('flashcardControls').innerHTML = `
    <div class="flex-between" style="max-width:400px; margin:0 auto;">
      <button class="btn btn-secondary" onclick="prevCard()">← Prev</button>
      <span class="badge">${currentCard + 1} / ${flashcards.length}</span>
      <button class="btn btn-secondary" onclick="nextCard()">Next →</button>
    </div>
    <button class="btn btn-danger btn-sm mt-1" onclick="deleteFlashcard()">🗑️ Delete This Card</button>`;
}

function nextCard() { currentCard = (currentCard + 1) % flashcards.length; renderFlashcard(); }
function prevCard() { currentCard = (currentCard - 1 + flashcards.length) % flashcards.length; renderFlashcard(); }

function openFlashcardModal() {
  document.getElementById('fcFront').value = '';
  document.getElementById('fcBack').value = '';
  document.getElementById('flashcardModal').classList.add('active');
}

function saveFlashcard() {
  const front = document.getElementById('fcFront').value.trim();
  const back = document.getElementById('fcBack').value.trim();
  if (!front || !back) { alert('Fill both sides'); return; }
  flashcards.push({ front, back });
  Store.set('flashcards', flashcards);
  closeModal('flashcardModal');
  currentCard = flashcards.length - 1;
  renderFlashcard();
}

function deleteFlashcard() {
  if (!confirm('Delete this flashcard?')) return;
  flashcards.splice(currentCard, 1);
  Store.set('flashcards', flashcards);
  currentCard = 0;
  renderFlashcard();
}

/* ============ PRACTICE TIMER ============ */
let timerInterval = null, timeLeft = 25 * 60, totalTime = 25 * 60;

function updateTimerDisplay() {
  const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const s = String(timeLeft % 60).padStart(2, '0');
  document.getElementById('timerDisplay').textContent = `${m}:${s}`;
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      stats.sessions++;
      Store.set('stats', stats);
      document.getElementById('sessionCount').textContent = stats.sessions;
      alert('🎉 Session complete! Great work!');
      timeLeft = totalTime;
      updateTimerDisplay();
    }
  }, 1000);
}

function pauseTimer() { clearInterval(timerInterval); timerInterval = null; }
function resetTimer() { pauseTimer(); timeLeft = totalTime; updateTimerDisplay(); }
function setTimer(min) { pauseTimer(); totalTime = min * 60; timeLeft = totalTime; updateTimerDisplay(); }

/* ============ MEMORY GAME ============ */
let memCards = [], flippedCards = [], memMoves = 0, memMatches = 0, memLock = false;

function initMemoryGame() {
  const emojis = ['🎯', '🚀', '⭐', '🎨', '🎵', '🏆', '💡', '🔥'];
  memCards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
  flippedCards = []; memMoves = 0; memMatches = 0; memLock = false;
  document.getElementById('memMoves').textContent = 0;
  document.getElementById('memMatches').textContent = 0;
  document.getElementById('memoryBoard').innerHTML = memCards.map((e, i) =>
    `<div class="memory-card" data-i="${i}" onclick="flipMemCard(${i})">${e}</div>`).join('');
}

function flipMemCard(i) {
  if (memLock) return;
  const card = document.querySelector(`.memory-card[data-i="${i}"]`);
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  flippedCards.push(i);
  if (flippedCards.length === 2) {
    memMoves++;
    document.getElementById('memMoves').textContent = memMoves;
    memLock = true;
    const [a, b] = flippedCards;
    if (memCards[a] === memCards[b]) {
      setTimeout(() => {
        document.querySelector(`.memory-card[data-i="${a}"]`).classList.add('matched');
        document.querySelector(`.memory-card[data-i="${b}"]`).classList.add('matched');
        flippedCards = []; memLock = false;
        memMatches++;
        document.getElementById('memMatches').textContent = memMatches;
        if (memMatches === 8) {
          stats.gamesPlayed++;
          Store.set('stats', stats);
          setTimeout(() => alert(`🏆 You won in ${memMoves} moves!`), 300);
        }
      }, 500);
    } else {
      setTimeout(() => {
        document.querySelector(`.memory-card[data-i="${a}"]`).classList.remove('flipped');
        document.querySelector(`.memory-card[data-i="${b}"]`).classList.remove('flipped');
        flippedCards = []; memLock = false;
      }, 800);
    }
  }
}

/* ============ TYPING TEST ============ */
const typingSentences = [
  'The quick brown fox jumps over the lazy dog.',
  'Learning new skills every day makes you stronger.',
  'Practice makes perfect when you stay consistent.',
  'Knowledge is power and reading is the key to it.',
  'Technology has transformed the way people communicate and share information across the world.',
  'Consistent effort is often more valuable than occasional bursts of motivation.',
  'Frontend development combines creativity and logic to build engaging user experiences.',
  'Success is not determined by luck alone; it requires dedication and continuous learning.',
  'Reading books helps improve knowledge and vocabulary.',
  'Artificial intelligence is revolutionizing industries by automating repetitive tasks and enabling data-driven decision-making.',
  'The rapid evolution of technology demands continuous adaptation from both businesses and individuals.'
];
let typingStart = null, typingTarget = '';

function startTypingTest() {
  typingTarget = typingSentences[Math.floor(Math.random() * typingSentences.length)];
  document.getElementById('typingText').textContent = typingTarget;
  const input = document.getElementById('typingInput');
  input.disabled = false;
  input.value = '';
  input.focus();
  typingStart = null;
  document.getElementById('wpm').textContent = 0;
  document.getElementById('accuracy').textContent = 100;
}

function checkTyping() {
  const input = document.getElementById('typingInput').value;
  if (!typingStart) typingStart = Date.now();
  let correct = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === typingTarget[i]) correct++;
  }
  const accuracy = input.length ? Math.round((correct / input.length) * 100) : 100;
  document.getElementById('accuracy').textContent = accuracy;
  const minutes = (Date.now() - typingStart) / 60000;
  const words = input.trim().split(/\s+/).length;
  const wpm = minutes > 0 ? Math.round(words / minutes) : 0;
  document.getElementById('wpm').textContent = wpm;
  if (input === typingTarget) {
    document.getElementById('typingInput').disabled = true;
    stats.gamesPlayed++;
    Store.set('stats', stats);
    setTimeout(() => alert(`✅ Done! Speed: ${wpm} WPM, Accuracy: ${accuracy}%`), 100);
  }
}

/* ============ PROGRESS ============ */
function renderProgress() {
  const hist = document.getElementById('quizHistory');
  if (!quizHistory.length) {
    hist.innerHTML = '<p style="color:var(--text-light)">No quizzes taken yet.</p>';
  } else {
    hist.innerHTML = quizHistory.slice(0, 10).map(h => `
      <div class="flex-between" style="padding:0.75rem 0; border-bottom:1px solid var(--border)">
        <div><strong>${h.name}</strong><br><small style="color:var(--text-light)">${h.date}</small></div>
        <span class="badge" style="background:${h.percent >= 50 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}; color:${h.percent >= 50 ? 'var(--success)' : 'var(--danger)'}">${h.score}/${h.total} (${h.percent}%)</span>
      </div>`).join('');
  }
  document.getElementById('progSessions').textContent = stats.sessions;
  document.getElementById('progFlashcards').textContent = flashcards.length;
  document.getElementById('progGames').textContent = stats.gamesPlayed;
}

function resetAllData() {
  if (!confirm('This will delete ALL your data. Are you sure?')) return;
  localStorage.clear();
  location.reload();
}

/* ============ UTILITIES ============ */
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function updateStreak() {
  const today = new Date().toDateString();
  if (stats.lastVisit !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    stats.streak = (stats.lastVisit === yesterday) ? stats.streak + 1 : 1;
    stats.lastVisit = today;
    Store.set('stats', stats);
  }
}

/* ============ INIT ============ */
function init() {
  if (Store.get('darkMode', false)) document.body.classList.add('dark');
  updateStreak();
  renderCourses();
  renderNotes();
  renderQuizSelect();
  renderFlashcard();
  initMemoryGame();
  startTypingTest();
  document.getElementById('typingInput').disabled = true;
  updateTimerDisplay();
  document.getElementById('sessionCount').textContent = stats.sessions;
  updateDashboard();
  newGuessGame();          // NEW
  document.getElementById('footerYear').textContent = new Date().getFullYear();

  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('active'); });
  });
}

/* init() is called at the end of the file, after all data is declared */


/* ============ USER & POINTS ============ */
let user = Store.get('user', { name: 'You', points: 0 });

// Points config
const POINTS = { quiz: 10, perfectQuiz: 25, session: 15, flashcard: 5, game: 20 };

// Fake competitors so the leaderboard isn't lonely
let bots = Store.get('bots', [
  { name: 'Anjali 👩🏻', points: 340 },
  { name: 'Manish 👨🏻', points: 280 },
  { name: 'Sameer 👧🏻', points: 410 },
  { name: 'Rahul 🧒🏻', points: 190 },
  { name: 'Riya 👩🏻‍🦰', points: 250 }
]);

function calcUserPoints() {
  let pts = 0;
  pts += quizHistory.length * POINTS.quiz;
  pts += quizHistory.filter(q => q.percent === 100).length * POINTS.perfectQuiz;
  pts += stats.sessions * POINTS.session;
  pts += flashcards.length * POINTS.flashcard;
  pts += stats.gamesPlayed * POINTS.game;
  return pts;
}

function renderLeaderboard() {
  const myPoints = calcUserPoints();
  const all = [...bots, { name: user.name + ' (You)', points: myPoints, isMe: true }]
    .sort((a, b) => b.points - a.points);

  const medals = ['🥇', '🥈', '🥉'];
  document.getElementById('leaderboardList').innerHTML = all.map((p, i) => `
    <div class="flex-between" style="padding:0.85rem 1rem; margin-bottom:0.5rem; border-radius:12px;
      background:${p.isMe ? 'rgba(79,70,229,0.12)' : 'var(--bg)'};
      border:${p.isMe ? '2px solid var(--primary)' : '1px solid var(--border)'}">
      <div style="display:flex; align-items:center; gap:0.75rem;">
        <span style="font-size:1.3rem; min-width:2rem;">${medals[i] || '#' + (i + 1)}</span>
        <strong>${escapeHtml(p.name)}</strong>
      </div>
      <span class="badge">${p.points} pts</span>
    </div>
  `).join('');

  document.getElementById('pointsBreakdown').innerHTML = `
    <div class="stat-card"><div class="stat-value">${quizHistory.length * POINTS.quiz}</div><div class="stat-label">📋 From Quizzes</div></div>
    <div class="stat-card"><div class="stat-value">${stats.sessions * POINTS.session}</div><div class="stat-label">⏱️ From Sessions</div></div>
    <div class="stat-card"><div class="stat-value">${flashcards.length * POINTS.flashcard}</div><div class="stat-label">🃏 From Flashcards</div></div>
    <div class="stat-card"><div class="stat-value">${stats.gamesPlayed * POINTS.game}</div><div class="stat-label">🎮 From Games</div></div>
  `;
}

function openNameModal() {
  document.getElementById('userName').value = user.name === 'You' ? '' : user.name;
  document.getElementById('nameModal').classList.add('active');
}

function saveName() {
  const name = document.getElementById('userName').value.trim();
  if (!name) { alert('Please enter a name'); return; }
  user.name = name;
  Store.set('user', user);
  closeModal('nameModal');
  renderLeaderboard();
}

/* ============ STUDY LIBRARY ============ */
const studyContent = [
{ icon: '🌐', title: 'HTML Basics', cat: 'Web', body: 'HTML uses tags to structure content. Key tags: <h1>-<h6> for headings, <p> for paragraphs, <a> for links, <img> for images, <ul>/<ol> for lists. Always close your tags and nest them properly.' },
{ icon: '🎨', title: 'CSS Fundamentals', cat: 'Web', body: 'CSS styles HTML. Selectors target elements (.class, #id, tag). Box model: content, padding, border, margin. Use Flexbox and Grid for layouts. Variables (--name) keep colors consistent.' },
{ icon: '⚡', title: 'JavaScript Core', cat: 'Web', body: 'JS adds interactivity. Variables: let, const. Functions run code blocks. DOM methods like getElementById() let you change the page. Use events (onclick, oninput) to respond to users.' },
{ icon: '🐍', title: 'Python Intro', cat: 'Programming', body: 'Python is readable and beginner-friendly. Use indentation for blocks. Lists [], dicts {}, and loops (for/while) are essential. Functions use def. Print with print().' },
{ icon: '📐', title: 'Algebra Essentials', cat: 'Math', body: 'Solve for x by isolating it. Order of operations: PEMDAS. A linear equation graphs as a straight line (y = mx + b), where m is slope and b is the y-intercept.' },
{ icon: '🔢', title: 'Fractions & Percentages', cat: 'Math', body: 'A percentage is a fraction of 100. To find 15% of 200: 0.15 × 200 = 30. Convert fractions to decimals by dividing the numerator by the denominator.' },
{ icon: '🔬', title: 'The Scientific Method', cat: 'Science', body: 'Steps: observe, ask a question, form a hypothesis, experiment, analyze data, conclude. A good experiment changes one variable at a time and has a control group.' },
{ icon: '🌍', title: 'World Geography', cat: 'Geography', body: 'There are 7 continents and 5 oceans. Lines of latitude run east-west; longitude runs north-south. The equator divides Earth into Northern and Southern hemispheres.' },
{ icon: '🗣️', title: 'Grammar Quick Guide', cat: 'Language', body: 'A sentence needs a subject and a verb. Nouns name things, verbs show action, adjectives describe nouns, adverbs describe verbs. Use commas to separate clauses.' },
{ icon: '🧠', title: 'Effective Study Tips', cat: 'General', body: 'Use spaced repetition and active recall. Study in focused 25-min blocks (Pomodoro). Teach what you learn to someone else. Sleep helps memory consolidation.' },
{ icon: '🎨', title: 'CSS Fundamentals', cat: 'Web', body: 'CSS styles web pages using selectors and properties. Common properties include color, background, margin, padding, border, and font-size. CSS can be applied inline, internally, or through external stylesheets.' },
{ icon: '⚡', title: 'JavaScript Basics', cat: 'Programming', body: 'JavaScript adds interactivity to web pages. Variables can be declared using let, const, and var. Functions, loops, and conditionals are essential concepts for creating dynamic applications.' },
{ icon: '⚛️', title: 'React Introduction', cat: 'Programming', body: 'React is a JavaScript library for building user interfaces. It uses reusable components, JSX syntax, and a virtual DOM to efficiently update and render content.' },
{ icon: '🟢', title: 'Node.js Basics', cat: 'Programming', body: 'Node.js allows JavaScript to run on servers. It uses an event-driven architecture and non-blocking I/O, making it suitable for scalable backend applications.' },
{ icon: '🐍', title: 'Python Fundamentals', cat: 'Programming', body: 'Python is a high-level programming language known for its readability. It supports object-oriented, procedural, and functional programming paradigms.' },
{ icon: '☕', title: 'Java Basics', cat: 'Programming', body: 'Java is an object-oriented programming language. Key concepts include classes, objects, inheritance, polymorphism, encapsulation, and abstraction.' },
{ icon: '🔢', title: 'Variables and Data Types', cat: 'Programming', body: 'Variables store data values. Common data types include strings, numbers, booleans, arrays, objects, and null values. Choosing the correct type improves program efficiency.' },
{ icon: '🔁', title: 'Loops', cat: 'Programming', body: 'Loops allow repeated execution of code. Common loops include for, while, and do-while. Use loops carefully to avoid infinite execution.' },
{ icon: '🧩', title: 'Functions', cat: 'Programming', body: 'Functions are reusable blocks of code designed to perform specific tasks. They improve code organization, readability, and maintainability.' },
{ icon: '📊', title: 'Arrays', cat: 'Programming', body: 'Arrays store multiple values in a single variable. Common operations include adding, removing, sorting, filtering, and searching elements.' },
{ icon: '🗂️', title: 'Objects', cat: 'Programming', body: 'Objects store data as key-value pairs. They are useful for representing real-world entities and organizing related information.' },
{ icon: '🛢️', title: 'SQL Basics', cat: 'Database', body: 'SQL is used to manage relational databases. Common commands include SELECT, INSERT, UPDATE, DELETE, and CREATE TABLE.' },
{ icon: '🍃', title: 'MongoDB Basics', cat: 'Database', body: 'MongoDB is a NoSQL database that stores data in flexible JSON-like documents. Collections are used instead of traditional tables.' },
{ icon: '🌍', title: 'HTTP Methods', cat: 'Web', body: 'HTTP methods define actions performed on resources. GET retrieves data, POST creates data, PUT updates data, and DELETE removes data.' },
{ icon: '🔐', title: 'Cybersecurity Basics', cat: 'Security', body: 'Cybersecurity focuses on protecting systems and data. Strong passwords, encryption, firewalls, and regular updates are essential security practices.' },
{ icon: '☁️', title: 'Cloud Computing', cat: 'Technology', body: 'Cloud computing provides on-demand access to computing resources over the internet. Popular models include IaaS, PaaS, and SaaS.' },
{ icon: '🤖', title: 'Artificial Intelligence', cat: 'AI', body: 'Artificial Intelligence enables machines to simulate human intelligence. Applications include chatbots, recommendation systems, computer vision, and automation.' },
{ icon: '📚', title: 'Data Structures', cat: 'Computer Science', body: 'Data structures organize and store data efficiently. Common examples include arrays, linked lists, stacks, queues, trees, and graphs.' },
{ icon: '⚙️', title: 'Algorithms', cat: 'Computer Science', body: 'Algorithms are step-by-step procedures used to solve problems. Efficient algorithms improve application performance and resource usage.' },
{ icon: '🌳', title: 'Binary Trees', cat: 'Computer Science', body: 'A binary tree is a hierarchical data structure where each node has at most two children. Traversal methods include preorder, inorder, and postorder.' },
{ icon: '🧠', title: 'Object-Oriented Programming', cat: 'Programming', body: 'OOP organizes code into classes and objects. Core principles include encapsulation, inheritance, polymorphism, and abstraction.' },
{ icon: '🌐', title: 'Responsive Design', cat: 'Web', body: 'Responsive design ensures websites work well on different screen sizes. Media queries, flexible layouts, and relative units are commonly used.' },
{ icon: '📡', title: 'Computer Networks', cat: 'Technology', body: 'Computer networks connect devices for communication. Common concepts include IP addresses, routers, switches, DNS, and network protocols.' },
{ icon: '💻', title: 'Operating Systems', cat: 'Computer Science', body: 'An operating system manages hardware and software resources. Examples include Windows, Linux, macOS, and Android.' },
{ icon: '📝', title: 'Git Basics', cat: 'Tools', body: 'Git is a version control system that tracks code changes. Important commands include git init, git add, git commit, git push, and git pull.' },
{ icon: '🚀', title: 'API Basics', cat: 'Web', body: 'APIs allow applications to communicate with each other. REST APIs commonly use JSON data and HTTP methods for data exchange.' },
{ icon: '📈', title: 'Machine Learning', cat: 'AI', body: 'Machine Learning enables systems to learn from data without explicit programming. Common types include supervised, unsupervised, and reinforcement learning.' },
{ icon: '🧮', title: 'Mathematics Fundamentals', cat: 'Math', body: 'Mathematics forms the foundation of computing. Important topics include algebra, geometry, probability, statistics, and calculus.' },
{ icon: '🔬', title: 'Physics Basics', cat: 'Science', body: 'Physics studies matter, energy, motion, and forces. Key concepts include velocity, acceleration, gravity, energy, and momentum.' },
{ icon: '⚗️', title: 'Chemistry Basics', cat: 'Science', body: 'Chemistry explores substances and their interactions. Atoms, molecules, elements, compounds, and chemical reactions are fundamental concepts.' },
{ icon: '🧬', title: 'Biology Basics', cat: 'Science', body: 'Biology is the study of living organisms. Topics include cells, genetics, evolution, ecosystems, and human anatomy.' },
{ icon: '📖', title: 'English Grammar', cat: 'Language', body: 'Grammar provides rules for constructing sentences. Important areas include nouns, verbs, adjectives, tenses, punctuation, and sentence structure.' },
{ icon: '🧩', title: 'Logical Reasoning', cat: 'Aptitude', body: 'Logical reasoning involves analyzing patterns, relationships, and sequences to solve problems efficiently and accurately.' },
{ icon: '🎯', title: 'Interview Preparation', cat: 'Career', body: 'Interview success requires communication skills, technical knowledge, confidence, and preparation. Practice common questions and explain concepts clearly.' }
];

function renderStudy() {
  const search = (document.getElementById('studySearch').value || '').toLowerCase();
  const filtered = studyContent.filter(s =>
    s.title.toLowerCase().includes(search) || s.body.toLowerCase().includes(search) || s.cat.toLowerCase().includes(search));
  const grid = document.getElementById('studyGrid');
  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">📚</div><p>No topics found.</p></div>`;
    return;
  }
  grid.innerHTML = filtered.map(s => `
    <div class="note-card" style="border-left-color:var(--secondary)">
      <span class="badge">${s.cat}</span>
      <h3 style="margin:0.5rem 0">${s.icon} ${escapeHtml(s.title)}</h3>
      <p>${escapeHtml(s.body)}</p>
    </div>
  `).join('');
}

/* ============ COURSE DETAIL & ENROLLMENT ============ */
const courseLessons = {
 'Web Development': [
'Intro to HTML',
'HTML Document Structure',
'Working with Tags',
'Forms & Inputs',
'Tables',
'Semantic HTML',
'Accessibility Basics',
'CSS Introduction',
'CSS Selectors',
'Colors & Typography',
'The Box Model',
'Positioning',
'Flexbox',
'CSS Grid',
'Responsive Design',
'CSS Animations',
'JavaScript Basics',
'Variables & Data Types',
'Functions',
'Arrays & Objects',
'DOM Manipulation',
'Events',
'Fetch API',
'Building a Project'
],
  'Python Programming': [
'Setup & Hello World',
'Variables & Types',
'User Input',
'Operators',
'Conditional Statements',
'Loops',
'Lists',
'Tuples',
'Sets',
'Dictionaries',
'Functions',
'Lambda Functions',
'Modules',
'File Handling',
'Error Handling',
'Object Oriented Programming',
'Classes & Objects',
'Inheritance',
'Polymorphism',
'Encapsulation',
'Working with APIs',
'JSON Handling',
'Database Basics',
'SQLite',
'NumPy Basics',
'Pandas Basics',
'Data Visualization',
'Web Scraping',
'Automation Scripts',
'Mini Project'
],
  'Mathematics': [
'Number Basics',
'Integers',
'Decimals',
'Fractions',
'Percentages',
'Ratios',
'Algebra Intro',
'Linear Equations',
'Quadratic Equations',
'Inequalities',
'Functions',
'Geometry Basics',
'Angles',
'Triangles',
'Circles',
'Coordinate Geometry',
'Graphing',
'Statistics',
'Mean Median Mode',
'Probability',
'Sequences',
'Trigonometry Basics',
'Sine Cosine Tangent',
'Limits',
'Derivatives',
'Applications of Derivatives',
'Integrals',
'Applications of Integrals',
'Vectors',
'Matrices',
'Complex Numbers',
'Intro to Calculus'
],
 'Science': [
    'Scientific Method',
    'Matter & Atoms',
    'States of Matter',
    'Chemical Reactions',
    'Forces & Motion',
    'Newton’s Laws',
    'Work & Energy',
    'Heat & Temperature',
    'Light & Reflection',
    'Sound Waves',
    'Electricity',
    'Magnetism',
    'Solar System',
    'Earth Structure',
    'Weather & Climate',
    'Natural Resources',
    'Cells & Biology',
    'Human Digestive System',
    'Human Respiratory System',
    'Human Circulatory System',
    'Plant Life',
    'Photosynthesis',
    'Ecosystems',
    'Science in Daily Life'
],

'English': [
    'Parts of Speech',
    'Nouns',
    'Pronouns',
    'Verbs',
    'Adjectives',
    'Adverbs',
    'Articles',
    'Prepositions',
    'Conjunctions',
    'Sentence Structure',
    'Tenses',
    'Active & Passive Voice',
    'Direct & Indirect Speech',
    'Vocabulary Building',
    'Synonyms & Antonyms',
    'Reading Comprehension',
    'Paragraph Writing',
    'Essay Writing',
    'Letter Writing',
    'Story Writing',
    'Public Speaking',
    'Communication Skills',
    'Grammar Practice',
    'English Fluency'
],

'History': [
    'Introduction to History',
    'Sources of History',
    'Ancient Civilizations',
    'Indus Valley Civilization',
    'Vedic Age',
    'Maurya Empire',
    'Gupta Empire',
    'Medieval India',
    'Delhi Sultanate',
    'Mughal Empire',
    'European Arrival in India',
    'British East India Company',
    'Revolt of 1857',
    'Indian National Movement',
    'Mahatma Gandhi',
    'Non-Cooperation Movement',
    'Civil Disobedience Movement',
    'Quit India Movement',
    'Indian Independence',
    'World War I',
    'World War II',
    'United Nations',
    'Modern India',
    'Historical Significance'
],

'C Programming': [
    'Introduction to C',
    'Structure of C Program',
    'Variables & Data Types',
    'Input & Output',
    'Operators',
    'Conditional Statements',
    'Loops',
    'Functions',
    'Arrays',
    'Strings',
    'Pointers',
    'Structures',
    'File Handling',
    'Memory Management',
    'Mini Project'
  ],

'Java Programming': [
    'Introduction to Java',
    'Setting Up & First Program',
    'Variables & Data Types',
    'Operators',
    'Conditional Statements',
    'Loops',
    'Arrays',
    'Strings',
    'Methods',
    'Object-Oriented Programming',
    'Classes & Objects',
    'Inheritance & Polymorphism',
    'Interfaces & Abstraction',
    'Exception Handling',
    'Mini Project'
  ],

'C++ Programming': [
    'Introduction to C++',
    'Structure of a C++ Program',
    'Variables & Data Types',
    'Input & Output (cin/cout)',
    'Operators',
    'Conditional Statements',
    'Loops',
    'Functions',
    'Arrays & Strings',
    'Pointers & References',
    'Classes & Objects',
    'Constructors & Destructors',
    'Inheritance & Polymorphism',
    'Templates & STL Basics',
    'Mini Project'
  ],

'JavaScript Programming': [
    'Introduction to JavaScript',
    'Variables & Data Types',
    'Operators',
    'Conditional Statements',
    'Loops',
    'Functions & Arrow Functions',
    'Arrays',
    'Objects',
    'DOM Manipulation',
    'Events',
    'ES6+ Features',
    'Asynchronous JavaScript',
    'Promises & Async/Await',
    'Error Handling',
    'Mini Project'
  ],

'PHP Programming': [
    'Introduction to PHP',
    'Setting Up & First Script',
    'Variables & Data Types',
    'Operators',
    'Conditional Statements',
    'Loops',
    'Functions',
    'Arrays',
    'Strings',
    'Working with Forms',
    'Superglobals',
    'Sessions & Cookies',
    'File Handling',
    'MySQL with PDO',
    'Mini Project'
  ],

'Rust Programming': [
    'Introduction to Rust',
    'Setting Up & First Program',
    'Variables & Mutability',
    'Data Types',
    'Functions',
    'Conditional Statements',
    'Loops',
    'Ownership & Borrowing',
    'References & Slices',
    'Structs',
    'Enums & Pattern Matching',
    'Collections (Vec, HashMap)',
    'Error Handling',
    'Traits & Generics',
    'Mini Project'
  ],

'Go Programming': [
    'Introduction to Go',
    'Setting Up & First Program',
    'Variables & Data Types',
    'Operators',
    'Conditional Statements',
    'Loops',
    'Functions',
    'Arrays & Slices',
    'Maps',
    'Structs',
    'Pointers',
    'Interfaces',
    'Goroutines & Channels',
    'Error Handling',
    'Mini Project'
  ],

'Cyber Security': [
    'Introduction to Cyber Security',
    'Types of Cyber Threats',
    'Malware & Viruses',
    'Phishing & Social Engineering',
    'Network Security Basics',
    'Firewalls & VPNs',
    'Cryptography Basics',
    'Authentication & Access Control',
    'Security Policies & Compliance',
    'Web Application Security',
    'Incident Response',
    'Digital Forensics Basics',
    'Cloud Security',
    'Security Tools Overview',
    'Mini Project'
  ],

'Ethical Hacking': [
    'Introduction to Ethical Hacking',
    'Hacking Phases & Methodology',
    'Footprinting & Reconnaissance',
    'Scanning Networks',
    'Enumeration',
    'Vulnerability Analysis',
    'System Hacking Basics',
    'Malware Threats',
    'Sniffing',
    'Social Engineering Attacks',
    'Web Server & App Hacking',
    'SQL Injection',
    'Wireless Network Hacking',
    'Cryptography for Hackers',
    'Mini Project'
  ],

'Software Engineering': [
    'Introduction to Software Engineering',
    'SDLC Models',
    'Requirement Analysis',
    'Software Design Principles',
    'UML Diagrams',
    'Agile & Scrum',
    'Coding Standards',
    'Software Testing Basics',
    'Types of Testing',
    'Version Control with Git',
    'Software Project Management',
    'Software Quality Assurance',
    'Maintenance & Documentation',
    'DevOps Basics',
    'Mini Project'
  ],

'Data Structures & Algorithms': [
    'Introduction to DSA',
    'Time & Space Complexity',
    'Arrays',
    'Linked Lists',
    'Stacks',
    'Queues',
    'Recursion',
    'Searching Algorithms',
    'Sorting Algorithms',
    'Trees',
    'Binary Search Trees',
    'Graphs',
    'Hashing',
    'Dynamic Programming',
    'Mini Project'
  ],

'DBMS': [
    'Introduction to DBMS',
    'Data Models',
    'ER Diagrams',
    'Relational Model',
    'SQL Basics',
    'Joins',
    'Normalization',
    'Transactions',
    'Indexing',
    'Keys & Constraints',
    'Views',
    'Stored Procedures & Triggers',
    'NoSQL Basics',
    'Database Security',
    'Mini Project'
  ]
};

let courseProgress = Store.get('courseProgress', {});
let currentCourse = null;

function enrollCourse(title) {
  currentCourse = title;
  if (!courseProgress[title]) courseProgress[title] = [];
  Store.set('courseProgress', courseProgress);
  renderCourseDetail();
  showPage('courseDetail', null);
}

function renderCourseDetail() {
  const lessons = courseLessons[currentCourse] || [];
  const done = courseProgress[currentCourse] || [];
  document.getElementById('courseDetailTitle').textContent = currentCourse;

  const pct = lessons.length ? Math.round((done.length / lessons.length) * 100) : 0;
  document.getElementById('courseProgressFill').style.width = pct + '%';
  document.getElementById('courseProgressText').textContent = pct + '% complete';

  document.getElementById('lessonList').innerHTML = lessons.map((lesson, i) => {
    const isDone = done.includes(i);
    return `
      <div class="flex-between" style="padding:0.85rem 1rem; margin-bottom:0.5rem; border-radius:12px;
        background:var(--bg); border:1px solid var(--border)">
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <span style="font-size:1.2rem">${isDone ? '✅' : '📘'}</span>
          <strong style="${isDone ? 'text-decoration:line-through; color:var(--text-light)' : ''}">
            Lesson ${i + 1}: ${escapeHtml(lesson)}</strong>
        </div>
        <div style="display:flex; gap:8px;">

  <button class="btn btn-sm"
          onclick="openLesson(${i})">
    📖 Open
  </button>

  <button class="btn btn-sm ${isDone ? 'btn-secondary' : 'btn-success'}"
          onclick="toggleLesson(${i})">
    ${isDone ? '↺ Undo' : '✓ Complete'}
  </button>

</div>
      </div>`;
  }).join('');
}

function toggleLesson(i) {
  const done = courseProgress[currentCourse];
  const idx = done.indexOf(i);
  if (idx === -1) done.push(i); else done.splice(idx, 1);
  Store.set('courseProgress', courseProgress);
  renderCourseDetail();
}
/* ==========================================
   LESSON VIEWER ENGINE
========================================== */

let currentLessonIndex = 0;

const lessonContent = {

  'Web Development': {

'Intro to HTML': `
HTML (HyperText Markup Language) is the standard language used to create webpages.

Key Concepts:
• Structure of a webpage
• Tags and elements
• Browser rendering

Basic Example:
<html>
<head>
<title>My Website</title>
</head>
<body>
<h1>Hello World</h1>
</body>
</html>

Practice:
Create a webpage with a heading and paragraph.
`,

'HTML Document Structure': `
Every HTML document follows a standard structure.

Important Elements:
• <!DOCTYPE html>
• html
• head
• title
• body

The head contains metadata while the body contains visible content.

Practice:
Build a complete HTML page from scratch.
`,

'Working with Tags': `
HTML tags define webpage elements.

Common Tags:
• h1-h6
• p
• a
• img
• div
• span

Best Practices:
• Close tags properly
• Nest tags correctly
• Use semantic tags

Practice:
Create a page containing headings, images and links.
`,

'Forms & Inputs': `
Forms collect user data.

Input Types:
• text
• email
• password
• number
• checkbox
• radio

Example:
<form>
<input type="text">
<button>Submit</button>
</form>

Practice:
Build a registration form.
`,

'Tables': `
Tables organize data into rows and columns.

Tags:
• table
• tr
• td
• th

Example:
<table>
<tr>
<th>Name</th>
<th>Age</th>
</tr>
</table>

Practice:
Create a student information table.
`,

'Semantic HTML': `
Semantic tags improve readability and SEO.

Examples:
• header
• nav
• main
• section
• article
• footer

Benefits:
• Better accessibility
• Better search ranking
• Cleaner code

Practice:
Convert a div-based layout into semantic HTML.
`,

'Accessibility Basics': `
Accessibility ensures websites work for everyone.

Tips:
• Add alt text to images
• Use proper headings
• Maintain color contrast
• Label form inputs

Accessibility improves user experience and SEO.
`,

'CSS Introduction': `
CSS controls the appearance of webpages.

Ways to Add CSS:
• Inline
• Internal
• External

Example:
h1{
 color:blue;
}

Practice:
Style a webpage using CSS.
`,

'CSS Selectors': `
Selectors target HTML elements.

Types:
• Element Selector
• Class Selector
• ID Selector
• Universal Selector

Example:
.card{
 padding:20px;
}

Practice:
Create multiple styled cards.
`,

'Colors & Typography': `
Typography improves readability.

Important Properties:
• color
• font-size
• font-family
• line-height
• text-align

Practice:
Design an attractive article page.
`,

'The Box Model': `
Every element is a box.

Components:
• Content
• Padding
• Border
• Margin

Understanding spacing is essential for layouts.

Practice:
Experiment with different spacing values.
`,

'Positioning': `
Position controls element placement.

Values:
• static
• relative
• absolute
• fixed
• sticky

Practice:
Create a sticky navigation bar.
`,

'Flexbox': `
Flexbox simplifies layouts.

Properties:
• display:flex
• justify-content
• align-items
• flex-direction

Flexbox is ideal for responsive designs.

Practice:
Build a navigation menu using Flexbox.
`,

'CSS Grid': `
Grid creates two-dimensional layouts.

Properties:
• display:grid
• grid-template-columns
• gap

Grid is powerful for dashboard layouts.

Practice:
Create a photo gallery using Grid.
`,

'Responsive Design': `
Responsive design adapts to different screen sizes.

Tools:
• Media Queries
• Relative Units
• Flexible Layouts

Example:
@media(max-width:768px){}

Practice:
Make a webpage mobile-friendly.
`,

'CSS Animations': `
Animations improve user engagement.

Features:
• transition
• transform
• keyframes

Example:
transition:0.3s ease;

Practice:
Create animated buttons.
`,

'JavaScript Basics': `
JavaScript adds interactivity.

Topics:
• Variables
• Functions
• Conditions
• Loops

Example:
let name="John";

Practice:
Display a greeting message.
`,

'Variables & Data Types': `
Variables store information.

Types:
• String
• Number
• Boolean
• Array
• Object

Practice:
Create variables for a student profile.
`,

'Functions': `
Functions organize reusable code.

Example:
function greet(){
 console.log("Hello");
}

Benefits:
• Reusability
• Cleaner code

Practice:
Create a calculator function.
`,

'Arrays & Objects': `
Arrays store multiple values.

Objects store key-value pairs.

Example:
let user={
 name:"John"
};

Practice:
Create a product catalog.
`,

'DOM Manipulation': `
DOM allows JavaScript to modify HTML.

Methods:
• getElementById()
• querySelector()

Practice:
Change text dynamically using JavaScript.
`,

'Events': `
Events respond to user actions.

Examples:
• click
• input
• submit
• keydown

Practice:
Create a button click counter.
`,

'Fetch API': `
Fetch retrieves data from servers.

Example:
fetch(url)
.then(response=>response.json())

Used for APIs and dynamic applications.

Practice:
Display data from a public API.
`,

'Building a Project': `
Final Project:
Personal Portfolio Website

Sections:
• Hero
• About
• Skills
• Projects
• Contact

Requirements:
• Responsive Design
• Modern UI
• JavaScript Interactivity

Goal:
Apply everything learned throughout the course.
`
  },

  'Python Programming': {

'Setup & Hello World': `
Python is a beginner-friendly programming language known for readability and simplicity.

Key Concepts:
• Installing Python
• Running Python Programs
• Using print()

Example:

print("Hello World")

Practice:
Install Python and create your first program.
`,

'Variables & Types': `
Variables store data values.

Common Data Types:
• String
• Integer
• Float
• Boolean

Example:

name = "Sarvesh"
age = 20

Practice:
Create variables representing a student profile.
`,

'User Input': `
The input() function allows users to provide information.

Example:

name = input("Enter your name: ")

Benefits:
• Interactive programs
• Dynamic data

Practice:
Create a greeting application.
`,

'Operators': `
Operators perform calculations and comparisons.

Types:
• Arithmetic
• Comparison
• Logical
• Assignment

Examples:

+
-
*
/
==
>

Practice:
Build a simple calculator.
`,

'Conditional Statements': `
Conditional statements control decision making.

Keywords:
• if
• elif
• else

Example:

if age >= 18:
    print("Adult")

Practice:
Check whether a user can vote.
`,

'Loops': `
Loops repeat tasks automatically.

Types:
• for loop
• while loop

Example:

for i in range(5):
    print(i)

Practice:
Print numbers from 1 to 100.
`,

'Lists': `
Lists store multiple values in one variable.

Example:

fruits = ["Apple","Mango","Banana"]

Operations:
• append()
• remove()
• sort()

Practice:
Create a shopping list.
`,

'Tuples': `
Tuples are immutable collections.

Example:

coordinates = (10,20)

Benefits:
• Faster than lists
• Safe from accidental changes

Practice:
Store geographical coordinates.
`,

'Sets': `
Sets store unique values.

Example:

numbers = {1,2,3,3}

Output:
{1,2,3}

Practice:
Remove duplicate values from a dataset.
`,

'Dictionaries': `
Dictionaries store key-value pairs.

Example:

student = {
 "name":"Sarvesh",
 "age":20
}

Practice:
Create a product catalog.
`,

'Functions': `
Functions organize reusable code.

Example:

def greet():
    print("Hello")

Benefits:
• Reusability
• Cleaner programs

Practice:
Create a calculator function.
`,

'Lambda Functions': `
Lambda functions are short anonymous functions.

Example:

square = lambda x:x*x

Benefits:
• Concise syntax
• Useful in filtering and sorting

Practice:
Create a lambda for multiplication.
`,

'Modules': `
Modules help organize code.

Example:

import math

print(math.sqrt(25))

Popular Modules:
• math
• random
• datetime

Practice:
Generate random numbers.
`,

'File Handling': `
Python can read and write files.

Example:

file = open("data.txt","r")

Methods:
• read()
• write()
• close()

Practice:
Create a notes application.
`,

'Error Handling': `
Error handling prevents crashes.

Keywords:
• try
• except
• finally

Example:

try:
  x=10/0
except:
  print("Error")

Practice:
Handle invalid user input.
`,

'Object Oriented Programming': `
OOP organizes code using objects.

Core Concepts:
• Class
• Object
• Inheritance
• Polymorphism

Benefits:
• Scalability
• Maintainability

Practice:
Design a Student class.
`,

'Classes & Objects': `
A class acts as a blueprint.

Example:

class Student:
  pass

s1 = Student()

Practice:
Create multiple objects.
`,

'Inheritance': `
Inheritance allows one class to acquire properties from another.

Example:

class Animal:
    pass

class Dog(Animal):
    pass

Practice:
Create a Teacher class inheriting Person.
`,

'Polymorphism': `
Polymorphism allows methods to behave differently.

Example:

car.start()
bike.start()

Practice:
Implement polymorphism in vehicles.
`,

'Encapsulation': `
Encapsulation protects data.

Benefits:
• Security
• Better organization

Practice:
Create private attributes inside a class.
`,

'Working with APIs': `
APIs allow applications to communicate.

Library:

import requests

Example:

requests.get(url)

Practice:
Fetch weather information from an API.
`,

'JSON Handling': `
JSON stores structured data.

Example:

import json

json.loads(data)

Practice:
Convert dictionaries into JSON.
`,

'Database Basics': `
Databases store information efficiently.

Concepts:
• Tables
• Rows
• Columns

Popular Databases:
• MySQL
• PostgreSQL
• SQLite

Practice:
Design a student database.
`,

'SQLite': `
SQLite is a lightweight database.

Example:

import sqlite3

conn = sqlite3.connect("app.db")

Practice:
Create and query tables.
`,

'NumPy Basics': `
NumPy is used for numerical computing.

Example:

import numpy as np

Features:
• Arrays
• Mathematical Operations

Practice:
Perform matrix calculations.
`,

'Pandas Basics': `
Pandas simplifies data analysis.

Example:

import pandas as pd

Features:
• DataFrames
• CSV Handling
• Data Cleaning

Practice:
Analyze student marks data.
`,

'Data Visualization': `
Visualization presents information graphically.

Libraries:
• Matplotlib
• Seaborn

Charts:
• Bar Chart
• Line Chart
• Pie Chart

Practice:
Visualize monthly sales data.
`,

'Web Scraping': `
Web scraping extracts website data.

Libraries:
• BeautifulSoup
• Requests

Applications:
• Data Collection
• Market Research

Practice:
Extract headlines from a webpage.
`,

'Automation Scripts': `
Python automates repetitive tasks.

Examples:
• File Organization
• Email Sending
• Report Generation

Practice:
Create a file renaming tool.
`,

'Mini Project': `
Final Project:
Student Management System

Features:
• Add Student
• View Student
• Delete Student
• Save Data

Technologies:
• Python
• File Handling
• Functions

Goal:
Apply everything learned throughout the course.
`

  },

  'Mathematics': {

'Number Basics': `
Numbers are the foundation of mathematics.

Types:
• Natural Numbers
• Whole Numbers
• Integers
• Rational Numbers

Examples:
1, 2, 3, -5, 0

Practice:
Identify different types of numbers from a given list.
`,

'Integers': `
Integers include positive numbers, negative numbers and zero.

Examples:
-5, -2, 0, 3, 10

Operations:
• Addition
• Subtraction
• Multiplication
• Division

Practice:
Solve integer addition and subtraction problems.
`,

'Decimals': `
Decimals represent fractions in a compact form.

Examples:
3.5
0.75
12.99

Applications:
• Money
• Measurements
• Statistics

Practice:
Convert fractions into decimals.
`,

'Fractions': `
Fractions represent parts of a whole.

Example:
1/2
3/4
5/8

Operations:
• Add Fractions
• Subtract Fractions
• Multiply Fractions
• Divide Fractions

Practice:
Solve fraction word problems.
`,

'Percentages': `
Percent means per hundred.

Formula:

Percentage = (Part / Whole) × 100

Applications:
• Discounts
• Exam Results
• Profit & Loss

Practice:
Calculate discounts on products.
`,

'Ratios': `
Ratios compare quantities.

Example:
2:3

Applications:
• Recipes
• Maps
• Business

Practice:
Simplify different ratios.
`,

'Algebra Intro': `
Algebra uses symbols and variables.

Example:

x + 5 = 10

Variable:
x

Practice:
Solve simple algebraic expressions.
`,

'Linear Equations': `
Linear equations form straight lines.

Example:

2x + 3 = 11

Solution:
x = 4

Practice:
Solve linear equations.
`,

'Quadratic Equations': `
Quadratic equations contain x².

Example:

x² + 5x + 6 = 0

Methods:
• Factorization
• Quadratic Formula

Practice:
Solve quadratic equations.
`,

'Inequalities': `
Inequalities compare values.

Symbols:
>
<
≥
≤

Example:

x > 5

Practice:
Represent inequalities on number lines.
`,

'Functions': `
Functions map inputs to outputs.

Example:

f(x)=x+2

If x=3

f(3)=5

Practice:
Evaluate different functions.
`,

'Geometry Basics': `
Geometry studies shapes and space.

Topics:
• Lines
• Angles
• Shapes

Applications:
Architecture and Design

Practice:
Identify geometric figures.
`,

'Angles': `
Angles are formed by two rays.

Types:
• Acute
• Right
• Obtuse
• Straight

Practice:
Measure and classify angles.
`,

'Triangles': `
Triangles have three sides.

Types:
• Equilateral
• Isosceles
• Scalene

Important Formula:

Area = 1/2 × Base × Height

Practice:
Calculate triangle area.
`,

'Circles': `
A circle is a round shape.

Important Terms:
• Radius
• Diameter
• Circumference

Formula:

Area = πr²

Practice:
Find circumference and area.
`,

'Coordinate Geometry': `
Coordinate geometry uses x and y axes.

Concepts:
• Coordinates
• Distance Formula
• Midpoint Formula

Practice:
Plot points on graph paper.
`,

'Graphing': `
Graphs visually represent data.

Types:
• Line Graph
• Bar Graph
• Pie Chart

Practice:
Create a graph from sample data.
`,

'Statistics': `
Statistics helps analyze data.

Topics:
• Collection
• Organization
• Interpretation

Applications:
Research and Business

Practice:
Analyze a dataset.
`,

'Mean Median Mode': `
Measures of central tendency.

Mean:
Average value

Median:
Middle value

Mode:
Most frequent value

Practice:
Calculate all three measures.
`,

'Probability': `
Probability measures likelihood.

Formula:

Probability =
Favorable Outcomes
÷
Total Outcomes

Range:
0 to 1

Practice:
Calculate dice probabilities.
`,

'Sequences': `
Sequences are ordered patterns.

Types:
• Arithmetic
• Geometric

Example:
2,4,6,8...

Practice:
Find the next term.
`,

'Trigonometry Basics': `
Trigonometry studies relationships between angles and sides.

Key Concepts:
• Sin
• Cos
• Tan

Applications:
Engineering and Navigation

Practice:
Identify trigonometric ratios.
`,

'Sine Cosine Tangent': `
Basic Trigonometric Ratios.

sin θ =
Opposite/Hypotenuse

cos θ =
Adjacent/Hypotenuse

tan θ =
Opposite/Adjacent

Practice:
Solve right triangle problems.
`,

'Limits': `
Limits describe behavior near a point.

Example:

lim x→2 (x+3)

Applications:
Calculus

Practice:
Evaluate basic limits.
`,

'Derivatives': `
Derivatives measure rate of change.

Example:

d/dx (x²)=2x

Applications:
Physics
Engineering

Practice:
Differentiate simple functions.
`,

'Applications of Derivatives': `
Derivatives help find:

• Velocity
• Acceleration
• Maximum Values
• Minimum Values

Practice:
Solve optimization problems.
`,

'Integrals': `
Integrals find accumulated quantities.

Example:

∫ x dx = x²/2 + C

Applications:
Area under curves

Practice:
Integrate simple functions.
`,

'Applications of Integrals': `
Integrals are used for:

• Area
• Volume
• Physics

Practice:
Calculate areas under graphs.
`,

'Vectors': `
Vectors have magnitude and direction.

Example:
5m East

Operations:
• Addition
• Subtraction

Practice:
Add vectors graphically.
`,

'Matrices': `
Matrices organize numbers in rows and columns.

Applications:
• Computer Graphics
• AI
• Data Science

Practice:
Add and multiply matrices.
`,

'Complex Numbers': `
Complex numbers contain imaginary parts.

Example:

3 + 2i

Where:

i² = -1

Practice:
Perform complex number operations.
`,

'Intro to Calculus': `
Calculus studies change and motion.

Main Branches:
• Differential Calculus
• Integral Calculus

Applications:
Physics
Engineering
Economics

Goal:
Build a foundation for advanced mathematics.
`
  },

  science: [
{
title: "Introduction to Science",
content: "Science is the systematic study of the natural world through observation and experimentation. It helps us understand how things work around us."
},
{
title: "Matter and Its Properties",
content: "Matter is anything that occupies space and has mass. It exists in three states: solid, liquid, and gas."
},
{
title: "Atoms and Molecules",
content: "Atoms are the smallest units of matter. Molecules are formed when atoms combine chemically."
},
{
title: "Elements and Compounds",
content: "Elements contain only one type of atom, while compounds contain two or more elements chemically combined."
},
{
title: "Physical and Chemical Changes",
content: "Physical changes alter appearance without changing composition, whereas chemical changes form new substances."
},
{
title: "Force and Motion",
content: "Force is a push or pull that can change an object's motion. Motion describes movement from one place to another."
},
{
title: "Newton's Laws of Motion",
content: "Newton's laws explain how objects move and respond to forces acting upon them."
},
{
title: "Work, Energy, and Power",
content: "Work occurs when force causes movement. Energy is the ability to do work, and power measures the rate of doing work."
},
{
title: "Heat and Temperature",
content: "Heat is energy transfer due to temperature difference, while temperature measures how hot or cold an object is."
},
{
title: "Light and Reflection",
content: "Light enables us to see objects. Reflection occurs when light bounces off surfaces."
},
{
title: "Refraction of Light",
content: "Refraction is the bending of light as it passes from one medium to another."
},
{
title: "Sound and Waves",
content: "Sound is produced by vibrations and travels through a medium as waves."
},
{
title: "Electricity Basics",
content: "Electricity is the flow of electric charges. It powers many devices used daily."
},
{
title: "Magnetism",
content: "Magnets attract certain metals and produce magnetic fields around them."
},
{
title: "Solar System",
content: "The solar system consists of the Sun, planets, moons, asteroids, and comets."
},
{
title: "Earth and Its Structure",
content: "Earth is composed of layers including the crust, mantle, and core."
},
{
title: "Weather and Climate",
content: "Weather refers to daily atmospheric conditions, while climate describes long-term patterns."
},
{
title: "Natural Resources",
content: "Natural resources include water, air, soil, minerals, and forests that support life."
},
{
title: "Human Digestive System",
content: "The digestive system breaks down food into nutrients required by the body."
},
{
title: "Human Respiratory System",
content: "The respiratory system helps in breathing and supplies oxygen to the body."
},
{
title: "Human Circulatory System",
content: "The circulatory system transports blood, oxygen, and nutrients throughout the body."
},
{
title: "Plants and Photosynthesis",
content: "Plants make their own food through photosynthesis using sunlight, carbon dioxide, and water."
},
{
title: "Ecosystems and Environment",
content: "An ecosystem consists of living organisms interacting with their surroundings."
},
{
title: "Science in Everyday Life",
content: "Science influences transportation, communication, healthcare, and technology used daily."
}
],
  English: [
{
title: "Introduction to English Grammar",
content: "Grammar is the set of rules that helps us use language correctly in speaking and writing."
},
{
title: "Parts of Speech",
content: "The eight parts of speech include noun, pronoun, verb, adjective, adverb, preposition, conjunction, and interjection."
},
{
title: "Nouns",
content: "Nouns are naming words used for people, places, animals, things, or ideas."
},
{
title: "Pronouns",
content: "Pronouns replace nouns to avoid repetition and improve sentence flow."
},
{
title: "Verbs",
content: "Verbs express actions, states, or occurrences in a sentence."
},
{
title: "Adjectives",
content: "Adjectives describe or modify nouns and pronouns."
},
{
title: "Adverbs",
content: "Adverbs modify verbs, adjectives, or other adverbs."
},
{
title: "Tenses",
content: "Tenses indicate the time of an action, including past, present, and future."
},
{
title: "Subject and Predicate",
content: "Every sentence contains a subject and a predicate that provides information about the subject."
},
{
title: "Sentence Types",
content: "Sentences can be declarative, interrogative, imperative, or exclamatory."
},
{
title: "Articles",
content: "Articles include a, an, and the, used before nouns."
},
{
title: "Prepositions",
content: "Prepositions show relationships between nouns and other words."
},
{
title: "Conjunctions",
content: "Conjunctions connect words, phrases, or clauses."
},
{
title: "Direct and Indirect Speech",
content: "Direct speech reports exact words, while indirect speech reports meaning."
},
{
title: "Active and Passive Voice",
content: "Active voice emphasizes the subject performing the action, while passive voice emphasizes the receiver."
},
{
title: "Vocabulary Building",
content: "Vocabulary development improves communication and comprehension skills."
},
{
title: "Synonyms and Antonyms",
content: "Synonyms have similar meanings, while antonyms have opposite meanings."
},
{
title: "Reading Comprehension",
content: "Reading comprehension involves understanding and interpreting written text."
},
{
title: "Paragraph Writing",
content: "A paragraph is a group of sentences focused on one main idea."
},
{
title: "Essay Writing",
content: "Essays organize ideas into introduction, body, and conclusion sections."
},
{
title: "Letter Writing",
content: "Letter writing includes formal and informal communication formats."
},
{
title: "Story Writing",
content: "Story writing develops creativity through characters, settings, and plots."
},
{
title: "Public Speaking",
content: "Public speaking improves confidence and communication abilities."
},
{
title: "English Communication Skills",
content: "Effective communication combines grammar, vocabulary, pronunciation, and confidence."
}
],

 history: [
{
title: "Introduction to History",
content: "History is the study of past events, civilizations, and human development."
},
{
title: "Sources of History",
content: "Historical information comes from archaeological findings, documents, inscriptions, and artifacts."
},
{
title: "Ancient Civilizations",
content: "Ancient civilizations laid the foundations for modern societies."
},
{
title: "Indus Valley Civilization",
content: "The Indus Valley Civilization was one of the world's earliest urban civilizations."
},
{
title: "Vedic Period",
content: "The Vedic Period marked significant cultural and religious developments in ancient India."
},
{
title: "Rise of Kingdoms",
content: "Various kingdoms emerged and expanded through trade, warfare, and administration."
},
{
title: "Maurya Empire",
content: "The Maurya Empire became one of the largest empires in Indian history."
},
{
title: "Gupta Empire",
content: "The Gupta Period is often called the Golden Age of India."
},
{
title: "Medieval India",
content: "Medieval India witnessed the rise of powerful kingdoms and cultural growth."
},
{
title: "Delhi Sultanate",
content: "The Delhi Sultanate ruled large parts of India for several centuries."
},
{
title: "Mughal Empire",
content: "The Mughal Empire contributed significantly to architecture, administration, and culture."
},
{
title: "European Arrival in India",
content: "European traders arrived in India seeking trade opportunities."
},
{
title: "British East India Company",
content: "The British East India Company gradually gained political control over India."
},
{
title: "Revolt of 1857",
content: "The Revolt of 1857 was a major uprising against British rule."
},
{
title: "Indian National Movement",
content: "The freedom movement united people in the struggle for independence."
},
{
title: "Mahatma Gandhi and Non-Cooperation",
content: "Gandhi promoted peaceful resistance through non-violent movements."
},
{
title: "Civil Disobedience Movement",
content: "This movement challenged British laws through peaceful protests."
},
{
title: "Quit India Movement",
content: "The Quit India Movement intensified the demand for independence."
},
{
title: "India's Independence",
content: "India gained independence from British rule on August 15, 1947."
},
{
title: "World War I",
content: "World War I reshaped political boundaries and international relations."
},
{
title: "World War II",
content: "World War II was the largest global conflict in human history."
},
{
title: "United Nations",
content: "The United Nations was established to promote international peace and cooperation."
},
{
title: "Modern India",
content: "Modern India has developed rapidly in technology, economy, and education."
},
{
title: "Importance of History",
content: "History helps us understand the past and make informed decisions for the future."
}
],


  'C Programming': {
'Introduction to C': `
C is a programming language used to build software and operating systems. Example: Linux kernel is written in C.
`,

'Structure of C Program': `
A C program has main() function where execution starts.
Example:
int main() { printf("Hello"); return 0; }
`,

'Variables & Data Types': `
Variables store data like numbers or characters.
Example: int age = 20;
`,

'Input & Output': `
Used to take input and show output.
Example: scanf("%d", &age); printf("%d", age);
`,

'Operators': `
Used for calculations and comparisons.
Example: a + b, a > b, a == b
`,

'Conditional Statements': `
Used for decision making.
Example:
if(age > 18) printf("Adult");
`,

'Loops': `
Used to repeat code.
Example:
for(int i=0;i<5;i++) printf("Hello");
`,

'Functions': `
Reusable block of code.
Example:
int add(int a,int b){ return a+b; }
`,

'Arrays': `
Stores multiple values.
Example: int arr[3] = {1,2,3};
`,

'Strings': `
Array of characters.
Example: char name[] = "John";
`,

'Pointers': `
Stores memory address.
Example: int *p = &a;
`,

'Structures': `
Group different data types.
Example:
struct Student { int id; char name[20]; };
`,

'File Handling': `
Used to read/write files.
Example: fopen("file.txt","w");
`,

'Memory Management': `
Dynamic memory allocation.
Example: int *p = malloc(sizeof(int));
`,

'Mini Project': `
Combine all concepts to build a program like a calculator or student record system.
`,

  },

  'Java Programming': {
'Introduction to Java': `
Java is a popular, platform-independent, object-oriented programming language used to build applications that run on the Java Virtual Machine (JVM).
`,

'Setting Up & First Program': `
Every Java program needs a class with a main method.
Example:
public class Main { public static void main(String[] args) { System.out.println("Hello"); } }
`,

'Variables & Data Types': `
Variables store data such as numbers, text, or true/false values.
Example: int age = 20; String name = "Tom"; boolean active = true;
`,

'Operators': `
Used for calculations and comparisons.
Example: a + b, a > b, a == b
`,

'Conditional Statements': `
Used for decision making.
Example:
if (age > 18) { System.out.println("Adult"); }
`,

'Loops': `
Used to repeat code.
Example:
for (int i = 0; i < 5; i++) { System.out.println(i); }
`,

'Arrays': `
Stores multiple values of the same type.
Example: int[] nums = {1, 2, 3};
`,

'Strings': `
A sequence of characters represented by the String class.
Example: String name = "John"; name.length();
`,

'Methods': `
Reusable blocks of code that perform a task.
Example:
int add(int a, int b) { return a + b; }
`,

'Object-Oriented Programming': `
Java is built around objects — bundles of data and behavior. Core ideas: classes, objects, inheritance, polymorphism, abstraction and encapsulation.
`,

'Classes & Objects': `
A class is a blueprint and an object is an instance of it.
Example:
class Car { String brand; }
Car c = new Car();
`,

'Inheritance & Polymorphism': `
Inheritance lets a class reuse another class's code with "extends". Polymorphism lets the same method behave differently in subclasses.
Example: class Dog extends Animal { void sound() { System.out.println("Bark"); } }
`,

'Interfaces & Abstraction': `
An interface defines methods a class must implement, without providing the implementation itself.
Example: interface Shape { double area(); }
`,

'Exception Handling': `
Used to handle runtime errors gracefully.
Example:
try { int x = 5/0; } catch (ArithmeticException e) { System.out.println("Error"); }
`,

'Mini Project': `
Combine all concepts to build a program like a student management system or simple banking app.
`,

  },

  'C++ Programming': {
'Introduction to C++': `
C++ is a general-purpose programming language that extends C with object-oriented features. It is widely used in game development, system software, and competitive programming.
`,

'Structure of a C++ Program': `
A C++ program starts execution from the main() function.
Example:
#include <iostream>
int main() { std::cout << "Hello"; return 0; }
`,

'Variables & Data Types': `
Variables store data like numbers or characters.
Example: int age = 20; double price = 9.99; char grade = 'A';
`,

'Input & Output (cin/cout)': `
cin is used for input and cout is used for output.
Example: cin >> age; cout << age;
`,

'Operators': `
Used for calculations and comparisons.
Example: a + b, a > b, a == b
`,

'Conditional Statements': `
Used for decision making.
Example:
if (age > 18) cout << "Adult";
`,

'Loops': `
Used to repeat code.
Example:
for (int i = 0; i < 5; i++) cout << i;
`,

'Functions': `
Reusable block of code.
Example:
int add(int a, int b) { return a + b; }
`,

'Arrays & Strings': `
Arrays store multiple values; strings store text using the string class.
Example: int arr[3] = {1,2,3}; string name = "John";
`,

'Pointers & References': `
A pointer stores a memory address; a reference is an alias for a variable.
Example: int *p = &a; int &ref = a;
`,

'Classes & Objects': `
A class groups data and functions together; an object is an instance of a class.
Example:
class Car { public: string brand; };
Car c;
`,

'Constructors & Destructors': `
A constructor initializes an object when it is created; a destructor cleans up when it is destroyed.
Example:
class Car { public: Car() { } ~Car() { } };
`,

'Inheritance & Polymorphism': `
Inheritance lets a class derive from another. Polymorphism lets derived classes override base class behavior.
Example: class Dog : public Animal { void sound() override { } };
`,

'Templates & STL Basics': `
Templates allow writing generic code; the Standard Template Library (STL) provides ready-made data structures like vector and map.
Example: vector<int> nums = {1, 2, 3};
`,

'Mini Project': `
Combine all concepts to build a program like a library management system or simple calculator.
`,

  },

  'JavaScript Programming': {
'Introduction to JavaScript': `
JavaScript is a scripting language that runs in the browser (and on servers via Node.js) to make web pages interactive.
`,

'Variables & Data Types': `
Variables store data using let, const, or var.
Example: let age = 20; const name = "Tom"; let active = true;
`,

'Operators': `
Used for calculations and comparisons.
Example: a + b, a > b, a === b
`,

'Conditional Statements': `
Used for decision making.
Example:
if (age > 18) { console.log("Adult"); }
`,

'Loops': `
Used to repeat code.
Example:
for (let i = 0; i < 5; i++) { console.log(i); }
`,

'Functions & Arrow Functions': `
Functions group reusable code. Arrow functions are a shorter syntax.
Example:
function add(a,b){ return a+b; }
const add2 = (a,b) => a+b;
`,

'Arrays': `
Arrays store ordered lists of values.
Example: let nums = [1, 2, 3]; nums.push(4);
`,

'Objects': `
Objects store data as key-value pairs.
Example: let person = { name: "John", age: 25 };
`,

'DOM Manipulation': `
JavaScript can change page content and styles via the DOM.
Example: document.getElementById("title").textContent = "Hello";
`,

'Events': `
Events let code respond to user actions like clicks or key presses.
Example: button.addEventListener("click", () => alert("Clicked!"));
`,

'ES6+ Features': `
Modern JavaScript adds features like template literals, destructuring, and spread/rest operators.
Example: const {name, age} = person; const sum = (...nums) => nums.reduce((a,b)=>a+b);
`,

'Asynchronous JavaScript': `
JavaScript can run code without blocking, using callbacks, promises, and async/await for tasks like fetching data.
`,

'Promises & Async/Await': `
Promises represent future values. async/await makes asynchronous code easier to read.
Example:
async function getData(){ const res = await fetch(url); return res.json(); }
`,

'Error Handling': `
Used to catch and handle runtime errors.
Example:
try { JSON.parse("bad"); } catch (e) { console.log("Error:", e.message); }
`,

'Mini Project': `
Combine all concepts to build a program like a to-do list app or a simple quiz game.
`,

  },

  'PHP Programming': {
'Introduction to PHP': `
PHP is a server-side scripting language widely used for building dynamic websites and web applications.
`,

'Setting Up & First Script': `
PHP code is written between <?php and ?> tags and runs on the server.
Example:
<?php echo "Hello"; ?>
`,

'Variables & Data Types': `
Variables in PHP start with a $ sign.
Example: $age = 20; $name = "Tom"; $active = true;
`,

'Operators': `
Used for calculations and comparisons.
Example: $a + $b, $a > $b, $a == $b
`,

'Conditional Statements': `
Used for decision making.
Example:
if ($age > 18) { echo "Adult"; }
`,

'Loops': `
Used to repeat code.
Example:
for ($i = 0; $i < 5; $i++) { echo $i; }
`,

'Functions': `
Reusable blocks of code.
Example:
function add($a, $b) { return $a + $b; }
`,

'Arrays': `
Arrays store multiple values, indexed or associative.
Example: $nums = [1, 2, 3]; $person = ["name" => "John", "age" => 25];
`,

'Strings': `
Strings can be combined and manipulated with built-in functions.
Example: $greeting = "Hello " . $name; strlen($greeting);
`,

'Working with Forms': `
PHP can read data submitted from HTML forms using superglobals.
Example: <form method="post"><input name="username"></form>
`,

'Superglobals': `
Superglobals are built-in arrays available everywhere, like $_GET, $_POST, $_SERVER and $_SESSION.
Example: $user = $_POST["username"];
`,

'Sessions & Cookies': `
Sessions and cookies store data across page requests.
Example: session_start(); $_SESSION["user"] = "John"; setcookie("theme", "dark");
`,

'File Handling': `
Used to read and write files.
Example: $file = fopen("data.txt", "w"); fwrite($file, "Hello"); fclose($file);
`,

'MySQL with PDO': `
PDO provides a consistent way to connect to and query databases.
Example:
$pdo = new PDO("mysql:host=localhost;dbname=test", "user", "pass");
`,

'Mini Project': `
Combine all concepts to build a program like a simple login system or a guestbook.
`,

  },

  'Rust Programming': {
'Introduction to Rust': `
Rust is a systems programming language focused on safety, speed, and memory efficiency without a garbage collector.
`,

'Setting Up & First Program': `
Rust programs start with a main function.
Example:
fn main() { println!("Hello, world!"); }
`,

'Variables & Mutability': `
Variables are immutable by default; use "mut" to allow changes.
Example: let x = 5; let mut y = 10; y = 15;
`,

'Data Types': `
Rust has scalar types like integers, floats, booleans, and characters, plus compound types like tuples and arrays.
Example: let age: i32 = 20; let pi: f64 = 3.14;
`,

'Functions': `
Functions are declared with fn and can return values.
Example:
fn add(a: i32, b: i32) -> i32 { a + b }
`,

'Conditional Statements': `
Used for decision making.
Example:
if age > 18 { println!("Adult"); }
`,

'Loops': `
Rust supports loop, while, and for loops.
Example:
for i in 0..5 { println!("{}", i); }
`,

'Ownership & Borrowing': `
Ownership ensures memory safety: each value has one owner. Borrowing lets you reference data without taking ownership.
Example: let s1 = String::from("hi"); let s2 = &s1;
`,

'References & Slices': `
References point to data without owning it; slices reference a portion of a collection.
Example: let slice = &array[1..3];
`,

'Structs': `
Structs group related data together.
Example:
struct Point { x: i32, y: i32 }
let p = Point { x: 1, y: 2 };
`,

'Enums & Pattern Matching': `
Enums represent a value that can be one of several variants. match is used to handle each case.
Example:
enum Direction { Up, Down }
match dir { Direction::Up => println!("Up"), Direction::Down => println!("Down") }
`,

'Collections (Vec, HashMap)': `
Vec stores growable lists; HashMap stores key-value pairs.
Example: let mut v = Vec::new(); v.push(1); let mut map = HashMap::new(); map.insert("a", 1);
`,

'Error Handling': `
Rust uses Result and Option types instead of exceptions for recoverable errors.
Example:
fn divide(a: i32, b: i32) -> Result<i32, String> { if b == 0 { Err(String::from("div by zero")) } else { Ok(a/b) } }
`,

'Traits & Generics': `
Traits define shared behavior; generics let functions and structs work with multiple types.
Example:
fn largest<T: PartialOrd>(list: &[T]) -> &T { ... }
`,

'Mini Project': `
Combine all concepts to build a program like a command-line to-do list or a simple inventory tracker.
`,

  },

  'Go Programming': {
'Introduction to Go': `
Go (Golang) is a simple, fast, and statically typed language developed by Google, popular for backend services and cloud tools.
`,

'Setting Up & First Program': `
Go programs start with a package declaration and a main function.
Example:
package main
import "fmt"
func main() { fmt.Println("Hello") }
`,

'Variables & Data Types': `
Variables can be declared with var or using shorthand :=.
Example: var age int = 20; name := "Tom"
`,

'Operators': `
Used for calculations and comparisons.
Example: a + b, a > b, a == b
`,

'Conditional Statements': `
Used for decision making.
Example:
if age > 18 { fmt.Println("Adult") }
`,

'Loops': `
Go has only the for loop, used in multiple forms.
Example:
for i := 0; i < 5; i++ { fmt.Println(i) }
`,

'Functions': `
Functions are declared with func and can return one or more values.
Example:
func add(a int, b int) int { return a + b }
`,

'Arrays & Slices': `
Arrays have a fixed size; slices are flexible, growable views over arrays.
Example: nums := []int{1, 2, 3}; nums = append(nums, 4)
`,

'Maps': `
Maps store key-value pairs.
Example: ages := map[string]int{"Tom": 20}; ages["Sam"] = 25
`,

'Structs': `
Structs group related fields together.
Example:
type Person struct { Name string; Age int }
p := Person{Name: "Tom", Age: 20}
`,

'Pointers': `
Pointers hold the memory address of a value.
Example: x := 10; p := &x; *p = 20
`,

'Interfaces': `
Interfaces define a set of methods a type must implement.
Example:
type Shape interface { Area() float64 }
`,

'Goroutines & Channels': `
Goroutines run functions concurrently; channels let goroutines communicate safely.
Example:
go doWork()
ch := make(chan int)
ch <- 5
`,

'Error Handling': `
Go functions often return an error value that should be checked.
Example:
result, err := divide(a, b)
if err != nil { fmt.Println(err) }
`,

'Mini Project': `
Combine all concepts to build a program like a simple REST API or a command-line task manager.
`,

  },
  'Cyber Security': {
'Introduction to Cyber Security': `
Cyber security is the practice of protecting systems, networks, and data from digital attacks, unauthorized access, and damage.
`,

'Types of Cyber Threats': `
Common threats include malware, phishing, ransomware, denial-of-service (DoS) attacks, and insider threats.
`,

'Malware & Viruses': `
Malware is malicious software designed to harm or exploit systems.\nExamples: Viruses, Worms, Trojans, Ransomware, Spyware.
`,

'Phishing & Social Engineering': `
Phishing tricks users into revealing sensitive information via fake emails or websites. Social engineering manipulates people psychologically to bypass security.
`,

'Network Security Basics': `
Network security protects data as it travels across networks.\nKey tools: Firewalls, VPNs, Intrusion Detection Systems (IDS).
`,

'Firewalls & VPNs': `
A firewall filters incoming and outgoing traffic based on rules. A VPN (Virtual Private Network) encrypts your connection for privacy.
`,

'Cryptography Basics': `
Cryptography secures data using encryption.\nExample: Symmetric encryption (AES) uses one key; Asymmetric (RSA) uses a public/private key pair.
`,

'Authentication & Access Control': `
Authentication verifies identity (passwords, OTPs, biometrics). Access control determines what authenticated users are allowed to do.
`,

'Security Policies & Compliance': `
Organizations follow security policies and standards like ISO 27001, GDPR, and HIPAA to ensure data protection and legal compliance.
`,

'Web Application Security': `
Common web vulnerabilities include SQL Injection, Cross-Site Scripting (XSS), and Cross-Site Request Forgery (CSRF). The OWASP Top 10 lists the most critical risks.
`,

'Incident Response': `
Incident response is the structured process of detecting, containing, and recovering from a security breach: Identify → Contain → Eradicate → Recover → Review.
`,

'Digital Forensics Basics': `
Digital forensics involves collecting, preserving, and analyzing digital evidence after a security incident or crime.
`,

'Cloud Security': `
Cloud security protects data, applications, and infrastructure in cloud environments using practices like encryption, IAM (Identity and Access Management), and monitoring.
`,

'Security Tools Overview': `
Common tools: Wireshark (packet analysis), Nmap (network scanning), Metasploit (penetration testing), and antivirus/EDR solutions.
`,

'Mini Project': `
Combine all concepts to create a security awareness checklist or set up a basic firewall/VPN configuration on a test system.
`,

  },
  'Ethical Hacking': {
'Introduction to Ethical Hacking': `
Ethical hacking is the authorized practice of testing systems for vulnerabilities, performed by "white hat" hackers to improve security.
`,

'Hacking Phases & Methodology': `
The typical phases are: Reconnaissance → Scanning → Gaining Access → Maintaining Access → Covering Tracks → Reporting.
`,

'Footprinting & Reconnaissance': `
Gathering information about a target before an attack, such as domain details, IP ranges, and employee information, using tools like WHOIS and Google dorking.
`,

'Scanning Networks': `
Scanning identifies live hosts, open ports, and services.\nExample: nmap -sV target_ip
`,

'Enumeration': `
Enumeration extracts detailed information from a target system, such as usernames, shares, and services, often via SNMP or NetBIOS.
`,

'Vulnerability Analysis': `
Identifying weaknesses in systems using tools like Nessus or OpenVAS, then prioritizing them based on severity.
`,

'System Hacking Basics': `
Techniques used to gain access to a system, such as password cracking, privilege escalation, and exploiting unpatched software.
`,

'Malware Threats': `
Attackers use malware (viruses, trojans, worms, rootkits) to gain unauthorized access or control of systems.
`,

'Sniffing': `
Sniffing captures data packets traveling over a network using tools like Wireshark, often to steal credentials on unsecured networks.
`,

'Social Engineering Attacks': `
Attacks like phishing, pretexting, and baiting exploit human trust rather than technical flaws.
`,

'Web Server & App Hacking': `
Attackers target misconfigured servers and vulnerable web applications, exploiting issues like outdated software and weak authentication.
`,

'SQL Injection': `
SQL Injection inserts malicious SQL code into input fields to manipulate a database.\nExample: ' OR '1'='1
`,

'Wireless Network Hacking': `
Attacks on Wi-Fi networks include cracking WEP/WPA keys, rogue access points, and deauthentication attacks.
`,

'Cryptography for Hackers': `
Understanding encryption helps hackers identify weak implementations and crack hashes, while also helping defenders secure data properly.
`,

'Mini Project': `
Combine all concepts to perform a basic vulnerability scan on a test environment and document findings in a report.
`,

  },
  'Software Engineering': {
'Introduction to Software Engineering': `
Software engineering is the systematic approach to designing, developing, testing, and maintaining software.
`,

'SDLC Models': `
The Software Development Life Cycle (SDLC) includes models like Waterfall, Agile, Spiral, and Iterative — each defining how a project moves from planning to deployment.
`,

'Requirement Analysis': `
Gathering and documenting what the software must do, often using user stories, use cases, and requirement specification documents.
`,

'Software Design Principles': `
Good design follows principles like modularity, abstraction, low coupling, and high cohesion to make software maintainable.
`,

'UML Diagrams': `
UML (Unified Modeling Language) diagrams visually represent system design.\nCommon types: Class diagrams, Use Case diagrams, Sequence diagrams.
`,

'Agile & Scrum': `
Agile is an iterative development approach. Scrum is a popular Agile framework using sprints, daily standups, and product backlogs.
`,

'Coding Standards': `
Coding standards ensure consistency and readability, covering naming conventions, indentation, comments, and best practices.
`,

'Software Testing Basics': `
Testing verifies that software works as expected and is free of defects before release.
`,

'Types of Testing': `
Common types: Unit Testing, Integration Testing, System Testing, and Acceptance Testing — each covering different scopes of the software.
`,

'Version Control with Git': `
Git tracks changes to code over time and enables collaboration.\nExample: git init, git add ., git commit -m "message", git push
`,

'Software Project Management': `
Project management involves planning, scheduling, resource allocation, and tracking progress to deliver software on time and within budget.
`,

'Software Quality Assurance': `
QA ensures software meets quality standards through processes like code reviews, automated testing, and continuous integration.
`,

'Maintenance & Documentation': `
After release, software needs maintenance to fix bugs, add features, and adapt to new environments. Good documentation supports this process.
`,

'DevOps Basics': `
DevOps combines development and operations to enable continuous integration and continuous delivery (CI/CD), automating build, test, and deployment.
`,

'Mini Project': `
Combine all concepts to plan, design, and document a small software project, including requirements, UML diagrams, and a test plan.
`,

  },
  'Data Structures & Algorithms': {
'Introduction to DSA': `
Data Structures and Algorithms (DSA) form the foundation of efficient programming — organizing data and defining steps to solve problems.
`,

'Time & Space Complexity': `
Time complexity measures how runtime grows with input size; space complexity measures memory usage. Often expressed using Big-O notation, e.g. O(n), O(log n), O(n^2).
`,

'Arrays': `
An array stores multiple values of the same type in contiguous memory.\nExample: int arr[5] = {1,2,3,4,5};
`,

'Linked Lists': `
A linked list stores elements as nodes, each pointing to the next.\nExample: struct Node { int data; struct Node* next; };
`,

'Stacks': `
A stack follows LIFO (Last In First Out).\nOperations: push() adds an element, pop() removes the top element.
`,

'Queues': `
A queue follows FIFO (First In First Out).\nOperations: enqueue() adds to the rear, dequeue() removes from the front.
`,

'Recursion': `
Recursion is when a function calls itself to solve smaller subproblems.\nExample: factorial(n) = n * factorial(n-1), with factorial(0) = 1 as the base case.
`,

'Searching Algorithms': `
Linear search checks each element one by one (O(n)). Binary search repeatedly halves a sorted array to find a target (O(log n)).
`,

'Sorting Algorithms': `
Common algorithms: Bubble Sort, Selection Sort, Insertion Sort (O(n^2)), and Merge Sort, Quick Sort (O(n log n)).
`,

'Trees': `
A tree is a hierarchical structure with a root node and child nodes. A binary tree has at most two children per node.
`,

'Binary Search Trees': `
A Binary Search Tree (BST) keeps left children smaller and right children larger than the parent, enabling fast search, insert, and delete operations.
`,

'Graphs': `
A graph consists of nodes (vertices) connected by edges. Graphs can be directed or undirected, and are traversed using BFS or DFS.
`,

'Hashing': `
Hashing maps data to fixed-size values using a hash function, enabling fast lookups in structures like hash tables (used by dictionaries/maps).
`,

'Dynamic Programming': `
Dynamic Programming solves problems by breaking them into overlapping subproblems and storing results to avoid recomputation.\nExample: Fibonacci sequence using memoization.
`,

'Mini Project': `
Combine all concepts to implement a small project like a to-do list using a linked list, or a pathfinding visualizer using graphs.
`,

  },
  'DBMS': {
'Introduction to DBMS': `
A Database Management System (DBMS) is software that stores, retrieves, and manages data efficiently and securely.
`,

'Data Models': `
Data models define how data is structured.\nCommon types: Hierarchical, Network, Relational, and Object-Oriented models.
`,

'ER Diagrams': `
Entity-Relationship (ER) diagrams visually represent entities, their attributes, and relationships between them in a database design.
`,

'Relational Model': `
The relational model organizes data into tables (relations) consisting of rows (tuples) and columns (attributes).
`,

'SQL Basics': `
SQL (Structured Query Language) is used to interact with relational databases.\nExample: SELECT * FROM students WHERE age > 18;
`,

'Joins': `
Joins combine rows from multiple tables based on a related column.\nExample: SELECT * FROM orders INNER JOIN customers ON orders.cust_id = customers.id;
`,

'Normalization': `
Normalization organizes data to reduce redundancy and improve integrity, through stages called normal forms (1NF, 2NF, 3NF, etc.).
`,

'Transactions': `
A transaction is a sequence of operations performed as a single logical unit, following ACID properties: Atomicity, Consistency, Isolation, Durability.
`,

'Indexing': `
An index improves the speed of data retrieval operations on a table, similar to an index in a book.\nExample: CREATE INDEX idx_name ON students(name);
`,

'Keys & Constraints': `
Keys uniquely identify records: Primary Key, Foreign Key, Candidate Key. Constraints like NOT NULL and UNIQUE enforce data rules.
`,

'Views': `
A view is a virtual table based on the result of a SQL query, useful for simplifying complex queries and restricting data access.
`,

'Stored Procedures & Triggers': `
Stored procedures are precompiled SQL code that can be executed on demand. Triggers automatically execute in response to events like INSERT or UPDATE.
`,

'NoSQL Basics': `
NoSQL databases store data in non-tabular formats like documents (MongoDB), key-value pairs (Redis), or graphs (Neo4j), suited for flexible or large-scale data.
`,

'Database Security': `
Database security involves controlling access through user roles and permissions, encrypting sensitive data, and auditing database activity.
`,

'Mini Project': `
Combine all concepts to design a database schema (with ER diagram) and write SQL queries for a simple application like a library or student database.
`,

  }
};

function openLesson(index) {

  currentLessonIndex = index;

  const lesson =
    courseLessons[currentCourse][index];

  const content =
    lessonContent[currentCourse]?.[lesson] ||
    "Lesson content coming soon.";

  document.getElementById('lessonTitle').textContent =
    lesson;

  document.getElementById('lessonContent').textContent =
    content;

  document.getElementById('lessonReadingTime').textContent =
    Math.max(
      1,
      Math.ceil(content.length / 800)
    ) + ' min read';

  updateLessonNavigation();

  showPage('lessonViewer', null);
}

function updateLessonNavigation() {

  const lessons =
    courseLessons[currentCourse];

  const pct =
    ((currentLessonIndex + 1) /
      lessons.length) * 100;

  document.getElementById(
    'lessonProgressFill'
  ).style.width = pct + '%';

  document.getElementById(
    'prevLessonBtn'
  ).disabled =
    currentLessonIndex === 0;

  document.getElementById(
    'nextLessonBtn'
  ).disabled =
    currentLessonIndex ===
    lessons.length - 1;
}

document.addEventListener('click', function (e) {

  if (e.target.id === 'prevLessonBtn') {

    if (currentLessonIndex > 0) {
      openLesson(
        currentLessonIndex - 1
      );
    }
  }

  if (e.target.id === 'nextLessonBtn') {

    const lessons =
      courseLessons[currentCourse];

    if (
      currentLessonIndex <
      lessons.length - 1
    ) {

      openLesson(
        currentLessonIndex + 1
      );
    }
  }

  if (
    e.target.id ===
    'completeLessonBtn'
  ) {

    const done =
      courseProgress[currentCourse];

    if (
      !done.includes(
        currentLessonIndex
      )
    ) {

      done.push(
        currentLessonIndex
      );
    }

    Store.set(
      'courseProgress',
      courseProgress
    );

    renderCourseDetail();

    alert(
      'Lesson Completed 🎉'
    );
  }
});
/* ============ NUMBER GUESS GAME ============ */
let guessTarget = 0, guessCount = 0;

function newGuessGame() {
  guessTarget = Math.floor(Math.random() * 100) + 1;
  guessCount = 0;
  document.getElementById('guessAttempts').textContent = 0;
  document.getElementById('guessFeedback').textContent = '';
  document.getElementById('guessInput').value = '';
}

function checkGuess() {
  const val = parseInt(document.getElementById('guessInput').value);
  if (isNaN(val)) { alert('Enter a number!'); return; }
  guessCount++;
  document.getElementById('guessAttempts').textContent = guessCount;
  const fb = document.getElementById('guessFeedback');
  if (val === guessTarget) {
    fb.textContent = `🎉 Correct! You got it in ${guessCount} tries!`;
    fb.style.color = 'var(--success)';
    stats.gamesPlayed++;
    Store.set('stats', stats);
  } else if (val < guessTarget) {
    fb.textContent = '📈 Too low! Try higher.';
    fb.style.color = 'var(--warning)';
  } else {
    fb.textContent = '📉 Too high! Try lower.';
    fb.style.color = 'var(--warning)';
  }
}

/* ============ MATH CHALLENGE ============ */
let mathScore = 0, mathAnswer = 0, mathTimer = null, mathTimeLeft = 30;

function startMathChallenge() {
  mathScore = 0;
  mathTimeLeft = 30;
  newMathProblem();
  clearInterval(mathTimer);
  mathTimer = setInterval(() => {
    mathTimeLeft--;
    document.getElementById('mathTime').textContent = mathTimeLeft;
    if (mathTimeLeft <= 0) endMathChallenge();
  }, 1000);
}

function newMathProblem() {
  const a = Math.floor(Math.random() * 12) + 1;
  const b = Math.floor(Math.random() * 12) + 1;
  const ops = ['+', '-', '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  mathAnswer = op === '+' ? a + b : op === '-' ? a - b : a * b;
  document.getElementById('mathChallengeArea').innerHTML = `
    <div class="flex-between">
      <span class="badge">Score: <span id="mathScore">${mathScore}</span></span>
      <span class="badge">Time: <span id="mathTime">${mathTimeLeft}</span>s</span>
    </div>
    <h2 style="text-align:center; margin:1rem 0">${a} ${op} ${b} = ?</h2>
    <input type="number" id="mathInput" placeholder="Answer" style="max-width:200px; margin:0 auto; display:block;"
      onkeypress="if(event.key==='Enter')submitMath()" autofocus>
    <button class="btn mt-1" style="display:block; margin:0 auto;" onclick="submitMath()">Submit</button>`;
  setTimeout(() => { const el = document.getElementById('mathInput'); if (el) el.focus(); }, 50);
}

function submitMath() {
  const val = parseInt(document.getElementById('mathInput').value);
  if (val === mathAnswer) mathScore++;
  newMathProblem();
}

function endMathChallenge() {
  clearInterval(mathTimer);
  stats.gamesPlayed++;
  Store.set('stats', stats);
  document.getElementById('mathChallengeArea').innerHTML = `
    <div class="text-center">
      <div style="font-size:3rem">🧮</div>
      <h2>Time's up!</h2>
      <p class="stat-value">${mathScore}</p>
      <p>correct answers</p>
      <button class="btn mt-1" onclick="startMathChallenge()">Play Again</button>
    </div>`;
}
const clearBtn = document.getElementById("clear-chat-btn");

clearBtn.addEventListener("click", () => {

    if(confirm("Are you sure you want to clear all chats?")) {

        // Clear messages from UI
        document.getElementById("chat-messages").innerHTML = "";

        // Clear saved chat history
        localStorage.removeItem("chatHistory");

        // Optional welcome message
        addMessage(
            "Chats Cleared!",
            "bot"
        );
    }
});


init();