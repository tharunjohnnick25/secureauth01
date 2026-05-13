import AnimateLayout from '@/components/AnimateLayout';
import { Toaster } from 'sonner';
import { SessionTimeout } from '@/components/SessionTimeout';
import './globals.css';

export const metadata = {
  title: 'SecureAuth | Multi-Factor Risk-Based Authentication',
  description: 'Enterprise-grade AI cybersecurity IAM platform with adaptive MFA and behavioral biometrics.',
  keywords: 'cybersecurity, authentication, MFA, zero trust, IAM, biometrics',
  themeColor: '#020617',
  appleWebApp: {
    capable: true,
    title: 'SecureAuth AI',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: { telephone: false },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen relative bg-[var(--color-cyber-dark)] text-foreground">
        {/* Cyber Progress Bar */}
        <div className="fixed top-0 left-0 right-0 h-[2px] z-[100] bg-gradient-to-r from-transparent via-[var(--color-cyber-blue)] to-transparent opacity-50 shadow-[0_0_10px_var(--color-cyber-blue)]"></div>

        <div className="absolute inset-0 z-[-1] pointer-events-none opacity-20" 
             style={{ 
                backgroundImage: `linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), 
                                  linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)`,
                backgroundSize: '30px 30px'
             }}>
        </div>
        
        <main className="flex-1">
          <SessionTimeout />
          <AnimateLayout>
            {children}
          </AnimateLayout>
        </main>

        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(10, 10, 10, 0.8)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              color: '#fff',
              backdropFilter: 'blur(8px)',
            },
          }}
        />
      </body>
    </html>
  );
}
