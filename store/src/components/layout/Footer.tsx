import { NavLink } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="border-t mt-12">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <h4 className="font-display text-2xl">KITCHEN</h4>
          <p className="text-sm text-muted-foreground mt-2">Premium tools for everyday cooks.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h5 className="font-medium">Explore</h5>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><NavLink to="/orders" className="story-link">Orders</NavLink></li>
              <li><NavLink to="/addresses" className="story-link">Addresses</NavLink></li>
              <li><NavLink to="/gifts" className="story-link">Gifts</NavLink></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h5 className="font-medium">Help</h5>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><a href="#shipping" className="story-link">Shipping</a></li>
              <li><a href="#returns" className="story-link">Returns</a></li>
              <li><a href="#contact" className="story-link">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="space-y-2">
          <h5 className="font-medium">Newsletter</h5>
          <div className="flex gap-2">
            <Input placeholder="Your email" aria-label="Email" />
            <Button variant="hero">Join</Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
