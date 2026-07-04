const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  /const handleAddVehicle = async \(newCar: Omit<Vehicle, 'id' \| 'created_at'>\) => \{[\s\S]*?\} else \{/,
  `const handleAddVehicle = async (newCar: Omit<Vehicle, 'id' | 'created_at'>) => {
    if (!supabase) return;
    const { data, error } = await supabase.from('vehicles').insert([{
      make: newCar.make,
      model: newCar.model,
      year: newCar.year,
      price: newCar.price,
      mileage: newCar.mileage,
      transmission: newCar.transmission,
      fuel_type: newCar.fuel_type,
      description: newCar.description,
      status: 'available'
    }]).select();
    
    if (data && !error) {
      const inserted = data[0];
      
      // Insert images into vehicle_gallery
      if (newCar.images && newCar.images.length > 0) {
        const galleryInserts = newCar.images.map((url, index) => ({
          vehicle_id: inserted.id,
          image_url: url,
          display_order: index
        }));
        await supabase.from('vehicle_gallery').insert(galleryInserts);
      }

      setVehicles((prev) => [{
        id: inserted.id,
        make: inserted.make,
        model: inserted.model,
        year: inserted.year,
        price: inserted.price,
        mileage: inserted.mileage,
        transmission: inserted.transmission,
        fuel_type: inserted.fuel_type,
        description: inserted.description,
        images: newCar.images || [],
        created_at: inserted.created_at
      }, ...prev]);
    } else {`
);

fs.writeFileSync('src/App.tsx', content);
console.log('Patched App.tsx for handleAddVehicle');
