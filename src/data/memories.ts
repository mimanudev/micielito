export interface Memory {
  id: number;
  filename: string;
  title: string;
  date: string;
  description: string;
  featured?: boolean;
}

// Lista optimizada usando exclusivamente las imágenes ligeras WebP de la carpeta "compressed"
export const memories: Memory[] = [
  {
    id: 1,
    filename: "compressed/20260715_213720.webp",
    title: "Instante Inolvidable",
    date: "15 de Julio, 2026",
    description: "Una captura espontánea de pura felicidad. Me encanta verte tan feliz, libre y radiante a mi lado.",
    featured: true
  },
  {
    id: 2,
    filename: "compressed/Screenshot_20260830_045323_Spotify.webp",
    title: "Nuestra Canción Favorita",
    date: "30 de Agosto, 2026",
    description: "Esa melodía que siempre me recuerda a ti, sonando a las 4 de la madrugada mientras pienso en lo afortunado que soy de tenerte.",
    featured: false
  },
  {
    id: 3,
    filename: "compressed/IMG-20260729-WA0000.webp",
    title: "Tus Ojos, Mi Lugar Favorito",
    date: "29 de Julio, 2026",
    description: "Dicen que el hogar no es un lugar físico, sino una persona. Cada vez que te miro, sé que estoy exactamente donde pertenezco.",
    featured: false
  },
  {
    id: 4,
    filename: "compressed/20260715_214458(1).webp",
    title: "Bajo las Estrellas",
    date: "15 de Julio, 2026",
    description: "Caminando juntos, sintiendo que el tiempo se detiene por completo cuando estamos cerca el uno del otro.",
    featured: false
  },
  {
    id: 5,
    filename: "compressed/IMG-20260714-WA0215.webp",
    title: "Risas Inesperadas",
    date: "14 de Julio, 2026",
    description: "Contigo hasta el día más simple se convierte en una gran aventura llena de carcajadas y complicidad.",
    featured: false
  },
  {
    id: 6,
    filename: "compressed/IMG-20260714-WA0212.webp",
    title: "Tu Dulzura Sin Igual",
    date: "14 de Julio, 2026",
    description: "Esa manera tan tuya de iluminar todo a tu alrededor con una sola palabra, una caricia o una sonrisa.",
    featured: false
  },
  {
    id: 7,
    filename: "compressed/IMG-20260714-WA0205.webp",
    title: "Juntos Todo Es Mejor",
    date: "14 de Julio, 2026",
    description: "No importa el destino ni las circunstancias, mientras sea contigo, el universo entero está en armonía.",
    featured: false
  },
  {
    id: 8,
    filename: "compressed/2023-05-26 175954.webp",
    title: "Momentos que Atesoro",
    date: "26 de Mayo, 2023",
    description: "Cada recuerdo a tu lado es un tesoro que guardo con todo el cariño en mi mente y en mi corazón.",
    featured: false
  },
  {
    id: 9,
    filename: "compressed/2023-05-22 135732.webp",
    title: "Tiempos Dorados",
    date: "22 de Mayo, 2023",
    description: "De los primeros capítulos de nuestra hermosa historia que siempre recordaré con infinita ternura.",
    featured: false
  },
  {
    id: 10,
    filename: "compressed/2022-03-08 182826.webp",
    title: "Donde Todo Empezó",
    date: "8 de Marzo, 2022",
    description: "Una fecha especial guardada para siempre en el alma. Gracias por cada segundo que hemos caminado juntos.",
    featured: false
  }
];
