export interface Dog {
  id: number | string;
  name: string;
  image?: { url: string };
  reference_image_id?: string;
  temperament?: string;
}
