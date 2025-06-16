const scriptURL = "https://script.google.com/macros/s/AKfycbzO1qjn4S9VaxyuhMo_Nh2ihb2Wf8kYId2hJcpL2yYY5DFNlw7aTlNgj_X8YzkIKqczlA/exec"; // Ganti dengan URL kamu

// Ambil saldo terakhir saat halaman dibuka
window.addEventListener("DOMContentLoaded", () => {
  fetch(scriptURL)
    .then(res => res.json())
    .then(data => {
      document.getElementById("total-saldo").textContent = `Rp ${parseInt(data.saldo).toLocaleString()}`;
    })
    .catch(err => {
      console.error("Gagal mengambil saldo:", err);
    });
});

// Tambah input pengeluaran baru
function tambahPengeluaran() {
  const container = document.getElementById('pengeluaran-list');
  const div = document.createElement('div');
  div.classList.add('pengeluaran-item');
  div.innerHTML = `
    <input type="text" name="barang[]" placeholder="Nama barang" required />
    <input type="number" name="nominal[]" placeholder="Nominal" min="0" required />
  `;
  container.appendChild(div);
}

// Proses form saat disubmit
document.getElementById("finance-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  const tanggal = form.tanggal.value;
  const pemasukan = parseInt(form.pemasukan.value) || 0;
  const barangInputs = form.querySelectorAll("input[name='barang[]']");
  const nominalInputs = form.querySelectorAll("input[name='nominal[]']");

  const pengeluaran = [];
  let totalPengeluaran = 0;

  for (let i = 0; i < barangInputs.length; i++) {
    const barang = barangInputs[i].value;
    const nominal = parseInt(nominalInputs[i].value) || 0;
    pengeluaran.push({ barang, nominal });
    totalPengeluaran += nominal;
  }

  const saldo = pemasukan - totalPengeluaran;

  const data = {
    tanggal,
    pemasukan,
    pengeluaran,
    totalPengeluaran,
    saldo,
  };

  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(res => res.text())
    .then(() => {
      alert("Data berhasil disimpan!");
      document.getElementById("total-saldo").textContent = `Rp ${saldo.toLocaleString()}`;
      form.reset();
      document.getElementById("pengeluaran-list").innerHTML = `
        <div class="pengeluaran-item">
          <input type="text" name="barang[]" placeholder="Nama barang" required />
          <input type="number" name="nominal[]" placeholder="Nominal" min="0" required />
        </div>
      `;
    })
    .catch((err) => {
      alert("Terjadi kesalahan saat menyimpan data.");
      console.error(err);
    });
});
