export const routes = {
  videos: "/videos",
  bid: (id: string) => `/bid/${id}`,

  creator: (id: string) => `/creator/${id}`,
  creatorRequest: (id: string) => `/creator/${id}/request`,

  drops: "/drops",
  experiences: "/experiences",
  howItWorks: "/how-it-works",
  signIn: "/sign-in",
  checkout: "/checkout",
};