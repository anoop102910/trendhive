import React from "react";
import { useList, useCustom } from "@refinedev/core";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image?: string;
  };
}

export const WishlistPage: React.FC = () => {
  const { data, isLoading, isError, refetch } = useList<WishlistItem>({
    resource: "wishlist",
  });

  const { mutate } = useCustom();

  const handleRemoveFromWishlist = (itemId: string) => {
    mutate(
      {
        url: `/api/wishlist/item/${itemId}/remove`,
        method: "delete",
      },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading wishlist.</div>;
  }

  const wishlistItems = data?.data || [];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlistItems.map(item => (
            <Card key={item.id}>
              <Link to={`/shop/${item.product.slug}`}>
                <img
                  src={
                    item.product.image ||
                    "https://tse1.mm.bing.net/th/id/OIP.Vui1gAtnHmqJTYC5Xi0kMgHaFC?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
                  }
                  alt={item.product.name}
                  className="w-full h-64 object-cover"
                />
              </Link>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold truncate">{item.product.name}</h3>
                <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                <div className="flex justify-end mt-4">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
