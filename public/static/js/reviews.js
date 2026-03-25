document.addEventListener('DOMContentLoaded', () => {
  const reviewsTop = document.querySelector('.reviews-top');
  const userName = localStorage.getItem('userName');

  if (userName) {
    reviewsTop.innerHTML = `
      <form class="reviews-form" action="#">
        <h4 class="reviews__title">
            Напишите свой отзыв
        </h4>
        <div class="rating">
            <span class="star" data-rating="1">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.9997 2.33337L17.6047 9.63671L25.6663 10.815L19.833 16.4967L21.2097 24.5234L13.9997 20.7317L6.78967 24.5234L8.16634 16.4967L2.33301 10.815L10.3947 9.63671L13.9997 2.33337Z" fill="none" stroke="#3AB795" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            <span class="star" data-rating="2">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.9997 2.33337L17.6047 9.63671L25.6663 10.815L19.833 16.4967L21.2097 24.5234L13.9997 20.7317L6.78967 24.5234L8.16634 16.4967L2.33301 10.815L10.3947 9.63671L13.9997 2.33337Z" fill="none" stroke="#3AB795" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            <span class="star" data-rating="3">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.9997 2.33337L17.6047 9.63671L25.6663 10.815L19.833 16.4967L21.2097 24.5234L13.9997 20.7317L6.78967 24.5234L8.16634 16.4967L2.33301 10.815L10.3947 9.63671L13.9997 2.33337Z" fill="none" stroke="#3AB795" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            <span class="star" data-rating="4">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.9997 2.33337L17.6047 9.63671L25.6663 10.815L19.833 16.4967L21.2097 24.5234L13.9997 20.7317L6.78967 24.5234L8.16634 16.4967L2.33301 10.815L10.3947 9.63671L13.9997 2.33337Z" fill="none" stroke="#3AB795" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
            <span class="star" data-rating="5">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.9997 2.33337L17.6047 9.63671L25.6663 10.815L19.833 16.4967L21.2097 24.5234L13.9997 20.7317L6.78967 24.5234L8.16634 16.4967L2.33301 10.815L10.3947 9.63671L13.9997 2.33337Z" fill="none" stroke="#3AB795" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </span>
        </div>
        <textarea id="textInput" placeholder="Текст" class="reviews-form__text"></textarea>
        <button id="submitButton" class="reviews-form__btn">Опубликовать</button>
      </form>
    `
  } else {
    reviewsTop.innerHTML = `
      <div class="reviews-info">
          <div class="reviews-info--left">
              <h4 class="reviews-info__title">
                  Чтобы написать свой отзыв можете войти в аккаунт или зарегистрироватся
              </h4>
              <a class="reviews-form__btn reviews-info__btn" href="login.html">
                  Войти
              </a>
          </div>
          <div class="reviews-info--right">
              <img class="reviews-info__img" src="../static/img/reviews/reviewsInfo.svg" alt="Reviews information image">
          </div>
      </div>
    `
  }

  const stars = document.querySelectorAll('.star');
  const textInput = document.getElementById('textInput');
  const reviewsContainer = document.getElementById('reviewsContainer');
  const submitButton = document.getElementById('submitButton');

  let selectedRating = 0;

  stars.forEach(star => {
    star.addEventListener("mouseover", function() {
      const starValue = parseInt(this.getAttribute("data-rating"));

      for (let i = 0; i < stars.length; i++) {
        if (i < starValue) {
          stars[i].classList.add("activeStar");
        } else {
          stars[i].classList.remove("activeStar");
        }
      }
    });

    star.addEventListener("mouseleave", function() {
      for (let i = 0; i < stars.length; i++) {
          if (i < selectedRating) {
              stars[i].classList.add("activeStar");
          } else {
              stars[i].classList.remove("activeStar");
          }
      }
    });

    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.rating);
    });
  });

  submitButton.addEventListener('click', () => {
    event.preventDefault();
    const text = textInput.value.trim();

    if (selectedRating === 0) {
      alert("Выберите рейтинг");
      return;
    }

    if (!userName) {
      alert("Войдите в аккаунт или зарегистрируйтесь!");
      return;
    }

    const review = { name: userName, rating: selectedRating, text };

    fetch('/reviews/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(review)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message);
        textInput.value = '';
        selectedRating = 0;
        fetchReviews();

        stars.forEach(star => {
          star.classList.remove('activeStar');
        });
      })
      .catch(error => console.error(error));
  });


  reviewsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('reviewsBox-delete__btn')) {
      const reviewBox = event.target.closest('.reviewsBox');
      const reviewId = reviewBox.dataset.id;

      fetch(`/reviews/${reviewId}`, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.message);
          reviewBox.remove();
        })
        .catch(error => console.error(error));
    }
  });

  function fetchReviews() {
    fetch('/reviews/')
      .then(response => response.json())
      .then(reviews => {
        reviewsContainer.innerHTML = '';
        reviews.forEach(review => {
          function getStarRating(rating) {
            const starSVG = '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.9997 2.33337L17.6047 9.63671L25.6663 10.815L19.833 16.4967L21.2097 24.5234L13.9997 20.7317L6.78967 24.5234L8.16634 16.4967L2.33301 10.815L10.3947 9.63671L13.9997 2.33337Z" fill="#3AB795" stroke="#3AB795" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            let stars = '';
            for (let i = 0; i < rating; i++) {
              stars += starSVG;
            }
            return stars;
          }
  
          const reviewElement = document.createElement('div');
          reviewElement.classList.add('reviewsBox');
          reviewElement.dataset.id = review._id;
  
          const isCurrentUserReview = review.name === userName;
  
          reviewElement.innerHTML = `
            <div class="reviewsBox-top">
              <span>${getStarRating(review.rating)}</span>
              <h5>${review.name}</h5>
            </div>
            <p>${review.text}</p>
            ${isCurrentUserReview ? '<button class="reviews-form__btn reviewsBox-delete__btn">Удалить</button>' : ''}
          `;
          reviewsContainer.appendChild(reviewElement);
        });
      })
      .catch(error => console.error(error));
  }

  fetchReviews();
});
