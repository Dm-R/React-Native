import React, { useRef, useState } from 'react';
import {
  Animated, Easing, ScrollView, Text, View,
} from 'react-native';
import { Button, CheckBox, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ContentContainer from '../../components/contentContainer/ContentContainer';
import CheckBoxIcon from '../../components/checkBoxIcon/CheckBoxIcon';
import ContinueBtn from '../../components/continueBtn/ContinueBtn';
import styles from './styles';
import theme from '../../../theme/default/theme';
import {
  ELEMENTS_MAIN_COLOR, RADIO_ICON_SIZE, CURSOR_COLOR, LITE_COLOR,
} from '../../../constants/constants';
import { Periods, SavingTypes } from '../../../utils/enums';
import { defaultSavingAccount } from '../../../constants/defaultStates';
import { setWayToSave } from './actions';
import { removeExtraDots } from '../../../utils/utils';

export const WayToSave = (props) => {
  const { navigation, route } = props;
  const target = route?.params?.target;
  const savedCalcParams = target?.calcParams;
  const [state, setState] = useState(savedCalcParams?.wayToSave || {
    savingType: SavingTypes.CASH_OR_BANK,
    ...defaultSavingAccount as any,
  });

  const animation = useRef({
    height: new Animated.Value(+(state.savingType === SavingTypes.SAVING_ACCOUNT)),
    opacity: new Animated.Value(+(state.savingType === SavingTypes.SAVING_ACCOUNT)),
  }).current;

  const toggleInputs = (type: SavingTypes): void => {
    Animated.parallel([
      Animated.timing(animation.height, {
        toValue: type !== SavingTypes.CASH_OR_BANK ? 1 : 0,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(animation.opacity, {
        toValue: type !== SavingTypes.CASH_OR_BANK ? 1 : 0,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const toggleChecked = (type: SavingTypes): void => {
    setState((prevState) => ({
      ...prevState,
      savingType: type,
      ...defaultSavingAccount,
      percent: prevState.percent,
    }));
    toggleInputs(type);
  };

  const selectPeriod = (period: Periods): void => {
    setState((prevState) => ({
      ...prevState,
      period,
    }));
  };

  const onChange = (text: string): void => {
    const value = removeExtraDots(text);
    setState((prevState) => ({
      ...prevState,
      percent: value,
    }));
  };

  const onEndEditing = (text: string): void => {
    setState((prevState) => ({
      ...prevState,
      percent: parseFloat(text) || '',
    }));
  };

  const onContinue = (): void => {
    props.setWayToSave(state);
    navigation.navigate('CalculateOptions', { target });
  };

  return (
    <ScrollView contentContainerStyle={theme.scrollContainer}>
      <ContentContainer>
        <View style={theme.stretched}>
          <CheckBox
            title="Lorem ipsum dolor sit amet"
            textStyle={theme.commonBoldText}
            checkedIcon={(<CheckBoxIcon checked />)}
            uncheckedIcon={(<CheckBoxIcon />)}
            size={RADIO_ICON_SIZE}
            checked={state.savingType === SavingTypes.CASH_OR_BANK}
            onPress={() => toggleChecked(SavingTypes.CASH_OR_BANK)}
            containerStyle={theme.checkBox}
          />
          <View style={theme.divider} />
          <CheckBox
            title="Lorem ipsum dolor sit amet"
            textStyle={theme.commonBoldText}
            checkedIcon={(<CheckBoxIcon checked />)}
            uncheckedIcon={(<CheckBoxIcon />)}
            size={RADIO_ICON_SIZE}
            checked={state.savingType === SavingTypes.SAVING_ACCOUNT}
            onPress={() => toggleChecked(SavingTypes.SAVING_ACCOUNT)}
            containerStyle={theme.checkBox}
          />
          <Animated.View style={{
            overflow: 'hidden',
            opacity: animation.opacity,
            maxHeight: animation.height.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }}
          >
            <Text style={theme.labelText}>Lorem ipsum dolor</Text>
            <Input
              value={state.percent.toString()}
              rightIcon={{
                type: 'font-awesome-5', name: 'percent', color: ELEMENTS_MAIN_COLOR, size: 20,
              }}
              inputContainerStyle={[
                theme.inputContainer,
                styles.input,
              ]}
              containerStyle={theme.inputWrapper}
              placeholder="0"
              placeholderTextColor={ELEMENTS_MAIN_COLOR}
              inputStyle={theme.input}
              keyboardType="decimal-pad"
              selectionColor={CURSOR_COLOR}
              onChangeText={onChange}
              onEndEditing={(e) => onEndEditing(e.nativeEvent.text)}
            />
            <Text style={theme.labelText}>Lorem ipsum dolor</Text>
            <View>
              <View style={styles.row}>
                <Button
                  onPress={() => selectPeriod(Periods.EVERY_YEAR)}
                  title="в год"
                  containerStyle={styles.periodBtnContainer}
                  buttonStyle={{
                    ...styles.buttonStyle,
                    backgroundColor: state.period === Periods.EVERY_YEAR
                      ? ELEMENTS_MAIN_COLOR : LITE_COLOR,
                  }}
                />
                <Button
                  onPress={() => selectPeriod(Periods.EVERY_QUARTER)}
                  title="в квартал"
                  containerStyle={styles.periodBtnContainer}
                  buttonStyle={{
                    ...styles.buttonStyle,
                    backgroundColor: state.period === Periods.EVERY_QUARTER
                      ? ELEMENTS_MAIN_COLOR : LITE_COLOR,
                  }}
                />
              </View>
              <View style={styles.row}>
                <Button
                  onPress={() => selectPeriod(Periods.EVERY_MONTH)}
                  containerStyle={styles.periodBtnContainer}
                  buttonStyle={{
                    ...styles.buttonStyle,
                    backgroundColor: state.period === Periods.EVERY_MONTH
                      ? ELEMENTS_MAIN_COLOR : LITE_COLOR,
                  }}
                  title="в месяц"
                />
                <Button
                  onPress={() => selectPeriod(Periods.EVERY_DAY)}
                  containerStyle={styles.periodBtnContainer}
                  buttonStyle={{
                    ...styles.buttonStyle,
                    backgroundColor: state.period === Periods.EVERY_DAY
                      ? ELEMENTS_MAIN_COLOR : LITE_COLOR,
                  }}
                  title="в день"
                />
              </View>
            </View>
          </Animated.View>
        </View>
        <ContinueBtn
          disabled={state.savingType === SavingTypes.SAVING_ACCOUNT ? !state.percent : false}
          onPress={onContinue}
        />
      </ContentContainer>
    </ScrollView>
  );
};
const addStoreToProps = (store) => ({ store });

const addActionsToProps = (dispatch) => (
  bindActionCreators({
    setWayToSave,
  }, dispatch)
);

export default connect(addStoreToProps, addActionsToProps)(WayToSave);
