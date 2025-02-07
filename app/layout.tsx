import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import {TabNavigation} from './components/Common/TabNavigation'
import Sidebar from './components/Common/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Oxford Bakery',
  description: 'Experience the best Bakery delivery service in town',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
          
          {/* <Sidebar/>
          <TabNavigation /> */}
          <main>{children}</main>
         
      </body>
    </html>
  );
}