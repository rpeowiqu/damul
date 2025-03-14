import { Dispatch, SetStateAction, ChangeEvent } from "react";
import ImageUploadIcon from "../svg/ImageUploadIcon";

interface PostImageProps {
  setTempImage: Dispatch<SetStateAction<File | null>>;
  preImage: string;
  setPreImage: Dispatch<SetStateAction<string>>;
}

const PostImage = ({ setTempImage, preImage, setPreImage }: PostImageProps) => {
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("이미지 용량은 5MB 이하만 업로드 가능합니다.");
        return;
      }

      setTempImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setPreImage("");
    setTempImage(null);
  };

  return (
    <div className="flex flex-col items-center p-4 border border-normal-200 rounded-lg w-full">
      {preImage ? (
        <div className="relative w-full">
          <img
            src={preImage}
            alt="사진"
            className="w-full h-48 pc:h-64 object-cover rounded-lg shadow-md"
          />
          <button
            className="absolute top-2 right-2 bg-normal-800 text-white p-1 w-8 h-8 rounded-full"
            onClick={handleImageRemove}
          >
            X
          </button>
        </div>
      ) : (
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-48 pc:h-64 gap-1 border-2 border-dashed border-normal-400 rounded-lg cursor-pointer hover:bg-normal-50"
        >
          <ImageUploadIcon className="size-10 stroke-normal-500" />
          <span className="text-normal-500 text-md">이미지 업로드</span>
        </label>
      )}
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default PostImage;
