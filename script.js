window.addEventListener('DOMContentLoaded', async () => {
  await loadAllQuestions()
  console.log('Questions Loaded!')
})
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
const db = firebase.firestore();
const ui = new firebaseui.auth.AuthUI(firebase.auth());

let gitUser = false;
let leaderboardResults = [];
const streakValue = document.getElementById('streakValue');

async function createLeaderboard(score, elapsedSeconds) {
  const user = firebase.auth().currentUser;
  if (!user) return;

  try {
const githubData = user.providerData.find(p => p.providerId === 'github.com');
    const githubUsername = githubData?.screenName || githubData.displayName || "User";
const userRef = db.collection('users').doc(user.uid);
 const userSnap = await userRef.get();
const currentTotal = userSnap.data().totalSpeeds;
    await db.collection('leaderboard').doc(user.uid).set({
      score: score,
      finalTime: elapsedSeconds,
      program: currentQuestion.title,
      userName: githubUsername,
      uid: user.uid,
    }, {merge: true});
    updateDailyStreak(user.uid);
  } catch (e) {
    console.error("Error saving score:", e);
  }
}
const shopItems = [
  {
    id: 'byteshifter',
    name: "Byte Shifter", 
    type: 'title', 
    cost: {skid: 2}
  },
  {
    id: 'crashoverride',
    name: 'Crash Override',
    type: 'title', 
    cost: {hacker: 3}
  },
  {
    id: 'plague', 
    name: 'The Plague',
    type: 'title',
    cost: {nsa: 2}
  },
  {
    id: 'compiler',
    name: 'The Compiler',
    type: 'title',
    cost: {cpu: 5}
  },
  {
    id: 'zeroday',
    name: '0 Day Finder', 
    type: 'title', 
    cost: {nsa: 4}
  },
  {
    id: 'elliot', 
    name: 'Elliot',
    type: 'title',
    cost: {cpu: 1}
  },
  {
    id: 'purpTerm',
    name: 'Purple Terminal',
    type: 'terminalCustom',
    cost: {hacker: 2}
  },
  {
    id: 'pinkTerm',
    name: 'Pink Terminal',
    type: 'terminalCustom',
    cost: {skid: 3}
  },
  {
    id: 'blueTerm',
    name: 'Blue Terminal',
    type: 'terminalCustom',
    cost: {hacker: 1}
  },
  {
    id: 'redTerm',
    name: 'Red Terminal',
    type: 'terminalCustom',
    cost: {hacker: 4}
  }
  ]
  let selectedType = 'title' //show title menu by default
  let selectedToken = null
async function renderShop(filterToken = null){
  selectedToken = filterToken
  const container = document.getElementById('miscContent')
  const divTitle = document.getElementById('divTitle')
  container.innerHTML = ''
  const cTermButton = document.createElement('button')
  const buttonWrapper = document.createElement('div')
  buttonWrapper.className = 'shop-nav-container'
  cTermButton.addEventListener('click', async () => { selectedType='terminalCustom', await renderShop(selectedToken) })
    cTermButton.textContent = 'Terminal Themes'
    
  const titleButton = document.createElement('button')
  titleButton.textContent = 'User Titles'
  titleButton.addEventListener('click', async () => {selectedType='title', await renderShop(selectedToken) })
  divTitle.textContent = 'Shop'
  buttonWrapper.appendChild(titleButton)
  buttonWrapper.appendChild(cTermButton)
  container.appendChild(buttonWrapper)
  shopItems.forEach(item => {
    const matchesCategory = item.type === selectedType;
    const matchesToken = !selectedToken || item.cost.hasOwnProperty(selectedToken);

    if (matchesToken && matchesCategory){
      const div = document.createElement('div')
      div.className = 'shop-item'
      const displayCost = selectedToken 
        ? `${selectedToken}: ${item.cost[selectedToken]}` 
        : Object.entries(item.cost).map(([k,v]) => `${k}: ${v}`).join(' | ');

      div.innerHTML = `
      <div class="shop-header">
      <span class="item-name">${item.name}</span>
      </div>
      <div class="shop-cost">
      ${displayCost}
      </div>
      <button class="buy-btn">Purchase</button>
      `
      div.querySelector('.buy-btn').addEventListener('click', async () => {
        const user = firebase.auth().currentUser
        if (!user){
          appendToTerminal('Login required to purchase and earn points!')
          return
        }
        const userRef = db.collection('users').doc(user.uid)
        try{
          const doc = await userRef.get()
          const data = doc.data() || {}
          const tokens = data.speedTokens || {}
          const inventory = data.inventory || {}
          
          const ownedList = inventory[item.type] || []
          if (ownedList.includes(item.id)){
            const button = div.querySelector('.buy-btn')
            button.textContent = 'Owned!'
            button.disabled = true
            return
          }
          let canAfford = true
          
          for (const [token, cost] of Object.entries(item.cost)){
            if ((tokens[token] || 0) < cost){
              canAfford = false
            }
          }
          if (!canAfford){
            const button = div.querySelector('.buy-btn')
            button.disabled = true
            button.textContent = "Not enough tokens"
            
            return
          }
          const updates = {}
          for (const [token, cost] of Object.entries(item.cost)){
            updates[`speedTokens.${token}`] = 
            firebase.firestore.FieldValue.increment(-cost)
            
          }
          updates[`inventory.${item.type}`] = 
          firebase.firestore.FieldValue.arrayUnion(item.id)
          await userRef.set(updates, {merge: true})
          appendToTerminal(`Purchased ${item.name}!`)
          await renderShop(selectedToken)
        } catch (err){
          console.error("Failed buying item:", err)
          appendToTerminal("Purchase failed! :(")
        }
      })
    container.appendChild(div)
      
    }
    
  })
  
  
}
function bindTokenCounters(userRef, achievementArr) {
  userRef.onSnapshot((doc) => {
    const data = doc.data() || {};
    const tokens = data.speedTokens || {};

    achievementArr.forEach(a => {
      const el = document.getElementById(`${a}Counter`);
      if (el) {
        el.textContent = tokens[a] || 0;
      }
    });
  });
}
document.getElementById('achievement').addEventListener('click', async () => {
  const user = firebase.auth().currentUser
  if (user){
    const miscellanious = document.getElementById('miscContent')
    let achievementArr = ["skid", "hacker", "nsa", "cpu"]
    const timeArr = {
      skid: "5 minute",
      hacker: "3 minute",
      nsa: "1 minute",
      cpu: "30 second"
    }
    miscellanious.innerHTML = '';
    let divTitle = document.getElementById('divTitle')
    divTitle.textContent = 'Shop Prototype (Items not equippable yet)'
    achievementArr.forEach((a) => {
      const tokenDiv = document.createElement('div');
      tokenDiv.className = 'Tokens';
      
      tokenDiv.innerHTML = `
      <div class='Tokens'> 
      <img src='${a}.png'>
      <h5 class='explanation'> 
      Earn ${a} tokens by completing challenge (first try) on the ${timeArr[a]} timer
      </h5>
      <p id='${a}Counter'>0</p>
      <button id='${a}button'>${a.toUpperCase()} SHOP</button>
      </div>
      `
      miscellanious.appendChild(tokenDiv)
      document.getElementById(`${a}button`).addEventListener('click', async () => {
        selectedToken = a
        await renderShop(a)
      })
    })
    const userRef = db.collection('users').doc(user.uid);
    bindTokenCounters(userRef, achievementArr)
    if (!right)toggleRightMenu()
  }
})
document.getElementById('challengesDone').addEventListener('click', async () => {
  const user = firebase.auth().currentUser;
  if (!user){
    let divTitle = document.getElementById('divTitle')
    divTitle.textContent = 'Guest Error!'
    document.getElementById('miscContent').innerHTML = `<p>Guest data is not saved. Please create an account using github! : )`
  if (!right) toggleRightMenu();
  }
    const completedRef = db.collection('users')
        .doc(user.uid)
        .collection('completedChallenges');

    try {
        const querySnapshot = await completedRef.get();
        
        // Build a list of all program titles and scores
        let listHTML = `<div class="cyber-list-header">MISSION HISTORY</div>`;
        
        if (querySnapshot.empty) {
            listHTML += `<div class="no-data">> No completed challenges found.</div>`;
        } else {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                listHTML += `
                    <div class="history-item">
                        <span class="prompt">></span> 
                        <strong>${data.program}</strong> 
                        <span class="history-score"> - Score: ${data.score} | Time: ${data.time}</span>
                        <div class="history-date">${data.completedAt?.toDate().toLocaleDateString() || 'N/A'}</div>
                    </div>
                `;
            });
        }

        document.getElementById('divTitle').textContent = "Personal Leaderboard"
        document.getElementById('miscContent').innerHTML = listHTML;
        
        if (!right) toggleRightMenu();

    } catch (error) {
        console.error("Error retrieving mission history:", error);
    }
});
async function showLeaderboardProgram(programTitle){
  const miscellanious = document.getElementById('miscContent')
  const divTitle = document.getElementById('divTitle')
  miscellanious.innerHTML = ''
  divTitle.textContent = `Leaderboard: ${programTitle}`
  
  try{
    const querySnapshot = await db.collection('leaderboard')
    .where('program', '==', programTitle)
    .orderBy('score', 'desc')
    .get()
    
    if (querySnapshot.empty){
      miscellanious.textContent = 'Leaderboard yet to load or no user data yet (guest data is not logged)'
      return 
    }
    
    let rank = 1
    querySnapshot.forEach(doc => {
      const data = doc.data();
      const tier = document.createElement('div');
      tier.id = 'tier';
      tier.textContent = `#${rank} | User: ${data.userName} | Score: ${data.score} | Time: ${data.finalTime}s`;
      miscellanious.appendChild(tier);
      rank++;
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    miscellanious.textContent = `Failed to load leaderboard.${error}`;
  }
  }

async function updateDailyStreak(userUid) {
  const leaderboardRef = db.collection('leaderboard').doc(userUid);
  try {
    const doc = await leaderboardRef.get();
    if (!doc.exists) return;

    const data = doc.data();
    const now = Date.now();
    const fullDay = 24 * 60 * 60 * 1000;
    let newWidth = data.streakPercent || 0;

    
    if (!data.lastCompleted || (now - data.lastCompleted.toDate().getTime() > fullDay)) {
      const bar = document.getElementById('gradientBar');
      newWidth = (data.streakPercent || 0) + 1;
      
      if (newWidth >= 100) {
        await leaderboardRef.update({ prestiged: firebase.firestore.FieldValue.increment(1) });
        newWidth = 0;
      }

      if (streakValue) streakValue.textContent = newWidth;
      if (bar) bar.style.width = newWidth + '%';

      await leaderboardRef.update({
        streakPercent: newWidth,
        streakCompleted: true,
        lastCompleted: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
    return newWidth;
  } catch (e) {
    console.error("Error Updating Streak", e);
  }
}
//when user completes program create leaderboard for user using uid to mark completed for challenges completed and store vulnerabilities to update ??? in DOM

firebase.auth().onAuthStateChanged(async user => {
  const accountMenu = document.getElementById('accountMenu');
  const welcomeText = document.getElementById('welcomeText');
  const firebaseUiContainer = document.getElementById('firebaseui-auth-container');
  const pfpImg = document.getElementById('userPfp');

  if (user) {
    gitUser = true;
    ui.reset();
    if (firebaseUiContainer) firebaseUiContainer.style.display = 'none';

    
    const githubData = user.providerData.find(p => p.providerId === 'github.com');
    const githubUsername = githubData?.screenName || githubData.displayName || "User";
    const githubPfp = githubData?.photoURL || user.photoURL || "https://wallpapers.com/images/high/face-icon-default-pfp-wvn0p3q6n2ipz4ir.jpg";


    
    if (welcomeText) welcomeText.textContent = `Welcome, ${githubUsername}!`;
    if (pfpImg) {
      pfpImg.referrerPolicy = "no-referrer";
      pfpImg.src = githubPfp;
      pfpImg.style.display = 'block';
    }

    
    const leadDoc = await db.collection('leaderboard').doc(user.uid).get();
    if (leadDoc.exists) {
      const percent = leadDoc.data().streakPercent || 0;
      if (document.getElementById('gradientBar')) {
          document.getElementById('gradientBar').style.width = percent + '%';
      }
      if (streakValue) streakValue.textContent = percent;
    }

    // Sync User Profile
    await db.collection('users').doc(user.uid).set({
      uid: user.uid,
      githubUsername: githubUsername,
      photoURL: githubPfp,
      lastSignInTime: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

  } else {
    gitUser = false;
    if (accountMenu) 
    if (firebaseUiContainer) firebaseUiContainer.style.display = 'block';
    
    ui.start('#firebaseui-auth-container', {
      signInOptions: [firebase.auth.GithubAuthProvider.PROVIDER_ID],
      signInSuccessUrl: 'index.html'
    });
  }
});
const gRank = document.getElementById('globalRank')
gRank.addEventListener('click', async () => {
  const divTitle = document.getElementById('divTitle')
  divTitle.textContent = 'Leaderboard (prototype)'
  const miscellanious = document.getElementById('miscContent')
  miscellanious.innerHTML = ''
  await showLeaderboard()
  if (!right) toggleRightMenu();
  leaderboardResults.forEach((r) => {
    let i = 1
    let tier = document.createElement('div')
    tier.textContent = r
    tier.id = 'tier'
    miscellanious.appendChild(tier) 
    })
})

function computeScore(elapsedSeconds){
  let maxScore = 1000 
  const score = Math.max(0, maxScore - (elapsedSeconds * 5))
  let multiplier =  1 + (accuracyBonus / 10)
  return Math.floor(score * multiplier)
}
// 4. Leaderboard Logic
let increment = 0
async function showLeaderboard() {
  try {
    const querySnapshot = await db.collection('leaderboard').orderBy("score", "desc").limit(10).get();
    leaderboardResults = [];
    increment = 1
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      leaderboardResults.push(`#${increment} | User: ${data.userName} | Score: ${data.score} | Time: ${data.finalTime}s | Program: ${data.program}`);
      increment++
    });
  } catch (error) {
    console.error("Error retrieving leaderboard", error);
  }
}

appendToTerminal("root@spotthevuln:~# ./start_game.sh");
appendToTerminal("root@spotthevuln:~# Welcome, User! Select a language above to begin!")
appendToTerminal("root@spotthevuln:~# Practice spotting advanced bug bounties and learn reverse engineering basics!")
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
    speed='';
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
    resetSpeeds(); skidSpeed = true; speed='skid'; skid.style.backgroundColor = 'green'; 
    appendToTerminal('Patch the Vulnerability Before Red Team Exploits in 5 minutes!');
}); 

hacker.addEventListener('click', () => { 
    resetSpeeds(); hackSpeed = true; speed='hacker'; hacker.style.backgroundColor = 'green';
    appendToTerminal('Patch the Vulnerability Before Red Team Exploits in 3 minutes!');
}); 

nsa.addEventListener('click', () => { 
    resetSpeeds(); nsaSpeed = true; speed='nsa'; nsa.style.backgroundColor = 'green';
    appendToTerminal('Patch the Vulnerability Before Red Team Exploits in 1 minute!');
}); 

insane.addEventListener('click', () => { 
    resetSpeeds(); insaneSpeed = true; speed='cpu'; insane.style.backgroundColor = 'green';
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
}, 1000);

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
const sideContainerR = document.getElementById('side-menu-containerR');

let right = false
function toggleRightMenu() {
  right = !right
  sideContainerR.classList.toggle('active') // hidden position
  
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
    sideContainer.style.left = '0px'; // Moves the whole unit
  } else {
    sideContainer.style.left = '-320px';
  }
});

const buttonDiv = document.getElementById('btns');
const codeDiv = document.getElementById('code');
const h5 = document.getElementById('h5');
let hideNext = false
let foundLines = []
const questionsMap = {};
async function loadAllQuestions(){
  try{
    const [js, php, sql, c, asm] = await Promise.all([
      fetch('/js.json').then(r => r.json()),
      fetch('/php.json').then(r => r.json()),
      fetch('/sql.json').then(r => r.json()),
      fetch('/c.json').then(r => r.json()),
      fetch('asm.json').then(r => r.json()),
    ]);
    questionsMap.js = js
    questionsMap.php = php 
    questionsMap.sql = sql 
    questionsMap.c = c 
    questionsMap.asm = asm
  } catch (err){
    console.error('Error loading questions:', err)
  }
}
  const controls = document.getElementById('debugger-controls')
  const debugui = document.getElementById('debugger-ui')
   const prev = document.getElementById('prev-step')
    const next = document.getElementById('next-step')
let currentQuestion = null
let menu = document.getElementById('dynamic-dropdown');
if (!menu) {
    menu = document.createElement('div');
    menu.id = 'dynamic-dropdown';
    const sideContainerR = document.getElementById('side-menu-containerR');
}

// 1. Show menu when hovering over a language button
let closeTimeout;

// 1. Show and Clear Timeout on Hover
buttonDiv.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn || btn.id === 'challengesLoad') return;
    
    clearTimeout(closeTimeout); // Stop any pending hide command
    
    const lang = btn.id;
    const levels = questionsMap[lang];
    if (!levels) return;

    // Update content and position
   let programInfo = `
        <div class="dropdown-header">${lang.toUpperCase()} CHALLENGES</div>
        <div class="level-list">
            ${levels.map((q, index) => `
                <button class="level-btn" data-lang="${lang}" data-idx="${index}">
                    ${q.title} [${q.diff}/10 difficulty]
                </button> <br>
            `).join('')}
        </div>
    `;
    
    const miscellanious = document.getElementById('miscContent')
    const divTitle = document.getElementById('divTitle')
    divTitle.textContent = `${lang.toUpperCase()} Program List`
    
    if (!right) toggleRightMenu()
    
    miscellanious.innerHTML = programInfo
    
});
document.getElementById('side-menu-containerR').addEventListener('click', async (e) => {
  const levelBtn = e.target.closest('.level-btn')
  if (!levelBtn) return;
  const lang = levelBtn.dataset.lang 
  const idx = levelBtn.dataset.idx 
  const q = questionsMap[lang][idx]
  let isCompleted = false
  const user = firebase.auth().currentUser;
  if (user){
  try{
    
    const completedRef = db.collection('users')
    .doc(user.uid)
    .collection('completedChallenges')
    .doc(q.title);
    
    const doc = await completedRef.get()
    if (doc.exists){
      isCompleted = doc.exists
    }
  } catch (err){
    console.error('Error listing completed vulnerabilities', err)
  }
  }
    const dialogHTML = `
<dialog id='dynamic-dialog' class="cyber-modal">
    <div class="modal-header">
        <h1 id='dynamicH1'>${q.title}</h1>
        <div class="badge-row">
            <span class="badge difficulty">${q.diff}/10 Difficulty</span>
            <span class="badge language">${lang.toUpperCase()}</span>
        </div>
    </div>

    <div class="modal-body">
        <p class="section-label">DETECTED VULNERABILITIES:</p>
        <div id='vulnDiv' class="vuln-list"></div>
    </div>

    <div class="modal-footer">
        <button id='play' class="btn-primary">INITIALIZE</button> 
        <button id='leaderBoardShow' class="btn-secondary">LEADERBOARD</button>
        <button id='close-dialog' class="btn-ghost">ABORT</button>
    </div>
</dialog>
`;

    const oldDialog = document.getElementById('dynamic-dialog')
    if (oldDialog) oldDialog.remove()
    document.body.insertAdjacentHTML('beforeend', dialogHTML)
    let i = 1
    const programModal = document.getElementById('dynamic-dialog')
    const vulnDiv = document.getElementById('vulnDiv');
    vulnDiv.innerHTML = ''
    Object.entries(q.insecureLines).forEach(([lineNum, data], i) => {
  const item = document.createElement('div');
  item.className = 'vuln-item';
    const vulnName = isCompleted ? data.name : "????????";
    const vulnDetail = isCompleted ? data.vuln : "Incomplete - find this in-game to unlock details.";
  item.innerHTML = `
            <div style="margin-bottom: 10px;">
                <span class="prompt">></span> <strong>Vuln ${i + 1}:</strong> ${vulnName}
                <div style="font-size: 0.85rem; color: #aaa; padding-left: 18px; margin-top: 4px;">
                    ${vulnDetail}
                </div>
            </div>
        `;
    vulnDiv.appendChild(item);      
    })


    programModal.showModal()
    const playButton = document.getElementById('play')
    
    playButton.addEventListener('click', () => { 
      setupChallenge()
       programModal.close()
    })
     const leaderBoardShow = document.getElementById('leaderBoardShow')
     leaderBoardShow.addEventListener('click', ()  => {
     showLeaderboardProgram(q.title)
       programModal.close()
     })
    
    document.getElementById('close-dialog').onclick = () => programModal.close();
})
document.getElementById('exit').addEventListener('click', toggleRightMenu)
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
document.addEventListener('keydown', async (e) => {
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
        await checkResults()
      }else if (input === 'n') {
        appendToTerminal('Skipping Details...')
        notReady = false
        await checkResults()
      }
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
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('level-btn')){
    const lang = e.target.dataset.lang
    const idx = e.target.dataset.idx
    
    currentQuestion = questionsMap[lang][idx]
    const modal = e.target.closest('dialog')
    if (modal) modal.close()
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


let accuracyBonus = 0 
let linesTried = 0
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
          
  if (!notReady){
    const input = terminalInput.value.trim().toLowerCase();
     if (input === 'y') {
        let terminalResponse = currentQuestion.insecureLines[activeVulnLine].vuln;
        appendToTerminal(`> ${input}`); // Show their 'y' in the terminal
        appendToTerminal(`Exploit info: ${terminalResponse}`);
        notReady = false
        checkResults()
      }else if (input === 'n') {
        appendToTerminal('Skipping Details...')
        notReady = false
        checkResults()
      }
  }
      }
    }
  });
  if (newlyFound > 0){
    notReady = true
    terminalInput.value = ''
    if (linesTried < 1){
      accuracyBonus = 5
    } else if (linesTried < 3){
      accuracyBonus = 3
    } else if (linesTried < 5){
      accuracyBonus = 1
    } else {
      accuracyBonus = 0
    }
    
    appendToTerminal('Would you like detailed exploit information? (y/n)')
    
  } else if (terminalInput.value === 'y' || terminalInput.value === 'n' ){
    return
  }else {
    linesTried++
    appendToTerminal(`No Vulnerability Found. Incorrect Guesses: ${linesTried}`)
  }
  }
  
  async function checkResults(){
    // Calculate total insecure lines count
  const total = Array.isArray(currentQuestion.insecureLines)
    ? currentQuestion.insecureLines.length
    : Object.keys(currentQuestion.insecureLines).length;
  const foundCount = foundLines.length
  const left = total - foundLines.length 
  if (left>0){
    appendToTerminal(`${foundCount}/${total} Vulnerabilities found.`)
  } else {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const score = computeScore(elapsedSeconds)
    appendToTerminal(`Program Pwned with ${score} points in ${elapsedSeconds} seconds! `)
    showLeaderboardProgram(currentQuestion.title)
    const user = firebase.auth().currentUser;
    if (user){
    createLeaderboard(score, elapsedSeconds)
    
    const completedRef = db.collection('users')
    .doc(user.uid)
    .collection('completedChallenges')
    .doc(currentQuestion.title);
    try{
      const doc = await completedRef.get();
       const updatingData = {
         completedAt: firebase.firestore.FieldValue.serverTimestamp(),
        score: score,
        time: elapsedSeconds,
        program: currentQuestion.title,
        insecureLines: currentQuestion.insecureLines
      }
      if (!doc.exists){
      if (speed){
        updatingData.speed = speed
        await completedRef.set(updatingData)
        const userRef = db.collection('users').doc(user.uid);
        const achievementUpdate = {}
        achievementUpdate[`speedTokens.${speed}`] = firebase.firestore.FieldValue.increment(1)
        await userRef.update(achievementUpdate).catch(async (err) => {
                  await userRef.set({speedTokens: {[speed]: 1}}, { merge: true });
        })
        appendToTerminal(`Earned achievement ${speed}!`)
        
      } else {
        await completedRef.set(updatingData)
      } 
      const challengeButtons = document.querySelectorAll(`[data-idx]`)
      challengeButtons.forEach(btn => {
        if (btn.textContent.includes(currentQuestion.title)){
          btn.textContent += '✅'
        }
      })
      } else if (score > doc.data().score){
      await completedRef.set(updatingData, {merge:true})
      appendToTerminal('New high score!')
}
      
    }catch (error){
      console.error("Error marking completion", error)
    }
    } else {
      
    }
    linesTried = 0
    accuracyBonus = 0
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
}
