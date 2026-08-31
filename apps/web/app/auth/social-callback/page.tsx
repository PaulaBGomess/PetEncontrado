"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function SocialCallback() {
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
