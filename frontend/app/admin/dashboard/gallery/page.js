'use client';

import { GallerySection } from '@/components/admin/AdminDashboardSections';
import { useAdminDashboard } from '@/components/admin/AdminDashboardProvider';

export default function AdminDashboardGalleryPage() {
  const { gallery, galleryForm, setGalleryForm, handleGallerySubmit, editGalleryItem, handleDeleteGallery, token } = useAdminDashboard();

  return (
    <GallerySection
      gallery={gallery}
      galleryForm={galleryForm}
      setGalleryForm={setGalleryForm}
      handleGallerySubmit={handleGallerySubmit}
      editGalleryItem={editGalleryItem}
      handleDeleteGallery={handleDeleteGallery}
      token={token}
    />
  );
}
