import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing credentials in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CATEGORIES = [
  { slug: 'smartphones', name: 'Smartphones', icon: 'Smartphone', tagline: 'Melhores celulares custo-benefício' },
  { slug: 'laptops', name: 'Laptops', icon: 'Laptop', tagline: 'Produtos para home office' },
  { slug: 'audio', name: 'Áudio', icon: 'Headphones', tagline: 'Melhores fones bluetooth' },
  { slug: 'casa-inteligente', name: 'Casa Inteligente', icon: 'Home', tagline: 'Itens de casa inteligente' },
  { slug: 'acessorios', name: 'Acessórios', icon: 'Cable', tagline: 'Acessórios para iPhone' },
  { slug: 'videogames', name: 'Videogames', icon: 'Gamepad2', tagline: 'Consoles de Nova Geração' }
];

const REVIEWS = [
  {
    slug: 'iphone-17-vs-pro-max',
    title: 'iPhone 17 vs 17 Pro Max: Qual comprar?',
    excerpt: 'A linha iPhone 17 chegou! Comparamos o custo-benefício da versão base com a brutalidade do Pro Max. Qual deles faz mais sentido hoje?',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800',
    category: 'Smartphones',
    author: 'Muniz',
    date: 'Hoje',
    rating: '9.8',
    benefits: [
      'Novo chip com eficiência brutal e máxima velocidade',
      'Câmeras de nível profissional com zoom óptico turbinado',
      'Acabamento premium em Titânio (Pro Max) com bateria gigante'
    ],
    pros: ['Câmera insuperável', 'Bateria duradoura', 'Maior brilho de tela da categoria'],
    cons: ['O preço do Pro Max ainda é para poucos', 'Pequenas mudanças de design em relação à geração anterior'],
    for_whom: 'Criadores de conteúdo, quem ama fotografia e qualquer usuário que queira o melhor celular do mundo nas mãos.',
    buy_link: 'https://amzn.to/0fd7497e3331edf66954b0ff160b6429',
    buy_price: 'Ver Preço Atualizado'
  },
  {
    slug: 'echo-dot-5-review',
    title: 'Echo Dot 5ª Geração: A Melhor Alexa Barata?',
    excerpt: 'Testamos a nova geração do smart speaker mais popular do Brasil.',
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&q=80&w=800',
    category: 'Casa Inteligente',
    author: 'Muniz',
    date: '02 de Novembro, 2023',
    rating: '8.8',
    benefits: [
      'Som com graves mais profundos e vocais nítidos',
      'Sensor de temperatura integrado',
      'Respostas mais rápidas do assistente'
    ],
    pros: ['Excelente custo-benefício', 'Integração fácil com rotinas', 'Tamanho compacto'],
    cons: ['Não tem porta P2 (entrada auxiliar)', 'A versão sem relógio perde um pouco do charme'],
    for_whom: 'Quem está montando a primeira casa inteligente ou quer espalhar assistentes de voz pelos cômodos com o melhor custo-benefício.',
    buy_link: '#',
    buy_price: 'R$ 299'
  }
];

const DEALS = [
  {
    title: 'Echo Dot 5ª Geração',
    slug: 'echo-dot-5',
    price: 'R$ 299,00',
    original_price: 'R$ 429,00',
    discount: '30%',
    store: 'Amazon',
    link: 'https://amzn.to/3Oycf9t',
    image: 'https://m.media-amazon.com/images/I/51OiVQzj4HL.jpg',
    urgency_text: 'Estoque acabando! Restam apenas 5 unidades.',
    ends_in_hours: 12,
    features: ['Áudio superior', 'Alexa integrada', 'Sensor de temperatura'],
    category: 'Casa Inteligente',
    views: 1245,
    is_achadinho: false
  },
  {
    title: 'JBL Tune 520BT',
    slug: 'jbl-tune-520bt',
    price: 'R$ 239,00',
    original_price: 'R$ 299,00',
    discount: '20%',
    store: 'Amazon',
    link: 'https://amzn.to/48jjLM9',
    image: 'https://m.media-amazon.com/images/I/31PdqoxM1rL.jpg',
    category: 'Áudio',
    views: 890,
    is_achadinho: false
  },
  {
    title: 'Bettdow SmartWatch com Alexa',
    slug: 'bettdow-smartwatch',
    price: 'R$ 159,00',
    original_price: 'R$ 299,00',
    discount: '46%',
    store: 'Amazon',
    link: 'https://amzn.to/4ctRVzf',
    image: 'https://m.media-amazon.com/images/I/417Stsz0pZL.jpg',
    category: 'Smartphones',
    views: 3420,
    is_achadinho: false
  },
  {
    title: 'Carregador Turbo 50W Lagus',
    slug: 'carregador-turbo-50w',
    price: 'R$ 89,90',
    original_price: 'R$ 150,00',
    discount: '40%',
    store: 'Amazon',
    link: 'https://amzn.to/4u4nhSH',
    image: 'https://m.media-amazon.com/images/I/31XoPy39IQL.jpg',
    category: 'Acessórios',
    views: 2100,
    is_achadinho: true
  },
  {
    title: 'Cabo USB-C 60W Trançado',
    slug: 'cabo-usbc-60w',
    price: 'R$ 35,90',
    original_price: 'R$ 70,00',
    discount: '48%',
    store: 'Amazon',
    link: 'https://amzn.to/4cuewf6',
    image: 'https://m.media-amazon.com/images/I/315bZ8SMwQL.jpg',
    category: 'Acessórios',
    views: 1540,
    is_achadinho: true
  },
  {
    title: 'Apple iPhone 17 (256 GB)',
    slug: 'iphone-17',
    price: 'Ver na Loja',
    original_price: 'R$ 7.799',
    discount: '15%',
    store: 'Amazon',
    link: 'https://amzn.to/42v19oN',
    image: 'https://m.media-amazon.com/images/I/315WfM6Hp3L.jpg',
    category: 'Smartphones',
    views: 5200,
    is_achadinho: false
  },
  {
    title: 'Apple iPhone 17 Pro Max (256 GB)',
    slug: 'iphone-17-pro-max',
    price: 'Ver na Loja',
    original_price: 'R$ 12.499',
    discount: '12%',
    store: 'Amazon',
    link: 'https://amzn.to/4tyBKXm',
    image: 'https://m.media-amazon.com/images/I/31L7O+9pfcL.jpg',
    category: 'Smartphones',
    views: 8900,
    is_achadinho: false
  },
  {
    title: 'PlayStation 5 Slim Digital',
    slug: 'ps5-slim',
    price: 'R$ 3.799',
    original_price: 'R$ 4.499',
    discount: '15%',
    store: 'Amazon',
    link: '#',
    image: 'https://m.media-amazon.com/images/I/41D9HhSgTAL._AC_SL1000_.jpg',
    category: 'Videogames',
    views: 4500,
    is_achadinho: false
  },
  {
    title: 'Xbox Series X 1TB',
    slug: 'xbox-series-x',
    price: 'R$ 4.299',
    original_price: 'R$ 4.999',
    discount: '14%',
    store: 'Amazon',
    link: '#',
    image: 'https://m.media-amazon.com/images/I/51-mYf69LXL._AC_SL1500_.jpg',
    category: 'Videogames',
    views: 3800,
    is_achadinho: false
  },
  {
    title: 'Nintendo Switch OLED',
    slug: 'nintendo-switch-oled',
    price: 'R$ 2.199',
    original_price: 'R$ 2.699',
    discount: '18%',
    store: 'Amazon',
    link: '#',
    image: 'https://m.media-amazon.com/images/I/61S97vM7uLL._AC_SL1500_.jpg',
    category: 'Videogames',
    views: 5200,
    is_achadinho: false
  }
];

async function run() {
  console.log('Inserting categories...');
  await supabase.from('categories').upsert(CATEGORIES, { onConflict: 'slug' });
  
  console.log('Inserting deals...');
  await supabase.from('deals').upsert(DEALS, { onConflict: 'slug' });

  console.log('Inserting reviews...');
  await supabase.from('reviews').upsert(REVIEWS, { onConflict: 'slug' });

  console.log('Done!');
}

run();
