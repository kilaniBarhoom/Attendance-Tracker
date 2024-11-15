import { Outlet } from "react-router-dom";
import SideNav from "./sidenav";
import Header from "./header";
import { Separator } from "../ui/separator";
// import { Button } from "../ui/button";
// import Header from "./header/header";
// import SideNav from "./side-nav/side-nav";

export default function MainLayout() {
  return (
    <div className="min-h-screen w-full flex gap-2 items-start bg-background lg:p-4">
      <div className="flex gap-4 items-start max-w-screen-xl w-full mx-auto bg-secondary/40 p-4 rounded-md">
        <aside className="bg-sidebar rounded-md w-[16rem] flex-shrink-0 lg:block hidden">
          <SideNav />
        </aside>
        <main className="flex-1 flex flex-col gap-2 min-w-0">
          <header className="flex bg-secondary/50 rounded-md p-2 justify-between items-center gap-4">
            <Header />
          </header>
          <Separator />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
