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
        <h4>{i18next.t('Bounces')}</h4>
        <p>{i18next.t('BouncesHelpStep0TextA')}</p>
        <p>{i18next.t('BouncesHelpStep0TextB')}</p>
        <p>{i18next.t('BouncesHelpStep0TextC')}</p>
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
        <h4>{i18next.t('Bounces list')}</h4>
        <p>{i18next.t('BouncesHelpStep1Text')}</p>
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
  selector: '[data-tour="changelist-delete"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Delete bounce')}</h4>
        <p>{i18next.t('BouncesHelpStep2Text')}</p>
        {nextButton(goTo, 3)}
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
        <p>{i18next.t('BouncesHelpStep3Text')}</p>
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
  selector: '[data-tour="changelist-search"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Search bounces')}</h4>
        <p>{i18next.t('BouncesHelpStep4Text')}</p>
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
  selector: '[data-tour="changelist-selection"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Multiple actions 1/2')}</h4>
        <p>{i18next.t('BouncesHelpStep5Text')}</p>
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
  selector: '[data-tour="changelist-actions"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Multiple actions 2/2')}</h4>
        <p>{i18next.t('BouncesHelpStep6Text')}</p>
        {nextButton(goTo, 7)}
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
  selector: '[data-tour="help-button"]',
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
