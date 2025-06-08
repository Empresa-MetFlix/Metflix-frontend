import { ref } from "vue"

export function useMovies() {
  const heroMovie = ref({
    title: "Stranger Things",
    description:
      "Quando um garoto desaparece, uma pequena cidade descobre um mistério envolvendo experimentos secretos, forças sobrenaturais aterrorizantes e uma garota muito estranha.",
    backgroundImage:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80",
  })

  const trendingMovies = ref([
    {
      id: 1,
      title: "The Witcher",
      image: "https://picsum.photos/300/450?random=1",
    },
    {
      id: 2,
      title: "Ozark",
      image: "https://picsum.photos/300/450?random=2",
    },
    {
      id: 3,
      title: "The Crown",
      image: "https://picsum.photos/300/450?random=3",
    },
    {
      id: 4,
      title: "Bridgerton",
      image: "https://picsum.photos/300/450?random=4",
    },
    {
      id: 5,
      title: "Money Heist",
      image: "https://picsum.photos/300/450?random=5",
    },
    {
      id: 6,
      title: "Squid Game",
      image: "https://picsum.photos/300/450?random=6",
    },
    {
      id: 7,
      title: "Wednesday",
      image: "https://picsum.photos/300/450?random=7",
    },
    {
      id: 8,
      title: "You",
      image: "https://picsum.photos/300/450?random=8",
    },
  ])

  const originalMovies = ref([
    {
      id: 9,
      title: "House of Cards",
      image: "https://picsum.photos/300/450?random=9",
    },
    {
      id: 10,
      title: "Orange is the New Black",
      image: "https://picsum.photos/300/450?random=10",
    },
    {
      id: 11,
      title: "Narcos",
      image: "https://picsum.photos/300/450?random=11",
    },
    {
      id: 12,
      title: "Black Mirror",
      image: "https://picsum.photos/300/450?random=12",
    },
    {
      id: 13,
      title: "The Umbrella Academy",
      image: "https://picsum.photos/300/450?random=13",
    },
    {
      id: 14,
      title: "Dark",
      image: "https://picsum.photos/300/450?random=14",
    },
    {
      id: 15,
      title: "Mindhunter",
      image: "https://picsum.photos/300/450?random=15",
    },
    {
      id: 16,
      title: "Russian Doll",
      image: "https://picsum.photos/300/450?random=16",
    },
  ])

  const actionMovies = ref([
    {
      id: 17,
      title: "Extraction",
      image: "https://picsum.photos/300/450?random=17",
    },
    {
      id: 18,
      title: "6 Underground",
      image: "https://picsum.photos/300/450?random=18",
    },
    {
      id: 19,
      title: "The Old Guard",
      image: "https://picsum.photos/300/450?random=19",
    },
    {
      id: 20,
      title: "Project Power",
      image: "https://picsum.photos/300/450?random=20",
    },
    {
      id: 21,
      title: "Triple Frontier",
      image: "https://picsum.photos/300/450?random=21",
    },
    {
      id: 22,
      title: "Bright",
      image: "https://picsum.photos/300/450?random=22",
    },
    {
      id: 23,
      title: "The Gray Man",
      image: "https://picsum.photos/300/450?random=23",
    },
    {
      id: 24,
      title: "Red Notice",
      image: "https://picsum.photos/300/450?random=24",
    },
  ])

  const comedyMovies = ref([
    {
      id: 25,
      title: "The Good Place",
      image: "https://picsum.photos/300/450?random=25",
    },
    {
      id: 26,
      title: "Brooklyn Nine-Nine",
      image: "https://picsum.photos/300/450?random=26",
    },
    {
      id: 27,
      title: "Schitts Creek",
      image: "https://picsum.photos/300/450?random=27",
    },
    {
      id: 28,
      title: "The Office",
      image: "https://picsum.photos/300/450?random=28",
    },
    {
      id: 29,
      title: "Friends",
      image: "https://picsum.photos/300/450?random=29",
    },
    {
      id: 30,
      title: "Parks and Recreation",
      image: "https://picsum.photos/300/450?random=30",
    },
    {
      id: 31,
      title: "Community",
      image: "https://picsum.photos/300/450?random=31",
    },
    {
      id: 32,
      title: "New Girl",
      image: "https://picsum.photos/300/450?random=32",
    },
  ])

  const horrorMovies = ref([
    {
      id: 33,
      title: "The Haunting of Hill House",
      image: "https://picsum.photos/300/450?random=33",
    },
    {
      id: 34,
      title: "American Horror Story",
      image: "https://picsum.photos/300/450?random=34",
    },
    {
      id: 35,
      title: "The Walking Dead",
      image: "https://picsum.photos/300/450?random=35",
    },
    {
      id: 36,
      title: "Stranger Things",
      image: "https://picsum.photos/300/450?random=36",
    },
    {
      id: 37,
      title: "The Midnight Club",
      image: "https://picsum.photos/300/450?random=37",
    },
    {
      id: 38,
      title: "Archive 81",
      image: "https://picsum.photos/300/450?random=38",
    },
    {
      id: 39,
      title: "Brand New Cherry Flavor",
      image: "https://picsum.photos/300/450?random=39",
    },
    {
      id: 40,
      title: "Ratched",
      image: "https://picsum.photos/300/450?random=40",
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
