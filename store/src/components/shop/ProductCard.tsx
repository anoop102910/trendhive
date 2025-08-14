import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/data/products";
import { NavLink } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="overflow-hidden elevated animate-fade-in group">
      <CardContent className="p-0 relative">
        <div className="absolute inset-x-0 top-0 h-28 bg-secondary" aria-hidden />
        {product.badge && (
          <Badge className="absolute left-3 top-3 z-20" variant="secondary">
            {product.badge}
          </Badge>
        )}

        <NavLink to={`/product/${product.id}`} aria-label={`View ${product.name}`} className="block">
          <img
            src={product.image}
            alt={`${product.name} product photo`}
            className="relative z-10 w-4/5 mx-auto mt-8 -mb-4 aspect-square object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </NavLink>

        <NavLink
          to={`/product/${product.id}`}
          aria-label={`Open ${product.name} page`}
          className="absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur transition-colors hover:bg-accent"
        >
          <ArrowUpRight className="h-4 w-4" />
        </NavLink>
      </CardContent>

      <CardFooter className="flex items-end justify-between p-4">
        <h3 className="text-lg font-display uppercase leading-tight">{product.name}</h3>
        <p className="text-sm font-medium text-foreground">${product.price.toFixed(2)}</p>
      </CardFooter>
    </Card>
  );
};
