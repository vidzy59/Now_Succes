const express=require('express');
const fs=require('fs');
const app=express();
app.use(express.json());
app.use(express.static('public'));
const G=JSON.parse(fs.readFileSync('data/gadgets.json','utf8'));
function sc(g){
  let p=g.chipsetTier*.7 + Math.min(20,(g.ram||0)*1.5);
  if(g.antutu>1500000)p+=8; else if(g.antutu>800000)p+=4; else if(g.antutu>500000)p+=2;
  p=Math.max(20,Math.min(99,Math.round(p)));
  let c=50;
  if(g.category==='smartphone') c=Math.round(g.chipsetTier*.4 + g.rating*8);
  else if(g.category==='laptop') c=Math.round(55 + (g.specs.some(s=>s.group==='Layar')?16:0) + g.chipsetTier*.12);
  else c=Math.round(48 + g.chipsetTier*.22 + g.rating*3);
  if(c<35)c=35; if(c>99)c=99;
  let d=0;
  if(g.category==='smartphone') d=g.battery/55; else if(g.category==='tablet') d=g.battery/95; else if(g.category==='smartwatch') d=55+g.rating*4; else d=50+(g.battery||50)*.4;
  d=Math.max(40,Math.min(99,Math.round(d)));
  let pr=58;
  if(g.price_idr<=4000000) pr=95; else if(g.price_idr<=6000000) pr=88; else if(g.price_idr<=8000000) pr=82; else if(g.price_idr<=13000000) pr=74; else if(g.price_idr<=19000000) pr=66;
  let v=Math.max(30,Math.min(99,Math.round(pr*.5 + p*.25 + g.rating*2)));
  let t=Math.max(20,Math.min(99,Math.round(p*.34 + c*.26 + d*.2 + v*.2)));
  return {p,c,d,v,t};
}
function f(g){ return {...g, cat:g.category==='smartphone'?'HP':g.category==='laptop'?'Laptop':g.category==='tablet'?'Tablet':'Jam', harga:'Rp '+g.price_idr.toLocaleString('id-ID'), s:sc(g)}; }
app.get('/api/list',(req,res)=>res.json(G.map(f)));
app.get('/api/art',(req,res)=>res.json(A));
app.listen(3000,()=>{});
