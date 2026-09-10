import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(__dirname, '..', 'index.html'), 'utf8');

function el(){ return {value:'',textContent:'',className:'',style:{},addEventListener(){},setAttribute(){},getAttribute(){return null;},querySelectorAll(){return[];},appendChild(){},onclick:null}; }
const ids={};
globalThis.document={getElementById:id=>ids[id]||(ids[id]=el()),createElement:()=>el(),querySelectorAll:()=>[],documentElement:el()};
globalThis.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
globalThis.location={hash:'',origin:'',pathname:''};
globalThis.window={matchMedia:()=>({matches:false}),location:globalThis.location};
globalThis.matchMedia=globalThis.window.matchMedia;
try{Object.defineProperty(globalThis,'navigator',{value:{clipboard:{writeText:()=>Promise.resolve()}},configurable:true});}catch{}

const js=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).sort((a,b)=>b.length-a.length)[0];
eval(js+`\n;globalThis.__t={breakEven,encodeState,decodeState};`);
const t=globalThis.__t;

let n=0; const check=(name,fn)=>{fn();n++;console.log('  ok -',name);};
const base={fixed:10000,price:50,varCost:30,units:700};

check('breakEven: units, revenue, contribution, profit, margin of safety',()=>{
  const r=t.breakEven(base);
  assert.equal(r.cm,20);                 // 50-30
  assert.ok(Math.abs(r.cmPct-40)<0.001);
  assert.equal(r.beUnits,500);           // 10000/20
  assert.equal(r.beRevenue,25000);       // 500*50
  assert.equal(r.profit,4000);           // 20*700-10000
  assert.equal(r.mosUnits,200);          // 700-500
  assert.ok(Math.abs(r.mosPct-28.571)<0.01);
});
check('breakEven: price <= variable cost -> no break-even',()=>{
  const r=t.breakEven({fixed:10000,price:30,varCost:30,units:700});
  assert.equal(r.beUnits,Infinity);
  assert.ok(r.profit<0);
});
check('share codec round-trips + rejects garbage',()=>{
  assert.deepEqual(t.decodeState(t.encodeState(base)),base);
  assert.equal(t.decodeState('!!bad'),null);
});

console.log(`\n${n} checks passed.`);
