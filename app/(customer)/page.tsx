import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-50 to-neutral-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full text-center space-y-14">

        {/* HERO */}
        <section className="space-y-5">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
            Welcome to <span className="text-primary">Cloud Kitchen</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Freshly prepared meals, delivered fast.  
            Choose your cuisine to begin.
          </p>
        </section>

        {/* CUISINE CARDS */}
        <section className="grid gap-8 md:grid-cols-2">

          {/* CHINESE */}
          <Link
            href="/chinese"
            className="group relative overflow-hidden rounded-3xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 opacity-90" />

            <div className="relative aspect-[4/3] flex flex-col items-center justify-center p-10 text-white">
              <div className="text-7xl mb-6 transition-transform duration-300 group-hover:scale-110">
                🥟
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Chinese
              </h2>
              <p className="text-orange-50 text-lg opacity-95">
                Bold flavors & classic wok dishes
              </p>

              {/* CTA */}
              <div className="mt-6 rounded-full bg-white/15 px-6 py-2 text-sm backdrop-blur-sm">
                View Menu →
              </div>
            </div>
          </Link>

          {/* BIRYANI */}
          <Link
            href="/biryani"
            className="group relative overflow-hidden rounded-3xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-700 to-amber-800 opacity-90" />

            <div className="relative aspect-[4/3] flex flex-col items-center justify-center p-10 text-white">
              <div className="text-7xl mb-6 transition-transform duration-300 group-hover:scale-110">
                🍛
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Biryani
              </h2>
              <p className="text-red-50 text-lg opacity-95">
                Slow-cooked, aromatic & royal
              </p>

              {/* CTA */}
              <div className="mt-6 rounded-full bg-white/15 px-6 py-2 text-sm backdrop-blur-sm">
                Explore Dishes →
              </div>
            </div>
          </Link>

        </section>

        {/* TRUST STRIP */}
        <section className="flex flex-wrap justify-center gap-6 pt-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            💵 <span>COD Available</span>
          </div>
          <div className="flex items-center gap-2">
            🚚 <span>Fast Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            ✅ <span>Freshly Prepared</span>
          </div>
        </section>

      </div>
    </main>
  );
}
