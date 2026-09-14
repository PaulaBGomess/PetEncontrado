"use client";

import {useEffect,useMemo,useState} from 'react';
import {useParams,useRouter} from 'next/navigation';
import {CalendarDays,MapPin,MessageCircle} from 'lucide-react';
import {Header} from '@/components/Header';
import {Footer} from '@/components/Footer';
import {apiFetch,imageUrl} from '@/lib/api';
import {useAuth} from '@/components/AuthProvider';

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

  return <><Header/><main className="container section">
    <div className="detail-grid">
      <div>
        <div className="detail-image"><img src={imageUrl(a.images?.[0]?.url)} alt={a.name||a.species}/></div>
        {a.images?.length>1&&<div className="actions">{a.images.slice(1).map((i:any)=><img key={i.id} src={imageUrl(i.url)} alt="Foto adicional" style={{width:90,height:70,objectFit:'cover',borderRadius:10}}/>)}</div>}
      </div>
      <div className="detail-card">
        <div className="eyebrow">{a.species} • {a.breed||'Raça não informada'}</div>
        <h1>{a.name||'Animal encontrado'}</h1>
        <p className="meta"><MapPin size={17}/>{a.neighborhood}, {a.city}/{a.state}</p>
        <p className="meta"><CalendarDays size={17}/>{new Date(a.occurrenceDate).toLocaleDateString('pt-BR')}</p>
        <div className="facts"><div className="fact"><small>Situação</small><b>{a.situation}</b></div><div className="fact"><small>Cor</small><b>{a.color}</b></div><div className="fact"><small>Sexo</small><b>{a.sex}</b></div><div className="fact"><small>Porte</small><b>{a.size}</b></div></div>
        {a.description&&<p>{a.description}</p>}
        {a.specialMarks&&<p><b>Características:</b> {a.specialMarks}</p>}
        <hr style={{border:0,borderTop:'1px solid #e2e8f0',margin:'22px 0'}}/>
        <h3>Contato</h3><p>{a.contactName}</p>
        <div className="actions">{wa&&<a className="btn primary" href={wa} target="_blank"><MessageCircle size={18}/>Chamar no WhatsApp</a>}<button className="btn" onClick={()=>user?setShow(!show):router.push('/login')}>Eu vi este animal</button></div>
      </div>
    </div>

    {mapUrl&&<section className="panel" style={{marginTop:24}}>
      <h2 style={{marginTop:0}}>Local da ocorrência</h2>
      <p className="meta"><MapPin size={17}/>{a.street?`${a.street}, `:''}{a.neighborhood}, {a.city}/{a.state}{a.referencePoint?` • ${a.referencePoint}`:''}</p>
      <div style={{marginTop:12,borderRadius:14,overflow:'hidden',border:'1px solid #e2e8f0'}}>
        <iframe title="Localização da ocorrência no OpenStreetMap" src={mapUrl} style={{width:'100%',height:360,border:0}} loading="lazy"/>
      </div>
      <p className="form-sub" style={{marginTop:8}}>Localização aproximada informada no anúncio. Mapa fornecido pelo OpenStreetMap.</p>
    </section>}

    {show&&<SightingForm id={id} token={token||''} onDone={()=>setShow(false)}/>}  
  </main><Footer/></>
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
