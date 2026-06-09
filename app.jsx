/* ============================================================
   HOOR — App root: router + store (cart, wishlist, orders, admin)
   ============================================================ */

const LS = {
  get(k, fb){ try{ const v=localStorage.getItem('hoor_'+k); return v?JSON.parse(v):fb; }catch(e){ return fb; } },
  set(k, v){ try{ localStorage.setItem('hoor_'+k, JSON.stringify(v)); }catch(e){} },
};

function App(){
  const [route, setRoute] = useState(()=> LS.get('route','home'));
  const [params, setParams] = useState(()=> LS.get('params',{}));
  const [products, setProducts] = useState(()=> LS.get('products', PRODUCTS));
  const [cart, setCart] = useState(()=> LS.get('cart', []));
  const [wishlist, setWishlist] = useState(()=> LS.get('wishlist', []));
  const [user, setUserState] = useState(()=> LS.get('user', SAMPLE_USER));
  const [orders, setOrders] = useState(()=> LS.get('orders', SAMPLE_ORDERS));
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // persist
  useEffect(()=> LS.set('route', route), [route]);
  useEffect(()=> LS.set('params', params), [params]);
  useEffect(()=> LS.set('products', products), [products]);
  useEffect(()=> LS.set('cart', cart), [cart]);
  useEffect(()=> LS.set('wishlist', wishlist), [wishlist]);
  useEffect(()=> LS.set('user', user), [user]);
  useEffect(()=> LS.set('orders', orders), [orders]);

  const navigate = useCallback((r, p={})=>{
    setRoute(r); setParams(p); setCartOpen(false);
    window.scrollTo({top:0, behavior:'instant'});
  }, []);

  const toast = useCallback((msg, kind='ok')=>{
    const id = Date.now()+Math.random();
    setToasts(t=>[...t,{id,msg,kind}]);
    setTimeout(()=> setToasts(t=>t.filter(x=>x.id!==id)), 2600);
  }, []);

  // cart
  const addToCart = useCallback((id, qty=1)=>{
    setCart(c=>{ const ex=c.find(i=>i.id===id); return ex? c.map(i=>i.id===id?{...i,qty:i.qty+qty}:i) : [...c,{id,qty}]; });
    toast('به سبد افزوده شد'); setCartOpen(true);
  }, [toast]);
  const removeFromCart = useCallback(id=> setCart(c=>c.filter(i=>i.id!==id)), []);
  const setQty = useCallback((id, q)=> setCart(c=> q<=0? c.filter(i=>i.id!==id) : c.map(i=>i.id===id?{...i,qty:q}:i)), []);

  const toggleWish = useCallback((id)=>{
    setWishlist(w=>{ const on=w.includes(id); toast(on?'از علاقه‌مندی‌ها حذف شد':'به علاقه‌مندی‌ها افزوده شد', on?'info':'ok'); return on? w.filter(x=>x!==id):[...w,id]; });
  }, [toast]);

  // admin product crud
  const addProduct = useCallback(p=> setProducts(list=>[{...p}, ...list]), []);
  const updateProduct = useCallback(p=> setProducts(list=> list.map(x=>x.id===p.id?{...p}:x)), []);
  const deleteProduct = useCallback(id=> setProducts(list=> list.filter(x=>x.id!==id)), []);

  // orders
  const setOrderStatus = useCallback((id, status)=> setOrders(os=> os.map(o=>o.id===id?{...o,status}:o)), []);
  const placeOrder = useCallback((id, total)=>{
    setCart(curCart=>{
      const items = curCart.map(c=>({ id:c.id, qty:c.qty, price:(getProduct(c.id)||{price:0}).price }));
      const order = { id, date: todayFa(), status:'processing', total, items };
      setOrders(os=> [order, ...os]);
      return [];
    });
  }, []);

  const setUser = useCallback(u=> setUserState(u), []);

  const ctx = {
    route, params, navigate, products, cart, wishlist, user, orders,
    cartOpen, setCartOpen, toast,
    addToCart, removeFromCart, setQty, toggleWish,
    addProduct, updateProduct, deleteProduct, setOrderStatus, placeOrder, setUser,
  };

  const PAGES = { home:Home, shop:Shop, product:Product, cart:Cart, checkout:Checkout,
    wishlist:Wishlist, account:Account, support:Support, about:About, admin:Admin };
  const Page = PAGES[route] || Home;

  return (
    <AppCtx.Provider value={ctx}>
      {route==='admin' ? (
        <Admin/>
      ):(
        <>
          <Header/>
          <main style={{minHeight:'60vh'}}><Page/></main>
          <Footer/>
          <CartDrawer/>
        </>
      )}
      <ToastHost toasts={toasts}/>
      <ThemeTweaks/>
    </AppCtx.Provider>
  );
}

function todayFa(){
  // simple fixed-ish jalali-style label for demo
  return '۱۴۰۳/۱۰/۲۸';
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
