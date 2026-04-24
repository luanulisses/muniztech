import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Search, Edit2, Trash2, 
  X, Loader2, TrendingUp, Store
} from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface DealDB {
  id: string;
  title: string;
  slug: string;
  price: string;
  original_price: string;
  discount: string;
  store: string;
  link: string;
  image: string;
  category: string;
  is_achadinho: boolean;
  views: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Converte valor bruto digitado em número puro */
function parsePrice(raw: string): number {
  // Remove tudo que não é dígito ou vírgula/ponto
  const clean = raw.replace(/[^\d,\.]/g, '');
  // Se tiver vírgula como separador decimal brasileiro
  const normalized = clean.replace(/\./g, '').replace(',', '.');
  return parseFloat(normalized) || 0;
}

/** Formata número para padrão BRL: R$ 6.569,00 */
function formatBRL(value: number): string {
  if (!value || isNaN(value)) return '';
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

/** Handler de input de preço: ao digitar, mascara em tempo real */
function maskPrice(raw: string): string {
  // Mantém apenas dígitos
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  const num = parseInt(digits, 10) / 100;
  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

/** Calcula o percentual de desconto entre preço original e preço com desconto */
function calcDiscount(price: string, originalPrice: string): string {
  const p = parsePrice(price);
  const o = parsePrice(originalPrice);
  if (!p || !o || o <= p) return '';
  const pct = Math.round(((o - p) / o) * 100);
  return `${pct}%`;
}

// Mapeamento de domínios para nome de parceria
const STORE_MAP: Record<string, string> = {
  'amazon.com.br': 'Amazon',
  'amzn.to': 'Amazon',
  'amzn.com': 'Amazon',
  'mercadolivre.com.br': 'Mercado Livre',
  'mercadolibre.com': 'Mercado Livre',
  'shopee.com.br': 'Shopee',
  'americanas.com.br': 'Americanas',
  'magazineluiza.com.br': 'Magazine Luiza',
  'magalu.com': 'Magazine Luiza',
  'submarino.com.br': 'Submarino',
  'casasbahia.com.br': 'Casas Bahia',
  'kabum.com.br': 'KaBuM!',
  'aliexpress.com': 'AliExpress',
  'terabyteshop.com.br': 'Terabyte Shop',
  'pichau.com.br': 'Pichau',
};

/** Detecta a loja pelo link do afiliado */
function detectStore(url: string): string {
  if (!url) return '';
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    for (const [domain, name] of Object.entries(STORE_MAP)) {
      if (hostname.includes(domain)) return name;
    }
  } catch {
    // url inválida ainda sendo digitada
    for (const [domain, name] of Object.entries(STORE_MAP)) {
      if (url.toLowerCase().includes(domain)) return name;
    }
  }
  return '';
}

// ─────────────────────────────────────────────────────────────────────────────

export default function AdminDeals() {
  const [deals, setDeals] = useState<DealDB[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<DealDB | null>(null);
  const [detectedStore, setDetectedStore] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    price: '',
    original_price: '',
    discount: '',
    store: 'Amazon',
    link: '',
    image: '',
    category: 'Smartphones',
    is_achadinho: false
  });

  const fetchData = async () => {
    setLoading(true);
    const [dealsRes, catsRes] = await Promise.all([
      supabase.from('deals').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('name').order('name')
    ]);
    
    if (dealsRes.data) setDeals(dealsRes.data);
    if (catsRes.data) setCategories(catsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (deal?: DealDB) => {
    if (deal) {
      setEditingDeal(deal);
      setFormData({
        title: deal.title,
        slug: deal.slug,
        price: deal.price,
        original_price: deal.original_price,
        discount: deal.discount,
        store: deal.store,
        link: deal.link,
        image: deal.image,
        category: deal.category,
        is_achadinho: deal.is_achadinho
      });
      setDetectedStore(detectStore(deal.link));
    } else {
      setEditingDeal(null);
      setFormData({
        title: '',
        slug: '',
        price: '',
        original_price: '',
        discount: '',
        store: 'Amazon',
        link: '',
        image: '',
        category: categories[0]?.name || 'Smartphones',
        is_achadinho: false
      });
      setDetectedStore('');
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta oferta?')) return;
    const { error } = await supabase.from('deals').delete().eq('id', id);
    if (!error) fetchData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const slug = formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    // Usa loja detectada se o campo store não foi alterado manualmente
    const store = formData.store || detectedStore || 'Loja Parceira';
    const dealData = { ...formData, slug, store };

    if (editingDeal) {
      await supabase.from('deals').update(dealData).eq('id', editingDeal.id);
    } else {
      await supabase.from('deals').insert([dealData]);
    }

    setIsModalOpen(false);
    fetchData();
  };

  // ── Handlers de preço com máscara ──────────────────────────────────────────

  const handlePriceChange = (raw: string, field: 'price' | 'original_price') => {
    const masked = maskPrice(raw);
    const updated = { ...formData, [field]: masked };
    // Recalcula desconto automaticamente
    const newDiscount = calcDiscount(
      field === 'price' ? masked : formData.price,
      field === 'original_price' ? masked : formData.original_price
    );
    setFormData({ ...updated, discount: newDiscount || formData.discount });
  };

  const handleLinkChange = (url: string) => {
    const store = detectStore(url);
    setDetectedStore(store);
    setFormData({ 
      ...formData, 
      link: url,
      store: store || formData.store
    });
  };

  // ────────────────────────────────────────────────────────────────────────────

  const filteredDeals = deals.filter(deal => 
    deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight">Gerenciar Ofertas</h1>
          <p className="text-on-surface-variant font-label-bold">Adicione, edite ou remova produtos do portal.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl font-black uppercase tracking-widest text-sm shadow-lg hover:bg-secondary-fixed-variant transition-colors"
        >
          <Plus className="w-5 h-5" /> Nova Oferta
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-on-surface-variant" />
        </div>
        <input
          type="text"
          placeholder="Buscar por título ou categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-12 pr-4 py-4 bg-white border border-surface-container-high rounded-2xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all shadow-sm font-label-bold"
        />
      </div>

      <div className="bg-white border border-surface-container-high rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-surface-container-high">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">Produto</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">Categoria</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">Preço</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">Views</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {loading && deals.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center"><Loader2 className="w-8 h-8 text-secondary animate-spin mx-auto" /></td></tr>
              ) : filteredDeals.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant font-label-bold">Nenhuma oferta encontrada.</td></tr>
              ) : filteredDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container-low border border-surface-container-high shrink-0">
                        <img src={deal.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-black text-on-surface truncate max-w-[200px]">{deal.title}</div>
                        <div className="text-[10px] text-on-surface-variant font-black uppercase tracking-wider">{deal.store}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-[10px] font-black uppercase tracking-widest rounded-lg">
                      {deal.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-black text-secondary">{deal.price}</div>
                    <div className="text-[10px] text-on-surface-variant line-through">{deal.original_price}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-label-bold text-on-surface-variant">
                    <div className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> {deal.views}</div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleOpenModal(deal)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-5 h-5" /></button>
                    <button onClick={() => handleDelete(deal.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-on-surface uppercase tracking-tight">{editingDeal ? 'Editar Oferta' : 'Nova Oferta'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container-low rounded-full"><X className="w-6 h-6 text-on-surface-variant" /></button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Título */}
              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Título do Produto</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary focus:bg-white transition-all font-label-bold" placeholder="Ex: Apple iPhone 15 Pro Max" />
              </div>

              {/* Imagem */}
              <div className="md:col-span-2">
                <ImageUpload 
                  currentImage={formData.image} 
                  onUpload={(url) => setFormData({...formData, image: url})} 
                  label="Foto do Produto (Upload direto)"
                />
              </div>

              {/* Preço com Desconto */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Preço com Desconto</label>
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  value={formData.price}
                  onChange={e => handlePriceChange(e.target.value, 'price')}
                  className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary transition-all font-label-bold"
                  placeholder="R$ 0,00"
                />
              </div>

              {/* Preço Original */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Preço Original</label>
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  value={formData.original_price}
                  onChange={e => handlePriceChange(e.target.value, 'original_price')}
                  className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary transition-all font-label-bold"
                  placeholder="R$ 0,00"
                />
              </div>

              {/* Porcentagem (calculada automaticamente) */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">
                  Porcentagem de Desconto
                  {formData.discount && (
                    <span className="ml-2 px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-[10px] normal-case">calculado automaticamente</span>
                  )}
                </label>
                <input
                  type="text"
                  value={formData.discount}
                  onChange={e => setFormData({...formData, discount: e.target.value})}
                  className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary transition-all font-label-bold"
                  placeholder="Ex: 20%"
                />
              </div>

              {/* Loja */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Loja Parceira</label>
                <input 
                  required 
                  type="text" 
                  value={formData.store} 
                  onChange={e => setFormData({...formData, store: e.target.value})} 
                  className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary focus:bg-white transition-all font-label-bold" 
                  placeholder="Ex: Amazon, Mercado Livre..." 
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Categoria</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary transition-all font-label-bold appearance-none">
                  {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              {/* Link de Afiliado com detecção de loja */}
              <div className="md:col-span-2">
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Link de Afiliado</label>
                <input
                  required
                  type="url"
                  value={formData.link}
                  onChange={e => handleLinkChange(e.target.value)}
                  className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary transition-all font-label-bold"
                  placeholder="https://..."
                />
                {/* Badge de loja detectada */}
                {detectedStore && (
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-secondary/10 border border-secondary/20 rounded-xl w-fit">
                    <Store className="w-4 h-4 text-secondary" />
                    <span className="text-xs font-black text-secondary uppercase tracking-widest">
                      Parceria com a {detectedStore}
                    </span>
                  </div>
                )}
              </div>

              {/* Achadinho */}
              <div className="md:col-span-2 flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl">
                <input type="checkbox" id="is_achadinho" checked={formData.is_achadinho} onChange={e => setFormData({...formData, is_achadinho: e.target.checked})} className="w-5 h-5 text-secondary border-surface-container-high rounded" />
                <label htmlFor="is_achadinho" className="text-sm font-black text-on-surface uppercase tracking-widest">Marcar como "Achadinho"</label>
              </div>

              {/* Botão */}
              <div className="md:col-span-2 pt-4">
                <button type="submit" disabled={loading} className="w-full py-4 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingDeal ? 'Salvar Alterações' : 'Publicar Oferta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
