"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BellRing, CircleCheckBig, Pencil, Plus, UserRound } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';
import { apiFetch } from '@/lib/api';
import { AnimalCard } from '@/components/AnimalCard';

export default function Mine(){
  const {user,token,loading}=useAuth();
  const [data,setData]=useState<any[]>([]);
  const [received,setReceived]=useState<any[]>([]);
  const router=useRouter();

  async function load(){
    if(token){
      setData(await apiFetch('/animals/mine/list',{},token));
      setReceived(await apiFetch('/me/received-sightings',{},token));
    }
  }

  useEffect(()=>{
    if(!loading&&!user)router.replace('/login');
    if(token)load();
  },[loading,user,token]);

  async function status(id:string,situation:string){
    await apiFetch(`/animals/${id}/status`,{method:'PATCH',body:JSON.stringify({situation})},token||undefined);
    load();
  }

  const reunited=useMemo(()=>data.filter(a=>a.situation==='REUNITED').length,[data]);
  const active=useMemo(()=>data.filter(a=>a.situation!=='CLOSED'&&a.situation!=='REUNITED').length,[data]);

  if(loading||!user)return <div className="loading">Carregando...</div>;

  return <>
    <Header/>
    <main className="container account-page">
      <section className="account-hero">
        <div>
          <span className="section-label">MINHA CONTA</span>
          <h1>Olá, {user.name} 👋</h1>
          <p>Gerencie seus anúncios, edite seus dados e acompanhe os avistamentos recebidos.</p>
        </div>
        <div className="account-actions">
          <Link className="btn primary" href="/cadastrar-animal"><Plus size={18}/>Nova ocorrência</Link>
          <Link className="btn" href="/perfil"><Pencil size={17}/>Editar perfil</Link>
        </div>
      </section>

      <section className="account-summary">
        <div className="account-summary-card"><UserRound/><span><small>Meus anúncios</small><b>{data.length}</b></span></div>
        <div className="account-summary-card"><BellRing/><span><small>Avistamentos recebidos</small><b>{received.length}</b></span></div>
        <div className="account-summary-card"><CircleCheckBig/><span><small>Animais reunidos</small><b>{reunited}</b></span></div>
        <div className="account-summary-card"><Plus/><span><small>Ocorrências ativas</small><b>{active}</b></span></div>
      </section>

      <section className="account-section">
        <div className="section-head"><div><span className="section-label">PUBLICAÇÕES</span><h2>Meus anúncios</h2><p className="section-sub">Atualize a situação do animal quando houver reencontro ou quando o anúncio não for mais necessário.</p></div></div>
        {data.length?<div className="animal-grid">{data.map(a=><div className="account-animal-item" key={a.id}><AnimalCard a={a}/><div className="account-card-actions"><Link className="btn" href={`/meus-anuncios/${a.id}/editar`}>Editar</Link>{a.situation!=='REUNITED'&&a.situation!=='CLOSED'&&<button className="btn" onClick={()=>status(a.id,'REUNITED')}>Marcar como reunido</button>}{a.situation!=='CLOSED'&&<button className="btn danger" onClick={()=>status(a.id,'CLOSED')}>Encerrar</button>}</div></div>)}</div>:<div className="empty">Você ainda não publicou anúncios. Clique em “Nova ocorrência” para começar.</div>}
      </section>

      <section className="account-section">
        <div className="section-head"><div><span className="section-label">COLABORAÇÃO</span><h2>Avistamentos recebidos</h2><p className="section-sub">Informações enviadas por outros usuários sobre os animais publicados por você.</p></div></div>
        {received.length?<div className="table-wrap account-table"><table><thead><tr><th>Animal</th><th>Quem informou</th><th>Contato protegido</th><th>Local</th><th>Data</th><th>Observação</th></tr></thead><tbody>{received.map(s=><tr key={s.id}><td><b>{s.animal.name||s.animal.species}</b></td><td>{s.reporter.name}</td><td>{s.reporter.whatsapp?<a href={`https://wa.me/55${String(s.reporter.whatsapp).replace(/\D/g,'')}`} target="_blank" rel="noreferrer">WhatsApp</a>:s.reporter.email?<a href={`mailto:${s.reporter.email}`}>E-mail</a>:'Não informado'}</td><td>{s.neighborhood}, {s.city}/{s.state}</td><td>{new Date(s.sightingDate).toLocaleDateString('pt-BR')}</td><td>{s.description||'-'}</td></tr>)}</tbody></table></div>:<div className="empty">Nenhum avistamento recebido até agora.</div>}
      </section>
    </main>
  </>;
}