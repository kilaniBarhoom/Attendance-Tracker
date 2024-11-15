import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function ny(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitialsOfFullName(name: string | undefined) {
  let initials = " ";
  if (name) {
    const nameParts = name.split(" ");
    if (nameParts.length === 2) {
      initials = `${nameParts[0].charAt(0)} ${nameParts[1].charAt(0)}`;
    } else {
      initials = name.charAt(0);
    }
  }
  return initials;
}

export function getAccessTokenFromLS() {
  return localStorage.getItem("accessToken");
}

export const dateToString = (date: any) => {
  return format(Number(date), "y-LL-dd");
};

export const stringToDate = (string: any) => {
  return new Date(string);
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

interface removeUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: removeUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};
