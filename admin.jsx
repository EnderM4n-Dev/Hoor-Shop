/* ============================================================
   HOOR — Admin panel (dashboard, product CRUD, orders, customers)
   ============================================================ */

const ASSET_IMAGES = [
  'assets/p-sarmeh.png','assets/p-zohreh.png','assets/p-negar.png','assets/p-homa.png',
  'assets/p-afsoon.png','assets/p-afsoon2.png','assets/p-dowran.png','assets/p-zaviyeh.png','assets/p-kavir.png',
];

function blankProduct(){
  return { id:'new_'+Date.now(), name:'', tagline:'', price:2800000, oldPrice:null,
    wood:'walnut', woodColor:'walnut', shape:'round', gender:'uni', stock:5, rating:5, reviews:0,
    badge:'', img:'assets/p-zohreh.png', gallery:['assets/p-zohreh.png'], sub:'جان گرفته از گردوی کهنسال',
    desc:'' };
}

function AdminProductModal({ initial, onClose }){
  const app = useApp();
  const isNew = !app.products.find(p=>p.id===initial.id);
  const [f, setF] = useState({...initial});
  const set = (k,v)=> setF(prev=>({...prev,[k]:v}));
  const save = ()=>{
    if(!f.name.trim()){ app.toast('نامِ محصول را وارد کنید','info'); return; }
    const clean = {...f, price:+f.price||0, oldPrice: f.oldPrice? +f.oldPrice: null, stock:+f.stock||0,
      gallery: f.gallery && f.gallery.length? f.gallery : [f.img] };
    if(isNew) app.addProduct(clean); else app.updateProduct(clean);
    app.toast(isNew?'محصول افزوده شد':'محصول ویرایش شد');
    onClose();
  };
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal"><div className="modal-card" onClick={e=>e.stopPropagation()}>
        <div className="between" style={{padding:'20px 24px', borderBottom:'1px solid var(--line)', position:'sticky', top:0, background:'var(--paper)', zIndex:2}}>
          <h3 className="h3">{isNew?'افزودنِ محصولِ جدید':'ویرایشِ محصول'}</h3>
          <button className="iconbtn" onClick={onClose}><Icon name="x"/></button>
        </div>
        <div style={{padding:24}} className="col">
          <div className="row" style={{gap:16, marginBottom:16}}>
            <div style={{width:120, height:96, borderRadius:12, overflow:'hidden', border:'1px solid var(--line)', flexShrink:0, background:'var(--cream-2)'}}>
              <img src={asset(f.img)} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
            </div>
            <div className="col grow" style={{gap:8}}>
              <label className="label">تصویرِ محصول</label>
              <div className="center" style={{gap:8, flexWrap:'wrap'}}>
                {ASSET_IMAGES.map(im=>(
                  <img key={im} src={asset(im)} onClick={()=>{ set('img',im); set('gallery',[im]); }} style={{width:46, height:38, objectFit:'cover', borderRadius:7, cursor:'pointer', border: f.img===im?'2px solid var(--walnut)':'1px solid var(--line)'}}/>
                ))}
              </div>
            </div>
          </div>

          <div className="row" style={{gap:14}}>
            <div className="field grow"><label className="label">نامِ عینک</label><input className="input" value={f.name} onChange={e=>set('name',e.target.value)} placeholder="مثلاً عینک سرمه"/></div>
            <div className="field grow"><label className="label">شعار / تَگ‌لاین</label><input className="input" value={f.tagline} onChange={e=>set('tagline',e.target.value)}/></div>
          </div>

          <div className="row" style={{gap:14, marginTop:14}}>
            <div className="field grow"><label className="label">قیمت (تومان)</label><input className="input" dir="ltr" style={{textAlign:'right'}} value={f.price} onChange={e=>set('price',e.target.value.replace(/\D/g,''))}/></div>
            <div className="field grow"><label className="label">قیمتِ قبل (اختیاری)</label><input className="input" dir="ltr" style={{textAlign:'right'}} value={f.oldPrice||''} onChange={e=>set('oldPrice',e.target.value.replace(/\D/g,''))}/></div>
            <div className="field" style={{width:110}}><label className="label">موجودی</label><input className="input" dir="ltr" style={{textAlign:'right'}} value={f.stock} onChange={e=>set('stock',e.target.value.replace(/\D/g,''))}/></div>
          </div>

          <div className="row" style={{gap:14, marginTop:14}}>
            <div className="field grow"><label className="label">جنسِ چوب</label>
              <select className="select" value={f.wood} onChange={e=>set('wood',e.target.value)}>{WOOD_TYPES.map(w=><option key={w.id} value={w.id}>{w.name}</option>)}</select></div>
            <div className="field grow"><label className="label">رنگِ چوب</label>
              <select className="select" value={f.woodColor} onChange={e=>set('woodColor',e.target.value)}>{WOOD_COLORS.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          </div>
          <div className="row" style={{gap:14, marginTop:14}}>
            <div className="field grow"><label className="label">فرم</label>
              <select className="select" value={f.shape} onChange={e=>set('shape',e.target.value)}>{SHAPES.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
            <div className="field grow"><label className="label">مناسبِ</label>
              <select className="select" value={f.gender} onChange={e=>set('gender',e.target.value)}>{GENDERS.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select></div>
            <div className="field grow"><label className="label">برچسب (اختیاری)</label><input className="input" value={f.badge} onChange={e=>set('badge',e.target.value)} placeholder="پرفروش، محدود…"/></div>
          </div>
          <div className="field" style={{marginTop:14}}><label className="label">توضیحات</label><textarea className="textarea" value={f.desc} onChange={e=>set('desc',e.target.value)}></textarea></div>
        </div>
        <div className="between" style={{padding:'16px 24px', borderTop:'1px solid var(--line)', position:'sticky', bottom:0, background:'var(--paper)'}}>
          <button className="btn btn-quiet" onClick={onClose}>انصراف</button>
          <button className="btn btn-primary" onClick={save}><Icon name="check" size={18}/> {isNew?'افزودنِ محصول':'ذخیره‌ی تغییرات'}</button>
        </div>
      </div></div>
    </div>
  );
}

function ConfirmDelete({ product, onClose }){
  const app = useApp();
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal"><div className="modal-card" style={{maxWidth:420}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:28, textAlign:'center'}}>
          <div style={{width:60, height:60, borderRadius:'50%', background:'var(--danger-bg)', color:'var(--danger)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px'}}><Icon name="trash" size={26}/></div>
          <h3 className="h3">حذفِ «{product.name}»؟</h3>
          <p className="muted" style={{margin:'8px 0 0'}}>این عمل قابلِ بازگشت نیست.</p>
          <div className="center" style={{justifyContent:'center', gap:10, marginTop:22}}>
            <button className="btn btn-ghost" onClick={onClose}>انصراف</button>
            <button className="btn" style={{background:'var(--danger)', color:'#fff'}} onClick={()=>{app.deleteProduct(product.id); app.toast('محصول حذف شد'); onClose();}}>بله، حذف کن</button>
          </div>
        </div>
      </div></div>
    </div>
  );
}

function Admin(){
  const app = useApp();
  const [tab, setTab] = useState('dash');
  const [modal, setModal] = useState(null); // {type:'edit'|'add'|'del', product}
  const revenue = app.orders.reduce((s,o)=>s+o.total,0);

  const nav = [
    ['dash','داشبورد','grid'],
    ['products','محصولات','box'],
    ['orders','سفارش‌ها','list'],
    ['customers','مشتریان','user'],
  ];

  return (
    <div style={{background:'var(--cream-2)', minHeight:'100vh'}}>
      <div className="wrap" style={{paddingTop:24, paddingBottom:60}}>
        <div className="between" style={{marginBottom:22, flexWrap:'wrap', gap:12}}>
          <div className="center" style={{gap:12}}>
            <Logo size={36}/>
            <span className="tag dark">پنلِ مدیریت</span>
          </div>
          <button className="btn btn-ghost" onClick={()=>app.navigate('home')}><Icon name="arrowRight" size={18}/> بازگشت به فروشگاه</button>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'230px 1fr', gap:24, alignItems:'flex-start'}} className="acc-grid">
          <aside className="panel" style={{padding:14, position:'sticky', top:18}}>
            <div className="vtabs">
              {nav.map(([id,label,ic])=>(
                <button key={id} className={tab===id?'on':''} onClick={()=>setTab(id)}><Icon name={ic} size={19}/> {label}</button>
              ))}
            </div>
          </aside>

          <div>
            {tab==='dash' && (
              <div className="col" style={{gap:22}}>
                <div className="prod-grid cols-4" style={{gap:16}}>
                  {[['محصولات', faNum(app.products.length), 'box'],
                    ['سفارش‌ها', faNum(app.orders.length), 'list'],
                    ['درآمد (تومان)', fmtToman(revenue), 'card'],
                    ['مشتریان', faNum(128), 'user']].map(([l,n,ic],i)=>(
                    <div key={i} className="stat">
                      <div className="between" style={{marginBottom:10}}><span style={{width:42,height:42,borderRadius:12,background:'var(--cream-2)',color:'var(--walnut)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={ic} size={21}/></span></div>
                      <div className="n" style={{fontSize: i===2?22:30}}>{n}</div>
                      <div className="l">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="panel" style={{padding:'8px 22px'}}>
                  <div className="between" style={{padding:'14px 0'}}><b>سفارش‌های اخیر</b><button className="btn-quiet small" style={{color:'var(--walnut)'}} onClick={()=>setTab('orders')}>مشاهده‌ی همه</button></div>
                  <div style={{overflowX:'auto'}}>
                  <table className="table">
                    <thead><tr><th>شماره</th><th>تاریخ</th><th>مبلغ</th><th>وضعیت</th></tr></thead>
                    <tbody>{app.orders.slice(0,4).map(o=>(
                      <tr key={o.id}><td><b>{o.id}</b></td><td className="muted">{o.date}</td><td>{fmtToman(o.total)}</td><td><span className={'tag '+ORDER_STATUS[o.status].tag}>{ORDER_STATUS[o.status].name}</span></td></tr>
                    ))}</tbody>
                  </table>
                  </div>
                </div>
              </div>
            )}

            {tab==='products' && (
              <div className="panel" style={{padding:'8px 22px 18px'}}>
                <div className="between" style={{padding:'16px 0'}}>
                  <div className="col" style={{gap:2}}><b style={{fontSize:17}}>مدیریتِ محصولات</b><span className="small muted">{faNum(app.products.length)} محصول</span></div>
                  <button className="btn btn-primary" onClick={()=>setModal({type:'add', product:blankProduct()})}><Icon name="plus" size={18}/> افزودنِ محصول</button>
                </div>
                <div style={{overflowX:'auto'}}>
                  <table className="table">
                    <thead><tr><th>محصول</th><th>چوب</th><th>فرم</th><th>قیمت</th><th>موجودی</th><th></th></tr></thead>
                    <tbody>
                      {app.products.map(p=>(
                        <tr key={p.id}>
                          <td><div className="center" style={{gap:10}}><img src={asset(p.img)} className="thumb-sm" alt=""/><div className="col" style={{gap:1}}><b className="fa-title">{p.name}</b>{p.badge && <span className="tiny muted">{p.badge}</span>}</div></div></td>
                          <td><span className="center" style={{gap:7}}><WoodDot wood={p.wood}/>{woodName(p.wood)}</span></td>
                          <td className="muted">{shapeName(p.shape)}</td>
                          <td>{fmtToman(p.price)}</td>
                          <td>{p.stock===0? <span className="tag danger">ناموجود</span>: p.stock<=3? <span className="tag warn">{faNum(p.stock)}</span>: <span>{faNum(p.stock)}</span>}</td>
                          <td><div className="center" style={{gap:4, justifyContent:'flex-end'}}>
                            <button className="iconbtn" style={{width:34,height:34}} title="ویرایش" onClick={()=>setModal({type:'edit', product:p})}><Icon name="edit" size={17}/></button>
                            <button className="iconbtn" style={{width:34,height:34, color:'var(--danger)'}} title="حذف" onClick={()=>setModal({type:'del', product:p})}><Icon name="trash" size={17}/></button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab==='orders' && (
              <div className="panel" style={{padding:'8px 22px 18px'}}>
                <div className="between" style={{padding:'16px 0'}}><b style={{fontSize:17}}>سفارش‌ها</b><span className="small muted">{faNum(app.orders.length)} سفارش</span></div>
                <div style={{overflowX:'auto'}}>
                  <table className="table">
                    <thead><tr><th>شماره</th><th>تاریخ</th><th>اقلام</th><th>مبلغ</th><th>وضعیت</th></tr></thead>
                    <tbody>{app.orders.map(o=>(
                      <tr key={o.id}>
                        <td><b>{o.id}</b></td><td className="muted">{o.date}</td>
                        <td>{o.items.map(it=>(getProduct(it.id)||{}).name).filter(Boolean).join('، ')}</td>
                        <td>{fmtToman(o.total)}</td>
                        <td>
                          <select className="select" style={{height:38, width:150, fontSize:13}} value={o.status} onChange={e=>app.setOrderStatus(o.id, e.target.value)}>
                            {Object.entries(ORDER_STATUS).map(([k,v])=> <option key={k} value={k}>{v.name}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            )}

            {tab==='customers' && (
              <div className="panel" style={{padding:'8px 22px 18px'}}>
                <div className="between" style={{padding:'16px 0'}}><b style={{fontSize:17}}>مشتریان</b></div>
                <div style={{overflowX:'auto'}}>
                <table className="table">
                  <thead><tr><th>نام</th><th>تماس</th><th>شهر</th><th>سفارش‌ها</th></tr></thead>
                  <tbody>
                    {[[app.user.name, app.user.phone, app.user.city, app.orders.length],
                      ['رضا کریمی','۰۹۱۲۱۱۱۲۲۳۳','اصفهان',2],
                      ['مهسا رضایی','۰۹۳۳۴۴۵۵۶۶۷','شیراز',1],
                      ['آرش مرادی','۰۹۱۹۸۸۸۷۷۶۶','تبریز',4]].map((c,i)=>(
                      <tr key={i}><td><div className="center" style={{gap:10}}><span style={{width:34,height:34,borderRadius:'50%',background:'var(--walnut)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700}}>{String(c[0]).trim()[0]}</span><b>{c[0]}</b></div></td><td dir="ltr" style={{textAlign:'right'}} className="muted">{c[1]}</td><td className="muted">{c[2]}</td><td>{faNum(c[3])}</td></tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {modal && modal.type!=='del' && <AdminProductModal initial={modal.product} onClose={()=>setModal(null)}/>}
      {modal && modal.type==='del' && <ConfirmDelete product={modal.product} onClose={()=>setModal(null)}/>}
    </div>
  );
}

Object.assign(window, { Admin });
