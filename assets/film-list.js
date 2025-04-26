const films = [
    {
      title: "Vidio di kamar mandi untuk sang pacar",
      embed: "https://mega.nz/embed/Bt5GnLAC#3En9LW8Sy6FmNVSGs1bnzu1AQ3WIz20zCbfySgVf-ds",
    },
    {
      title: "Video kedua keren",
      embed: "https://cdn77-vid-mp4.others-cdn.com/randomlinkcontoh/video2.mp4",
    }
  ];
  
  const filmList = document.getElementById('film-list');
  filmList.innerHTML = '';
  
  films.forEach((film, index) => {
    const filmContainer = document.createElement('div');
    filmContainer.className = 'film-item';
  
    const filmLink = `pemutarfilm.html?video=${encodeURIComponent(film.embed)}&title=${encodeURIComponent(film.title)}`;
    console.log(filmLink);  // Periksa URL yang dihasilkan di konsol
  
    filmContainer.innerHTML = `
      <a href="${filmLink}">
        <video src="${film.embed}" preload="metadata" muted playsinline style="width:100%; height:auto;">
        </video>
        <p>${film.title}</p>
      </a>
    `;
  
    filmList.appendChild(filmContainer);
  });
  