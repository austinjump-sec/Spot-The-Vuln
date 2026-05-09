window.addEventListener('DOMContentLoaded', async () => {
  await loadAllQuestions()
  console.log('Questions Loaded!')

})
let gitUser = false;
let leaderboardResults = [];


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

 const firebaseUiContainer = document.getElementById('firebaseui-auth-container');
const db = firebase.firestore();
const ui = new firebaseui.auth.AuthUI(firebase.auth());
const user = firebase.auth().currentUser
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      try {
        await loadUserMastery()
        gitUser = true;
        ui.reset();
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        const titleName = (userData.equipped && userData.equipped.title) || "No Title";
        
        const titleElement = document.getElementById('userTitle');
        if (titleElement) {
          titleElement.textContent = `"${titleName}"`;
          titleElement.style.fontWeight = 'bold';
        }
          const accountMenu = document.getElementById('accountMenu');
         const welcomeText = document.getElementById('welcomeText');
        const pfpImg = document.getElementById('userPfp');
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

    
const leadDoc = await db.collection('users').doc(user.uid).collection('Streaks').doc(`${user.uid}`).get();
    if (leadDoc.exists) {
      const percent = leadDoc.data().streakPercent || 0;
      if (document.getElementById('gradientBar')) {
          document.getElementById('gradientBar').style.width = percent + '%';
      }
      if (streakValue) streakValue.textContent = percent;
    }

    await db.collection('users').doc(user.uid).set({
      uid: user.uid,
      githubUsername: githubUsername,
      photoURL: githubPfp,
      lastSignInTime: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
        
      }catch (err) {
        console.error("Error loading title", err);
      }

   }else {
    gitUser = false;
    
    if (firebaseUiContainer) firebaseUiContainer.style.display = 'block';
    
    ui.start('#firebaseui-auth-container', {
      signInOptions: [firebase.auth.GithubAuthProvider.PROVIDER_ID],
      signInSuccessUrl: 'index.html'
    });
  }
      });
//here
async function loadUserMastery(){
  const user = firebase.auth().currentUser;
  if (!user){
    console.log('No user signed in')
    return
  }
  try{
    const userDoc = await db.collection('users').doc(user.uid).get()
    if (!userDoc.exists) return; 
    const data = userDoc.data() || {}
    const mastery = data.mastery || {}
    window.masteryPercentByLang = {}
    window.masteryTitleByLang = {}
    if (data.mastery) {
    for (const [lang, info] of Object.entries(data.mastery)) {
        // Log it to see exactly what JS is seeing from Firestore
        console.log(`Loading ${lang}:`, info); 
        
        window.masteryPercentByLang[lang] = (info && info.percent !== undefined) ? info.percent : 0;
        window.masteryTitleByLang[lang] = (info && info.title) ? info.title : 'Junior Analyst';
    }
}
    const equipped = {
    title: data.equipped?.title || data["equipped.title"],
    terminalCustom: data.equipped?.terminalCustom || data["equipped.terminalCustom"]
  };
    const equippedTitle = (data.equipped && data.equipped.title) || ''
    const userTitleEl = document.getElementById('userTitle')
    if (userTitleEl) userTitleEl.textContent = `${equippedTitle}`
    const terminalCustom = (data.equipped && data.equipped.terminalCustom) || null
    if (terminalCustom){
      const term = equipped.terminalCustom || 'greenTerm'
      switch (term){
         case 'purpTerm': purple = true; break;
    case 'blueTerm': blue = true; break;
    case 'pinkTerm': pink = true; break;
    case 'redTerm': red = true; break;
    default: green = true;
      }
      if (purple) {
    document.documentElement.style.setProperty('--primary', '#9534eb');
document.getElementById('STVlogo').src = '/media/STVPurple.png'
  } else if (blue) {
    document.documentElement.style.setProperty('--primary', '#007acc');
document.getElementById('STVlogo').src = '/media/STVBlue.png'
  } else if (pink) {
    document.documentElement.style.setProperty('--primary', '#ff69b4');
document.getElementById('STVlogo').src = '/media/STVPink.png'
  } else if (red) {
    document.documentElement.style.setProperty('--primary', '#ff4444');
document.getElementById('STVlogo').src = '/media/STVRed.png'
  } else {
document.getElementById('STVlogo').src = '/media/STV1.png'
    document.documentElement.style.setProperty('--primary', '#5cfa23');
  }
    console.log('Theme Loaded')
    }
    console.log('Mastery Loaded')
  }catch(err){
    console.error("Error loading equipped items and stats", err)
  }
  
}
const terminalInput = document.getElementById('termInput')
const terminal = document.getElementById('termContent')
const terminalDiv = document.getElementById('terminal')
const tracker = document.getElementById('lineTracker')
const insanity = document.getElementById('stack-addr')
const sanity = document.getElementById('stack-val')
const buttonDiv = document.getElementById('btns');
const codeDiv = document.getElementById('code');
const h5 = document.getElementById('h5');
let hideNext = false
let foundLines = []
const questionsMap = {};
async function loadAllQuestions(){
  try{
    const [js, php, sql, c, asm, terraform] = await Promise.all([
      fetch('/langs/js.json').then(r => r.json()),
      fetch('/langs/php.json').then(r => r.json()),
      fetch('/langs/sql.json').then(r => r.json()),
      fetch('/langs/c.json').then(r => r.json()),
      fetch('/langs/asm.json').then(r => r.json()),
      fetch('/langs/terraform.json').then(r => r.json())
    ]);
    questionsMap.js = js
    questionsMap.php = php 
    questionsMap.sql = sql 
    questionsMap.c = c 
    questionsMap.asm = asm
    questionsMap.terraform = terraform
  } catch (err){
    console.error('Error loading questions:', err)
  }
}
