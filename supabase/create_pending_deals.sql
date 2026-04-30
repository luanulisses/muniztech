-- Criação da tabela pending_deals
CREATE TABLE pending_deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  price TEXT NOT NULL,
  original_price TEXT,
  discount TEXT,
  store TEXT NOT NULL,
  source_url TEXT NOT NULL,
  affiliate_link TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configuração de RLS (Row Level Security)
ALTER TABLE pending_deals ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura (Anônimo e Autenticado)
CREATE POLICY "Enable read access for all users" 
ON pending_deals FOR SELECT 
USING (true);

-- Política para inserção e atualização (Apenas Autenticado - para o Admin)
CREATE POLICY "Enable insert for authenticated users only" 
ON pending_deals FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" 
ON pending_deals FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" 
ON pending_deals FOR DELETE 
USING (auth.role() = 'authenticated');

-- A Edge Function usará o service_role_key, então ela contorna o RLS automaticamente.
