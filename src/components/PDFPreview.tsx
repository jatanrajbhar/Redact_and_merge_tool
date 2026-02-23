import { FileText, Download, Trash2, Eye } from "lucide-react";
import { PDFFile, RedactionArea } from "../types/pdf";
import { formatFileSize } from "../utils/pdfUtils";
import { Button } from "../components/ui/button";

interface PDFPreviewProps {
  files: PDFFile[];
  redactionAreas: RedactionArea[];
  onClearAll: () => void;
  onProcess: () => void;
  isProcessing: boolean;
}

export function PDFPreview({ 
  files, 
  redactionAreas, 
  onClearAll, 
  onProcess, 
  isProcessing 
}: PDFPreviewProps) {
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const totalPages = files.reduce((acc, file) => acc + file.pageCount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">PDF Preview</h2>
        {files.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {files.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
          <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500">No PDFs uploaded yet</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {files.map((file) => {
              const fileAreas = redactionAreas.filter(area => area.fileId === file.id);
              
              return (
                <div
                  key={file.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow relative group"
                >
                  <div className="aspect-[3/4] bg-slate-100 relative">
                    <FileText className="w-12 h-12 text-slate-400 absolute inset-0 m-auto" />
                    
                    {/* Visual Redaction Overlays */}
                    {fileAreas.map((area) => (
                      <div
                        key={area.id}
                        className="absolute bg-black/90 flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors"
                        style={{
                          left: `${area.x}%`,
                          top: `${area.y}%`,
                          width: `${area.width}%`,
                          height: `${area.height}%`,
                        }}
                        title="Redacted content"
                      >
                        <div className="w-full h-0.5 bg-black/20" />
                      </div>
                    ))}

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Eye className="w-8 h-8 text-slate-600" />
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-slate-800 text-sm truncate">{file.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-slate-500">
                        {file.pageCount} page{file.pageCount !== 1 ? "s" : ""}
                      </p>
                      {fileAreas.length > 0 && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                          {fileAreas.length} redacted
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-700">{files.length}</p>
                <p className="text-xs text-blue-600">Files</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{totalPages}</p>
                <p className="text-xs text-blue-600">Total Pages</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{formatFileSize(totalSize)}</p>
                <p className="text-xs text-blue-600">Size</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            <p className="font-medium mb-1">⚠️ Browser Limitation:</p>
            <p>
              The downloaded file below contains the <strong>original data</strong> to demonstrate file integrity. 
              True binary redaction (burning text) requires a backend or native library like PyMuPDF.
            </p>
          </div>

          <Button 
            onClick={onProcess} 
            disabled={isProcessing} 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold" 
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            {isProcessing ? "Processing..." : "Download Merged PDF"}
          </Button>
        </>
      )}
    </div>
  );
}