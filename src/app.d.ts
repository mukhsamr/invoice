import type { User } from '$lib/types';

declare global {
	namespace App {
		interface Locals { user: User | null; }
		interface Platform {
			env: Env & { DB: D1Database };
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties;
		}
	}
}

export {};
