import { PDFFile, RedactionRule, RedactionMatch, RedactionArea } from "../types/pdf";

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const validatePDF = (file: File): boolean => {
  return file.type === "application/pdf" || file.name.endsWith(".pdf");
};

export const DEFAULT_REDACTION_RULES = [
  { id: "name", name: "Name", pattern: "[A-Z][a-z]+ [A-Z][a-z]+", enabled: true, color: "#ef4444" },
  { id: "trade", name: "Trade Name", pattern: "[A-Z][A-Z\\s]+(?:PVT|LTD|LLP|INC)", enabled: true, color: "#f59e0b" },
  { id: "gstin", name: "GSTIN", pattern: "\\d{2}[A-Z]{5}\\d{4}[A-Z]{1}[A-Z\\d]{1}[Z]{1}[A-Z\\d]{1}", enabled: true, color: "#10b981" },
  { id: "arn", name: "ARN", pattern: "ARN-[A-Z0-9]{10}", enabled: true, color: "#8b5cf6" },
];

// Mock function to simulate scanning text in PDF
// In a real app with pdf-lib, this would parse the actual PDF content stream
export const scanForRedactions = (
  files: PDFFile[],
  rules: RedactionRule[]
): { matches: RedactionMatch[]; areas: RedactionArea[] } => {
  const matches: RedactionMatch[] = [];
  const areas: RedactionArea[] = [];

  const mockSensitiveData = [
    { text: "John Doe", type: "name" },
    { text: "Jane Smith", type: "name" },
    { text: "ACME CORP PVT LTD", type: "trade" },
    { text: "27AAPFU0939F1ZV", type: "gstin" },
    { text: "ARN-1234567890", type: "arn" },
  ];

  files.forEach((file) => {
    // Simulate finding 2-4 random matches per file
    const numMatches = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < numMatches; i++) {
      const randomData = mockSensitiveData[Math.floor(Math.random() * mockSensitiveData.length)];
      const rule = rules.find((r) => r.id === randomData.type);
      
      if (rule && rule.enabled) {
        const matchId = generateId();
        matches.push({
          id: matchId,
          ruleId: rule.id,
          ruleName: rule.name,
          text: randomData.text,
          fileId: file.id,
          pageIndex: Math.floor(Math.random() * file.pageCount),
        });

        // Generate random coordinates for visual overlay
        areas.push({
          id: matchId,
          fileId: file.id,
          pageIndex: matches[matches.length - 1].pageIndex,
          x: Math.random() * 60 + 10, // 10% to 70%
          y: Math.random() * 60 + 10, // 10% to 70%
          width: Math.random() * 20 + 15, // 15% to 35%
          height: 6, // Fixed height for text line
        });
      }
    }
  });

  return { matches, areas };
};