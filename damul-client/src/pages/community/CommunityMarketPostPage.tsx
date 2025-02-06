import { useEffect, useState } from "react";
import DamulDrawer from "@/components/common/DamulDrawer";
import PostCard from "@/components/community/PostCard";
import SubmitButton from "@/components/community/SubmitButton";
import PostTitle from "@/components/community/PostTitle";
import PostImage from "@/components/community/PostImage";
import PostContent from "@/components/community/PostContent";
import PostMarketMemberCnt from "@/components/community/PostMarketMemberCnt";
import DamulButton from "@/components/common/DamulButton";
import useCloseOnBack from "@/hooks/useCloseOnBack";

const CommunityMarketPostPage = () => {
  const [title, setTitle] = useState<string>("");
  const [tempTitle, setTempTitle] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [tempImage, setTempImage] = useState<File | null>(null);
  const [content, setContent] = useState<string>("");
  const [tempContent, setTempContent] = useState<string>("");
  const [memberCnt, setMemberCnt] = useState<number>(0);
  const [tempMemberCnt, setTempMemberCnt] = useState<number>(0);
  const [currentDrawerIndex, setCurrentDrawerIndex] = useState<number>(-1);
  const [isOpen, setIsOpen] = useCloseOnBack(() => setCurrentDrawerIndex(-1));

  useEffect(() => {
    if (currentDrawerIndex > -1) {
      setIsOpen(true);
    }
  }, [currentDrawerIndex]);

  return (
    <main className="flex flex-col px-7 py-4 pc:p-6 gap-5">
      <div
        className="p-4 space-x-5 font-semibold cursor-pointer"
        onClick={() => window.history.back()}
      >
        <span>{"<"}</span>
        <span className="space-y-4">공구/나눔 게시글 작성</span>
      </div>
      <div className="flex flex-col gap-5">
        <DamulDrawer
          isOpen={currentDrawerIndex === 0}
          onOpenChange={() => {
            if (isOpen) {
              history.back();
            }
          }}
          triggerContent={
            <PostCard
              title="제목"
              description="제목을 입력해주세요"
              isEmpty={!title}
            />
          }
          headerContent={
            <PostTitle setTempTitle={setTempTitle} tempTitle={tempTitle} />
          }
          footerContent={<SubmitButton />}
          onFooterClick={() => {
            setTitle(tempTitle);
          }}
          onTriggerClick={() => setCurrentDrawerIndex(0)}
        />
        <DamulDrawer
          isOpen={currentDrawerIndex === 1}
          onOpenChange={() => {
            if (isOpen) {
              history.back();
            }
          }}
          triggerContent={
            <PostCard
              title="사진"
              description="사진을 업로드해주세요"
              isEmpty={!image}
            />
          }
          headerContent={<PostImage setTempImage={setTempImage} />}
          footerContent={<SubmitButton />}
          onFooterClick={() => {
            setImage(tempImage);
          }}
          onTriggerClick={() => setCurrentDrawerIndex(1)}
        />
        <DamulDrawer
          isOpen={currentDrawerIndex === 2}
          onOpenChange={() => {
            if (isOpen) {
              history.back();
            }
          }}
          triggerContent={
            <PostCard
              title="내용"
              description="내용을 입력해주세요"
              isEmpty={!content}
            />
          }
          headerContent={
            <PostContent
              setTempContent={setTempContent}
              tempContent={tempContent}
            />
          }
          footerContent={<SubmitButton />}
          onFooterClick={() => {
            setContent(tempContent);
          }}
          onTriggerClick={() => setCurrentDrawerIndex(2)}
        />
        <DamulDrawer
          isOpen={currentDrawerIndex === 3}
          onOpenChange={() => {
            if (isOpen) {
              history.back();
            }
          }}
          triggerContent={
            <PostCard
              title="인원수"
              description="참여 인원수를 입력해주세요"
              isEmpty={memberCnt === 0}
            />
          }
          headerContent={
            <PostMarketMemberCnt
              setTempMemberCnt={setTempMemberCnt}
              tempMemberCnt={tempMemberCnt}
            />
          }
          footerContent={<SubmitButton />}
          onFooterClick={() => {
            setMemberCnt(tempMemberCnt);
          }}
          onTriggerClick={() => setCurrentDrawerIndex(3)}
        />
      </div>
      {title && image && content && memberCnt > 0 && (
        <div className="absolute bottom-16 left-0 w-full p-6">
          <DamulButton
            variant="positive-outline"
            size="full"
            textSize="lg"
            onClick={() => {}}
          >
            공구/나눔 게시글 작성하기
          </DamulButton>
        </div>
      )}
    </main>
  );
};

export default CommunityMarketPostPage;
