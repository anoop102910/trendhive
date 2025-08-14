import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const AddressCard = ({ title }: { title: string }) => (
  <Card>
    <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
    <CardContent className="text-sm text-muted-foreground">
      123 Market Street
      <br />
      Springfield, 12345
      <br />
      +1 555 901 234
    </CardContent>
    <CardFooter className="flex gap-2">
      <Button variant="outline">Edit</Button>
      <Button variant="ghost">Delete</Button>
      <Button variant="hero">Set as Default</Button>
    </CardFooter>
  </Card>
);

const Addresses = () => {
  return (
    <div className="container mx-auto px-4 mt-8">
      <SEO title="Addresses – Kitchen Shop" description="Manage your saved addresses for faster checkout." />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-display">Addresses</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="hero">Add New</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Address</DialogTitle>
            </DialogHeader>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input placeholder="Full name" />
              <Input placeholder="Phone" />
              <Input placeholder="Street address" className="sm:col-span-2" />
              <Input placeholder="City" />
              <Input placeholder="Postal code" />
              <Button variant="hero" className="sm:col-span-2">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <AddressCard title="Home" />
        <AddressCard title="Work" />
      </div>
    </div>
  );
};

export default Addresses;
