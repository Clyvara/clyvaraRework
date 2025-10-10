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
