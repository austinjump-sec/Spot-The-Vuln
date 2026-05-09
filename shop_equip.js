async function checkPurchase(){
const user = firebase.auth().currentUser;
if (user) {
  const userRef = db.collection('users').doc(user.uid);

  userRef.onSnapshot(async doc => {
    if (!doc.exists) return;
    const data = doc.data();

    if (data.purchaseCompleted === true) {
      await equipSelected()
    }
  });
}
}
  let red = false 
  let blue = false 
  let pink = false 
  let purple = false 
  let green = false 
async function equipSelected(){
  const user = firebase.auth().currentUser;
  if (!user) return;

  const userRef = db.collection('users').doc(user.uid);
  const userDoc = await userRef.get();
  const data = userDoc.data() || {};


  const equipped = {
    title: data.equipped?.title || data["equipped.title"],
    terminalCustom: data.equipped?.terminalCustom || data["equipped.terminalCustom"]
  };


  green = purple = blue = pink = red = false;


  if (equipped.title){
    const titleItem = shopItems.find(i => i.id === equipped.title);
    if (titleItem){
      const el = document.getElementById('userTitle');
      el.textContent = `"${titleItem.name}"`;
      el.style.fontWeight = 'bold';
    } else {
      console.warn("Invalid equipped title:", equipped.title);
      document.getElementById('userTitle').textContent = 'f';
    }
  } else {
    document.getElementById('userTitle').textContent = 'f';
  }


  const term = equipped.terminalCustom || 'greenTerm';

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
}
document.getElementById('ownedItems').addEventListener('click', async () => {
  const user = firebase.auth().currentUser
  if (user){
    try {
    const userRef = db.collection('users').doc(user.uid)
    const doc = await userRef.get()
    const data = doc.data() || {}
    const inventory = data.inventory || {}
    const equipped = data.equipped || {}
    const miscellanious = document.getElementById('miscContent')
    document.getElementById('divTitle').textContent = 'View & Equip Owned Items'
    miscellanious.innerHTML = ''
    
    let ownedItems = []
    Object.entries(inventory).forEach(([type, items]) => {
      items.forEach(id => {
        ownedItems.push({id, type})
      })
    })
    
    if (ownedItems.length === 0){
      miscellanious.textContent = 'No Owned Items!'
      if (!right) toggleRightMenu()
      return
    }
    ownedItems.forEach(item => {
      const shopItem = shopItems.find(si => si.id === item.id)
      if (!shopItem) return
      const itemDiv = document.createElement('div')
      itemDiv.className = 'shop-item'
      itemDiv.style.display = 'flex'
      itemDiv.style.justifyContent = 'space-between'
      itemDiv.style.alignItems = 'center'
      itemDiv.style.marginBottm = '5px'
      const nameSpan = document.createElement('span')
      nameSpan.textContent = shopItem.name
      
      const equipButton = document.createElement('button')
      equipButton.textContent = (equipped[shopItem.type] === shopItem.id) ? 'Equipped' : 'Equip'
      equipButton.disabled = (equipped[shopItem.type] === shopItem.id)
      equipButton.addEventListener('click', async () => {
        try {
          const updateData = {}
          updateData[`equipped.${shopItem.type}`] = shopItem.id
          updateData.purchaseCompleted = true
          await userRef.update(updateData)
          
          miscellanious.querySelectorAll('button').forEach(b => {
            b.textContent = 'Equip'
            b.disabled = false
          })
          equipButton.textContent = 'Equipped'
          equipButton.disabled = true
          appendToTerminal(`Equipped ${shopItem.name}`)
          await checkPurchase()
        } catch (err){
          console.error('Equip failed', err)
        }
      })
      itemDiv.appendChild(nameSpan)
      itemDiv.appendChild(equipButton)
      miscellanious.appendChild(itemDiv)
    })
    if (!right) toggleRightMenu()
    } catch (err){
      console.error('Error loading menu', err)
    }
  }else {
    document.getElementById('miscContent').textContent = 'Sign In to purchase and equip items!'
    if (!right) toggleRightMenu()
  }
})

const shopItems = [
  {
    id: 'byteshifter',
    name: "Byte Shifter", 
    type: 'title', 
    cost: {skid: 2}
  },
  {
    id: 'greenTerm',
    name: 'Default Terminal',
    type: 'terminalCustom',
    cost: {skid: 0, hacker: 0, nsa: 0, cpu: 0}
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
  let selectedType = 'title' 
  let selectedToken = null
async function renderShop(filterToken = null){
  selectedToken = filterToken


if (!selectedType) selectedType = 'title';
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
        
  try {
    const doc = await userRef.get();
    const data = doc.data() || {};
    const tokens = data.speedTokens || {};
    const inventory = data.inventory || {};

    const ownedList = inventory[item.type] || [];
    if (ownedList.includes(item.id)){
      appendToTerminal('Item Owned!');
      return;
    }

    for (const [token, cost] of Object.entries(item.cost)){
      const current = tokens[token] || 0;
      if (current < cost){
        appendToTerminal("Not enough tokens");
        return;
      }
    }

    const updates = {};

    for (const [token, cost] of Object.entries(item.cost)){
      updates[`speedTokens.${token}`] =
        firebase.firestore.FieldValue.increment(-cost);
    }

    updates[`inventory.${item.type}`] =
      firebase.firestore.FieldValue.arrayUnion(item.id);

    await userRef.update(updates);

    appendToTerminal("Item Owned!")

    appendToTerminal(`Purchased ${item.name}!`);
    await equipSelected();
    document.getElementById('ownedItems').click();
    await renderShop(selectedToken);

  } catch (err){
    console.error("Failed buying item:", err);
    appendToTerminal("Purchase failed! :(");
  }
});

    container.appendChild(div)
      
    }
    
  })
  
  
}
