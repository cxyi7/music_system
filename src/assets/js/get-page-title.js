import defaultSettings from '@/settings'

const title = defaultSettings.title || '花雨'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
