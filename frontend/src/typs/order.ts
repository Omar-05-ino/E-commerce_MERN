export interface OrderItem {
  _id: string;
  productTitle: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  _id: string;
  orderItems: OrderItem[];
  totalAmount: number;
  address: string;
  userId: string;
  __v: number;
}
