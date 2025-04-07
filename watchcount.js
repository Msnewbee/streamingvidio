export async function getWatchCount(id) {
  try {
    const res = await fetch(`https://lingering-union-0acf.bilariko2.workers.dev/api/get-watch?id=${id}`);
    return await res.json();
  } catch (err) {
    console.error("Gagal ambil watch count:", err);
    return 0;
  }
}

export async function increaseWatchCount(id) {
  try {
    await fetch(`https://lingering-union-0acf.bilariko2.workers.dev/api/increase-watch`, {
      method: "POST",
      body: JSON.stringify({ animeId: id }),
    });
  } catch (err) {
    console.error("Gagal increase watch count:", err);
  }
}
  