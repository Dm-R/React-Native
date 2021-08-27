import React, { useEffect, useState } from 'react';
import {
  View,
  Dimensions,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import Theme from '../../../../themes/default/Theme';
import RegDataWrapper from '../RegDataWrapper';
import CategoryBtn from './CategoryBtn';
import {
  addCategory, removeCategory,
  setPossibleServices, setServiceCategories,
} from '../../../app/reducers/actions';
import {
  SERVISES_WRAPPER_PADDING,
  CATEGORIES_TEXT_SIZE,
} from '../../../../themes/default/constants';

export const ServicePageStep1 = (props) => {
  const {
    navigation, selectedCategories, serviceCategories, route,
  } = props;
  const { step, numberOfSteps } = route.params;

  // get window width
  let containerWidth = Dimensions.get('window').width;
  const [state, setState] = useState({
    disabled: true,
    width: containerWidth,

  });
  // constatnt for calculating flex property of a button (can have any other value)
  const baseGrow = 1;
  // get inner container width (without left and right paddings).
  containerWidth -= (SERVISES_WRAPPER_PADDING * 2);
  // get max possible amount of characters that can fit on one line
  containerWidth /= CATEGORIES_TEXT_SIZE;
  // array of blocks with buttons
  const categoryBlocks: Array<any> = [[]];
  // variable for index of categoryBlocks array
  let categoryIndex = 0;
  let blockWidth = containerWidth;
  let selectedCategoriesIds = selectedCategories.map((c) => c.id);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      disabled: selectedCategories.length === 0,
    }));
  }, [selectedCategories]);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', onWidthChange);
    return  () => subscription?.remove();
  })

  const getCategories = async () => {
    try {
      const { data } = await axios.get('lorem/api');
      props.setServiceCategories(data);
    } catch (err) { Alert.alert('Ошибка', err.message); }
  };

  const onWidthChange = ({window}) => {
    setState((prevState) => ({
      ...prevState,
      width: window.width,
    }));
  };

  const handleSelect = (selCategory) => {
    if (selectedCategories.includes(selCategory)) {
      props.removeCategory(selCategory);
      selectedCategoriesIds = selectedCategoriesIds.filter((id) => id !== selCategory.id);
    } else {
      props.addCategory(selCategory);
    }
  };

  serviceCategories.forEach((category) => {
    // calculate flex property of category button based on text width
    const growTo = category.title.length / baseGrow;
    // category button
    const btn = (
      <CategoryBtn
        style={[
          Theme.stylesheet.categoryBtn,
          { flex: growTo },
          selectedCategories.includes(category) ? Theme.stylesheet.selectedCategoryBtn : {},
        ]}
        onPress={() => handleSelect(category)}
        key={`category-${category.id}`}
        numberOfLines={1}
        title={category.title}
        textStyle={Theme.stylesheet.categoryBtnText}
      />
    );
    const btnWidth = category.title.length;
    // check if there is free space for the btn in the block.
    // if there is no free space to add a btn, then add new block.
    if (btnWidth > blockWidth) {
      categoryIndex += 1;
      categoryBlocks.push([]);
      blockWidth = containerWidth;
    }
    categoryBlocks[categoryIndex].push(btn);
    blockWidth -= btnWidth;
  });

  const onContinue = async () => {
    navigation.navigate('ServicePageStep2', {
      step: step + 1,
      numberOfSteps,
    });
    try {
      const { data } = await axios.get('lorem/api', {
        params: {
          ids: selectedCategoriesIds.join(','),
        },
      });
      props.setPossibleServices(data);
      console.log({ data });
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <RegDataWrapper
      title="Lorem"
      disabled={state.disabled}
      onPress={onContinue}
      description="Lorem ipsum dolor sit amet consectetur"
    >
      { categoryBlocks.map((block, index) => (
        <View style={Theme.stylesheet.servicesWrapper} key={`block-${index}`}>
          {block}
        </View>
      )) }
    </RegDataWrapper>
  );
};

const addStateToProps = (store) => {
  const { serviceCategories, selectedCategories } = store;
  return { serviceCategories, selectedCategories };
};

const addDispatchToProps = (dispatch) => (
  bindActionCreators({
    addCategory,
    removeCategory,
    setServiceCategories,
    setPossibleServices,
  }, dispatch)
);

export default connect(addStateToProps, addDispatchToProps)(ServicePageStep1);
