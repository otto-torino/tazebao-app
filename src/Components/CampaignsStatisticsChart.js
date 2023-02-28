import React from 'react'
import PropTypes from 'prop-types'
import ReactHighchars from 'react-highcharts'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { prop, sortBy } from 'ramda'

const CampaignsStatisticsChart = ({ data }) => {
  const { t } = useTranslation()

  const sortedData = sortBy(prop('started_at'), data)

  const config = {
    chart: {
      zoomType: 'x'
    },
    time: {
      timezoneOffset: new Date(data[0]?.started_at).getTimezoneOffset()
    },
    title: {
      text: t('Campaigns statistics')
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        // don't display the dummy year
        month: '%e. %b',
        year: '%b'
      },
      title: {
        text: t('Date')
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
        }, '<b>' + this.points[0].point.campaignName + '</b>')
      }
    },

    // Define the data points. All series have a dummy year
    // of 1970/71 in order to be compared on the same x axis. Note
    // that in JavaScript, months start at 0 for January, 1 for February etc.
    series: [
      {
        name: 'Open rate',
        type: 'spline',
        data: sortedData.map(item => {
          return {
            x: parseInt(moment(item.started_at).format('x')),
            y: item.open_rate,
            campaignName: item.campaign_name,
            unit: '%'
          }
        })
      },
      {
        name: 'Click rate',
        type: 'spline',
        data: sortedData.map(item => {
          return {
            x: parseInt(moment(item.started_at).format('x')),
            y: item.click_rate,
            campaignName: item.campaign_name,
            unit: '%'
          }
        })
      },
      {
        name: 'Sent',
        type: 'spline',
        data: sortedData.map(item => {
          return {
            x: parseInt(moment(item.started_at).format('x')),
            y: item.sent,
            campaignName: item.campaign_name,
            unit: ''
          }
        }),
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

CampaignsStatisticsChart.propTypes = {
  data: PropTypes.array
}

export default CampaignsStatisticsChart
