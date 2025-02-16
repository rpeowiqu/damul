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

export const getKSTISOString = () => {
  const date = new Date();
  date.setHours(date.getHours() + 9); // UTC → KST 변환

  // YYYY-MM-DDTHH:MM:SS 형식으로 변환
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0") +
    "T" +
    String(date.getHours()).padStart(2, "0") +
    ":" +
    String(date.getMinutes()).padStart(2, "0") +
    ":" +
    String(date.getSeconds()).padStart(2, "0")
  );
};
