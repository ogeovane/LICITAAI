import React from 'react';
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckSquare, 
  Search, 
  History,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userEmail?: string | null;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout, userEmail }: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Enviar Edital', icon: Upload },
    { id: 'analysis', label: 'Análise do Edital', icon: FileText },
    { id: 'deadlines', label: 'Prazos', icon: Clock },
    { id: 'risks', label: 'Riscos', icon: AlertTriangle },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
    { id: 'search', label: 'Busca no Edital', icon: Search },
    { id: 'history', label: 'Histórico', icon: History },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:translate-x-0",
        !isOpen && "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold tracking-tight text-emerald-400">LicitaAI</h1>
            <p className="text-xs text-slate-400 mt-1">Inteligência em Licitações</p>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  activeTab === item.id 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="mr-3" size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="px-4 py-3 mb-4 rounded-lg bg-white/5">
              <p className="text-xs text-slate-400 truncate">{userEmail}</p>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut className="mr-3" size={18} />
              Sair
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
