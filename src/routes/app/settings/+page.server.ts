import { requireUser } from '$lib/server/auth';
import { getBusinessProfile, getDb, updateBusinessProfile } from '$lib/server/db';

export const load = async ({ locals, platform }) => ({ profile: await getBusinessProfile(getDb(platform), requireUser(locals.user).id) });
export const actions = { default: async ({ request, locals, platform }) => { await updateBusinessProfile(getDb(platform), requireUser(locals.user).id, await request.formData()); return { success: true }; } };
