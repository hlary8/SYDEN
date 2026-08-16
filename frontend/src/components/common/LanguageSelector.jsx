import { useEffect, useRef, useState } from 'react';

const options = [
  { code: 'EN', label: 'English' },
  { code: 'FR', label: 'Français' },
  { code: 'ES', label: 'Español' }
];

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState('EN');
  const ref = useRef();

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <div className="lang-selector" ref={ref}>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-haspopup="true">
        {lang} ▾
      </button>
      {open && (
        <ul className="lang-dropdown" role="menu">
          {options.map((opt) => (
            <li key={opt.code} role="menuitem" onClick={() => { setLang(opt.code); setOpen(false); }}>
              {opt.label} ({opt.code})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
