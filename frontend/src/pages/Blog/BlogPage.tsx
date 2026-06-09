import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { BackgroundBeams } from '@/components/aceternity/BackgroundBeams';
import { Spotlight } from '@/components/aceternity/Spotlight';
import { Calendar, Clock, User, ArrowRight, TrendingUp } from 'lucide-react';

const BLOG_POSTS = [
  { 
    id: 1, 
    title: 'Introducing The Orchestra Studio: A New Era of Adversarial AI Collaboration', 
    excerpt: 'LLMs are trained to be overly helpful. Discover how we chain four specialized agents in a feedback loop to challenge, roast, and improve your specifications.', 
    author: 'Varad Kulkarni', 
    date: '2026-05-15', 
    readTime: '6 min', 
    category: 'Product', 
    featured: true, 
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000&fit=crop' 
  },
  { 
    id: 2, 
    title: 'The Math Behind Multi-Agent Debate Formats', 
    excerpt: 'A technical deep dive into context injection, prompt routing strategies, and consensus protocols in multi-agent environments.', 
    author: 'Jatin Shah', 
    date: '2026-05-10', 
    readTime: '9 min', 
    category: 'Technical', 
    featured: false, 
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&fit=crop' 
  },
  { 
    id: 3, 
    title: 'Why Explainability is the Cure for AI Hallucinations', 
    excerpt: 'Standard chatbots operate inside a black box. Here is why streaming plain text reasoning steps builds developer trust.', 
    author: 'Priya Sharma', 
    date: '2026-05-02', 
    readTime: '7 min', 
    category: 'AI Ethics', 
    featured: false, 
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&fit=crop' 
  },
  { 
    id: 4, 
    title: 'Case Study: How a Team 10x\'d Their Product Discovery Velocity', 
    excerpt: 'A review of how a fast-growing startup used virtual agent critic loops to draft and audit engineering briefs in minutes instead of weeks.', 
    author: 'Alex Chen', 
    date: '2026-04-20', 
    readTime: '7 min', 
    category: 'Case Study', 
    featured: false, 
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&fit=crop' 
  },
  { 
    id: 5, 
    title: 'How to Build Custom System Prompts for Virtual Critics', 
    excerpt: 'Configuring agents to play devil\'s advocate: how to prompt for maximum friction, constructive roasts, and logical auditing.', 
    author: 'Jatin Shah', 
    date: '2026-04-12', 
    readTime: '11 min', 
    category: 'Tutorial', 
    featured: false, 
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&fit=crop' 
  },
  { 
    id: 6, 
    title: 'The Roadmap to Autonomous Engineering Teams (2026-2030)', 
    excerpt: 'From code autocomplete to autonomous validation layers: what the future of generative agents means for human developers.', 
    author: 'Varad Kulkarni', 
    date: '2026-04-01', 
    readTime: '8 min', 
    category: 'Industry', 
    featured: false, 
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&fit=crop' 
  },
];

const CATEGORIES = ['All', 'Product', 'Technical', 'Tutorial', 'Case Study', 'AI Ethics', 'Industry'];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [email, setEmail] = React.useState('');
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const featuredPost = BLOG_POSTS.find(post => post.featured);
  
  const filteredPosts = selectedCategory === 'All'
    ? BLOG_POSTS.filter(post => !post.featured)
    : BLOG_POSTS.filter(post => post.category === selectedCategory && !post.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <div className="relative min-h-screen bg-black text-white py-24 selection:bg-primary/20 font-sans overflow-x-hidden">
      
      {/* Background Layout lines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="mx-auto h-full max-w-7xl w-full grid-layout-lines" />
      </div>

      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
      <BackgroundBeams className="opacity-10 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 max-w-5xl">
        
        {/* ========== HEADER ========== */}
        <div className="mb-20 text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mt-4 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl font-display select-none cursor-default group"
          >
            Insights on<br />
            <span className="text-gradient-glow relative inline-block group-hover:scale-105 transition-transform duration-300">Adversarial Logic</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400 font-light leading-relaxed"
          >
            Our writing is concise. We cover multi-agent engineering, explainable prompts, and building product workflows without generic AI fluff.
          </motion.p>
        </div>

        {/* ========== CATEGORIES PILLS ========== */}
        <div className="mb-16 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                  isSelected 
                    ? 'bg-primary text-black font-bold' 
                    : 'border border-white/5 bg-neutral-950/20 text-neutral-500 hover:text-white hover:bg-neutral-950/40'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ========== FEATURED ARTICLE (HERO) ========== */}
        {featuredPost && selectedCategory === 'All' && (
          <div className="mb-24 overflow-hidden rounded-xl border border-white/5 bg-neutral-950/20 backdrop-blur-sm group">
            <div className="grid md:grid-cols-12 items-center">
              <div className="md:col-span-7 overflow-hidden h-[340px] md:h-full relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" 
                  style={{ backgroundImage: `url(${featuredPost.image})` }} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/80" />
              </div>
              
              <div className="md:col-span-5 p-8 lg:p-12 relative z-10">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs font-mono text-primary font-semibold uppercase tracking-widest">
                    <TrendingUp className="h-3.5 w-3.5" /> Featured
                  </span>
                  <span className="section-tag">{featuredPost.category}</span>
                </div>
                <h2 className="mb-4 text-2xl font-bold text-white font-display leading-tight group-hover:text-primary transition-colors duration-300">
                  {featuredPost.title}
                </h2>
                <p className="mb-6 text-xs text-neutral-400 font-light leading-relaxed font-mono">
                  {featuredPost.excerpt}
                </p>
                <div className="mb-6 flex flex-wrap gap-4 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> {featuredPost.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(featuredPost.date)}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {featuredPost.readTime}</span>
                </div>
                <Button className="bg-primary hover:bg-primary/95 text-black font-mono text-xs uppercase tracking-widest h-10">
                  Read Dispatch <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ========== EDITORIAL FEED LIST ========== */}
        <div className="mb-24 space-y-px bg-white/5 border-t border-b border-white/5">
          {filteredPosts.length === 0 ? (
            <div className="py-16 text-center text-xs font-mono text-neutral-500 uppercase tracking-widest">
              No dispatches found in category "{selectedCategory}"
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-black hover:bg-neutral-950/40 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group transition-all duration-300 cursor-pointer"
              >
                <div className="flex-1 space-y-2.5">
                  <div className="flex items-center gap-3">
                    <span className="section-tag">{post.category}</span>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">{post.readTime} Read</span>
                  </div>
                  <h3 className="text-xl font-bold text-white font-display group-hover:text-primary transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed font-mono max-w-3xl">
                    {post.excerpt}
                  </p>
                  <div className="flex gap-4 text-[10px] font-mono text-neutral-600 uppercase tracking-wider pt-2">
                    <span className="flex items-center gap-1"><User className="h-3 w-3 text-neutral-500" /> {post.author}</span>
                    <span>{formatDate(post.date)}</span>
                  </div>
                </div>
                
                <div className="shrink-0 flex items-center gap-3 text-neutral-600 group-hover:text-primary transition-colors duration-300">
                  <span className="text-[10px] font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Read</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/5 bg-neutral-900 group-hover:border-primary/30 transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ========== NEWSLETTER SIGNUP ========== */}
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-neutral-950/20 p-10 lg:p-12 text-center max-w-4xl mx-auto">
          <h2 className="mb-3 text-2xl font-bold text-white font-display">Subscribe to the Dispatch Protocol</h2>
          <p className="mx-auto mb-8 max-w-xl text-xs text-neutral-400 font-light leading-relaxed font-mono">
            Get technical insights on multi-agent collaboration, prompt debugging, and product specs direct to your client inbox. No spam. Only text.
          </p>
          
          <form onSubmit={handleSubscribe} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <input 
              type="email" 
              placeholder="developer@workspace.com" 
              required
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-11 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-xs font-mono text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 backdrop-blur-sm transition-all" 
            />
            <Button type="submit" className="bg-primary hover:bg-primary/95 text-black font-mono text-xs uppercase tracking-widest h-11 px-6 font-bold">
              Subscribe
            </Button>
          </form>

          {isSubscribed && (
            <p className="mt-4 text-xs text-primary font-mono">Subscribed successfully! Welcome to the loop.</p>
          )}
        </div>

      </div>
    </div>
  );
}
