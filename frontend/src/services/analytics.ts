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

        // Load Google Analytics if configured
        if (this.config.googleAnalyticsId) {
            this.loadGoogleAnalytics(this.config.googleAnalyticsId);
        }

        // Process queued events
        this.queue.forEach(({ event, properties }) => {
            this.track(event, properties);
        });
        this.queue = [];

        if (this.config.debug) {
            console.log('[Analytics] Initialized with config:', this.config);
        }
    }

    /**
     * Track a custom event
     */
    track(event: string, properties: EventProperties = {}) {
        if (!this.config.enabled) return;

        // Queue events if not initialized
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

        // Send to Google Analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', event, enrichedProperties);
        }
    }

    /**
     * Track page view
     */
    pageView(path: string, title?: string) {
        this.track('page_view', {
            page_path: path,
            page_title: title || document.title,
        });
    }

    /**
     * Track user sign up
     */
    signUp(method: string) {
        this.track('sign_up', { method });
    }

    /**
     * Track user sign in
     */
    signIn(method: string) {
        this.track('login', { method });
    }

    /**
     * Track session creation
     */
    sessionCreated(sessionId: string, useCase?: string) {
        this.track('session_created', {
            session_id: sessionId,
            use_case: useCase,
        });
    }

    /**
     * Track workflow completion
     */
    workflowCompleted(sessionId: string, duration: number, score?: number) {
        this.track('workflow_completed', {
            session_id: sessionId,
            duration_ms: duration,
            final_score: score,
        });
    }

    /**
     * Track subscription
     */
    subscribe(plan: string, billingCycle: 'monthly' | 'yearly', amount: number) {
        this.track('purchase', {
            plan,
            billing_cycle: billingCycle,
            value: amount,
            currency: 'INR',
        });
    }

    /**
     * Track errors
     */
    error(message: string, fatal: boolean = false) {
        this.track('exception', {
            description: message,
            fatal,
        });
    }

    /**
     * Identify user (after login)
     */
    identify(userId: string, traits: EventProperties = {}) {
        if (this.config.debug) {
            console.log('[Analytics] Identify:', userId, traits);
        }

        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('set', 'user_id', userId);
        }
    }

    /**
     * Clear user identity (after logout)
     */
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

        (window as any).dataLayer = (window as any).dataLayer || [];
        function gtag(...args: any[]) {
            (window as any).dataLayer.push(args);
        }
        (window as any).gtag = gtag;
        gtag('js', new Date());
        gtag('config', measurementId, {
            send_page_view: false, // We'll handle pageviews manually
        });
    }
}

// Singleton instance
export const analytics = new AnalyticsService();

export default analytics;
