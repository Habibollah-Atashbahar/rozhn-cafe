import type { MenuCategory, MenuItem } from "@/types";
import MenuItemCard from "./MenuItemCard";

export default function MenuSection({
  category,
  items,
}: {
  category: MenuCategory;
  items: MenuItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section id={category.id} className="scroll-mt-32 py-8">
      <h2 className="mb-4 text-lg font-bold text-ink-900">{category.title}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
