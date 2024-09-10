import jwt from 'jsonwebtoken';
import { FastifyRequest } from 'fastify';

import { USER_ROLES } from '../../schema/user';

export const EMAIL_KEY = 'email';

const auth = async (request: FastifyRequest) => {
  const authHeader =
    request.headers.authorization || (await request.server.redisServer.get('token'));
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
  const jti = decoded.jti;
  const isRevoked = await request.server.redisServer.exists(`revoked:${jti}`);
  if (isRevoked) {
    throw request.server.httpErrors.unauthorized('Token is revoked');
  }
  if (token !== (await request.server.redisServer.get(decoded.id))) {
    throw request.server.httpErrors.unauthorized('Token is revoked');
  }

  request.auth = {
    user: {
      id: decoded.id,
      email: decoded?.[EMAIL_KEY],
      role: decoded.role,
    },
  };
};

const specificAdminAuth = async (request: FastifyRequest) => {
  const authHeader =
    request.headers.authorization || (await request.server.redisServer.get('token'));
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
  const jti = decoded.jti;
  const isRevoked = await request.server.redisServer.exists(`revoked:${jti}`);
  if (isRevoked) {
    throw request.server.httpErrors.unauthorized('Token is revoked');
  }
  if (token !== (await request.server.redisServer.get(decoded.id))) {
    throw request.server.httpErrors.unauthorized('Token is revoked');
  }
  if (decoded.role !== USER_ROLES.ADMIN.toString()) {
    throw request.server.httpErrors.unauthorized('Unauthorized access');
  }

  request.auth = {
    user: {
      id: decoded.id,
      email: decoded?.[EMAIL_KEY],
      role: decoded.role,
    },
  };
};

export { auth, specificAdminAuth };
