import { SEO } from "@/components/seo/SEO";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { products } from "@/data/products";
import { Link } from "react-router-dom";
const statuses = [
  { id: "o1", product: products[0], status: "Delivered" },
  { id: "o2", product: products[1], status: "Shipped" },
  { id: "o3", product: products[2], status: "Processing" },
];

const badgeCls = (s: string) =>
  s === "Delivered"
    ? "bg-accent text-accent-foreground"
    : s === "Shipped"
    ? "bg-secondary text-foreground"
    : "bg-muted text-foreground";

const Orders = () => {
  return (
    <div className="container mx-auto px-4 mt-8">
      <SEO title="Your Orders – Kitchen Shop" description="Track order status and view details of past purchases." />
      <h1 className="text-3xl font-display mb-6">Orders</h1>
      <div className="space-y-4">
        {statuses.map((o) => (
          <Card key={o.id}>
            <CardContent className="flex items-center gap-4 py-4">
              <img src={o.product.image} alt={o.product.name} className="w-20 h-20 object-cover rounded" loading="lazy" />
              <div className="flex-1">
                <p className="font-medium">{o.product.name}</p>
                <p className="text-sm text-muted-foreground">${o.product.price.toFixed(2)}</p>
              </div>
              <Badge className={badgeCls(o.status)}>{o.status}</Badge>
              <Link to={`/orders/${o.id}`} className="story-link text-sm">View details</Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
