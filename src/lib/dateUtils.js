import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import 'dayjs/locale/fr'

dayjs.extend(isoWeek)
dayjs.locale('fr')

export const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
export const DAY_NAMES_LONG = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

export function startOfWeek(date) {
  return dayjs(date).startOf('isoWeek')
}

export function weekKey(date) {
  const d = dayjs(date)
  return `${d.isoWeekYear()}-W${String(d.isoWeek()).padStart(2, '0')}`
}

export function weekDays(date) {
  const start = startOfWeek(date)
  return Array.from({ length: 7 }, (_, i) => start.add(i, 'day'))
}

export function formatDate(date) {
  return dayjs(date).format('YYYY-MM-DD')
}

export function formatRange(date) {
  const start = startOfWeek(date)
  const end = start.add(6, 'day')
  return `${start.format('DD/MM')} → ${end.format('DD/MM/YYYY')}`
}

export function isToday(date) {
  return dayjs(date).isSame(dayjs(), 'day')
}

export function todayKey() {
  return formatDate(dayjs())
}
