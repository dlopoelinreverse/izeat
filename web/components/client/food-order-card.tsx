"use client";

import { ChefHatIcon, CheckIcon } from "lucide-react";

const FOOD_STEPS = [
  { status: "pending", label: "En attente" },
  { status: "preparing", label: "En préparation" },
  { status: "served", label: "Servi" },
];

interface FoodOrderCardProps {
  foodOrder: { status: string };
}

export function FoodOrderCard({ foodOrder }: FoodOrderCardProps) {
  const activeStepIndex = FOOD_STEPS.findIndex(
    (s) => s.status === foodOrder.status,
  );

  return (
    <div className="rounded-[14px] bg-[#F7F4EF] border border-[rgba(26,23,20,0.08)] p-4 space-y-4">
      <div className="flex items-center gap-2 font-medium text-sm text-[#1A1714]">
        <ChefHatIcon className="h-4 w-4 text-[#C8963E]" />
        Ma commande
      </div>

      <div className="flex items-start gap-0">
        {FOOD_STEPS.map((step, i) => {
          const isPast = i < activeStepIndex;
          const isActive = i === activeStepIndex;

          return (
            <div key={step.status} className="flex-1 flex flex-col items-center gap-2">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div
                    className={`flex-1 h-0.5 ${
                      isPast || isActive ? "bg-[#2D6A4F]" : "bg-[#E8E4DF]"
                    }`}
                  />
                )}
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all
                    ${isActive
                      ? "bg-[#1A1714] text-white shadow-[0_0_0_4px_rgba(26,23,20,0.1)]"
                      : ""}
                    ${isPast
                      ? "bg-[#2D6A4F] text-white"
                      : ""}
                    ${!isActive && !isPast
                      ? "bg-[#F7F4EF] border border-[rgba(26,23,20,0.15)] text-[#9A9690]"
                      : ""}`}
                >
                  {isPast ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
                </div>
                {i < FOOD_STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 ${
                      isPast ? "bg-[#2D6A4F]" : "bg-[#E8E4DF]"
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-[10px] text-center leading-tight ${
                  isActive
                    ? "text-[#1A1714] font-semibold"
                    : isPast
                      ? "text-[#2D6A4F]"
                      : "text-[#9A9690]"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
