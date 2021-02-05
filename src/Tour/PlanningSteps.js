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
        <h4>{i18next.t('Planning')}</h4>
        <p>{i18next.t('PlanningHelpStep0Text')}</p>
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
        <h4>{i18next.t('Planning list')}</h4>
        <p>{i18next.t('PlanningHelpStep1Text')}</p>
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
        <h4>{i18next.t('Add scheduled dispatch')}</h4>
        <p>{i18next.t('PlanningHelpStep2Text')}</p>
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
  selector: '[data-tour="changelist-edit"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Edit scheduled dispatch')}</h4>
        <p>{i18next.t('PlanningHelpStep3Text')}</p>
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
  selector: '[data-tour="changelist-delete"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Delete scheduled dispatch')}</h4>
        <p>{i18next.t('PlanningHelpStep4Text')}</p>
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
  selector: '[data-tour="changelist-search"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Search scheduled dispatch')}</h4>
        <p>{i18next.t('PlanningHelpStep5Text')}</p>
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
