# PodStream — Curating the Signal

**PodStream** is a premium, institutional audio curation platform designed for the auditory obsessive. Inspired by Swiss Brutalist aesthetics and modern archival systems, it transforms the podcast listening experience into a focused act of intellectual capture.

![PodStream Visual Language](https://podstream-hq.vercel.app/favicon.svg)

## 🌐 Live Application
**[podstream-hq.vercel.app](https://podstream-hq.vercel.app)**

---

## 💎 Design Philosophy: Swiss Brutalist
PodStream rejects the clutter of modern social feeds. Every interaction is governed by:
- **Cinema-Scale Typography**: Leveraging bold sans-serifs and high-contrast layouts.
- **Institutional Grids**: Sharp 1px borders and monospaced metadata inspired by architectural blueprints.
- **Grayscale Focus**: A minimalist palette that prioritizes content over decoration.

## 🛰️ Core Features

### 1. AI Intelligence Layer (Signal Panel)
Moving beyond passive listening. The **Signal Panel** uses AI to analyze live audio, providing:
- **Core Concepts**: A visual "word cloud" of key themes.
- **Structured Takeaways**: Instant summaries of complex discussions.
- **Smart Jump-Points**: Clickable timestamps to skip directly to the most dense insights.

### 2. Intellectual Capture (Split-Screen Notes)
A dedicated environment for the deep-thinker.
- **Fluid Layout**: Seamlessly toggle between video and a brutalist markdown-style notes editor.
- **Unified Sync**: Every note is automatically mapped to the specific video, saved securely to the Firestore Archive.

### 3. Infinite Signal Sync
A personalized feed driven by your specific intellectual interests (AI, Tech, Philosophy, Business), delivered via high-performance infinite scrolling.

---

## 🛠️ Technical Stack
- **Framework**: React 18 + Vite (High-speed build system)
- **Styling**: Tailwind CSS + Framer Motion (Precision micro-interactions)
- **Database/Auth**: Firebase Firestore & Firebase Authentication
- **API**: YouTube Data API v3 (Curated video/audio delivery)
- **Deployment**: Vercel (Edge-network performance)

---

## 🚀 Getting Started

### Installation
```bash
# Clone the repository
git clone https://github.com/abhinaycoding/PodStream.git

# Navigate to the project
cd PodStream

# Install dependencies
npm install

# Start the local development server
npm run dev
```

### Environment Variables
Create a `.env` file in the root:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_YOUTUBE_API_KEY=your_key
# ...other firebase config
```

---

## 🏛️ Project Vision
PodStream is built for users who view audio not as background noise, but as raw data to be processed and archived. It is a tool for the curious, the obsessive, and the architect of their own information diet.

**Curated by abhinaycoding.**
