import Header from "@/components/admin/Header";
import { Outlet } from "react-router-dom";

const AdminPage = () => {
  return (
    <div className="flex flex-col w-full max-w-[80rem] h-full min-h-screen mx-auto">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPage;
