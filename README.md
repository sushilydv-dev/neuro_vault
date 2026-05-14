# NeuroVault: Collaborative AI Knowledge Hub

NeuroVault is a privacy-preserving, collaborative AI-powered knowledge management platform that allows organizations to transform their private PDF collections into an intelligent, queryable knowledge base. Unlike cloud-based AI tools, NeuroVault operates entirely on local infrastructure, ensuring complete data sovereignty for sensitive organizational information.

[Image of NeuroVault Architecture]

## 🚀 Key Features

- **Local RAG Pipeline:** Leverages Retrieval-Augmented Generation (RAG) to provide precise answers grounded solely in your organization's documents.
- **Privacy First:** All AI processing and data storage happen on your own server. No data is ever sent to third-party APIs (like OpenAI or Google).
- **Collaborative Workspaces:** Multi-tenant architecture with isolated workspaces for different departments or organizations.
- **Admin Approval Workflow:** A structured queue where administrators verify documents before they are indexed into the knowledge base to ensure information quality.
- **Multilingual Support:** Native support for querying in **English, Hindi, and Punjabi** via a self-hosted translation engine.
- **Source Attribution:** Every AI-generated response includes exact citations (Document Name & Page Number) to eliminate hallucinations and ensure verifiability.
- **Trusted Contributors:** Automated tracking of members who consistently provide high-quality, approved documentation.
- **Analytics Dashboard:** Real-time visualizations of knowledge gaps, query frequency, and member contributions.

## 🛠️ Technology Stack

### Frontend

- **React.js 18:** Modern UI component architecture.
- **Recharts:** Interactive data visualizations for the admin dashboard.
- **Socket.io-client:** Real-time notifications for document status and system alerts.
- **Tailwind CSS:** Responsive and professional styling.

### Backend

- **Node.js & Express.js:** Scalable server-side logic and RESTful API.
- **PostgreSQL:** Relational data storage for users, workspaces, and chat history.
- **Pinecone / ChromaDB:** Vector database for high-speed semantic similarity search.
- **JWT & bcrypt:** Secure industry-standard authentication and password hashing.
- **Multer:** Efficient multipart/form-data handling for PDF uploads.

### AI Layer (Fully Local)

- **Ollama:** Orchestrates local LLM execution.
- **Phi-3 Mini (3.8B):** A highly capable lightweight language model for reasoning and answer generation.
- **nomic-embed-text:** High-performance 768-dimensional embeddings for semantic search.
- **LibreTranslate:** Self-hosted API for offline multilingual query processing.
- **LangChain:** Framework for document chunking and RAG orchestration.

## 📸 Screenshots

|                                   Landing Page                                    |                                   Admin Dashboard                                   |
| :-------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------: |
| ![Landing Page](https://via.placeholder.com/800x450?text=NeuroVault+Landing+Page) | ![Admin Dashboard](https://via.placeholder.com/800x450?text=NeuroVault+Admin+Panel) |

|                                Chat Interface                                 |                            Workspace Management                             |
| :---------------------------------------------------------------------------: | :-------------------------------------------------------------------------: |
| ![Chat Interface](https://via.placeholder.com/800x450?text=AI+Chat+Interface) | ![Workspace](https://via.placeholder.com/800x450?text=Workspace+Management) |

## 🌐 Live Demo

You can view a live demonstration of the project here: **[Insert Your Live URL Here]**

## 🏗️ System Architecture

1. **Document Ingestion:** PDF Upload → Admin Review → Text Extraction (pdf-parse) → Semantic Chunking (LangChain) → Vector Embedding (nomic-embed-text) → Vector DB Storage.
2. **Query Pipeline:** User Query → Language Detection → Translation (LibreTranslate) → Semantic Retrieval → Contextual Prompting → Local LLM Inference (Phi-3) → Cited Answer.
