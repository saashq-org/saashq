import debug from 'debug';

export const debugDb = debug('saashq-client-portal-api:db');

export const debugExternalApi = debug(
  'saashq-client-portal-api:external-api-fetcher'
);
export const debugInit = debug('saashq-client-portal-api:init');
export const debugBase = debug('saashq-client-portal-api:base');
export const debugError = debug('saashq-client-portal-api:error');

export const debugRequest = (debugInstance, req) =>
  debugInstance(`
        Receiving ${req.path} request from ${req.headers.origin}
        header: ${JSON.stringify(req.headers || {})}
        body: ${JSON.stringify(req.body || {})}
        queryParams: ${JSON.stringify(req.query)}
    `);

export const debugResponse = (debugInstance, req, data = 'success') =>
  debugInstance(
    `Responding ${req.path} request to ${req.headers.origin} with ${data}`
  );
