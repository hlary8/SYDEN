/**
 * Virus scanner stub — ready to plug ClamAV or other scanner.
 * @param {string} filePath
 * @returns {Promise<{clean:boolean, reason?:string}>}
 */
async function scanFile(filePath) {
  // In production, call ClamAV (clamd) or a cloud scanning API.
  // For now return clean after a tiny async delay to simulate scanning.
  await new Promise((r) => setTimeout(r, 50));
  return { clean: true };
}

module.exports = { scanFile };
