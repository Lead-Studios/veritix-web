import { notFound } from "next/navigation";

const VALID = ["music","festival","sports","art","theater","comedy","conference","workshop"];

interface Props { params: { category: string }; }

export default async function CategoryPage({ params }: Props) {
  const { category } = params;
  if (!VALID.includes(category)) notFound();

  const label = category.charAt(0).toUpperCase() + category.slice(1);
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{label} Events</h1>
      <p className="text-gray-500 mb-8">Browse all {label.toLowerCase()} events on Veritix.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <p className="text-gray-400 col-span-full py-16 text-center">No {label.toLowerCase()} events found.</p>
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return VALID.map((c) => ({ category: c }));
}
