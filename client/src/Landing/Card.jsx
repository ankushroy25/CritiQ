import React from 'react'
import './Card.css'

const Card = () => {
  return (
    <div>
        <div className="card">
  <div className="card__border"></div>
  <div className="card_title__container">
    <span className="card_title">Explosive Growth</span>
    <p className="card_paragraph">
      Perfect for your next content, leave to us and enjoy the result!
    </p>
  </div>
  <hr className="line" />
  <ul className="card__list">
    <li className="card__list_item">
      <span className="check">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="check_svg"
        >
          <path
            fillRule="evenodd"
            d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
            clipRule="evenodd"
          ></path>
        </svg>
      </span>
      <span className="list_text">10 Launch Weeks</span>
    </li>
    <li className="card__list_item">
      <span className="check">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="check_svg"
        >
          <path
            fillRule="evenodd"
            d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
            clipRule="evenodd"
          ></path>
        </svg>
      </span>
      <span className="list_text">10 Influencers Post</span>
    </li>
    <li className="card__list_item">
      <span className="check">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="check_svg"
        >
          <path
            fillRule="evenodd"
            d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
            clipRule="evenodd"
          ></path>
        </svg>
      </span>
      <span className="list_text">100.000 Views</span>
    </li>
    <li className="card__list_item">
      <span className="check">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="check_svg"
        >
          <path
            fillRule="evenodd"
            d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
            clipRule="evenodd"
          ></path>
        </svg>
      </span>
      <span className="list_text">10 Reddit Posts</span>
    </li>
    <li className="card__list_item">
      <span className="check">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="check_svg"
        >
          <path
            fillRule="evenodd"
            d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
            clipRule="evenodd"
          ></path>
        </svg>
      </span>
      <span className="list_text">2 Hours Marketing Consultation</span>
    </li>
  </ul>
  <button className="button">Book a Call</button>
</div>

    </div>
  )
}

export default Card