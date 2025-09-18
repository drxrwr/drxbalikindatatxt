const vcfInput = document.getElementById('vcfFiles');
const processBtn = document.getElementById('processBtn');
const outputBox = document.getElementById('output');
const downloadBtn = document.getElementById('downloadBtn');
const fileNameInput = document.getElementById('fileName');

// Fungsi untuk ambil nomor telepon valid
function extractNumbers(text) {
  // Cari semua angka min. 10 digit
  const regex = /[\+\d][\d\s\-().]{9,}/g;
  const matches = text.match(regex) || [];
  // Bersihkan spasi, tanda, dsb.
  return matches.map(num => num.replace(/[^+\d]/g, '')).filter(n => n.length >= 10);
}

processBtn.addEventListener('click', () => {
  const files = vcfInput.files;
  if (!files.length) {
    alert("Pilih minimal satu file VCF dulu!");
    return;
  }

  let allNumbers = [];

  let fileReaders = [];
  for (let file of files) {
    const reader = new FileReader();
    fileReaders.push(new Promise(resolve => {
      reader.onload = e => {
        const text = e.target.result;
        const nums = extractNumbers(text);
        allNumbers = allNumbers.concat(nums);
        resolve();
      };
      reader.readAsText(file);
    }));
  }

  Promise.all(fileReaders).then(() => {
    // Hilangkan duplikat
    const uniqueNumbers = [...new Set(allNumbers)];
    outputBox.value = uniqueNumbers.join("\n");
    alert("Proses selesai! Total nomor: " + uniqueNumbers.length);
  });
});

downloadBtn.addEventListener('click', () => {
  const text = outputBox.value.trim();
  if (!text) {
    alert("Belum ada data untuk di-download!");
    return;
  }

  let filename = fileNameInput.value.trim();
  if (!filename) {
    // default: jumlah nomor
    const count = text.split("\n").length;
    filename = count.toString();
  }
  filename += ".txt";

  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
});
