const STATUS_MESSAGES = {
  400: 'Please check your input and try again.',
  401: 'Please sign in to continue.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested information could not be found.',
  409: 'This action could not be completed. Please try again.',
  422: 'Please check your input and try again.',
  500: 'Something went wrong on our end. Please try again later.',
  503: 'The service is temporarily unavailable. Please try again later.',
};

const CONTEXT_MESSAGES = {
  login: {
    401: 'Invalid email or password.',
    403: 'Your account cannot be accessed at this time. Please contact your administrator.',
    default: 'Unable to sign in. Please try again.',
  },
  session: {
    401: 'Your session has expired. Please sign in again.',
    403: 'Your session could not be verified. Please sign in again.',
    default: 'Unable to load your account. Please sign in again.',
  },
  register: {
    400: 'Please check your registration details and try again.',
    409: 'An account with this email already exists.',
    default: 'Unable to create your account. Please try again.',
  },
  generic: {
    default: 'Something went wrong. Please try again.',
  },
};

function extractServerMessage(data) {
  if (typeof data === 'string' && data.trim()) {
    return data.trim();
  }

  if (data?.message && typeof data.message === 'string') {
    return data.message.trim();
  }

  return null;
}

function mapKnownServerMessage(message, context) {
  const normalized = message.toLowerCase();

  if (normalized.includes('invalid or expired access token') || normalized.includes('authentication is required')) {
    return CONTEXT_MESSAGES.session[401];
  }

  if (normalized.includes('permission') || normalized.includes('do not have permission')) {
    return STATUS_MESSAGES[403];
  }

  if (normalized.includes('email is already registered')) {
    return CONTEXT_MESSAGES.register[409];
  }

  if (context === 'login' && (normalized.includes('bad credentials') || normalized.includes('invalid email or password'))) {
    return CONTEXT_MESSAGES.login[401];
  }

  if (message.length <= 120 && !message.includes('failed with status') && !message.startsWith('GET ') && !message.startsWith('POST ')) {
    return message;
  }

  return null;
}

export function getFriendlyErrorMessage(error, context = 'generic') {
  if (!error?.response) {
    return 'Unable to connect to the server. Please check your connection and try again.';
  }

  const { status, data } = error.response;
  const serverMessage = extractServerMessage(data);
  const mappedServerMessage = serverMessage ? mapKnownServerMessage(serverMessage, context) : null;

  if (mappedServerMessage) {
    return mappedServerMessage;
  }

  const contextMessages = CONTEXT_MESSAGES[context] || CONTEXT_MESSAGES.generic;
  if (contextMessages[status]) {
    return contextMessages[status];
  }

  if (STATUS_MESSAGES[status]) {
    return STATUS_MESSAGES[status];
  }

  return contextMessages.default || CONTEXT_MESSAGES.generic.default;
}
