"use client";

import {FormEvent,useState} from 'react';
import Link from 'next/link';
import {Header} from '@/components/Header';
import {apiFetch} from '@/lib/api';

export default function Forgot(){
  const[msg,setMsg]=useState('');
  const[token,setToken]=useState('');
  const[loading,setLoading]=useState(false);

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setToken('');
    const f=new FormData(e.currentTarget);
    try{
      const r=await apiFetch('/auth/forgot-password',{method:'POST',body:JSON.stringify({email:f.get('email')})});
      setMsg(r.message);
      if(r.resetToken)setToken(r.resetToken);
    }catch(e:any){
      setMsg(e.message);
    }finally{
      setLoading(false);
    }
  }

  return <>
    <Header/>
    <div className="form-shell">
      <form className="panel" onSubmit={submit} style={{maxWidth:520,margin:'0 auto'}}>
        <h1 className="form-title">Recuperar senha</h1>
        <p className="form-sub">Informe o e-mail cadastrado. Se a conta existir, enviaremos um link seguro para redefinir sua senha. O link expira em 30 minutos.</p>
        {msg&&<div className="success">{msg}</div>}
        <div className="field">
          <label>E-mail</label>
          <input name="email" type="email" required autoComplete="email" placeholder="voce@email.com"/>
        </div>
        <div className="actions">
          <button className="btn primary" disabled={loading}>{loading?'Enviando...':'Enviar link de recuperação'}</button>
          <Link className="btn" href="/login">Voltar ao login</Link>
        </div>
        {token&&<div className="panel" style={{marginTop:18}}>
          <b>Modo de desenvolvimento</b>
          <p className="form-sub">O SMTP ainda não está configurado. Use temporariamente o link abaixo para testar o fluxo.</p>
          <Link href={`/redefinir-senha?token=${token}`}>Abrir redefinição de senha</Link>
        </div>}
      </form>
    </div>
  </>;
}
