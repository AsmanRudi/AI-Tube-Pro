import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-bold text-blue-600">
          AI Tube Pro
        </h1>
        <div className="flex items-center gap-4">
<Link
            href="/login"
            className="rounded-lg px-5 py-2 font-medium text-gray-600 hover:bg-gray-100"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
          >
            Mulai
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-8 py-20">
        <div className="text-center">
<h2 className="text-5xl font-bold tracking-tight text-gray-900">
            YouTube dengan AI
            <br />
            <span className="text-blue-600">Otomatisasi Konten</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Hasilkan skrip YouTube berkualitas tinggi, optimalkan SEO, buat konsep thumbnail,
            dan otomatiskan seluruh alur kerja pembuatan konten Anda dengan AI.
          </p>
          <div className="mt-10 flex justify-center gap-4">
<Link
              href="/register"
              className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-medium text-white shadow-lg hover:bg-blue-700"
            >
              Mulai Gratis
            </Link>
            <Link
              href="/login"
              className="rounded-lg border bg-white px-8 py-4 text-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Masuk
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 text-xl font-bold">
              1
            </div>
<h3 className="text-xl font-semibold">Generasi Skrip</h3>
            <p className="mt-3 text-gray-600">
              Hasilkan skrip YouTube lengkap dengan AI. Termasuk judul, kerangka, deskripsi, dan tag.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 text-xl font-bold">
              2
            </div>
<h3 className="text-xl font-semibold">Optimasi SEO</h3>
            <p className="mt-3 text-gray-600">
              Optimalkan video Anda untuk pencarian dengan judul, deskripsi, tag, dan hashtag yang dihasilkan AI.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-8 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 text-xl font-bold">
              3
            </div>
<h3 className="text-xl font-semibold">Otomatisasi Penuh</h3>
            <p className="mt-3 text-gray-600">
              Dari skrip hingga thumbnail hingga sulih suara - otomatiskan seluruh alur konten YouTube Anda.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 border-t pt-8 text-center text-sm text-gray-500">
<p>&copy; 2024 AI Tube Pro. Hak cipta dilindungi.</p>
        </footer>
      </main>
    </div>
  );
}
