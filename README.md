# Clyvara Rework
New and improved Clyvara website — Fall 2025 release.

---

## ⚙️ Setup

### 1. Create and activate a virtual environment
```bash
python -m venv <env_name>
source <env_name>/bin/activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure backend environment variables (OpenAI)
Create a `.env` file in /backend and add your OpenAI API secret key:
```
OPENAI_API_KEY="your_secret_key_here"
```

### 4. Configure frontend environment variables (Supabase)
Create a `.env.local` file in /frontend and add your OpenAI API secret key:
```
VITE_SUPABASE_URL= "supabase_url_here"
VITE_SUPABASE_ANON_KEY="your_secret_key_here"
```

---

## Development Workflow

### Create a new feature branch
```bash
git checkout -b <branch_name>
```

### Run the app locally

Run **backend** and **frontend** separately:

#### Backend
```bash
uvicorn main:app --reload
```

#### Frontend
```bash
npm run dev
```

---

## 🧩 Notes
- Make sure both backend and frontend servers are running for full functionality.  
- Commit changes only from feature branches — open a PR to merge into `main`.  
- Use the `.env.example` format (if present) for consistent environment setup.

# 📁 Project Structure Documentation  
**Last Updated:** 12/5/25  

This project consists of a **React + Vite frontend** and a **FastAPI + Python backend**, organized into two main directories. Below is an overview of the full structure.

---

## 🖥️ Backend (`backend/`)

The backend handles all server-side operations, external integrations, and API logic.

### **Key Responsibilities**
- Connects to **Supabase**, **AWS**, and **OpenAI**
- Manages environment variables and backend configuration
- Defines API routes and server functionality
- Controls the system prompt and AI behavior

### **Important Files**
- **`roadmaps/`**  
  Provides a high-level overview of the backend architecture.

- **`.env`**  
  Contains all environment variables and secret keys.  
  ⚠️ *Do not commit this file to version control.*

- **`systemprompt.txt`**  
  Defines the OpenAI system prompt specifying the AI's role and behavior.

---

## 🎨 Frontend (`frontend/`)

The frontend is built using **React + Vite** and includes all user interface components and routing logic.

### **Directory Overview**

- **`src/`**  
  Core folder containing all React components, pages, and logic.

- **`app.jsx`**  
  Main entry point for client-side routing across all pages.

- **`assets/`**  
  Holds:
  - Learning plan module content  
  - Images, logos, and other static resources  

- **`components/`**  
  Collection of reusable UI components used across the frontend.

- **`layouts/`**  
  Contains layout wrappers that ensure consistent structure/design across pages.

---

Let me know if you want a **file tree**, **diagram**, or a more polished README section!




