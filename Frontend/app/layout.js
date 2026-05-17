import "./globals.css";
import Navbar from "../components/Navbar";
import Providers from "../components/Providers";

export const metadata = {
  title: "TradeBoard — Service Request Board",
  description: "Post and browse local trade service requests",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">
        <Providers>
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
