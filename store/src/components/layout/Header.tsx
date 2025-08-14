import { NavLink } from "react-router-dom";
import { Heart, ShoppingCart, User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="text-xl font-display font-bold tracking-tight">KITCHEN</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-6 mx-4">
          <NavLink to="/shop" className="text-sm text-foreground hover:text-primary transition-colors">Shop</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-2 w-[40%]">

          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products" className="pl-10" aria-label="Search" />
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" aria-label="Wishlist">
            <NavLink to="/wishlist"><Heart /></NavLink>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Cart">
            <NavLink to="/cart"><ShoppingCart /></NavLink>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Profile">
            <NavLink to="/profile"><User /></NavLink>
          </Button>
        </nav>
      </div>
    </header>
  );
};
