import { ReactNode } from "react";
import { Outlet, useMatches } from "react-router-dom"; // useMatches 추가
import Header from "./Header";
import Footer from "./Footer";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/utils/queryClient";

interface RouteHandle {
  noHeaderNoFooter?: boolean;
  noHeader?: boolean;
  noFooter?: boolean;
}

interface LayoutProps {
  header?: ReactNode;
  footer?: ReactNode;
}

const Layout = ({ header = <Header />, footer = <Footer /> }: LayoutProps) => {
  const routeMatch = useMatches().find((match) => match.handle);

  const layoutConfig: RouteHandle = routeMatch?.handle || {};

  const finalHeader = layoutConfig.noHeaderNoFooter
    ? null
    : layoutConfig.noHeader
      ? null
      : header;
  const finalFooter = layoutConfig.noHeaderNoFooter
    ? null
    : layoutConfig.noFooter
      ? null
      : footer;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col w-full min-w-[320px] max-w-[600px] h-full min-h-screen mx-auto bg-white pc:border-x border-normal-100">
        {finalHeader}

        <main className="flex flex-col flex-1 pt-14 pb-16">
          <Outlet />
        </main>

        {finalFooter}
      </div>
    </QueryClientProvider>
  );
};

export default Layout;
