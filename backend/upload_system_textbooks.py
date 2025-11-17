#!/usr/bin/env python3
"""
Script to upload system textbooks (PDFs) to the database.
These textbooks will be accessible to all users for RAG enhancement.

Usage:
    python upload_system_textbooks.py <directory_with_pdfs> [--admin-key <key>] [--api-url <url>]

Example:
    python upload_system_textbooks.py ./textbooks --admin-key your_admin_key --api-url http://localhost:8000
"""

import os
import sys
import httpx
from pathlib import Path
from typing import List, Optional
import argparse
from tqdm import tqdm

def upload_pdf(file_path: Path, api_url: str, admin_key: Optional[str] = None) -> dict:
    """Upload a single PDF file to the system materials endpoint"""
    url = f"{api_url}/api/admin/upload-system-material"
    
    headers = {}
    if admin_key:
        headers["X-Admin-Key"] = admin_key
    
    try:
        with open(file_path, 'rb') as f:
            file_content = f.read()
            file_size_mb = len(file_content) / (1024 * 1024)
            # Increase timeout for large files: 5 minutes per MB, minimum 10 minutes, maximum 2 hours
            timeout_seconds = min(max(file_size_mb * 5 * 60, 600), 7200)
            files = {'file': (file_path.name, file_content, 'application/pdf')}
            with httpx.Client(timeout=timeout_seconds) as client:
                response = client.post(url, files=files, headers=headers)
            
        if response.status_code == 200:
            return {"success": True, "data": response.json()}
        else:
            return {
                "success": False,
                "error": f"HTTP {response.status_code}: {response.text}",
                "status_code": response.status_code
            }
    except httpx.RequestError as e:
        return {"success": False, "error": str(e)}
    except Exception as e:
        return {"success": False, "error": str(e)}

def find_pdf_files(directory: Path) -> List[Path]:
    """Find all PDF files in the given directory"""
    # Use set to avoid duplicates, then convert to sorted list
    pdf_files_set = set()
    
    # Find PDFs in the directory itself
    for pdf in directory.glob("*.pdf"):
        pdf_files_set.add(pdf)
    
    # Find PDFs in subdirectories (but not in the root to avoid duplicates)
    for pdf in directory.glob("**/*.pdf"):
        # Only include if it's in a subdirectory (not the root)
        if pdf.parent != directory:
            pdf_files_set.add(pdf)
    
    # Convert to sorted list
    return sorted(list(pdf_files_set))

def main():
    parser = argparse.ArgumentParser(
        description="Upload system textbooks (PDFs) to the database",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument(
        "directory",
        type=Path,
        help="Directory containing PDF files to upload"
    )
    parser.add_argument(
        "--admin-key",
        type=str,
        default=os.getenv("ADMIN_API_KEY"),
        help="Admin API key (or set ADMIN_API_KEY environment variable)"
    )
    parser.add_argument(
        "--api-url",
        type=str,
        default=os.getenv("API_URL", "http://localhost:8000"),
        help="API URL (or set API_URL environment variable, default: http://localhost:8000)"
    )
    parser.add_argument(
        "--skip-existing",
        action="store_true",
        help="Skip files that already exist in the system"
    )
    
    args = parser.parse_args()
    
    # Validate directory
    if not args.directory.exists():
        print(f"Error: Directory '{args.directory}' does not exist")
        sys.exit(1)
    
    if not args.directory.is_dir():
        print(f"Error: '{args.directory}' is not a directory")
        sys.exit(1)
    
    # Find PDF files
    pdf_files = find_pdf_files(args.directory)
    
    if not pdf_files:
        print(f"No PDF files found in '{args.directory}'")
        sys.exit(1)
    
    print(f"Found {len(pdf_files)} PDF file(s) to upload:")
    for pdf_file in pdf_files:
        file_size_mb = pdf_file.stat().st_size / (1024 * 1024)
        print(f"  - {pdf_file.name} ({file_size_mb:.2f} MB)")
    
    print(f"\nUploading to: {args.api_url}")
    if args.admin_key:
        print("Using admin key for authentication")
    else:
        print("Warning: No admin key provided. The endpoint may require authentication.")
    
    # Upload files
    results = {
        "successful": [],
        "failed": [],
        "skipped": []
    }
    
    for pdf_file in tqdm(pdf_files, desc="Uploading PDFs"):
        result = upload_pdf(pdf_file, args.api_url, args.admin_key)
        
        if result["success"]:
            results["successful"].append({
                "file": pdf_file.name,
                "material_id": result["data"].get("material_id"),
                "chunks": result["data"].get("chunks_created", 0)
            })
            print(f"✓ Successfully uploaded: {pdf_file.name}")
        elif args.skip_existing and result.get("status_code") == 400 and "already exists" in result.get("error", ""):
            results["skipped"].append({"file": pdf_file.name, "reason": "Already exists"})
            print(f"⊘ Skipped (already exists): {pdf_file.name}")
        else:
            results["failed"].append({
                "file": pdf_file.name,
                "error": result.get("error", "Unknown error")
            })
            print(f"✗ Failed to upload: {pdf_file.name}")
            print(f"  Error: {result.get('error', 'Unknown error')}")
    
    # Print summary
    print("\n" + "="*60)
    print("Upload Summary")
    print("="*60)
    print(f"Successful: {len(results['successful'])}")
    print(f"Failed: {len(results['failed'])}")
    print(f"Skipped: {len(results['skipped'])}")
    
    if results["successful"]:
        print("\nSuccessfully uploaded files:")
        for item in results["successful"]:
            print(f"  - {item['file']} (Material ID: {item['material_id']}, Chunks: {item['chunks']})")
    
    if results["failed"]:
        print("\nFailed files:")
        for item in results["failed"]:
            print(f"  - {item['file']}: {item['error']}")
    
    if results["skipped"]:
        print("\nSkipped files:")
        for item in results["skipped"]:
            print(f"  - {item['file']}: {item['reason']}")
    
    # Exit with error code if any uploads failed
    if results["failed"]:
        sys.exit(1)

if __name__ == "__main__":
    main()

