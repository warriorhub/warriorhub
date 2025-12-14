export default function isValidImage(url: string) {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.toLowerCase();
    return /\.(jpe?g|png|gif|webp|avif|bmp|svg)$/.test(pathname);
  } catch {
    return false;
  }
}
