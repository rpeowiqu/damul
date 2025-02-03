import DamulButton from "@/components/common/DamulButton";
import { Input } from "@/components/ui/input";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
  const [password, setPassword] = useState<string>("");
  const nav = useNavigate();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password === "50days") {
      nav("/admin/report");
    }
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="flex flex-col gap-3 items-center min-h-screen pt-20">
      <Link to={"/"}>
        <img className="w-16" src="/logo.svg" alt="" />
      </Link>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 w-96 p-3 border border-normal-200 rounded-lg"
      >
        <h1 className="text-xl font-bold text-center">관리자 로그인</h1>
        <Input
          value={password}
          onChange={onChangePassword}
          placeholder="관리자 비밀번호를 입력해 주세요."
          className="focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-positive-400"
          type="password"
          required
        />
        <DamulButton variant="positive" size="full" onClick={() => {}}>
          로그인
        </DamulButton>
      </form>
    </div>
  );
};

export default AdminLoginPage;
