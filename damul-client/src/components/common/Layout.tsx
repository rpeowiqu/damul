import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/utils/queryClient";

interface LayoutProps {
  header?: ReactNode;
  footer?: ReactNode;
}

const Layout = ({ header = <Header />, footer = <Footer /> }: LayoutProps) => {
  return (
    <div className="flex flex-col w-full min-w-[320px] max-w-[600px] h-full min-h-screen mx-auto bg-white pc:border-x border-normal-100">
      {header}

      <main className="flex flex-col flex-1 pt-14 pb-16">
        <Outlet />
      </main>

      {footer}
    </div>
  );
};

export default Layout;
