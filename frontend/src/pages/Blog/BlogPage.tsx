import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card, CardContent } from '@/components/common/Card';
import {
    Calendar,
    Clock,
    User,
    ArrowRight,
    Tag,
    TrendingUp
} from 'lucide-react';

const BLOG_POSTS = [
    {
        id: 1,
        title: 'Introducing The Orchestra Studio: A New Era of AI Collaboration',
        excerpt: 'Learn how our four specialized agents work together to transform ideas into polished concepts with complete transparency.',
        author: 'Varad Kulkarni',
        date: '2024-12-15',
        readTime: '5 min',
        category: 'Product',
        featured: true,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    },
    {
        id: 2,
        title: 'The Science Behind Multi-Agent Reasoning',
        excerpt: 'A deep dive into how we orchestrate multiple AI agents to achieve better outcomes than single-model approaches.',
        author: 'Jatin Shah',
        date: '2024-12-10',
        readTime: '8 min',
        category: 'Technical',
        featured: false,
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
    },
    {
        id: 3,
        title: 'Why Explainability Matters in AI Systems',
        excerpt: 'Understanding AI decisions builds trust. Here\'s how we\'re making every step of the reasoning process visible.',
        author: 'Priya Sharma',
        date: '2024-12-05',
        readTime: '6 min',
        category: 'AI Ethics',
        featured: false,
        image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=400&fit=crop',
    },
    {
        id: 4,
        title: 'Case Study: How TechVentures 10x\'d Their Ideation Process',
        excerpt: 'A real-world example of how a startup accelerator uses The Orchestra Studio to evaluate startup pitches.',
        author: 'Alex Chen',
        date: '2024-11-28',
        readTime: '7 min',
        category: 'Case Study',
        featured: false,
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
    },
    {
        id: 5,
        title: 'Building Custom Agent Workflows: A Guide',
        excerpt: 'Learn how to configure your own agent pipelines using our workflow builder and API.',
        author: 'Jatin Shah',
        date: '2024-11-20',
        readTime: '10 min',
        category: 'Tutorial',
        featured: false,
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
    },
    {
        id: 6,
        title: 'The Future of Creative AI: Predictions for 2025',
        excerpt: 'Industry trends and our vision for where multi-agent AI systems are headed in the coming year.',
        author: 'Varad Kulkarni',
        date: '2024-11-15',
        readTime: '6 min',
        category: 'Industry',
        featured: false,
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    },
];

const CATEGORIES = ['All', 'Product', 'Technical', 'Tutorial', 'Case Study', 'AI Ethics', 'Industry'];

export default function BlogPage() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = React.useState('All');

    const featuredPost = BLOG_POSTS.find(post => post.featured);
    const filteredPosts = selectedCategory === 'All'
        ? BLOG_POSTS.filter(post => !post.featured)
        : BLOG_POSTS.filter(post => post.category === selectedCategory && !post.featured);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen py-16 lg:py-24">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-primary font-mono text-sm mb-2 block">// BLOG</span>
                    <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Insights & Updates
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Explore our latest thinking on AI collaboration, product updates, and industry trends.
                    </p>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 text-sm rounded-full transition-colors ${selectedCategory === category
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Featured Post */}
                {featuredPost && selectedCategory === 'All' && (
                    <Card variant="elevated" className="mb-12 overflow-hidden border-primary/20">
                        <CardContent className="p-0">
                            <div className="grid md:grid-cols-2 gap-0">
                                <div
                                    className="h-64 md:h-auto bg-cover bg-center"
                                    style={{ backgroundImage: `url(${featuredPost.image})` }}
                                />
                                <div className="p-8 lg:p-12">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="flex items-center gap-1 text-primary text-sm">
                                            <TrendingUp className="h-4 w-4" />
                                            Featured
                                        </span>
                                        <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
                                            {featuredPost.category}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-foreground mb-4 hover:text-primary cursor-pointer transition-colors">
                                        {featuredPost.title}
                                    </h2>
                                    <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                                        <span className="flex items-center gap-1">
                                            <User className="h-4 w-4" />
                                            {featuredPost.author}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {formatDate(featuredPost.date)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {featuredPost.readTime}
                                        </span>
                                    </div>
                                    <Button>
                                        Read Article
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Posts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {filteredPosts.map((post) => (
                        <Card key={post.id} variant="glass" className="group cursor-pointer overflow-hidden hover:border-primary/30 transition-all">
                            <div
                                className="h-48 bg-cover bg-center"
                                style={{ backgroundImage: `url(${post.image})` }}
                            />
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                        {post.category}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                                </div>
                                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {post.author}
                                    </span>
                                    <span>{formatDate(post.date)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Newsletter */}
                <Card variant="elevated" className="border-primary/20">
                    <CardContent className="p-8 lg:p-12 text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            Subscribe to Our Newsletter
                        </h2>
                        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                            Get the latest insights on AI collaboration, product updates, and industry trends
                            delivered to your inbox.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 h-12 px-4 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                            <Button size="lg">
                                Subscribe
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-4">
                            No spam. Unsubscribe anytime.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
