export interface KamisIngredient {
  categoryId: number;
  itemName: string;
  itemCode: number;
  kindCode: number;
  unit: string;
  ecoFlag: boolean;
}

export interface KamisChartData {
  period: string;
  price: number;
}

export interface KamisChartConfig {
  price: {
    label: string;
    color: string;
  };
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
