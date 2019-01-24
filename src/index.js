const ALLPHOTOS = [];
const USERVOTES = [];
let CURRENTPHOTO = null;
let CURRENTUSER = null;

const container = document.getElementById('container')
const photosContainer = document.getElementById('photo-list-container')
const photoDisplay = document.getElementById('photo-display')
const sidebar = document.getElementById('sidebar')
const addPhotoDiv = document.getElementById('add-photo-div')
const loginButton = document.getElementById('login')
const registerButton = document.getElementById('register')
const logoutButton = document.getElementById('logout')
const messageDiv = document.getElementById('message-div')
const usernameInput = document.getElementById('username')
const headers = {
  "Content-Type": "application/json",
  "Accept": "application/json"
}

function logMessage(message){
  messageDiv.innerHTML=""
  messageDiv.innerHTML=message
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
  registerUser()
})
loginButton.addEventListener('click', () =>{
  loginUser()
})
logoutButton.addEventListener('click', () => {
  logoutUser()
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

function registerUser(){
  let username=usernameInput.value
  fetch('http://localhost:3000/api/v1/register', {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      username: username
    })
  })
  .then(response => response.json())
  .then(data => {
    if (!data.id){
      logMessage(data.username[0])
    }else{
      CURRENTUSER = data
      loginCheck()
    }
  })
}

function loginUser(){
  let username=usernameInput.value
  fetch('http://localhost:3000/api/v1/login', {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      username: username
    })
  })
  .then(response => response.json())
  .then(data => {
    CURRENTUSER=data
    loginCheck()
  })
}

function logoutUser(){
  CURRENTUSER = null
  loginCheck(true)
}

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

document.addEventListener('click', function(){
  if(event.target.classList.contains("vote")){
    if(verifyLogin()){
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
  }
  if(event.target.id==="photo-display"){
    closeModal()
  }
})

function successfulLogin(){
  logMessage(`Welcome ${CURRENTUSER.username}`)
  loadUserVotes(ALLPHOTOS)
  if (CURRENTPHOTO){
    fillPhotoDisplay(CURRENTPHOTO)
  }
  document.querySelector('#login-form').style.display="none"
  document.querySelector('#user-features').style.display="inline-block"
}

function failedLogin(logout=false){
  if (logout){
    logMessage("You have been logged out")
  }else{
    logMessage("Failed login")
    messageDiv.style.backgroundColor="red"
    setTimeout(function(){
      messageDiv.style.backgroundColor="white"
    }, 300)
  }
  document.querySelector('#login-form').style.display="inline-block"
  document.querySelector('#user-features').style.display="none"
}

function loginCheck(logout=false){
  if(CURRENTUSER === null){
    failedLogin(logout)
  }else{
    successfulLogin()
  }
}

function verifyLogin(){
  if(CURRENTUSER === null){
    closeModal()
    window.scrollTo(0, 0);
    logMessage("Sorry, you must be logged in to perform this action")
    messageDiv.style.backgroundColor="red"
    setTimeout(function(){
      messageDiv.style.backgroundColor="white"
    }, 500)
    return false
  }else{
    return true
  }
}

function closeModal(){
  photoDisplay.innerHTML="";
}
