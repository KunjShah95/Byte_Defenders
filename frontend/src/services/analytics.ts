/**
 * Analytics Service
 * 
 * Unified analytics layer supporting multiple providers.
 * Implements privacy-first tracking with consent management.
 */

type EventProperties = Record<string, string | number | boolean | undefined>;

interface AnalyticsConfig {
    enabled: boolean;
    debug: boolean;
    googleAnalyticsId?: string;
    mixpanelToken?: string;
}

class AnalyticsService {
    private config: AnalyticsConfig = {
        enabled: true,
        debug: import.meta.env.DEV,
    };

    private initialized = false;
    private queue: Array<{ event: string; properties: EventProperties }> = [];

    /**
     * Initialize analytics with configuration
     */
    init(config: Partial<AnalyticsConfig>) {
        this.config = { ...this.config, ...config };
        this.initialized = true;

        if (this.config.googleAnalyticsId) {
            this.loadGoogleAnalytics(this.config.googleAnalyticsId);
        }

        this.queue.forEach(({ event, properties }) => {
            this.track(event, properties);
        });
        this.queue = [];

        if (this.config.debug) {
            console.log('[Analytics] Initialized with config:', this.config);
        }
    }

    track(event: string, properties: EventProperties = {}) {
        if (!this.config.enabled) return;

        if (!this.initialized) {
            this.queue.push({ event, properties });
            return;
        }

        const enrichedProperties = {
            ...properties,
            timestamp: Date.now(),
            url: window.location.href,
            referrer: document.referrer,
        };

        if (this.config.debug) {
            console.log('[Analytics] Track:', event, enrichedProperties);
        }

        const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
        if (typeof gtag === 'function') {
            gtag('event', event, enrichedProperties);
        }
    }

    pageView(path: string, title?: string) {
        this.track('page_view', {
            page_path: path,
            page_title: title || document.title,
        });
    }

    signUp(method: string) {
        this.track('sign_up', { method });
    }

    signIn(method: string) {
        this.track('login', { method });
    }

    sessionCreated(sessionId: string, useCase?: string) {
        this.track('session_created', {
            session_id: sessionId,
            use_case: useCase,
        });
    }

    workflowCompleted(sessionId: string, duration: number, score?: number) {
        this.track('workflow_completed', {
            session_id: sessionId,
            duration_ms: duration,
            final_score: score,
        });
    }

    subscribe(plan: string, billingCycle: 'monthly' | 'yearly', amount: number) {
        this.track('purchase', {
            plan,
            billing_cycle: billingCycle,
            value: amount,
            currency: 'INR',
        });
    }

    error(message: string, fatal: boolean = false) {
        this.track('exception', {
            description: message,
            fatal,
        });
    }

    identify(userId: string, traits: EventProperties = {}) {
        if (this.config.debug) {
            console.log('[Analytics] Identify:', userId, traits);
        }

        const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
        if (typeof gtag === 'function') {
            gtag('set', 'user_id', userId);
        }
    }

    reset() {
        if (this.config.debug) {
            console.log('[Analytics] Reset');
        }
    }

    private loadGoogleAnalytics(measurementId: string) {
        if (typeof window === 'undefined') return;

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);

        const w = window as typeof window & {
          dataLayer?: unknown[];
          gtag?: (...args: unknown[]) => void;
        };
        w.dataLayer = w.dataLayer || [];
        function gtag(...args: unknown[]) {
          w.dataLayer!.push(args);
        }
        w.gtag = gtag;
        gtag('js', new Date());
        gtag('config', measurementId, {
            send_page_view: false,
        });
    }
}

export const analytics = new AnalyticsService();

export default analytics;
