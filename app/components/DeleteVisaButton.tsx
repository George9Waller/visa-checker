"use client";

import { useRouter } from "next/navigation";
import { MutableRefObject, useRef } from "react";
import { deleteVisa } from "../visas/server-actions";
import { toast } from "react-toastify";

export default function DeleteVisaButton({ visaId }: { visaId: string }) {
  const router = useRouter();
  const modal = useRef<HTMLDialogElement>();

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

  const onDeleteButtonClick = () => {
    modal.current?.showModal();
  };

  return (
    <>
      <button className="btn btn-error" onClick={onDeleteButtonClick}>
        Delete visa
      </button>
      <dialog
        ref={modal as MutableRefObject<HTMLDialogElement> | undefined}
        className="modal"
      >
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">
            Are you sure you want to delete this visa and unlink it from any
            trips?
          </h3>
          <button className="btn btn-error" onClick={() => deleteVisaHandler()}>
            Delete visa
          </button>
        </div>
      </dialog>
    </>
  );
}
