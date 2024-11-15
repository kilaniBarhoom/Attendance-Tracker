// import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import { stringToDate } from "@/lib/utils";
import { PaymentFormSchemaType } from "@/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

type SearchPaymentsResponseType = {
  payments: PaymentType[];
  startDate: Date;
  endDate: Date;
  totalPages: number;
  pageNumber: number;
};

export const useSearchPaymentsQuery = () => {
  const axios = useAxios();

  // get employee id from query params
  const [searchParams] = useSearchParams();
  const PageSize = searchParams.get("PageSize") || "30";
  const PageNumber = searchParams.get("PageNumber") || "1";
  // const hasOverTime = searchParams.get("hasOverTime") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const search = searchParams.get("q") || "";

  return useQuery({
    queryKey: [
      "payments",
      {
        PageSize,
        PageNumber,
        from,
        to,
        search,
      },
    ],
    queryFn: async () => {
      const dataToSend: any = {
        pageSize: +PageSize,
        pageNumber: +PageNumber,
        from: from,
        to: to,
        search: search,
        // hasOverTime: hasOverTime === "true" && true,
      };
      if (from) {
        dataToSend["from"] = from;
      }
      if (to) {
        dataToSend["to"] = to;
      }
      if (search) {
        dataToSend["search"] = search;
      }
      const { data: response } = await axios.get(`payment`, {
        params: dataToSend,
      });
      const { data } = response;
      return data as SearchPaymentsResponseType;
    },
  });
};

export const usePaymentFormMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const axios = useAxios();

  return useMutation({
    mutationFn: ({
      data,
      paymentId,
    }: {
      data: PaymentFormSchemaType;
      paymentId?: string;
    }) => {
      if (!paymentId) {
        const dataToSend = {
          ...data,
          date: data.date ? stringToDate(data.date) : new Date(),
          amount: data.amount ? +data.amount : 0,
        };
        return axios.post(`payment`, dataToSend);
      } else {
        return axios.put(`payment/${paymentId}`, {
          ...data,
          date: data.date ? stringToDate(data.date) : new Date(),
          id: paymentId,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payments"],
      });
    },
    onError: (error: any) => {
      toast(t("Error"), {
        description:
          t(error.response.data?.message) || t("Something went wrong"),
      });
    },
  });
};

export const useDeletePaymentMutation = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  return useMutation({
    mutationFn: ({ paymentId }: { paymentId: string }) =>
      axios.delete(`payment/${paymentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payments"],
      });
    },
  });
};

// using the following route: /Report/GetTotalCostsByTypeAndDateRange
