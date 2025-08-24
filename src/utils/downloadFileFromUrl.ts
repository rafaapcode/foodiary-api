export async function downloadFileFromURL(url: string): Promise<Buffer> {
  const response = await fetch(url);
  const arrayBuff = await response.arrayBuffer();

  return Buffer.from(arrayBuff);
}
