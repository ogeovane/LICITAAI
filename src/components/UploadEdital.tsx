import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Loader2, AlertCircle, CheckSquare } from 'lucide-react';
import { extractTextFromFile } from '../utils/textExtraction';
import { analyzeBidDocument } from '../services/gemini';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { BidAnalysis } from '../types';

interface UploadEditalProps {
  onAnalysisComplete: (analysis: BidAnalysis) => void;
}

export default function UploadEdital({ onAnalysisComplete }: UploadEditalProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState('');

  const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setProgress('Extraindo texto do documento...');

    try {
      const text = await extractTextFromFile(file);
      
      setProgress('Analisando com Inteligência Artificial...');
      const analysisData = await analyzeBidDocument(text);

      const fullAnalysis: BidAnalysis = {
        ...analysisData as any,
        id: crypto.randomUUID(),
        userId: auth.currentUser?.uid || 'anonymous',
        fileName: file.name,
        createdAt: new Date().toISOString(),
      };

      setProgress('Salvando no histórico...');
      await addDoc(collection(db, 'analyses'), fullAnalysis);

      onAnalysisComplete(fullAnalysis);
    } catch (err: any) {
      console.error(err);
      setError('Erro ao processar o edital. Verifique o arquivo e tente novamente.');
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  }, [onAnalysisComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: false,
    disabled: isProcessing
  } as any);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Enviar Novo Edital</h2>
        <p className="text-slate-500 mt-2">Arraste seu arquivo PDF ou DOCX para começar a análise inteligente.</p>
      </div>

      <div 
        {...getRootProps()} 
        className={`
          relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer
          ${isDragActive ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-400 hover:bg-slate-50'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {isProcessing ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
            <p className="text-lg font-medium text-slate-700">{progress}</p>
            <p className="text-sm text-slate-500 mt-2">Isso pode levar até 1 minuto para editais grandes.</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <Upload size={32} />
            </div>
            <p className="text-lg font-medium text-slate-900">
              {isDragActive ? 'Solte o arquivo aqui' : 'Arraste ou clique para selecionar'}
            </p>
            <p className="text-sm text-slate-500 mt-2">PDF, DOCX ou TXT (Máx. 10MB)</p>
          </>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start text-red-700">
          <AlertCircle className="mr-3 shrink-0" size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
            <File size={20} />
          </div>
          <h3 className="font-semibold text-slate-900">Análise Completa</h3>
          <p className="text-sm text-slate-500 mt-1">Extraímos órgãos, datas, valores e objetos automaticamente.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4">
            <AlertCircle size={20} />
          </div>
          <h3 className="font-semibold text-slate-900">Detecção de Riscos</h3>
          <p className="text-sm text-slate-500 mt-1">Identificamos cláusulas que podem desclassificar sua empresa.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
            <CheckSquare size={20} />
          </div>
          <h3 className="font-semibold text-slate-900">Checklist de Docs</h3>
          <p className="text-sm text-slate-500 mt-1">Lista automática de certidões e atestados exigidos.</p>
        </div>
      </div>
    </div>
  );
}
