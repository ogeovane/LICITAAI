import React from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { BidAnalysis } from './types';

import { FileText, LayoutDashboard, Upload, History as HistoryIcon } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadEdital from './components/UploadEdital';
import AnalysisView from './components/AnalysisView';
import History from './components/History';
import Auth from './components/Auth';

export default function App() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [analyses, setAnalyses] = React.useState<BidAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = React.useState<BidAnalysis | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (!user) {
      setAnalyses([]);
      return;
    }

    const q = query(
      collection(db, 'analyses'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as BidAnalysis[];
      setAnalyses(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = () => signOut(auth);

  const handleAnalysisComplete = (analysis: BidAnalysis) => {
    setSelectedAnalysis(analysis);
    setActiveTab('analysis');
  };

  const handleSelectAnalysis = (analysis: BidAnalysis) => {
    setSelectedAnalysis(analysis);
    setActiveTab('analysis');
  };

  const handleDeleteAnalysis = (id: string) => {
    setAnalyses(prev => prev.filter(a => a.id !== id));
    if (selectedAnalysis?.id === id) {
      setSelectedAnalysis(null);
      setActiveTab('dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Carregando LicitaAI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        userEmail={user.email}
      />

      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="py-8">
          {activeTab === 'dashboard' && (
            <Dashboard 
              analyses={analyses} 
              onSelectAnalysis={handleSelectAnalysis}
              onNewUpload={() => setActiveTab('upload')}
            />
          )}
          
          {activeTab === 'upload' && (
            <UploadEdital onAnalysisComplete={handleAnalysisComplete} />
          )}

          {activeTab === 'analysis' && selectedAnalysis && (
            <AnalysisView analysis={selectedAnalysis} />
          )}

          {activeTab === 'analysis' && !selectedAnalysis && (
            <div className="max-w-4xl mx-auto p-12 text-center">
              <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Nenhuma análise selecionada</h3>
              <p className="text-slate-500 mt-2">Selecione uma análise no histórico ou envie um novo edital.</p>
              <button 
                onClick={() => setActiveTab('upload')}
                className="mt-6 bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Enviar Edital
              </button>
            </div>
          )}

          {activeTab === 'history' && (
            <History 
              analyses={analyses} 
              onSelectAnalysis={handleSelectAnalysis}
              onDelete={handleDeleteAnalysis}
            />
          )}

          {/* Placeholder for other tabs */}
          {['deadlines', 'risks', 'checklist', 'search'].includes(activeTab) && selectedAnalysis && (
            <AnalysisView analysis={selectedAnalysis} />
          )}
          
          {['deadlines', 'risks', 'checklist', 'search'].includes(activeTab) && !selectedAnalysis && (
            <div className="max-w-4xl mx-auto p-12 text-center">
              <p className="text-slate-500">Selecione um edital para ver os detalhes de {activeTab}.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
