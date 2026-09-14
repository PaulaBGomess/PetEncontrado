"use client";

import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';
import {useParams,useRouter} from 'next/navigation';
import {ArrowLeft,CalendarDays,MapPin,MessageCircle,Share2} from 'lucide-react';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {apiFetch,imageUrl} from '@/lib/api';
import {useAuth} from '@/components/AuthProvider';

const labels:any={LOST:'Perdido',FOUND:'Encontrado',REUNITED:'Reunido',CLOSED:'Encerrado',MALE:'Macho',FEMALE:'Fêmea',UNKNOWN:'Não informado',SMALL:'Pequeno',MEDIUM:'Médio',LARGE:'Grande'};

export default function Detail(){
  const{id}=useParams<{id:string}>();
  const[a,setA]=useState<any>(null);
  const[show,setShow]=useState(false);
  const{user,token}=useAuth();
  const router=useRouter();

  useEffect(()=>{apiFetch(`/animals/${id}`).then(setA)},[id]);

  const mapUrl=useMemo(()=>{
    if(!a?.latitude||!a?.longitude)return '';
    const latitude=Number(a.latitude),longitude=Number(a.longitude),delta=0.01;
    if(Number.isNaN(latitude)||Number.isNaN(longitude))return '';
    const bbox=[longitude-delta,latitude-delta,longitude+delta,latitude+delta].join(',');
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  },[a?.latitude,a?.longitude]);

  if(!a)return <div className="loading">Carregando...</div>;

  const phone=(a.contactWhatsapp||a.contactPhone||'').replace(/\D/g,'');
  const wa=phone?`https://wa.me/55${phone}?text=${encodeURIComponent(`Olá! Vi o anúncio do ${a.name||a.species} no PetEncontrado.`)}`:'';

  async function share(){
    const data={title:`${a.name||a.species} - PetEncontrado`,text:`Veja esta ocorrência no PetEncontrado: ${a.name||a.species}`,url:window.location.href};
    if(navigator.share){await navigator.share(data).catch(()=>{})}else{await navigator.clipboard?.writeText(window.location.href)}
  }

  return <>
    <Header/>
    <main className="container detail-page">
      <Link href="/animais" className="detail-top-link"><ArrowLeft size={17}/>Voltar para a lista</Link>

      <div className="detail-reference-grid">
        <div className="detail-gallery">
          <div className="detail-image" style={{position:'relative'}}>
            <img src={imageUrl(a.images?.[0]?.url)} alt={a.name||a.species}/>
            <span className={`status ${String(a.situation).toLowerCase()}`}>{labels[a.situation]||a.situation}</span>
          </div>
          {a.images?.length>1&&<div className="thumb-row">{a.images.map((i:any)=><img key={i.id} src={imageUrl(i.url)} alt="Foto do animal"/>)}</div>}
        </div>

        <section className="detail-info-card">
          <div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'start'}}>
            <div><h1>{a.name||'Animal encontrado'}</h1></div>
            <button className="btn" onClick={share}><Share2 size={17}/>Compartilhar</button>
          </div>

          <div className="detail-status-row">
            <span>🐾 {labels[a.sex]||a.sex}</span>
            <span>🐶 {a.breed||'SRD'}</span>
            <span>📏 {labels[a.size]||a.size}</span>
            {a.approximateAge&&<span>🕒 {a.approximateAge}</span>}
          </div>

          <div className="detail-line"><strong>Local</strong><span><MapPin size={15} style={{verticalAlign:'middle',marginRight:5}}/>{a.street?`${a.street}, `:''}{a.neighborhood}, {a.city}/{a.state}</span></div>
          <div className="detail-line"><strong>Data</strong><span><CalendarDays size={15} style={{verticalAlign:'middle',marginRight:5}}/>{new Date(a.occurrenceDate).toLocaleDateString('pt-BR')}</span></div>
          <div className="detail-line"><strong>Descrição</strong><span>{a.description||'Nenhuma descrição adicional informada.'}</span></div>
          {a.referencePoint&&<div className="detail-line"><strong>Referência</strong><span>{a.referencePoint}</span></div>}

          <div className="contact-box">
            <h3>Contato</h3>
            {wa&&<a className="btn primary" href={wa} target="_blank"><MessageCircle size={18}/>{a.contactWhatsapp||a.contactPhone}</a>}
            <button className="btn soft" onClick={()=>user?setShow(!show):router.push('/login')}>Enviar informação / Vi este animal</button>
          </div>

          <div className="additional-tags">
            {a.color&&<span>{a.color}</span>}
            {a.specialMarks&&<span>{a.specialMarks}</span>}
            <span>{labels[a.situation]||a.situation}</span>
          </div>
        </section>
      </div>

      {mapUrl&&<section className="sightings-box">
        <h2 style={{marginTop:0}}>Local da ocorrência</h2>
        <p className="meta"><MapPin size={17}/>{a.neighborhood}, {a.city}/{a.state}</p>
        <div className="map-preview"><iframe title="Localização da ocorrência no OpenStreetMap" src={mapUrl} style={{width:'100%',height:330,border:0}} loading="lazy"/></div>
        <p className="form-sub" style={{marginTop:8}}>Localização aproximada informada no anúncio. Mapa fornecido pelo OpenStreetMap.</p>
      </section>}

      {a.sightings?.length>0&&<section className="sightings-box">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h2 style={{margin:0}}>Avistamentos ({a.sightings.length})</h2></div>
        {a.sightings.slice(0,4).map((s:any)=><div className="sighting-item" key={s.id}><strong>{new Date(s.sightingDate).toLocaleDateString('pt-BR')} {s.approximateTime?`às ${s.approximateTime}`:''} • {s.neighborhood}, {s.city}/{s.state}</strong><p style={{marginBottom:0,color:'#64748b'}}>{s.description||'Avistamento registrado.'}</p></div>)}
      </section>}

      {show&&<SightingForm id={id} token={token||''} onDone={()=>setShow(false)}/>}  
    </main>
    <Footer/>
  </>;
}

function SightingForm({id,token,onDone}:{id:string;token:string;onDone:()=>void}){
  const[msg,setMsg]=useState('');
  async function submit(e:any){
    e.preventDefault();
    const f=new FormData(e.currentTarget);
    try{await apiFetch(`/animals/${id}/sightings`,{method:'POST',body:f},token);setMsg('Informação enviada com sucesso.');e.currentTarget.reset()}catch(err:any){setMsg(err.message)}
  }
  return <form className="panel" style={{marginTop:24}} onSubmit={submit}>
    <h2>Registrar avistamento</h2>{msg&&<div className="success">{msg}</div>}
    <div className="form-grid"><div className="field"><label>Data</label><input name="sightingDate" type="date" required/></div><div className="field"><label>Horário aproximado</label><input name="approximateTime" type="time"/></div><div className="field"><label>Bairro</label><input name="neighborhood" required/></div><div className="field"><label>Cidade</label><input name="city" required/></div><div className="field"><label>Estado</label><input name="state" maxLength={2} required/></div><div className="field"><label>Ponto de referência</label><input name="referencePoint"/></div><div className="field full"><label>Observação</label><textarea name="description"/></div><div className="field full"><label>Foto opcional</label><input type="file" name="photo" accept="image/jpeg,image/png,image/webp"/></div></div>
    <div className="actions"><button className="btn primary">Enviar informação</button><button type="button" className="btn" onClick={onDone}>Fechar</button></div>
  </form>
}
