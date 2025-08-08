import React, { useState } from "react";
import { useList, useCustomMutation, useApiUrl } from "@refinedev/core";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  isPublished: boolean;
  categoryId?: string;
}

interface Category {
  id: string;
  name: string;
}

const ProductCard: React.FC<{
  product: Product;
  onAddToCart: (productId: string) => void;
  isAddingToCart: boolean;
}> = ({ product, onAddToCart, isAddingToCart }) => {
  return (
    <div className="bg-white  overflow-hidden">
      <Link to={`/shop/${product.slug}`}>
        <img
          src={
            product.image ||
            "https://tse1.mm.bing.net/th/id/OIP.Vui1gAtnHmqJTYC5Xi0kMgHaFC?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
          }
          alt={product.name}
          className="w-full h-64 object-cover"
        />
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{product.name}</h3>
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
        <div className="flex justify-between items-center mt-4">
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
          <Button onClick={() => onAddToCart(product.id)} disabled={isAddingToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const ShopPage: React.FC = () => {
  const apiUrl = useApiUrl();
  const [filters, setFilters] = useState<{ categories: string[]; priceRange: number[] }>({
    categories: [],
    priceRange: [0, 1000],
  });

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useList<Product>({
    resource: "products",
    filters: [
      { field: "isPublished", operator: "eq", value: true },
      { field: "price", operator: "gte", value: filters.priceRange[0] },
      { field: "price", operator: "lte", value: filters.priceRange[1] },
    ],
  });

  const { data: categoriesData } = useList<Category>({ resource: "categories" });
  const categories = categoriesData?.data || [];

  const { mutate, isPending: isAddingToCart } = useCustomMutation();
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const handleAddToCart = (productId: string) => {
    setAddedProductId(productId);
    mutate({
      url: `${apiUrl}/cart`,
      method: "post",
      values: { productId, quantity: 1 },
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: value,
    }));
  };

  if (productsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (productsError) {
    return <div className="text-center text-red-500">Error loading products.</div>;
  }

  const products = productsData?.data || [];

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold">All Products</h1>
        <div className="flex flex-wrap space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Filter by Category</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-4">
              <DropdownMenuLabel>Categories</DropdownMenuLabel>
              {categories.map(category => (
                <div key={category.id} className="flex items-center space-x-2 my-2">
                  <Checkbox
                    id={category.id}
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                  />
                  <label
                    htmlFor={category.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Filter by Price</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-4 w-64">
              <DropdownMenuLabel>Price Range</DropdownMenuLabel>
              <p className="text-center my-2">
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </p>
              <Slider
                defaultValue={[0, 1000]}
                min={0}
                max={1000}
                step={10}
                onValueChange={handlePriceChange}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            isAddingToCart={isAddingToCart && addedProductId === product.id}
          />
        ))}
      </div>
    </div>
  );
};

export default ShopPage;
