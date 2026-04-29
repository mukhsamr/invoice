import { compare, hash } from 'bcryptjs';
import { redirect } from '@sveltejs/kit';
import { SESSION_COOKIE } from '$lib/server/constants';
import type { Cookies } from '@sveltejs/kit';

export async function hashPassword(password: string) {
	return hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
	return compare(password, passwordHash);
}

export function setSessionCookie(cookies: Cookies, token: string) {
	cookies.set(SESSION_COOKIE, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: true,
		maxAge: 60 * 60 * 24 * 30
	});
}

export function clearSessionCookie(cookies: Cookies) {
	cookies.delete(SESSION_COOKIE, { path: '/' });
}

export function requireUser<T>(value: T | null | undefined): T {
	if (!value) {
		throw redirect(303, '/auth/sign-in');
	}
	return value;
}
