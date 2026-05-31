import React, { useState } from 'react';
import { Costume, Transaction } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Search, PlusCircle, Trash2, CheckCircle2, User, Phone, DollarSign, Clock, HelpCircle, ArrowRightLeft, Sparkles, Filter } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  costumes: Costume[];
  onAddTransaction: (transaction: Transaction) => Promise<boolean>;
  onReturnRental: (transactionId: string) => Promise<boolean>;
  onDeleteTransaction: (id: string) => Promise<boolean>;
  preselectedCostumeId?: string;
  preselectedType?: 'rental' | 'sale';
  onClearPreselected: () => void;
}

export default function TransactionList({
  transactions,
  costumes,
  onAddTransaction,
  onReturnRental,
  onDeleteTransaction,
  preselectedCostumeId,
  preselectedType,
  onClearPreselected
}: TransactionListProps) {
  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'rental' | 'sale'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'overdue'>('all');

  // Modal registration toggle
  const [isModalOpen, setIsModalOpen] = useState(preselectedCostumeId !== undefined);
  
  // Registration Form state
  const [formCostumeId, setFormCostumeId] = useState(preselectedCostumeId || '');
  const [formType, setFormType] = useState<'rental' | 'sale'>(preselectedType || 'rental');
  const [formCustomerName, setFormCustomerName] = useState('');
  const [formCustomerPhone, setFormCustomerPhone] = useState('');
  const [formRentalDays, setFormRentalDays] = useState<number>(3);
  
  // Filtered costumes that are currently in-stock or available
  const availableCostumesForAction = costumes.filter(c => c.stock > 0 && c.status !== 'maintenance');

  // Chosen costumed detailed metadata
  const selectedCostume = costumes.find(c => c.id === formCostumeId);

  // Auto-calculate billing value
  const calculateTotalValue = (): number => {
    if (!selectedCostume) return 0;
    if (formType === 'sale') {
      return selectedCostume.price_sale || 0;
    } else {
      return (selectedCostume.price_rental || 0) * formRentalDays;
    }
  };

  const handleCostumeChange = (id: string) => {
    setFormCostumeId(id);
    const costume = costumes.find(c => c.id === id);
    if (costume) {
      if (costume.type === 'sale') {
        setFormType('sale');
      } else if (costume.type === 'rental') {
        setFormType('rental');
      }
    }
  };

  // Submit transaction register
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCostumeId) {
      alert("Por favor, selecione uma fantasia retrô.");
      return;
    }
    if (!formCustomerName.trim() || !formCustomerPhone.trim()) {
      alert("Favor preencher os dados de contato do cliente.");
      return;
    }

    const calculatedValue = calculateTotalValue();
    const transDate = new Date();
    let computedDueDate = null;

    if (formType === 'rental') {
      const due = new Date();
      due.setDate(due.getDate() + formRentalDays);
      computedDueDate = due.toISOString();
    }

    const newTrans: Transaction = {
      id: crypto.randomUUID(),
      costume_id: formCostumeId,
      costume_name: selectedCostume?.name || 'Fantasia Retrô',
      type: formType,
      customer_name: formCustomerName,
      customer_phone: formCustomerPhone,
      transaction_date: transDate.toISOString(),
      due_date: computedDueDate,
      return_date: null,
      total_value: calculatedValue,
      status: formType === 'rental' ? 'active' : 'completed'
    };

    const res = await onAddTransaction(newTrans);
    if (res) {
      // Clear forms and close
      clearForm();
      setIsModalOpen(false);
      onClearPreselected();
    } else {
      alert("Erro ao registrar a transação. Verifique se as tabelas foram criadas no Supabase.");
    }
  };

  const clearForm = () => {
    setFormCostumeId('');
    setFormType('rental');
    setFormCustomerName('');
    setFormCustomerPhone('');
    setFormRentalDays(3);
  };

  const handeOpenModal = () => {
    clearForm();
    setIsModalOpen(true);
  };

  const handleReturn = async (id: string) => {
    if (confirm("Deseja confirmar o recebimento e devolução desta fantasia para o estoque ativo?")) {
      await onReturnRental(id);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Excluir esta transação? Atenção: isso não reverte alterações de estoque automáticas.")) {
      await onDeleteTransaction(id);
    }
  };

  // Filter lists
  const filteredList = transactions.filter(t => {
    const matchesSearch = t.customer_name.toLowerCase().includes(search.toLowerCase()) ||
                          t.customer_phone.includes(search) ||
                          (t.costume_name && t.costume_name.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Upper header action list */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
            Registro de Vendas e Aluguéis
          </h2>
          <p className="text-zinc-500 text-sm">
            Monitore contratos retro ativos, devoluções, faturamento e fluxo de estoque
          </p>
        </div>

        <button 
          onClick={handeOpenModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black text-sm tracking-wide uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_22px_rgba(6,182,212,0.6)] cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" /> Registrar Venda / Aluguel
        </button>
      </div>

      {/* Retro Filters Rack */}
      <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl flex flex-col gap-4">
        
        {/* Row 1: Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por cliente, telefone ou nome da fantasia..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500/50 rounded-lg py-2.5 pl-11 pr-4 text-xs text-white placeholder-zinc-500 outline-none transition-all"
          />
        </div>

        {/* Row 2: Select tags */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          
          {/* Modal filter type */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Tipo de Negócio</span>
            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-805 gap-1">
              {(['all', 'rental', 'sale'] as const).map(op => (
                <button
                  key={op}
                  onClick={() => setTypeFilter(op)}
                  className={`flex-1 py-1 text-[10px] font-bold uppercase rounded cursor-pointer transition-all ${
                    typeFilter === op ? 'bg-cyan-500 text-zinc-950' : 'text-zinc-400'
                  }`}
                >
                  {op === 'all' ? 'Ver Tudo' : op === 'rental' ? 'Aluguéis' : 'Vendas'}
                </button>
              ))}
            </div>
          </div>

          {/* Status filter */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Estado Contratual</span>
            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-805 gap-1">
              {(['all', 'active', 'completed', 'overdue'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`flex-1 py-1 text-[10px] font-bold uppercase rounded cursor-pointer transition-all ${
                    statusFilter === st ? 'bg-pink-500 text-white' : 'text-zinc-400'
                  }`}
                >
                  {st === 'all' ? 'Todos' : st === 'active' ? 'Ativo' : st === 'completed' ? 'Pagas' : 'Atrasado'}
                </button>
              ))}
            </div>
          </div>

          {/* Clear query */}
          <div className="flex flex-col justify-end">
            <button 
              onClick={() => {
                setSearch('');
                setTypeFilter('all');
                setStatusFilter('all');
              }}
              className="border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-xs font-bold font-mono py-2 text-zinc-300 rounded-lg cursor-pointer"
            >
              🔄 ZERAR FILTROS DE HISTÓRICO
            </button>
          </div>

        </div>

      </div>

      {/* Transaction Records List */}
      {filteredList.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/10 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center">
          <ArrowRightLeft className="w-12 h-12 text-zinc-600 mb-3 animate-pulse" />
          <h3 className="font-bold text-lg text-white font-mono uppercase tracking-widest">Nenhuma transação</h3>
          <p className="text-zinc-500 text-sm max-w-sm mt-1">
            Nenhuma venda ou aluguel corresponde aos critérios. Crie uma nova transação agora mesmo!
          </p>
        </div>
      ) : (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-zinc-800 border-collapse">
              <thead>
                <tr className="bg-zinc-950 text-zinc-400 font-mono tracking-wider uppercase">
                  <th className="py-3.5 px-4 font-bold">Cliente</th>
                  <th className="py-3.5 px-4 font-bold">Item Escolhido</th>
                  <th className="py-3.5 px-4 font-bold">Operação</th>
                  <th className="py-3.5 px-4 font-bold">Datas (Ciclo)</th>
                  <th className="py-3.5 px-4 font-bold text-right">Valor Total</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40 text-zinc-300 font-sans">
                {filteredList.map(item => {
                  const formattedDate = new Date(item.transaction_date).toLocaleDateString('pt-BR');
                  const formattedDueDate = item.due_date ? new Date(item.due_date).toLocaleDateString('pt-BR') : '-';
                  const formattedReturnDate = item.return_date ? new Date(item.return_date).toLocaleDateString('pt-BR') : '-';

                  return (
                    <tr key={item.id} className="hover:bg-zinc-800/15">
                      {/* Customer contact card */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-zinc-830 bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-700/50">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">{item.customer_name}</div>
                            <div className="text-[10px] text-zinc-500 flex items-center gap-1 font-mono">
                              <Phone className="w-2.5 h-2.5" /> {item.customer_phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Decoded item */}
                      <td className="py-4 px-4 font-semibold text-zinc-100 max-w-xs truncate">
                        {item.costume_name || 'Desconhecida'}
                      </td>

                      {/* Sale/Rental logic badge */}
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase font-mono ${
                          item.type === 'rental' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                        }`}>
                          {item.type === 'rental' ? 'Aluguel' : 'Venda'}
                        </span>
                      </td>

                      {/* Timestamps */}
                      <td className="py-4 px-4 text-[11px] space-y-0.5 font-mono">
                        <div>Registro: <span className="text-zinc-400">{formattedDate}</span></div>
                        {item.type === 'rental' && (
                          <>
                            <div>Vencimento: <span className="text-white font-semibold">{formattedDueDate}</span></div>
                            {item.return_date && <div>Devolvido: <span className="text-green-400">{formattedReturnDate}</span></div>}
                          </>
                        )}
                      </td>

                      {/* Cost */}
                      <td className="py-4 px-4 text-right font-mono font-bold text-white text-xs">
                        R$ {item.total_value}
                      </td>

                      {/* Progress status indicators */}
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase inline-flex items-center gap-1 ${
                          item.status === 'completed' ? 'bg-green-500/15 text-green-400 border border-green-500/30' :
                          item.status === 'active' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' :
                          'bg-red-500/15 text-red-500 border border-red-500/40 animate-pulse'
                        }`}>
                          {item.status === 'completed' ? 'Concluído' : item.status === 'active' ? 'Em aberto' : 'Atrasado ⚠️'}
                        </span>
                      </td>

                      {/* Primary triggers return and delete */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {item.type === 'rental' && item.status !== 'completed' && (
                            <button
                              onClick={() => handleReturn(item.id)}
                              className="px-2 py-1 bg-green-600 hover:bg-green-550 hover:bg-green-500 text-white font-bold text-[10px] uppercase rounded flex items-center gap-1 transition-all cursor-pointer shadow shadow-green-950"
                              title="Registrar devolução e liberar estoque"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Devolver
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 px-2 border border-zinc-800 hover:border-red-500/30 text-zinc-550 hover:text-red-400 rounded transition-all cursor-pointer"
                            title="Remover registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Register Sale & Rental Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-zinc-100"
            >
              <div className="bg-gradient-to-r from-cyan-900 to-indigo-950 p-5 border-b border-cyan-500/20 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white font-mono">
                    📼 REGISTRAR NOVA OP. RETRÔ
                  </h3>
                  <p className="text-xs text-cyan-200">
                    Registre dados do cliente e faturamento do aluguel ou venda.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    onClearPreselected();
                  }}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors text-white font-bold cursor-pointer text-sm font-mono"
                >
                  [fechar]
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                
                {/* Costume select */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-300">Escolha a Fantasia *</label>
                  <select
                    value={formCostumeId}
                    onChange={(e) => handleCostumeChange(e.target.value)}
                    required
                    className="bg-zinc-950 border border-zinc-800 p-2 text-xs text-white rounded-lg outline-none"
                  >
                    <option value="">Selecione uma fantasia disponível...</option>
                    {availableCostumesForAction.map(c => (
                      <option key={c.id} value={c.id}>
                        [{c.decade}] {c.name} (Tamanho {c.size} - R$ {c.price_rental || 'X'}/alugar - R$ {c.price_sale || 'X'}/comprar)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Operations format switcher */}
                {selectedCostume && (
                  <div className="flex flex-col gap-1.5 bg-zinc-950 p-3 rounded-lg border border-zinc-850">
                    <label className="text-xs font-bold text-zinc-400">Modalidade de Operação</label>
                    <div className="flex gap-2 pt-1 font-mono">
                      {selectedCostume.type !== 'sale' && (
                        <button
                          type="button"
                          onClick={() => setFormType('rental')}
                          className={`flex-1 py-1.5 text-xs font-extrabold rounded cursor-pointer transition-all border ${
                            formType === 'rental' ? 'bg-cyan-500 border-cyan-400 text-zinc-950' : 'bg-transparent border-zinc-800 text-zinc-400'
                          }`}
                        >
                          ALUGUEL RETRÔ
                        </button>
                      )}
                      {selectedCostume.type !== 'rental' && (
                        <button
                          type="button"
                          onClick={() => setFormType('sale')}
                          className={`flex-1 py-1.5 text-xs font-extrabold rounded cursor-pointer transition-all border ${
                            formType === 'sale' ? 'bg-pink-500 border-pink-400 text-white' : 'bg-transparent border-zinc-800 text-zinc-400'
                          }`}
                        >
                          VENDA DIRETA
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Client contacts */}
                <div className="grid grid-cols-1 gap-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-zinc-300">Nome Completo do Cliente *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Amanda Silva Castro" 
                      value={formCustomerName}
                      onChange={(e) => setFormCustomerName(e.target.value)}
                      required
                      className="bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-white placeholder-zinc-600 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-zinc-300">Telefone de Contato (WhatsApp) *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: (11) 99999-8888" 
                      value={formCustomerPhone}
                      onChange={(e) => setFormCustomerPhone(e.target.value)}
                      required
                      className="bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-white placeholder-zinc-650 outline-none"
                    />
                  </div>
                </div>

                {/* Rental duration selectors */}
                {formType === 'rental' && selectedCostume && (
                  <div className="flex flex-col gap-1.5 bg-zinc-950 p-3 rounded-lg border border-zinc-850">
                    <label className="text-xs font-bold text-zinc-400">Tempo de Permanência Aluguel</label>
                    <div className="flex gap-2">
                      {[1, 3, 7, 15].map(days => (
                        <button
                          type="button"
                          key={days}
                          onClick={() => setFormRentalDays(days)}
                          className={`flex-1 py-1 text-xs font-bold rounded cursor-pointer transition-colors ${
                            formRentalDays === days ? 'bg-cyan-500 text-zinc-900 font-extrabold' : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800'
                          }`}
                        >
                          {days} {days === 1 ? 'Dia' : 'Dias'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Calculations summary */}
                {selectedCostume ? (
                  <div className="bg-zinc-950 border-2 border-dashed border-zinc-800 p-3 rounded-xl flex items-center justify-between text-xs font-mono">
                    <div className="space-y-0.5">
                      <span className="text-zinc-500 uppercase block text-[9px]">Resumo de Cobrança</span>
                      <span className="text-zinc-300 font-bold">{selectedCostume.name}</span>
                      {formType === 'rental' && <span className="text-zinc-500 block">Aluguel contratado por {formRentalDays} dias</span>}
                    </div>
                    <div className="text-right">
                      <span className="text-zinc-500 uppercase block text-[9px]">Valor Total</span>
                      <span className="text-lg font-black text-white">R$ {calculateTotalValue()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-zinc-600 font-mono">Preencha os campos para ver o preço...</div>
                )}

                {/* Confirm actions */}
                <div className="flex items-center justify-end gap-3 pt-3.5 border-t border-zinc-800/60 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      onClearPreselected();
                    }}
                    className="px-4 py-2 font-bold text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-lg cursor-pointer"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 font-black text-zinc-950 bg-cyan-500 border border-cyan-400 rounded-lg cursor-pointer hover:bg-cyan-400 font-sans uppercase"
                  >
                    SALVAR CONTRATO ⚡
                  </button>
                </div>

              </form>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
