import React, { useState, useEffect } from 'react';
import { SupabaseConfig } from '../types';
import { getSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig, testSupabaseConnection } from '../lib/db';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Link2, ShieldAlert, Sparkles, Check, CheckCircle2, ChevronRight, Copy, Terminal, Github, ServerCrash, ExternalLink } from 'lucide-react';

interface SupabaseGuideProps {
  onConfigChanged: () => void;
}

export default function SupabaseGuide({ onConfigChanged }: SupabaseGuideProps) {
  // Config states
  const [config, setConfig] = useState<SupabaseConfig>({ url: '', anon_key: '', is_connected: false });
  const [testStatus, setTestStatus] = useState<{ status: 'idle' | 'loading' | 'success' | 'error'; message: string }>({ status: 'idle', message: '' });
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);

  useEffect(() => {
    setConfig(getSupabaseConfig());
  }, []);

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.url || !config.anon_key) {
      setTestStatus({ status: 'error', message: 'Preencha ambos os campos para testar a conexão.' });
      return;
    }

    setTestStatus({ status: 'loading', message: 'Testando comunicação com o projeto Supabase...' });
    
    const check = await testSupabaseConnection(config.url, config.anon_key);
    if (check.success) {
      setTestStatus({ status: 'success', message: check.message });
      const newConfig: SupabaseConfig = {
        ...config,
        is_connected: true
      };
      saveSupabaseConfig(newConfig);
      setConfig(newConfig);
      onConfigChanged();
    } else {
      setTestStatus({ status: 'error', message: check.message + " Verifique se as credenciais estão corretas. DICA: O banco local continuará ativo durante falhas." });
    }
  };

  const handleDisconnect = () => {
    if (confirm("Tem certeza que deseja desconectar o Supabase? O aplicativo reverterá para dados salvos localmente.")) {
      clearSupabaseConfig();
      const reset = { url: '', anon_key: '', is_connected: false };
      setConfig(reset);
      setTestStatus({ status: 'idle', message: '' });
      onConfigChanged();
    }
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextId(id);
    setTimeout(() => setCopiedTextId(null), 2000);
  };

  const sqlSchemaCode = `-- 1. CRIAÇÃO DA TABELA DE FANTASIAS
create table public.fantasias (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  decade text not null check (decade in ('80s', '90s')),
  category text not null,
  type text not null check (type in ('rental', 'sale', 'both')),
  price_sale numeric,
  price_rental numeric,
  size text not null check (size in ('PP', 'P', 'M', 'G', 'GG')),
  status text not null check (status in ('available', 'rented', 'sold', 'maintenance')),
  stock integer not null default 1,
  image_url text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. CRIAÇÃO DA TABELA DE TRANSAÇÕES (Vendas e Aluguéis)
create table public.transacoes (
  id uuid primary key default gen_random_uuid(),
  costume_id uuid references public.fantasias(id) on delete cascade not null,
  costume_name text,
  type text not null check (type in ('rental', 'sale')),
  customer_name text not null,
  customer_phone text not null,
  transaction_date timestamp with time zone default timezone('utc'::text, now()) not null,
  due_date timestamp with time zone,
  return_date timestamp with time zone,
  total_value numeric not null,
  status text not null check (status in ('active', 'completed', 'overdue')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. HABILITAR SECURITY POLICIES (ROW LEVEL SECURITY)
alter table public.fantasias enable row level security;
alter table public.transacoes enable row level security;

-- 4. CRIAR POLÍTICAS DE ACESSO TOTAL PARA CHAVE ANON (DEV RAPIDO)
create policy "Acesso ilimitado Anon Fantasias" on public.fantasias for all using (true) with check (true);
create policy "Acesso ilimitado Anon Transacoes" on public.transacoes for all using (true) with check (true);`;

  return (
    <div className="space-y-8">
      
      {/* Visual connection banner state */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Connection Setup Card */}
        <div className="lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-5 h-5 text-emerald-400 animate-pulse" />
              <h3 className="font-extrabold text-white text-sm uppercase tracking-wider font-mono">Supabase Sync Integrator</h3>
            </div>
            
            <p className="text-zinc-400 text-xs leading-relaxed">
              Insira o endereço de API do seu projeto Supabase e a Chave Pública Anon. O sistema irá realizar consultas diretas no seu banco remoto em tempo real. Se desconectado ou as tabelas fiquem vazias, o app usará o <strong>localStorage</strong> offline automaticamente.
            </p>

            <form onSubmit={handleTestAndSave} className="space-y-3 pt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest">Supabase Project URL</label>
                <input 
                  type="url" 
                  placeholder="https://yourwork.supabase.co" 
                  value={config.url}
                  disabled={config.is_connected}
                  onChange={(e) => setConfig({ ...config, url: e.target.value })}
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500/50 rounded-lg p-2.5 text-xs text-white placeholder-zinc-700 outline-none transition-all disabled:opacity-50 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest">Supabase API Anon Key</label>
                <input 
                  type="password" 
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." 
                  disabled={config.is_connected}
                  value={config.anon_key}
                  onChange={(e) => setConfig({ ...config, anon_key: e.target.value })}
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500/50 rounded-lg p-2.5 text-xs text-white placeholder-zinc-700 outline-none transition-all disabled:opacity-50 font-mono"
                />
              </div>

              {!config.is_connected ? (
                <button 
                  type="submit" 
                  disabled={testStatus.status === 'loading'}
                  className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase transition-all tracking-wider font-mono cursor-pointer disabled:opacity-50"
                >
                  {testStatus.status === 'loading' ? 'CONECTANDO...' : 'TESTAR & SALVAR CONEXÃO LIVE 🔗'}
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={handleDisconnect}
                  className="w-full py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-black text-xs uppercase transition-all tracking-wider font-mono cursor-pointer"
                >
                  DESCONECTAR BANCO REMOTO 🔌
                </button>
              )}
            </form>
          </div>

          {/* Connection Test Output Message */}
          <div className="border-t border-zinc-850 pt-4 mt-4 text-xs font-mono">
            {config.is_connected ? (
              <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Integração ATIVA. Escreva ou leia da sua nuvem Supabase instantaneamente!</span>
              </div>
            ) : testStatus.status === 'error' ? (
              <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20 text-red-400 flex flex-col gap-1">
                <span className="font-bold flex items-center gap-1">⚠️ Falha no Teste:</span>
                <span className="text-[11px] leading-relaxed text-zinc-400">{testStatus.message}</span>
              </div>
            ) : testStatus.status === 'success' ? (
              <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
                ✔️ {testStatus.message}
              </div>
            ) : (
              <div className="text-zinc-500 text-[11px] font-mono italic">
                Aguardando inserção de credenciais... Modo localStorage está mantendo o simulador online.
              </div>
            )}
          </div>
        </div>

        {/* Deploy & Github Guide Info */}
        <div className="lg:col-span-6 bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Github className="w-5 h-5 text-pink-400" />
              <h3 className="font-extrabold text-white text-sm uppercase tracking-wider font-mono">Deploy Git & Vercel Guide</h3>
            </div>
            
            <p className="text-zinc-400 text-xs leading-relaxed">
              Você deseja exportar este aplicativo para o <strong>GitHub</strong>, atualizar as variáveis e fazer deploy na <strong>Vercel</strong>? Aqui estão as instruções detalhadas passo a passo de como proceder:
            </p>

            <div className="space-y-3 pt-1 text-xs">
              <div className="relative pl-6">
                <div className="absolute left-0 top-0.5 w-4 h-4 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/40 text-[10px] items-center justify-center flex font-bold">1</div>
                <div className="font-bold text-zinc-200">Exporte os Arquivos</div>
                <div className="text-zinc-500 text-[11px]">Use o menu do AI Studio (canto superior ou engrenagem) para baixar o ZIP do projeto ou exportar diretamente para seu repositório pessoal no GitHub.</div>
              </div>

              <div className="relative pl-6">
                <div className="absolute left-0 top-0.5 w-4 h-4 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/40 text-[10px] items-center justify-center flex font-bold">2</div>
                <div className="font-bold text-zinc-200">Importe na Vercel</div>
                <div className="text-zinc-500 text-[11px]">Faça login na <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-pink-400 hover:underline">Vercel</a>, selecione &quot;Add New Project&quot; e importe o repositório do GitHub. A Vercel detectará o setup de Vite automaticamente!</div>
              </div>

              <div className="relative pl-6">
                <div className="absolute left-0 top-0.5 w-4 h-4 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/40 text-[10px] items-center justify-center flex font-bold">3</div>
                <div className="font-bold text-zinc-200">Variáveis de Ambiente (Opcional)</div>
                <div className="text-zinc-500 text-[11px]">Adicione as credenciais do Supabase nas Environment Variables da Vercel para carregar de forma persistente:</div>
                <div className="bg-zinc-950 p-2 rounded-md font-mono text-[9px] text-zinc-400 border border-zinc-850 mt-1 space-y-1">
                  <div>VITE_SUPABASE_URL = (seu link)</div>
                  <div>VITE_SUPABASE_ANON_KEY = (sua chave anon)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-850 pt-4 mt-4 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-500">Desenvolvido em React 19 + Vite</span>
            <span className="bg-zinc-800 text-zinc-300 font-bold px-2 py-0.5 rounded text-[10px] border border-zinc-700 font-mono flex items-center gap-1">
              LIVE PREVIEW <ChevronRight className="w-3 h-3" /> PORT 3000
            </span>
          </div>
        </div>

      </div>

      {/* SQL Script Board copy pasteable */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-extrabold text-white text-sm uppercase tracking-wider font-mono">Script SQL de Inicialização</h3>
              <p className="text-zinc-500 text-xs">Execute este script SQL completo no editor SQL query do seu painel do Supabase</p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={() => handleCopyCode(sqlSchemaCode, 'sql')}
            className="px-3.5 py-1.5 rounded bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 hover:text-white transition-all text-xs font-mono font-bold font-semibold flex items-center gap-1.5 cursor-pointer text-zinc-300"
          >
            {copiedTextId === 'sql' ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" /> Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copiar SQL Completo
              </>
            )}
          </button>
        </div>

        {/* Code field */}
        <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 overflow-x-auto font-mono text-[11px] leading-relaxed text-zinc-300 max-h-96 whitespace-pre">
          {sqlSchemaCode}
        </div>

        {/* Alert Policy box */}
        <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-300 text-xs flex gap-3.5">
          <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block uppercase tracking-wide font-mono text-[11px]">Segurança & Políticas RLS</span>
            <p className="leading-relaxed text-zinc-300">
              O script SQL fornecido cria políticas de Row Level Security (RLS) abertas para fins de testes rápidos utilizando a chave pública anon. Para ambientes de produção com login de usuário, você deve refinar as políticas para restringir quem pode criar ou apagar itens.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
