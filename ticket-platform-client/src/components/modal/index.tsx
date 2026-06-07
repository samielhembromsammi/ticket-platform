/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { X } from "lucide-react";
import { Button, Modal } from "antd";
import { ReactNode, useEffect, useState } from "react";

// Type for CustomModal props
interface CustomModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  className?: string;
  width?: string | number;
  title?: string;
  children: ReactNode;
  onClose?: () => void; // optional callback when modal closes
}

export const CustomModal: React.FC<CustomModalProps> = ({
  open,
  setOpen,
  className = "",
  width = "60%",
  title = "",
  children,
  onClose,
}) => {
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Handle modal close
  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose(); // notify parent to reset form
  };

  return (
    <div>
      <Modal
        centered
        title={<div className="text-center w-full">{title}</div>}
        open={open}
        footer={null}
        onCancel={handleClose}
        width={width}
        closeIcon={
          <X className="text-red-500 border rounded-full border-red-500" />
        }
      >
        <div
          className={`${className} max-h-[85vh] h-max overflow-y-auto scroll-container`}
        >
          {children}
        </div>
      </Modal>
      <style jsx>{`
        .scroll-container {
          max-height: 85vh;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

// for confirmation modal 
interface ConfirmModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  loading?: boolean;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  setOpen,
  loading,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
}) => {
  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      footer={[
        <Button key="cancel" danger onClick={() => setOpen(false)}>
          Cancel
        </Button>,
        <Button
          onClick={onConfirm}
          disabled={loading}
          key="confirm"
          type="primary"
          className="!bg-[#D4AF38] hover:!bg-[#c29d2e] border-none"
        >
          {loading && (
            <span className="animate-spin border-2 border-white border-t-transparent w-4 h-4 rounded-full mr-2"></span>
          )}
          Confirm
        </Button>,
      ]}
      centered
      title={title}
      width={400}
    >
      <p className="text-gray-700">{message}</p>
    </Modal>
  );
};
