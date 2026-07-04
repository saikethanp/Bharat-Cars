const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf-8');

code = code.replace(/interface AdminViewProps \{[\s\S]*?\}/, `interface AdminViewProps {
  vehicles: Vehicle[];
  enquiries: Enquiry[];
  gallery: GalleryItem[];
  onAddVehicle: (vehicle: Omit<Vehicle, 'id' | 'created_at'>) => void;
  onDeleteVehicle: (id: string) => void;
  onAddGalleryItem: (galleryItem: Omit<GalleryItem, 'id' | 'created_at'>) => void;
  onDeleteGalleryItem: (id: string) => void;
  onDeleteEnquiry: (id: string) => void;
  session?: any;
  userRole?: string;
}`);

code = code.replace(/export default function AdminView\(\{\s*vehicles,\s*enquiries,\s*gallery,\s*onAddVehicle,\s*onDeleteVehicle,\s*onAddGalleryItem,\s*onDeleteGalleryItem,\s*onDeleteEnquiry\s*\}\s*:\s*AdminViewProps\)\s*\{/, 
`export default function AdminView({
  vehicles,
  enquiries,
  gallery,
  onAddVehicle,
  onDeleteVehicle,
  onAddGalleryItem,
  onDeleteGalleryItem,
  onDeleteEnquiry,
  session,
  userRole
}: AdminViewProps) {`);

fs.writeFileSync('src/components/AdminView.tsx', code);
console.log('Fixed AdminViewProps');
