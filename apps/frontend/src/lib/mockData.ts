export interface Movie {
  id: string;
  title: string;
  description: string;
  bannerUrl: string;
  posterUrl: string;
  videoUrl: string;
  duration: string;
  rating: string;
  year: number;
  cast: string[];
  director: string;
  genres: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isRecentlyAdded?: boolean;
}

export const mockMovies: Movie[] = [
  {
    id: "1",
    title: "The Chosen",
    description: "A charismatic fisherman drowning in debt. A troubled woman wrestling with real demons. A gifted publican ostracized by his family and his people. A religious leader struggling with his beliefs. See Jesus through the eyes of those that met him.",
    bannerUrl: "https://images.unsplash.com/photo-1548625361-ecacbd7f465a?q=80&w=2000&auto=format&fit=crop", // Dramatic sunset over water (Sea of Galilee vibe)
    posterUrl: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800&auto=format&fit=crop", // Silhouetted figure
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "Series",
    rating: "TV-PG",
    year: 2017,
    cast: ["Jonathan Roumie", "Shahar Isaac", "Elizabeth Tabish"],
    director: "Dallas Jenkins",
    genres: ["Biblical", "Drama", "Historical"],
    isFeatured: true,
    isTrending: true,
  },
  {
    id: "2",
    title: "Sound of Freedom",
    description: "The incredible true story of a former government agent turned vigilante who embarks on a dangerous mission to rescue hundreds of children from sex traffickers.",
    bannerUrl: "https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?q=80&w=2000&auto=format&fit=crop", // Jungle/Cinematic action vibe
    posterUrl: "https://images.unsplash.com/photo-1534430480872-3498384e54e6?q=80&w=800&auto=format&fit=crop", // Intense portrait or dark action
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "2h 11m",
    rating: "PG-13",
    year: 2023,
    cast: ["Jim Caviezel", "Mira Sorvino", "Bill Camp"],
    director: "Alejandro Monteverde",
    genres: ["Action", "Biography", "Drama"],
    isTrending: true,
    isRecentlyAdded: true,
  },
  {
    id: "3",
    title: "The Passion of the Christ",
    description: "Depicts the final twelve hours in the life of Jesus of Nazareth, on the day of his crucifixion in Jerusalem.",
    bannerUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop", // Crown of thorns / cross lighting
    posterUrl: "https://images.unsplash.com/photo-1437604620023-e1f13b63198c?q=80&w=800&auto=format&fit=crop", // Solemn cross
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "2h 7m",
    rating: "R",
    year: 2004,
    cast: ["Jim Caviezel", "Monica Bellucci", "Maia Morgenstern"],
    director: "Mel Gibson",
    genres: ["Biblical", "Drama", "Historical"],
  },
  {
    id: "4",
    title: "War Room",
    description: "A seemingly perfect family looks to fix their problems with the help of Miss Clara, an older, wiser woman.",
    bannerUrl: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=2000&auto=format&fit=crop", // Cozy indoor or sunlight streaming
    posterUrl: "https://images.unsplash.com/photo-1469048386129-9e8cbb6a6409?q=80&w=800&auto=format&fit=crop", // Coffee cup, journal, sunlight
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "2h",
    rating: "PG",
    year: 2015,
    cast: ["Priscilla Shirer", "T.C. Stallings", "Karen Abercrombie"],
    director: "Alex Kendrick",
    genres: ["Drama", "Family"],
    isRecentlyAdded: true,
  },
  {
    id: "5",
    title: "I Can Only Imagine",
    description: "The inspiring and unknown true story behind MercyMe's beloved, chart topping song that brings ultimate hope to so many.",
    bannerUrl: "https://images.unsplash.com/photo-1516280440502-6c367831f2dc?q=80&w=2000&auto=format&fit=crop", // Stage lights / concert
    posterUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop", // Microphone / music
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "1h 50m",
    rating: "PG",
    year: 2018,
    cast: ["J. Michael Finley", "Dennis Quaid", "Cloris Leachman"],
    director: "The Erwin Brothers",
    genres: ["Biography", "Drama", "Music"],
  },
  {
    id: "6",
    title: "Jesus Revolution",
    description: "The true story of a national spiritual awakening in the early 1970s and its origins within a community of teenage hippies in Southern California.",
    bannerUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop", // California beach / vintage sunset
    posterUrl: "https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=800&auto=format&fit=crop", // Retro van / 70s vibe
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "2h",
    rating: "PG-13",
    year: 2023,
    cast: ["Joel Courtney", "Jonathan Roumie", "Kelsey Grammer"],
    director: "Jon Erwin",
    genres: ["Biography", "Drama", "History"],
    isTrending: true,
  },
  {
    id: "7",
    title: "Paul, Apostle of Christ",
    description: "The story of Paul, who goes from the most infamous persecutor of Christians to Christ's most influential apostle.",
    bannerUrl: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=2000&auto=format&fit=crop", // Ancient ruins / dusty road
    posterUrl: "https://images.unsplash.com/photo-1533423996375-f914ab1844b2?q=80&w=800&auto=format&fit=crop", // Ancient scrolls / prison cell
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: "1h 48m",
    rating: "PG-13",
    year: 2018,
    cast: ["Jim Caviezel", "James Faulkner", "Olivier Martinez"],
    director: "Andrew Hyatt",
    genres: ["Biblical", "Drama", "History"],
  }
];

export const categories = [
  { id: "trending", title: "Trending Now", items: mockMovies.filter(m => m.isTrending) },
  { id: "biblical", title: "Biblical Epics", items: mockMovies.filter(m => m.genres.includes("Biblical")) },
  { id: "recently_added", title: "Recently Added", items: mockMovies.filter(m => m.isRecentlyAdded) },
  { id: "drama", title: "Inspirational Drama", items: mockMovies.filter(m => m.genres.includes("Drama")) },
  { id: "all", title: "All Content", items: mockMovies },
];

export const featuredMovie = mockMovies.find(m => m.isFeatured) || mockMovies[0];
