import { Suspense } from "react";
import { Outlet, useMatches } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import OcrLoading from "./Loading";

interface RouteHandle {
  header?: boolean;
  footer?: boolean;
}

const Layout = () => {
  const routeMatch = useMatches().find((match) => match.handle);
  const layoutConfig: RouteHandle = routeMatch?.handle || {};
  const headerComponent = (layoutConfig.header ?? true) ? <Header /> : null;
  const footerComponent = (layoutConfig.footer ?? true) ? <Footer /> : null;

  return (
    <div className="flex flex-col w-full min-w-[320px] max-w-[600px] h-full min-h-screen mx-auto bg-normal-50 pc:border-x border-normal-100">
      {headerComponent}

      <main
        className={`flex flex-col flex-1 ${headerComponent ? "pt-14" : ""} ${footerComponent ? "pb-16" : ""}`}
      >
        <Suspense fallback={<OcrLoading />}>
          <Outlet />
        </Suspense>
      </main>

      {footerComponent}
    </div>
  );
};

export default Layout;
