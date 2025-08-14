import { SEO } from "@/components/seo/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Profile = () => {
  return (
    <div className="container mx-auto px-4 mt-8">
      <SEO title="Profile – Kitchen Shop" description="Manage your account, orders, addresses and settings." />
      <h1 className="text-3xl font-display mb-6">Profile</h1>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">Personal Info</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input placeholder="First name" />
            <Input placeholder="Last name" />
            <Input placeholder="Email" className="sm:col-span-2" />
          </div>
          <Button variant="hero">Save Changes</Button>
        </TabsContent>
        <TabsContent value="orders">View your order history on the Orders page.</TabsContent>
        <TabsContent value="addresses">Manage saved addresses on the Addresses page.</TabsContent>
        <TabsContent value="settings">Update password, preferences and more.</TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
