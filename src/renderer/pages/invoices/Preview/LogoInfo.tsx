import { Image } from '@react-pdf/renderer';
import { memo, type FC } from 'react';
import type { InvoiceFromData } from '../../../shared/types/invoice';
import { DEFAULT_LOGO_SIZES, LOGO_SIZES } from './constant';
import myLogo from '../../../assets/logo.jpg';

interface Props {
  invoiceForm?: InvoiceFromData;
  logoUrl?: string;
}
const LogoInfoComponent: FC<Props> = ({ invoiceForm }) => {
  return (
    <Image
      style={[{ ...LOGO_SIZES[invoiceForm?.invoiceCustomization?.logoSize ?? DEFAULT_LOGO_SIZES] }]}
      src={myLogo}
    />
  );
};
export const LogoInfo = memo(LogoInfoComponent);
