"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
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
    <div className="form-shell">
      <form className="panel" onSubmit={submit} style={{maxWidth:520,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <div style={{fontSize:42}}>🐾</div>
          <h1 className="form-title">Bem-vindo ao PetEncontrado</h1>
          <p className="form-sub">Entre para gerenciar seus anúncios, avistamentos e informações da sua conta.</p>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="form-grid">
          <div className="field full">
            <label>E-mail</label>
            <input name="email" type="email" required autoComplete="email" placeholder="voce@email.com" />
          </div>
          <div className="field full">
            <label>Senha</label>
            <div style={{display:'flex',gap:8}}>
              <input style={{flex:1}} name="password" type={showPassword?'text':'password'} required autoComplete="current-password" placeholder="Sua senha" />
              <button type="button" className="btn" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?'Ocultar senha':'Mostrar senha'}>
                {showPassword?'Ocultar':'Mostrar'}
              </button>
            </div>
          </div>
        </div>

        <div style={{display:'flex',justifyContent:'flex-end',margin:'8px 0 16px'}}>
          <Link href="/esqueci-senha">Esqueci minha senha</Link>
        </div>

        <button className="btn primary" disabled={loading} style={{width:'100%'}}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <div style={{display:'flex',alignItems:'center',gap:12,margin:'22px 0',color:'#64748b'}}>
          <span style={{height:1,background:'#e2e8f0',flex:1}} />
          <span>ou continue com</span>
          <span style={{height:1,background:'#e2e8f0',flex:1}} />
        </div>

        <div style={{display:'grid',gap:10}}>
          <a className="btn" href={`${API}/auth/google`} style={{textAlign:'center',textDecoration:'none'}}>G&nbsp;&nbsp;Continuar com Google</a>
          <a className="btn" href={`${API}/auth/facebook`} style={{textAlign:'center',textDecoration:'none'}}>f&nbsp;&nbsp;Continuar com Facebook</a>
        </div>

        <p className="form-sub" style={{marginTop:22,textAlign:'center'}}>
          Ainda não possui conta? <Link href="/cadastro">Criar conta</Link>
        </p>
      </form>
    </div>
  </>;
}
