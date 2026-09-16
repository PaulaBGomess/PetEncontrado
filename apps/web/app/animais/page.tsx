"use client";

import { FormEvent, Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AnimalCard } from '@/components/AnimalCard';
import { apiFetch } from '@/lib/api';

function AnimalsContent(){
  const params=useSearchParams();
  const[data,setData]=useState<any[]>([]);
  const[loading,setLoading]=useState(true);
  const[query,setQuery]=useState(params.toString());

  async function load(q=query){
    setLoading(true);
    try{const r=await apiFetch(`/animals?${q}`);setData(r.data)}finally{setLoading(false)}
  }

  useEffect(()=>{load(params.toString())},[]);

  function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    const f=new FormData(e.currentTarget);
    const q=new URLSearchParams();
    for(const[k,v]of f.entries())if(v)q.set(k,String(v));
    setQuery(q.toString());
    load(q.toString());
  }

  return <>
    <Header/>
    <main className="container animals-page">
      <div className="page-title">
        <span className="section-label">ENCONTRE OU AJUDE A ENCONTRAR</span>
        <h1>Animais perdidos e encontrados</h1>
        <p className="section-sub" style={{margin:'10px auto 0'}}>Use os filtros para localizar ocorrências por situação, tipo e cidade.</p>
      </div>

      <form className="animals-toolbar" onSubmit={submit}>
        <div className="search-wide" style={{position:'relative'}}>
          <Search size={17} style={{position:'absolute',left:12,top:13,color:'#7b8794'}}/>
          <input name="q" placeholder="Buscar por animal, local ou bairro..." style={{paddingLeft:36}}/>
        </div>
        <select name="situation" defaultValue={params.get('situation')||''}>
          <option value="">Todos os status</option>
          <option value="LOST">Perdidos</option>
          <option value="FOUND">Encontrados</option>
          <option value="REUNITED">Reunidos</option>
        </select>
        <input name="species" defaultValue={params.get('species')||''} placeholder="Espécie"/>
        <input name="breed" defaultValue={params.get('breed')||''} placeholder="Raça"/>
        <input name="color" defaultValue={params.get('color')||''} placeholder="Cor"/>
        <input name="city" defaultValue={params.get('city')||''} placeholder="Cidade"/>
        <input name="neighborhood" defaultValue={params.get('neighborhood')||''} placeholder="Bairro"/>
        <select name="sex" defaultValue={params.get('sex')||''}><option value="">Todos os sexos</option><option value="MALE">Macho</option><option value="FEMALE">Fêmea</option><option value="UNKNOWN">Não informado</option></select>
        <select name="size" defaultValue={params.get('size')||''}><option value="">Todos os portes</option><option value="SMALL">Pequeno</option><option value="MEDIUM">Médio</option><option value="LARGE">Grande</option><option value="UNKNOWN">Não informado</option></select>
        <button className="btn primary"><Search size={16}/> Buscar</button>
        <Link className="btn" href="/animais">Limpar filtros</Link>
      </form>

      <div className="filter-chips">
        <Link className="filter-chip" href="/animais">Todos</Link>
        <Link className="filter-chip lost" href="/animais?situation=LOST">Perdidos</Link>
        <Link className="filter-chip found" href="/animais?situation=FOUND">Encontrados</Link>
        <Link className="filter-chip reunited" href="/animais?situation=REUNITED">Reunidos</Link>
      </div>

      {loading?<div className="loading">Carregando...</div>:data.length?<div className="animal-grid">{data.map(a=><AnimalCard key={a.id} a={a}/>)}</div>:<div className="empty">Nenhuma ocorrência encontrada.</div>}
    </main>
    <Footer/>
  </>;
}

export default function Animais(){
  return <Suspense fallback={<div className="loading">Carregando animais...</div>}><AnimalsContent/></Suspense>;
}