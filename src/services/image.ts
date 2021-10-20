import imageSize from 'buffer-image-size';

export const imageConfig = await import('#src/config/image');

export function getImageInfo(image: Buffer): ReturnType<typeof imageSize> {
  return imageSize(image);
}

export function checkImageSize(image: Buffer): boolean {
  const info = getImageInfo(image);
  return imageConfig.maxWidth >= info.width && imageConfig.maxHeight >= info.height;
}

import multer from 'multer';

export const multerImage = multer({
  limits: {
    fileSize: imageConfig.maxSize,
  },
});
