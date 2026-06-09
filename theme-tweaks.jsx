/* ============================================================
   HOOR — expressive theme tweaks (accent · surface mood · form)
   Applies to CSS custom properties on :root.
   ============================================================ */

const HOOR_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#9E342A",
  "surface": "گالری",
  "form": "مینیمال"
}/*EDITMODE-END*/;

// accent → [base, light, deep]
const HOOR_ACCENTS = {
  '#9E342A': ['#9E342A','#B0463B','#7C2018'], // قرمزِ فرش ایرانی
  '#B65C3A': ['#B65C3A','#C76E4B','#8E4225'], // ترکوتا
  '#6E7340': ['#6E7340','#828757','#53562E'], // زیتونی
  '#2F6E8E': ['#2F6E8E','#4486A6','#224F66'], // آبیِ کاشی
};
const HOOR_SURFACES = {
  'گالری': { cream:'#E6E6E6', cream2:'#DEDBD2', paper:'#FFFFFF', line:'#D6D2C7', lineSoft:'#E1DDD3' },
  'کرم':   { cream:'#EDE7DA', cream2:'#E4DDCC', paper:'#FBF8F2', line:'#E0D8C6', lineSoft:'#EAE3D4' },
  'خاکی':  { cream:'#D9D2C1', cream2:'#CDC5B0', paper:'#F0EBDF', line:'#C6BDA7', lineSoft:'#D6CEBC' },
};
const HOOR_FORMS = {
  'تیز':     { sm:'3px',  md:'4px',  lg:'7px',  xl:'10px' },
  'مینیمال': { sm:'10px', md:'16px', lg:'24px', xl:'32px' },
  'نرم':     { sm:'16px', md:'24px', lg:'34px', xl:'44px' },
};

function ThemeTweaks(){
  const [t, setTweak] = useTweaks(HOOR_TWEAK_DEFAULTS);
  useEffect(()=>{
    const r = document.documentElement.style;
    const a = HOOR_ACCENTS[t.accent] || HOOR_ACCENTS['#9E342A'];
    r.setProperty('--walnut', a[0]); r.setProperty('--walnut-2', a[1]);
    r.setProperty('--walnut-deep', a[2]); r.setProperty('--clay', a[0]);
    const s = HOOR_SURFACES[t.surface] || HOOR_SURFACES['گالری'];
    r.setProperty('--cream', s.cream); r.setProperty('--cream-2', s.cream2);
    r.setProperty('--paper', s.paper); r.setProperty('--line', s.line); r.setProperty('--line-soft', s.lineSoft);
    const f = HOOR_FORMS[t.form] || HOOR_FORMS['مینیمال'];
    r.setProperty('--r-sm', f.sm); r.setProperty('--r-md', f.md);
    r.setProperty('--r-lg', f.lg); r.setProperty('--r-xl', f.xl);
  }, [t.accent, t.surface, t.form]);

  return (
    <div dir="rtl">
      <TweaksPanel title="تنظیماتِ ظاهر">
        <TweakSection label="رنگِ برند" />
        <TweakColor label="اکسنت" value={t.accent}
          options={['#9E342A','#B65C3A','#6E7340','#2F6E8E']}
          onChange={v=>setTweak('accent', v)} />
        <TweakSection label="حال‌وهوای پس‌زمینه" />
        <TweakRadio value={t.surface} options={['گالری','کرم','خاکی']}
          onChange={v=>setTweak('surface', v)} />
        <TweakSection label="فرمِ گوشه‌ها" />
        <TweakRadio value={t.form} options={['تیز','مینیمال','نرم']}
          onChange={v=>setTweak('form', v)} />
      </TweaksPanel>
    </div>
  );
}

Object.assign(window, { ThemeTweaks });
