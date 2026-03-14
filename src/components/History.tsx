import React from 'react';
import { FileText, Calendar, AlertTriangle, ArrowRight, Trash2 } from 'lucide-react';
import { BidAnalysis } from '../types';
import { db } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore';

interface HistoryProps {
  analyses: BidAnalysis[];
  onSelectAnalysis: (analysis: BidAnalysis) => void;
  onDelete: (id: string) => void;
}

export default function History({ analyses, onSelectAnalysis, onDelete }: HistoryProps) {
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja excluir esta análise?')) {
      try {
        await deleteDoc(doc(db, 'analyses', id));
        onDelete(id);
      } catch (error) {
        console.error('Error deleting analysis:', error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Histórico de Análises</h2>
        <p className="text-slate-500 mt-1">Gerencie todos os editais que você já processou.</p>
      </div>

      {analyses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyses.map((analysis) => (
            <div 
              key={analysis.id}
              onClick={() => onSelectAnalysis(analysis)}
              className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer relative"
            >
              <button 
                onClick={(e) => handleDelete(e, analysis.id)}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>

              <div className="w-12 h-12 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                <FileText size={24} />
              </div>

              <h3 className="font-bold text-slate-900 truncate pr-8">{analysis.generalInfo.organ}</h3>
              <p className="text-sm text-slate-500 mt-1">{analysis.generalInfo.bidNumber}</p>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar size={14} />
                  {new Date(analysis.createdAt).toLocaleDateString('pt-BR')}
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                  analysis.difficultyScore.level === 'Easy' ? 'text-emerald-600 bg-emerald-50' :
                  analysis.difficultyScore.level === 'Moderate' ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50'
                }`}>
                  {analysis.difficultyScore.level}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2 text-sm text-emerald-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Ver Relatório Completo
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center">
          <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Nenhuma análise no histórico</h3>
          <p className="text-slate-500 mt-2">Envie seu primeiro edital para começar a construir seu histórico.</p>
        </div>
      )}
    </div>
  );
}
