import React from "react";
import utensilSet from "@/assets/product-utensil-set.jpg";
import { EmptyState } from "./EmptyState";

export const EmptyWishlist: React.FC = () => (
  <EmptyState
    image={utensilSet}
    imageAlt="Modern utensil set product photography"
    title="Your wishlist is empty"
    description="Save your favorite finds to keep them handy for later."
    action={{ label: "Browse products", href: "/shop" }}
  />
);

export default EmptyWishlist;
