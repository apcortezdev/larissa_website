import fs from 'fs';
import path from 'path';

export async function saveFile(projId, file) {
  const dir = path.join(process.cwd(), 'public', 'tempFiles', projId);
  if (!fs.existsSync(dir)) {
    // creates dir if not existent
    fs.mkdirSync(dir, { recursive: true });
  }

  const data = fs.readFileSync(file.path);
  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'tempFiles', projId, file.name),
    data
  );
  // await fs.unlinkSync(file.path);
  return path.join(dir, file.name);
}

export async function deleteFiles(projId) {
  const dir = path.join(process.cwd(), 'public', 'tempFiles', projId);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
  }
  return path.join(dir);
}
