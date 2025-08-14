import { NavLink } from "react-router-dom";
import { Heart, ShoppingCart, User, Search, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@refinedev/core";

export const Header = () => {
  const { mutate: logout } = useLogout();
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <NavLink to="/" className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          <span className="text-xl font-display font-bold tracking-tight">KITCHEN</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-6 mx-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Categories</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <NavLink to="/categories/new">New Arrivals</NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="/categories/best">Best Sellers</NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="/categories/sale">On Sale</NavLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="hidden md:flex items-center gap-2 w-[40%]">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products" className="pl-10" aria-label="Search" />
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" aria-label="Wishlist">
            <NavLink to="/wishlist">
              <Heart />
            </NavLink>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Cart">
            <NavLink to="/cart">
              <ShoppingCart />
            </NavLink>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button asChild variant="ghost" size="icon" aria-label="Profile">
                <NavLink to="/profile">
                  <User />
                </NavLink>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <NavLink to="/profile/settings">Settings</NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="/profile/orders">Orders</NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button onClick={() => logout()}>Logout</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
};
