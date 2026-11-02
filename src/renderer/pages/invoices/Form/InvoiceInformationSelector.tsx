import { Box, Typography, Grid } from '@mui/material';
import { memo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { InvoiceType } from '../../../shared/enums/invoiceType';
import type { InvoiceFromData } from '../../../shared/types/invoice';
import { formatDate } from '../../../shared/utils/formatFunctions';
import { useAppSelector } from '../../../state/configureStore';
import { selectSettings } from '../../../state/pageSlice';

interface Props {
  type: InvoiceType;
  invoiceForm?: InvoiceFromData;
  onEdit: () => void;
}

const InvoiceInformationSelectorComponent: FC<Props> = ({ type, invoiceForm, onEdit }) => {
  const { t } = useTranslation();
  const storeSettings = useAppSelector(selectSettings);

  return (
    <Box sx={{ flex: 1, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', cursor: 'pointer', '&:hover': { borderColor: 'primary.main' } }} onClick={onEdit}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <DescriptionOutlinedIcon color="primary" />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {type === InvoiceType.quotation ? t('invoices.quoteInfo') : t('invoices.invoiceInfo')} <Box component="span" sx={{ color: 'error.main' }}>*</Box>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            {type === InvoiceType.quotation ? t('common.quotePrefix') : t('common.invoicePrefix')}
          </Typography>
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">{invoiceForm?.invoicePrefix || '-'}</Typography>
            <KeyboardArrowDownIcon fontSize="small" color="action" />
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            {type === InvoiceType.quotation ? t('common.quoteNumber') : t('common.invoiceNumber')}
          </Typography>
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2">{invoiceForm?.invoiceNumber || '-'}</Typography>
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            {type === InvoiceType.quotation ? t('common.quoteSuffix') : t('common.invoiceSuffix')}
          </Typography>
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2">{invoiceForm?.invoiceSuffix || '-'}</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            {t('common.issuedAt')} <Box component="span" sx={{ color: 'error.main' }}>*</Box>
          </Typography>
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">{storeSettings && invoiceForm?.issuedAt ? formatDate(invoiceForm.issuedAt, storeSettings.dateFormat) : '-'}</Typography>
            <CalendarTodayOutlinedIcon fontSize="small" color="action" />
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            {type === InvoiceType.quotation ? 'Valid Until' : t('common.dueDate')} <Box component="span" sx={{ color: 'error.main' }}>*</Box>
          </Typography>
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">{storeSettings && invoiceForm?.dueDate ? formatDate(invoiceForm.dueDate, storeSettings.dateFormat) : '-'}</Typography>
            <CalendarTodayOutlinedIcon fontSize="small" color="action" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export const InvoiceInformationSelector = memo(InvoiceInformationSelectorComponent);
