import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { products } from "@/data/products";
import { Heart, X } from "lucide-react";
import { EmptyCart } from "@/components/empty/EmptyCart";

const items = products.slice(0, 3).map((p) => ({ ...p, qty: 1 }));

const Cart = () => {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = subtotal > 100 ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  return (
    <div className="container mx-auto px-4 mt-8">
      <SEO title="Your Cart – Kitchen Shop" description="Review items in your cart and proceed to checkout." />
        <div className="flex items-end justify-between mb-6">
          <h1 className="text-3xl font-display">My Bag</h1>
          <span className="text-sm text-muted-foreground hidden sm:block">Items are reserved for 60 minutes</span>
        </div>
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {items.map((i) => (
                  <Card key={i.id} className="overflow-hidden">
                    <div className="flex gap-4 p-4">
                      <img src={i.image} alt={i.name} className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded" loading="lazy" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-base font-semibold">${i.price.toFixed(2)}</p>
                            <h3 className="font-medium leading-snug">{i.name}</h3>
                          </div>
                          <Button variant="ghost" size="icon" aria-label={`Remove ${i.name}`}>
                            <X />
                          </Button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-3 text-sm">
                          <Select defaultValue="black">
                            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Color" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="black">Black</SelectItem>
                              <SelectItem value="olive">Olive</SelectItem>
                              <SelectItem value="steel">Steel</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select defaultValue="m">
                            <SelectTrigger className="w-[100px]"><SelectValue placeholder="Size" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="s">S</SelectItem>
                              <SelectItem value="m">M</SelectItem>
                              <SelectItem value="l">L</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select defaultValue="1">
                            <SelectTrigger className="w-[90px]"><SelectValue placeholder="Qty" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Qty 1</SelectItem>
                              <SelectItem value="2">Qty 2</SelectItem>
                              <SelectItem value="3">Qty 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="mt-3">
                          <Button variant="outline" size="sm" aria-label={`Save ${i.name} for later`}>
                            <Heart className="mr-2" />
                            Save for later
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>
                  <div className="flex justify-between font-medium"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </CardContent>
                <CardFooter>
                  <Button variant="hero" className="w-full" asChild>
                    <a href="/checkout">Proceed to Checkout</a>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

    </div>
  );
};

export default Cart;
