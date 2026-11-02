export interface EmailPayload {
  to: string;
  subject: string;
  text: string;
  html?: string;
  pdfBase64: string;
  pdfFilename: string;
}
