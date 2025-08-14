import { Button } from "@/components/ui/button";

export const PromoBanner = ({
  image,
  title,
  cta,
}: {
  image: string;
  title: string;
  cta: string;
}) => {
  return (
    <section className="rounded-lg overflow-hidden elevated">
      <div className="relative">
        <img src={image} alt={`${title} banner`} className="w-full h-56 md:h-64 object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent" />
        <div className="absolute left-6 top-6">
          <h3 className="text-2xl font-display mb-2">{title}</h3>
          <Button variant="hero">{cta}</Button>
        </div>
      </div>
    </section>
  );
};
