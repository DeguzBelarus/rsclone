import React, { useCallback, useState } from 'react';
import { ConfirmModal, ConfirmModalProps } from 'components/ConfirmModal/ConfirmModal';

type UseConfirmModalModalProps = Omit<ConfirmModalProps, 'open' | 'onClose'>;

export default function useConfirmModal() {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), [open]);

  const ModalComponent = useCallback(
    ({ ...props }: UseConfirmModalModalProps) => {
      return <ConfirmModal open={open} onClose={() => setOpen(false)} {...props} />;
    },
    [open]
  );

  return [ModalComponent, openModal] as const;
}
