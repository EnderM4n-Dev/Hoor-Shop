/* ============================================================
   HOOR — data layer (products, taxonomies, sample store state)
   ============================================================ */

/* ---- standalone-bundle asset resolver ----
   When exported as a single file, images are inlined via <meta ext-resource-dependency>
   tags and exposed on window.__resources keyed by data-resource-id (= original path).
   asset() maps an original path to its blob URL when bundled, else returns the path. */
let __assetMap = null;
function asset(p){
  if(!p) return p;
  if(__assetMap === null){
    __assetMap = {};
    try{
      document.querySelectorAll('meta[name="ext-resource-dependency"]').forEach(m=>{
        const c = m.getAttribute('content'), id = m.getAttribute('data-resource-id');
        if(window.__resources && window.__resources[id]) __assetMap[c] = window.__resources[id];
      });
    }catch(e){}
  }
  return __assetMap[p] || p;
}

/* ---- number helpers ---- */
const FA_DIGITS = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
function faNum(n){ return String(n).replace(/[0-9]/g, d => FA_DIGITS[+d]); }
function fmtToman(n){
  const s = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '،');
  return faNum(s);
}

/* ---- taxonomies ---- */
const WOOD_TYPES = [
  { id:'walnut',   name:'گردو',  color:'#6B4A2F', note:'گرم، مقاوم و خوش‌رگه' },
  { id:'beech',    name:'راش',   color:'#C99A63', note:'روشن و سبک' },
  { id:'chenar',   name:'چنار',  color:'#9A4B2E', note:'رگه‌های سرخ‌فام' },
  { id:'wenge',    name:'ونگه',  color:'#3E2C20', note:'تیره با راه‌راه طبیعی' },
];
const WOOD_COLORS = [
  { id:'light',  name:'روشن',   color:'#C9A06B' },
  { id:'walnut', name:'گردویی', color:'#8A5E3B' },
  { id:'orange', name:'نارنجی', color:'#A8552E' },
  { id:'dark',   name:'تیره',   color:'#4A3324' },
];
const SHAPES = [
  { id:'cateye',  name:'گربه‌ای' },
  { id:'round',   name:'گرد' },
  { id:'square',  name:'مربعی' },
  { id:'rect',    name:'مستطیلی' },
  { id:'hex',     name:'چندضلعی' },
];
const GENDERS = [
  { id:'women',  name:'زنانه' },
  { id:'men',    name:'مردانه' },
  { id:'uni',    name:'یونیسکس' },
];

function woodName(id){ return (WOOD_TYPES.find(w=>w.id===id)||{}).name||''; }
function woodColorObj(id){ return WOOD_COLORS.find(c=>c.id===id)||{}; }
function shapeName(id){ return (SHAPES.find(s=>s.id===id)||{}).name||''; }
function genderName(id){ return (GENDERS.find(g=>g.id===id)||{}).name||''; }

/* ---- products ---- */
const PRODUCTS = [
  {
    id:'sarmeh', name:'عینک سرمه', tagline:'سرمه‌ای سازم ز خاکِ کوی یار…',
    price:2650000, wood:'beech', woodColor:'light', shape:'cateye', gender:'women',
    stock:6, rating:4.8, reviews:23, badge:'پرفروش',
    img:'assets/p-sarmeh.png',
    gallery:['assets/p-sarmeh.png'],
    sub:'جان گرفته از چوب راشِ کهنسال',
    desc:'فریم گربه‌ایِ ظریف سرمه، با خطوطی کشیده و زنانه که نگاه را قاب می‌گیرد. هر فریم به‌دست تراشیده و روغن‌کاری شده و امضای منحصربه‌فرد رگه‌های چوب را با خود دارد.',
  },
  {
    id:'zohreh', name:'عینک زهره', tagline:'زهره، ستاره‌ای در قابِ هور…',
    price:2800000, wood:'walnut', woodColor:'walnut', shape:'round', gender:'women',
    stock:4, rating:4.9, reviews:31, badge:'',
    img:'assets/p-zohreh.png',
    gallery:['assets/p-zohreh.png','assets/hero-2.jpg'],
    sub:'جان گرفته از گردوی کهنسال',
    desc:'زهره با قاب گردِ گرم خود، یادآور روزهای آفتابیِ کوچه‌های کاهگلی‌ست. تناسب دایره و گرمای گردو، چهره‌ای آرام و دلنشین می‌سازد.',
  },
  {
    id:'negar', name:'عینک نگار', tagline:'نگار، تلاقیِ رنگ و خیال',
    price:2800000, oldPrice:3100000, wood:'walnut', woodColor:'walnut', shape:'round', gender:'women',
    stock:8, rating:4.7, reviews:18, badge:'پیشنهاد ویژه',
    img:'assets/p-negar.png',
    gallery:['assets/p-negar.png','assets/lifestyle-negar.png','assets/hero-1.jpg'],
    sub:'جان گرفته از گردوی کهنسال',
    desc:'نگار، نقطه‌ی تلاقی ظرافت و گرماست؛ قابی گرد و متعادل برای آن‌ها که سادگیِ خاص را دوست دارند. سبک، خوش‌دست و همراهِ هر فصل.',
  },
  {
    id:'homa', name:'عینک هما', tagline:'از هور تا هما، قابی برای تماشای سعادت',
    price:2800000, wood:'walnut', woodColor:'dark', shape:'square', gender:'men',
    stock:5, rating:4.8, reviews:27, badge:'',
    img:'assets/p-homa.png',
    gallery:['assets/p-homa.png'],
    sub:'جان گرفته از گردوی کهنسال',
    desc:'هما، فریمی مربعی و جسور با حجمی مردانه. خطوط قاطع و رنگ تیره‌ی گردو، حضوری مطمئن و امروزی به آن می‌بخشد.',
  },
  {
    id:'afsoon', name:'عینک افسون', tagline:'افسون، روایتِ سودای شرقی…',
    price:2800000, wood:'walnut', woodColor:'dark', shape:'square', gender:'uni',
    stock:3, rating:4.9, reviews:35, badge:'محدود',
    img:'assets/p-afsoon.png',
    gallery:['assets/p-afsoon.png','assets/p-afsoon2.png'],
    sub:'جان گرفته از گردوی کهنسال',
    desc:'افسون، روایتی از سودای شرقی‌ست؛ قابی پُرحجم و چشمگیر که میان سنت و مدرنیته می‌ایستد. انتخابی برای کسانی که دیده‌شدن را دوست دارند.',
  },
  {
    id:'dowran', name:'عینک دوران', tagline:'در قابِ دوران، زمان ایستاده است…',
    price:2800000, wood:'walnut', woodColor:'dark', shape:'round', gender:'uni',
    stock:7, rating:4.7, reviews:21, badge:'',
    img:'assets/p-dowran.png',
    gallery:['assets/p-dowran.png'],
    sub:'جان گرفته از گردوی کهنسالِ بوکان',
    desc:'دوران، قابی گرد و کلاسیک که زمان را در خود نگه داشته است. گردوی تیره و فرمِ متقارن، حسی اصیل و بی‌زمان می‌سازد.',
  },
  {
    id:'zaviyeh', name:'عینک زاویه', tagline:'برخوردِ دو خطِ معنادار',
    price:3200000, wood:'chenar', woodColor:'orange', shape:'hex', gender:'men',
    stock:2, rating:5.0, reviews:14, badge:'دست‌ساز ویژه',
    img:'assets/p-zaviyeh.png',
    gallery:['assets/p-zaviyeh.png','assets/hero-3.jpg'],
    sub:'جان گرفته از چوب چنار',
    desc:'زاویه، برخوردِ هندسی خطوط است؛ قابی چندضلعی و بی‌پروا با رگه‌های سرخ‌فامِ چنار. اثری برای کلکسیون‌دارانِ ذوق.',
  },
  {
    id:'kavir', name:'عینک کویر', tagline:'داستانی از آوازِ کولی‌ها در شب…',
    price:3400000, wood:'wenge', woodColor:'dark', shape:'rect', gender:'men',
    stock:4, rating:4.9, reviews:19, badge:'',
    img:'assets/p-kavir.png',
    gallery:['assets/p-kavir.png'],
    sub:'جان گرفته از گرمای چوب ونگه',
    desc:'کویر، با راه‌راهِ طبیعیِ چوب ونگه، تیرگیِ گرمِ شب‌های کویری را روایت می‌کند. فریمی مستطیلی، مقاوم و پر از شخصیت.',
  },
];

function getProduct(id){ return PRODUCTS.find(p=>p.id===id); }

/* ---- gender categories (replace filters) ---- */
const CATEGORIES = [
  { id:'men',   name:'عینک‌های مردانه', img:'assets/cat-men.jpg' },
  { id:'women', name:'عینک‌های زنانه',  img:'assets/cat-women.jpg' },
  { id:'uni',   name:'مردانه و زنانه',  img:'assets/cat-both.jpg' },
];

/* common spec builder */
function productSpecs(p){
  return [
    ['جنس فریم', 'چوب ' + woodName(p.wood) + ' طبیعی'],
    ['فرم', shapeName(p.shape)],
    ['مناسبِ', genderName(p.gender)],
    ['جنس عدسی', 'پلاریزه · ' + 'UV۴۰۰'.replace('400','۴۰۰')],
    ['دسته‌ها', 'لولای فلزی فنری'],
    ['وزن تقریبی', faNum(28) + ' گرم'],
    ['ساخت', 'کاملاً دست‌ساز'],
  ];
}

/* ---- sample customer + orders ---- */
const SAMPLE_USER = {
  name:'نیلوفر احمدی', email:'niloofar@example.com', phone:'۰۹۱۲۳۴۵۶۷۸۹',
  city:'تهران',
  address:'تهران، خیابان ولیعصر، بالاتر از پارک‌وی، کوچه‌ی نسترن، پلاک ۱۲، واحد ۴',
  postal:'۱۹۶۵۸۴۳۲۱۰',
};
const ORDER_STATUS = {
  processing:{ name:'در حال پردازش', tag:'warn' },
  shipped:{ name:'ارسال شده', tag:'info' },
  delivered:{ name:'تحویل شده', tag:'ok' },
  canceled:{ name:'لغو شده', tag:'danger' },
};
const SAMPLE_ORDERS = [
  { id:'HR-۱۴۰۳۲۷', date:'۱۴۰۳/۰۹/۱۲', status:'delivered', total:2800000,
    items:[{id:'zohreh', qty:1, price:2800000}] },
  { id:'HR-۱۴۰۳۵۱', date:'۱۴۰۳/۱۰/۰۳', status:'shipped', total:6000000,
    items:[{id:'homa', qty:1, price:2800000},{id:'zaviyeh', qty:1, price:3200000}] },
  { id:'HR-۱۴۰۳۶۸', date:'۱۴۰۳/۱۰/۲۱', status:'processing', total:2650000,
    items:[{id:'sarmeh', qty:1, price:2650000}] },
];

/* ---- export to window ---- */
Object.assign(window, {
  faNum, fmtToman, asset, WOOD_TYPES, WOOD_COLORS, SHAPES, GENDERS, CATEGORIES,
  woodName, woodColorObj, shapeName, genderName,
  PRODUCTS, getProduct, productSpecs,
  SAMPLE_USER, SAMPLE_ORDERS, ORDER_STATUS,
});
