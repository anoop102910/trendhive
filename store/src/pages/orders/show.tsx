import React from "react";
import { useOne, useCustom } from "@refinedev/core";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
    name: string;
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
  const { data, isLoading, isError } = useOne<Order>({
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading order details.</div>;
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.product.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
