interface DemoEvent {
    type: 'page_view' | 'click' | 'feature_use' | 'partner_signup' | 'swap_completed';
    page: string;
    target?: string;
    timestamp: number;
    metadata?: Record<string, string | number>;
}

class DemoAnalytics {
    private events: DemoEvent[] = [];
    private sessionStart: number;

    constructor() {
        this.sessionStart = Date.now();
    }

    track(type: DemoEvent['type'], page: string, target?: string, metadata?: DemoEvent['metadata']) {
        this.events.push({
            type,
            page,
            target,
            timestamp: Date.now(),
            metadata,
        });
    }

    getEvents(): DemoEvent[] {
        return [...this.events];
    }

    getSummary() {
        const duration = Math.round((Date.now() - this.sessionStart) / 1000);
        const pageViews = this.events.filter(e => e.type === 'page_view');
        const clicks = this.events.filter(e => e.type === 'click');
        const features = this.events.filter(e => e.type === 'feature_use');
        const signups = this.events.filter(e => e.type === 'partner_signup');

        const pageCounts = pageViews.reduce((acc, e) => {
            acc[e.page] = (acc[e.page] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            sessionDuration: duration,
            totalEvents: this.events.length,
            pageViews: pageViews.length,
            clicks: clicks.length,
            featuresUsed: features.length,
            partnerSignups: signups.length,
            mostVisitedPages: Object.entries(pageCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([page, count]) => ({ page, count })),
        };
    }

    exportJSON(): string {
        return JSON.stringify({
            sessionStart: new Date(this.sessionStart).toISOString(),
            summary: this.getSummary(),
            events: this.events,
        }, null, 2);
    }

    reset() {
        this.events = [];
        this.sessionStart = Date.now();
    }
}

let instance: DemoAnalytics | null = null;

export function getDemoAnalytics(): DemoAnalytics {
    if (!instance) {
        instance = new DemoAnalytics();
    }
    return instance;
}

export type { DemoEvent };
