import { Metadata } from 'next';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI SDK Playground - GOAT Royalty App',
  description: 'Test and compare AI models in real-time with the GOAT Royalty AI SDK Playground',
};

export default function AIPlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {children}
    </div>
  );
}