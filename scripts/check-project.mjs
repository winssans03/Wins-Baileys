import fs from 'node:fs';

const files = [
  'src/Socket/socket.ts',
  'src/Socket/messages-send.ts',
  'src/Defaults/index.ts',
  'package.json'
];

let failed = false;

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error(`❌ File tidak ditemukan: ${file}`);
    failed = true;
    continue;
  }

  console.log(`✅ File ditemukan: ${file}`);
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

console.log('\n=== WINS BAILEYS ===');
console.log(`Nama: ${pkg.name}`);
console.log(`Versi: ${pkg.version}`);

if (!pkg.scripts?.build) {
  console.error('❌ Skrip build tidak ditemukan.');
  failed = true;
} else {
  console.log('✅ Skrip build tersedia.');
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log('\nPemeriksaan project selesai.');
}
