"use client";

import { useActionState, useRef } from "react";
import { addLeadNote } from "@/lib/leads/lead-actions";

interface NoteAdderProps {
  leadId: string;
}

type ActionState = { success: boolean; error?: string } | null;

export function NoteAdder({ leadId }: NoteAdderProps) {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleAction(
    _prev: ActionState,
    formData: FormData,
  ): Promise<ActionState> {
    const result = await addLeadNote(leadId, formData);
    if (result.success) {
      formRef.current?.reset();
    }
    return result;
  }

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    handleAction,
    null,
  );

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <textarea
        name="note"
        rows={3}
        required
        placeholder="Not ekleyin..."
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
      {state && !state.success && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-green-600">✓ Not eklendi</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
      >
        {isPending ? "Ekleniyor..." : "Not Ekle"}
      </button>
    </form>
  );
}
