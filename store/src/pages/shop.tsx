import banner from "@/assets/banner-beige-brown.jpg";
import { SEO } from "@/components/seo/SEO";
import { products, categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { LayoutGrid, Rows } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { NavLink } from "react-router-dom";

const SORT_OPTIONS = [
  { id: "default", label: "Default" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "name-asc", label: "Name: A-Z" },
];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const maxPrice = useMemo(() => Math.ceil(Math.max(...products.map((p) => p.price))), []);
  const [priceRange, setPriceRange] = useState<number[]>([0, maxPrice]);
  const [sortBy, setSortBy] = useState<string>("default");
  const [perPage, setPerPage] = useState<number>(12);
  const [page, setPage] = useState<number>(1);
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return list;
  }, [selectedCategory, priceRange, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageStart = (page - 1) * perPage;
  const pageEnd = Math.min(filtered.length, pageStart + perPage);
  const pageItems = filtered.slice(pageStart, pageEnd);

  // Reset to first page when filters change
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = useMemo(() => { setPage(1); return 1; }, [selectedCategory, priceRange, sortBy, perPage]);

  return (
    <div>
      <SEO title="Shop – All Kitchen Tools & Cookware" description="Browse all kitchen tools and cookware. Filter by category and price, sort items, and explore our full catalog." />

      {/* Hero */}
      <section className="relative">
        <div className="h-56 md:h-72 w-full overflow-hidden">
          <img src={banner} alt="Shop hero banner" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 to-background/60" aria-hidden />
        <div className="container mx-auto px-4 absolute inset-x-0 bottom-6">
          <h1 className="text-3xl md:text-4xl font-display">Shop</h1>
          <nav className="text-sm text-muted-foreground mt-1" aria-label="Breadcrumb">
            <NavLink to="/" className="hover:text-foreground">Home</NavLink>
            <span className="mx-1">/</span>
            <span className="text-foreground">Shop</span>
          </nav>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-8 grid gap-8 md:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-6">
          <article className="rounded-lg border p-4">
            <h2 className="text-base font-medium mb-3">Product Categories</h2>
            <ul className="space-y-2">
              <li>
                <button
                  className={`w-full text-left text-sm transition-colors ${!selectedCategory ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button
                    className={`w-full text-left text-sm transition-colors ${selectedCategory === c.title ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    onClick={() => setSelectedCategory(c.title)}
                  >
                    {c.title}
                  </button>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-lg border p-4">
            <h2 className="text-base font-medium mb-4">Pricing</h2>
            <div className="px-1">
              <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={maxPrice} step={1} className="mb-3" />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>${'{'}priceRange[0].toFixed(0){'}'}</span>
                <span>${'{'}priceRange[1].toFixed(0){'}'}</span>
              </div>
            </div>
          </article>
        </aside>

        {/* Content */}
        <main>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <Button variant={view === "grid" ? "default" : "outline"} size="icon" aria-label="Grid view" onClick={() => setView("grid")}>
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant={view === "list" ? "default" : "outline"} size="icon" aria-label="List view" onClick={() => setView("list")}>
                <Rows className="h-4 w-4" />
              </Button>
              <span className="ml-3 text-sm text-muted-foreground">
                Showing {filtered.length ? pageStart + 1 : 0}-{pageEnd} of {filtered.length} item{filtered.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm text-muted-foreground">Sort By</label>
              <select
                className="rounded-md border bg-background px-3 py-2 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>

              <label className="text-sm text-muted-foreground">Show</label>
              <select
                className="rounded-md border bg-background px-3 py-2 text-sm"
                value={perPage}
                onChange={(e) => setPerPage(parseInt(e.target.value, 10))}
                aria-label="Items per page"
              >
                {[9, 12, 24].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid/List */}
          {view === "grid" ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {pageItems.map((p) => (
                <div key={p.id} className="rounded-lg border p-4 flex items-center gap-4">
                  <div className="w-24 overflow-hidden rounded-md bg-secondary/50">
                    <img src={p.image} alt={`${p.name} photo`} className="w-full aspect-square object-contain" loading="lazy" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display uppercase">{p.name}</h3>
                    <p className="text-sm text-muted-foreground">{p.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${'{'}p.price.toFixed(2){'}'}</p>
                    <NavLink to={`/product/${'{'}p.id{'}'}`} className="text-sm text-primary underline">View</NavLink>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }} />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <PaginationItem key={n}>
                    <PaginationLink href="#" isActive={n === page} onClick={(e) => { e.preventDefault(); setPage(n); }}>
                      {n}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </main>
      </section>
    </div>
  );
};

export default Shop;
