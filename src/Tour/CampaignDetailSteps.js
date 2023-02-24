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
        <h4>{i18next.t('Campaign detail')}</h4>
        <p>{i18next.t('CampaignDetailHelpStep0Text')}</p>
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
  selector: '[data-tour="campaign-detail-general-info"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Campaign information')}</h4>
        <p>{i18next.t('CampaignDetailHelpStep1Text')}</p>
        {nextButton(goTo, 2)}
      </div>
    )
  },
  position: 'bottom',
  style: {
    backgroundColor: bgColor
  },
  stepInteraction: true
})

steps.push({
  selector: '[data-tour="campaign-detail-dispatches"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Dispatches')}</h4>
        <p>{i18next.t('CampaignDetailHelpStep2Text')}</p>
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
  selector: '[data-tour="campaign-detail-view-test"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('View test dispatches')}</h4>
        <p>{i18next.t('CampaignDetailHelpStep3Text')}</p>
        {nextButton(goTo, 4)}
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
  selector: '[data-tour="campaign-detail-dispatch-info"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Dispatch information')}</h4>
        <p>{i18next.t('CampaignDetailHelpStep4Text')}</p>
        {nextButton(goTo, 5)}
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
  selector: '[data-tour="campaign-detail-bounces"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Bounces information')}</h4>
        <p>{i18next.t('CampaignDetailHelpStep5Text')}</p>
        {nextButton(goTo, 6)}
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
  selector: '[data-tour="campaign-detail-open"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Open statistics')}</h4>
        <p>{i18next.t('CampaignDetailHelpStep6Text')}</p>
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
  selector: '[data-tour="campaign-detail-click"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Click statistics')}</h4>
        <p>{i18next.t('CampaignDetailHelpStep7Text')}</p>
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
  selector: '[data-tour="campaign-detail-charts"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Charts')}</h4>
        <p>{i18next.t('CampaignDetailHelpStep8Text')}</p>
        {nextButton(goTo, 9)}
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
  selector: '[data-tour="campaign-click-statistics"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Click statistics')}</h4>
        <p>{i18next.t('CampaignDetailHelpStep9Text')}</p>
        {nextButton(goTo, 10)}
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
