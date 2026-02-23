import { useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";
import { PDFFile } from "../types/pdf";
import { validatePDF, generateId } from "../utils/pdfUtils";

interface FileDropZoneProps {
  files: PDFFile[];
  onFilesChange: (files: PDFFile[]) => void;
}

export function FileDropZone({ files, onFilesChange }: FileDropZoneProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);
      processFiles(droppedFiles);
    },
    []
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      processFiles(selectedFiles);
    },
    []
  );

  const processFiles = (newFiles: File[]) => {
    const validPDFs = newFiles.filter(validatePDF);
    const pdfFiles: PDFFile[] = validPDFs.map((file) => ({
      id: generateId(),
      file,
      name: file.name,
      size: file.size,
      pageCount: Math.floor(Math.random() * 10) + 1, // Simulated page count
    }));
    onFilesChange([...files, ...pdfFiles]);
  };

  const removeFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
      >
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="cursor-pointer">
          <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <p className="text-lg font-medium text-slate-700">Drop PDF files here</p>
          <p className="text-sm text-slate-500 mt-1">or click to browse</p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-700">Uploaded Files ({files.length})</h3>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="font-medium text-slate-800 text-sm">{file.name}</p>
                  <p className="text-xs text-slate-500">{file.pageCount} pages</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(file.id)}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}