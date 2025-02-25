import useAuth from "@/hooks/useAuth";
import { QRCodeCanvas } from "qrcode.react";

const SERVICE_URL = import.meta.env.VITE_SERVICE_URL;

const QrCodeBox = () => {
  const { data } = useAuth();
  const id = data?.data?.id;

  if (!id) {
    return <p>QR 코드를 생성할 수 없습니다.</p>;
  }

  return (
    <div className="absolute bottom-0 hidden pc:flex -right-40 w-36 flex-col gap-3 justify-center items-center py-5 px-3 rounded-lg bg-white border border-normal-100 shadow-md">
      <div className="text-xs font-bold">
        QR 코드로 편리하게
        <br />
        식자재를 등록 해보세요!
      </div>
      <QRCodeCanvas value={`${SERVICE_URL}qrcode/${id}`} size={80} />
    </div>
  );
};

export default QrCodeBox;
