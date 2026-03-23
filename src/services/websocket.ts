/**
 * DEEVO Intelligence Monitor v3 — WebSocket Service
 * Contract 4 / Service 6 of 6
 * Layer: APIs (L5) — real-time event bus for UI components.
 *
 * Architecture: Uses native EventTarget for pub/sub within the SPA.
 *               When a backend WebSocket is available (Render),
 *               this bridges server events to the local bus.
 *
 * Trade-off: Native EventTarget vs Socket.io client.
 *            EventTarget chosen for v3 — zero dependency, works
 *            offline. Socket.io integration planned for v4 when
 *            Render backend provides real-time feeds.
 *
 * Risk: Event flooding — mitigated by throttle/debounce and
 *       max queue size.
 */

import type { IntelSignal } from '../types/signals';
import type { CorrelationMatch } from '../types/signals';
import type { DecisionAlert } from '../types/decisions';
import type { AuditEntry } from '../types/audit';

// ── Event Types ──────────────────────────────────────────
export type DeevoEventType =
  | 'signal:new'
  | 'signal:batch'
  | 'correlation:match'
  | 'decision:created'
  | 'decision:updated'
  | 'audit:entry'
  | 'dri:change'
  | 'feed:health'
  | 'system:error';

// ── Event Payload Map ────────────────────────────────────
export interface DeevoEventMap {
  'signal:new': IntelSignal;
  'signal:batch': IntelSignal[];
  'correlation:match': CorrelationMatch;
  'decision:created': DecisionAlert;
  'decision:updated': DecisionAlert;
  'audit:entry': AuditEntry;
  'dri:change': { level: number; previous: number };
  'feed:health': { feedId: string; active: boolean; failures: number };
  'system:error': { code: string; message: string; timestamp: string };
}

// ── Event Bus Config ─────────────────────────────────────
interface EventBusConfig {
  maxQueueSize: number;
  throttleMs: number;
  enableLogging: boolean;
}

const DEFAULT_BUS_CONFIG: EventBusConfig = {
  maxQueueSize: 1000,
  throttleMs: 100,
  enableLogging: false,
};

// ── Listener Type ────────────────────────────────────────
type EventListener<K extends DeevoEventType> = (payload: DeevoEventMap[K]) => void;

// ── Event Bus Implementation ─────────────────────────────
class DeevoEventBus {
  private listeners = new Map<DeevoEventType, Set<EventListener<DeevoEventType>>>();
  private queue: Array<{ type: DeevoEventType; payload: unknown }> = [];
  private config: EventBusConfig;
  private throttleTimers = new Map<DeevoEventType, ReturnType<typeof setTimeout>>();
  private stats = {
    totalEmitted: 0,
    totalDropped: 0,
    listenerCount: 0,
  };

  constructor(config: EventBusConfig = DEFAULT_BUS_CONFIG) {
    this.config = config;
  }

  /** Subscribe to an event type */
  on<K extends DeevoEventType>(type: K, listener: EventListener<K>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    const set = this.listeners.get(type)!;
    set.add(listener as EventListener<DeevoEventType>);
    this.stats.listenerCount++;

    // Return unsubscribe function
    return () => {
      set.delete(listener as EventListener<DeevoEventType>);
      this.stats.listenerCount--;
    };
  }

  /** Emit an event to all subscribers (with throttle) */
  emit<K extends DeevoEventType>(type: K, payload: DeevoEventMap[K]): void {
    // Queue management
    if (this.queue.length >= this.config.maxQueueSize) {
      this.stats.totalDropped++;
      this.queue.shift(); // Drop oldest
    }
    this.queue.push({ type, payload });

    // Throttle
    if (this.config.throttleMs > 0 && this.throttleTimers.has(type)) {
      return; // Already scheduled
    }

    const dispatch = (): void => {
      this.throttleTimers.delete(type);
      const set = this.listeners.get(type);
      if (!set || set.size === 0) return;

      this.stats.totalEmitted++;
      if (this.config.enableLogging) {
        console.debug(`[EventBus] ${type}`, payload);
      }

      set.forEach((listener) => {
        try {
          listener(payload as DeevoEventMap[DeevoEventType]);
        } catch (err) {
          console.error(`[EventBus] Listener error on ${type}:`, err);
        }
      });
    };

    if (this.config.throttleMs > 0) {
      this.throttleTimers.set(type, setTimeout(dispatch, this.config.throttleMs));
    } else {
      dispatch();
    }
  }

  /** Remove all listeners for an event type */
  off(type: DeevoEventType): void {
    const set = this.listeners.get(type);
    if (set) {
      this.stats.listenerCount -= set.size;
      set.clear();
    }
  }

  /** Clear all listeners and queue */
  destroy(): void {
    this.listeners.clear();
    this.queue = [];
    this.throttleTimers.forEach((t) => clearTimeout(t));
    this.throttleTimers.clear();
    this.stats = { totalEmitted: 0, totalDropped: 0, listenerCount: 0 };
  }

  /** Get bus statistics */
  getStats(): typeof this.stats & { queueSize: number } {
    return { ...this.stats, queueSize: this.queue.length };
  }
}

// ── Singleton Instance ───────────────────────────────────
export const eventBus = new DeevoEventBus();

// ── Convenience Helpers ──────────────────────────────────
export const onSignal = (fn: EventListener<'signal:new'>): (() => void) =>
  eventBus.on('signal:new', fn);

export const onCorrelation = (fn: EventListener<'correlation:match'>): (() => void) =>
  eventBus.on('correlation:match', fn);

export const onDecision = (fn: EventListener<'decision:created'>): (() => void) =>
  eventBus.on('decision:created', fn);

export const emitSignal = (signal: IntelSignal): void =>
  eventBus.emit('signal:new', signal);

export const emitCorrelation = (match: CorrelationMatch): void =>
  eventBus.emit('correlation:match', match);

export const emitDecision = (decision: DecisionAlert): void =>
  eventBus.emit('decision:created', decision);
