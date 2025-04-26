const films = [
    {
      title: "Vidio di kamar mandi untuk sang pacar",
      embed: "https://cdn77-vid-mp4.others-cdn.com/mbByhg3qM83GdpyiiCZ4XQ==,1745706347/videos/mp4/8/2/7/xvideos.com_82774043ff261f43dde351cd1620e10e.mp4",
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
  
    filmContainer.innerHTML = `
      <a href="pemutarfilm.html?video=${encodeURIComponent(film.embed)}&title=${encodeURIComponent(film.title)}">
        <video src="${film.embed}" preload="metadata" muted playsinline style="width:100%; height:auto;">
        </video>
        <p>${film.title}</p>
      </a>
    `;
  
    filmList.appendChild(filmContainer);
  });
  