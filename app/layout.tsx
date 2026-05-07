import type { Metadata } from 'next';
import { Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ThemePicker from '@/components/ThemePicker';
import Customization from '@/components/Customization';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

const notoSans = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto-sc',
  display: 'swap',
});

const notoSerif = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-serif-sc',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '自动麻将机 Automatic Mahjong Table | ZHONGQUE',
  description:
    'ZHONGQUE 自动麻将机专卖店，美国华人首选麻将桌品牌。静音折叠自动麻将机，全美免费配送，一年质保。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body className="font-sans">
        <AuthProvider>
          <Header />
          {children}
          <Footer />
          <Customization />
          <ThemePicker />
        </AuthProvider>
      </body>
    </html>
  );
}
