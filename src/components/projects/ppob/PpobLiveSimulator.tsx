"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Search,
  X,
  ArrowLeft,
  CheckCircle2,
  Share2,
  Copy,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Receipt,
  Download,
  QrCode,
  Bell,
  Headset,
  History,
  Lock,
} from "lucide-react";

// ================= TYPES =================
export type TabIndex = 0 | 1 | 2 | 3 | 4;

interface TransactionRecord {
  id: string;
  refNumber: string;
  type: string;
  targetNumber: string;
  title: string;
  provider: string;
  amount: number;
  adminFee: number;
  total: number;
  date: string;
  status: "BERHASIL" | "MENUNGGU" | "GAGAL";
  tokenNumber?: string;
  customerName?: string;
}

// Initial Mock Transactions
const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: "tx-1",
    refNumber: "MPP-202609-881901",
    type: "pulsa",
    targetNumber: "0812-3456-7890",
    title: "Pulsa Telkomsel 50.000",
    provider: "Telkomsel",
    amount: 50000,
    adminFee: 200,
    total: 50200,
    date: "14 Sep 2026, 18:42",
    status: "BERHASIL",
    customerName: "Abel Thareq",
  },
  {
    id: "tx-2",
    refNumber: "MPP-202609-881902",
    type: "listrik",
    targetNumber: "3201-9982-1029",
    title: "Token Listrik PLN 100.000",
    provider: "PLN Prabayar",
    amount: 100000,
    adminFee: 2500,
    total: 102500,
    date: "12 Sep 2026, 09:15",
    status: "BERHASIL",
    tokenNumber: "4819-2041-8891-2374-9012",
    customerName: "Abel Thareq / R1M-900VA",
  },
  {
    id: "tx-3",
    refNumber: "MPP-202609-881903",
    type: "ewallet",
    targetNumber: "0857-9912-3401",
    title: "Top Up GoPay 50.000",
    provider: "GoPay",
    amount: 50000,
    adminFee: 1000,
    total: 51000,
    date: "10 Sep 2026, 14:20",
    status: "BERHASIL",
    customerName: "Abel Thareq",
  },
  {
    id: "tx-4",
    refNumber: "MPP-202609-881904",
    type: "bpjs",
    targetNumber: "0001-2948-1920",
    title: "Tagihan BPJS Kesehatan",
    provider: "BPJS Kesehatan",
    amount: 70000,
    adminFee: 2500,
    total: 72500,
    date: "05 Sep 2026, 11:05",
    status: "BERHASIL",
    customerName: "Abel Thareq (Kelas 2)",
  },
];

export const PpobLiveSimulator: React.FC = () => {
  // Navigation & Screen States
  const [activeTab, setActiveTab] = useState<TabIndex>(2); // Default: Tab 2 (HomePage)
  const [currentFlow, setCurrentFlow] = useState<
    "home" | "pulsa" | "listrik" | "ewallet" | "pdam" | "bpjs" | "receipt"
  >("home");

  // User & Balance States
  const [saldo, setSaldo] = useState<number>(1450000);
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [activeReceipt, setActiveReceipt] = useState<TransactionRecord | null>(null);

  // Search in Home Page
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Pulsa Flow Form State
  const [selectedProvider, setSelectedProvider] = useState<string>("Telkomsel");
  const [phoneInput, setPhoneInput] = useState<string>("0812-9876-5432");
  const [selectedNominal, setSelectedNominal] = useState<{ label: string; amount: number; price: number }>({
    label: "Pulsa 50.000",
    amount: 50000,
    price: 50200,
  });

  // Listrik Flow Form State
  const [listrikType, setListrikType] = useState<"token" | "tagihan">("token");
  const [meterInput, setMeterInput] = useState<string>("3201-9982-1029");
  const [selectedTokenNominal, setSelectedTokenNominal] = useState<{ label: string; amount: number; price: number }>({
    label: "Token 50.000",
    amount: 50000,
    price: 52500,
  });

  // Confirmation & PIN Modals
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [pinDigits, setPinDigits] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Pending Transaction Draft
  const [pendingTx, setPendingTx] = useState<{
    type: string;
    targetNumber: string;
    title: string;
    provider: string;
    amount: number;
    adminFee: number;
    total: number;
    tokenNumber?: string;
    customerName?: string;
  } | null>(null);

  // Format Currency helper
  const formatRupiah = (val: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val).replace("IDR", "Rp").trim();
  };

  // Quick Action in Saldo Card
  const handleOpenIsiDeposit = () => {
    setSaldo((prev) => prev + 250000);
    const newTx: TransactionRecord = {
      id: "tx-" + Date.now(),
      refNumber: "DEP-" + Math.floor(100000 + Math.random() * 900000),
      type: "deposit",
      targetNumber: "BCA Virtual Account",
      title: "Isi Saldo Deposit",
      provider: "Bank BCA",
      amount: 250000,
      adminFee: 0,
      total: 250000,
      date: "Baru saja",
      status: "BERHASIL",
      customerName: "Abel Thareq",
    };
    setTransactions((prev) => [newTx, ...prev]);
    setActiveReceipt(newTx);
    setCurrentFlow("receipt");
  };

  // Launch Pulsa Payment Flow
  const handleInitiatePulsa = () => {
    setPendingTx({
      type: "pulsa",
      targetNumber: phoneInput,
      title: selectedNominal.label,
      provider: selectedProvider,
      amount: selectedNominal.amount,
      adminFee: selectedNominal.price - selectedNominal.amount,
      total: selectedNominal.price,
      customerName: "Abel Thareq",
    });
    setIsConfirmModalOpen(true);
  };

  // Launch Listrik Payment Flow
  const handleInitiateListrik = () => {
    const generatedToken = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
      1000 + Math.random() * 9000
    )}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    setPendingTx({
      type: "listrik",
      targetNumber: meterInput,
      title: listrikType === "token" ? `Token PLN ${formatRupiah(selectedTokenNominal.amount)}` : "Tagihan Listrik PLN Pascabayar",
      provider: "PLN",
      amount: selectedTokenNominal.amount,
      adminFee: 2500,
      total: selectedTokenNominal.amount + 2500,
      tokenNumber: listrikType === "token" ? generatedToken : undefined,
      customerName: "Abel Thareq / R1-900VA",
    });
    setIsConfirmModalOpen(true);
  };

  // Proceed from Confirmation to PIN
  const handleConfirmToPin = () => {
    setIsConfirmModalOpen(false);
    setPinDigits("");
    setPinError(null);
    setIsPinModalOpen(true);
  };

  // PIN Keypad Press
  const handlePinInput = (digit: string) => {
    if (pinDigits.length < 6) {
      const nextPin = pinDigits + digit;
      setPinDigits(nextPin);
      if (nextPin.length === 6) {
        executePayment(nextPin);
      }
    }
  };

  const handlePinBackspace = () => {
    setPinDigits((prev) => prev.slice(0, -1));
    setPinError(null);
  };

  // Execute Payment Execution & Balance Deduction
  const executePayment = (pin: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPinModalOpen(false);

      if (pendingTx) {
        setSaldo((prev) => Math.max(0, prev - pendingTx.total));
        const newRecord: TransactionRecord = {
          id: "tx-" + Date.now(),
          refNumber: `MPP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(
            100000 + Math.random() * 900000
          )}`,
          type: pendingTx.type,
          targetNumber: pendingTx.targetNumber,
          title: pendingTx.title,
          provider: pendingTx.provider,
          amount: pendingTx.amount,
          adminFee: pendingTx.adminFee,
          total: pendingTx.total,
          date: "Hari ini, " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          status: "BERHASIL",
          tokenNumber: pendingTx.tokenNumber,
          customerName: pendingTx.customerName,
        };
        setTransactions((prev) => [newRecord, ...prev]);
        setActiveReceipt(newRecord);
        setCurrentFlow("receipt");
        setPendingTx(null);
      }
    }, 600);
  };

  // Filtered Services for Search in Home
  const allServices = useMemo(() => [
    { title: "Transfer", icon: "/assets/ppob/images/transfer.png", type: "transfer" },
    { title: "Pulsa/Data", icon: "/assets/ppob/images/pulsa.png", type: "pulsa" },
    { title: "E Wallet", icon: "/assets/ppob/images/ewallet.png", type: "ewallet" },
    { title: "Lainnya", icon: "/assets/ppob/images/lainnya.png", type: "lainnya" },
    { title: "Tagihan", icon: "/assets/ppob/images/tagihan.png", type: "tagihan" },
    { title: "Cash Service", icon: "/assets/ppob/images/atm.png", type: "tariktunai" },
    { title: "E Money", icon: "/assets/ppob/images/emoney.png", type: "emoney" },
    { title: "PDAM", icon: "/assets/ppob/images/pdam.png", type: "pdam" },
    { title: "E Voucher", icon: "/assets/ppob/images/evoucher.png", type: "evoucher" },
    { title: "Top Up Game", icon: "/assets/ppob/images/topup.png", type: "topup" },
    { title: "Listrik", icon: "/assets/ppob/images/listrik.png", type: "listrik" },
    { title: "by.U Promo", icon: "/assets/ppob/images/byu.png", type: "byu" },
    { title: "BPJS", icon: "/assets/ppob/images/bpjs.png", type: "bpjs" },
    { title: "Kartu Kredit", icon: "/assets/ppob/images/kartukredit.png", type: "kartukredit" },
    { title: "Cicilan", icon: "/assets/ppob/images/cicilan.png", type: "cicilan" },
    { title: "PBB", icon: "/assets/ppob/images/pbb.png", type: "pbb" },
    { title: "Internet & TV", icon: "/assets/ppob/images/tvkabelinternet.png", type: "internet" },
    { title: "E-Invoicing", icon: "/assets/ppob/images/einvoicing.png", type: "einvoicing" },
  ], []);

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allServices.filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, allServices]);

  return (
    <div className="flex flex-col items-center select-none">
      {/* Phone Hardware Shell */}
      <div className="relative w-[360px] sm:w-[380px] h-[730px] sm:h-[760px] bg-black rounded-[48px] p-3.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1),0_0_0_8px_#27272A] border-[4px] border-zinc-700/80 flex flex-col overflow-hidden">
        {/* Dynamic Island / Hardware Speaker */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-between px-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1C1C1E] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0A84FF]/60 animate-pulse" />
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#1C1C1E]" />
        </div>

        {/* Inner Phone Screen */}
        <div className="relative w-full h-full bg-[#F8F8FF] rounded-[38px] overflow-hidden flex flex-col font-sans">
          {/* iOS / Android Status Bar */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-white text-[11px] font-medium z-40 bg-[#ED1C24]">
            <span>09:41</span>
            <div className="flex items-center gap-1.5 opacity-90">
              <span className="text-[10px] font-mono">5G</span>
              <div className="w-4 h-2 border border-white rounded-[2px] p-[1px] flex items-center">
                <div className="w-full h-full bg-white rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* Screen Content Switcher */}
          <div className="flex-1 overflow-y-auto relative scrollbar-none pb-20">
            {/* 1. FLOW: RECEIPT MODAL */}
            {currentFlow === "receipt" && activeReceipt && (
              <div className="p-4 min-h-full bg-zinc-50 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setCurrentFlow("home")}
                    className="p-2 rounded-full hover:bg-zinc-200 text-zinc-700 cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="font-semibold text-zinc-900 text-sm">Struk Transaksi</h3>
                  <div className="w-8" />
                </div>

                {/* Struk Card */}
                <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm space-y-4">
                  <div className="text-center pb-3 border-b border-dashed border-zinc-200">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mb-2">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div className="text-xs font-semibold text-emerald-600 tracking-wider">
                      TRANSAKSI BERHASIL
                    </div>
                    <div className="text-lg font-bold text-zinc-900 mt-1 font-mono">
                      {formatRupiah(activeReceipt.total)}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">{activeReceipt.date}</div>
                  </div>

                  {/* Token Listrik Highlight Box */}
                  {activeReceipt.tokenNumber && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-center">
                      <div className="text-[10px] font-medium text-red-700 uppercase tracking-wider">
                        Stroom / 20-Digit Token PLN
                      </div>
                      <div className="font-mono font-bold text-base text-red-900 tracking-widest mt-1 select-all">
                        {activeReceipt.tokenNumber}
                      </div>
                      <div className="text-[9px] text-red-600 mt-0.5">
                        Masukkan kode token ini ke kWh Meteran Anda
                      </div>
                    </div>
                  )}

                  {/* Detail Breakdown */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">No. Referensi</span>
                      <span className="font-mono text-zinc-800">{activeReceipt.refNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Nama Pelanggan</span>
                      <span className="font-medium text-zinc-800">{activeReceipt.customerName || "Abel Thareq"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Nomor Tujuan / ID</span>
                      <span className="font-mono text-zinc-800">{activeReceipt.targetNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Layanan</span>
                      <span className="text-zinc-800">{activeReceipt.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Metode Bayar</span>
                      <span className="text-zinc-800">Saldo Merah Putih Pay</span>
                    </div>
                    <div className="pt-2 border-t border-dashed border-zinc-200 flex justify-between">
                      <span className="text-zinc-500">Harga Produk</span>
                      <span className="text-zinc-800">{formatRupiah(activeReceipt.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Biaya Admin</span>
                      <span className="text-zinc-800">{formatRupiah(activeReceipt.adminFee)}</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-200 flex justify-between font-bold text-sm">
                      <span className="text-zinc-900">Total Pembayaran</span>
                      <span className="text-[#ED1C24]">{formatRupiah(activeReceipt.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Struk Action Buttons */}
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => alert("Struk berhasil disimpan ke galeri!")}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-medium text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Simpan Struk
                  </button>
                  <button
                    onClick={() => setCurrentFlow("home")}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#ED1C24] text-xs font-medium text-white hover:bg-[#D3151D] cursor-pointer"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            )}

            {/* 2. FLOW: PULSA & DATA SCREEN */}
            {currentFlow === "pulsa" && (
              <div className="p-4 bg-[#F8F8FF] min-h-full">
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => setCurrentFlow("home")}
                    className="p-1.5 rounded-full hover:bg-zinc-200 text-zinc-700 cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="font-semibold text-zinc-900 text-sm">Pulsa & Paket Data</h3>
                </div>

                {/* Number Input Card */}
                <div className="bg-white p-3.5 rounded-2xl border border-zinc-200 shadow-xs mb-3.5">
                  <label className="text-[11px] font-medium text-zinc-500">Nomor Ponsel</label>
                  <div className="mt-1 flex items-center justify-between">
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="text-base font-semibold text-zinc-900 w-full outline-none"
                    />
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-xs font-bold text-[#ED1C24]">
                      T
                    </div>
                  </div>
                </div>

                {/* Provider Selector Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
                  {["Telkomsel", "Indosat", "XL", "Tri", "by.U"].map((prov) => (
                    <button
                      key={prov}
                      onClick={() => setSelectedProvider(prov)}
                      className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                        selectedProvider === prov
                          ? "bg-[#ED1C24] text-white"
                          : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>

                {/* Nominal Grid */}
                <h4 className="text-xs font-semibold text-zinc-800 mb-2">Pilih Nominal</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: "Pulsa 10.000", amount: 10000, price: 10800 },
                    { label: "Pulsa 25.000", amount: 25000, price: 25500 },
                    { label: "Pulsa 50.000", amount: 50000, price: 50200 },
                    { label: "Pulsa 100.000", amount: 100000, price: 99500 },
                    { label: "Data 15GB 30 Hari", amount: 45000, price: 45000 },
                    { label: "Data 35GB Unlimited", amount: 85000, price: 85000 },
                  ].map((nom) => (
                    <div
                      key={nom.label}
                      onClick={() => setSelectedNominal(nom)}
                      className={`p-3 rounded-xl border bg-white cursor-pointer transition-all ${
                        selectedNominal.label === nom.label
                          ? "border-[#ED1C24] ring-2 ring-red-100 shadow-sm"
                          : "border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      <div className="text-xs font-semibold text-zinc-800">{nom.label}</div>
                      <div className="text-[11px] font-bold text-[#ED1C24] mt-1 font-mono">
                        {formatRupiah(nom.price)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Sticky Action */}
                <div className="mt-6 pt-3 border-t border-zinc-200 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-zinc-500">Total Bayar</div>
                    <div className="text-base font-bold text-[#ED1C24] font-mono">
                      {formatRupiah(selectedNominal.price)}
                    </div>
                  </div>
                  <button
                    onClick={handleInitiatePulsa}
                    className="px-6 py-2.5 rounded-full bg-[#ED1C24] hover:bg-[#D3151D] text-white text-xs font-semibold cursor-pointer shadow-md"
                  >
                    Beli Sekarang
                  </button>
                </div>
              </div>
            )}

            {/* 3. FLOW: LISTRIK PLN SCREEN */}
            {currentFlow === "listrik" && (
              <div className="p-4 bg-[#F8F8FF] min-h-full">
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => setCurrentFlow("home")}
                    className="p-1.5 rounded-full hover:bg-zinc-200 text-zinc-700 cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="font-semibold text-zinc-900 text-sm">Listrik PLN</h3>
                </div>

                {/* Tab: Token vs Tagihan */}
                <div className="flex rounded-xl bg-zinc-200 p-1 mb-3.5">
                  <button
                    onClick={() => setListrikType("token")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      listrikType === "token" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-600"
                    }`}
                  >
                    Token Listrik
                  </button>
                  <button
                    onClick={() => setListrikType("tagihan")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      listrikType === "tagihan" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-600"
                    }`}
                  >
                    Tagihan Listrik
                  </button>
                </div>

                {/* No Meter Input Card */}
                <div className="bg-white p-3.5 rounded-2xl border border-zinc-200 shadow-xs mb-3.5">
                  <label className="text-[11px] font-medium text-zinc-500">No. Meter / ID Pelanggan</label>
                  <div className="mt-1 flex items-center justify-between">
                    <input
                      type="text"
                      value={meterInput}
                      onChange={(e) => setMeterInput(e.target.value)}
                      placeholder="Contoh: 14128910291"
                      className="text-base font-semibold text-zinc-900 w-full outline-none font-mono"
                    />
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      VALID
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">Nama: ABEL THAREQ / R1-900VA</div>
                </div>

                {/* Token Nominals */}
                {listrikType === "token" ? (
                  <>
                    <h4 className="text-xs font-semibold text-zinc-800 mb-2">Pilih Nominal Token</h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { label: "Token 20.000", amount: 20000, price: 22500 },
                        { label: "Token 50.000", amount: 50000, price: 52500 },
                        { label: "Token 100.000", amount: 100000, price: 102500 },
                        { label: "Token 200.000", amount: 200000, price: 202500 },
                        { label: "Token 500.000", amount: 500000, price: 502500 },
                        { label: "Token 1.000.000", amount: 1000000, price: 1002500 },
                      ].map((nom) => (
                        <div
                          key={nom.label}
                          onClick={() => setSelectedTokenNominal(nom)}
                          className={`p-3 rounded-xl border bg-white cursor-pointer transition-all ${
                            selectedTokenNominal.label === nom.label
                              ? "border-[#ED1C24] ring-2 ring-red-100 shadow-sm"
                              : "border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          <div className="text-xs font-semibold text-zinc-800">{nom.label}</div>
                          <div className="text-[11px] font-bold text-[#ED1C24] mt-1 font-mono">
                            {formatRupiah(nom.price)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="bg-white p-4 rounded-2xl border border-zinc-200 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Periode Tagihan</span>
                      <span className="font-semibold text-zinc-800">September 2026</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Stand Meter</span>
                      <span className="font-mono text-zinc-800">01824 - 01980</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Tagihan PLN</span>
                      <span className="font-mono text-zinc-800">Rp 164.200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Biaya Admin</span>
                      <span className="font-mono text-zinc-800">Rp 2.500</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-200 flex justify-between font-bold text-sm">
                      <span className="text-zinc-900">Total Tagihan</span>
                      <span className="text-[#ED1C24]">Rp 166.700</span>
                    </div>
                  </div>
                )}

                {/* Bottom Sticky Action */}
                <div className="mt-6 pt-3 border-t border-zinc-200 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-zinc-500">Total Pembayaran</div>
                    <div className="text-base font-bold text-[#ED1C24] font-mono">
                      {listrikType === "token"
                        ? formatRupiah(selectedTokenNominal.price)
                        : "Rp 166.700"}
                    </div>
                  </div>
                  <button
                    onClick={handleInitiateListrik}
                    className="px-6 py-2.5 rounded-full bg-[#ED1C24] hover:bg-[#D3151D] text-white text-xs font-semibold cursor-pointer shadow-md"
                  >
                    Lanjutkan Bayar
                  </button>
                </div>
              </div>
            )}

            {/* 4. FLOW: MAIN TABS (Home, Mutasi, Akun, etc.) */}
            {currentFlow === "home" && (
              <>
                {/* TAB 2: HOME FEED */}
                {activeTab === 2 && (
                  <div className="space-y-3.5">
                    {/* Top Curved App Header */}
                    <div className="relative bg-[#ED1C24] px-4 pt-1 pb-9 rounded-b-[28px] shadow-sm">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-bold text-xs">
                            AT
                          </div>
                          <div>
                            <div className="text-[10px] text-white/80 font-light">Selamat Datang,</div>
                            <div className="text-xs font-bold flex items-center gap-1">
                              <span>Abel Thareq</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => alert("Notifikasi: Semua tagihan Anda bulan ini telah lunas!")}
                            className="p-1.5 rounded-full hover:bg-white/10 text-white cursor-pointer"
                          >
                            <Bell className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => alert("Customer Care Merah Putih Pay siap melayani Anda 24/7!")}
                            className="p-1.5 rounded-full hover:bg-white/10 text-white cursor-pointer"
                          >
                            <Headset className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Header App Title Brand */}
                      <div className="mt-2 text-center">
                        <span className="text-xs font-mono font-semibold tracking-wider text-white/95 uppercase bg-white/15 px-3 py-1 rounded-full border border-white/20">
                          Merah Putih Pay
                        </span>
                      </div>
                    </div>

                    {/* Balance Card (Overlapping header) */}
                    <div className="-mt-8 mx-4 bg-white rounded-2xl p-3.5 border-2 border-zinc-200/80 shadow-[0_6px_16px_rgba(0,0,0,0.06)]">
                      {/* Inner Red Balance Graphic Area */}
                      <div className="bg-gradient-to-r from-[#ED1C24] to-[#C4121A] rounded-xl p-3 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {/* QR Scanner Trigger */}
                          <button
                            onClick={() => alert("Simulasi QRIS Scanner aktif!")}
                            className="w-8 h-8 rounded-lg bg-white text-zinc-900 flex items-center justify-center shadow-xs cursor-pointer"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <div>
                            <div className="text-[10px] text-white/80">Saldo Deposito</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-base font-bold font-mono">
                                {isBalanceVisible ? formatRupiah(saldo) : "Rp •••••••"}
                              </span>
                              <button
                                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                                className="text-white/80 hover:text-white cursor-pointer"
                              >
                                {isBalanceVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Top Up Action Button */}
                        <button
                          onClick={handleOpenIsiDeposit}
                          className="flex items-center gap-1 bg-white text-zinc-900 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold hover:bg-zinc-100 cursor-pointer shadow-xs"
                        >
                          <span className="text-[#ED1C24] font-bold">+</span>
                          <span>Isi Deposit</span>
                        </button>
                      </div>

                      {/* 4 Quick Actions Row inside Card */}
                      <div className="grid grid-cols-4 gap-2 pt-3 mt-1 text-center">
                        <div
                          onClick={() => alert("Fitur Transfer Bank siap digunakan!")}
                          className="flex flex-col items-center cursor-pointer group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform">
                            <Image
                              src="/assets/ppob/images/transfer.png"
                              alt="Transfer"
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                          <span className="text-[10px] font-medium text-zinc-700 mt-1">Transfer</span>
                        </div>

                        <div
                          onClick={() => setCurrentFlow("pulsa")}
                          className="flex flex-col items-center cursor-pointer group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform">
                            <Image
                              src="/assets/ppob/images/pulsa.png"
                              alt="Pulsa"
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                          <span className="text-[10px] font-medium text-zinc-700 mt-1">Pulsa/Data</span>
                        </div>

                        <div
                          onClick={() => alert("Pilih E-Wallet: GoPay, OVO, DANA, ShopeePay!")}
                          className="flex flex-col items-center cursor-pointer group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform">
                            <Image
                              src="/assets/ppob/images/ewallet.png"
                              alt="E Wallet"
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                          <span className="text-[10px] font-medium text-zinc-700 mt-1">E Wallet</span>
                        </div>

                        <div
                          onClick={() => alert("Katalog 40+ Layanan Lainnya")}
                          className="flex flex-col items-center cursor-pointer group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform">
                            <Image
                              src="/assets/ppob/images/lainnya.png"
                              alt="Lainnya"
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                          <span className="text-[10px] font-medium text-zinc-700 mt-1">Lainnya</span>
                        </div>
                      </div>
                    </div>

                    {/* Search Bar + Grid Fitur Container */}
                    <div className="mx-4 bg-white rounded-2xl p-3.5 border-2 border-zinc-200/80 shadow-xs">
                      {/* Search Bar matching Flutter TextField */}
                      <div className="relative flex items-center rounded-xl border border-zinc-200 px-3 py-2 bg-zinc-50/50">
                        <Search className="w-4 h-4 text-zinc-400 mr-2 flex-shrink-0" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Cari fitur pembayaran..."
                          className="w-full text-xs text-zinc-800 bg-transparent outline-none placeholder:text-zinc-400"
                        />
                        {searchQuery && (
                          <button onClick={() => setSearchQuery("")} className="text-zinc-400 hover:text-zinc-600">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* If Searching, show search results */}
                      {searchQuery ? (
                        <div className="mt-3 pt-2 border-t border-zinc-100">
                          <div className="text-[11px] font-semibold text-zinc-500 mb-2">
                            Hasil Pencarian ({filteredServices.length})
                          </div>
                          {filteredServices.length === 0 ? (
                            <div className="text-center py-6 text-zinc-400 text-xs">
                              Fitur tidak ditemukan
                            </div>
                          ) : (
                            <div className="grid grid-cols-4 gap-2">
                              {filteredServices.map((item) => (
                                <div
                                  key={item.title}
                                  onClick={() => {
                                    if (item.type === "pulsa") setCurrentFlow("pulsa");
                                    else if (item.type === "listrik") setCurrentFlow("listrik");
                                    else alert(`Membuka fitur: ${item.title}`);
                                  }}
                                  className="flex flex-col items-center cursor-pointer p-1 rounded-lg hover:bg-zinc-50"
                                >
                                  <div className="w-11 h-11 rounded-[13px] border border-zinc-200 p-1 flex items-center justify-center">
                                    <Image
                                      src={item.icon}
                                      alt={item.title}
                                      width={34}
                                      height={34}
                                      className="object-contain"
                                    />
                                  </div>
                                  <span className="text-[9px] font-medium text-zinc-700 mt-1 text-center line-clamp-2">
                                    {item.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Default: 8 Main Service Icons Grid (2 Rows of 4) */
                        <div className="grid grid-cols-4 gap-2.5 mt-3.5">
                          {[
                            { label: "Tagihan", icon: "/assets/ppob/images/tagihan.png", onClick: () => setCurrentFlow("listrik") },
                            { label: "Cash Service", icon: "/assets/ppob/images/atm.png", onClick: () => alert("Tarik Tunai di Indomaret / Alfamart") },
                            { label: "E Money", icon: "/assets/ppob/images/emoney.png", onClick: () => alert("Tap Mandiri e-Money / BCA Flazz via NFC") },
                            { label: "PDAM", icon: "/assets/ppob/images/pdam.png", onClick: () => alert("Pilih Kabupaten / Kota PDAM Tirta") },
                            { label: "E Voucher", icon: "/assets/ppob/images/evoucher.png", onClick: () => alert("Voucher Belanja & Makanan") },
                            { label: "Top Up Game", icon: "/assets/ppob/images/topup.png", onClick: () => alert("Mobile Legends, Free Fire, Steam") },
                            { label: "Listrik", icon: "/assets/ppob/images/listrik.png", onClick: () => setCurrentFlow("listrik") },
                            { label: "by.U Promo", icon: "/assets/ppob/images/byu.png", onClick: () => setCurrentFlow("pulsa") },
                          ].map((item) => (
                            <div
                              key={item.label}
                              onClick={item.onClick}
                              className="flex flex-col items-center cursor-pointer group"
                            >
                              <div className="w-12 h-12 rounded-[14px] bg-white border border-zinc-200/90 shadow-xs flex items-center justify-center p-1.5 group-hover:scale-105 group-hover:border-red-300 transition-all">
                                <Image
                                  src={item.icon}
                                  alt={item.label}
                                  width={36}
                                  height={36}
                                  className="object-contain"
                                />
                              </div>
                              <span className="text-[9px] font-medium text-zinc-700 mt-1.5 text-center line-clamp-1 w-14">
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Promo Banners Carousel */}
                    <div className="px-4">
                      <div className="text-xs font-semibold text-zinc-800 mb-2 flex items-center justify-between">
                        <span>Promo Spesial Untukmu</span>
                        <span className="text-[10px] text-[#ED1C24] font-medium cursor-pointer">Lihat Semua</span>
                      </div>
                      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                        <div className="min-w-[260px] h-28 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 p-3 text-white flex flex-col justify-between flex-shrink-0 shadow-xs">
                          <div className="text-[10px] font-mono bg-white/20 w-fit px-2 py-0.5 rounded-full">
                            DISKON 50%
                          </div>
                          <div>
                            <div className="font-bold text-xs">Hemat Beli Token PLN</div>
                            <div className="text-[10px] text-white/80 mt-0.5">
                              Gunakan kode: MERAHPUTIH50
                            </div>
                          </div>
                        </div>

                        <div className="min-w-[260px] h-28 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-950 p-3 text-white flex flex-col justify-between flex-shrink-0 shadow-xs">
                          <div className="text-[10px] font-mono bg-emerald-500/30 text-emerald-300 w-fit px-2 py-0.5 rounded-full">
                            CASHBACK 20%
                          </div>
                          <div>
                            <div className="font-bold text-xs">Paket Data Telkomsel & XL</div>
                            <div className="text-[10px] text-white/80 mt-0.5">
                              Cashback langsung masuk saldo
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 1: MUTASI / RIWAYAT TRANSAKSI */}
                {activeTab === 1 && (
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-zinc-900 text-sm">Riwayat Transaksi</h3>
                      <button
                        onClick={() => setTransactions(INITIAL_TRANSACTIONS)}
                        className="text-[10px] font-medium text-[#ED1C24] flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Reset Data
                      </button>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {["Semua", "Berhasil", "Menunggu", "Gagal"].map((status, i) => (
                        <button
                          key={status}
                          className={`px-3 py-1 rounded-full text-[11px] font-medium cursor-pointer ${
                            i === 0
                              ? "bg-[#ED1C24] text-white"
                              : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>

                    {/* Transactions List */}
                    <div className="space-y-2">
                      {transactions.map((tx) => (
                        <div
                          key={tx.id}
                          onClick={() => {
                            setActiveReceipt(tx);
                            setCurrentFlow("receipt");
                          }}
                          className="bg-white p-3 rounded-xl border border-zinc-200 hover:border-red-300 transition-all cursor-pointer shadow-xs flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-red-50 text-[#ED1C24] flex items-center justify-center flex-shrink-0">
                              <Receipt className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-zinc-900 line-clamp-1">
                                {tx.title}
                              </div>
                              <div className="text-[10px] text-zinc-400 mt-0.5 font-mono">
                                {tx.targetNumber} · {tx.date}
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs font-bold text-zinc-900 font-mono">
                              -{formatRupiah(tx.total)}
                            </div>
                            <span className="inline-block text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm mt-0.5">
                              {tx.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 0: SHOP / BELANJA */}
                {activeTab === 0 && (
                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-zinc-900 text-sm">Belanja & Toko Digital</h3>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { title: "Mouse Wireless Pro", price: 125000, img: "/assets/ppob/images/Mouse_Wireless.png" },
                        { title: "Keyboard Mechanical", price: 349000, img: "/assets/ppob/images/Keyboard_Mechanical.png" },
                        { title: "Headphone Gaming HD", price: 219000, img: "/assets/ppob/images/Headphone_Gaming.png" },
                        { title: "Laptop Cooling Stand", price: 89000, img: "/assets/ppob/images/Cooling_Pad_Laptop.png" },
                      ].map((prod) => (
                        <div
                          key={prod.title}
                          className="bg-white p-2.5 rounded-xl border border-zinc-200 text-center shadow-xs"
                        >
                          <div className="w-full h-24 relative mb-2">
                            <Image src={prod.img} alt={prod.title} fill className="object-contain" />
                          </div>
                          <div className="text-xs font-semibold text-zinc-900 line-clamp-1">{prod.title}</div>
                          <div className="text-xs font-bold text-[#ED1C24] font-mono mt-0.5">
                            {formatRupiah(prod.price)}
                          </div>
                          <button
                            onClick={() => alert(`Item "${prod.title}" ditambahkan ke keranjang!`)}
                            className="mt-2 w-full py-1.5 bg-[#ED1C24] text-white text-[10px] font-semibold rounded-lg hover:bg-[#D3151D] cursor-pointer"
                          >
                            Beli Sekarang
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: AGENT / MITRA */}
                {activeTab === 3 && (
                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-zinc-900 text-sm">Pusat Komunitas & Agen</h3>
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-red-600 to-rose-800 text-white shadow-xs">
                      <div className="text-xs font-mono bg-white/20 px-2.5 py-0.5 rounded-full w-fit">
                        AGEN RESMI
                      </div>
                      <h4 className="text-base font-bold mt-2">Mitra Merah Putih Pay</h4>
                      <p className="text-[11px] text-white/80 mt-1">
                        Dapatkan komisi per transaksi mulai dari Rp 1.500 untuk setiap pembayaran loket PPOB.
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="bg-white/10 rounded-xl p-2">
                          <div className="text-[10px] text-white/70">Total Komisi</div>
                          <div className="font-bold font-mono">Rp 842.500</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-2">
                          <div className="text-[10px] text-white/70">Downline Aktif</div>
                          <div className="font-bold font-mono">14 Toko</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: AKUN / PROFIL */}
                {activeTab === 4 && (
                  <div className="p-4 space-y-3">
                    <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-red-100 text-[#ED1C24] flex items-center justify-center font-bold text-sm">
                        AT
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900 text-sm flex items-center gap-1.5">
                          <span>Abel Thareq</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-mono">
                            VERIFIED KYC
                          </span>
                        </div>
                        <div className="text-xs text-zinc-500 font-mono">+62 812-3456-7890</div>
                        <div className="text-[10px] text-zinc-400">abel.thareq88@gmail.com</div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden text-xs">
                      {[
                        { label: "Pengaturan Keamanan & PIN", icon: Lock },
                        { label: "Kelola Perangkat Saya", icon: ShieldCheck },
                        { label: "Riwayat Transaksi Lengkap", icon: History, onClick: () => setActiveTab(1) },
                        { label: "Pusat Bantuan & Layanan CS", icon: Headset },
                      ].map((item, idx) => (
                        <div
                          key={item.label}
                          onClick={item.onClick || (() => alert(`Membuka: ${item.label}`))}
                          className={`p-3.5 flex items-center justify-between hover:bg-zinc-50 cursor-pointer ${
                            idx > 0 ? "border-t border-zinc-100" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2.5 text-zinc-700">
                            <item.icon className="w-4 h-4 text-zinc-400" />
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Flutter CustomNavBar with Notched Floating Active Button */}
          {currentFlow === "home" && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-zinc-200/80 px-2 flex items-center justify-around z-40">
              {[
                { label: "Shop", icon: "/assets/ppob/images/navbar_shop.png", tab: 0 },
                { label: "Mutasi", icon: "/assets/ppob/images/navbar_mutasi.png", tab: 1 },
                { label: "Home", icon: "/assets/ppob/images/navbar_homepage.png", tab: 2 },
                { label: "Mitra", icon: "/assets/ppob/images/navbar_komunitas.png", tab: 3 },
                { label: "Akun", icon: "/assets/ppob/images/navbar_akun.png", tab: 4 },
              ].map((item) => {
                const isSelected = activeTab === item.tab;
                return (
                  <button
                    key={item.label}
                    onClick={() => setActiveTab(item.tab as TabIndex)}
                    className="relative flex flex-col items-center justify-center w-14 h-full cursor-pointer"
                  >
                    {isSelected ? (
                      /* Highlight Circle matching Flutter CustomNavBar */
                      <div className="absolute -top-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#F57478] to-[#F03E45] shadow-[0_4px_12px_rgba(237,28,36,0.35)] flex items-center justify-center">
                        <Image
                          src={item.icon}
                          alt={item.label}
                          width={24}
                          height={24}
                          className="object-contain brightness-0 invert"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Image
                          src={item.icon}
                          alt={item.label}
                          width={22}
                          height={22}
                          className="object-contain opacity-50 grayscale"
                        />
                        <span className="text-[9px] text-zinc-400 font-medium mt-1">{item.label}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Bottom Home Indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-400 rounded-full z-50 pointer-events-none" />
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. Payment Confirmation Modal (Bottom Sheet style) */}
      <AnimatePresence>
        {isConfirmModalOpen && pendingTx && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-50 p-4">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <h3 className="font-bold text-zinc-900 text-sm">Konfirmasi Pembayaran</h3>
                <button
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="p-1 rounded-full text-zinc-400 hover:bg-zinc-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Layanan</span>
                  <span className="font-medium text-zinc-800">{pendingTx.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Nomor Tujuan / ID</span>
                  <span className="font-mono text-zinc-800">{pendingTx.targetNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Nominal</span>
                  <span className="text-zinc-800 font-mono">{formatRupiah(pendingTx.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Biaya Admin</span>
                  <span className="text-zinc-800 font-mono">{formatRupiah(pendingTx.adminFee)}</span>
                </div>
                <div className="pt-2 border-t border-zinc-200 flex justify-between font-bold text-sm">
                  <span className="text-zinc-900">Total Tagihan</span>
                  <span className="text-[#ED1C24] font-mono">{formatRupiah(pendingTx.total)}</span>
                </div>
              </div>

              {/* Balance Check */}
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-zinc-400">Metode Pembayaran</div>
                  <div className="font-medium text-zinc-800">Saldo Merah Putih Pay</div>
                </div>
                <div className="font-mono font-semibold text-zinc-700">{formatRupiah(saldo)}</div>
              </div>

              <button
                onClick={handleConfirmToPin}
                className="w-full py-3 rounded-full bg-[#ED1C24] hover:bg-[#D3151D] text-white font-semibold text-xs cursor-pointer shadow-md"
              >
                Lanjut Masukkan PIN
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. PIN Verification Keypad Modal */}
      <AnimatePresence>
        {isPinModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-[320px] bg-white rounded-3xl p-6 shadow-2xl text-center space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-5" />
                <h3 className="font-bold text-zinc-900 text-sm">Masukkan PIN Keamanan</h3>
                <button
                  onClick={() => setIsPinModalOpen(false)}
                  className="p-1 rounded-full text-zinc-400 hover:bg-zinc-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-zinc-500">
                Gunakan PIN demo apa saja (contoh: 123456)
              </p>

              {/* 6 PIN Dot Indicators */}
              <div className="flex items-center justify-center gap-2.5 py-2">
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full border transition-all ${
                      pinDigits.length > idx
                        ? "bg-[#ED1C24] border-[#ED1C24] scale-110"
                        : "border-zinc-300 bg-zinc-100"
                    }`}
                  />
                ))}
              </div>

              {pinError && <div className="text-xs text-red-600 font-medium">{pinError}</div>}

              {/* Keypad Grid */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"].map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      if (key === "C") setPinDigits("");
                      else if (key === "⌫") handlePinBackspace();
                      else handlePinInput(key);
                    }}
                    className="h-12 rounded-xl bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-base font-bold font-mono text-zinc-800 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    {key}
                  </button>
                ))}
              </div>

              {isProcessing && (
                <div className="pt-2 text-xs text-[#ED1C24] font-medium animate-pulse">
                  Memproses transaksi...
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PpobLiveSimulator;
