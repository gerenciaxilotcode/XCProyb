import { failure } from '../utils/apiResponse.js'

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const firstIssue = result.error.issues[0]
      return failure(res, firstIssue?.message || 'Datos inválidos.', 422)
    }

    req.body = result.data
    return next()
  }
}
