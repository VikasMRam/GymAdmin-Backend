// https://github.com/diegohaz/arc/wiki/Example-redux-modules#entities

import normalize from 'json-api-normalizer';
import { env } from 'sly/config';
import { entitiesReceive } from './actions';

const middleware = store => next => (action) => {

  const { payload:rawEntities, meta } = action;

  if (meta && meta.entities) {
    const { uri } = meta.request;
    const qsPos = uri.indexOf('?');
    const key =  qsPos !== -1 ? uri.substring(0,qsPos) : uri;

    const { meta: result, ...entities } = normalize(rawEntities, {
      endpoint: key,
    }); // { meta :...., key1,;

    if (entities[meta.entities]) {
      // console.log("SEEING MY OBJ ",myObj);
      // console.log("SEEING ENTITIES RECEIEVE",entities);
      // console.log("SEEING REQUEST result  ",result[key].meta);
      // console.log("SEEING META ENTITIES ",meta.entities);
      // store.dispatch(entityReceiveMeta(result[key].meta));
      store.dispatch(entitiesReceive(entities,result[key].meta));

      const ids = result[key].data.map(({id})=>id);
      return next({ ...action, payload: ids });
    } else {
      throw new Error(`Possibly malformed response with type: ${meta.entities}`);
    }
  }

  return next(action);
};

export default middleware;

