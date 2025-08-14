import React from "react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type Action = {
  label: string;
  href: string;
};

export type EmptyStateProps = {
  image: string;
  imageAlt: string;
  title: string;
  description?: string;
  action?: Action;
  className?: string;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  image,
  imageAlt,
  title,
  description,
  action,
  className,
}) => {
  return (
    <section className={"w-full py-16 sm:py-20 " + (className ?? "") }>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto mb-6 w-full max-w-sm rounded-md border bg-muted/30 p-2">
            <AspectRatio ratio={16 / 9}>
              <img
                src={image}
                alt={imageAlt}
                className="h-full w-full rounded object-cover"
                loading="lazy"
              />
            </AspectRatio>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl mb-2">{title}</h2>
          {description ? (
            <p className="text-sm sm:text-base text-muted-foreground mb-6">{description}</p>
          ) : null}
          {action ? (
            <Button variant="hero" asChild>
              <a href={action.href}>{action.label}</a>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default EmptyState;
