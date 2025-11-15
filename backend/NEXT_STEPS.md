# Next Steps: Upload System Textbooks

## ✅ What's Already Done

- [x] System materials feature implemented
- [x] Admin upload endpoint created (`/api/admin/upload-system-material`)
- [x] RAG queries updated to include system materials
- [x] Bulk upload script created (`upload_system_textbooks.py`)
- [x] Helper script created (`upload_textbooks.sh`)
- [x] 12 PDF textbooks located at `/Users/kei/Desktop/RAG-textbooks`

## 📋 Step-by-Step Guide

### Step 1: Verify Environment Setup

Make sure your `.env` file in the `backend/` directory has the required keys:

```bash
cd /Users/kei/Desktop/Fall2025/clyvaraRework-1/backend

# Check if .env exists
ls -la .env

# If it doesn't exist, create it from the template
cp env_template.txt .env
```

**Required in `.env`:**
- ✅ `OPENAI_API_KEY` - Required for generating embeddings
- ✅ `DATABASE_URL` - Required for database connection
- ⚠️ `ADMIN_API_KEY` - Optional (but recommended for security)

**To add ADMIN_API_KEY (optional but recommended):**
```bash
# Generate a key
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Add it to .env (replace YOUR_KEY with the generated key)
echo "ADMIN_API_KEY=YOUR_KEY" >> .env
```

### Step 2: Install Missing Dependencies (if needed)

Make sure you have all required packages:

```bash
cd /Users/kei/Desktop/Fall2025/clyvaraRework-1/backend

# Activate virtual environment (if using one)
source venv/bin/activate  # or your venv path

# Install dependencies
pip install -r ../requirements.txt

# Verify httpx and tqdm are installed (needed for upload script)
pip install httpx tqdm
```

### Step 3: Start the Backend Server

```bash
cd /Users/kei/Desktop/Fall2025/clyvaraRework-1/backend

# Activate virtual environment (if using one)
source venv/bin/activate

# Start the server
uvicorn main:app --reload --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Keep this terminal open** - the server needs to be running for the upload.

### Step 4: Verify Database Connection

Make sure your database is accessible and the tables exist:

```bash
# In a new terminal, test the connection
cd /Users/kei/Desktop/Fall2025/clyvaraRework-1/backend
python -c "from database import test_connection; test_connection()"
```

If the connection fails, check your `DATABASE_URL` in `.env`.

### Step 5: Upload the Textbooks

**Option A: Using the helper script (easiest)**

```bash
# In a new terminal (backend should be running in another terminal)
cd /Users/kei/Desktop/Fall2025/clyvaraRework-1/backend

# Make sure ADMIN_API_KEY is set (if you're using it)
export ADMIN_API_KEY=your_key_here  # or it will read from .env

# Run the upload script
./upload_textbooks.sh
```

**Option B: Using the Python script directly**

```bash
cd /Users/kei/Desktop/Fall2025/clyvaraRework-1/backend

# With admin key
python upload_system_textbooks.py /Users/kei/Desktop/RAG-textbooks --admin-key your_key

# Without admin key (if ADMIN_API_KEY is not set in .env)
python upload_system_textbooks.py /Users/kei/Desktop/RAG-textbooks
```

**What to expect:**
- The script will find all 12 PDF files
- Each PDF will be uploaded and processed
- Processing includes: text extraction, chunking, and embedding generation
- Large PDFs (250MB+) may take several minutes each
- You'll see progress bars and status updates
- At the end, you'll get a summary of successful/failed uploads

### Step 6: Verify Upload Success

**Check the upload results:**
- The script will show a summary at the end
- Check the backend server logs for any errors
- Verify in the database that materials were created:

```bash
# Connect to your database and check
# You should see 12 materials with user_id = 'SYSTEM'
```

**Expected output:**
```
Upload Summary
============================================================
Successful: 12
Failed: 0
Skipped: 0
```

### Step 7: Test the System Materials

**Test 1: Check if system materials are in RAG queries**

You can test this by:
1. Using the chat endpoint with a question related to anesthesia
2. The response should include information from the system textbooks
3. Check the response for mentions of "System Textbook" sources

**Test 2: Search for system materials**

```bash
# Use the search endpoint (requires authentication)
curl -X GET "http://localhost:8000/api/search?query=anesthesia" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Test 3: Verify in database**

```python
# In Python or database client
from database import get_db, Material
from sqlalchemy.orm import Session

db = next(get_db())
system_materials = db.query(Material).filter(Material.user_id == "SYSTEM").all()
print(f"Found {len(system_materials)} system materials")
```

## 🐛 Troubleshooting

### Issue: "OpenAI API key not configured"
**Solution:** Make sure `OPENAI_API_KEY` is set in your `.env` file and restart the server.

### Issue: "Database connection failed"
**Solution:** 
- Check your `DATABASE_URL` in `.env`
- Make sure the database is running and accessible
- Verify network connectivity

### Issue: "Invalid admin key"
**Solution:**
- If you set `ADMIN_API_KEY` in `.env`, make sure you're passing the same key
- Or remove `ADMIN_API_KEY` from `.env` to disable authentication (development only)

### Issue: "Embedding generation fails"
**Solution:**
- Check your OpenAI API key has sufficient quota
- Verify the API key is valid
- Check backend logs for specific error messages

### Issue: "PDF processing is slow"
**Solution:**
- This is normal for large PDFs (250MB+)
- Each PDF needs to be processed page by page
- Embeddings are generated for each chunk
- Be patient - it may take 10-30 minutes for all 12 textbooks

### Issue: "Script can't find PDFs"
**Solution:**
- Verify the path: `/Users/kei/Desktop/RAG-textbooks`
- Make sure the directory exists and contains PDF files
- Check file permissions

## ✅ Success Checklist

After completing the upload, you should have:

- [ ] Backend server running
- [ ] Database connected
- [ ] 12 system materials in database (user_id = "SYSTEM")
- [ ] Vector embeddings created for all materials
- [ ] System materials accessible in RAG queries
- [ ] Users can access system materials in chat/search

## 🎉 Next Steps After Upload

1. **Test the RAG functionality** - Ask questions related to the textbooks
2. **Monitor performance** - Check if responses include system material context
3. **Update frontend** (optional) - Add UI to show when system materials are used
4. **Add more materials** (optional) - Upload additional textbooks as needed
5. **Set up production** - Configure ADMIN_API_KEY for production environment

## 📚 Additional Resources

- `SYSTEM_MATERIALS_README.md` - Detailed documentation
- `ADMIN_KEY_SETUP.md` - Admin key setup guide
- Backend API docs: `http://localhost:8000/docs` (when server is running)

## 🆘 Need Help?

If you encounter issues:
1. Check the backend server logs
2. Verify all environment variables are set
3. Test database connection
4. Check OpenAI API key and quota
5. Review the error messages in the upload script output


