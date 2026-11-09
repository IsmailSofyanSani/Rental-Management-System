/**
 * GOOGLE APPS SCRIPT SHIM FOR STATIC DEMO
 * ========================================
 * Menggantikan google.script.run dengan mock handler
 * yang mendukung withSuccessHandler, withFailureHandler, dan withUserObject
 * 
 * File ini dimuat SEBELUM script utama index.html
 */

(function() {
    'use strict';

    // Deteksi apakah kita dalam environment Apps Script atau static demo
    const isStaticDemo = typeof google === 'undefined' || 
                        !google.script || 
                        !google.script.run;

    if (!isStaticDemo) {
        console.log('[SHIM] Running in Apps Script environment, shim not needed');
        return; // Tidak perlu shim jika sudah ada google.script.run asli
    }

    console.log('[SHIM] Static demo detected, installing google.script.run mock...');

    // Fungsi helper untuk deep clone data agar tidak ter-mutate
    function deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => deepClone(item));
        
        const cloned = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }

    // Fungsi helper untuk delay random (simulasi network latency)
    function randomDelay() {
        return 300 + Math.random() * 400; // 300-700ms
    }

    // Class untuk handle chaining withSuccessHandler, withFailureHandler, withUserObject
    class MockScriptRun {
        constructor() {
            this.successHandler = null;
            this.failureHandler = null;
            this.userObject = null;
        }

        withSuccessHandler(callback) {
            this.successHandler = callback;
            return this;
        }

        withFailureHandler(callback) {
            this.failureHandler = callback;
            return this;
        }

        withUserObject(obj) {
            this.userObject = obj;
            return this;
        }

        // Method ini dipanggil saat fungsi server di-invoke
        _execute(functionName, args) {
            const delay = randomDelay();

            setTimeout(() => {
                try {
                    // Cek apakah fungsi ada di window.MOCK_DATA
                    if (!window.MOCK_DATA || typeof window.MOCK_DATA[functionName] !== 'function') {
                        console.warn(`[SHIM] Function ${functionName} not found in MOCK_DATA`);
                        
                        // Fallback: return empty data
                        const fallback = this._getFallbackData(functionName);
                        if (this.successHandler) {
                            this.successHandler(deepClone(fallback), this.userObject);
                        }
                        return;
                    }

                    // Panggil mock function dengan arguments
                    const result = window.MOCK_DATA[functionName](...args);
                    
                    // Deep clone untuk mencegah mutation
                    const clonedResult = deepClone(result);

                    // Panggil success handler jika ada
                    if (this.successHandler) {
                        this.successHandler(clonedResult, this.userObject);
                    }

                } catch (error) {
                    console.error(`[SHIM] Error executing ${functionName}:`, error);
                    
                    // Panggil failure handler jika ada
                    if (this.failureHandler) {
                        this.failureHandler(error, this.userObject);
                    }
                }
            }, delay);
        }

        _getFallbackData(functionName) {
            // Fallback data jika mock function tidak ditemukan
            const fallbacks = {
                'getRentals': [],
                'getDebtRentals': [],
                'getCreditData': [],
                'getFinanceData': { expenses: [], totalExpenses: 0, dailyRecon: { cash: 0, transfer: 0 } },
                'getEmployeeLoans': { loans: [], summary: [], totalOutstanding: 0 },
                'getPettyCashData': { history: [], totalCapital: 0, currentBalance: 0, totalOut: 0, totalIn: 0 },
                'fetchAuditLogsFromDB': [],
                'getLicenseConfig': { 
                    status: 'success', 
                    licenseStatus: 'active',
                    isExpired: false,
                    isSuspended: false,
                    isTerminated: false,
                    isTrial: false,
                    isActive: true,
                    daysRemaining: 999
                },
                'checkSystemStatus': { isDown: false, message: '', type: '503' }
            };

            return fallbacks[functionName] || null;
        }
    }

    // Proxy untuk menangkap pemanggilan fungsi apa pun pada google.script.run
    const scriptRunProxy = new Proxy({}, {
        get(target, functionName) {
            // Jika yang di-request adalah withSuccessHandler, withFailureHandler, atau withUserObject
            // kembalikan MockScriptRun instance baru
            if (functionName === 'withSuccessHandler' || 
                functionName === 'withFailureHandler' || 
                functionName === 'withUserObject') {
                const mockRun = new MockScriptRun();
                return mockRun[functionName].bind(mockRun);
            }

            // Jika ini pemanggilan fungsi server (misalnya getRentals, addRental, dll)
            // kembalikan function yang akan execute mock
            return function(...args) {
                const mockRun = new MockScriptRun();
                mockRun._execute(functionName, args);
                return mockRun;
            };
        }
    });

    // Install google.script.run mock ke window
    if (typeof window.google === 'undefined') {
        window.google = {};
    }
    if (typeof window.google.script === 'undefined') {
        window.google.script = {};
    }

    window.google.script.run = scriptRunProxy;

    // Tambahkan flag untuk deteksi demo mode
    window.IS_DEMO_MODE = true;

    console.log('[SHIM] ✅ google.script.run mock installed successfully');
    console.log('[SHIM] ℹ️  All server calls will be routed to MOCK_DATA');

})();
