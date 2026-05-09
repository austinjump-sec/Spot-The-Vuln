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

const sideContainerR = document.getElementById('side-menu-containerR');

let right = false
function toggleRightMenu() {
  right = !right
  sideContainerR.classList.toggle('active') 
  
}
const challengesBtn = document.getElementById('challengesLoad');
const sideContainer = document.querySelector('.side-menu-container')
challengesBtn.addEventListener('click', () => {
  buttonDiv.classList.toggle('active');
  
  sideContainer.style.transition = 'left 0.4s ease-in-out';

  if (buttonDiv.classList.contains('active')) {
    sideContainer.style.left = '-5px'; 
  } else {
    sideContainer.style.left = '-320px';
  }
});

function appendToTerminal(text) {
  const terminal = document.getElementById('terminal');
  const msg = document.createElement('div');
  msg.textContent = text;
  terminal.appendChild(msg);
  terminal.scrollTop = terminal.scrollHeight;
}
let masteryPercentByLang = {};

let masteryTitle = 'Junior Analyst'

async function saveXpTitles(lang){
  const user = firebase.auth().currentUser;
  if (!user) return;
  const userRef = db.collection('users').doc(user.uid);
  const currentTitle = masteryTitleByLang[lang] || 'Junior Analyst';
  const currentPercent = masteryPercentByLang[lang] || 0;
await userRef.set({
  mastery: {
    [lang]: {
      percent: currentPercent,
      title: currentTitle
    }
  }
}, { merge: true });
}
async function xpToPercent(currentQuestion){
  const user = firebase.auth().currentUser;
  if (!currentQuestion || !user) return;
  let lang = currentQuestion.lang
  if (!lang) return;
  if (typeof masteryPercentByLang[lang] !== 'number') {
    masteryPercentByLang[lang] = 0;
  }
  masteryPercentByLang[lang] += currentQuestion.xp / 2

  if (masteryPercentByLang[lang] > 100) {
    masteryPercentByLang[lang] = 100;
  }
  if (masteryPercentByLang[lang] === 100) {
   await titleForMastery(currentQuestion);
  }
  await saveXpTitles(lang)
}
if (!masteryTitle) masteryTitle = 'Junior Analyst';
let masteryTitleByLang = {};

async function titleForMastery(currentQuestion){
  let lang = currentQuestion.lang
  if (!lang) return;
const user = firebase.auth().currentUser
  if (!user) return;
  if (!masteryTitleByLang[lang]) masteryTitleByLang[lang] = 'Junior Analyst';
  if (masteryPercentByLang[lang] === 100){
    switch(masteryTitleByLang[lang]){
      case 'Junior Analyst':
        masteryTitleByLang[lang] = 'Intermediate Auditor';
        break;
      case 'Intermediate Auditor':
        masteryTitleByLang[lang] = 'Senior Dev';
        break;
      case 'Senior Dev':
        masteryTitleByLang[lang] = 'Reverse Engineer';
        break;
      case 'Reverse Engineer':
        masteryTitleByLang[lang] = 'God';
        break;
      case 'God':
        masteryTitleByLang[lang] = 'God';
        break;
    }
    masteryPercentByLang[lang] = 0;
  }
  await saveXpTitles(lang)
}
buttonDiv.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn || btn.id === 'challengesLoad') return;
    
    clearTimeout(closeTimeout); 
    
    const lang = btn.id;
    const levels = questionsMap[lang];
    if (!levels) return;

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
     const user = firebase.auth().currentUser;
     if (user) { 
        const title = (window.masteryTitleByLang && window.masteryTitleByLang[lang]) || 'Junior Analyst';
        const percent = (window.masteryPercentByLang && window.masteryPercentByLang[lang] !== undefined) 
                        ? window.masteryPercentByLang[lang] 
                        : 0;

    
    divTitle.textContent = `${lang.toUpperCase()} ${title}:${percent}% Mastery Until Next Title`
     } else {
       divTitle.textContent = `${lang.toUpperCase()} List. Please sign in to access mastery stats`
     }
    
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
buttonDiv.addEventListener('mouseout', () => {
    closeTimeout = setTimeout(() => {
        menu.style.display = 'none';
    }, 200);
});


function lighting(){
  const vulnLightsDiv = document.getElementById('vuln-lights');
  vulnLightsDiv.innerHTML = ''; 
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
appendToTerminal("root@spotthevuln:~# ./start_game.sh");
appendToTerminal("root@spotthevuln:~# Welcome, User! Select a language above to begin!")

