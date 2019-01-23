const ALLPHOTOS = [];
const USERVOTES = [];
let CURRENTPHOTO = null;
let CURRENTUSER = null;

const container = document.getElementById('container')
const photosContainer = document.getElementById('photo-list-container')
const photoDisplay = document.getElementById('photo-display')
const sidebar = document.getElementById('sidebar')
const addPhotoDiv = document.getElementById('add-photo-div')
const userForm = document.getElementById('user-form')
const loginButton = document.getElementById('login')
const registerButton = document.getElementById('register')
const loginStatus = document.getElementById('login-status')
const headers = {
  "Content-Type": "application/json",
  "Accept": "application/json"
}


function loadUserVotes(photos){
  photos.forEach(function(photo){
    photo.comments.forEach(function(comment){
      comment.votes.forEach(function(vote){
        if (vote.user_id===CURRENTUSER.id){
          USERVOTES.push(vote)
        }
      })
    })
  })
}

fetch('http://localhost:3000/api/v1/photos')
.then(response => response.json())
.then(photos => {
  photosIteratorAndDisplayer(photos)
  photos.forEach(photo => ALLPHOTOS.push(photo))
})

function photoDisplayHtmlMaker(photo){
  return `
    <img alt="${photo.name}" title="${photo.name}" id="photo-display-img" src=${photo.url}></img>
    <form data-id="${photo.id}" id="new-comment-form">
      <input id="comment-body" type="text" placeholder="Caption">
      <button data-id="Button ID" id="submit-comment-button" type="submit">Submit</button>
    </form>
    <div id="photo-display-captions">
    ${commentIteratorAndPoster(photo)}
    </div>
  `
}

function checkUserVote(comment){
  let upvoted="false"
  let downvoted="false"
  if (CURRENTUSER){
    let commentVote=USERVOTES.find(function(vote){
      return vote.comment_id===comment.id
    })
    if (commentVote){
      if (commentVote.vote_status === 1){
        upvoted="true"
      }else if (commentVote.vote_status === -1){
        downvoted="true"
      }
    }
  }
  return `
    <div class="vote upvote" data-toggled="${upvoted}" data-id="${comment.id}"></div>
    <div class="vote downvote" data-toggled="${downvoted}" data-id="${comment.id}"></div>
  `
}

function commentIteratorAndPoster(photo){
  const comments=photo.comments;
  let listItems = ''
  comments.forEach(function(comment){
    listItems += `
    <div class="list-item">
      <p>
        ${comment.body}
      </p>
      ${checkUserVote(comment)}
    </div>`
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

function toggleLoginForm(){
  if(userForm.dataset.action!=="login"){
    userForm.dataset.action="login"
    return `
    <form id="login-form">
    <label for="login-username">Username</label>
    <input type="text" id="login-username">
    <button type="submit">Log In</button>
    </form>
    `
  }else{
    userForm.dataset.action=""
    return ""
  }
}
function toggleRegisterForm(){
  if(userForm.dataset.action!=="register"){
    userForm.dataset.action="register"
    return `
      <form id="register-form">
        <label for="register-username">Username</label>
        <input type="text" id="register-username">
        <button type="submit">Register</button>
      </form>
    `
  }else{
    userForm.dataset.action=""
    return ""
  }
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
    CURRENTPHOTO = findPhotoById(photoId)
    fillPhotoDisplay(CURRENTPHOTO)
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
  let comment={body: commentBody, photo_id: event.target.dataset.id, user_id: CURRENTUSER.id}
  fetch(`http://localhost:3000/api/v1/comments`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(comment)
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
  userForm.innerHTML=toggleLoginForm()
})

addPhotoDiv.addEventListener('submit', () =>{
  event.preventDefault()
  let photo = {}
  if (CURRENTUSER){
    photo = {name: document.getElementById('new-photo-name').value, url: document.getElementById('new-photo-url').value, user_id: CURRENTUSER.id}
  }
  fetch('http://localhost:3000/api/v1/photos', {
    method: "POST",
    headers: headers,
    body: JSON.stringify(photo)
  }).then(response => response.json())
  .then(data => {
    if (!data.error){
      ALLPHOTOS.push(data)
      photosIteratorAndDisplayer(ALLPHOTOS)
    }else{
      alert("Error uploading photo")
    }
  })
})

userForm.addEventListener('submit', () => {

  event.preventDefault()
  if(event.target.id === 'register-form'){
    fetch('http://localhost:3000/api/v1/register', {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        username: document.getElementById('register-username').value
      })
    })
    .then(response => response.json())
    .then(data => {
      CURRENTUSER = data
      loginCheck()
    })
  }

  if(event.target.id === 'login-form'){
    fetch('http://localhost:3000/api/v1/login', {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        username: document.getElementById('login-username').value
      })
    })
    .then(response => response.json())
    .then(data => {
      CURRENTUSER=data
      loginCheck()
    })
  }
})

function toggleVote(element){
  if (element.dataset.toggled==="true"){
    element.dataset.toggled="false"
  }else{
    element.dataset.toggled="true"
  }
}

function editOrCreateVote(returnedVote){
  let existingVote=USERVOTES.find(function(vote){
    return returnedVote.id===vote.id
  })
  if (existingVote){
    console.log("Vote already exists, replacing in USERVOTES")
    existingVote.vote_status=returnedVote.vote_status;
    console.log("The changed vote", existingVote)
  }else{
    console.log("Creating vote")
    USERVOTES.push(returnedVote);
  }
}

function vote(vote_status, comment_id){
  let body={}
  if(CURRENTUSER){
    body={user_id: CURRENTUSER.id, comment_id: comment_id, vote_status: vote_status}
  }
  fetch("http://localhost:3000/api/v1/vote", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  })
  .then(r=>r.json())
  .then(data => {
    console.log("Returned vote", data);
    editOrCreateVote(data);
  })
}

function submitVote(upArrowDiv, downArrowDiv){
  let commentId=upArrowDiv.dataset.id
  if (upArrowDiv.dataset.toggled==="true"){
    vote(1, commentId)
  }else if(downArrowDiv.dataset.toggled==="true"){
    vote(-1, commentId)
  }else{
    vote(0, commentId)
  }
}

container.addEventListener('click', function(){
  if(event.target.classList.contains("vote")){
    let commentId=event.target.dataset.id
    let upArrowDiv=document.querySelector(`.upvote[data-id="${commentId}"]`)
    let downArrowDiv=document.querySelector(`.downvote[data-id="${commentId}"]`)
    if(event.target.classList.contains("upvote")){
      toggleVote(upArrowDiv)
      downArrowDiv.dataset.toggled="false"
    }
    if(event.target.classList.contains("downvote")){
      toggleVote(downArrowDiv)
      upArrowDiv.dataset.toggled="false"
    }
    submitVote(upArrowDiv, downArrowDiv)
  }
})

function successfulLogin(){
  loginStatus.querySelector('h1').innerHTML=`Welcome ${CURRENTUSER.username}`
  userForm.innerHTML=""
  userForm.dataset.action=""
  loadUserVotes(ALLPHOTOS)
  if (CURRENTPHOTO){
    fillPhotoDisplay(CURRENTPHOTO)
  }
}

function failedLogin(){
  loginStatus.querySelector('h1').innerHTML="Failed login"
  loginStatus.style.backgroundColor="red"
  setTimeout(function(){
    loginStatus.style.backgroundColor="white"
  }, 300)
}

function loginCheck(){
  if(CURRENTUSER === null){
    failedLogin()
  }else{
    successfulLogin()
  }
}
