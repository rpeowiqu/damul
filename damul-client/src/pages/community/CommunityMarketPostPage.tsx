import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DamulDrawer from "@/components/common/DamulDrawer";
import PostCard from "@/components/community/PostCard";
import SubmitButton from "@/components/community/SubmitButton";
import PostTitle from "@/components/community/PostTitle";
import PostImage from "@/components/community/PostImage";
import PostContent from "@/components/community/PostContent";
import PostMarketMemberCnt from "@/components/community/PostMarketMemberCnt";
import DamulButton from "@/components/common/DamulButton";
import useCloseOnBack from "@/hooks/useCloseOnBack";
import { postPost, putPost, getPostDetail } from "@/service/market";
import useOverlayStore from "@/stores/overlayStore";
import DamulSection from "@/components/common/DamulSection";

const CommunityMarketPostPage = () => {
  const navigate = useNavigate();
  const { postId } = useParams();

  const [title, setTitle] = useState<string>("");
  const [tempTitle, setTempTitle] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [tempImage, setTempImage] = useState<File | null>(null);
  const [preImage, setPreImage] = useState("");
  const [content, setContent] = useState<string>("");
  const [tempContent, setTempContent] = useState<string>("");
  const [chatSize, setChatSize] = useState<number>(0);
  const [tempChatSize, setTempChatSize] = useState<number>(0);
  const [currentDrawerIndex, setCurrentDrawerIndex] = useState<number>(-1);
  const { overlaySet, openOverlay } = useOverlayStore();
  const isOpenOverlay = overlaySet.has("CommunityMarketPostPage");

  useCloseOnBack("CommunityMarketPostPage", () => setCurrentDrawerIndex(-1));

  useEffect(() => {
    if (currentDrawerIndex > -1) {
      openOverlay("CommunityMarketPostPage");
    }
  }, [currentDrawerIndex]);

  const submitPost = async () => {
    const formData = new FormData();

    const postData = {
      title,
      content,
      chatSize,
    };

    const jsonString = JSON.stringify(postData);
    const postBlob = new Blob([jsonString], { type: "application/json" });
    formData.append("postRequest", postBlob);

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await (location.pathname.endsWith("edit")
        ? putPost({ formData, postId })
        : postPost(formData));
      // console.log(response?.data);
      alert("게시글이 등록되었습니다");
      navigate("/community/market");
    } catch (error) {
      // console.error(error);
    }
  };

  const fetchPostDetail = async () => {
    try {
      const response = await getPostDetail(postId);
      setTitle(response.data.title);
      setTempTitle(response.data.title);
      setImage(response.data.contentImageUrl);
      setTempImage(response.data.contentImageUrl);
      setPreImage(response.data.contentImageUrl);
      setContent(response.data.content);
      setTempContent(response.data.content);
      setChatSize(response.data.chatSize);
      setTempChatSize(response.data.chatSize);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    if (location.pathname.endsWith("edit")) {
      fetchPostDetail();
    }
  }, []);

  return (
    <DamulSection
      title={
        <div className="flex items-center gap-3">
          <button className="font-black" onClick={() => history.back()}>
            &lt;
          </button>
          <h1>공구/나눔 게시글 작성</h1>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <DamulDrawer
          isOpen={currentDrawerIndex === 0}
          onOpenChange={() => {
            if (isOpenOverlay) {
              history.back();
            }
          }}
          triggerContent={
            <PostCard
              title="제목"
              description="제목을 입력해 주세요."
              isEmpty={!title}
            />
          }
          headerContent={
            <PostTitle setTempTitle={setTempTitle} tempTitle={tempTitle} />
          }
          footerContent={
            <SubmitButton
              disabled={tempTitle.length <= 0 || tempTitle.length > 50}
            />
          }
          onFooterClick={() => {
            setTitle(tempTitle);
          }}
          onTriggerClick={() => setCurrentDrawerIndex(0)}
        />
        <DamulDrawer
          isOpen={isOpenOverlay && currentDrawerIndex === 1}
          onOpenChange={() => {
            if (isOpenOverlay) {
              history.back();
            }
          }}
          triggerContent={
            <PostCard
              title="사진"
              description="사진을 업로드해 주세요."
              isEmpty={!image}
            />
          }
          headerContent={
            <PostImage
              setTempImage={setTempImage}
              preImage={preImage}
              setPreImage={setPreImage}
            />
          }
          footerContent={<SubmitButton disabled={!tempImage} />}
          onFooterClick={() => {
            setImage(tempImage);
          }}
          onTriggerClick={() => setCurrentDrawerIndex(1)}
        />
        <DamulDrawer
          isOpen={isOpenOverlay && currentDrawerIndex === 2}
          onOpenChange={() => {
            if (isOpenOverlay) {
              history.back();
            }
          }}
          triggerContent={
            <PostCard
              title="내용"
              description="내용을 입력해 주세요."
              isEmpty={!content}
            />
          }
          headerContent={
            <PostContent
              setTempContent={setTempContent}
              tempContent={tempContent}
            />
          }
          footerContent={<SubmitButton disabled={!tempContent} />}
          onFooterClick={() => {
            setContent(tempContent);
          }}
          onTriggerClick={() => setCurrentDrawerIndex(2)}
        />
        <DamulDrawer
          isOpen={isOpenOverlay && currentDrawerIndex === 3}
          onOpenChange={() => {
            if (isOpenOverlay) {
              history.back();
            }
          }}
          triggerContent={
            <PostCard
              title="인원수"
              description="참여 인원수를 입력해 주세요."
              isEmpty={chatSize === 0}
            />
          }
          headerContent={
            <PostMarketMemberCnt
              setTempChatSize={setTempChatSize}
              tempChatSize={tempChatSize}
            />
          }
          footerContent={<SubmitButton disabled={tempChatSize == 0} />}
          onFooterClick={() => {
            setChatSize(tempChatSize);
          }}
          onTriggerClick={() => setCurrentDrawerIndex(3)}
        />
      </div>
      {title && image && content && chatSize > 0 && (
        <DamulButton
          variant="positive"
          className="w-full"
          onClick={() => {
            submitPost();
          }}
        >
          공구/나눔 게시글 작성하기
        </DamulButton>
      )}
    </DamulSection>
  );
};

export default CommunityMarketPostPage;
