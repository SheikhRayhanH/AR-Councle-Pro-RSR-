import type { Page, Role } from '../types'
// One place that decides who sees what. The backend must enforce the same rules on every request.
export const PAGE_ACCESS: Record<Role, Page[]> = {
  admin: ['dashboard', 'students', 'applications', 'universities', 'counselors', 'payments', 'tasks', 'reports', 'settings'],
  admission: ['dashboard', 'students', 'applications', 'universities'],
  counselor: ['dashboard', 'students', 'tasks'],
}
export const ROLE_LABEL: Record<Role, string> = { admin: 'Admin', admission: 'Admission team', counselor: 'Counselor' }
export const canView = (role: Role, page: Page) => PAGE_ACCESS[role].includes(page)
export const seesAllStudents = (role: Role) => role !== 'counselor'
