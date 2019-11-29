import { getWindowWidth } from '../Lib/react-admin/Utils'
const windowWidth = getWindowWidth()

const layoutProps = {
  containerProps: {
    fluid: true,
    style: windowWidth > 500 ? { padding: '2rem' } : { padding: 0, margin: 0 }
  },
  segmentProps: {
    piled: windowWidth > 500,
    basic: windowWidth <= 500,
    style: windowWidth > 500 ? {} : { padding: 0, paddingTop: '3rem' }
  },
  labelProps: {
    color: windowWidth > 500 ? 'orange' : null,
    attached: windowWidth <= 500 ? 'top' : null,
    ribbon: windowWidth > 500,
    size: 'big',
    style: {
      marginBottom: '2rem'
    }
  }
}

export { layoutProps }
