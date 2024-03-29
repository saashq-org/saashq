import { sendInboxMessage } from './messageBroker';
import { getSubdomain } from '@saashq/api-utils/src/core';

const EXCLUDE_PATH = [
  '/nylas/webhook',
  '/nylas/get-message',
  '/nylas/auth/callback',
  '/nylas/oauth2/callback',
  '/gmail/webhook',
  '/gmail/login'
];

export let userIds: string[] = [];

const userMiddleware = async (req, _res, next) => {
  const { path, headers, query } = req;
  const subdomain = getSubdomain(req);

  if (EXCLUDE_PATH.includes(path)) {
    return next();
  }

  if (userIds.length === 0) {
    const response = await sendInboxMessage({
      subdomain,
      action: 'integrations.receive',
      data: {
        action: 'getUserIds'
      },
      isRPC: true
    });

    userIds = response.userIds;
  }

  if (
    path.startsWith('/gmail') ||
    path.startsWith('/accounts') ||
    path.startsWith('/nylas') ||
    path.startsWith('/integrations')
  ) {
    try {
      const userId = headers.userid || query.userId;

      if (userIds.includes(userId)) {
        return next();
      }

      next(new Error('User not authorized'));
    } catch (e) {
      next(e);
    }
  }

  next();
};

export default userMiddleware;
