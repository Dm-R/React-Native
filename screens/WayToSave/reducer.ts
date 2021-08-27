import { SET_WAY_TO_SAVE } from './actions';

export const wayToSave = (state = {}, action) => (action.type === SET_WAY_TO_SAVE
  ? action.payload : state);

export default wayToSave;
