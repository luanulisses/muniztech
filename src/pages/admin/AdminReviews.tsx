import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Search, Edit2, Trash2, 
  X, Loader2, Star, Check, AlertCircle
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import ImageUpload from '@/components/admin/ImageUpload';

interface ReviewDB {
  id: string;
  title: string;
  slug: string;
  category: string;
  rating: string;
  image: string;
  excerpt: string;
  content: string;
  type: 'review' | 'comparativo';
  benefits: string[];
  pros: string[];
  cons: string[];
  for_whom: string;
  buy_link: string;
  buy_price: string;
  author: string;
  date: string;

  // Comparativo
  product2_name?: string;
  product2_rating?: string;
  product2_pros?: string[];
  product2_cons?: string[];
  product2_link?: string;
  product2_price?: string;
  product2_image?: string;
  comparison_specs?: { label: string; p1: string; p2: string }[];
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<ReviewDB[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewDB | null>(null);

  const [formData, setFormData] = useState<Partial<ReviewDB>>({
    title: '',
    slug: '',
    category: 'Smartphones',
    rating: '9.0',
    image: '',
    excerpt: '',
    content: '',
    type: 'review',
    benefits: [],
    pros: [],
    cons: [],
    for_whom: '',
    buy_link: '',
    buy_price: '',
    author: 'Muniz',
    date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
    product2_pros: [],
    product2_cons: [],
    comparison_specs: []
  });

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (data) setReviews(data);
    
    const { data: catData } = await supabase.from('categories').select('name').order('name');
    if (catData) setCategories(catData);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleOpenModal = (review?: ReviewDB) => {
    if (review) {
      setEditingReview(review);
      setFormData({
        ...review,
        product2_pros: review.product2_pros || [],
        product2_cons: review.product2_cons || [],
        comparison_specs: review.comparison_specs || []
      });
    } else {
      setEditingReview(null);
      setFormData({
        title: '',
        slug: '',
        category: categories[0]?.name || 'Smartphones',
        rating: '9.0',
        image: '',
        excerpt: '',
        content: '',
        type: 'review',
        benefits: [],
        pros: [],
        cons: [],
        for_whom: '',
        buy_link: '',
        buy_price: '',
        author: 'Muniz',
        date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
        product2_pros: [],
        product2_cons: [],
        comparison_specs: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const slug = formData.slug || formData.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const reviewData = { ...formData, slug };

    if (editingReview) {
      await supabase.from('reviews').update(reviewData).eq('id', editingReview.id);
    } else {
      await supabase.from('reviews').insert([reviewData]);
    }

    setIsModalOpen(false);
    fetchReviews();
  };

  const handleArrayInput = (field: 'benefits' | 'pros' | 'cons' | 'product2_pros' | 'product2_cons', value: string) => {
    if (!value.trim()) return;
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), value]
    });
  };

  const removeArrayItem = (field: 'benefits' | 'pros' | 'cons' | 'product2_pros' | 'product2_cons', index: number) => {
    const newArr = [...(formData[field] || [])];
    newArr.splice(index, 1);
    setFormData({ ...formData, [field]: newArr });
  };

  const addSpec = (label: string, p1: string, p2: string) => {
    if (!label.trim()) return;
    setFormData({
      ...formData,
      comparison_specs: [...(formData.comparison_specs || []), { label, p1, p2 }]
    });
  };

  const removeSpec = (index: number) => {
    const newSpecs = [...(formData.comparison_specs || [])];
    newSpecs.splice(index, 1);
    setFormData({ ...formData, comparison_specs: newSpecs });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight">Avaliações</h1>
          <p className="text-on-surface-variant font-label-bold mt-2">Crie reviews profundos e guias de compra.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl font-black uppercase tracking-widest text-sm shadow-lg hover:bg-secondary-fixed-variant transition-all"
        >
          <Plus className="w-5 h-5" /> Nova Avaliação
        </button>
      </div>

      <div className="bg-white border border-surface-container-high rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-lowest border-b border-surface-container-high">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">Artigo</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">Categoria</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant">Nota</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-on-surface-variant text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {loading && reviews.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center"><Loader2 className="w-8 h-8 text-secondary animate-spin mx-auto" /></td></tr>
              ) : reviews.map((review) => (
                <tr key={review.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-surface-container-high">
                        <img src={review.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="font-black text-on-surface truncate max-w-[300px]">{review.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-[10px] font-black uppercase tracking-widest rounded-lg">
                      {review.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 font-black text-secondary">
                      <Star className="w-4 h-4 fill-current" /> {review.rating}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleOpenModal(review)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-on-surface uppercase tracking-tight">
                {editingReview ? 'Editar Avaliação' : 'Nova Avaliação'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container-low rounded-full">
                <X className="w-6 h-6 text-on-surface-variant" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              {/* ── SEÇÃO 0: CONFIGURAÇÕES GERAIS ── */}
              <div className="bg-surface-container-low p-8 rounded-[2rem] border border-surface-container-high shadow-sm space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                       <Info className="w-5 h-5 text-secondary" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-on-surface">Configurações Gerais</h3>
                  </div>
                  <div className="flex items-center p-1 bg-white rounded-2xl shadow-inner border border-surface-container-low">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'review' })}
                      className={`px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${formData.type === 'review' ? 'bg-secondary text-white shadow-md' : 'text-on-surface-variant'}`}
                    >
                      Análise Simples
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'comparativo' })}
                      className={`px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${formData.type === 'comparativo' ? 'bg-secondary text-white shadow-md' : 'text-on-surface-variant'}`}
                    >
                      Comparativo (VS)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-8 space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                      {formData.type === 'comparativo' ? 'Título do Duelo (Ex: Nintendo Switch vs OLED)' : 'Título da Análise'}
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full p-4 bg-white border-2 border-transparent rounded-2xl focus:border-secondary transition-all font-black text-xl shadow-sm"
                      placeholder="Ex: Nintendo Switch vs Switch OLED"
                    />
                  </div>
                  <div className="md:col-span-4 space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Categoria</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full p-4 bg-white border-2 border-transparent rounded-2xl focus:border-secondary transition-all font-black text-xs uppercase tracking-widest shadow-sm appearance-none"
                    >
                      {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* ── SEÇÃO 1: PRODUTO 1 ── */}
                <div className={`p-8 rounded-[2.5rem] border-2 transition-all space-y-8 ${formData.type === 'comparativo' ? 'border-secondary/30 bg-secondary/[0.02]' : 'border-surface-container-high bg-white'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center font-black text-lg shadow-lg">1</div>
                    <div>
                      <h3 className="font-black uppercase tracking-tighter text-2xl">
                        {formData.type === 'comparativo' ? 'Primeiro Produto' : 'Informações do Produto'}
                      </h3>
                      <p className="text-[10px] font-label-bold text-on-surface-variant uppercase tracking-widest mt-1">Dados principais da análise</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <ImageUpload 
                      currentImage={formData.image} 
                      onUpload={(url) => setFormData({...formData, image: url})} 
                      label="Capa / Imagem do Produto"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Nota (0-10)</label>
                        <input
                          type="text"
                          value={formData.rating}
                          onChange={e => setFormData({...formData, rating: e.target.value})}
                          className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary transition-all font-black text-secondary"
                          placeholder="9.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Preço de Ref.</label>
                        <input
                          type="text"
                          value={formData.buy_price}
                          onChange={e => {
                            let val = e.target.value.replace(/[^\d]/g, '');
                            if (val) {
                              const floatVal = parseFloat(val) / 100;
                              val = floatVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                            }
                            setFormData({...formData, buy_price: val});
                          }}
                          className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary transition-all font-black"
                          placeholder="R$ 0,00"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Link de Compra</label>
                      <input
                        type="url"
                        value={formData.buy_link}
                        onChange={e => setFormData({...formData, buy_link: e.target.value})}
                        className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary transition-all font-label-bold text-xs"
                        placeholder="https://..."
                      />
                    </div>

                    {/* Prós e Contras P1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-blue-600">Pontos Positivos</label>
                        <div className="flex gap-2">
                          <input id="p1-pro-input" type="text" className="flex-1 p-3 bg-surface-container-low rounded-xl text-xs font-label-bold" placeholder="Add..." />
                          <button type="button" onClick={() => {
                            const el = document.getElementById('p1-pro-input') as HTMLInputElement;
                            handleArrayInput('pros', el.value); el.value = '';
                          }} className="p-3 bg-blue-600 text-white rounded-xl"><Plus className="w-4 h-4" /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.pros?.map((item, i) => (
                            <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[9px] font-black flex items-center gap-1.5">
                              {item} <button type="button" onClick={() => removeArrayItem('pros', i)}><X className="w-3 h-3" /></button>
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-red-600">Pontos Negativos</label>
                        <div className="flex gap-2">
                          <input id="p1-con-input" type="text" className="flex-1 p-3 bg-surface-container-low rounded-xl text-xs font-label-bold" placeholder="Add..." />
                          <button type="button" onClick={() => {
                            const el = document.getElementById('p1-con-input') as HTMLInputElement;
                            handleArrayInput('cons', el.value); el.value = '';
                          }} className="p-3 bg-red-600 text-white rounded-xl"><Plus className="w-4 h-4" /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.cons?.map((item, i) => (
                            <span key={i} className="px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-[9px] font-black flex items-center gap-1.5">
                              {item} <button type="button" onClick={() => removeArrayItem('cons', i)}><X className="w-3 h-3" /></button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── SEÇÃO 2: PRODUTO 2 ── */}
                <div className="space-y-12">
                {formData.type === 'comparativo' ? (
                  <div className="p-8 rounded-[2.5rem] border-2 border-blue-200 bg-blue-50/[0.15] space-y-8 h-full">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-lg shadow-lg">2</div>
                      <div>
                        <h3 className="font-black uppercase tracking-tighter text-2xl">Segundo Produto</h3>
                        <p className="text-[10px] font-label-bold text-on-surface-variant uppercase tracking-widest mt-1">Dados do desafiante</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Nome do Produto 2</label>
                        <input
                          type="text"
                          value={formData.product2_name}
                          onChange={e => setFormData({...formData, product2_name: e.target.value})}
                          className="w-full p-4 bg-white border-2 border-transparent rounded-2xl focus:border-blue-600 transition-all font-black shadow-sm"
                          placeholder="Ex: Nintendo Switch OLED"
                        />
                      </div>

                      <ImageUpload 
                        currentImage={formData.product2_image} 
                        onUpload={(url) => setFormData({...formData, product2_image: url})} 
                        label="Imagem do Produto 2"
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Nota (0-10)</label>
                          <input
                            type="text"
                            value={formData.product2_rating}
                            onChange={e => setFormData({...formData, product2_rating: e.target.value})}
                            className="w-full p-4 bg-white border-2 border-transparent rounded-2xl focus:border-blue-600 transition-all font-black text-blue-600 shadow-sm"
                            placeholder="9.1"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Preço de Ref.</label>
                          <input
                            type="text"
                            value={formData.product2_price}
                            onChange={e => {
                              let val = e.target.value.replace(/[^\d]/g, '');
                              if (val) {
                                const floatVal = parseFloat(val) / 100;
                                val = floatVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                              }
                              setFormData({...formData, product2_price: val});
                            }}
                            className="w-full p-4 bg-white border-2 border-transparent rounded-2xl focus:border-blue-600 transition-all font-black shadow-sm"
                            placeholder="R$ 0,00"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Link de Compra P2</label>
                        <input
                          type="url"
                          value={formData.product2_link}
                          onChange={e => setFormData({...formData, product2_link: e.target.value})}
                          className="w-full p-4 bg-white border-2 border-transparent rounded-2xl focus:border-blue-600 transition-all font-label-bold text-xs shadow-sm"
                          placeholder="https://..."
                        />
                      </div>

                      {/* Prós e Contras P2 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black uppercase tracking-widest text-blue-600">Pontos Positivos P2</label>
                          <div className="flex gap-2">
                            <input id="p2-pro-input" type="text" className="flex-1 p-3 bg-white rounded-xl text-xs font-label-bold border border-surface-container-high" placeholder="Add..." />
                            <button type="button" onClick={() => {
                              const el = document.getElementById('p2-pro-input') as HTMLInputElement;
                              handleArrayInput('product2_pros', el.value); el.value = '';
                            }} className="p-3 bg-blue-600 text-white rounded-xl"><Plus className="w-4 h-4" /></button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.product2_pros?.map((item, i) => (
                              <span key={i} className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-[9px] font-black flex items-center gap-1.5">
                                {item} <button type="button" onClick={() => removeArrayItem('product2_pros', i)}><X className="w-3 h-3" /></button>
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black uppercase tracking-widest text-red-600">Pontos Negativos P2</label>
                          <div className="flex gap-2">
                            <input id="p2-con-input" type="text" className="flex-1 p-3 bg-white rounded-xl text-xs font-label-bold border border-surface-container-high" placeholder="Add..." />
                            <button type="button" onClick={() => {
                              const el = document.getElementById('p2-con-input') as HTMLInputElement;
                              handleArrayInput('product2_cons', el.value); el.value = '';
                            }} className="p-3 bg-red-600 text-white rounded-xl"><Plus className="w-4 h-4" /></button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.product2_cons?.map((item, i) => (
                              <span key={i} className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-[9px] font-black flex items-center gap-1.5">
                                {item} <button type="button" onClick={() => removeArrayItem('product2_cons', i)}><X className="w-3 h-3" /></button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Placeholder no modo Simples */
                  <div className="bg-surface-container-low p-12 rounded-[2.5rem] border-2 border-dashed border-surface-container-high flex flex-col items-center justify-center text-center space-y-4 h-full">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                       <Swords className="w-8 h-8 text-on-surface-variant/20" />
                    </div>
                    <div>
                      <h4 className="font-black text-on-surface">Modo Análise Simples</h4>
                      <p className="text-xs font-label-bold text-on-surface-variant max-w-[280px] mx-auto mt-2">
                        Adicione um segundo produto mudando para "Comparativo".
                      </p>
                    </div>
                  </div>
                )}
                </div>
              </div>

              {/* ── SEÇÃO 3: TABELA DE SPECS ── */}
              {formData.type === 'comparativo' && (
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-surface-container-high space-y-6">
                   <div className="flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-secondary" />
                      <h3 className="font-black uppercase tracking-tight text-xl">Tabela Comparativa</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface-container-low p-4 rounded-2xl">
                      <input id="spec-label" className="p-3 bg-white rounded-xl border border-transparent focus:border-secondary outline-none font-black text-xs" placeholder="Característica (Ex: Tela)" />
                      <input id="spec-p1" className="p-3 bg-white rounded-xl border border-transparent focus:border-secondary outline-none font-label-bold text-xs" placeholder="Valor Produto 1" />
                      <input id="spec-p2" className="p-3 bg-white rounded-xl border border-transparent focus:border-secondary outline-none font-label-bold text-xs" placeholder="Valor Produto 2" />
                      <button type="button" onClick={() => {
                        const l = document.getElementById('spec-label') as HTMLInputElement;
                        const v1 = document.getElementById('spec-p1') as HTMLInputElement;
                        const v2 = document.getElementById('spec-p2') as HTMLInputElement;
                        if (l.value) {
                          setFormData({...formData, comparison_specs: [...(formData.comparison_specs || []), { label: l.value, p1: v1.value, p2: v2.value }]});
                          l.value = ''; v1.value = ''; v2.value = '';
                        }
                      }} className="bg-secondary text-white rounded-xl font-black uppercase text-[10px] tracking-widest">Adicionar</button>
                   </div>
                   <div className="overflow-hidden rounded-2xl border border-surface-container-high">
                      <table className="w-full">
                        <tbody className="divide-y divide-surface-container-high">
                           {formData.comparison_specs?.map((spec, i) => (
                             <tr key={i} className="text-xs hover:bg-surface-container-lowest">
                               <td className="px-4 py-3 font-black text-secondary w-1/3">{spec.label}</td>
                               <td className="px-4 py-3 font-label-bold">{spec.p1}</td>
                               <td className="px-4 py-3 font-label-bold">{spec.p2}</td>
                               <td className="px-4 py-3 text-right">
                                  <button type="button" onClick={() => setFormData({...formData, comparison_specs: formData.comparison_specs?.filter((_, idx) => idx !== i)})} className="text-red-500 hover:scale-110 transition-transform"><X className="w-4 h-4" /></button>
                               </td>
                             </tr>
                           ))}
                        </tbody>
                      </table>
                   </div>
                </div>
              )}

              {/* ── SEÇÃO 4: VEREDITO & PÚBLICO ── */}
              <div className="bg-white p-8 rounded-[2.5rem] border-2 border-surface-container-high space-y-8">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-secondary" />
                  <h3 className="font-black uppercase tracking-tight text-xl">Veredito & Público-Alvo</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Benefícios (Veredito Rápido) */}
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Benefícios do Veredito Rápido</label>
                    <div className="flex gap-2">
                      <input id="benefit-input" type="text" className="flex-1 p-3 bg-surface-container-low rounded-xl text-xs font-label-bold" placeholder="Ex: Melhor bateria da categoria..." />
                      <button type="button" onClick={() => {
                        const el = document.getElementById('benefit-input') as HTMLInputElement;
                        handleArrayInput('benefits', el.value); el.value = '';
                      }} className="p-3 bg-secondary text-white rounded-xl"><Plus className="w-4 h-4" /></button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.benefits?.map((item, i) => (
                        <span key={i} className="px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-[9px] font-black flex items-center gap-1.5 border border-green-100">
                          {item} <button type="button" onClick={() => removeArrayItem('benefits', i)}><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Público Alvo */}
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Para quem é este produto?</label>
                    <textarea
                      rows={3}
                      value={formData.for_whom}
                      onChange={e => setFormData({...formData, for_whom: e.target.value})}
                      className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary transition-all font-label-bold text-sm"
                      placeholder="Ex: Criadores de conteúdo que buscam mobilidade..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Resumo Chamativo (Excerpt)</label>
                  <textarea
                    rows={3}
                    value={formData.excerpt}
                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                    className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary transition-all font-label-bold text-sm"
                    placeholder="Um pequeno texto que convida o leitor a clicar..."
                  />
                </div>
              </div>

              {/* ── SEÇÃO 5: CONTEÚDO RICO ── */}
              <div className="space-y-4 bg-white p-8 rounded-[2.5rem] border-2 border-surface-container-high">
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Análise Detalhada / Veredito Final (Editor Rico)</label>
                <div className="bg-white border-2 border-surface-container-low rounded-[2rem] overflow-hidden min-h-[400px]">
                  <ReactQuill 
                    theme="snow"
                    value={formData.content}
                    onChange={val => setFormData({...formData, content: val})}
                    className="h-[350px]"
                  />
                </div>
              </div>

              {/* ── AÇÕES ── */}
              <div className="flex items-center gap-4 pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-5 bg-secondary text-white rounded-[1.5rem] font-black uppercase tracking-widest text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading ? 'Processando...' : editingReview ? 'Salvar Alterações' : 'Publicar Agora'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-10 py-5 bg-surface-container-high text-on-surface-variant rounded-[1.5rem] font-black uppercase tracking-widest text-sm hover:bg-surface-container-highest transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
