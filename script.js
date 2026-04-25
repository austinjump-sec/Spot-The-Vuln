
      const firebaseConfig = {
        apiKey: "AIzaSyDJuvpBpGHiNwzBnQzFaHcgBddShoWJcMo",
        authDomain: "spot-the-vuln.firebaseapp.com",
        projectId: "spot-the-vuln",
        storageBucket: "spot-the-vuln.firebasestorage.app",
        messagingSenderId: "537987867600",
        appId: "1:537987867600:web:b1a134ea3716310f8b8fd5",
        measurementId: "G-ELM7B47KWF"
      };
      firebase.initializeApp(firebaseConfig);
      let ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#firebaseui-auth-container', {
        signInOptions: [
          firebase.auth.GithubAuthProvider.PROVIDER_ID
        ],
        signInSuccessUrl: 'index.html',
      });
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log("User signed in:", user);
    ui.reset()
    // Show logged-in user's info and enable features
    // Example: display username/email in accountMenu div
    const accountMenu = document.getElementById('accountMenu');
    accountMenu.textContent = `Welcome, ${user.displayName || user.email} (GitHub)`;
  } else {
    console.log("No user signed in");
    const accountMenu = document.getElementById('accountMenu');
    accountMenu.textContent = 'Not signed in';
  }
});
const sqlQuestions = [
  {
    code: `1  -- Database schema for a simple member portal
2  CREATE TABLE members (
3      id INT PRIMARY KEY,
4      username VARCHAR(50),
5      
6      password VARCHAR(50), 
7      email VARCHAR(100)
8  );
9  
10 
11 INSERT INTO members (id, username, password) 
12 VALUES (1, 'admin', 'password123');
13 
14 
15 
16 GRANT ALL PRIVILEGES ON members TO 'web_guest';
`,
insecureLines: {
  '6': {name: 'Plaintext Password Storage', vuln: 'Anyone who can read code gains access.'},
'16': {name: 'Excessive Privilege Grant', vuln: 'Violates principle of least privilege'}

  },
    title: "Commander",
    diff: 2
  }]
const cQuestions = [
  {
    code : `1  #include <stdio.h>
2  #include <string.h>
3  
4  void process_data(char *user_input) {
5      char internal_buffer[32];
6      
7      
8      
9      strcpy(internal_buffer, user_input); 
10 
11     printf("Processing: %s\ n", internal_buffer);
12 }
13 
14 int main(int argc, char *argv[]) {
15     if (argc > 1) {
16          
17         
18         printf(argv[1]); 
19         process_data(argv[1]);
20     }
21     return 0;
22 }
`,
insecureLines: {
  '9': {name: 'Buffer Overflow', vuln: "Can be exploited to cause unexpected behavior, which is useful for a variety of vectors"},
'18': {name: 'Format String Vulnerability', vuln: "Allows an attacker to leak stack data or write to arbitrary memory by injecting format specifiers."} 
  
},
title: "Overflow",
diff: 6
  }]
  let currentStepIndex = 0
const jsQuestions = [
  {
    code : `1  const express = require('express');
2  const crypto = require('crypto');
3  const db = require('./db');
4  const app = express();
5  
6  
7  
8  const ADMIN_KEY = "SUPER_SECRET_12345"; 
9  
10 
11 app.post('/login', (req, res) => {
12     const { username, password } = req.body;
13     const hash = crypto.createHash('md5').update(password).digest('hex');
14 
15     db.users.findOne({ user: username, pass: hash }, (err, user) => {
16         if (user) {
17             res.send("Welcome back!");
18         } else {
19             res.status(401).send("Fail");
20         }
21     });
22 });
23 
24 
25 app.get('/debug', (req, res) => {
26     if (req.query.key === ADMIN_KEY) {
27         eval(req.query.cmd); 
28     }
29 });
30 
31 
32 app.listen(3000);
`,
  insecureLines: {
    '8': {name: "Hardcoded Plaintext Password", vuln: "Can gain access by reading source code"},
    '15': {name: "Weak encryption/hashing", vuln: "Weak encryption (especially an unsalted MD5) can be reversed."},
    '27': {name: "RCE via eval()", vuln: "The eval() function executes a string as code. An attacker could use this to gain full control of a server."}
    
  },
  title: "Crypto",
  diff: 3
  } 

  ]

const phpQuestions = [
  {
    code : `1  <?php
2  include("config.php");
3  
4  $userId = $_GET['id'];
5  $page = $_GET['page'];
6  
7  
8  $query = "SELECT * FROM users WHERE id = " . $userId;
9  $result = mysqli_query($conn, $query);
10 $row = mysqli_fetch_assoc($result);
11 
12 echo "<h1>User: " . $row['username'] . "</h1>";
13 
14 
15 if (isset($page)) {
16     include("pages/" . $page . ".php");
17 }
18 
19 
20 if ($row['role'] == 'user') {
21     echo "<a href='edit.php?id=" . $row['id'] . "'>Edit Profile</a>";
22 }
23 ?>
`, 
insecureLines: {
  '8': {name: 'SQL Injection', vuln: 'Direct queries to table can be manipulated to leak vital data or even gain control of server'},
  '16': {name: 'Local File Inclusion', vuln: 'Using unvalidated $_GET["page" in include() lets attackers traverse directories'},
  '21': {name: 'XSS/IDOR', vuln: "Echoing $row['id'] into an href without escaping allows for XSS, while the pattern also encourages Insecure Direct Object Reference (IDOR) attacks."}
  
},
title: "Web-Shell",
diff: 4
  }
  ]
const linuxQuestions = [
  {
    isAsm: true, // Flag to tell the UI to show the debugger
    steps: [
      {
        addr: "0x08048000",
        instr: "mov eax, [0x08049000]",
        regs: { EAX: "0x00000041", ESP: "0x7ffffffc" },
        stack: [{ addr: "0x7ffffffc", val: "0x08048022" }]
      },
      {
        addr: "0x08048005",
        instr: "cmp eax, 0x42",
        regs: { EAX: "0x00000041", ESP: "0x7ffffffc" },
        stack: [{ addr: "0x7ffffffc", val: "0x08048022" }]
      }
    ],
    code: "0x08048000: mov eax, [0x08049000]\n0x08048005: cmp eax, 0x42",
    insecureLines: {
      "0x08048005": {
        name: 'Insecure Hardcoded Comparison',
        vuln: 'Hardcoding a secret value (0x42, hex for B) for comparison makes it easy for an attacker to see the key by inspecting the binary with a debugger'
      }
      
    },
    title: "Reverse",
    diff: 7
  },
  {
    isAsm: true,
    code: "0x08048000: mov eax, 0x41\n0x08048005: push eax",
      insecureLines: { 
    "0x08048005": { name: "Stack Manipulation", vuln: "By pushing a raw value to the stack right before a ret instruction, an attacker can hijack the control flow. The CPU treats that value as the next address to execute, allowing them to redirect the program to their own malicious code. In this code the memory address is 'A' (0x42) but its just for example" } 
  },
    title: "Binary",
    diff: 8,
    steps: [
      {
        // STEP 1: Before anything happens
        addr: "0x08048000",
        instr: "mov eax, 0x41",
        regs: { EAX: "0x00000000", ESP: "0x7ffffffc" },
        stack: [{ addr: "0x7ffffffc", val: "0x00000000" }]
      },
      {
        // STEP 2: EAX has changed because of the 'mov'
        addr: "0x08048005",
        instr: "push eax",
        regs: { EAX: "0x00000041", ESP: "0x7ffffffc" }, // EAX updated!
        stack: [{ addr: "0x7ffffffc", val: "0x00000000" }]
      },
      {
        // STEP 3: The stack has changed because of the 'push'
        addr: "0x0804800A", 
        instr: "ret",
        regs: { EAX: "0x00000041", ESP: "0x7ffffff8" }, // ESP moved down
        isFinal: true,
        stack: [
          { addr: "0x7ffffff8", val: "0x00000041" }, // New value on stack!
          { addr: "0x7ffffffc", val: "0x00000000" }
        ]
      }
      
    ]
   
  }
];
appendToTerminal("root@spotthevuln:~# ./start_game.sh");
appendToTerminal("root@spotthevuln:~# Welcome, User! Select a language above to begin!")
let skidSpeed = false
let hackSpeed = false
let nsaSpeed = false
let insaneSpeed = false
const noTime = document.getElementById('notime')
const skid = document.getElementById('slow')
const hacker = document.getElementById('medium')
const nsa = document.getElementById('fast')
const insane = document.getElementById('impossible')
function resetSpeeds() {
    skidSpeed = false;
    hackSpeed = false;
    nsaSpeed = false;
    insaneSpeed = false;
    noTime.style.backgroundColor = ''
    skid.style.backgroundColor = ''
    hacker.style.backgroundColor = ''
    nsa.style.backgroundColor = ''
    insane.style.backgroundColor = ''
}

noTime.addEventListener('click', () => {
  resetSpeeds();
  appendToTerminal('Timer Challenge Cleared.')
})
skid.addEventListener('click', () => { 
    resetSpeeds(); skidSpeed = true; skid.style.backgroundColor = 'green'; 
    appendToTerminal('Patch the Vulnerability Before Red Team Exploits in 5 minutes!');
}); 

hacker.addEventListener('click', () => { 
    resetSpeeds(); hackSpeed = true; hacker.style.backgroundColor = 'green';
    appendToTerminal('Patch the Vulnerability Before Red Team Exploits in 3 minutes!');
}); 

nsa.addEventListener('click', () => { 
    resetSpeeds(); nsaSpeed = true; nsa.style.backgroundColor = 'green';
    appendToTerminal('Patch the Vulnerability Before Red Team Exploits in 1 minute!');
}); 

insane.addEventListener('click', () => { 
    resetSpeeds(); insaneSpeed = true; insane.style.backgroundColor = 'green';
    appendToTerminal('Patch the Vulnerability Before Red Team Exploits in !!! THIRTY SECONDS !!!');
});

const terminalInput = document.getElementById('termInput')
const terminal = document.getElementById('termContent')
const terminalDiv = document.getElementById('terminal')
const tracker = document.getElementById('lineTracker')
const insanity = document.getElementById('stack-addr')
const sanity = document.getElementById('stack-val')
let timerInterval = null;
let startTime = null;
const timerButtons = document.getElementById('timerButtons')
function startTimer() {
  startTime = Date.now();
  timerButtons.setAttribute('hidden', 'true')
  theTimer.style.display = 'flex'
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
  theTimer.querySelectorAll('button').forEach(btn => {
    btn.style.display = 'inline-block';
  });
}
setInterval(() => {
    if (!startTime || !timerInterval) return; // Don't check if game hasn't started

    // Calculate seconds elapsed
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    let timeLimit = 0;

    if (skidSpeed) timeLimit = 300;
    else if (hackSpeed) timeLimit = 180;
    else if (nsaSpeed) timeLimit = 60;
    else if (insaneSpeed) timeLimit = 30;

    if (timeLimit > 0 && elapsedSeconds >= timeLimit) {
        lost = true;
        stopTimer();
        terminalDiv.classList.add('error-flicker');
    
    // 2. Remove it after 1 second so it stops
    setTimeout(() => {
        terminalDiv.classList.remove('error-flicker');
    }, 1000);
        appendToTerminal("CRITICAL FAILURE: Red Team has breached. You have been pwned.");
         currentQuestion = null
    foundLines = []
    codeDiv.setAttribute('hidden', 'true')
   
    theTimer.setAttribute('hidden', 'true')
    registersAsm.setAttribute('hidden', 'true')
    stackAsm.setAttribute('hidden', 'true')
    h5.setAttribute('hidden', 'true')
    prev.setAttribute('hidden', 'true')
    next.setAttribute('hidden', 'true')
    tracker.setAttribute('hidden', 'true')
    document.getElementById('vuln-lights').innerHTML = ''
      const stackDiv = document.getElementById('stack');
    const stackItems = stackDiv.querySelectorAll('div:not(:first-child)')
  stackItems.forEach(div => div.remove())
     const registersDiv = document.getElementById('registers');
  // Clear old register values except the header
  registersDiv.querySelectorAll('div').forEach(div => div.remove());
  document.querySelectorAll('.code-line').forEach(el => {
        el.style.backgroundColor = ''; // Reset
        el.classList.remove('active-step'); 
    });
    resetSpeeds()
    }
}, 1000); // Checking every 1 second is plenty for a timer

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const secs = String(elapsed % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `Time: ${mins}:${secs}`;
}

function stopTimer() {
  clearInterval(timerInterval);
  timerButtons.removeAttribute('hidden')
  timerInterval = null;
}

function updateDebugger(step) {
  insanity.textContent = ''
  sanity.textContent = ''
  const registersDiv = document.getElementById('registers');
  // Clear old register values except the header
  registersDiv.querySelectorAll('div').forEach(div => div.remove());
  document.querySelectorAll('.code-line').forEach(el => {
        el.style.backgroundColor = ''; // Reset
        el.classList.remove('active-step'); 
    });
     const currentLine = document.getElementById(`line-${step.addr}`);
    if (currentLine) {
        currentLine.style.backgroundColor = 'rgba(255, 0, 0, 0.4)'; // Red tint
        currentLine.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  // Add register key-value pairs dynamically
  for (const reg in step.regs) {
    const regDiv = document.createElement('div');
    regDiv.textContent = `${reg}: `;
    const span = document.createElement('span');
    span.id = `reg-${reg.toLowerCase()}`;
    span.textContent = step.regs[reg];
    regDiv.appendChild(span);
    registersDiv.appendChild(regDiv);
  }

  // Update stack similarly if you want only one or multiple entries
  const stackDiv = document.getElementById('stack');
  const stackItems = stackDiv.querySelectorAll('div:not(:first-child)')
  // Clear old stack entries except header
  stackItems.forEach(div => div.remove())
  
  if (step.stack.length > 0){
    insanity.textContent = step.stack[0].addr
    sanity.textContent = step.stack[0].val
  } else {
    insanity.textContent = ''
    sanity.textContent = ''
  }
step.stack.forEach(item => {
    const stackItem = document.createElement('div');
    stackItem.textContent = `${item.addr} ${item.val}`;
    stackDiv.appendChild(stackItem);
  });
  if (step.isFinal){
    tracker.textContent = 'Result: End of execution.'
  } else { 
tracker.textContent = `Current Line: ${currentStepIndex + 1}`
  }
}
document.getElementById('next-step').addEventListener('click', () => {
  if (!currentQuestion || !currentQuestion.steps) return;
  if (currentStepIndex < currentQuestion.steps.length - 1){
    insanity.textContent = ''
    currentStepIndex++ 
    updateDebugger(currentQuestion.steps[currentStepIndex])
  }
})
document.getElementById('prev-step').addEventListener('click', () => {
  if (!currentQuestion || !currentQuestion.steps) return;
  if (currentStepIndex > 0){
    insanity.textContent = ''
    currentStepIndex--
    updateDebugger(currentQuestion.steps[currentStepIndex])
  }
  
})
const challengesBtn = document.getElementById('challengesLoad');
const sideContainer = document.querySelector('.side-menu-container')
challengesBtn.addEventListener('click', () => {
  buttonDiv.classList.toggle('active');
  
  // Apply the transition once (better in CSS, but fine here)
  sideContainer.style.transition = 'left 0.4s ease-in-out';

  if (buttonDiv.classList.contains('active')) {
    sideContainer.style.left = '-10px'; // Moves the whole unit
  } else {
    sideContainer.style.left = '-240px';
  }
});

const buttonDiv = document.getElementById('btns');
const codeDiv = document.getElementById('code');
const h5 = document.getElementById('h5');
let hideNext = false
let foundLines = []
const questionsMap = {
  js: jsQuestions,
  php: phpQuestions,
  sql: sqlQuestions,
  c: cQuestions,
  asm: linuxQuestions
};
  const controls = document.getElementById('debugger-controls')
  const debugui = document.getElementById('debugger-ui')
   const prev = document.getElementById('prev-step')
    const next = document.getElementById('next-step')
let currentQuestion = null
let menu = document.getElementById('dynamic-dropdown');
if (!menu) {
    menu = document.createElement('div');
    menu.id = 'dynamic-dropdown';
    document.body.appendChild(menu);
}

// 1. Show menu when hovering over a language button
let closeTimeout;

// 1. Show and Clear Timeout on Hover
buttonDiv.addEventListener('mouseover', e => {
    const btn = e.target.closest('button');
    if (!btn || btn.id === 'challengesLoad') return;
    
    clearTimeout(closeTimeout); // Stop any pending hide command
    
    const lang = btn.id;
    const levels = questionsMap[lang];
    if (!levels) return;

    // Update content and position
    menu.innerHTML = `
        <div class="dropdown-header">${lang.toUpperCase()} CHALLENGES</div>
        <div class="level-list">
            ${levels.map((q, index) => `
                <button class="level-btn" data-lang="${lang}" data-idx="${index}">
                    ${q.title} [${q.diff}/10 difficulty]
                </button> <br>
            `).join('')}
        </div>
    `;

    const rect = btn.getBoundingClientRect();
    menu.style.left = `${rect.left}px`;
    menu.style.top = `${rect.bottom + window.scrollY}px`;
    menu.style.display = 'block';
});

// 2. Start hide timer when leaving the button
buttonDiv.addEventListener('mouseout', () => {
    closeTimeout = setTimeout(() => {
        menu.style.display = 'none';
    }, 200);
});

// 3. Keep menu open if mouse enters the menu itself
menu.addEventListener('mouseenter', () => {
    clearTimeout(closeTimeout); // User is inside the menu, don't hide!
});

// 4. Hide when leaving the menu
menu.addEventListener('mouseleave', () => {
    menu.style.display = 'none';
});

// This listener catches clicks on the buttons INSIDE the dropdown
document.addEventListener('click', e => {
    // Check if what we clicked is a level-btn (or inside one)
    const levelBtn = e.target.closest('.level-btn');
    
    // If it's not a level button, ignore the click
    if (!levelBtn) return;

    // 1. Get the data from the button's attributes
    const lang = levelBtn.dataset.lang;
    const index = parseInt(levelBtn.dataset.idx);

    // 2. Set your global variable (ensure this name matches your script)
    currentQuestion = questionsMap[lang][index];

    // 3. Hide the menu immediately
    const menu = document.getElementById('dynamic-dropdown');
    if (menu) menu.style.display = 'none';

    // 4. Start the game logic
    console.log("Loading level:", currentQuestion.title);
    setupChallenge(); 
});


  
;

    const registersAsm = document.getElementById('reg4')
    const stackAsm = document.getElementById('stack4')
    const theTimer = document.getElementById('timer')

function setupChallenge(){
  appendToTerminal(`${currentQuestion.title} Started! Good Luck!`)
  theTimer.removeAttribute('hidden')
  startTimer()
  currentStepIndex = 0;
  foundLines = [];
  terminalInput.value = '';
sanity.textContent = '';
insanity.textContent = '';
  codeDiv.innerHTML = '';
  codeDiv.removeAttribute('hidden');
  h5.removeAttribute('hidden');
  h5.textContent = 'Which line is insecure? If the answer is multiple, please answer one at a time.';

  if (currentQuestion.isAsm) {
    stackAsm.removeAttribute('hidden')
    registersAsm.removeAttribute('hidden')
    tracker.removeAttribute('hidden')
     debugui.removeAttribute('hidden');       
    controls.removeAttribute('hidden'); 
    prev.removeAttribute('hidden');
    next.removeAttribute('hidden');
    const lines = currentQuestion.code.split('\n');
    lines.forEach(lineText => {
      const lineEl = document.createElement('div');
      lineEl.className = 'code-line';
      lineEl.textContent = lineText;

      const addrMatch = lineText.match(/(0x[0-9a-fA-F]+)/);
      if (addrMatch) {
        lineEl.id = `line-${addrMatch[0]}`;
      }
      codeDiv.appendChild(lineEl);
    });
    updateDebugger(currentQuestion.steps[currentStepIndex]);

  } else {
    
    next.setAttribute('hidden', 'true')
    prev.setAttribute('hidden', 'true')
    registersAsm.setAttribute('hidden', 'true')
    stackAsm.setAttribute('hidden', 'true')
    tracker.setAttribute('hidden', 'true')
    insanity.textContent = ''
    sanity.textContent = ''
    const stackDiv = document.getElementById('stack');
  const stackItems = stackDiv.querySelectorAll('div:not(:first-child)')
  // Clear old stack entries except header
  stackItems.forEach(div => div.remove())
  const registersDiv = document.getElementById('registers');
registersDiv.querySelectorAll('div').forEach(div => {
  if (div.id !== 'reg4') div.remove();
});
    codeDiv.textContent = currentQuestion.code;
  }
  lighting()
};
function lighting(){
  const vulnLightsDiv = document.getElementById('vuln-lights');
  vulnLightsDiv.innerHTML = ''; // clear old lights
  if (Array.isArray(currentQuestion.insecureLines)) {
    currentQuestion.insecureLines.forEach((line) => {
      const light = document.createElement('span');
      light.id = `light-${line}`;
      light.style.display = 'inline-block';
      light.style.width = '15px';
      light.style.height = '15px';
      light.style.margin = '0 5px';
      light.style.borderRadius = '50%';
      light.style.backgroundColor = 'red';
      light.title = `Vulnerability on line ${line}`;
      vulnLightsDiv.appendChild(light);
    });
  } else if (typeof currentQuestion.insecureLines === 'object') {
    Object.keys(currentQuestion.insecureLines).forEach((line) => {
      const light = document.createElement('span');
      light.id = `light-${line}`;
      light.style.display = 'inline-block';
      light.style.width = '15px';
      light.style.height = '15px';
      light.style.margin = '0 5px';
      light.style.borderRadius = '50%';
      light.style.backgroundColor = 'red';
      light.title = `Vulnerability on line ${line}`;
      vulnLightsDiv.appendChild(light);
    });
  }
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter'){
        e.preventDefault()
        const input = terminalInput.value.trim().toLowerCase();
    
    // If we are currently waiting for a y/n response
    if (activeVulnLine !== null || notReady) {
      if (notReady){
      if (input === 'y') {
        let terminalResponse = currentQuestion.insecureLines[activeVulnLine].vuln;
        appendToTerminal(`> ${input}`); // Show their 'y' in the terminal
        appendToTerminal(`Exploit info: ${terminalResponse}`);
        notReady = false
        checkResults()
      }
      } if (input === 'n') {
        appendToTerminal('Skipping Details...')
        checkResults()
      }
      else {
        
        submitAnswer()
      }
      // Reset so the terminal isn't "locked" to the previous question
      activeVulnLine = null; 
    }
    submitAnswer()
    terminalInput.value = ''; // Clear the input box
   
  }
  } )
document.addEventListener('click', e => {
  if (e.target.classList.contains('level-btn')){
    const lang = e.target.dataset.lang
    const idx = e.target.dataset.idx
    
    currentQuestion = questionsMap[lang][idx]
    e.target.closest('dialog').close()
    setupChallenge()
  }
})
let notReady = false
function appendToTerminal(text) {
  const terminal = document.getElementById('terminal');
  const msg = document.createElement('div');
  msg.textContent = text;
  terminal.appendChild(msg);
  // Auto-scroll to bottom
  terminal.scrollTop = terminal.scrollHeight;
}
// 1. Create a "State" variable at the top of your script
let activeVulnLine = null; 



function submitAnswer(){
  if (!currentQuestion) return;
  
  const userLines = terminalInput.value.split(',').map(s => s.trim())
  let newlyFound = 0 
  
  userLines.forEach(line => {
    if (
      // Check if insecureLines is array and includes line OR
      (Array.isArray(currentQuestion.insecureLines) && currentQuestion.insecureLines.includes(line)) ||

      // Or insecureLines is object with key line
      (typeof currentQuestion.insecureLines === 'object' && currentQuestion.insecureLines[line])
    ) {
      if (!foundLines.includes(line)) {
        
        foundLines.push(line);
        const vulnName = typeof currentQuestion.insecureLines[line] === 'object'
          ? currentQuestion.insecureLines[line].name
          : null;
          
        let terminalMessage = `Found vulnerability on program: ${currentQuestion.title}. Line: ${line}${vulnName ? ': ' + vulnName : ''}. GG!`;
        appendToTerminal(terminalMessage)
        const light = document.getElementById(`light-${line}`);
if (light) {
  light.style.backgroundColor = 'limegreen';}
      
        activeVulnLine = line;
        newlyFound++;
          if (newlyFound > 0){
    notReady = true
    terminalInput.value = ''
    appendToTerminal('Would you like detailed exploit information? (y/n)')
    
  }
  if (!notReady){
    checkResults()
  }
      }
    }
  });
  }
  function checkResults(){
    // Calculate total insecure lines count
  const total = Array.isArray(currentQuestion.insecureLines)
    ? currentQuestion.insecureLines.length
    : Object.keys(currentQuestion.insecureLines).length;
  const left = total - foundLines.length 
  if (left>0){
    appendToTerminal(`${left}/${total} Vulnerabilities found.`)
  } else {
    appendToTerminal('Program Pwned!')
    stopTimer()
      const stackDiv = document.getElementById('stack');
  const stackItems = stackDiv.querySelectorAll('div:not(:first-child)')
    stackItems.forEach(div => div.remove())
  const registersDiv = document.getElementById('registers');
registersDiv.querySelectorAll('div').forEach(div => {
  if (div.id !== 'reg4') div.remove();
});
    currentQuestion = null
    foundLines = []
    codeDiv.setAttribute('hidden', 'true')
   
    theTimer.setAttribute('hidden', 'true')
    registersAsm.setAttribute('hidden', 'true')
    stackAsm.setAttribute('hidden', 'true')
    h5.setAttribute('hidden', 'true')
    prev.setAttribute('hidden', 'true')
    next.setAttribute('hidden', 'true')
    tracker.setAttribute('hidden', 'true')
    document.getElementById('vuln-lights').innerHTML = ''
  }
  terminalInput.value = ''
}
