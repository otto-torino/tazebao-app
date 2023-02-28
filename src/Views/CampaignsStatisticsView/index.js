import React from 'react'
import { Container, Icon, Label, Segment } from 'semantic-ui-react'
import { layoutProps } from '../../Styles/Common'
import BaseLayout from "../../Layouts/BaseLayout"
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { api } from '../../Sagas'
import { defaultTo } from 'ramda'
import { withLoader } from '../../HOC/Loader'
import CampaignsStatisticsChart from '../../Components/CampaignsStatisticsChart'
import ClickStatisticsTable from '../../Components/ClickStatisticsTable'
import CampaignsStatisticsColumnsChart from '../../Components/CampaignsStatisticsColumnsChart'
import history from '../../history'
import Config from '../../Config'

const CampaignsStatisticsView = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const [data, setData] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.dispatchesStatistics(defaultTo([], location.state?.ids))
        setData(res.data.dispatches)
      } catch (e) {
        console.log('Fetch dispatch stats error:', e)
      }
      setIsLoading(false)
    }

    fetchData()
  }, [location.state?.ids])

  if (!location.state?.ids) history.push(Config.urls.campaigns)

  return (
    <BaseLayout>
      <Container {...layoutProps.containerProps}>
        <Segment {...layoutProps.segmentProps}>
          <Label {...layoutProps.labelProps}>
            <Icon name='line chart' /> {t('Campaigns statistics comparison')}
          </Label>
          {withLoader(() => (
            <div>
              <CampaignsStatisticsChart data={data} />
              <CampaignsStatisticsColumnsChart data={data} />
              <ClickStatisticsTable
                events={data.reduce(
                  (acc, curr) => [...acc, ...curr.trackings.filter(t => t.type === 'click')], [])}
              />
            </div>
          ), isLoading)}
        </Segment>
      </Container>
    </BaseLayout>
  )
}

export default CampaignsStatisticsView
