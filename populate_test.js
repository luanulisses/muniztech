import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function populate() {
  console.log("Fetching test products...");
  const res = await fetch("https://dummyjson.com/products/search?q=phone&limit=5");
  const data = await res.json();
  
  let inserted = 0;
  for (const item of data.products) {
    const currentPrice = item.price * 5;
    const discountPercentage = Math.round(item.discountPercentage);
    const originalPrice = currentPrice / (1 - (discountPercentage / 100));

    const formatPrice = (p) => `R$ ${p.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const pendingDeal = {
      title: item.title,
      image: item.thumbnail,
      price: formatPrice(currentPrice),
      original_price: formatPrice(originalPrice),
      discount: `${discountPercentage}%`,
      store: "Mercado Livre (Teste)",
      source_url: `https://dummyjson.com/products/${item.id}`,
      status: "pending"
    };

    const { error } = await supabase.from("pending_deals").insert(pendingDeal);
    if (!error) {
      inserted++;
      console.log("Inserted:", item.title);
    } else {
      console.error("Error inserting:", error.message);
    }
  }
  console.log(`Successfully inserted ${inserted} deals.`);
}

populate();
