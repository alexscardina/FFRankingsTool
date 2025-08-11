from pdf2image import convert_from_path
import pytesseract

# Path to your PDF
pdf_path = './rankings/NFL25_CS_PPR300.pdf'

# Output text file path
output_path = 'raw_espn_rankings.txt'

# Convert PDF pages to images
pages = convert_from_path(pdf_path, dpi=300)
print(f"⏳ Saving ESPN OCR text...")

# Open the output file in write mode
with open(output_path, 'w', encoding='utf-8') as f:
    for i, page in enumerate(pages):
        f.write(f"--- Page {i + 1} ---\n")
        text = pytesseract.image_to_string(page)
        f.write(text + '\n')

print(f"✅ OCR text saved to {output_path}")
