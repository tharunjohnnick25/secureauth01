export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen relative flex flex-col">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 z-[-1] pointer-events-none opacity-20" 
             style={{ 
               backgroundImage: `linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), 
                                 linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)`,
               backgroundSize: '30px 30px'
             }}>
        </div>
        <main className="flex-1 flex flex-col items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
