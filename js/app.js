(() => {
  const STORAGE_KEY = 'superapp_famille_mobile_v4_3_cartes_exploitables';
  const LEGACY_STORAGE_KEYS = ['superapp_famille_mobile_v4_1_parametres_autonomes','superapp_famille_mobile_v4_modulaire','superapp_famille_mobile_v3','superapp_famille_mobile_v2'];
  const APP_VERSION = '4.3.0';
  const pad2 = n => String(n).padStart(2, '0');
  const todayObj = new Date();
  const today = `${pad2(todayObj.getDate())}-${pad2(todayObj.getMonth()+1)}-${todayObj.getFullYear()}`;

  const MODULE_ALIASES = {
    home:'maison', maison:'maison',
    food:'courses_repas', courses:'courses_repas', courses_repas:'courses_repas',
    education:'education',
    health:'sante', sante:'sante',
    sport:'sport_loisirs', loisirs:'sport_loisirs', sport_loisirs:'sport_loisirs',
    family:'familles', familles:'familles',
    calendar:'calendrier', calendrier:'calendrier',
    notifications:'notifications', settings:'parametres', parametres:'parametres'
  };
  const LEGACY_MODULE_IDS = {maison:'home', courses_repas:'food', education:'education', sante:'health', sport_loisirs:'sport', familles:'family', calendrier:'calendar'};
  function canonicalModuleId(id){ return MODULE_ALIASES[id] || id || 'calendrier'; }
  function legacyModuleId(id){ return LEGACY_MODULE_IDS[canonicalModuleId(id)] || id; }

  const modules = [
    { id:'maison', name:'Maison', short:'Maison', icon:'🏡', cls:'module-home', image:'assets/images/illustrations/home-task.png', badge:'assets/icons/icon_maison.png', desc:'Organisez les tâches et la vie à la maison.' },
    { id:'courses_repas', name:'Courses & repas', short:'Courses', icon:'🛒', cls:'module-food', image:'assets/images/illustrations/grocery-fridge.png', badge:'assets/icons/icon_courses.png', desc:'Menus, courses, stock et budget familial.' },
    { id:'education', name:'Éducation', short:'Éducation', icon:'🎒', cls:'module-edu', image:'assets/images/illustrations/education-desk.png', badge:'assets/icons/icon_education.png', desc:'Devoirs, école et documents.' },
    { id:'sante', name:'Santé', short:'Santé', icon:'💗', cls:'module-health', image:'assets/images/illustrations/health-kit.png', badge:'assets/icons/icon_sante.png', desc:'Rappels, rendez-vous et suivi santé.' },
    { id:'sport_loisirs', name:'Sport / loisirs', short:'Sport', icon:'⚽', cls:'module-sport', image:'assets/images/illustrations/sport-bag.png', badge:'assets/icons/icon_sport.png', desc:'Activités, sorties et moments détente.' },
    { id:'familles', name:'Familles', short:'Familles', icon:'👨‍👩‍👧‍👦', cls:'module-family', image:'assets/images/famille/family_badge_transparent.png', badge:'assets/icons/icon_famille.png', desc:'Profils, cartes membres et futurs documents administratifs.' },
    { id:'calendrier', name:'Calendrier', short:'Calendrier', icon:'🗓️', cls:'module-calendar', image:'assets/images/illustrations/calendar-family.png', badge:'assets/icons/icon_calendrier.svg', desc:'Tous les événements familiaux.' },
  ];

  const APP_MODULE_IDS = ['maison','courses_repas','education','sante','sport_loisirs','familles'];
  const CORE_MODULE_IDS = ['calendrier','notifications','parametres'];
  const defaultOffer = {cockpitMobile:true, cockpitOrdinateur:false, syncEnabled:false, minimumOneAppRequired:true, syncMode:'mobile_only'};
  function makeAppsRegistry(existing={}){
    const registry = {};
    modules.forEach(m=>{
      const prev = existing[canonicalModuleId(m.id)] || existing[m.id] || {};
      const isApp = APP_MODULE_IDS.includes(m.id);
      registry[m.id] = {
        id:m.id, nom:m.name, actif: prev.actif ?? true, installe: prev.installe ?? true,
        licence: prev.licence || (isApp ? 'active' : 'core'), sourceActivation: prev.sourceActivation || 'cockpit_mobile',
        activatedAt: prev.activatedAt || nowISO(), connectedToMobile: prev.connectedToMobile ?? true,
        connectedToDesktop: prev.connectedToDesktop ?? false, syncStatus: prev.syncStatus || 'synced'
      };
    });
    const activeApps = APP_MODULE_IDS.filter(id=>registry[id]?.actif);
    if(!activeApps.length) registry.maison.actif = true;
    return registry;
  }

  const defaultData = {
    settings: {
      city: 'Paris', country: 'France', currency: 'EUR', theme: 'clair', connectedToCockpit: false,
      offer: structuredClone(defaultOffer), syncMode: 'mobile_only',
      notificationsPrefs: {global:true, sauvegarde:true, synchro:true, maison:true, courses_repas:true, education:true, sante:true, sport_loisirs:true, familles:true},
      appearance: {theme:'clair', accent:'familial', accueil:'resume'}
    },
    offer: structuredClone(defaultOffer),
    appsRegistry: makeAppsRegistry(),
    family: [
      { id:'mandiaye', name:'Mandiaye Diallo', birth:'06-03-1978', role:'Papa', phone:'0659012599', email:'mandiayediallo@gmail.com', notes:'Papa · lunettes · référent organisation familiale.', accent:'violet' },
      { id:'julie', name:'Julie Diallo', birth:'27-04-1981', role:'Maman', phone:'0661123344', email:'juliediallo@gmail.com', notes:'Maman · nutrition · suivi des rendez-vous.', accent:'rose' },
      { id:'salma', name:'Salma Moussoukoro Diallo', birth:'18-01-2007', role:'Enfant', phone:'0677788899', email:'salma.diallo@gmail.com', notes:'Collégienne · danse · aime les sciences.', accent:'bleu' },
      { id:'salif', name:'Salif Alassane Diallo', birth:'20-10-2009', role:'Enfant', phone:'0766889900', email:'salif.diallo@gmail.com', notes:'Lycéen · football · musique électro.', accent:'vert' },
      { id:'awa', name:'Awa Fanta Fatimata Diallo', birth:'19-07-2014', role:'Enfant', phone:'0775566778', email:'awa.diallo@gmail.com', notes:'Élève · dessin · lecture aventures.', accent:'orange' },
    ],
    categories: {
      maison: { 'Ménage':['Sols','Linge','Cuisine'], 'Entretien':['Plomberie','Électricité','Jardin'], 'Administratif':['Assurance','Factures','Documents'] },
      courses_repas: { 'Alimentation':['Riz','Pâtes','Huile'], 'Épicerie sénégalaise':['Riz brisé','Bouillon','Bissap'], 'Stock':['Frigo','Congélateur','Placard'] },
      education: { 'Devoirs':['Maths','Français','Histoire'], 'Documents école':['Autorisation','Assurance scolaire'], 'Contrôles':['Contrôle','Exposé'] },
      sante: { 'Rendez-vous':['Généraliste','Dentiste','Ophtalmo'], 'Traitements':['Journalier','Hebdomadaire'], 'Documents santé':['Ordonnance','Mutuelle','Certificat'] },
      sport_loisirs: { 'Sport':['Football','Danse','Natation'], 'Loisirs':['Cinéma','Parc','Sortie'], 'Matériel':['Sac','Chaussures','Gourde'] },
      familles: { 'Identité':['Carte d’identité','Passeport','Titre de séjour'], 'Scolarité':['Diplômes','Certificats','Bulletins'], 'Administratif':['Livret de famille','Assurance','Justificatif de domicile'] }
    },
    tasks: [
      { id:uid(), module:'maison', title:'Vider le lave-vaisselle', date:today, member:'julie', status:'todo', category:'Ménage' },
      { id:uid(), module:'maison', title:'Ranger le salon', date:today, member:'mandiaye', status:'todo', category:'Rangement' },
    ],
    shopping: [
      { id:uid(), module:'courses_repas', title:'Lait', qty:'1 bouteille', status:'todo', category:'Alimentation' },
      { id:uid(), module:'courses_repas', title:'Œufs', qty:'12', status:'todo', category:'Alimentation' },
      { id:uid(), module:'courses_repas', title:'Pain', qty:'2', status:'todo', category:'Alimentation' },
      { id:uid(), module:'courses_repas', title:'Riz brisé', qty:'5 kg', status:'todo', category:'Épicerie sénégalaise' },
      { id:uid(), module:'courses_repas', title:'Tomates', qty:'1 kg', status:'todo', category:'Fruits & légumes' },
    ],
    meals: [
      { id:uid(), module:'courses_repas', title:'Menu du jour : Thieboudiène', date:today, member:'family', category:'Repas', meal:'Thieboudiène' },
    ],
    weeklyMeals: [
      { id:uid(), module:'courses_repas', day:0, title:'Yassa poulet', category:'Repas', type:'Dîner' },
      { id:uid(), module:'courses_repas', day:1, title:'Pâtes bolognaises', category:'Repas', type:'Dîner' },
      { id:uid(), module:'courses_repas', day:2, title:'Thieboudiène', category:'Repas', type:'Dîner' },
      { id:uid(), module:'courses_repas', day:3, title:'Omelette + salade', category:'Repas', type:'Dîner' },
      { id:uid(), module:'courses_repas', day:4, title:'Mafé', category:'Repas', type:'Dîner' },
      { id:uid(), module:'courses_repas', day:5, title:'Pizza maison', category:'Repas', type:'Dîner' },
      { id:uid(), module:'courses_repas', day:6, title:'Repas famille', category:'Repas', type:'Dîner' },
    ],
    stock: [
      { id:uid(), module:'courses_repas', title:'Riz brisé', qty:'8 kg', level:'Bon', place:'Placard', category:'Épicerie sénégalaise' },
      { id:uid(), module:'courses_repas', title:'Huile', qty:'1 bouteille', level:'Faible', place:'Placard', category:'Alimentation' },
      { id:uid(), module:'courses_repas', title:'Poisson', qty:'2 portions', level:'Moyen', place:'Congélateur', category:'Viande / poisson' },
    ],
    foodBudget: { monthly: 450, spent: 185, currency: 'EUR' },
    homework: [
      { id:uid(), module:'education', title:'Devoir de maths', date:today, member:'salif', status:'todo', category:'Devoirs' },
      { id:uid(), module:'education', title:'Lecture français', date:today, member:'awa', status:'todo', category:'Devoirs' },
    ],
    schoolDocs: [
      { id:uid(), module:'education', title:'Autorisation sortie scolaire', date:today, member:'awa', status:'todo', category:'Documents école' },
    ],
    grades: [
      { id:uid(), module:'education', title:'Note anglais : 15/20', date:today, member:'salma', status:'info', category:'Notes' },
    ],
    health: [
      { id:uid(), module:'sante', type:'medication', title:'Vitamine D', date:today, member:'awa', status:'todo', category:'Traitements' },
      { id:uid(), module:'sante', type:'appointment', title:'Rendez-vous dentiste', date:today, time:'10:30', member:'julie', status:'todo', category:'Rendez-vous' },
    ],
    vaccines: [
      { id:uid(), module:'sante', title:'Vaccins à vérifier', date:today, member:'family', status:'todo', category:'Vaccins' },
    ],
    healthDocs: [
      { id:uid(), module:'sante', title:'Carte mutuelle', date:today, member:'family', status:'todo', category:'Documents santé' },
    ],
    emergency: [
      { id:uid(), module:'sante', title:'Contacts d’urgence', desc:'SAMU 15 · Urgences 112 · Pharmacie de garde', member:'family', category:'Urgences' },
    ],
    sports: [
      { id:uid(), module:'sport_loisirs', title:'Entraînement football', date:today, time:'14:30', member:'salif', status:'todo', category:'Sport' },
      { id:uid(), module:'sport_loisirs', title:'Sortie vélo', date:today, time:'17:00', member:'family', status:'todo', category:'Loisirs' },
    ],
    sportGear: [
      { id:uid(), module:'sport_loisirs', title:'Sac de foot + gourde', date:today, member:'salif', status:'todo', category:'Matériel' },
      { id:uid(), module:'sport_loisirs', title:'Certificat médical', date:today, member:'salma', status:'todo', category:'Documents' },
    ],
    familyDocuments: [
      { id:uid(), module:'familles', title:'Cartes d’identité', status:'planned', category:'Identité', desc:'Import futur des CI de la famille' },
      { id:uid(), module:'familles', title:'Passeports', status:'planned', category:'Identité', desc:'Import futur des passeports' },
      { id:uid(), module:'familles', title:'Diplômes et certificats', status:'planned', category:'Scolarité', desc:'Import futur des diplômes et attestations' },
      { id:uid(), module:'familles', title:'Documents administratifs', status:'planned', category:'Administratif', desc:'Livret, assurances, justificatifs, autorisations' },
    ],
    documents: [],
    calendarEvents: [
      { id:uid(), module:'calendrier', type:'evenement', title:'Dîner avec tata', date:today, time:'19:30', member:'family', status:'todo', category:'Famille' }
    ],
    notifications: [],
    referenceData: {
      maison: {lieux:['Cuisine','Salon','Chambres','Salle de bain'], priorites:['Urgent','Normal','À prévoir'], recurrrences:['Ponctuel','Quotidien','Hebdomadaire','Mensuel']},
      courses_repas: {magasins:['Supermarché','Marché','Épicerie sénégalaise'], unites:['kg','g','litre','pièce','paquet'], zonesStock:['Frigo','Congélateur','Placard']},
      education: {ecoles:['École principale'], classes:['Primaire','Collège','Lycée'], matieres:['Maths','Français','Histoire','Sciences'], typesDocuments:['Autorisation','Assurance scolaire','Bulletin']},
      sante: {professionnels:['Médecin généraliste','Dentiste','Ophtalmologue'], lieuxMedicaux:['Cabinet médical','Pharmacie','Hôpital'], typesRdv:['Consultation','Contrôle','Urgence'], contactsUrgence:['15 - SAMU','112 - Urgence européenne']},
      sport_loisirs: {clubs:['Football','Danse','Natation'], lieux:['Gymnase','Parc','Stade'], materiels:['Sac','Gourde','Chaussures'], typesActivites:['Sport','Sortie','Loisir']},
      familles: {typesDocuments:['Carte d’identité','Passeport','Diplôme','Assurance','Justificatif'], roles:['Parent','Enfant','Tuteur','Proche']}
    }
  };

  let data = load();
  let state = { view:'home', calendarMode:'month', selectedDate: today, notifFilter:'all', calendarFilter:'all', activeModule:null, editing:null, preset:null, returnList:null }; 

  const $ = sel => document.querySelector(sel);
  const $$ = sel => [...document.querySelectorAll(sel)];

  function uid(){ return Math.random().toString(36).slice(2,10) + Date.now().toString(36).slice(-4); }
  function nowISO(){ return new Date().toISOString(); }
  function decorateSync(item, source='application_mobile'){
    const stamp = nowISO();
    if(!item.id) item.id = uid();
    if(!item.createdAt) item.createdAt = stamp;
    if(!item.updatedAt) item.updatedAt = stamp;
    if(!item.createdFrom) item.createdFrom = source;
    item.updatedFrom = source;
    if(!item.syncStatus) item.syncStatus = 'pending_create';
    if(!item.statut) item.statut = item.status || 'a_faire';
    return item;
  }
  function touchSync(item, source='application_mobile'){
    item.updatedAt = nowISO();
    item.updatedFrom = source;
    item.syncStatus = item.syncStatus === 'pending_create' ? 'pending_create' : 'pending_update';
    return item;
  }
  function normalizeLegacyStatus(item){
    if(item.status === 'todo') item.status = 'a_faire';
    if(item.status === 'done') item.status = 'fait';
    if(item.status === 'planned') item.status = 'planifie';
    if(item.status === 'info') item.status = 'info';
    item.statut = item.status || item.statut || 'a_faire';
    return item;
  }
  function normaliseItem(item, moduleFallback){
    if(moduleFallback && !item.module) item.module = moduleFallback;
    if(item.module) item.module = canonicalModuleId(item.module);
    normalizeLegacyStatus(item);
    return decorateSync(item, item.createdFrom || 'application_mobile');
  }
  function collectionRegistry(){
    return [
      ['tasks','maison'], ['shopping','courses_repas'], ['meals','courses_repas'], ['weeklyMeals','courses_repas'], ['stock','courses_repas'], ['calendarEvents','calendrier'],
      ['homework','education'], ['schoolDocs','education'], ['grades','education'],
      ['health','sante'], ['vaccines','sante'], ['healthDocs','sante'], ['emergency','sante'],
      ['sports','sport_loisirs'], ['sportGear','sport_loisirs'], ['familyDocuments','familles'], ['documents','calendrier']
    ];
  }
  function findRecord(id){
    for(const [collection] of collectionRegistry()){
      const arr = data[collection] || [];
      const item = arr.find(x => x.id === id);
      if(item) return {collection, item, arr};
    }
    return null;
  }
  function moduleLabel(id){ return moduleById(id)?.name || 'Calendrier'; }
  function moduleIcon(id){ return moduleById(id)?.icon || '📌'; }
  function eventTypeForModule(module){
    module = canonicalModuleId(module);
    return {maison:'tache',courses_repas:'repas',education:'devoir',sante:'rendez_vous_medical',sport_loisirs:'activite',familles:'document_famille',calendrier:'evenement'}[module] || 'evenement';
  }
  function targetCollectionFor(module,type){
    module = canonicalModuleId(module);
    if(module==='maison') return 'tasks';
    if(module==='courses_repas') return type === 'stock' ? 'stock' : (type === 'repas_semaine' ? 'weeklyMeals' : (type === 'course' ? 'shopping' : 'meals'));
    if(module==='education') return type === 'document_ecole' ? 'schoolDocs' : (type === 'note' ? 'grades' : 'homework');
    if(module==='sante') return type === 'urgence_sante' ? 'emergency' : (type === 'vaccin' ? 'vaccines' : (type === 'document_sante' ? 'healthDocs' : 'health'));
    if(module==='sport_loisirs') return ['materiel_sport','document_sport'].includes(type) ? 'sportGear' : 'sports';
    if(module==='familles') return 'familyDocuments';
    return 'calendarEvents';
  }
  function statusIsDone(item){ return item.status === 'fait' || item.status === 'done'; }
  function statusIsHidden(item){ return item.status === 'archive' || item.statut === 'archive' || item.status === 'supprime' || item.statut === 'supprime'; }
  function load(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || LEGACY_STORAGE_KEYS.map(k=>localStorage.getItem(k)).find(Boolean);
      return ensureDataShape(raw ? JSON.parse(raw) : structuredClone(defaultData));
    }
    catch { return ensureDataShape(structuredClone(defaultData)); }
  }
  function migrateCategories(categories){
    const out = {...(categories||{})};
    Object.keys(out).forEach(key=>{
      const canonical = canonicalModuleId(key);
      if(canonical !== key){ out[canonical] = {...(out[canonical]||{}), ...(out[key]||{})}; delete out[key]; }
    });
    return out;
  }
  function ensureDataShape(source){
    const d = source || {};
    const base = structuredClone(defaultData);
    Object.keys(base).forEach(key=>{
      if(d[key] === undefined || d[key] === null) d[key] = base[key];
    });
    d.settings = {...base.settings, ...(d.settings||{})};
    d.settings.notificationsPrefs = {...base.settings.notificationsPrefs, ...(d.settings.notificationsPrefs||{})};
    d.settings.appearance = {...base.settings.appearance, ...(d.settings.appearance||{})};
    d.offer = {...defaultOffer, ...(d.offer || d.settings.offer || {})};
    d.settings.offer = {...defaultOffer, ...(d.settings.offer || d.offer || {})};
    d.settings.syncMode = d.settings.syncMode || d.offer.syncMode || 'mobile_only';
    d.appsRegistry = makeAppsRegistry({...base.appsRegistry, ...(d.appsRegistry || d.modules || {})});
    d.categories = migrateCategories({...base.categories, ...(d.categories||{})});
    ['family','tasks','shopping','meals','weeklyMeals','stock','homework','schoolDocs','grades','health','vaccines','healthDocs','emergency','sports','sportGear','familyDocuments','documents','calendarEvents','notifications'].forEach(key=>{
      if(!Array.isArray(d[key])) d[key] = base[key] || [];
    });
    d.family = d.family.map(member => {
      const reference = base.family.find(x => x.id === member.id) || {};
      return {...reference, ...member};
    });
    if(!d.foodBudget) d.foodBudget = base.foodBudget;
    d.referenceData = {...base.referenceData, ...(d.referenceData||{})};
    Object.keys(base.referenceData).forEach(mid=>{ d.referenceData[mid] = {...base.referenceData[mid], ...(d.referenceData[mid]||{})}; });
    collectionRegistry().forEach(([collection,module])=>{ d[collection] = (d[collection]||[]).map(item=>normaliseItem(item,module)); });
    return d;
  }
  function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  function parseDMY(str){
    if(!str) return null;
    if(/^\d{2}-\d{2}-\d{4}$/.test(str)){ const [d,m,y]=str.split('-').map(Number); return new Date(y,m-1,d); }
    if(/^\d{4}-\d{2}-\d{2}$/.test(str)){ const [y,m,d]=str.split('-').map(Number); return new Date(y,m-1,d); }
    return null;
  }
  function formatDMY(date){ return `${pad2(date.getDate())}-${pad2(date.getMonth()+1)}-${date.getFullYear()}`; }
  function displayDate(dmy){
    const d = parseDMY(dmy); if(!d) return dmy || '';
    return d.toLocaleDateString('fr-FR',{weekday:'long', day:'numeric', month:'long', year:'numeric'});
  }
  function shortDate(dmy){ const d=parseDMY(dmy); return d ? d.toLocaleDateString('fr-FR',{day:'2-digit', month:'short'}) : dmy; }
  function memberName(id){ return id === 'family' ? 'Toute la famille' : data.family.find(m=>m.id===id)?.name || 'Famille'; }
  function moduleById(id){ id = canonicalModuleId(id); return modules.find(m=>m.id===id) || modules[0]; }
  function appRecord(id){ id = canonicalModuleId(id); return data.appsRegistry?.[id] || makeAppsRegistry()[id] || {actif:true, licence:'active'}; }
  function isCoreModule(id){ return CORE_MODULE_IDS.includes(canonicalModuleId(id)); }
  function isAppActive(id){ id = canonicalModuleId(id); return isCoreModule(id) || !!appRecord(id)?.actif; }
  function activeModules(){ return modules.filter(m=>isAppActive(m.id)); }
  function inactiveAppModules(){ return modules.filter(m=>APP_MODULE_IDS.includes(m.id) && !isAppActive(m.id)); }
  function ensureActiveAccess(id){ if(isAppActive(id)) return true; openActivationPanel(id); return false; }
  function dmyToISO(dmy){ const d=parseDMY(dmy); return d ? `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}` : ''; }
  function daysDiff(d1,d2){ const a=parseDMY(d1), b=parseDMY(d2); if(!a||!b) return 9999; a.setHours(0,0,0,0); b.setHours(0,0,0,0); return Math.round((b-a)/86400000); }
  function startOfWeek(date){ const d=new Date(date); const day=(d.getDay()+6)%7; d.setDate(d.getDate()-day); d.setHours(0,0,0,0); return d; }
  function addDays(date,n){ const d=new Date(date); d.setDate(d.getDate()+n); return d; }
  function weekDays(){ const selected=parseDMY(state.selectedDate)||todayObj; const start=startOfWeek(selected); return Array.from({length:7},(_,i)=>addDays(start,i)); }
  function mealForDay(index){ return data.weeklyMeals.find(m=>Number(m.day)===index) || {title:'À définir', type:'Repas'}; }
  function todayMeal(){ const dayIndex=(todayObj.getDay()+6)%7; return mealForDay(dayIndex); }
  function currency(value){ return `${Number(value||0).toLocaleString('fr-FR')} ${data.foodBudget?.currency || data.settings.currency || 'EUR'}`; }
  function moduleItems(id){
    id = canonicalModuleId(id);
    if(!isAppActive(id)) return [];
    let items = [];
    if(id==='maison') items = data.tasks;
    else if(id==='courses_repas') items = [...data.meals, ...data.shopping, ...data.stock];
    else if(id==='education') items = [...data.homework, ...data.schoolDocs, ...data.grades];
    else if(id==='sante') items = [...data.health, ...data.vaccines, ...data.healthDocs];
    else if(id==='sport_loisirs') items = [...data.sports, ...data.sportGear];
    else if(id==='familles') items = [...data.family.map(m=>({...m,module:'familles',title:m.name,date:m.birth,member:m.id,category:'Membre'})), ...data.familyDocuments];
    return items.filter(x=>!statusIsHidden(x));
  }

  function init(){
    bindNavigation(); bindDialogs(); render();
    if('serviceWorker' in navigator){ navigator.serviceWorker.register('./service-worker.js').catch(()=>{}); }
  }

  function setView(view){
    state.view=view;
    $$('.view').forEach(v=>v.classList.toggle('active', v.dataset.view===view));
    $$('.nav-btn').forEach(b=>b.classList.toggle('active', b.dataset.target===view));
    updateHeader(); render();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function updateHeader(){
    const titles = {
      home:['Bonjour la famille 👋','Tout est bien organisé aujourd’hui.'],
      calendar:['Calendrier familial','Tous les événements de la famille.'],
      apps:['Mes apps','Tout ce dont la famille a besoin, au même endroit.'],
      notifications:['Notifications','Rappels et alertes actionnables.'],
      settings:['Paramètres','Famille, catégories, sous-catégories et données.']
    };
    $('#screenTitle').textContent = titles[state.view][0];
    $('#screenSubtitle').textContent = titles[state.view][1];
    $('#quickNotificationBtn').style.display = state.view === 'notifications' ? 'none' : 'grid';
  }
  function bindNavigation(){
    $$('.nav-btn').forEach(btn=>btn.addEventListener('click',()=>setView(btn.dataset.target)));
    $('#quickNotificationBtn').addEventListener('click',()=>setView('notifications'));
    $('#fab').addEventListener('click',()=>openQuickActions());
  }

  function bindDialogs(){
    $('#cancelEdit').addEventListener('click',()=>{ state.preset=null; $('#editDialog').close(); });
    $('#editForm').addEventListener('submit', e=>{
      e.preventDefault();
      const form = new FormData(e.currentTarget);
      const type = e.currentTarget.dataset.type;
      const item = Object.fromEntries(form.entries());
      if(String(type).startsWith('settings_')){ saveSettingsForm(type,item,e.currentTarget.dataset.id || ''); return; }
      if(type === 'settings'){ $('#editDialog').close(); return; }
      addItem(type,item);
      const backToList = state.returnList ? {...state.returnList} : null;
      state.preset=null; $('#editDialog').close(); save(); render();
      if(backToList) setTimeout(()=>openModuleList(backToList.module, backToList.block), 30);
    });
    $('#importInput').addEventListener('change', async e=>{
      const file = e.target.files[0]; if(!file) return;
      try { const report = importPayload(JSON.parse(await file.text())); save(); render(); alert(`Import réalisé sans écrasement brutal. Ajouts : ${report.added}, mises à jour : ${report.updated}, conflits : ${report.conflicts}.`); }
      catch { alert('Fichier JSON invalide ou incompatible.'); }
      e.target.value='';
    });
  }

  function render(){
    renderHome(); renderCalendar(); renderApps(); renderNotifications(); renderSettings(); updateBadges();
  }
  function updateBadges(){
    const count = getNotifications().filter(n=>!n.done).length;
    $('#topBadge').textContent = count; $('#navNotifBadge').textContent = count;
    $('#topBadge').style.display = count ? 'grid':'none'; $('#navNotifBadge').style.display = count ? 'grid':'none';
  }

  function getAllEvents(){
    const map = {
      tasks:['🏠','Maison'], meals:['🍽️','Courses & repas'], calendarEvents:['📌','Calendrier'],
      homework:['📘','Éducation'], schoolDocs:['📄','Document école'], grades:['⭐','Note'],
      health:['💗','Santé'], vaccines:['💉','Vaccin'], healthDocs:['📄','Document santé'],
      sports:['⚽','Sport'], sportGear:['🎒','Matériel sport'], documents:['📄','Document'], familyDocuments:['📁','Familles']
    };
    const items = [];
    Object.entries(map).forEach(([collection,[icon,label]])=>{
      (data[collection]||[]).forEach(x=>{
        if(!x.date || statusIsHidden(x)) return;
        if(!isAppActive(x.module || (collection === 'calendarEvents' ? 'calendrier' : 'calendrier'))) return;
        const module = canonicalModuleId(x.module || (collection === 'calendarEvents' ? 'calendrier' : 'calendrier')); x.module = module;
        items.push({...x, _collection:collection, icon, label, module});
      });
    });
    if(isAppActive('familles')) data.family.forEach(m=>{
      const b=parseDMY(m.birth); if(!b) return;
      const sd=parseDMY(state.selectedDate || today); if(!sd) return;
      if(b.getDate()===sd.getDate() && b.getMonth()===sd.getMonth()){
        items.push({id:'birthday-'+m.id,module:'familles',type:'anniversaire',title:`Anniversaire — ${m.name}`,date:state.selectedDate,member:m.id,icon:'🎂',label:'Anniversaire',time:'Toute la journée', readonly:true});
      }
    });
    return items;
  }
  function filteredEvents(events){ return state.calendarFilter === 'all' ? events : events.filter(x=>canonicalModuleId(x.module) === canonicalModuleId(state.calendarFilter)); }
  function itemsForDate(dmy){ return filteredEvents(getAllEvents().filter(x=>x.date===dmy)); }
  function getNotifications(){
    const notices = [];
    data.health.filter(h=>h.type==='medication' && h.date===today && !statusIsDone(h) && !statusIsHidden(h)).forEach(h=>notices.push({id:h.id,module:'sante',icon:'💊',title:`Médicament — ${h.title}`,desc:`${memberName(h.member)} · aujourd’hui`,time:'Aujourd’hui'}));
    data.health.filter(h=>h.type==='appointment' && !statusIsDone(h) && !statusIsHidden(h)).forEach(h=>{ const diff=daysDiff(today,h.date); if(diff>=0 && diff<=5) notices.push({id:h.id,module:'sante',icon:'💗',title:h.title,desc:`${memberName(h.member)} · dans ${diff===0?'la journée':diff+' jour(s)'}`,time:h.time||shortDate(h.date)}); });
    data.tasks.filter(t=>t.date===today && !statusIsDone(t) && !statusIsHidden(t)).forEach(t=>notices.push({id:t.id,module:'maison',icon:'🏠',title:`Tâche — ${t.title}`,desc:memberName(t.member),time:'Aujourd’hui'}));
    data.shopping.filter(s=>!statusIsDone(s) && !statusIsHidden(s)).slice(0,2).forEach(s=>notices.push({id:s.id,module:'courses_repas',icon:'🛒',title:`Course — ${s.title}`,desc:s.qty || 'À acheter',time:'Courses'}));
    data.stock.filter(s=>(s.level||'').toLowerCase()==='faible' && !statusIsHidden(s)).forEach(s=>notices.push({id:s.id,module:'courses_repas',icon:'📦',title:`Stock faible — ${s.title}`,desc:`${s.qty} · ${s.place}`,time:'Stock'}));
    data.homework.filter(h=>h.date===today && !statusIsDone(h) && !statusIsHidden(h)).forEach(h=>notices.push({id:h.id,module:'education',icon:'📘',title:h.title,desc:`${memberName(h.member)} · devoir`,time:'Aujourd’hui'}));
    data.schoolDocs.filter(h=>!statusIsDone(h) && !statusIsHidden(h)).forEach(h=>notices.push({id:h.id,module:'education',icon:'📄',title:h.title,desc:`${memberName(h.member)} · document école`,time:shortDate(h.date)}));
    data.vaccines.filter(h=>!statusIsDone(h) && !statusIsHidden(h)).forEach(h=>notices.push({id:h.id,module:'sante',icon:'💉',title:h.title,desc:`${memberName(h.member)} · vaccin`,time:shortDate(h.date)}));
    return notices.filter(n=>isAppActive(n.module));
  }
  function countForModule(id){
    if(id==='maison') return `${data.tasks.filter(x=>!statusIsDone(x) && !statusIsHidden(x)).length} tâches`;
    if(id==='courses_repas') return `${data.weeklyMeals.length} menus`;
    if(id==='education') return `${data.homework.filter(x=>!statusIsDone(x) && !statusIsHidden(x)).length} devoirs`;
    if(id==='sante') return `${getNotifications().filter(x=>x.module==='sante').length} rappel`;
    if(id==='sport_loisirs') return `${data.sports.length} activités`;
    if(id==='familles') return `${data.family.length} membres`;
    if(id==='calendrier') return `${itemsForDate(today).length} événements`;
  }

  function renderHome(){
    const health = getNotifications().find(n=>n.module==='sante');
    const unfilteredToday = getAllEvents().filter(x=>x.date===today);
    const next = unfilteredToday.find(x=>x.time && x.time!=='Toute la journée') || unfilteredToday[0];
    const goNext = next ? `SuperApp.openCalendarDate('${next.date}','${next.id}')` : `SuperApp.setView('calendar')`;
    $('#view-home').innerHTML = `
      <article class="home-hero clickable-card" onclick="SuperApp.setView('apps')">
        <div class="hero-copy"><span>SUPERAPP FAMILLE</span><h2>Bonjour la famille</h2><p>Le cockpit organise. Le mobile accompagne la journée.</p></div>
        <img src="assets/images/hero/header.png" alt="Famille canonique devant la maison" />
      </article>
      <article class="card weather weather-premium clickable-card" onclick="SuperApp.openSettings('localisation')">
        <div class="sun">🌤️</div><div><strong>18°C</strong><br><small>Ensoleillé · journée calme</small></div>
        <div class="right"><b>${data.settings.city}</b><br><small>↑ 21° · ↓ 12°</small></div>
      </article>
      <div class="section-title"><h2>Aujourd’hui</h2><span>${displayDate(today).replace(/^./,c=>c.toUpperCase())}</span></div>
      <div class="today-grid">
        <button class="card mini-card focus-calendar clickable-card" onclick="${goNext}"><div><span class="icon">📅</span><br><b>Prochain événement</b></div><small>${next ? next.title : 'Aucun événement'}</small><strong>${next?.time || ''}</strong></button>
        <button class="card mini-card focus-food clickable-card" onclick="SuperApp.openModule('courses_repas','menu_du_jour')"><div><span class="icon">🍽️</span><br><b>Menu du jour</b></div><small>${todayMeal().title}</small><strong>${todayMeal().type || 'Repas'}</strong></button>
        <button class="card mini-card focus-health clickable-card" onclick="${health ? `SuperApp.openItem('${health.id}')` : `SuperApp.openModule('sante','sante_aujourdhui')`}"><div><span class="icon">💗</span><br><b>Santé aujourd’hui</b></div><small>${health ? health.title : 'Tout est calme'}</small><strong>${health?.time || ''}</strong></button>
        <button class="card mini-card focus-notif clickable-card" onclick="SuperApp.setView('notifications')"><div><span class="icon">🔔</span><br><b>Notifications importantes</b></div><small>${getNotifications().length} rappel(s)</small><strong>à traiter</strong></button>
      </div>
      <div class="section-title"><h2>Mes apps</h2><button class="link-btn" onclick="SuperApp.setView('apps')">Voir tout</button></div>
      <div class="app-grid visual-grid">
        ${modules.filter(m=>m.id !== 'calendrier').map(moduleTileSmall).join('')}
      </div>`;
  }
  function moduleImage(m,variant='tile'){ return `<div class="app-art ${variant}"><img src="${m.image}" alt="" loading="lazy"><span class="app-badge"><img src="${m.badge}" alt=""></span></div>`; }
  function moduleTileSmall(m){ const active=isAppActive(m.id); return `<button class="app-tile visual ${m.cls} ${active?'':'locked'}" onclick="${active?`SuperApp.openModule('${m.id}')`:`SuperApp.openActivationPanel('${m.id}')`}"><h3>${m.short}</h3>${moduleImage(m,'small')}<span class="count">${active?countForModule(m.id):'Disponible'}</span></button>`; }
  function moduleTileLarge(m){ const active=isAppActive(m.id); const rec=appRecord(m.id); return `<button class="app-tile visual large-card ${m.cls} ${active?'':'locked'}" onclick="${active?`SuperApp.openModule('${m.id}')`:`SuperApp.openActivationPanel('${m.id}')`}"><div><h3>${m.name}</h3><p>${m.desc}</p><small>${active?'Activée · '+(rec.connectedToDesktop?'connectée ordinateur':'mobile seul'):'Disponible · à activer'}</small></div>${moduleImage(m,'large')}<span class="count">${active?countForModule(m.id):'Activer ›'}</span></button>`; }

  function renderApps(){ $('#view-apps').innerHTML = `<article class="apps-hero"><div><span>Applications famille</span><h2>Écosystème modulaire</h2><p>Chaque application peut fonctionner seule, puis se connecter au cockpit mobile et au cockpit ordinateur selon l’offre.</p></div><img src="assets/images/mobile/superapp.png" alt="" onerror="this.style.display='none'" /></article><div class="app-grid large">${modules.map(moduleTileLarge).join('')}</div>`; }

  function openModule(id, focusKey=''){
    state.returnList = null;
    id = canonicalModuleId(id);
    if(!ensureActiveAccess(id)) return;
    const m=moduleById(id); if(id==='calendrier'){ setView('calendar'); return; }
    const view = $('#view-apps'); setView('apps');
    state.activeModule = id;
    view.innerHTML = `<div class="module-screen-head visual-head ${m.cls}"><div><span class="eyebrow">${m.short}</span><h2>${m.name}</h2><p>${m.desc}</p></div><img src="${m.image}" alt="" /></div>${moduleContent(id)}<br><button class="btn ghost" onclick="SuperApp.renderAppsHome()">← Retour aux apps</button>`;
    if(focusKey){ setTimeout(()=>document.querySelector(`[data-block="${focusKey}"]`)?.scrollIntoView({behavior:'smooth',block:'start'}),50); }
  }
  function moduleContent(id){
    if(id==='courses_repas') return foodModuleContent();
    if(id==='maison') return homeModuleContent();
    if(id==='education') return educationModuleContent();
    if(id==='sante') return healthModuleContent();
    if(id==='sport_loisirs') return sportModuleContent();
    if(id==='familles') return familyModuleContent();
    return '';
  }

  function moduleKpis(items){
    return `<div class="module-kpis">
      ${items.map(([v,l])=>`<article class="kpi-pill"><strong>${v}</strong><small>${l}</small></article>`).join('')}
    </div>`;
  }
  function subsection(title, action, body){
    return `<div class="section-title compact-title"><h2>${title}</h2>${action || ''}</div>${body}`;
  }
  const cardImg = name => `assets/images/cards/${String(name).replace(/\.png$/,'')}.png`;  // accepte 'nom' ou 'nom.png' sans casser le chemin
  function playfulBlock(opts){
    const {title, emoji='', img='', tone='neutral', body='', action='', kicker='', block='', onClick=''} = opts || {};
    const click = onClick ? ` onclick="if(!event.target.closest('button,a,input,select,textarea')){${onClick}}"` : '';
    const tab = onClick ? ' tabindex="0" role="button"' : '';
    return `<article class="play-block ${tone} ${onClick?'clickable-card':''}" ${block ? `data-block="${block}"` : ''}${tab}${click}>
      ${img ? `<div class="play-image"><img src="${img}" alt="" loading="lazy" onerror="this.closest(\'.play-image\').style.display=\'none\';"></div>` : ''}
      <div class="play-head"><div><span>${kicker || 'Espace'}</span><h3>${emoji ? emoji+' ' : ''}${title}</h3></div>${action || ''}</div>
      <div class="play-body">${body}</div>
    </article>`;
  }
  function playfulPreview(id,label,img,tone){
    const items = moduleItems(id).filter(x=>x.date===state.selectedDate || x.date===today).slice(0,4);
    return playfulBlock({title:`Calendrier ${label}`, emoji:'📅', img, tone, kicker:'Planning', block:`calendrier_${id}`, onClick:`SuperApp.openCalendarModule('${id}')`, action:`<button class="link-btn" onclick="SuperApp.openCalendarModule('${id}')">Voir global</button>`, body:`<div class="module-calendar-preview embedded"><p>Vue filtrée simple de l’app. Cette rubrique alimente aussi le calendrier global.</p>${items.length ? items.map(x=>`<span>${shortDate(x.date)} · ${x.title}</span>`).join('') : '<small>Aucun point daté pour cette sélection.</small>'}</div>`});
  }
  function playfulSettings(id,label,img,tone){
    const cats = Object.keys(data.categories[id] || {}).slice(0,4);
    return playfulBlock({title:`Paramètres ${label}`, emoji:'⚙️', img, tone, kicker:'Réglages', block:`parametres_${id}`, onClick:`SuperApp.openSettings('categories','${id}')`, body:`<div class="settings-chips embedded">${cats.map(c=>`<span>${c}</span>`).join('')}<span>+ catégories</span><span>+ sous-catégories</span></div>`});
  }
  function rowList(items, icon, label, empty='Aucun élément.'){ const visible=(items||[]).filter(x=>!statusIsHidden(x)); return `<div class="agenda-list">${visible.length ? visible.map(x=>agendaRow(x,icon,label)).join('') : `<div class="empty">${empty}</div>`}</div>`; }
  function calendarPreview(id,label){
    const items = moduleItems(id).filter(x=>x.date===state.selectedDate || x.date===today).slice(0,4);
    return subsection(`Calendrier ${label}`, `<button class="link-btn" onclick="SuperApp.setView('calendar')">Voir global</button>`, `<div class="card module-calendar-preview"><p>Vue filtrée simple de l’app. Cette rubrique alimente aussi le calendrier global.</p>${items.length ? items.map(x=>`<span>${shortDate(x.date)} · ${x.title}</span>`).join('') : '<small>Aucun point daté pour cette sélection.</small>'}</div>`);
  }
  function settingsPreview(id,label){
    const cats = Object.keys(data.categories[id] || {}).slice(0,4);
    return subsection(`Paramètres ${label}`, '', `<div class="settings-chips">${cats.map(c=>`<span>${c}</span>`).join('')}<span>+ catégories</span><span>+ sous-catégories</span></div>`);
  }
  function foodModuleContent(){
    const meal = todayMeal();
    const budget = data.foodBudget || {monthly:0,spent:0,currency:'EUR'};
    const lowStock = data.stock.filter(x=>(x.level||'').toLowerCase()==='faible');
    return `
      ${moduleKpis([[meal.title,'menu du jour'],[data.weeklyMeals.length,'menus semaine'],[data.shopping.filter(x=>x.status!=='done').length,'courses'],[lowStock.length,'stock faible']])}
      ${playfulBlock({title:'Menu du jour', block:'menu_du_jour', onClick:`SuperApp.openModuleList('courses_repas','menu_du_jour')`, emoji:'🍽️', img:cardImg('courses_menu_jour.png'), tone:'food tone-food-1', kicker:'Repas', action:`<button class="link-btn" onclick="SuperApp.openModuleList('courses_repas','menu_du_jour')">Modifier</button>`, body:`<article class="feature-card food-feature embedded"><div><span>Repas prévu</span><h3>${meal.title}</h3><p>${meal.type || 'Dîner'} · ingrédients à préparer depuis la liste de courses.</p></div></article>`})}
      ${playfulBlock({title:'Menu de la semaine', block:'menu_de_la_semaine', onClick:`SuperApp.openModuleList('courses_repas','menu_de_la_semaine')`, emoji:'📅', img:cardImg('courses_menu_semaine.png'), tone:'food tone-food-2', kicker:'7 jours', body:`<div class="week-menu playful-week">${weekDays().map((d,i)=>{ const m=mealForDay(i); return `<article><b>${d.toLocaleDateString('fr-FR',{weekday:'short'}).replace('.','')}</b><small>${shortDate(formatDMY(d))}</small><strong>${m.title}</strong><em>${m.type || 'Repas'}</em></article>`; }).join('')}</div>`})}
      ${playfulBlock({title:'Liste des courses', block:'liste_des_courses', onClick:`SuperApp.openModuleList('courses_repas','liste_des_courses')`, emoji:'🛒', img:cardImg('courses_liste.png'), tone:'food tone-food-3', kicker:'À cocher', action:`<button class="link-btn" onclick="SuperApp.openModuleList('courses_repas','liste_des_courses')">+ Ajouter</button>`, body:rowList(data.shopping,'🛒','Courses')})}
      ${playfulBlock({title:'Stock maison', block:'stock_maison', onClick:`SuperApp.openModuleList('courses_repas','stock_maison')`, emoji:'🧺', img:cardImg('courses_stock.png'), tone:'food tone-food-4', kicker:'Frigo · placard', body:`<div class="stock-grid">${data.stock.map(x=>`<article class="stock-card ${String(x.level).toLowerCase()==='faible'?'alert':''}"><b>${x.title}</b><small>${x.qty} · ${x.place}</small><span>${x.level}</span></article>`).join('')}</div>`})}
      ${playfulBlock({title:'Alertes utiles', block:'alertes_utiles', onClick:`SuperApp.openModuleList('courses_repas','alertes_utiles')`, emoji:'⚠️', img:cardImg('courses_alertes.png'), tone:'food tone-food-6', kicker:'Rappels', body:`<div class="settings-chips embedded">${lowStock.length ? lowStock.map(x=>`<span>Stock faible : ${x.title}</span>`).join('') : '<span>Aucun stock faible</span>'}<span>Doublons à surveiller</span><span>Produits urgents</span></div>`})}
      ${playfulBlock({title:'Budget courses', block:'budget_courses', onClick:`SuperApp.openModuleList('courses_repas','budget_courses')`, emoji:'💶', img:cardImg('courses_budget.png'), tone:'food tone-food-5', kicker:'Suivi', body:`<article class="budget-card embedded"><div><b>${currency(budget.spent)}</b><small>dépensé sur ${currency(budget.monthly)}</small></div><progress value="${budget.spent}" max="${budget.monthly || 1}"></progress><strong>Reste ${currency((budget.monthly||0)-(budget.spent||0))}</strong></article>`})}
      ${playfulPreview('courses_repas','repas',cardImg('courses_calendrier_repas.png'),'food tone-food-2')}
      ${playfulSettings('courses_repas','Courses',cardImg('courses_parametres.png'),'food tone-food-4')}`;
  }
  function homeModuleContent(){
    const overdue = data.tasks.filter(x=>x.status!=='done' && x.date && daysDiff(today,x.date)<0);
    const todayTasks = data.tasks.filter(x=>x.date===today && x.status!=='done');
    return `${moduleKpis([[todayTasks.length,'tâches du jour'],[overdue.length,'en retard'],[data.family.length,'membres'],['Oui','récurrences']])}
      ${playfulBlock({title:'Tâches du jour', block:'taches_du_jour', onClick:`SuperApp.openModuleList('maison','taches_du_jour')`, emoji:'🏠', img:cardImg('maison_taches.png'), tone:'home tone-home-1', kicker:'Aujourd’hui', action:`<button class="link-btn" onclick="SuperApp.openModuleList('maison','taches_du_jour')">+ Ajouter</button>`, body:rowList(todayTasks.length?todayTasks:data.tasks,'🏠','Maison')})}
      ${playfulBlock({title:'Routines', block:'routines', onClick:`SuperApp.openModuleList('maison','routines')`, emoji:'🔁', img:cardImg('maison_routines.png'), tone:'home tone-home-2', kicker:'Habitudes', body:`<div class="settings-chips embedded"><span>Matin</span><span>Soir</span><span>Ménage</span><span>Linge</span><span>Préparation école</span></div>`})}
      ${playfulBlock({title:'Répartition famille', block:'repartition_famille', onClick:`SuperApp.openModule('familles')`, emoji:'👨‍👩‍👧‍👦', img:cardImg('maison_repartition.png'), tone:'home tone-home-3', kicker:'Famille canonique', body:`<div class="settings-chips embedded">${data.family.slice(0,5).map(m=>`<span>${m.name.split(' ')[0]} · ${data.tasks.filter(t=>t.member===m.id).length}</span>`).join('')}</div>`})}
      ${playfulBlock({title:'Urgences maison', block:'urgences_maison', onClick:`SuperApp.openModuleList('maison','urgences_maison')`, emoji:'⚠️', img:cardImg('maison_urgences.png'), tone:'home tone-home-4', kicker:'Priorité', body:`<div class="settings-chips embedded">${overdue.length ? overdue.map(x=>`<span>${x.title}</span>`).join('') : '<span>Aucune urgence maison</span>'}<span>Réparation</span><span>Administratif</span></div>`})}
      ${playfulBlock({title:'Entretien', block:'entretien', onClick:`SuperApp.openModuleList('maison','entretien')`, emoji:'🛠️', img:cardImg('maison_entretien.png'), tone:'home tone-home-5', kicker:'Suivi', body:`<div class="settings-chips embedded"><span>Plomberie</span><span>Électricité</span><span>Jardin</span><span>Assurance</span></div>`})}
      ${playfulBlock({title:'Stock / rangement maison', block:'stock_rangement_maison', onClick:`SuperApp.openModuleList('maison','stock_rangement_maison')`, emoji:'🧺', img:cardImg('maison_stock_rangement.png'), tone:'home tone-home-6', kicker:'Organisation', body:`<div class="settings-chips embedded"><span>Placards</span><span>Linge</span><span>Produits maison</span><span>Rangement</span></div>`})}
      ${playfulPreview('maison','Maison',cardImg('maison_calendrier.png'),'home tone-home-2')}`;
  }
  function educationModuleContent(){
    return `${moduleKpis([[data.homework.length,'devoirs'],[data.schoolDocs.length,'documents'],[data.grades.length,'notes'],[data.family.filter(m=>m.role==='Enfant').length,'enfants']])}
      ${playfulBlock({title:'Devoirs', block:'devoirs', onClick:`SuperApp.openModuleList('education','devoirs')`, emoji:'📘', img:cardImg('education_devoirs.png'), tone:'edu tone-edu-1', kicker:'À faire', action:`<button class="link-btn" onclick="SuperApp.openModuleList('education','devoirs')">+ Ajouter</button>`, body:rowList(data.homework,'📘','Éducation')})}
      ${playfulBlock({title:'Contrôles', block:'controles', onClick:`SuperApp.openModuleList('education','controles')`, emoji:'📝', img:cardImg('education_controles.png'), tone:'edu tone-edu-2', kicker:'Révisions', body:`<div class="settings-chips embedded"><span>Maths</span><span>Français</span><span>Histoire</span><span>À planifier</span></div>`})}
      ${playfulBlock({title:'Documents école', block:'documents_ecole', onClick:`SuperApp.openModuleList('education','documents_ecole')`, emoji:'📄', img:cardImg('education_documents.png'), tone:'edu tone-edu-3', kicker:'À signer', body:rowList(data.schoolDocs,'📄','Document école')})}
      ${playfulBlock({title:'Notes & appréciations', block:'notes_appreciations', onClick:`SuperApp.openModuleList('education','notes_appreciations')`, emoji:'⭐', img:cardImg('education_notes.png'), tone:'edu tone-edu-4', kicker:'Suivi', body:rowList(data.grades,'⭐','Note')})}
      ${playfulBlock({title:'Activités scolaires', block:'activites_scolaires', onClick:`SuperApp.openModuleList('education','activites_scolaires')`, emoji:'🎒', img:cardImg('education_activites.png'), tone:'edu tone-edu-5', kicker:'École', body:`<div class="settings-chips embedded"><span>Sorties</span><span>Réunions</span><span>Matériel</span><span>Inscriptions</span></div>`})}
      ${playfulPreview('education','Éducation',cardImg('education_calendrier.png'),'edu tone-edu-2')}`;
  }
  function healthModuleContent(){
    const appts = data.health.filter(x=>x.type==='appointment');
    const meds = data.health.filter(x=>x.type==='medication');
    const treatments = data.health.filter(x=>x.category==='Traitements' || x.type==='medication');
    return `${moduleKpis([[meds.length,'médicaments'],[appts.length,'rendez-vous'],[data.vaccines.length,'vaccins'],[data.healthDocs.length,'documents']])}
      ${playfulBlock({title:'Santé aujourd’hui', block:'sante_aujourdhui', onClick:`SuperApp.openModuleList('sante','sante_aujourdhui')`, emoji:'❤️', img:cardImg('sante_aujourdhui.png'), tone:'health tone-health-1', kicker:'Aujourd’hui', action:`<button class="link-btn" onclick="SuperApp.openModuleList('sante','medicaments')">+ Ajouter</button>`, body:rowList(data.health,xIconHealth(),'Santé')})}
      ${playfulBlock({title:'Médicaments', block:'medicaments', onClick:`SuperApp.openModuleList('sante','medicaments')`, emoji:'💊', img:cardImg('sante_medicaments.png'), tone:'health tone-health-2', kicker:'Prises', body:rowList(meds,'💊','Médicament','Aucun médicament prévu.')})}
      ${playfulBlock({title:'Traitements', block:'traitements', onClick:`SuperApp.openModuleList('sante','traitements')`, emoji:'🧾', img:cardImg('sante_traitements.png'), tone:'health tone-health-3', kicker:'Suivi', body:rowList(treatments,'🧾','Traitement','Aucun traitement en cours.')})}
      ${playfulBlock({title:'Rendez-vous médicaux', block:'rendez_vous_medicaux', onClick:`SuperApp.openModuleList('sante','rendez_vous_medicaux')`, emoji:'🩺', img:cardImg('sante_rdv.png'), tone:'health tone-health-4', kicker:'Planning médical', body:rowList(appts,'🩺','Rendez-vous','Aucun rendez-vous médical.')})}
      ${playfulBlock({title:'Vaccins', block:'vaccins', onClick:`SuperApp.openModuleList('sante','vaccins')`, emoji:'💉', img:cardImg('sante_vaccins.png'), tone:'health tone-health-5', kicker:'Carnet', body:rowList(data.vaccines,'💉','Vaccin')})}
      ${playfulBlock({title:'Documents santé', block:'documents_sante', onClick:`SuperApp.openModuleList('sante','documents_sante')`, emoji:'📁', img:cardImg('sante_documents.png'), tone:'health tone-health-6', kicker:'Dossiers', body:rowList(data.healthDocs,'📄','Document santé')})}
      ${playfulBlock({title:'Urgences', block:'urgences', onClick:`SuperApp.openModuleList('sante','urgences')`, emoji:'🚨', img:cardImg('sante_urgences.png'), tone:'health tone-health-7', kicker:'Important', body:`<div class="agenda-list embedded">${data.emergency.map(x=>`<article class="agenda-item"><div class="agenda-icon">🚑</div><div><b>${x.title}</b><small>${x.desc || 'Contacts et informations utiles'}</small></div></article>`).join('')}</div>`})}`;
  }
  function xIconHealth(){ return '💗'; }
  function sportModuleContent(){
    return `${moduleKpis([[data.sports.length,'activités'],[data.sportGear.length,'matériel/documents'],['Oui','clubs & lieux'],['Oui','sorties']])}
      ${playfulBlock({title:'Activités du jour', block:'activites_du_jour', onClick:`SuperApp.openModuleList('sport_loisirs','activites_du_jour')`, emoji:'⚽', img:cardImg('sport_activites.png'), tone:'sport tone-sport-1', kicker:'Aujourd’hui', action:`<button class="link-btn" onclick="SuperApp.openModuleList('sport_loisirs','activites_du_jour')">+ Ajouter</button>`, body:rowList(data.sports,'⚽','Sport / loisirs')})}
      ${playfulBlock({title:'Sorties familiales', block:'sorties_familiales', onClick:`SuperApp.openModuleList('sport_loisirs','sorties_familiales')`, emoji:'🎡', img:cardImg('sport_sorties.png'), tone:'sport tone-sport-2', kicker:'Famille canonique', body:`<div class="settings-chips embedded"><span>Parc</span><span>Cinéma</span><span>Restaurant</span><span>Week-end</span></div>`})}
      ${playfulBlock({title:'Clubs & lieux', block:'clubs_lieux', onClick:`SuperApp.openModuleList('sport_loisirs','clubs_lieux')`, emoji:'📍', img:cardImg('sport_clubs.png'), tone:'sport tone-sport-3', kicker:'Repères', body:`<div class="settings-chips embedded"><span>Football</span><span>Danse</span><span>Natation</span><span>Cinéma</span><span>Parc</span></div>`})}
      ${playfulBlock({title:'Matériel', block:'materiel', onClick:`SuperApp.openModuleList('sport_loisirs','materiel')`, emoji:'🎒', img:cardImg('sport_materiel.png'), tone:'sport tone-sport-4', kicker:'À préparer', body:rowList(data.sportGear,'🎒','Matériel')})}
      ${playfulBlock({title:'Documents sport', block:'documents_sport', onClick:`SuperApp.openModuleList('sport_loisirs','documents_sport')`, emoji:'📄', img:cardImg('sport_documents.png'), tone:'sport tone-sport-5', kicker:'Dossier', body:`<div class="settings-chips embedded"><span>Licence</span><span>Certificat médical</span><span>Assurance</span><span>Inscription</span></div>`})}
      ${playfulPreview('sport_loisirs','Sport',cardImg('sport_calendrier.png'),'sport tone-sport-3')}
      ${playfulBlock({title:'Alertes / rappels Sport', block:'alertes_rappels_sport', onClick:`SuperApp.openModuleList('sport_loisirs','alertes_rappels_sport')`, emoji:'🔔', img:cardImg('sport_alertes.png'), tone:'sport tone-sport-6', kicker:'Rappels', body:`<div class="settings-chips embedded"><span>Activité aujourd’hui</span><span>Matériel à préparer</span><span>Document à fournir</span></div>`})}`;
  }
  function familyModuleContent(){
    const adults = data.family.filter(m=>m.role !== 'Enfant').length;
    const children = data.family.filter(m=>m.role === 'Enfant').length;
    return `${moduleKpis([[data.family.length,'membres'],[adults,'adultes'],[children,'enfants'],['1 par membre','dossier']])}
      ${playfulBlock({title:'Espace famille', emoji:'👨‍👩‍👧‍👦', img:cardImg('familles_dossier.png'), tone:'family tone-family-1', kicker:'Famille canonique', body:`<p class="play-copy">Chaque personne dispose de sa carte, de ses informations utiles et de son propre dossier administratif : identité, passeport, diplômes, santé, scolarité et assurances.</p>`})}
      <div class="family-spaces">${data.family.map(memberCard).join('')}</div>
      ${playfulBlock({title:'Fonctions documentaires à prévoir', block:'documents_famille', onClick:`SuperApp.openModuleList('familles','documents_famille')`, emoji:'📁', img:cardImg('familles_identite.png'), tone:'family tone-family-2', kicker:'Import futur', action:`<button class="link-btn" disabled>Import futur</button>`, body:`<div class="settings-chips embedded"><span>Import fichiers</span><span>Classement par membre</span><span>Date d’expiration</span><span>Rappels renouvellement</span><span>Synchro cockpit</span></div>`})}
      ${playfulSettings('familles','Familles',cardImg('settings_categories.png'),'family tone-family-3')}`;
  }
  function ageFromBirth(birth){
    const b = parseDMY(birth); if(!b) return '';
    const now = todayObj;
    let age = now.getFullYear() - b.getFullYear();
    const beforeBirthday = (now.getMonth() < b.getMonth()) || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate());
    if(beforeBirthday) age--;
    return `${age} ans`;
  }
  function shortMemberName(name){
    const parts = String(name || '').trim().split(/\s+/);
    if(parts.length <= 2) return name;
    return `${parts[0]} ${parts[parts.length-1]}`;
  }
  function memberCard(m){
    const first = (m.name || '').trim().slice(0,1) || 'F';
    const accent = m.accent || 'violet';
    const avatar = `assets/images/avatars/avatar_${m.id}.png`;
    const age = ageFromBirth(m.birth) || 'Âge à renseigner';
    const role = m.role || 'Famille';
    return `<article class="family-space member-${accent} clickable-card" onclick="if(!event.target.closest('button')) SuperApp.openMember('${m.id}')">
      <div class="member-ribbon"><span>${escapeHtml(role)}</span><em>Carte famille</em></div>
      <div class="member-profile-card">
        <div class="member-portrait" aria-hidden="true"><img src="${avatar}" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';"><span>${first}</span></div>
        <div class="member-identity">
          <h3>${escapeHtml(shortMemberName(m.name))}</h3>
          <strong>${escapeHtml(age)}</strong>
          <div class="member-lines">
            <span><em>🎂</em><b>Naissance</b><small>${escapeHtml(m.birth || 'À renseigner')}</small></span>
            <span><em>📞</em><b>Téléphone</b><small>${escapeHtml(m.phone || 'À renseigner')}</small></span>
            <span><em>✉️</em><b>Email</b><small>${escapeHtml(m.email || 'À renseigner')}</small></span>
          </div>
        </div>
      </div>
      <div class="member-note-box"><b>Notes pratiques</b><p>${escapeHtml(m.notes || 'Ajouter les informations utiles pour le quotidien familial.')}</p></div>
      <div class="member-action-row"><button type="button" onclick="SuperApp.openMember('${m.id}')">Voir</button><button type="button" onclick="SuperApp.openSettingsMember('${m.id}')">Modifier</button><button type="button" onclick="SuperApp.openAdd('familles','document_famille','Dossier membre','Document — ${escapeAttr(m.name)}')">Document</button></div>
      <div class="member-dossier">
        <div class="member-dossier-head"><span>📁 Dossier du membre</span><button type="button" onclick="SuperApp.openMember('${m.id}')" aria-label="Ouvrir le dossier de ${escapeAttr(m.name)}">›</button></div>
        <div class="member-doc-grid">${memberDossierTiles(m).join('')}</div>
      </div>
    </article>`;
  }
  function memberDossierTiles(m){
    const tiles = [
      ['🪪','Carte d’identité','Identité'],
      ['🟩','Passeport','Identité'],
      ['🎓','Diplômes','Scolarité'],
      ['💗','Santé','Santé'],
      ['📚','Scolarité','Scolarité'],
      ['🛡️','Assurances','Administratif']
    ];
    return tiles.map(([icon,title,category])=>`<button class="member-doc-tile" type="button" onclick="SuperApp.openMemberDocList('${m.id}','${category}','${title}')"><span>${icon}</span><b>${title}</b><small>${category}</small></button>`);
  }
  function docCard(d){
    return `<article class="doc-card"><div class="agenda-icon">📄</div><div><b>${d.title}</b><small>${d.desc || d.category}</small></div><span>Prévu</span></article>`;
  }


  const MODULE_LISTS = {
    maison: {
      taches_du_jour:{title:'Tâches du jour', emoji:'🏠', img:cardImg('maison_taches.png'), collection:'tasks', type:'tache', category:'Ménage', filter:x=>x.date===today || x.category==='Ménage', help:'Liste des tâches du jour avec ajout, modification et suppression.'},
      routines:{title:'Routines', emoji:'🔁', img:cardImg('maison_routines.png'), collection:'tasks', type:'tache', category:'Routine', help:'Routines du matin, du soir, linge, ménage et préparation école.'},
      urgences_maison:{title:'Urgences maison', emoji:'⚠️', img:cardImg('maison_urgences.png'), collection:'tasks', type:'tache', category:'Urgence maison', help:'Réparations, pannes, démarches urgentes et points à ne pas oublier.'},
      entretien:{title:'Entretien', emoji:'🛠️', img:cardImg('maison_entretien.png'), collection:'tasks', type:'tache', category:'Entretien', help:'Plomberie, électricité, jardin, assurance et entretien courant.'},
      stock_rangement_maison:{title:'Stock / rangement maison', emoji:'🧺', img:cardImg('maison_stock_rangement.png'), collection:'tasks', type:'tache', category:'Rangement', help:'Placards, linge, produits maison et rangement familial.'}
    },
    courses_repas: {
      menu_du_jour:{title:'Menu du jour', emoji:'🍽️', img:cardImg('courses_menu_jour.png'), collection:'meals', type:'repas', category:'Repas', filter:x=>x.date===today || x.category==='Repas', help:'Repas du jour et idées de menus à préparer.'},
      menu_de_la_semaine:{title:'Menu de la semaine', emoji:'📅', img:cardImg('courses_menu_semaine.png'), collection:'meals', type:'repas', category:'Repas', help:'Menus datés de la semaine, connectables au calendrier global.'},
      liste_des_courses:{title:'Liste des courses', emoji:'🛒', img:cardImg('courses_liste.png'), collection:'shopping', type:'course', category:'Alimentation', help:'Liste cochable, ajouts rapides et suppression des produits.'},
      stock_maison:{title:'Stock maison', emoji:'🧺', img:cardImg('courses_stock.png'), collection:'stock', type:'stock', category:'Stock', help:'Frigo, congélateur, placards et niveaux de stock.'},
      alertes_utiles:{title:'Alertes utiles', emoji:'⚠️', img:cardImg('courses_alertes.png'), collection:'stock', type:'stock', category:'Stock faible', filter:x=>String(x.level||'').toLowerCase()==='faible', help:'Produits faibles, urgences courses et rappels utiles.'},
      budget_courses:{title:'Budget courses', emoji:'💶', img:cardImg('courses_budget.png'), special:'budget', help:'Mini suivi du budget courses du mois.'}
    },
    education: {
      devoirs:{title:'Devoirs', emoji:'📘', img:cardImg('education_devoirs.png'), collection:'homework', type:'devoir', category:'Devoirs', help:'Devoirs par enfant, matière, date et statut.'},
      controles:{title:'Contrôles', emoji:'📝', img:cardImg('education_controles.png'), collection:'homework', type:'devoir', category:'Contrôles', help:'Contrôles à préparer et révisions importantes.'},
      documents_ecole:{title:'Documents école', emoji:'📄', img:cardImg('education_documents.png'), collection:'schoolDocs', type:'document_ecole', category:'Documents école', help:'Documents à signer, assurances scolaires et autorisations.'},
      notes_appreciations:{title:'Notes & appréciations', emoji:'⭐', img:cardImg('education_notes.png'), collection:'grades', type:'note', category:'Notes', help:'Notes, appréciations et suivi scolaire.'},
      activites_scolaires:{title:'Activités scolaires', emoji:'🎒', img:cardImg('education_activites.png'), collection:'homework', type:'devoir', category:'Activités scolaires', help:'Sorties, réunions, matériel et inscriptions.'}
    },
    sante: {
      sante_aujourdhui:{title:'Santé aujourd’hui', emoji:'❤️', img:cardImg('sante_aujourdhui.png'), collection:'health', type:'medicament', category:'Traitements', filter:x=>x.date===today || x.category==='Traitements', help:'Synthèse santé du jour : médicaments, rendez-vous et points importants.'},
      medicaments:{title:'Médicaments', emoji:'💊', img:cardImg('sante_medicaments.png'), collection:'health', type:'medicament', category:'Traitements', filter:x=>x.type==='medication' || x.type==='medicament', help:'Médicaments et prises à suivre.'},
      traitements:{title:'Traitements', emoji:'🧾', img:cardImg('sante_traitements.png'), collection:'health', type:'medicament', category:'Traitements', help:'Traitements en cours, échéances et notes.'},
      rendez_vous_medicaux:{title:'Rendez-vous médicaux', emoji:'🩺', img:cardImg('sante_rdv.png'), collection:'health', type:'rendez_vous_medical', category:'Rendez-vous', filter:x=>x.type==='appointment' || x.type==='rendez_vous_medical', help:'Rendez-vous médicaux avec date, heure et membre concerné.'},
      vaccins:{title:'Vaccins', emoji:'💉', img:cardImg('sante_vaccins.png'), collection:'vaccines', type:'vaccin', category:'Vaccins', help:'Vaccins, rappels et vérifications.'},
      documents_sante:{title:'Documents santé', emoji:'📁', img:cardImg('sante_documents.png'), collection:'healthDocs', type:'document_sante', category:'Documents santé', help:'Ordonnances, mutuelle, certificats et documents santé.'},
      urgences:{title:'Urgences', emoji:'🚨', img:cardImg('sante_urgences.png'), collection:'emergency', type:'urgence_sante', category:'Urgences', help:'Contacts d’urgence, pharmacie de garde et informations vitales.'}
    },
    sport_loisirs: {
      activites_du_jour:{title:'Activités du jour', emoji:'⚽', img:cardImg('sport_activites.png'), collection:'sports', type:'activite', category:'Sport', filter:x=>x.date===today || x.category==='Sport', help:'Activités sportives du jour et préparation.'},
      sorties_familiales:{title:'Sorties familiales', emoji:'🎡', img:cardImg('sport_sorties.png'), collection:'sports', type:'activite', category:'Sortie familiale', help:'Parc, cinéma, restaurant, week-end et sorties en famille.'},
      clubs_lieux:{title:'Clubs & lieux', emoji:'📍', img:cardImg('sport_clubs.png'), collection:'sports', type:'activite', category:'Clubs & lieux', help:'Clubs, lieux d’activités et repères pratiques.'},
      materiel:{title:'Matériel', emoji:'🎒', img:cardImg('sport_materiel.png'), collection:'sportGear', type:'materiel_sport', category:'Matériel', help:'Sacs, gourdes, chaussures, équipements et préparation.'},
      documents_sport:{title:'Documents sport', emoji:'📄', img:cardImg('sport_documents.png'), collection:'sportGear', type:'document_sport', category:'Documents sport', help:'Licences, certificats médicaux, assurances et inscriptions.'},
      alertes_rappels_sport:{title:'Alertes / rappels Sport', emoji:'🔔', img:cardImg('sport_alertes.png'), collection:'sports', type:'activite', category:'Rappel sport', help:'Rappels de préparation, documents à fournir et matériel.'}
    },
    familles: {
      documents_famille:{title:'Documents famille', emoji:'📁', img:cardImg('familles_identite.png'), collection:'familyDocuments', type:'document_famille', category:'Administratif', help:'Documents familiaux, identité, scolarité, santé et assurances.'}
    }
  };

  function listConfig(module, block){ return MODULE_LISTS[canonicalModuleId(module)]?.[block] || null; }
  function visibleCollectionItems(cfg){
    let arr = (data[cfg.collection] || []).filter(x=>!statusIsHidden(x));
    if(cfg.filter) arr = arr.filter(cfg.filter);
    else if(cfg.category) arr = arr.filter(x=>!x.category || x.category===cfg.category || cfg.collection==='shopping' || cfg.collection==='stock');
    return arr;
  }
  function openModuleList(module, block){
    state.returnList = {module:canonicalModuleId(module), block};
    module = canonicalModuleId(module);
    const cfg = listConfig(module, block);
    if(!cfg){ openModule(module); return; }
    if(cfg.special === 'budget'){ openBudgetBoard(); return; }
    const m = moduleById(module);
    const items = visibleCollectionItems(cfg);
    const view = $('#view-apps'); setView('apps'); state.activeModule = module;
    view.innerHTML = `<div class="module-screen-head visual-head ${m.cls}"><div><span class="eyebrow">${cfg.emoji} ${m.name}</span><h2>${cfg.title}</h2><p>${cfg.help || 'Liste exploitable avec ajout, modification et suppression.'}</p></div><img src="${cfg.img || m.image}" alt="" /></div>
      <div class="list-toolbar-card"><button class="btn ghost" onclick="SuperApp.openModule('${module}')">← Retour ${m.short}</button><button class="btn primary" onclick="SuperApp.openAdd('${module}','${cfg.type||eventTypeForModule(module)}','${escapeAttr(cfg.category||'Général')}')">${cfg.emoji} + Ajouter</button></div>
      <div class="management-list">${items.length ? items.map(x=>managementRow(x,cfg)).join('') : `<article class="empty cute-empty"><b>${cfg.emoji} Rien pour le moment</b><small>Ajoute un premier élément pour rendre cette carte vraiment utile.</small><button class="btn primary" onclick="SuperApp.openAdd('${module}','${cfg.type||eventTypeForModule(module)}','${escapeAttr(cfg.category||'Général')}')">+ Ajouter</button></article>`}</div>`;
  }
  function managementRow(x,cfg){
    const done = statusIsDone(x);
    return `<article class="manage-row clickable-card ${done?'done':''}" onclick="SuperApp.openItem('${x.id}')"><div class="manage-emoji">${cfg.emoji || moduleIcon(x.module)}</div><div class="manage-main"><b>${escapeHtml(x.title || x.meal || 'Élément')}</b><small>${escapeHtml(x.category || cfg.category || moduleLabel(x.module))}${x.date?' · '+shortDate(x.date):''}${x.qty?' · '+escapeHtml(x.qty):''}${x.place?' · '+escapeHtml(x.place):''}${x.time?' · '+escapeHtml(x.time):''}</small>${x.desc||x.notes?`<p>${escapeHtml(x.desc||x.notes)}</p>`:''}</div><div class="manage-actions"><button onclick="event.stopPropagation();SuperApp.openItem('${x.id}')">Modifier</button><button onclick="event.stopPropagation();SuperApp.markDone('${x.id}')">Fait</button><button class="danger" onclick="event.stopPropagation();SuperApp.deleteItem('${x.id}')">Suppr.</button></div></article>`;
  }
  function openBudgetBoard(){
    const m = moduleById('courses_repas'); const budget = data.foodBudget || {monthly:0,spent:0,currency:'EUR'};
    const view = $('#view-apps'); setView('apps');
    view.innerHTML = `<div class="module-screen-head visual-head ${m.cls}"><div><span class="eyebrow">💶 Courses & repas</span><h2>Budget courses</h2><p>Mini suivi simple du budget courses sur mobile.</p></div><img src="${cardImg('courses_budget.png')}" alt="" /></div>
      <article class="budget-board-card"><b>${currency(budget.spent)}</b><small>dépensé sur ${currency(budget.monthly)}</small><progress value="${budget.spent}" max="${budget.monthly || 1}"></progress><strong>Reste ${currency((budget.monthly||0)-(budget.spent||0))}</strong></article>
      <div class="list-toolbar-card"><button class="btn ghost" onclick="SuperApp.openModule('courses_repas')">← Retour Courses</button><button class="btn primary" onclick="SuperApp.openBudgetEditor()">Modifier le budget</button></div>`;
  }
  function openBudgetEditor(){
    $('#editTitle').textContent = 'Modifier le budget courses';
    $('#editForm').dataset.type = 'settings_budget_courses'; $('#editForm').dataset.id = '';
    const b = data.foodBudget || {monthly:0,spent:0,currency:'EUR'};
    $('#editFields').innerHTML = `<div class="form-field"><label>Budget mensuel</label><input name="monthly" type="number" value="${Number(b.monthly||0)}"></div><div class="form-field"><label>Dépensé</label><input name="spent" type="number" value="${Number(b.spent||0)}"></div><div class="form-field"><label>Devise</label><input name="currency" value="${escapeAttr(b.currency||'EUR')}"></div>`;
    if($('#editDialog').open) $('#editDialog').close(); $('#editDialog').showModal();
  }
  function openMemberDocList(memberId, category, title){
    const member = data.family.find(m=>m.id===memberId); if(!member) return;
    const cfg = {title:title || category, emoji:'📁', img:cardImg('familles_identite.png'), collection:'familyDocuments', type:'document_famille', category};
    const docs = (data.familyDocuments||[]).filter(x=>!statusIsHidden(x) && (x.member===memberId || !x.member) && (!category || x.category===category));
    const view = $('#view-apps'); setView('apps');
    view.innerHTML = `<div class="module-screen-head visual-head module-family"><div><span class="eyebrow">${member.name}</span><h2>${cfg.emoji} ${title}</h2><p>Dossier visuel du membre, avec ajout, modification et suppression.</p></div><img src="${cfg.img}" alt="" /></div>
      <div class="list-toolbar-card"><button class="btn ghost" onclick="SuperApp.openModule('familles')">← Retour Familles</button><button class="btn primary" onclick="SuperApp.openAdd('familles','document_famille','${escapeAttr(category)}','${escapeAttr(title)} — ${escapeAttr(member.name)}','${memberId}')">+ Ajouter</button></div>
      <div class="management-list">${docs.length?docs.map(x=>managementRow(x,cfg)).join(''):`<article class="empty cute-empty"><b>${cfg.emoji} Aucun document</b><small>Ajoute un premier document pour ${escapeHtml(member.name)}.</small></article>`}</div>`;
  }

  function renderCalendar(){
    const selected = parseDMY(state.selectedDate) || new Date();
    const start = new Date(selected.getFullYear(), selected.getMonth(), 1);
    const first = (start.getDay()+6)%7;
    const gridStart = new Date(start); gridStart.setDate(start.getDate()-first);
    const days = Array.from({length:42},(_,i)=>{ const d=new Date(gridStart); d.setDate(gridStart.getDate()+i); return d; });
    const monthName = selected.toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
    const events = itemsForDate(state.selectedDate);
    const week = weekDays();
    $('#view-calendar').innerHTML = `
      <article class="calendar-hero clickable-card" onclick="SuperApp.openEdit('calendrier')"><div><span>Calendrier familial</span><h2>${monthName}</h2><p>${events.length} élément(s) le ${shortDate(state.selectedDate)}</p></div><img src="assets/images/illustrations/calendar-family.png" alt="Père et fille devant un calendrier" /></article>
      <div class="calendar-visual-strip"><article onclick="SuperApp.openCalendarDate('${today}')"><img src="assets/images/cards/calendar_today.png" alt=""><b>Aujourd’hui</b></article><article onclick="SuperApp.calendarMode('week')"><img src="assets/images/cards/calendar_week.png" alt=""><b>Semaine</b></article><article onclick="SuperApp.openEdit('calendrier')"><img src="assets/images/cards/calendar_important.png" alt=""><b>Ajouter</b></article></div>
      <div class="calendar-controls"><button class="${state.calendarMode==='day'?'active':''}" onclick="SuperApp.calendarMode('day')">Jour</button><button class="${state.calendarMode==='week'?'active':''}" onclick="SuperApp.calendarMode('week')">Semaine</button><button class="${state.calendarMode==='month'?'active':''}" onclick="SuperApp.calendarMode('month')">Mois</button></div>
      <div class="chip-row module-filter-row">${calendarFilters().map(([id,label,icon])=>`<button class="chip ${state.calendarFilter===id?'active':''}" onclick="SuperApp.setCalendarFilter('${id}')">${icon} ${label}</button>`).join('')}</div>
      <div class="calendar-head"><button onclick="SuperApp.shiftMonth(-1)">‹</button><h2>${monthName}</h2><button onclick="SuperApp.shiftMonth(1)">›</button></div>
      ${state.calendarMode==='week' ? `<div class="week-agenda-grid">${week.map(d=>weekDayPanel(d)).join('')}</div>` : `<div class="calendar-grid">${['LUN','MAR','MER','JEU','VEN','SAM','DIM'].map(d=>`<div class="weekday">${d}</div>`).join('')}${days.map(d=>dayCell(d,selected)).join('')}</div>`}
      <div class="section-title"><h2>${displayDate(state.selectedDate)}</h2><button class="link-btn" onclick="SuperApp.openEdit('calendrier')">+ Ajouter</button></div>
      <div class="agenda-list">${events.length ? events.map(x=>agendaRow(x,x.icon,x.label)).join('') : '<div class="empty">Aucun élément pour cette journée.</div>'}</div>`;
  }
  function calendarFilters(){ return [['all','Tous','▦'],['maison','Maison','🏠'],['courses_repas','Courses & repas','🍽️'],['education','Éducation','📘'],['sante','Santé','💗'],['sport_loisirs','Sport / loisirs','⚽'],['familles','Familles','👨‍👩‍👧‍👦'],['calendrier','Autres','📌']]; }
  function weekDayPanel(d){
    const dmy = formatDMY(d); const ev = itemsForDate(dmy);
    return `<article class="week-day-panel ${dmy===state.selectedDate?'active':''}" onclick="SuperApp.selectDate('${dmy}')"><b>${d.toLocaleDateString('fr-FR',{weekday:'short'}).replace('.','')}</b><small>${shortDate(dmy)}</small>${ev.slice(0,3).map(x=>`<span>${x.icon} ${x.title}</span>`).join('') || '<em>Libre</em>'}</article>`;
  }
  function dayCell(d,selected){
    const dmy=formatDMY(d), ev=itemsForDate(dmy); const active=dmy===state.selectedDate; const muted=d.getMonth()!==selected.getMonth();
    return `<button class="day ${active?'active':''} ${muted?'muted':''}" onclick="SuperApp.selectDate('${dmy}')">${d.getDate()}<div class="dots">${ev.slice(0,3).map(e=>`<span class="dot ${e.module||''}"></span>`).join('')}</div></button>`;
  }
  function agendaRow(x,icon,label){ return `<article class="agenda-item clickable-card" onclick="SuperApp.openItem('${x.id}')"><div class="agenda-icon">${icon}</div><div><b>${x.title}</b><small>${label} · ${memberName(x.member)} ${x.date ? '· '+shortDate(x.date):''}</small></div><time>${x.time || ''}</time></article>`; }

  function renderNotifications(){
    const notices = getNotifications();
    const topImages = [['Urgent','assets/images/cards/notifications_alert.png'],['Santé','assets/images/cards/notifications_sante.png'],['Courses','assets/images/cards/notifications_courses.png'],['Maison','assets/images/cards/notifications_maison.png']];
    $('#view-notifications').innerHTML = `<div class="calendar-visual-strip">${topImages.map(([t,img])=>`<article class="clickable-card" onclick="SuperApp.setView('notifications')"><img src="${img}" alt=""><b>${t}</b></article>`).join('')}</div><div class="chip-row"><button class="chip active">Toutes</button><button class="chip">Santé</button><button class="chip">Maison</button><button class="chip">Courses</button><button class="chip">Éducation</button></div><div class="section-title"><h2>Aujourd’hui</h2></div><div class="agenda-list">${notices.length ? notices.map(notificationRow).join('') : '<div class="empty">Aucune notification.</div>'}</div>`;
  }
  function notificationRow(n){ const btnClass=n.module==='sante'?'primary':n.module==='courses_repas'?'green':'blue'; return `<article class="notif-item"><div class="agenda-icon">${n.icon}</div><div><b>${n.title}</b><small>${n.desc}</small><div class="notif-actions"><button class="btn ghost" onclick="SuperApp.openItem('${n.id}')">Voir</button><button class="btn ${btnClass}" onclick="SuperApp.markDone('${n.id}')">Marquer comme fait</button></div></div><time>${n.time}</time></article>`; }

  function renderSettings(){
    const items = [
      ['👨‍👩‍👧‍👦','Famille','Membres du foyer, rôles et informations de base','assets/images/cards/settings_famille.png'],
      ['📱','Applications','Apps actives, disponibles, licences et connexion','assets/images/cards/settings_country.png'],
      ['📁','Catégories','Catégories par application active','assets/images/cards/settings_categories.png'],
      ['🧩','Sous-catégories','Sous-catégories et libellés par catégorie','assets/images/cards/settings_categories.png'],
      ['🔔','Notifications','Préférences globales et par application','assets/images/cards/settings_notifications.png'],
      ['🧰','Données par application','Listes de référence simples par app active','assets/images/cards/settings_data.png'],
      ['🎨','Apparence','Thème, couleurs et personnalisation légère','assets/images/cards/settings_appearance.png'],
      ['🔄','Synchronisation','Cockpit ordinateur, export/import, conflits','assets/images/cards/settings_sync.png'],
      ['🛡️','Données','Sauvegarde locale, import, export, réinitialisation','assets/images/cards/settings_data.png']
    ];
    const active = APP_MODULE_IDS.filter(id=>isAppActive(id)).length;
    const inactive = inactiveAppModules().length;
    $('#view-settings').innerHTML = `
      <article class="sync-summary-card">
        <div><span>CARTES EXPLOITABLES V4.3</span><h2>Tout est cliquable, visuel et mignon</h2><p>Le socle commun se règle ici. La synchronisation sert seulement à connecter et fusionner les données avec le cockpit ordinateur.</p></div>
        <div class="settings-chips embedded"><span>${active} app(s) active(s)</span><span>${inactive} disponible(s)</span><span>${data.offer?.syncEnabled ? 'Synchro active' : 'Mobile seul'}</span></div>
      </article>
      <div class="settings-list">${items.map(([i,t,d,img])=>`<article class="setting-item clickable-card" onclick="SuperApp.openSettings('${t}')"><div class="setting-icon">${i}</div><div><b>${t}</b><small>${d}</small></div><img class="setting-art" src="${img}" alt=""><span class="chev">›</span></article>`).join('')}</div>
      <div class="section-title"><h2>Accès rapide</h2></div>
      <div class="today-grid"><button class="btn ghost" onclick="SuperApp.openSettings('Famille')">Membres</button><button class="btn ghost" onclick="SuperApp.openSettings('Applications')">Apps</button><button class="btn ghost" onclick="SuperApp.openSettings('Synchronisation')">Synchro</button></div>`;
  }

  function openQuickActions(){
    state.returnList = null;
    $('#quickActions').innerHTML = [
      ['maison','🏠','Ajouter une tâche'],['courses_repas','🛒','Ajouter une course'],['calendrier','📅','Ajouter un événement'],['education','📘','Ajouter un devoir'],['sante','💊','Ajouter santé'],['sport_loisirs','⚽','Ajouter activité'],['familles','👨‍👩‍👧‍👦','Ajouter document famille']
    ].map(([id,icon,label])=>`<button class="quick-action" type="button" onclick="SuperApp.openEdit('${id}')"><span>${icon}</span>${label}</button>`).join('');
    $('#actionDialog').showModal();
  }
  function openEdit(type, id=''){
    type = canonicalModuleId(type);
    try { $('#actionDialog').close(); } catch {}
    state.editing = id ? findRecord(id) : null;
    const titleMap={maison:'Ajouter une tâche',courses_repas:'Ajouter une course / repas',calendrier:'Ajouter un élément daté',education:'Ajouter un devoir',sante:'Ajouter santé',sport_loisirs:'Ajouter une activité',familles:'Ajouter un document famille'};
    $('#editTitle').textContent = id ? 'Modifier l’élément' : (titleMap[type] || 'Ajouter');
    $('#editForm').dataset.type = type;
    $('#editForm').dataset.id = id || '';
    const item = state.editing?.item || state.preset || {};
    if(state.editing?.collection==='stock' && !item.type) item.type='stock';
    if(state.editing?.collection==='emergency' && !item.type) item.type='urgence_sante';
    if(state.editing?.collection==='sportGear' && !item.type) item.type = item.category==='Documents sport' ? 'document_sport' : 'materiel_sport';
    $('#editFields').innerHTML = fieldsFor(type,item);
    if($('#editDialog').open) $('#editDialog').close();
    $('#editDialog').showModal();
  }
  function openAdd(module,type='',category='',title='',member=''){
    state.preset = {type, category, title, member};
    openEdit(module);
  }
  function openMember(memberId){
    const member = data.family.find(m=>m.id===memberId); if(!member) return;
    $('#editTitle').textContent = `Dossier — ${member.name}`;
    $('#editForm').dataset.type = 'settings';
    $('#editForm').dataset.id = '';
    if($('#editDialog').open) $('#editDialog').close();
    $('#editFields').innerHTML = `<div class="member-detail-panel"><p><b>Rôle :</b> ${member.role || 'Famille'}</p><p><b>Naissance :</b> ${member.birth || 'À renseigner'} · ${ageFromBirth(member.birth)}</p><p><b>Téléphone :</b> ${member.phone || 'À renseigner'}</p><p><b>Email :</b> ${member.email || 'À renseigner'}</p><p>${escapeHtml(member.notes||'')}</p></div><div class="settings-chips embedded"><span>Carte d’identité</span><span>Passeport</span><span>Diplômes</span><span>Santé</span><span>Scolarité</span><span>Assurances</span></div><button class="btn primary" type="button" onclick="SuperApp.openAdd('familles','document_famille','Dossier membre','Document — ${escapeAttr(member.name)}')">Ajouter un document</button>`;
    $('#editDialog').showModal();
  }
  function memberOptions(selected='family'){
    return `<option value="family" ${selected==='family'?'selected':''}>Toute la famille</option>${data.family.map(m=>`<option value="${m.id}" ${selected===m.id?'selected':''}>${m.name}</option>`).join('')}`;
  }
  function moduleOptions(selected='calendrier'){
    selected = canonicalModuleId(selected);
    return [['calendrier','Événement simple'], ...activeModules().filter(m=>APP_MODULE_IDS.includes(m.id)).map(m=>[m.id,m.name])].map(([id,label])=>`<option value="${id}" ${selected===id?'selected':''}>${label}</option>`).join('');
  }
  function fieldsFor(type,item={}){
    type = canonicalModuleId(type);
    const moduleValue = canonicalModuleId(item.module || (type === 'calendrier' ? 'calendrier' : type));
    const dateField=`<div class="form-field"><label>Date JJ-MM-AAAA</label><input name="date" value="${item.date || state.selectedDate || today}" pattern="\\d{2}-\\d{2}-\\d{4}" required></div>`;
    const title=`<div class="form-field"><label>Titre</label><input name="title" required placeholder="Titre" value="${escapeAttr(item.title||'')}"></div>`;
    const member=`<div class="form-field"><label>Membre</label><select name="member">${memberOptions(item.member || 'family')}</select></div>`;
    const hour=`<div class="form-field"><label>Heure</label><input name="time" placeholder="Optionnel" value="${escapeAttr(item.time||'')}"></div>`;
    const status=`<div class="form-field"><label>Statut</label><select name="status"><option value="a_faire" ${item.status==='a_faire'?'selected':''}>À faire</option><option value="en_cours" ${item.status==='en_cours'?'selected':''}>En cours</option><option value="fait" ${item.status==='fait'?'selected':''}>Fait</option><option value="reporte" ${item.status==='reporte'?'selected':''}>Reporté</option></select></div>`;
    const category=`<div class="form-field"><label>Catégorie</label><input name="category" value="${escapeAttr(item.category||'Général')}"></div>`;
    const notes=`<div class="form-field"><label>Notes</label><textarea name="notes" rows="3" placeholder="Notes utiles">${escapeHtml(item.notes||item.desc||'')}</textarea></div>`;
    let extra = '';
    if(type==='calendrier') extra = `<div class="form-field"><label>Envoyer dans</label><select name="targetModule">${moduleOptions(moduleValue)}</select></div><div class="form-field"><label>Type</label><select name="type"><option value="evenement" ${item.type==='evenement'?'selected':''}>Événement simple</option><option value="tache" ${item.type==='tache'?'selected':''}>Tâche</option><option value="repas" ${item.type==='repas'?'selected':''}>Repas / menu</option><option value="devoir" ${item.type==='devoir'?'selected':''}>Devoir / école</option><option value="rendez_vous_medical" ${item.type==='rendez_vous_medical'||item.type==='appointment'?'selected':''}>Rendez-vous médical</option><option value="activite" ${item.type==='activite'?'selected':''}>Activité sport / loisirs</option><option value="document" ${item.type==='document'?'selected':''}>Document / échéance</option></select></div>`;
    if(type==='courses_repas') extra = `<div class="form-field"><label>Quantité / portion</label><input name="qty" placeholder="Ex : 1 kg" value="${escapeAttr(item.qty||'')}"></div>${(item.type==='stock'||item.place||item.level)?`<div class="form-field"><label>Lieu</label><input name="place" placeholder="Frigo, placard..." value="${escapeAttr(item.place||'')}"></div><div class="form-field"><label>Niveau</label><select name="level"><option ${item.level==='Bon'?'selected':''}>Bon</option><option ${item.level==='Moyen'?'selected':''}>Moyen</option><option ${item.level==='Faible'?'selected':''}>Faible</option></select></div>`:''}<input type="hidden" name="targetModule" value="courses_repas"><input type="hidden" name="type" value="${item.type || 'course'}">`;
    if(type==='sante') extra = `<div class="form-field"><label>Type</label><select name="type"><option value="medicament" ${item.type==='medication'||item.type==='medicament'?'selected':''}>Médicament</option><option value="rendez_vous_medical" ${item.type==='appointment'||item.type==='rendez_vous_medical'?'selected':''}>Rendez-vous médical</option><option value="vaccin" ${item.type==='vaccin'?'selected':''}>Vaccin</option><option value="document_sante" ${item.type==='document_sante'?'selected':''}>Document santé</option><option value="urgence_sante" ${item.type==='urgence_sante'?'selected':''}>Urgence / contact</option></select></div><input type="hidden" name="targetModule" value="sante">`;
    if(type==='familles') extra = `<input type="hidden" name="targetModule" value="familles"><input type="hidden" name="type" value="document_famille">`;
    if(['maison','education','sport_loisirs'].includes(type)) extra = `<input type="hidden" name="targetModule" value="${type}"><input type="hidden" name="type" value="${item.type || eventTypeForModule(type)}">`;
    const danger = item.id && !item.readonly ? `<div class="danger-actions"><button class="btn ghost" type="button" onclick="SuperApp.archiveItem('${item.id}')">Archiver</button><button class="btn ghost danger" type="button" onclick="SuperApp.deleteItem('${item.id}')">Supprimer</button></div>` : '';
    return `${extra}${title}${dateField}${hour}${member}${category}${status}${notes}${danger}`;
  }
  function escapeHtml(str){ return String(str).replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
  function escapeAttr(str){ return escapeHtml(str).replace(/"/g,'&quot;'); }
  function addItem(type,item){
    const id = $('#editForm').dataset.id;
    const targetModule = canonicalModuleId(item.targetModule || item.module || type);
    if(!isAppActive(targetModule)){ alert('Cette application n’est pas activée. Active-la avant d’ajouter des données.'); return; }
    delete item.targetModule;
    if(id && state.editing){
      const current = state.editing.item;
      Object.assign(current, item, {module: targetModule, date:item.date || current.date || today});
      touchSync(current);
      if(current.type === 'rendez_vous_medical') current.type = 'appointment';
      if(current.type === 'medicament') current.type = 'medication';
      save(); return;
    }
    const collection = targetCollectionFor(targetModule,item.type);
    const record = decorateSync({...item, id:uid(), module:targetModule, date:item.date || today, status:item.status || 'a_faire', statut:item.status || 'a_faire'});
    if(record.type === 'rendez_vous_medical') record.type = 'appointment';
    if(record.type === 'medicament') record.type = 'medication';
    data[collection].push(record);
  }
  function markDone(id){
    const found = findRecord(id);
    if(found){ found.item.status='fait'; found.item.statut='fait'; touchSync(found.item); }
    save(); render();
  }
  function archiveItem(id){
    const found = findRecord(id); if(!found) return;
    if(confirm('Archiver cet élément ? Il restera synchronisable et consultable.')){
      found.item.status='archive'; found.item.statut='archive'; found.item.syncStatus='pending_delete'; touchSync(found.item); save(); try{$('#editDialog').close();}catch{} render();
    }
  }
  function deleteItem(id){
    const found = findRecord(id); if(!found) return;
    if(confirm('Supprimer cet élément ? Il disparaîtra de l’interface mais restera marqué pour la synchronisation.')){
      found.item.status='supprime'; found.item.statut='supprime'; found.item.syncStatus='pending_delete'; touchSync(found.item);
      save(); try{$('#editDialog').close();}catch{} render();
    }
  }
  function openItem(id){
    if(String(id).startsWith('birthday-')){ setView('calendar'); return; }
    const found = findRecord(id);
    if(!found){ alert('Élément introuvable ou déjà archivé.'); return; }
    const module = canonicalModuleId(found.item.module || 'calendrier');
    openEdit(module === 'calendrier' ? 'calendrier' : module, id);
  }
  function openCalendarDate(dmy,id=''){
    state.selectedDate = dmy || today;
    state.calendarMode = 'day';
    setView('calendar');
    if(id) setTimeout(()=>openItem(id),120);
  }
  function openCalendarModule(module){
    state.calendarFilter = module === 'all' ? 'all' : canonicalModuleId(module || 'all');
    state.calendarMode = 'week';
    setView('calendar');
  }
  function setCalendarFilter(module){ state.calendarFilter = module === 'all' ? 'all' : canonicalModuleId(module); renderCalendar(); }
  function openSettings(section,module=''){
    setView('settings');
    setTimeout(()=>showSettingsPanel(section,module),60);
  }
  function normalizeSettingsSection(section){
    return String(section || 'parametres').toLowerCase().normalize('NFD').replace(/[-]/g,'').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
  }
  function activeAppSelect(selected='maison'){
    selected = canonicalModuleId(selected);
    return activeModules().filter(m=>APP_MODULE_IDS.includes(m.id)).map(m=>`<option value="${m.id}" ${selected===m.id?'selected':''}>${m.name}</option>`).join('');
  }
  function encodeKey(value){ return encodeURIComponent(String(value || '')); }
  function decodeKey(value){ try { return decodeURIComponent(String(value || '')); } catch { return String(value || ''); } }
  function lineArray(value){ return String(value || '').split(/[\n,;]/).map(x=>x.trim()).filter(Boolean); }
  function labelsForModule(module){
    const cats = data.categories?.[canonicalModuleId(module)] || {};
    return Object.keys(cats).length ? Object.keys(cats) : ['Général'];
  }
  function showSettingsPanel(section,module=''){
    const key = normalizeSettingsSection(section);
    if($('#editDialog').open) $('#editDialog').close();
    $('#editForm').dataset.type = 'settings';
    $('#editForm').dataset.id = '';
    $('#editTitle').textContent = `Paramètres — ${String(section || 'Paramètres')}`;
    let html = '';
    if(key.includes('famille')) html = settingsFamilyPanel();
    else if(key.includes('application')) html = settingsAppsPanel();
    else if(key.includes('categorie') && !key.includes('sous')) html = settingsCategoriesPanel(module);
    else if(key.includes('sous')) html = settingsSubCategoriesPanel(module);
    else if(key.includes('notification')) html = settingsNotificationsPanel();
    else if(key.includes('donnees_par_application')) html = settingsReferencePanel(module);
    else if(key.includes('apparence')) html = settingsAppearancePanel();
    else if(key.includes('synchronisation')) html = settingsSyncPanel();
    else if(key.includes('donnees')) html = settingsDataPanel();
    else html = `<div class="empty">Choisissez une rubrique de paramètres.</div>`;
    $('#editFields').innerHTML = html;
    $('#editDialog').showModal();
  }
  function settingsVisualHero({title, text, img, emoji='✨', chips=[]}){
    return `<article class="settings-visual-hero"><div><span>${emoji} Réglage visuel</span><h3>${title}</h3><p>${text}</p>${chips.length?`<div class="settings-chips embedded">${chips.map(c=>`<span>${c}</span>`).join('')}</div>`:''}</div><img src="${img}" alt="" onerror="this.style.display='none'"></article>`;
  }
  function settingsModuleTabs(selected, targetLabel){
    return `<div class="settings-module-tabs">${activeModules().filter(m=>APP_MODULE_IDS.includes(m.id)).map(m=>`<button class="settings-module-tab ${selected===m.id?'active':''}" type="button" onclick="SuperApp.openSettings('${targetLabel}','${m.id}')"><img src="${m.image}" alt="" onerror="this.style.display='none'"><span>${m.icon}</span><b>${m.short}</b></button>`).join('')}</div>`;
  }
  function settingsMemberVisualCard(m){
    const first = (m.name || '').trim().slice(0,1) || 'F';
    const accent = m.accent || 'violet';
    const avatar = `assets/images/avatars/avatar_${m.id}.png`;
    return `<article class="settings-member-card member-${accent} clickable-card" onclick="SuperApp.openSettingsMember('${m.id}')"><div class="settings-member-avatar"><img src="${avatar}" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';"><span>${first}</span></div><div><b>${escapeHtml(shortMemberName(m.name))}</b><small>${escapeHtml(m.role||'Famille')} · ${escapeHtml(ageFromBirth(m.birth)||'Âge à renseigner')}</small><p>${escapeHtml(m.notes||'Notes pratiques à compléter.')}</p></div><em>Modifier</em></article>`;
  }
  function settingImageForModule(id){
    return moduleById(id).image || 'assets/images/mobile/superapp.png';
  }
  function notificationImage(id){
    return {maison:'assets/images/cards/notifications_maison.png',courses_repas:'assets/images/cards/notifications_courses.png',education:'assets/images/cards/notifications_education.png',sante:'assets/images/cards/notifications_sante.png',sport_loisirs:'assets/images/cards/notifications_sport.png',familles:'assets/images/cards/calendar_family.png'}[canonicalModuleId(id)] || 'assets/images/cards/notifications_alert.png';
  }
  function settingsFamilyPanel(){
    const visibleMembers = data.family.filter(m=>m.status !== 'archive' && m.statut !== 'archive');
    return `${settingsVisualHero({title:'Mon foyer', text:'Le socle famille reste disponible même avec une seule application active. On gère ici les cartes membres du quotidien.', img:'assets/images/cards/settings_famille.png', emoji:'👨‍👩‍👧‍👦', chips:[`${visibleMembers.length} membre(s)`, 'Socle commun', 'Mobile autonome']})}
      <div class="settings-family-grid">${visibleMembers.map(settingsMemberVisualCard).join('')}</div>
      <button class="btn primary visual-wide" type="button" onclick="SuperApp.openSettingsMember('')">+ Ajouter un membre</button>`;
  }
  function openSettingsMember(id=''){
    const m = data.family.find(x=>x.id===id) || {};
    $('#editTitle').textContent = id ? 'Modifier un membre' : 'Ajouter un membre';
    $('#editForm').dataset.type = 'settings_member';
    $('#editForm').dataset.id = id || '';
    $('#editFields').innerHTML = `<div class="member-edit-preview member-${escapeAttr(m.accent||'violet')}"><div class="settings-member-avatar"><img src="assets/images/avatars/avatar_${escapeAttr(m.id||'nouveau')}.png" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';"><span>${escapeHtml((m.name||'?').slice(0,1))}</span></div><div><b>${escapeHtml(m.name||'Nouveau membre')}</b><small>${escapeHtml(m.role||'Rôle à définir')} · ${escapeHtml(ageFromBirth(m.birth)||'Âge à renseigner')}</small><p>${escapeHtml(m.notes||'Cette carte apparaîtra dans Familles et dans le socle commun.')}</p></div></div>
      <div class="form-field"><label>Prénom et nom</label><input name="name" required value="${escapeAttr(m.name||'')}"></div>
      <div class="form-field"><label>Rôle</label><select name="role"><option ${m.role==='Parent'?'selected':''}>Parent</option><option ${m.role==='Papa'?'selected':''}>Papa</option><option ${m.role==='Maman'?'selected':''}>Maman</option><option ${m.role==='Enfant'?'selected':''}>Enfant</option><option ${m.role==='Tuteur'?'selected':''}>Tuteur</option><option ${m.role==='Proche'?'selected':''}>Proche</option></select></div>
      <div class="form-field"><label>Date de naissance JJ-MM-AAAA</label><input name="birth" value="${escapeAttr(m.birth||'')}"></div>
      <div class="form-field"><label>Téléphone</label><input name="phone" value="${escapeAttr(m.phone||'')}"></div>
      <div class="form-field"><label>Email</label><input name="email" value="${escapeAttr(m.email||'')}"></div>
      <div class="form-field"><label>Couleur / avatar</label><select name="accent"><option value="violet" ${m.accent==='violet'?'selected':''}>Violet doux</option><option value="rose" ${m.accent==='rose'?'selected':''}>Rose</option><option value="bleu" ${m.accent==='bleu'?'selected':''}>Bleu</option><option value="vert" ${m.accent==='vert'?'selected':''}>Vert</option><option value="orange" ${m.accent==='orange'?'selected':''}>Orange</option></select></div>
      <div class="form-field"><label>Notes pratiques</label><textarea name="notes" rows="3">${escapeHtml(m.notes||'')}</textarea></div>
      ${id ? `<div class="danger-actions"><button class="btn ghost danger" type="button" onclick="SuperApp.archiveMember('${id}')">Archiver le membre</button></div>` : ''}`;
  }
  function settingsAppsPanel(){
    data.appsRegistry = makeAppsRegistry(data.appsRegistry || {});
    return `${settingsVisualHero({title:'Applications familiales', text:'Chaque application peut fonctionner seule. Les cartes actives deviennent utilisables, les autres restent disponibles pour une activation plus tard.', img:'assets/images/mobile/superapp.png', emoji:'📱', chips:[`${activeModules().filter(m=>APP_MODULE_IDS.includes(m.id)).length} active(s)`, 'Paliers commerciaux', 'Connexion optionnelle']})}
      <div class="settings-app-grid">${APP_MODULE_IDS.map(id=>{ const m=moduleById(id), r=appRecord(id); return `<article class="settings-app-card ${r.actif?'active':'locked'}"><img src="${m.image}" alt="" onerror="this.style.display='none'"><div><span>${m.icon}</span><b>${m.name}</b><small>${r.actif?'Activée':'Disponible'} · ${r.connectedToDesktop?'Connectée ordinateur':'Non connectée ordinateur'}</small></div>${r.actif?`<button class="btn ghost" type="button" onclick="SuperApp.deactivateApp('${id}')">Désactiver</button>`:`<button class="btn primary" type="button" onclick="SuperApp.activateApp('${id}')">Activer</button>`}</article>`; }).join('')}</div>`;
  }
  function settingsCategoriesPanel(module=''){
    const selected = canonicalModuleId(module || activeModules().find(m=>APP_MODULE_IDS.includes(m.id))?.id || 'maison');
    const cats = data.categories[selected] || {};
    return `${settingsVisualHero({title:`Catégories ${moduleLabel(selected)}`, text:'Les catégories structurent chaque application active. Elles se règlent sur mobile et resteront compatibles avec la synchronisation.', img:'assets/images/cards/settings_categories.png', emoji:'📁', chips:[`${Object.keys(cats).length} catégorie(s)`, moduleLabel(selected), 'Paramétrage local']})}
      ${settingsModuleTabs(selected,'Catégories')}
      <div class="settings-category-grid">${Object.keys(cats).map(cat=>`<article class="settings-category-card clickable-card" onclick="SuperApp.openCategoryEditor('${selected}','${encodeKey(cat)}')"><img src="${settingImageForModule(selected)}" alt="" onerror="this.style.display='none'"><div><b>${escapeHtml(cat)}</b><small>${(cats[cat]||[]).length} sous-catégorie(s)</small><p>${(cats[cat]||[]).slice(0,4).map(x=>`<span>${escapeHtml(x)}</span>`).join('')}</p></div><em>Modifier</em></article>`).join('') || '<div class="empty">Aucune catégorie.</div>'}</div>
      <button class="btn primary visual-wide" type="button" onclick="SuperApp.openCategoryEditor('${selected}','')">+ Ajouter une catégorie</button>`;
  }
  function settingsSubCategoriesPanel(module=''){
    return settingsCategoriesPanel(module) + `<div class="settings-tip-card"><span>🧩</span><div><b>Sous-catégories</b><small>Ouvre une catégorie pour modifier les libellés ligne par ligne.</small></div></div>`;
  }
  function openCategoryEditor(module, encodedCat=''){
    module = canonicalModuleId(module);
    const cat = decodeKey(encodedCat);
    const subs = cat && data.categories[module]?.[cat] ? data.categories[module][cat] : [];
    $('#editTitle').textContent = cat ? `Modifier catégorie — ${cat}` : `Ajouter catégorie — ${moduleLabel(module)}`;
    $('#editForm').dataset.type = 'settings_category';
    $('#editForm').dataset.id = `${module}|${encodeKey(cat)}`;
    $('#editFields').innerHTML = `<input type="hidden" name="module" value="${module}">
      <input type="hidden" name="oldName" value="${escapeAttr(cat)}">
      ${settingsVisualHero({title:cat || 'Nouvelle catégorie', text:'Ajoute des libellés simples pour rendre les écrans plus lisibles et plus rapides à utiliser.', img:'assets/images/cards/settings_categories.png', emoji:'📁', chips:[moduleLabel(module),'Mobile autonome']})}
      <div class="form-field"><label>Nom de la catégorie</label><input name="name" required value="${escapeAttr(cat)}"></div>
      <div class="form-field"><label>Sous-catégories / libellés</label><textarea name="children" rows="7" placeholder="Une sous-catégorie par ligne">${escapeHtml(subs.join('\n'))}</textarea></div>
      ${cat ? `<div class="danger-actions"><button class="btn ghost danger" type="button" onclick="SuperApp.archiveCategory('${module}','${encodeKey(cat)}')">Archiver la catégorie</button></div>` : ''}`;
  }
  function settingsNotificationsPanel(){
    const prefs = data.settings.notificationsPrefs || {};
    const active = APP_MODULE_IDS.filter(id=>appRecord(id).actif);
    const row = (id,label,emoji,img,desc)=>`<label class="settings-notif-card"><input type="checkbox" name="${id}" ${prefs[id]!==false?'checked':''}><img src="${img}" alt="" onerror="this.style.display='none'"><div><span>${emoji}</span><b>${label}</b><small>${desc}</small></div><em>${prefs[id]!==false?'Activé':'Désactivé'}</em></label>`;
    $('#editForm').dataset.type = 'settings_notifications';
    return `${settingsVisualHero({title:'Notifications', text:'Le centre de notifications reste autonome. La synchronisation ne fait que transporter les préférences entre supports.', img:'assets/images/cards/settings_notifications.png', emoji:'🔔', chips:['Global', `${active.length} app(s) active(s)`, 'Rappels doux']})}
      <div class="settings-notif-grid">${row('global','Notifications globales','🔔','assets/images/cards/notifications_alert.png','Rappels généraux du cockpit mobile')}${row('sauvegarde','Sauvegarde','🛡️','assets/images/cards/settings_data.png','Rappel de sauvegarde locale')}${row('synchro','Synchronisation / conflits','🔄','assets/images/cards/settings_sync.png','Alertes d’import, export et conflits')}${APP_MODULE_IDS.map(id=>{const m=moduleById(id); return row(id,m.name,m.icon,notificationImage(id),appRecord(id).actif?'Application active':'Application disponible');}).join('')}</div>`;
  }
  function settingsReferencePanel(module=''){
    const selected = canonicalModuleId(module || activeModules().find(m=>APP_MODULE_IDS.includes(m.id))?.id || 'maison');
    const groups = data.referenceData?.[selected] || {};
    return `${settingsVisualHero({title:`Données ${moduleLabel(selected)}`, text:'Ces listes servent à préparer l’application directement depuis le mobile : magasins, lieux, professionnels, matières, clubs, documents.', img:'assets/images/cards/settings_data.png', emoji:'🧰', chips:[moduleLabel(selected), `${Object.keys(groups).length} liste(s)`, 'Sans import obligatoire']})}
      ${settingsModuleTabs(selected,'Données par application')}
      <div class="settings-reference-grid">${Object.keys(groups).map(g=>`<article class="settings-reference-card clickable-card" onclick="SuperApp.openReferenceEditor('${selected}','${encodeKey(g)}')"><img src="${settingImageForModule(selected)}" alt="" onerror="this.style.display='none'"><div><b>${escapeHtml(g)}</b><small>${(groups[g]||[]).length} valeur(s)</small><p>${(groups[g]||[]).slice(0,4).map(x=>`<span>${escapeHtml(x)}</span>`).join('')}</p></div><em>Modifier</em></article>`).join('')}</div>
      <button class="btn primary visual-wide" type="button" onclick="SuperApp.openReferenceEditor('${selected}','')">+ Ajouter une liste</button>`;
  }
  function openReferenceEditor(module, encodedGroup=''){
    module = canonicalModuleId(module);
    const group = decodeKey(encodedGroup);
    const values = group && data.referenceData?.[module]?.[group] ? data.referenceData[module][group] : [];
    $('#editTitle').textContent = group ? `Modifier liste — ${group}` : `Ajouter une liste — ${moduleLabel(module)}`;
    $('#editForm').dataset.type = 'settings_reference';
    $('#editForm').dataset.id = `${module}|${encodeKey(group)}`;
    $('#editFields').innerHTML = `<input type="hidden" name="module" value="${module}"><input type="hidden" name="oldName" value="${escapeAttr(group)}">
      ${settingsVisualHero({title:group || 'Nouvelle liste', text:'Une valeur par ligne. Ces données restent locales et synchronisables plus tard.', img:'assets/images/cards/settings_data.png', emoji:'🧰', chips:[moduleLabel(module),'Liste de référence']})}
      <div class="form-field"><label>Nom de la liste</label><input name="name" required value="${escapeAttr(group)}" placeholder="Ex : magasins, lieux, professionnels"></div>
      <div class="form-field"><label>Valeurs</label><textarea name="values" rows="7" placeholder="Une valeur par ligne">${escapeHtml(values.join('\n'))}</textarea></div>`;
  }
  function settingsAppearancePanel(){
    const a = data.settings.appearance || {};
    $('#editForm').dataset.type = 'settings_appearance';
    return `${settingsVisualHero({title:'Apparence', text:'L’interface reste familiale, douce et mignonne. Ici on règle seulement l’ambiance visuelle, sans toucher à la charte verrouillée.', img:'assets/images/cards/settings_appearance.png', emoji:'🎨', chips:[a.theme||'clair', a.accent||'familial', a.accueil||'resume']})}
      <div class="settings-choice-grid"><label><span>☀️</span><b>Thème</b><select name="theme"><option value="clair" ${a.theme==='clair'?'selected':''}>Clair</option><option value="sombre" ${a.theme==='sombre'?'selected':''}>Sombre</option><option value="auto" ${a.theme==='auto'?'selected':''}>Automatique</option></select></label><label><span>🌈</span><b>Accent visuel</b><input name="accent" value="${escapeAttr(a.accent||'familial')}"></label><label><span>🏠</span><b>Accueil préféré</b><select name="accueil"><option value="resume" ${a.accueil==='resume'?'selected':''}>Résumé familial</option><option value="apps" ${a.accueil==='apps'?'selected':''}>Applications</option><option value="calendrier" ${a.accueil==='calendrier'?'selected':''}>Calendrier</option></select></label></div>`;
  }
  function settingsSyncPanel(){
    return `${settingsVisualHero({title:'Synchronisation', text:'Cette zone sert à connecter les supports, importer, exporter, fusionner et traiter les conflits. Elle ne remplace pas la saisie mobile.', img:'assets/images/cards/settings_sync.png', emoji:'🔄', chips:[`Mode : ${data.offer?.syncMode || 'mobile_only'}`, data.offer?.syncEnabled ? 'Synchro active' : 'Mobile seul', data.offer?.cockpitOrdinateur ? 'Ordinateur acheté' : 'Ordinateur non acheté']})}
      <div class="settings-sync-grid"><article><span>📱</span><b>Cockpit mobile</b><small>Actif et autonome</small></article><article><span>💻</span><b>Cockpit ordinateur</b><small>${data.offer?.cockpitOrdinateur ? 'Acheté' : 'Non connecté'}</small></article><article><span>🔐</span><b>Conflits</b><small>Gérés à l’import/export</small></article></div>
      <div class="today-grid"><button class="btn ghost" type="button" onclick="SuperApp.exportData()">Exporter JSON</button><button class="btn ghost" type="button" onclick="document.getElementById('importInput').click()">Importer JSON</button></div>`;
  }
  function settingsDataPanel(){
    return `${settingsVisualHero({title:'Sauvegarde & données', text:'Les données de base se saisissent dans les rubriques visuelles. Ici on garde les outils de sauvegarde, transfert et réinitialisation.', img:'assets/images/cards/settings_data.png', emoji:'🛡️', chips:['Sauvegarde locale','Export JSON','Import JSON']})}
      <div class="settings-data-actions"><button class="btn ghost" type="button" onclick="SuperApp.exportData()"><span>📤</span><b>Exporter</b><small>Sauvegarde ou transfert</small></button><button class="btn ghost" type="button" onclick="document.getElementById('importInput').click()"><span>📥</span><b>Importer</b><small>Fusion contrôlée</small></button><button class="btn ghost danger" type="button" onclick="SuperApp.resetData()"><span>♻️</span><b>Réinitialiser</b><small>Confirmation obligatoire</small></button></div>`;
  }
  function saveSettingsForm(type,item,id=''){

    if(type==='settings_budget_courses'){
      data.foodBudget = {monthly:Number(item.monthly||0), spent:Number(item.spent||0), currency:item.currency || data.settings.currency || 'EUR'};
      save(); render(); try{$('#editDialog').close();}catch{} openBudgetBoard(); return;
    }    if(type==='settings_member'){
      const memberId = id || uid();
      const existing = data.family.find(m=>m.id===memberId);
      const record = decorateSync({...(existing||{}), ...item, id:memberId, module:'socle', type:'membre', title:item.name, statut:'actif'});
      if(existing) Object.assign(existing, record); else data.family.push(record);
      save(); render(); showSettingsPanel('Famille'); return;
    }
    if(type==='settings_category'){
      const module = canonicalModuleId(item.module); const oldName = item.oldName || ''; const name = String(item.name||'').trim();
      if(!data.categories[module]) data.categories[module] = {};
      if(oldName && oldName !== name) delete data.categories[module][oldName];
      data.categories[module][name] = lineArray(item.children);
      save(); render(); showSettingsPanel('Catégories',module); return;
    }
    if(type==='settings_reference'){
      const module = canonicalModuleId(item.module); const oldName = item.oldName || ''; const name = String(item.name||'').trim();
      if(!data.referenceData[module]) data.referenceData[module] = {};
      if(oldName && oldName !== name) delete data.referenceData[module][oldName];
      data.referenceData[module][name] = lineArray(item.values);
      save(); render(); showSettingsPanel('Données par application',module); return;
    }
    if(type==='settings_notifications'){
      const prefs = {global:!!item.global, sauvegarde:!!item.sauvegarde, synchro:!!item.synchro};
      APP_MODULE_IDS.forEach(mid=>prefs[mid]=!!item[mid]); data.settings.notificationsPrefs = prefs;
      save(); render(); showSettingsPanel('Notifications'); return;
    }
    if(type==='settings_appearance'){
      data.settings.appearance = {...(data.settings.appearance||{}), ...item}; data.settings.theme = item.theme || data.settings.theme;
      save(); render(); showSettingsPanel('Apparence'); return;
    }
    $('#editDialog').close();
  }
  function archiveMember(id){
    const m = data.family.find(x=>x.id===id); if(!m) return;
    if(confirm('Archiver ce membre ? Ses anciennes données resteront synchronisables.')){ m.status='archive'; m.statut='archive'; touchSync(m); save(); render(); showSettingsPanel('Famille'); }
  }
  function archiveCategory(module, encodedCat){
    module = canonicalModuleId(module); const cat = decodeKey(encodedCat);
    if(confirm('Archiver cette catégorie ? Elle sera retirée de la liste mais les anciennes données conserveront leur libellé.')){ delete data.categories[module][cat]; save(); render(); showSettingsPanel('Catégories',module); }
  }

  function openActivationPanel(id){
    id = canonicalModuleId(id);
    const m = moduleById(id);
    if(!APP_MODULE_IDS.includes(id)){ if(id==='calendrier') setView('calendar'); return; }
    $('#editTitle').textContent = `Activation — ${m.name}`;
    $('#editForm').dataset.type = 'settings';
    $('#editForm').dataset.id = '';
    if($('#editDialog').open) $('#editDialog').close();
    $('#editFields').innerHTML = `<div class="empty"><b>${m.name}</b> est disponible comme application indépendante. Elle peut fonctionner seule sur le cockpit mobile et être connectée plus tard au cockpit ordinateur.</div><div class="settings-chips embedded"><span>Cockpit mobile</span><span>Application indépendante</span><span>Connexion ordinateur optionnelle</span></div><button class="btn primary" type="button" onclick="SuperApp.activateApp('${id}')">Activer cette application</button>`;
    $('#editDialog').showModal();
  }
  function activateApp(id){
    id = canonicalModuleId(id); data.appsRegistry = makeAppsRegistry(data.appsRegistry || {});
    if(data.appsRegistry[id]){ Object.assign(data.appsRegistry[id], {actif:true, installe:true, licence:'active', sourceActivation:'cockpit_mobile', activatedAt:nowISO(), connectedToMobile:true, syncStatus:'pending_update'}); }
    save(); if($('#editDialog').open) $('#editDialog').close(); render(); openModule(id);
  }
  function deactivateApp(id){
    id = canonicalModuleId(id); data.appsRegistry = makeAppsRegistry(data.appsRegistry || {});
    const activeCount = APP_MODULE_IDS.filter(x=>data.appsRegistry[x]?.actif).length;
    if(activeCount <= 1){ alert('Le cockpit mobile doit garder au moins une application active.'); return; }
    if(confirm('Désactiver cette application ? Ses données restent sauvegardées mais ne seront plus affichées dans le calendrier ni les notifications.')){
      Object.assign(data.appsRegistry[id], {actif:false, licence:'inactive', syncStatus:'pending_update'}); save(); render();
    }
  }

  function buildExportData(){
    const sourceCollections = structuredClone(data);
    const categories = [];
    const sousCategories = [];
    Object.entries(data.categories || {}).forEach(([module,cats])=>{
      const canonical = canonicalModuleId(module);
      Object.entries(cats || {}).forEach(([name,children])=>{
        const catId = `${canonical}_${name}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'_');
        categories.push(decorateSync({id:catId,module:canonical,type:'categorie',titre:name,title:name,statut:'actif'}, 'application_mobile'));
        (children || []).forEach(child=>sousCategories.push(decorateSync({id:`${catId}_${String(child).toLowerCase().replace(/[^a-z0-9]+/g,'_')}`,module:canonical,type:'sous_categorie',categorieId:catId,titre:child,title:child,statut:'actif'}, 'application_mobile')));
      });
    });
    const elements = [];
    collectionRegistry().forEach(([collection,module])=>{
      if(['documents'].includes(collection)) return;
      (data[collection]||[]).forEach(item=>elements.push({...structuredClone(item), module: canonicalModuleId(item.module || module), _collection:collection, titre:item.titre || item.title || item.name || ''}));
    });
    return {
      socle: {offer: structuredClone(data.offer || defaultOffer), appsRegistry: structuredClone(data.appsRegistry || makeAppsRegistry()), referenceData: structuredClone(data.referenceData || {})},
      parametres: structuredClone(data.settings || {}),
      membres: structuredClone(data.family || []),
      modules: structuredClone(data.appsRegistry || makeAppsRegistry()),
      categories,
      sousCategories,
      elements,
      documents: structuredClone(data.documents || []),
      notifications: getNotifications().map(n=>({...n, module:canonicalModuleId(n.module), syncStatus:'synced'})),
      synchronisation: {sourceCollections, generatedFrom:'superapp_famille_mobile_v4_1_parametres_autonomes', rule:'merge_by_id_updatedAt_no_calendar_duplication_apps_registry_parametres_autonomes'}
    };
  }
  function exportData(){
    const payload = {
      schema:'superapp_famille', schemaVersion:'1.1.0', exportId:'exp_'+Date.now(), exportedAt:nowISO(), exportedFrom:'application_mobile', appVersion:APP_VERSION,
      offer: structuredClone(data.offer || defaultOffer), appsRegistry: structuredClone(data.appsRegistry || makeAppsRegistry()), data: buildExportData()
    };
    const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='superapp-famille-v4-1-parametres-autonomes-export.json'; a.click(); URL.revokeObjectURL(a.href);
  }
  function normalizeImportPayload(json){
    const payload = json?.schema === 'superapp_famille' ? {...(json.data||{}), offer:json.offer, appsRegistry:json.appsRegistry || json.data?.socle?.appsRegistry} : json;
    if(!payload || typeof payload !== 'object') throw new Error('Format invalide');
    if(payload.synchronisation?.sourceCollections) return ensureDataShape(payload.synchronisation.sourceCollections);
    if(payload.elements || payload.membres || payload.parametres){
      const rebuilt = structuredClone(defaultData);
      rebuilt.settings = {...rebuilt.settings, ...(payload.parametres||{})};
      if(Array.isArray(payload.membres)) rebuilt.family = payload.membres;
      collectionRegistry().forEach(([collection])=>{ rebuilt[collection] = []; });
      (payload.elements||[]).forEach(item=>{
        const module = canonicalModuleId(item.module);
        const collection = item._collection || targetCollectionFor(module,item.type);
        if(!rebuilt[collection]) rebuilt[collection] = [];
        rebuilt[collection].push({...item,module,title:item.title || item.titre || item.name || 'Sans titre'});
      });
      if(Array.isArray(payload.documents)) rebuilt.documents = payload.documents;
      return ensureDataShape(rebuilt);
    }
    return ensureDataShape(payload);
  }
  function importPayload(json){
    localStorage.setItem(`${STORAGE_KEY}_backup_${Date.now()}`, JSON.stringify(data));
    const incoming = normalizeImportPayload(json);
    const result = mergeById(data, incoming);
    data = result.data;
    return result.report;
  }
  function mergeById(local,incoming){
    const out = ensureDataShape(structuredClone(local));
    const report = {added:0, updated:0, conflicts:0};
    out.settings = {...out.settings, ...(incoming.settings||{})};
    out.offer = {...defaultOffer, ...(out.offer||{}), ...(incoming.offer||{})};
    out.settings.offer = {...defaultOffer, ...(out.settings.offer||{}), ...(incoming.settings?.offer||{}), ...(incoming.offer||{})};
    out.appsRegistry = makeAppsRegistry({...out.appsRegistry, ...(incoming.appsRegistry||{})});
    out.family = mergeArray(out.family, incoming.family || [], report);
    out.categories = migrateCategories({...out.categories, ...(incoming.categories||{})});
    collectionRegistry().forEach(([collection])=>{ out[collection] = mergeArray(out[collection]||[], incoming[collection]||[], report); });
    if(incoming.foodBudget) out.foodBudget = incoming.foodBudget;
    out.referenceData = {...(out.referenceData||{}), ...(incoming.referenceData||{})};
    Object.keys(incoming.referenceData||{}).forEach(mid=>{ out.referenceData[mid] = {...(out.referenceData[mid]||{}), ...(incoming.referenceData[mid]||{})}; });
    return {data:out, report};
  }
  function mergeArray(localArr,incomingArr,report={added:0,updated:0,conflicts:0}){
    const map = new Map((localArr||[]).filter(x=>x && x.id).map(x=>[x.id,x]));
    (incomingArr||[]).forEach(raw=>{
      const item = normaliseItem({...raw}, raw.module);
      const existing = map.get(item.id);
      if(!existing){ map.set(item.id,item); report.added++; }
      else {
        const a = Date.parse(existing.updatedAt || existing.createdAt || 0);
        const b = Date.parse(item.updatedAt || item.createdAt || 0);
        if(b > a){ map.set(item.id,item); report.updated++; }
        else if(b === a && JSON.stringify(existing) !== JSON.stringify(item)){ existing.syncStatus='conflict'; report.conflicts++; }
      }
    });
    return [...map.values()];
  }
  function resetData(){ if(confirm('Réinitialiser les données locales ?')){ data=ensureDataShape(structuredClone(defaultData)); save(); render(); } }
  window.SuperApp = {
    setView, openModule, openItem, openCalendarDate, openCalendarModule, setCalendarFilter,
    renderAppsHome:()=>renderApps(), render:()=>renderApps(),
    calendarMode:(m)=>{state.calendarMode=m;renderCalendar();},
    shiftMonth:(n)=>{const d=parseDMY(state.selectedDate)||new Date();d.setMonth(d.getMonth()+n);state.selectedDate=formatDMY(d);renderCalendar();},
    selectDate:(d)=>{state.selectedDate=d;state.calendarMode='day';renderCalendar();},
    openEdit, openAdd, openMember, markDone, archiveItem, deleteItem, exportData, resetData, openSettings, openActivationPanel, activateApp, deactivateApp, openSettingsMember, archiveMember, openCategoryEditor, archiveCategory, openReferenceEditor, openModuleList, openBudgetEditor, openMemberDocList
  };
  init();
})();
