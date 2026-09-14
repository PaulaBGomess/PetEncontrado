"use client";

import Link from 'next/link';
import { Heart, MapPin, Megaphone, Search, Users } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { AnimalCard } from '@/components/AnimalCard';

export default function Home() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/animals?limit=6').then(r => setData(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <main>
        <section className="hero hero-reference">
          <div className="container hero-reference-grid">
            <div className="hero-copy">
              <span className="hero-kicker">🐾 Uma rede que aproxima famílias</span>
              <h1>Ajude a <span>reunir</span><br />quem se perdeu<br />com quem encontrou.</h1>
              <p>Conectamos pessoas para localizar animais perdidos, divulgar animais encontrados e aumentar as chances de reencontro.</p>
              <div className="actions">
                <Link className="btn primary" href="/animais"><Search size={18} /> Ver animais</Link>
                <Link className="btn soft" href="/cadastrar-animal"><Megaphone size={18} /> Cadastrar ocorrência</Link>
              </div>
            </div>

            <div className="hero-illustration" aria-label="Ilustração do PetEncontrado">
              <div className="hero-paw">🐾</div>
              <div className="hero-pet hero-dog">🐕</div>
              <div className="hero-pet hero-cat">🐈</div>
              <span className="hero-heart one">♡</span>
              <span className="hero-heart two">♡</span>
            </div>
          </div>
        </section>

        <section className="home-actions">
          <div className="container grid3">
            <article className="home-action-card">
              <div className="feature-icon"><Search /></div>
              <div><h3>Procure</h3><p>Encontre animais perdidos ou encontrados na sua região.</p></div>
            </article>
            <article className="home-action-card">
              <div className="feature-icon"><Megaphone /></div>
              <div><h3>Divulgue</h3><p>Cadastre uma ocorrência e compartilhe informações importantes.</p></div>
            </article>
            <article className="home-action-card">
              <div className="feature-icon"><Heart /></div>
              <div><h3>Reúna</h3><p>Ajude um animal a reencontrar sua família e faça a diferença.</p></div>
            </article>
          </div>
        </section>

        <section className="impact-strip">
          <div className="container impact-grid">
            <div><Users size={22} /><span><b>Rede colaborativa</b><small>Pessoas ajudando pessoas</small></span></div>
            <div><Megaphone size={22} /><span><b>Ocorrências</b><small>Perdidos e encontrados</small></span></div>
            <div><MapPin size={22} /><span><b>Localização</b><small>Busca por cidade e bairro</small></span></div>
            <div><Heart size={22} /><span><b>Reencontros</b><small>Histórias com final feliz</small></span></div>
          </div>
        </section>

        <section className="section" id="como-funciona">
          <div className="container">
            <div className="section-head centered">
              <div><span className="section-label">COMO FUNCIONA</span><h2>Simples, rápido e colaborativo</h2><p className="section-sub">O PetEncontrado organiza as informações para facilitar a busca e o reencontro.</p></div>
            </div>
            <div className="grid3">
              <div className="panel feature"><div className="feature-icon"><Users /></div><h3>1. Crie sua conta</h3><p>Cadastre-se para publicar ocorrências e acompanhar seus registros.</p></div>
              <div className="panel feature"><div className="feature-icon"><Megaphone /></div><h3>2. Publique ou pesquise</h3><p>Informe características, fotos, data e localização do animal.</p></div>
              <div className="panel feature"><div className="feature-icon"><Heart /></div><h3>3. Ajude no reencontro</h3><p>Compartilhe informações e avistamentos para aproximar animal e tutor.</p></div>
            </div>
          </div>
        </section>

        <section className="section recent-section" id="dicas">
          <div className="container">
            <div className="section-head">
              <div><span className="section-label">ANIMAIS</span><h2>Ocorrências recentes</h2><p className="section-sub">Veja alguns dos registros publicados recentemente.</p></div>
              <Link className="btn" href="/animais">Ver todos</Link>
            </div>
            <div className="animal-grid">{data.map(a => <AnimalCard key={a.id} a={a} />)}</div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
