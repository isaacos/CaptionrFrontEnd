function topCaption(photo){
  console.log(photo.comments)
  if (photo.comments.length===0){
    return `<p>No captions yet</p>`
  }else{
    let sortedComments=[...photo.comments].sort((a, b) => b.score-a.score)
    return `<p>"${sortedComments[0].body}"</p>`
  }
}

function photoCardHTMLMaker(photo){
  return  `
  <div class="photo-card border-radius">
    <img class="caption-photo" src="${photo.url}" alt="">
    <p></p>
    ${topCaption(photo)}
    <button data-id =${photo.id} type="button" name="button">See all captions</button>
  </div>
  `
}

function addPhotoFormHTMLMaker(){
  if (addPhotoDiv.innerHTML===""){
    return `
    <form id="add-photo-form">
      <label for="new-photo-name">Title:</label><br>
      <input type="text" id="new-photo-name"><br>
      <label for="new-photo-url">Photo URL:</label><br>
      <input type="text" id="new-photo-url"><br>
      <button type="submit">Submit photo</button>
    </form>
    `
  }else{
    return ""
  }
}

function photoDisplayHtmlMaker(photo){
  return `
    <div class="photo-displayer-innerdiv border-radius">
      <img alt="${photo.name}" title="${photo.name}" id="photo-display-img" src=${photo.url}></img>
      <form data-id="${photo.id}" id="new-comment-form" align="center">
        <input id="comment-body" type="text" autocomplete="off" placeholder="Caption">
        <button data-id="Button ID" id="submit-comment-button" type="submit">Submit</button>
      </form>
      <div id="photo-display-captions">
      ${commentIteratorAndPoster(photo)}
      </div>
    </div>
  `
}

function winningComment(current){
  if (current===1){
    return `list-item winning-comment border-radius`
  }else{
    return `list-item comment border-radius`
  }
}

function generateHand(current){
  if (current===1){
    return `<img class="hand" src="src/images/hand2.png">`
  }else{
    return ``
  }
}

function commentIteratorAndPoster(photo){
  const comments=photo.comments;
  let sortedComments=[];
  if (photo.comments.length!==0){
    sortedComments=[...photo.comments].sort((a, b) => b.score-a.score)
  }
  let listItems = ''
  let current=1;
  sortedComments.forEach(function(comment){
    listItems += `
    <div class="${winningComment(current)}" data-score=${comment.score}>
      <p>
        ${generateHand(current)}<span style="font-weight:bold">${current}.</span> ${comment.body}
      </p>
      ${checkUserVote(comment)}
    </div>`
    current++
  })
  return listItems
}
