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

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2 flex items-center justify-center p-1 bg-surface-container-low rounded-2xl w-fit mx-auto">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'review' })}
                  className={`px-8 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${formData.type === 'review' ? 'bg-white text-secondary shadow-sm' : 'text-on-surface-variant'}`}
                >
                  Análise Simples
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'comparativo' })}
                  className={`px-8 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${formData.type === 'comparativo' ? 'bg-white text-secondary shadow-sm' : 'text-on-surface-variant'}`}
                >
                  Comparativo (VS)
                </button>
              </div>

              <div className="md:col-span-2 space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant">
                  {formData.type === 'comparativo' ? 'Título do Duelo (Ex: A vs B)' : 'Título do Artigo'}
                </label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary focus:bg-white transition-all font-black text-xl"
                  placeholder={formData.type === 'comparativo' ? 'Ex: Nintendo Switch vs Switch OLED' : 'Ex: iPhone 17 Pro Max: A Revolução das Câmeras'}
                />
              </div>

              <div className="space-y-6">
                <ImageUpload 
                  currentImage={formData.image} 
                  onUpload={(url) => setFormData({...formData, image: url})} 
                  label="Imagem Principal (Capa)"
                />
                
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary transition-all font-label-bold appearance-none"
                  >
                    {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">
                    {formData.type === 'comparativo' ? 'Nota Geral do Duelo' : 'Nota Editorial (0-10)'}
                  </label>
                  <input
                    type="text"
                    value={formData.rating}
                    onChange={e => setFormData({...formData, rating: e.target.value})}
                    className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary transition-all font-black text-secondary"
                    placeholder="9.8"
                  />
                </div>
              </div>

              {/* Seção Produto 2 (Apenas se for Comparativo) */}
              {formData.type === 'comparativo' && (
                <div className="md:col-span-2 p-8 bg-surface-container-lowest border-2 border-dashed border-surface-container-high rounded-[2rem] space-y-8">
                  <div className="flex items-center gap-3 border-b border-surface-container-high pb-4">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center font-black text-secondary">2</div>
                    <h3 className="font-black uppercase tracking-tighter text-xl">Informações do Segundo Produto</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Nome do Produto 2</label>
                        <input
                          type="text"
                          value={formData.product2_name}
                          onChange={e => setFormData({...formData, product2_name: e.target.value})}
                          className="w-full p-4 bg-white border-2 border-surface-container-low rounded-2xl focus:border-secondary transition-all font-black"
                          placeholder="Ex: Nintendo Switch OLED"
                        />
                      </div>
                      <ImageUpload 
                        currentImage={formData.product2_image} 
                        onUpload={(url) => setFormData({...formData, product2_image: url})} 
                        label="Imagem Produto 2"
                      />
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Nota Produto 2</label>
                        <input
                          type="text"
                          value={formData.product2_rating}
                          onChange={e => setFormData({...formData, product2_rating: e.target.value})}
                          className="w-full p-4 bg-white border-2 border-surface-container-low rounded-2xl focus:border-secondary transition-all font-black text-secondary"
                          placeholder="9.1"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Preço Ref. Produto 2</label>
                        <input
                          type="text"
                          value={formData.product2_price}
                          onChange={e => setFormData({...formData, product2_price: e.target.value})}
                          className="w-full p-4 bg-white border-2 border-surface-container-low rounded-2xl focus:border-secondary transition-all font-black"
                          placeholder="R$ 2.100,00"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Link Afiliado Produto 2</label>
                        <input
                          type="url"
                          value={formData.product2_link}
                          onChange={e => setFormData({...formData, product2_link: e.target.value})}
                          className="w-full p-4 bg-white border-2 border-surface-container-low rounded-2xl focus:border-secondary transition-all font-label-bold"
                          placeholder="https://amzn.to/..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black uppercase tracking-widest text-blue-600">Prós P2</label>
                          <div className="flex gap-1">
                            <input id="p2-pro-input" type="text" className="flex-1 p-2 bg-white border border-surface-container-high rounded-lg text-[10px] font-label-bold" placeholder="Add..." />
                            <button type="button" onClick={() => {
                              const el = document.getElementById('p2-pro-input') as HTMLInputElement;
                              handleArrayInput('product2_pros', el.value);
                              el.value = '';
                            }} className="p-2 bg-blue-600 text-white rounded-lg"><Plus className="w-3 h-3" /></button>
                          </div>
                          <ul className="space-y-1">
                            {formData.product2_pros?.map((item, i) => (
                              <li key={i} className="flex items-center justify-between p-1.5 bg-blue-50 rounded-lg text-[9px] font-label-bold">
                                <span className="truncate">{item}</span>
                                <button type="button" onClick={() => removeArrayItem('product2_pros', i)} className="text-red-500"><X className="w-2.5 h-2.5" /></button>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black uppercase tracking-widest text-red-600">Contras P2</label>
                          <div className="flex gap-1">
                            <input id="p2-con-input" type="text" className="flex-1 p-2 bg-white border border-surface-container-high rounded-lg text-[10px] font-label-bold" placeholder="Add..." />
                            <button type="button" onClick={() => {
                              const el = document.getElementById('p2-con-input') as HTMLInputElement;
                              handleArrayInput('product2_cons', el.value);
                              el.value = '';
                            }} className="p-2 bg-red-600 text-white rounded-lg"><Plus className="w-3 h-3" /></button>
                          </div>
                          <ul className="space-y-1">
                            {formData.product2_cons?.map((item, i) => (
                              <li key={i} className="flex items-center justify-between p-1.5 bg-red-50 rounded-lg text-[9px] font-label-bold">
                                <span className="truncate">{item}</span>
                                <button type="button" onClick={() => removeArrayItem('product2_cons', i)} className="text-red-500"><X className="w-2.5 h-2.5" /></button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabela de Especificações */}
                  <div className="space-y-4 pt-4 border-t border-surface-container-high">
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant">Tabela Comparativa de Especificações</label>
                    <div className="grid grid-cols-4 gap-2">
                      <input id="spec-label" className="p-3 bg-white border border-surface-container-high rounded-xl text-xs font-black" placeholder="Característica (ex: Tela)" />
                      <input id="spec-p1" className="p-3 bg-white border border-surface-container-high rounded-xl text-xs" placeholder="Valor Produto 1" />
                      <input id="spec-p2" className="p-3 bg-white border border-surface-container-high rounded-xl text-xs" placeholder="Valor Produto 2" />
                      <button type="button" onClick={() => {
                        const l = document.getElementById('spec-label') as HTMLInputElement;
                        const p1 = document.getElementById('spec-p1') as HTMLInputElement;
                        const p2 = document.getElementById('spec-p2') as HTMLInputElement;
                        addSpec(l.value, p1.value, p2.value);
                        l.value = ''; p1.value = ''; p2.value = '';
                      }} className="bg-secondary text-white rounded-xl font-black uppercase text-[10px]">Add Linha</button>
                    </div>
                    <div className="space-y-2">
                      {formData.comparison_specs?.map((spec, i) => (
                        <div key={i} className="grid grid-cols-4 gap-2 items-center p-2 bg-white rounded-xl border border-surface-container-high text-xs">
                          <div className="font-black text-secondary">{spec.label}</div>
                          <div className="truncate">{spec.p1}</div>
                          <div className="truncate">{spec.p2}</div>
                          <button type="button" onClick={() => removeSpec(i)} className="text-red-500 flex justify-center"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Resumo (Excerpt)</label>
                  <textarea
                    rows={4}
                    value={formData.excerpt}
                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                    className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary transition-all font-label-bold"
                    placeholder="Pequeno texto chamativo para a listagem..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Preço de Referência</label>
                  <input
                    type="text"
                    value={formData.buy_price}
                    onChange={e => setFormData({...formData, buy_price: e.target.value})}
                    className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary transition-all font-black"
                    placeholder="R$ 7.999,00"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Link de Afiliado</label>
                  <input
                    type="url"
                    value={formData.buy_link}
                    onChange={e => setFormData({...formData, buy_link: e.target.value})}
                    className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary transition-all font-label-bold"
                    placeholder="https://amzn.to/..."
                  />
                </div>
              </div>

              {/* LISTAS DINÂMICAS */}
              <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Benefícios */}
                  <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant">Principais Benefícios</label>
                    <div className="flex gap-2">
                      <input id="benefit-input" type="text" className="flex-1 p-3 bg-surface-container-low rounded-xl text-xs font-label-bold" placeholder="Add benefício..." />
                      <button type="button" onClick={() => {
                        const el = document.getElementById('benefit-input') as HTMLInputElement;
                        handleArrayInput('benefits', el.value);
                        el.value = '';
                      }} className="p-3 bg-secondary text-white rounded-xl"><Plus className="w-4 h-4" /></button>
                    </div>
                    <ul className="space-y-2">
                      {formData.benefits?.map((item, i) => (
                        <li key={i} className="flex items-center justify-between p-2 bg-green-50 rounded-lg text-[11px] font-label-bold">
                          <span className="truncate flex-1">{item}</span>
                          <button type="button" onClick={() => removeArrayItem('benefits', i)} className="text-red-500 ml-2"><Trash2 className="w-3 h-3" /></button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prós */}
                  <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant text-blue-600">Prós</label>
                    <div className="flex gap-2">
                      <input id="pro-input" type="text" className="flex-1 p-3 bg-surface-container-low rounded-xl text-xs font-label-bold" placeholder="Add pró..." />
                      <button type="button" onClick={() => {
                        const el = document.getElementById('pro-input') as HTMLInputElement;
                        handleArrayInput('pros', el.value);
                        el.value = '';
                      }} className="p-3 bg-blue-600 text-white rounded-xl"><Plus className="w-4 h-4" /></button>
                    </div>
                    <ul className="space-y-2">
                      {formData.pros?.map((item, i) => (
                        <li key={i} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg text-[11px] font-label-bold">
                          <span className="truncate flex-1">{item}</span>
                          <button type="button" onClick={() => removeArrayItem('pros', i)} className="text-red-500 ml-2"><Trash2 className="w-3 h-3" /></button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contras */}
                  <div className="space-y-4">
                    <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant text-red-600">Contras</label>
                    <div className="flex gap-2">
                      <input id="con-input" type="text" className="flex-1 p-3 bg-surface-container-low rounded-xl text-xs font-label-bold" placeholder="Add contra..." />
                      <button type="button" onClick={() => {
                        const el = document.getElementById('con-input') as HTMLInputElement;
                        handleArrayInput('cons', el.value);
                        el.value = '';
                      }} className="p-3 bg-red-600 text-white rounded-xl"><Plus className="w-4 h-4" /></button>
                    </div>
                    <ul className="space-y-2">
                      {formData.cons?.map((item, i) => (
                        <li key={i} className="flex items-center justify-between p-2 bg-red-50 rounded-lg text-[11px] font-label-bold">
                          <span className="truncate flex-1">{item}</span>
                          <button type="button" onClick={() => removeArrayItem('cons', i)} className="text-red-500 ml-2"><Trash2 className="w-3 h-3" /></button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant">Para quem é este produto?</label>
                <input
                  type="text"
                  value={formData.for_whom}
                  onChange={e => setFormData({...formData, for_whom: e.target.value})}
                  className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary transition-all font-label-bold"
                  placeholder="Ex: Criadores de conteúdo e profissionais liberais..."
                />
              </div>

              <div className="md:col-span-2 space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant">Conteúdo Completo (Análise Profunda / Veredito)</label>
                <div className="bg-white rounded-2xl overflow-hidden border-2 border-surface-container-low focus-within:border-secondary transition-all">
                  <ReactQuill 
                    theme="snow"
                    value={formData.content}
                    onChange={val => setFormData({...formData, content: val})}
                    className="h-64 mb-12"
                  />
                </div>
              </div>

              <div className="md:col-span-2 pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : editingReview ? 'Atualizar Avaliação' : 'Publicar Avaliação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
