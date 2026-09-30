import type { Application, ApplicationStatus, Role, Student, University, User } from '../types'
export const COUNSELORS = ['Farhana Akter', 'Imran Hossain', 'Sabina Yasmin', 'Kamrul Hasan']
export const STATUSES: ApplicationStatus[] = ['Draft', 'Applied', 'Submitted', 'In Process', 'Offer Received', 'Visa Processing', 'Visa Approved', 'Rejected']
const row = (i: number, name: string, c: number, country: string, ssc: number, hsc: number, bachelor: number, subject: string, ielts: number, status: ApplicationStatus, addedAt: string): Student => ({
  id: `s${i}`, name, email: `${name.split(' ')[0].toLowerCase()}@example.com`, phone: `01700-00000${i}`, dob: '2000-01-15', address: 'Dhaka, Bangladesh',
  ssc, hsc, bachelor, subject, country, university: 'To be decided', budget: 'BDT 20-30 lakh', ielts, intake: 'Fall 2027', status, counselor: COUNSELORS[c], notes: '', addedAt })
export const initialStudents: Student[] = [
  row(1, 'Tanvir Ahmed', 0, 'Canada', 5, 4.83, 3.42, 'CSE', 6.5, 'In Process', '2026-09-12'),
  row(2, 'Nusrat Jahan', 1, 'UK', 4.92, 4.67, 3.6, 'BBA', 7, 'Submitted', '2026-09-14'),
  row(3, 'Rafiul Islam', 0, 'Australia', 5, 5, 3.75, 'EEE', 7.5, 'Offer Received', '2026-09-02'),
  row(4, 'Mehedi Hasan', 2, 'Canada', 4.75, 4.5, 3.3, 'Business', 6, 'Visa Approved', '2026-08-21'),
  row(5, 'Sadia Afrin', 3, 'USA', 4.58, 4.42, 3.15, 'Pharmacy', 6.5, 'Draft', '2026-09-28'),
  row(6, 'Arif Chowdhury', 2, 'UK', 5, 4.92, 3.88, 'CSE', 7, 'Applied', '2026-09-25'),
]
export const BASE = { students: 122, apps: 13, offers: 10, visa: 6, pending: 10 } // mock baseline until a real API exists
export const TREND = [[6,2,1],[8,3,1],[10,4,2],[9,4,2],[13,6,3],[15,7,4],[14,7,4],[18,9,5],[17,9,5],[20,11,6],[22,12,7],[18,11,7]]
  .map(([applications, offers, visa], i) => ({ month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i], applications, offers, visa }))
export const COUNTRIES = [{ name: 'Canada', value: 32, color: '#1d4ed8' }, { name: 'UK', value: 25, color: '#0ea5e9' }, { name: 'Australia', value: 18, color: '#6366f1' }, { name: 'USA', value: 12, color: '#059669' }, { name: 'Others', value: 13, color: '#94a3b8' }]
export const ACTIVITIES = [['New student registered', 'Tanvir Ahmed', '10 min ago'], ['Application submitted', 'Nusrat Jahan', '1 hr ago'], ['Offer received', 'Rafiul Islam', '3 hrs ago'], ['Visa approved', 'Mehedi Hasan', 'Yesterday'], ['New student registered', 'Sadia Afrin', 'Yesterday']]
export const USERS: Record<Role, User> = { admin: { name: 'Md. Rayhan Sheikh Rahat', role: 'admin' }, admission: { name: 'Nadia Karim', role: 'admission' }, counselor: { name: COUNSELORS[0], role: 'counselor' } }
// Sample data only. Rankings and fees are placeholders, not official figures.
const uni = (i: number, name: string, country: string, city: string, ranking: number, tuition: string, deadline: string, ielts: number, programs: string): University => ({ id: `u${i}`, name, country, city, ranking, tuition, deadline, ielts, programs, status: 'Open' })
export const UNIVERSITIES: University[] = [
  uni(1, 'University of Toronto', 'Canada', 'Toronto', 25, 'CAD 58,000 / year', '2027-01-15', 6.5, 'Computer Science, Engineering, MBA'),
  uni(2, 'University of Manchester', 'UK', 'Manchester', 35, 'GBP 27,000 / year', '2027-03-01', 6.5, 'Management, Computer Science'),
  uni(3, 'UNSW Sydney', 'Australia', 'Sydney', 19, 'AUD 48,000 / year', '2027-02-10', 6.5, 'Engineering, IT'),
  uni(4, 'Arizona State University', 'USA', 'Tempe', 179, 'USD 32,000 / year', '2027-03-15', 6, 'Pharmacy, Data Science'),
  uni(5, 'University of Melbourne', 'Australia', 'Melbourne', 13, 'AUD 50,000 / year', '2027-01-31', 7, 'Business, Health Sciences'),
]
const app = (i: number, student: string, university: string, country: string, program: string, status: ApplicationStatus, date: string): Application => ({ id: `a${i}`, student, university, country, program, intake: 'Fall 2027', date, status })
export const APPLICATIONS: Application[] = [
  app(1, 'Tanvir Ahmed', 'University of Toronto', 'Canada', 'MSc Computer Science', 'In Process', '2026-09-13'),
  app(2, 'Nusrat Jahan', 'University of Manchester', 'UK', 'MSc Management', 'Submitted', '2026-09-15'),
  app(3, 'Rafiul Islam', 'UNSW Sydney', 'Australia', 'MEngSc Electrical Engineering', 'Offer Received', '2026-09-03'),
  app(4, 'Mehedi Hasan', 'University of Toronto', 'Canada', 'MBA', 'Visa Approved', '2026-08-22'),
  app(5, 'Sadia Afrin', 'Arizona State University', 'USA', 'MS Pharmaceutical Science', 'Draft', '2026-09-28'),
  app(6, 'Arif Chowdhury', 'University of Manchester', 'UK', 'MSc Computer Science', 'Applied', '2026-09-26'),
]
