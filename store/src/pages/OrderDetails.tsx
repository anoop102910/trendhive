import { SEO } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";

// Simple demo data built from existing products
const demoOrders = {
  o1: {
    id: "3343902461",
    date: "Feb 16, 2025",
    status: "Shipped" as const,
    items: [
      { product: products[0], qty: 1 },
      { product: products[1], qty: 1 },
      { product: products[2], qty: 1 },
    ],
    shipping: {
      name: "Alex Johnson",
      line1: "847 Jewess Bridge Apt. 174",
      city: "London",
      country: "UK",
      phone: "474-769-3919",
      method: "Free (30 days)",
    },
    payment: { brand: "Visa", last2: "56" },
    fees: { shipping: 0, taxRate: 0.21, discount: 0 },
  },
  o2: {
    id: "7782249103",
    date: "Mar 02, 2025",
    status: "Processing" as const,
    items: [
      { product: products[3], qty: 2 },
      { product: products[5], qty: 1 },
    ],
    shipping: {
      name: "Taylor Reed",
      line1: "102 Park Ave, 3rd Floor",
      city: "New York",
      country: "USA",
      phone: "212-555-3241",
      method: "Standard (5–7 days)",
    },
    payment: { brand: "Mastercard", last2: "42" },
    fees: { shipping: 9.99, taxRate: 0.21, discount: 0 },
  },
  o3: {
    id: "9920034411",
    date: "Apr 10, 2025",
    status: "Delivered" as const,
    items: [
      { product: products[4], qty: 1 },
    ],
    shipping: {
      name: "Morgan Lee",
      line1: "45 Baker Street",
      city: "London",
      country: "UK",
      phone: "020-555-0101",
      method: "Express (1–2 days)",
    },
    payment: { brand: "Amex", last2: "03" },
    fees: { shipping: 0, taxRate: 0.21, discount: 0 },
  },
};

type Status = "Processing" | "Shipped" | "Delivered";
const statusToPct: Record<Status, number> = {
  Processing: 30,
  Shipped: 70,
  Delivered: 100,
};

const statusBadge = (s: Status) =>
  s === "Delivered"
    ? "bg-accent text-accent-foreground"
    : s === "Shipped"
    ? "bg-secondary text-foreground"
    : "bg-muted text-foreground";

const currency = (n: number) => `$${n.toFixed(2)}`;

const OrderDetails = () => {
  const { id } = useParams();
  const order = (demoOrders as any)[id || "o1"] || demoOrders.o1; // fallback for demo

  const subtotal = order.items.reduce(
    (s: number, i: any) => s + i.product.price * i.qty,
    0
  );
  const tax = subtotal * order.fees.taxRate;
  const shipping = order.fees.shipping;
  const discount = order.fees.discount;
  const total = subtotal + tax + shipping - discount;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Order',
    orderNumber: order.id,
    orderStatus:
      order.status === 'Delivered'
        ? 'https://schema.org/OrderDelivered'
        : order.status === 'Shipped'
        ? 'https://schema.org/OrderInTransit'
        : 'https://schema.org/OrderProcessing',
    priceCurrency: 'USD',
    price: total.toFixed(2),
    orderDate: order.date,
    acceptedOffer: order.items.map((i: any) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Product', name: i.product.name },
      price: i.product.price.toFixed(2),
      priceCurrency: 'USD',
      eligibleQuantity: { '@type': 'QuantitativeValue', value: i.qty },
    })),
    billingAddress: {
      '@type': 'PostalAddress',
      streetAddress: order.shipping.line1,
      addressLocality: order.shipping.city,
      addressCountry: order.shipping.country,
    },
    merchant: { '@type': 'Organization', name: 'Kitchen Shop' },
    paymentMethod: 'https://schema.org/CreditCard',
  };

  return (
    <div className="container mx-auto px-4 mt-8">
      <SEO
        title={`Order Details – Kitchen Shop`}
        description={`View order ${order.id}: status, items, shipping address, payment, and total.`}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-display mb-1">Order ID: {order.id}</h1>
          <p className="text-sm text-muted-foreground">Order date: {order.date}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn(statusBadge(order.status))}>{order.status}</Badge>
          <Button variant="secondary" onClick={() => window.print()}>Download Invoice</Button>
          <Button variant="hero" onClick={() => window.print()}>Print</Button>
        </div>
      </div>

      {/* Tracking */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Order progress</span>
            <span className="text-sm font-medium">{statusToPct[order.status]}%</span>
          </div>
          <Progress value={statusToPct[order.status]} />
          <div className="mt-2 text-xs text-muted-foreground flex items-center gap-3">
            <span>Processing</span>
            <span className="flex-1 h-px bg-border" />
            <span>Shipped</span>
            <span className="flex-1 h-px bg-border" />
            <span>Delivered</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Items */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="divide-y">
              {order.items.map((it: any) => (
                <div key={it.product.id} className="py-4 flex items-center gap-4">
                  <img
                    src={it.product.image}
                    alt={it.product.name}
                    className="w-16 h-16 object-cover rounded"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{it.product.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {it.qty}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{currency(it.product.price * it.qty)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Help / Links (optional demo) */}
          <Card>
            <CardHeader>
              <CardTitle>Need help?</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-3 text-sm">
              <Link to="/orders" className="underline underline-offset-4">Order issues</Link>
              <Link to="/addresses" className="underline underline-offset-4">Delivery info</Link>
              <Link to="/wishlist" className="underline underline-offset-4">Returns</Link>
            </CardContent>
          </Card>
        </div>

        {/* Right: Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{currency(subtotal)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between"><span>Discount</span><span>-{currency(discount)}</span></div>
              )}
              <div className="flex justify-between"><span>Shipping</span><span>{currency(shipping)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>+ {currency(tax)}</span></div>
              <div className="pt-2 border-t flex justify-between font-medium text-base"><span>Total</span><span>{currency(total)}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>{order.payment.brand} **{order.payment.last2}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>
                <p className="font-medium">Address</p>
                <p>{order.shipping.line1}</p>
                <p>{order.shipping.city}, {order.shipping.country}</p>
                <p>{order.shipping.phone}</p>
              </div>
              <div>
                <p className="font-medium">Delivery method</p>
                <p>{order.shipping.method}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
