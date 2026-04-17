import { photos } from "@/lib/site-images";

export type PerformanceItem = {
  title: string;
  location: string;
  date?: string;
  image: string;
  imageAlt: string;
};

export const performances: PerformanceItem[] = [
  {
    title: "Bharatanatyam Recital at DDPODHIGAI",
    location: "Chennai",
    date: "2019",
    image: photos.p01,
    imageAlt: "Bharatanatyam dancer in traditional costume",
  },
  {
    title: "Solo Bharatanatyam at Drums Festival",
    location: "Srinakharinwirot University, Thailand",
    image: photos.p07,
    imageAlt: "Outdoor Bharatanatyam performance",
  },
  {
    title: "Festival of India, Europe",
    location: "Europe (ICCR)",
    image: photos.p06,
    imageAlt: "Performance on stage with temple backdrop",
  },
  {
    title: "Music & Dance Festival, Germany",
    location: "Germany (ICCR)",
    image: photos.p09,
    imageAlt: "Classical dance performance",
  },
  {
    title: "Bharatanatyam at KV Schools",
    location: "KV, Chennai",
    date: "2018–2019",
    image: photos.p05,
    imageAlt: "Dance in classroom setting",
  },
  {
    title: "Bharatanatyam Recital at Aishwarya Mahaganapathi Temple",
    location: "New Delhi",
    date: "2018–2019",
    image: photos.p04,
    imageAlt: "Seated Bharatanatyam pose",
  },
  {
    title: "Bharatanatyam Performance at BSF Schools",
    location: "Shillong and Siliguri",
    date: "2017–2018",
    image: photos.p02,
    imageAlt: "Bharatanatyam in traditional pose",
  },
  {
    title: "Bharatanatyam Recital at DRDO",
    location: "New Delhi",
    image: photos.p08,
    imageAlt: "Bharatanatyam performance on stage",
  },
];
