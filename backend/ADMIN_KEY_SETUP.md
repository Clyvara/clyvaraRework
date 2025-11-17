# Admin API Key Setup

## What is ADMIN_API_KEY?

The `ADMIN_API_KEY` is a **secret password** you create yourself to protect the system materials upload endpoint. It prevents unauthorized people from uploading system textbooks to your database.

## How to Create One

You can create any random string as your admin key. Here are some options:

### Option 1: Generate a Random Key (Recommended)

**On macOS/Linux:**
```bash
openssl rand -hex 32
```

**Or use Python:**
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Or use an online generator:**
- Visit: https://randomkeygen.com/
- Use a "Fort Knox Password" (64+ characters)

### Option 2: Create Your Own

Just make up a strong password, for example:
```
my-super-secret-admin-key-2024-clyvara
```

**Important:** Make it long and random - at least 32 characters is recommended.

## How to Set It Up

1. **Add to your `.env` file:
   ```bash
   cd /Users/kei/Desktop/Fall2025/clyvaraRework-1/backend
   ```

2. **Open or create `.env` file:**
   ```bash
   # If .env doesn't exist, copy from template
   cp env_template.txt .env
   
   # Then edit it
   nano .env  # or use your preferred editor
   ```

3. **Add the ADMIN_API_KEY line:**
   ```env
   ADMIN_API_KEY=your_generated_key_here
   ```

4. **Save the file**

5. **Restart your backend server** (if it's running) so it picks up the new environment variable

## How It Works

### Without ADMIN_API_KEY (Development Mode)
- If `ADMIN_API_KEY` is **not set** in `.env`, the upload endpoint is **open** (anyone can upload)
- This is fine for local development/testing
- ⚠️ **Not recommended for production**

### With ADMIN_API_KEY (Production Mode)
- If `ADMIN_API_KEY` **is set** in `.env`, the upload endpoint **requires** the key
- You must include the key in the `X-Admin-Key` header when uploading
- This protects your system from unauthorized uploads

## Using the Admin Key

### With the Upload Script

The script automatically reads `ADMIN_API_KEY` from your environment:

```bash
# Set it in your environment
export ADMIN_API_KEY=your_key_here

# Or the script will read it from .env if you're using python-dotenv
python upload_system_textbooks.py /Users/kei/Desktop/RAG-textbooks
```

### With curl

```bash
curl -X POST "http://localhost:8000/api/admin/upload-system-material" \
  -H "X-Admin-Key: your_admin_key_here" \
  -F "file=@textbook.pdf"
```

### With the Helper Script

The `upload_textbooks.sh` script automatically uses the `ADMIN_API_KEY` from your environment:

```bash
export ADMIN_API_KEY=your_key_here
./upload_textbooks.sh
```

## Security Best Practices

1. **Never commit `.env` to git** - it should already be in `.gitignore`
2. **Use a different key for production** than development
3. **Keep it secret** - don't share it publicly
4. **Rotate it periodically** - change it if you suspect it's compromised
5. **Use a long, random key** - at least 32 characters

## Example Workflow

```bash
# 1. Generate a key
openssl rand -hex 32
# Output: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# 2. Add to .env
echo "ADMIN_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6" >> .env

# 3. Restart backend (if running)

# 4. Upload textbooks
python upload_system_textbooks.py /Users/kei/Desktop/RAG-textbooks
```

## Troubleshooting

**Q: I get "Invalid admin key" error**
- Make sure `ADMIN_API_KEY` is set in your `.env` file
- Make sure you're passing the exact same key (no extra spaces)
- Restart your backend server after adding it to `.env`

**Q: Can I skip setting it?**
- Yes, for local development you can leave it unset
- The endpoint will work without authentication
- But set it for production!

**Q: Where should I store it?**
- In your `.env` file (which should be gitignored)
- Never commit it to version control
- Use environment variables in production (not hardcoded)


