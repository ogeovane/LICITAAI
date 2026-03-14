import React from 'react';
import { 
  Building2, 
  Calendar, 
  DollarSign, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  XCircle,
  TrendingUp,
  FileText
} from 'lucide-react';
import { BidAnalysis } from '../types';
import { motion } from 'motion/react';

interface AnalysisViewProps {
  analysis: BidAnalysis;
}

export default function AnalysisView({ analysis }: AnalysisViewProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-100';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'required': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'possibly': return <HelpCircle className="text-amber-500" size={18} />;
      case 'not_identified': return <XCircle className="text-slate-300" size={18} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-2">
            <FileText size={20} />
            <span>Análise Concluída</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">{analysis.generalInfo.organ}</h2>
          <p className="text-slate-500 mt-1">Edital: {analysis.generalInfo.bidNumber} • {analysis.generalInfo.modality}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-slate-500">Índice de Dificuldade</p>
            <p className={`text-xl font-bold ${
              analysis.difficultyScore.level === 'Easy' ? 'text-emerald-600' :
              analysis.difficultyScore.level === 'Moderate' ? 'text-amber-600' : 'text-red-600'
            }`}>
              {analysis.difficultyScore.level} ({analysis.difficultyScore.score}%)
            </p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-slate-100 flex items-center justify-center">
            <TrendingUp className={
              analysis.difficultyScore.level === 'Easy' ? 'text-emerald-500' :
              analysis.difficultyScore.level === 'Moderate' ? 'text-amber-500' : 'text-red-500'
            } />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* General Info */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Building2 size={20} className="text-emerald-500" />
              Informações da Licitação
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Objeto</p>
                <p className="text-slate-700 mt-1">{analysis.generalInfo.object}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tipo de Julgamento</p>
                <p className="text-slate-700 mt-1">{analysis.generalInfo.judgmentType}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Valor Estimado</p>
                <p className="text-emerald-600 font-bold text-lg mt-1">{analysis.generalInfo.estimatedValue || 'Não informado'}</p>
              </div>
            </div>
          </section>

          {/* Timeline / Deadlines */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-emerald-500" />
              Prazos da Licitação
            </h3>
            <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
              {[
                { label: 'Sessão Pública', value: analysis.deadlines.publicSession },
                { label: 'Envio de Proposta', value: analysis.deadlines.proposalSubmission },
                { label: 'Prazo de Impugnação', value: analysis.deadlines.impugnation },
                { label: 'Prazo de Recurso', value: analysis.deadlines.appeal },
                { label: 'Entrega do Produto/Serviço', value: analysis.deadlines.delivery },
                { label: 'Assinatura do Contrato', value: analysis.deadlines.contractSigning },
              ].map((item, idx) => (
                <div key={idx} className="relative flex items-center gap-6">
                  <div className="absolute left-0 w-10 h-10 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <div className="ml-12">
                    <p className="text-sm font-bold text-slate-900">{item.label}</p>
                    <p className="text-sm text-slate-500">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Risks */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-500" />
              Possíveis Motivos de Desclassificação
            </h3>
            <div className="space-y-4">
              {analysis.risks.map((risk, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${getRiskColor(risk.riskLevel)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">{risk.title}</h4>
                    <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-full bg-white/50">
                      Risco {risk.riskLevel}
                    </span>
                  </div>
                  <p className="text-sm opacity-90 mb-3">{risk.explanation}</p>
                  <div className="bg-white/40 p-3 rounded-lg text-xs italic">
                    "{risk.snippet}"
                    {risk.page && <span className="block mt-1 font-bold">— Página {risk.page}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-8">
          {/* Executive Summary */}
          <section className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-bold mb-4">Resumo Executivo</h3>
            <ul className="space-y-3">
              {analysis.executiveSummary.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className="text-emerald-400 font-bold">{idx + 1}.</span>
                  {point}
                </li>
              ))}
            </ul>
          </section>

          {/* Checklist */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Checklist de Documentos</h3>
            <div className="space-y-3">
              {analysis.checklist.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="text-sm text-slate-700">{item.document}</span>
                  {getStatusIcon(item.status)}
                </div>
              ))}
            </div>
          </section>

          {/* Payment Conditions */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-emerald-500" />
              Pagamento
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Prazo:</span>
                <span className="font-medium text-slate-900">{analysis.paymentConditions.deadline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Garantia:</span>
                <span className="font-medium text-slate-900">{analysis.paymentConditions.contractGuarantee}</span>
              </div>
              <div className="pt-2 border-t border-slate-50">
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Retenções</p>
                <p className="text-slate-700">{analysis.paymentConditions.retentions}</p>
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-emerald-500" />
              Local de Entrega
            </h3>
            <div className="text-sm space-y-2">
              <p className="font-medium text-slate-900">{analysis.location.address}</p>
              <p className="text-slate-500">{analysis.location.city}, {analysis.location.state}</p>
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Ponto de Entrega</p>
                <p className="text-slate-700">{analysis.location.deliveryPoint}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
