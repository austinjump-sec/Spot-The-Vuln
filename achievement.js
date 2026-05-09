
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
    divTitle.textContent = 'Shop Prototype (more items and item types coming soon)'
    achievementArr.forEach((a) => {
      const tokenDiv = document.createElement('div');
      tokenDiv.className = 'Tokens';
      
          tokenDiv.innerHTML = `

          <img src='/media/${a}.png'>
          <h5 class='explanation'> 
          Earn ${a} tokens by completing challenge (first try) on the ${timeArr[a]} timer
          </h5>
          <p id='${a}Counter'>0</p>
          <button id='${a}button'>${a.toUpperCase()} SHOP</button>
          `
      miscellanious.appendChild(tokenDiv)
      document.getElementById(`${a}button`).addEventListener('click', async () => {
        selectedToken = a
        await renderShop(a)
      })
    })
    const userRef = db.collection('users').doc(user.uid);
    bindTokenCounters(userRef, achievementArr)
    if (!right) toggleRightMenu()
  } else {
    document.getElementById('miscContent').textContent = 'Please sign in to earn achievements and shop'
    if (!right) toggleRightMenu()
  }
})
let lost = false
let speed = ''
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
let timerInterval = null;
let startTime = null;
const timerButtons = document.getElementById('timerButtons')
    const theTimer = document.getElementById('timer')
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
    if (!startTime || !timerInterval) return; 
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
  
  registersDiv.querySelectorAll('div').forEach(div => div.remove());
  document.querySelectorAll('.code-line').forEach(el => {
        el.style.backgroundColor = ''; 
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
