import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { products } from "@/data/products";
import { X } from "lucide-react";
import { EmptyWishlist } from "@/components/empty/EmptyWishlist";

const Wishlist = () => {
  const items = products.slice(0, 4);
  return (
    <div className="container mx-auto px-4 mt-8">
      <SEO title="Wishlist – Kitchen Shop" description="Your saved items for later. Move products to cart when ready." />
      <h1 className="text-3xl font-display mb-6">Wishlist</h1>
      {items.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Stock Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Button variant="ghost" size="icon" aria-label={`Remove ${p.name}`}><X /></Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded" loading="lazy" />
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>${p.price.toFixed(2)}</TableCell>
                  <TableCell className="text-sm">In Stock</TableCell>
                  <TableCell className="text-right">
                    <Button variant="secondary">Add to Cart</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
