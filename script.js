const root=document.documentElement;
try{const t=localStorage.getItem('theme');if(t)root.dataset.theme=t;}catch(e){}
document.getElementById('theme').onclick=()=>{
  const n=root.dataset.theme==='light'?'dark':'light';root.dataset.theme=n;
  try{localStorage.setItem('theme',n)}catch(e){}
  draw();
};
const cv=document.getElementById('chart'),ctx=cv.getContext('2d');
const W=cv.width,H=cv.height,XMAX=10,YMAX=10;
let pts=[];
const sx=x=>x/XMAX*W, sy=y=>H-y/YMAX*H;
const css=v=>getComputedStyle(root).getPropertyValue(v).trim();
function fit(){
  const n=pts.length; if(n<2) return null;
  const mx=pts.reduce((s,p)=>s+p.x,0)/n, my=pts.reduce((s,p)=>s+p.y,0)/n;
  let num=0,den=0; pts.forEach(p=>{num+=(p.x-mx)*(p.y-my);den+=(p.x-mx)**2});
  if(den===0) return null;
  const m=num/den,c=my-m*mx;
  const ssr=pts.reduce((s,p)=>s+(p.y-(m*p.x+c))**2,0), sst=pts.reduce((s,p)=>s+(p.y-my)**2,0);
  return {m,c,r2:sst===0?1:1-ssr/sst};
}
function draw(){
  ctx.clearRect(0,0,W,H);
  ctx.strokeStyle=css('--line');ctx.lineWidth=1;
  for(let i=0;i<=10;i++){ctx.beginPath();ctx.moveTo(sx(i),0);ctx.lineTo(sx(i),H);ctx.stroke();ctx.beginPath();ctx.moveTo(0,sy(i));ctx.lineTo(W,sy(i));ctx.stroke();}
  const f=fit();
  if(f){ctx.strokeStyle=css('--b');ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(sx(0),sy(f.c));ctx.lineTo(sx(XMAX),sy(f.m*XMAX+f.c));ctx.stroke();}
  ctx.fillStyle=css('--a');
  pts.forEach(p=>{ctx.beginPath();ctx.arc(sx(p.x),sy(p.y),7,0,7);ctx.fill();});
  document.getElementById('n').textContent=pts.length;
  document.getElementById('eq').textContent=f?`y = ${f.m.toFixed(2)}x ${f.c<0?'-':'+'} ${Math.abs(f.c).toFixed(2)}`:'y = –';
  document.getElementById('r2').textContent=f?f.r2.toFixed(3):'–';
  const x=parseFloat(document.getElementById('px').value);
  document.getElementById('py').textContent=f&&!isNaN(x)?(f.m*x+f.c).toFixed(2):'–';
}
cv.addEventListener('click',e=>{
  const r=cv.getBoundingClientRect();
  pts.push({x:(e.clientX-r.left)/r.width*XMAX,y:YMAX-(e.clientY-r.top)/r.height*YMAX});draw();
});
document.getElementById('clear').onclick=()=>{pts=[];draw()};
document.getElementById('sample').onclick=()=>{
  pts=[];for(let i=0;i<12;i++){const x=Math.random()*9+.5;pts.push({x,y:Math.min(9.5,Math.max(.5,0.8*x+1+(Math.random()-.5)*2.2))});}draw();
};
document.getElementById('px').addEventListener('input',draw);
draw();
