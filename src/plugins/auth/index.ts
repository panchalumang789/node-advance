import jwt from 'jsonwebtoken';
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export const EMAIL_KEY = 'email';

export const auth = (
  request: FastifyRequest,
  _: FastifyReply,
  next: (err?: FastifyError) => void
) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw request.server.httpErrors.unauthorized();
  }
  const [authType, token] = authHeader.split(' ');
  if (authType !== 'Bearer') {
    throw new Error('Invalid auth type');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  if (!decoded || typeof decoded !== 'object') {
    throw request.server.httpErrors.unauthorized('Invalid token');
  }

  request.auth = {
    user: {
      id: decoded.id,
      email: decoded?.[EMAIL_KEY],
      role: decoded.role,
    },
  };
  next();
};
