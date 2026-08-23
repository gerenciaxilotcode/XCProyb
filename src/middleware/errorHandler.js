import { failure } from '../utils/apiResponse.js'

export function errorHandler(err, req, res, next) {
  console.error(err)

  if (err.name === 'MulterError' || /solo se permiten archivos de imagen/i.test(err.message || '')) {
    return failure(res, 'No fue posible procesar la imagen. Verifica el formato y el tamaño (máx. 5 MB).', 400)
  }

  return failure(res, 'No fue posible completar la operación. Intenta nuevamente.', 500)
}
