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
import React from 'react';
import { t } from '@superset-ui/core';
import { ControlPanelConfig, D3_FORMAT_DOCS, D3_FORMAT_OPTIONS } from '@superset-ui/chart-controls';


const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['metrics'],
        ['metric_2'],
        ['groupby'],
        [
          {
            name: 'contributionMode',
            config: {
              type: 'SelectControl',
              label: t('Contribution Mode'),
              default: null,
              choices: [
                [null, 'None'],
                ['row', 'Total'],
                ['column', 'Series'],
              ],
              description: t('Calculate contribution per series or total'),
            },
          },
        ],
        ['adhoc_filters'],
        ['limit', 'timeseries_limit_metric'],
        [
          {
            name: 'order_desc',
            config: {
              type: 'CheckboxControl',
              label: t('Sort Descending'),
              default: true,
              description: t('Whether to sort descending or ascending'),
            },
          },
        ],
        ['row_limit', null],
      ],
    },
    {
      label: t('Annotations and Layers'),
      expanded: false,
      controlSetRows: [
        [
          {
            name: 'annotation_layers',
            config: {
              type: 'AnnotationLayerControl',
              label: '',
              default: [],
              description: 'Annotation Layers',
              renderTrigger: true,
              tabOverride: 'data',
            },
          },
        ],
      ],
    },
    /*{
      label: t('Predictive Analytics'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'forecastEnabled',
            config: {
              type: 'CheckboxControl',
              label: t('Enable forecast'),
              renderTrigger: false,
              default: false,
              description: t('Enable forecasting'),
            },
          },
        ],
        [
          {
            name: 'forecastPeriods',
            config: {
              type: 'TextControl',
              label: t('Forecast periods'),
              validators: [legacyValidateInteger],
              default: 10,
              description: t('How many periods into the future do we want to predict'),
            },
          },
        ],
        [
          {
            name: 'forecastInterval',
            config: {
              type: 'TextControl',
              label: t('Confidence interval'),
              validators: [legacyValidateNumber],
              default: 0.8,
              description: t('Width of the confidence interval. Should be between 0 and 1'),
            },
          },
          {
            name: 'forecastSeasonalityYearly',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: 'Yearly seasonality',
              choices: [
                [null, 'default'],
                [true, 'Yes'],
                [false, 'No'],
              ],
              default: null,
              description: t(
                'Should yearly seasonality be applied. An integer value will specify Fourier order of seasonality.',
              ),
            },
          },
        ],
        [
          {
            name: 'forecastSeasonalityWeekly',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: 'Weekly seasonality',
              choices: [
                [null, 'default'],
                [true, 'Yes'],
                [false, 'No'],
              ],
              default: null,
              description: t(
                'Should weekly seasonality be applied. An integer value will specify Fourier order of seasonality.',
              ),
            },
          },
          {
            name: 'forecastSeasonalityDaily',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: 'Daily seasonality',
              choices: [
                [null, 'default'],
                [true, 'Yes'],
                [false, 'No'],
              ],
              default: null,
              description: t(
                'Should daily seasonality be applied. An integer value will specify Fourier order of seasonality.',
              ),
            },
          },
        ],
      ],
    }, */
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        [{
          name:'customColorScheme',
          config: {
            type: 'TextControl',
            label: t('Custom Color Scheme Control'),
            renderTrigger: true,
            default: '#4973BD, #5B9BD5, #4472C4, #ED7D31, #A5A5A5, #00B050, #FFC000, #92D050, #FC3A5A',
          }
        }],
        [{
            name: 'colorPicker',
            config: {
             type: 'ColorPickerControl',
             label: t('Color Picer Helper'),
             renderTrigger: true
             },
           },
           {
            name: 'useCustomScheme',
            config: {
              type: 'CheckboxControl',
              label: t('Custom Colors by hex '),
              renderTrigger: true,
              default: false,
            },
          },
        ],
        ['color_scheme', 'label_colors'],
        [
          {
            name: 'seriesType',
            config: {
              type: 'SelectControl',
              label: t('Series Style'),
              renderTrigger: true,
              default: 'line',
              choices: [
                ['line', 'Line'],
                ['scatter', 'Scatter'],
                ['smooth', 'Smooth Line'],
                ['bar', 'Bar'],
                ['start', 'Step - start'],
                ['middle', 'Step - middle'],
                ['end', 'Step - end'],
              ],
              description: t('Series chart type (line, bar etc)'),
            },
          },
        ],
        [{
          name: 'xSplitLine',
          config: {
            type: 'CheckboxControl',
            label: t('x Axis SplitLine'),
            renderTrigger: true,
            default: false,
          },
        },
        ],
        [
          {
            name: 'zoomable',
            config: {
              type: 'CheckboxControl',
              label: t('Data Zoom'),
              default: false,
              renderTrigger: true,
              description: t('Enable data zooming controls'),
            },
          },
          {
            name: 'stack',
            config: {
              type: 'CheckboxControl',
              label: t('Stack Lines'),
              renderTrigger: true,
              default: false,
              description: t('Stack series on top of each other'),
            },
          },
        ],
        [
          {
            name: 'area',
            config: {
              type: 'CheckboxControl',
              label: t('Area Chart'),
              renderTrigger: true,
              default: false,
              description: t('Draw area under curves. Only applicable for line types.'),
            },
          },
          {
            name: 'opacity',
            config: {
              type: 'SliderControl',
              label: t('Opacity'),
              renderTrigger: true,
              min: 0,
              max: 1,
              step: 0.1,
              default: 0.2,
              description: t('Opacity of Area Chart. Also applies to confidence band.'),
            },
          },
        ],

        // eslint-disable-next-line react/jsx-key
        [<h1 className="section-header">{t('Y Axis')}</h1>],
        ['y_axis_format'],
        [
          {
            name: 'logAxis',
            config: {
              type: 'CheckboxControl',
              label: t('Logarithmic y-axis'),
              renderTrigger: true,
              default: false,
              description: t('Logarithmic y-axis'),
            },
          },
          {
            name: 'minorSplitLine',
            config: {
              type: 'CheckboxControl',
              label: t('Minor Split Line'),
              renderTrigger: true,
              default: false,
              description: t('Draw split lines for minor y-axis ticks'),
            },
          },
        ],
        [
          {
            name: 'truncateYAxis',
            config: {
              type: 'CheckboxControl',
              label: t('Truncate Y Axis'),
              default: true,
              renderTrigger: true,
              description: t(
                'Truncate Y Axis. Can be overridden by specifying a min or max bound.',
              ),
            },
          },
          {
            name: 'splitLine',
            config: {
              type: 'CheckboxControl',
              label: t('Split Line'),
              renderTrigger: true,
              default: true,
              description: t('Draw split lines for y-axis ticks'),
            },
          },
          {
            name: 'axisLine',
            config: {
              type: 'CheckboxControl',
              label: t('yAxis  Line'),
              renderTrigger: true,
              default: true,
              description: t(' axis line show'),
            },
          },
        ],
        [
          {
            name: 'y_axis_bounds',
            config: {
              type: 'BoundsControl',
              label: t('Y Axis Bounds'),
              renderTrigger: true,
              default: [undefined, undefined],
              description: t(
                'Bounds for the Y-axis. When left empty, the bounds are ' +
                  'dynamically defined based on the min/max of the data. Note that ' +
                  "this feature will only expand the axis range. It won't " +
                  "narrow the data's extent.",
              ),
            },
          },
        ],
      ],
    },

      {
        label: t('Label Options'),
        expanded: true,
        controlSetRows: [
          [
            {
              name: 'labelEnable',
              config: {
                type: 'CheckboxControl',
                label: t('labelEnable'),
                renderTrigger: true,
                default: false,
                description: t('Stack series on top of each other'),
              },
            },
            {
              name: 'labelFontSize',
              config: {
                type: 'SliderControl',
                label: t('FontSize'),
                renderTrigger: true,
                min: 8,
                max: 16,
                step: 1,
                default: 12,
                description: t('FontSize'),
              },
            },
          ],
          [
            {
              name: 'markerSize',
              config: {
                type: 'SliderControl',
                label: t('Marker Size'),
                renderTrigger: true,
                min: 0,
                max: 50,
                default: 6,
                description: t('Size of marker. Also applies to forecast observations.'),
              },
            },
          ],
          [
            {
              name: 'labelPosition',
              config: {
                type: 'SelectControl',
                label: t('labelPosition'),
                renderTrigger: true,
                default: 'top',
                choices: [
                  ['top', 'top'],
                  ['left', 'left'],
                  ['right', 'right'],
                  ['bottom', 'bottom'],
                  ['inside', 'inside'],
                  ['insideLeft', 'insideLeft'],
                  ['insideRight', 'insideRight'],
                  ['insideTop', 'insideTop'],
                  ['insideBottom', 'insideBottom'],
                  ['insideTopLeft', 'insideTopLeft'],
                  ['insideBottomLeft', 'insideBottomLeft'],
                  ['insideTopRight', 'insideTopRight'],
                  ['insideBottomRight', 'insideBottomRight'],
                ],
                description: t('Series chart type (line, bar etc)'),
              },
            },
            {
              name: 'number_format',
              config: {
                type: 'SelectControl',
                freeForm: true,
                label: t('Number format 1'),
                renderTrigger: true,
                default: 'SMART_NUMBER',
                choices: [
                  ['SMART_NUMBER', 'Adaptative formating'],
                  ['~g', 'Original value'],
                  [',d', ',d (12345.432 => 12,345)'],
                  ['.1s', '.1s (12345.432 => 10k)'],
                  ['.2s', '.2s (12345.432 => 10.4k)'],
                  ['.3s', '.3s (12345.432 => 12.43k)'],
                  ['.0%', ',.0% (12345.432 => 1234543%)'],
                  [',.1%', ',.1% (12345.432 => 1,234,543.2%)'],
                  [',.1f', ',.1f (12345.432 => 12,345.4)'],
                  [',.2f', ',.2f (12345.432 => 12,345.43)'],
                  [',.3f', ',.3f (12345.432 => 12,345.432)'],
                  ['+,', '+, (12345.432 => +12,345.432)'],
                ],
                description: `${t('D3 format syntax: https://github.com/d3/d3-format')} ${t(
                  'Only applies when "Label Type" is set to show values.',
                )}`,
              },
            },
          ],
        ]
      },

    {
      label: t('2nd Chart Options'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'seriesType2',
            config: {
              type: 'SelectControl',
              label: t('Series Style'),
              renderTrigger: true,
              default: 'line',
              choices: [
                ['line', 'Line'],
                ['scatter', 'Scatter'],
                ['smooth', 'Smooth Line'],
                ['bar', 'Bar'],
                ['start', 'Step - start'],
                ['middle', 'Step - middle'],
                ['end', 'Step - end'],
              ],
              description: t('Series chart type (line, bar etc)'),
            },
          },
        ],
        
        ['label_colors'],    
        [
          {
            name: 'stack2',
            config: {
              type: 'CheckboxControl',
              label: t('Stack Lines'),
              renderTrigger: true,
              default: false,
              description: t('Stack series on top of each other'),
            },
          },
        ],
        [
          {
            name: 'labelEnable2',
            config: {
              type: 'CheckboxControl',
              label: t('labelEnable2'),
              renderTrigger: true,
              default: false,
              description: t('Stack series on top of each other'),
            },
          },
          {
            name: 'labelFontSize2',
            config: {
              type: 'SliderControl',
              label: t('FontSize'),
              renderTrigger: true,
              min: 8,
              max: 20,
              step: 1,
              default: 12,
              description: t('FontSize'),
            },
          },
        ],
        
        [
          {
            name: 'labelPosition2',
            config: {
              type: 'SelectControl',
              label: t('labelPosition2'),
              renderTrigger: true,
              default: 'top',
              choices: [
                ['top', 'top'],
                ['left', 'left'],
                ['right', 'right'],
                ['bottom', 'bottom'],
                ['inside', 'inside'],
                ['insideLeft', 'insideLeft'],
                ['insideRight', 'insideRight'],
                ['insideTop', 'insideTop'],
                ['insideBottom', 'insideBottom'],
                ['insideTopLeft', 'insideTopLeft'],
                ['insideBottomLeft', 'insideBottomLeft'],
                ['insideTopRight', 'insideTopRight'],
                ['insideBottomRight', 'insideBottomRight'],
              ],
              description: t('Series chart type (line, bar etc)'),
            },
          },
          {
            name: 'number_format2',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Number format 2'),
              renderTrigger: true,
              default: 'SMART_NUMBER',
              choices: [
                ['SMART_NUMBER', 'Adaptative formating'],
                ['~g', 'Original value'],
                [',d', ',d (12345.432 => 12,345)'],
                ['.1s', '.1s (12345.432 => 10k)'],
                ['.2s', '.2s (12345.432 => 10.4k)'],
                ['.3s', '.3s (12345.432 => 12.43k)'],
                ['.0%', ',.0% (12345.432 => 1234543%)'],
                [',.1%', ',.1% (12345.432 => 1,234,543.2%)'],
                [',.1f', ',.1f (12345.432 => 12,345.4)'],
                [',.2f', ',.2f (12345.432 => 12,345.43)'],
                [',.3f', ',.3f (12345.432 => 12,345.432)'],
                ['+,', '+, (12345.432 => +12,345.432)'],
              ],
              description: `${t('D3 format syntax: https://github.com/d3/d3-format')} ${t(
                'Only applies when "Label Type" is set to show values.',
              )}`,
            },
          },
        ],
        [
          {
            name: 'area2',
            config: {
              type: 'CheckboxControl',
              label: t('Area Chart'),
              renderTrigger: true,
              default: false,
              description: t('Draw area under curves. Only applicable for line types.'),
            },
          },
          {
            name: 'opacity2',
            config: {
              type: 'SliderControl',
              label: t('Opacity'),
              renderTrigger: true,
              min: 0,
              max: 1,
              step: 0.1,
              default: 0.2,
              description: t('Opacity of Area Chart. Also applies to confidence band.'),
            },
          },
        ],
        [
          {
            name: 'markerSize2',
            config: {
              type: 'SliderControl',
              label: t('Marker Size'),
              renderTrigger: true,
              min: 0,
              max: 50,
              default: 6,
              description: t('Size of marker. Also applies to forecast observations.'),
            },
          },
        ],

        // eslint-disable-next-line react/jsx-key
        [<h1 className="section-header">{t('Y Axis 2')}</h1>],
        [{
          name: 'yAxisFormat2',
          config: {
            type: 'SelectControl',
            freeForm: true,
            label: t('Y Axis 2 Format'),
            renderTrigger: true,
            default: 'SMART_NUMBER',
            choices: D3_FORMAT_OPTIONS,
            description: D3_FORMAT_DOCS,
            mapStateToProps: state => {
              const showWarning = state.controls?.comparison_type?.value === 'percentage';
              return {
                warning: showWarning
                  ? t(
                      'When `Calculation type` is set to "Percentage change", the Y ' +
                        'Axis Format is forced to `.1%`',
                    )
                  : null,
                disabled: showWarning,
              };
            },
          },
        }],
        [
          {
            name: 'logAxis2',
            config: {
              type: 'CheckboxControl',
              label: t('Logarithmic y-axis'),
              renderTrigger: true,
              default: false,
              description: t('Logarithmic y-axis'),
            },
          },
          {
            name: 'minorSplitLine2',
            config: {
              type: 'CheckboxControl',
              label: t('Minor Split Line'),
              renderTrigger: true,
              default: false,
              description: t('Draw split lines for minor y-axis ticks'),
            },
          },
        ],
        [
          {
            name: 'truncateYAxis2',
            config: {
              type: 'CheckboxControl',
              label: t('Truncate Y Axis'),
              default: true,
              renderTrigger: true,
              description: t(
                'Truncate Y Axis. Can be overridden by specifying a min or max bound.',
              ),
            },
          },
          {
            name: 'splitLine2',
            config: {
              type: 'CheckboxControl',
              label: t('Split Line 2'),
              renderTrigger: true,
              default: true,
              description: t('Draw split lines for y-axis ticks'),
            },
          },
          {
            name: 'axisLine2',
            config: {
              type: 'CheckboxControl',
              label: t('yAxis 2 Line'),
              renderTrigger: true,
              default: true,
              description: t(' axis line show'),
            },
          },
          
        ],
        [
          {
            name: 'y_axis_bounds2',
            config: {
              type: 'BoundsControl',
              label: t('Y Axis Bounds'),
              renderTrigger: true,
              default: [undefined, undefined],
              description: t(
                'Bounds for the Y-axis. When left empty, the bounds are ' +
                  'dynamically defined based on the min/max of the data. Note that ' +
                  "this feature will only expand the axis range. It won't " +
                  "narrow the data's extent.",
              ),
            },
          },
        ],
      ],
    },
  ],
  // Time series charts need to override the `druidTimeSeries` and `sqlaTimeSeries`
  // sections to add the time grain dropdown.
  sectionOverrides: {
    druidTimeSeries: {
      controlSetRows: [['granularity', 'druid_time_origin'], ['time_range']],
    },
    sqlaTimeSeries: {
      controlSetRows: [['granularity_sqla', 'time_grain_sqla'], ['time_range']],
    },
  },
  controlOverrides: {
    row_limit: {
      default: 10000,
    },
  },
};

export default config;
