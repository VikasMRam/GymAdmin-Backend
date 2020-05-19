import build from 'redux-object';

const getEntities = ({ api }) => api.entities;

export function getEntity(entities, handle, isNormalized) {
  if (!handle) {
    return null;
  }

  if (!entities) {
    return null;
  }

  if (!entities[handle.type]) {
    return null;
  }

  return isNormalized ? build(entities, handle.type, handle.id, { eager: true }) : entities[handle.type][handle.id];
}

export function getRelationship(state, entity, relationshipName, isNormalized) {
  if (!entity) {
    return null;
  }

  if (!entity.relationships) {
    return null;
  }

  if (!entity.relationships[relationshipName]) {
    return null;
  }

  const { data } = entity.relationships[relationshipName];

  const entities = getEntities(state);

  if (Array.isArray(data)) {
    return data.map(handle => getEntity(entities, handle, isNormalized));
  }

  return getEntity(entities, data, isNormalized);
}


export function getRequestResult(entities, request, isNormalized) {
  if (!request || !request.response) {
    return null;
  }

  if (Array.isArray(request.response)) {
    return request.response.map(handle => getEntity(entities, handle, isNormalized));
  }

  return getEntity(entities, request.response, isNormalized);
}

export function getRequestHeaders(request) {
  return request && request.headers;
}

export function getRequestMeta(request) {
  return request && request.meta;
}

export function isRequestLoading(request) {
  return !!(request && request.isLoading);
}

export function hasRequestStarted(request) {
  if (!request) {
    return false;
  }

  if (request.invalid) {
    return false;
  }

  return true;
}

// MEMOIZATION

export const twoSetsAreEqual = (a, b) => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return !a.some((x, i) => x !== b[i]);
  }

  return a === b;
};

// state, apiCall, args
export function createMemoizedRequestInfoSelector() {
  let lastRequestInfo = null;
  let lastResult = null;

  return function (state, params = {}) {
    const { call } = params;
    const args = JSON.stringify(params.args);
    const request = state.api.requests?.[call]?.[args];
    const result = getRequestResult(state.api.entities, request);

    if (result === null || lastResult === null || !twoSetsAreEqual(result, lastResult)) {
      const error = request && request.error ? request.error : false;
      const hasStarted = hasRequestStarted(request);
      const isLoading = isRequestLoading(request);

      lastResult = result;
      lastRequestInfo = {
        hasStarted,
        isLoading,
        hasFinished: hasStarted && !isLoading,
        hasFailed: !!error,
        result,
        normalized: getRequestResult(state.api.entities, request, true),
        headers: getRequestHeaders(request),
        meta: getRequestMeta(request),
        status: request && request.status,
        error,
      };
    }

    return lastRequestInfo;
  };
}
