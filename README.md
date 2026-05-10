# Spot-The-Vuln 🔍

Learn reverse engineering with a **gamified approach**! Spot real vulnerabilities across multiple programming languages while competing on global leaderboards. Challenges sourced from **real** vulnerable code spotted in bug bounties and breaches using CVEfixes for authenticity!

---
<img width="1649" height="917" alt="image" src="https://github.com/user-attachments/assets/d8da3cf7-1dcf-4e4d-b464-92c77a213435" />


## 🚀 **PLAY NOW** ▶️

### [👉 Open Spot-The-Vuln (No Installation Needed!)](https://spot-the-vuln.firebaseapp.com)

Just click the link above, sign in with GitHub, and start spotting vulnerabilities!

---
## 🤔 Why did I build this? 
As a studying pentester, I found that most CTFs lack intense visualization, spotting, and teaching, of code-centric exploits (especially ASM and IAC).
So I designed a CTF style of my own that involves static visualization,  timer pressure, and competition within finding exploitable lines of code in large code chunks, and rewards players with detailed exploit information. 

## ✨ Features

- **🎮 Gamified Learning**: Solve real vulnerabilities in JavaScript, PHP, SQL, C, and x86 Assembly
- **🏆 Global Leaderboards**: Compete worldwide, track personal bests, earn daily streaks
- **🏅 Achievements**: Timer-based achievements earn you tokens for the shop
- **🛒 Cosmetics Shop**: Earn terminal themes and titles from timer-based challenges
- **⭐ Mastery Titles**: Level up your current languages title by completing questions on that language 
- **🐛 Real-World Vulnerabilities**: Sourced from real breaches and bug bounties using CVEfixes
- **🔧 Interactive Debugger**: Step through assembly execution with live register and stack visualization
- **⚡ Intelligent Scoring**: Time-based scoring with accuracy bonuses for quick detection
- **🔐 GitHub Integration**: Sign in with GitHub to save progress and compete globally
- **📈 Daily Streaks & Prestige**: Maintain streaks for bonus progression

---

## 🎯 How It Works

1. **Sign in** with your GitHub account
2. **Choose a language**: JavaScript, PHP, SQL, C, or Assembly x86
3. **Select a challenge** and difficulty level
4. **Spot the vulnerabilities** in the code
5. **Earn XP** and gain language mastery titles
6. **Optional timer challenges**: Earns achievements to get tokens
7. **Buy titles and themes** to customize terminal and earn bragging rights
8. **View exploit details** for each vulnerability you find
9. **Climb the leaderboard** with your score

---

## 🐛 Vulnerability Types

| Language | Vulnerabilities |
|----------|------------------|
| **JavaScript** | RCE (eval), Crypto failures, Deserialization, Prototype pollution |
| **PHP** | SQL injection, LFI, XSS, Object injection, Code injection |
| **SQL** | SQL injection, Excessive privileges, Blind SQLi, Second-order injection |
| **C** | Buffer overflow, Format strings, Integer underflow, Use-after-free (UAF) |
| **Assembly x86** | Hardcoded comparisons, Stack pivots, Write-what-where, ROP gadgets |
| **Terraform** | Unrestricted public access, Wildcard Principal, Excessive S3 permissions, Run as Root |

## ⚖️ Credits and Licensing
This project is licensed under the Apache License 2.0. Code challenges are sourced from real-world vulnerabilities via the CVEfixes dataset and remain the property of their respective original authors. These snippets are used here for educational and transformative purposes under Fair Use.
---

## 🛠️ For Developers

Want to contribute challenges or improve the platform?

### Technologies
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Firebase (Authentication, Firestore)
- **Auth**: GitHub OAuth via FirebaseUI
- **Hosting**: Firebase Hosting
- **Sourcing**: CVEfixes to find real world vulnerable code snipbits, and format it in the JSON tree. For ASM, I use objdump -d on an exploitable c program to get static heap, stack, and regs
### Local Development
```bash
# Clone the repository
git clone https://github.com/austinjump-sec/Spot-The-Vuln.git
cd Spot-The-Vuln

# Open in browser (no build needed!)
open index.html

# Or use a local server
python -m http.server 8000
# Visit http://localhost:8000
