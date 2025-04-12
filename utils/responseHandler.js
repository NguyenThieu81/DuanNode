function CreateSuccessResponse(res, status, data) {
  res.status(status).json({
    success: true,
    data: data
  })
}

function CreateErrorResponse(res, status, message) {
  res.status(status).json({
    success: false,
    error: message
  })
}

function CreateCookieResponse(res, name, token, exp) {
  res.cookie(name, token, {
    expires: new Date(exp),
    httpOnly: true
  })
}

module.exports = {
  CreateSuccessResponse,
  CreateErrorResponse,
  CreateCookieResponse
}
