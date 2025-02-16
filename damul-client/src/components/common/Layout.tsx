import { Outlet, useMatches } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/utils/queryClient";
import Header from "./Header";
import Footer from "./Footer";
// import { useStompSubscription } from "@/hooks/useStompSubscription";

interface RouteHandle {
  header?: boolean;
  footer?: boolean;
}

const Layout = () => {
  // useStompSubscription(); // ✅ WebSocket 연결 & 알림 구독

  const routeMatch = useMatches().find((match) => match.handle);
  const layoutConfig: RouteHandle = routeMatch?.handle || {};
  const HeaderComponent = (layoutConfig.header ?? true) ? <Header /> : null;
  const FooterComponent = (layoutConfig.footer ?? true) ? <Footer /> : null;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col w-full min-w-[320px] max-w-[600px] h-full min-h-screen mx-auto bg-white pc:border-x border-normal-100">
        {HeaderComponent}
        <main className="flex flex-col flex-1 pt-14 pb-16">
          <Outlet />
        </main>
        {FooterComponent}
      </div>
    </QueryClientProvider>
  );
};

export default Layout;
