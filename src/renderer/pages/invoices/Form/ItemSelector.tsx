import AddIcon from '@mui/icons-material/Add';
import { Box, ListItemButton, ListItemText, Typography, useTheme } from '@mui/material';
import { memo, type FC } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  onEdit: () => void;
}
const ItemSelectorComponent: FC<Props> = ({ onEdit }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', my: 2 }}>
      <ListItemButton
        onClick={onEdit}
        sx={{
          py: 1.5,
          px: 3,
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px dashed',
          borderColor: 'primary.main',
          bgcolor: '#f4f9ff',
          '&:hover': { bgcolor: '#e3f2fd' }
        }}
      >
        <ListItemText
          primary={
            <>
              <Typography
                component="div"
                variant="body1"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <AddIcon />
                {t('invoices.addItem').toUpperCase()} *
              </Typography>
            </>
          }
          disableTypography
          sx={{ m: 0 }}
          slotProps={{ primary: { sx: { fontWeight: 500, m: 0 } } }}
        />
      </ListItemButton>
    </Box>
  );
};
export const ItemSelector = memo(ItemSelectorComponent);
