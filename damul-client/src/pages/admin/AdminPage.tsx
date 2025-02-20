import Header from "@/components/admin/Header";
import Loading from "@/components/common/Loading";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const AdminPage = () => {
  return (
    <div className="flex flex-col w-full max-w-[80rem] h-full min-h-screen mx-auto">
      <Header />

      <main className="flex-1">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default AdminPage;
