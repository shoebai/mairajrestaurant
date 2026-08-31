import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { storage } from "./firebase"

export async function uploadImage(file: File, folder: string): Promise<string> {
  const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")
  const path = `${folder}/${Date.now()}-${cleanName}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export async function deleteImageByUrl(url: string) {
  try {
    const imgRef = ref(storage, url)
    await deleteObject(imgRef)
  } catch {
    // Image may already be gone or URL wasn't a Storage URL — safe to ignore.
  }
}
