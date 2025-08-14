import { Link } from "react-router-dom";

export const CategoryPill = ({ title, slug }: { title: string; slug: string }) => (
  <Link
    to={slug}
    className="px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-sm"
  >
    {title}
  </Link>
);
