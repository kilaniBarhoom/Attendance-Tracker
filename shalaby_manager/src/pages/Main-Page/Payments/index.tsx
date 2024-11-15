import BreadcrumbComponent from "@/components/shared/bread-crumb";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import { Banknote } from "lucide-react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { dateToString } from "@/lib/utils";
import { useEffect } from "react";
import PaymentsWrapper from "../components/payments/payments-wrapper";
import AddEditPaymentDialogDrawer from "../components/payments/add-edit-dialog-drawer";

const Payments = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const from = searchParams.get("from") || dateToString(new Date());

  const setFromDate = (from: string) => {
    setSearchParams((prev) => {
      prev.delete("from");
      if (from) {
        prev.set("from", from);
      }
      return prev;
    });
  };

  useEffect(() => {
    if (
      !searchParams.get("from") ||
      searchParams.get("from") === "" ||
      searchParams.get("from") === "1970-01-01"
    ) {
      setFromDate(dateToString(new Date()));
    }
  }, [from]);

  return (
    <div className="flex flex-col gap-2">
      <Helmet>
        <title>Payments</title>
      </Helmet>
      <BreadcrumbComponent
        tree={[
          {
            title: "Payments",
          },
        ]}
        currentPage={"All"}
      />
      <div className="w-full flex items-center flex-wrap justify-between gap-2">
        <Typography
          className="flex items-center gap-2"
          element="h4"
          as="h4"
          color="secondary"
        >
          <Banknote size={35} fill="#99BFC5" stroke="#000" />
          {t("Payments")}
        </Typography>
        <div className="flex items-center lg:w-fit w-full">
          <AddEditPaymentDialogDrawer>
            <Button
              className="px-6 lg:py-4 py-6 lg:w-fit w-full border-2"
              Icon={Banknote}
            >
              {t("Add Payment")}
            </Button>
          </AddEditPaymentDialogDrawer>
        </div>
      </div>
      <PaymentsWrapper />
    </div>
  );
};

export default Payments;
