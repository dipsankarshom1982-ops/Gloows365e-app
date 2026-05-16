export interface Story {
  id: string;
  title: string;
  description: string;
  type: "learning" | "earning" | "ecommerce" | "challenge";

  media: {
    videoUrl: string;
    thumbnail: string;
  };

  cta: {
    text: string;
    actionType: "internal" | "external";
    link: string;
  };

  reward: {
    coins: number;
    type: "view" | "click" | "conversion";
  };
}