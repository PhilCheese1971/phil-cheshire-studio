document.addEventListener("DOMContentLoaded", (event) => {

  const youTubePlayButtons = document.querySelectorAll('.lty-playbtn');

  youTubePlayButtons.forEach((button) => {
    hideFilmTagsOnPlayButtonClick(button)
  });
});

function hideFilmTagsOnPlayButtonClick(button) {
  button.addEventListener('click', () => {
    button.parentElement.previousElementSibling.previousElementSibling.classList.add('hide');
  });
}
