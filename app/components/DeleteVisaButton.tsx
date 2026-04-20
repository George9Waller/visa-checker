"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { deleteVisa } from "../visas/server-actions";
import { toast } from "react-toastify";

export default function DeleteVisaButton({ visaId }: { visaId: string }) {
  const router = useRouter();
  const modal = useRef<HTMLDialogElement | null>(null);

  const deleteVisaHandler = () => {
    deleteVisa(visaId)
      .then(() => {
        toast.success("Visa deleted");
        router.push("/visas");
      })
      .catch((e) => {
        toast.error(`Error deleting visa: ${e}`);
      });
  };

  return (
    <>
      <button
        onClick={() => modal.current?.showModal()}
        className="flex items-center justify-center rounded-[var(--r-s)] transition-colors"
        style={{
          width: 32,
          height: 32,
          color: "var(--danger)",
          border: "1px solid var(--border)",
          background: "none",
          cursor: "pointer",
        }}
        aria-label="Delete visa"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
          delete
        </span>
      </button>

      <dialog
        ref={modal}
        style={{
          padding: 0,
          border: "1px solid var(--border)",
          borderRadius: "var(--r)",
          backgroundColor: "var(--bg-raised)",
          color: "var(--fg)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
          maxWidth: 360,
          width: "calc(100vw - 48px)",
        }}
      >
        <div style={{ padding: "24px 24px 20px" }}>
          <h3
            className="font-semibold"
            style={{ fontSize: 16, color: "var(--fg)", marginBottom: 8 }}
          >
            Delete this visa?
          </h3>
          <p style={{ fontSize: 13, color: "var(--fg-muted)", marginBottom: 20 }}>
            This will permanently delete the visa and unlink it from any trips.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => modal.current?.close()}
              style={{
                height: 34,
                padding: "0 14px",
                fontSize: 13,
                fontFamily: "var(--font-body)",
                color: "var(--fg-muted)",
                backgroundColor: "transparent",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-s)",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={deleteVisaHandler}
              style={{
                height: 34,
                padding: "0 14px",
                fontSize: 13,
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                color: "#fff",
                backgroundColor: "var(--danger)",
                border: "none",
                borderRadius: "var(--r-s)",
                cursor: "pointer",
              }}
            >
              Delete visa
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
