# 📁 Project Structure Documentation  
**Last Updated:** 12/5/25  

This project consists of a **React + Vite frontend** and a **FastAPI + Python backend**, organized into two main directories. Below is a clean overview of the full structure, runtime behavior, and services used.

---

## 🚀 Runtime Information
- **Frontend (React/Vite)** runs on **port `8001`**  
- **Backend (FastAPI)** runs on **port `8000`**
- **Global styling** is defined in:
  - `app.css` or  
  - `index.css`

---

## 🖥️ Backend (`backend/`)

The backend is responsible for all server-side logic, external integrations, authentication, and API routing.

### **Technologies & Integrations**
- **Supabase**  
  Handles all **user authentication** (login + signup flows).  

- **AWS**  
  Stores and manages **backend schemas**, including data models and storage layers.

- **OpenAI**  
  Powers the **Brainie assistant** and supports AI logic for the **Anesthesia Care Plan module**.

### **Key Files & Directories**
- **`roadmaps/`**  
  High-level documentation of backend architecture and component interactions.

- **`.env`**  
  Stores all environment secrets and API keys.  
  ⚠️ *Never commit this to Git.*

- **`systemprompt.txt`**  
  Defines the OpenAI system prompt that shapes the AI’s behavior across the care plan features.

---

## 🎨 Frontend (`frontend/`)

The frontend is built with **React + Vite** and holds all user-facing UI, routing, and component logic. We use the React library 'Styled Components' to integrate CSS with JavaScript.

### **Directory Overview**
- **`src/`**  
  Primary folder containing pages, components, hooks, and routing.

- **`app.jsx`**  
  The main entry point for all client-side routing.

- **`assets/`**  
  Holds:
  - Learning plan module content  
  - Images, icons, and logos used across the UI  

- **`components/`**  
  Reusable visual and interactive components used throughout the app.

- **`layouts/`**  
  Shared layout structures to ensure consistent formatting across pages.

---

## 📦 Miscellaneous

- **`node_modules/`**  
  Contains all third-party packages required to run the frontend.  
  Automatically generated — do *not* edit or commit manually.

- **`package-lock.json`**  
  Ensures consistent dependency versions across environments.  
  Required for stable installs and should always remain in version control.
