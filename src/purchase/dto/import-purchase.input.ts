import { ProductCategory } from 'product/enums/product.category.enum';
import { PurchaseStatus } from 'purchase/enums/purchase-status.enum';
import { WarrantyStatus } from 'purchase/enums/warranty-status.enum';

export interface ImportPurchaseInput {
  invoice_number: string;
  purchase_status: PurchaseStatus;
  warranty_status: WarrantyStatus;
  purchase_date?: string;
  warranty_expiry?: string;
  asc_start_date?: string;
  asc_expiry_date?: string;

  // CUSTOMER
  customer_phone: string;
  customer_name: string;
  customer_alt_mobile?: string;
  customer_email?: string;
  customer_address?: string;
  customer_house_office?: string;
  customer_street_building?: string;
  customer_area?: string;
  customer_pincode?: string;
  customer_district?: string;

  // PRODUCT
  product_serial_number: string;
  product_model: string;
  product_name: string;
  product_category: ProductCategory;
  product_brand: string;
  product_model_name: string;
  product_warranty?: string;
}
