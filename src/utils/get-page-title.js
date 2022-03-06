import i18n from '@/lang'

export default function getPageTitle(key) {
  const title = i18n.t(`title`) || '基于vue2的后台管理系统模板'
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${pageName} - ${title}`
  }
  return `${title}`
}
