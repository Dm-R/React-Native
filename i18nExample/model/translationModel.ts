import { createModel } from '@rematch/core';
import api from '../apiService';

export const translation = createModel()({
  state: {},
  reducers: {
    setTranslation(state, payload) {
      return payload;
    },
  },
  effects: (dispatch) => ({
    async setTranslationAsync(loc) {
      const transl = await api.getTranslation(loc);
      dispatch.translation.setTranslation(transl);
    },
  }),
});

export default translation;
