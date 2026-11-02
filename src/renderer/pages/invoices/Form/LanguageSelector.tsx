import { Box, ListItemButton, ListItemText, Typography, useTheme } from '@mui/material';
import { memo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { Language } from '../../../shared/enums/language';
import { LANGUAGE_ITEMS } from '../../../state/constant';

interface Props {
  language?: Language;
  isRequired?: boolean;
  onEdit: () => void;
}

const LanguageSelectorComponent: FC<Props> = ({ onEdit, isRequired = true, language }) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ flex: 1, minWidth: 200 }}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        {t('languageFormat.language')} <Box component="span" sx={{ color: 'error.main' }}>{isRequired ? '*' : ''}</Box>
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
        <Typography variant="body2" sx={{ color: language ? 'text.primary' : 'text.disabled', flex: 1 }}>
          {language ? LANGUAGE_ITEMS[language].label : 'Select Language'}
        </Typography>
        <KeyboardArrowDownIcon fontSize="small" color="action" />
      </Box>
    </Box>
  );
};
export const LanguageSelector = memo(LanguageSelectorComponent);
