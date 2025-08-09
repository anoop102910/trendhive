import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Search, Home } from "lucide-react";
import { useLogout, useGetIdentity } from "@refinedev/core";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

const Header: React.FC = () => {
  const { mutate: logout } = useLogout();
  const { data: user } = useGetIdentity<User>();
  const isLoggedIn = !!user;

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white text-gray-900 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-bold">
          My E-Commerce
        </Link>
        <nav className="hidden md:flex flex-1 justify-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-gray-700 transition-colors">
            Home
          </Link>
          <Link to="/shop" className="text-sm font-medium hover:text-gray-700 transition-colors">
            Shop
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-gray-700 transition-colors">
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${
                        user?.name || user?.email
                      }&background=random&color=fff`
                    }
                  />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/wishlist">Wishlist</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/address">Addresses</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
