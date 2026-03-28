# 🤖 Premium AI Chatbot

A stunning, full-stack AI conversational agent featuring an ultra-premium glassmorphism UI built with **React** & **Vite**, powered by a robust **Node.js/Express** backend integrating the **OpenAI API**.

---

## ✨ Key Features

### Frontend (`chatbot-frontend/`)
- **🎨 Glassmorphism Design:** Beautiful translucent UI components with dynamic, infinitely shifting gradient backgrounds.
- **🌙 Interactive Dark Mode:** A sleek "Hacker" neon-cyan theme that flawlessly toggles back and forth.
- **📝 Native Markdown Support:** Renders bold text, dynamic lists, and syntax-highlighted code blocks perfectly.
- **📋 Copy to Clipboard:** Instantly copy the AI's complex responses to your system clipboard with a single intelligent hover click.
- **⚡ Spring-Physics Animations:** High-end cubic-bezier sliding animations and interactive tactile buttons.
- **🗑️ Smart Session Management:** Easily clear your ongoing conversation history natively.

### Backend (`chatbot-task/`)
- **🧠 OpenAI Integration:** Fast and efficient server-level communication models (`gpt-4o-mini`).
- **🗃️ Contextual Memory:** Smart token trimming to seamlessly manage and supply ongoing conversation history.
- **🔒 Environment Security:** Fully managed API keys via local `.env` configuration mapping.

---

## 🚀 Getting Started

Follow these concise steps to run the full-stack application natively on your local machine.

### 1️⃣ Setting up the Backend
1. Open your terminal and navigate to the backend directory:
   ```bash
   cd chatbot-task
   ```
2. Install the necessary Node dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file internally and safely define your OpenAI Key:
   ```env
   OPENAI_API_KEY=your_api_key_here
   PORT=3000
   ```
4. Start the Express backend communication server:
   ```bash
   node index.js
   ```

### 2️⃣ Setting up the Frontend
1. Open *another* terminal window and navigate to the frontend directory:
   ```bash
   cd chatbot-frontend
   ```
2. Install the React packages (explicitly importing `react-markdown` and `lucide-react`):
   ```bash
   npm install
   ```
3. Launch the fast-refresh Vite development renderer:
   ```bash
   npm run dev
   ```
4. Finally, open your web browser and navigate directly to `http://localhost:5173/` to interact with your AI!

---

## 🛠️ Technology Stack
- **Frontend Architecture:** React.js, Vite, Modern CSS Variables, Lucide React Icons, React Markdown
- **Backend Architecture:** Node.js, Express framework, CORS, dotenv, OpenAI Platform

## 👨‍💻 Developer
Developed by **Devanandana Chandran** (devanandanachandran@gmail.com).
