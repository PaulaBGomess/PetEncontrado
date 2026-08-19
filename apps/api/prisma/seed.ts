import { PrismaClient, Role, Situation, Sex, Size } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main(){
  const adminPassword = await bcrypt.hash('Admin@123456', 12);
  const userPassword = await bcrypt.hash('Usuario@123456', 12);
  const admin = await prisma.user.upsert({where:{email:'admin@petencontrado.local'},update:{},create:{name:'Administrador',email:'admin@petencontrado.local',passwordHash:adminPassword,role:Role.ADMIN,city:'Palmas',state:'TO'}});
  const user = await prisma.user.upsert({where:{email:'paula@exemplo.com'},update:{},create:{name:'Paula',email:'paula@exemplo.com',passwordHash:userPassword,role:Role.USER,city:'Palmas',state:'TO',whatsapp:'63999999999'}});
  const count=await prisma.animal.count();
  if(count===0){
    await prisma.animal.createMany({data:[
      {ownerId:user.id,name:'Thor',species:'Cachorro',breed:'Shih-tzu',sex:Sex.MALE,size:Size.SMALL,color:'Branco com marrom',approximateAge:'4 anos',description:'Dócil, estava usando coleira azul.',specialMarks:'Mancha próxima ao olho direito.',situation:Situation.LOST,occurrenceDate:new Date('2026-08-15T12:00:00Z'),neighborhood:'Centro',city:'Palmas',state:'TO',referencePoint:'Praça central',contactName:'Paula',contactWhatsapp:'63999999999',contactEmail:'paula@exemplo.com'},
      {ownerId:admin.id,name:null,species:'Gato',breed:'Sem raça definida',sex:Sex.FEMALE,size:Size.SMALL,color:'Branco',description:'Gata encontrada e protegida temporariamente.',situation:Situation.FOUND,occurrenceDate:new Date('2026-08-16T12:00:00Z'),neighborhood:'Plano Diretor Sul',city:'Palmas',state:'TO',contactName:'Equipe PetEncontrado',contactEmail:'admin@petencontrado.local'}
    ]});
  }
  console.log('Seed concluído. Admin: admin@petencontrado.local / Admin@123456');
}
main().finally(()=>prisma.$disconnect());
