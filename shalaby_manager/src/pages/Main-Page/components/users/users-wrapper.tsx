import LocalSearchBar from "@/components/shared/loacal-search";
import UsersFilters from "./filters";
// import UsersStats from "./stats";
import UsersTable from "./table";
import { useSearchUsersQuery } from "../../api/Users";
import TablePagiation from "@/components/shared/pagination";

export default function UsersWrapper() {
  const { data: tableResponse, isLoading: isLoadingToFetchUsersData } =
    useSearchUsersQuery();

  return (
    <div className="border flex flex-col gap-2 p-4 rounded-xl">
      <div className="flex items-center justify-between gap-2 lg:flex-row flex-col w-full">
        <LocalSearchBar
          route="/users"
          placeholder="Search for a user"
          otherClasses="md:w-fit w-full"
        />
        <div className="flex gap-2 items-center">
          <UsersFilters usersResponse={tableResponse?.users ?? []} />
        </div>
      </div>
      <UsersTable
        userResponse={tableResponse?.users ?? []}
        isLoading={isLoadingToFetchUsersData}
      />
      <div className="flex items-center w-full border rounded-md py-2 bg-secondary/50">
        <TablePagiation totalPages={tableResponse?.totalPages ?? 1} />
      </div>
    </div>
  );
}
