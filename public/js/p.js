let data=[];
async function init(){ data=await fetch('/api/list').then(r=>r.json()); route();}
function route(){
  const h=location.hash||'#/';
  const p=h.slice(1).split('?')[0];
  if(p==='/') home();
  else if(p==='/katalog') kat();
  else if(p==='/banding') band();
  else home();
}
function home(){
  const top=data.slice().sort((a,b)=>b.s.t-a.s.t).slice(0,4);
  document.getElementById('app').innerHTML='<h3>Terbaik</h3><div class="grid">'+top.map(c=>card(c)).join('')+'</div>';
}
function kat(){
  document.getElementById('app').innerHTML='<div class="grid">'+data.map(c=>card(c)).join('')+'</div>';
}
function card(c){ return '<div class="card"><div class="title">'+c.name+'</div><div class="small">'+c.cat+' · '+c.brand+'</div><div>'+c.harga+' · Skor '+c.s.t+'</div></div>'; }
function band(){
  let s1='', s2='', s3='';
  data.forEach(x=>{ const o='<option value="'+x.id+'">'+x.name+' ('+x.cat+')</option>'; s1+=o; s2+=o; s3+=o; });
  document.getElementById('app').innerHTML='<div class="sel"><select id="a">'+s1+'</select> <select id="b">'+s2+'</select> <select id="c">'+s3+'</select> <button onclick="go()">Banding</button></div><div id="res"></div>';
  window.go=async function(){
    const ids=[document.getElementById('a').value, document.getElementById('b').value, document.getElementById('c').value].filter(Boolean);
    if(ids.length<2){ alert('Pilih minimal 2'); return; }
    const list=ids.map(id=>data.find(x=>x.id===id));
    if(list.length!==ids.length){ alert('Tidak ditemukan'); return; }
    const cats=[...new Set(list.map(x=>x.category))];
    if(cats.length>1){ alert('Beda jenis. Bandingkan sejenis'); return; }
    const rows=[['Harga',x=>x.price_idr],['Rating',x=>x.rating],['Skor',x=>x.s.t],['Chipset',x=>x.chipset],['RAM',x=>x.ram+' GB'],['Storage',x=>x.storage+' GB']];
    if(list[0].category==='smartphone') rows.push(['AnTuTu',x=>x.antutu.toLocaleString('id-ID')],['Baterai',x=>x.battery+' mAh'],['Bobot',x=>x.weight+' g']);
    else if(list[0].category==='laptop') rows.push(['Bobot',x=>x.weight/1000+' kg'],['Baterai',x=>x.battery+' Wh']);
    else rows.push(['Baterai',x=>x.battery+' mAh'],['Bobot',x=>x.weight+' g']);
    let h='<tr><th>Aspek</th>'+list.map(x=>'<th>'+x.name+'</th>').join('')+'</tr>';
    let b='<tbody>'+rows.map(r=>'<tr><td>'+r[0]+'</td>'+list.map(x=>'<td>'+r[1](x)+'</td>').join('')+'</tr>').join('')+'</tbody>';
    document.getElementById('res').innerHTML='<div class="tbl"><table>'+h+b+'</table></div>';
  };
}
window.addEventListener('hashchange',route); init();
