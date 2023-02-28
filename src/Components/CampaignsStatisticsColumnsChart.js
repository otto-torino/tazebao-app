import React from 'react'
import PropTypes from 'prop-types'
import ReactHighchars from 'react-highcharts'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { prop } from 'ramda'
import Config from '../Config'

const CampaignsStatisticsColumnsChart = ({ data }) => {
  const { t } = useTranslation()

  const config = {
    chart: {
      zoomType: 'x'
    },
    colors: Config.ui.chartColors,
    time: {
      timezoneOffset: new Date(data[0]?.started_at).getTimezoneOffset()
    },
    title: {
      text: t('Statistics per campaign')
    },
    xAxis: {
      categories: data.map(prop('campaign_name')),
      title: {
        text: t('Campaign')
      }
    },
    yAxis: [
      {
        title: {
          text: t('Percentage')
        },
        min: 0
      },
      {
        title: {
          text: t('Sent number')
        },
        min: 0,
        opposite: true
      }
    ],
    tooltip: {
      shared: true,
      formatter: function () {
        return this.points.reduce(function (s, point) {
          return s + '<br/>' + point.series.name + ': ' + point.y + point.point.unit
        }, '<b>' + this.points[0].point.datetime + '</b>')
      }
    },
    plotOptions: {
      column: {
        /* Here is the setting to limit the maximum column width. */
        maxPointWidth: 50
      }
    },
    // Define the data points. All series have a dummy year
    // of 1970/71 in order to be compared on the same x axis. Note
    // that in JavaScript, months start at 0 for January, 1 for February etc.
    series: [
      {
        name: 'Open rate',
        type: 'column',
        data: data.map((item, index) => ({
          x: index,
          y: item.open_rate,
          unit: '%',
          datetime: moment(item.started_at).format('LLL')
        }))
      },
      {
        name: 'Click rate',
        type: 'column',
        data: data.map((item, index) => ({
          x: index,
          y: item.click_rate,
          unit: '%',
          datetime: moment(item.started_at).format('LLL')
        }))
      },
      {
        name: 'Sent',
        type: 'column',
        data: data.map((item, index) => ({
          x: index,
          y: item.sent,
          unit: '%',
          datetime: moment(item.started_at).format('LLL')
        })),
        yAxis: 1
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

CampaignsStatisticsColumnsChart.propTypes = {
  data: PropTypes.array
}

export default CampaignsStatisticsColumnsChart
