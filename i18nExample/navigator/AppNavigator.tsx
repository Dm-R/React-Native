import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Localization from 'expo-localization';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import setHeaderStyle from '../utils/setHeaderOptions';
import AuthNavigator from './AuthNavigator';
import PureSplashPage from '../components/pureSplashPage/PureSplashPage';
import theme from '../theme/theme';
// import mavigators

const Stack = createStackNavigator();

export const AppNavigator = (props) => {
  const { locale } = Localization;
  const isRuLocale = locale === 'ru-RU';
  const { translation } = props;
  const { i18n } = useTranslation();
  const [isLangLoaded, setIsLangLoaded] = useState(isRuLocale);
  const [hasUpdates, setHasUpdates] = useState(false);
  const [isCheckingUpdates, setIsChackingUpdates] = useState(false);

  useEffect(() => {
    if (!isRuLocale) {
      if (Object.keys(translation).length) {
        i18n.addResourceBundle(locale, 'common', translation, true, true);
        i18n.changeLanguage(locale);
        setIsLangLoaded(true);
      } else {
        setIsLangLoaded(false);
        props.setTranslationAsync(locale);
      }
    }
    // check updates
  }, []);

  useEffect(() => {
    if (isRuLocale) {
      return;
    }
    i18n.addResourceBundle(locale, 'common', translation, false, true);
    i18n.changeLanguage(locale);
    setIsLangLoaded(Object.keys(translation).length > 0);
  }, [translation]);

  const onUpdate = () => {};

  const onSkip = () => {
    setHasUpdates(false);
  };

  if (isLangLoaded && !isCheckingUpdates) {
    return hasUpdates ? (
      <View>
        <PureUpdatePage onUpdate={onUpdate} onSkip={onSkip} />
      </View>
    ) : (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        mode="modal"
      >
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={setHeaderStyle()}
        />
        {/* navigators */}
      </Stack.Navigator>
    );
  }
  return (
    <View style={theme.stretched}>
      <PureSplashPage />
    </View>
  );
};

const addStoreToProps = (store) => ({ translation: store.translation });

const addDispatchToProps = (dispatch) => ({
  setTranslationAsync: (loc) => dispatch.translation.setTranslationAsync(loc),
});

export default connect(addStoreToProps, addDispatchToProps)(AppNavigator);
