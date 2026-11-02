// 임시 MySQL을 켜고 앱을 `npm run dev`로 실행한다. .env가 비어 있을 때 배포 전 확인용.
// 사용: npm install → npm start / 종료: Ctrl+C (임시 DB도 함께 삭제)
import { createDB } from "mysql-memory-server";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = path.join(os.tmpdir(), "mysqlmsn");
const log = (m) => console.log(`[local-db] ${m}`);

// 이전 실행에서 남은 임시 DB 삭제
for (const dir of list(path.join(CACHE, "dbs"))) {
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch {}
}

let app, db, stopping = false;
async function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  log("종료 중");
  // Windows: 하위 프로세스까지 종료
  if (app?.pid && process.platform === "win32") spawnSync("taskkill", ["/pid", String(app.pid), "/T", "/F"], { stdio: "ignore" });
  else app?.kill("SIGINT");
  await db?.stop().catch(() => {});
  process.exit(code);
}
process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));

try {
  log("임시 MySQL 시작 (첫 실행은 MySQL 다운로드로 몇 분 걸림)");
  db = await createDB({ version: "8.4.x", dbName: "local", username: "root", logLevel: "ERROR" });
  removeDebugFiles(path.join(CACHE, "binaries"));

  log("앱 시작 (접속 주소는 아래 Local 줄)");
  app = spawn("npm", ["run", "dev"], {
    cwd: APP_DIR,
    shell: true,
    stdio: "inherit",
    env: {
      ...process.env,
      DB_HOST: "127.0.0.1", DB_PORT: String(db.port),
      DB_USER: "root", DB_PASSWORD: "", DB_NAME: "local",
    },
  });
  app.on("exit", () => { if (!stopping) { log("앱 종료"); stop(1); } });
} catch (err) {
  console.error(`[local-db] 실패: ${err.message}`);
  await stop(1);
}

function list(dir) {
  try { return fs.readdirSync(dir).map((name) => path.join(dir, name)); } catch { return []; }
}

// 실행에 필요 없는 디버그 파일(.pdb) 삭제
function removeDebugFiles(dir) {
  for (const p of list(dir)) {
    try {
      if (fs.statSync(p).isDirectory()) removeDebugFiles(p);
      else if (p.endsWith(".pdb")) fs.rmSync(p, { force: true });
    } catch {}
  }
}
