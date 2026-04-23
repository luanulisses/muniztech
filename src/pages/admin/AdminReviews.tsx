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
  benefits: string[];
  pros: string[];
  cons: string[];
  for_whom: string;
  buy_link: string;
  buy_price: string;
  author: string;
  date: string;
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
    benefits: [],
    pros: [],
    cons: [],
    for_whom: '',
    buy_link: '',
    buy_price: '',
    author: 'Muniz',
    date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
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
      setFormData(review);
    } else {
      setEditingReview(null);
      setFormData({
        title: '',
        slug: '',
        category: categories[0]?.name || 'Smartphones',
        rating: '9.0',
        image: '',
        excerpt: '',
        benefits: [],
        pros: [],
        cons: [],
        for_whom: '',
        buy_link: '',
        buy_price: '',
        author: 'Muniz',
        date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
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

  const handleArrayInput = (field: 'benefits' | 'pros' | 'cons', value: string) => {
    if (!value.trim()) return;
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), value]
    });
  };

  const removeArrayItem = (field: 'benefits' | 'pros' | 'cons', index: number) => {
    const newArr = [...(formData[field] || [])];
    newArr.splice(index, 1);
    setFormData({ ...formData, [field]: newArr });
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
              <div className="md:col-span-2 space-y-4">
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant">Título do Artigo</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary focus:bg-white transition-all font-black text-xl"
                  placeholder="Ex: iPhone 17 Pro Max: A Revolução das Câmeras"
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
                  <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Nota Editorial (0-10)</label>
                  <input
                    type="text"
                    value={formData.rating}
                    onChange={e => setFormData({...formData, rating: e.target.value})}
                    className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary transition-all font-black text-secondary"
                    placeholder="9.8"
                  />
                </div>
              </div>

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
