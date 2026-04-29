import { getBusinessProfile, getDb } from '$lib/server/db';
import { requireUser } from '$lib/server/auth';

export const load = async ({ locals, platform, url }) => {
	const user = requireUser(locals.user);
	return { user, profile: await getBusinessProfile(getDb(platform), user.id), pathname: url.pathname };
};
