import { useParams, NavLink } from "react-router-dom";
import { useMemo, useState } from "react";
import { products } from "@/data/products";
import { SEO } from "@/components/seo/SEO";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Star } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";

const Product = () => {
  const { id } = useParams();
  const product = useMemo(() => products.find((p) => p.id === id), [id]);
  const [qty, setQty] = useState(1);
  const inc = () => setQty((q) => Math.min(99, q + 1));
  const dec = () => setQty((q) => Math.max(1, q - 1));

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <SEO title="Product Not Found – Kitchen Shop" description="The product you are looking for does not exist." />
        <div className="max-w-xl">
          <h1 className="text-3xl font-display mb-2">Product not found</h1>
          <p className="text-muted-foreground mb-6">Please check the link or continue shopping.</p>
          <Button asChild>
            <NavLink to="/">Back to Home</NavLink>
          </Button>
        </div>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [product.image],
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price.toFixed(2),
      availability: 'https://schema.org/InStock',
    },
    category: product.category,
  };

  return (
    <div>
      <SEO
        title={`${product.name} – Kitchen Shop`}
        description={`Discover ${product.name}. Premium quality, thoughtfully designed for everyday cooking.`}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <section className="grid gap-8 md:grid-cols-2 items-start">
          {/* Left: gallery */}
          <div>
            <Card className="overflow-hidden elevated">
              <CardContent className="p-0">
                <img
                  src={product.image}
                  alt={`${product.name} main image`}
                  className="w-full aspect-square object-cover"
                  loading="eager"
                />
              </CardContent>
            </Card>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[product.image, product.image, product.image].map((src, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-0">
                    <img src={src} alt={`${product.name} thumbnail ${i + 1}`} className="w-full aspect-square object-cover" loading="lazy" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right: details */}
          <div className="space-y-5">
            {product.badge && <Badge variant="secondary">{product.badge}</Badge>}
            <h1 className="text-4xl md:text-5xl font-display leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold">${product.price.toFixed(2)}</p>
              <div className="flex items-center gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-current' : ''}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(14 reviews)</span>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-2 text-muted-foreground">Colour</p>
                <div className="flex items-center gap-2">
                  {['bg-primary', 'bg-secondary', 'bg-accent', 'bg-muted'].map((c, i) => (
                    <button key={i} className={`h-7 w-7 rounded-full border ${c}`} aria-label={`Select colour ${i + 1}`} />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm mb-2 text-muted-foreground">Quantity</p>
                <div className="inline-flex items-center rounded-md border">
                  <button className="h-10 w-10 inline-flex items-center justify-center" onClick={dec} aria-label="Decrease quantity">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center select-none">{qty}</span>
                  <button className="h-10 w-10 inline-flex items-center justify-center" onClick={inc} aria-label="Increase quantity">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button className="hover-scale" variant="hero" aria-label={`Add ${product.name} to cart`}>
                  Add to Cart
                </Button>
                <Button variant="outline" asChild>
                  <NavLink to="/wishlist">Add to Wishlist</NavLink>
                </Button>
              </div>
            </div>

            {/* Info accordions */}
            <Accordion type="single" collapsible className="w-full pt-2">
              <AccordionItem value="returns">
                <AccordionTrigger>Returns Policy</AccordionTrigger>
                <AccordionContent>
                  Easy 30-day returns. Items must be unused and in original packaging for a full refund.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="materials">
                <AccordionTrigger>Materials & Care</AccordionTrigger>
                <AccordionContent>
                  Crafted for everyday cooking with durable, food-safe materials. Hand-wash recommended to extend longevity.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger>Shipping & Delivery</AccordionTrigger>
                <AccordionContent>
                  Fast, tracked shipping worldwide. Free shipping on orders over $50.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Related products */}
        <section className="mt-14">
          <h2 className="text-2xl md:text-3xl font-display mb-6">Some Related Products</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.filter((p) => p.id !== product.id).slice(0, 6).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Product;
