import React from 'react';
import { 
  FileText, 
  Search, 
  Calendar, 
  AlertTriangle, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { BidAnalysis } from '../types';

interface DashboardProps {
  analyses: BidAnalysis[];
  onSelectAnalysis: (analysis: BidAnalysis) => void;
  onNewUpload: () => void;
}

export default function Dashboard({ analyses, onSelectAnalysis, onNewUpload }: DashboardProps) {
  const recentAnalyses = analyses.slice(0, 5);
  
  const stats = [
    { label: 'Total de Análises', value: analyses.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Riscos Identificados', value: analyses.reduce((acc, curr) => acc + curr.risks.length, 0), icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Próximas Sessões', value: analyses.filter(a => a.deadlines.publicSession !== 'Não identificada').length, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Bem-vindo ao LicitaAI</h2>
          <p className="text-slate-500 mt-1">Sua inteligência estratégica para licitações públicas.</p>
        </div>
        <button 
          onClick={onNewUpload}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
        >
          <Plus size={20} />
          Nova Análise
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Análises Recentes</h3>
            <button className="text-emerald-600 text-sm font-semibold hover:underline">Ver todas</button>
          </div>
          
          {recentAnalyses.length > 0 ? (
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <div 
                  key={analysis.id}
                  onClick={() => onSelectAnalysis(analysis)}
                  className="group flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 truncate max-w-[200px]">{analysis.generalInfo.organ}</p>
                      <p className="text-xs text-slate-500">{new Date(analysis.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} />
              </div>
              <p className="text-slate-500">Nenhuma análise encontrada.</p>
              <button 
                onClick={onNewUpload}
                className="text-emerald-600 font-semibold mt-2 hover:underline"
              >
                Comece enviando seu primeiro edital
              </button>
            </div>
          )}
        </div>

        {/* Quick Tips / Insights */}
        <div className="bg-emerald-900 text-white p-8 rounded-3xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4">Dica do Especialista</h3>
            <p className="text-emerald-100 leading-relaxed">
              "Sempre verifique a seção de **Riscos de Desclassificação**. 
              Muitas empresas perdem licitações por detalhes simples como a 
              falta de um atestado técnico específico ou capital social mínimo."
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold">IA</div>
              <div>
                <p className="text-sm font-bold">LicitaAI Assistant</p>
                <p className="text-xs text-emerald-300">Análise Preditiva</p>
              </div>
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-800 rounded-full opacity-50 blur-3xl" />
        </div>
      </div>
    </div>
  );
}
