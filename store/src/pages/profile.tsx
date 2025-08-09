import React, { useState, useEffect } from "react";
import { useGetIdentity, useForm, useCustom } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
}

export const ProfilePage: React.FC = () => {
  const { data: user, isLoading } = useGetIdentity<User>();
  const { formProps, onFinish,-
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resource: "profile",
    action: "edit",
    id: user?.id,
  });

  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [otp, setOtp] = useState("");

  const { mutate: verifyEmail } = useCustom();
  const { mutate: verifyPhone } = useCustom();

  const handleFormSubmit = (values: User) => {
    onFinish(values);
    if (values.email !== user?.email) {
      setShowEmailOtp(true);
    }
    if (values.phoneNumber !== user?.phoneNumber) {
      setShowPhoneOtp(true);
    }
  };

  const handleEmailOtpSubmit = () => {
    verifyEmail({
      url: "/api/change-email/otp",
      method: "post",
      values: { otp },
    });
  };

  const handlePhoneOtpSubmit = () => {
    verifyPhone({
      url: "/api/change-number/otp",
      method: "post",
      values: { otp },
    });
  };

  useEffect(() => {
    if (user) {
      formProps.reset(user);
    }
  }, [user, formProps]);

  const ProfileFormSkeleton = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ProfileFormSkeleton />
          ) : (
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...register("name", { required: true })} />
                {errors.name && <p className="text-red-500">This field is required</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email", { required: true })} />
                {errors.email && <p className="text-red-500">This field is required</p>}
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" {...register("phoneNumber")} />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          )}

          {showEmailOtp && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold">Verify Your New Email</h3>
              <p>An OTP has been sent to your new email address. Please enter it below.</p>
              <div className="flex items-center space-x-4">
                <Input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Button onClick={handleEmailOtpSubmit}>Verify Email</Button>
              </div>
            </div>
          )}

          {showPhoneOtp && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold">Verify Your New Phone Number</h3>
              <p>An OTP has been sent to your new phone number. Please enter it below.</p>
              <div className="flex items-center space-x-4">
                <Input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Button onClick={handlePhoneOtpSubmit}>Verify Phone</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
