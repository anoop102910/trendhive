import React from "react";
import { useApiUrl, useCustom, useCustomMutation } from "@refinedev/core";
import { ShoppingCart, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";

interface IProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
}

interface ICartItem {
  id: string;
  quantity: number;
  productId: string;
  product: IProduct;
}

interface ICart {
  id: string;
  userId: string;
  items: ICartItem[];
}

const couponFormSchema = z.object({
  couponCode: z.string().min(1, { message: "Coupon code is required." }),
});

export const CartPage: React.FC = () => {
  const apiUrl = useApiUrl();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    refetch: refetchCart,
  } = useCustom<ICart>({
    url: `${apiUrl}/cart`,
    method: "get",
  });

  const { mutate: updateCartMutation } = useCustomMutation();
  const { mutate: removeCartItemMutation } = useCustomMutation();

  const cart = data?.data;

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      toast.error("Quantity must be at least 1.");
      return;
    }
    updateCartMutation(
      {
        url: `${apiUrl}/cart`,
        method: "post",
        values: { itemId, quantity: newQuantity },
      },
      {
        onSuccess: () => {
          toast.success("Cart updated successfully.");
          refetchCart();
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to update cart.");
        },
      }
    );
  };

  const handleRemoveItem = (itemId: string) => {
    removeCartItemMutation(
      {
        url: `${apiUrl}/cart/items/${itemId}`,
        method: "delete",
      },
      {
        onSuccess: () => {
          toast.success("Item removed from cart.");
          refetchCart();
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to remove item.");
        },
      }
    );
  };

  const calculateSubtotal = () => {
    return cart?.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0) || 0;
  };

  const couponForm = useForm<z.infer<typeof couponFormSchema>>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      couponCode: "",
    },
  });

  const handleCouponSubmit = (values: z.infer<typeof couponFormSchema>) => {
    toast.info(`Applying coupon: ${values.couponCode}`);
    // Implement your coupon logic here
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading cart...</p>
      </div>
    );
  }

  if (isError || !cart) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Error loading cart or cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                Shopping Cart
              </CardTitle>
              <CardDescription>Review and manage items in your cart.</CardDescription>
            </CardHeader>
            <CardContent>
              {cart.items.length === 0 ? (
                <p className="text-center text-gray-500">Your cart is empty.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Product</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <img
                            src={
                              item.product.image ||
                              `https://images.unsplash.com/photo-1515555431631-f18e9575b63b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80`
                            }
                            alt={item.product.name}
                            className="h-16 w-16 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{item.product.name}</p>
                        </TableCell>
                        <TableCell>${item.product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <XCircle className="h-5 w-5 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Proceed to checkout to finalize your order.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <Separator />
              <Form {...couponForm}>
                <form onSubmit={couponForm.handleSubmit(handleCouponSubmit)} className="space-y-2">
                  <FormField
                    control={couponForm.control}
                    name="couponCode"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Input placeholder="Enter coupon code" {...field} />
                          </FormControl>
                          <Button type="submit">Apply</Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <Button onClick={() => navigate("/checkout")} size="lg" className="w-full">
                Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
