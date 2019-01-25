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
    <button data-id =${photo.id} type="button" name="button">SeaMore BUtts</button>
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
        <input id="comment-body" type="text" placeholder="Caption">
        <button data-id="Button ID" id="submit-comment-button" type="submit">Submit</button>
      </form>
      <div id="photo-display-captions">
      ${commentIteratorAndPoster(photo)}
      </div>
    </div>
  `
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
    <div class="list-item comment border-radius" data-score=${comment.score}>
      <p>
        <span style="font-weight:bold">${current}.</span> ${comment.body}
      </p>
      ${checkUserVote(comment)}
    </div>`
    current++
  })
  return listItems
}
