import useAxios from "@/hooks/use-axios";
import { UsersEditFormSchemaType, UsersFormSchemaType } from "@/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export type UserRolesResponseType = {
  role: string;
  users: UserType[];
};

export type UsersResponseType = Omit<UserType, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
export const useSearchUsersQuery = () => {
  const axios = useAxios();

  const [searchParams] = useSearchParams();
  // const PageSize = searchParams.get("PageSize") || "30";
  const PageNumber = searchParams.get("PageNumber") || "1";
  const search = searchParams.get("q") || "";
  const grouped = searchParams.get("grouped") || "false";

  return useQuery({
    queryKey: [
      "user",
      {
        // PageSize,
        PageNumber,
        search,
        grouped,
      },
    ],
    queryFn: async () => {
      const dataToSend: any = {
        // pageSize: +PageSize,
        pageNumber: +PageNumber,
        search: search,
        grouped: grouped,
      };
      const { data: response } = await axios.get(`user/all`, {
        params: dataToSend,
      });
      const { data } = response;
      return {
        search: data.search,
        pageNumber: data.pageNumber,
        totalPages: data.totalPages,
        users: data.users,
      } as {
        search: string;
        pageNumber: number;
        totalPages: number;
        users: UserRolesResponseType[] | UsersResponseType[];
      };
    },
  });
};

export const useUsersFormMutation = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  return useMutation({
    mutationFn: ({ data }: { data: UsersFormSchemaType }) => {
      return axios.post(`user`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
};
export const useUsersEditFormMutation = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  return useMutation({
    mutationFn: ({
      data,
      userId,
    }: {
      data: UsersEditFormSchemaType;
      userId: string;
    }) => {
      if (!userId) toast("User ID is required");

      return axios.put(`user/${userId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
};

export const useToggleUserActivationMutation = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => {
      return axios.put(`user/toggle-activate/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
};

export const useUsersChangeRoleFormMutation = () => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  return useMutation({
    mutationFn: ({
      data,
      userId,
    }: {
      data: { role: string };
      userId?: string;
    }) => {
      if (!userId) {
        toast("User ID is required");
      }
      return axios.patch(`user/${userId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
};
