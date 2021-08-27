import { StyleSheet } from 'react-native';
import {
  ELEMENTS_MAIN_COLOR, BUTTON_RADIUS, PERIOD_BTN_WIDTH,
} from '../../../constants/constants';

export const styles = StyleSheet.create({
  periodBtnContainer: {
    borderWidth: 1,
    borderRadius: BUTTON_RADIUS,
    width: PERIOD_BTN_WIDTH,
    marginBottom: 15,
    borderColor: ELEMENTS_MAIN_COLOR,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    width: PERIOD_BTN_WIDTH,
  },
  buttonStyle: {
    height: 48,
    paddingBottom: 10,
  },
});

export default styles;
