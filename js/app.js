(()=>{
const sections=[...document.querySelectorAll('.reveal')];
const labels=[...document.querySelectorAll('#progressLabels span')];
const fill=document.getElementById('progressFill');

const io=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('visible');
  });
},{threshold:.18});
sections.forEach(s=>io.observe(s));

function updateProgress(){
  const doc=document.documentElement;
  const max=doc.scrollHeight-innerHeight;
  const pct=max>0?(scrollY/max)*100:0;
  fill.style.width=Math.max(0,Math.min(100,pct))+'%';

  let activeStage=0;
  document.querySelectorAll('[data-stage]').forEach(el=>{
    const r=el.getBoundingClientRect();
    if(r.top<innerHeight*.45) activeStage=Math.max(activeStage,Number(el.dataset.stage)||0);
  });
  labels.forEach((l,i)=>l.classList.toggle('active',i===activeStage));
}
addEventListener('scroll',updateProgress,{passive:true});
addEventListener('resize',updateProgress);
updateProgress();

/* COUNT / COUNTA */
const countCells=[...document.querySelectorAll('#countData .data-cell')];
const countData={
  COUNT:{title:'How many numeric values?',metric:'3',formula:'=COUNT(A1:F1)',copy:'COUNT ignores text and blanks. It counts cells containing numbers.'},
  COUNTA:{title:'How many cells contain something?',metric:'5',formula:'=COUNTA(A1:F1)',copy:'COUNTA counts numbers and text. It ignores only blank cells.'}
};
document.querySelectorAll('[data-count]').forEach(b=>b.addEventListener('click',()=>{
  const type=b.dataset.count;
  document.querySelectorAll('[data-count]').forEach(x=>x.classList.toggle('active',x===b));
  countCells.forEach(c=>{
    c.classList.remove('on');
    if(type==='COUNT'&&c.classList.contains('number'))c.classList.add('on');
    if(type==='COUNTA'&&c.classList.contains('nonblank'))c.classList.add('on');
  });
  const d=countData[type];
  document.getElementById('countTitle').textContent=d.title;
  document.getElementById('countMetric').textContent=d.metric;
  document.getElementById('countCopy').textContent=d.copy;
  document.getElementById('countFormula').textContent=d.formula;
}));

/* formatting */
const formatData={general:'0.125',percent:'12.5%',currency:'$0.13'};
document.querySelectorAll('[data-format]').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('[data-format]').forEach(x=>x.classList.toggle('active',x===b));
  document.getElementById('formatValue').textContent=formatData[b.dataset.format];
}));

/* project formatting + merge */
const projectSheet=document.getElementById('projectSheet');
const stepState={merge:false,font:false,size:false,color:false,bold:false};
function markStep(step,on=true){
  stepState[step]=on;
  const mark=document.querySelector('[data-stepmark="'+step+'"]');
  if(mark) mark.classList.toggle('done',on);
}
function getMerged(){ return document.getElementById('mergedTitle'); }
function ensureMerged(){
  let merged=getMerged();
  if(merged) return merged;
  const cells=[...projectSheet.querySelectorAll('.grid-cell:not(.header)')];
  cells.forEach(c=>c.remove());
  merged=document.createElement('div');
  merged.id='mergedTitle';
  merged.className='merge-merged';
  merged.textContent='Quarterly Sales Report';
  projectSheet.appendChild(merged);
  markStep('merge',true);
  return merged;
}
document.querySelectorAll('[data-projectstep]').forEach(b=>b.addEventListener('click',()=>{
  const step=b.dataset.projectstep;
  if(step==='reset'){
    projectSheet.innerHTML='<div class="grid-cell header">A</div><div class="grid-cell header">B</div><div class="grid-cell header">C</div><div class="grid-cell header">D</div><div class="grid-cell header">E</div><div class="grid-cell title-source" id="a1">Quarterly Sales Report</div><div class="grid-cell" id="b1"></div><div class="grid-cell" id="c1"></div><div class="grid-cell" id="d1"></div><div class="grid-cell" id="e1"></div>';
    Object.keys(stepState).forEach(s=>markStep(s,false));
    return;
  }
  const target=ensureMerged();
  if(step==='font'){target.classList.add('light');markStep('font',true)}
  if(step==='size'){target.classList.add('pt22');markStep('size',true)}
  if(step==='color'){target.classList.add('aqua');markStep('color',true)}
  if(step==='bold'){target.classList.add('bold');markStep('bold',true)}
}));

document.getElementById('accent6Toggle').addEventListener('click',e=>{
  const el=document.getElementById('accent6Preview');
  el.classList.toggle('accent6');
  e.target.textContent=el.classList.contains('accent6')?'Remove Accent 6':'Apply Accent 6';
});

/* conditional formatting */
document.querySelectorAll('[data-rule]').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('[data-rule]').forEach(x=>x.classList.toggle('active',x===b));
  document.querySelectorAll('.sale').forEach(s=>{
    s.classList.remove('pass','fail');
    const v=Number(s.dataset.sale);
    if(b.dataset.rule==='below'&&v<1000)s.classList.add('fail');
    if(b.dataset.rule==='goal'&&v>=1000)s.classList.add('pass');
  });
}));

/* resize */
const resizeCol=document.getElementById('resizeCol');
const resizeCell=document.getElementById('resizeCell');
const resizeData={
  drag:{title:'Drag the boundary',copy:'Dragging lets you visually make the column wider or narrower. Here, we made it comfortably wider than the content.',note:'Drag = approximate. The content fits, with extra white space left over.',width:'250px'},
  fit:{title:'AutoFit / Best Fit',copy:'Double-click the boundary and Excel sizes the column to fit the contents as closely as it can.',note:'AutoFit = the contents decide. The width hugs the text instead of leaving extra space.',width:'146px'},
  exact:{title:'Enter an exact width',copy:'Right-click the column heading and choose Column Width when you need a specific size.',note:'Column Width = you specify the exact value, whether or not it is the tightest fit.',width:'180px'}
};
document.querySelectorAll('[data-resize]').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('[data-resize]').forEach(x=>x.classList.toggle('active',x===b));
  const d=resizeData[b.dataset.resize];
  resizeCol.style.width=d.width;
  resizeCell.style.width=d.width;
  document.getElementById('resizeTitle').textContent=d.title;
  document.getElementById('resizeCopy').textContent=d.copy;
  document.getElementById('resizeNote').textContent=d.note;
}));

/* tabs */
const tabs=[...document.querySelectorAll('.sheet-tab')];
tabs.forEach(t=>t.addEventListener('click',()=>tabs.forEach(x=>x.classList.toggle('active',x===t))));
document.querySelectorAll('[data-tabaction]').forEach(b=>b.addEventListener('click',()=>{
  const action=b.dataset.tabaction;
  if(action==='rename'){
    ['Sales','Expenses','Summary'].forEach((name,i)=>tabs[i].textContent=name);
    document.getElementById('tabStatus').textContent='Descriptive worksheet names make the workbook easier to navigate and understand.';
  } else if(action==='color'){
    tabs[0].classList.add('green');tabs[1].classList.add('blue');tabs[2].classList.add('gold');
    document.getElementById('tabStatus').textContent='Tab colors can help visually group or identify worksheets. Use them consistently rather than decoratively.';
  } else {
    ['Sheet1','Sheet2','Sheet3'].forEach((name,i)=>{
      tabs[i].textContent=name;tabs[i].classList.remove('green','blue','gold');
    });
    document.getElementById('tabStatus').textContent='Generic names make a workbook harder to navigate. Rename sheets so another person can understand the structure quickly.';
  }
}));

/* quick check */
document.getElementById('checks').addEventListener('click',e=>{
  if(e.target.tagName!=='BUTTON')return;
  const a=e.target.nextElementSibling;
  a.classList.toggle('show');
  e.target.textContent=a.classList.contains('show')?'Hide':'Reveal';
});
})();
