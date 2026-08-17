import { mockRequests } from '../data/mockData'
import './MyRequests.css'

function MyRequests() {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Open':        return 'badge--open'
      case 'In Progress': return 'badge--in-progress'
      case 'Completed':   return 'badge--completed'
      default:            return ''
    }
  }

  const getUrgencyClass = (urgency) => {
    switch (urgency) {
      case 'High':   return 'request-card__meta-item--danger'
      case 'Medium': return 'request-card__meta-item--warning'
      case 'Low':    return 'request-card__meta-item--success'
      default:       return ''
    }
  }

  return (
    <div>
      <div className="my-requests__header">
        <h1 className="my-requests__title">My Requests</h1>
        <p className="my-requests__subtitle">Track and manage your help requests</p>
      </div>

      <div className="my-requests__list">
        {mockRequests.map((req) => (
          <div key={req.id} className="request-card">
            <div className="request-card__top">
              <span className="request-card__title">{req.title}</span>
              <span className={`badge ${getStatusClass(req.status)}`}>{req.status}</span>
            </div>

            <p className="request-card__desc">{req.description}</p>

            <div className="request-card__meta">
              <span className="request-card__meta-item">🛠️ {req.skillRequired}</span>
              <span className={`request-card__meta-item ${getUrgencyClass(req.urgency)}`}>
                {req.urgency === 'High' ? '🚨' : req.urgency === 'Medium' ? '⚡' : '📌'}{' '}
                {req.urgency} Urgency
              </span>
              <span className="request-card__meta-item">📅 {req.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyRequests
