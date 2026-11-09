/**
 * MOCK DATA FOR RMS DEMO
 * =======================
 * Data fiktif 100% untuk demo portfolio
 * Tanggal dibuat dinamis relatif terhadap hari ini
 */

(function() {
    'use strict';

    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================

    function formatDate(date) {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    function addMonths(date, months) {
        const result = new Date(date);
        result.setMonth(result.getMonth() + months);
        return result;
    }

    function formatCurrency(amount) {
        return amount.toLocaleString('id-ID');
    }

    // ==========================================
    // DATE GENERATOR (Relatif terhadap hari ini)
    // ==========================================

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ==========================================
    // MOCK RENTAL DATA
    // ==========================================

    function generateMockRentals() {
        const customers = [
            'Ahmad Rizki', 'Budi Santoso', 'Citra Dewi', 'Deni Prasetyo', 'Eka Putri',
            'Fajar Ramadhan', 'Gina Safitri', 'Hendra Wijaya', 'Indah Permata', 'Joko Susilo',
            'Kartika Sari', 'Lukman Hakim', 'Maya Anggraini', 'Novi Rahayu', 'Oscar Pratama'
        ];

        const units = [
            'Honda Beat', 'Yamaha Mio', 'Honda Vario', 'Yamaha NMAX', 'Honda PCX',
            'Yamaha Aerox', 'Honda Scoopy', 'Suzuki Nex', 'Honda Genio', 'Yamaha Fino'
        ];

        const plates = [
            'N 1234 AB', 'N 5678 CD', 'N 9012 EF', 'N 3456 GH', 'N 7890 IJ',
            'N 2345 KL', 'N 6789 MN', 'N 0123 OP', 'N 4567 QR', 'N 8901 ST',
            'N 2468 UV', 'N 1357 WX', 'N 9753 YZ', 'N 1111 AA', 'N 2222 BB'
        ];

        const phones = [
            '081234567890', '082345678901', '083456789012', '085567890123', '087678901234',
            '081111222333', '082222333444', '083333444555', '085444555666', '087555666777'
        ];

        const addresses = [
            'Jl. Soekarno Hatta No. 15, Malang', 'Jl. Dinoyo Raya No. 88, Malang',
            'Jl. Veteran No. 22, Malang', 'Jl. Semeru No. 45, Malang',
            'Jl. Borobudur No. 12, Malang', 'Jl. Ijen Boulevard No. 67, Malang'
        ];

        const rentals = [];
        let idCounter = 1000;

        // 1. Sewa HARI INI (3 transaksi)
        for (let i = 0; i < 3; i++) {
            const startDate = today;
            const endDate = addDays(today, 3 + i);
            const pricePerDay = 50000 + (i * 10000);
            const days = 3 + i;
            const totalPrice = pricePerDay * days;
            const customerIdx = i;

            rentals.push({
                id: `R-${idCounter++}`,
                dateInput: formatDate(today),
                customer: customers[customerIdx],
                unit: units[i],
                plate: plates[i],
                start: formatDate(startDate),
                end: formatDate(endDate),
                endTime: '12:00',
                pricePerDay: pricePerDay,
                price: totalPrice,
                paymentMethod: i % 2 === 0 ? 'CASH' : 'TRANSFER',
                rentalStatus: 'Aktif',
                notes: `Sewa harian ${days} hari`,
                guarantee: 'KTP',
                phones: phones[i],
                phone1: phones[i],
                phone2: phones[i + 5],
                actionHistory: `[${formatDate(today)}] Input Awal (+Rp${totalPrice}) - ${i % 2 === 0 ? 'CASH' : 'TRANSFER'}`,
                actualReturnDate: '',
                condition: '-',
                totalFine: 0,
                paymentStatus: 'Lunas',
                outOfTownFee: 0,
                outOfTownPenalty: 0,
                helmAwal: 2,
                bensinAwal: 3,
                helmKembali: 0,
                bensinKembali: 0,
                terbayar: totalPrice,
                shortage: 0,
                linkMarketing: '-',
                overpayment: 0,
                idNumber: `3573${1234567890 + i}`,
                address: addresses[i % addresses.length],
                renterStatus: 'Mahasiswa',
                gender: i % 2 === 0 ? 'Laki-laki' : 'Perempuan',
                birthPlaceDate: `Malang, ${1990 + i}-01-${10 + i}`,
                village: 'Ketawanggede',
                subdistrict: 'Lowokwaru',
                city: 'Kota Malang',
                nationality: 'Indonesia',
                domicile: addresses[i % addresses.length],
                rentType: 'Harian',
                fcStnk: 'Ada',
                spion: 'Lengkap',
                coverKnalpot: 'Ada'
            });
        }

        // 2. Sewa JATUH TEMPO HARI INI (2 transaksi)
        for (let i = 0; i < 2; i++) {
            const startDate = addDays(today, -3 - i);
            const endDate = today;
            const pricePerDay = 55000;
            const totalPrice = pricePerDay * (3 + i);
            const customerIdx = 3 + i;

            rentals.push({
                id: `R-${idCounter++}`,
                dateInput: formatDate(startDate),
                customer: customers[customerIdx],
                unit: units[3 + i],
                plate: plates[3 + i],
                start: formatDate(startDate),
                end: formatDate(endDate),
                endTime: '12:00',
                pricePerDay: pricePerDay,
                price: totalPrice,
                paymentMethod: 'CASH',
                rentalStatus: 'Aktif',
                notes: 'Jatuh tempo hari ini',
                guarantee: 'KTP',
                phones: phones[3 + i],
                phone1: phones[3 + i],
                phone2: '-',
                actionHistory: `[${formatDate(startDate)}] Input Awal (+Rp${totalPrice}) - CASH`,
                actualReturnDate: '',
                condition: '-',
                totalFine: 0,
                paymentStatus: 'Lunas',
                outOfTownFee: 0,
                outOfTownPenalty: 0,
                helmAwal: 2,
                bensinAwal: 2,
                helmKembali: 0,
                bensinKembali: 0,
                terbayar: totalPrice,
                shortage: 0,
                linkMarketing: '-',
                overpayment: 0,
                idNumber: `3573${2234567890 + i}`,
                address: addresses[(3 + i) % addresses.length],
                renterStatus: 'Karyawan',
                gender: 'Laki-laki',
                birthPlaceDate: `Surabaya, ${1988 + i}-05-${15 + i}`,
                village: 'Ketawanggede',
                subdistrict: 'Lowokwaru',
                city: 'Kota Malang',
                nationality: 'Indonesia',
                domicile: addresses[(3 + i) % addresses.length],
                rentType: 'Harian',
                fcStnk: 'Ada',
                spion: 'Lengkap',
                coverKnalpot: 'Ada'
            });
        }

        // 3. Sewa TELAT 1-2 HARI (3 transaksi)
        for (let i = 0; i < 3; i++) {
            const daysLate = 1 + i;
            const startDate = addDays(today, -5 - i);
            const endDate = addDays(today, -daysLate);
            const pricePerDay = 60000;
            const totalPrice = pricePerDay * 5;
            const customerIdx = 5 + i;

            rentals.push({
                id: `R-${idCounter++}`,
                dateInput: formatDate(startDate),
                customer: customers[customerIdx],
                unit: units[5 + i],
                plate: plates[5 + i],
                start: formatDate(startDate),
                end: formatDate(endDate),
                endTime: '14:00',
                pricePerDay: pricePerDay,
                price: totalPrice,
                paymentMethod: 'TRANSFER',
                rentalStatus: 'Aktif',
                notes: `Telat ${daysLate} hari`,
                guarantee: 'SIM',
                phones: phones[5 + i],
                phone1: phones[5 + i],
                phone2: '-',
                actionHistory: `[${formatDate(startDate)}] Input Awal (+Rp${totalPrice}) - TRANSFER`,
                actualReturnDate: '',
                condition: '-',
                totalFine: 0,
                paymentStatus: 'Lunas',
                outOfTownFee: 0,
                outOfTownPenalty: 0,
                helmAwal: 2,
                bensinAwal: 3,
                helmKembali: 0,
                bensinKembali: 0,
                terbayar: totalPrice,
                shortage: 0,
                linkMarketing: '-',
                overpayment: 0,
                idNumber: `3573${3234567890 + i}`,
                address: addresses[(5 + i) % addresses.length],
                renterStatus: 'Wiraswasta',
                gender: i % 2 === 0 ? 'Perempuan' : 'Laki-laki',
                birthPlaceDate: `Malang, ${1992 + i}-08-${20 + i}`,
                village: 'Ketawanggede',
                subdistrict: 'Lowokwaru',
                city: 'Kota Malang',
                nationality: 'Indonesia',
                domicile: addresses[(5 + i) % addresses.length],
                rentType: 'Harian',
                fcStnk: 'Ada',
                spion: 'Lengkap',
                coverKnalpot: 'Ada'
            });
        }

        // 4. Sewa TELAT 3+ HARI (2 transaksi - KRITIS)
        for (let i = 0; i < 2; i++) {
            const daysLate = 3 + (i * 2);
            const startDate = addDays(today, -10 - i);
            const endDate = addDays(today, -daysLate);
            const pricePerDay = 55000;
            const totalPrice = pricePerDay * 7;
            const customerIdx = 8 + i;

            rentals.push({
                id: `R-${idCounter++}`,
                dateInput: formatDate(startDate),
                customer: customers[customerIdx],
                unit: units[8 + i],
                plate: plates[8 + i],
                start: formatDate(startDate),
                end: formatDate(endDate),
                endTime: '10:00',
                pricePerDay: pricePerDay,
                price: totalPrice,
                paymentMethod: 'CASH',
                rentalStatus: 'Aktif',
                notes: `KRITIS: Telat ${daysLate} hari, segera hubungi!`,
                guarantee: 'KTP',
                phones: phones[8 + i],
                phone1: phones[8 + i],
                phone2: phones[0],
                actionHistory: `[${formatDate(startDate)}] Input Awal (+Rp${totalPrice}) - CASH`,
                actualReturnDate: '',
                condition: '-',
                totalFine: 0,
                paymentStatus: 'Lunas',
                outOfTownFee: 0,
                outOfTownPenalty: 0,
                helmAwal: 2,
                bensinAwal: 2,
                helmKembali: 0,
                bensinKembali: 0,
                terbayar: totalPrice,
                shortage: 0,
                linkMarketing: '-',
                overpayment: 0,
                idNumber: `3573${4234567890 + i}`,
                address: addresses[(8 + i) % addresses.length],
                renterStatus: 'Mahasiswa',
                gender: 'Laki-laki',
                birthPlaceDate: `Batu, ${1995 + i}-03-${10 + i}`,
                village: 'Ketawanggede',
                subdistrict: 'Lowokwaru',
                city: 'Kota Malang',
                nationality: 'Indonesia',
                domicile: addresses[(8 + i) % addresses.length],
                rentType: 'Harian',
                fcStnk: 'Ada',
                spion: 'Lengkap',
                coverKnalpot: 'Ada'
            });
        }

        // 5. Sewa SELESAI bulan ini (5 transaksi)
        for (let i = 0; i < 5; i++) {
            const startDate = addDays(today, -15 - (i * 2));
            const endDate = addDays(startDate, 3);
            const actualReturn = addDays(endDate, i > 2 ? 1 : 0); // Beberapa telat 1 hari
            const pricePerDay = 50000 + (i * 5000);
            const totalPrice = pricePerDay * 3;
            const lateFine = i > 2 ? 30000 : 0;
            const customerIdx = 10 + i;

            rentals.push({
                id: `R-${idCounter++}`,
                dateInput: formatDate(startDate),
                customer: customers[customerIdx],
                unit: units[i % units.length],
                plate: plates[10 + i],
                start: formatDate(startDate),
                end: formatDate(endDate),
                endTime: '12:00',
                pricePerDay: pricePerDay,
                price: totalPrice + lateFine,
                paymentMethod: i % 2 === 0 ? 'CASH' : 'TRANSFER',
                rentalStatus: 'Selesai',
                notes: lateFine > 0 ? 'Telat 1 hari, kena denda' : 'Kembali tepat waktu',
                guarantee: 'KTP',
                phones: phones[i % phones.length],
                phone1: phones[i % phones.length],
                phone2: '-',
                actionHistory: `[${formatDate(startDate)}] Input Awal (+Rp${totalPrice}) - ${i % 2 === 0 ? 'CASH' : 'TRANSFER'}\n[${formatDate(actualReturn)}] Kembali - Helm: 2, Bensin: 2 strip.\n[${formatDate(actualReturn)}] Selesai: ${lateFine > 0 ? `Denda/Biaya Tambahan (+Rp${lateFine}) - CASH` : 'Tepat Waktu / Lunas'}`,
                actualReturnDate: formatDate(actualReturn),
                condition: 'Baik',
                totalFine: lateFine,
                paymentStatus: 'Lunas',
                outOfTownFee: 0,
                outOfTownPenalty: lateFine,
                helmAwal: 2,
                bensinAwal: 3,
                helmKembali: 2,
                bensinKembali: 2,
                terbayar: totalPrice + lateFine,
                shortage: 0,
                linkMarketing: '-',
                overpayment: 0,
                idNumber: `3573${5234567890 + i}`,
                address: addresses[i % addresses.length],
                renterStatus: 'Karyawan',
                gender: i % 2 === 0 ? 'Laki-laki' : 'Perempuan',
                birthPlaceDate: `Malang, ${1990 + i}-06-${10 + i}`,
                village: 'Ketawanggede',
                subdistrict: 'Lowokwaru',
                city: 'Kota Malang',
                nationality: 'Indonesia',
                domicile: addresses[i % addresses.length],
                rentType: 'Harian',
                fcStnk: 'Ada',
                spion: 'Lengkap',
                coverKnalpot: 'Ada'
            });
        }

        return rentals;
    }

    // ==========================================
    // MOCK HUTANG SEWA DATA
    // ==========================================

    function generateMockDebtRentals() {
        const customers = ['Rina Wati', 'Sandi Kurnia', 'Tono Subagyo'];
        const debts = [];
        let idCounter = 2000;

        for (let i = 0; i < 3; i++) {
            const startDate = addDays(today, -30 - (i * 10));
            const endDate = addDays(startDate, 7);
            const pricePerDay = 60000;
            const totalDebt = pricePerDay * 10 + 50000; // Termasuk denda
            const paid = i === 0 ? totalDebt : (i === 1 ? totalDebt / 2 : 0);
            const shortage = totalDebt - paid;

            debts.push({
                id: `R-${idCounter++}`,
                dateInput: formatDate(startDate),
                customer: customers[i],
                unit: `Yamaha NMAX ${i + 1}`,
                plate: `N 888${i} ZZ`,
                start: formatDate(startDate),
                end: formatDate(endDate),
                endTime: '12:00',
                pricePerDay: pricePerDay,
                price: totalDebt,
                paymentMethod: 'CASH',
                rentalStatus: 'Selesai',
                notes: 'Dipindah ke hutang sewa',
                guarantee: 'KTP',
                phones: `08123456${7000 + i}`,
                actionHistory: `[${formatDate(startDate)}] Input Awal (+Rp${pricePerDay * 7}) - CASH\n[${formatDate(addDays(endDate, 3))}] Unit Kembali (Stop Tunggakan) -> Pindah ke Hutang Sewa. Tagihan Final: Rp${totalDebt}${paid > 0 ? `\n[${formatDate(addDays(endDate, 5))}] Pembayaran Hutang (+Rp${paid}) - CASH` : ''}`,
                actualReturnDate: formatDate(addDays(endDate, 3)),
                paymentStatus: i === 0 ? 'Lunas' : (i === 1 ? 'Sebagian' : 'Belum Lunas'),
                terbayar: paid,
                shortage: shortage
            });
        }

        return debts;
    }

    // ==========================================
    // MOCK FINANCE DATA
    // ==========================================

    function generateMockExpenses() {
        const categories = ['Operasional', 'Rental', 'Lainnya'];
        const descriptions = [
            'Bensin operasional', 'Service motor unit 1', 'Listrik & air',
            'Ganti oli 3 unit', 'Pulsa & internet', 'Servis berkala',
            'Ban baru Honda Beat', 'Promosi online', 'ATK kantor'
        ];

        const expenses = [];
        let idCounter = 3000;

        // Generate 30 hari terakhir
        for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
            const numExpenses = Math.floor(Math.random() * 3) + 1; // 1-3 pengeluaran per hari
            
            for (let i = 0; i < numExpenses; i++) {
                const expenseDate = addDays(today, -dayOffset);
                const category = categories[Math.floor(Math.random() * categories.length)];
                const desc = descriptions[Math.floor(Math.random() * descriptions.length)];
                const amount = (Math.floor(Math.random() * 10) + 1) * 10000; // 10k-100k

                expenses.push({
                    id: `EX-${idCounter++}`,
                    date: formatDate(expenseDate),
                    category: category,
                    desc: desc,
                    amount: amount
                });
            }
        }

        return expenses;
    }

    // ==========================================
    // MOCK EMPLOYEE LOANS
    // ==========================================

    function generateMockEmployeeLoans() {
        const employees = ['Agus', 'Bambang', 'Candra', 'Dimas'];
        const loans = [];
        let idCounter = 4000;

        for (let i = 0; i < 5; i++) {
            const loanDate = addDays(today, -Math.floor(Math.random() * 60));
            const employee = employees[Math.floor(Math.random() * employees.length)];
            const amount = (Math.floor(Math.random() * 10) + 1) * 50000; // 50k-500k

            loans.push({
                id: `LN-${idCounter++}`,
                date: formatDate(loanDate),
                employeeName: employee,
                amount: amount,
                notes: `Kasbon ${employee}`,
                status: i < 3 ? 'Aktif' : 'Lunas'
            });
        }

        return loans;
    }

    // ==========================================
    // MOCK PETTY CASH
    // ==========================================

    function generateMockPettyCash(filterMonth, filterYear) {
        const now = new Date();
        const targetMonth = (filterMonth !== undefined && filterMonth !== null) ? parseInt(filterMonth) : now.getMonth();
        const targetYear = (filterYear !== undefined && filterYear !== null) ? parseInt(filterYear) : now.getFullYear();

        const history = [];
        let idCounter = 5000;
        let totalCapital = 0;
        let totalIn = 0;
        let totalOut = 0;

        // Capital awal bulan
        const startOfMonth = new Date(targetYear, targetMonth, 1);
        history.push({
            id: `PC-${idCounter++}`,
            date: formatDate(startOfMonth),
            type: 'Topup',
            description: 'Modal awal bulan',
            in: 5000000,
            out: 0,
            _month: targetMonth,
            _year: targetYear
        });

        totalCapital += 5000000;
        totalIn += 5000000;

        // Generate transaksi selama bulan itu
        const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const txDate = new Date(targetYear, targetMonth, day);
            
            // Skip future dates
            if (txDate > today) continue;

            // Random 1-2 pengeluaran per hari
            const numTx = Math.floor(Math.random() * 2) + 1;
            
            for (let i = 0; i < numTx; i++) {
                const outAmount = (Math.floor(Math.random() * 10) + 1) * 10000;
                
                history.push({
                    id: `PC-${idCounter++}`,
                    date: formatDate(txDate),
                    type: 'Pengeluaran',
                    description: `Pengeluaran operasional hari ke-${day}`,
                    in: 0,
                    out: outAmount,
                    _month: targetMonth,
                    _year: targetYear
                });

                totalOut += outAmount;
            }
        }

        return {
            history: history.reverse(),
            totalCapital: totalCapital,
            currentBalance: totalCapital - totalOut,
            totalOut: totalOut,
            totalIn: totalIn,
            filterMonth: targetMonth,
            filterYear: targetYear
        };
    }

    // ==========================================
    // MOCK CREDIT DATA
    // ==========================================

    function generateMockCreditData() {
        const customers = ['Umar Bakri', 'Vina Sari', 'Wawan Setiawan'];
        const credits = [];
        let idCounter = 6000;

        for (let i = 0; i < 3; i++) {
            const startDate = addMonths(today, -(6 - i));
            const tenor = 12;
            const installmentAmount = 500000 + (i * 100000);
            const dpAmount = 2000000;
            const totalCredit = (installmentAmount * tenor) + dpAmount;
            const installmentsPaid = Math.min(6 + i, tenor);

            const installments = [];
            for (let j = 1; j <= installmentsPaid; j++) {
                const payDate = addMonths(startDate, j);
                installments.push({
                    id_angsuran: `PAY-${idCounter + j}`,
                    id_kredit: `CRD-${idCounter}`,
                    number: j,
                    date: formatDate(payDate),
                    amount: installmentAmount,
                    method: j % 2 === 0 ? 'TRANSFER' : 'CASH',
                    notes: `Angsuran ke-${j}`
                });
            }

            credits.push({
                id: `CRD-${idCounter}`,
                customerName: customers[i],
                customerPhone: `081234${56000 + i}`,
                motorUnit: `Honda PCX ${i + 1}`,
                dpAmount: dpAmount,
                tenor: tenor,
                installmentAmount: installmentAmount,
                totalCredit: totalCredit,
                startDate: formatDate(startDate),
                dueDate: formatDate(addMonths(startDate, installmentsPaid + 1)),
                status: installmentsPaid >= tenor ? 'Lunas' : 'Aktif',
                installments: installments
            });

            idCounter += 100;
        }

        return credits;
    }

    // ==========================================
    // MOCK AUDIT LOGS
    // ==========================================

    function generateMockAuditLogs() {
        const roles = ['Admin', 'Financial', 'Management'];
        const actions = ['CREATE', 'UPDATE', 'DELETE'];
        const modules = ['Data Sewa', 'Pengeluaran', 'Kasbon', 'Petty Cash'];
        
        const logs = [];
        let idCounter = 7000;

        for (let i = 0; i < 20; i++) {
            const logDate = addDays(today, -i);
            const logTime = new Date(logDate);
            logTime.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60));

            logs.push({
                id: `LOG-${idCounter++}`,
                timestamp: formatDate(logTime) + ' ' + logTime.toTimeString().substring(0, 5),
                role: roles[Math.floor(Math.random() * roles.length)],
                action: actions[Math.floor(Math.random() * actions.length)],
                module: modules[Math.floor(Math.random() * modules.length)],
                dataId: `ID-${Math.floor(Math.random() * 1000)}`,
                oldData: i % 3 === 0 ? '-' : JSON.stringify({ sample: 'old data' }),
                newData: i % 3 === 1 ? '-' : JSON.stringify({ sample: 'new data' }),
                description: `Log aktivitas ke-${i + 1}`
            });
        }

        return logs;
    }

    // ==========================================
    // INSTALL MOCK DATA KE WINDOW
    // ==========================================

    window.MOCK_DATA = {
        // READ Functions
        getRentals: function() {
            console.log('[MOCK] getRentals() called');
            return generateMockRentals();
        },

        getDebtRentals: function() {
            console.log('[MOCK] getDebtRentals() called');
            return generateMockDebtRentals();
        },

        getCreditData: function() {
            console.log('[MOCK] getCreditData() called');
            return generateMockCreditData();
        },

        getFinanceData: function() {
            console.log('[MOCK] getFinanceData() called');
            const expenses = generateMockExpenses();
            const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
            
            // Calculate today's income from rentals for daily recon
            const rentals = generateMockRentals();
            let dailyCash = 0;
            let dailyTransfer = 0;
            
            rentals.forEach(r => {
                if (r.dateInput === formatDate(today)) {
                    if (r.paymentMethod.toLowerCase().includes('cash')) {
                        dailyCash += r.price;
                    } else {
                        dailyTransfer += r.price;
                    }
                }
            });

            return {
                expenses: expenses,
                totalExpenses: totalExpenses,
                dailyRecon: {
                    cash: dailyCash,
                    transfer: dailyTransfer
                }
            };
        },

        getEmployeeLoans: function() {
            console.log('[MOCK] getEmployeeLoans() called');
            const loans = generateMockEmployeeLoans();
            const activeLoans = loans.filter(l => l.status === 'Aktif');
            const totalOutstanding = activeLoans.reduce((sum, l) => sum + l.amount, 0);

            // Summary per employee
            const summaryMap = {};
            activeLoans.forEach(loan => {
                if (!summaryMap[loan.employeeName]) {
                    summaryMap[loan.employeeName] = 0;
                }
                summaryMap[loan.employeeName] += loan.amount;
            });

            const summary = Object.keys(summaryMap).map(name => ({
                employeeName: name,
                totalAmount: summaryMap[name]
            }));

            return {
                loans: loans,
                summary: summary,
                totalOutstanding: totalOutstanding
            };
        },

        getPettyCashData: function(filterMonth, filterYear) {
            console.log('[MOCK] getPettyCashData() called', filterMonth, filterYear);
            return generateMockPettyCash(filterMonth, filterYear);
        },

        fetchAuditLogsFromDB: function() {
            console.log('[MOCK] fetchAuditLogsFromDB() called');
            return generateMockAuditLogs();
        },

        getLicenseConfig: function() {
            console.log('[MOCK] getLicenseConfig() called');
            return {
                status: 'success',
                licenseStatus: 'active',
                licenseType: 'demo',
                startDate: formatDate(addDays(today, -180)),
                endDate: formatDate(addDays(today, 180)),
                trialEndDate: '',
                companyName: 'DEMO Company',
                adminContact: '08123456789',
                daysRemaining: 999,
                daysSinceExpired: 0,
                gracePeriodDays: 0,
                isExpired: false,
                isSuspended: false,
                isTerminated: false,
                isTrial: false,
                isActive: true
            };
        },

        checkSystemStatus: function() {
            console.log('[MOCK] checkSystemStatus() called');
            return {
                isDown: false,
                message: '',
                type: '503'
            };
        },

        getDebtDetail: function(id) {
            console.log('[MOCK] getDebtDetail() called', id);
            const debts = generateMockDebtRentals();
            const debt = debts.find(d => d.id === id);
            if (debt) {
                return {
                    status: 'success',
                    ...debt
                };
            }
            return { status: 'error', message: 'Data tidak ditemukan' };
        },

        // WRITE Functions (All return demo readonly error)
        addRental: function() {
            console.log('[MOCK] addRental() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        updateRental: function() {
            console.log('[MOCK] updateRental() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        quickEditRental: function() {
            console.log('[MOCK] quickEditRental() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        quickEditOverdue: function() {
            console.log('[MOCK] quickEditOverdue() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        deleteRental: function() {
            console.log('[MOCK] deleteRental() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        finishRental: function() {
            console.log('[MOCK] finishRental() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        moveToHutangSewa: function() {
            console.log('[MOCK] moveToHutangSewa() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        extendRentalTransaction: function() {
            console.log('[MOCK] extendRentalTransaction() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        swapRentalUnit: function() {
            console.log('[MOCK] swapRentalUnit() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        changeRentType: function() {
            console.log('[MOCK] changeRentType() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        payDebt: function() {
            console.log('[MOCK] payDebt() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        addOtherIncome: function() {
            console.log('[MOCK] addOtherIncome() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        updateTransactionMethod: function() {
            console.log('[MOCK] updateTransactionMethod() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        addCreditData: function() {
            console.log('[MOCK] addCreditData() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        addCreditPayment: function() {
            console.log('[MOCK] addCreditPayment() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        addExpense: function() {
            console.log('[MOCK] addExpense() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        updateExpense: function() {
            console.log('[MOCK] updateExpense() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        deleteExpense: function() {
            console.log('[MOCK] deleteExpense() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        addEmployeeLoan: function() {
            console.log('[MOCK] addEmployeeLoan() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        updateEmployeeLoan: function() {
            console.log('[MOCK] updateEmployeeLoan() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        deleteEmployeeLoan: function() {
            console.log('[MOCK] deleteEmployeeLoan() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        addPettyCashCapital: function() {
            console.log('[MOCK] addPettyCashCapital() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        setMaintenanceMode: function() {
            console.log('[MOCK] setMaintenanceMode() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        activateLicense: function() {
            console.log('[MOCK] activateLicense() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        extendTrial: function() {
            console.log('[MOCK] extendTrial() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        updateLicenseStatus: function() {
            console.log('[MOCK] updateLicenseStatus() - READONLY');
            throw new Error('__DEMO_READONLY__');
        },

        matikanModeGangguan: function() {
            console.log('[MOCK] matikanModeGangguan() - READONLY');
            throw new Error('__DEMO_READONLY__');
        }
    };

    console.log('[MOCK] ✅ Mock data installed successfully');
    console.log('[MOCK] ℹ️  Total functions available:', Object.keys(window.MOCK_DATA).length);

})();
