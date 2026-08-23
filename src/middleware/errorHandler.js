import { failure } from '../utils/apiResponse.js'

export function errorHandler(err, req, res, next) {
  console.error(err)
  return failure(res, 'No fue posible completar la operación. Intenta nuevamente.', 500)
}
