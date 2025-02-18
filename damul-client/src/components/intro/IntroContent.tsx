import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import introMain_1 from "@/assets/intro_main_1.png";
import introMain_2 from "@/assets/intro_main_2.png";
import introCommunity_1 from "@/assets/intro_community_1.png";
import introCommunity_2 from "@/assets/intro_community_2.png";
import introProfile_1 from "@/assets/intro_profile_1.png";
import introProfile_2 from "@/assets/intro_profile_2.png";
import introStatistics_1 from "@/assets/intro_statistics_1.png";
import introStatistics_2 from "@/assets/intro_statistics_2.png";
import DamulButton from "../common/DamulButton";

const IntroContent = () => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleSections, setVisibleSections] = useState<boolean[]>(
    new Array(5).fill(false),
  );
  const nav = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex(
              (el) => el === entry.target,
            );

            if (index !== -1) {
              setVisibleSections((prev) => {
                const updated = [...prev];
                updated[index] = true;
                return updated;
              });

              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.9 },
    );

    console.log(sectionRefs.current);
    sectionRefs.current.forEach((el) => {
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col justify-center gap-20 bg-white">
      <motion.div
        ref={(el) => el && (sectionRefs.current[0] = el)}
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={
          visibleSections[0]
            ? {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 1.0,
                },
              }
            : {}
        }
        className="relative h-96"
      >
        <motion.img
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={
            visibleSections[0]
              ? {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.5,
                  },
                }
              : {}
          }
          className="absolute top-6 left-10 w-36"
          src={introMain_1}
        />

        <motion.img
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={
            visibleSections[0]
              ? {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.8,
                  },
                }
              : {}
          }
          className="absolute top-14 left-28 w-36"
          src={introMain_2}
        />

        <motion.h1
          initial={{
            opacity: 0,
            x: 100,
          }}
          animate={
            visibleSections[0]
              ? {
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.5,
                    delay: 1.0,
                  },
                }
              : {}
          }
          className="absolute top-20 right-10 text-xl text-positive-400 font-bold"
        >
          효율적인 식자재 관리
          <div className="flex flex-col mt-5 text-sm text-normal-400 font-normal">
            <p>
              # OCR 기술을 통해
              <br />
              식자재를 간편하게 등록할 수 있어요.
            </p>
            <p># 보유한 식자재를 기반으로 레시피를 추천해줘요.</p>
          </div>
        </motion.h1>
      </motion.div>

      <motion.div
        ref={(el) => el && (sectionRefs.current[1] = el)}
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={
          visibleSections[1]
            ? {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 1.0,
                },
              }
            : {}
        }
        className="relative h-96"
      >
        <motion.img
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={
            visibleSections[1]
              ? {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.8,
                  },
                }
              : {}
          }
          className="absolute top-6 right-10 w-36"
          src={introCommunity_1}
        />

        <motion.img
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={
            visibleSections[1]
              ? {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.5,
                  },
                }
              : {}
          }
          className="absolute top-14 right-28 w-36"
          src={introCommunity_2}
        />

        <motion.h1
          initial={{
            opacity: 0,
            x: -100,
          }}
          animate={
            visibleSections[1]
              ? {
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.5,
                    delay: 1.0,
                  },
                }
              : {}
          }
          className="absolute top-20 left-10 text-xl text-positive-400 font-bold"
        >
          자유로운 소통 공간
          <div className="flex flex-col mt-5 text-sm text-normal-400 font-normal">
            <p>
              # 나만의 레시피 공유하거나
              <br />
              식자재 공구/나눔 게시판에서 식자재를 나누어요.
            </p>
            <p># 채팅, 팔로잉 등의 SNS 서비스를 제공해요.</p>
          </div>
        </motion.h1>
      </motion.div>

      <motion.div
        ref={(el) => el && (sectionRefs.current[2] = el)}
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={
          visibleSections[2]
            ? {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 1.0,
                },
              }
            : {}
        }
        className="relative h-96"
      >
        <motion.img
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={
            visibleSections[2]
              ? {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.5,
                  },
                }
              : {}
          }
          className="absolute top-6 left-10 w-36"
          src={introProfile_1}
        />

        <motion.img
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={
            visibleSections[2]
              ? {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.8,
                  },
                }
              : {}
          }
          className="absolute top-14 left-28 w-36"
          src={introProfile_2}
        />

        <motion.h1
          initial={{
            opacity: 0,
            x: 100,
          }}
          animate={
            visibleSections[2]
              ? {
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.5,
                    delay: 1.0,
                  },
                }
              : {}
          }
          className="absolute top-20 right-10 text-xl text-positive-400 font-bold"
        >
          친구의 냉장고 살펴보기
          <div className="flex flex-col mt-5 text-sm text-normal-400 font-normal">
            <p># 프로필에서 선호 식자재를 확인할 수 있어요.</p>
            <p># 숨겨진 미션을 수행하고 뱃지를 획득해 보세요.</p>
            <p># 다른 유저의 냉장고 현황을 살펴볼 수 있어요.</p>
          </div>
        </motion.h1>
      </motion.div>

      <motion.div
        ref={(el) => el && (sectionRefs.current[3] = el)}
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={
          visibleSections[3]
            ? {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 1.0,
                },
              }
            : {}
        }
        className="relative h-96"
      >
        <motion.img
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={
            visibleSections[3]
              ? {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.8,
                  },
                }
              : {}
          }
          className="absolute top-6 right-10 w-36"
          src={introStatistics_1}
        />

        <motion.img
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={
            visibleSections[3]
              ? {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.5,
                  },
                }
              : {}
          }
          className="absolute top-14 right-28 w-36"
          src={introStatistics_2}
        />

        <motion.h1
          initial={{
            opacity: 0,
            x: -100,
          }}
          animate={
            visibleSections[3]
              ? {
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.5,
                    delay: 1.0,
                  },
                }
              : {}
          }
          className="absolute top-20 left-10 text-xl text-positive-400 font-bold"
        >
          식자재 가격 동향 & 스마트 영수증
          <div className="flex flex-col mt-5 text-sm text-normal-400 font-normal">
            <p>
              # 다양한 식자재의 최근 가격을 그래프로
              <br />
              확인할 수 있어요.
            </p>
            <p>
              # 등록한 식자재의 영수증과 지출 내역을
              <br />
              확인할 수 있어요.
            </p>
          </div>
        </motion.h1>
      </motion.div>

      <motion.div
        ref={(el) => el && (sectionRefs.current[4] = el)}
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={
          visibleSections[4]
            ? {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  delay: 1.5,
                },
              }
            : {}
        }
        className="px-10"
      >
        <DamulButton
          variant="positive"
          className="w-full"
          onClick={() => nav("/login")}
        >
          시작하기
        </DamulButton>
      </motion.div>
    </div>
  );
};

export default IntroContent;
