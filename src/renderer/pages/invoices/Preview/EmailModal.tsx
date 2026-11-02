import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { useState, useEffect, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { getApi } from '../../../shared/api/restApi';
import { useAppDispatch } from '../../../state/configureStore';
import { addToast } from '../../../state/pageSlice';
import type { InvoiceFromData } from '../../../shared/types/invoice';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoiceForm?: InvoiceFromData;
  generatePdfBlob: () => Promise<Blob | null>;
  getPDFFilename: () => string;
}

import { buildInvoiceHtml } from './buildInvoiceHtml';

export const EmailModal: FC<Props> = ({ isOpen, onClose, invoiceForm, generatePdfBlob, getPDFFilename }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const api = getApi();

  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isOpen && invoiceForm) {
      // Pre-fill fields if available
      setTo(invoiceForm.invoiceClientSnapshot?.clientEmail || '');
      const isQuote = invoiceForm.invoiceType === 'quotation';
      const docType = isQuote ? 'Quotation' : 'Invoice';
      const fullInvoiceNumber = `${invoiceForm.invoicePrefix || ''}${invoiceForm.invoiceNumber || ''}${invoiceForm.invoiceSuffix || ''}`;
      const defaultSubject = `${docType} ${fullInvoiceNumber} from ${invoiceForm.invoiceBusinessSnapshot?.businessName || ''}`;
      setSubject(defaultSubject.trim());
      setMessage(`Hello,\n\nPlease find attached the ${docType.toLowerCase()} ${fullInvoiceNumber}.\n\nThank you.`);
    }
  }, [isOpen, invoiceForm]);

  const handleSend = async () => {
    if (!to) {
      dispatch(addToast({ message: 'Recipient email is required.', severity: 'error' }));
      return;
    }

    setIsSending(true);
    try {
      const blob = await generatePdfBlob();
      if (!blob) {
        throw new Error('Failed to generate PDF.');
      }

      // Convert blob to base64
      const buffer = await blob.arrayBuffer();
      const base64 = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));

      const html = invoiceForm ? buildInvoiceHtml(invoiceForm, message) : undefined;

      const payload = {
        to,
        subject,
        text: message,
        html,
        pdfBase64: base64,
        pdfFilename: getPDFFilename()
      };

      const result = await api.sendEmail(payload);

      if (result.success) {
        dispatch(addToast({ message: 'Email sent successfully!', severity: 'success' }));
        onClose();
      } else {
        throw new Error(result.key || 'Failed to send email.');
      }
    } catch (error: any) {
      console.error(error);
      dispatch(addToast({ message: error.message || 'An error occurred while sending the email.', severity: 'error' }));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={isSending ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Send via Email</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Ensure SMTP environment variables are configured on the backend.
          </Typography>
          <TextField
            label="To (Recipient Email)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            fullWidth
            required
            disabled={isSending}
          />
          <TextField
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
            required
            disabled={isSending}
          />
          <TextField
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            multiline
            rows={4}
            disabled={isSending}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSending}>
          Cancel
        </Button>
        <Button onClick={handleSend} variant="contained" disabled={isSending} startIcon={isSending ? <CircularProgress size={20} /> : undefined}>
          {isSending ? 'Sending...' : 'Send Email'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
