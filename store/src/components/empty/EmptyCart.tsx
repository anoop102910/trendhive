import React from "react";
import bannerOlive from "@/assets/banner-olive-sand.jpg";
import { EmptyState } from "./EmptyState";

export const EmptyCart: React.FC = () => (
  <EmptyState
    image={bannerOlive}
    imageAlt="Warm olive and sand banner background"
    title="Your cart is empty"
    description="Start shopping to fill your kitchen with everyday essentials."
    action={{ label: "Shop now", href: "/shop" }}
  />
);

export default EmptyCart;
