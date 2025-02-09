import {
  ChangeEvent,
  Dispatch,
  ReactNode,
  SetStateAction,
  useRef,
  useState,
} from "react";

interface ImageUploaderProps {
  defaultImage?: string;
  initImage?: string;
  className?: string;
  setFile?: Dispatch<SetStateAction<File | null>>;
  children: (props: { onEdit: () => void; onReset: () => void }) => ReactNode;
}

const ImageUploader = ({
  defaultImage = "",
  initImage,
  className,
  setFile,
  children,
}: ImageUploaderProps) => {
  const [previewURL, setPreviewURL] = useState<string>(
    initImage || defaultImage,
  );
  const fileInput = useRef<HTMLInputElement>(null);

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const objectURL = URL.createObjectURL(file);
      setPreviewURL(objectURL);

      if (setFile) {
        setFile(file);
      }
    }
  };

  const onReset = () => {
    setPreviewURL(defaultImage || "");
  };

  const onEdit = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  return (
    <div className={`${className}`}>
      <img
        src={previewURL}
        alt="미리보기"
        className="w-full h-full object-cover"
      />
      <input
        type="file"
        accept="image/*"
        onChange={onChangeFile}
        className="hidden"
        ref={fileInput}
      />
      {children({ onReset: onReset, onEdit: onEdit })}
    </div>
  );
};

export default ImageUploader;
