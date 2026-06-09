import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Button } from '@/components/common/Button';
import {
    Brain,
    Eye,
    Target,
    ArrowRight,
    ArrowLeft,
    X,
    CheckCircle,
    Sparkles
} from 'lucide-react';

interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    content: React.ReactNode;
}

/**
 * Onboarding component for first-time users.
 * Shows a guided tour of the platform's key features.
 */
export function OnboardingModal() {
    const navigate = useNavigate();
    const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage('onboarding-complete', false);
    const [currentStep, setCurrentStep] = useState(0);

    if (hasSeenOnboarding) return null;

    const steps: OnboardingStep[] = [
        {
            id: 'welcome',
            title: 'Welcome to The Orchestra Studio',
            description: 'Your ideas, refined by AI collaboration',
            icon: Sparkles,
            content: (
                <div className="text-center">
                    <div className="text-6xl mb-6">🤖✨</div>
                    <p className="text-muted-foreground mb-4">
                        Transform rough ideas into polished concepts using our team of specialized AI agents.
                    </p>
                    <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-success" />
                            4 Specialized Agents
                        </span>
                        <span className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-success" />
                            Full Transparency
                        </span>
                    </div>
                </div>
            ),
        },
        {
            id: 'agents',
            title: 'Meet Your AI Team',
            description: 'Each agent has a unique specialty',
            icon: Brain,
            content: (
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { icon: '💡', name: 'Idea Agent', desc: 'Generates creative concepts' },
                        { icon: '🔍', name: 'Critic Agent', desc: 'Provides structured feedback' },
                        { icon: '✨', name: 'Refiner Agent', desc: 'Improves based on critique' },
                        { icon: '📊', name: 'Presenter Agent', desc: 'Formats final output' },
                    ].map((agent) => (
                        <div key={agent.name} className="p-4 bg-secondary/30 rounded-lg text-center">
                            <span className="text-2xl mb-2 block">{agent.icon}</span>
                            <p className="font-medium text-foreground text-sm">{agent.name}</p>
                            <p className="text-xs text-muted-foreground">{agent.desc}</p>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            id: 'explainability',
            title: 'Full Transparency',
            description: 'See exactly how decisions are made',
            icon: Eye,
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <Eye className="h-5 w-5 text-primary" />
                            <p className="font-medium text-foreground">Explainability Mode</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Every decision, score, and reasoning step is logged and visible.
                            No black boxes—just clear, auditable AI thinking.
                        </p>
                    </div>
                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-success" />
                            View agent reasoning at each step
                        </li>
                        <li className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-success" />
                            Track quality scores across iterations
                        </li>
                        <li className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-success" />
                            Export full execution logs
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            id: 'getstarted',
            title: 'Ready to Start?',
            description: 'Create your first session now',
            icon: Target,
            content: (
                <div className="text-center">
                    <div className="text-6xl mb-6">🚀</div>
                    <p className="text-muted-foreground mb-6">
                        You're all set! Create your first session and watch the magic happen.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={() => {
                                setHasSeenOnboarding(true);
                                navigate('/create');
                            }}
                            size="lg"
                            className="w-full"
                        >
                            Create First Session
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setHasSeenOnboarding(true);
                                navigate('/history');
                            }}
                            size="lg"
                            className="w-full"
                        >
                            View Demo Sessions
                        </Button>
                    </div>
                </div>
            ),
        },
    ];

    const currentStepData = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;
    const isFirstStep = currentStep === 0;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="relative p-6 pb-0">
                        <button
                            onClick={() => setHasSeenOnboarding(true)}
                            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary transition-colors"
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>

                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <currentStepData.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">
                                    {currentStepData.title}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {currentStepData.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {currentStepData.content}
                    </div>

                    {/* Footer */}
                    <div className="p-6 pt-0 flex items-center justify-between">
                        {/* Progress Dots */}
                        <div className="flex gap-1.5">
                            {steps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1.5 rounded-full transition-all ${index === currentStep
                                        ? 'w-6 bg-primary'
                                        : index < currentStep
                                            ? 'w-1.5 bg-primary/50'
                                            : 'w-1.5 bg-muted'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Navigation */}
                        <div className="flex gap-2">
                            {!isFirstStep && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setCurrentStep(s => s - 1)}
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            )}
                            {!isLastStep && (
                                <Button
                                    size="sm"
                                    onClick={() => setCurrentStep(s => s + 1)}
                                >
                                    Next
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OnboardingModal;
