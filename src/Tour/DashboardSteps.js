import React from 'react'
import EventDispatcher from '../Services/EventDispatcher'
import i18next from 'i18next'
import { nextButton, closeButton } from './Utils'

const bgColor = '#74b6f7'

const steps = []

steps.push({
  selector: '[data-tour="app"]',
  content: ({ goTo, inDOM }) => {
    return (
      <div>
        <h4>{i18next.t('Dashboard')}</h4>
        <p>{i18next.t('DashboardHelpStep0Text')}</p>
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
  selectors: [
    {
      selector: '[data-tour="logo"]',
      min: 0,
      max: 1300
    },
    {
      selector: '[data-tour="logo-desktop"]',
      min: 1300,
      max: 1e4
    }
  ],
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Logo')}</h4>
        <p>{i18next.t('DashboardHelpStep1Text')}</p>
        {nextButton(goTo, 2)}
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
      selector: '[data-tour="profile"]',
      min: 0,
      max: 1300
    },
    {
      selector: '[data-tour="profile-desktop"]',
      min: 1300,
      max: 1e4
    }
  ],
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Logout')}</h4>
        <p>{i18next.t('DashboardHelpStep2Text')}</p>
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
  selector: '[data-tour="subscribers-widget"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Subscribers widget')}</h4>
        <p>{i18next.t('DashboardHelpStep3Text')}</p>
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
  selector: '[data-tour="campaigns-widget"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Campaigns widget')}</h4>
        <p>{i18next.t('DashboardHelpStep4Text')}</p>
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
  selector: '[data-tour="last-dispatch-widget"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Last dispatch widget')}</h4>
        <p>{i18next.t('DashboardHelpStep5Text')}</p>
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
  selector: '[data-tour="planning-widget"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Planning widget')}</h4>
        <p>{i18next.t('DashboardHelpStep6Text')}</p>
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
  selector: '[data-tour="menu-icon"]',
  content: ({ goTo, inDOM, close }) => {
    return (
      <div>
        <h4>{i18next.t('Menu')}</h4>
        <p>{i18next.t('DashboardHelpStep7Text')}</p>
      </div>
    )
  },
  position: 'bottom',
  style: {
    backgroundColor: bgColor
  },
  onSpotClick: (goto, dispatch) => {
    EventDispatcher.emit('tourSuspend', { interval: 500 })
    EventDispatcher.emit('openSidebar')
    setTimeout(() => goto(8), 500)
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
        {closeButton(() => {
          EventDispatcher.emit('closeSidebar')
          close()
        })}
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
