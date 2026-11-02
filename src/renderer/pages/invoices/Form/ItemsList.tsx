import { closestCenter, DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, IconButton, Tooltip, Typography, Grid } from '@mui/material';
import React, { memo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { SortableItem } from '../../../shared/components/lists/sortableItem/SortableItem';
import type { InvoiceFromData, InvoiceItem } from '../../../shared/types/invoice';
import { getItemFinancialData } from '../../../shared/utils/invoiceFunctions';
import { useAppSelector } from '../../../state/configureStore';
import { selectSettings } from '../../../state/pageSlice';

interface Props {
  invoiceForm?: InvoiceFromData;
  setInvoiceForm?: React.Dispatch<React.SetStateAction<InvoiceFromData | undefined>>;
  onDelete?: (item: InvoiceItem) => void;
  onEdit?: (item: InvoiceItem) => void;
}

const ItemsListComponent: FC<Props> = ({ invoiceForm, setInvoiceForm, onEdit = () => {}, onDelete = () => {} }) => {
  const storeSettings = useAppSelector(selectSettings);
  const { t } = useTranslation();

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id && invoiceForm?.invoiceItems && setInvoiceForm) {
      const oldIndex = invoiceForm.invoiceItems.findIndex((i, idx) => `invoice-item-${i.itemId}-${idx}` === active.id);
      const newIndex = invoiceForm.invoiceItems.findIndex((i, idx) => `invoice-item-${i.itemId}-${idx}` === over?.id);
      const newItems = arrayMove(invoiceForm.invoiceItems, oldIndex, newIndex);
      setInvoiceForm({ ...invoiceForm, invoiceItems: newItems });
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Grid container sx={{ py: 1.5, px: 2, bgcolor: '#f4f9ff', borderRadius: 2, mb: 1, alignItems: 'center' }}>
        <Grid item xs={1}><Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>#</Typography></Grid>
        <Grid item xs={3}><Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Item / Service</Typography></Grid>
        <Grid item xs={1}><Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Quantity</Typography></Grid>
        <Grid item xs={2}><Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Unit Price</Typography></Grid>
        <Grid item xs={2}><Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Tax (%)</Typography></Grid>
        <Grid item xs={2}><Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Amount</Typography></Grid>
        <Grid item xs={1} sx={{ textAlign: 'center' }}><Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Action</Typography></Grid>
      </Grid>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={invoiceForm?.invoiceItems?.map((i, idx) => `invoice-item-${i.itemId}-${idx}`) ?? []}
          strategy={verticalListSortingStrategy}
        >
        {invoiceForm?.invoiceItems?.map((invoiceItem, index) => {
          const { quantity, taxType, taxRate, invoiceItemSnapshot, customField } = invoiceItem;
          const { unitPriceCents = '0', itemName } = invoiceItemSnapshot;

          const { formattedUnitPrice, formattedTotal, formattedTax, formattedItemDiscountAmount, itemDiscountAmount } =
            getItemFinancialData({
              storeSettings,
              currencySymbol: invoiceForm?.invoiceCurrencySnapshot?.currencySymbol,
              currencyCode: invoiceForm?.invoiceCurrencySnapshot?.currencyCode,
              currencySubunit: invoiceForm?.invoiceCurrencySnapshot?.currencySubunit,
              currencyFormat: invoiceForm?.currencyFormat,
              unitPrice: Number(unitPriceCents),
              quantity: Number(quantity),
              taxType,
              taxRate,
              invoiceItems: invoiceForm?.invoiceItems ?? [],
              discountType: invoiceForm?.discountType,
              discountAmount: Number(invoiceForm?.discountAmountCents ?? 0),
              discountPercent: invoiceForm?.discountPercent
            });

          return (
            <SortableItem
              key={`invoice-item-${invoiceItem.itemId}-${index}`}
              id={`invoice-item-${invoiceItem.itemId}-${index}`}
            >
              <Box
                onClick={() => onEdit(invoiceItem)}
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  py: 1,
                  px: 0,
                  cursor: 'pointer',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': { borderBottom: 'none' },
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <Grid container alignItems="center" sx={{ px: 2, width: '100%' }}>
                  <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title={t('ariaLabel.dragToSort')}>
                      <IconButton size="small" data-drag-handle onMouseDown={e => e.stopPropagation()} sx={{ mr: 1, p: 0.5 }}>
                        <DragIndicatorIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="body2">{index + 1}</Typography>
                  </Grid>
                  
                  <Grid item xs={3}>
                    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1, mr: 2, bgcolor: '#fff' }}>
                      <Typography variant="body2" noWrap>{itemName || '-'}</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={1}>
                    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1, mr: 2, bgcolor: '#fff' }}>
                      <Typography variant="body2">{quantity}</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={2}>
                    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1, mr: 2, bgcolor: '#fff' }}>
                      <Typography variant="body2">{formattedUnitPrice}</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={2}>
                    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1, mr: 2, bgcolor: '#fff' }}>
                      <Typography variant="body2">
                        {invoiceItem.taxType ? invoiceItem.taxRate + '%' : '0%'}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={2}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{formattedTotal}</Typography>
                  </Grid>
                  
                  <Grid item xs={1} sx={{ textAlign: 'center' }}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={e => {
                        e.stopPropagation();
                        onDelete(invoiceItem);
                      }}
                    >
                      <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            </SortableItem>
          );
        })}
      </SortableContext>
    </DndContext>
    </Box>
  );
};

export const ItemsList = memo(ItemsListComponent);
