export interface ICreateProduct {
  name: string;
  price: number;
  stock: number;
  saleStartTime?: string;
  saleEndTime?: string;
}
