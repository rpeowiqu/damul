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
    <div className="flex justify-center w-screen h-screen">
      <div className="flex flex-col relative w-full min-w-[320px] max-w-[600px] h-full bg-white pc:border-x-[1px] border-gray-300">
        {header}
        <Outlet />
        {footer}
      </div>
    </div>
  );
};

export default Layout;
