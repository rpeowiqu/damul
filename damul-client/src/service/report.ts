import apiClient from "./http";

export const report = (reportCreate: {
  reportCategoryId: number;
  reportType: "RECIPE" | "COMMENT" | "POST";
  contentId: number;
  targetId: number;
  description: string;
}) => {
  return apiClient.post("/reports", reportCreate);
};

export const getReportCategories = () => {
  return apiClient.get("/reports/categories");
};
