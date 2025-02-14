export const formatDate = (date: string) => {
  return date.split("T")[0] + " " + date.split("T")[1].slice(0, 5);
};
