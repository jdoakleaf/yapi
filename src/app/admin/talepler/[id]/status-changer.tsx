"use client";

import { useActionState } from "react";
import { updateLeadStatus } from "@/lib/leads/lead-actions";
import { LeadStatus } from "@prisma/client";

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "Yeni",
  CONTACTED: "İletişime Geçildi",
  QUOTING: "Teklif Hazırlanıyor",
  QUOTE_SENT: "Teklif Gönderildi",
  WON: "Kazanıldı",
  LOST: "Kaybedildi",
  ARCHIVED: "Arşivlendi",
};

interface StatusChangerProps {
  leadId: string;
  currentStatus: LeadStatus;
}

type ActionState = { success: boolean; error?: string } | null;

export function StatusChanger({ leadId, currentStatus }: StatusChangerProps) {
  async function handleAction(
    _prev: ActionState,
    formData: FormData,
  ): Promise<ActionState> {
    return updateLeadStatus(leadId, formData);
  }

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    handleAction,
    null,
  );

  return (
    <form action={formAction} className="flex items-center gap-2">
      <select
        name="status"
        defaultValue={currentStatus}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
      >
        {isPending ? "Kaydediliyor..." : "Kaydet"}
      </button>
      {state && !state.success && (
        <span className="text-sm text-red-600">{state.error}</span>
      )}
      {state?.success && (
        <span className="text-sm text-green-600">✓ Kaydedildi</span>
      )}
    </form>
  );
}
