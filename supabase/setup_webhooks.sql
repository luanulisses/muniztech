-- Habilita a extensão de hooks se não estiver habilitada
-- Nota: Isso deve ser feito no Dashboard do Supabase em Database -> Webhooks

-- Webhook para Ofertas (Deals)
-- Vá em: Database -> Webhooks -> Create New Webhook
-- Name: telegram_deals
-- Table: deals
-- Events: Insert
-- Type: HTTP Request (Edge Function)
-- Edge Function: telegram-notifier
-- Method: POST

-- Webhook para Análises (Reviews)
-- Vá em: Database -> Webhooks -> Create New Webhook
-- Name: telegram_reviews
-- Table: reviews
-- Events: Insert
-- Type: HTTP Request (Edge Function)
-- Edge Function: telegram-notifier
-- Method: POST

-- Segredos do Supabase (Configure em Settings -> API -> Secrets):
-- TELEGRAM_BOT_TOKEN = 8373249351:AAHmoc3eciKfBxl7OUfGUERJlaDb8wJmTz0
-- TELEGRAM_CHAT_ID = @muniztechofertas
