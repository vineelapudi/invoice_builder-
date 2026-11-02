import { Text, View } from '@react-pdf/renderer';
import { memo, type FC } from 'react';
import type { InvoiceFromData } from '../../../shared/types/invoice';
import type { PaymentSource } from '../../../shared/types/layouts';
import { DEFAULT_FONT_SIZES, FONT_SIZES, PDF_STYLES } from './constant';
import { QRCodeInfo } from './QRCodeInfo';

interface Props {
  qrCodeUrl?: string;
  invoiceForm?: InvoiceFromData;
  paymentInfoLabel: string;
  source?: PaymentSource;
}
const PaymentInfoComponent: FC<Props> = ({ invoiceForm, qrCodeUrl, paymentInfoLabel, source = 'bank' }) => {
  if (source === 'legacyBusiness') {
    const paymentInformation = invoiceForm?.invoiceBusinessSnapshot?.businessPaymentInformation;
    if (!paymentInformation) return null;

    return (
      <View style={[PDF_STYLES.alignStart, PDF_STYLES.gap4]}>
        <Text
          style={[
            PDF_STYLES.regularBold,
            { fontSize: FONT_SIZES[invoiceForm?.invoiceCustomization?.fontSize ?? DEFAULT_FONT_SIZES].regularBold }
          ]}
        >
          {paymentInfoLabel}:
        </Text>
        <Text
          style={[
            PDF_STYLES.businessText,
            { fontSize: FONT_SIZES[invoiceForm?.invoiceCustomization?.fontSize ?? DEFAULT_FONT_SIZES].businessText }
          ]}
        >
          {paymentInformation}
        </Text>
      </View>
    );
  }

  if (!invoiceForm?.invoiceBankSnapshot) return null;

  return (
    <View style={[PDF_STYLES.alignStart, PDF_STYLES.gap4]}>
      <Text
        style={[
          PDF_STYLES.regularBold,
          { fontSize: FONT_SIZES[invoiceForm?.invoiceCustomization?.fontSize ?? DEFAULT_FONT_SIZES].regularBold }
        ]}
      >
        {paymentInfoLabel}:
      </Text>
      <View style={[PDF_STYLES.alignStart, PDF_STYLES.gap4, PDF_STYLES.row]}>
        <View style={[{ width: '100%', border: '1px solid #e0e0e0', borderBottom: 0 }, PDF_STYLES.gap0]}>
          {invoiceForm?.invoiceBankSnapshot?.accountHolder && (
            <View style={[PDF_STYLES.row, { borderBottom: '1px solid #e0e0e0' }]}>
              <View style={[PDF_STYLES.w40, { padding: 4, borderRight: '1px solid #e0e0e0', backgroundColor: '#f9f9f9' }]}>
                <Text style={[{ fontSize: FONT_SIZES[invoiceForm?.invoiceCustomization?.fontSize ?? DEFAULT_FONT_SIZES].businessText, fontWeight: 'bold' }]}>Account Name</Text>
              </View>
              <View style={[PDF_STYLES.w60, { padding: 4 }]}>
                <Text style={[{ fontSize: FONT_SIZES[invoiceForm?.invoiceCustomization?.fontSize ?? DEFAULT_FONT_SIZES].businessText }]}>{invoiceForm?.invoiceBankSnapshot?.accountHolder}</Text>
              </View>
            </View>
          )}
          {invoiceForm?.invoiceBankSnapshot?.bankName && (
            <View style={[PDF_STYLES.row, { borderBottom: '1px solid #e0e0e0' }]}>
              <View style={[PDF_STYLES.w40, { padding: 4, borderRight: '1px solid #e0e0e0', backgroundColor: '#f9f9f9' }]}>
                <Text style={[{ fontSize: FONT_SIZES[invoiceForm?.invoiceCustomization?.fontSize ?? DEFAULT_FONT_SIZES].businessText, fontWeight: 'bold' }]}>Bank Name</Text>
              </View>
              <View style={[PDF_STYLES.w60, { padding: 4 }]}>
                <Text style={[{ fontSize: FONT_SIZES[invoiceForm?.invoiceCustomization?.fontSize ?? DEFAULT_FONT_SIZES].businessText }]}>{invoiceForm?.invoiceBankSnapshot?.bankName}</Text>
              </View>
            </View>
          )}
          {invoiceForm?.invoiceBankSnapshot?.accountNumber && (
            <View style={[PDF_STYLES.row, { borderBottom: '1px solid #e0e0e0' }]}>
              <View style={[PDF_STYLES.w40, { padding: 4, borderRight: '1px solid #e0e0e0', backgroundColor: '#f9f9f9' }]}>
                <Text style={[{ fontSize: FONT_SIZES[invoiceForm?.invoiceCustomization?.fontSize ?? DEFAULT_FONT_SIZES].businessText, fontWeight: 'bold' }]}>Account Number</Text>
              </View>
              <View style={[PDF_STYLES.w60, { padding: 4 }]}>
                <Text style={[{ fontSize: FONT_SIZES[invoiceForm?.invoiceCustomization?.fontSize ?? DEFAULT_FONT_SIZES].businessText }]}>{invoiceForm?.invoiceBankSnapshot?.accountNumber}</Text>
              </View>
            </View>
          )}
          {invoiceForm?.invoiceBankSnapshot?.bankIfscCode && (
            <View style={[PDF_STYLES.row, { borderBottom: '1px solid #e0e0e0' }]}>
              <View style={[PDF_STYLES.w40, { padding: 4, borderRight: '1px solid #e0e0e0', backgroundColor: '#f9f9f9' }]}>
                <Text style={[{ fontSize: FONT_SIZES[invoiceForm?.invoiceCustomization?.fontSize ?? DEFAULT_FONT_SIZES].businessText, fontWeight: 'bold' }]}>IFSC Code</Text>
              </View>
              <View style={[PDF_STYLES.w60, { padding: 4 }]}>
                <Text style={[{ fontSize: FONT_SIZES[invoiceForm?.invoiceCustomization?.fontSize ?? DEFAULT_FONT_SIZES].businessText }]}>{invoiceForm?.invoiceBankSnapshot?.bankIfscCode}</Text>
              </View>
            </View>
          )}
          {invoiceForm?.invoiceBankSnapshot?.branchCode && (
            <View style={[PDF_STYLES.row, { borderBottom: '1px solid #e0e0e0' }]}>
              <View style={[PDF_STYLES.w40, { padding: 4, borderRight: '1px solid #e0e0e0', backgroundColor: '#f9f9f9' }]}>
                <Text style={[{ fontSize: FONT_SIZES[invoiceForm?.invoiceCustomization?.fontSize ?? DEFAULT_FONT_SIZES].businessText, fontWeight: 'bold' }]}>Branch</Text>
              </View>
              <View style={[PDF_STYLES.w60, { padding: 4 }]}>
                <Text style={[{ fontSize: FONT_SIZES[invoiceForm?.invoiceCustomization?.fontSize ?? DEFAULT_FONT_SIZES].businessText }]}>{invoiceForm?.invoiceBankSnapshot?.branchCode}</Text>
              </View>
            </View>
          )}
        </View>
        <QRCodeInfo qrCodeUrl={qrCodeUrl} invoiceForm={invoiceForm} />
      </View>
    </View>
  );
};
export const PaymentInfo = memo(PaymentInfoComponent);
