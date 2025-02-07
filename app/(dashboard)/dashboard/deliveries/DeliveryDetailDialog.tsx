import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
 import { Delivery } from "@/types";
  
  interface DeliveryDetailsDialogProps {
    delivery: Delivery | null;
    onClose: () => void;
  }
  
  export function DeliveryDetailsDialog({ delivery, onClose }: DeliveryDetailsDialogProps) {
    if (!delivery) return null;
  
    return (
      <Dialog open={!!delivery} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delivery Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="font-semibold">Order:</p>
              <p>{delivery.order}</p>
            </div>
            <div>
              <p className="font-semibold">Customer:</p>
              <p>{delivery.customer}</p>
            </div>
            <div>
              <p className="font-semibold">Address:</p>
              <p>{delivery.address}</p>
            </div>
            <div>
              <p className="font-semibold">Driver:</p>
              <p>{delivery.driver || 'Not Assigned'}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }