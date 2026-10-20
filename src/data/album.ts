export interface AlbumPhoto {
  file: string;
  title: string;
  alt: string;
  width: number;
  height: number;
}

// Todas las fotos locales de /public/images, en orden aproximado de fecha.
// width y height son las dimensiones reales: reservan el hueco antes de que cargue cada foto
export const album: AlbumPhoto[] = [
  { file: 'compressed/2022-03-08 182826.webp', title: 'Donde todo empezó', alt: 'Nuestra primera foto juntos', width: 958, height: 1280 },
  { file: 'compressed/2023-05-22 135732.webp', title: 'Tiempos dorados', alt: 'Recuerdo de mayo de 2023', width: 576, height: 1024 },
  { file: 'compressed/2023-05-26 175954.webp', title: 'Momentos que atesoro', alt: 'Otro recuerdo de mayo de 2023', width: 3024, height: 4032 },
  { file: 'new_compress/20250529_212457.webp', title: 'Girar', alt: 'Recuerdo girando juntos', width: 4000, height: 3000 },
  { file: 'new_compress/20250530_144226.webp', title: 'Barcelona', alt: 'Recuerdo de Barcelona', width: 4000, height: 3000 },
  { file: 'new_compress/BDVG4196.webp', title: 'Fiesta', alt: 'Recuerdo de una fiesta', width: 1024, height: 768 },
  { file: 'new_compress/IMG_0119.webp', title: 'Juntos', alt: 'Un momento juntos', width: 3088, height: 2316 },
  { file: 'new_compress/IMG_0402.webp', title: 'Construyendo recuerdos', alt: 'Recuerdo construyendo juntos', width: 4032, height: 3024 },
  { file: 'new_compress/IMG_0463.webp', title: 'Días de fiesta', alt: 'Recuerdo de días de fiesta', width: 4032, height: 3024 },
  { file: 'new_compress/IMG_0802.webp', title: 'Diciembre', alt: 'Recuerdo de diciembre', width: 3024, height: 4032 },
  { file: 'new_compress/IMG_0894.webp', title: 'Luces', alt: 'Recuerdo iluminado por luces', width: 2316, height: 3088 },
  { file: 'new_compress/IMG_0907.webp', title: 'Luces juntos', alt: 'Un momento juntos entre luces', width: 3024, height: 4032 },
  { file: 'new_compress/IMG_1853.webp', title: 'Port Alcalá', alt: 'Recuerdo en Port Alcalá', width: 4032, height: 3024 },
  { file: 'new_compress/IMG_1962.webp', title: 'Otro instante juntos', alt: 'Otro recuerdo juntos', width: 4032, height: 3024 },
  { file: 'compressed/IMG-20260714-WA0212.webp', title: 'Tu dulzura sin igual', alt: 'Recuerdo de julio de 2026', width: 1030, height: 1567 },
  { file: 'compressed/20260715_214458(1).webp', title: 'Bajo las estrellas', alt: 'Caminando juntos de noche', width: 2144, height: 2886 },
];
