import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import moment from 'moment';
import numeral from 'numeral/numeral';
import 'moment/locale/ru';
import { CHART_LITE_TEXT } from '../../../constants/constants';
import TargetTrends from '../../../data/TargetTrends';
import BarChart from '../../components/chart/Bar';
import AreaChart from '../../components/chart/Area';
import styles from './styles';
import theme from '../../../theme/default/theme';
import Targets from '../../../data/Targets';

function Calculations(props) {
  const { navigation } = props;
  const targetsTrends = new TargetTrends();
  const targetsModel = new Targets();
  const [totalSum, setTotalSum] = useState(0);
  const [summarizedTrends, setSummarizedTrends] = useState([]) as any;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      targetsTrends.getTrendsAggregatedByMonth()
        .then((trends) => setSummarizedTrends(trends.map((trend) => ({
          date: moment(trend.date).valueOf(),
          value: trend.value,
        }))));
      targetsModel.getTotalSum()
        .then(setTotalSum);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    moment.locale('ru');
  }, []);

  const formatDate = (dateToFormat: Date): string => {
    const date = moment(dateToFormat);
    return `${date.format('MMMM')} ${date.year()}`;
  };

  const formatSum = (sum: number): string => numeral(sum).format('0,0').replace(/,/g, ' ');

  const renderMonthPlanRow = (date, value, index) => (
    <View key={index} style={[theme.row, index !== 0 ? styles.planRow : {}]}>
      <Text style={[styles.title, styles.planText, styles.planTextDate]}>
        {formatDate(date)}
      </Text>
      <Text style={[styles.title, styles.planText]}>
        {`${formatSum(value)} \u20BD`}
      </Text>
    </View>
  );

  const chartProps: any = {
    containerStyle: styles.chartContainer,
    xAxisProps: { svg: { fill: CHART_LITE_TEXT } },
    trends: summarizedTrends,
  };

  return (
    <ScrollView>
      <View style={styles.pageWrapper}>
        <View style={theme.row}>
          <Text style={styles.title}>Lorem, ipsum:</Text>
          <Text style={[styles.title, styles.totalSum]}>{` ${numeral(totalSum).format('0,0')}\u20BD`}</Text>
        </View>
        {summarizedTrends.length < 13 ? (
          <BarChart {...chartProps} />
        ) : (
          <AreaChart {...chartProps} />
        )}
        <Text style={styles.title}>Lorem, ipsum</Text>
        <View style={styles.planContainer}>
          {summarizedTrends.map(({ date, value }, index) => renderMonthPlanRow(date, value, index))}
        </View>
      </View>
    </ScrollView>
  );
}

export default Calculations;
