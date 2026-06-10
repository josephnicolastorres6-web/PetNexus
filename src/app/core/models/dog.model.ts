export interface Dog {
  id: number | string;
  name: string;
  image?: { url: string };
  reference_image_id?: string;
  temperament?: string;
  origin?: string;
  life_span?: string;
  breed_group?: string;
  weight?: { metric: string; imperial?: string };
  height?: { metric: string; imperial?: string };
}
