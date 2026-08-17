// ─── Mock Users ─────────────────────────────────────────────
export const mockUsers = [
  {
    id: 1,
    name: 'Amey Kapdi',
    email: 'amey@example.com',
    profession: 'Web Developer',
    neighborhood: 'Kothrud, Pune',
    skills: ['JavaScript', 'React', 'Node.js'],
    availability: 'Weekends',
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Priya Sharma',
    email: 'priya@example.com',
    profession: 'Yoga Instructor',
    neighborhood: 'Baner, Pune',
    skills: ['Yoga', 'Meditation', 'Fitness Training'],
    availability: 'Weekday Mornings',
    rating: 4.5,
  },
  {
    id: 3,
    name: 'Rahul Deshmukh',
    email: 'rahul@example.com',
    profession: 'Electrician',
    neighborhood: 'Kothrud, Pune',
    skills: ['Electrical Wiring', 'Appliance Repair', 'Solar Panel Setup'],
    availability: 'Weekdays',
    rating: 4.9,
  },
  {
    id: 4,
    name: 'Sneha Patil',
    email: 'sneha@example.com',
    profession: 'Tutor',
    neighborhood: 'Aundh, Pune',
    skills: ['Mathematics', 'Physics', 'Chemistry'],
    availability: 'Evenings',
    rating: 4.7,
  },
  {
    id: 5,
    name: 'Vikram Joshi',
    email: 'vikram@example.com',
    profession: 'Plumber',
    neighborhood: 'Shivaji Nagar, Pune',
    skills: ['Pipe Fitting', 'Leak Repair', 'Bathroom Renovation'],
    availability: 'Anytime',
    rating: 4.6,
  },
  {
    id: 6,
    name: 'Anita Kulkarni',
    email: 'anita@example.com',
    profession: 'Graphic Designer',
    neighborhood: 'Baner, Pune',
    skills: ['Logo Design', 'UI/UX', 'Illustration'],
    availability: 'Weekday Afternoons',
    rating: 4.4,
  },
]

// ─── Current Logged-in User (mock) ─────────────────────────
export const currentUser = mockUsers[0]

// ─── Mock Help Requests ─────────────────────────────────────
export const mockRequests = [
  {
    id: 101,
    title: 'Fix leaking kitchen tap',
    skillRequired: 'Plumbing',
    description: 'The kitchen tap has been leaking for two days. Need someone who can fix it quickly.',
    urgency: 'High',
    status: 'Open',
    createdBy: 'Amey Kapdi',
    createdAt: '2026-08-15',
  },
  {
    id: 102,
    title: 'Math tutor for 10th grade',
    skillRequired: 'Mathematics',
    description: 'Need a tutor for my daughter who is preparing for board exams.',
    urgency: 'Medium',
    status: 'In Progress',
    createdBy: 'Amey Kapdi',
    createdAt: '2026-08-12',
  },
  {
    id: 103,
    title: 'Design a birthday invitation',
    skillRequired: 'Graphic Design',
    description: 'Looking for someone who can design a creative birthday party invitation.',
    urgency: 'Low',
    status: 'Completed',
    createdBy: 'Amey Kapdi',
    createdAt: '2026-08-05',
  },
]

// ─── Neighborhoods for filters ──────────────────────────────
export const neighborhoods = [
  'All',
  'Kothrud, Pune',
  'Baner, Pune',
  'Aundh, Pune',
  'Shivaji Nagar, Pune',
]

// ─── Skills list for filters ────────────────────────────────
export const skillsList = [
  'JavaScript', 'React', 'Node.js',
  'Yoga', 'Meditation', 'Fitness Training',
  'Electrical Wiring', 'Appliance Repair', 'Solar Panel Setup',
  'Mathematics', 'Physics', 'Chemistry',
  'Pipe Fitting', 'Leak Repair', 'Bathroom Renovation',
  'Logo Design', 'UI/UX', 'Illustration',
]
