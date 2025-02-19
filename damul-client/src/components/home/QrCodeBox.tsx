import useAuth from "@/hooks/useAuth";
import { QRCodeCanvas } from "qrcode.react";

const SERVICE_URL = import.meta.env.VITE_SERVICE_URL;

const QrCodeBox = () => {
  const { data } = useAuth();
  const id = data?.data?.id;

  if (!id) return <p>QR 코드를 생성할 수 없습니다.</p>;

  return (
    <div className="absolute bottom-0 hidden pc_admin:flex -right-40 w-36 flex-col gap-3 justify-center items-center border border-normal-300 p-5 rounded-lg bg-white">
      <div className="text-xs">QR코드로 손쉽게 식자재를 등록하세요.</div>
      <QRCodeCanvas value={`${SERVICE_URL}qrcode/${id}`} size={80} />
    </div>
  );
};

export default QrCodeBox;
