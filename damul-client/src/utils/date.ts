export const formatDate = (date: string) => {
  return date.split("T")[0] + " " + date.split("T")[1].slice(0, 5);
};

export const getTimeAgo = (timeStamp: string) => {
  const now = new Date();
  const past = new Date(timeStamp);
  const timeDiffSec = Math.floor((now.getTime() - past.getTime()) / 1000);
  const timeDiffDay = Math.floor(timeDiffSec / 86400);

  if (timeDiffSec < 60) {
    return "방금 전";
  }
  if (timeDiffSec < 3600) {
    return `${Math.floor(timeDiffSec / 60)}분 전`;
  }
  if (timeDiffSec < 86400) {
    return `${Math.floor(timeDiffSec / 3600)}시간 전`;
  }
  if (timeDiffDay < 7) {
    return `${timeDiffDay}일 전`;
  }

  return past.toISOString().split("T")[0];
};
