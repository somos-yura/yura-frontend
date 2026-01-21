import { STAKEHOLDER_AVAILABILITY_CONFIG } from '../config/stakeholder_availability'

export interface StakeholderAvailabilityStatus {
  isAvailable: boolean
  nextAvailableTime?: string
}

export class StakeholderAvailabilityService {
  static getCurrentStatus(): StakeholderAvailabilityStatus {
    const now = new Date()
    const day = now.getDay()
    const hour = now.getHours()

    const isWorkDay = STAKEHOLDER_AVAILABILITY_CONFIG.WORK_DAYS.includes(day)
    if (!isWorkDay) return { isAvailable: false }

    const isWorkingHours = STAKEHOLDER_AVAILABILITY_CONFIG.RANGES.some(
      (range) => hour >= range.start && hour < range.end
    )

    return {
      isAvailable: isWorkingHours,
    }
  }

  static getFormattedWorkingHours(): string {
    return STAKEHOLDER_AVAILABILITY_CONFIG.RANGES.map(
      (range) => `${range.start}:00 - ${range.end}:00`
    ).join(' y ')
  }

  static getFormattedWorkingDays(): string {
    return 'Lunes a Viernes'
  }
}
