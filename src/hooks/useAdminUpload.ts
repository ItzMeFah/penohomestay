import React, { useState, useRef } from 'react';
import { supabase } from '../utils/storage';

interface UseAdminUploadProps {
  showAdminToast: (message: string, type?: 'success' | 'danger' | 'info') => void;
}

export const useAdminUpload = ({ showAdminToast }: UseAdminUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isUploadingCloud, setIsUploadingCloud] = useState(false);
  const [cloudUploadSuccess, setCloudUploadSuccess] = useState<boolean | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Client-side image compression using HTML Canvas
  const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Keep aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", quality);
          resolve(compressed);
        } else {
          resolve(base64Str);
        }
      };
      img.onerror = () => {
        resolve(base64Str);
      };
      img.src = base64Str;
    });
  };

  // Reads file to local base64 compressed representation
  const handleFileRead = (file: File, onCompressedReady: (compressedUrl: string) => void) => {
    setUploadError("");
    setCloudUploadSuccess(null);
    setSelectedImageFile(file);

    if (!file.type.startsWith("image/")) {
      setUploadError("Format berkas harus berupa gambar (.jpg, .jpeg, .png, .webp, .gif)!");
      setSelectedImageFile(null);
      return;
    }

    showAdminToast("Membaca file & mengompresi gambar otomatis agar hemat ruang...", "info");

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target && event.target.result) {
        const rawBase64 = event.target.result as string;
        try {
          const compressedBase64 = await compressImage(rawBase64);
          onCompressedReady(compressedBase64);
          showAdminToast("Gambar berhasil dikompresi dan dimuat secara lokal!", "success");
        } catch (e) {
          console.error("Gagal kompresi, menggunakan file asli", e);
          onCompressedReady(rawBase64);
          showAdminToast("Gambar berhasil dimuat lokal tanpa kompresi.", "info");
        }
      }
    };
    reader.onerror = () => {
      setUploadError("Gagal membaca file gambar lokal!");
    };
    reader.readAsDataURL(file);
  };

  // Drag Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, onCompressedReady: (compressedUrl: string) => void) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileRead(e.dataTransfer.files[0], onCompressedReady);
    }
  };

  const handleFileSelectChange = (e: React.ChangeEvent<HTMLInputElement>, onCompressedReady: (compressedUrl: string) => void) => {
    if (e.target.files && e.target.files[0]) {
      handleFileRead(e.target.files[0], onCompressedReady);
    }
  };

  // Directly uploads image to Supabase cloud storage (with fallback for RLS)
  const handleUploadToSupabase = async (customFile?: File): Promise<string | null> => {
    const fileToUpload = customFile || selectedImageFile;
    if (!fileToUpload) {
      setUploadError("Pilih file gambar terlebih dahulu!");
      return null;
    }

    setIsUploadingCloud(true);
    setUploadError("");
    setCloudUploadSuccess(null);
    showAdminToast("Mengunggah foto ke Supabase Storage...", "info");

    try {
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `gallery/${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;

      let bucketName = 'gallery';
      let uploadResult = await supabase.storage
        .from(bucketName)
        .upload(fileName, fileToUpload, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadResult.error) {
        console.warn("Failed to upload to 'gallery' bucket, trying 'avatars' bucket...", uploadResult.error.message);
        bucketName = 'avatars';
        uploadResult = await supabase.storage
          .from(bucketName)
          .upload(fileName, fileToUpload, {
            cacheControl: '3600',
            upsert: true
          });
      }

      if (uploadResult.error) {
        throw new Error(uploadResult.error.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      setCloudUploadSuccess(true);
      showAdminToast("Foto berhasil diunggah ke Supabase Cloud!", "success");
      return publicUrl;
    } catch (err: any) {
      console.error("Gagal mengunggah berkas ke Supabase:", err);

      const isRlsError = err.message?.toLowerCase().includes("row-level security") ||
                         err.message?.toLowerCase().includes("security policy") ||
                         err.message?.toLowerCase().includes("violates");

      if (isRlsError) {
        setUploadError("Gagal upload cloud karena kebijakan keamanan Supabase (RLS). Namun jangan khawatir, gambar Anda TELAH berhasil dikompresi dan dimuat secara lokal (Base64 luring)! Anda dapat langsung mengklik tombol Simpan/Tambah di bawah untuk menyimpannya.");
        showAdminToast("Gambar lokal siap digunakan sebagai Base64 luring!", "success");
      } else {
        setUploadError(`Gagal upload cloud: ${err.message}. Pastikan bucket 'avatars' sudah ada dan RLS storage telah dikonfigurasi.`);
        showAdminToast("Gagal mengunggah gambar ke cloud.", "danger");
      }
      setCloudUploadSuccess(false);
      return null;
    } finally {
      setIsUploadingCloud(false);
    }
  };

  const resetUploadState = () => {
    setSelectedImageFile(null);
    setUploadError("");
    setCloudUploadSuccess(null);
    setIsUploadingCloud(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    dragActive,
    setDragActive,
    uploadError,
    setUploadError,
    isUploadingCloud,
    cloudUploadSuccess,
    selectedImageFile,
    setSelectedImageFile,
    fileInputRef,
    handleFileRead,
    handleDrag,
    handleDrop,
    handleFileSelectChange,
    handleUploadToSupabase,
    resetUploadState
  };
};
