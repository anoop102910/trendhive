import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiUrl, useCustomMutation, useCustom } from "@refinedev/core";
import { CreditCard, MapPin, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const addressFormSchema = z.object({
  addressLine1: z.string().min(1, "Address Line 1 is required."),
  addressLine2: z.string().min(1, "Address Line 2 is required."),
  city: z.string().min(1, "City is required."),
  state: z.string().min(1, "State is required."),
  postalCode: z.string().min(1, "Postal code is required."),
  country: z.string().min(1, "Country is required."),
});

const paymentFormSchema = z.object({
  paymentMethod: z.enum(["credit_card", "paypal", "cod"], {
    message: "Please select a payment method.",
  }),
});

interface IProduct {
  id: string;
  name: string;
  price: number;
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

export const CheckoutPage: React.FC = () => {
  const apiUrl = useApiUrl();
  const [step, setStep] = useState(1);

  const {
    data: cartData,
    isLoading: isCartLoading,
    isError: isCartError,
  } = useCustom<ICart>({
    url: `${apiUrl}/cart`,
    method: "get",
  });

  const cart = cartData?.data;

  const [address, setAddress] = useState({});

  const addressForm = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
  });

  const paymentForm = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
  });

  const { mutate: createAddress, isPending: isAddressPending } = useCustomMutation();
  const { mutate: createOrder, isPending: isOrderPending } = useCustomMutation();

  const handleAddressSubmit = (values: z.infer<typeof addressFormSchema>) => {
    createAddress(
      {
        url: `${apiUrl}/address`,
        method: "post",
        values: values,
      },
      {
        onSuccess: data => {
          toast.success("Address saved successfully!");
          console.log(data);
          setAddress(data);
          setStep(2);
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to save address.");
        },
      }
    );
  };

  const handlePaymentSubmit = (values: z.infer<typeof paymentFormSchema>) => {
    if (!cart) {
      toast.error("Your cart is empty.");
      return;
    }

    console.log({
      addressId: address.id,
      paymentMethod: values.paymentMethod,
    });

    createOrder(
      {
        url: `${apiUrl}/orders`,
        method: "post",
        values: {
          addressId: address.id,
          paymentMethod: values.paymentMethod,
        },
      },
      {
        onSuccess: () => {
          toast.success("Order placed successfully!");
          setStep(3);
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to place order.");
        },
      }
    );
  };

  const calculateTotal = () => {
    if (!cart) return 0;
    const subtotal = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const shipping = 50.0;
    return subtotal + shipping;
  };

  if (isCartLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading cart...</p>
      </div>
    );
  }

  if (isCartError || !cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-8 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty.</h1>
        <p className="mt-4 text-lg text-gray-500">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button asChild className="mt-8">
          <a href="/shop">Start Shopping</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-6 w-6" /> Shipping Address
              </CardTitle>
              <CardDescription>Enter the address for your order.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...addressForm}>
                <form
                  onSubmit={addressForm.handleSubmit(handleAddressSubmit)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <FormField
                    control={addressForm.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Street address, P.O. box, company name, c/o"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addressForm.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Address Line 2</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Apartment, suite, unit, building, floor, etc."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addressForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addressForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addressForm.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addressForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="md:col-span-2 flex justify-end">
                    <Button type="submit" disabled={isAddressPending}>
                      {isAddressPending ? "Saving Address..." : "Continue to Payment"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-6 w-6" /> Payment Method
              </CardTitle>
              <CardDescription>Choose how you would like to pay.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...paymentForm}>
                <form
                  onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={paymentForm.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="credit_card">Credit Card</SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="cod">Cash on Delivery</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back to Address
                    </Button>
                    <Button type="submit" disabled={isOrderPending}>
                      {isOrderPending ? "Placing Order..." : "Place Order"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="flex flex-col items-center justify-center p-8 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-3xl">Order Placed Successfully!</CardTitle>
            <CardDescription className="mt-2 text-lg">
              Thank you for your purchase. Your order details have been sent to your email.
            </CardDescription>
            <Button asChild className="mt-8">
              <a href="/">Continue Shopping</a>
            </Button>
          </Card>
        )}
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {cart?.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm text-gray-500">
                  <span>
                    {item.quantity} x {item.product.name}
                  </span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>
                $
                {cart?.items
                  .reduce((acc, item) => acc + item.product.price * item.quantity, 0)
                  .toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>$50.00</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Order Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
