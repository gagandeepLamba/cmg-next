'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ComposeForm from '@/components/gmail/ComposeForm';

export default function ComposePage() {
  const router = useRouter();

  return (
    <div className="p-6 space-y-4">
      <button onClick={() => router.push('/admin/mail')} className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to Mail
      </button>
      <h1 className="text-xl font-semibold text-gray-900">New Message</h1>
      <ComposeForm onSent={() => router.push('/admin/mail')} />
    </div>
  );
}
