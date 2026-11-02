import { Box, ListItemButton, ListItemText, Typography, useTheme } from '@mui/material';
import { memo, type FC } from 'react';
import { useTranslation } from 'react-i18next';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface Props {
  data?: {
    currencyCode?: string;
    currencySymbol?: string;
  };
  isRequired?: boolean;
  onEdit: () => void;
}

const CurrencySelectorComponent: FC<Props> = ({ data, onEdit, isRequired = true }) => {
  const { currencyCode, currencySymbol } = data ?? {};
  const { t } = useTranslation();

  return (
    <Box sx={{ flex: 1, minWidth: 200 }}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        {t('common.currency')} <Box component="span" sx={{ color: 'error.main' }}>{isRequired ? '*' : ''}</Box>
      </Typography>
      <Box
        onClick={onEdit}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          p: 1.5,
          cursor: 'pointer',
          bgcolor: 'background.paper',
          '&:hover': { borderColor: 'primary.main' }
        }}
      >
        <Typography variant="body2" sx={{ color: currencyCode ? 'text.primary' : 'text.disabled' }}>
          {currencyCode && currencySymbol ? `${currencyCode} - ${currencySymbol}` : 'Select Currency'}
        </Typography>
        <KeyboardArrowDownIcon fontSize="small" color="action" />
      </Box>
    </Box>
  );
};
export const CurrencySelector = memo(CurrencySelectorComponent);
