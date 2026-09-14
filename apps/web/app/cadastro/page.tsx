"use client";

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, PawPrint } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';

export default function Cadastro(){
  const {register}=useAuth();
  const router=useRouter();
  const[error,setError]=useState('');
  const[loading,setLoading]=useState(false);
  const[showPassword,setShowPassword]=useState(false);
  const[showConfirm,setShowConfirm]=useState(false);

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    setLoading(true);
    setError('');
    const f=new FormData(e.currentTarget);
    const p=String(f.get('password'));
    const c=String(f.get('confirm'));
    if(p!==c){setError('As senhas não coincidem');setLoading(false);return}
    try{
      await register(Object.fromEntries([...f.entries()].filter(([k])=>k!=='confirm'&&k!=='terms')));
      router.push('/cadastrar-animal');
    }catch(e:any){setError(e.message)}finally{setLoading(false)}
  }

  return <>
    <Header/>
    <main className="register-page">
      <div className="register-shell">
        <aside className="register-art">
          <div className="brand"><span className="brand-icon"><PawPrint size={22}/></span><span>PetEncontrado</span></div>
          <div className="animals">🐶 🐱</div>
          <h2>Juntos por mais reencontros</h2>
          <p>Crie sua conta para publicar ocorrências, acompanhar avistamentos e ajudar animais a voltarem para casa.</p>
        </aside>

        <form className="register-form" onSubmit={submit}>
          <h1>Crie sua conta</h1>
          <p className="lead">É rápido, fácil e você ajuda muitos animais!</p>
          {error&&<div className="error">{error}</div>}

          <div className="form-grid">
            <div className="field full"><label>Nome completo</label><input name="name" required minLength={3} placeholder="Digite seu nome completo"/></div>
            <div className="field"><label>E-mail</label><input name="email" type="email" required placeholder="seuemail@exemplo.com"/></div>
            <div className="field"><label>Telefone (WhatsApp)</label><input name="whatsapp" placeholder="(11) 99999-9999"/></div>
            <div className="field"><label>Cidade</label><input name="city" placeholder="Sua cidade"/></div>
            <div className="field"><label>Estado</label><input name="state" maxLength={2} placeholder="UF"/></div>
            <div className="field"><label>Senha</label><div className="password-wrap"><input name="password" type={showPassword?'text':'password'} required minLength={8} placeholder="Crie uma senha"/><button type="button" className="btn" onClick={()=>setShowPassword(v=>!v)}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></div>
            <div className="field"><label>Confirmar senha</label><div className="password-wrap"><input name="confirm" type={showConfirm?'text':'password'} required placeholder="Confirme sua senha"/><button type="button" className="btn" onClick={()=>setShowConfirm(v=>!v)}>{showConfirm?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></div>
          </div>

          <label className="terms-row"><input name="terms" type="checkbox" required/><span>Li e aceito os <strong>Termos de Uso</strong> e a <strong>Política de Privacidade</strong>.</span></label>
          <button className="btn primary full-button" disabled={loading}>{loading?'Criando...':'Cadastrar'}</button>
          <p className="auth-footer">Já tem conta? <Link href="/login">Faça login</Link></p>
        </form>
      </div>
    </main>
  </>;
}
