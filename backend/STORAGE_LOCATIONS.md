# PDF Storage Locations in Database

## Overview

The PDFs themselves are **NOT stored in the database**. Only the extracted text and metadata are stored. Here's the breakdown:

## Storage Structure

### 1. **Materials Table** (`main.materials`)

**Schema:** `backend/database.py` lines 242-268

**Stores:**
- **Metadata** (file name, type, size, etc.)
- **Extracted Text** (`extracted_text` column - **Text type, can store large amounts**)
- **Processing Status** (processing, processed, failed)
- **File Path** (`file_path` column - S3 URL if S3 is configured, otherwise `NULL`)

**Key Columns:**
```sql
- id: Integer (primary key)
- user_id: String (for system materials: "SYSTEM")
- title: String (filename)
- file_type: String (pdf, docx, etc.)
- file_path: String (S3 URL or NULL)
- file_size: Integer (bytes)
- extracted_text: Text (full extracted text content)
- chunk_count: Integer
- status: String (processing, processed, failed)
- processing_progress: Integer (0-100)
```

**Example Data:**
```
ID: 33
Title: "Hadzic Textbook Of Regional Anesthesia And Acute Pain Management.pdf"
File Size: 62,766,890 bytes (59.86 MB)
File Path: NULL (S3 not configured)
Extracted Text: 4,617,354 characters
Chunk Count: 843
Status: processed
```

### 2. **Vector Index Entries Table** (`vector_index_entries`)

**Schema:** `backend/database.py` lines 785-808

**Stores:**
- **Vector Embeddings** (`embedding` column - JSON array of floats)
- **Text Chunks** (`content` column - Text type)
- **Metadata** (source information, chunk index, etc.)

**Key Columns:**
```sql
- id: Integer (primary key)
- user_id: String (for system materials: "SYSTEM")
- content_hash: String (unique hash for chunk)
- embedding: JSON (vector embedding array)
- content: Text (chunk of text)
- source_id: Integer (references Material.id)
- source_type: String ("material")
- chunk_index: Integer
- vector_metadata: JSON
```

**Example Data:**
```
For Material ID 33:
- 843 vector entries
- Each entry contains:
  - embedding: [0.123, -0.456, ...] (1536 dimensions)
  - content: "chunk of text from PDF"
  - chunk_index: 0, 1, 2, ...
```

### 3. **File Storage** (S3 or None)

**Current Configuration:**
- **S3**: Not configured (AWS credentials not set)
- **File Path**: `NULL` for all materials
- **Storage**: Text-only (no file download available)

**If S3 was configured:**
- Files would be stored in S3 bucket
- `file_path` would contain: `s3://bucket-name/system-materials/{file_id}_{filename}`
- Files would be accessible via S3 URL

## Database Tables Summary

### `main.materials`
- **Purpose**: Store PDF metadata and extracted text
- **Location**: PostgreSQL database, `main` schema
- **Size**: Varies by PDF (extracted text can be large)
- **Example**: 10 materials = ~50-100 MB of text data

### `vector_index_entries`
- **Purpose**: Store vector embeddings for RAG search
- **Location**: PostgreSQL database
- **Size**: Larger (each embedding is ~1536 floats = ~6KB per chunk)
- **Example**: 9,833 chunks = ~60 MB of embedding data

## What's Actually Stored

### ✅ Stored in Database:
1. **Extracted Text** - Full text content from PDFs
2. **Vector Embeddings** - Embeddings for semantic search
3. **Metadata** - File info, processing status, timestamps
4. **Text Chunks** - Individual chunks for RAG retrieval

### ❌ NOT Stored in Database:
1. **Original PDF Files** - Only if S3 is configured (currently not)
2. **Images from PDFs** - Not extracted
3. **PDF Structure** - Only text content

## Storage Size Estimate

For your 12 textbooks:

**Materials Table:**
- Extracted text: ~50-200 MB (depends on PDF content)
- Metadata: ~1 MB

**Vector Index Entries Table:**
- Embeddings: ~60-100 MB (9,833+ chunks × ~6KB each)
- Text chunks: ~20-50 MB (duplicate of extracted text, but chunked)

**Total Database Storage:**
- Estimated: ~130-350 MB for all 12 textbooks
- Actual: Depends on PDF content and chunk count

## Query Examples

### Check Storage Locations

```python
from database import get_db, Material, VectorIndexEntry

db = next(get_db())

# Get material storage info
material = db.query(Material).filter(Material.id == 33).first()
print(f"File Path: {material.file_path}")  # None or S3 URL
print(f"Text Length: {len(material.extracted_text)}")  # Characters

# Get vector entries count
vector_count = db.query(VectorIndexEntry).filter(
    VectorIndexEntry.source_id == 33
).count()
print(f"Vector Entries: {vector_count}")
```

### Check Database Size

```sql
-- Check materials table size
SELECT 
    pg_size_pretty(pg_total_relation_size('main.materials')) AS materials_size;

-- Check vector_index_entries table size
SELECT 
    pg_size_pretty(pg_total_relation_size('vector_index_entries')) AS vectors_size;
```

## Accessing the Data

### 1. Get Material Text
```python
material = db.query(Material).filter(Material.id == material_id).first()
text = material.extracted_text  # Full extracted text
```

### 2. Get Vector Embeddings
```python
vectors = db.query(VectorIndexEntry).filter(
    VectorIndexEntry.source_id == material_id
).all()

for vector in vectors:
    embedding = vector.embedding  # JSON array
    content = vector.content  # Text chunk
```

### 3. Search via RAG
```python
# RAG search automatically uses vector_index_entries table
# via the /api/search or /chat-rag endpoints
```

## Notes

1. **S3 Configuration**: Currently not configured, so files are not stored. Only text is stored.
2. **Text Storage**: All extracted text is stored in the database (can be large for big PDFs).
3. **Vector Storage**: Embeddings are stored as JSON arrays (PostgreSQL JSON type).
4. **Performance**: Vector search is fast because embeddings are indexed.
5. **Backup**: Database backup includes all text and embeddings, but not original PDFs (unless S3 is used).

## Future Considerations

1. **Enable S3**: To store actual PDF files for download
2. **Compression**: Consider compressing extracted text if storage becomes an issue
3. **Archiving**: Move old materials to archive storage if needed
4. **Indexing**: PostgreSQL full-text search can be added for faster text search


