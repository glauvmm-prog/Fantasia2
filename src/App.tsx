import React, { useState, useEffect } from 'react';
import { Costume, Transaction } from './types';
import { 
  getCostumes, 
  getTransactions, 
  saveCostume, 
  deleteCostume, 
  saveTransaction, 
  returnRental, 
  deleteTransaction,
  getSupabaseConfig
} from './lib/db';

import Dashboard from './components/Dashboard';
import CostumeList from './components/CostumeList';
import TransactionList from './components/TransactionList';

import { 
  Tv, 
  Film, 
  Disc, 
  BarChart3, 
  Grid3X3, 
  ArrowRightLeft, 
  Sparkles,
  Wifi,
  WifiOff,
  Flame,
  Radio
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Costume state
  const [costumes, setCostumes] = useState<Costume[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isSupabaseActive, setIsSupabaseActive] = useState<boolean>(false);
  const [dbError, setDbError] = useState<string | null>(null);
  
  // Trigger loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Preselected costumes from main list -> transaction log flow
  const [preselectedCostumeId, setPreselectedCostumeId] = useState<string | undefined>(undefined);
  const [preselectedType, setPreselectedType] = useState<'rental' | 'sale' | undefined>(undefined);

  // Load database entities
  const loadDatabase = async () => {
    setIsLoading(true);
    setDbError(null);
    try {
      // 1. Fetch costumes
      const costumeRes = await getCostumes();
      setCostumes(costumeRes.data);
      setIsSupabaseActive(costumeRes.isSupabase);
      
      if (costumeRes.error) {
        setDbError(costumeRes.error);
      }

      // 2. Fetch transactions
      const transactionRes = await getTransactions();
      setTransactions(transactionRes.data);
      
    } catch (err: any) {
      console.error("Erro fatal ao sincronizar banco:", err);
      setDbError("Ocorreu um erro ao carregar os dados. Tentando rodar em modo local offline.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  // --- ACTIONS HANDLERS ---

  const handleAddCostume = async (costume: Costume): Promise<boolean> => {
    const res = await saveCostume(costume);
    if (res.success) {
      await loadDatabase();
      return true;
    }
    return false;
  };

  const handleEditCostume = async (costume: Costume): Promise<boolean> => {
    const res = await saveCostume(costume);
    if (res.success) {
      await loadDatabase();
      return true;
    }
    return false;
  };

  const handleDeleteCostume = async (id: string): Promise<boolean> => {
    const res = await deleteCostume(id);
    if (res.success) {
      await loadDatabase();
      return true;
    }
    return false;
  };

  const handleAddTransaction = async (transaction: Transaction): Promise<boolean> => {
    const res = await saveTransaction(transaction);
    if (res.success) {
      await loadDatabase();
      return true;
    }
    return false;
  };

  const handleReturnRental = async (transactionId: string): Promise<boolean> => {
    const res = await returnRental(transactionId, new Date().toISOString());
    if (res.success) {
      await loadDatabase();
      return true;
    }
    return false;
  };

  const handleDeleteTransaction = async (id: string): Promise<boolean> => {
    const res = await deleteTransaction(id);
    if (res.success) {
      await loadDatabase();
      return true;
    }
    return false;
  };

  const handleSelectCostumeAction = (id: string, type: 'rental' | 'sale') => {
    setPreselectedCostumeId(id);
    setPreselectedType(type);
    setActiveTab('transacoes');
  };

  const handleClearPreselected = () => {
    setPreselectedCostumeId(undefined);
    setPreselectedType(undefined);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans antialiased text-sm">
      
      {/* 80s Cyber Topbar Decorative VHS Artifact lines */}
      <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 w-full"></div>

      {/* Retro VHS Interlaced mesh background lines */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-50 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0.5px,transparent_0.5px)] bg-[size:16px_16px]"></div>

      {/* Application Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-40 backdrop-blur-md opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 p-0.5 shadow-[0_0_12px_rgba(219,39,119,0.4)] flex items-center justify-center">
              <div className="h-full w-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Disc className="w-6 h-6 text-pink-500 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-xl font-black uppercase tracking-tighter text-white font-mono">RETRO</span>
                <span className="text-xl font-black uppercase tracking-tighter text-pink-500 font-mono">RENT</span>
              </div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Fantasias Anos 80 & 90</p>
            </div>
          </div>

          {/* Tab Navigation links */}
          <nav className="flex items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-850">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-zinc-900 text-pink-400 border border-zinc-800' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Painel
            </button>

            <button
              onClick={() => setActiveTab('fantasias')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'fantasias' ? 'bg-zinc-900 text-pink-450 text-pink-400 border border-zinc-800' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-4 h-4" /> Catálogo
            </button>

            <button
              onClick={() => setActiveTab('transacoes')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                activeTab === 'transacoes' ? 'bg-zinc-900 text-cyan-400 border border-zinc-800' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" /> Caixa / Op
            </button>
          </nav>



        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {dbError && (
          <div className="bg-red-500/15 border border-red-500/30 p-4 rounded-xl text-xs text-red-200 mb-6 flex items-start gap-3 justify-between">
            <div className="leading-relaxed font-mono">
              <span className="font-bold block text-red-400 uppercase mb-0.5">⚠️ ALERTA DE COORDENAÇÃO DE BANCO DE DADOS:</span>
              {dbError}
            </div>
            <button 
              onClick={() => setDbError(null)}
              className="text-[10px] text-zinc-500 hover:text-white uppercase font-bold tracking-wider underline shrink-0 cursor-pointer"
            >
              [Dispensar]
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
            <Radio className="w-12 h-12 text-pink-500 animate-pulse" />
            <h3 className="font-extrabold font-mono text-zinc-300 uppercase tracking-widest text-sm">Carregando fitas VHS e banco...</h3>
            <p className="text-zinc-500 text-xs text-center max-w-xs">Sincronizando banco de dados com a configuração vigente...</p>
          </div>
        ) : (
          <div>
            {activeTab === 'dashboard' && (
              <Dashboard 
                costumes={costumes} 
                transactions={transactions} 
                onNavigate={setActiveTab}
                onReturnRental={handleReturnRental}
              />
            )}

            {activeTab === 'fantasias' && (
              <CostumeList 
                costumes={costumes} 
                onAddCostume={handleAddCostume}
                onEditCostume={handleEditCostume}
                onDeleteCostume={handleDeleteCostume}
                onSelectAction={handleSelectCostumeAction}
              />
            )}

            {activeTab === 'transacoes' && (
              <TransactionList 
                transactions={transactions}
                costumes={costumes}
                onAddTransaction={handleAddTransaction}
                onReturnRental={handleReturnRental}
                onDeleteTransaction={handleDeleteTransaction}
                preselectedCostumeId={preselectedCostumeId}
                preselectedType={preselectedType}
                onClearPreselected={handleClearPreselected}
              />
            )}
          </div>
        )}
      </main>

      {/* Cyberpunk retro layout footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 space-y-3.5">
          <div className="flex items-center justify-center gap-1.5 font-mono">
            <Flame className="w-3.5 h-3.5 text-pink-500" />
            <span className="text-zinc-400 font-bold">RETRO RENT SYSTEM v1.89</span>
            <span>•</span>
            <span>Estilo Retro 80s 90s</span>
          </div>
          <p className="max-w-lg mx-auto text-[11px] leading-relaxed text-zinc-650 text-zinc-500">
            Este software foi gerado sob os mais altos padrões de design retrowave. Suporta arquivamento em localStorage do navegador e é 100% pronto para conectar ao Supabase e fazer deploy de 1-clique na Vercel!
          </p>
          <p className="text-[10px] text-zinc-605">
            © 2026 RetroRent Inc. Todos os direitos reservados.
          </p>
        </div>
      </footer>

    </div>
  );
}
