import { Request, Response, NextFunction } from 'express'

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
	const secret = req.headers['x-admin-secret'] as string
	if (secret && secret === process.env.ADMIN_SECRET) return next()
	return res.status(401).json({ error: 'Unauthorized' })
}
