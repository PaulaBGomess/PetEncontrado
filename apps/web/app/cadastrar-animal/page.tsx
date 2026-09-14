"use client";

import {FormEvent,useMemo,useState} from 'react';
import {useSearchParams,useRouter} from 'next/navigation';
import {MapPin,Navigation} from 'lucide-react';
import {Header} from '@/components/Header';
import {useAuth} from '@/components/AuthProvider';
import {apiFetch} from '@/lib/api';

export default function CadastrarAnimal(){
  const{user,token,loading:authLoading}=useAuth();
  const p=useSearchParams();
  const router=useRouter();
  const[error,setError]=useState('');
  const[loading,setLoading]=useState(false);
  const[locating,setLocating]=useState(false);
  const[locationMessage,setLocationMessage]=useState('');
  const[latitude,setLatitude]=useState<number|null>(null);
  const[longitude,setLongitude]=useState<number|null>(null);

  const mapUrl=useMemo(()=>{
    if(latitude===null||longitude===null)return '';
    const delta=0.01;
    const bbox=[longitude-delta,latitude-delta,longitude+delta,latitude+delta].join(',');
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  },[latitude,longitude]);

  if(authLoading)return <div className="loading">Carregando...</div>;
  if(!user){router.replace('/login');return null}

  function useCurrentLocation(){
    setLocationMessage('');
    if(!navigator.geolocation){
      setLocationMessage('Seu navegador não oferece suporte à geolocalização.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      position=>{
        setLatitude(Number(position.coords.latitude.toFixed(7)));
        setLongitude(Number(position.coords.longitude.toFixed(7)));
        setLocationMessage('Localização capturada. Confira o ponto no mapa antes de publicar.');
        setLocating(false);
      },
      ()=>{
        setLocationMessage('Não foi possível obter sua localização. Você pode continuar preenchendo o endereço manualmente.');
        setLocating(false);
      },
      {enableHighAccuracy:true,timeout:10000,maximumAge:30000}
    );
  }

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setLoading(true);setError('');
    const f=new FormData(e.currentTarget);
    try{
      const a=await apiFetch('/animals',{method:'POST',body:f},token||undefined);
      router.push(`/animais/${a.id}`)
    }catch(e:any){setError(e.message)}finally{setLoading(false)}
  }

  return <><Header/><div className="form-shell"><form className="panel" onSubmit={submit}>
    <h1 className="form-title">Cadastrar ocorrência</h1>
    <p className="form-sub">Preencha os dados com o máximo de precisão possível.</p>
    {error&&<div className="error">{error}</div>}
    <div className="form-grid">
      <div className="field"><label>Situação</label><select name="situation" defaultValue={p.get('situation')||'LOST'}><option value="LOST">Animal perdido</option><option value="FOUND">Animal encontrado</option></select></div>
      <div className="field"><label>Nome do animal</label><input name="name" placeholder="Se souber"/></div>
      <div className="field"><label>Espécie</label><select name="species" required><option value="Cachorro">Cachorro</option><option value="Gato">Gato</option><option value="Pássaro">Pássaro</option><option value="Outro">Outro</option></select></div>
      <div className="field"><label>Raça</label><input name="breed"/></div>
      <div className="field"><label>Sexo</label><select name="sex"><option value="UNKNOWN">Não identificado</option><option value="MALE">Macho</option><option value="FEMALE">Fêmea</option></select></div>
      <div className="field"><label>Porte</label><select name="size"><option value="UNKNOWN">Não identificado</option><option value="SMALL">Pequeno</option><option value="MEDIUM">Médio</option><option value="LARGE">Grande</option></select></div>
      <div className="field"><label>Cor</label><input name="color" required/></div>
      <div className="field"><label>Idade aproximada</label><input name="approximateAge"/></div>
      <div className="field"><label>Data da ocorrência</label><input name="occurrenceDate" type="date" required/></div>
      <div className="field"><label>Rua</label><input name="street"/></div>
      <div className="field"><label>Bairro</label><input name="neighborhood" required/></div>
      <div className="field"><label>Cidade</label><input name="city" required/></div>
      <div className="field"><label>Estado</label><input name="state" required maxLength={2}/></div>
      <div className="field"><label>Ponto de referência</label><input name="referencePoint"/></div>

      <div className="field full">
        <label>Localização no mapa</label>
        <p className="form-sub">Opcional. Use a localização do dispositivo para registrar o ponto aproximado onde o animal foi perdido ou encontrado.</p>
        <input type="hidden" name="latitude" value={latitude??''}/>
        <input type="hidden" name="longitude" value={longitude??''}/>
        <div className="actions" style={{marginTop:8}}>
          <button type="button" className="btn" onClick={useCurrentLocation} disabled={locating}>
            <Navigation size={18}/>{locating?'Localizando...':'Usar minha localização'}
          </button>
          {latitude!==null&&longitude!==null&&<span className="meta"><MapPin size={17}/>{latitude.toFixed(5)}, {longitude.toFixed(5)}</span>}
        </div>
        {locationMessage&&<div className={latitude!==null?'success':'error'} style={{marginTop:10}}>{locationMessage}</div>}
        {mapUrl&&<div style={{marginTop:14,borderRadius:14,overflow:'hidden',border:'1px solid #e2e8f0'}}>
          <iframe title="Localização da ocorrência no OpenStreetMap" src={mapUrl} style={{width:'100%',height:320,border:0}} loading="lazy"/>
        </div>}
        {latitude!==null&&longitude!==null&&<p className="form-sub" style={{marginTop:8}}>Mapa fornecido pelo OpenStreetMap. A localização pode ser aproximada conforme a precisão do dispositivo.</p>}
      </div>

      <div className="field full"><label>Descrição</label><textarea name="description" rows={4}/></div>
      <div className="field full"><label>Características especiais</label><textarea name="specialMarks" rows={3}/></div>
      <div className="field full"><label>Fotos (até 5, JPG/PNG/WEBP, 5MB cada)</label><input type="file" name="images" accept="image/jpeg,image/png,image/webp" multiple/></div>
      <div className="field"><label>Responsável</label><input name="contactName" defaultValue={user.name} required/></div>
      <div className="field"><label>WhatsApp</label><input name="contactWhatsapp"/></div>
      <div className="field"><label>Telefone</label><input name="contactPhone"/></div>
      <div className="field"><label>E-mail</label><input type="email" name="contactEmail" defaultValue={user.email}/></div>
    </div>
    <button className="btn primary" disabled={loading}>{loading?'Publicando...':'Publicar ocorrência'}</button>
  </form></div></>
}
