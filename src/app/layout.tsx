import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vaultbrix Status',
  description: 'Real-time status monitoring for Vaultbrix services',
  icons: {
    icon: 'https://vaultbrix.com/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-vaultbrix-bg text-slate-50">
        <header className="border-b border-slate-800">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/icon.svg"
                alt="Vaultbrix"
                className="w-8 h-8"
              />
              <span className="font-semibold text-lg">Vaultbrix Status</span>
            </div>
            <nav className="flex gap-4 text-sm">
              <a href="/" className="text-slate-300 hover:text-white transition">
                Status
              </a>
              <a href="/history" className="text-slate-300 hover:text-white transition">
                History
              </a>
              <a
                href="https://vaultbrix.com"
                className="text-slate-300 hover:text-white transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vaultbrix
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-800 mt-16">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center text-slate-500 text-sm">
            <p>Powered by Vaultbrix &middot; Updated every 5 minutes</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
