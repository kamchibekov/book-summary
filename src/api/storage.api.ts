import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from 'firebase/storage';

// Firebase storage local cache
const cache: Record<string, string> = {};

// Get cached image URL or fetch from Firebase Storage
export const getCachedImageUrl = async (imagePath: string): Promise<string> => {
  if (cache[imagePath]) {
    return cache[imagePath]; // Return cached URL
  }

  const storage = getStorage();
  const imageRef = storageRef(storage, imagePath);

  const url = await getDownloadURL(imageRef);
  cache[imagePath] = url; // Cache the URL
  return url;
};
