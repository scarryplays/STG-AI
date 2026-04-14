# 🚀 STG AI – Smart Trust Guard (AI-Powered Browser Extension)

STG AI is a real-time AI-powered browser extension that analyzes websites and helps users decide whether a site is safe, suspicious, or risky. It provides intelligent suggestions like whether to use your main account or a dummy account.

---

## 🧠 Features

* 🔍 Real-time URL analysis
* 🤖 AI-based phishing detection (ML model)
* 🛡 Trust Score: SAFE / CAUTION / RISK
* 💡 Smart suggestions (main account / secondary / dummy)
* 📊 AI confidence percentage
* 📌 Reason-based explanation system
* 🔐 Login form detection
* 🧬 Tracker detection
* 🌐 Domain age analysis (WHOIS)
* ⚡ Works on dynamic websites (SPA support)

---

## 🏗 Tech Stack

**Frontend (Extension)**

* JavaScript
* Chrome Extension APIs

**Backend**

* Django
* Django REST Framework

**Machine Learning**

* Scikit-learn (Random Forest)
* Custom feature extraction (URL-based)

---

## ⚙️ How It Works

1. User opens a website
2. Extension captures the URL and page signals
3. Data is sent to backend API
4. ML model analyzes phishing patterns
5. Backend calculates trust score
6. Extension displays result via:

   * Popup UI
   * Top warning banner

---

## 📂 Project Structure

```
STG-AI/
│
├── backend/
│   ├── trust/
│   ├── ml/
│   └── manage.py
│
├── extension/
│   ├── content.js
│   ├── popup.jsx
│   └── manifest.json
│
└── README.md
```

---

## 🚀 Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/stg-ai.git
cd stg-ai
```

---

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

---

### 3️⃣ Load Extension

1. Open Chrome
2. Go to: `chrome://extensions/`
3. Enable **Developer Mode**
4. Click **Load unpacked**
5. Select `extension/` folder

---

## 🧪 Demo Flow

* Open any website
* STG AI analyzes it automatically
* A banner appears with risk level
* Click extension icon → view details

---

## 📸 Screenshots (Optional)

*Add screenshots here for better presentation*

---

## ⚠️ Disclaimer

This tool provides AI-based predictions and should be used as a guidance system. It does not guarantee 100% accuracy.

---

## 👨‍💻 Author

**Anubhav Kumar**
B.Tech IT Student | Full Stack Developer

---

## ⭐ Future Improvements

* Risk score in percentage
* Better UI/UX (glassmorphism)
* Chrome Web Store deployment
* Advanced ML model training
* False positive reduction

---

## 💥 Final Note

This project demonstrates the integration of:

* Machine Learning
* Browser Extensions
* Backend APIs
* Real-time security analysis

---
