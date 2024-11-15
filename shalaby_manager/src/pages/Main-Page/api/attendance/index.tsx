// import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import { dateToString, stringToDate } from "@/lib/utils";
import { AttendanceFormSchemaType } from "@/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export type AnalyticsOfUsersAttendancesType = {
  totalAdvancePayments: string;
  totalAttendance: number;
  user: UserType;
};
export type AnalyticsOfUsersAttendancesAndLeaveTimesByIntervalType = {
  avgAttendanceTime: string;
  avgLeaveTime: string;
  month?: number;
  year?: number;
};

type SearchAttendanceResponseType = {
  attendances: AttendanceType[];
  averageAttendanceTime: string;
  averageLeaveTime: string;
  startDate: Date;
  endDate: Date;
  analyticsOfUsersAttendances: AnalyticsOfUsersAttendancesType[];
  totalPages: number;
  pageNumber: number;
};

type GetAnalyticsOfAttendanceAndLeaveResponseType = {
  analyticsOfUsersAttendancesAndLeaveTimes: AnalyticsOfUsersAttendancesAndLeaveTimesByIntervalType[];
};
export const useSearchAttendanceQuery = () => {
  const axios = useAxios();

  // get employee id from query params
  const [searchParams, setSearchParams] = useSearchParams();
  const PageSize = searchParams.get("PageSize") || "30";
  const PageNumber = searchParams.get("PageNumber") || "1";
  // const hasOverTime = searchParams.get("hasOverTime") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const search = searchParams.get("q") || "";

  const setFromDate = (from: Date) => {
    setSearchParams((prev) => {
      prev.delete("from");
      if (from) {
        prev.set("from", dateToString(from));
      }
      return prev;
    });
  };

  return useQuery({
    queryKey: [
      "attendance",
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
      const { data: response } = await axios.get(`attendance`, {
        params: dataToSend,
      });
      const { data } = response;
      setFromDate(new Date(data.startDate));
      return data as SearchAttendanceResponseType;
    },
  });
};
export const useGetAnalyticsOfAttendanceAndLeaveQuery = () => {
  const axios = useAxios();

  // get employee id from query params
  const [searchParams] = useSearchParams();
  const analyticsInterval = searchParams.get("analyticsInterval") || "monthly";

  return useQuery({
    queryKey: [
      "analytics",
      {
        analyticsInterval,
      },
    ],
    queryFn: async () => {
      const { data: response } = await axios.get(`attendance/analytics`, {
        params: {
          analyticsInterval,
        },
      });
      const { data } = response;
      return data as GetAnalyticsOfAttendanceAndLeaveResponseType;
    },
  });
};

export const useAttendanceFormMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const axios = useAxios();

  return useMutation({
    mutationFn: ({
      data,
      attendanceId,
    }: {
      data: AttendanceFormSchemaType;
      attendanceId?: string;
    }) => {
      if (!attendanceId) {
        const dataToSend = {
          ...data,
          date: data.date ? stringToDate(data.date) : new Date(),
          advancePayment: data.advancePayment ? +data.advancePayment : 0,
        };
        if (
          dataToSend.attendanceTime === "00:00" &&
          dataToSend.status === "present"
        ) {
          dataToSend.attendanceTime = String(format(new Date(), "HH:mm"));
        }
        return axios.post(`attendance`, dataToSend);
      } else {
        return axios.put(`attendance/${attendanceId}`, {
          ...data,
          date: data.date ? stringToDate(data.date) : new Date(),
          attendanceTime: data.attendanceTime
            ? dateToString(data.attendanceTime)
            : undefined,
          leaveTime: data.leaveTime ? dateToString(data.leaveTime) : undefined,
          advancePayment: data.advancePayment ? +data.advancePayment : 0,
          id: attendanceId,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance"],
      });
      queryClient.invalidateQueries({
        queryKey: ["analytics"],
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

// export const useDeleteCostMutation = () => {
//   const queryClient = useQueryClient();
//   const { t } = useTranslation();

//   return useMutation({
//     mutationFn: ({ attendanceId }: { attendanceId: string }) =>
//       axios.delete(`api${CostsEndpoint}/${attendanceId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["attendance"],
//       });
//       queryClient.invalidateQueries({
//         queryKey: ["cost"],
//       });
//       queryClient.invalidateQueries({
//         queryKey: ["totalCostsByTypeAndDateRange"],
//       });
//       toast({
//         title: t("Success"),
//         description: t("Cost was deleted successfully"),
//       });
//     },
//     onError: (error: any) => {
//       toast({
//         variant: "destructive",
//         title: t("Error"),
//         description: error?.response?.data?.[0]
//           ? t(error?.response?.data?.[0])
//           : t("Something went wrong"),
//       });
//     },
//   });
// };

// using the following route: /Report/GetTotalCostsByTypeAndDateRange
