#!/bin/bash

# Output file name
OUTPUT_FILE="full_frontend_code.txt"

# Clear the output file if it exists
> "$OUTPUT_FILE"

echo "Generating $OUTPUT_FILE from src/ directory..."

# Find all relevant files in src/ directory
# Pattern matches .ts, .tsx, .js, .jsx, .css files
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.css" \) | sort | while read -r file; do
    echo "Processing $file..."
    
    # Add a header for each file
    echo "================================================================================" >> "$OUTPUT_FILE"
    echo "FILE: $file" >> "$OUTPUT_FILE"
    echo "================================================================================" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    
    # Append the file content
    cat "$file" >> "$OUTPUT_FILE"
    
    # Add a footer/separator
    echo "" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
done

echo "Done! All code has been merged into $OUTPUT_FILE"
