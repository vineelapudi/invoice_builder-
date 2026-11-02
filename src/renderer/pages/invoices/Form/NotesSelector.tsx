import ArticleIcon from '@mui/icons-material/Article';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NoteIcon from '@mui/icons-material/Note';
import { Box, IconButton, ListItemButton, ListItemText, Tooltip, Typography } from '@mui/material';
import { memo, useCallback, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NoteDropdown } from './Dropdowns/NoteDropdown';

enum NoteFormType {
  customer,
  thankyou,
  termsconditions
}
interface NoteForm {
  currentNote?: string;
  title: string;
  type: NoteFormType;
}
interface Props {
  data: {
    customerNotes?: string;
    thanksNotes?: string;
    termsConditionNotes?: string;
  };
  onCustomerNotesChanged: (value?: string) => void;
  onThanksNotesChanged: (value?: string) => void;
  onTermsConditionsNotesChanged: (value?: string) => void;
}
const NotesSelectorComponent: FC<Props> = ({
  data,
  onCustomerNotesChanged,
  onThanksNotesChanged,
  onTermsConditionsNotesChanged
}) => {
  const { customerNotes, thanksNotes, termsConditionNotes } = data;
  const { t } = useTranslation();

  const [isDropdownOpenNotes, setIsDropdownOpenNotes] = useState<boolean>(false);
  const [formData, setFormData] = useState<NoteForm | undefined>(undefined);

  const handleOnOpen = useCallback((setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(true);
  }, []);

  const handleOnClose = useCallback((setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(false);
  }, []);

  const notesConfig = [
    {
      type: NoteFormType.customer,
      label: t('invoices.customerNote'),
      value: customerNotes,
      icon: <NoteIcon fontSize="small" />
    },
    {
      type: NoteFormType.thankyou,
      label: t('invoices.thankNote'),
      value: thanksNotes,
      icon: <FavoriteIcon fontSize="small" />
    },
    {
      type: NoteFormType.termsconditions,
      label: t('invoices.termsConditions'),
      value: termsConditionNotes,
      icon: <ArticleIcon fontSize="small" />
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
      {notesConfig.map(note => (
        <Box
          key={note.type}
          onClick={() => {
            setFormData({
              currentNote: note.value,
              title: note.label,
              type: note.type
            });
            handleOnOpen(setIsDropdownOpenNotes);
          }}
          sx={{
            flex: 1,
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.paper',
            cursor: 'pointer',
            '&:hover': { borderColor: 'primary.main' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
            <Box sx={{ color: 'primary.main', display: 'flex' }}>
              {note.icon}
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {note.label}
            </Typography>
          </Box>
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1.5, minHeight: '80px', bgcolor: '#f9f9f9' }}>
            <Typography variant="body2" sx={{ color: note.value ? 'text.primary' : 'text.disabled' }}>
              {note.value || t('common.clickToAdd')}
            </Typography>
          </Box>
        </Box>
      ))}

      {formData && (
        <NoteDropdown
          isOpen={isDropdownOpenNotes}
          onClose={() => handleOnClose(setIsDropdownOpenNotes)}
          onOpen={() => handleOnOpen(setIsDropdownOpenNotes)}
          onClick={data => {
            switch (formData.type) {
              case NoteFormType.customer:
                onCustomerNotesChanged(data);
                break;
              case NoteFormType.thankyou:
                onThanksNotesChanged(data);
                break;
              case NoteFormType.termsconditions:
                onTermsConditionsNotesChanged(data);
                break;
            }
            handleOnClose(setIsDropdownOpenNotes);
          }}
          currentNote={formData?.currentNote}
          title={formData.title}
        />
      )}
    </Box>
  );
};
export const NotesSelector = memo(NotesSelectorComponent);
