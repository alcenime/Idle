/* IDLE VALLEY - UI only. All data is mock. */
const RES=[['Gold','12,450','#ffd23f'],['Ore','2,380','#9aa7b8'],['Wood','1,120','#b8743a'],['Herb','420','#5fc84a'],['Crystal','320','#59e0ff']];
const NAV=[['Home','index.html'],['Market','market.html'],['Swap','swap.html'],['NFT','nft.html'],['Docs','docs.html']];
const RC={Common:'#7d8aa0',Uncommon:'#3c9a3a',Rare:'#2f78d8',Epic:'#9246d0',Legendary:'#e8800c'};
const $=(s,r=document)=>r.querySelector(s);

function chrome(){
  const cur=location.pathname.split('/').pop()||'index.html';
  const h=document.createElement('header');h.className='top';
  h.innerHTML=`<a class="logo" href="index.html"><i></i>IDLE VALLEY</a>
  <button class="burger" aria-label="Menu" aria-expanded="false"><b></b><b></b><b></b></button>
  <nav>${NAV.map(([n,u])=>`<a href="${u}"${u===cur?' class="on"':''}>${n}</a>`).join('')}</nav>
  <div class="res">${RES.map(([n,v,c])=>`<span><s style="background:${c}"></s>${n} <em>${v}</em></span>`).join('')}</div>
  <button class="wallet">Connect Wallet</button>`;
  document.body.prepend(h);
  const fit=()=>document.documentElement.style.setProperty('--hh',h.offsetHeight+'px');
  $('.burger',h).onclick=e=>{const o=h.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o);fit()};
  addEventListener('resize',fit);fit();
}

function pix(seed,col,bg){
  let s=seed*9301+49297;const r=()=>(s=(s*9301+49297)%233280)/233280;let o='';
  for(let y=0;y<8;y++)for(let x=0;x<4;x++)if(r()>.42||(y>1&&y<6&&x>1)){
    const c=y<2?col[0]:y<5?col[1]:col[2];
    o+=`<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/><rect x="${7-x}" y="${y}" width="1" height="1" fill="${c}"/>`}
  return `<svg viewBox="0 0 8 8" style="background:${bg}">${o}</svg>`;
}
const PAL=[[['#ffd23f','#d9433a','#14213d'],'#bfeaff'],[['#8a5a30','#3c9a3a','#14213d'],'#ffe9a8'],[['#59e0ff','#2f78d8','#14213d'],'#d9f6c0'],[['#fff','#ff9a2e','#14213d'],'#a9d8ff'],[['#b6f03c','#9246d0','#14213d'],'#ffd9a0']];
const art=(n)=>{const [c,b]=PAL[n%PAL.length];return pix(n+3,c,b)};
const card=(n,name,rar,lines,price,btn)=>`<article class="px card">${art(n)}<h3>${name}</h3><span class="rar" style="background:${RC[rar]}">${rar}</span>${lines.map(l=>`<p>${l}</p>`).join('')}<div class="price"><span>${price}</span>${btn?`<button class="btn">${btn}</button>`:''}</div></article>`;

function tabbed(root,title,sub,tabs,render){
  root.innerHTML=`<h1>${title}</h1><p class="sub">${sub}</p><div class="tabs" role="tablist">${tabs.map((t,i)=>`<button role="tab" class="${i?'':'on'}">${t}</button>`).join('')}</div><div class="grid"></div>`;
  const g=$('.grid',root),show=t=>g.innerHTML=render(t);
  root.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{root.querySelectorAll('.tabs button').forEach(x=>x.classList.toggle('on',x===b));show(b.textContent)});
  show(tabs[0]);
}

function market(root){
  const R=['Common','Uncommon','Rare','Epic','Legendary'];
  const W=[[24,'Rare',120],[81,'Epic',450],[7,'Legendary',1900],[133,'Uncommon',60],[56,'Common',25],[92,'Rare',140]].map(([id,r,p],i)=>({t:'Workers',f:i<3,n:`Worker #${String(id).padStart(3,'0')}`,r,p:`${p} $IDLE`,a:id,l:[`Role: ${['Farmer','Miner','Rancher','Angler'][i%4]}`]}));
  const I=[['Iron Bundle','2,400'],['Wood Bundle','1,800'],['Herb Crate','900'],['Crystal Shard','350'],['Gold Pouch','5,000'],['Oak Plank Stack','1,200']].map(([n,p],i)=>({t:i%2?'Resources':'Items',f:i<2,n,r:R[i%3],p,a:i+40,l:['Bundle of 100']}));
  const all=[...W,...I];
  tabbed(root,'Market','Buy and sell workers, tools and resource bundles.',['Featured','Workers','Items','Resources'],t=>
    all.filter(x=>t==='Featured'?x.f:x.t===t).map(x=>card(x.a,x.n,x.r,x.l,x.p,'Buy')).join(''));
}

function nft(root){
  const names={Workers:['Mira the Farmer','Brogan Pickaxe','Tilly Herder','Captain Reel','Juno the Jester','Orrin Mage'],Land:['Meadow Plot','Ore Hill','Riverbank Lot','Sky Isle','Forest Glade','Harbor Dock'],'Special Items':['Golden Plow','Crystal Lantern','Festival Mask','Ancient Rod','Dragon Egg','Valley Crown']};
  const R=Object.keys(RC);
  tabbed(root,'NFT','Your valley collection. Names, owners and values are placeholders.',Object.keys(names),t=>
    names[t].map((n,i)=>card(i+(t.length*7),n,R[(i*2+t.length)%5],[`Level ${3+i*2}`,`Owner: 0x${(4821+i*377).toString(16)}...${(900+i*31).toString(16)}`],`${(0.04+i*0.03).toFixed(2)} ETH`)).join(''));
}

const DOCS=[
['What is Idle Valley','A colorful idle game where workers keep your valley producing while you are away. Check in, collect, upgrade, repeat.'],
['How It Works','Place workers in buildings. Each building makes resources over time, even while the game is closed. Spend them to upgrade.'],
['Economy','Gold, Ore, Wood, Herb and Crystal are earned in play. $IDLE is the market token used for trading workers and items.'],
['Workers','Workers are assigned to buildings. Higher rarity means faster output. Summon new workers or buy them in the market.'],
['Buildings','Main Hall, Farm, Mine, Ranch, Adventure, Carnival, Summon and Fishing. Each upgrades up to its own level cap.'],
['Adventure','Send a team out on timed expeditions for rare drops and crystals. Stronger teams unlock farther regions.'],
['Fishing','Cast from the dock for herbs, pearls and rare catches. Better rods raise the chance of a legendary fish.'],
['Carnival','Play small games with festival tickets to win cosmetic items and temporary production boosts.'],
['Marketplace','List workers, items and resource bundles at your own price. Browse the Featured tab for daily picks.'],
['Roadmap','Phase 1: valley and buildings. Phase 2: adventure and fishing. Phase 3: market and wallet. Phase 4: seasons and events.']];
const slug=s=>s.toLowerCase().replace(/\W+/g,'-');
function docs(root){
  root.innerHTML=`<h1>Docs</h1><p class="sub">Everything about the valley.</p><div class="docs"><nav class="px toc">${DOCS.map(([t])=>`<a href="#${slug(t)}">${t}</a>`).join('')}</nav><div>${DOCS.map(([t,p])=>`<article class="px" id="${slug(t)}"><h2>${t}</h2><p>${p}</p></article>`).join('')}</div></div>`;
}

/* Home valley scene, drawn on a 1000x600 grid so labels line up in percent */
function valley(root){
  const R=(x,y,w,h,f,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"${c?` class="${c}"`:''}/>`;
  const P=(p,f,c)=>`<polygon points="${p}" fill="${f}"${c?` class="${c}"`:''}/>`;
  const L=(p,c,w)=>`<polyline points="${p}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="miter"/>`;
  const tree=(x,y)=>R(x+4,y+14,4,8,'#7a4a24')+R(x,y+4,12,12,'#2f8f3a')+R(x+2,y,8,6,'#47b04a');
  const house=(x,y,w,h,wall,roof)=>R(x,y,w,h,wall)+P(`${x-4},${y} ${x+w/2},${y-h*.7} ${x+w+4},${y}`,roof)+R(x+w/2-4,y+h-13,8,13,'#5a3418')+R(x+4,y+7,7,7,'#bfeaff');
  const npc=(x,y,c,d=0)=>`<g class="bob" style="animation-delay:${d}s">${R(x,y,4,4,'#f2c08a')+R(x,y+4,4,6,c)}</g>`;
  let s=R(0,0,1000,600,'#5ec8f2')+R(0,110,1000,110,'#7fd6f6')+R(0,170,1000,60,'#a4e4fa');
  [[60,40],[400,70],[700,30]].forEach(([x,y],i)=>s+=`<g class="cl" style="animation-delay:-${i*22}s">${R(x,y,70,14,'#fff')+R(x+12,y-10,40,10,'#fff')}</g>`);
  s+=P('600,215 700,130 790,215','#7fb3dd')+P('720,215 830,110 950,215','#6aa3d4')+P('20,225 150,70 300,225','#3f86c9')+P('125,95 150,70 175,95 160,100 150,92 138,102','#fff')+P('0,215 1000,215 1000,600 0,600','#5fc84a');
  for(let i=0;i<9;i++)s+=R(i%2?0:40,240+i*40,1000,16,'#58bd44');
  s+=R(196,140,12,78,'#e8fbff','wf')+L('202,216 235,262 330,300 372,338 332,420 362,500 420,600','#4aa8e8',36)+L('202,216 235,262 330,300 372,338 332,420 362,500 420,600','#8fd4f5',6);
  [['500,300 420,322 355,318 300,350 262,384'],['500,300 640,292 770,262 800,330 845,385'],['500,300 520,380 600,440 770,480'],['262,384 200,430 175,470']].forEach(p=>s+=L(p,'#e8c47a',14));
  s+=R(340,304,36,30,'#a8693a')+R(340,312,36,2,'#7a4a24')+R(340,322,36,2,'#7a4a24');
  s+=R(135,185,30,30,'#14213d')+R(131,180,38,6,'#7a4a24')+`<g class="cart">${R(176,203,18,9,'#8a8a99')+R(178,212,5,4,'#14213d')+R(188,212,5,4,'#14213d')+R(180,200,10,3,'#e8800c')}</g>`;
  s+=R(425,205,24,86,'#d9c08a')+P('421,205 437,175 453,205','#d9433a')+R(551,205,24,86,'#d9c08a')+P('547,205 563,175 579,205','#d9433a')+R(450,235,100,56,'#efdcae')+P('440,235 500,180 560,235','#ff9a2e')+R(488,255,24,36,'#7a4a24')+R(494,200,12,12,'#ffd23f')+R(498,150,3,30,'#14213d')+R(501,150,16,10,'#d9433a','bob');
  s+=house(222,352,40,26,'#d9433a','#8a2a24');
  for(let i=0;i<5;i++)s+=R(272,352+i*9,64,5,'#3a9a3a')+R(280+i*12,350+i*9,4,4,'#ffd23f');
  s+=R(215,386,130,3,'#a8693a')+npc(300,366,'#2f78d8')+npc(250,392,'#ffd23f',.3);
  s+=house(740,262,44,28,'#efdcae','#d9433a')+R(792,266,80,3,'#a8693a')+R(792,300,80,3,'#a8693a');
  [[800,278,'#fff'],[826,284,'#ffb3c7'],[850,276,'#fff']].forEach(([x,y,c],i)=>s+=`<g class="bob" style="animation-delay:${i*.3}s">${R(x,y,14,8,c)+R(x+12,y-4,6,6,c)}</g>`);
  s+=P('812,350 845,312 878,350','#d9433a')+R(826,336,8,14,'#fff')+R(842,326,8,24,'#fff')+R(858,336,8,14,'#fff')+`<g class="spin" style="transform-origin:910px 345px"><circle cx="910" cy="345" r="26" fill="none" stroke="#ffd23f" stroke-width="4"/>${L('884,345 936,345','#ffd23f',3)+L('910,319 910,371','#ffd23f',3)}</g>`+R(906,345,8,30,'#7a4a24');
  s+=`<ellipse cx="175" cy="462" rx="44" ry="16" fill="none" stroke="#59e0ff" stroke-width="4"/>`+P('175,432 187,452 175,472 163,452','#59e0ff','pulse')+R(160,486,30,14,'#8a8a99');
  s+=P('640,430 960,420 985,520 700,545','#4aa8e8')+R(690,440,70,8,'#a8693a')+R(700,448,4,22,'#7a4a24')+R(750,448,4,22,'#7a4a24')+`<g class="boat">${R(830,478,40,10,'#d9433a')+R(848,458,3,20,'#14213d')+R(851,458,14,12,'#fff')}</g>`+npc(716,430,'#e8800c');
  s+=`<g class="float">${P('800,112 945,112 925,152 872,178 828,152','#5fc84a')+P('828,152 925,152 872,196','#8a5a30')+P('850,112 875,78 900,112','#ff9a2e')+R(872,56,3,24,'#14213d')+R(875,56,14,8,'#ffd23f')}</g>`;
  [[70,260],[110,300],[60,380],[30,330],[380,230],[600,230],[640,330],[660,400],[950,280],[930,330],[110,430],[520,470],[470,500],[300,470],[950,380],[560,520],[900,470]].forEach(([x,y])=>s+=tree(x,y));
  s+=house(385,236,26,18,'#efdcae','#2f78d8')+house(620,250,26,18,'#efdcae','#9246d0')+house(560,440,28,18,'#efdcae','#e8800c');
  for(let i=0;i<40;i++)s+=R((i*127)%980+10,250+(i*61)%330,4,4,['#ff9ac1','#ffd23f','#fff'][i%3]);
  s+=npc(470,310,'#d9433a')+npc(540,318,'#2f78d8',.4)+npc(150,222,'#ffd23f',.2)+npc(620,300,'#5fc84a',.6);
  const T=[['Main Hall',5,500,176,'hall'],['Mine',3,170,150],['Farm',4,265,340],['Ranch',2,775,214],['Adventure',1,870,52],['Carnival',1,860,296],['Summon',1,175,424],['Fishing',2,800,418]];
  const B=[['Build & Upgrade','Grow your valley.'],['Summon','Get new workers.'],['Adventure','Explore the world.'],['Market','Trade items.'],['Quests','Complete missions.']];
  root.innerHTML=`<div class="world"><svg viewBox="0 0 1000 600" preserveAspectRatio="none" role="img" aria-label="Your valley">${s}</svg>${T.map(([n,l,x,y,c])=>`<button class="tag ${c||''}" style="left:${x/10}%;top:${y/6}%"><b>${n}</b><span>LV. ${l}<i>^</i></span></button>`).join('')}</div><div class="bar">${B.map(([a,b])=>`<button><b>${a}</b><span>${b}</span></button>`).join('')}</div>`;
  if(innerWidth<=860)root.scrollLeft=(root.scrollWidth-root.clientWidth)/2;
}

chrome();
const pg=document.body.dataset.page,main=$('#'+pg);
({index:()=>valley($('#valley')),market:()=>market(main),nft:()=>nft(main),docs:()=>docs(main)})[pg]?.();
