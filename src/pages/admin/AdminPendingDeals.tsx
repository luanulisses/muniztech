import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle, XCircle, ExternalLink, RefreshCw, Plus, X, Search, Sparkles, Image as ImageIcon } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface PendingDeal {
  id: string;
  title: string;
  image: string;
  price: string;
  original_price: string;
  discount: string;
  store: string;
  source_url: string;
  status: string;
  created_at: string;
}

export default function AdminPendingDeals() {
  const [pendingDeals, setPendingDeals] = useState<PendingDeal[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado local para os campos de cada oferta sendo aprovada
  const [affiliateLinks, setAffiliateLinks] = useState<Record<string, string>>({});
  const [selectedCategories, setSelectedCategories] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeal, setNewDeal] = useState({
    title: '',
    image: '',
    price: '',
    original_price: '',
    discount: '',
    store: 'Shopee',
    source_url: '',
    affiliate_link: '',
  });

  const handleFetchShopeeData = async () => {
    if (!newDeal.source_url) {
      alert("Por favor, cole o link da Shopee primeiro.");
      return;
    }
    setScrapeLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-shopee-data', {
        body: { url: newDeal.source_url }
      });
      
      if (error) throw error;
      if (!data) throw new Error("Sem resposta da função.");

      if (data.error) {
        alert("⚠️ " + data.error);
        return;
      }

      setNewDeal(prev => ({
        ...prev,
        title: data.title || prev.title,
        image: data.image || prev.image,
        price: data.price || prev.price,
        original_price: data.original_price || prev.original_price,
      }));

      if (data.partial) {
        alert("✅ Título preenchido a partir do link!\n\nA Shopee bloqueou o robô desta vez, então preencha o preço e a imagem manualmente.");
      }

    } catch (err: any) {
      console.error(err);
      alert("⚠️ " + (err.message || "Erro desconhecido ao buscar dados."));
    } finally {
      setScrapeLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const [dealsRes, catsRes] = await Promise.all([
      supabase.from('pending_deals').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
      supabase.from('categories').select('name').order('name')
    ]);
    
    if (dealsRes.data) setPendingDeals(dealsRes.data);
    if (catsRes.data) setCategories(catsRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (deal: PendingDeal) => {
    const affiliateLink = affiliateLinks[deal.id];
    const category = selectedCategories[deal.id] || categories[0]?.name || 'Ofertas';

    if (!affiliateLink) {
      alert("Por favor, insira o link de afiliado antes de aprovar.");
      return;
    }

    setActionLoading(deal.id);

    // 1. Gerar slug
    const slug = deal.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    // 2. Montar objeto final para tabela deals
    const finalDeal = {
      title: deal.title,
      slug: slug,
      price: deal.price,
      original_price: deal.original_price,
      discount: deal.discount,
      store: deal.store,
      link: affiliateLink || (deal as any).affiliate_link,
      image: deal.image,
      category: category,
      is_achadinho: false,
      views: 0
    };

    try {
      // 3. Inserir na tabela deals (Isso dispara o Webhook do Telegram)
      const { error: insertError } = await supabase.from('deals').insert([finalDeal]);
      if (insertError) throw insertError;

      // 4. Marcar como aprovado em pending_deals
      await supabase.from('pending_deals').update({ status: 'approved' }).eq('id', deal.id);

      // Atualizar lista
      setPendingDeals(prev => prev.filter(d => d.id !== deal.id));
    } catch (err: any) {
      alert("Erro ao aprovar oferta: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await supabase.from('pending_deals').update({ status: 'rejected' }).eq('id', id);
      setPendingDeals(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Calcular desconto se possível
      let discount = newDeal.discount;
      if (!discount && newDeal.price && newDeal.original_price) {
        const p = parseFloat(newDeal.price.replace(/[^\d,]/g, '').replace(',', '.'));
        const o = parseFloat(newDeal.original_price.replace(/[^\d,]/g, '').replace(',', '.'));
        if (o > p) {
          discount = Math.round(((o - p) / o) * 100) + '%';
        }
      }

      const { data, error } = await supabase
        .from('pending_deals')
        .insert([{ ...newDeal, discount: discount || newDeal.discount, status: 'pending' }])
        .select();

      if (error) throw error;
      
      if (data) {
        setPendingDeals(prev => [data[0], ...prev]);
        setIsModalOpen(false);
        setNewDeal({
          title: '',
          image: '',
          price: '',
          original_price: '',
          discount: '',
          store: 'Shopee',
          source_url: '',
          affiliate_link: '',
        });
      }
    } catch (err: any) {
      alert("Erro ao adicionar oferta: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceMask = (val: string, field: 'price' | 'original_price') => {
    const digits = val.replace(/\D/g, '');
    if (!digits) {
      setNewDeal(prev => ({ ...prev, [field]: '' }));
      return;
    }
    const num = parseInt(digits, 10) / 100;
    const masked = num.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });
    setNewDeal(prev => ({ ...prev, [field]: masked }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight">Ofertas Pendentes 🔥</h1>
          <p className="text-on-surface-variant font-label-bold">Ofertas garimpadas pelo robô aguardando aprovação.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-white rounded-xl font-black uppercase tracking-widest text-sm transition-all hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" /> Add Shopee Manual
          </button>
          <button 
            onClick={fetchData}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-surface-container-high text-on-surface rounded-xl font-black uppercase tracking-widest text-sm transition-colors hover:bg-surface-container-highest"
          >
            <RefreshCw className="w-5 h-5" /> Atualizar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-secondary animate-spin" />
        </div>
      ) : pendingDeals.length === 0 ? (
        <div className="bg-white border border-surface-container-high rounded-[2rem] p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-xl font-black text-on-surface uppercase mb-2">Nenhuma oferta nova</h2>
          <p className="text-on-surface-variant font-label-bold">O robô está procurando mais ofertas. Volte mais tarde!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pendingDeals.map(deal => (
            <div key={deal.id} className="bg-white border border-surface-container-high rounded-[2rem] overflow-hidden shadow-sm flex flex-col">
              <div className="p-6 flex-grow flex gap-6">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-surface-container-low shrink-0 border border-surface-container-high">
                  <img src={deal.image} alt={deal.title} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="flex flex-col justify-between min-w-0">
                  <div>
                    <span className="px-2 py-1 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest rounded-md mb-2 inline-block">
                      {deal.store}
                    </span>
                    <h3 className="font-black text-on-surface text-lg leading-tight line-clamp-2 mb-2" title={deal.title}>
                      {deal.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-black text-secondary">{deal.price}</span>
                      {deal.original_price && (
                        <span className="text-sm font-label-bold text-on-surface-variant line-through">{deal.original_price}</span>
                      )}
                      {deal.discount && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-black rounded-md">-{deal.discount}</span>
                      )}
                    </div>
                  </div>
                  <a href={deal.source_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm font-black text-blue-600 hover:underline mt-2">
                    <ExternalLink className="w-4 h-4" /> Ver no site original
                  </a>
                </div>
              </div>

              <div className="bg-surface-container-lowest border-t border-surface-container-high p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Link de Afiliado (Obrigatório)</label>
                    <input 
                      type="url" 
                      placeholder="Cole seu link de afiliado aqui..."
                      value={affiliateLinks[deal.id] || ''}
                      onChange={(e) => setAffiliateLinks(prev => ({ ...prev, [deal.id]: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-surface-container-high rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary transition-all font-label-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Categoria</label>
                    <select 
                      value={selectedCategories[deal.id] || categories[0]?.name || ''}
                      onChange={(e) => setSelectedCategories(prev => ({ ...prev, [deal.id]: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border border-surface-container-high rounded-xl focus:border-secondary focus:ring-1 focus:ring-secondary transition-all font-label-bold text-sm"
                    >
                      {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button 
                    onClick={() => handleApprove(deal)}
                    disabled={actionLoading === deal.id || !affiliateLinks[deal.id]}
                    className="flex-1 py-3 bg-secondary text-white rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-secondary-fixed-variant transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === deal.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle className="w-5 h-5" /> Aprovar</>}
                  </button>
                  <button 
                    onClick={() => handleReject(deal.id)}
                    disabled={actionLoading === deal.id}
                    className="py-3 px-4 bg-surface-container-high text-on-surface-variant hover:text-red-600 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center transition-colors disabled:opacity-50"
                    title="Rejeitar Oferta (Excluir)"
                  >
                    {actionLoading === deal.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para Adição Manual */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-on-surface uppercase tracking-tight">Novo Shopee Pendente 🛍️</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container-low rounded-full"><X className="w-6 h-6 text-on-surface-variant" /></button>
            </div>

            <form onSubmit={handleManualAdd} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">URL do Produto (Shopee)</label>
                <div className="flex gap-2">
                  <input 
                    required
                    type="url" 
                    placeholder="https://shopee.com.br/..."
                    value={newDeal.source_url}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, source_url: e.target.value }))}
                    className="flex-grow px-4 py-3 bg-surface-container-low border-2 border-transparent rounded-xl focus:border-secondary focus:bg-white transition-all font-label-bold text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleFetchShopeeData}
                    disabled={scrapeLoading || !newDeal.source_url}
                    className="px-4 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-xl transition-colors flex items-center justify-center disabled:opacity-50"
                    title="Buscar dados automaticamente"
                  >
                    {scrapeLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-[9px] text-on-surface-variant mt-1 italic">Cole o link e clique na varinha para preencher automático ✨</p>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Título do Produto</label>
                <input 
                  required
                  type="text" 
                  placeholder="Ex: Fone de Ouvido Bluetooth JBL"
                  value={newDeal.title}
                  onChange={(e) => setNewDeal(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-surface-container-low border-2 border-transparent rounded-xl focus:border-secondary focus:bg-white transition-all font-label-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Preço Atual</label>
                  <input 
                    required
                    type="text" 
                    placeholder="R$ 0,00"
                    value={newDeal.price}
                    onChange={(e) => handlePriceMask(e.target.value, 'price')}
                    className="w-full px-4 py-3 bg-surface-container-low border-2 border-transparent rounded-xl focus:border-secondary focus:bg-white transition-all font-label-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Preço Original</label>
                  <input 
                    type="text" 
                    placeholder="R$ 0,00"
                    value={newDeal.original_price}
                    onChange={(e) => handlePriceMask(e.target.value, 'original_price')}
                    className="w-full px-4 py-3 bg-surface-container-low border-2 border-transparent rounded-xl focus:border-secondary focus:bg-white transition-all font-label-bold text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <ImageUpload 
                  onUpload={(url) => setNewDeal(prev => ({ ...prev, image: url }))}
                  currentImage={newDeal.image}
                  label="Imagem do Produto (Upload ou URL abaixo)"
                />
                
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Ou cole a URL da Imagem</label>
                  <input 
                    type="url" 
                    placeholder="https://cf.shopee.com.br/file/..."
                    value={newDeal.image}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-container-low border-2 border-transparent rounded-xl focus:border-secondary focus:bg-white transition-all font-label-bold text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1 text-secondary">Link de Afiliado (Se já tiver)</label>
                <input 
                  type="url" 
                  placeholder="https://shope.ee/..."
                  value={newDeal.affiliate_link}
                  onChange={(e) => setNewDeal(prev => ({ ...prev, affiliate_link: e.target.value }))}
                  className="w-full px-4 py-3 bg-secondary/5 border-2 border-secondary/20 rounded-xl focus:border-secondary focus:bg-white transition-all font-label-bold text-sm"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-secondary text-white rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-secondary-fixed-variant transition-all shadow-lg active:scale-95"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Salvar em Pendentes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
