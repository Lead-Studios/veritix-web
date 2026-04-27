export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UploadState {
  status: UploadStatus;
  progress: number;
  url?: string;
  error?: string;
}

export async function uploadImage(
  file: File,
  onProgress: (pct: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    });
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText).url);
      } else {
        reject(new Error("Upload failed. Please try again."));
      }
    });
    xhr.addEventListener("error", () => reject(new Error("Network error during upload.")));
    const body = new FormData();
    body.append("file", file);
    xhr.open("POST", "/api/uploads");
    xhr.send(body);
  });
}