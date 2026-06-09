/* ============================================================
   HOOR — shared chrome: Header, Footer, ProductCard, Filters, CartDrawer
   ============================================================ */

function Logo({ size = 40, light = false, withText = true }) {
  return (
    <div className="brand">
      <img src={asset(light ? 'assets/logo-cream.png' : 'assets/logo-black.png')} alt="HOOR" style={{ width: size, height: size }} />
      {withText &&
      <div className="col" style={{ gap: 0, lineHeight: 1 }}>
          <span className="name" style={{ color: light ? '#F4ECDD' : 'var(--ink)' }}>HOOR</span>
          <span className="sub">هور ایرانی</span>
        </div>
      }
    </div>);

}

const NAV = [
{ id: 'home', label: 'خانه' },
{ id: 'shop', label: 'فروشگاه' },
{ id: 'about', label: 'درباره‌ی هور' },
{ id: 'support', label: 'پشتیبانی' }];


function Header() {
  const app = useApp();
  const [openSearch, setOpenSearch] = useState(false);
  const [q, setQ] = useState('');
  const [menu, setMenu] = useState(false);
  const cartN = app.cart.reduce((s, i) => s + i.qty, 0);
  const wishN = app.wishlist.length;

  const go = (id, params) => {app.navigate(id, params);setMenu(false);};
  const submitSearch = (e) => {e.preventDefault();if (q.trim()) {app.navigate('shop', { q: q.trim() });setOpenSearch(false);}};

  return (
    <>
      <div className="announce">ارسالِ رایگان برای سفارش‌های بالای <b>۵٬۰۰۰٬۰۰۰ تومان</b> · هر فریم، دست‌سازِ یکتا</div>
      <header className="site-header">
        <div className="wrap bar">
          <div className="center" style={{ gap: 14 }}>
            <button className="iconbtn menu-btn" onClick={() => setMenu(true)} aria-label="منو"><Icon name="menu" /></button>
            <a onClick={() => go('home')} style={{ cursor: 'pointer' }}><Logo /></a>
          </div>

          <nav className="nav grow" style={{ justifyContent: 'center' }}>
            {NAV.map((n) =>
            <a key={n.id} className={app.route === n.id ? 'active' : ''} onClick={() => go(n.id)} style={{ cursor: 'pointer' }}>{n.label}</a>
            )}
          </nav>

          <div className="header-actions">
            <button className="iconbtn" onClick={() => setOpenSearch((s) => !s)} aria-label="جستجو"><Icon name="search" /></button>
            <button className="iconbtn" onClick={() => go('wishlist')} aria-label="علاقه‌مندی‌ها">
              <Icon name="heart" />{wishN > 0 && <span className="badge-count">{faNum(wishN)}</span>}
            </button>
            <button className="iconbtn" onClick={() => app.setCartOpen(true)} aria-label="سبد خرید">
              <Icon name="bag" />{cartN > 0 && <span className="badge-count">{faNum(cartN)}</span>}
            </button>
            <button className="iconbtn acct-btn" onClick={() => go('account')} aria-label="حساب کاربری"><Icon name="user" /></button>
          </div>
        </div>

        {openSearch &&
        <div style={{ borderTop: '1px solid var(--line)', background: 'var(--paper)' }}>
            <form className="wrap" onSubmit={submitSearch} style={{ padding: '14px 28px' }}>
              <div className="center" style={{ gap: 12 }}>
                <Icon name="search" style={{ color: 'var(--muted)' }} />
                <input autoFocus className="input" style={{ border: 'none', height: 40, padding: 0 }} placeholder="نام عینک را جستجو کنید… مثلاً سرمه، هما، زهره"
              value={q} onChange={(e) => setQ(e.target.value)} />
                <button type="button" className="iconbtn" onClick={() => setOpenSearch(false)}><Icon name="x" size={18} /></button>
              </div>
            </form>
          </div>
        }
      </header>

      {menu &&
      <div className="overlay" onClick={() => setMenu(false)}>
          <div className="drawer" style={{ insetInlineStart: 0, insetInlineEnd: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="between" style={{ padding: '18px 20px', borderBottom: '1px solid var(--line)' }}>
              <Logo />
              <button className="iconbtn" onClick={() => setMenu(false)}><Icon name="x" /></button>
            </div>
            <div className="col" style={{ padding: 14 }}>
              {NAV.map((n) =>
            <a key={n.id} onClick={() => go(n.id)} style={{ padding: '14px 12px', fontSize: 17, fontWeight: 600, cursor: 'pointer', borderBottom: '1px solid var(--line-soft)' }}>{n.label}</a>
            )}
              <a onClick={() => go('account')} style={{ padding: '14px 12px', fontSize: 17, fontWeight: 600, cursor: 'pointer', borderBottom: '1px solid var(--line-soft)' }}>حساب کاربری</a>
              <a onClick={() => go('admin')} style={{ padding: '14px 12px', fontSize: 15, color: 'var(--muted)', cursor: 'pointer' }}>پنل مدیریت</a>
            </div>
          </div>
        </div>
      }
    </>);

}

/* ---------- Product card ---------- */
function ProductCard({ p, onQuick }) {
  const app = useApp();
  const wished = app.wishlist.includes(p.id);
  const low = p.stock <= 3;
  return (
    <div className="pcard fade-up">
      <div className="ph" onClick={() => app.navigate('product', { id: p.id })} style={{ cursor: 'pointer' }}>
        <img src={asset(p.img)} alt={p.name} loading="lazy" style={{ margin: "0px 1px 0px 0px", borderStyle: "solid", borderWidth: "0px", borderRadius: "0px 2px 0px 0px", padding: "0px", opacity: "1", height: "218px", width: "281px" }} />
        <div className="float-tags">
          {p.oldPrice ? <span className="tag danger">حراج</span> : p.badge ? <span className="tag dark">{p.badge}</span> : null}
          {p.stock === 0 && <span className="tag">ناموجود</span>}
        </div>
        <button className={'wishbtn ' + (wished ? 'on' : '')} onClick={(e) => {e.stopPropagation();app.toggleWish(p.id);}} aria-label="علاقه‌مندی">
          <svg width="18" height="18" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7"><path d={ICONS.heart} /></svg>
        </button>
      </div>
      <div className="body">
        <div className="between" style={{ gap: 8 }}>
          <h3 className="pname" style={{ cursor: 'pointer' }} onClick={() => app.navigate('product', { id: p.id })}>{p.name}</h3>
          <button className="iconbtn" style={{ background: 'var(--cream-2)', width: 36, height: 36, flexShrink: 0 }} title="افزودن به سبد"
          onClick={() => app.addToCart(p.id)}><Icon name="plus" size={17} /></button>
        </div>
        <div className="center" style={{ gap: 8 }}>
          <Money value={p.price} />
          {p.oldPrice && <Money value={p.oldPrice} cur={false} className="old small" />}
        </div>
      </div>
    </div>);

}

/* ---------- Footer ---------- */
function Footer() {
  const app = useApp();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Logo light withText />
            <p style={{ marginTop: 18, color: '#B4A998', fontSize: 14, lineHeight: 1.9, maxWidth: 300 }}>
              عینک‌های چوبیِ دست‌ساز، زاده‌ی گرمای چوب و ذوقِ ایرانی. هر فریم، یک اثرِ یکتاست که برای تماشای جهان ساخته شده.
            </p>
            <div className="center" style={{ gap: 10, marginTop: 18 }}>
              <a className="iconbtn" style={{ border: '1px solid rgba(255,255,255,.16)', color: '#D9CFC2' }} href="#" onClick={(e) => e.preventDefault()}><Icon name="instagram" size={19} /></a>
              <a className="iconbtn" style={{ border: '1px solid rgba(255,255,255,.16)', color: '#D9CFC2' }} href="#" onClick={(e) => e.preventDefault()}><Icon name="phone" size={19} /></a>
            </div>
          </div>
          <div>
            <div className="ftitle">فروشگاه</div>
            <a className="flink" onClick={() => app.navigate('shop')} style={{ cursor: 'pointer' }}>همه‌ی عینک‌ها</a>
            <a className="flink" onClick={() => app.navigate('shop', { gender: 'women' })} style={{ cursor: 'pointer' }}>زنانه</a>
            <a className="flink" onClick={() => app.navigate('shop', { gender: 'men' })} style={{ cursor: 'pointer' }}>مردانه</a>
            <a className="flink" onClick={() => app.navigate('shop', { gender: 'uni' })} style={{ cursor: 'pointer' }}>مردانه و زنانه</a>
          </div>
          <div>
            <div className="ftitle">راهنما</div>
            <a className="flink" onClick={() => app.navigate('support')} style={{ cursor: 'pointer' }}>تماس با ما</a>
            <a className="flink" onClick={() => app.navigate('support')} style={{ cursor: 'pointer' }}>پرسش‌های پرتکرار</a>
            <a className="flink" onClick={() => app.navigate('support')} style={{ cursor: 'pointer' }}>ارسال و مرجوعی</a>
            <a className="flink" onClick={() => app.navigate('account')} style={{ cursor: 'pointer' }}>پیگیری سفارش</a>
          </div>
          <div>
            <div className="ftitle">با ما در تماس باشید</div>
            <div className="center" style={{ gap: 10, color: '#B4A998', fontSize: 14, padding: '5px 0' }}><Icon name="phone" size={17} /> ۰۲۱ — ۸۸ ۱۲ ۳۴ ۵۶</div>
            <div className="center" style={{ gap: 10, color: '#B4A998', fontSize: 14, padding: '5px 0' }}><Icon name="mail" size={17} /> hello@hoor-irani.ir</div>
            <div className="center" style={{ gap: 10, color: '#B4A998', fontSize: 14, padding: '5px 0' }}><Icon name="instagram" size={17} /> @hoor.irani</div>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© ۱۴۰۳ هور ایرانی — تمامی حقوق محفوظ است.</span>
          <span>طراحی‌شده با ❤ برای دوست‌دارانِ چوب</span>
        </div>
      </div>
    </footer>);

}

/* ---------- Cart drawer ---------- */
function CartDrawer() {
  const app = useApp();
  if (!app.cartOpen) return null;
  const lines = app.cart.map((c) => ({ ...c, p: getProduct(c.id) })).filter((l) => l.p);
  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  return (
    <div className="overlay" onClick={() => app.setCartOpen(false)}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="between" style={{ padding: '20px 22px', borderBottom: '1px solid var(--line)' }}>
          <div className="center" style={{ gap: 10 }}><Icon name="bag" /><b style={{ fontSize: 17 }}>سبد خرید</b>
            <span className="tag">{faNum(lines.reduce((s, l) => s + l.qty, 0))} قلم</span></div>
          <button className="iconbtn" onClick={() => app.setCartOpen(false)}><Icon name="x" /></button>
        </div>

        {lines.length === 0 ?
        <div className="empty grow">
            <div className="em-ic"><Icon name="bag" size={26} /></div>
            <p>سبد خریدت خالی‌ست.</p>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={() => {app.setCartOpen(false);app.navigate('shop');}}>رفتن به فروشگاه</button>
          </div> :

        <>
            <div className="grow" style={{ overflow: 'auto', padding: '8px 16px' }}>
              {lines.map((l) =>
            <div key={l.id} className="row" style={{ gap: 12, padding: '14px 6px', borderBottom: '1px solid var(--line-soft)' }}>
                  <img src={asset(l.p.img)} alt={l.p.name} style={{ width: 78, height: 64, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--line)' }} />
                  <div className="col grow" style={{ gap: 6 }}>
                    <div className="between"><b className="fa-title" style={{ fontSize: 15 }}>{l.p.name}</b>
                      <button className="iconbtn" style={{ width: 30, height: 30 }} onClick={() => app.removeFromCart(l.id)}><Icon name="trash" size={16} /></button></div>
                    <div className="small muted">چوب {woodName(l.p.wood)} · {shapeName(l.p.shape)}</div>
                    <div className="between">
                      <div className="qty" style={{ transform: 'scale(.86)', transformOrigin: 'right' }}>
                        <button onClick={() => app.setQty(l.id, l.qty - 1)}><Icon name="minus" size={15} /></button>
                        <span>{faNum(l.qty)}</span>
                        <button onClick={() => app.setQty(l.id, l.qty + 1)}><Icon name="plus" size={15} /></button>
                      </div>
                      <Money value={l.p.price * l.qty} />
                    </div>
                  </div>
                </div>
            )}
            </div>
            <div style={{ padding: '18px 22px', borderTop: '1px solid var(--line)' }}>
              <div className="between" style={{ marginBottom: 14 }}><span className="muted">جمع کل</span><Money value={subtotal} className="h3" /></div>
              <button className="btn btn-primary btn-block btn-lg" onClick={() => {app.setCartOpen(false);app.navigate('checkout');}}>ادامه‌ی خرید و پرداخت</button>
              <button className="btn btn-quiet btn-block" style={{ marginTop: 6 }} onClick={() => {app.setCartOpen(false);app.navigate('cart');}}>مشاهده‌ی سبد</button>
            </div>
          </>
        }
      </div>
    </div>);

}

Object.assign(window, { Logo, Header, Footer, ProductCard, CartDrawer, NAV });