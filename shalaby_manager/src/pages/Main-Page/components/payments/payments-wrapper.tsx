import LocalSearchBar from "@/components/shared/loacal-search";
import PaymentsFilters from "./filters";
import TablePagiation from "@/components/shared/pagination";
import PaymentsList from "./list";
import { useSearchPaymentsQuery } from "../../api/payments";

export default function PaymentsWrapper() {
  const {
    data: searchPaymentsResponse,
    isLoading: isLoadingToFetchPaymentsData,
  } = useSearchPaymentsQuery();

  return (
    <div className="border flex flex-col gap-2 p-4 rounded-xl">
      <div className="flex items-center justify-between gap-2">
        <LocalSearchBar route="/payments" placeholder="Search for a payment" />
        <div className="flex gap-2 items-center">
          <PaymentsFilters />
        </div>
      </div>
      <PaymentsList
        payments={searchPaymentsResponse?.payments ?? []}
        isLoading={isLoadingToFetchPaymentsData}
      />
      <div className="flex items-center w-full border rounded-md py-2 bg-secondary/50">
        <TablePagiation totalPages={searchPaymentsResponse?.totalPages ?? 1} />
      </div>
    </div>
  );
}
