# System Materials (Textbooks) Feature

## Overview

System materials are PDFs that are accessible to ALL users for RAG (Retrieval Augmented Generation) enhancement. These materials are not uploaded by users and are automatically included in all RAG searches.

## How It Works

1. **System User ID**: Materials with `user_id = "SYSTEM"` are considered system materials
2. **Automatic Inclusion**: System materials are automatically included in:
   - Chat RAG queries (`/chat-rag` endpoint)
   - Material search (`/api/search` endpoint)
   - Care plan context building (`build_care_plan_context` function)
3. **User Access**: All users can access information from system materials in their RAG queries, but they cannot see or delete these materials through the regular UI

## Uploading System Materials

### Option 1: Using the Admin API Endpoint

Use the `/api/admin/upload-system-material` endpoint to upload individual PDFs:

```bash
curl -X POST "http://localhost:8000/api/admin/upload-system-material" \
  -H "X-Admin-Key: your_admin_key" \
  -F "file=@textbook.pdf"
```

**Note**: Set `ADMIN_API_KEY` in your `.env` file to enable admin key authentication. If not set, the endpoint will accept requests without authentication (not recommended for production).

### Option 2: Using the Bulk Upload Script

Use the provided Python script to upload multiple PDFs at once:

```bash
# Basic usage
python backend/upload_system_textbooks.py ./path/to/textbooks

# With admin key
python backend/upload_system_textbooks.py ./path/to/textbooks --admin-key your_admin_key

# With custom API URL
python backend/upload_system_textbooks.py ./path/to/textbooks --api-url http://localhost:8000

# Skip files that already exist
python backend/upload_system_textbooks.py ./path/to/textbooks --skip-existing
```

**Environment Variables** (optional):
- `ADMIN_API_KEY`: Admin key for authentication
- `API_URL`: API base URL (default: `http://localhost:8000`)

## Example: Uploading 12 Textbooks

1. Create a directory with your 12 PDF textbooks:
   ```bash
   mkdir textbooks
   # Copy your 12 PDF files to the textbooks directory
   ```

2. Run the upload script:
   ```bash
   cd backend
   python upload_system_textbooks.py ../textbooks --admin-key your_admin_key
   ```

3. The script will:
   - Find all PDF files in the directory
   - Upload each PDF to the system
   - Process and create embeddings for RAG
   - Show progress and summary

## How Users Access System Materials

Users don't need to do anything special. System materials are automatically included when:

1. **Chatting with RAG**: When users ask questions via `/chat-rag`, the system automatically searches both user materials and system materials
2. **Searching Materials**: When users search via `/api/search`, system materials are included in results
3. **Care Plan Generation**: When generating care plans, relevant system materials are automatically included in the context

## Important Notes

- **Duplicate Prevention**: The system prevents uploading duplicate system materials (based on filename)
- **Processing Time**: Large PDFs may take several minutes to process (embedding generation)
- **Storage**: System materials are stored in S3 (if configured) or text-only in the database
- **Admin Key**: Set `ADMIN_API_KEY` in your `.env` file for secure uploads
- **User Materials**: User-uploaded materials are still private to each user
- **System Materials**: System materials are accessible to all users but not visible in their material list

## Troubleshooting

### Upload Fails with 403 Error
- Check that `ADMIN_API_KEY` is set correctly in your `.env` file
- Ensure you're passing the correct admin key in the `X-Admin-Key` header

### Embedding Generation Fails
- Check that `OPENAI_API_KEY` is set in your `.env` file
- Verify your OpenAI API key has sufficient quota
- Check the backend logs for specific error messages

### PDF Processing Fails
- Ensure the PDF is not corrupted
- Check that the file is a valid PDF format
- Verify file size is within reasonable limits

## Database Schema

System materials are stored in the `materials` table with:
- `user_id = "SYSTEM"`
- Regular material fields (title, file_type, file_path, etc.)

Vector embeddings are stored in `vector_index_entries` with:
- `user_id = "SYSTEM"`
- `source_type = "material"`
- `source_id = material.id`

## Security Considerations

1. **Admin Key**: Always set `ADMIN_API_KEY` in production
2. **File Validation**: Only PDF, DOCX, DOC, and TXT files are accepted
3. **Duplicate Prevention**: System prevents duplicate uploads
4. **User Isolation**: System materials don't expose user data


