'use client'

import { Modal } from '@/components/ui/Modal'

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-gray-600">{message}</p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={onConfirm}
          className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          {confirmLabel}
        </button>
        <button
          onClick={onClose}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          {cancelLabel}
        </button>
      </div>
    </Modal>
  )
}
