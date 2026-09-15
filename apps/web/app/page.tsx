"use client";

import Link from 'next/link';
import { Heart, MapPin, Megaphone, Search, ShieldCheck, Share2, Users } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { AnimalCard } from '@/components/AnimalCard';

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => { apiFetch('/animals?limit=6').then(r => setData(r.data)).catch(() => {}); }, []);

  return <><Header/><main>
    <section className="hero hero-project">
      <div className="container hero-project-grid">
        <div className="hero-copy">
          <span className="hero-kicker">🐾 Animais conectam pessoas</span>
          <h1>Juntos por<br/><span>mais reencontros</span></h1>
          <p>O <b>PetEncontrado</b> conecta pessoas para localizar animais perdidos, divulgar animais encontrados e aumentar as chances de um final feliz.</p>
          <div className="actions"><Link className="btn primary" href="/animais"><Search size={18}/> Ver animais</Link><Link className="btn soft" href="/cadastrar-animal"><Megaphone size={18}/> Cadastrar ocorrência</Link></div>
          <div className="hero-benefits"><span><Users/> Comunidade engajada</span><span><ShieldCheck/> Mais segurança</span><span><Heart/> Histórias de reencontro</span><span><MapPin/> Impacto local</span></div>
        </div>
        <div className="hero-real-photo" role="img" aria-label="Cachorro e gato representando os animais atendidos pelo PetEncontrado"><div className="hero-photo-note">Todo animal<br/>merece voltar<br/>para casa ♡</div><div className="hero-photo-badge">🐾 Pequenos atos,<br/>grandes reencontros</div></div>
      </div>
    </section>

    <section className="section recent-section"><div className="container"><div className="section-head"><div><span className="section-label">ANIMAIS EM DESTAQUE</span><h2>Ajude um animal a voltar para casa</h2><p className="section-sub">Confira os registros mais recentes publicados pela comunidade.</p></div><Link className="btn" href="/animais">Ver todos</Link></div><div className="animal-grid">{data.map(a=><AnimalCard key={a.id} a={a}/>)}</div></div></section>

    <section className="section how-project" id="como-funciona"><div className="container"><div className="section-head"><div><span className="section-label">COMO FUNCIONA?</span><h2>É rápido, simples e pode fazer toda a diferença</h2></div></div><div className="project-steps">
      <article><div className="feature-icon"><Megaphone/></div><b>1. Cadastre</b><p>Registre um animal perdido ou encontrado com fotos e informações.</p></article>
      <article><div className="feature-icon"><Share2/></div><b>2. Compartilhe</b><p>A divulgação aumenta as chances de reencontro.</p></article>
      <article><div className="feature-icon"><Search/></div><b>3. Acompanhe</b><p>Consulte ocorrências e informações publicadas pela comunidade.</p></article>
      <article><div className="feature-icon"><Heart/></div><b>4. Reencontre</b><p>Juntos, ajudamos a transformar histórias com um final feliz.</p></article>
    </div></div></section>

    <section className="section about-project" id="sobre"><div className="container about-project-grid"><div className="about-project-photo"><span>Eles confiam<br/>em nós ♡</span></div><div><span className="section-label">SOBRE O PROJETO</span><h2>Mais que um sistema, um propósito</h2><p>O <b>PetEncontrado</b> nasceu da união entre tecnologia e responsabilidade social. A plataforma foi desenvolvida para facilitar a divulgação de animais perdidos e encontrados, centralizar informações importantes e aproximar tutores das pessoas que podem ajudar.</p><p>O projeto também incentiva a colaboração da comunidade, o cuidado responsável com os animais e o uso da tecnologia para gerar impacto positivo na cidade.</p><div className="project-values"><span><Users/><b>Comunidade</b><small>Participação colaborativa</small></span><span><MapPin/><b>Localização</b><small>Busca e mapa da ocorrência</small></span><span><Heart/><b>Reencontros</b><small>Um objetivo em comum</small></span></div></div></div></section>

    <section className="section project-purpose"><div className="container purpose-grid"><div><span className="section-label">OBJETIVOS</span><h2>Tecnologia a serviço da comunidade</h2><p>A proposta é tornar a busca por animais mais organizada, acessível e eficiente, oferecendo recursos como cadastro de ocorrências, fotografias, localização no mapa, avistamentos e gerenciamento dos anúncios.</p></div><div className="purpose-card"><ShieldCheck/><h3>Informação e responsabilidade</h3><p>Perfis, painel administrativo e recursos de segurança ajudam a manter a plataforma organizada e preparada para crescer.</p></div><div className="purpose-card"><MapPin/><h3>OpenStreetMap</h3><p>A localização da ocorrência ajuda a comunidade a entender onde o animal foi perdido ou encontrado, respeitando a privacidade do usuário.</p></div></div></section>

    <section className="project-cta"><div className="container"><div><h2>Faça parte dessa causa</h2><p>Cadastre um animal, compartilhe uma ocorrência ou ajude divulgando. Juntos, podemos fazer mais animais voltarem para casa.</p><Link className="btn primary" href="/cadastrar-animal"><Heart size={18}/> Quero ajudar</Link></div><strong>Conectando vidas,<br/>reunindo histórias. ♡</strong></div></section>
  </main><Footer/></>;
}
