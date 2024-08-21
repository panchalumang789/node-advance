import jwt from 'jsonwebtoken';
import { FastifyRequest } from 'fastify';

export const EMAIL_KEY = 'email';

export const auth = (request: FastifyRequest) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw request.server.httpErrors.unauthorized();
  }
  const [authType, token] = authHeader.split(' ');
  if (authType !== 'Bearer') {
    throw new Error('Invalid auth type');
  }

  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded !== 'object') {
    throw request.server.httpErrors.unauthorized('Invalid token');
  }

  request.auth = {
    user: {
      email: decoded?.[EMAIL_KEY],
    },
  };
};
