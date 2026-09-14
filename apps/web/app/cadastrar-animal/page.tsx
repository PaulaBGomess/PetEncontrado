"use client";

import {FormEvent,Suspense,useMemo,useState} from 'react';
import {useSearchParams,useRouter} from 'next/navigation';
import {MapPin,Navigation,UploadCloud} from 'lucide-react';
import {Header} from '@/components/Header';
import {useAuth} from '@/components/AuthProvider';
import {apiFetch} from '@/lib/api';

function OccurrenceContent(){
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
    if(!navigator.geolocation){setLocationMessage('Seu navegador não oferece suporte à geolocalização.');return}
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
    try{const a=await apiFetch('/animals',{method:'POST',body:f},token||undefined);router.push(`/animais/${a.id}`)}catch(e:any){setError(e.message)}finally{setLoading(false)}
  }

  return <>
    <Header/>
    <main className="container occurrence-page">
      <div className="occurrence-head">
        <h1>Cadastrar ocorrência</h1>
        <p>Informe os dados do animal para ajudar a encontrá-lo ou encontrar seu tutor.</p>
      </div>
      {error&&<div className="error">{error}</div>}

      <form onSubmit={submit}>
        <div className="occurrence-layout">
          <section className="occurrence-main">
            <div className="form-section">
              <h2>1. Informações básicas</h2>
              <div className="situation-grid">
                <div className="situation-choice"><label>Situação</label><select name="situation" defaultValue={p.get('situation')||'LOST'}><option value="LOST">🔺 Perdido</option><option value="FOUND">✅ Encontrado</option></select></div>
                <div className="field"><label>Nome do animal (se tiver)</label><input name="name" placeholder="Ex: Mel, Bob"/></div>
              </div>
              <div className="form-grid">
                <div className="field"><label>Espécie</label><select name="species" required><option value="Cachorro">Cachorro</option><option value="Gato">Gato</option><option value="Pássaro">Pássaro</option><option value="Outro">Outro</option></select></div>
                <div className="field"><label>Raça</label><input name="breed" placeholder="Ex: SRD, Labrador"/></div>
                <div className="field"><label>Sexo</label><select name="sex"><option value="UNKNOWN">Não identificado</option><option value="MALE">Macho</option><option value="FEMALE">Fêmea</option></select></div>
                <div className="field"><label>Porte</label><select name="size"><option value="UNKNOWN">Não identificado</option><option value="SMALL">Pequeno</option><option value="MEDIUM">Médio</option><option value="LARGE">Grande</option></select></div>
                <div className="field"><label>Cor</label><input name="color" required/></div>
                <div className="field"><label>Idade aproximada</label><input name="approximateAge" placeholder="Ex: 3 anos"/></div>
              </div>
            </div>

            <div className="form-section">
              <h2>2. Local e data</h2>
              <div className="form-grid">
                <div className="field"><label>Data da ocorrência</label><input name="occurrenceDate" type="date" required/></div>
                <div className="field"><label>Rua</label><input name="street" placeholder="Rua ou avenida"/></div>
                <div className="field"><label>Bairro</label><input name="neighborhood" required/></div>
                <div className="field"><label>Cidade</label><input name="city" required/></div>
                <div className="field"><label>Estado</label><input name="state" required maxLength={2}/></div>
                <div className="field"><label>Ponto de referência</label><input name="referencePoint"/></div>
              </div>

              <input type="hidden" name="latitude" value={latitude??''}/><input type="hidden" name="longitude" value={longitude??''}/>
              <div className="actions" style={{marginTop:16}}>
                <button type="button" className="btn soft" onClick={useCurrentLocation} disabled={locating}><Navigation size={18}/>{locating?'Localizando...':'Usar minha localização'}</button>
                {latitude!==null&&longitude!==null&&<span className="meta"><MapPin size={17}/>{latitude.toFixed(5)}, {longitude.toFixed(5)}</span>}
              </div>
              {locationMessage&&<div className={latitude!==null?'success':'error'} style={{marginTop:10}}>{locationMessage}</div>}
              {mapUrl&&<div className="map-preview"><iframe title="Localização da ocorrência no OpenStreetMap" src={mapUrl} style={{width:'100%',height:280,border:0}} loading="lazy"/></div>}
            </div>

            <div className="form-section">
              <h2>3. Descrição</h2>
              <div className="field"><label>Descreva o animal</label><textarea name="description" rows={4} placeholder="Cor, marcas, características, comportamento..."/></div>
              <div className="field" style={{marginTop:14}}><label>Características especiais</label><textarea name="specialMarks" rows={3} placeholder="Coleira, cicatriz, microchip, necessidades especiais..."/></div>
            </div>
          </section>

          <aside className="occurrence-side">
            <div className="occurrence-side-card">
              <h2 style={{fontSize:17,marginTop:0}}>4. Fotos</h2>
              <div className="upload-box"><UploadCloud size={34} color="#078b72"/><p><strong>Adicione fotos do animal</strong></p><p className="form-sub">Máx. 5 fotos, JPG/PNG/WEBP</p><input type="file" name="images" accept="image/jpeg,image/png,image/webp" multiple/></div>
            </div>

            <div className="occurrence-side-card">
              <h2 style={{fontSize:17,marginTop:0}}>5. Contato</h2>
              <div className="field"><label>Seu nome</label><input name="contactName" defaultValue={user.name} required/></div>
              <div className="field" style={{marginTop:12}}><label>WhatsApp</label><input name="contactWhatsapp" placeholder="(11) 99999-9999"/></div>
              <div className="field" style={{marginTop:12}}><label>Telefone</label><input name="contactPhone"/></div>
              <div className="field" style={{marginTop:12}}><label>E-mail</label><input type="email" name="contactEmail" defaultValue={user.email}/></div>
              <p className="form-sub" style={{marginTop:14}}>Seu contato será exibido para quem encontrar ou reconhecer o animal.</p>
            </div>
          </aside>
        </div>

        <div className="occurrence-actions"><button type="button" className="btn" onClick={()=>router.back()}>Cancelar</button><button className="btn primary" disabled={loading}>{loading?'Publicando...':'Publicar ocorrência'}</button></div>
      </form>
    </main>
  </>;
}

export default function CadastrarAnimal(){
  return <Suspense fallback={<div className="loading">Carregando formulário...</div>}><OccurrenceContent/></Suspense>;
}
