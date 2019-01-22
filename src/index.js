const ALLPHOTOS = [];
let CURRENTUSERID;

const photosContainer = document.getElementById('photo-list-container')
const photoDisplay = document.getElementById('photo-display')
const sidebar = document.getElementById('sidebar')
const addPhotoDiv = document.getElementById('add-photo-div')
const userForm = document.getElementById('user-form')
const loginButton = document.getElementById('login')
const registerButton = document.getElementById('register')


fetch('http://localhost:3000/api/v1/photos')
.then(response => response.json())
.then(photos => {
  photosIteratorAndDisplayer(photos)
  photos.forEach(photo => ALLPHOTOS.push(photo))

  console.log(ALLPHOTOS);
})

function photoDisplayHtmlMaker(photo){
  return `
    <img alt="${photo.name}" title="${photo.name}" id="photo-display-img" src=${photo.url}></img>
    <form data-id="${photo.id}" id="new-comment-form">
      <input id="comment-body" type="text" placeholder="Caption">
      <button data-id="Button ID" id="submit-comment-button" type="submit">Submit</button>
    </form>
    <ul id="photo-display-captions">
    ${commentIteratorAndPoster(photo)}
    </ul>
  `
}

function commentIteratorAndPoster(photo){
  const comments=photo.comments;
  let listItems = ''
  comments.forEach(function(comment){
    listItems += `<li>${comment.body}</li>`
  })
  return listItems
}

function addPhotoFormHTMLMaker(){
  if (addPhotoDiv.innerHTML===""){
    return `
    <form id="add-photo-form">
    <label for="new-photo-name">Title:</label>
    <input type="text" id="new-photo-name">
    <label for="new-photo-url">Photo URL:</label>
    <input type="text" id="new-photo-url">
    <button type="submit">Submit photo</button>
    </form>
    `
  }else{
    return ""
  }
}

function photoCardHTMLMaker(photo){
  return  `
  <div class="photo-card">
    <img class="caption-photo" src="${photo.url}" alt="">
    <p></p>
    <button data-id =${photo.id} type="button" name="button">SeaMore BUtts</button>
  </div>
  `
}

function toggleRegisterForm(){
  return `
    <form id="register-form">
      <input type="text" id="register-username">
    </form>
  `
}

function fillPhotoDisplay(photo){
  photoDisplay.innerHTML=photoDisplayHtmlMaker(photo)
}

function findPhotoById(id){
  return ALLPHOTOS.find(function(photo){
    return photo.id === parseInt(id)
  })
}

function photosIteratorAndDisplayer(photos){
  photosContainer.innerHTML=""
  photos.forEach(function(photo){
    photosContainer.innerHTML += photoCardHTMLMaker(photo)
  })
}

photosContainer.addEventListener('click', () => {
  if(event.target.type === 'button'){
    let photoId = event.target.dataset.id
    let currentPhoto = findPhotoById(photoId)
    fillPhotoDisplay(currentPhoto)
  }
})

function addCommentByPhotoId(comment){
  photo=findPhotoById(comment.photo_id)
  photo.comments.push(comment)
  fillPhotoDisplay(photo)
}

sidebar.addEventListener('click', () => {
    if(event.target.id==="add-photo-button"){
      addPhotoDiv.innerHTML=addPhotoFormHTMLMaker()
    }
})

photoDisplay.addEventListener('submit', () => {
  event.preventDefault()
  let commentBody =  document.querySelector('#comment-body').value
  fetch(`http://localhost:3000/api/v1/comments`, {
    method: "POST",
    headers:{
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({body: commentBody, photo_id: event.target.dataset.id})
  })
  .then(response => response.json())
  .then(data => {
    addCommentByPhotoId(data)
  })
})



registerButton.addEventListener('click', () =>{
  userForm.innerHTML=toggleRegisterForm()
})
loginButton.addEventListener('click', () =>{
  toggleLoginForm()
})

addPhotoDiv.addEventListener('submit', () =>{
  event.preventDefault()
  let photo = {name: document.getElementById('new-photo-name').value, url: document.getElementById('new-photo-url').value}
  console.log(photo)

  fetch('http://localhost:3000/api/v1/photos', {
    method: "POST",
    headers:{
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(photo)
  }).then(response => response.json())
  .then(data => {
    console.log(data)
    ALLPHOTOS.push(data)
    photosIteratorAndDisplayer(ALLPHOTOS)
  })
})
