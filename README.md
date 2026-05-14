# Neuro Vault (Brainwave)

An AI-powered document intelligence platform enabling contextual interaction with data through advanced language models and vector search technologies.

---

## Overview

Neuro Vault transforms static documents into interactive knowledge bases. By leveraging Large Language Models (LLMs) and vector databases, the platform allows users to intuitively interrogate their data, extracting precise, context-aware insights without the friction of manual searching.

## Features

- **Collaborative Workspaces:** Establish public or private environments tailored for specific projects or teams.
- **Access Control:** Implement robust, role-based access for streamlined team management.
- **Intelligent Processing:** Seamlessly ingest and parse PDF, Word, and raw text files.
- **AI-Powered Retrieval:** Access a real-time conversational interface utilizing **Langchain**, **OpenAI**, **Google GenAI**, and **Pinecone**.
- **Modern Interface:** Experience a fluid, responsive UI featuring dynamic visualizations and smooth transitions.

## Architecture & Tech Stack

### Frontend (Brainwave)
- **Framework:** React + Vite
- **Styling:** Tailwind CSS, SASS, CoreUI
- **State Management:** Redux
- **Interactivity:** Framer Motion, Chart.js

### Backend (Neuro Vault API)
- **Server:** Node.js, Express
- **Database:** PostgreSQL (with Sequelize/pg)
- **Intelligence:** Langchain, OpenAI, Google GenAI
- **Vector Storage:** Pinecone
- **File Parsing:** pdf-parse, pdf2json, mammoth, word-extractor

---

## Application Previews

<div align="center">
  <img src="frontend/src/assets/readme/Screenshot 2026-05-14 at 2.30.49 AM.png" alt="Application Interface Preview 1" width="100%">
  <br/>
  <br/>
  <img src="frontend/src/assets/readme/Screenshot 2026-05-14 at 2.36.27 AM.png" alt="Application Interface Preview 2" width="100%">
  <br/>
  <br/>
  <img src="frontend/src/assets/readme/Screenshot 2026-05-14 at 2.36.48 AM.png" alt="Application Interface Preview 3" width="100%">
</div>

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- API Keys: Pinecone, OpenAI, or Google GenAI

### Installation

**1. Clone the repository**
```bash
git clone <repository-url>
cd neuro_vault
```

**2. Backend Configuration**
```bash
cd backend
npm install
```
*Note: Create a `.env` file in the `backend` directory containing your database credentials and API keys.*
```bash
npm start
```

**3. Frontend Configuration**
```bash
cd ../frontend
npm install
```
*Note: Create a `.env` file in the `frontend` directory containing your backend API URL if required.*
```bash
npm run dev
```

## Usage Guide

1. **Authentication:** Register and authenticate to access the platform.
2. **Workspace Initialization:** Create a dedicated workspace for your organization or project.
3. **Data Ingestion:** Upload target documents and monitor the processing pipeline.
4. **Analysis & Retrieval:** Navigate to the chat interface to query and analyze your documents contextually.
