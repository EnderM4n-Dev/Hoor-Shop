/* ============================================================
   HOOR — pages: Home, Shop (image categories), Product
   minimal · image-driven · one-line text
   ============================================================ */

function CatCard({ c, ratio = '3/3.6' }) {
  const app = useApp();
  return (
    <div className="cat-card fade-up" style={{ aspectRatio: ratio }} onClick={() => app.navigate('shop', { gender: c.id })}>
      <img src={asset(c.img)} alt={c.name} />
      <div className="cap">
        <b>{c.name}</b>
        <span className="go"><Icon name="arrowLeft" size={18} /></span>
      </div>
    </div>);

}

function TeaserVideo() {
  const ref = useRef(null);
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const tryPlay = () => {const p = v.play();if (p && p.catch) p.catch(() => {});};
    tryPlay();
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => {if (e.isIntersecting) tryPlay();else v.pause();});
    }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  const toggle = () => {
    const v = ref.current;if (!v) return;
    const next = !muted;
    v.muted = next;setMuted(next);
    if (!next) {const p = v.play();if (p && p.catch) p.catch(() => {});}
  };
  return (
    <div className="teaser-video fade-up">
      <video ref={ref} src={asset('assets/teaser-fateme.mp4')} poster={asset('assets/teaser-poster.jpg')}
      autoPlay muted loop playsInline preload="auto" style={{ opacity: "1", padding: "0px", width: "446px", height: "679px" }}></video>
      <button className="teaser-sound" onClick={toggle} aria-label={muted ? 'پخش صدا' : 'قطع صدا'}>
        <Icon name={muted ? 'soundOff' : 'soundOn'} size={20} />
      </button>
    </div>);
}

function HeroGallery() {
  const slides = [
  { src: 'assets/hero-1.jpg', alt: 'عینک نگار', id: 'negar' },
  { src: 'assets/hero-2.jpg', alt: 'عینک زهره', id: 'zohreh' },
  { src: 'assets/hero-3.jpg', alt: 'عینک زاویه', id: 'zaviyeh' }];
  const [i, setI] = useState(0);
  const timer = useRef(null);
  const start = () => {if (timer.current) clearInterval(timer.current);timer.current = setInterval(() => setI((p) => (p + 1) % slides.length), 5000);};
  useEffect(() => {start();return () => timer.current && clearInterval(timer.current);}, []);
  const go = (n) => {setI(n);start();};
  return (
    <section className="home-hero">
      {slides.map((s, n) =>
      <img key={n} className={'hg-slide ' + (n === i ? 'on' : '')} src={asset(s.src)} alt={s.alt} />
      )}
      <div className="hg-dots">
        {slides.map((s, n) =>
        <button key={n} className={'hg-dot ' + (n === i ? 'on' : '')} onClick={() => go(n)} aria-label={s.alt}></button>
        )}
      </div>
    </section>);
}

/* ---------------- HOME ---------------- */
function Home() {
  const app = useApp();
  return (
    <div style={{ borderRadius: '0px' }}>
      {/* full-bleed hero gallery */}
      <HeroGallery />

      {/* divider — Persian motif */}
      <section className="wrap" style={{ padding: '46px 0 10px', textAlign: 'center' }}>
        <div className="motif" style={{ maxWidth: 520, margin: '0 auto' }}>
          <span className="dot"></span>
          <span style={{ fontWeight: 600, color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>هر فریم، یک شعر است</span>
          <span className="dot"></span>
        </div>
      </section>

      {/* teaser video + brand story — side by side */}
      <section className="wrap section-sm">
        <div className="teaser-grid">
          <TeaserVideo />
          <div className="col teaser-story" style={{ gap: 18 }}>
            <span className="eyebrow">داستانِ هور</span>
            <h2 className="h2 fa-title">از دلِ چوب، برای تماشای جهان.</h2>
            <p className="soft" style={{ lineHeight: 2, margin: 0 }}>
              هور از علاقه به چوب و دست‌سازه‌های ایرانی زاده شد؛ جایی که هنرِ کهن با نگاهِ امروز تلاقی می‌کند. هر فریم را از دلِ چوبِ کهنسال می‌تراشیم، صیقل می‌دهیم و با روغنِ طبیعی جان می‌بخشیم.
            </p>
            <p className="soft" style={{ lineHeight: 2, margin: 0 }}>
              نتیجه عینکی‌ست که هیچ دو نمونه‌اش یکسان نیست — درست مثلِ آدم‌هایی که آن را می‌پوشند.
            </p>
            <button className="btn btn-ghost" style={{ alignSelf: 'flex-start' }} onClick={() => app.navigate('about')}>بیشتر درباره‌ی هور</button>
          </div>
        </div>
      </section>

      {/* why hoor */}
      <section className="wrap section-sm" style={{ paddingTop: 0 }}>
        <div className="motif" style={{ marginBottom: 34 }}><span className="dot"></span><span style={{ fontWeight: 600, color: 'var(--ink-soft)' }}>چرا هور؟</span><span className="dot"></span></div>
        <div className="why-grid">
          {[
          ['leaf', 'چوب طبیعی', 'گردو، چنار و ونگه‌ی کهنسال'],
          ['award', 'کاملاً دست‌ساز', 'تراش و پرداختِ تک‌به‌تک'],
          ['sparkle', 'یکتا و بی‌همتا', 'هیچ دو فریمی یکسان نیست'],
          ['shield', 'ضمانتِ اصالت', '۱۸ ماه ضمانتِ فریم']].
          map(([ic, t, d], i) =>
          <div key={i} className="why-card">
              <span className="why-ic"><Icon name={ic} size={24} /></span>
              <b style={{ fontSize: 16 }}>{t}</b>
              <span className="muted small">{d}</span>
            </div>
          )}
        </div>
      </section>

      {/* categories — image driven */}
      <section className="wrap section-sm" style={{ paddingTop: 0 }}>
        <div className="between" style={{ marginBottom: 20 }}>
          <h2 className="h3">از مجموعه‌ی هور دیدن کنید</h2>
          <button className="btn btn-primary btn-sm" onClick={() => app.navigate('shop')}>ورود به فروشگاه</button>
        </div>
      </section>

      {/* quiet brand line */}
      <section className="wrap" style={{ padding: '70px 0', textAlign: 'center' }}>
        <img src={asset('assets/logo-black.png')} alt="" style={{ width: 44, height: 44, margin: '0 auto 16px', opacity: .8 }} />
        <p className="muted" style={{ fontSize: 14 }}>هر فریم، دست‌سازِ یکتا.</p>
      </section>
    </div>);

}

/* ---------------- SHOP ---------------- */
function Shop() {
  const app = useApp();
  const params = app.params || {};
  const cat = params.gender || null;

  // category landing
  if (!cat) {
    const featured = ['negar', 'afsoon', 'dowran', 'kavir'].map(getProduct).filter(Boolean);
    return (
      <div className="wrap section-sm">
        <h1 className="h2 fa-title" style={{ marginBottom: 6 }}>فروشگاه</h1>
        <p className="muted small" style={{ marginBottom: 26 }}>یک دسته را انتخاب کن</p>
        <div className="cat-grid">
          {CATEGORIES.map((c) => <CatCard key={c.id} c={c} ratio="3/3.4" />)}
        </div>

        <div className="between" style={{ margin: '48px 0 20px' }}>
          <h2 className="h3">منتخب‌ها</h2>
        </div>
        <div className="prod-grid cols-4">{featured.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </div>);

  }

  const c = CATEGORIES.find((x) => x.id === cat);
  const list = app.products.filter((p) => p.gender === cat);
  return (
    <div className="wrap section-sm">
      <div className="center small muted" style={{ marginBottom: 14, gap: 6 }}>
        <span onClick={() => app.navigate('home')} style={{ cursor: 'pointer' }}>خانه</span> /
        <span onClick={() => app.navigate('shop')} style={{ cursor: 'pointer' }}>فروشگاه</span>
      </div>
      <div className="between" style={{ marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 className="h2 fa-title">{c ? c.name : 'عینک‌ها'}</h1>
        <div className="center" style={{ gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map((x) =>
          <span key={x.id} className={'chip ' + (x.id === cat ? 'active' : '')} onClick={() => app.navigate('shop', { gender: x.id })}>{x.name}</span>
          )}
        </div>
      </div>
      {list.length === 0 ?
      <div className="empty panel" style={{ padding: '70px 20px' }}><div className="em-ic"><Icon name="search" size={26} /></div><p>عینکی در این دسته نیست.</p></div> :
      <div className="prod-grid cols-4">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
    </div>);

}

/* ---------------- PRODUCT DETAIL ---------------- */
function Product() {
  const app = useApp();
  const p = getProduct(app.params.id) || app.products.find((x) => x.id === app.params.id);
  const [gi, setGi] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('desc');
  useEffect(() => {setGi(0);setQty(1);setTab('desc');window.scrollTo(0, 0);}, [app.params.id]);
  if (!p) return <div className="wrap section"><p>محصول یافت نشد.</p></div>;
  const wished = app.wishlist.includes(p.id);
  const related = app.products.filter((x) => x.id !== p.id && x.gender === p.gender).slice(0, 4);

  return (
    <div className="wrap section-sm">
      <div className="small muted" style={{ marginBottom: 18 }}>
        <span onClick={() => app.navigate('home')} style={{ cursor: 'pointer' }}>خانه</span> / <span onClick={() => app.navigate('shop')} style={{ cursor: 'pointer' }}>فروشگاه</span> / <span style={{ color: 'var(--ink)' }}>{p.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 48, alignItems: 'flex-start' }} className="pd-grid">
        <div>
          <div className="gallery-main"><img src={asset(p.gallery[gi])} alt={p.name} /></div>
          {p.gallery.length > 1 &&
          <div className="thumbs">
              {p.gallery.map((g, i) =>
            <div key={i} className={'thumb ' + (i === gi ? 'on' : '')} onClick={() => setGi(i)}><img src={asset(g)} alt="" /></div>
            )}
            </div>
          }
        </div>

        <div className="col" style={{ gap: 16 }}>
          <div className="col" style={{ gap: 6 }}>
            <h1 className="h1 fa-title">{p.name}</h1>
            <p style={{ fontStyle: 'italic', color: 'var(--walnut)', fontSize: 15 }}>«{p.tagline}»</p>
          </div>
          <div className="center" style={{ gap: 10 }}><Stars value={p.rating} /><span className="small muted">{faNum(p.reviews)} دیدگاه</span></div>

          <div className="center" style={{ gap: 12 }}>
            <Money value={p.price} className="h2" />
            {p.oldPrice && <Money value={p.oldPrice} cur={false} className="old" />}
          </div>
          <p className="small muted">چوب {woodName(p.wood)} · {shapeName(p.shape)} · {genderName(p.gender)}</p>

          {p.stock > 0 ?
          <div className="center small" style={{ gap: 8, color: 'var(--ok)' }}><span style={{ width: 8, height: 8, borderRadius: 9, background: 'var(--ok)' }}></span> موجود</div> :
          <div className="center small" style={{ gap: 8, color: 'var(--danger)' }}>ناموجود</div>}

          <div className="center" style={{ gap: 12, marginTop: 4 }}>
            <div className="qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))}><Icon name="minus" size={16} /></button>
              <span>{faNum(qty)}</span>
              <button onClick={() => setQty(qty + 1)}><Icon name="plus" size={16} /></button>
            </div>
            <button className="btn btn-primary btn-lg grow" disabled={p.stock === 0} onClick={() => app.addToCart(p.id, qty)}><Icon name="bag" size={19} /> افزودن به سبد</button>
            <button className="iconbtn" style={{ width: 54, height: 54, border: '1px solid var(--line)', color: wished ? '#fff' : 'var(--ink)', background: wished ? 'var(--danger)' : 'var(--paper)' }} onClick={() => app.toggleWish(p.id)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7"><path d={ICONS.heart} /></svg>
            </button>
          </div>

          <div className="row" style={{ gap: 0, marginTop: 8, border: '1px solid var(--line)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
            {[['truck', 'ارسالِ امن'], ['shield', '۱۸ ماه ضمانت'], ['refresh', '۷ روز بازگشت']].map(([ic, t], i) =>
            <div key={i} className="col grow" style={{ alignItems: 'center', gap: 7, padding: '14px 8px', borderInlineStart: i ? '1px solid var(--line)' : 'none', textAlign: 'center' }}>
                <Icon name={ic} size={21} style={{ color: 'var(--walnut)' }} /><span className="tiny soft">{t}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 48 }}>
        <div className="tabs">
          <button className={tab === 'desc' ? 'on' : ''} onClick={() => setTab('desc')}>توضیحات</button>
          <button className={tab === 'spec' ? 'on' : ''} onClick={() => setTab('spec')}>مشخصات فنی</button>
          <button className={tab === 'care' ? 'on' : ''} onClick={() => setTab('care')}>نگهداری و ارسال</button>
        </div>
        <div style={{ padding: '24px 4px', maxWidth: 720 }}>
          {tab === 'desc' && <p className="soft" style={{ lineHeight: 2, fontSize: 15 }}>{p.desc}</p>}
          {tab === 'spec' &&
          <div>{productSpecs(p).map(([k, v], i) =>
            <div key={i} className="spec-row"><span className="k">{k}</span><span className="v">{v}</span></div>
            )}</div>
          }
          {tab === 'care' &&
          <div className="col" style={{ gap: 14 }}>
              <div className="center" style={{ gap: 12, alignItems: 'flex-start' }}><Icon name="leaf" size={20} style={{ color: 'var(--walnut)', marginTop: 2 }} /><p className="soft small" style={{ margin: 0 }}>دور از رطوبت و گرمای مستقیم نگه دارید و هر چند ماه با روغنِ طبیعی تمیز کنید.</p></div>
              <div className="center" style={{ gap: 12, alignItems: 'flex-start' }}><Icon name="truck" size={20} style={{ color: 'var(--walnut)', marginTop: 2 }} /><p className="soft small" style={{ margin: 0 }}>ارسال به سراسر ایران طی ۲ تا ۴ روزِ کاری. بالای ۵٬۰۰۰٬۰۰۰ تومان رایگان.</p></div>
            </div>
          }
        </div>
      </div>

      {related.length > 0 &&
      <div style={{ marginTop: 36 }}>
          <h2 className="h3" style={{ marginBottom: 18 }}>هم‌نشینان</h2>
          <div className="prod-grid cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
        </div>
      }
    </div>);

}

Object.assign(window, { Home, Shop, Product, CatCard, TeaserVideo, HeroGallery });