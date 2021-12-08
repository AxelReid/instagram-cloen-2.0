import { atom } from 'recoil'

const themeState = atom({
  key: 'darkTheme',
  default: false,
})
export default themeState
