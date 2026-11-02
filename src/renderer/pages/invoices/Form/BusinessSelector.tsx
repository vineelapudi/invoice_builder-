import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Typography, useTheme } from '@mui/material';
import { memo, useEffect, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { toDataUrl } from '../../../shared/utils/dataUrlFunctions';

interface Props {
  data?: {
    businessLogo?: Uint8Array<ArrayBufferLike>;
    businessFileType?: string;
    businessName?: string;
    businessShortName?: string;
  };
  isRequired?: boolean;
  onEdit: () => void;
}

const BusinessSelectorComponent: FC<Props> = ({ data, onEdit, isRequired = true }) => {
  const { businessLogo, businessFileType, businessName, businessShortName } = data ?? {};
  const { t } = useTranslation();
  const theme = useTheme();

  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const url = businessLogo ? await toDataUrl(businessLogo, businessFileType) : null;
      setLogoUrl(url);
    })();
  }, [businessLogo, businessFileType]);

  return (
    <Box sx={{ flex: 1, width: '100%', mb: 1 }}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        {t('businesses.title')} <Box component="span" sx={{ color: 'error.main' }}>{isRequired ? '*' : ''}</Box>
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
        <Typography variant="body2" sx={{ color: businessName ? 'text.primary' : 'text.disabled', flex: 1 }}>
          {businessName || 'Select Business'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {logoUrl ? (
            <Box
              sx={{
                width: '32px',
                height: '32px',
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.common.white,
                borderRadius: 1,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src={logoUrl}
                alt={t('invoices.businessLogo')}
                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
              />
            </Box>
          ) : businessShortName ? (
            <Box
              sx={{
                width: '32px',
                height: '32px',
                border: `1px solid ${theme.palette.divider}`,
                background: theme.palette.common.white,
                color: theme.palette.common.black,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 1,
                fontWeight: 500,
                fontSize: 12,
                overflow: 'hidden'
              }}
            >
              {businessShortName}
            </Box>
          ) : null}
          <KeyboardArrowDownIcon fontSize="small" color="action" />
        </Box>
      </Box>
    </Box>
  );
};
export const BusinessSelector = memo(BusinessSelectorComponent);
