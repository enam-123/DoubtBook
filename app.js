const DB_KEY='doubtbook-data-v2', PROFILE_KEY='doubtbook-profile-v1', SESSION_KEY='doubtbook-session-v1';
let profile=JSON.parse(localStorage.getItem(PROFILE_KEY)||'null');
let doubts=JSON.parse(localStorage.getItem(DB_KEY)||'[]');
let selectedImage=null;
const $=id=>document.getElementById(id);
const views=['dashboard','all','revision','calendar','analytics'];
function saveDoubts(){try{localStorage.setItem(DB_KEY,JSON.stringify(doubts));render()}catch(e){showToast('Storage is full. Remove a large image or delete old doubts.');}}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toast(s){$('toast').textContent=s;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),2600)}
function showToast(s){toast(s)}
function enterApp(name){profile={name:name.trim()};localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));localStorage.setItem(SESSION_KEY,'yes');$('welcomeScreen').hidden=true;$('appShell').hidden=false;$('helloLine').textContent=`Welcome back, ${profile.name}`;render()}
function logout(){localStorage.removeItem(SESSION_KEY);$('appShell').hidden=true;$('welcomeScreen').hidden=false;$('studentName').value='';toast('You have logged out. Your doubts remain saved on this device.')}
function boot(){if(localStorage.getItem(SESSION_KEY)==='yes'&&profile?.name){$('welcomeScreen').hidden=true;$('appShell').hidden=false;$('helloLine').textContent=`Welcome back, ${profile.name}`;render()}else{$('welcomeScreen').hidden=false;$('appShell').hidden=true}}
$('loginForm').addEventListener('submit',e=>{e.preventDefault();const n=$('studentName').value.trim();if(n)enterApp(n)});
$('logoutBtn').addEventListener('click',()=>{if(confirm('Log out of DoubtBook? Your saved doubts will remain on this device.'))logout()});
function empty(t,s=''){return `<div class="empty"><b>${t}</b>${s}</div>`}
function card(d){return `<article class="doubt-item"><div class="doubt-main">${d.image?`<img class="question-thumb" src="${d.image}" alt="Attached question image">`:''}<div class="doubt-question">${esc(d.question||'Image question')}</div><div class="meta">${esc(d.subject)}${d.chapter?' · '+esc(d.chapter):''}${d.ref?' · '+esc(d.ref):''} · Added ${new Date(d.created).toLocaleDateString()}</div></div><div class="item-actions"><span class="pill ${d.status.toLowerCase()}">${d.status}</span><select class="small-select" onchange="changeStatus('${d.id}',this.value)" aria-label="Change status"><option value="">Change status</option><option>Unsolved</option><option>Attempted</option><option>Resolved</option></select><button class="small-select" onclick="editDoubt('${d.id}')">Edit</button><button class="delete-btn" onclick="removeDoubt('${d.id}')">Delete</button></div></article>`}
function list(id,items,msg,sub=''){ $(id).innerHTML=items.length?items.map(card).join(''):empty(msg,sub)}
function render(){if($('appShell').hidden)return;
$('totalStat').textContent=doubts.length;$('unsolvedStat').textContent=doubts.filter(d=>d.status==='Unsolved').length;$('attemptedStat').textContent=doubts.filter(d=>d.status==='Attempted').length;$('resolvedStat').textContent=doubts.filter(d=>d.status==='Resolved').length;
list('recentList',[...doubts].sort((a,b)=>b.created-a.created).slice(0,4),'No doubts yet','Capture your first doubt to get started.');
const q=($('searchInput').value||'').toLowerCase(),f=$('statusFilter').value,sf=$('subjectFilter').value;
list('allList',doubts.filter(d=>(f==='all'||d.status===f)&&(sf==='all'||d.subject===sf)&&[d.question,d.subject,d.chapter,d.ref].join(' ').toLowerCase().includes(q)).sort((a,b)=>b.created-a.created),'No matching doubts');
list('revisionList',doubts.filter(d=>d.status==='Resolved').sort((a,b)=>(a.revisionDate||'9999').localeCompare(b.revisionDate||'9999')),'Nothing to revise yet','Resolved doubts will appear here.');
const scheduled=doubts.filter(d=>d.revisionDate).sort((a,b)=>a.revisionDate.localeCompare(b.revisionDate));
$('calendarList').innerHTML=scheduled.length?scheduled.map(d=>'<article class="doubt-item"><div class="doubt-main"><div class="meta">'+new Date(d.revisionDate+'T00:00:00').toLocaleDateString()+'</div><div class="doubt-question">'+esc(d.question||'Image question')+'</div><div class="meta">'+esc(d.subject)+(d.chapter?' · '+esc(d.chapter):'')+'</div></div><span class="pill '+d.status.toLowerCase()+'">'+d.status+'</span></article>').join(''):empty('No revision dates set','Add a revision date while creating or editing a doubt.');
$('aTotal').textContent=doubts.length;$('aResolved').textContent=doubts.filter(d=>d.status==='Resolved').length;$('aRate').textContent=(doubts.length?Math.round(doubts.filter(d=>d.status==='Resolved').length/doubts.length*100):0)+'%';
const subs=['Mathematics','Science','English','Social Science','Hindi','Computer','Other'],counts=subs.map(s=>[s,doubts.filter(d=>d.subject===s).length]),max=Math.max(1,...counts.map(x=>x[1]));
$('subjectBars').innerHTML=counts.map(([s,n])=>`<div class="bar-row"><span>${s}</span><div class="bar-track"><div class="bar-fill" style="width:${n/max*100}%"></div></div><b>${n}</b></div>`).join('')}
function nav(v){views.forEach(x=>$(x+'View').hidden=x!==v);document.querySelectorAll('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.view===v));$('pageTitle').textContent={dashboard:'Dashboard',all:'All doubts',revision:'Revision',calendar:'Revision calendar',analytics:'Analytics'}[v];render()}
document.querySelectorAll('.nav-link').forEach(b=>b.onclick=()=>nav(b.dataset.view));document.querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>nav(b.dataset.goto));
let editingId=null;
function openForm(d=null){editingId=d?.id||null;$('doubtForm').reset();selectedImage=d?.image||null;$('question').value=d?.question||'';$('subject').value=d?.subject||'';$('chapter').value=d?.chapter||'';$('questionRef').value=d?.ref||'';$('status').value=d?.status||'Unsolved';$('revisionDate').value=d?.revisionDate||'';$('imagePreviewWrap').hidden=!selectedImage;if(selectedImage)$('imagePreview').src=selectedImage;$('doubtDialog').showModal()}
window.editDoubt=id=>{const d=doubts.find(x=>x.id===id);if(d)openForm(d)};
function closeForm(){$('doubtDialog').close();selectedImage=null;editingId=null;$('imagePreviewWrap').hidden=true}
['newDoubtTop','startAdding'].forEach(id=>$(id).onclick=openForm);$('closeDialog').onclick=closeForm;$('cancelDialog').onclick=closeForm;
$('questionImage').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;if(!file.type.startsWith('image/')){toast('Please choose an image file.');return}if(file.size>12*1024*1024){toast('Please choose an image under 12 MB.');e.target.value='';return}
try{selectedImage=await compressImage(file);$('imagePreview').src=selectedImage;$('imagePreviewWrap').hidden=false}catch(err){toast('Could not read that image. Try another one.')}});
function compressImage(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{const img=new Image();img.onerror=reject;img.onload=()=>{const scale=Math.min(1,1500/Math.max(img.width,img.height)),canvas=document.createElement('canvas');canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',0.78))};img.src=reader.result};reader.readAsDataURL(file)})}
$('removeImage').onclick=()=>{selectedImage=null;$('questionImage').value='';$('imagePreviewWrap').hidden=true};
$('doubtForm').addEventListener('submit',e=>{e.preventDefault();const question=$('question').value.trim(),subject=$('subject').value;if(!subject){toast('Choose a subject first.');return}if(!question&&!selectedImage){toast('Write your doubt or attach an image.');return}
const item={id:editingId||crypto.randomUUID(),question,subject,chapter:$('chapter').value.trim(),ref:$('questionRef').value.trim(),status:$('status').value,revisionDate:$('revisionDate').value,image:selectedImage,created:editingId?(doubts.find(d=>d.id===editingId)?.created||Date.now()):Date.now()};if(editingId)doubts=doubts.map(d=>d.id===editingId?item:d);else doubts.push(item);closeForm();saveDoubts();toast(editingId?'Doubt updated':'Doubt saved on this device')});
window.changeStatus=(id,s)=>{if(!s)return;const d=doubts.find(x=>x.id===id);if(d){d.status=s;saveDoubts();toast('Status updated')}};
window.removeDoubt=id=>{if(confirm('Delete this doubt and its attached image?')){doubts=doubts.filter(x=>x.id!==id);saveDoubts();toast('Doubt deleted')}};
$('searchInput').addEventListener('input',render);$('statusFilter').addEventListener('change',render);$('subjectFilter').addEventListener('change',render);

$('backupBtn').addEventListener('click',()=>{
 const payload={app:'DoubtBook',version:1,exportedAt:new Date().toISOString(),profile,doubts};
 const blob=new Blob([JSON.stringify(payload)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='DoubtBook-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(url);toast('Backup downloaded');
});
$('restoreBtn').addEventListener('click',()=>$('restoreFile').click());
$('restoreFile').addEventListener('change',async e=>{
 const file=e.target.files[0];if(!file)return;
 try{const data=JSON.parse(await file.text());if(data.app!=='DoubtBook'||!Array.isArray(data.doubts))throw Error('Invalid backup');
 if(!confirm('Restore '+data.doubts.length+' doubts? This replaces the current doubt list in this browser.'))return;
 doubts=data.doubts;if(data.profile?.name){profile=data.profile;localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));$('helloLine').textContent='Welcome back, '+profile.name;}
 localStorage.setItem(DB_KEY,JSON.stringify(doubts));render();toast('Backup restored successfully');
 }catch(err){toast('Could not restore. Choose a valid DoubtBook backup file.')}finally{e.target.value=''}
});

let deferred=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;$('installBtn').hidden=false});
$('installBtn').onclick=async()=>{if(deferred){deferred.prompt();await deferred.userChoice;deferred=null;$('installBtn').hidden=true}else toast('Open your browser menu and choose Install app / Add to Home Screen')};
if('serviceWorker'in navigator&&location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>toast('Offline setup could not start')));
boot();
