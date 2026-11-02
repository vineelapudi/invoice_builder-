import { SwipeableDrawer, useMediaQuery, useTheme } from '@mui/material';
import { memo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAddItemMutation, useGetItemsQuery } from '../../../../shared/api/itemsApi';
import { CRUDPageRTK } from '../../../../shared/components/layout/crudPage/CRUDPageRTK';
import { FilterType } from '../../../../shared/enums/filterType';
import type { InvoiceType } from '../../../../shared/enums/invoiceType';
import type { Filter } from '../../../../shared/types/filter';
import type { CustomFieldMeta, ItemForm } from '../../../../shared/types/invoice';
import type { Item, ItemAdd, ItemUpdate } from '../../../../shared/types/item';
import { createCommonFilters, createInvoiceFilters } from '../../../../shared/utils/filterSortFunctions';
import { isItemFromData } from '../../../../shared/utils/typeGuardFunctions';
import { List as ItemsList } from '../../../items/List';
import { Form as ItemFormCreate } from '../../../items/Form';
import { ItemMetadataSetter } from '../Modals/ItemMetadataSetter';

interface Props {
  isOpen: boolean;
  type: InvoiceType;
  headerOptions: CustomFieldMeta[];
  onClose?: () => void;
  onOpen?: () => void;
  onClick?: (item: Item, data: ItemForm) => void;
}

const ItemsDropdownComponent: FC<Props> = ({ isOpen, type, headerOptions, onClose, onOpen, onClick }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const { t } = useTranslation();
  const filters: Filter[] = [
    ...createCommonFilters({ t, namespace: 'items', initial: FilterType.active }),
    ...createInvoiceFilters({ t, namespace: 'items' })
  ];
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);
  
  const [addItemMutation, addItemMeta] = useAddItemMutation();
  const useAddWrapped = () => {
    const addWrapper = async (data: ItemAdd) => {
      const res = await addItemMutation(data);
      if ('data' in res && res.data) {
         setSelectedItem(res.data);
      }
      return res;
    };
    return [addWrapper, addItemMeta] as const;
  };

  return (
    <>
      {isOpen && (
        <ItemMetadataSetter
          type={type}
          headerOptions={headerOptions}
          currUnitPrice={Number(selectedItem?.amount ?? 0)}
          isOpen={selectedItem !== undefined}
          onCancel={() => setSelectedItem(undefined)}
          onSave={data => {
            if (selectedItem) onClick?.(selectedItem, data);
            setSelectedItem(undefined);
          }}
        />
      )}

      {!selectedItem && (
        <SwipeableDrawer
          anchor="bottom"
          open={isOpen}
          onClose={() => onClose?.()}
          onOpen={() => onOpen?.()}
          slotProps={{
            paper: {
              sx: {
                maxWidth: isDesktop ? '40%' : '100%',
                height: '80%',
                mx: 'auto',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                p: 3
              }
            }
          }}
        >
          <CRUDPageRTK<Item, ItemAdd, ItemUpdate>
            componentId="invoices:items"
            filters={filters}
            showRightSide={false}
            useRetrieve={useGetItemsQuery}
            useAdd={useAddWrapped}
            noItemButtonText={t('items.add')}
            validateAndNormalize={async data => {
              if (!isItemFromData(data)) return;
              return data;
            }}
            form={({ item, onChange }) => (
              <ItemFormCreate
                item={item}
                handleChange={d => {
                  if (isItemFromData(d.item)) {
                    onChange({
                      changedData: d.item,
                      isFormValid: d.isFormValid,
                      description: d.description
                    });
                  }
                }}
              />
            )}
            searchField={'name'}
            sortOptions={[
              { label: t('common.name'), value: 'name' },
              { label: t('common.lastUpdate'), value: 'updatedAt' }
            ]}
            noItemText={t('items.noItem')}
            noDataText="No items found"
            renderListItem={(item, selectedItem) => (
              <ItemsList
                key={item.id}
                item={item}
                showDeleteButton={false}
                selectedItem={selectedItem}
                onEdit={(editItem: Item) => setSelectedItem(editItem)}
              />
            )}
          />
        </SwipeableDrawer>
      )}
    </>
  );
};
export const ItemsDropdown = memo(ItemsDropdownComponent);
