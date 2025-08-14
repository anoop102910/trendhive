import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { products } from "@/data/products";

const Step = ({ index, label, active }: { index: number; label: string; active: boolean }) => (
  <div className={`flex items-center gap-2 ${active ? "text-primary" : "text-muted-foreground"}`}>
    <span className={`h-7 w-7 rounded-full flex items-center justify-center border ${active ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>{index}</span>
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const Checkout = () => {
  const summary = products.slice(0, 2);
  const itemSubtotal = summary.reduce((s, i) => s + i.price, 0);
  const vat = itemSubtotal * 0.21;
  const shipping = 0;
  const total = itemSubtotal + vat + shipping;

  return (
    <div className="container mx-auto px-4 mt-8">
      <SEO title="Checkout – Kitchen Shop" description="Secure checkout: add address, payment and confirm order." />
      <h1 className="text-3xl font-display mb-4">Checkout</h1>

      {/* Progress */}
      <div className="flex items-center gap-6 mb-8">
        <Step index={1} label="Cart" active={true} />
        <div className="h-px flex-1 bg-border" />
        <Step index={2} label="Address" active={true} />
        <div className="h-px flex-1 bg-border" />
        <Step index={3} label="Payment" active={true} />
        <div className="h-px flex-1 bg-border" />
        <Step index={4} label="Confirm" active={false} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Customer Info</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <Input placeholder="Email" className="sm:col-span-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <Input placeholder="First name" />
              <Input placeholder="Last name" />
              <Input placeholder="Company (optional)" className="sm:col-span-2" />
              <Input placeholder="Address" className="sm:col-span-2" />
              <Input placeholder="Apt, Suite, Etc (optional)" className="sm:col-span-2" />
              <Input placeholder="City" />
              <Select defaultValue="us">
                <SelectTrigger><SelectValue placeholder="Country" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="lt">Lithuania</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Postal Code" />
              <Input placeholder="Telephone" />
              <div className="flex items-center justify-between sm:col-span-2 mt-2">
                <a href="/cart" className="text-sm text-muted-foreground hover:underline">Return to Cart</a>
                <Button variant="hero">Continue</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader><CardTitle>Your Cart</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {summary.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <img src={s.image} alt={s.name} className="w-14 h-14 object-cover rounded" loading="lazy" />
                <div className="text-sm"><p className="font-medium">{s.name}</p><p className="text-muted-foreground">${s.price.toFixed(2)}</p></div>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <Input placeholder="Discount Code" className="col-span-2" />
              <Button variant="secondary" className="w-full">Apply</Button>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Item Subtotal</span><span>${itemSubtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>VAT</span><span>${vat.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
            </div>
            <div className="flex justify-between pt-2 font-medium text-base"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
