import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Button } from "@/components/ui/button";
  import { useState } from "react";
 import { Delivery, Driver } from "@/types";
  
  interface AssignDriverDialogProps {
    delivery: Delivery | null;
    drivers: Driver[];
    onAssign: (deliveryId: number, driverId: number) => void;
    onClose: () => void;
  }
  
  export function AssignDriverDialog({ delivery, drivers, onAssign, onClose }: AssignDriverDialogProps) {
    const [selectedDriver, setSelectedDriver] = useState<string>("");
  
    if (!delivery) return null;
  
    return (
      <Dialog open={!!delivery} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Driver</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="font-semibold">Order: {delivery.order}</p>
            <div className="space-y-2">
              <p className="font-semibold">Select Driver:</p>
              <Select onValueChange={setSelectedDriver} value={selectedDriver}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id.toString()}>
                      {driver.name} ({driver.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => onAssign(delivery.id, Number(selectedDriver))}
              disabled={!selectedDriver}
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }