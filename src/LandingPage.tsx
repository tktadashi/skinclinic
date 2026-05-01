import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Heart, Shield, Sparkles, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

export default function LandingPage() {
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    // Busca de E-books com Caching de 10 min e limit(12)
    const fetchBooks = async () => {
      try {
        const CACHE_KEY = 'skinclinic_books_cache';
        const CACHE_TTL = 10 * 60 * 1000; // 10 minutos em milissegundos
        
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_TTL) {
            setBooks(data);
            return; // Retorna dados do cache para economizar cota de leitura
          }
        }

        const q = query(collection(db, "books"), orderBy("createdAt", "desc"), limit(12));
        const snapshot = await getDocs(q);
        const fetchedBooks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (fetchedBooks.length > 0) {
          setBooks(fetchedBooks);
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: fetchedBooks,
            timestamp: Date.now()
          }));
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 }
  };

  const primaryBook = books.length > 0 ? books[0] : {
    title: "O Fim do Cansaço",
    price: 47.90,
    kiwifyLink: "https://kiwify.com.br/",
    description: "Recupere sua pele do cansaço em apenas 7 dias.",
    coverUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop"
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-[#1A1A1A] selection:bg-[#E9E4DE] selection:text-[#1A1A1A]">
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1615397323145-d81b379eb4a3?q=80&w=2000&auto=format&fit=crop" 
            alt="Textura de pele suave" 
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDFCFB]/50 via-[#FDFCFB]/80 to-[#FDFCFB]"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto flex max-w-fit items-center gap-2 rounded-full border border-[#C5A059]/30 bg-[#F7F3EF] px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold text-[#C5A059] mb-8 shadow-sm"
          >
            <Sparkles className="h-3 w-3" />
            Método validado por +2.000 mulheres
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto max-w-4xl text-4xl font-serif font-light leading-tight text-[#2C3E50] sm:text-5xl lg:text-7xl"
          >
            Recupere o viço e a luminosidade da sua pele em 7 dias com o <br className="hidden sm:block"/><span className="font-medium italic text-[#C5A059]">Método Skinimalista</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-sm text-[#555] leading-relaxed sm:text-lg"
          >
            Um protocolo prático inspirado nas tendências de clínicas internacionais, traduzido para a rotina da mulher brasileira
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <a 
              href={primaryBook.kiwifyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C5A059] hover:bg-[#B38E46] text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#C5A059]/30 transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              Quero meu acesso agora
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 flex justify-center gap-6 opacity-40 grayscale"
          >
            <div className="text-[9px] uppercase tracking-tighter flex items-center gap-1 font-medium text-gray-800">
              <Shield className="h-3 w-3" />
              7 Dias de Garantia
            </div>
            <div className="text-[9px] uppercase tracking-tighter flex items-center gap-1 font-medium text-gray-800">
               <CheckCircle2 className="h-3 w-3" />
               Compra Segura Kiwify
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#FDFCFB] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div {...fadeIn} className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-serif font-light text-[#2C3E50] sm:text-4xl">
              Para quem é este <span className="font-medium italic text-[#C5A059]">guia?</span>
            </h2>
            <p className="mt-4 text-sm text-[#555] sm:text-base">
              Se você se identifica com uma ou mais situações abaixo, este e-book foi escrito para você.
            </p>
          </motion.div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Mães atarefadas", desc: "Não tem tempo para rotinas de 10 passos, mas quer se sentir bonita ao olhar no espelho.", icon: Heart },
                { title: "Profissionais exaustas", desc: "A tela do computador e o estresse estão sugando o brilho natural e causando envelhecimento precoce.", icon: UserIcon },
                { title: "Iniciantes no Skincare", desc: "Está confusa com a quantidade de produtos no mercado e quer ir direto ao que realmente funciona.", icon: Sparkles }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F3EF] border border-[#E9E4DE] text-[#C5A059]">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-[#4A5D4E]">{item.title}</h3>
                  <p className="text-xs text-[#555] leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#E9E4DE] py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/5 via-transparent to-transparent z-0"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative mx-auto w-full max-w-md lg:mx-0"
            >
              <div className="aspect-[3/4] overflow-hidden rounded-r-3xl rounded-l-md bg-white shadow-2xl shadow-[#1A1A1A]/10 ring-1 ring-[#1A1A1A]/5 relative before:absolute before:inset-y-0 before:left-0 before:w-4 before:bg-gradient-to-r before:from-[#E9E4DE] before:to-transparent before:z-20">
                <img 
                  src={primaryBook.coverUrl || "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop"} 
                  alt="Capa do E-book" 
                  className="absolute inset-0 h-full w-full object-cover zoom-in-110"
                />
                <div className="absolute inset-0 bg-[#1A1A1A]/30 mix-blend-multiply z-10" />
                <div className="absolute inset-0 flex flex-col justify-end p-8 z-20 bg-gradient-to-t from-[#1A1A1A]/80 to-transparent">
                  <p className="text-[#C5A059] text-[10px] tracking-widest uppercase mb-2 font-bold">E-book Exclusivo</p>
                  <h3 className="text-4xl font-serif font-light text-white mb-2 leading-tight">{primaryBook.title.split(' ').slice(0,2).join(' ')} <br/><span className="font-medium italic">{primaryBook.title.split(' ').slice(2).join(' ')}</span></h3>
                  <p className="text-[#E9E4DE] text-[10px] uppercase tracking-widest">por Dra. Especialista Amiga</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-xl border border-white/50"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#C5A059] mb-4">O que você aprende</h3>
              <h2 className="text-3xl font-serif font-light text-[#2C3E50] sm:text-4xl mb-6">
                Descubra o que está escondido nas <span className="font-medium italic text-[#C5A059]">páginas de ouro</span> deste manual.
              </h2>
              <p className="text-sm text-[#555] mb-8 leading-relaxed">
                Não é sobre comprar dezenas de cremes caros. É sobre a combinação certa de ativos no momento certo do seu dia.
              </p>
              
              <ul className="space-y-4">
                {[
                  "O mito dos 10 passos: como 3 produtos básicos são superiores a uma prateleira cheia.",
                  "SOS Olheiras: uma técnica simples matinal que desincha a área dos olhos em 3 minutos.",
                  "Mapa Ativos x Dor: qual vitamina C, retinol ou ácido usar para o seu tipo de cansaço.",
                  "A rotina noturna de recuperação profunda (acorde com a pele de quem dormiu 8 horas)."
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="text-[#4A5D4E] font-bold mt-0.5">→</span>
                    <span className="text-sm text-[#1A1A1A] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[#FDFCFB] py-24 sm:py-32 border-t border-gray-100">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div {...fadeIn}>
            <div className="w-12 h-12 mx-auto rounded-full border border-[#C5A059] flex items-center justify-center mb-6">
              <span className="text-sm font-bold text-[#C5A059]">SK</span>
            </div>
            <h2 className="text-3xl font-serif font-light text-[#2C3E50] sm:text-5xl">
              Pronta para brilhar <span className="italic text-[#C5A059]">de novo?</span>
            </h2>
            <p className="mt-4 text-sm text-[#555]">
              Todo o protocolo "{primaryBook.title}" já está liberado e esperando por você.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 rounded-3xl bg-white p-8 shadow-xl shadow-[#1A1A1A]/5 sm:p-12 border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-[#4A5D4E]/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 w-fit mx-auto">
                <div className="flex items-center justify-center gap-3 mb-6">
                   <span className="text-[10px] uppercase tracking-widest text-[#777] line-through">De R$ {(primaryBook.price * 2).toFixed(2).replace('.', ',')}</span>
                   <span className="rounded-full bg-[#C5A059]/10 px-3 py-1 text-[10px] font-bold text-[#C5A059] uppercase tracking-widest border border-[#C5A059]/20">Oferta Exclusiva</span>
                </div>
                
                <div className="mb-2 flex items-baseline justify-center gap-1">
                  <span className="text-xl font-serif font-medium text-[#1A1A1A]">R$</span>
                  <span className="text-6xl font-serif font-medium tracking-tight text-[#1A1A1A]">{Math.floor(primaryBook.price)}</span>
                  <span className="text-xl font-serif font-medium text-[#1A1A1A]">,{(primaryBook.price).toFixed(2).split('.')[1]}</span>
                </div>
                <div className="text-[10px] text-[#4A5D4E] font-bold tracking-tight uppercase mb-8">Pagamento único • Acesso Vitalício</div>
    
                <a 
                  href={primaryBook.kiwifyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#C5A059] hover:bg-[#B38E46] text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-[#C5A059]/20 transition-all flex items-center justify-center gap-3 w-full group"
                >
                  Quero meu acesso agora
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
    
                <div className="mt-8 flex justify-center items-center gap-4 opacity-40 grayscale flex-wrap">
                  <div className="text-[10px] uppercase tracking-tighter flex items-center gap-1 font-medium text-[#1A1A1A]">
                    <Shield className="h-3 w-3" />
                    7 Dias de Garantia
                  </div>
                  <div className="text-[10px] uppercase tracking-tighter flex items-center gap-1 font-medium text-[#1A1A1A]">
                    <CheckCircle2 className="h-3 w-3" />
                    Compra Segura Kiwify
                  </div>
                </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-[#FDFCFB] py-12 px-6">
        <div className="mx-auto max-w-7xl text-center">
          <p className="mx-auto max-w-3xl text-[10px] sm:text-xs text-[#999] leading-relaxed mb-8">
            <strong>Aviso Legal:</strong> Este guia é um compilado de boas práticas de autocuidado e rotinas cosméticas. As informações aqui contidas não substituem a consulta médica, diagnóstico ou tratamento dermatológico profissional. Sempre consulte seu médico antes de iniciar novos protocolos na pele.
          </p>
          <div className="text-[10px] uppercase tracking-widest text-[#777] font-medium">
            <p>© {new Date().getFullYear()} Especialista Amiga. Todos os direitos reservados.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-6">
              <a href="#" className="hover:text-[#1A1A1A] transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-[#1A1A1A] transition-colors">Política de Privacidade</a>
              <a href="/admin" className="hover:text-[#1A1A1A] transition-colors">Área Administrativa</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
