import PaymentForm from "@/components/forms/main-page/payments";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { stringToDate } from "@/lib/utils";
import { PaymentFormSchema, PaymentFormSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { usePaymentFormMutation } from "@/pages/Main-Page/api/payments";

type AddEditPaymentDialogDrawerProps = {
  children: React.ReactNode;
  payment?: PaymentType;
};

const AddEditPaymentDialogDrawer = ({
  children,
  payment,
}: AddEditPaymentDialogDrawerProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { t } = useTranslation();

  const paymentForm = useForm<PaymentFormSchemaType>({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      date: (payment && stringToDate(payment.date)) || new Date(),
      user: String(payment?.user?.id) || "",
      note: payment?.note || "",
      amount: String(payment?.amount) || "0",
      type: payment?.type || "full",
    },
  });

  const { mutateAsync } = usePaymentFormMutation();

  const onSubmit = async (data: PaymentFormSchemaType) => {
    try {
      toast(t("Saving payment"), {
        description: "",
      });
      await mutateAsync({
        data: data,
        paymentId: payment?.id,
      });
      paymentForm.reset();
      setDialogOpen(false);
    } catch (error: any) {
      toast(t("Error"), {
        description: t(error?.response?.data?.[0]) || t("Something went wrong"),
      });
    }
  };

  const isLoading = paymentForm.formState.isSubmitting;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {payment ? t("Edit payment") : t("Add a new payment")}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <PaymentForm
            paymentForm={paymentForm}
            isLoading={isLoading}
            onSubmit={onSubmit}
            payment={payment}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditPaymentDialogDrawer;
