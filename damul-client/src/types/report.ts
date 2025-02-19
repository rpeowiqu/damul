export interface ReportForm {
  reportCategoryId: number;
  reportType: "RECIPE" | "COMMENT" | "POST";
  contentType: string;
  targetId: number;
  description: string;
}
