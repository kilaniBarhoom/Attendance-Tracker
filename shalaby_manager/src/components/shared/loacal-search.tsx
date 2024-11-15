"use client";

import { Input } from "@/components/ui/input";
import { ny, formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { Search } from "lucide-react";
// import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

interface CustomInputProps {
  route: string;
  placeholder: string;
  otherClasses?: string;
  Icon?: any;
  searchQuery?: string;
}

const LocalSearchBar = ({
  route,
  placeholder,
  otherClasses,
  Icon,
  searchQuery = "q",
}: CustomInputProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const query = searchParams.get(searchQuery);

  const [search, setSearch] = useState(query || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: searchQuery,
          value: search,
        });
        navigate(newUrl, { replace: true });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keysToRemove: [searchQuery],
          });
          navigate(newUrl, { replace: true });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, search, route, pathname, searchParams]);

  return (
    <Input
      type="text"
      placeholder={t(placeholder)}
      value={search}
      icon={
        Icon ? (
          <Icon size={18} />
        ) : (
          <Search className="-translate-y-[0.20rem]" size={18} />
        )
      }
      onChange={(e) => setSearch(e.target.value)}
      className={ny(
        "w-72 font-semibold bg-muted h-9 border-secondary-foreground/20",
        otherClasses
      )}
    />
  );
};
export default LocalSearchBar;
