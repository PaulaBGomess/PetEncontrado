"use client";

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

function SocialCallbackContent() {
  const { refresh } = useAuth();
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const role = params.get('role');

    refresh().then((ok) => {
      if (!ok) {
        router.replace('/login');
        return;
      }

      router.replace(role === 'ADMIN' ? '/admin' : '/meus-anuncios');
    });
  }, [params, refresh, router]);

  return <div className="loading">Concluindo seu acesso...</div>;
}

export default function SocialCallback() {
  return (
    <Suspense fallback={<div className="loading">Concluindo seu acesso...</div>}>
      <SocialCallbackContent />
    </Suspense>
  );
}
