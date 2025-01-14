import Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: 'https://c0355c18b86a8fcba144b81b086635a2@o4508644576002048.ingest.us.sentry.io/4508644576329728',
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  profilesSampleRate: 1.0,
});
