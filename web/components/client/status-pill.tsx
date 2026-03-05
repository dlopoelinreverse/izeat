"use client";

interface StatusPillProps {
  waiterCall: { status: string } | null;
  foodOrder: { status: string } | null;
  onClick: () => void;
}

export function StatusPill({ waiterCall, foodOrder, onClick }: StatusPillProps) {
  const isActive =
    (!!waiterCall && waiterCall.status === "pending") ||
    (!!foodOrder && foodOrder.status !== "payed");

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-medium transition-all duration-200
        ${
          isActive
            ? "bg-[#E8F5EE] border-[rgba(45,106,79,0.2)] text-[#2D6A4F]"
            : "bg-[#F7F4EF] border-[rgba(26,23,20,0.08)] text-[#9A9690]"
        }
      `}
      aria-label="Voir le statut"
    >
      <span
        className={`inline-block w-[7px] h-[7px] rounded-full shrink-0 ${
          isActive ? "bg-[#2D6A4F] menu-pulse-dot" : "bg-[#9A9690]"
        }`}
      />
      Statut
    </button>
  );
}
