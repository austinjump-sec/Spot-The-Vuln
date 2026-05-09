
function computeScore(elapsedSeconds){
  let maxScore = 1000 
  const score = Math.max(0, maxScore - (elapsedSeconds * 5))
  let multiplier =  1 + (accuracyBonus / 10)
  return Math.floor(score * multiplier)
}

let linesTried = 0
function updateDebugger(step) {
  insanity.textContent = ''
  sanity.textContent = ''
  const registersDiv = document.getElementById('registers');
  registersDiv.querySelectorAll('div').forEach(div => div.remove());
  document.querySelectorAll('.code-line').forEach(el => {
        el.style.backgroundColor = ''; 
        el.classList.remove('active-step'); 
    });
     const currentLine = document.getElementById(`line-${step.addr}`);
    if (currentLine) {
        currentLine.style.backgroundColor = 'rgba(255, 0, 0, 0.4)'; 
        currentLine.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  for (const reg in step.regs) {
    const regDiv = document.createElement('div');
    regDiv.textContent = `${reg}: `;
    const span = document.createElement('span');
    span.id = `reg-${reg.toLowerCase()}`;
    span.textContent = step.regs[reg];
    regDiv.appendChild(span);
    registersDiv.appendChild(regDiv);
  }


  const stackDiv = document.getElementById('stack');
  const stackItems = stackDiv.querySelectorAll('div:not(:first-child)')

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

let closeTimeout;


menu.addEventListener('mouseenter', () => {
    clearTimeout(closeTimeout); 
});
menu.addEventListener('mouseleave', () => {
    menu.style.display = 'none';
});
document.addEventListener('click', e => {
    const levelBtn = e.target.closest('.level-btn');

    if (!levelBtn) return;

    
    const lang = levelBtn.dataset.lang;
    const index = parseInt(levelBtn.dataset.idx);

    
    currentQuestion = questionsMap[lang][index];

    
    const menu = document.getElementById('dynamic-dropdown');
    if (menu) menu.style.display = 'none';

    
    console.log("Loading level:", currentQuestion.title);
    
});


  
;

    const registersAsm = document.getElementById('reg4')
    const stackAsm = document.getElementById('stack4')

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
  
  stackItems.forEach(div => div.remove())
  const registersDiv = document.getElementById('registers');
registersDiv.querySelectorAll('div').forEach(div => {
  if (div.id !== 'reg4') div.remove();
});
    codeDiv.textContent = currentQuestion.code;
  }
  lighting()
};

document.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter'){
        e.preventDefault()
        const input = terminalInput.value.trim().toLowerCase();
    
    if (activeVulnLine !== null || notReady) {
      if (notReady){
      if (input === 'y') {
        let terminalResponse = currentQuestion.insecureLines[activeVulnLine].vuln;
        appendToTerminal(`> ${input}`); 
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
           activeVulnLine = null; 
    }
    submitAnswer()
    terminalInput.value = ''; 
    
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
let activeVulnLine = null;



function submitAnswer(){
  if (!currentQuestion) return;
  const userLines = terminalInput.value.split(',').map(s => s.trim())
  let newlyFound = 0 
  
  userLines.forEach(line => {
    if (
      (Array.isArray(currentQuestion.insecureLines) && currentQuestion.insecureLines.includes(line)) ||

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
        appendToTerminal(`> ${input}`); 
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
    await createLeaderboard(score, elapsedSeconds, currentQuestion)
    await xpToPercent(currentQuestion)
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
    currentQuestion = null
  }
}
