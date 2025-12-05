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

