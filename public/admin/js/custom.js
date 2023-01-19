//preview image and update

const imagePreviewContainer = document.getElementById('img-preview');
const chooseImageContainer = document.getElementById('choose-img');
const changeImage = document.getElementById('change-img');

changeImage.addEventListener('click',()=>{
    imagePreviewContainer.classList.remove('d-block');
    imagePreviewContainer.classList.add('d-none');
    chooseImageContainer.classList.remove('d-none');
    chooseImageContainer.classList.add('d-block');
})