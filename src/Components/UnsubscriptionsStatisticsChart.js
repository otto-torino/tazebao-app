import React from 'react'
import PropTypes from 'prop-types'
import ReactHighchars from 'react-highcharts'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import Highcharts from 'highcharts'
import { defaultTo } from 'ramda'

const UnsubscriptionsStatisticsChart = ({ data }) => {
  const { t } = useTranslation()
  let acc = 0

  const config = {
    chart: {
      zoomType: 'x'
    },
    time: {
      timezoneOffset: -2 * 60
    },
    title: {
      text: t('Unsubscriptions statistics')
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: t('Date')
      }
    },
    yAxis: [
      {
        title: {
          text: t('New unsubscriptions number')
        },
        min: 0
      },
      {
        title: {
          text: t('Total')
        },
        min: 0,
        opposite: true
      }
    ],
    tooltip: {
      shared: true,
      pointFormat: '{series.name}: {point.y}<br>'
    },

    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, Highcharts.getOptions().colors[0]],
            [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
          ]
        },
        marker: {
          radius: 2
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        },
        threshold: null
      }
    },

    // Define the data points. All series have a dummy year
    // of 1970/71 in order to be compared on the same x axis. Note
    // that in JavaScript, months start at 0 for January, 1 for February etc.
    series: [
      {
        name: 'Unsubscriptions',
        type: 'column',
        data: defaultTo([], data?.unsubscriptions_stats).map(item => {
          return [parseInt(moment(item.datetime__date).format('x')), item.cnt]
        })
      },
      {
        name: 'Total',
        type: 'area',
        yAxis: 1,
        data: defaultTo([], data?.unsubscriptions_stats).map(item => {
          acc += item.cnt
          return [parseInt(moment(item.datetime__date).format('x')), acc]
        })
      }
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            plotOptions: {
              series: {
                marker: {
                  radius: 2.5
                }
              }
            }
          }
        }
      ]
    }
  }

  return <ReactHighchars config={config} />
}

UnsubscriptionsStatisticsChart.propTypes = {
  data: PropTypes.shape({
    unsubscriprions_stats: PropTypes.arrayOf(PropTypes.shape({
      datetime__date: PropTypes.string,
      cnt: PropTypes.number
    }))
  })
}

export default UnsubscriptionsStatisticsChart
