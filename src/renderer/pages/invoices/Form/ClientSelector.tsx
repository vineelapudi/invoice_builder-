import { Box, ListItemButton, ListItemText, Typography } from '@mui/material';
import { memo, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface Props {
  clientName?: string;
  isRequired?: boolean;
  onEdit: () => void;
}

const ClientSelectorComponent: FC<Props> = ({ clientName, onEdit, isRequired = true }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ flex: 1, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', cursor: 'pointer', '&:hover': { borderColor: 'primary.main' } }} onClick={onEdit}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <PersonOutlinedIcon color="primary" />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {t('invoices.billTo')} <Box component="span" sx={{ color: 'error.main' }}>{isRequired ? '*' : ''}</Box>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1.5, mb: clientName ? 2 : 0 }}>
        <Typography variant="body2" sx={{ color: clientName ? 'text.primary' : 'text.disabled' }}>
          {clientName || 'Select Client'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <KeyboardArrowDownIcon fontSize="small" color="action" />
          <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500, ml: 1 }}>
            + Add New
          </Typography>
        </Box>
      </Box>

      {clientName && (
        <Box sx={{ display: 'flex', gap: 1, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
          <InfoOutlinedIcon color="primary" fontSize="small" sx={{ mt: 0.2 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {clientName}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
              Click to view or edit details
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};
export const ClientSelector = memo(ClientSelectorComponent);
