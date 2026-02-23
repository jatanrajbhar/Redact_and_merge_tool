# PDF Redact and Merge Tool

A powerful, browser-based tool for redacting sensitive information from PDF documents and merging multiple PDFs. Runs entirely client-side with no server uploads or data transmission.

## Features

- **Client-Side Processing**: All operations happen in your browser - your files never leave your device
- **Text-Based Redaction**: Uses PDF.js to extract text and coordinates for precise redaction
- **Regex Pattern Matching**: Configurable rules to detect sensitive information like names, GSTIN, IP addresses, etc.
- **Label-Based Detection**: Finds values following specific labels (e.g., "Authorized Signatory")
- **Visual Preview**: See redaction overlays on PDF thumbnails before processing
- **PDF Merging**: Combine multiple PDFs into a single document
- **Metadata Removal**: Strip author, title, and creation date information
- **Custom Rules**: Add your own redaction patterns
- **No Installation Required**: Single HTML file that works in any modern browser

## Built-in Redaction Rules

- **Name Detection**: Capitalized full names (e.g., John Doe)
- **Company Names**: Business entities ending in PVT LTD, LLP, INC, etc.
- **GSTIN**: Indian GST Identification Numbers
- **ARN**: Application Reference Numbers
- **IP Addresses**: IPv4 address patterns
- **Label-Based Rules**: Values following "Authorized Signatory", "Trade Name", "ARN" labels

## Usage

1. **Open the Tool**: Open `file.html` in any modern web browser
2. **Upload PDFs**: Drag and drop PDF files or click to browse
3. **Automatic Scanning**: The tool extracts text and applies redaction rules
4. **Review Matches**: Check detected items in the Scan Results panel
5. **Customize Rules**: Enable/disable rules or add custom patterns
6. **Configure Options**: Choose to merge PDFs, remove metadata, etc.
7. **Download**: Get your redacted (and optionally merged) PDF

## How It Works

1. **Text Extraction**: PDF.js reads each page and extracts text with position coordinates
2. **Pattern Matching**: Regex rules scan text for sensitive patterns
3. **Label Detection**: Finds values following specific form labels
4. **Coordinate Mapping**: Converts matches to page coordinates
5. **PDF Redaction**: pdf-lib draws black rectangles over matched areas
6. **Output Generation**: Creates clean PDF with permanent redactions

## Browser Compatibility

Works in modern browsers supporting:
- File API
- ArrayBuffer
- ES2020+ features

Tested in Chrome, Edge, and Firefox.

## Dependencies

- **PDF.js** (3.11.174): Text extraction and coordinate mapping
- **pdf-lib** (1.17.1): PDF manipulation and redaction
- **Tailwind CSS**: Styling (via CDN)

## Security Note

This tool performs content-layer redaction by drawing over text. The underlying text remains in the PDF. For high-security requirements, use certified redaction tools like Adobe Acrobat.

## Project Structure

```
├── file.html              # Main application (single-file)
├── README.md              # This file
└── src/                   # React prototype (demo only)
    ├── App.tsx
    ├── components/
    │   ├── FileDropZone.tsx
    │   ├── PDFPreview.tsx
    │   ├── RedactionReport.tsx
    │   └── RedactionRules.tsx
    ├── types/
    │   └── pdf.ts
    └── utils/
        └── pdfUtils.ts
```

## Development

The `src/` directory contains a React + TypeScript prototype for UI development. It simulates redaction but doesn't perform real PDF processing.

```bash
cd src
npm install
npm run dev
```

## License

This project is open source. Please check individual library licenses for usage terms.
