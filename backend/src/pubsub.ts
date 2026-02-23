import { EventEmitter } from "events";
import type { PubSub } from "type-graphql";

const emitter = new EventEmitter();
emitter.setMaxListeners(50);

const pubsub: PubSub = {
  publish(routingKey: string, ...args: unknown[]) {
    emitter.emit(routingKey, ...args);
  },

  subscribe(routingKey: string): AsyncIterable<unknown> {
    return {
      [Symbol.asyncIterator]() {
        const queue: unknown[] = [];
        let resolve: ((value: IteratorResult<unknown>) => void) | null = null;

        const listener = (...args: unknown[]) => {
          const value = args.length === 1 ? args[0] : args;
          if (resolve) {
            const r = resolve;
            resolve = null;
            r({ value, done: false });
          } else {
            queue.push(value);
          }
        };

        emitter.on(routingKey, listener);

        return {
          next() {
            if (queue.length > 0) {
              return Promise.resolve({ value: queue.shift()!, done: false });
            }
            return new Promise<IteratorResult<unknown>>((r) => {
              resolve = r;
            });
          },
          return() {
            emitter.off(routingKey, listener);
            return Promise.resolve({ value: undefined, done: true });
          },
          throw(err: unknown) {
            emitter.off(routingKey, listener);
            return Promise.reject(err);
          },
        };
      },
    };
  },
};

export default pubsub;
