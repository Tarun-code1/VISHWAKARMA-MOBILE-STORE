
export interface Product {
  id: string;
  category: string;
  brand: string;
  model: string;
  identifier?: string;
  purchasePrice: number;
  sellingPrice: number;
  dateAdded: string;
  quantity: number;
  photo?: string;
}

export interface SaleRecord {
  id:string;
  product: Product;
  dateSold: string;
  profit: number;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  photo?: string;
}

export interface KhataEntry {
  id: string;
  customerId: string;
  type: 'credit' | 'debit'; // credit = udhaar diya, debit = paisa liya
  amount: number;
  description: string;
  date: string;
  productName?: string;
  condition?: string;
}

export interface AppSettings {
    ownerName: string;
    ownerPhoto?: string;
    ownerEmail: string;
    ownerPhone: string;
    creditLabel: string;
    debitLabel: string;
}