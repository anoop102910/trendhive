export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  badge?: string;
  category: string;
};

// Images imported as modules for tree-shaking
import knife from "@/assets/product-knife.jpg";
import spoon from "@/assets/product-wood-spoon.jpg";
import tongs from "@/assets/product-tongs.jpg";
import spatulas from "@/assets/product-spatulas.jpg";
import setBox from "@/assets/product-utensil-set.jpg";
import kettle from "@/assets/product-kettle.jpg";

export const products: Product[] = [
  { id: "p1", name: "Bundle Bliss", price: 34.99, image: setBox, badge: "Best Seller", category: "Sets" },
  { id: "p2", name: "Edge Master Knife", price: 29.89, image: knife, badge: "New Arrival", category: "Cutlery" },
  { id: "p3", name: "Wood Spoon", price: 12.49, image: spoon, badge: "Only 12 Left", category: "Utensils" },
  { id: "p4", name: "Food Grip Tongs", price: 24.99, image: tongs, badge: "New", category: "Utensils" },
  { id: "p5", name: "Silicone Spatulas", price: 19.99, image: spatulas, category: "Utensils" },
  { id: "p6", name: "Pour-over Kettle", price: 54.99, image: kettle, category: "Kettles" },
];

export const categories = [
  { id: "c1", title: "Equipment", slug: "/#equipment" },
  { id: "c2", title: "Kitchenware", slug: "/#kitchenware" },
  { id: "c3", title: "Chef's Tools", slug: "/#chefs-tools" },
];
