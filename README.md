# 🧠 Neuro Vault (Brainwave)

An interactive, AI-powered document intelligence platform that allows you to create workspaces, upload documents, and chat with them using advanced AI and vector search technologies.

<details>
<summary><strong>✨ Table of Contents (Click to Expand)</strong></summary>

- [Overview](#-overview)
- [Interactive Features](#-interactive-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#️-getting-started)
- [Interactive Guide](#-interactive-guide-how-to-use)
</details>

## 🌟 Overview
Neuro Vault is an advanced document intelligence platform. By leveraging Large Language Models (LLMs) and vector databases, it allows users to contextually interact with their documents. Instead of manually searching through PDFs and Word files, simply ask questions and get precise, context-aware answers.

## 🚀 Interactive Features
- **Collaborative Workspaces:** Create public or private workspaces. Send and manage join requests.
- **Role-Based Access Control:** Organize your teams with Admin and Member roles.
- **Intelligent Document Processing:** Seamlessly parse PDFs, Word documents, and text files.
- **AI-Powered Chat:** Real-time conversational interface with your documents powered by **Langchain**, **OpenAI**, **Google GenAI**, and **Pinecone**.
- **Dynamic & Responsive UI:** Enjoy a fluid user experience featuring interactive charts, Lottie animations, and smooth transitions powered by Framer Motion.

## 💻 Tech Stack
**Frontend (Brainwave):**
- **Framework:** React + Vite
- **Styling:** Tailwind CSS + SASS + CoreUI
- **State Management:** Redux
- **Interactivity:** Framer Motion, Lottie React, Chart.js

**Backend (Neuro Vault API):**
- **Server:** Node.js + Express
- **Database:** PostgreSQL (with Sequelize/pg)
- **AI & ML:** Langchain, OpenAI, Google GenAI
- **Vector DB:** Pinecone
- **File Parsing:** pdf-parse, pdf2json, mammoth, word-extractor

---

## 📸 Screenshots

> **Note:** Replace the placeholder image paths below with actual screenshots of your application to make this section interactive and visual.

<div align="center">
  <table>
    <tr>
      <td align="center">
        <strong>Interactive Dashboard</strong><br/>
        <img src="https://via.placeholder.com/400x250?text=Dashboard+Screenshot" width="400" alt="Dashboard Screenshot">
      </td>
      <td align="center">
        <strong>AI Document Chat</strong><br/>
        <img src="https://via.placeholder.com/400x250?text=Chat+Interface+Screenshot" width="400" alt="Chat Screenshot">
      </td>
    </tr>
    <tr>
      <td align="center">
        <strong>Workspace Management</strong><br/>
        <img src="https://via.placeholder.com/400x250?text=Workspaces+Screenshot" width="400" alt="Workspace Screenshot">
      </td>
      <td align="center">
        <strong>Document Uploads</strong><br/>
        <img src="https://via.placeholder.com/400x250?text=Document+Upload+Screenshot" width="400" alt="Upload Screenshot">
      </td>
    </tr>
  </table>
</div>

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [PostgreSQL](https://www.postgresql.org/)
- API Keys: [Pinecone](https://www.pinecone.io/), [OpenAI](https://openai.com/) / [Google GenAI](https://ai.google.dev/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd neuro_vault
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   > Create a `.env` file in the `backend` directory with your database connection string and API keys.
   ```bash
   npm start
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   > Create a `.env` file in the `frontend` directory with your backend API URL if necessary.
   ```bash
   npm run dev
   ```

## 🎮 Interactive Guide (How to Use)
- [ ] **Step 1:** Sign up and log in to the Neuro Vault platform.
- [ ] **Step 2:** Create a new workspace (choose between public or private).
- [ ] **Step 3:** Navigate to your workspace and upload your PDF or Word documents. Wait for the processing to complete (status changes from `pending` to `approved`).
- [ ] **Step 4:** Open the Chat interface and start asking questions about your uploaded documents!
