import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BaseLayout from '../../Layouts/BaseLayout'
import PlanningForm from '../../Forms/PlanningForm'
import PlanningActions from '../../Redux/Planning'
import { ModelAdmin, ChangeList } from '../../Lib/react-admin'
import { useTranslation } from 'react-i18next'
import { request } from '../../Services/Request'
import moment from 'moment'

import styles from './PlanningView.module.scss'

const PlanningView = props => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const planning = useSelector(state => state.planning.data)
  const campaigns = useSelector(state => state.campaigns.data)
  const isWholeDataSet = useSelector(state => state.planning.isWholeDataSet)
  const querystring = useSelector(state => state.planning.qs)
  const planningCount = useSelector(state => state.planning.count)
  const lists = useSelector(state => state.lists.data)
  const isLoading = useSelector(state => state.planning.fetching)

  const listDisplay = ['id', 'campaign_name', 'schedule']

  const handleInsert = data => {
    data.schedule = data.schedule.format('YYYY-MM-DD HH:mm:ss')
    return request(
      'addPlanning',
      [data],
      t('There was an error inserting the schedule') + ': {error}',
      response => dispatch(PlanningActions.planningRequest())
    )
  }

  const handleEdit = (id, data) => {
    return request(
      'editPlanning',
      [data],
      t('There was an error editing the schedule') + ': {error}',
      response => dispatch(PlanningActions.planningRequest())
    )
  }

  const handleDelete = id => {
    return request(
      'deletePlanning',
      [id],
      t('There was an error deleting the schedule') + ': {error}',
      response => dispatch(PlanningActions.planningRequest())
    )
  }

  const description = (
    <p>{t('Here is your planning of scheduled dispatches')}.</p>
  )

  const handleUpdateQuerystring = qs => {
    dispatch(PlanningActions.planningQuerystring(qs))
  }

  return (
    <BaseLayout wrapperStyle={styles.adminView}>
      <ModelAdmin
        icon='clock'
        title='Planning'
        FormComponent={PlanningForm}
        formProps={{ lists, campaigns }}
        toStringProp='campaign_name'
        verboseName={t('schedule')}
        verboseNamePlural={t('schedules')}
        onInsert={handleInsert}
        onEdit={handleEdit}
        onDelete={handleDelete}
        idProp='id'
      >
        {({
          handleInsert,
          handleEdit,
          handleDelete,
          idProp,
          verboseName,
          verboseNamePlural
        }) => (
          <ChangeList
            onInsert={handleInsert}
            onEdit={handleEdit}
            description={description}
            onDelete={handleDelete}
            items={planning}
            isLoading={isLoading}
            listDisplay={listDisplay}
            idProp={idProp}
            verboseName={verboseName}
            verboseNamePlural={verboseNamePlural}
            searchFields={['campaign_name']}
            fieldsMapping={{
              schedule: v => moment(v).format('LLL')
            }}
            querystring={querystring}
            dataSetCount={planningCount}
            onUpdateQuerystring={handleUpdateQuerystring}
          />
        )}
      </ModelAdmin>
    </BaseLayout>
  )
}

PlanningView.propTypes = {}

export default PlanningView
