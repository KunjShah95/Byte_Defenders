/**
 * Event Bus Service - Pub/Sub pattern for inter-agent communication
 */

export type EventCallback = (data: any) => Promise<void> | void;

export interface EventListener {
  eventType: string;
  callback: EventCallback;
}

export class EventBus {
  private static instance: EventBus;
  private listeners: Map<string, EventCallback[]> = new Map();

  private constructor() {}

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Subscribe to an event
   */
  subscribe(eventType: string, callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Publish an event
   */
  async publish(eventType: string, data: any): Promise<void> {
    // Dispatch to exact event type listeners
    const callbacks = this.listeners.get(eventType) || [];
    // Also dispatch to wildcard '*' listeners (used by SSE endpoint)
    const wildcardCallbacks = this.listeners.get('*') || [];
    const allCallbacks = [...callbacks, ...wildcardCallbacks];
    await Promise.all(allCallbacks.map((callback) => Promise.resolve(callback(data))));
  }

  /**
   * Clear all listeners
   */
  clear(): void {
    this.listeners.clear();
  }

  /**
   * Get listener count for an event
   */
  listenerCount(eventType: string): number {
    return this.listeners.get(eventType)?.length || 0;
  }
}
