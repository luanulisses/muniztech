import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Search, Edit2, Trash2, 
  X, Loader2, Tag, Info
} from 'lucide-react';
import * as Icons from 'lucide-react';

interface CategoryDB {
  id: string;
  name: string;
  slug: string;
  icon: string;
  tagline: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDB | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: 'Tag',
    tagline: ''
  });

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (data) setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (cat?: CategoryDB) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        tagline: cat.tagline || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        icon: 'Tag',
        tagline: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta categoria pode afetar ofertas e reviews vinculados. Continuar?')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) fetchCategories();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const slug = formData.slug || formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const catData = { ...formData, slug };

    if (editingCategory) {
      await supabase.from('categories').update(catData).eq('id', editingCategory.id);
    } else {
      await supabase.from('categories').insert([catData]);
    }

    setIsModalOpen(false);
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight">Categorias</h1>
          <p className="text-on-surface-variant font-label-bold mt-2">Organize o conteúdo do portal.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-xl font-black uppercase tracking-widest text-sm shadow-lg hover:bg-secondary-fixed-variant"
        >
          <Plus className="w-5 h-5" /> Nova Categoria
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && categories.length === 0 ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-secondary animate-spin" />
          </div>
        ) : categories.map((cat) => {
          const IconComp = (Icons as any)[cat.icon] || Tag;
          return (
            <div key={cat.id} className="bg-white p-6 rounded-[2rem] border border-surface-container-high shadow-sm hover:shadow-md transition-shadow group relative">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-secondary">
                  <IconComp className="w-6 h-6" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-black text-on-surface mb-1">{cat.name}</h3>
              <p className="text-xs text-on-surface-variant font-label-bold mb-4">/{cat.slug}</p>
              <div className="p-3 bg-surface-container-lowest rounded-xl border border-dashed border-surface-container-high text-[11px] font-label-bold text-on-surface-variant italic">
                "{cat.tagline || 'Sem tagline definida'}"
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-on-surface uppercase tracking-tight">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-container-low rounded-full">
                <X className="w-6 h-6 text-on-surface-variant" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Nome</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary focus:bg-white transition-all font-label-bold"
                  placeholder="Ex: Smartphones"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Ícone (Lucide Name)</label>
                <input
                  required
                  type="text"
                  value={formData.icon}
                  onChange={e => setFormData({...formData, icon: e.target.value})}
                  className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary focus:bg-white transition-all font-label-bold"
                  placeholder="Ex: Smartphone, Monitor, Headphones"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Tagline Chamativa</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={e => setFormData({...formData, tagline: e.target.value})}
                  className="w-full p-4 bg-surface-container-low border-2 border-transparent rounded-2xl focus:border-secondary focus:bg-white transition-all font-label-bold"
                  placeholder="Ex: Melhores celulares custo-benefício"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-secondary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Categoria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
