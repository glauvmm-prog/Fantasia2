import React from 'react';
import { Costume, Transaction } from '../types';
import { motion } from 'motion/react';
import { DollarSign, ShieldAlert, Sparkles, ShoppingBag, CalendarRange, Clock } from 'lucide-react';

interface DashboardProps {
  costumes: Costume[];
  transactions: Transaction[];
  onNavigate: (tab: string) => void;
  onReturnRental: (transactionId: string) => void;
}

export default function Dashboard({ costumes, transactions, onNavigate, onReturnRental }: DashboardProps) {
  // Calculations
  const totalRevenue = transactions.reduce((acc, curr) => acc + curr.total_value, 0);
  
  const activeRentals = transactions.filter(t => t.type === 'rental' && t.status === 'active');
  const overdueRentals = transactions.filter(t => t.type === 'rental' && t.status === 'overdue');
  const completedTransactions = transactions.filter(t => t.status === 'completed');

  const totalSalesCount = transactions.filter(t => t.type === 'sale').length;
  const totalRentalsCount = transactions.filter(t => t.type === 'rental').length;

  // Revenue split
  const rentalRevenue = transactions
    .filter(t => t.type === 'rental')
    .reduce((acc, curr) => acc + curr.total_value, 0);
  const saleRevenue = transactions
    .filter(t => t.type === 'sale')
    .reduce((acc, curr) => acc + curr.total_value, 0);

  // Decade breakdown
  const costumes80sCount = costumes.filter(c => c.decade === '80s').length;
  const costumes90sCount = costumes.filter(c => c.decade === '90s').length;

  // Category breakdown
  const categoryCounts: Record<string, number> = {};
  costumes.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  // Overdue warnings
  const handleConfirmReturn = (id: string) => {
    if (confirm("Confirmar a devolução desta fantasia para o estoque disponível?")) {
      onReturnRental(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Retrowave Welcome Header */}
      <div className="relative rounded-2xl bg-gradient-to-r from-purple-900 via-pink-900 to-indigo-950 p-6 md:p-8 overflow-hidden shadow-2xl border border-pink-500/30">
        <div className="absolute right-0 top-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        {/* Decorative Grid Mesh */}
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: 'linear-gradient(rgba(255, 0, 127, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 127, 0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}></div>

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Radar Retrô ativo • Anos 80 & 90
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(255,0,127,0.5)]">
            Painel Geral <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400 font-mono">RETROWAVE</span>
          </h1>
          <p className="max-w-xl text-purple-200 text-sm md:text-base leading-relaxed">
            Monitore seu faturamento retrô, acompanhe devoluções de aluguel e gerencie fantasias lendárias com estilo synthwave e alto desempenho.
          </p>
        </div>
      </div>

      {/* Modern Retro Stat Widget Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Box 1: Receita Total */}
        <motion.div 
          className="bg-zinc-900/80 backdrop-blur border border-pink-500/20 hover:border-pink-500/50 p-5 rounded-xl flex items-center justify-between shadow-lg transition-all"
          whileHover={{ y: -4 }}
        >
          <div className="space-y-1">
            <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Faturamento Total</span>
            <div className="text-2xl font-black text-white font-mono tracking-tight drop-shadow-[0_2px_6px_rgba(236,72,153,0.3)]">
              R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-zinc-500">
              Vendas e Aluguéis combinados
            </div>
          </div>
          <div className="h-12 w-12 rounded-lg bg-pink-500/15 flex items-center justify-center border border-pink-500/30 text-pink-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Box 2: Aluguéis Ativos */}
        <motion.div 
          className="bg-zinc-900/80 backdrop-blur border border-cyan-500/20 hover:border-cyan-500/50 p-5 rounded-xl flex items-center justify-between shadow-lg transition-all"
          whileHover={{ y: -4 }}
        >
          <div className="space-y-1">
            <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Aluguéis Ativos</span>
            <div className="text-2xl font-black text-white font-mono tracking-tight drop-shadow-[0_2px_6px_rgba(6,182,212,0.3)]">
              {activeRentals.length}
            </div>
            <div className="text-[11px] text-cyan-400/85 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3" /> fantasias em circulação
            </div>
          </div>
          <div className="h-12 w-12 rounded-lg bg-cyan-500/15 flex items-center justify-center border border-cyan-500/30 text-cyan-405">
            <CalendarRange className="w-6 h-6 text-cyan-400" />
          </div>
        </motion.div>

        {/* Box 3: Aluguéis Atrasados */}
        <motion.div 
          className="bg-zinc-900/80 backdrop-blur border border-red-500/20 hover:border-red-500/50 p-5 rounded-xl flex items-center justify-between shadow-lg transition-all"
          whileHover={{ y: -4 }}
        >
          <div className="space-y-1">
            <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Atrasos Críticos</span>
            <div className={`text-2xl font-black font-mono tracking-tight ${overdueRentals.length > 0 ? 'text-red-500 animate-pulse drop-shadow-[0_2px_8px_rgba(239,68,68,0.5)]' : 'text-white'}`}>
              {overdueRentals.length}
            </div>
            <div className="text-[11px] text-red-400 flex items-center gap-1">
              {overdueRentals.length > 0 ? '⚠️ Requer contato imediato!' : 'Nenhum atraso registrado'}
            </div>
          </div>
          <div className={`h-12 w-12 rounded-lg flex items-center justify-center border ${overdueRentals.length > 0 ? 'bg-red-500/20 border-red-500/40 text-red-500' : 'bg-zinc-800/85 border-zinc-700 text-zinc-500'}`}>
            <ShieldAlert className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Box 4: Total de Itens */}
        <motion.div 
          className="bg-zinc-900/80 backdrop-blur border border-purple-500/20 hover:border-purple-500/50 p-5 rounded-xl flex items-center justify-between shadow-lg transition-all"
          whileHover={{ y: -4 }}
        >
          <div className="space-y-1">
            <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Fantasias Cadastradas</span>
            <div className="text-2xl font-black text-white font-mono tracking-tight drop-shadow-[0_2px_6px_rgba(168,85,247,0.3)]">
              {costumes.length}
            </div>
            <div className="text-[11px] text-zinc-500">
              {costumes80sCount} de 80s • {costumes90sCount} de 90s
            </div>
          </div>
          <div className="h-12 w-12 rounded-lg bg-purple-500/15 flex items-center justify-center border border-purple-500/30 text-purple-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </motion.div>
      </div>

      {/* Overdue Warning Container */}
      {overdueRentals.length > 0 && (
        <div id="overdue-alerts" className="border-2 border-dashed border-red-500 bg-red-500/10 p-5 rounded-xl text-red-200">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-5 h-5 text-red-500 animate-bounce" />
            <h2 className="font-bold text-red-400 uppercase tracking-widest text-sm">Alerta de Devolução em Atraso</h2>
          </div>
          <div className="divide-y divide-red-500/20">
            {overdueRentals.map(item => {
              const formattedDueDate = item.due_date ? new Date(item.due_date).toLocaleDateString('pt-BR') : 'N/A';
              return (
                <div key={item.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                  <div>
                    <span className="font-semibold text-white">{item.customer_name}</span> - {item.customer_phone} 
                    <p className="text-xs text-red-300">Fantasia: <span className="underline">{item.costume_name}</span> • Venceu em {formattedDueDate}</p>
                  </div>
                  <button 
                    onClick={() => handleConfirmReturn(item.id)}
                    className="self-start sm:self-center px-3 py-1 text-xs font-bold uppercase rounded bg-red-600 hover:bg-red-500 text-white transition-colors"
                  >
                    Registrar Devolução
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Retro Neon Billing Split & Info (D3 Style SVG Bar Chart) */}
        <div className="lg:col-span-8 bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-semibold text-white tracking-wide uppercase text-xs text-zinc-400">Desempenho de Categoria / Década</h3>
            <p className="text-zinc-500 text-xs">Distribuição do estoque de fantasias vintage cadastradas</p>
          </div>

          {/* Graphical Representation */}
          <div className="h-64 flex items-end gap-4 pb-4 px-2 border-b border-zinc-800">
            {Object.keys(categoryCounts).length === 0 ? (
              <div className="w-full text-center py-10 text-zinc-600 font-mono text-sm uppercase">Nenhuma categoria cadastrada...</div>
            ) : (
              Object.entries(categoryCounts).map(([cat, count]) => {
                const max = Math.max(...Object.values(categoryCounts));
                const percent = (count / max) * 100;
                return (
                  <div key={cat} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <span className="text-[10px] text-zinc-500 invisible group-hover:visible font-mono font-bold bg-zinc-800 px-1 rounded">{count}</span>
                    <div 
                      className="w-full rounded-t bg-gradient-to-t from-purple-600 via-pink-400 to-cyan-400 transition-all duration-1000 shadow-[0_0_12px_rgba(236,72,153,0.3)] hover:brightness-125"
                      style={{ height: `${percent * 0.8}%` }}
                    ></div>
                    <span className="text-[10px] font-mono text-zinc-400 truncate w-full text-center" title={cat}>
                      {cat.split(' ')[0]}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-4 flex flex-wrap gap-4 items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-cyan-400 block shadow-[0_0_8px_#22d3ee]"></span>
                <span>80s ({costumes80sCount} unidades)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-pink-500 block shadow-[0_0_8px_#ec4899]"></span>
                <span>90s ({costumes90sCount} unidades)</span>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('fantasias')} 
              className="text-pink-400 hover:text-pink-300 font-bold transition-all hover:underline"
            >
              Ver Inventário Completo →
            </button>
          </div>
        </div>

        {/* Financial Distribution Circular Gauge */}
        <div className="lg:col-span-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-white tracking-wide uppercase text-xs text-zinc-400">Divisão de Faturamento</h3>
            <p className="text-zinc-500 text-xs">Aluguéis vs Vendas diretas de fantasias</p>
          </div>

          {/* Circular donut SVG custom styled */}
          <div className="relative flex justify-center items-center my-6">
            <svg width="160" height="160" className="rotate-270">
              <circle 
                cx="80" 
                cy="80" 
                r="65" 
                stroke="#27272a" 
                strokeWidth="15" 
                fill="transparent" 
              />
              {totalRevenue > 0 ? (
                <>
                  {/* Rent Circle */}
                  <circle 
                    cx="80" 
                    cy="80" 
                    r="65" 
                    stroke="#06b6d4" 
                    strokeWidth="15" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 65}
                    strokeDashoffset={2 * Math.PI * 65 * (1 - rentalRevenue / totalRevenue)}
                    style={{ filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.4))' }}
                  />
                  {/* Sale Circle */}
                  <circle 
                    cx="80" 
                    cy="80" 
                    r="65" 
                    stroke="#ec4899" 
                    strokeWidth="15" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 65}
                    strokeDashoffset={2 * Math.PI * 65 * (1 - saleRevenue / totalRevenue)}
                    style={{ 
                      transformOrigin: '80px 80px',
                      transform: `rotate(${(rentalRevenue / totalRevenue) * 360}deg)`,
                      filter: 'drop-shadow(0 0 6px rgba(236,72,153,0.4))'
                    }}
                  />
                </>
              ) : null}
            </svg>

            {/* Total Indicator in Center */}
            <div className="absolute text-center">
              <span className="text-[10px] text-zinc-500 block uppercase font-mono">Arrecadação</span>
              <span className="text-lg font-black text-white font-mono">
                R$ {totalRevenue > 1000 ? `${(totalRevenue / 1000).toFixed(1)}k` : totalRevenue}
              </span>
            </div>
          </div>

          {/* Details / Legend */}
          <div className="space-y-2.5 text-xs text-zinc-300 font-mono">
            <div className="flex items-center justify-between border-b border-zinc-800/50 pb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-cyan-500 rounded border border-cyan-400"></span>
                <span>Aluguéis ({totalRentalsCount})</span>
              </div>
              <span className="text-white">R$ {rentalRevenue}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-pink-500 rounded border border-pink-400"></span>
                <span>Vendas ({totalSalesCount})</span>
              </div>
              <span className="text-white">R$ {saleRevenue}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions and Recent Activity List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Live feed tracking */}
        <div className="lg:col-span-12 bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white tracking-wide uppercase text-xs text-zinc-400">Últimas Transações Registradas</h3>
              <p className="text-zinc-500 text-xs">Registro das últimas vendas ou aluguéis retro de maior relevância</p>
            </div>
            <button 
              onClick={() => onNavigate('transacoes')} 
              className="text-xs text-pink-400 hover:text-pink-300 font-serif font-bold tracking-tight border border-pink-400/25 px-2.5 py-1 rounded hover:bg-pink-400/10 transition-all"
            >
              Ver Tudo
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="py-10 text-center text-zinc-600 font-mono text-sm uppercase">Nenhuma transação ativa. Crie no menu Transações!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-zinc-800 border-collapse">
                <thead>
                  <tr className="text-zinc-400 font-mono tracking-wider uppercase bg-zinc-950/50 px-2 py-3">
                    <th className="py-3 px-4">Cliente</th>
                    <th className="py-3 px-4">Fantasia</th>
                    <th className="py-3 px-4">Tipo</th>
                    <th className="py-3 px-4">Data Registro</th>
                    <th className="py-3 px-4">Valor Total</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                  {transactions.slice(0, 4).map(t => (
                    <tr key={t.id} className="hover:bg-zinc-800/20 font-sans">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{t.customer_name}</div>
                        <div className="text-[10px] text-zinc-500">{t.customer_phone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-zinc-100">{t.costume_name || 'Desconhecida'}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          t.type === 'rental' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'bg-pink-500/15 text-pink-400 border border-pink-500/30'
                        }`}>
                          {t.type === 'rental' ? 'Aluguel' : 'Venda'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">{new Date(t.transaction_date).toLocaleDateString('pt-BR')}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">R$ {t.total_value}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                          t.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                          t.status === 'active' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                          'bg-red-500/10 text-red-500 border border-red-500/30 animate-pulse'
                        }`}>
                          {t.status === 'completed' ? 'Concluído' : t.status === 'active' ? 'Ativo' : 'Atrasado ⚠️'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
