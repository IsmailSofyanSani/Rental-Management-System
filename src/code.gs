/**
 * @OnlyCurrentDoc
 */

// ==========================================
// DEMO MODE CONFIGURATION
// ==========================================
// Set to true to enable read-only mode for demo/testing
// In demo mode, all write operations will be blocked
const DEMO_MODE = false;

/**
 * Assert that write operations are allowed
 * Throws error if DEMO_MODE is enabled
 * @private
 */
function assertWritable_() {
  if (DEMO_MODE) {
    throw new Error('Write operations are disabled in DEMO mode');
  }
}

const SHEETS = {
  RENTALS: 'Data_Sewa',
  EXPENSES: 'Pengeluaran',
  PETTY_CASH: 'Petty_Cash',
  EMPLOYEE_LOANS: 'Kasbon_Karyawan',
  CUSTOMERS: 'Data_Pelanggan',
  CONFIG: 'Konfigurasi',
  BILLING: 'Data_Penagihan',
  CREDIT_DATA: 'Data_Kredit',
  CREDIT_PAYMENTS: 'Detail_Angsuran',
  DEBT: 'Hutang_Sewa',
  AUDIT_LOG: 'Audit_Log'
};

function doGet(e) {
  // Load main app
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Rental Management System (RMS)')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function safeFmtDate__(d) {
  if (!d) return '-';
  if (d instanceof Date) {
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  return String(d);
}

function getSheet__(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheet_ByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (name === SHEETS.RENTALS || name === SHEETS.DEBT) {
      sheet.appendRow([
        'ID', 'Tanggal Input', 'Nama Customer', 'Unit Motor', 'Plat Nomor', 
        'Tgl Mulai', 'Tgl Selesai', 'Jam Selesai', 'Harga Per Hari', 'Harga Total', 
        'Metode Bayar', 'Status Sewa', 'Keterangan', 'Jaminan', 
        'Telp Penyewa', 'Telp Darurat 1', 'Telp Darurat 2', 'Riwayat Aksi',
        'Tgl Kembali Aktual', 'Kondisi', 'Denda Kerusakan', 'Denda Telat', 'Total Denda', 
        'Catatan Kembali', 'Status Pembayaran', 'Biaya Luar Kota', 'Denda Luar Kota',
        'Helm Awal', 'Bensin Awal', 'Helm Kembali', 'Bensin Kembali', 
        'Total Terbayar', 'Kekurangan Hutang', 'Link Marketing', 'Kelebihan Pembayaran',
        'No Identitas', 'Alamat', 'Status Penyewa',
        'Jenis Kelamin', 'Tempat/Tgl Lahir', 'Kelurahan/Desa', 'Kecamatan', 'Kabupaten/Kota', 
        'Kewarganegaraan', 'Alamat Domisili', 'Jenis Sewa', 'FC STNK', 'Spion', 'Cover Knalpot'
      ]);
      sheet.getRange(1, 1, 1, 49).setFontWeight('bold').setBackground('#E0E0E0');
    }
    if (name === SHEETS.CREDIT_DATA) {
      sheet.appendRow([
        'id_kredit', 'nama_customer', 'no_whatsapp', 'unit_motor', 
        'dp_awal', 'tenor', 'cicilan_perbulan', 'total_kredit', 
        'tanggal_mulai', 'jatuh_tempo', 'status'
      ]);
      sheet.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#E0E0E0');
    }
    if (name === SHEETS.CREDIT_PAYMENTS) {
      sheet.appendRow([
        'id_angsuran', 'id_kredit', 'angsuran_ke', 'tanggal_bayar', 
        'jumlah_bayar', 'metode_bayar', 'catatan'
      ]);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#E0E0E0');
    }
    if (name === SHEETS.AUDIT_LOG) {
      sheet.appendRow(['Timestamp', 'User Role', 'Aksi', 'Modul', 'Data ID', 'Data Lama', 'Data Baru', 'Keterangan']);
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#E0E0E0');
    }
  }
  return sheet;
}

function addRental(form) {
  assertWritable_();
  const ws = getSheet_(SHEETS.RENTALS);
  const id = 'R-' + new Date().getTime();
  const outOfTownFee = Number(form.outOfTownFee) || 0;
  const todayStr = safeFmtDate_(new Date());
  
  const transactionDateStr = form.transactionDate || todayStr;

  ws.appendRow([
    id, new Date(), "'"+form.customerName, form.motorUnit, form.plateNumber || '-', 
    form.startDate, form.endDate, form.endTime || '12:00',                           
    form.pricePerDay || 0, form.totalPrice,                                           
    form.paymentMethod, 'Aktif', form.notes || '', form.guarantee || '',              
    "'"+form.renterPhone, "'"+form.phone1, "'"+form.phone2,                          
    `[${transactionDateStr}] Input Awal (+Rp${form.totalPrice}) - ${form.paymentMethod}`, 
    "", "", 0, 0, 0, "", "Belum Lunas", outOfTownFee, 0,                             
    form.helmAwal || 0, form.bensinAwal || 0, 0, 0, 0,                               
    0,                           
    form.linkMarketing || '-',
    0,
    form.idNumber || '-',
    form.address || '-',
    form.renterStatus || '-',
    form.gender || '-',
    form.birthPlaceDate || '-',
    form.village || '-',
    form.subdistrict || '-',
    form.city || '-',
    form.nationality || '-',
    form.domicile || '-',
    form.rentType || '-',
    form.fcStnk || '-',
    form.spion || '-',
    form.coverKnalpot || '-'
  ]);
  
  return { status: 'success', message: 'Data sewa berhasil disimpan!' };
}

function getRentals() {
  const wsRent = getSheet_(SHEETS.RENTALS);
  const wsDebt = getSheet_(SHEETS.DEBT);
  
  let data = [];
  if (wsRent.getLastRow() >= 2) data = data.concat(wsRent.getDataRange().getValues().slice(1));
  if (wsDebt.getLastRow() >= 2) data = data.concat(wsDebt.getDataRange().getValues().slice(1));

  if (data.length === 0) return [];

  return data.map(row => ({
    id: String(row[0]), 
    dateInput: safeFmtDate_(row[1]), 
    customer: String(row[2]), 
    unit: String(row[3]),
    plate: String(row[4]), 
    start: safeFmtDate_(row[5]), 
    end: safeFmtDate_(row[6]), 
    endTime: String(row[7]),
    pricePerDay: Number(row[8]) || 0, 
    price: Number(row[9]) || 0, 
    paymentMethod: String(row[10] || 'Cash'),
    rentalStatus: String(row[11]), 
    notes: String(row[12]),
    guarantee: String(row[13]), 
    phones: String(row[14]), 
    phone1: String(row[15] || '-'),
    phone2: String(row[16] || '-'),
    actionHistory: String(row[17] || ''),
    actualReturnDate: safeFmtDate_(row[18]),
    condition: row[19] || '-', 
    totalFine: Number(row[22]) || 0, 
    paymentStatus: String(row[24] || 'Lunas'),
    outOfTownFee: Number(row[25]) || 0,
    outOfTownPenalty: Number(row[26]) || 0,
    helmAwal: row[27] || 0,
    bensinAwal: row[28] || 0,
    helmKembali: row[29] || 0,
    bensinKembali: row[30] || 0,
    terbayar: Number(row[31]) || 0, 
    shortage: Number(row[32]) || 0, 
    linkMarketing: String(row[33] || '-'),
    overpayment: Number(row[34]) || 0,
    idNumber: String(row[35] || '-'),
    address: String(row[36] || '-'),
    renterStatus: String(row[37] || '-'),
    gender: String(row[38] || ''),
    birthPlaceDate: String(row[39] || ''),
    village: String(row[40] || ''),
    subdistrict: String(row[41] || ''),
    city: String(row[42] || ''),
    nationality: String(row[43] || ''),
    domicile: String(row[44] || ''),
    rentType: String(row[45] || ''),
    fcStnk: String(row[46] || ''),
    spion: String(row[47] || ''),
    coverKnalpot: String(row[48] || '')
  })).reverse();
}

function finishRental(id, outOfTownPenalty, penaltyMethod, helmKembali, bensinKembali, catatan) { 
  assertWritable_();
  let ws = getSheet_(SHEETS.RENTALS);
  let rows = ws.getDataRange().getValues();
  let rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  
  // Jika tidak ketemu di Data_Sewa, cari di Hutang_Sewa (Berguna jika dilunasi dari page Hutang)
  if (rowIndex === -1) {
    ws = getSheet_(SHEETS.DEBT);
    rows = ws.getDataRange().getValues();
    rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  }

  if (rowIndex > -1) {
    const rowIdx = rowIndex + 1;
    const penalty = Number(outOfTownPenalty) || 0;
    const todayStr = safeFmtDate_(new Date());
    const method = penaltyMethod || 'Cash';
    
    ws.getRange(rowIdx, 12).setValue('Selesai');
    ws.getRange(rowIdx, 19).setValue(new Date()); 
    ws.getRange(rowIdx, 25).setValue('Lunas'); 
    ws.getRange(rowIdx, 27).setValue(penalty);
    
    // Simpan data helm dan bensin saat kembali
    ws.getRange(rowIdx, 30).setValue(helmKembali || 0);
    ws.getRange(rowIdx, 31).setValue(bensinKembali || 0);
    ws.getRange(rowIdx, 24).setValue(catatan || "");
    
    const oldHist = ws.getRange(rowIdx, 18).getValue();
    const returnInfo = `\n[${todayStr}] Kembali - Helm: ${helmKembali}, Bensin: ${bensinKembali} strip.`;
    
    if (penalty > 0) {
      ws.getRange(rowIdx, 23).setValue(penalty);
      const currentTotal = Number(ws.getRange(rowIdx, 10).getValue()) || 0;
      ws.getRange(rowIdx, 10).setValue(currentTotal + penalty);
      ws.getRange(rowIdx, 18).setValue(oldHist + returnInfo + `\n[${todayStr}] Selesai: Denda/Biaya Tambahan (+Rp${penalty}) - ${method}`);
    } else {
      ws.getRange(rowIdx, 18).setValue(oldHist + returnInfo + `\n[${todayStr}] Selesai: Tepat Waktu / Lunas`);
    }
  }
  return { status: 'success' };
}

function moveToHutangSewa(id, finalTotalHutang, dendaTelat) {
  const ws = getSheet_(SHEETS.RENTALS);
  const wsHutang = getSheet_(SHEETS.DEBT); 
  const rows = ws.getDataRange().getValues();
  const rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  
  if (rowIndex > -1) {
    const rowIdx = rowIndex + 1;
    const todayStr = safeFmtDate_(new Date());
    
    let rowData = rows[rowIndex];
    
    rowData[9]  = finalTotalHutang;  
    rowData[21] = dendaTelat;       
    rowData[11] = 'Selesai';        
    rowData[18] = new Date();       
    rowData[24] = 'Belum Lunas';
    rowData[31] = 0;                 
    rowData[32] = finalTotalHutang;  
    
    const oldHist = rowData[17] || '';
    rowData[17] = oldHist + `\n[${todayStr}] Unit Kembali (Stop Tunggakan) -> Pindah ke Hutang Sewa. Tagihan Final: Rp${finalTotalHutang}`;
    
    while (rowData.length < 49) rowData.push('-');

    wsHutang.appendRow(rowData);
    ws.deleteRow(rowIdx);
    
    return { status: 'success', message: 'Tunggakan dihentikan. Data telah dipindah dari Tunggakan Berjalan ke Sheet Hutang Sewa.' };
  }
  return { status: 'error', message: 'Data tidak ditemukan.' };
}

// LOGIKA KEMBALIAN PERPANJANGAN SEWA DIPERBARUI (MENDUKUNG SALDO)
function extendRentalTransaction(id, newDate, tagihanParam, dibayarParam, payMethod, extendNotes) {
  assertWritable_();
  let ws = getSheet_(SHEETS.RENTALS);
  let rows = ws.getDataRange().getValues();
  let rowIndex = rows.findIndex(r => String(r[0]) === String(id));

  if (rowIndex === -1) {
    ws = getSheet_(SHEETS.DEBT);
    rows = ws.getDataRange().getValues();
    rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  }

  if (rowIndex === -1) return { status: 'error', message: 'Data tidak ditemukan.' };

  const rowIdx         = rowIndex + 1;
  const todayStr       = safeFmtDate_(new Date());
  const method         = payMethod || 'Cash';

  const tagihanSesiIni = Number(tagihanParam) || 0;
  const uangDiterima   = Number(dibayarParam) || 0; 

  const terbayarLama   = Number(ws.getRange(rowIdx, 32).getValue()) || 0; 
  const hutangLama     = Number(ws.getRange(rowIdx, 33).getValue()) || 0; 
  const totalHargaLama = Number(ws.getRange(rowIdx, 10).getValue()) || 0;
  const kelebihanLama  = Number(ws.getRange(rowIdx, 35).getValue()) || 0; 

  const totalTanggungan = hutangLama + tagihanSesiIni;
  const totalUangTersedia = kelebihanLama + uangDiterima;

  let sisaHutangBaru = 0;
  let kelebihanBaru = 0;

  if (totalUangTersedia >= totalTanggungan) {
    kelebihanBaru = totalUangTersedia - totalTanggungan;
    sisaHutangBaru = 0;
  } else {
    kelebihanBaru = 0;
    sisaHutangBaru = totalTanggungan - totalUangTersedia;
  }

  const terbayarBaru   = terbayarLama + uangDiterima; 
  const totalHargaBaru = totalHargaLama + tagihanSesiIni;

  ws.getRange(rowIdx, 7).setValue(newDate);           
  ws.getRange(rowIdx, 10).setValue(totalHargaBaru);   
  ws.getRange(rowIdx, 32).setValue(terbayarBaru);     
  ws.getRange(rowIdx, 33).setValue(sisaHutangBaru);   
  ws.getRange(rowIdx, 35).setValue(kelebihanBaru); // Menyimpan saldo sisa kelebihan yang baru

  ws.getRange(rowIdx, 25).setValue(sisaHutangBaru <= 0 ? 'Lunas' : 'Belum Lunas');

  const oldHist = ws.getRange(rowIdx, 18).getValue();
  let log = `\n[${todayStr}] PERPANJANGAN s/d ${newDate} | Tagihan Sesi: Rp${tagihanSesiIni}`;
  
  if (kelebihanLama > 0) {
    let pakaiSaldo = Math.min(kelebihanLama, totalTanggungan);
    log += ` | Pakai Saldo Kelebihan: Rp${pakaiSaldo}`;
  }
  if (uangDiterima > 0) {
    log += ` | Dibayar: (+Rp${uangDiterima}) - ${method}`;
  }
  if (kelebihanBaru > 0) {
    log += ` | Sisa Kelebihan: Rp${kelebihanBaru}`;
  }
  if (sisaHutangBaru > 0) {
    log += ` | Sisa Hutang: Rp${sisaHutangBaru}`;
  }

  ws.getRange(rowIdx, 18).setValue(oldHist + log);

  if (extendNotes) {
    const oldNotes = ws.getRange(rowIdx, 13).getValue();
    ws.getRange(rowIdx, 13).setValue(oldNotes ? oldNotes + ' | Ppjg: ' + extendNotes : 'Ppjg: ' + extendNotes);
  }

  SpreadsheetApp.flush();
  return { status: 'success' };
}

function swapRentalUnit(id, newUnit, newPlate, notes, extraCost, payMethod, newPricePerDay) {
  assertWritable_();
  let ws = getSheet_(SHEETS.RENTALS);
  let rows = ws.getDataRange().getValues();
  let rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  
  if (rowIndex === -1) {
    ws = getSheet_(SHEETS.DEBT);
    rows = ws.getDataRange().getValues();
    rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  }

  if (rowIndex > -1) {
    const rowIdx    = rowIndex + 1;
    const todayStr  = safeFmtDate_(new Date());
    const cost      = Number(extraCost) || 0;
    const method    = payMethod || 'Cash';
    const oldPrice  = Number(rows[rowIndex][8]) || 0;  
    const newPrice  = Number(newPricePerDay) || oldPrice;
    const selisih   = newPrice - oldPrice;

    ws.getRange(rowIdx, 4).setValue(newUnit);
    ws.getRange(rowIdx, 5).setValue(newPlate);
    ws.getRange(rowIdx, 9).setValue(newPrice);

    if (cost > 0) {
      const oldTotal = Number(ws.getRange(rowIdx, 10).getValue()) || 0;
      ws.getRange(rowIdx, 10).setValue(oldTotal + cost);
    }

    const oldHist   = ws.getRange(rowIdx, 18).getValue();
    const cleanNotes = notes ? ` | Alasan: ${notes}` : '';
    let logDetail   = `\n[${todayStr}] Tukar Unit → ${newUnit} (${newPlate})`;

    if (selisih > 0) {
      logDetail += ` | Harga NAIK: Rp${oldPrice} → Rp${newPrice}/hari`;
      if (cost > 0) logDetail += ` | Biaya Tambahan: (+Rp${cost}) - ${method}`;
    } else if (selisih < 0) {
      logDetail += ` | Harga TURUN: Rp${oldPrice} → Rp${newPrice}/hari`;
    } else {
      logDetail += ` | Harga sama: Rp${newPrice}/hari`;
      if (cost > 0) logDetail += ` | Biaya Tambahan: (+Rp${cost}) - ${method}`;
    }

    logDetail += cleanNotes;
    ws.getRange(rowIdx, 18).setValue(oldHist + logDetail);
  }
  return { status: 'success' };
}

function changeRentType(id, newRentType, newEndDate, newPricePerDay, newTotalPrice, payMethod, kekurangan, nominalDibayar) {
  assertWritable_();
  let ws = getSheet_(SHEETS.RENTALS);
  let rows = ws.getDataRange().getValues();
  let rowIndex = rows.findIndex(r => String(r[0]) === String(id));

  if (rowIndex === -1) {
    ws = getSheet_(SHEETS.DEBT);
    rows = ws.getDataRange().getValues();
    rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  }

  if (rowIndex > -1) {
    const rowIdx    = rowIndex + 1;
    const todayStr  = safeFmtDate_(new Date());
    const oldPrice  = Number(rows[rowIndex][8]) || 0;
    const oldTotal  = Number(rows[rowIndex][9]) || 0;
    const newPrice  = Number(newPricePerDay) || oldPrice;
    const newTotal  = Number(newTotalPrice) || 0;
    const method    = payMethod || 'Cash';
    const kurang    = Number(kekurangan) || 0;

    ws.getRange(rowIdx, 7).setValue(newEndDate);
    ws.getRange(rowIdx, 9).setValue(newPrice);
    ws.getRange(rowIdx, 10).setValue(newTotal);
    ws.getRange(rowIdx, 33).setValue(kurang);

    const dibayarBaru   = Number(nominalDibayar) || 0;
    const oldTerbayar   = Number(ws.getRange(rowIdx, 32).getValue()) || 0;
    ws.getRange(rowIdx, 32).setValue(oldTerbayar + dibayarBaru);

    ws.getRange(rowIdx, 25).setValue(kurang > 0 ? 'Belum Lunas' : 'Lunas');

    const oldHist = ws.getRange(rowIdx, 18).getValue();
    let log = `\n[${todayStr}] Ubah Jenis Sewa → ${newRentType} | Tgl Selesai: ${newEndDate} | Harga/Hari: ${newPrice} | Total Baru: ${newTotal}`;

    if (dibayarBaru > 0) log += `\n[${todayStr}] (+Rp${dibayarBaru}) - ${method}`;
    if (kurang > 0) log += ` | Kekurangan/Hutang: Rp${kurang}`;

    ws.getRange(rowIdx, 18).setValue(oldHist + log);

    const oldNotes = ws.getRange(rowIdx, 13).getValue();
    ws.getRange(rowIdx, 13).setValue(
      oldNotes ? oldNotes + ` | Ubah ke: ${newRentType}` : `Ubah ke: ${newRentType}`
    );

    return { status: 'success', message: `Jenis sewa berhasil diubah ke ${newRentType}!` };
  }

  return { status: 'error', message: 'Data tidak ditemukan.' };
}

// --- FUNGSI KREDIT MOTOR ---
function addCreditData(form) {
  assertWritable_();
  const ws = getSheet_(SHEETS.CREDIT_DATA);
  const id = 'CRD-' + new Date().getTime();
  
  ws.appendRow([
    id, "'" + form.customerName, "'" + form.customerPhone, form.motorUnit, 
    Number(form.dpAmount) || 0, Number(form.tenor) || 0, Number(form.installmentAmount) || 0, 
    Number(form.totalCredit) || 0, form.startDate, form.dueDate, 'Aktif'
  ]);
  
  return { status: 'success', message: 'Data Kredit Baru berhasil disimpan ke Database!' };
}

function getCreditData() {
  const wsKredit = getSheet_(SHEETS.CREDIT_DATA);
  const wsBayar = getSheet_(SHEETS.CREDIT_PAYMENTS);
  
  let credits = [];
  let payments = [];
  
  if (wsBayar.getLastRow() > 1) {
    const dataBayar = wsBayar.getDataRange().getValues().slice(1);
    payments = dataBayar.map(r => ({
      id_angsuran: String(r[0]), id_kredit: String(r[1]), number: Number(r[2]),
      date: safeFmtDate_(r[3]), amount: Number(r[4]), method: String(r[5]), notes: String(r[6])
    }));
  }
  
  if (wsKredit.getLastRow() > 1) {
    const dataKredit = wsKredit.getDataRange().getValues().slice(1);
    credits = dataKredit.map((r) => {
      const idKredit = String(r[0]);
      const creditPayments = payments.filter(p => p.id_kredit === idKredit);
      
      return {
        id: idKredit, customerName: String(r[1]), customerPhone: String(r[2]),
        motorUnit: String(r[3]), dpAmount: Number(r[4]), tenor: Number(r[5]),
        installmentAmount: Number(r[6]), totalCredit: Number(r[7]),
        startDate: safeFmtDate_(r[8]), dueDate: safeFmtDate_(r[9]),
        status: String(r[10]), installments: creditPayments
      };
    }).reverse();
  }
  return credits;
}

function addCreditPayment(form) {
  assertWritable_();
  const wsBayar = getSheet_(SHEETS.CREDIT_PAYMENTS);
  const idAngsuran = 'PAY-' + new Date().getTime();
  
  wsBayar.appendRow([
    idAngsuran, form.creditId, Number(form.installmentNumber) || 1, form.paymentDate,
    Number(form.paymentAmount) || 0, form.paymentMethod, form.paymentNotes || ''
  ]);
  
  const wsKredit = getSheet_(SHEETS.CREDIT_DATA);
  const credits = wsKredit.getDataRange().getValues();
  for(let i = 1; i < credits.length; i++) {
     if(String(credits[i][0]) === String(form.creditId)) {
        const tenor = Number(credits[i][5]);
        if(Number(form.installmentNumber) >= tenor) {
           wsKredit.getRange(i + 1, 11).setValue('Lunas');
        }
        if(form.nextDueDate && form.nextDueDate.trim() !== '') {
           wsKredit.getRange(i + 1, 10).setValue(form.nextDueDate); 
        }
        break;
     }
  }
  return { status: 'success', message: 'Pembayaran Angsuran berhasil direkam!' };
}

// --- FUNGSI KASBON, PENGELUARAN & PETTY CASH ---
function addEmployeeLoan(form) { 
  assertWritable_();
  const ws = getSheet_(SHEETS.EMPLOYEE_LOANS); 
  const id = 'LN-' + new Date().getTime(); 
  const inputDate = form.date || new Date();
  ws.appendRow([id, inputDate, form.employeeName, form.amount, form.notes, 'Aktif']); 
  addPettyCashTransaction('Pengeluaran', `Kasbon: ${form.employeeName}`, 0, form.amount, inputDate); 
  return { status: 'success' }; 
}

function updateEmployeeLoan(id, data) {
  const ws = getSheet_(SHEETS.EMPLOYEE_LOANS);
  const rows = ws.getDataRange().getValues();
  const rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  if (rowIndex > -1) {
    const rowIdx = rowIndex + 1;
    const oldDate = rows[rowIndex][1];
    const oldName = rows[rowIndex][2];
    const oldAmount = rows[rowIndex][3];

    writeAuditLog_('Financial', 'UPDATE', 'Kasbon', id,
      JSON.stringify({ date: safeFmtDate_(oldDate), nama: oldName, amount: oldAmount }),
      JSON.stringify(data),
      'Edit Kasbon: ' + data.employeeName
    );

    ws.getRange(rowIdx, 2).setValue(data.date || new Date()); 
    ws.getRange(rowIdx, 3).setValue(data.employeeName);
    ws.getRange(rowIdx, 4).setValue(data.amount);
    ws.getRange(rowIdx, 5).setValue(data.notes);

    const pcWs = getSheet_(SHEETS.PETTY_CASH);
    const pcRows = pcWs.getDataRange().getValues();
    const oldDescMatch = `Kasbon: ${oldName}`;
    for (let i = pcRows.length - 1; i >= 1; i--) {
      if (pcRows[i][3] === oldDescMatch && Number(pcRows[i][5]) === Number(oldAmount)) {
        pcWs.getRange(i + 1, 2).setValue(data.date || new Date()); 
        pcWs.getRange(i + 1, 4).setValue(`Kasbon: ${data.employeeName}`);
        pcWs.getRange(i + 1, 6).setValue(data.amount);
        break;
      }
    }
    return { status: 'success', message: 'Kasbon berhasil direvisi.' };
  }
  return { status: 'error', message: 'Data kasbon tidak ditemukan.' };
}

function deleteEmployeeLoan(id) {
  const ws = getSheet_(SHEETS.EMPLOYEE_LOANS);
  const rows = ws.getDataRange().getValues();
  const rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  if (rowIndex > -1) {
    const oldDate = rows[rowIndex][1];
    const oldName = rows[rowIndex][2];
    const oldAmount = rows[rowIndex][3];

    writeAuditLog_('Financial', 'DELETE', 'Kasbon', id,
      JSON.stringify({ date: safeFmtDate_(oldDate), nama: oldName, amount: oldAmount }),
      '',
      'Hapus Kasbon: ' + oldName
    );

    ws.deleteRow(rowIndex + 1);

    const pcWs = getSheet_(SHEETS.PETTY_CASH);
    const pcRows = pcWs.getDataRange().getValues();
    const descMatch = `Kasbon: ${oldName}`;
    for (let i = pcRows.length - 1; i >= 1; i--) {
      if (pcRows[i][3] === descMatch && Number(pcRows[i][5]) === Number(oldAmount)) {
        pcWs.deleteRow(i + 1);
        break;
      }
    }
    return { status: 'success', message: 'Kasbon berhasil dihapus.' };
  }
  return { status: 'error', message: 'Data kasbon tidak ditemukan.' };
}

function getEmployeeLoans() { 
  const ws = getSheet_(SHEETS.EMPLOYEE_LOANS); 
  if (ws.getLastRow() < 2) return { loans: [], summary: [], totalOutstanding: 0 }; 
  const data = ws.getDataRange().getValues().slice(1); 
  let totalOutstanding = 0; 
  let summaryMap = {}; 
  const loans = data.map(r => { 
    const amount = Number(r[3]) || 0; 
    const employeeName = String(r[2]).trim(); 
    const status = String(r[5]).trim(); 
    if (status.toLowerCase() === 'aktif') { 
      totalOutstanding += amount; 
      summaryMap[employeeName] = (summaryMap[employeeName] || 0) + amount; 
    } 
    return { id: String(r[0]), date: safeFmtDate_(r[1]), employeeName: employeeName, amount: amount, notes: String(r[4]), status: status }; 
  }).reverse(); 
  const summary = Object.keys(summaryMap).map(name => ({ employeeName: name, totalAmount: summaryMap[name] })); 
  return { loans, summary, totalOutstanding }; 
}

function addExpense(form) { 
  assertWritable_();
  const ws = getSheet_(SHEETS.EXPENSES); 
  const id = 'EX-' + new Date().getTime(); 
  const inputDate = form.date || new Date();
  ws.appendRow([id, inputDate, form.category, form.description, form.amount]); 
  addPettyCashTransaction('Pengeluaran', `${form.category}: ${form.description}`, 0, form.amount, inputDate); 
  return { status: 'success' }; 
}

function updateExpense(id, data) {
  const ws = getSheet_(SHEETS.EXPENSES);
  const rows = ws.getDataRange().getValues();
  const rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  if (rowIndex > -1) {
    const rowIdx = rowIndex + 1;
    const oldDate = rows[rowIndex][1];
    const oldCategory = rows[rowIndex][2];
    const oldDesc = rows[rowIndex][3];
    const oldAmount = rows[rowIndex][4];

    writeAuditLog_('Financial', 'UPDATE', 'Pengeluaran', id,
      JSON.stringify({ date: safeFmtDate_(oldDate), category: oldCategory, desc: oldDesc, amount: oldAmount }),
      JSON.stringify(data),
      'Edit Pengeluaran: ' + data.description
    );

    ws.getRange(rowIdx, 2).setValue(data.date || new Date()); 
    ws.getRange(rowIdx, 3).setValue(data.category);
    ws.getRange(rowIdx, 4).setValue(data.description);
    ws.getRange(rowIdx, 5).setValue(data.amount);

    const pcWs = getSheet_(SHEETS.PETTY_CASH);
    const pcRows = pcWs.getDataRange().getValues();
    const descMatch = `${oldCategory}: ${oldDesc}`;
    for (let i = pcRows.length - 1; i >= 1; i--) {
      if (pcRows[i][3] === descMatch && Number(pcRows[i][5]) === Number(oldAmount)) {
        pcWs.getRange(i + 1, 2).setValue(data.date || new Date()); 
        pcWs.getRange(i + 1, 4).setValue(`${data.category}: ${data.description}`);
        pcWs.getRange(i + 1, 6).setValue(data.amount);
        break;
      }
    }
    return { status: 'success', message: 'Pengeluaran berhasil direvisi.' };
  }
  return { status: 'error', message: 'Data pengeluaran tidak ditemukan.' };
}

function deleteExpense(id) {
  const ws = getSheet_(SHEETS.EXPENSES);
  const rows = ws.getDataRange().getValues();
  const rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  if (rowIndex > -1) {
    const oldDate = rows[rowIndex][1];
    const oldCategory = rows[rowIndex][2];
    const oldDesc = rows[rowIndex][3];
    const oldAmount = rows[rowIndex][4];

    writeAuditLog_('Financial', 'DELETE', 'Pengeluaran', id,
      JSON.stringify({ date: safeFmtDate_(oldDate), category: oldCategory, desc: oldDesc, amount: oldAmount }),
      '',
      'Hapus Pengeluaran: ' + oldDesc
    );

    ws.deleteRow(rowIndex + 1);

    const pcWs = getSheet_(SHEETS.PETTY_CASH);
    const pcRows = pcWs.getDataRange().getValues();
    const descMatch = `${oldCategory}: ${oldDesc}`;
    for (let i = pcRows.length - 1; i >= 1; i--) {
      if (pcRows[i][3] === descMatch && Number(pcRows[i][5]) === Number(oldAmount)) {
        pcWs.deleteRow(i + 1);
        break;
      }
    }
    return { status: 'success', message: 'Pengeluaran berhasil dihapus.' };
  }
  return { status: 'error', message: 'Data pengeluaran tidak ditemukan.' };
}

function addPettyCashCapital(amount, description, dateInput) { 
  assertWritable_();
  return addPettyCashTransaction('Topup', description, amount, 0, dateInput); 
}

function addPettyCashTransaction(type, desc, inAmt, outAmt, dateInput) { 
  assertWritable_();
  const ws = getSheet_(SHEETS.PETTY_CASH); 
  const id = 'PC-' + new Date().getTime(); 
  const transactionDate = dateInput || new Date();
  
  ws.appendRow([id, transactionDate, type, desc, Number(inAmt) || 0, Number(outAmt) || 0]); 
  return { status: 'success' }; 
}

function getPettyCashData(filterMonth, filterYear) { 
  const ws = getSheet_(SHEETS.PETTY_CASH); 
  if (ws.getLastRow() < 2) return { 
    history: [], totalCapital: 0, currentBalance: 0,
    totalOut: 0, totalIn: 0
  }; 
  
  const data = ws.getDataRange().getValues().slice(1);
  const now = new Date();
  const targetMonth = (filterMonth !== undefined && filterMonth !== null) ? parseInt(filterMonth) : now.getMonth();
  const targetYear  = (filterYear  !== undefined && filterYear  !== null) ? parseInt(filterYear)  : now.getFullYear();

  let totalCapital = 0; 
  let totalOut     = 0;
  let totalIn      = 0;

  const history = data
    .map(r => {
      const rowDate  = r[1] instanceof Date ? r[1] : new Date(r[1]);
      const inAmt    = Number(r[4]) || 0; 
      const outAmt   = Number(r[5]) || 0;
      return { 
        id:          String(r[0]), 
        date:        safeFmtDate_(r[1]), 
        type:        String(r[2]), 
        description: String(r[3]), 
        in:          inAmt, 
        out:         outAmt,
        _month:      rowDate.getMonth(),
        _year:       rowDate.getFullYear()
      }; 
    })
    .filter(r => r._month === targetMonth && r._year === targetYear)
    .reverse();

  history.forEach(r => {
    if (r.type === 'Topup') totalCapital += r.in;
    totalIn  += r.in;
    totalOut += r.out;
  });

  return { 
    history:       history, 
    totalCapital:  totalCapital,        
    currentBalance: totalCapital - totalOut, 
    totalOut:      totalOut,
    totalIn:       totalIn,
    filterMonth:   targetMonth,
    filterYear:    targetYear
  }; 
}

function getFinanceData() { 
  const wsExp = getSheet_(SHEETS.EXPENSES); 
  const wsRent = getSheet_(SHEETS.RENTALS);
  const wsDebt = getSheet_(SHEETS.DEBT); 
  const todayStr = safeFmtDate_(new Date()); 
  
  let expenses = []; 
  let totalExpenses = 0; 
  if (wsExp.getLastRow() > 1) { 
    const dataExp = wsExp.getDataRange().getValues().slice(1); 
    expenses = dataExp.map(r => { 
      const amt = Number(r[4]) || 0; 
      totalExpenses += amt; 
      return { id: String(r[0]), date: safeFmtDate_(r[1]), category: String(r[2]), desc: String(r[3]), amount: amt }; 
    }).reverse(); 
  } 
  
  let rentData = [];
  if (wsRent.getLastRow() > 1) rentData = rentData.concat(wsRent.getDataRange().getValues().slice(1));
  if (wsDebt.getLastRow() > 1) rentData = rentData.concat(wsDebt.getDataRange().getValues().slice(1));

  let dailyCash = 0; 
  let dailyTransfer = 0; 
  if (rentData.length > 0) { 
    rentData.forEach(r => { 
      if (safeFmtDate_(r[1]) === todayStr) { 
        const amount = Number(r[9]) || 0; 
        const method = String(r[10] || 'Cash').toLowerCase(); 
        if (method.includes('cash') || method.includes('tunai')) dailyCash += amount; 
        else dailyTransfer += amount; 
      } 
    }); 
  } 
  return { expenses, totalExpenses, dailyRecon: { cash: dailyCash, transfer: dailyTransfer } }; 
}

// LOGIKA KEMBALIAN PELUNASAN HUTANG SEWA
function payDebt(id, paymentAmount, paymentMethod) {
  assertWritable_();
  let ws = getSheet_(SHEETS.DEBT);
  let rows = ws.getDataRange().getValues();
  let rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  
  if (rowIndex === -1) {
    ws = getSheet_(SHEETS.RENTALS);
    rows = ws.getDataRange().getValues();
    rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  }

  if (rowIndex === -1) {
    return { status: 'error', message: 'Data hutang tidak ditemukan.' };
  }

  const rowIdx       = rowIndex + 1;
  const todayStr     = safeFmtDate_(new Date());
  const method       = paymentMethod || 'Cash';
  
  const uangDiterima = Number(paymentAmount) || 0;
  const totalTagihan = Number(rows[rowIndex][9])  || 0;
  let   terbayar     = Number(rows[rowIndex][31]) || 0;
  const hutangLama   = Number(rows[rowIndex][32]) || 0; 

  if (uangDiterima < 0) {
    return { status: 'error', message: 'Jumlah bayar tidak boleh minus.' };
  }

  const oldHist = rows[rowIndex][17] || '';

  if (uangDiterima === 0) {
    ws.getRange(rowIdx, 32).setValue(totalTagihan); 
    ws.getRange(rowIdx, 33).setValue(0);            
    ws.getRange(rowIdx, 25).setValue('Lunas');

    ws.getRange(rowIdx, 18).setValue(
      oldHist + `\n[${todayStr}] Hutang Dibebaskan/Dihapuskan (Rp0) - Lunas`
    );
    return { status: 'success', message: 'Hutang berhasil dibebaskan (LUNAS).' };
  }

  // Hitung Kembalian
  let kembalian = 0;
  let uangMasukAktual = uangDiterima;

  if (uangDiterima > hutangLama) {
    kembalian = uangDiterima - hutangLama;
    uangMasukAktual = hutangLama; // Mencegah pendapatan tercatat lebih dari hutang
  }

  terbayar += uangMasukAktual;
  const sisaHutangBaru = hutangLama - uangMasukAktual;

  ws.getRange(rowIdx, 32).setValue(terbayar);
  ws.getRange(rowIdx, 33).setValue(Math.max(0, sisaHutangBaru));
  ws.getRange(rowIdx, 25).setValue(sisaHutangBaru <= 0 ? 'Lunas' : 'Sebagian');

  let log = `\n[${todayStr}] Pembayaran Hutang (+Rp${uangMasukAktual}) - ${method}`;
  if (kembalian > 0) log += ` | Kembalian: Rp${kembalian}`;
  
  ws.getRange(rowIdx, 18).setValue(oldHist + log);

  return { 
    status: 'success', 
    message: sisaHutangBaru <= 0 
      ? `Pembayaran berhasil. LUNAS!` + (kembalian > 0 ? `\n(Berikan Kembalian: Rp ${kembalian.toLocaleString('id-ID')})` : '')
      : `Pembayaran berhasil. Sisa hutang: Rp ${sisaHutangBaru.toLocaleString('id-ID')}`
  };
}

function getDebtDetail(id) {
  let ws = getSheet_(SHEETS.DEBT);
  let rows = ws.getDataRange().getValues();
  let rowIndex = rows.findIndex(r => String(r[0]) === String(id));

  if (rowIndex === -1) {
    ws = getSheet_(SHEETS.RENTALS);
    rows = ws.getDataRange().getValues();
    rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  }

  if (rowIndex === -1) {
    return { status: 'error', message: 'Data tidak ditemukan.' };
  }

  const row = rows[rowIndex];

  return {
    status: 'success',
    id:             String(row[0]),
    dateInput:      safeFmtDate_(row[1]),
    customer:       String(row[2]),
    unit:           String(row[3]),
    plate:          String(row[4]),
    start:          safeFmtDate_(row[5]),
    end:            safeFmtDate_(row[6]),
    totalTagihan:   Number(row[9])  || 0,
    paymentMethod:  String(row[10] || 'Cash'),
    paymentStatus:  String(row[24] || 'Belum Lunas'),
    terbayar:       Number(row[31]) || 0,
    shortage:       Number(row[32]) || 0,
    actionHistory:  String(row[17] || '-'),
    totalFine:      Number(row[22]) || 0,
    outOfTownFee:   Number(row[25]) || 0,
    notes:          String(row[12] || '-')
  };
}

function addOtherIncome(form) {
  assertWritable_();
  const ws = getSheet_(SHEETS.RENTALS);
  const id = 'INC-' + new Date().getTime();
  const todayStr = safeFmtDate_(new Date());
  const amount = Number(form.amount) || 0;
  const method = form.paymentMethod || 'Cash';
  const desc = form.description || 'Pendapatan Lainnya';

  ws.appendRow([
    id, new Date(), form.customerName || 'Pendapatan Lainnya', form.motorUnit || desc, '-',
    todayStr, todayStr, '12:00', 0, amount,
    method, 'Pendapatan', desc, '',
    '-', '-', '-', `[${todayStr}] ${desc} (+Rp${amount}) - ${method}`,
    "", "", 0, 0, 0, "", "Lunas", 0, 0,
    0, 0, 0, 0, amount
  ]);

  return { status: 'success', message: 'Pendapatan berhasil disimpan!' };
}

function getDebtRentals() {
  const wsDebt = getSheet_(SHEETS.DEBT);
  if (wsDebt.getLastRow() < 2) return [];
  return wsDebt.getDataRange().getValues().slice(1).map(row => ({
    id: String(row[0]),
    dateInput: safeFmtDate_(row[1]),
    customer: String(row[2]),
    unit: String(row[3]),
    plate: String(row[4]),
    start: safeFmtDate_(row[5]),
    end: safeFmtDate_(row[6]),
    endTime: String(row[7]),
    pricePerDay: row[8],
    price: row[9],
    paymentMethod: String(row[10] || 'Cash'),
    rentalStatus: String(row[11]),
    notes: String(row[12]),
    guarantee: String(row[13]),
    phones: String(row[14]),
    actionHistory: String(row[17] || ''),
    actualReturnDate: safeFmtDate_(row[18]),
    paymentStatus: row[24] || 'Belum Lunas',
    terbayar: row[31] || 0,
    shortage: row[32] || 0
  })).reverse();
}

// 1. FUNGSI PEMBUAT LOG (Otomatis membuat sheet jika belum ada)
function writeAuditLog__(role, action, module, dataId, oldData, newData, description) {
  let ws = SpreadsheetApp.getActiveSpreadsheet().getSheet_ByName('Audit_Log');
  if (!ws) {
    ws = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Audit_Log');
    ws.appendRow(['Timestamp', 'User Role', 'Aksi', 'Modul', 'Data ID', 'Data Lama', 'Data Baru', 'Keterangan']);
    ws.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#E0E0E0');
  }
  // Hapus pembuatan ID 'AUD-...', langsung masukkan Date di index/kolom pertama
  ws.appendRow([new Date(), role, action, module, dataId, oldData, newData, description]);
  SpreadsheetApp.flush(); // Paksa simpan ke database detik itu juga
}

// 2. FUNGSI PENARIK LOG
function getAuditLogs() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ws = ss.getSheet_ByName('Audit_Log');
    
    // SENSOR 1: Jika sheet benar-benar tidak terbaca
    if (!ws) {
      return [{ timestamp: '-', role: 'SYSTEM', action: 'INFO', module: 'Database', dataId: '-', oldData: '-', newData: '-', description: 'Sheet Audit_Log tidak ditemukan di file ini.' }];
    }
    
    // SENSOR 2: Jika sheet ada tapi sistem menganggapnya kosong
    var lastRow = ws.getLastRow();
    if (lastRow < 2) {
      return [{ timestamp: '-', role: 'SYSTEM', action: 'INFO', module: 'Database', dataId: '-', oldData: '-', newData: '-', description: 'Sheet Audit_Log terbaca kosong (Jumlah baris: ' + lastRow + ').' }];
    }
    
    // Tarik data dengan metode aman (tanpa toLocaleTimeString)
    var data = ws.getDataRange().getValues().slice(1);
    var logs = [];
    
    for (var i = 0; i < data.length; i++) {
      var r = data[i];
      var timeString = "";
      
      if (r[0] instanceof Date) {
         var y = r[0].getFullYear();
         var m = ("0" + (r[0].getMonth() + 1)).slice(-2);
         var d = ("0" + r[0].getDate()).slice(-2);
         var hh = ("0" + r[0].getHours()).slice(-2);
         var mm = ("0" + r[0].getMinutes()).slice(-2);
         timeString = y + "-" + m + "-" + d + " " + hh + ":" + mm;
      } else {
         timeString = String(r[0]);
      }

      logs.push({
        id: String(r[4] || '-'),
        timestamp: timeString,
        role: String(r[1] || '-'),
        action: String(r[2] || '-'),
        module: String(r[3] || '-'),
        dataId: String(r[4] || '-'),
        oldData: String(r[5] || '-'),
        newData: String(r[6] || '-'),
        description: String(r[7] || '-')
      });
    }
    
    return logs.reverse();
    
  } catch(e) {
    // SENSOR 3: Jika ada kode yang macet
    return [{ timestamp: '-', role: 'SYSTEM', action: 'ERROR', module: 'Backend', dataId: '-', oldData: '-', newData: '-', description: 'Sistem macet: ' + e.toString() }];
  }
}

// 3. FUNGSI EDIT PENGELUARAN (Dilengkapi Log)
function updateExpense(id, data) {
  const ws = getSheet_(SHEETS.EXPENSES);
  const rows = ws.getDataRange().getValues();
  const rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  if (rowIndex > -1) {
    const rowIdx = rowIndex + 1;
    const oldDate = rows[rowIndex][1];
    const oldCategory = rows[rowIndex][2];
    const oldDesc = rows[rowIndex][3];
    const oldAmount = rows[rowIndex][4];

    // Rekam Log
    writeAuditLog_('Financial', 'UPDATE', 'Pengeluaran', id,
      JSON.stringify({ date: safeFmtDate_(oldDate), category: oldCategory, desc: oldDesc, amount: oldAmount }),
      JSON.stringify(data),
      'Edit Pengeluaran: ' + data.description
    );

    ws.getRange(rowIdx, 2).setValue(data.date || new Date()); 
    ws.getRange(rowIdx, 3).setValue(data.category);
    ws.getRange(rowIdx, 4).setValue(data.description);
    ws.getRange(rowIdx, 5).setValue(data.amount);

    const pcWs = getSheet_(SHEETS.PETTY_CASH);
    const pcRows = pcWs.getDataRange().getValues();
    const descMatch = `${oldCategory}: ${oldDesc}`;
    for (let i = pcRows.length - 1; i >= 1; i--) {
      if (pcRows[i][3] === descMatch && Number(pcRows[i][5]) === Number(oldAmount)) {
        pcWs.getRange(i + 1, 2).setValue(data.date || new Date()); 
        pcWs.getRange(i + 1, 4).setValue(`${data.category}: ${data.description}`);
        pcWs.getRange(i + 1, 6).setValue(data.amount);
        break;
      }
    }
    SpreadsheetApp.flush();
    return { status: 'success', message: 'Pengeluaran berhasil direvisi.' };
  }
  return { status: 'error', message: 'Data pengeluaran tidak ditemukan.' };
}

// 4. FUNGSI HAPUS PENGELUARAN (Dilengkapi Log)
function deleteExpense(id) {
  const ws = getSheet_(SHEETS.EXPENSES);
  const rows = ws.getDataRange().getValues();
  const rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  if (rowIndex > -1) {
    const oldDate = rows[rowIndex][1];
    const oldCategory = rows[rowIndex][2];
    const oldDesc = rows[rowIndex][3];
    const oldAmount = rows[rowIndex][4];

    // Rekam Log
    writeAuditLog_('Financial', 'DELETE', 'Pengeluaran', id,
      JSON.stringify({ date: safeFmtDate_(oldDate), category: oldCategory, desc: oldDesc, amount: oldAmount }),
      '',
      'Hapus Pengeluaran: ' + oldDesc
    );

    ws.deleteRow(rowIndex + 1);

    const pcWs = getSheet_(SHEETS.PETTY_CASH);
    const pcRows = pcWs.getDataRange().getValues();
    const descMatch = `${oldCategory}: ${oldDesc}`;
    for (let i = pcRows.length - 1; i >= 1; i--) {
      if (pcRows[i][3] === descMatch && Number(pcRows[i][5]) === Number(oldAmount)) {
        pcWs.deleteRow(i + 1);
        break;
      }
    }
    SpreadsheetApp.flush();
    return { status: 'success', message: 'Pengeluaran berhasil dihapus.' };
  }
  return { status: 'error', message: 'Data pengeluaran tidak ditemukan.' };
}

// 5. FUNGSI EDIT KASBON (Dilengkapi Log)
function updateEmployeeLoan(id, data) {
  const ws = getSheet_(SHEETS.EMPLOYEE_LOANS);
  const rows = ws.getDataRange().getValues();
  const rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  if (rowIndex > -1) {
    const rowIdx = rowIndex + 1;
    const oldDate = rows[rowIndex][1];
    const oldName = rows[rowIndex][2];
    const oldAmount = rows[rowIndex][3];

    // Rekam Log
    writeAuditLog_('Financial', 'UPDATE', 'Kasbon', id,
      JSON.stringify({ date: safeFmtDate_(oldDate), nama: oldName, amount: oldAmount }),
      JSON.stringify(data),
      'Edit Kasbon: ' + data.employeeName
    );

    ws.getRange(rowIdx, 2).setValue(data.date || new Date()); 
    ws.getRange(rowIdx, 3).setValue(data.employeeName);
    ws.getRange(rowIdx, 4).setValue(data.amount);
    ws.getRange(rowIdx, 5).setValue(data.notes);

    const pcWs = getSheet_(SHEETS.PETTY_CASH);
    const pcRows = pcWs.getDataRange().getValues();
    const oldDescMatch = `Kasbon: ${oldName}`;
    for (let i = pcRows.length - 1; i >= 1; i--) {
      if (pcRows[i][3] === oldDescMatch && Number(pcRows[i][5]) === Number(oldAmount)) {
        pcWs.getRange(i + 1, 2).setValue(data.date || new Date()); 
        pcWs.getRange(i + 1, 4).setValue(`Kasbon: ${data.employeeName}`);
        pcWs.getRange(i + 1, 6).setValue(data.amount);
        break;
      }
    }
    SpreadsheetApp.flush();
    return { status: 'success', message: 'Kasbon berhasil direvisi.' };
  }
  return { status: 'error', message: 'Data kasbon tidak ditemukan.' };
}

// 6. FUNGSI HAPUS KASBON (Dilengkapi Log)
function deleteEmployeeLoan(id) {
  const ws = getSheet_(SHEETS.EMPLOYEE_LOANS);
  const rows = ws.getDataRange().getValues();
  const rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  if (rowIndex > -1) {
    const oldDate = rows[rowIndex][1];
    const oldName = rows[rowIndex][2];
    const oldAmount = rows[rowIndex][3];

    // Rekam Log
    writeAuditLog_('Financial', 'DELETE', 'Kasbon', id,
      JSON.stringify({ date: safeFmtDate_(oldDate), nama: oldName, amount: oldAmount }),
      '',
      'Hapus Kasbon: ' + oldName
    );

    ws.deleteRow(rowIndex + 1);

    const pcWs = getSheet_(SHEETS.PETTY_CASH);
    const pcRows = pcWs.getDataRange().getValues();
    const descMatch = `Kasbon: ${oldName}`;
    for (let i = pcRows.length - 1; i >= 1; i--) {
      if (pcRows[i][3] === descMatch && Number(pcRows[i][5]) === Number(oldAmount)) {
        pcWs.deleteRow(i + 1);
        break;
      }
    }
    SpreadsheetApp.flush();
    return { status: 'success', message: 'Kasbon berhasil dihapus.' };
  }
  return { status: 'error', message: 'Data kasbon tidak ditemukan.' };
}

function fetchAuditLogsFromDB() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ws = ss.getSheet_ByName('Audit_Log');
    
    // Jika sheet tidak ada
    if (!ws) {
      return [{ timestamp: '-', role: 'SYSTEM', action: 'INFO', module: 'Database', oldData: '-', newData: '-', description: 'Sheet Audit_Log tidak ditemukan di file ini.' }];
    }
    
    // Jika sheet kosong (hanya ada baris header)
    var lastRow = ws.getLastRow();
    if (lastRow < 2) {
      return [{ 
        timestamp: '-', role: 'SYSTEM', action: 'INFO', module: 'Database', 
        oldData: '-', newData: '-', 
        description: '✅ KONEKSI SUKSES: Tabel saat ini kosong. Silakan coba edit/hapus 1 pengeluaran sekarang untuk melihat log muncul di sini.' 
      }];
    }
    
    // Tarik data dengan metode aman
    var data = ws.getDataRange().getValues().slice(1);
    var logs = [];
    
    for (var i = 0; i < data.length; i++) {
      var r = data[i];
      var timeString = "";
      
      if (r[0] instanceof Date) {
         var d = r[0];
         var y = d.getFullYear();
         var m = ("0" + (d.getMonth() + 1)).slice(-2);
         var day = ("0" + d.getDate()).slice(-2);
         var hh = ("0" + d.getHours()).slice(-2);
         var mm = ("0" + d.getMinutes()).slice(-2);
         timeString = y + "-" + m + "-" + day + " " + hh + ":" + mm;
      } else {
         timeString = String(r[0]);
      }

      logs.push({
        id: String(r[4] || '-'),
        timestamp: timeString,
        role: String(r[1] || '-'),
        action: String(r[2] || '-'),
        module: String(r[3] || '-'),
        dataId: String(r[4] || '-'),
        oldData: String(r[5] || '-'),
        newData: String(r[6] || '-'),
        description: String(r[7] || '-')
      });
    }
    
    return logs.reverse();
    
  } catch(e) {
    return [{ timestamp: '-', role: 'SYSTEM', action: 'ERROR', module: 'Backend', oldData: '-', newData: '-', description: 'Sistem macet: ' + e.toString() }];
  }
}

function updateRental(id, data) {
  assertWritable_();
  const ws = getSheet_(SHEETS.RENTALS);
  let rows = ws.getDataRange().getValues();
  let rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  let targetWs = ws;
  
  if (rowIndex === -1) {
    targetWs = getSheet_(SHEETS.DEBT);
    rows = targetWs.getDataRange().getValues();
    rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  }

  if (rowIndex > -1) {
    const rowIdx = rowIndex + 1;
    const oldData = rows[rowIndex];
    
    let oldHist = String(oldData[17] || '');
    if (oldHist.includes('Input Awal')) {
        oldHist = oldHist.replace(/(\[.*?\] Input Awal) \(\+Rp\d+\) - [^\n]*/, `$1 (+Rp${data.totalPrice}) - ${data.paymentMethod}`);
    }
    
    writeAuditLog_('Admin', 'UPDATE', 'Data Sewa', id,
      JSON.stringify({ customer: oldData[2], unit: oldData[3], plat: oldData[4], harga: oldData[9] }),
      JSON.stringify({ customer: data.customerName, unit: data.motorUnit, plat: data.plateNumber, harga: data.totalPrice }),
      'Edit Sewa: ' + data.customerName
    );

    targetWs.getRange(rowIdx, 3).setValue("'" + data.customerName);
    targetWs.getRange(rowIdx, 4).setValue(data.motorUnit);
    targetWs.getRange(rowIdx, 5).setValue(data.plateNumber);
    targetWs.getRange(rowIdx, 6).setValue(data.startDate);
    targetWs.getRange(rowIdx, 7).setValue(data.endDate);
    targetWs.getRange(rowIdx, 8).setValue(data.endTime);
    targetWs.getRange(rowIdx, 9).setValue(data.pricePerDay);
    targetWs.getRange(rowIdx, 10).setValue(data.totalPrice);
    targetWs.getRange(rowIdx, 11).setValue(data.paymentMethod);
    targetWs.getRange(rowIdx, 14).setValue(data.guarantee);
    targetWs.getRange(rowIdx, 15).setValue("'" + data.renterPhone);
    targetWs.getRange(rowIdx, 16).setValue("'" + data.phone1);
    targetWs.getRange(rowIdx, 17).setValue("'" + data.phone2);
    targetWs.getRange(rowIdx, 18).setValue(oldHist);
    targetWs.getRange(rowIdx, 26).setValue(data.outOfTownFee);
    targetWs.getRange(rowIdx, 28).setValue(data.helmAwal);
    targetWs.getRange(rowIdx, 29).setValue(data.bensinAwal);
    targetWs.getRange(rowIdx, 34).setValue(data.linkMarketing);
    targetWs.getRange(rowIdx, 36).setValue(data.idNumber);
    targetWs.getRange(rowIdx, 37).setValue(data.address);
    targetWs.getRange(rowIdx, 38).setValue(data.renterStatus);
    targetWs.getRange(rowIdx, 39).setValue(data.gender);
    targetWs.getRange(rowIdx, 40).setValue(data.birthPlaceDate);
    targetWs.getRange(rowIdx, 41).setValue(data.village);
    targetWs.getRange(rowIdx, 42).setValue(data.subdistrict);
    targetWs.getRange(rowIdx, 43).setValue(data.city);
    targetWs.getRange(rowIdx, 44).setValue(data.nationality);
    targetWs.getRange(rowIdx, 45).setValue(data.domicile);
    targetWs.getRange(rowIdx, 46).setValue(data.rentType);
    targetWs.getRange(rowIdx, 47).setValue(data.fcStnk);
    targetWs.getRange(rowIdx, 48).setValue(data.spion);
    targetWs.getRange(rowIdx, 49).setValue(data.coverKnalpot);

    SpreadsheetApp.flush();

    return { status: 'success', message: 'Data sewa berhasil diperbarui secara sistem!' };
  }
  return { status: 'error', message: 'Data sewa lama tidak ditemukan di server.' };
}

function quickEditRental(id, data) {
  assertWritable_();
  let ws = getSheet_(SHEETS.RENTALS);
  let rows = ws.getDataRange().getValues();
  let rowIndex = rows.findIndex(r => String(r[0]) === String(id));

  // Cari juga di sheet Hutang Sewa jika tidak ketemu di Data_Sewa
  if (rowIndex === -1) {
    ws = getSheet_(SHEETS.DEBT);
    rows = ws.getDataRange().getValues();
    rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  }

  if (rowIndex === -1) {
    return { status: 'error', message: 'Data tidak ditemukan di server.' };
  }

  const rowIdx = rowIndex + 1;
  const oldData = rows[rowIndex];

  writeAuditLog_('Admin', 'UPDATE', 'Quick Edit Monitoring', id,
    JSON.stringify({
      unit: oldData[3],
      plat: oldData[4],
      tglSelesai: safeFmtDate_(oldData[6]),
      jamKembali: oldData[7],
      hargaHari: oldData[8],
      kekurangan: oldData[32],
      kelebihan: oldData[34],
      keterangan: oldData[12]
    }),
    JSON.stringify(data),
    'Quick Edit: ' + (oldData[2] || '')
  );

  ws.getRange(rowIdx, 4).setValue(data.motorUnit);                  // Unit Motor
  ws.getRange(rowIdx, 5).setValue(data.plateNumber);                // Plat Nomor
  ws.getRange(rowIdx, 7).setValue(data.endDate);                    // Tgl Selesai
  ws.getRange(rowIdx, 8).setValue(data.endTime);                    // Jam Selesai/Kembali
  ws.getRange(rowIdx, 9).setValue(Number(data.pricePerDay) || 0);   // Harga/Hari
  ws.getRange(rowIdx, 13).setValue(data.notes || '');               // Keterangan
  ws.getRange(rowIdx, 33).setValue(Number(data.shortage) || 0);     // Kekurangan Hutang
  ws.getRange(rowIdx, 35).setValue(Number(data.overpayment) || 0);  // Kelebihan Pembayaran

  SpreadsheetApp.flush();

  return { status: 'success', message: 'Data berhasil diperbarui!' };
}

function quickEditOverdue(id, data) {
  assertWritable_();
  let ws = getSheet_(SHEETS.RENTALS);
  let rows = ws.getDataRange().getValues();
  let rowIndex = rows.findIndex(r => String(r[0]) === String(id));

  // Cari juga di sheet Hutang Sewa jika tidak ketemu di Data_Sewa
  if (rowIndex === -1) {
    ws = getSheet_(SHEETS.DEBT);
    rows = ws.getDataRange().getValues();
    rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  }

  if (rowIndex === -1) {
    return { status: 'error', message: 'Data tidak ditemukan di server.' };
  }

  const rowIdx = rowIndex + 1;
  const oldData = rows[rowIndex];

  writeAuditLog_('Admin', 'UPDATE', 'Quick Edit Peringatan Telat', id,
    JSON.stringify({
      unit: oldData[3],
      jatuhTempo: safeFmtDate_(oldData[6]),
      hargaHari: oldData[8],
      kekurangan: oldData[32],
      kelebihan: oldData[34],
      keterangan: oldData[12]
    }),
    JSON.stringify(data),
    'Quick Edit Telat: ' + (oldData[2] || '')
  );

  ws.getRange(rowIdx, 4).setValue(data.motorUnit);                  // Unit Motor
  ws.getRange(rowIdx, 7).setValue(data.endDate);                    // Jatuh Tempo (Tgl Selesai)
  ws.getRange(rowIdx, 9).setValue(Number(data.pricePerDay) || 0);   // Harga/Hari
  ws.getRange(rowIdx, 13).setValue(data.notes || '');               // Keterangan
  ws.getRange(rowIdx, 33).setValue(Number(data.shortage) || 0);     // Kekurangan/Hutang
  ws.getRange(rowIdx, 35).setValue(Number(data.overpayment) || 0);  // Kelebihan

  SpreadsheetApp.flush();

  return { status: 'success', message: 'Data keterlambatan berhasil diperbarui!' };
}

function deleteRental(id) {
  assertWritable_();
  const wsRent = getSheet_(SHEETS.RENTALS);
  let rows = wsRent.getDataRange().getValues();
  let rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  
  if (rowIndex > -1) {
    writeAuditLog_('Admin', 'DELETE', 'Data Sewa', id,
      JSON.stringify({ customer: rows[rowIndex][2], unit: rows[rowIndex][3] }), '', 'Hapus Permanen: ' + rows[rowIndex][2]
    );
    wsRent.deleteRow(rowIndex + 1);
    return { status: 'success', message: 'Data sewa sukses dihapus dari database!' };
  }
  
  const wsDebt = getSheet_(SHEETS.DEBT);
  rows = wsDebt.getDataRange().getValues();
  rowIndex = rows.findIndex(r => String(r[0]) === String(id));
  
  if (rowIndex > -1) {
    writeAuditLog_('Admin', 'DELETE', 'Data Sewa', id,
      JSON.stringify({ customer: rows[rowIndex][2], unit: rows[rowIndex][3] }), '', 'Hapus Permanen (Di Hutang): ' + rows[rowIndex][2]
    );
    wsDebt.deleteRow(rowIndex + 1);
    return { status: 'success', message: 'Data sewa sukses dihapus dari database!' };
  }

  return { status: 'error', message: 'Data yang mau dihapus tidak ada di database.' };
}

function updateTransactionMethod(rentalId, oldLine, newMethod) {
  assertWritable_();
  try {
    const NAMA_TAB_SHEET = "Data_Sewa"; 
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheet_ByName(NAMA_TAB_SHEET);
    
    if (!sheet) {
        return { 
            status: "error", 
            message: `Tab bernama "${NAMA_TAB_SHEET}" tidak ditemukan!` 
        };
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const idCol = headers.findIndex(h => String(h).trim().toUpperCase() === "ID");
    const historyCol = headers.findIndex(h => String(h).includes("Riwayat") || String(h).includes("History"));
    const methodCol = headers.findIndex(h => String(h).toLowerCase().includes("metode") || String(h).includes("paymentMethod"));
    
    if (idCol === -1 || historyCol === -1) {
        return { status: "error", message: "Kolom ID atau Log Riwayat tidak ditemukan di baris pertama Sheets." };
    }
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][idCol] === rentalId) {
        let history = String(data[i][historyCol] || "");
        
        if (history.includes(oldLine)) {
            let newLine = oldLine;
            
            // --- PERBAIKAN REGEX: Mencari kata CASH/TRANSFER/TF meskipun tanpa tanda kurung ---
            if (/\b(CASH|TRANSFER|TF)\b/i.test(newLine)) {
                // Ganti semua kata pencarian dengan metode yang baru
                newLine = newLine.replace(/\b(CASH|TRANSFER|TF)\b/gi, newMethod.toUpperCase());
            } else {
                // Jika benar-benar tidak ada keterangan metode, tambahkan di belakang
                newLine = newLine + ` - ${newMethod.toUpperCase()}`;
            }
            
            // Pengaman ganda: Jika ada teks berulang seperti "TRANSFER (TRANSFER)", rapikan menjadi satu saja
            newLine = newLine.replace(/TRANSFER\s*\(TRANSFER\)/gi, 'TRANSFER');
            newLine = newLine.replace(/CASH\s*\(CASH\)/gi, 'CASH');
            
            // Timpa teks riwayat di memori
            history = history.replace(oldLine, newLine);
            
            // Simpan ke Google Sheet
            sheet.getRange(i + 1, historyCol + 1).setValue(history);
            
            // Jika yang di-klik adalah transaksi "INPUT AWAL" atau "SEWA BARU",
            // ganti juga kolom metode pembayaran utama (jika kolomnya ada)
            if (methodCol !== -1 && (oldLine.toUpperCase().includes("INPUT AWAL") || oldLine.toUpperCase().includes("SEWA BARU"))) {
                sheet.getRange(i + 1, methodCol + 1).setValue(newMethod);
            }
            
            return { status: "success", message: "Metode pembayaran berhasil diubah!" };
        } else {
            return { status: "error", message: "Log transaksi tidak ditemukan. Sistem mungkin sudah berubah." };
        }
      }
    }
    return { status: "error", message: "Data rental tidak ditemukan." };
  } catch (e) {
    return { status: "error", message: e.message };
  }
}

// ==========================================
// DEVELOPER MODE / MAINTENANCE SWITCH
// ==========================================

function setMaintenanceMode(isActive, errorMessage, errorType) {
  assertWritable_();
  try {
    const props = PropertiesService.getScriptProperties();
    props.setProperty('SYSTEM_DOWN', isActive ? 'TRUE' : 'FALSE');
    props.setProperty('SYSTEM_ERROR_MSG', errorMessage || 'Sistem sedang dalam perbaikan rutin.');
    props.setProperty('SYSTEM_ERROR_TYPE', errorType || '503'); 
    return { status: 'success', message: 'Status sistem berhasil diubah!' };
  } catch (e) {
    return { status: 'error', message: e.message };
  }
}

function checkSystemStatus() {
  const props = PropertiesService.getScriptProperties();
  return {
    isDown: props.getProperty('SYSTEM_DOWN') === 'TRUE',
    message: props.getProperty('SYSTEM_ERROR_MSG') || 'Sistem dalam perbaikan.',
    type: props.getProperty('SYSTEM_ERROR_TYPE') || '503' 
  };
}

function matikanModeGangguan() {
  assertWritable_();
  PropertiesService.getScriptProperties().setProperty('SYSTEM_DOWN', 'FALSE');
}

// ==========================================
// LICENSE & SUBSCRIPTION MANAGEMENT
// ==========================================

/**
 * Fungsi untuk mengambil konfigurasi lisensi dari Sheet Konfigurasi
 * @return {Object} Status lisensi dan detail konfigurasi
 */
function getLicenseConfig() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let ws = ss.getSheet_ByName(SHEETS.CONFIG);
    
    // Jika sheet Konfigurasi belum ada, buat dengan data default (Trial 14 hari)
    if (!ws) {
      ws = ss.insertSheet(SHEETS.CONFIG);
      ws.appendRow(['Setting Name', 'Setting Value', 'Description']);
      ws.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#E0E0E0');
      
      // Default: Trial 14 hari dari sekarang
      const today = new Date();
      const trialEnd = new Date(today);
      trialEnd.setDate(trialEnd.getDate() + 14);
      
      ws.appendRow(['LICENSE_STATUS', 'trial', 'Status lisensi: trial/active/expired/suspended']);
      ws.appendRow(['LICENSE_START_DATE', safeFmtDate_(today), 'Tanggal aktivasi lisensi']);
      ws.appendRow(['LICENSE_END_DATE', '', 'Tanggal kedaluwarsa lisensi (kosong jika trial)']);
      ws.appendRow(['TRIAL_END_DATE', safeFmtDate_(trialEnd), 'Tanggal akhir masa trial']);
      ws.appendRow(['LICENSE_TYPE', 'trial', 'Jenis lisensi: trial/paid/enterprise']);
      ws.appendRow(['COMPANY_NAME', 'Demo Rental Company', 'Nama perusahaan']);
      ws.appendRow(['ADMIN_CONTACT', '08123456789', 'Kontak admin untuk perpanjangan']);
      
      SpreadsheetApp.flush();
    }
    
    const data = ws.getDataRange().getValues();
    const config = {};
    
    // Parse data konfigurasi
    for (let i = 1; i < data.length; i++) {
      const key = String(data[i][0]).trim();
      const value = String(data[i][1]).trim();
      if (key) config[key] = value;
    }
    
    // Validasi status berdasarkan tanggal
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let actualStatus = config.LICENSE_STATUS || 'trial';
    let gracePeriodDays = 0;
    let daysSinceExpired = 0;
    
    // Cek apakah trial sudah expired
    if (actualStatus === 'trial' && config.TRIAL_END_DATE) {
      const trialEnd = new Date(config.TRIAL_END_DATE);
      trialEnd.setHours(0, 0, 0, 0);
      
      if (today > trialEnd) {
        daysSinceExpired = Math.ceil((today - trialEnd) / (1000 * 60 * 60 * 24));
        
        if (daysSinceExpired <= 14) {
          // State 2: Suspended (Grace Period 14 hari)
          actualStatus = 'suspended';
          gracePeriodDays = 14 - daysSinceExpired;
          updateLicenseStatus('suspended');
        } else {
          // State 3: Terminated (Lebih dari 14 hari)
          actualStatus = 'terminated';
          updateLicenseStatus('terminated');
        }
      }
    }
    
    // Cek apakah lisensi berbayar sudah expired
    if (actualStatus === 'active' && config.LICENSE_END_DATE) {
      const licenseEnd = new Date(config.LICENSE_END_DATE);
      licenseEnd.setHours(0, 0, 0, 0);
      
      if (today > licenseEnd) {
        daysSinceExpired = Math.ceil((today - licenseEnd) / (1000 * 60 * 60 * 24));
        
        if (daysSinceExpired <= 14) {
          // State 2: Suspended (Grace Period 14 hari)
          actualStatus = 'suspended';
          gracePeriodDays = 14 - daysSinceExpired;
          updateLicenseStatus('suspended');
        } else {
          // State 3: Terminated (Lebih dari 14 hari)
          actualStatus = 'terminated';
          updateLicenseStatus('terminated');
        }
      }
    }
    
    // Hitung sisa hari
    let daysRemaining = 0;
    if (actualStatus === 'trial' && config.TRIAL_END_DATE) {
      const trialEnd = new Date(config.TRIAL_END_DATE);
      trialEnd.setHours(0, 0, 0, 0);
      daysRemaining = Math.ceil((trialEnd - today) / (1000 * 60 * 60 * 24));
    } else if (actualStatus === 'active' && config.LICENSE_END_DATE) {
      const licenseEnd = new Date(config.LICENSE_END_DATE);
      licenseEnd.setHours(0, 0, 0, 0);
      daysRemaining = Math.ceil((licenseEnd - today) / (1000 * 60 * 60 * 24));
    }
    
    return {
      status: 'success',
      licenseStatus: actualStatus,
      licenseType: config.LICENSE_TYPE || 'trial',
      startDate: config.LICENSE_START_DATE || '',
      endDate: config.LICENSE_END_DATE || '',
      trialEndDate: config.TRIAL_END_DATE || '',
      companyName: config.COMPANY_NAME || 'Demo Rental Company',
      adminContact: config.ADMIN_CONTACT || '08123456789',
      daysRemaining: daysRemaining,
      daysSinceExpired: daysSinceExpired,
      gracePeriodDays: gracePeriodDays,
      isExpired: actualStatus === 'expired' || actualStatus === 'suspended' || actualStatus === 'terminated',
      isSuspended: actualStatus === 'suspended',
      isTerminated: actualStatus === 'terminated',
      isTrial: actualStatus === 'trial',
      isActive: actualStatus === 'active'
    };
    
  } catch (e) {
    return {
      status: 'error',
      message: 'Gagal membaca konfigurasi lisensi: ' + e.toString(),
      licenseStatus: 'error',
      isExpired: false
    };
  }
}

/**
 * Fungsi untuk mengecek status lisensi (simplified version untuk quick check)
 * @return {Object} Status lisensi sederhana
 */
function checkLicenseStatus() {
  const config = getLicenseConfig();
  return {
    isValid: !config.isExpired && config.status === 'success',
    status: config.licenseStatus,
    daysRemaining: config.daysRemaining,
    message: config.isExpired ? 'Lisensi Anda telah berakhir' : 'Lisensi aktif'
  };
}

/**
 * Fungsi untuk update status lisensi
 * @param {string} newStatus - Status baru: trial/active/expired/suspended
 * @return {Object} Hasil operasi
 */
function updateLicenseStatus(newStatus) {
  assertWritable_();
  try {
    const ws = SpreadsheetApp.getActiveSpreadsheet().getSheet_ByName(SHEETS.CONFIG);
    if (!ws) {
      return { status: 'error', message: 'Sheet Konfigurasi tidak ditemukan' };
    }
    
    const data = ws.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === 'LICENSE_STATUS') {
        ws.getRange(i + 1, 2).setValue(newStatus);
        SpreadsheetApp.flush();
        return { status: 'success', message: 'Status lisensi berhasil diupdate ke: ' + newStatus };
      }
    }
    
    // Jika tidak ada row LICENSE_STATUS, tambahkan
    ws.appendRow(['LICENSE_STATUS', newStatus, 'Status lisensi']);
    SpreadsheetApp.flush();
    return { status: 'success', message: 'Status lisensi berhasil dibuat: ' + newStatus };
    
  } catch (e) {
    return { status: 'error', message: e.toString() };
  }
}

/**
 * Fungsi untuk aktivasi lisensi dengan tanggal baru
 * @param {string} newEndDate - Tanggal akhir lisensi baru (format YYYY-MM-DD)
 * @param {string} licenseType - Jenis lisensi: paid/enterprise
 * @return {Object} Hasil operasi
 */
function activateLicense(newEndDate, licenseType) {
  assertWritable_();
  try {
    const ws = SpreadsheetApp.getActiveSpreadsheet().getSheet_ByName(SHEETS.CONFIG);
    if (!ws) {
      return { status: 'error', message: 'Sheet Konfigurasi tidak ditemukan' };
    }
    
    const today = safeFmtDate_(new Date());
    const data = ws.getDataRange().getValues();
    
    // Update atau tambahkan konfigurasi
    const updates = {
      'LICENSE_STATUS': 'active',
      'LICENSE_END_DATE': newEndDate,
      'LICENSE_TYPE': licenseType || 'paid',
      'LICENSE_START_DATE': today
    };
    
    for (let key in updates) {
      let found = false;
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]).trim() === key) {
          ws.getRange(i + 1, 2).setValue(updates[key]);
          found = true;
          break;
        }
      }
      if (!found) {
        ws.appendRow([key, updates[key], 'Auto-generated']);
      }
    }
    
    SpreadsheetApp.flush();
    
    writeAuditLog_('System', 'ACTIVATE', 'License', 'LICENSE-001', 
      '', 
      JSON.stringify({ endDate: newEndDate, type: licenseType }), 
      'Aktivasi lisensi hingga ' + newEndDate
    );
    
    return { 
      status: 'success', 
      message: 'Lisensi berhasil diaktifkan hingga ' + newEndDate 
    };
    
  } catch (e) {
    return { status: 'error', message: e.toString() };
  }
}

/**
 * Fungsi untuk perpanjang masa trial
 * @param {number} additionalDays - Jumlah hari tambahan
 * @return {Object} Hasil operasi
 */
/**
 * Seed demo data into spreadsheet
 * Run this manually from Apps Script editor: seedDemoData()
 * This will populate sheets with realistic fake data for demo purposes
 */
function seedDemoData() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Seed Demo Data',
    'This will ADD demo data to your spreadsheet. Continue?',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) {
    ui.alert('Operation cancelled');
    return;
  }
  
  try {
    // Generate demo rentals
    seedDemoRentals_();
    
    // Generate demo expenses
    seedDemoExpenses_();
    
    // Generate demo employee loans
    seedDemoEmployeeLoans_();
    
    // Generate demo petty cash
    seedDemoPettyCash_();
    
    // Generate demo credits
    seedDemoCredits_();
    
    ui.alert('Success', 'Demo data has been seeded successfully!', ui.ButtonSet.OK);
  } catch (error) {
    ui.alert('Error', 'Failed to seed data: ' + error.toString(), ui.ButtonSet.OK);
  }
}

/**
 * Seed demo rental data
 * @private
 */
function seedDemoRentals_() {
  const ws = getSheet_(SHEETS.RENTALS);
  const today = new Date();
  
  const customers = ['Ahmad Rizki', 'Budi Santoso', 'Citra Dewi', 'Deni Prasetyo', 'Eka Putri'];
  const units = ['Honda Beat', 'Yamaha Mio', 'Honda Vario', 'Yamaha NMAX', 'Honda PCX'];
  const plates = ['N 1234 AB', 'N 5678 CD', 'N 9012 EF', 'N 3456 GH', 'N 7890 IJ'];
  
  for (let i = 0; i < 5; i++) {
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - i);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 3);
    
    const pricePerDay = 50000 + (i * 10000);
    const totalPrice = pricePerDay * 3;
    
    ws.appendRow([
      'R-DEMO-' + Date.now() + '-' + i,
      startDate,
      "'" + customers[i],
      units[i],
      plates[i],
      safeFmtDate_(startDate),
      safeFmtDate_(endDate),
      '12:00',
      pricePerDay,
      totalPrice,
      i % 2 === 0 ? 'CASH' : 'TRANSFER',
      'Aktif',
      'Demo data',
      'KTP',
      "'081234567" + (890 + i),
      "'-",
      "'-",
      `[${safeFmtDate_(startDate)}] Input Awal (+Rp${totalPrice}) - ${i % 2 === 0 ? 'CASH' : 'TRANSFER'}`,
      '', '', 0, 0, 0, '', 'Lunas', 0, 0,
      2, 3, 0, 0, totalPrice, 0, '-', 0,
      '3573' + (1234567890 + i), 'Jl. Demo St. No. ' + (i + 1), 'Mahasiswa',
      i % 2 === 0 ? 'Laki-laki' : 'Perempuan', 'Malang, 1990-01-' + (10 + i),
      'Ketawanggede', 'Lowokwaru', 'Kota Malang', 'Indonesia',
      'Jl. Demo St. No. ' + (i + 1), 'Harian', 'Ada', 'Lengkap', 'Ada'
    ]);
  }
}

/**
 * Seed demo expenses
 * @private
 */
function seedDemoExpenses_() {
  const ws = getSheet_(SHEETS.EXPENSES);
  const today = new Date();
  
  const categories = ['Operasional', 'Rental', 'Lainnya'];
  const descriptions = [
    'Bensin operasional', 'Service motor', 'Listrik & air',
    'Ganti oli', 'Pulsa & internet'
  ];
  
  for (let i = 0; i < 10; i++) {
    const expenseDate = new Date(today);
    expenseDate.setDate(today.getDate() - i);
    
    ws.appendRow([
      'EX-DEMO-' + Date.now() + '-' + i,
      expenseDate,
      categories[i % categories.length],
      descriptions[i % descriptions.length],
      (i + 1) * 10000
    ]);
  }
}

/**
 * Seed demo employee loans
 * @private
 */
function seedDemoEmployeeLoans_() {
  const ws = getSheet_(SHEETS.EMPLOYEE_LOANS);
  const today = new Date();
  
  const employees = ['Agus', 'Bambang', 'Candra'];
  
  for (let i = 0; i < 3; i++) {
    const loanDate = new Date(today);
    loanDate.setDate(today.getDate() - (i * 10));
    
    ws.appendRow([
      'LN-DEMO-' + Date.now() + '-' + i,
      loanDate,
      employees[i],
      (i + 1) * 100000,
      'Kasbon demo',
      'Aktif'
    ]);
  }
}

/**
 * Seed demo petty cash
 * @private
 */
function seedDemoPettyCash_() {
  const ws = getSheet_(SHEETS.PETTY_CASH);
  const today = new Date();
  
  // Capital
  ws.appendRow([
    'PC-DEMO-CAPITAL',
    today,
    'Topup',
    'Modal awal demo',
    5000000,
    0
  ]);
  
  // Transactions
  for (let i = 1; i <= 5; i++) {
    const txDate = new Date(today);
    txDate.setDate(today.getDate() - i);
    
    ws.appendRow([
      'PC-DEMO-' + Date.now() + '-' + i,
      txDate,
      'Pengeluaran',
      'Pengeluaran operasional demo',
      0,
      i * 50000
    ]);
  }
}

/**
 * Seed demo credits
 * @private
 */
function seedDemoCredits_() {
  const ws = getSheet_(SHEETS.CREDIT_DATA);
  const today = new Date();
  
  const customers = ['Umar Bakri', 'Vina Sari'];
  
  for (let i = 0; i < 2; i++) {
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - (6 - i));
    
    ws.appendRow([
      'CRD-DEMO-' + Date.now() + '-' + i,
      "'" + customers[i],
      "'081234" + (56000 + i),
      'Honda PCX Demo ' + (i + 1),
      2000000,
      12,
      500000,
      8000000,
      safeFmtDate_(startDate),
      safeFmtDate_(new Date(startDate.setMonth(startDate.getMonth() + 1))),
      'Aktif'
    ]);
  }
}

/**
 * Clear all demo data (use with caution!)
 * This will delete ALL rows except headers
 */
function clearAllDemoData() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Clear All Data',
    'WARNING: This will DELETE ALL data from all sheets! This cannot be undone. Continue?',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) {
    ui.alert('Operation cancelled');
    return;
  }
  
  const doubleConfirm = ui.alert(
    'Final Confirmation',
    'Are you ABSOLUTELY SURE? All data will be permanently deleted!',
    ui.ButtonSet.YES_NO
  );
  
  if (doubleConfirm !== ui.Button.YES) {
    ui.alert('Operation cancelled');
    return;
  }
  
  try {
    const sheetNames = [
      SHEETS.RENTALS,
      SHEETS.EXPENSES,
      SHEETS.PETTY_CASH,
      SHEETS.EMPLOYEE_LOANS,
      SHEETS.CREDIT_DATA,
      SHEETS.CREDIT_PAYMENTS,
      SHEETS.DEBT,
      SHEETS.AUDIT_LOG
    ];
    
    sheetNames.forEach(sheetName => {
      const ws = getSheet_(sheetName);
      const lastRow = ws.getLastRow();
      if (lastRow > 1) {
        ws.deleteRows(2, lastRow - 1);
      }
    });
    
    ui.alert('Success', 'All data has been cleared!', ui.ButtonSet.OK);
  } catch (error) {
    ui.alert('Error', 'Failed to clear data: ' + error.toString(), ui.ButtonSet.OK);
  }
}

function extendTrial(additionalDays) {
  assertWritable_();
  try {
    const config = getLicenseConfig();
    if (config.licenseStatus !== 'trial' && config.licenseStatus !== 'expired') {
      return { status: 'error', message: 'Fungsi ini hanya untuk perpanjangan trial' };
    }
    
    const ws = SpreadsheetApp.getActiveSpreadsheet().getSheet_ByName(SHEETS.CONFIG);
    const today = new Date();
    const newTrialEnd = new Date(today);
    newTrialEnd.setDate(newTrialEnd.getDate() + additionalDays);
    
    const data = ws.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === 'TRIAL_END_DATE') {
        ws.getRange(i + 1, 2).setValue(safeFmtDate_(newTrialEnd));
      }
      if (String(data[i][0]).trim() === 'LICENSE_STATUS') {
        ws.getRange(i + 1, 2).setValue('trial');
      }
    }
    
    SpreadsheetApp.flush();
    
    writeAuditLog_('System', 'EXTEND', 'Trial', 'TRIAL-001', 
      '', 
      JSON.stringify({ days: additionalDays, newEnd: safeFmtDate_(newTrialEnd) }), 
      'Perpanjangan trial ' + additionalDays + ' hari'
    );
    
    return { 
      status: 'success', 
      message: 'Masa trial berhasil diperpanjang hingga ' + safeFmtDate_(newTrialEnd) 
    };
    
  } catch (e) {
    return { status: 'error', message: e.toString() };
  }
}