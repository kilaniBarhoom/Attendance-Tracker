import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
// import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Typography from "../ui/typography";
import { ny } from "@/lib/utils";

const TablePagiation = ({ totalPages }: { totalPages: number }) => {
  const { t, i18n } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams({
    PageSize: "",
    PageNumber: "",
  });
  useEffect(() => {
    if (!searchParams.get("PageNumber")) {
      setSearchParams(
        (prev) => {
          prev.set("PageNumber", "1");
          prev.set("PageSize", "20");
          return prev;
        },
        { replace: true }
      );
    }
  }, [searchParams]);

  const PageNumber = searchParams.get("PageNumber") || "1";
  const setPageNumber = (value: string) => {
    setSearchParams(
      (prev) => {
        prev.delete("PageNumber");
        if (value) prev.set("PageNumber", value);
        return prev;
      },
      { replace: true }
    );
  };
  return (
    <Pagination className="w-fit">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            dir={i18n.dir()}
            lang={i18n.language}
            size={"sm"}
            onClick={() => {
              if (parseInt(PageNumber) > 1) {
                setPageNumber((parseInt(PageNumber) - 1).toString());
              }
            }}
            className={ny("bg-primary border px-2 cursor-pointer", {
              "pointer-events-none cursor-not-allowed opacity-50":
                parseInt(PageNumber) === 1,
            })}
          />
        </PaginationItem>
        <Typography element="span" as={"h6"}>
          {t("Page")} {PageNumber} {t("of")} {totalPages}
        </Typography>
        <PaginationItem>
          <PaginationNext
            dir={i18n.dir()}
            lang={i18n.language}
            size={"sm"}
            onClick={() => {
              if (parseInt(PageNumber) < totalPages) {
                setPageNumber((parseInt(PageNumber) + 1).toString());
              }
            }}
            className={ny("bg-primary border px-2 cursor-pointer", {
              "pointer-events-none cursor-not-allowed opacity-50":
                parseInt(PageNumber) === totalPages,
            })}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagiation;
