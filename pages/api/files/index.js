export default async function handler(req, res) {
  res.status(404).json({
    statusCode: '404',
    message: 'Not Found',
  });
}
