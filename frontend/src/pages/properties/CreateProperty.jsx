import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreatePropertyMutation } from '../../features/properties/propertyApi';
import { PlusCircle, Upload, X, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.coerce.number().positive('Price must be greater than zero'),
  type: z.enum(['sale', 'rent']),
  propertyType: z.enum(['house', 'apartment', 'villa', 'commercial', 'plot']),
  bedrooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  area: z.coerce.number().positive('Area in sqft is required'),
  city: z.string().min(2, 'City is required'),
  address: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  amenities: z.string().optional(),
});

export default function CreateProperty() {
  const navigate = useNavigate();
  const [createProperty, { isLoading }] = useCreatePropertyMutation();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      type: 'sale',
      propertyType: 'house',
      bedrooms: 3,
      bathrooms: 3,
      area: 2250,
      city: 'Lahore',
      address: '',
      lat: 31.5204,
      lng: 74.3587,
      amenities: 'Security, Parking, Backup Power, Lawn',
    },
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 6) {
      toast.error('You can only upload up to 6 images.');
      return;
    }

    const updatedFiles = [...selectedFiles, ...files].slice(0, 6);
    setSelectedFiles(updatedFiles);

    const previews = updatedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const removeImage = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(updatedPreviews);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('price', data.price);
      formData.append('type', data.type);
      formData.append('propertyType', data.propertyType);
      formData.append('bedrooms', data.bedrooms);
      formData.append('bathrooms', data.bathrooms);
      formData.append('area', data.area);

      const locationObj = {
        city: data.city,
        address: data.address || '',
        country: 'Pakistan',
        coordinates: {
          lat: data.lat || 31.5204,
          lng: data.lng || 74.3587,
        },
      };
      formData.append('location', JSON.stringify(locationObj));

      const amenitiesArray = (data.amenities || '')
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);
      formData.append('amenities', JSON.stringify(amenitiesArray));

      // Append files
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const res = await createProperty(formData).unwrap();
      toast.success('Property published successfully!');
      navigate(`/properties/${res.data._id}`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create property listing');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20 space-y-8 transition-colors duration-300">
      <div>
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">Create New Listing</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Publish a residential or commercial property to the marketplace catalog.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-8 shadow-2xl"
      >
        {/* Basic Details */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-default)] pb-2">
            1. Property Overview
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Listing Title *
            </label>
            <input
              {...register('title')}
              placeholder="e.g. Ultra Luxury 1 Kanal Villa in DHA Phase 6"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
            />
            {errors.title && (
              <p className="text-[11px] text-[#EF4444] mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Detailed Description *
            </label>
            <textarea
              rows={4}
              {...register('description')}
              placeholder="Describe finishes, location advantages, architecture, security..."
              className="w-full p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
            />
            {errors.description && (
              <p className="text-[11px] text-[#EF4444] mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Purpose *
              </label>
              <select
                {...register('type')}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
              >
                <option value="sale" className="bg-[var(--bg-surface)]">For Sale</option>
                <option value="rent" className="bg-[var(--bg-surface)]">For Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Property Type *
              </label>
              <select
                {...register('propertyType')}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
              >
                <option value="house" className="bg-[var(--bg-surface)]">House</option>
                <option value="apartment" className="bg-[var(--bg-surface)]">Apartment</option>
                <option value="villa" className="bg-[var(--bg-surface)]">Villa</option>
                <option value="commercial" className="bg-[var(--bg-surface)]">Commercial</option>
                <option value="plot" className="bg-[var(--bg-surface)]">Plot</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Price (PKR) *
              </label>
              <input
                type="number"
                {...register('price')}
                placeholder="e.g. 45000000"
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
              />
              {errors.price && (
                <p className="text-[11px] text-[#EF4444] mt-1">{errors.price.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-default)] pb-2">
            2. Specs & Dimensions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                {...register('bedrooms')}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                {...register('bathrooms')}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Area (Sq Ft) *
              </label>
              <input
                type="number"
                {...register('area')}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
              />
              {errors.area && (
                <p className="text-[11px] text-[#EF4444] mt-1">{errors.area.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              Amenities (comma separated)
            </label>
            <input
              {...register('amenities')}
              placeholder="Swimming Pool, Smart Home, Solar Backup, Servant Quarter"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
            />
          </div>
        </div>

        {/* Location details */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-default)] pb-2">
            3. Location Coordinates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                City *
              </label>
              <input
                {...register('city')}
                placeholder="e.g. Lahore, Karachi, Islamabad"
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
              />
              {errors.city && (
                <p className="text-[11px] text-[#EF4444] mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Street / Sector Address
              </label>
              <input
                {...register('address')}
                placeholder="e.g. Sector H, Phase 5"
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                {...register('lat')}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                {...register('lng')}
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#6C63FF]"
              />
            </div>
          </div>
        </div>

        {/* Media upload */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-default)] pb-2">
            4. Photos & Media (Max 6)
          </h3>

          <div className="border-2 border-dashed border-[var(--border-default)] hover:border-[#6C63FF]/50 rounded-2xl p-6 text-center transition">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              id="file-upload"
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer space-y-2 block">
              <Upload className="w-8 h-8 text-[#6C63FF] mx-auto" />
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                Click or drag images here to upload
              </p>
              <p className="text-[11px] text-[var(--text-secondary)]">PNG, JPG or WEBP up to 5MB each</p>
            </label>
          </div>

          {previewUrls.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {previewUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-xl overflow-hidden border border-[var(--border-default)] group shadow-sm"
                >
                  <img src={url} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-[#EF4444] transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4] text-white font-bold text-sm shadow-xl shadow-[#6C63FF]/25 hover:opacity-95 transition disabled:opacity-50"
        >
          {isLoading ? 'Publishing Listing...' : 'Publish Listing Now'}
        </button>
      </form>
    </div>
  );
}
