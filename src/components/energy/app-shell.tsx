import { Link, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, PlugZap, Users, Wallet, Settings, ArrowUpRight, ChevronDown, Bell, Zap, Leaf, X, Menu, CircleHelp } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useEnergy } from './energy-provider';
const nav = [{to:'/',label:'Overview',icon:LayoutDashboard},{to:'/appliances',label:'Appliances',icon:PlugZap},{to:'/community',label:'Energy community',icon:Users},{to:'/savings',label:'Savings & credits',icon:Wallet},{to:'/settings',label:'Settings',icon:Settings}] as const;
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select:s => s.location.pathname });
  const [menu, setMenu] = useState(false); const [showNotifications, setShowNotifications] = useState(false);
  const { community, appliances } = useEnergy();
  return <div className="app-layout">
    <aside className={`sidebar ${menu ? 'sidebar-open' : ''}`}>
      <Link to="/" className="brand" aria-label="Wien Energie home"><span>WIEN<span className="brand-energy">ENERGIE</span></span><Zap className="brand-bolt" fill="currentColor"/></Link>
      <div className="product-mark"><span className="text-primary">●</span> Smart energy, your way.</div>
      <Button variant="outline" className="home-selector" asChild><Link to="/settings"><span className="house-icon">⌂</span><span className="text-left flex-1">My home<span className="block text-xs text-muted-foreground mt-1">Vienna, Austria</span></span><ChevronDown/></Link></Button>
      <div className="nav-caption">YOUR ENERGY</div>
      <nav aria-label="Main navigation" className="side-nav">{nav.map(item => <Button key={item.to} variant="ghost" asChild className={`nav-item ${pathname===item.to ? 'nav-active' : ''}`}><Link to={item.to} onClick={()=>setMenu(false)}><item.icon size={19}/><span>{item.label}</span>{item.to === '/appliances' && <span className="nav-count">{appliances.length}</span>}</Link></Button>)}</nav>
      <div className="sidebar-bottom"><div className="community-small"><div className="flex items-center gap-2 text-sm font-semibold"><Leaf size={17}/>{community ? 'Better, together.' : 'Smarter energy.'}</div><p>{community ? 'Your neighbourhood is powering a greener tomorrow.' : 'Get more from local, renewable energy.'}</p><Button variant="link" asChild className="p-0 h-auto text-xs"><Link to="/community">Your energy community <ArrowUpRight size={14}/></Link></Button></div>
      <Button variant="ghost" asChild className="justify-start text-muted-foreground mt-4 w-full"><Link to="/info"><CircleHelp/>Help & information<ArrowUpRight className="ml-auto"/></Link></Button>
      <div className="profile-row"><span className="avatar">BT</span><div><strong>Benjamin Tran</strong><span>Personal account</span></div><Button variant="ghost" size="icon" asChild aria-label="Account settings"><Link to="/settings"><ChevronDown/></Link></Button></div></div>
    </aside>
    {menu && <div className="mobile-backdrop" onClick={()=>setMenu(false)}/>}
    <div className="main-wrap"><header className="topbar"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="mobile-menu" onClick={()=>setMenu(!menu)} aria-label="Open navigation">{menu ? <X/> : <Menu/>}</Button><span className="breadcrumb">My home <span>/</span> <strong>{nav.find(n=>n.to===pathname)?.label ?? 'Help & information'}</strong></span></div><div className="flex items-center gap-5"><span className="demo-label">Demo household</span><span className="system-status"><i/> All systems connected</span><div className="relative"><Button variant="ghost" size="icon" aria-label="Notifications" onClick={()=>setShowNotifications(!showNotifications)}><Bell size={18}/><span className="notification-dot"/></Button>{showNotifications && <div className="notification-panel"><strong>Your energy updates</strong><p><Leaf size={16}/> Local solar surplus expected at 14:00.</p><p><PlugZap size={16}/> All appliance plans meet their deadlines.</p><span className="text-xs text-muted-foreground">Illustrative forecast · 22 October</span></div>}</div><Link to="/settings" className="avatar avatar-small">BT</Link></div></header><main className="page-content">{children}</main><footer className="app-footer"><span>Wien Energie · Smart Energy</span><span>Illustrative prices & forecasts · All times Vienna</span></footer></div>
  </div>;
}
