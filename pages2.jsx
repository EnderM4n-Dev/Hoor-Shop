/* ============================================================
   HOOR — pages: Cart, Checkout, Wishlist, Account, Support, About
   ============================================================ */

const SHIP_FEE = 280000;
const FREE_SHIP = 5000000;

/* ---------------- CART ---------------- */
function Cart(){
  const app = useApp();
  const lines = app.cart.map(c=>({...c, p:getProduct(c.id)})).filter(l=>l.p);
  const subtotal = lines.reduce((s,l)=>s+l.p.price*l.qty,0);
  const ship = subtotal>=FREE_SHIP || subtotal===0 ? 0 : SHIP_FEE;

  if(lines.length===0) return (
    <div className="wrap section">
      <div className="empty panel" style={{padding:'80px 20px'}}>
        <div className="em-ic"><Icon name="bag" size={28}/></div>
        <h3 className="h3">سبد خریدت خالی‌ست</h3>
        <p className="muted" style={{marginTop:6}}>هنوز عینکی انتخاب نکرده‌ای.</p>
        <button className="btn btn-primary" style={{marginTop:18}} onClick={()=>app.navigate('shop')}>شروع خرید</button>
      </div>
    </div>
  );

  return (
    <div className="wrap section-sm">
      <h1 className="h1 fa-title" style={{marginBottom:24}}>سبد خرید</h1>
      <div style={{display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:30, alignItems:'flex-start'}} className="cart-grid">
        <div className="panel" style={{padding:'6px 22px'}}>
          {lines.map(l=>(
            <div key={l.id} className="row" style={{gap:16, padding:'18px 0', borderBottom:'1px solid var(--line-soft)'}}>
              <img src={asset(l.p.img)} alt={l.p.name} style={{width:110, height:88, objectFit:'cover', borderRadius:12, border:'1px solid var(--line)', cursor:'pointer'}} onClick={()=>app.navigate('product',{id:l.p.id})}/>
              <div className="col grow" style={{gap:8}}>
                <div className="between">
                  <div className="col" style={{gap:4}}>
                    <b className="fa-title" style={{fontSize:17, cursor:'pointer'}} onClick={()=>app.navigate('product',{id:l.p.id})}>{l.p.name}</b>
                    <span className="small muted center" style={{gap:7}}><WoodDot wood={l.p.wood}/> چوب {woodName(l.p.wood)} · {shapeName(l.p.shape)}</span>
                  </div>
                  <button className="iconbtn" onClick={()=>app.removeFromCart(l.id)}><Icon name="trash" size={18}/></button>
                </div>
                <div className="between" style={{marginTop:4}}>
                  <div className="qty">
                    <button onClick={()=>app.setQty(l.id,l.qty-1)}><Icon name="minus" size={16}/></button>
                    <span>{faNum(l.qty)}</span>
                    <button onClick={()=>app.setQty(l.id,l.qty+1)}><Icon name="plus" size={16}/></button>
                  </div>
                  <Money value={l.p.price*l.qty} className="h3"/>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="panel" style={{padding:24, position:'sticky', top:'calc(var(--header-h) + 18px)'}}>
          <h3 className="h3" style={{marginBottom:16}}>خلاصه‌ی سفارش</h3>
          <div className="between" style={{padding:'9px 0'}}><span className="muted">جمع کالاها</span><Money value={subtotal}/></div>
          <div className="between" style={{padding:'9px 0'}}><span className="muted">هزینه‌ی ارسال</span>{ship===0? <span className="tag ok">رایگان</span>: <Money value={ship}/>}</div>
          {ship>0 && <p className="tiny muted" style={{margin:'4px 0 0'}}>تا ارسالِ رایگان، {fmtToman(FREE_SHIP-subtotal)} تومان مانده.</p>}
          <hr className="hairline" style={{margin:'14px 0'}}/>
          <div className="between" style={{marginBottom:18}}><b>مبلغِ قابلِ پرداخت</b><Money value={subtotal+ship} className="h3"/></div>
          <button className="btn btn-primary btn-block btn-lg" onClick={()=>app.navigate('checkout')}>ادامه و پرداخت <Icon name="arrowLeft" size={18}/></button>
          <button className="btn btn-quiet btn-block" style={{marginTop:6}} onClick={()=>app.navigate('shop')}>ادامه‌ی خرید</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- CHECKOUT (with payment-gateway simulation) ---------------- */
function Checkout(){
  const app = useApp();
  const [phase, setPhase] = useState('form'); // form · gateway · processing · success
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState({...SAMPLE_USER});
  const [shipMethod, setShipMethod] = useState('fast');
  const [card, setCard] = useState({num:'', exp:'', cvv:'', otp:''});
  const [orderId, setOrderId] = useState('');

  const lines = app.cart.map(c=>({...c, p:getProduct(c.id)})).filter(l=>l.p);
  const subtotal = lines.reduce((s,l)=>s+l.p.price*l.qty,0);
  const shipFee = shipMethod==='free' || subtotal>=FREE_SHIP ? 0 : (shipMethod==='express'? 450000 : SHIP_FEE);
  const total = subtotal + shipFee;

  if(lines.length===0 && phase!=='success') return (
    <div className="wrap section"><div className="empty panel" style={{padding:'70px'}}>
      <p>سبدِ خرید خالی‌ست.</p><button className="btn btn-primary" style={{marginTop:14}} onClick={()=>app.navigate('shop')}>رفتن به فروشگاه</button></div></div>
  );

  const pay = ()=>{
    setPhase('processing');
    setTimeout(()=>{
      const id = 'HR-۱۴۰۳' + faNum(Math.floor(Math.random()*900+100));
      setOrderId(id);
      app.placeOrder(id, total);
      setPhase('success');
      window.scrollTo(0,0);
    }, 2200);
  };

  if(phase==='success') return (
    <div className="wrap section" style={{maxWidth:720, margin:'0 auto'}}>
      <div className="panel" style={{padding:'48px 40px', textAlign:'center'}}>
        <div style={{width:84, height:84, borderRadius:'50%', background:'var(--ok-bg)', color:'var(--ok)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px'}}><Icon name="check" size={42}/></div>
        <h1 className="h1 fa-title">سفارشت ثبت شد!</h1>
        <p className="lede" style={{marginTop:8}}>سپاس از اعتمادت به هور. فریمِ دست‌سازت به‌زودی آماده‌ی ارسال می‌شود.</p>
        <div className="center" style={{justifyContent:'center', gap:10, margin:'22px 0', flexWrap:'wrap'}}>
          <span className="tag dark" style={{fontSize:14, padding:'8px 16px'}}>شماره‌ی سفارش: {orderId}</span>
          <span className="tag" style={{fontSize:14, padding:'8px 16px'}}>مبلغ: {fmtToman(total)} تومان</span>
        </div>
        <div className="center" style={{justifyContent:'center', gap:12, marginTop:10}}>
          <button className="btn btn-primary" onClick={()=>app.navigate('account',{tab:'orders'})}>پیگیری سفارش</button>
          <button className="btn btn-ghost" onClick={()=>app.navigate('shop')}>ادامه‌ی خرید</button>
        </div>
      </div>
    </div>
  );

  if(phase==='gateway' || phase==='processing') return (
    <div className="wrap section" style={{maxWidth:560, margin:'0 auto'}}>
      <div className="panel" style={{overflow:'hidden'}}>
        <div style={{background:'linear-gradient(120deg,#3a2c66,#5a3d8c)', color:'#fff', padding:'18px 24px'}} className="between">
          <div className="center" style={{gap:10}}><Icon name="lock" size={18}/><b>درگاهِ پرداختِ امن (شبیه‌سازی)</b></div>
          <Icon name="shield" size={22}/>
        </div>
        <div style={{padding:'24px'}}>
          {phase==='processing' ? (
            <div className="empty" style={{padding:'40px 10px'}}>
              <div className="spin" style={{width:50, height:50, border:'4px solid var(--line)', borderTopColor:'var(--walnut)', borderRadius:'50%', margin:'0 auto 18px', animation:'spin 1s linear infinite'}}></div>
              <p>در حالِ پردازشِ پرداخت…</p>
              <p className="tiny muted">لطفاً صفحه را نبندید.</p>
            </div>
          ):(
            <>
              <div className="between" style={{marginBottom:18, padding:'12px 16px', background:'var(--cream)', borderRadius:12}}>
                <span className="muted small">مبلغِ قابلِ پرداخت</span><Money value={total} className="h3"/>
              </div>
              <div className="kbd-grid">
                <div className="field"><label className="label">شماره‌ی کارت</label>
                  <input className="input" inputMode="numeric" placeholder="۶۰۳۷ - ۹۹۷۵ - xxxx - xxxx" dir="ltr" style={{textAlign:'center', letterSpacing:'.1em'}} value={card.num} onChange={e=>setCard({...card, num:e.target.value})}/></div>
                <div className="row" style={{gap:12}}>
                  <div className="field grow"><label className="label">تاریخ انقضا</label><input className="input" placeholder="۰۴/۰۸" dir="ltr" style={{textAlign:'center'}} value={card.exp} onChange={e=>setCard({...card, exp:e.target.value})}/></div>
                  <div className="field grow"><label className="label">CVV2</label><input className="input" placeholder="۱۲۳" dir="ltr" style={{textAlign:'center'}} value={card.cvv} onChange={e=>setCard({...card, cvv:e.target.value})}/></div>
                </div>
                <div className="field"><label className="label">رمز پویا (یک‌بارمصرف)</label>
                  <div className="row" style={{gap:10}}>
                    <input className="input grow" placeholder="رمز دریافتی" dir="ltr" style={{textAlign:'center'}} value={card.otp} onChange={e=>setCard({...card, otp:e.target.value})}/>
                    <button className="btn btn-ghost" type="button">درخواست رمز</button>
                  </div>
                </div>
              </div>
              <button className="btn btn-primary btn-block btn-lg" style={{marginTop:20}} onClick={pay}><Icon name="lock" size={18}/> پرداخت {fmtToman(total)} تومان</button>
              <button className="btn btn-quiet btn-block" style={{marginTop:6}} onClick={()=>setPhase('form')}>انصراف و بازگشت</button>
              <p className="tiny muted" style={{textAlign:'center', marginTop:12}}>این یک درگاهِ نمایشی است؛ هیچ پرداختِ واقعی انجام نمی‌شود.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // form phase
  const set = (k,v)=> setInfo({...info, [k]:v});
  return (
    <div className="wrap section-sm">
      <div className="steps" style={{marginBottom:28, justifyContent:'center'}}>
        <div className={'step '+(step>1?'done':'active')}><span className="num">{step>1?<Icon name="check" size={14}/>:'۱'}</span> اطلاعات</div>
        <span className="step-sep"></span>
        <div className={'step '+(step>2?'done':step===2?'active':'')}><span className="num">۲</span> ارسال</div>
        <span className="step-sep"></span>
        <div className="step"><span className="num">۳</span> پرداخت</div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:30, alignItems:'flex-start'}} className="cart-grid">
        <div className="panel" style={{padding:28}}>
          {step===1 && (
            <div className="col" style={{gap:16}}>
              <h3 className="h3">اطلاعاتِ گیرنده</h3>
              <div className="row" style={{gap:14}}>
                <div className="field grow"><label className="label">نام و نام خانوادگی</label><input className="input" value={info.name} onChange={e=>set('name',e.target.value)}/></div>
                <div className="field grow"><label className="label">شماره تماس</label><input className="input" dir="ltr" style={{textAlign:'right'}} value={info.phone} onChange={e=>set('phone',e.target.value)}/></div>
              </div>
              <div className="field"><label className="label">ایمیل</label><input className="input" dir="ltr" style={{textAlign:'right'}} value={info.email} onChange={e=>set('email',e.target.value)}/></div>
              <div className="row" style={{gap:14}}>
                <div className="field grow"><label className="label">شهر</label><input className="input" value={info.city} onChange={e=>set('city',e.target.value)}/></div>
                <div className="field grow"><label className="label">کد پستی</label><input className="input" dir="ltr" style={{textAlign:'right'}} value={info.postal} onChange={e=>set('postal',e.target.value)}/></div>
              </div>
              <div className="field"><label className="label">نشانیِ کامل</label><textarea className="textarea" value={info.address} onChange={e=>set('address',e.target.value)}></textarea></div>
              <button className="btn btn-primary btn-lg" style={{alignSelf:'flex-start'}} onClick={()=>setStep(2)}>ادامه به ارسال <Icon name="arrowLeft" size={18}/></button>
            </div>
          )}
          {step===2 && (
            <div className="col" style={{gap:14}}>
              <h3 className="h3">روشِ ارسال</h3>
              {[['fast','پستِ پیشتاز','۲ تا ۴ روزِ کاری', subtotal>=FREE_SHIP?0:SHIP_FEE],
                ['express','ارسالِ فوری (تهران)','کمتر از ۲۴ ساعت',450000],
                ['free','ارسالِ عادی','۵ تا ۷ روزِ کاری',0]].map(([id,name,desc,fee])=>(
                <label key={id} className="between" style={{padding:'16px 18px', border:'1.5px solid '+(shipMethod===id?'var(--walnut)':'var(--line)'), borderRadius:14, cursor:'pointer', background: shipMethod===id?'var(--cream)':'transparent'}} onClick={()=>setShipMethod(id)}>
                  <div className="center" style={{gap:12}}>
                    <span className={'checkbox '+(shipMethod===id?'on':'')} style={{borderRadius:'50%'}}>{shipMethod===id && <Icon name="check" size={12}/>}</span>
                    <div className="col" style={{gap:2}}><b>{name}</b><span className="small muted">{desc}</span></div>
                  </div>
                  {fee===0? <span className="tag ok">رایگان</span>: <Money value={fee} cur={false}/>}
                </label>
              ))}
              <div className="center" style={{gap:10, marginTop:8}}>
                <button className="btn btn-ghost" onClick={()=>setStep(1)}><Icon name="arrowRight" size={18}/> بازگشت</button>
                <button className="btn btn-primary btn-lg grow" onClick={()=>{setPhase('gateway'); window.scrollTo(0,0);}}>رفتن به درگاهِ پرداخت <Icon name="lock" size={17}/></button>
              </div>
            </div>
          )}
        </div>

        {/* summary */}
        <div className="panel" style={{padding:22, position:'sticky', top:'calc(var(--header-h) + 18px)'}}>
          <h3 className="h3" style={{marginBottom:14}}>سفارشِ شما</h3>
          {lines.map(l=>(
            <div key={l.id} className="row" style={{gap:10, padding:'8px 0'}}>
              <img src={asset(l.p.img)} style={{width:52, height:44, objectFit:'cover', borderRadius:8, border:'1px solid var(--line)'}}/>
              <div className="col grow" style={{gap:0}}><span className="small fa-title" style={{fontWeight:600}}>{l.p.name}</span><span className="tiny muted">{faNum(l.qty)} عدد</span></div>
              <Money value={l.p.price*l.qty} cur={false} className="small"/>
            </div>
          ))}
          <hr className="hairline" style={{margin:'12px 0'}}/>
          <div className="between" style={{padding:'5px 0'}}><span className="muted small">جمع کالاها</span><Money value={subtotal} cur={false}/></div>
          <div className="between" style={{padding:'5px 0'}}><span className="muted small">ارسال</span>{shipFee===0? <span className="tag ok">رایگان</span>:<Money value={shipFee} cur={false}/>}</div>
          <hr className="hairline" style={{margin:'12px 0'}}/>
          <div className="between"><b>مبلغِ نهایی</b><Money value={total} className="h3"/></div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- WISHLIST ---------------- */
function Wishlist(){
  const app = useApp();
  const items = app.wishlist.map(getProduct).filter(Boolean);
  return (
    <div className="wrap section-sm">
      <h1 className="h1 fa-title" style={{marginBottom:6}}>علاقه‌مندی‌ها</h1>
      <p className="muted" style={{marginBottom:24}}>{faNum(items.length)} فریمِ ذخیره‌شده</p>
      {items.length===0 ? (
        <div className="empty panel" style={{padding:'80px 20px'}}>
          <div className="em-ic"><Icon name="heart" size={28}/></div>
          <p>هنوز عینکی به علاقه‌مندی‌ها اضافه نکرده‌ای.</p>
          <button className="btn btn-primary" style={{marginTop:16}} onClick={()=>app.navigate('shop')}>کشفِ عینک‌ها</button>
        </div>
      ):(
        <div className="prod-grid cols-4">{items.map(p=> <ProductCard key={p.id} p={p}/>)}</div>
      )}
    </div>
  );
}

Object.assign(window, { Cart, Checkout, Wishlist, SHIP_FEE, FREE_SHIP });
