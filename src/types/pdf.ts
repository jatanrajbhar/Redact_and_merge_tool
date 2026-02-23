export interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  thumbnail?: string;
}

export interface RedactionRule {
  id: string;
  name: string;
  pattern: string;
  enabled: boolean;
  color: string;
}

export interface RedactionArea {
  id: string;
  fileId: string;
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RedactionMatch {
  id: string;
  ruleId: string;
  ruleName: string;
  text: string;
  fileId: string;
  pageIndex: number;
}