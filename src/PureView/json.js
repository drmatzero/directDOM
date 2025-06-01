export async function loadJSON(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Gagal memuat file JSON dari ${filePath}: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error memuat JSON:", error);
    return null;
  }
}
