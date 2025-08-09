import React from "react";
import { useOne, useCustom } from "@refinedev/core";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorComponent } from "@/components/Error";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name:string;
    image?: string;
  };
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  totalAmount: number;
  address: {
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
}

export const OrderShowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useOne<Order>({
    resource: "orders",
    id,
  });

  const { mutate } = useCustom();
  const [reason, setReason] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleCancelOrder = () => {
    mutate({
      url: `/api/order/cancel`,
      method: "post",
      values: {
        orderId: id,
        reason,
      },
      successNotification: {
        message: "Order cancelled successfully!",
        description: "Your order has been cancelled.",
      },
      errorNotification: {
        message: "Failed to cancel order.",
        description: "There was an error cancelling your order.",
      },
    });
    setIsDialogOpen(false);
  };

  const OrderShowSkeleton = () => (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/4" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-8">
        <CardHeader>
          <Skeleton className="h-8 w-1/4" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="w-full h-48" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return <OrderShowSkeleton />;
  }

  if (isError) {
    return <ErrorComponent refetch={refetch} />;
  }

  const order = data?.data;

  if (!order) {
    return <div>Order not found.</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Order Details</CardTitle>
          {order.status === "PENDING" && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">Cancel Order</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel Order</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Label htmlFor="reason">Reason for cancellation</Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <Button
                  variant="destructive"
                  onClick={handleCancelOrder}
                  disabled={!reason}
                >
                  Confirm Cancellation
                </Button>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
            </div>
            <div>
              <p><strong>Shipping Address:</strong></p>
              <p>{order.address.addressLine1}</p>
              <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
              <p>{order.address.country}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {order.items.map(item => (
              <Card key={item.id}>
                <img
                  src={
                    item.product.image ||
                    "https://tse1.mm.bing.net/th/id/OIP.Vui1gAtnHmqJTYC5Xi0kMgHaFC?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
                  }
                  alt={item.product.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold truncate">{item.product.name}</h3>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
