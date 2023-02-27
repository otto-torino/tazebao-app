import React from 'react'
import PropTypes from 'prop-types'
import ReactHighchars from 'react-highcharts'
import moment from 'moment'
import Highcharts from 'highcharts'

const StatisticsTimelineChart = ({ title, label, data }) => {
  let acc = 0
  const config = {
    chart: {
      type: 'area',
      zoomType: 'x'
    },
    time: {
      timezoneOffset: -2 * 60
    },
    title: {
      text: title
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        // don't display the dummy year
        month: '%e. %b',
        year: '%b'
      },
      title: {
        text: 'Time'
      }
    },
    yAxis: {
      title: {
        text: 'Open acc.'
      },
      min: 0
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br>',
      pointFormat: '{point.x:%e %b %H:%M}: {point.y}'
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
        name: label,
        data: data.map(t => {
          acc = acc + 1
          // const m = moment(t.datetime)
          // return [Date.UTC(m.format('Y'), m.format('M') - 1, m.format('D')), acc]
          return [parseInt(moment.utc(t.datetime).format('x')), acc]
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

StatisticsTimelineChart.propTypes = {
  title: PropTypes.string,
  label: PropTypes.string,
  data: PropTypes.array
}

export default StatisticsTimelineChart
