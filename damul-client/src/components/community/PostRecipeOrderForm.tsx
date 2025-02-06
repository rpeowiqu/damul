import { useState, ChangeEvent, Dispatch, SetStateAction } from "react";
import ImageUploadIcon from "../svg/ImageUploadIcon";

interface PostRecipeOrderFormProps {
  orderDescription: string;
  setOrderDescription: Dispatch<SetStateAction<string>>;
  setOrderImage: Dispatch<SetStateAction<File | null>>;
  preImage: string;
  setPreImage: Dispatch<SetStateAction<string>>;
}

const PostRecipeOrderForm = ({
  orderDescription,
  setOrderDescription,
  setOrderImage,
  setPreImage,
  preImage,
}: PostRecipeOrderFormProps) => {
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);
  const MAX_LENGTH = 500;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setOrderDescription(value);
      setIsLimitExceeded(false);
    } else {
      setIsLimitExceeded(true);
    }
  };

  // 이미지 변경 핸들러
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOrderImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setPreImage("");
    setOrderImage(null);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center p-3 border border-normal-200 rounded-lg w-full">
        {preImage ? (
          <label className="flex flex-col relative items-center justify-center w-full h-32 pc:h-36 gap-1 rounded-lg cursor-pointer">
            <img
              src={preImage}
              alt="미리보기"
              className="w-full h-32 pc:h-36 object-cover rounded-lg"
            />
            <button
              className="absolute top-2 right-2 bg-normal-800 text-white p-1 w-8 h-8 rounded-full"
              onClick={handleImageRemove}
            >
              X
            </button>
          </label>
        ) : (
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 pc:h-36 gap-1 border-2 border-dashed border-normal-400 rounded-lg cursor-pointer hover:bg-normal-50"
          >
            <ImageUploadIcon className="size-7 stroke-normal-500" />
            <span className="text-gray-500">이미지 업로드</span>
          </label>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="file-upload"
          onChange={handleImageChange}
        />
      </div>
      <textarea
        value={orderDescription}
        onChange={handleChange}
        className={`w-full mt-3 p-3 border-2 rounded-md outline-none resize-none ${
          isLimitExceeded ? "border-red-500" : "border-gray-300"
        }`}
        placeholder="제목을 입력해주세요"
        rows={4}
      />
      <div className="flex justify-between items-center mt-1 text-sm">
        {isLimitExceeded && (
          <p className="text-red-500">최대 50자까지 입력 가능합니다.</p>
        )}
        <p className={isLimitExceeded ? "text-red-500" : "text-gray-500"}>
          {orderDescription.length} / {MAX_LENGTH}
        </p>
      </div>
    </div>
  );
};

export default PostRecipeOrderForm;
