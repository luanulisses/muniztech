import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  label?: string;
}

export default function ImageUpload({ onUpload, currentImage, label = "Imagem do Produto" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('images') // Assumes bucket 'images' exists
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onUpload(publicUrl);
    } catch (error: any) {
      alert('Erro no upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant">{label}</label>
      
      <div className="relative group">
        {preview ? (
          <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-surface-container-high bg-surface-container-low">
            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
            <button 
              onClick={() => { setPreview(''); onUpload(''); }}
              className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-surface-container-high rounded-2xl cursor-pointer hover:bg-surface-container-lowest hover:border-secondary transition-all group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <Loader2 className="w-10 h-10 text-secondary animate-spin" />
              ) : (
                <>
                  <ImageIcon className="w-10 h-10 text-on-surface-variant group-hover:text-secondary mb-3" />
                  <p className="text-sm font-black text-on-surface-variant uppercase tracking-widest group-hover:text-secondary">Upload Imagem</p>
                </>
              )}
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </label>
        )}
      </div>
    </div>
  );
}
