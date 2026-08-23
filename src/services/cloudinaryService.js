import cloudinary from '../config/cloudinary.js'

const FOLDER = 'xilotcode'

export function uploadBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: FOLDER, resource_type: 'image', ...options },
      (error, result) => {
        if (error) return reject(error)
        return resolve(result)
      }
    )
    stream.end(buffer)
  })
}

export function destroyAsset(publicId) {
  return cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
}
