function photoCardHTMLMaker(photo){
  return  `
  <div class="photo-card border-radius">
    <img class="caption-photo" src="${photo.url}" alt="">
    <p></p>
    <button data-id =${photo.id} type="button" name="button">SeaMore BUtts</button>
  </div>
  `
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
