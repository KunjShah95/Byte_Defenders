import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import {
    Code2,
    Terminal,
    Webhook,
    Key,
    BookOpen,
    Zap,
    ArrowRight,
    Copy,
    CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const API_ENDPOINTS = [
    {
        method: 'POST',
        endpoint: '/api/v1/sessions',
        description: 'Create a new creative session',
        example: `{
  "userId": "user_123",
  "title": "Product Innovation",
  "description": "Brainstorming new features"
}`,
    },
    {
        method: 'POST',
        endpoint: '/api/v1/sessions/:id/workflow/quick',
        description: 'Run quick workflow (idea + critique)',
        example: `{
  "topic": "Mobile app for elderly care"
}`,
    },
    {
        method: 'POST',
        endpoint: '/api/v1/sessions/:id/workflow/full',
        description: 'Run full workflow with all agents',
        example: `{
  "topic": "Sustainable fashion retail",
  "audience": "Impact investors"
}`,
    },
    {
        method: 'GET',
        endpoint: '/api/v1/sessions/:id/result',
        description: 'Get the final result of a session',
        example: null,
    },
    {
        method: 'GET',
        endpoint: '/api/v1/sessions/:id/explainability',
        description: 'Get detailed agent explanations',
        example: null,
    },
];

const CODE_EXAMPLES = {
    javascript: `import { OrchestraStudioClient } from '@theorchestrastudio/sdk';

const client = new OrchestraStudioClient({
  apiKey: process.env.ORCHESTRA_STUDIO_API_KEY
});

// Create a session and run full workflow
const session = await client.sessions.create({
  title: 'Product Innovation',
  description: 'Brainstorming new features'
});

const result = await client.workflows.full(session.id, {
  topic: 'AI-powered customer support',
  audience: 'Tech startups'
});

console.log(result.presentation);`,

    python: `from orchestra_studio import OrchestraStudioClient

client = OrchestraStudioClient(
    api_key=os.environ["ORCHESTRA_STUDIO_API_KEY"]
)

# Create a session and run full workflow
session = client.sessions.create(
    title="Product Innovation",
    description="Brainstorming new features"
)

result = client.workflows.full(
    session_id=session.id,
    topic="AI-powered customer support",
    audience="Tech startups"
)

print(result.presentation)`,

    curl: `# Create a session
curl -X POST https://api.theorchestrastudio.com/v1/sessions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Product Innovation"}'

# Run full workflow
curl -X POST https://api.theorchestrastudio.com/v1/sessions/{id}/workflow/full \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"topic": "AI-powered customer support"}'`,
};

export default function APIPage() {
    const navigate = useNavigate();
    const [selectedLang, setSelectedLang] = React.useState<'javascript' | 'python' | 'curl'>('javascript');

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    return (
        <div className="min-h-screen py-16 lg:py-24">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-primary font-mono text-sm mb-2 block"> API</span>
                    <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Developer API
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Integrate multi-agent collaboration into your applications with our
                        simple REST API and official SDKs.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" onClick={() => navigate('/signup')}>
                            Get API Key
                            <Key className="ml-2 h-4 w-4" />
                        </Button>
                        <Button size="lg" variant="secondary" onClick={() => navigate('/docs')}>
                            Read Docs
                            <BookOpen className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Quick Start */}
                <Card variant="glass" className="mb-12">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            Quick Start
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2 mb-4">
                            {(['javascript', 'python', 'curl'] as const).map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setSelectedLang(lang)}
                                    className={`px-4 py-2 text-sm rounded-md transition-colors ${selectedLang === lang
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <pre className="bg-background border border-border rounded-lg p-4 overflow-x-auto text-sm">
                                <code className="text-foreground font-mono">{CODE_EXAMPLES[selectedLang]}</code>
                            </pre>
                            <button
                                onClick={() => copyToClipboard(CODE_EXAMPLES[selectedLang])}
                                className="absolute top-4 right-4 p-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
                            >
                                <Copy className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* API Endpoints */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">API Endpoints</h2>
                    <div className="space-y-4">
                        {API_ENDPOINTS.map((endpoint) => (
                            <Card key={endpoint.endpoint} variant="glass">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-4">
                                        <span className={`px-2 py-1 text-xs font-mono font-bold rounded ${endpoint.method === 'GET'
                                            ? 'bg-success/20 text-success'
                                            : 'bg-primary/20 text-primary'
                                            }`}>
                                            {endpoint.method}
                                        </span>
                                        <div className="flex-1">
                                            <code className="text-sm font-mono text-foreground">{endpoint.endpoint}</code>
                                            <p className="text-sm text-muted-foreground mt-1">{endpoint.description}</p>
                                            {endpoint.example && (
                                                <div className="mt-3 relative">
                                                    <pre className="bg-background border border-border rounded-lg p-3 text-xs overflow-x-auto">
                                                        <code className="text-muted-foreground">{endpoint.example}</code>
                                                    </pre>
                                                    <button
                                                        onClick={() => copyToClipboard(endpoint.example!)}
                                                        className="absolute top-2 right-2 p-1.5 rounded bg-secondary hover:bg-secondary/80 transition-colors"
                                                    >
                                                        <Copy className="h-3 w-3 text-muted-foreground" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <Card variant="glass">
                        <CardContent className="pt-6">
                            <Code2 className="h-8 w-8 text-primary mb-4" />
                            <h3 className="font-semibold text-foreground mb-2">Official SDKs</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Type-safe SDKs for JavaScript, Python, Go, and more.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['JavaScript', 'Python', 'Go', 'Ruby'].map((sdk) => (
                                    <span key={sdk} className="text-xs bg-secondary px-2 py-1 rounded">
                                        {sdk}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="glass">
                        <CardContent className="pt-6">
                            <Webhook className="h-8 w-8 text-primary mb-4" />
                            <h3 className="font-semibold text-foreground mb-2">Webhooks</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Real-time notifications for workflow events and completions.
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>• workflow.started</li>
                                <li>• agent.completed</li>
                                <li>• workflow.completed</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card variant="glass">
                        <CardContent className="pt-6">
                            <Terminal className="h-8 w-8 text-primary mb-4" />
                            <h3 className="font-semibold text-foreground mb-2">CLI Tool</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Run workflows directly from your terminal.
                            </p>
                            <code className="text-xs bg-background border border-border px-2 py-1 rounded block">
                                npx @theorchestrastudio/cli run
                            </code>
                        </CardContent>
                    </Card>
                </div>

                {/* Rate Limits */}
                <Card variant="glass" className="mb-12">
                    <CardHeader>
                        <CardTitle>Rate Limits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Plan</th>
                                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Requests/min</th>
                                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Sessions/day</th>
                                        <th className="text-left py-3 px-4 text-muted-foreground font-medium">Concurrent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 px-4 text-foreground">Starter</td>
                                        <td className="py-3 px-4 text-foreground">10</td>
                                        <td className="py-3 px-4 text-foreground">5</td>
                                        <td className="py-3 px-4 text-foreground">1</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 px-4 text-foreground">Pro</td>
                                        <td className="py-3 px-4 text-foreground">100</td>
                                        <td className="py-3 px-4 text-foreground">Unlimited</td>
                                        <td className="py-3 px-4 text-foreground">5</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 text-foreground">Enterprise</td>
                                        <td className="py-3 px-4 text-foreground">Custom</td>
                                        <td className="py-3 px-4 text-foreground">Unlimited</td>
                                        <td className="py-3 px-4 text-foreground">Unlimited</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* CTA */}
                <Card variant="elevated" className="border-primary/20">
                    <CardContent className="p-8 text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-4">
                            Ready to Build?
                        </h2>
                        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                            Get your API key and start integrating multi-agent AI into your applications today.
                        </p>
                        <Button size="lg" onClick={() => navigate('/signup')}>
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
