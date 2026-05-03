-- Criação da tabela bot_offers para o novo robô de afiliados
CREATE TABLE bot_offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE,
  platform TEXT NOT NULL,
  title TEXT NOT NULL,
  price TEXT NOT NULL,
  original_price TEXT,
  discount TEXT,
  affiliate_link TEXT,
  image TEXT NOT NULL,
  category TEXT,
  is_niche BOOLEAN DEFAULT false,
  was_sent_whatsapp BOOLEAN DEFAULT false,
  was_published_blog BOOLEAN DEFAULT false,
  send_count INTEGER DEFAULT 0,
  last_posted_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'posted', 'rejected')),
  score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bot_offers_updated_at
    BEFORE UPDATE ON bot_offers
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Configuração de RLS (Row Level Security)
ALTER TABLE bot_offers ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura (Anônimo e Autenticado)
CREATE POLICY "Enable read access for all users" 
ON bot_offers FOR SELECT 
USING (true);

-- Política para inserção e atualização (Apenas Autenticado - para o Admin)
CREATE POLICY "Enable insert for authenticated users only" 
ON bot_offers FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" 
ON bot_offers FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" 
ON bot_offers FOR DELETE 
USING (auth.role() = 'authenticated');

-- Índices para otimizar as buscas do bot
CREATE INDEX idx_bot_offers_status ON bot_offers(status);
CREATE INDEX idx_bot_offers_whatsapp ON bot_offers(was_sent_whatsapp);
CREATE INDEX idx_bot_offers_last_posted ON bot_offers(last_posted_at);
CREATE INDEX idx_bot_offers_created_at ON bot_offers(created_at);
