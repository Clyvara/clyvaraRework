#!/bin/bash
# Quick script to upload system textbooks from the RAG-textbooks directory

# Set your admin key here (or use environment variable)
ADMIN_KEY="${ADMIN_API_KEY:-}"

# API URL (default: localhost:8000)
API_URL="${API_URL:-http://localhost:8000}"

# Textbooks directory
TEXTBOOKS_DIR="/Users/kei/Desktop/RAG-textbooks"

# Run the upload script
python upload_system_textbooks.py "$TEXTBOOKS_DIR" \
    --api-url "$API_URL" \
    ${ADMIN_KEY:+--admin-key "$ADMIN_KEY"} \
    --skip-existing
    

