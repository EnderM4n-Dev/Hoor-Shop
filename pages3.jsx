/* ============================================================
   HOOR — pages: Account (customer panel), Support, About
   ============================================================ */

/* ---------------- ACCOUNT ---------------- */
function Account() {
  const app = useApp();
  const [tab, setTab] = useState(app.params.tab || 'orders');
  useEffect(() => {if (app.params.tab) setTab(app.params.tab);}, [app.params.tab]);

  const tabs = [
  { id: 'orders', label: 'سفارش‌های من', icon: 'box' },
  { id: 'profile', label: 'مشخصاتِ من', icon: 'user' },
  { id: 'address', label: 'نشانی‌ها', icon: 'location' },
  { id: 'wish', label: 'علاقه‌مندی‌ها', icon: 'heart' }];


  return (
    <div className="wrap section-sm">
      <div className="between" style={{ marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div className="center" style={{ gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--walnut)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>
            {app.user.name.trim()[0]}
          </div>
          <div className="col" style={{ gap: 2 }}>
            <h1 className="h2 fa-title">{app.user.name}</h1>
            <span className="muted small">{app.user.email}</span>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => app.toast('از حساب خارج شدید (نمایشی)', 'info')}><Icon name="logout" size={18} /> خروج</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 28, alignItems: 'flex-start' }} className="acc-grid">
        <aside className="panel" style={{ padding: 14, position: 'sticky', top: 'calc(var(--header-h) + 18px)' }}>
          <div className="vtabs">
            {tabs.map((t) =>
            <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}><Icon name={t.icon} size={19} /> {t.label}
                {t.id === 'wish' && app.wishlist.length > 0 && <span className="tag" style={{ marginInlineStart: 'auto', background: 'rgba(255,255,255,.18)', color: 'inherit' }}>{faNum(app.wishlist.length)}</span>}
              </button>
            )}
            <hr className="hairline" style={{ margin: '8px 6px' }} />
            <button onClick={() => app.navigate('admin')}><Icon name="settings" size={19} /> پنل مدیریت</button>
          </div>
        </aside>

        <div>
          {tab === 'orders' && <AccountOrders />}
          {tab === 'profile' && <AccountProfile />}
          {tab === 'address' && <AccountAddress />}
          {tab === 'wish' && (
          app.wishlist.length === 0 ?
          <div className="empty panel" style={{ padding: '60px' }}><div className="em-ic"><Icon name="heart" size={26} /></div><p>لیستِ علاقه‌مندی خالی‌ست.</p></div> :
          <div className="prod-grid">{app.wishlist.map(getProduct).filter(Boolean).map((p) => <ProductCard key={p.id} p={p} />)}</div>)
          }
        </div>
      </div>
    </div>);

}

function StatusTrack({ status }) {
  const order = ['processing', 'shipped', 'delivered'];
  if (status === 'canceled') return <span className="tag danger">لغو شده</span>;
  const idx = order.indexOf(status);
  const labels = ['ثبت و پردازش', 'ارسال شد', 'تحویل شد'];
  return (
    <div className="center" style={{ gap: 0, marginTop: 4 }}>
      {labels.map((l, i) =>
      <React.Fragment key={i}>
          <div className="col" style={{ alignItems: 'center', gap: 6 }}>
            <span style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: i <= idx ? 'var(--walnut)' : 'var(--cream-2)', color: i <= idx ? '#fff' : 'var(--muted)' }}>
              {i < idx ? <Icon name="check" size={14} /> : <span style={{ width: 7, height: 7, borderRadius: 9, background: 'currentColor' }}></span>}
            </span>
            <span className="tiny" style={{ color: i <= idx ? 'var(--ink)' : 'var(--muted)' }}>{l}</span>
          </div>
          {i < 2 && <span style={{ flex: 1, height: 2, background: i < idx ? 'var(--walnut)' : 'var(--line)', margin: '0 4px', marginBottom: 18 }}></span>}
        </React.Fragment>
      )}
    </div>);

}

function AccountOrders() {
  const app = useApp();
  const [open, setOpen] = useState(null);
  if (app.orders.length === 0) return <div className="empty panel" style={{ padding: '60px' }}><div className="em-ic"><Icon name="box" size={26} /></div><p>هنوز سفارشی ثبت نکرده‌اید.</p></div>;
  return (
    <div className="col" style={{ gap: 16 }}>
      {app.orders.map((o) => {
        const st = ORDER_STATUS[o.status];
        const isOpen = open === o.id;
        return (
          <div key={o.id} className="panel" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="between" style={{ padding: '18px 22px', cursor: 'pointer' }} onClick={() => setOpen(isOpen ? null : o.id)}>
              <div className="center" style={{ gap: 14 }}>
                <span style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--cream-2)', color: 'var(--walnut)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="box" size={22} /></span>
                <div className="col" style={{ gap: 3 }}>
                  <b style={{ fontSize: 15 }}>سفارش {o.id}</b>
                  <span className="tiny muted center" style={{ gap: 6 }}><Icon name="clock" size={13} /> {o.date}</span>
                </div>
              </div>
              <div className="center" style={{ gap: 14 }}>
                <span className={'tag ' + st.tag}>{st.name}</span>
                <Money value={o.total} cur={false} />
                <Icon name="chevDown" size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s', color: 'var(--muted)' }} />
              </div>
            </div>
            {isOpen &&
            <div style={{ padding: '4px 22px 22px', borderTop: '1px solid var(--line-soft)' }}>
                {o.status !== 'canceled' && <div style={{ padding: '18px 8px 8px' }}><StatusTrack status={o.status} /></div>}
                <div className="col" style={{ gap: 10, marginTop: 10 }}>
                  {o.items.map((it, i) => {const p = getProduct(it.id);if (!p) return null;return (
                    <div key={i} className="row" style={{ gap: 12, alignItems: 'center' }}>
                      <img src={asset(p.img)} style={{ width: 58, height: 46, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--line)' }} />
                      <div className="col grow" style={{ gap: 0 }}><b className="fa-title small">{p.name}</b><span className="tiny muted">{faNum(it.qty)} عدد · {fmtToman(it.price)} تومان</span></div>
                      <button className="btn btn-ghost btn-sm" onClick={() => app.navigate('product', { id: p.id })}>خرید دوباره</button>
                    </div>);
                })}
                </div>
              </div>
            }
          </div>);

      })}
    </div>);

}

function AccountProfile() {
  const app = useApp();
  const [f, setF] = useState({ ...app.user });
  const set = (k, v) => setF({ ...f, [k]: v });
  return (
    <div className="panel" style={{ padding: 28 }}>
      <h3 className="h3" style={{ marginBottom: 18 }}>مشخصاتِ من</h3>
      <div className="col" style={{ gap: 16, maxWidth: 560 }}>
        <div className="row" style={{ gap: 14 }}>
          <div className="field grow"><label className="label">نام و نام خانوادگی</label><input className="input" value={f.name} onChange={(e) => set('name', e.target.value)} /></div>
          <div className="field grow"><label className="label">شماره تماس</label><input className="input" dir="ltr" style={{ textAlign: 'right' }} value={f.phone} onChange={(e) => set('phone', e.target.value)} /></div>
        </div>
        <div className="field"><label className="label">ایمیل</label><input className="input" dir="ltr" style={{ textAlign: 'right' }} value={f.email} onChange={(e) => set('email', e.target.value)} /></div>
        <div className="field"><label className="label">شهر</label><input className="input" value={f.city} onChange={(e) => set('city', e.target.value)} /></div>
        <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => {app.setUser(f);app.toast('مشخصات به‌روزرسانی شد');}}><Icon name="check" size={18} /> ذخیره‌ی تغییرات</button>
      </div>
    </div>);

}

function AccountAddress() {
  const app = useApp();
  const [edit, setEdit] = useState(false);
  const [f, setF] = useState({ ...app.user });
  if (edit) return (
    <div className="panel" style={{ padding: 28 }}>
      <h3 className="h3" style={{ marginBottom: 18 }}>ویرایشِ نشانی</h3>
      <div className="col" style={{ gap: 16, maxWidth: 560 }}>
        <div className="row" style={{ gap: 14 }}>
          <div className="field grow"><label className="label">شهر</label><input className="input" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></div>
          <div className="field grow"><label className="label">کد پستی</label><input className="input" dir="ltr" style={{ textAlign: 'right' }} value={f.postal} onChange={(e) => setF({ ...f, postal: e.target.value })} /></div>
        </div>
        <div className="field"><label className="label">نشانیِ کامل</label><textarea className="textarea" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })}></textarea></div>
        <div className="center" style={{ gap: 10 }}>
          <button className="btn btn-primary" onClick={() => {app.setUser(f);setEdit(false);app.toast('نشانی ذخیره شد');}}>ذخیره</button>
          <button className="btn btn-quiet" onClick={() => setEdit(false)}>انصراف</button>
        </div>
      </div>
    </div>);

  return (
    <div className="panel" style={{ padding: 28 }}>
      <div className="between" style={{ marginBottom: 18 }}><h3 className="h3">نشانیِ من</h3><button className="btn btn-ghost btn-sm" onClick={() => {setF({ ...app.user });setEdit(true);}}><Icon name="edit" size={16} /> ویرایش</button></div>
      <div className="card" style={{ padding: 20, display: 'flex', gap: 14 }}>
        <Icon name="location" size={22} style={{ color: 'var(--walnut)', flexShrink: 0, marginTop: 2 }} />
        <div className="col" style={{ gap: 6 }}>
          <b>{app.user.name}</b>
          <p className="soft" style={{ margin: 0, lineHeight: 1.9 }}>{app.user.address}</p>
          <span className="small muted">کد پستی: {app.user.postal} · {app.user.phone}</span>
        </div>
      </div>
    </div>);

}

/* ---------------- SUPPORT ---------------- */
function Support() {
  const app = useApp();
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const faqs = [
  ['عینک‌ها واقعاً از چوب هستند؟', 'بله. هر فریمِ هور به‌طورِ کامل از چوبِ طبیعیِ گردو، چنار، راش یا ونگه تراشیده می‌شود و هیچ قطعه‌ی پلاستیکی در بدنه‌ی آن به‌کار نرفته است.'],
  ['عدسی‌ها چه ویژگی‌ای دارند؟', 'تمامِ عینک‌ها به عدسیِ پلاریزه با محافظتِ UV۴۰۰ مجهز هستند که خیرگی را کاهش می‌دهند و از چشم در برابرِ اشعه‌ی فرابنفش محافظت می‌کنند.'],
  ['ضمانتِ بازگشت دارید؟', 'تا ۷ روز پس از دریافت، در صورتِ سالم‌بودنِ کالا می‌توانید آن را مرجوع کنید. همچنین فریم‌ها ۱۸ ماه ضمانتِ تعویض دارند.'],
  ['زمانِ ارسال چقدر است؟', 'سفارش‌ها طیِ ۲ تا ۴ روزِ کاری با پستِ پیشتاز ارسال می‌شوند. برای تهران امکانِ ارسالِ فوریِ کمتر از ۲۴ ساعت نیز وجود دارد.'],
  ['آیا امکانِ سفارشِ اختصاصی هست؟', 'بله. برای سفارشِ فریم با چوب یا فرمِ دلخواه، از طریقِ اینستاگرام یا فرمِ تماس با ما در ارتباط باشید.']];

  return (
    <div>
      <section className="wrap section-sm" style={{ textAlign: 'center' }}>
        <span className="eyebrow center-line" style={{ justifyContent: 'center' }}>در کنارِ شما</span>
        <h1 className="h1 fa-title" style={{ margin: '10px 0' }}>پشتیبانی و تماس با ما</h1>
        <p className="lede" style={{ maxWidth: 560, margin: '0 auto' }}>هر پرسش یا درخواستی داری، ما این‌جاییم. از مشاوره‌ی انتخابِ فریم تا پیگیریِ سفارش.</p>
      </section>

      <section className="wrap">
        <div className="contact-grid" style={{ marginBottom: 36 }}>
          {[['phone', 'تماسِ تلفنی', '۰۲۱ — ۸۸ ۱۲ ۳۴ ۵۶', 'شنبه تا چهارشنبه، ۹ تا ۱۷'],
          ['instagram', 'اینستاگرام', '@hoor.irani', 'سریع‌ترین راهِ پاسخ‌گویی'],
          ['mail', 'ایمیل', 'hello@hoor-irani.ir', 'پاسخ طیِ یک روزِ کاری']].map(([ic, t, v, d]) =>
          <div key={t} className="panel" style={{ padding: 24, textAlign: 'center' }}>
              <span style={{ width: 54, height: 54, borderRadius: '50%', background: 'var(--cream-2)', color: 'var(--walnut)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}><Icon name={ic} size={24} /></span>
              <b style={{ display: 'block', marginBottom: 6 }}>{t}</b>
              <div dir="ltr" style={{ fontWeight: 600, marginBottom: 4 }}>{v}</div>
              <span className="small muted">{d}</span>
            </div>
          )}
        </div>
      </section>

      <section className="wrap section-sm">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'flex-start' }} className="cart-grid">
          <div className="panel" style={{ padding: 28 }}>
            <h3 className="h3" style={{ marginBottom: 16 }}>پیام بفرستید</h3>
            {sent ?
            <div className="empty" style={{ padding: '40px 10px' }}>
                <div className="em-ic" style={{ background: 'var(--ok-bg)', color: 'var(--ok)' }}><Icon name="check" size={26} /></div>
                <p>پیامت دریافت شد. به‌زودی پاسخ می‌دهیم.</p>
                <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => setSent(false)}>ارسالِ پیامِ دیگر</button>
              </div> :

            <form className="col" style={{ gap: 14 }} onSubmit={(e) => {e.preventDefault();setSent(true);app.toast('پیام ارسال شد');}}>
                <div className="row" style={{ gap: 14 }}>
                  <div className="field grow"><label className="label">نام</label><input required className="input" placeholder="نامِ شما" /></div>
                  <div className="field grow"><label className="label">شماره / ایمیل</label><input required className="input" /></div>
                </div>
                <div className="field"><label className="label">موضوع</label>
                  <select className="select"><option>مشاوره‌ی خرید</option><option>پیگیریِ سفارش</option><option>سفارشِ اختصاصی</option><option>سایر</option></select></div>
                <div className="field"><label className="label">پیام</label><textarea required className="textarea" placeholder="پیامت را بنویس…"></textarea></div>
                <button className="btn btn-primary btn-lg" style={{ alignSelf: 'flex-start' }}><Icon name="chat" size={18} /> ارسالِ پیام</button>
              </form>
            }
          </div>
          <div>
            <h3 className="h3" style={{ marginBottom: 8 }}>پرسش‌های پرتکرار</h3>
            {faqs.map(([q, a], i) =>
            <div key={i} className={'acc ' + (openFaq === i ? 'open' : '')}>
                <div className="acc-head" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>{q}<span className="pm"><Icon name="plus" size={18} /></span></div>
                <div className="acc-body"><p className="soft" style={{ margin: 0, lineHeight: 2 }}>{a}</p></div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>);

}

/* ---------------- ABOUT ---------------- */
function About() {
  const app = useApp();
  const steps = [
  ['leaf', 'انتخابِ چوب', 'از کهن‌ترین تنه‌های گردو، چنار و ونگه؛ با رگه‌هایی که هر کدام داستانی دارند.'],
  ['ruler', 'طراحی و برش', 'هر فرم با دقت طراحی و به‌دستِ استادکار از دلِ چوب بیرون کشیده می‌شود.'],
  ['sparkle', 'پرداخت و روغن‌کاری', 'سنباده‌ی چندمرحله‌ای و روغنِ طبیعی، گرما و ماندگاری را تضمین می‌کند.'],
  ['award', 'بازبینی نهایی', 'نصبِ عدسیِ پلاریزه و کنترلِ کیفیتِ تک‌به‌تک پیش از رسیدن به دستِ شما.']];

  return (
    <div>
      <section className="hero">
        <div className="wrap hero-grid" style={{ minHeight: 'auto', paddingTop: 30 }}>
          <div className="col" style={{ gap: 20 }}>
            <span className="eyebrow">داستانِ هور</span>
            <h1 className="h-display" style={{ fontSize: "47px" }}>گرمای چوب،<br />به قابِ نگاه.</h1>
            <p className="lede">هور از دلِ علاقه به چوب و دست‌سازه‌های ایرانی متولد شد. ما باور داریم یک عینک می‌تواند بیش از یک وسیله باشد؛ می‌تواند اثری باشد که با تو زندگی می‌کند و گرم‌تر می‌شود.</p>
            <p className="soft" style={{ lineHeight: 2 }}>هر فریمِ ما نامی دارد و هر نام، یک شعر است: سرمه، زهره، افسون، کویر… چرا که می‌خواهیم چیزی بسازیم که فقط دیده نشود، بلکه روایت شود.</p>
            <button className="btn btn-primary btn-lg" style={{ alignSelf: 'flex-start', opacity: "1" }} onClick={() => app.navigate('shop')}>دیدنِ مجموعه</button>
          </div>
          <div className="hero-photo"><img src={asset("assets/p-dowran.png")} alt="عینک چوبی" /></div>
        </div>
      </section>

      <section className="wrap section">
        <div className="motif" style={{ marginBottom: 36 }}><span className="dot"></span><span style={{ fontWeight: 600, color: 'var(--ink-soft)' }}>از چوب تا قاب</span><span className="dot"></span></div>
        <div className="prod-grid cols-4">
          {steps.map(([ic, t, d], i) =>
          <div key={i} className="col" style={{ gap: 12 }}>
              <div className="between"><span style={{ width: 50, height: 50, borderRadius: 14, background: 'var(--cream-2)', color: 'var(--walnut)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={ic} size={24} /></span><span className="wordmark muted" style={{ fontSize: 28 }}>{faNum(i + 1)}</span></div>
              <b style={{ fontSize: 17 }}>{t}</b>
              <p className="soft small" style={{ margin: 0, lineHeight: 1.9 }}>{d}</p>
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ background: 'var(--ink)', color: '#E7DCCD' }}>
        <div className="wrap">
          <div className="between" style={{ marginBottom: 30, flexWrap: 'wrap', gap: 12 }}>
            <h2 className="h2" style={{ color: '#fff' }}>چوب‌هایی که با آن‌ها کار می‌کنیم</h2>
            <span className="soft" style={{ color: '#B9AD9C', maxWidth: 360 }}>هر گونه چوب، رنگ، وزن و شخصیتِ خود را دارد.</span>
          </div>
          <div className="prod-grid cols-4">
            {WOOD_TYPES.map((w) =>
            <div key={w.id} style={{ background: 'rgba(255,255,255,.05)', borderRadius: 'var(--r-md)', padding: 24, border: '1px solid rgba(255,255,255,.08)' }}>
                <span className="wood-dot" style={{ background: w.color, width: 34, height: 34, marginBottom: 14, display: 'block' }}></span>
                <b style={{ color: '#fff', fontSize: 18, display: 'block', marginBottom: 6 }}>{w.name}</b>
                <span className="soft small" style={{ color: '#B9AD9C' }}>{w.note}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="wrap section" style={{ textAlign: 'center' }}>
        <img src={asset("assets/logo-black.png")} style={{ width: 60, height: 60, margin: '0 auto 20px', opacity: .85 }} />
        <h2 className="h2 fa-title" style={{ maxWidth: 680, margin: '0 auto 14px' }}>هر فریم، یکتاست — درست مثلِ تو.</h2>
        <p className="lede" style={{ maxWidth: 520, margin: '0 auto 22px' }}>به جمعِ دوست‌دارانِ چوب بپیوند و عینکی را انتخاب کن که داستانِ خودش را دارد.</p>
        <button className="btn btn-primary btn-lg" onClick={() => app.navigate('shop')}>ورود به فروشگاه</button>
      </section>
    </div>);

}

Object.assign(window, { Account, Support, About });