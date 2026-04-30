# Spot-The-Vuln 🔍

Learn reverse engineering with a **gamified approach**! Spot real vulnerabilities across multiple programming languages while competing on global leaderboards.

---

## 🚀 **PLAY NOW** ▶️

### [👉 Open Spot-The-Vuln (No Installation Needed!)](https://spot-the-vuln.firebaseapp.com)

Just click the link above, sign in with GitHub, and start spotting vulnerabilities!

---

## ✨ Features

- **🎮 Gamified Learning**: Solve real vulnerabilities in JavaScript, PHP, SQL, C, and x86 Assembly
- **🏆 Global Leaderboards**: Compete worldwide, track personal bests, earn daily streaks
- **🐛 Real-World Vulnerabilities**: Buffer overflows, SQL injection, RCE, XSS, prototype pollution, and more
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
5. **Optional timer challenges**: Add time pressure (5min, 3min, 1min, or 30sec)
6. **View exploit details** for each vulnerability you find
7. **Climb the leaderboard** with your score

---

## 🐛 Vulnerability Types

| Language | Vulnerabilities |
|----------|------------------|
| **JavaScript** | RCE (eval), Crypto failures, Deserialization, Prototype pollution |
| **PHP** | SQL injection, LFI, XSS, Object injection, Code injection |
| **SQL** | SQL injection, Excessive privileges, Blind SQLi, Second-order injection |
| **C** | Buffer overflow, Format strings, Integer underflow, Use-after-free (UAF) |
| **Assembly x86** | Hardcoded comparisons, Stack pivots, Write-what-where, ROP gadgets |

---

## 🛠️ For Developers

Want to contribute challenges or improve the platform?

### Technologies
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Firebase (Authentication, Firestore)
- **Auth**: GitHub OAuth via FirebaseUI
- **Hosting**: Firebase Hosting

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
