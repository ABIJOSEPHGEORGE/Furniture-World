//preview image and update

const imagePreviewContainer = document.getElementById('img-preview');
const chooseImageContainer = document.getElementById('choose-img');
const changeImage = document.getElementById('change-img');
const cancelUpload = document.getElementById('upload-cancel')

changeImage.addEventListener('click',()=>{
    imagePreviewContainer.classList.remove('d-block');
    imagePreviewContainer.classList.add('d-none');
    chooseImageContainer.classList.remove('d-none');
    chooseImageContainer.classList.add('d-block');
})

cancelUpload.addEventListener('click',()=>{
    imagePreviewContainer.classList.add('d-block');
    imagePreviewContainer.classList.remove('d-none');
    chooseImageContainer.classList.add('d-none');
    chooseImageContainer.classList.remove('d-block');
})


