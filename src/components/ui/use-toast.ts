 import { toast, type ToastT } from 'sonner';

export type ToastProps = Parameters<typeof toast>[1];

export const useToast = () => {
  return {
    toast: (message: string | React.ReactNode, options?: ToastProps) => toast(message, options),
    success: (message: string | React.ReactNode, options?: ToastProps) => toast.success(message, options),
    error: (message: string | React.ReactNode, options?: ToastProps) => toast.error(message, options),
    loading: (message: string | React.ReactNode, options?: ToastProps) => toast.loading(message, options),
    dismiss: (toastId?: string) => toast.dismiss(toastId),
  };
};

export type { ToastT };