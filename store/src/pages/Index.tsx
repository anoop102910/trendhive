import hero from "@/assets/hero-kitchen-shears.jpg";
import banner1 from "@/assets/banner-beige-brown.jpg";
import banner2 from "@/assets/banner-olive-sand.jpg";
import productKettle from "@/assets/product-kettle.jpg";
import productKnife from "@/assets/product-knife.jpg";
import productSpatulas from "@/assets/product-spatulas.jpg";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo/SEO";
import { products, categories } from "@/data/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { CategoryPill } from "@/components/shop/CategoryPill";
import { PromoBanner } from "@/components/shop/PromoBanner";

const Index = () => {
  return (
    <div>
      <SEO title="Kitchen Shop – Premium Tools & Cookware" description="Discover curated kitchen tools and cookware. Explore trending products, gifts, and chef-approved essentials." />

      {/* Hero Section */}
      <section className="container mx-auto px-4 mt-6 md:mt-10">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-display leading-tight">Cook’s Fascinations</h1>
            <p className="text-muted-foreground text-lg max-w-prose">Quality kitchen tools enhance cooking with precision and ease. Explore curated pieces designed for everyday adventures.</p>
            <div className="flex gap-3">
              <Button variant="hero" className="hover-scale">Shop Now</Button>
              <Button variant="outline">Explore Collections</Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((c) => (
                <CategoryPill key={c.id} title={c.title} slug={c.slug} />
              ))}
            </div>
          </div>
          <div className="rounded-lg overflow-hidden elevated">
            <img src={hero} alt="Chef scissors hero" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Promotional banners */}
      <section className="container mx-auto px-4 mt-12 grid md:grid-cols-2 gap-6">
        <PromoBanner image={banner1} title="Discover Curated Collection" cta="View All" />
        <PromoBanner image={banner2} title="Gifts for Every Cook" cta="Shop Gifts" />
      </section>

      {/* Trending products */}
      <section className="container mx-auto px-4 mt-14">
        <h2 className="text-3xl font-display mb-6">Trending Now</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0,6).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Get Everything in One Place Section */}
      <section className="container mx-auto px-4 mt-20 mb-16 relative overflow-hidden">
        {/* Background Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-display font-bold text-muted-foreground/10 transform rotate-[-15deg] whitespace-nowrap select-none">
            ADVENTURES!
          </span>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-center mb-12 leading-tight">
            GET EVERYTHING IS<br />ONE PLACE
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="space-y-3 animate-fade-in">
              <div className="aspect-square rounded-lg overflow-hidden elevated">
                <img 
                  src={hero} 
                  alt="Kitchen tools and utensils" 
                  className="w-full h-full object-cover hover-scale"
                />
              </div>
              <p className="text-sm font-medium text-center">GET IN TOUCH</p>
            </div>
            
            <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="aspect-square rounded-lg overflow-hidden elevated">
                <img 
                  src={productKettle} 
                  alt="Premium cookware" 
                  className="w-full h-full object-cover hover-scale"
                />
              </div>
              <p className="text-sm font-medium text-center">GET IN TOUCH</p>
            </div>
            
            <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="aspect-square rounded-lg overflow-hidden elevated">
                <img 
                  src={productKnife} 
                  alt="Professional chef tools" 
                  className="w-full h-full object-cover hover-scale"
                />
              </div>
              <p className="text-sm font-medium text-center">GET IN TOUCH</p>
            </div>
            
            <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="aspect-square rounded-lg overflow-hidden elevated">
                <img 
                  src={productSpatulas} 
                  alt="Kitchen essentials" 
                  className="w-full h-full object-cover hover-scale"
                />
              </div>
              <p className="text-sm font-medium text-center">GET IN TOUCH</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
