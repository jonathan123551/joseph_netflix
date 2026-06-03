import { api } from "./api";

export interface Ministry {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  mission: string;
  about: string;
  impactStats: { label: string; value: string }[];
  featuredMovies: { id: string; title: string; image: string }[];
  campaigns: { id: string; name: string; goal: number; raised: number }[];
  recentDonations: { donor: string; amount: number; time: string }[];
}

const mockMinistries: Ministry[] = [
  {
    id: "hope-worldwide",
    name: "Hope Worldwide",
    logo: "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?auto=format&fit=crop&q=80&w=150&h=150",
    coverImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1920&h=600",
    mission: "Bringing hope to the hopeless through sustainable community development.",
    about: "Hope Worldwide has been working for over 20 years to provide clean water, education, and healthcare to developing nations. We believe in empowering local leaders to transform their own communities.",
    impactStats: [
      { label: "Wells Built", value: "1,245" },
      { label: "Children Educated", value: "50,000+" },
      { label: "Villages Served", value: "320" }
    ],
    featuredMovies: [
      { id: "water-of-life", title: "Water of Life", image: "https://images.unsplash.com/photo-1538301252193-41f20703c9d7?auto=format&fit=crop&q=80&w=400&h=600" },
      { id: "hope-rising", title: "Hope Rising", image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400&h=600" }
    ],
    campaigns: [
      { id: "c1", name: "Clean Water for Kenya", goal: 50000, raised: 35000 },
      { id: "c2", name: "School Supplies Drive", goal: 10000, raised: 8500 }
    ],
    recentDonations: [
      { donor: "Anonymous", amount: 500, time: "2 hours ago" },
      { donor: "Sarah M.", amount: 100, time: "5 hours ago" },
      { donor: "John D.", amount: 1000, time: "1 day ago" }
    ]
  },
  {
    id: "angel-studios",
    name: "Angel Studios",
    logo: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80&w=150&h=150",
    coverImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1920&h=600",
    mission: "Amplify light through storytelling that inspires.",
    about: "We partner with creators to produce stories that are true, honest, noble, just, authentic, lovely, admirable, and excellent. Our community backs projects they believe in.",
    impactStats: [
      { label: "Projects Funded", value: "15" },
      { label: "Global Views", value: "2B+" },
      { label: "Active Backers", value: "300K+" }
    ],
    featuredMovies: [
      { id: "the-chosen", title: "The Chosen", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=400&h=600" },
      { id: "sound-of-freedom", title: "Sound of Freedom", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=400&h=600" }
    ],
    campaigns: [
      { id: "c3", name: "New Animated Series", goal: 1000000, raised: 750000 }
    ],
    recentDonations: [
      { donor: "David L.", amount: 250, time: "1 hour ago" },
      { donor: "Rachel W.", amount: 50, time: "3 hours ago" }
    ]
  }
];

export async function getMinistries(): Promise<Ministry[]> {
  try {
    const data = await api.getMinistries();
    // The backend ministries directory is not populated yet; fall back to the
    // curated demo partners so the page never renders empty for a customer.
    if (!Array.isArray(data) || data.length === 0) {
      return mockMinistries;
    }
    // Transform backend data to match Ministry type if necessary
    return data.map((m: any) => ({
      ...m,
      logo: m.logo || "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?auto=format&fit=crop&q=80&w=150&h=150",
      coverImage: m.coverImage || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1920&h=600",
      mission: m.mission || "",
      about: m.description || m.about || "",
      impactStats: m.impactStats || [],
      featuredMovies: m.movies || m.featuredMovies || [],
      campaigns: m.campaigns || [],
      recentDonations: m.recentDonations || []
    }));
  } catch {
    return mockMinistries;
  }
}

export async function getMinistryById(id: string): Promise<Ministry | null> {
  try {
    const m = await api.getMinistryById(id);
    if (!m) return mockMinistries.find((x) => x.id === id) ?? null;
    return {
      ...m,
      logo: m.logo || "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?auto=format&fit=crop&q=80&w=150&h=150",
      coverImage: m.coverImage || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1920&h=600",
      mission: m.mission || "",
      about: m.description || m.about || "",
      impactStats: m.impactStats || [],
      featuredMovies: m.movies || m.featuredMovies || [],
      campaigns: m.campaigns || [],
      recentDonations: m.recentDonations || []
    };
  } catch {
    return mockMinistries.find((x) => x.id === id) ?? null;
  }
}
