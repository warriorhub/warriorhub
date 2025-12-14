/**
 * Validates whether a provided URL links to an image.
 * @param url The URL to validate.
 * @remarks Uses <https://www.zhenghao.io/posts/verify-image-url>
 */
export default async function isValidImage(url: string) {
  const res = await fetch(url, { method: 'HEAD' });
  return res.headers.get('content-type')?.startsWith('image/');
}
