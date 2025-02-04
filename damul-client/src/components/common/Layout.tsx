import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  header?: ReactNode;
  footer?: ReactNode;
}

const Layout = ({ header = <Header />, footer = <Footer /> }: LayoutProps) => {
  return (
    <div className="flex justify-center w-full h-full min-h-screen">
      <div className="flex flex-col relative w-full min-w-[320px] max-w-[600px] h-full min-h-screen bg-white pc:border-x border-normal-100">
        {header}

        <main className="flex-1 pt-14 pb-16">
          <Outlet />
        </main>

        {footer}
      </div>
    </div>
  );
};

export default Layout;
