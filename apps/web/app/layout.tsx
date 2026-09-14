import type { Metadata } from 'next';
import './globals.css';
import './reference-ui.css';
import './admin-account.css';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'PetEncontrado',
  description: 'Sistema de Animais Perdidos e Encontrados',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
