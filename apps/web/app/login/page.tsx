"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Eye, EyeOff, PawPrint } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api/v1';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const f = new FormData(e.currentTarget);
    try {
      const authenticatedUser = await login(String(f.get('email')), String(f.get('password')));
      router.replace(authenticatedUser.role === 'ADMIN' ? '/admin' : '/meus-anuncios');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return <>
    <Header />
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-brand">
          <Link className="brand" href="/">
            <span className="brand-icon"><PawPrint size={21}/></span>
            <span>PetEncontrado</span>
          </Link>
        </div>
        <h1 className="auth-title">Bem-vindo de volta!</h1>
        <p className="auth-sub">Faça login para continuar ajudando.</p>

        {error && <div className="error">{error}</div>}

        <div className="field">
          <label>E-mail</label>
          <input name="email" type="email" required autoComplete="email" placeholder="seuemail@exemplo.com" />
        </div>
        <div className="field">
          <label>Senha</label>
          <div className="password-wrap">
            <input name="password" type={showPassword ? 'text' : 'password'} required autoComplete="current-password" placeholder="Digite sua senha" />
            <button type="button" className="btn" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?'Ocultar senha':'Mostrar senha'}>
              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>} 
            </button>
          </div>
        </div>

        <div className="auth-forgot"><Link href="/esqueci-senha">Esqueci minha senha</Link></div>

        <button className="btn primary full-button" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>

        <div className="auth-divider">ou entre com</div>
        <div className="social-grid">
          <a className="social-btn" href={`${API}/auth/google`}>🇬 &nbsp; Google</a>
          <a className="social-btn" href={`${API}/auth/facebook`}>ⓕ &nbsp; Facebook</a>
        </div>

        <p className="auth-footer">Ainda não tem conta? <Link href="/cadastro">Cadastre-se</Link></p>
      </form>
    </main>
  </>;
}
