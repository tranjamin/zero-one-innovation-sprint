import { useLanguage } from './language-provider';
import { Link, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, PlugZap, Users, Wallet, Settings, ArrowUpRight, ChevronDown, Bell, Zap, Leaf, X, Menu, CircleHelp, Info } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useEnergy } from './energy-provider';
const nav = [{to:'/',label:'Overview',icon:LayoutDashboard},{to:'/appliances',label:'Appliances',icon:PlugZap},{to:'/community',label:'Energy community',icon:Users},{to:'/savings',label:'Savings & credits',icon:Wallet},{to:'/about',label:'About',icon:Info},{to:'/settings',label:'Settings',icon:Settings}] as const;
export function AppShell({ children }: { children: ReactNode }) { const { t, language, setLanguage } = useLanguage(); 
  const pathname = useRouterState({ select:s => s.location.pathname });
  const [menu, setMenu] = useState(false); const [showNotifications, setShowNotifications] = useState(false);
  const { community, appliances } = useEnergy();
  return <div className="app-layout">
    <aside className={`sidebar ${menu ? 'sidebar-open' : ''}`}>
      <Link to="/" className="brand" aria-label={t("Wien Energie home")}><span>WIEN<span className="brand-energy">ENERGIE</span></span><Zap className="brand-bolt" fill="currentColor"/></Link>
      <div className="product-mark"><span className="text-primary">●</span> {t("Smart energy, your way.")}</div>
      <Button variant="outline" className="home-selector" asChild><Link to="/settings"><span className="house-icon">⌂</span><span className="text-left flex-1">{t("My home")}<span className="block text-xs text-muted-foreground mt-1">{t("Vienna, Austria")}</span></span><ChevronDown/></Link></Button>
      <div className="nav-caption">{t("YOUR ENERGY")}</div>
      <nav aria-label={t("Main navigation")} className="side-nav">{nav.map(item => <Button key={item.to} variant="ghost" asChild className={`nav-item ${pathname===item.to ? 'nav-active' : ''}`}><Link to={item.to} onClick={()=>setMenu(false)}><item.icon size={19}/><span>{t(item.label)}</span>{item.to === '/appliances' && <span className="nav-count">{appliances.length}</span>}</Link></Button>)}</nav>
      <div className="sidebar-bottom"><div className="community-small"><div className="flex items-center gap-2 text-sm font-semibold"><Leaf size={17}/>{community ? t("Better, together.") : t("Smarter energy.")}</div><p>{community ? t("Your neighbourhood is powering a greener tomorrow.") : t("Get more from local, renewable energy.")}</p><Button variant="link" asChild className="p-0 h-auto text-xs"><Link to="/community">{t("Your energy community")} <ArrowUpRight size={14}/></Link></Button></div>
      <Button variant="ghost" asChild className="justify-start text-muted-foreground mt-4 w-full"><Link to="/info"><CircleHelp/>{t("Help & information")}<ArrowUpRight className="ml-auto"/></Link></Button>
      <div className="profile-row"><span className="avatar">BT</span><div><strong>Benjamin Tran</strong><span>{t("Personal account")}</span></div><Button variant="ghost" size="icon" asChild aria-label={t("Account settings")}><Link to="/settings"><ChevronDown/></Link></Button></div></div>
    </aside>
    {menu && <div className="mobile-backdrop" onClick={()=>setMenu(false)}/>}
    <div className="main-wrap"><header className="topbar"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="mobile-menu" onClick={()=>setMenu(!menu)} aria-label={t("Open navigation")}>{menu ? <X/> : <Menu/>}</Button><span className="breadcrumb">{t("My home")} <span>/</span> <strong>{t(nav.find(n=>n.to===pathname)?.label ?? 'Help & information')}</strong></span></div><div className="flex items-center gap-5"><select className="native-select language-select" aria-label={t("Language")} value={language} onChange={e=>setLanguage(e.target.value === "de" ? "de" : "en")}><option value="de">Deutsch</option><option value="en">English</option></select><span className="demo-label">{t("Demo household")}</span><span className="system-status"><i/> {t("All systems connected")}</span><div className="relative"><Button variant="ghost" size="icon" aria-label={t("Notifications")} onClick={()=>setShowNotifications(!showNotifications)}><Bell size={18}/><span className="notification-dot"/></Button>{showNotifications && <div className="notification-panel"><strong>{t("Your energy updates")}</strong><p><Leaf size={16}/> {t("Local solar surplus expected at 14:00.")}</p><p><PlugZap size={16}/> {t("All appliance plans meet their deadlines.")}</p><span className="text-xs text-muted-foreground">{t("Illustrative forecast · 22 October")}</span></div>}</div><Link to="/settings" className="avatar avatar-small">BT</Link></div></header><main className="page-content">{children}</main><footer className="app-footer"><span>{t("Wien Energie · Smart Energy")}</span><span>{t("Illustrative prices & forecasts · All times Vienna")}</span></footer></div>
  </div>;
}
