const ALLPHOTOS = [];

const photosContainer = document.getElementById('container')

fetch('http://localhost:3000/api/v1/photos')
.then(response => response.json())
.then(photos => {
  photosIteratorAndDisplayer(photos)
  photos.forEach(photo => ALLPHOTOS.push(photo))

  console.log(ALLPHOTOS);
})


function photoCardHTMLMaker(photo){
  return  `
  <div class="photo-card">
    <img class="caption-photo" src="${photo.url}" alt="">
    <p></p>
    <button data-id =${photo.id} type="button" name="button">SeaMore BUtts</button>
  </div>
  `
}

function photosIteratorAndDisplayer(photos){
  photosContainer.innerHTML=""
  photos.forEach(function(photo){
    photosContainer.innerHTML += photoCardHTMLMaker(photo)
  })
}
