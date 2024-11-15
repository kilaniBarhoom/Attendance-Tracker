import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React, { useState } from "react";
import SideNav from ".";
import { useTranslation } from "react-i18next";

const SideNavSheet = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const { i18n } = useTranslation();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side={i18n.dir() === "rtl" ? "right" : "left"}
        className="md:w-[60] w-full p-4 px-6 overflow-auto"
      >
        <SheetHeader>
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <SideNav setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
};

export default SideNavSheet;
