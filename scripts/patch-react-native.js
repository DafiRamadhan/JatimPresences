const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🔧 Applying React Native glog patch...");

const projectRoot = path.resolve(__dirname, "..");
const glogPath = path.join(projectRoot, "node_modules/react-native/scripts/third-party/glog-0.3.5");
const configureScript = path.join(glogPath, "configure");
const iosConfigure = path.join(glogPath, "../../ios-configure-glog.sh");

try {
  if (!fs.existsSync(glogPath)) {
    console.log("⚠️  Glog directory not found, skipping patch.");
    process.exit(0);
  }

  // 1️⃣ Hapus file 'missing' rusak
  const missingFile = path.join(glogPath, "missing");
  if (fs.existsSync(missingFile)) {
    fs.unlinkSync(missingFile);
    console.log("✅ Removed old 'missing' file");
  }

  // 2️⃣ Jalankan autoreconf (kalau tersedia)
  try {
    execSync("autoreconf -fiv || true", { cwd: glogPath, stdio: "inherit", shell: true });
  } catch {
    console.log("⚠️  autoreconf not found, skipping (ok on Windows).");
  }

  // 3️⃣ Ganti arsitektur armv7 → arm64 di ios-configure-glog.sh
  if (fs.existsSync(iosConfigure)) {
    let content = fs.readFileSync(iosConfigure, "utf8");
    content = content.replace(/armv7/g, "arm64");
    fs.writeFileSync(iosConfigure, content, "utf8");
    console.log("✅ Updated armv7 → arm64 in ios-configure-glog.sh");
  }

  // 4️⃣ Nonaktifkan compile check di configure
  if (fs.existsSync(configureScript)) {
    let configure = fs.readFileSync(configureScript, "utf8");
    configure = configure.replace(/return ac_fn_c_try_compile[\s\S]*?;/, "echo skip compile test; return 0;");
    fs.writeFileSync(configureScript, configure, "utf8");
    console.log("✅ Patched compile test in configure script");
  }

  console.log("🎉 React Native glog patch applied successfully!");
} catch (err) {
  console.error("❌ Failed to patch glog:", err.message);
  process.exit(1);
}
