import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <main className="min-h-screen bg-gray-100">
          {children}
        </main>
      </body>
    </html>
  );
}