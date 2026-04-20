"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { deleteVisa } from "../visas/server-actions";
import { toast } from "react-toastify";
import { Box } from "./ui/layout/Box";
import { Flex } from "./ui/layout/Flex";
import { Icon } from "./ui/typography/Icon";
import { Text } from "./ui/typography/Text";
import { Heading } from "./ui/typography/Heading";
import { Btn } from "./ui/Btn";

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
      <Box
        as="button"
        onClick={() => modal.current?.showModal()}
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "var(--r-s)",
          color: "var(--danger)",
          border: "1px solid var(--border)",
          background: "none",
          cursor: "pointer",
        }}
        aria-label="Delete visa"
      >
        <Icon name="delete" style={{ fontSize: 17 }} />
      </Box>

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
        <Box p="lg">
          <Heading variant="h4" mb="xs">
            Delete this visa?
          </Heading>
          <Text color="muted" mb="lg" as="p">
            This will permanently delete the visa and unlink it from any trips.
          </Text>
          <Flex variant="row" gap="sm" style={{ justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => modal.current?.close()}>
              Cancel
            </Btn>
            <Btn variant="danger" onClick={deleteVisaHandler}>
              Delete visa
            </Btn>
          </Flex>
        </Box>
      </dialog>
    </>
  );
}
