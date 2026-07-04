/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuel_type: string;
  description: string;
  images: string[];
  created_at: string;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  description: string;
  created_at: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  vehicle_id?: string;
  status: string;
  created_at: string;
}
