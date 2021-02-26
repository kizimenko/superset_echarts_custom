/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {
  AnnotationLayer,
  isFormulaAnnotationLayer,
  ChartProps,
  CategoricalColorNamespace,
  getNumberFormatter,
  smartDateVerboseFormatter,
  NumberFormats,
  NumberFormatter,
} from '@superset-ui/core';
import { parseYAxisBound } from '../utils/controls';
import { EchartsTimeseriesProps } from './types';
import { ForecastSeriesEnum } from '../types';
import { extractTimeseriesSeries } from '../utils/series';
import { evalFormula, parseAnnotationOpacity } from '../utils/annotation';

import {
  extractForecastSeriesContext,
  extractProphetValuesFromTooltipParams,
  formatProphetTooltipSeries,
  rebaseTimeseriesDatum,
} from '../utils/prophet';
import { defaultGrid, defaultTooltip, defaultYAxis } from '../defaults';

const percentFormatter = getNumberFormatter(NumberFormats.PERCENT_2_POINT);

export function formatPieLabel({
  params,
  numberFormatter,
}: {
  params: echarts.EChartOption.Tooltip.Format;
  numberFormatter: NumberFormatter;
}): string {
  const { value, percent } = params;
  const formattedValue = numberFormatter((value as [number, number])[1]);
  // @ts-ignore
  const formattedPercent = percentFormatter((percent as number) / 100);

  return `${formattedValue}`;
}

export default function transformProps(chartProps: ChartProps): EchartsTimeseriesProps {
  const { width, height, formData, queryData } = chartProps;
  const {
    annotationLayers = [],
    colorScheme,
    contributionMode,
    seriesType2,
    logAxis2,
    labelEnable2,
    markerSize2,
    minorSplitLine2,
    minorSplitLine,
    splitLine2,
    splitLine,
    truncateYAxis2,
    yAxisFormat2,
    yAxisBounds2,
    labelFontSize2,
    labelPosition2,
    zoomable,
    metric2,
    colorPicker,
    axisLine,
    axisLine2,
    xSplitLine,
    customColorScheme,
    useCustomScheme
  } = formData;
  let {
    seriesType,
    area,
    logAxis,
    opacity,
    stack,
    labelEnable,
    markerSize,
    truncateYAxis,
    yAxisFormat,
    yAxisBounds,
    labelFontSize,
    numberFormat,
    numberFormat2,
    labelPosition,
  } = formData;

  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);

  const rebasedData = rebaseTimeseriesDatum(queryData.data || []);
  const rawSeries = extractTimeseriesSeries(rebasedData);

  

  const numberFormatter = getNumberFormatter(numberFormat);
  const numberFormatter2 = getNumberFormatter(numberFormat2);

  const series: echarts.EChartOption.Series[] = [];
  const formatter = getNumberFormatter(contributionMode ? ',.0%' : yAxisFormat);

  const formatter2 = getNumberFormatter(contributionMode ? ',.0%' : yAxisFormat2);

  let seriesCounter = 0
  rawSeries.forEach(entry => {
    
    const forecastSeries = extractForecastSeriesContext(entry.name || '');
    const isConfidenceBand =
      forecastSeries.type === ForecastSeriesEnum.ForecastLower ||
      forecastSeries.type === ForecastSeriesEnum.ForecastUpper;
    const isObservation = forecastSeries.type === ForecastSeriesEnum.Observation;
    const isTrend = forecastSeries.type === ForecastSeriesEnum.ForecastTrend;

    let stackId;
    if (isConfidenceBand) {
      stackId = forecastSeries.name;
    } else if (stack && isObservation) {
      // the suffix of the observation series is '' (falsy), which disables
      // stacking. Therefore we need to set something that is truthy.
      stackId = 'obs';
    } else if (stack && isTrend) {
      stackId = forecastSeries.type;
    }
    let plotType;
    if (seriesType === 'scatter') {
      plotType = 'scatter';
    } else {
      plotType = seriesType === 'bar' ? 'bar' : 'line';
    }

    let plotType2;
    if (seriesType2 === 'scatter') {
      plotType2 = 'scatter';
    } else {
      plotType2 = seriesType2 === 'bar' ? 'bar' : 'line';
    }

    const lineStyle = isConfidenceBand ? { opacity: 0 } : {};

    let yAxisIndex = 0
    let custom_color = undefined

    if(useCustomScheme){
      let inputColors = customColorScheme.split(',')
      custom_color = inputColors[seriesCounter]
    }

    if (forecastSeries.name===metric2.label) {
      yAxisIndex = 1;
    } else {
      yAxisIndex = 0;
    }

    let markerSizeCustom = 0;
    markerSizeCustom = yAxisIndex ? markerSize2 : markerSize;

    
    if (!((stack || area) && isConfidenceBand))
      series.push({
        ...entry,
        id: entry.name,
        name: forecastSeries.name,
        itemStyle: {
          color: custom_color,
        },
        type: yAxisIndex ? plotType2 : plotType,
        label: {
          show: yAxisIndex ? labelEnable2 : labelEnable,
          fontSize: yAxisIndex ? labelFontSize2 : labelFontSize,
          formatter: (params:echarts.EChartOption.Tooltip.Format) => {
            return formatPieLabel({
              params: params,
              numberFormatter: yAxisIndex ? numberFormatter2 : numberFormatter,
            });
          },
          position: yAxisIndex ? labelPosition2 : labelPosition,
        },
        
        // @ts-ignore
        yAxisIndex,
        smooth: yAxisIndex ? seriesType2 === 'smooth': seriesType === 'smooth',,
        step: ['start', 'middle', 'end'].includes(seriesType as string) ? seriesType : undefined,
        stack: stackId,
        lineStyle,
        areaStyle: {
          opacity: forecastSeries.type === ForecastSeriesEnum.ForecastUpper || area ? opacity : 0,
        },
        symbolSize: markerSizeCustom,
      });
      seriesCounter +=1
  });

  annotationLayers.forEach((layer: AnnotationLayer) => {
    const {
      name,
      color,
      opacity: annotationOpacity,
      width: annotationWidth,
      show: annotationShow,
      style,
    } = layer;
    if (annotationShow && isFormulaAnnotationLayer(layer)) {
      series.push({
        name,
        id: name,
        itemStyle: {
          color: color || colorFn(name),
        },
        lineStyle: {
          opacity: parseAnnotationOpacity(annotationOpacity),
          type: style,
          width: annotationWidth,
        },
        type: 'line',
        smooth: true,
        // @ts-ignore
        data: evalFormula(layer, data),
        symbolSize: 0,
      });
    }
  });

  // yAxisBounds sometimes starts returning NaNs, which messes up the u-axis

  let [min, max] = (yAxisBounds || []).map(parseYAxisBound);
  let [min2, max2] = (yAxisBounds2 || []).map(parseYAxisBound);
     // default to 0-100% range when doing row-level contribution chart
  if (contributionMode === 'row' && stack) {
      if (min === undefined) min = 0;
      if (max === undefined) max = 1;
      if (min2 === undefined) min2 = 0;
    }

    Date.prototype.getWeek = function() {
      var date = new Date(this.getTime());
      date.setHours(0, 0, 0, 0);
      // Thursday in current week decides the year.
      date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
      // January 4 is always in week 1.
      var week1 = new Date(date.getFullYear(), 0, 4);
      // Adjust to Thursday in week 1 and count number of weeks from date to week1.
      return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                            - 3 + (week1.getDay() + 6) % 7) / 7);
    }

  const echartOptions: echarts.EChartOption = {
    grid: {
      ...defaultGrid,
      top: 50,
      bottom: zoomable ? 80 : 0,
      left: 20,
      right: 50,
    },
    xAxis: { 
      type: 'time',
      splitLine: {show:xSplitLine}
    },
    yAxis: [
      {
        ...defaultYAxis,
        type: logAxis ? 'log' : 'value',
        min,
        max,
        minorSplitLine: { show: minorSplitLine },
        splitLine: { show: splitLine },
        axisLabel: { formatter },
        axisLine: {show:axisLine },
        scale: truncateYAxis,
        
      },
      {
        ...defaultYAxis,
        type: logAxis2 ? 'log' : 'value',
        min: min2,
        max: max2,
        minorSplitLine: { show: minorSplitLine2 },
        splitLine: {show: splitLine2 },
        axisLabel: { formatter: formatter2 },
        axisLine: {show:axisLine2 },
        scale: truncateYAxis2,
        
      },
    ],
    tooltip: {
      ...defaultTooltip,
      trigger: 'axis',
      // @ts-ignore
      formatter: params => {
        // @ts-ignore
        const rows = [`${smartDateVerboseFormatter(params[0].value[0])}`];
        // @ts-ignore
        const prophetValues = extractProphetValuesFromTooltipParams(params);
        Object.keys(prophetValues).forEach(key => {
          const value = prophetValues[key];
          rows.push(
            formatProphetTooltipSeries({
              ...value,
              seriesName: key,
              formatter,
            }),
          );
        });
        return rows.join('<br />');
      },
    },
    legend: {
      data: rawSeries
        .filter(
          entry =>
            extractForecastSeriesContext(entry.name || '').type === ForecastSeriesEnum.Observation,
        )
        .map(entry => entry.name || '')
        .concat(annotationLayers.map((layer: AnnotationLayer) => layer.name)),
      right: zoomable ? 80 : 'auto',
    },
    series,
    toolbox: {
      orient: 'vertical',
      show: zoomable,
      feature: {
        dataZoom: {
          yAxisIndex: false,
          title: {
            zoom: 'zoom area',
            back: 'restore zoom',
          },
        },
        magicType: {show: true, type: ['line', 'bar']},
        restore: {show: true},
        saveAsImage: {show: true},
      },
    },
    dataZoom: zoomable
      ? [
          {
            type: 'slider',
            start: 0,
            end: 100,
            bottom: 20,
          },
        ]
      : [],
  };
  // @ts-ignore
  return {
    area,
    colorScheme,
    contributionMode,
    // @ts-ignore
    echartOptions,
    seriesType,
    logAxis,
    opacity,
    stack,
    markerSize,
    minorSplitLine,
    splitLine,
    splitLine2,
    width,
    height,
    labelEnable,
    labelFontSize,
    labelPosition,
    seriesType2,
  };
}
