import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import banner from "@/assets/banner-olive-sand.jpg";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Gifts = () => {
  return (
    <div className="container mx-auto px-4 mt-8">
      <SEO title="Gifts – Kitchen Shop" description="Elegant gifts for food lovers. Add a personal message and send with care." />
      <h1 className="text-3xl font-display mb-6">Gift Shop</h1>

      <section className="rounded-lg overflow-hidden elevated mb-8">
        <img src={banner} alt="Pastel gift banner" className="w-full h-56 object-cover" />
      </section>

      <Card>
        <CardHeader><CardTitle>Gift a Friend</CardTitle></CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-6">
          <p className="text-muted-foreground flex-1">Choose any product and include a heartfelt message. We’ll pack it beautifully in pastel tones.</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="hero">Add Gift Message</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Gift Details</DialogTitle></DialogHeader>
              <div className="grid gap-3">
                <Input placeholder="Recipient name" />
                <Input placeholder="Recipient email (optional)" />
                <Input placeholder="Gift message" />
                <Button variant="hero">Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default Gifts;
