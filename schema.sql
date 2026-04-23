-- Tabelas para o Painel Admin MunizTech

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  icon text,
  tagline text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  price text,
  original_price text,
  discount text,
  store text,
  link text,
  image text,
  urgency_text text,
  ends_in_hours integer,
  features jsonb,
  category text,
  views integer DEFAULT 0,
  is_achadinho boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  category text,
  author text,
  date text,
  image text,
  rating text,
  buy_price text,
  buy_link text,
  for_whom text,
  benefits jsonb,
  pros jsonb,
  cons jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Segurança) mas permitir leitura pública
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura (Públicas)
CREATE POLICY "Leitura pública para categorias" ON categories FOR SELECT USING (true);
CREATE POLICY "Leitura pública para ofertas" ON deals FOR SELECT USING (true);
CREATE POLICY "Leitura pública para reviews" ON reviews FOR SELECT USING (true);

-- Políticas de Escrita (Apenas Admin autenticado)
CREATE POLICY "Admin pode inserir categorias" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin pode atualizar categorias" ON categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode deletar categorias" ON categories FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode inserir ofertas" ON deals FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin pode atualizar ofertas" ON deals FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode deletar ofertas" ON deals FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode inserir reviews" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin pode atualizar reviews" ON reviews FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode deletar reviews" ON reviews FOR DELETE USING (auth.role() = 'authenticated');
