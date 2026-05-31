import { createClient } from '@supabase/supabase-js';
import { Costume, Transaction, SupabaseConfig } from '../types';

// Pre-populated mock costumes in 85/95 retro-vibe style
const DEFAULT_COSTUMES: Costume[] = [
  {
    id: "f1b88e1a-4f51-4043-95c5-bc92d1928cf8",
    name: "Freddie Mercury - Jaqueta Amarela (Wembley 86)",
    decade: "80s",
    category: "Música / Rock",
    type: "both",
    price_sale: 450,
    price_rental: 90,
    size: "M",
    status: "available",
    stock: 2,
    image_url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=400",
    description: "Icônica jaqueta amarela com fivelas brancas inspirada na lendária performance no estádio de Wembley em 1986. Acompanha calça branca com listras vermelhas e douradas.",
    created_at: new Date('2026-05-10T12:00:00Z').toISOString()
  },
  {
    id: "f2b88e1a-4f51-4043-95c5-bc92d1928cf8",
    name: "Marty McFly - Jaqueta Auto-Ajustável & Colete Inflável",
    decade: "80s",
    category: "Filmes & TV",
    type: "rental",
    price_sale: null,
    price_rental: 120,
    size: "G",
    status: "available",
    stock: 1,
    image_url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=400",
    description: "Colete vermelho inflável clássico de De Volta para o Futuro II com jaqueta de mangas cinzas ajustáveis. Hoverboard impresso em 3D opcional disponível para aluguel casado.",
    created_at: new Date('2026-05-11T12:00:00Z').toISOString()
  },
  {
    id: "f3b88e1a-4f51-4043-95c5-bc92d1928cf8",
    name: "Macacão Corta-Vento Neon Retro (Windbreaker)",
    decade: "90s",
    category: "Moda / Casual",
    type: "sale",
    price_sale: 230,
    price_rental: null,
    size: "G",
    status: "available",
    stock: 5,
    image_url: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=400",
    description: "Conjunto corta-vento (jaqueta + calça larga) com padrões geométricos rosa choque, roxo e azul piscina. O auge absoluto das pistas de patinação de 1992.",
    created_at: new Date('2026-05-12T12:00:00Z').toISOString()
  },
  {
    id: "f4b88e1a-4f51-4043-95c5-bc92d1928cf8",
    name: "Madonna - Look Like a Virgin (Grammy 84)",
    decade: "80s",
    category: "Música / Pop",
    type: "both",
    price_sale: 380,
    price_rental: 80,
    size: "P",
    status: "rented",
    stock: 1,
    image_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400",
    description: "Vestido de noiva punk rock com tules e rendas brancas, colar de pérolas em camadas e o lendário cinto dourado escrito 'BOY TOY'. Sucesso absoluto em festas retro.",
    created_at: new Date('2026-05-13T12:00:00Z').toISOString()
  },
  {
    id: "f5b88e1a-4f51-4043-95c5-bc92d1928cf8",
    name: "Fresh Prince - Will Smith (Um Maluco no Pedaço)",
    decade: "90s",
    category: "Filmes & TV",
    type: "both",
    price_sale: 280,
    price_rental: 60,
    size: "GG",
    status: "available",
    stock: 3,
    image_url: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=400",
    description: "Boné de aba reta neon virado para o lado, camiseta amarela de listras horizontais vibrantes e jeans largos desbotados de cintura alta. Pronto para morar em Bel-Air.",
    created_at: new Date('2026-05-14T12:00:00Z').toISOString()
  },
  {
    id: "f6b88e1a-4f51-4043-95c5-bc92d1928cf8",
    name: "Cyberpunk Hacker - Jaqueta de Couro e Óculos Pixel",
    decade: "90s",
    category: "Geek / Futurista",
    type: "both",
    price_sale: 350,
    price_rental: 75,
    size: "M",
    status: "maintenance",
    stock: 1,
    image_url: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=400",
    description: "Inspirado em Matrix e nos hackers da cultura rave dos anos 90. Jaqueta longa de couro preto, óculos minúsculos e botas pesadas de cano alto.",
    created_at: new Date('2026-05-15T12:00:00Z').toISOString()
  }
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: "t1b88e1a-4f51-4043-95c5-bc92d1928cf8",
    costume_id: "f4b88e1a-4f51-4043-95c5-bc92d1928cf8",
    costume_name: "Madonna - Look Like a Virgin (Grammy 84)",
    type: "rental",
    customer_name: "Juliana Santos",
    customer_phone: "(11) 98888-7766",
    transaction_date: "2026-05-25T14:30:00Z",
    due_date: "2026-06-02T18:00:00Z",
    return_date: null,
    total_value: 80,
    status: "active",
    created_at: "2026-05-25T14:30:00Z"
  },
  {
    id: "t2b88e1a-4f51-4043-95c5-bc92d1928cf8",
    costume_id: "f1b88e1a-4f51-4043-95c5-bc92d1928cf8",
    costume_name: "Freddie Mercury - Jaqueta Amarela (Wembley 86)",
    type: "sale",
    customer_name: "Carlos Eduardo Mendes",
    customer_phone: "(21) 97777-6655",
    transaction_date: "2026-05-20T10:15:00Z",
    due_date: null,
    return_date: null,
    total_value: 450,
    status: "completed",
    created_at: "2026-05-20T10:15:00Z"
  },
  {
    id: "t3b88e1a-4f51-4043-95c5-bc92d1928cf8",
    costume_id: "f2b88e1a-4f51-4043-95c5-bc92d1928cf8",
    costume_name: "Marty McFly - Jaqueta Auto-Ajustável & Colete Inflável",
    type: "rental",
    customer_name: "Lucas de Souza",
    customer_phone: "(31) 96666-5544",
    transaction_date: "2026-05-18T16:00:00Z",
    due_date: "2026-05-22T18:00:00Z",
    return_date: "2026-05-22T17:30:00Z",
    total_value: 120,
    status: "completed",
    created_at: "2026-05-18T16:00:00Z"
  },
  {
    id: "t4b88e1a-4f51-4043-95c5-bc92d1928cf8",
    costume_id: "f5b88e1a-4f51-4043-95c5-bc92d1928cf8",
    costume_name: "Fresh Prince - Will Smith (Um Maluco no Pedaço)",
    type: "rental",
    customer_name: "Ricardo Fonseca",
    customer_phone: "(11) 91234-5678",
    transaction_date: "2026-05-10T11:00:00Z",
    due_date: "2026-05-15T18:00:00Z",
    return_date: null,
    total_value: 60,
    status: "overdue",
    created_at: "2026-05-10T11:00:00Z"
  }
];

// Load Supabase Client if Configured
function getSupabase(): any | null {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envUrl.trim() !== "" && envKey && envKey.trim() !== "") {
    return createClient(envUrl, envKey);
  }

  const configStr = localStorage.getItem('retro_supabase_config');
  if (configStr) {
    try {
      const config: SupabaseConfig = JSON.parse(configStr);
      if (config.is_connected && config.url && config.anon_key) {
        return createClient(config.url, config.anon_key);
      }
    } catch (e) {
      console.error("Erro ao parsear configuração do Supabase:", e);
    }
  }
  return null;
}

// Check database connection state
export async function testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string }> {
  try {
    const client = createClient(url, key);
    // Try to perform a select on 'fantasias' table to test.
    // Even if table doesn't exist, if connection is bad it'll throw a network error.
    // If table doesn't exist but credential is correct, it will say table doesn't exist (which means connection succeeded!)
    const { error } = await client.from('fantasias').select('id').limit(1);
    
    if (error && error.code === 'PGRST116') {
      // Custom: Table not found or similar code, but connection authorized
      return { success: true, message: "Conectado ao Supabase! Porém, as tabelas 'fantasias' e/ou 'transacoes' parecem não ter sido criadas ainda no seu banco." };
    }
    
    if (error && error.message.includes("failed to fetch")) {
      return { success: false, message: "Falha de rede. Verifique se o endereço da URL do Supabase está correto." };
    }
    
    if (error && ((error as any).status === 401 || (error as any).status === 403 || error.message.includes("JWT") || error.message.includes("Invalid API key") || error.message.includes("ApiKey"))) {
      return { success: false, message: "Credenciais de API inválidas (o Anon Key informado está incorreto)." };
    }

    return { success: true, message: "Conexão estabelecida com sucesso! Tabelas detectadas." };
  } catch (err: any) {
    return { success: false, message: "Erro de conexão: " + (err.message || err) };
  }
}

// Main Config Management
export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envUrl.trim() !== "" && envKey && envKey.trim() !== "") {
    return { url: envUrl, anon_key: envKey, is_connected: true };
  }

  const configStr = localStorage.getItem('retro_supabase_config');
  if (configStr) {
    try {
      return JSON.parse(configStr);
    } catch {
      // Fallback
    }
  }
  return { url: '', anon_key: '', is_connected: false };
}

export function saveSupabaseConfig(config: SupabaseConfig) {
  localStorage.setItem('retro_supabase_config', JSON.stringify(config));
}

export function clearSupabaseConfig() {
  localStorage.removeItem('retro_supabase_config');
}

// --- COSTUME OPERATIONS ---

export async function getCostumes(): Promise<{ data: Costume[]; isSupabase: boolean; error?: string }> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('fantasias')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      return { data: data as Costume[], isSupabase: true };
    } catch (err: any) {
      console.warn("Falha ao carregar do Supabase. Utilizando dados locais em localStorage.", err);
      return { 
        data: getLocalCostumes(), 
        isSupabase: true, 
        error: `Supabase conectado, mas ocorreu um erro (talvez faltem as tabelas?): ${err.message || err}` 
      };
    }
  }

  return { data: getLocalCostumes(), isSupabase: false };
}

function getLocalCostumes(): Costume[] {
  const local = localStorage.getItem('retro_costumes');
  if (!local) {
    localStorage.setItem('retro_costumes', JSON.stringify(DEFAULT_COSTUMES));
    return DEFAULT_COSTUMES;
  }
  try {
    return JSON.parse(local);
  } catch {
    return DEFAULT_COSTUMES;
  }
}

export async function saveCostume(costume: Costume): Promise<{ success: boolean; data?: Costume; error?: string }> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('fantasias')
        .upsert(costume)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data: data as Costume };
    } catch (err: any) {
      return { success: false, error: err.message || JSON.stringify(err) };
    }
  }

  // Local Save
  const costumes = getLocalCostumes();
  const index = costumes.findIndex(c => c.id === costume.id);
  
  if (index >= 0) {
    costumes[index] = { ...costume };
  } else {
    costumes.unshift({ ...costume, created_at: new Date().toISOString() });
  }
  
  localStorage.setItem('retro_costumes', JSON.stringify(costumes));
  return { success: true, data: costume };
}

export async function deleteCostume(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('fantasias')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || JSON.stringify(err) };
    }
  }

  // Local Delete
  const costumes = getLocalCostumes();
  const filtered = costumes.filter(c => c.id !== id);
  localStorage.setItem('retro_costumes', JSON.stringify(filtered));
  return { success: true };
}


// --- TRANSACTION OPERATIONS ---

export async function getTransactions(): Promise<{ data: Transaction[]; isSupabase: boolean; error?: string }> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('transacoes')
        .select('*')
        .order('transaction_date', { ascending: false });
      
      if (error) {
        throw error;
      }
      return { data: data as Transaction[], isSupabase: true };
    } catch (err: any) {
      console.warn("Falha ao carregar transações do Supabase. Usando local.", err);
      return { 
        data: getLocalTransactions(), 
        isSupabase: true, 
        error: `Erro ao buscar transações do Supabase: ${err.message || err}` 
      };
    }
  }

  return { data: getLocalTransactions(), isSupabase: false };
}

function getLocalTransactions(): Transaction[] {
  const local = localStorage.getItem('retro_transactions');
  if (!local) {
    localStorage.setItem('retro_transactions', JSON.stringify(DEFAULT_TRANSACTIONS));
    return DEFAULT_TRANSACTIONS;
  }
  try {
    return JSON.parse(local);
  } catch {
    return DEFAULT_TRANSACTIONS;
  }
}

export async function saveTransaction(transaction: Transaction): Promise<{ success: boolean; data?: Transaction; error?: string }> {
  const supabase = getSupabase();
  
  // Update Costume Status and reduce stock/mark as rented
  const costumeRes = await getCostumesItem(transaction.costume_id);
  if (costumeRes.data) {
    const costume = { ...costumeRes.data };
    if (transaction.type === 'sale') {
      costume.stock = Math.max(0, costume.stock - 1);
      if (costume.stock === 0) {
        costume.status = 'sold';
      }
    } else {
      costume.status = 'rented';
    }
    await saveCostume(costume);
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('transacoes')
        .upsert(transaction)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data: data as Transaction };
    } catch (err: any) {
      return { success: false, error: err.message || JSON.stringify(err) };
    }
  }

  // Local Save
  const transactions = getLocalTransactions();
  const index = transactions.findIndex(t => t.id === transaction.id);
  
  if (index >= 0) {
    transactions[index] = { ...transaction };
  } else {
    transactions.unshift({ ...transaction, created_at: new Date().toISOString() });
  }
  
  localStorage.setItem('retro_transactions', JSON.stringify(transactions));
  return { success: true, data: transaction };
}

export async function getCostumesItem(id: string): Promise<{ data: Costume | null }> {
  const res = await getCostumes();
  const item = res.data.find(c => c.id === id) || null;
  return { data: item };
}

export async function returnRental(transactionId: string, returnDate: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  
  // Load original transaction to find costume
  let trans: Transaction | null = null;
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('transacoes')
        .select('*')
        .eq('id', transactionId)
        .single();
      if (!error && data) trans = data as Transaction;
    } catch {
      // Fallback
    }
  }
  
  if (!trans) {
    trans = getLocalTransactions().find(t => t.id === transactionId) || null;
  }

  if (trans) {
    // Return costume to available
    const costumeRes = await getCostumesItem(trans.costume_id);
    if (costumeRes.data) {
      const costume = { ...costumeRes.data };
      costume.status = 'available';
      await saveCostume(costume);
    }
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('transacoes')
        .update({ return_date: returnDate, status: 'completed' })
        .eq('id', transactionId)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || JSON.stringify(err) };
    }
  }

  // Local return
  const transactions = getLocalTransactions();
  const index = transactions.findIndex(t => t.id === transactionId);
  if (index >= 0) {
    transactions[index] = {
      ...transactions[index],
      return_date: returnDate,
      status: 'completed'
    };
    localStorage.setItem('retro_transactions', JSON.stringify(transactions));
  }
  return { success: true };
}

export async function deleteTransaction(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase
        .from('transacoes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || JSON.stringify(err) };
    }
  }

  // Local Delete
  const transactions = getLocalTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  localStorage.setItem('retro_transactions', JSON.stringify(filtered));
  return { success: true };
}
