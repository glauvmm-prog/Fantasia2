import React, { useState } from 'react';
import { Costume } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Filter, Edit, Trash2, Tag, Calendar, PlusCircle, CheckCircle, HelpCircle, Package, Dumbbell } from 'lucide-react';

interface CostumeListProps {
  costumes: Costume[];
  onAddCostume: (costume: Costume) => Promise<boolean>;
  onEditCostume: (costume: Costume) => Promise<boolean>;
  onDeleteCostume: (id: string) => Promise<boolean>;
  onSelectAction: (costumeId: string, actionType: 'rental' | 'sale') => void;
}

export default function CostumeList({ costumes, onAddCostume, onEditCostume, onDeleteCostume, onSelectAction }: CostumeListProps) {
  // State for search and filtering
  const [search, setSearch] = useState('');
  const [decadeFilter, setDecadeFilter] = useState<'all' | '80s' | '90s'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'rental' | 'sale' | 'both'>('all');
  const [sizeFilter, setSizeFilter] = useState<'all' | 'PP' | 'P' | 'M' | 'G' | 'GG'>('all');
  
  // Modal toggle state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  // Form State
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formDecade, setFormDecade] = useState<'80s' | '90s'>('80s');
  const [formCategory, setFormCategory] = useState('Música / Rockstar');
  const [formType, setFormType] = useState<'rental' | 'sale' | 'both'>('both');
  const [formPriceSale, setFormPriceSale] = useState<number | ''>('');
  const [formPriceRental, setFormPriceRental] = useState<number | ''>('');
  const [formSize, setFormSize] = useState<'PP' | 'P' | 'M' | 'G' | 'GG'>('M');
  const [formStatus, setFormStatus] = useState<'available' | 'rented' | 'sold' | 'maintenance'>('available');
  const [formStock, setFormStock] = useState<number>(1);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  
  // Pre-sets for quick forms
  const categories = [
    "Música / Rockstar", "Filmes & TV", "Moda / Casual", "Geek / Futurista", "Esportes", "Personagens HQ", "Disco & Dance"
  ];

  // Apply search/filters
  const filteredCostumes = costumes.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.description.toLowerCase().includes(search.toLowerCase()) ||
                          c.category.toLowerCase().includes(search.toLowerCase());
    const matchesDecade = decadeFilter === 'all' || c.decade === decadeFilter;
    const matchesType = typeFilter === 'all' || c.type === typeFilter || (typeFilter === 'both' && c.type === 'both');
    const matchesSize = sizeFilter === 'all' || c.size === sizeFilter;
    return matchesSearch && matchesDecade && matchesType && matchesSize;
  });

  const openCreateModal = () => {
    setModalMode('create');
    setFormId(crypto.randomUUID());
    setFormName('');
    setFormDecade('80s');
    setFormCategory('Música / Rockstar');
    setFormType('both');
    setFormPriceSale('');
    setFormPriceRental('');
    setFormSize('M');
    setFormStatus('available');
    setFormStock(1);
    setFormImageUrl('');
    setFormDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (c: Costume) => {
    setModalMode('edit');
    setFormId(c.id);
    setFormName(c.name);
    setFormDecade(c.decade);
    setFormCategory(c.category);
    setFormType(c.type);
    setFormPriceSale(c.price_sale ?? '');
    setFormPriceRental(c.price_rental ?? '');
    setFormSize(c.size);
    setFormStatus(c.status);
    setFormStock(c.stock);
    setFormImageUrl(c.image_url);
    setFormDescription(c.description);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert("Por favor, preencha o nome da fantasia.");
      return;
    }

    const payload: Costume = {
      id: formId,
      name: formName,
      decade: formDecade,
      category: formCategory,
      type: formType,
      price_sale: formType === 'rental' ? null : Number(formPriceSale) || 0,
      price_rental: formType === 'sale' ? null : Number(formPriceRental) || 0,
      size: formSize,
      status: formStatus,
      stock: Number(formStock) || 0,
      image_url: formImageUrl.trim() || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=400',
      description: formDescription
    };

    let result = false;
    if (modalMode === 'create') {
      result = await onAddCostume(payload);
    } else {
      result = await onEditCostume(payload);
    }

    if (result) {
      setIsModalOpen(false);
    } else {
      alert("Erro ao salvar fantasia. Se estiver conectado ao Supabase, certifique-se de ter executado as SQLs das tabelas.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza absoluta que deseja excluir a fantasia "${name}"?`)) {
      const res = await onDeleteCostume(id);
      if (!res) {
        alert("Erro ao excluir fantasia. Pode estar vinculada a venda/aluguel existente.");
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Quick stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-sans">
            Catálogo de Fantasias
          </h2>
          <p className="text-zinc-500 text-sm">
            Total {filteredCostumes.length} fantasias listadas sob filtros atuais
          </p>
        </div>

        <button 
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-pink-500 hover:bg-pink-400 text-white font-extrabold text-sm tracking-wide uppercase transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)] hover:shadow-[0_0_22px_rgba(236,72,153,0.6)] cursor-pointer"
        >
          <Plus className="w-5 h-5 line" /> Nova Fantasia
        </button>
      </div>

      {/* Retro Filters Shelf */}
      <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl flex flex-col gap-4">
        
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por nome, categoria ou palavra-chave..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-pink-500/50 rounded-lg py-2.5 pl-11 pr-4 text-xs text-white placeholder-zinc-500 outline-none transition-all"
          />
        </div>

        {/* Quick select parameters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          
          {/* Decade filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Década de Origem</label>
            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-904 gap-1">
              {(['all', '80s', '90s'] as const).map(dec => (
                <button
                  key={dec}
                  onClick={() => setDecadeFilter(dec)}
                  className={`flex-1 py-1 text-[10px] font-bold uppercase rounded cursor-pointer transition-all ${
                    decadeFilter === dec ? 'bg-pink-500 text-white shadow' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {dec === 'all' ? 'Todas' : dec}
                </button>
              ))}
            </div>
          </div>

          {/* Type filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Modalidade</label>
            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-804 gap-1">
              {(['all', 'rental', 'sale'] as const).map(tp => (
                <button
                  key={tp}
                  onClick={() => setTypeFilter(tp === 'all' ? 'all' : tp)}
                  className={`flex-1 py-1 text-[10px] font-bold uppercase rounded cursor-pointer transition-all ${
                    typeFilter === tp ? 'bg-cyan-500 text-zinc-950 font-black' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tp === 'all' ? 'Ambos' : tp === 'rental' ? 'Aluguel' : 'Venda'}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Tamanho</label>
            <select
              value={sizeFilter}
              onChange={(e) => setSizeFilter(e.target.value as any)}
              className="bg-zinc-950 border border-zinc-800 text-xs text-white p-2 rounded-lg py-1.5 outline-none font-semibold"
            >
              <option value="all">TODOS TAMANHOS</option>
              <option value="PP">PP</option>
              <option value="P">P</option>
              <option value="M">M</option>
              <option value="G">G</option>
              <option value="GG">GG</option>
            </select>
          </div>

          {/* Category Quick Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Filtro Rápido</label>
            <button 
              onClick={() => {
                setSearch('');
                setDecadeFilter('all');
                setTypeFilter('all');
                setSizeFilter('all');
              }}
              className="border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-xs font-bold font-mono py-1.5 text-zinc-300 rounded-lg cursor-pointer"
            >
              🔄 LIMPAR FILTROS
            </button>
          </div>

        </div>

      </div>

      {/* Costume Grid */}
      {filteredCostumes.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/10 border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center">
          <Package className="w-12 h-12 text-zinc-600 mb-3 animate-pulse" />
          <h3 className="font-bold text-lg text-white font-mono uppercase tracking-widest">Fantasias não encontradas</h3>
          <p className="text-zinc-500 text-sm max-w-sm mt-1">
            Nenhuma fantasia atende aos filtros definidos. Experimente limpar os filtros ou cadastre um novo item clássico!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCostumes.map((c) => (
            <motion.div 
              key={c.id} 
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl hover:border-pink-500/30 transition-all flex flex-col group relative"
              layout
              whileHover={{ y: -6 }}
            >
              {/* Costume Image Banner */}
              <div className="h-48 w-full bg-zinc-950 relative overflow-hidden">
                <img 
                  referrerPolicy="no-referrer"
                  src={c.image_url} 
                  alt={c.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Year Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 text-[11px] font-black uppercase tracking-widest rounded-full shadow ${
                  c.decade === '80s' ? 'bg-cyan-500 text-zinc-950' : 'bg-pink-500 text-white'
                }`}>
                  Anos {c.decade === '80s' ? '80' : '90'}
                </div>

                {/* Status Indicator */}
                <span className={`absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-black uppercase shadow-lg ${
                  c.status === 'available' ? 'bg-green-500 text-white' : 
                  c.status === 'rented' ? 'bg-amber-500 text-zinc-950' : 
                  c.status === 'sold' ? 'bg-zinc-650 bg-zinc-700 text-white' : 
                  'bg-red-500 text-white'
                }`}>
                  {c.status === 'available' && 'Disponível'}
                  {c.status === 'rented' && 'Alugada'}
                  {c.status === 'sold' && 'Esgotada'}
                  {c.status === 'maintenance' && 'Manutenção'}
                </span>

                {/* Category Pill */}
                <div className="absolute bottom-3 left-4 bg-black/60 backdrop-blur-sm px-2.5 py-0.5 rounded border border-zinc-700/50 text-[10px] font-medium text-zinc-300">
                  {c.category}
                </div>
              </div>

              {/* Description Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-extrabold text-base text-zinc-100 uppercase group-hover:text-white transition-colors">{c.name}</h4>
                    <span className="font-mono text-xs font-black bg-zinc-800 px-2 py-0.5 rounded text-zinc-300 border border-zinc-700/50">TAM: {c.size}</span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">{c.description || 'Nenhuma descrição informada.'}</p>
                </div>

                {/* Stock or parameters */}
                <div className="flex items-center justify-between text-xs font-mono py-1.5 border-y border-zinc-800/60">
                  <div className="text-zinc-500">Estoque: <span className="text-white font-bold">{c.stock} un</span></div>
                  <div className="text-zinc-500">Tamanho: <span className="text-white font-bold">{c.size}</span></div>
                </div>

                {/* Price Display Block */}
                <div className="grid grid-cols-2 gap-3 bg-zinc-950/80 p-3 rounded-lg border border-zinc-850">
                  {c.type !== 'sale' ? (
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block leading-tight">Alugar (Preço)</span>
                      <span className="text-sm font-black text-white font-mono">
                        R$ {c.price_rental}/dia
                      </span>
                    </div>
                  ) : <div className="text-zinc-700 font-mono text-[10px] self-center">Não Aluga</div>}

                  {c.type !== 'rental' ? (
                    <div className="text-right border-l border-zinc-850 pl-3">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block leading-tight">Comprar (Preço)</span>
                      <span className="text-sm font-black text-pink-400 font-mono">
                        R$ {c.price_sale}
                      </span>
                    </div>
                  ) : <div className="text-right text-zinc-700 font-mono text-[10px] self-center border-l border-zinc-850 pl-3">Não Vende</div>}
                </div>

                {/* Card Commands */}
                <div className="flex items-center justify-between gap-2.5 pt-1">
                  
                  {/* Action launcher */}
                  <div className="flex items-center gap-1.5">
                    {c.status === 'available' && c.stock > 0 ? (
                      <>
                        {c.type !== 'sale' && (
                          <button 
                            onClick={() => onSelectAction(c.id, 'rental')}
                            className="px-2.5 py-1.5 rounded bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500 text-cyan-950 font-extrabold text-[10px] uppercase transition-all tracking-wider cursor-pointer border border-cyan-500/30 font-mono"
                          >
                            Rent ⚡
                          </button>
                        )}
                        {c.type !== 'rental' && (
                          <button 
                            onClick={() => onSelectAction(c.id, 'sale')}
                            className="px-2.5 py-1.5 rounded bg-pink-500/15 text-pink-405 hover:bg-pink-500 text-white font-extrabold text-[10px] uppercase transition-all tracking-wider cursor-pointer border border-pink-500/30 font-mono"
                          >
                            Buy 🛍️
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">Indisponível p/ Ação</span>
                    )}
                  </div>

                  {/* Edit/Delete icon triggers */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => openEditModal(c)}
                      className="p-1 px-2 text-zinc-450 text-zinc-400 hover:text-white rounded border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                      title="Editar cadastro"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(c.id, c.name)}
                      className="p-1 px-2 text-zinc-450 text-red-500 hover:text-red-400 rounded border border-zinc-805 hover:border-red-500/20 transition-colors cursor-pointer"
                      title="Excluir item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Register/Edit Neon Modal Backdrop */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm">
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden text-zinc-100 flex flex-col"
            >
              {/* Modal Banner Header */}
              <div className="bg-gradient-to-r from-purple-900 to-pink-900 p-5 border-b border-pink-500/20 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white font-mono">
                    {modalMode === 'create' ? '🔌 CADASTRAR NOVA FANTASIA RETRÔ' : '⚙️ EDITAR CADASTRO RETRÔ'}
                  </h3>
                  <p className="text-xs text-purple-200">
                    Defina metadados no padrão dos anos 80 ou 90 e integre ao catálogo.
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors text-white font-bold cursor-pointer text-sm font-mono"
                >
                  [fechar]
                </button>
              </div>

              {/* Form container scrollable */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-5">
                
                {/* Visual quick info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-300">Nome Oficial da Fantasia *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Michael Jackson - Thriller Red Jacket" 
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                      className="bg-zinc-950 border border-zinc-800 focus:border-pink-500/50 rounded-lg py-2 px-3 text-xs text-white outline-none"
                    />
                  </div>

                  {/* Category select */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-300">Categoria / Estilo</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 text-xs text-white p-2 rounded-lg outline-none"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  
                  {/* Decade */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-300">Década</label>
                    <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => setFormDecade('80s')}
                        className={`flex-1 py-1 text-xs font-bold rounded cursor-pointer ${
                          formDecade === '80s' ? 'bg-cyan-500 text-zinc-950' : 'text-zinc-400'
                        }`}
                      >
                        ANOS 80
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormDecade('90s')}
                        className={`flex-1 py-1 text-xs font-bold rounded cursor-pointer ${
                          formDecade === '90s' ? 'bg-pink-500 text-white' : 'text-zinc-400'
                        }`}
                      >
                        ANOS 90
                      </button>
                    </div>
                  </div>

                  {/* Size */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-300">Tamanho</label>
                    <select
                      value={formSize}
                      onChange={(e) => setFormSize(e.target.value as any)}
                      className="bg-zinc-950 border border-zinc-800 text-xs text-white p-2 rounded-lg outline-none"
                    >
                      <option value="PP">PP</option>
                      <option value="P">P (Small)</option>
                      <option value="M">M (Medium)</option>
                      <option value="G">G (Large)</option>
                      <option value="GG">GG (X-Large)</option>
                    </select>
                  </div>

                  {/* Stock */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-300">Estoque Qtd</label>
                    <input 
                      type="number" 
                      min="1"
                      max="100" 
                      value={formStock}
                      onChange={(e) => setFormStock(Number(e.target.value) || 1)}
                      required
                      className="bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-white outline-none"
                    />
                  </div>

                  {/* Status */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-300">Estado Inicial</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="bg-zinc-950 border border-zinc-800 text-xs text-white p-2 rounded-lg outline-none"
                    >
                      <option value="available">Disponível</option>
                      <option value="maintenance">Manutenção</option>
                      <option value="rented">Alugado</option>
                      <option value="sold">Esgotado</option>
                    </select>
                  </div>

                </div>

                {/* Modalidade de oferta */}
                <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-400">Tipo de Comercialização</label>
                    <div className="flex gap-2">
                      {(['rental', 'sale', 'both'] as const).map(style => (
                        <button
                          type="button"
                          key={style}
                          onClick={() => setFormType(style)}
                          className={`flex-1 py-1.5 rounded font-black text-[10px] tracking-wider uppercase cursor-pointer transition-all border ${
                            formType === style ? 'bg-cyan-500 border-cyan-400 text-zinc-900 shadow' : 'bg-transparent border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {style === 'rental' && 'Apenas Aluguel'}
                          {style === 'sale' && 'Apenas Venda'}
                          {style === 'both' && 'Aluguel & Venda'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {/* Rental Price */}
                    {formType !== 'sale' && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-zinc-300">Preço do Aluguel (R$ por dia) *</label>
                        <input 
                          type="number" 
                          placeholder="Ex: 85" 
                          value={formPriceRental}
                          onChange={(e) => setFormPriceRental(e.target.value === '' ? '' : Number(e.target.value))}
                          required={formType !== 'sale'}
                          className="bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-white"
                        />
                      </div>
                    )}

                    {/* Sale Price */}
                    {formType !== 'rental' && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-zinc-300">Preço de Venda (R$) *</label>
                        <input 
                          type="number" 
                          placeholder="Ex: 320" 
                          value={formPriceSale}
                          onChange={(e) => setFormPriceSale(e.target.value === '' ? '' : Number(e.target.value))}
                          required={formType !== 'rental'}
                          className="bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-white"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Banner Photo Link */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-300">URL da Imagem da Fantasia (Opcional)</label>
                  <input 
                    type="url" 
                    placeholder="https://unsplash.com/..." 
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-white"
                  />
                  <p className="text-[10px] text-zinc-500">Deixe em branco para usar uma imagem ilustrativa retro padrão automaticamente.</p>
                </div>

                {/* Description Text */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-zinc-300">Descrição Detalhada e Itens Inclusos</label>
                  <textarea 
                    rows={3}
                    placeholder="Descreva a fantasia, materiais, acessórios inclusos (perucas, óculos, luvas) e restrições de lavagem."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-white placeholder-zinc-650"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/60 font-mono">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-lg cursor-pointer"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-xs font-black text-zinc-950 bg-pink-500 border border-pink-400 rounded-lg cursor-pointer hover:bg-pink-400 font-sans uppercase shadow-[0_0_10px_rgba(236,72,153,0.3)]"
                  >
                    SALVAR CLÁSSICO
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
