export interface IngredientTrendInfo {
  categoryId: number;
  ingredientName: "string";
  ingredientCode: number;
}

export interface DailyReceiptInfo {
  dayOfMonth: number;
  receiptIds: number[];
}

export interface PurchaseHistory {
  monthlyTotalAmount: number;
  comparedPreviousMonth: number;
  dailyReceiptInfoList: DailyReceiptInfo[];
}

export interface ReceiptDetail {
  productName: string;
  category_name: string;
  price: number;
}

export interface Receipt {
  storeName: string;
  receiptDetails: ReceiptDetail[];
  totalPrice: number;
}
