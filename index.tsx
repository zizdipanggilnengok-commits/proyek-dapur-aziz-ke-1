import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Flame, Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MenuCard } from "@/components/warung/menu-card";
import { useCart } from "@/hooks/use-cart";
import { menusQueryOptions } from "@/lib/queries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Warung Lalapan Aziz — Menu Lalapan & Es Segar" },
      {
        name: "description",
        content:
          "Lalapan ayam goreng, lele, bebek, ayam penyet, es teh, dan es jeruk. Pesan langsung dari HP di Warung Lalapan Aziz.",
      },
      { property: "og:title", content: "Warung Lalapan Aziz — Menu Lalapan & Es Segar" },
      {
        property: "og:description",
        content: "Lalapan hangat dengan sambal nendang. Pesan langsung dari HP kamu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CatalogPage,
});

const FILTERS = ["Semua", "Makanan", "Minuman"] as const;

function CatalogPage() {
  const { data: menus, isLoading, error } = useQuery(menusQueryOptions);
  const { count } = useCart();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Semua");
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (menus ?? []).filter(
      (m) =>
        (filter === "Semua" || m.category === filter) &&
        (!term || m.name.toLowerCase().includes(term)),
    );
  }, [menus, filter, search]);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="grid items-center gap-6 md:grid-cols-[1.1fr_1fr] md:gap-10">
        <div className="order-2 md:order-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-turmeric/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-turmeric-foreground">
            <Flame className="size-3.5" /> Sambal diulek tiap hari
          </span>
          <h1 className="mt-3 text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl">
            Lalapan hangat,
            <br />
            <span className="text-primary">sambal nendang.</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-muted-foreground">
            Pilih menu favoritmu, masukkan ke keranjang, dan pantau pesananmu langsung dari HP.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg">
              <a href="#menu">Lihat Menu</a>
            </Button>
            {count > 0 && (
              <Button asChild variant="outline" size="lg">
                <Link to="/keranjang">
                  <ShoppingBag /> Keranjang ({count})
                </Link>
              </Button>
            )}
          </div>
        </div>
        <div className="relative order-1 md:order-2">
          <div className="absolute -inset-3 rotate-2 rounded-[2rem] bg-leaf/15" aria-hidden />
          <img
            src="/images/ayam-goreng.jpg"
            alt="Lalapan ayam goreng dengan nasi, lalapan segar, dan sambal"
            width={1024}
            height={768}
            className="relative aspect-[4/3] w-full rounded-[1.75rem] object-cover shadow-card"
          />
          <div className="absolute -bottom-4 left-4 rounded-2xl bg-card px-4 py-2.5 shadow-card ring-1 ring-border">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Mulai dari</p>
            <p className="font-display text-xl font-bold text-primary">Rp 5.000</p>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section id="menu" className="scroll-mt-20 space-y-4 pt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Menu Kami</h2>
            <p className="text-sm text-muted-foreground">Semua lalapan sudah termasuk nasi & sambal.</p>
          </div>
          <div className="relative sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari menu…"
              className="h-10 rounded-xl bg-card pl-9"
              aria-label="Cari menu"
            />
          </div>
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                filter === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-destructive">Menu gagal dimuat. Coba muat ulang halaman.</p>}

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl bg-card ring-1 ring-border/70">
                  <Skeleton className="aspect-[4/3] w-full rounded-none" />
                  <div className="space-y-2 p-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-8 w-1/2" />
                  </div>
                </div>
              ))
            : visible.map((menu) => <MenuCard key={menu.id} menu={menu} />)}
        </div>
        {!isLoading && visible.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">Menu tidak ditemukan.</p>
        )}
      </section>
    </div>
  );
}
