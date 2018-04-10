// https://github.com/diegohaz/arc/wiki/Sagas
// https://github.com/diegohaz/arc/wiki/Example-redux-modules#resource
import { put, call, takeEvery } from 'redux-saga/effects';
import * as actions from './actions';

export function* createResource(api, { data }, { resource, thunk }) {
  try {
    // https://github.com/diegohaz/arc/wiki/API-service
    const detail = yield call([api, api.post], api.uri(resource), data);
    // https://github.com/diegohaz/arc/wiki/Actions#async-actions
    yield put(actions.resourceCreateSuccess(resource, detail, { data }, thunk));
  } catch (e) {
    yield put(actions.resourceCreateFailure(resource, e, { data }, thunk));
  }
}

export function* readResourceList(api, { params }, { resource, thunk }) {
  const uri = api.uri(resource, params);
  try {
    const list = yield call([api, api.get], uri);
    yield put(actions.resourceListReadSuccess(resource, list, { uri }, thunk));
  } catch (e) {
    yield put(actions.resourceListReadFailure(resource, e, { uri }, thunk));
  }
}

export function* readResourceDetail(
  api,
  { needle, params },
  { resource, thunk }
) {
  const uri = api.uri(resource, needle, params);
  try {
    const detail = yield call([api, api.get], uri);
    yield put(actions.resourceDetailReadSuccess(resource, detail, { needle, uri }, thunk));
  } catch (e) {
    yield put(actions.resourceDetailReadFailure(resource, e, { needle, uri }, thunk));
  }
}

export function* updateResource(api, { needle, data }, { resource, thunk }) {
  try {
    const detail = yield call([api, api.put], api.uri(resource,needle), data);
    yield put(actions.resourceUpdateSuccess(resource, detail, { needle, data }, thunk));
  } catch (e) {
    yield put(actions.resourceUpdateFailure(resource, e, { needle, data }, thunk));
  }
}

export function* deleteResource(api, { needle }, { resource, thunk }) {
  const uri = api.uri(resource, needle);
  try {
    yield call([api, api.delete], uri);
    yield put(actions.resourceDeleteSuccess(resource, { needle }, thunk));
  } catch (e) {
    yield put(actions.resourceDeleteFailure(resource, e, { needle }, thunk));
  }
}

export function* watchResourceCreateRequest(api, { payload, meta }) {
  yield call(createResource, api, payload, meta);
}

export function* watchResourceListReadRequest(api, { payload, meta }) {
  yield call(readResourceList, api, payload, meta);
}

export function* watchResourceDetailReadRequest(api, { payload, meta }) {
  yield call(readResourceDetail, api, payload, meta);
}

export function* watchResourceUpdateRequest(api, { payload, meta }) {
  yield call(updateResource, api, payload, meta);
}

export function* watchResourceDeleteRequest(api, { payload, meta }) {
  yield call(deleteResource, api, payload, meta);
}

export default function* ({ api }) {
  yield takeEvery(
    actions.RESOURCE_CREATE_REQUEST,
    watchResourceCreateRequest,
    api
  );
  yield takeEvery(
    actions.RESOURCE_LIST_READ_REQUEST,
    watchResourceListReadRequest,
    api
  );
  yield takeEvery(
    actions.RESOURCE_DETAIL_READ_REQUEST,
    watchResourceDetailReadRequest,
    api
  );
  yield takeEvery(
    actions.RESOURCE_UPDATE_REQUEST,
    watchResourceUpdateRequest,
    api
  );
  yield takeEvery(
    actions.RESOURCE_DELETE_REQUEST,
    watchResourceDeleteRequest,
    api
  );
}
