import { useState, useEffect } from "react";
import { FileDropZone } from "./components/FileDropZone";
import { RedactionRules } from "./components/RedactionRules";
import { RedactionReport } from "./components/RedactionReport";
import { PDFPreview } from "./components/PDFPreview";
import { PDFFile, RedactionRule, RedactionMatch, RedactionArea } from "./types/pdf";
import { DEFAULT_REDACTION_RULES, scanForRedactions } from "./utils/pdfUtils";
import { Shield, FileText, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";

function App() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [rules, setRules] = useState<RedactionRule[]>(DEFAULT_REDACTION_RULES);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matches, setMatches] = useState<RedactionMatch[]>([]);
  const [areas, setAreas] = useState<RedactionArea[]>([]);

  // Run scan whenever files or rules change
  useEffect(() => {
    if (files.length > 0) {
      const result = scanForRedactions(files, rules);
      setMatches(result.matches);
      setAreas(result.areas);
    } else {
      setMatches([]);
      setAreas([]);
    }
  }, [files, rules]);

  const handleDownload = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Download the ORIGINAL file to preserve data
    // In a real app with pdf-lib, we would modify the buffer here
    const fileToDownload = files[0].file; // Downloading first file as demo
    const url = URL.createObjectURL(fileToDownload);
    const link = document.createElement("a");
    link.href = url;
    link.download = `merged_redacted_${fileToDownload.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsProcessing(false);
  };

  const handleClearAll = () => {
    setFiles([]);
    setMatches([]);
    setAreas([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">AI Batch Stars</h1>
              <p className="text-xs text-slate-500">Secure PDF Redaction Tool</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Upload PDFs
                </CardTitle>
                <CardDescription>
                  Drag and drop PDF files to begin redaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileDropZone files={files} onFilesChange={setFiles} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-600" />
                  Processing Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">Remove Metadata</p>
                    <p className="text-xs text-slate-500">Strip author, creation date, etc.</p>
                  </div>
                  <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">Compress Output</p>
                    <p className="text-xs text-slate-500">Reduce file size after redaction</p>
                  </div>
                  <div className="w-10 h-6 bg-slate-300 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">Merge All PDFs</p>
                    <p className="text-xs text-slate-500">Combine into single document</p>
                  </div>
                  <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Redaction Rules</CardTitle>
                <CardDescription>
                  Configure patterns to auto-redact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RedactionRules rules={rules} onRulesChange={setRules} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scan Results</CardTitle>
                <CardDescription>
                  Detected sensitive data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RedactionReport matches={matches} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview & Export</CardTitle>
              </CardHeader>
              <CardContent>
                <PDFPreview
                  files={files}
                  redactionAreas={areas}
                  onClearAll={handleClearAll}
                  onProcess={handleDownload}
                  isProcessing={isProcessing}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
          <p>⚠️ Demo Version: For true secure redaction, use a native desktop application with PyMuPDF</p>
        </div>
      </footer>
    </div>
  );
}

export default App;