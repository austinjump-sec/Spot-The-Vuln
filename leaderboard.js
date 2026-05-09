
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
    for (const doc of querySnapshot.docs){
      
      const data = doc.data()
      const uid = data.uid 
  
      const userDoc = await db.collection('users').doc(uid).get()
      const userData = userDoc.data()
      const titleName = userData.equipped.title ||  "No Title"
      const tier = document.createElement('div')
      tier.id = 'tier'
      tier .textContent = `#${rank} ${data.userName} "${titleName}" | Score: ${data.score} | Time: ${data.finalTime}s`
      miscellanious.appendChild(tier)
      rank++
      
    }

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    miscellanious.textContent = `Failed to load leaderboard.${error}`;
  }
  }
const streakValue = document.getElementById('streakValue');
async function updateDailyStreak(userUid, currentQuestion) {
  const leaderboardRef = db.collection('users').doc(userUid).collection('Streaks').doc(`${userUid}`);
  try {
    const doc = await leaderboardRef.get();
    if (!doc.exists) {
      console.log("No streak record found. Starting fresh.");
      await leaderboardRef.set({
        streakPercent: 1,
        lastCompleted: firebase.firestore.FieldValue.serverTimestamp()
      });
      return 1;
    }
       
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

const gRank = document.getElementById('globalRank')
gRank.addEventListener('click', async () => {
  const divTitle = document.getElementById('divTitle')
  divTitle.textContent = 'Leaderboard'
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

async function showLeaderboard() {
  try {
    const miscContent = document.getElementById('miscContent');
    miscContent.innerHTML = '';

    const querySnapshot = await db.collection('leaderboard')
      .orderBy('score', 'desc')
      .limit(50) 
      .get();

    if (querySnapshot.empty) {
      miscContent.textContent = 'No leaderboard data yet.';
      return;
    }

    let rank = 1;

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      const tier = document.createElement('div');
      tier.id = 'tier';

      tier.textContent = `#${rank} | ${data.userName || 'User'} "${data.titleName || 'No Title'}" | Score: ${data.score} | Time: ${data.finalTime}s | Program: ${data.program}`;

      miscContent.appendChild(tier);
      rank++;
    });

  } catch (error) {
    console.error("Error retrieving leaderboard", error);
    document.getElementById('miscContent').textContent = 'Failed to load leaderboard.';
  }
}

async function createLeaderboard(score, elapsedSeconds, currentQuestion) {
  const user = firebase.auth().currentUser;
  if (!user || !currentQuestion) return;

  try {
const userDoc = await db.collection('users').doc(user.uid).get()
      const userData = userDoc.data()
const titleName = userData.equipped?.title ||  "No Title"
const githubData = user.providerData.find(p => p.providerId === 'github.com');
    const githubUsername = githubData?.screenName || githubData.displayName || "User";
const userRef = db.collection('users').doc(user.uid);



 const userSnap = await userRef.get();
const currentTotal = userSnap.data().totalSpeeds;
    await db.collection('leaderboard').doc(`${user.uid}_${currentQuestion.title}`).set({
      score: score,
      finalTime: elapsedSeconds,
      program: currentQuestion.title,
      userName: githubUsername,
      uid: user.uid,
      titleName: titleName
    }, {merge: true});
    updateDailyStreak(user.uid, currentQuestion);
  } catch (e) {
    console.error("Error saving score:", e);
  }
}
