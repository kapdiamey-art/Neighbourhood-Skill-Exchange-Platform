import './UserCard.css'

function UserCard({ name, profession, neighborhood, rating }) {
  // Generate filled / empty stars
  const fullStars = Math.floor(rating)
  const emptyStars = 5 - fullStars

  return (
    <div className="user-card">
      {/* Header — Avatar + Name */}
      <div className="user-card__header">
        <div className="user-card__avatar">
          {name.charAt(0)}
        </div>
        <div>
          <div className="user-card__name">{name}</div>
          <div className="user-card__profession">{profession}</div>
        </div>
      </div>

      {/* Details */}
      <div className="user-card__details">
        <div className="user-card__detail">
          <span className="user-card__detail-icon">📍</span>
          {neighborhood}
        </div>
      </div>

      {/* Rating */}
      <div className="user-card__rating">
        <div className="user-card__stars">
          {Array.from({ length: fullStars }, (_, i) => (
            <span key={`full-${i}`} className="user-card__star">★</span>
          ))}
          {Array.from({ length: emptyStars }, (_, i) => (
            <span key={`empty-${i}`} className="user-card__star user-card__star--empty">★</span>
          ))}
        </div>
        <span className="user-card__rating-value">{rating}</span>
      </div>
    </div>
  )
}

export default UserCard
