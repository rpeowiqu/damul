import DamulButton from "@/components/common/DamulButton";
import Loading from "@/components/common/Loading";
import { postReceiptForQR } from "@/service/home";
import { ChangeEvent, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const QrCodePage = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [isSuccessed, setIsSuccessed] = useState(false);

  const { userId } = useParams();

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const fetchData = async (formData: FormData) => {
    const userIdNumber = userId ? Number(userId) : 0;
    setIsLoading(true);
    try {
      const response = await postReceiptForQR(userIdNumber, formData);

      if (response.data) {
        if (response.data.status === "success") {
          setIsSuccessed(true);
        }
      }
    } catch (error: any) {
      console.log("영수증 입력이 실패하였습니다.");
      alert("영수증 등록에 실패하였습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];

      if (file.size > MAX_FILE_SIZE) {
        alert("파일 크기는 10MB 이하로 업로드해 주세요.");
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        return;
      }

      const newFormData = new FormData();
      newFormData.append("image", file);
      fetchData(newFormData);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-96">
      {isSuccessed ? (
        <>
          <h1 className="text-xl font-bold mb-4">
            영수증 정보가 전송되었습니다.
          </h1>
        </>
      ) : (
        <>
          <h1 className="text-xl font-bold mb-4">
            영수증 사진을 등록해주세요.
          </h1>
          <DamulButton onClick={handleClick}>등록</DamulButton>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            multiple={false}
            ref={inputRef}
            onChange={handleChange}
          />
        </>
      )}
    </div>
  );
};

export default QrCodePage;
