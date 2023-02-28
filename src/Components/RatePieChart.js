import React from 'react'
import PropTypes from 'prop-types'
import ReactHighchars from 'react-highcharts'
import Config from '../Config'

const RatePieChart = ({ title, label, trueLabel, falseLabel, data }) => {
  const config = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: title
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        },
        showInLegend: true
      }
    },
    colors: Config.ui.chartColors,
    series: [
      {
        name: label,
        colorByPoint: true,
        data: [
          {
            name: trueLabel,
            y: data,
            sliced: true,
            selected: true
          },
          {
            name: falseLabel,
            y: (100 - data)
          }
        ]
      }
    ]
  }
  return <ReactHighchars config={config} />
}

RatePieChart.propTypes = {
  title: PropTypes.string,
  label: PropTypes.string,
  trueLabel: PropTypes.string,
  falseLabel: PropTypes.string,
  data: PropTypes.number
}

export default RatePieChart
