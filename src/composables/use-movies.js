import { ref } from "vue"

export function useMovies() {
  const heroMovie = ref({
    title: "Stranger Things",
    description:
      "Quando um garoto desaparece, uma pequena cidade descobre um mistério envolvendo experimentos secretos, forças sobrenaturais aterrorizantes e uma garota muito estranha.",
    backgroundImage:
      "https://wallpapercave.com/wp/wp5522076.jpg",
  })

  const trendingMovies = ref([
    {
      id: 1,
      title: "The Witcher",
      image: "https://wallpaperaccess.com/full/8295650.jpg",
    },
    {
      id: 2,
      title: "Ozark",
      image: "https://th.bing.com/th/id/OIP.15Da7ADvntf8b_tGOiXoxQAAAA?w=433&h=650&rs=1&pid=ImgDetMain",
    },
    {
      id: 3,
      title: "The Crown",
      image: "https://media.fstatic.com/NFtXuaMsaiTqmRJfO_TnWL3EmQg=/290x478/smart/media/movies/covers/2020/11/tjWB4964a2GyQySmiL4iw54vVv8.jpg",
    },
    {
      id: 4,
      title: "Bridgerton",
      image: "https://www.whats-on-netflix.com/wp-content/uploads/covers-2024/bridgerton.jpeg",
    },
    {
      id: 5,
      title: "Money Heist",
      image: "https://th.bing.com/th/id/OIP.EZmEsAO6e4e73FTw7E9NFAHaNL?rs=1&pid=ImgDetMain",
    },
    {
      id: 6,
      title: "Squid Game",
      image: "https://rare-gallery.com/mocahbig/1416778-squid-game-netflix-tv-shows-hd-4k-artstation.jpg",
    },
    {
      id: 7,
      title: "Wednesday",
      image: "https://th.bing.com/th/id/OIP.UgBB1D3Wx9dKWNVEA-1wdwAAAA?rs=1&pid=ImgDetMain",
    },
    {
      id: 8,
      title: "You",
      image: "https://static.tvtropes.org/pmwiki/pub/images/you_7.png",
    },
  ])

  const originalMovies = ref([
    {
      id: 9,
      title: "House of Cards",
      image: "https://images.justwatch.com/poster/27228628/s332",
    },
    {
      id: 10,
      title: "Orange is the New Black",
      image: "https://m.media-amazon.com/images/I/71RwCwjBprL.jpg",
    },
    {
      id: 11,
      title: "Narcos",
      image: "https://th.bing.com/th/id/OIP.57-Fk64-khKD25jjx-p5NwHaK3?rs=1&pid=ImgDetMain",
    },
    {
      id: 12,
      title: "Black Mirror",
      image: "https://th.bing.com/th/id/R.8f1f127cd24fd86aa65b41d7dbf45d6a?rik=QmvfAKtkmjVK3Q&pid=ImgRaw&r=0",
    },
    {
      id: 13,
      title: "The Umbrella Academy",
      image: "https://www.themoviedb.org/t/p/original/3sD4yI5A2YRTvJJcxmV1byLriOe.jpg",
    },
    {
      id: 14,
      title: "Dark",
      image: "https://wallpapercave.com/wp/wp7190447.jpg",
    },
    {
      id: 15,
      title: "Mindhunter",
      image: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/mindhunter-tv-artwork-crime-poster-turner-fox.jpg",
    },
    {
      id: 16,
      title: "Russian Doll",
      image: "https://i.redd.it/jixo29bfzes81.jpg",
    },
  ])

  const actionMovies = ref([
    {
      id: 17,
      title: "Extraction",
      image: "https://wallpapercave.com/wp/wp6188503.jpg",
    },
    {
      id: 18,
      title: "6 Underground",
      image: "https://static1.moviewebimages.com/wordpress/wp-content/uploads/movie/JoztCcEDM4Bz4zQqBYAZ5qyvEi2ZLz.jpg",
    },
    {
      id: 19,
      title: "The Old Guard",
      image: "https://th.bing.com/th/id/OIP.AJlAuXITWa4Mf9PIiuMIFgHaKJ?rs=1&pid=ImgDetMain",
    },
    {
      id: 20,
      title: "Project Power",
      image: "https://wallpaperaccess.com/full/10593423.jpg",
    },
    {
      id: 21,
      title: "Triple Frontier",
      image: "https://flxt.tmsimg.com/assets/p16333799_k_v9_aa.jpg",
    },
    {
      id: 22,
      title: "Bright",
      image: "https://images.hdqwalls.com/download/bright-4s-2160x3840.jpg",
    },
    {
      id: 23,
      title: "The Gray Man",
      image: "https://th.bing.com/th/id/OIP.q3of-1lWI9oJk0Unj-ZJQgHaKj?rs=1&pid=ImgDetMain",
    },
    {
      id: 24,
      title: "Red Notice",
      image: "https://wallpapers.com/images/hd/red-notice-poster-6ozikz8sp5oy4hr9.jpg",
    },
  ])

  const comedyMovies = ref([
    {
      id: 25,
      title: "The Good Place",
      image: "https://oillocotv.biz/imghost/upload/images/GTKV.jpg",
    },
    {
      id: 26,
      title: "Brooklyn Nine-Nine",
      image: "https://wallpaperaccess.com/full/2057982.png",
    },
    {
      id: 27,
      title: "Schitts Creek",
      image: "https://images.justwatch.com/poster/281435002/s718/schitts-creek.%7Bformat%7D",
    },
    {
      id: 28,
      title: "The Office",
      image: "https://th.bing.com/th/id/R.93158dd246b770e0ca5af3dd41d0fb6b?rik=ZQr1end0Z8MyCg&pid=ImgRaw&r=0",
    },
    {
      id: 29,
      title: "Friends",
      image: "https://th.bing.com/th/id/OIP.ZEpnI25L8-b1bCd0wGkwowHaNK?rs=1&pid=ImgDetMain",
    },
    {
      id: 30,
      title: "Parks and Recreation",
      image: "https://m.media-amazon.com/images/M/MV5BNDlhMzAwNTAtNTk2NS00MTdkLWE3ZWYtMDU0MTFiYmU2ZTc0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    },
    {
      id: 31,
      title: "Community",
      image: "https://fr.web.img6.acsta.net/c_310_420/medias/nmedia/18/79/37/18/19657850.jpg",
    },
    {
      id: 32,
      title: "New Girl",
      image: "https://images.justwatch.com/poster/304248639/s718/new-girl.jpg",
    },
  ])

  const horrorMovies = ref([
    {
      id: 33,
      title: "The Haunting of Hill House",
      image: "https://wallpapercave.com/wp/wp3882318.jpg",
    },
    {
      id: 34,
      title: "American Horror Story",
      image: "https://br.web.img2.acsta.net/pictures/18/11/13/12/04/2906463.jpg",
    },
    {
      id: 35,
      title: "The Walking Dead",
      image: "https://images.justwatch.com/poster/301587072/s718/The-Walking-Dead.%7Bformat%7D",
    },
    {
      id: 36,
      title: "Stranger Things",
      image: "https://wallpaperaccess.com/full/642671.jpg",
    },
    {
      id: 37,
      title: "The Midnight Club",
      image: "https://th.bing.com/th/id/R.d015177a7008cd78aa390641b0f2c202?rik=GM0D%2f2gDywRcGg&riu=http%3a%2f%2frecenserie.com%2fwp-content%2fuploads%2f2022%2f10%2fThe-Midnight-Club-2022-S01-Hindi-Dubbed-NF-Series-1080p-HDRip-7.9GB-1.jpg&ehk=7WVbWmUfe0xxz6Tv5jeZ%2bNuUG%2biUO%2bRdmQOgPqgzzSY%3d&risl=&pid=ImgRaw&r=0",
    },
    {
      id: 38,
      title: "Archive 81",
      image: "https://th.bing.com/th/id/R.4dfe74783c06b6f48095d77521f04c3a?rik=6A9ltPi03r5rmA&riu=http%3a%2f%2fstatic1.squarespace.com%2fstatic%2f564cf6c4e4b00880c82968e2%2ft%2f56a984f9c647adc3bea87135%2f1634652052868%2fArchive81-ex2.jpg%3fformat%3d1500w&ehk=dpNLN8KxuIu3%2fkvW67WQxS%2fS4YL4RYhvNAcDnYShUUA%3d&risl=&pid=ImgRaw&r=0",
    },
    {
      id: 39,
      title: "Brand New Cherry Flavor",
      image: "https://imgix.ranker.com/user_node_img/4317/86330647/original/86330647-photo-u531971505?auto=format&q=60&fit=crop&fm=pjpg&dpr=2&w=650",
    },
    {
      id: 40,
      title: "Ratched",
      image: "https://br.web.img2.acsta.net/pictures/20/07/29/17/14/5278426.jpg",
    },
  ])

  return {
    heroMovie,
    trendingMovies,
    originalMovies,
    actionMovies,
    comedyMovies,
    horrorMovies,
  }
}
