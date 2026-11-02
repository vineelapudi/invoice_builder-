import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, IconButton, Typography } from '@mui/material';
import { memo, type FC } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  name?: string;
  onEdit: () => void;
  onClear?: () => void;
}

const BankSelectorComponent: FC<Props> = ({ name, onEdit, onClear }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ flex: 1, minWidth: 200 }}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        {t('common.bank')}
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
        <Typography variant="body2" sx={{ color: name ? 'text.primary' : 'text.disabled', flex: 1 }}>
          {name || 'Select Bank'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {name && onClear && (
            <IconButton
              size="small"
              onClick={e => {
                e.stopPropagation();
                onClear();
              }}
              sx={{ mr: 1, p: 0 }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          )}
          <KeyboardArrowDownIcon fontSize="small" color="action" />
        </Box>
      </Box>
    </Box>
  );
};
export const BankSelector = memo(BankSelectorComponent);
