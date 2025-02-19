import { Suspense } from "react";
import { Outlet, useMatches } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

interface RouteHandle {
  header?: boolean;
  footer?: boolean;
}

const Layout = () => {
  const routeMatch = useMatches().find((match) => match.handle);
  const layoutConfig: RouteHandle = routeMatch?.handle || {};
  const HeaderComponent = (layoutConfig.header ?? true) ? <Header /> : null;
  const FooterComponent = (layoutConfig.footer ?? true) ? <Footer /> : null;

  return (
    <div className="flex flex-col w-full min-w-[320px] max-w-[600px] h-full min-h-screen mx-auto bg-white pc:border-x border-normal-100">
      {HeaderComponent}

      <main className="flex flex-col flex-1 pt-14 pb-16">
        <Suspense fallback={<div></div>}>
          <Outlet />
        </Suspense>
      </main>

      {FooterComponent}
    </div>
  );
};

export default Layout;
