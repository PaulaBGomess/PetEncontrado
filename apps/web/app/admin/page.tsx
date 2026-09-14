"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, BadgeCheck, Clock3, PawPrint, Search, ShieldCheck, UserCog, Users } from 'lucide-react';
import { Header } from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';
import { apiFetch } from '@/lib/api';

export default function Admin() {
  const { user, token, loading } = useAuth();
  const [dash, setDash] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [animals, setAnimals] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  async function load() {
    if (!token) return;
    const [d, u, a, l] = await Promise.all([
      apiFetch('/admin/dashboard', {}, token),
      apiFetch('/admin/users', {}, token),
      apiFetch('/admin/animals', {}, token),
      apiFetch('/admin/audit-logs', {}, token),
    ]);
    setDash(d); setUsers(u); setAnimals(a); setLogs(l);
  }

  useEffect(() => {
    if (!loading && user?.role !== 'ADMIN') router.replace('/');
    if (token && user?.role === 'ADMIN') load();
  }, [loading, user, token]);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.name, u.email, u.city, u.state, u.role, u.status]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [query, users]);

  async function changeStatus(id: string, status: string) {
    if (!token) return;
    setBusy(`status-${id}`); setMessage('');
    try {
      await apiFetch(`/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }, token);
      setMessage('Status do usuário atualizado com sucesso.');
      await load();
    } catch (e: any) { setMessage(e.message || 'Não foi possível atualizar o status.'); }
    finally { setBusy(null); }
  }

  async function changeRole(id: string, role: string) {
    if (!token) return;
    const label = role === 'ADMIN' ? 'Administrador' : 'Usuário';
    if (!window.confirm(`Confirma a alteração deste perfil para ${label}?`)) return;
    setBusy(`role-${id}`); setMessage('');
    try {
      await apiFetch(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }, token);
      setMessage('Perfil do usuário atualizado com sucesso.');
      await load();
    } catch (e: any) { setMessage(e.message || 'Não foi possível atualizar o perfil.'); }
    finally { setBusy(null); }
  }

  async function closeAnimal(id: string) {
    if (!token) return;
    setBusy(`animal-${id}`); setMessage('');
    try {
      await apiFetch(`/animals/${id}/status`, { method: 'PATCH', body: JSON.stringify({ situation: 'CLOSED' }) }, token);
      setMessage('Anúncio encerrado com sucesso.');
      await load();
    } catch (e: any) { setMessage(e.message || 'Não foi possível encerrar o anúncio.'); }
    finally { setBusy(null); }
  }

  if (loading || user?.role !== 'ADMIN') return <div className="loading">Carregando...</div>;

  return <>
    <Header />
    <main className="container admin-page">
      <section className="admin-hero">
        <div>
          <span className="section-label">PAINEL ADMINISTRATIVO</span>
          <h1>Visão geral da plataforma</h1>
          <p>Gerencie usuários, perfis, ocorrências e acompanhe as principais atividades do PetEncontrado.</p>
        </div>
        <div className="admin-user-chip"><ShieldCheck size={20}/><span><b>{user.name}</b><small>Administrador</small></span></div>
      </section>

      {message && <div className="success" style={{marginTop:18}}>{message}</div>}

      {dash && <section className="admin-metrics">
        <div className="admin-metric"><div className="admin-metric-icon"><Users/></div><span><small>Usuários</small><b>{dash.users}</b></span></div>
        <div className="admin-metric"><div className="admin-metric-icon"><PawPrint/></div><span><small>Perdidos</small><b>{dash.lost}</b></span></div>
        <div className="admin-metric"><div className="admin-metric-icon"><BadgeCheck/></div><span><small>Encontrados</small><b>{dash.found}</b></span></div>
        <div className="admin-metric"><div className="admin-metric-icon"><Activity/></div><span><small>Reunidos</small><b>{dash.reunited}</b></span></div>
        <div className="admin-metric"><div className="admin-metric-icon"><UserCog/></div><span><small>Encerrados</small><b>{dash.closed}</b></span></div>
        <div className="admin-metric"><div className="admin-metric-icon"><Clock3/></div><span><small>Novos em 24h</small><b>{dash.newLast24h}</b></span></div>
      </section>}

      <section className="admin-section-card">
        <div className="admin-section-head">
          <div><span className="section-label">PERFIS</span><h2>Usuários cadastrados</h2><p>Altere permissões e controle o acesso à plataforma.</p></div>
          <div className="admin-search"><Search size={18}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Buscar usuário..."/></div>
        </div>
        <div className="table-wrap admin-table"><table><thead><tr><th>Nome</th><th>E-mail</th><th>Cidade</th><th>Anúncios</th><th>Perfil</th><th>Status</th><th>Ações</th></tr></thead><tbody>
          {filteredUsers.map((u)=><tr key={u.id}><td><b>{u.name}</b></td><td>{u.email}</td><td>{u.city||'-'}/{u.state||'-'}</td><td>{u._count?.animals??0}</td><td><select value={u.role} disabled={busy===`role-${u.id}`||u.id===user?.id} onChange={(e)=>changeRole(u.id,e.target.value)}><option value="USER">Usuário</option><option value="ADMIN">Administrador</option></select></td><td><span className={`admin-status ${u.status==='ACTIVE'?'active':'blocked'}`}>{u.status==='ACTIVE'?'Ativo':'Bloqueado'}</span></td><td><button className="btn" disabled={busy===`status-${u.id}`||u.id===user?.id} onClick={()=>changeStatus(u.id,u.status==='ACTIVE'?'BLOCKED':'ACTIVE')}>{u.status==='ACTIVE'?'Bloquear':'Ativar'}</button></td></tr>)}
        </tbody></table></div>
      </section>

      <section className="admin-section-card">
        <div className="admin-section-head"><div><span className="section-label">OCORRÊNCIAS</span><h2>Anúncios publicados</h2><p>Acompanhe os registros ativos e encerrados.</p></div></div>
        <div className="table-wrap admin-table"><table><thead><tr><th>Animal</th><th>Tutor</th><th>Cidade</th><th>Situação</th><th>Avistamentos</th><th>Ação</th></tr></thead><tbody>
          {animals.map((a)=><tr key={a.id}><td><Link href={`/animais/${a.id}`}><b>{a.name||a.species}</b></Link></td><td>{a.owner.name}</td><td>{a.city}/{a.state}</td><td><span className={`status ${String(a.situation).toLowerCase()}`}>{a.situation}</span></td><td>{a._count.sightings}</td><td>{a.situation!=='CLOSED'&&<button className="btn danger" disabled={busy===`animal-${a.id}`} onClick={()=>closeAnimal(a.id)}>Encerrar</button>}</td></tr>)}
        </tbody></table></div>
      </section>

      <section className="admin-section-card">
        <div className="admin-section-head"><div><span className="section-label">AUDITORIA</span><h2>Atividades administrativas</h2><p>Histórico das principais alterações realizadas pelos administradores.</p></div></div>
        <div className="table-wrap admin-table"><table><thead><tr><th>Data</th><th>Administrador</th><th>Ação</th><th>Entidade</th></tr></thead><tbody>
          {logs.map((l)=><tr key={l.id}><td>{new Date(l.createdAt).toLocaleString('pt-BR')}</td><td>{l.actor?.name||'-'}</td><td>{l.action}</td><td>{l.entityType} {l.entityId||''}</td></tr>)}
        </tbody></table></div>
      </section>
    </main>
  </>;
}
