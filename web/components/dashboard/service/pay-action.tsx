"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PayActionProps {
  orderId: string;
  onPay: (orderId: string) => void;
  onClose: () => void;
  loading: boolean;
}

export interface PayActionHandle {
  cancel: () => void;
}

export const PayAction = forwardRef<PayActionHandle, PayActionProps>(
  function PayAction({ orderId, onPay, onClose, loading }, ref) {
    const [delayPayedStatus, setDelayPayedStatus] = useState(false);
    const [barStarted, setBarStarted] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cancelDelay = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setDelayPayedStatus(false);
      setBarStarted(false);
    };

    useImperativeHandle(ref, () => ({ cancel: cancelDelay }));

    useEffect(() => {
      if (delayPayedStatus) {
        const raf = requestAnimationFrame(() => setBarStarted(true));
        return () => cancelAnimationFrame(raf);
      }
    }, [delayPayedStatus]);

    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    return (
      <>
        <DialogFooter>
          {delayPayedStatus ? (
            <Button variant="outline" className="w-full" onClick={cancelDelay}>
              Annuler
            </Button>
          ) : (
            <Button
              className="w-full"
              disabled={loading}
              onClick={() => {
                setDelayPayedStatus(true);
                timeoutRef.current = setTimeout(() => {
                  onPay(orderId);
                  onClose();
                  setDelayPayedStatus(false);
                  setBarStarted(false);
                }, 4000);
              }}
            >
              Réglé
            </Button>
          )}
        </DialogFooter>

        {delayPayedStatus && (
          <div className="-mx-6 -mb-6 h-1 overflow-hidden rounded-b-lg">
            <div
              className={`h-full bg-green-500 transition-all ease-linear duration-4000 ${
                barStarted ? "w-full" : "w-0"
              }`}
            />
          </div>
        )}
      </>
    );
  },
);
