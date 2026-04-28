// Redirect /orders → /customer/orders (tương thích ngược)
import { redirect } from 'next/navigation';
export default function OrdersRedirect() {
  redirect('/customer/orders');
}
