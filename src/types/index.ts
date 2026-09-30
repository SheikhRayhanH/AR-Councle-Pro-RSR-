export type ApplicationStatus = 'Draft' | 'Applied' | 'Submitted' | 'In Process' | 'Offer Received' | 'Visa Processing' | 'Visa Approved' | 'Rejected'
export type Page = 'dashboard' | 'students' | 'applications' | 'universities' | 'counselors' | 'tasks' | 'reports' | 'settings' | 'payments'
export interface Student {
  id: string; name: string; email: string; phone: string; dob: string; address: string
  ssc: number; hsc: number; bachelor: number; subject: string
  country: string; university: string; budget: string; ielts: number; intake: string
  status: ApplicationStatus; counselor: string; notes: string; addedAt: string
}
export type StudentInput = Omit<Student, 'id' | 'addedAt'>
export type Role = 'admin' | 'admission' | 'counselor'
export interface User { name: string; role: Role }
export interface Payment { id: string; student: string; purpose: string; method: string; amount: number; status: 'Paid' | 'Pending'; date: string; reference?: string }
export interface University { id: string; name: string; country: string; city: string; ranking: number; tuition: string; deadline: string; ielts: number; programs: string; status: 'Open' | 'Closed' }
export interface Application { id: string; student: string; university: string; country: string; program: string; intake: string; date: string; status: ApplicationStatus }
