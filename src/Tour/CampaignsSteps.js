import React from 'react'
import i18next from 'i18next'
import { nextButton, closeButton } from './Utils'

const bgColor = '#74b6f7'

const steps = []

steps.push({
  selector: '[data-tour="app"]',
  content: ({ goTo, inDOM }) => {
    return (
      <div>
        <h4>{i18next.t('Campaigns')}</h4>
        <p>{i18next.t('CampaignsHelpStep0Text')}</p>
        {nextButton(goTo, 1)}
      </div>
    )
  },
  position: 'bottom',
  style: {
    backgroundColor: bgColor
  },
  stepInteraction: false
})

steps.push({
  selector: '[data-tour="changelist-table"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Campaigns list')}</h4>
        <p>{i18next.t('CampaignsHelpStep1Text')}</p>
        {nextButton(goTo, 2)}
      </div>
    )
  },
  position: 'bottom',
  style: {
    backgroundColor: bgColor
  },
  stepInteraction: false
})

steps.push({
  selector: '[data-tour="changelist-add"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Create campaign')}</h4>
        <p>{i18next.t('CampaignsHelpStep2Text')}</p>
        {nextButton(goTo, 3)}
      </div>
    )
  },
  position: 'bottom',
  style: {
    backgroundColor: bgColor
  },
  stepInteraction: false
})

steps.push({
  selector: '[data-tour="changelist-stats"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Dispatches statistics')}</h4>
        <p>{i18next.t('CampaignsHelpStep3Text')}</p>
        {nextButton(goTo, 4)}
      </div>
    )
  },
  position: 'bottom',
  style: {
    backgroundColor: bgColor
  },
  stepInteraction: false
})

steps.push({
  selector: '[data-tour="changelist-duplicate"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Duplicate campaign')}</h4>
        <p>{i18next.t('CampaignsHelpStep4Text')}</p>
        {nextButton(goTo, 5)}
      </div>
    )
  },
  position: 'bottom',
  style: {
    backgroundColor: bgColor
  },
  stepInteraction: false
})

steps.push({
  selector: '[data-tour="changelist-send"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Send campaign')}</h4>
        <p>{i18next.t('CampaignsHelpStep5Text')}</p>
        {nextButton(goTo, 6)}
      </div>
    )
  },
  position: 'bottom',
  style: {
    backgroundColor: bgColor
  },
  stepInteraction: false
})

steps.push({
  selector: '[data-tour="changelist-edit"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Edit campaign')}</h4>
        <p>{i18next.t('CampaignsHelpStep6Text')}</p>
        {nextButton(goTo, 7)}
      </div>
    )
  },
  position: 'bottom',
  style: {
    backgroundColor: bgColor
  },
  stepInteraction: false,
  skipIfNotVisible: true
})

steps.push({
  selector: '[data-tour="changelist-delete"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Delete campaign')}</h4>
        <p>{i18next.t('CampaignsHelpStep7Text')}</p>
        {nextButton(goTo, 8)}
      </div>
    )
  },
  position: 'bottom',
  style: {
    backgroundColor: bgColor
  },
  stepInteraction: false,
  skipIfNotVisible: true
})

steps.push({
  selector: '[data-tour="changelist-pagination"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Pagination')}</h4>
        <p>{i18next.t('CampaignsHelpStep8Text')}</p>
        {nextButton(goTo, 9)}
      </div>
    )
  },
  position: 'bottom',
  style: {
    backgroundColor: bgColor
  },
  stepInteraction: false
})

steps.push({
  selector: '[data-tour="changelist-search"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Search campaign')}</h4>
        <p>{i18next.t('CampaignsHelpStep9Text')}</p>
        {nextButton(goTo, 10)}
      </div>
    )
  },
  position: 'bottom',
  style: {
    backgroundColor: bgColor
  },
  stepInteraction: false
})

steps.push({
  selector: '[data-tour="changelist-filter-topic"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Filter campaigns')}</h4>
        <p>{i18next.t('CampaignsHelpStep10Text')}</p>
        {nextButton(goTo, 11)}
      </div>
    )
  },
  position: 'bottom',
  style: {
    backgroundColor: bgColor
  },
  stepInteraction: false
})

steps.push({
  selectors: [
    {
      selector: '[data-tour="help-button"]',
      min: 0,
      max: 1300
    },
    {
      selector: '[data-tour="help-button-desktop"]',
      min: 1300,
      max: 1e4
    }
  ],
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Help button')}</h4>
        <p>{i18next.t('DashboardHelpStep9Text')}</p>
        {closeButton(close)}
      </div>
    )
  },
  position: 'bottom',
  style: {
    backgroundColor: bgColor
  },
  stepInteraction: false
})

export default steps
