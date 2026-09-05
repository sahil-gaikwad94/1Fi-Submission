import { NavLink, useLocation } from 'react-router-dom';

function Icon({ name }) {
  const paths = { home: <><path d="M3 11.5L12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" /></>, shop: <><path d="M3 8h18l-1.5 11.2A2 2 0 0 1 17.5 21H6.5a2 2 0 0 1-2-1.8L3 8z" strokeLinejoin="round" /><path d="M8 8V6a4 4 0 0 1 8 0v2" /></>, dues: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" strokeLinecap="round" /></>, limit: <><path d="M4 20V10M4 20l7-9 4 4 5-7" strokeLinecap="round" strokeLinejoin="round" /><circle cx="20" cy="8" r="1.5" fill="currentColor" /></>, profile: <><circle cx="12" cy="9" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" strokeLinecap="round" /></> };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{paths[name]}</svg>;
}

export default function BottomNav() {
  const { pathname } = useLocation();
  const items = [['/home', 'home', 'Home'], ['/shop', 'shop', 'Shop'], ['/emi-dues', 'dues', 'EMI Dues'], ['/limit', 'limit', 'Limit'], ['/profile', 'profile', 'Profile']];
  return <nav className="bottom-nav" aria-label="Primary">{items.map(([to, icon, label]) => <NavLink key={to} to={to} className={'nav-item' + (pathname.startsWith(to) || (to === '/shop' && pathname.startsWith('/shop')) ? ' active' : '')}><Icon name={icon} /> {label}</NavLink>)}</nav>;
}
