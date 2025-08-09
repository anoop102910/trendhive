import React, { useState } from "react";
import { useList, useForm, useDelete } from "@refinedev/core";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ErrorComponent } from "@/components/Error";

interface Address {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const AddressForm: React.FC<{
  formProps: any;
  onFinish: (values: any) => void;
  onCancel?: () => void;
}> = ({ formProps, onFinish, onCancel }) => {
  return (
    <form onSubmit={formProps.onSubmit(onFinish)} className="space-y-4">
      <div>
        <Label htmlFor="addressLine1">Address Line 1</Label>
        <Input id="addressLine1" {...formProps.register("addressLine1", { required: true })} />
        {formProps.errors.addressLine1 && <p className="text-red-500">This field is required</p>}
      </div>
      <div>
        <Label htmlFor="addressLine2">Address Line 2</Label>
        <Input id="addressLine2" {...formProps.register("addressLine2")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" {...formProps.register("city", { required: true })} />
          {formProps.errors.city && <p className="text-red-500">This field is required</p>}
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input id="state" {...formProps.register("state", { required: true })} />
          {formProps.errors.state && <p className="text-red-500">This field is required</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input id="postalCode" {...formProps.register("postalCode", { required: true })} />
          {formProps.errors.postalCode && <p className="text-red-500">This field is required</p>}
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" {...formProps.register("country", { required: true })} />
          {formProps.errors.country && <p className="text-red-500">This field is required</p>}
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};

const AddressCard: React.FC<{ address: Address; refetch: () => void }> = ({ address, refetch }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: deleteAddress } = useDelete();
  const { formProps, onFinish } = useForm<Address>({
    resource: "address",
    action: "edit",
    id: address.id,
    onSuccess: () => {
      setIsEditing(false);
      refetch();
    },
  });

  const handleDelete = () => {
    deleteAddress({
      resource: "address",
      id: address.id,
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        {isEditing ? (
          <AddressForm
            formProps={formProps}
            onFinish={onFinish}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <p>{address.addressLine1}</p>
            {address.addressLine2 && <p>{address.addressLine2}</p>}
            <p>
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p>{address.country}</p>
          </>
        )}
      </CardContent>
      {!isEditing && (
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure you want to delete this address?</DialogTitle>
              </DialogHeader>
              <div className="flex justify-end space-x-4">
                <DialogTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogTrigger>
                <Button variant="destructive" onClick={handleDelete}>
                  Confirm Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      )}
    </Card>
  );
};

export const AddressPage: React.FC = () => {
  const { data, isLoading, isError, refetch } = useList<Address>({
    resource: "address",
  });
  const { formProps, onFinish } = useForm<Address>({
    resource: "address",
    action: "create",
    onSuccess: () => {
      refetch();
    },
  });

  const addresses = data?.data || [];

  const AddressCardSkeleton = () => (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Addresses</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Address</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new address</DialogTitle>
            </DialogHeader>
            <AddressForm formProps={formProps} onFinish={onFinish} />
          </DialogContent>
        </Dialog>
      </div>

      {isError && <ErrorComponent refetch={refetch} />}

      <div className="space-y-8">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <AddressCardSkeleton key={i} />)
          : addresses.map(address => (
              <AddressCard key={address.id} address={address} refetch={refetch} />
            ))}
      </div>
    </div>
  );
};
