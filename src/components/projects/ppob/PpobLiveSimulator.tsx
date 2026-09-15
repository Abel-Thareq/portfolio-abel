"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Search,
  X,
  ArrowLeft,
  CheckCircle2,
  Receipt,
  Download,
  QrCode,
  Bell,
  Headset,
  History,
  Lock,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  Star,
  MapPin,
  Truck,
  Smartphone,
  Laptop,
  Monitor,
  Printer,
  MessageCircle,
  Mail,
  Phone,
  HelpCircle,
  Trash2,
  KeyRound,
  Plus,
  Minus,
  Check,
  Share2,
  ShoppingCart,
  Maximize2,
  Minimize2,
} from "lucide-react";

// ================= TYPES & DATA =================
export type TabIndex = 0 | 1 | 2 | 3 | 4;

export type FlowScreen =
  | "home"
  | "tagihan"
  | "tagihan_detail"
  | "transfer"
  | "tariktunai"
  | "ewallet"
  | "emoney"
  | "pdam"
  | "topupgame"
  | "evoucher"
  | "lainnya"
  | "byu"
  | "pulsa"
  | "listrik"
  | "receipt"
  | "shop_detail"
  | "shop_checkout"
  | "shop_success"
  | "change_pin"
  | "my_devices"
  | "pengaturan_struk"
  | "help_center";

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

// 22 Authentic Tagihan Menu Items from Flutter TagihanPage
const TAGIHAN_ITEMS = [
  { id: "listrik", title: "Listrik", icon: "/assets/ppob/images/listrik.png", desc: "Token & Tagihan PLN", sampleId: "14298102910", defaultAmount: 125000 },
  { id: "bpjs", title: "BPJS", icon: "/assets/ppob/images/bpjs.png", desc: "BPJS Kesehatan Keluarga", sampleId: "0001-2948-1920", defaultAmount: 70000 },
  { id: "kartukredit", title: "Kartu Kredit", icon: "/assets/ppob/images/kartukredit.png", desc: "BCA, Mandiri, BRI, BNI", sampleId: "4512-8819-2041", defaultAmount: 450000 },
  { id: "cicilan", title: "Cicilan", icon: "/assets/ppob/images/cicilan.png", desc: "Adira, FIF, BAF, WOM", sampleId: "0192839102", defaultAmount: 620000 },
  { id: "kai", title: "KAI", icon: "/assets/ppob/images/kai.png", desc: "Tiket Kereta Api Indonesia", sampleId: "KAI-2026-9918", defaultAmount: 185000 },
  { id: "pdam", title: "PDAM", icon: "/assets/ppob/images/pdam.png", desc: "Tagihan Air Bersih PDAM", sampleId: "1092819201", defaultAmount: 84000 },
  { id: "pendidikan", title: "Pendidikan", icon: "/assets/ppob/images/pendidikan.png", desc: "SPP Sekolah & Universitas", sampleId: "2024-8819-019", defaultAmount: 1500000 },
  { id: "asuransi", title: "Asuransi", icon: "/assets/ppob/images/asuransi.png", desc: "Prudential, Allianz, AXA", sampleId: "ASR-99182901", defaultAmount: 350000 },
  { id: "pbb", title: "PBB", icon: "/assets/ppob/images/pbb.png", desc: "Pajak Bumi & Bangunan", sampleId: "32.73.010.002.019", defaultAmount: 210000 },
  { id: "pascabayar", title: "Pascabayar", icon: "/assets/ppob/images/pascabayar.png", desc: "Halo, Matrix, XL Prioritas", sampleId: "0811-9876-5432", defaultAmount: 165000 },
  { id: "snpmb", title: "SNPMB", icon: "/assets/ppob/images/snpmb.png", desc: "Biaya UTBK SNPMB 2026", sampleId: "SNPMB-2026-4819", defaultAmount: 200000 },
  { id: "samsat", title: "SAMSAT", icon: "/assets/ppob/images/samsat.png", desc: "Pajak Kendaraan E-Samsat", sampleId: "B 1948 TQR", defaultAmount: 430000 },
  { id: "telkom", title: "Telkom", icon: "/assets/ppob/images/telkom.png", desc: "IndiHome & Telepon Rumah", sampleId: "122981029101", defaultAmount: 345000 },
  { id: "kua", title: "Bayar KUA", icon: "/assets/ppob/images/kua.png", desc: "PNBP Nikah Kemenag", sampleId: "KUA-9918-2026", defaultAmount: 600000 },
  { id: "einvoicing", title: "E-Invoicing", icon: "/assets/ppob/images/einvoicing.png", desc: "Faktur Pajak Elektronik", sampleId: "INV-88192019", defaultAmount: 120000 },
  { id: "pgn", title: "PGN", icon: "/assets/ppob/images/pgn.png", desc: "Gas Negara Indonesia", sampleId: "PGN-019283910", defaultAmount: 92000 },
  { id: "etilang", title: "E-Tilang", icon: "/assets/ppob/images/etilang.png", desc: "Denda Tilang Kejaksaan", sampleId: "TLG-2026-8819", defaultAmount: 250000 },
  { id: "bayarpaspor", title: "Bayar Paspor", icon: "/assets/ppob/images/bayarpaspor.png", desc: "PNBP Paspor Imigrasi", sampleId: "PSP-991829102", defaultAmount: 350000 },
  { id: "tvkabelinternet", title: "TV & Internet", icon: "/assets/ppob/images/tvkabelinternet.png", desc: "First Media, MNC, MyRep", sampleId: "FM-019283019", defaultAmount: 389000 },
  { id: "pajakdaerah", title: "Pajak Daerah", icon: "/assets/ppob/images/pajakdaerah.png", desc: "Restoran, Reklame, Parkir", sampleId: "PJK-3201-9918", defaultAmount: 175000 },
  { id: "iplproperti", title: "IPL & Properti", icon: "/assets/ppob/images/iplproperti.png", desc: "Iuran Pengelolaan Lingkungan", sampleId: "UNIT-B12-08", defaultAmount: 480000 },
  { id: "penerimaannegara", title: "Penerimaan Negara", icon: "/assets/ppob/images/penerimaannegara.png", desc: "MPN Pajak & Bea Cukai", sampleId: "MPN-8819201928", defaultAmount: 500000 },
];

// Bank List from TransferBankPage
const BANK_LIST = [
  { name: "Bank BRI", code: "002", icon: "/assets/ppob/images/bank_bri.png" },
  { name: "Bank Mandiri", code: "008", icon: "/assets/ppob/images/bank_mandiri.png" },
  { name: "Bank BNI", code: "009", icon: "/assets/ppob/images/bank_bni.png" },
  { name: "Bank BCA", code: "014", icon: "/assets/ppob/images/bank_bca.png" },
  { name: "Bank BSI", code: "451", icon: "/assets/ppob/images/bank_bsi.png" },
  { name: "Bank BTN", code: "200", icon: "/assets/ppob/images/bank_btn.png" },
  { name: "Bank CIMB NIAGA", code: "022", icon: "/assets/ppob/images/bank_cimb.png" },
  { name: "Bank DANAMON", code: "011", icon: "/assets/ppob/images/bank_danamon.png" },
  { name: "Bank PERMATA", code: "013", icon: "/assets/ppob/images/bank_permata.png" },
  { name: "Bank PANIN", code: "019", icon: "/assets/ppob/images/bank_panin.png" },
];

// E-Wallet Items from EwalletPage
const EWALLET_ITEMS = [
  { id: "gopay", title: "GoPay", icon: "/assets/ppob/images/gopay.png" },
  { id: "ovo", title: "OVO", icon: "/assets/ppob/images/ovo.png" },
  { id: "dana", title: "DANA", icon: "/assets/ppob/images/dana.png" },
  { id: "shopeepay", title: "ShopeePay", icon: "/assets/ppob/images/shopeepay.png" },
  { id: "linkaja", title: "LinkAja", icon: "/assets/ppob/images/linkaja.png" },
  { id: "isaku", title: "i.saku", icon: "/assets/ppob/images/isaku.png" },
];

// Authentic Shop Products from Flutter ShopPage
const SHOP_PRODUCTS = [
  {
    id: "prod-1",
    title: "Keyboard Mechanical RGB",
    price: 350000,
    originalPrice: 500000,
    rating: "4.9",
    sales: "15+ terjual",
    stock: 24,
    weight: "0.8 kg",
    category: "Elektronik",
    location: "Kota Jakarta",
    image: "/assets/ppob/images/Keyboard_Mechanical.png",
    description: "Keyboard Mechanical Outemu Blue Switch dengan RGB backlight 16 mode, anti-ghosting full keys, dan build kokoh untuk loket kasir & operasional PPOB.",
  },
  {
    id: "prod-2",
    title: "Headphone Gaming Bass",
    price: 200000,
    originalPrice: 300000,
    rating: "4.6",
    sales: "25+ terjual",
    stock: 35,
    weight: "0.4 kg",
    category: "Elektronik",
    location: "Kota Yogyakarta",
    image: "/assets/ppob/images/Headphone_Gaming.png",
    description: "Headset dengan driver 50mm dynamic sound, mikrofon noise-cancelling, earpad empuk memory foam, kompatibel untuk PC, laptop & smartphone.",
  },
  {
    id: "prod-3",
    title: "Laptop Stand Alumunium",
    price: 80000,
    originalPrice: 120000,
    rating: "4.5",
    sales: "40+ terjual",
    stock: 50,
    weight: "0.5 kg",
    category: "Office & Stationery",
    location: "Kota Semarang",
    image: "/assets/ppob/images/Laptop_Stand.png",
    description: "Stand laptop ergonomis dengan material full alumunium alloy, 6 level pengaturan ketinggian, dan bantalan silikon anti-slip.",
  },
  {
    id: "prod-4",
    title: "Cooling Pad Laptop Silent",
    price: 25000,
    originalPrice: 40000,
    rating: "5.0",
    sales: "20+ terjual",
    stock: 42,
    weight: "0.6 kg",
    category: "Elektronik",
    location: "Kota Tasikmalaya",
    image: "/assets/ppob/images/Cooling_Pad_Laptop.png",
    description: "Cooler laptop dengan 2 kipas LED silent cooling fan 140mm, menjaga suhu laptop tetap stabil saat operasional PPOB seharian.",
  },
  {
    id: "prod-5",
    title: "Mouse Wireless Ergonomis",
    price: 75000,
    originalPrice: 120000,
    rating: "4.8",
    sales: "50+ terjual",
    stock: 60,
    weight: "0.2 kg",
    category: "Elektronik",
    location: "Kota Bandung",
    image: "/assets/ppob/images/Mouse_Wireless.png",
    description: "Mouse nirkabel 2.4GHz dengan nano receiver, sensor presisi 1600 DPI hemat daya baterai hingga 12 bulan pemakaian.",
  },
  {
    id: "prod-6",
    title: "Webcam HD 1080p Mic",
    price: 150000,
    originalPrice: 200000,
    rating: "4.7",
    sales: "30+ terjual",
    stock: 18,
    weight: "0.3 kg",
    category: "Elektronik",
    location: "Kota Surabaya",
    image: "/assets/ppob/images/Webcam_HD.png",
    description: "Webcam resolusi Full HD 1080p 30fps dengan built-in dual microphone stereo untuk video conference dan verifikasi KYC nasabah.",
  },
  {
    id: "prod-7",
    title: "Notebook Premium Hardcover",
    price: 45000,
    originalPrice: 60000,
    rating: "4.3",
    sales: "35+ terjual",
    stock: 80,
    weight: "0.3 kg",
    category: "Office & Stationery",
    location: "Kota Bandung",
    image: "/assets/ppob/images/Notebook_Premium.png",
    description: "Buku catatan kas harian PPOB 160 halaman kertas bookpaper 80gsm, jilid jahit benang rapi dengan bookmark pita elegan.",
  },
  {
    id: "prod-8",
    title: "Pulpen Parker Eksklusif",
    price: 120000,
    originalPrice: 180000,
    rating: "4.8",
    sales: "28+ terjual",
    stock: 15,
    weight: "0.1 kg",
    category: "Office & Stationery",
    location: "Kota Jakarta",
    image: "/assets/ppob/images/Pulpen_Parker.png",
    description: "Pulpen rollerball tinta hitam pekat dengan bodi stainless steel bergaransi resmi, cocok untuk tanda tangan kontrak dan dokumen penting.",
  },
];

// E-Money Items from EMoneyPage
const EMONEY_ITEMS = [
  { id: "brizzi", title: "BRIZZI", icon: "/assets/ppob/images/brizzi.png", issuer: "Bank BRI" },
  { id: "bnitapcash", title: "BNI TapCash", icon: "/assets/ppob/images/bnitapcash.png", issuer: "Bank BNI" },
  { id: "mandiriemoney", title: "Mandiri e-Money", icon: "/assets/ppob/images/mandiriemoney.png", issuer: "Bank Mandiri" },
  { id: "flazz", title: "Flazz BCA", icon: "/assets/ppob/images/flazz.png", issuer: "Bank BCA" },
];

// Popular Game Items from TopUpGamePage
const GAME_ITEMS = [
  { id: "mlbb", title: "Mobile Legend", icon: "/assets/ppob/images/mobilelegend.png", publisher: "Moonton" },
  { id: "ff", title: "Free Fire", icon: "/assets/ppob/images/freefire.png", publisher: "Garena" },
  { id: "pubgm", title: "PUBG Mobile", icon: "/assets/ppob/images/pubgmobile.png", publisher: "Level Infinite" },
  { id: "genshin", title: "Genshin Impact", icon: "/assets/ppob/images/genshinimpact.png", publisher: "HoYoverse" },
  { id: "codm", title: "Call of Duty Mobile", icon: "/assets/ppob/images/codm.png", publisher: "Garena" },
  { id: "valorant", title: "Valorant", icon: "/assets/ppob/images/valorant.png", publisher: "Riot Games" },
  { id: "steam", title: "Steam Sea", icon: "/assets/ppob/images/steamsea.png", publisher: "Valve" },
  { id: "hok", title: "Honor of Kings", icon: "/assets/ppob/images/honorofkings.png", publisher: "Tencent Games" },
];

// Initial Transactions
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
  // Navigation Stack (supports deep push and pop like Flutter Navigator)
  const [navStack, setNavStack] = useState<FlowScreen[]>(["home"]);
  const currentFlow = navStack[navStack.length - 1] || "home";

  // Active Bottom Nav Tab (0: Shop, 1: Mutasi, 2: Home, 3: Mitra, 4: Akun)
  const [activeTab, setActiveTab] = useState<TabIndex>(2);

  // Balances and Records
  const [saldo, setSaldo] = useState<number>(1450000);
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [activeReceipt, setActiveReceipt] = useState<TransactionRecord | null>(null);

  // Home Search
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Flow Sub-States:
  // Tagihan Detail
  const [selectedTagihan, setSelectedTagihan] = useState<(typeof TAGIHAN_ITEMS)[0]>(TAGIHAN_ITEMS[0]);
  const [tagihanInputId, setTagihanInputId] = useState<string>("");

  // Transfer Bank
  const [selectedBank, setSelectedBank] = useState<(typeof BANK_LIST)[0]>(BANK_LIST[3]); // BCA
  const [rekeningInput, setRekeningInput] = useState<string>("8819 2041 90");
  const [transferAmount, setTransferAmount] = useState<number>(100000);

  // Tarik Tunai
  const [selectedJalur, setSelectedJalur] = useState<string>("Indomaret - Ceriamart");
  const [tarikNominal, setTarikNominal] = useState<number>(100000);

  // E-Wallet
  const [selectedEwallet, setSelectedEwallet] = useState<(typeof EWALLET_ITEMS)[0]>(EWALLET_ITEMS[0]);
  const [ewalletPhone, setEwalletPhone] = useState<string>("0812-3456-7890");
  const [ewalletNominal, setEwalletNominal] = useState<number>(50000);

  // E-Money
  const [selectedEmoney, setSelectedEmoney] = useState<(typeof EMONEY_ITEMS)[0]>(EMONEY_ITEMS[2]); // Mandiri
  const [emoneyCardNumber, setEmoneyCardNumber] = useState<string>("6032 9918 2041 8819");
  const [emoneyNominal, setEmoneyNominal] = useState<number>(100000);

  // PDAM
  const [pdamRegion, setPdamRegion] = useState<string>("PDAM Tirta Moedal Semarang");
  const [pdamId, setPdamId] = useState<string>("1092819201");

  // Top Up Game
  const [selectedGame, setSelectedGame] = useState<(typeof GAME_ITEMS)[0]>(GAME_ITEMS[0]);
  const [gameUserId, setGameUserId] = useState<string>("19482019");
  const [gameZoneId, setGameZoneId] = useState<string>("2019");
  const [gamePackage, setGamePackage] = useState<{ title: string; price: number }>({
    title: "86 Diamonds",
    price: 21500,
  });

  // Pulsa Flow
  const [pulsaProvider, setPulsaProvider] = useState<string>("Telkomsel");
  const [pulsaPhone, setPulsaPhone] = useState<string>("0812-9876-5432");
  const [pulsaNominal, setPulsaNominal] = useState<{ label: string; amount: number; price: number }>({
    label: "Pulsa 50.000",
    amount: 50000,
    price: 50200,
  });

  // Listrik Flow
  const [listrikType, setListrikType] = useState<"token" | "tagihan">("token");
  const [meterInput, setMeterInput] = useState<string>("3201-9982-1029");
  const [listrikTokenNominal, setListrikTokenNominal] = useState<{ label: string; amount: number; price: number }>({
    label: "Token 50.000",
    amount: 50000,
    price: 52500,
  });

  // PIN & Payment Confirmation Modals
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [pinDigits, setPinDigits] = useState<string>("");
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

  // Shop Flow State
  const [selectedShopProduct, setSelectedShopProduct] = useState<(typeof SHOP_PRODUCTS)[0]>(SHOP_PRODUCTS[0]);
  const [shopQty, setShopQty] = useState<number>(1);
  const [shopCategory, setShopCategory] = useState<string>("Semua");
  const [cartToast, setCartToast] = useState<string | null>(null);
  const [activeShopOrder, setActiveShopOrder] = useState<{
    orderId: string;
    product: (typeof SHOP_PRODUCTS)[0];
    qty: number;
    total: number;
    date: string;
    courier: string;
  } | null>(null);

  // Akun: Change PIN State
  const [oldPinInput, setOldPinInput] = useState<string>("");
  const [newPinInput, setNewPinInput] = useState<string>("");
  const [confirmPinInput, setConfirmPinInput] = useState<string>("");
  const [pinChangeSuccess, setPinChangeSuccess] = useState<boolean>(false);

  // Akun: My Devices State
  const [connectedDevices, setConnectedDevices] = useState([
    { id: "dev-1", name: "iPhone 15 Pro", os: "iOS 18.1 • Aplikasi Resmi", ip: "180.252.112.45", location: "Tasikmalaya, Jawa Barat", isCurrent: true, lastActive: "Online Sekarang" },
    { id: "dev-2", name: "MacBook Pro M2", os: "macOS Sequoia • Safari 18", ip: "114.124.200.12", location: "Bandung, Jawa Barat", isCurrent: false, lastActive: "2 jam yang lalu" },
    { id: "dev-3", name: "PC Desktop Windows 11", os: "Windows 11 • Chrome 128", ip: "103.111.89.20", location: "Jakarta Selatan", isCurrent: false, lastActive: "Kemarin, 19:30" },
  ]);

  // Akun: Receipt Settings State
  const [storeName, setStoreName] = useState<string>("Loket Abel Cell PPOB");
  const [storeAddress, setStoreAddress] = useState<string>("Jl. Merdeka No. 45, Tasikmalaya");
  const [storePhone, setStorePhone] = useState<string>("0812-3456-7890");
  const [receiptFooter, setReceiptFooter] = useState<string>("Terima Kasih Atas Kepercayaan Anda!");
  const [receiptPaper, setReceiptPaper] = useState<"58mm" | "80mm">("58mm");
  const [receiptSavedFeedback, setReceiptSavedFeedback] = useState<boolean>(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Agen Center (Tab 3) State matching Flutter agent_center_page.dart
  const [expandedAgentFaq, setExpandedAgentFaq] = useState<Record<string, boolean>>({
    "Apa itu Agen Center?": true,
    "Apa Kelebihan menjadi Master?": false,
    "Bagaimana Cara menjadi Master?": false,
  });
  const [isMasterMode, setIsMasterMode] = useState<boolean>(false);
  const [komisiClaimed, setKomisiClaimed] = useState<boolean>(false);

  // Fullscreen Device Simulator Mode Toggle
  const [isFullscreenMode, setIsFullscreenMode] = useState<boolean>(false);

  // Scroll Container Ref for smooth tab resets
  const mainScrollRef = useRef<HTMLDivElement>(null);

  // Automatically reset scroll position when switching tabs or flow screens
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
  }, [activeTab, currentFlow]);

  // Dynamic Status Bar Color & Frosted Glass adaptiveness
  const isWhiteTop = useMemo(() => {
    if (
      currentFlow === "shop_detail" ||
      currentFlow === "shop_checkout" ||
      currentFlow === "change_pin" ||
      currentFlow === "my_devices" ||
      currentFlow === "pengaturan_struk" ||
      currentFlow === "help_center" ||
      currentFlow === "receipt"
    ) {
      return true;
    }
    if (currentFlow === "home") {
      return activeTab === 0 || activeTab === 1 || activeTab === 4;
    }
    return false;
  }, [currentFlow, activeTab]);

  const openShopProductDetail = (prod: (typeof SHOP_PRODUCTS)[0]) => {
    setSelectedShopProduct(prod);
    setShopQty(1);
    navigateTo("shop_detail");
  };

  const handleStartShopCheckout = () => {
    navigateTo("shop_checkout");
  };

  const handleStartShopPayment = () => {
    const total = selectedShopProduct.price * shopQty + 13000;
    initiateTransaction({
      type: "shop",
      title: `Beli ${selectedShopProduct.title}`,
      provider: "Shop PPOB",
      targetNumber: "ORD-MPP-" + Math.floor(100000 + Math.random() * 900000),
      amount: total,
      adminFee: 1000,
      customerName: "Abel Thareq",
    });
  };

  // Currency Formatter
  const formatRupiah = (val: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val).replace("IDR", "Rp").trim();
  };

  // Stack Navigation Helper
  const navigateTo = (screen: FlowScreen) => {
    setNavStack((prev) => [...prev, screen]);
  };

  const handleBack = () => {
    setNavStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : ["home"]));
  };

  const handleResetToHome = () => {
    setNavStack(["home"]);
  };

  // Open Tagihan Details
  const handleOpenTagihanDetail = (item: (typeof TAGIHAN_ITEMS)[0]) => {
    setSelectedTagihan(item);
    setTagihanInputId(item.sampleId);
    navigateTo("tagihan_detail");
  };

  // Quick Deposit Button Handler
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
    navigateTo("receipt");
  };

  // Trigger Confirmation Modal for any Flow
  const initiateTransaction = (data: {
    type: string;
    targetNumber: string;
    title: string;
    provider: string;
    amount: number;
    adminFee: number;
    tokenNumber?: string;
    customerName?: string;
  }) => {
    setPendingTx({
      ...data,
      total: data.amount + data.adminFee,
    });
    setIsConfirmModalOpen(true);
  };

  // Move from Confirmation to PIN
  const handleConfirmToPin = () => {
    setIsConfirmModalOpen(false);
    setPinDigits("");
    setIsPinModalOpen(true);
  };

  // PIN Pad Input
  const handlePinInput = (digit: string) => {
    if (pinDigits.length < 6) {
      const next = pinDigits + digit;
      setPinDigits(next);
      if (next.length === 6) {
        executePayment(next);
      }
    }
  };

  const handlePinBackspace = () => {
    setPinDigits((prev) => prev.slice(0, -1));
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
          customerName: pendingTx.customerName || "Abel Thareq",
        };
        setTransactions((prev) => [newRecord, ...prev]);

        if (pendingTx.type === "shop") {
          setActiveShopOrder({
            orderId: newRecord.refNumber,
            product: selectedShopProduct,
            qty: shopQty,
            total: pendingTx.total,
            date: newRecord.date,
            courier: "J&T Express (Resi: JT" + Math.floor(100000000 + Math.random() * 900000000) + ")",
          });
          navigateTo("shop_success");
        } else {
          setActiveReceipt(newRecord);
          navigateTo("receipt");
        }
        setPendingTx(null);
      }
    }, 600);
  };

  // Search Results filtering
  const allServices = useMemo(
    () => [
      { title: "Transfer Bank", icon: "/assets/ppob/images/transfer.png", action: () => navigateTo("transfer") },
      { title: "Pulsa/Data", icon: "/assets/ppob/images/pulsa.png", action: () => navigateTo("pulsa") },
      { title: "E Wallet", icon: "/assets/ppob/images/ewallet.png", action: () => navigateTo("ewallet") },
      { title: "Lainnya", icon: "/assets/ppob/images/lainnya.png", action: () => navigateTo("lainnya") },
      { title: "Tagihan", icon: "/assets/ppob/images/tagihan.png", action: () => navigateTo("tagihan") },
      { title: "Cash Service", icon: "/assets/ppob/images/atm.png", action: () => navigateTo("tariktunai") },
      { title: "E Money", icon: "/assets/ppob/images/emoney.png", action: () => navigateTo("emoney") },
      { title: "PDAM", icon: "/assets/ppob/images/pdam.png", action: () => navigateTo("pdam") },
      { title: "E Voucher", icon: "/assets/ppob/images/evoucher.png", action: () => navigateTo("evoucher") },
      { title: "Top Up Game", icon: "/assets/ppob/images/topup.png", action: () => navigateTo("topupgame") },
      { title: "Listrik PLN", icon: "/assets/ppob/images/listrik.png", action: () => navigateTo("listrik") },
      { title: "by.U Promo", icon: "/assets/ppob/images/byu.png", action: () => navigateTo("byu") },
      ...TAGIHAN_ITEMS.map((item) => ({
        title: item.title,
        icon: item.icon,
        action: () => handleOpenTagihanDetail(item),
      })),
    ],
    []
  );

  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allServices.filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, allServices]);

  return (
    <div className="flex flex-col items-center select-none font-sans w-full">
      {/* Simulator Control Bar */}
      <div className="flex items-center justify-between w-full max-w-[360px] sm:max-w-[385px] mb-3 px-2">
        <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Interactive Live Demo</span>
        </div>
        <button
          type="button"
          onClick={() => setIsFullscreenMode(!isFullscreenMode)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium transition cursor-pointer"
        >
          {isFullscreenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span>{isFullscreenMode ? "Tutup Layar Penuh" : "Mode Layar Penuh"}</span>
        </button>
      </div>

      {/* Phone Mockup Shell (Centered or Fullscreen Modal) */}
      <div
        className={
          isFullscreenMode
            ? "fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-6 overflow-y-auto"
            : "relative flex flex-col items-center"
        }
      >
        {isFullscreenMode && (
          <div className="w-full max-w-[420px] flex justify-end mb-2 px-2">
            <button
              onClick={() => setIsFullscreenMode(false)}
              className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-medium cursor-pointer transition"
            >
              <X className="w-4 h-4" />
              <span>Tutup Layar Penuh</span>
            </button>
          </div>
        )}

        {/* Phone Hardware Shell */}
        <div className="relative w-[360px] sm:w-[385px] h-[730px] sm:h-[760px] bg-black rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1),0_0_0_8px_#27272A] border-[4px] border-zinc-700/80 flex flex-col overflow-hidden">
          {/* Dynamic Island Speaker */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-between px-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1C1C1E] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0A84FF]/60 animate-pulse" />
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#1C1C1E]" />
          </div>

          {/* Inner Phone Screen */}
          <div className="relative w-full h-full bg-[#F8F8FF] rounded-[38px] overflow-hidden no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* Status Bar with Authentic Integration */}
            <div
              className={`absolute top-0 left-0 right-0 h-9 pt-1 px-6 flex items-center justify-between text-[11px] font-semibold z-40 pointer-events-none transition-colors duration-200 ${
                isWhiteTop
                  ? "bg-white/85 text-zinc-800 border-b border-black/[0.04] backdrop-blur-md"
                  : "bg-transparent text-white"
              }`}
            >
              <span>09:41</span>
              <div className="flex items-center gap-1.5 opacity-90">
                <span className="text-[10px] font-mono">5G</span>
                <div
                  className={`w-4 h-2 border rounded-[2px] p-[1px] flex items-center ${
                    isWhiteTop ? "border-zinc-800" : "border-white"
                  }`}
                >
                  <div
                    className={`w-full h-full rounded-[1px] ${
                      isWhiteTop ? "bg-zinc-800" : "bg-white"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* ================= FLOW SCREENS SWITCHER ================= */}
            <div
              ref={mainScrollRef}
              className="w-full h-full overflow-y-auto relative pb-20 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
            {/* 1. FLOW: RECEIPT (Struk Transaksi) */}
            {currentFlow === "receipt" && activeReceipt && (
              <div className="p-4 pt-11 min-h-full bg-zinc-50 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handleResetToHome}
                    className="p-2 rounded-full hover:bg-zinc-200 text-zinc-700 cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="font-semibold text-zinc-900 text-sm">Struk Transaksi</h3>
                  <div className="w-8" />
                </div>

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
                      <span className="text-zinc-800 font-mono">{formatRupiah(activeReceipt.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Biaya Admin</span>
                      <span className="text-zinc-800 font-mono">{formatRupiah(activeReceipt.adminFee)}</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-200 flex justify-between font-bold text-sm">
                      <span className="text-zinc-900">Total Pembayaran</span>
                      <span className="text-[#ED1C24] font-mono">{formatRupiah(activeReceipt.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => alert("Struk berhasil disimpan ke galeri!")}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-zinc-300 text-xs font-medium text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Simpan Struk
                  </button>
                  <button
                    onClick={handleResetToHome}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#ED1C24] text-xs font-medium text-white hover:bg-[#D3151D] cursor-pointer"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            )}

            {/* 2. FLOW: TAGIHAN (Authentic TagihanPage with 22 items) */}
            {currentFlow === "tagihan" && (
              <div className="min-h-full bg-white flex flex-col">
                {/* Flutter Authentic Header for TagihanPage */}
                <div className="relative h-[88px] w-full">
                  <Image
                    src="/assets/ppob/icons/backgroundtop.svg"
                    alt="Header Background"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Back Button */}
                  <button
                    onClick={handleBack}
                    className="absolute top-8 left-2.5 p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer z-10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  {/* Floating Box: "Daftar Tagihan & Bayar" */}
                  <div className="absolute -bottom-2.5 left-5 right-5 bg-white py-1.5 px-4 rounded-xl border border-zinc-200 shadow-[0_4px_10px_rgba(0,0,0,0.06)] text-center">
                    <span className="text-xs font-bold text-[#ED1C24]">Daftar Tagihan & Bayar</span>
                  </div>
                </div>

                {/* 22 Menu Items Grid */}
                <div className="p-4 pt-5.5 grid grid-cols-4 gap-y-3 gap-x-2">
                  {TAGIHAN_ITEMS.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleOpenTagihanDetail(item)}
                      className="flex flex-col items-center cursor-pointer group"
                    >
                      <div className="w-[58px] h-[58px] rounded-xl bg-white border border-zinc-200/90 shadow-xs flex items-center justify-center p-1.5 group-hover:scale-105 group-hover:border-red-400 group-hover:shadow-md transition-all">
                        <Image
                          src={item.icon}
                          alt={item.title}
                          width={42}
                          height={42}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-[10px] font-medium text-zinc-800 mt-1.5 text-center leading-tight line-clamp-2 w-14">
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. FLOW: TAGIHAN DETAIL (Inquiry form for selected bill) */}
            {currentFlow === "tagihan_detail" && (
              <div className="p-4 bg-[#F8F8FF] min-h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={handleBack}
                    className="p-1.5 rounded-full hover:bg-zinc-200 text-zinc-700 cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="font-semibold text-zinc-900 text-sm">Pembayaran {selectedTagihan.title}</h3>
                </div>

                {/* Info Card */}
                <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 p-1 flex items-center justify-center flex-shrink-0">
                    <Image
                      src={selectedTagihan.icon}
                      alt={selectedTagihan.title}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-zinc-900">{selectedTagihan.title}</h4>
                    <p className="text-[11px] text-zinc-500">{selectedTagihan.desc}</p>
                  </div>
                </div>

                {/* Customer Input Card */}
                <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs space-y-3 mb-4">
                  <div>
                    <label className="text-[11px] font-medium text-zinc-600">
                      ID Pelanggan / Nomor Tagihan
                    </label>
                    <div className="mt-1 flex items-center justify-between border border-zinc-200 rounded-xl px-3 py-2 bg-zinc-50/50">
                      <input
                        type="text"
                        value={tagihanInputId}
                        onChange={(e) => setTagihanInputId(e.target.value)}
                        placeholder="Masukkan nomor tagihan..."
                        className="text-xs font-semibold text-zinc-900 w-full outline-none font-mono"
                      />
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        AKTIF
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-400">
                    Pastikan nomor tagihan atau ID pelanggan Anda sudah sesuai.
                  </div>
                </div>

                {/* Tagihan Summary Breakdown */}
                <div className="bg-white p-4 rounded-2xl border border-zinc-200 space-y-2.5 text-xs mb-4">
                  <div className="font-semibold text-zinc-800 pb-1 border-b border-zinc-100">
                    Detail Tagihan Bulan Ini
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Nama Pelanggan</span>
                    <span className="font-medium text-zinc-800">Abel Thareq</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Periode</span>
                    <span className="text-zinc-800">September 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Tagihan Dasar</span>
                    <span className="font-mono text-zinc-800">{formatRupiah(selectedTagihan.defaultAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Biaya Admin PPOB</span>
                    <span className="font-mono text-zinc-800">Rp 2.500</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-200 flex justify-between font-bold text-sm">
                    <span className="text-zinc-900">Total Pembayaran</span>
                    <span className="text-[#ED1C24] font-mono">
                      {formatRupiah(selectedTagihan.defaultAmount + 2500)}
                    </span>
                  </div>
                </div>

                {/* Bottom Sticky Action */}
                <div className="mt-auto pt-3 border-t border-zinc-200 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-zinc-500">Total Tagihan</div>
                    <div className="text-base font-bold text-[#ED1C24] font-mono">
                      {formatRupiah(selectedTagihan.defaultAmount + 2500)}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      initiateTransaction({
                        type: selectedTagihan.id,
                        targetNumber: tagihanInputId || selectedTagihan.sampleId,
                        title: `Tagihan ${selectedTagihan.title}`,
                        provider: selectedTagihan.title,
                        amount: selectedTagihan.defaultAmount,
                        adminFee: 2500,
                        customerName: "Abel Thareq",
                      })
                    }
                    className="px-6 py-2.5 rounded-full bg-[#ED1C24] hover:bg-[#D3151D] text-white text-xs font-semibold cursor-pointer shadow-md"
                  >
                    Bayar Sekarang
                  </button>
                </div>
              </div>
            )}

            {/* 4. FLOW: TRANSFER BANK (TransferBankPage) */}
            {currentFlow === "transfer" && (
              <div className="min-h-full bg-white flex flex-col">
                <div className="relative h-[88px] w-full">
                  <Image
                    src="/assets/ppob/icons/backgroundtop.svg"
                    alt="Header Background"
                    fill
                    className="object-cover"
                    priority
                  />
                  <button
                    onClick={handleBack}
                    className="absolute top-8 left-2.5 p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer z-10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="absolute -bottom-2.5 left-5 right-5 bg-white py-1.5 px-4 rounded-xl border border-zinc-200 shadow-[0_4px_10px_rgba(0,0,0,0.06)] text-center">
                    <span className="text-xs font-bold text-[#ED1C24]">Pilih Bank Tujuan</span>
                  </div>
                </div>

                <div className="p-4 pt-5.5 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-800">Bank Tujuan</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {BANK_LIST.slice(0, 6).map((bank) => (
                        <div
                          key={bank.name}
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                            selectedBank.name === bank.name
                              ? "border-[#ED1C24] bg-red-50/40 ring-1 ring-red-400"
                              : "border-zinc-200 bg-white hover:border-zinc-300"
                          }`}
                        >
                          <Image
                            src={bank.icon}
                            alt={bank.name}
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                          <span className="text-[11px] font-semibold text-zinc-800 truncate">{bank.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-800">Nomor Rekening / Alias</label>
                    <div className="mt-1.5 border border-zinc-200 rounded-xl px-3 py-2.5 bg-white">
                      <input
                        type="text"
                        value={rekeningInput}
                        onChange={(e) => setRekeningInput(e.target.value)}
                        placeholder="Masukkan nomor rekening..."
                        className="text-xs font-semibold text-zinc-900 w-full outline-none font-mono"
                      />
                    </div>
                    <span className="text-[10px] text-zinc-400 mt-1 block">Minimal 10 digit nomor rekening</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-800">Nominal Transfer</label>
                    <div className="grid grid-cols-3 gap-2 mt-1.5">
                      {[50000, 100000, 250000, 500000, 1000000, 2000000].map((nom) => (
                        <button
                          key={nom}
                          onClick={() => setTransferAmount(nom)}
                          className={`py-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                            transferAmount === nom
                              ? "bg-[#ED1C24] text-white border-[#ED1C24]"
                              : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                          }`}
                        >
                          {formatRupiah(nom)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() =>
                        initiateTransaction({
                          type: "transfer",
                          targetNumber: rekeningInput,
                          title: `Transfer ke ${selectedBank.name}`,
                          provider: selectedBank.name,
                          amount: transferAmount,
                          adminFee: 2500,
                          customerName: "Rizky Firmansyah",
                        })
                      }
                      className="w-full py-3 rounded-xl bg-[#ED1C24] hover:bg-[#D3151D] text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      Lanjutkan Transfer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 5. FLOW: CASH SERVICE / TARIK TUNAI (TarikTunaiSatuPage) */}
            {currentFlow === "tariktunai" && (
              <div className="min-h-full bg-white flex flex-col">
                <div className="relative h-[88px] w-full">
                  <Image
                    src="/assets/ppob/icons/backgroundtop.svg"
                    alt="Header Background"
                    fill
                    className="object-cover"
                    priority
                  />
                  <button
                    onClick={handleBack}
                    className="absolute top-8 left-2.5 p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer z-10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="absolute -bottom-2.5 left-5 right-5 bg-white py-1.5 px-4 rounded-xl border border-zinc-200 shadow-[0_4px_10px_rgba(0,0,0,0.06)] text-center">
                    <span className="text-xs font-bold text-[#ED1C24]">Pilih Jalur Tarik Tunai</span>
                  </div>
                </div>

                <div className="p-4 pt-5.5 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-800">Merchant / Gerai Penarikan</label>
                    <div className="space-y-2 mt-2">
                      {[
                        { name: "Indomaret - Ceriamart", icon: "/assets/ppob/images/Indomaret.png" },
                        { name: "Alfamart - Indomidi", icon: "/assets/ppob/images/Alfamart.png" },
                        { name: "ATM Bersama / Link", icon: "/assets/ppob/images/atm.png" },
                      ].map((item) => (
                        <div
                          key={item.name}
                          onClick={() => setSelectedJalur(item.name)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                            selectedJalur === item.name
                              ? "border-[#ED1C24] bg-red-50/40 ring-1 ring-red-400"
                              : "border-zinc-200 bg-white hover:border-zinc-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Image
                              src={item.icon}
                              alt={item.name}
                              width={36}
                              height={36}
                              className="object-contain"
                            />
                            <span className="text-xs font-semibold text-zinc-800">{item.name}</span>
                          </div>
                          <span className="text-[10px] text-zinc-400 font-mono">Bebas Antre</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-800">Pilih Nominal Tarik Tunai</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[50000, 100000, 200000, 500000].map((nom) => (
                        <div
                          key={nom}
                          onClick={() => setTarikNominal(nom)}
                          className={`p-3 rounded-xl border text-center cursor-pointer ${
                            tarikNominal === nom
                              ? "border-[#ED1C24] bg-red-50/40 ring-1 ring-red-400"
                              : "border-zinc-200 bg-white"
                          }`}
                        >
                          <div className="text-xs font-bold text-zinc-800">{formatRupiah(nom)}</div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">Biaya Admin Rp 5.000</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() =>
                        initiateTransaction({
                          type: "tariktunai",
                          targetNumber: selectedJalur,
                          title: `Tarik Tunai di ${selectedJalur}`,
                          provider: "Cash Service",
                          amount: tarikNominal,
                          adminFee: 5000,
                          tokenNumber: "TK-" + Math.floor(100000 + Math.random() * 900000),
                        })
                      }
                      className="w-full py-3 rounded-xl bg-[#ED1C24] hover:bg-[#D3151D] text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      Dapatkan Kode Penarikan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 6. FLOW: E-WALLET (EwalletPage) */}
            {currentFlow === "ewallet" && (
              <div className="min-h-full bg-white flex flex-col">
                <div className="relative h-[88px] w-full">
                  <Image
                    src="/assets/ppob/icons/backgroundtop.svg"
                    alt="Header Background"
                    fill
                    className="object-cover"
                    priority
                  />
                  <button
                    onClick={handleBack}
                    className="absolute top-8 left-2.5 p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer z-10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="absolute -bottom-2.5 left-5 right-5 bg-white py-1.5 px-4 rounded-xl border border-zinc-200 shadow-[0_4px_10px_rgba(0,0,0,0.06)] text-center">
                    <span className="text-xs font-bold text-[#ED1C24]">Pilih E-Wallet</span>
                  </div>
                </div>

                <div className="p-4 pt-5.5 space-y-4">
                  <div className="grid grid-cols-3 gap-2.5">
                    {EWALLET_ITEMS.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedEwallet(item)}
                        className={`p-3 rounded-xl border flex flex-col items-center cursor-pointer transition-all ${
                          selectedEwallet.id === item.id
                            ? "border-[#ED1C24] bg-red-50/40 ring-1 ring-red-400"
                            : "border-zinc-200 bg-white hover:border-zinc-300"
                        }`}
                      >
                        <Image
                          src={item.icon}
                          alt={item.title}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                        <span className="text-[11px] font-semibold text-zinc-800 mt-1.5">{item.title}</span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-800">Nomor Handphone Terdaftar</label>
                    <div className="mt-1.5 border border-zinc-200 rounded-xl px-3 py-2.5 bg-white">
                      <input
                        type="text"
                        value={ewalletPhone}
                        onChange={(e) => setEwalletPhone(e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        className="text-xs font-semibold text-zinc-900 w-full outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-800">Nominal Top Up</label>
                    <div className="grid grid-cols-3 gap-2 mt-1.5">
                      {[20000, 50000, 100000, 200000, 300000, 500000].map((nom) => (
                        <button
                          key={nom}
                          onClick={() => setEwalletNominal(nom)}
                          className={`py-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                            ewalletNominal === nom
                              ? "bg-[#ED1C24] text-white border-[#ED1C24]"
                              : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                          }`}
                        >
                          {formatRupiah(nom)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() =>
                        initiateTransaction({
                          type: "ewallet",
                          targetNumber: ewalletPhone,
                          title: `Top Up ${selectedEwallet.title}`,
                          provider: selectedEwallet.title,
                          amount: ewalletNominal,
                          adminFee: 1000,
                          customerName: "Abel Thareq",
                        })
                      }
                      className="w-full py-3 rounded-xl bg-[#ED1C24] hover:bg-[#D3151D] text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      Top Up Sekarang
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 7. FLOW: E-MONEY (EMoneyPage) */}
            {currentFlow === "emoney" && (
              <div className="min-h-full bg-white flex flex-col">
                <div className="relative h-[88px] w-full">
                  <Image
                    src="/assets/ppob/icons/backgroundtop.svg"
                    alt="Header Background"
                    fill
                    className="object-cover"
                    priority
                  />
                  <button
                    onClick={handleBack}
                    className="absolute top-8 left-2.5 p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer z-10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="absolute -bottom-2.5 left-5 right-5 bg-white py-1.5 px-4 rounded-xl border border-zinc-200 shadow-[0_4px_10px_rgba(0,0,0,0.06)] text-center">
                    <span className="text-xs font-bold text-[#ED1C24]">Pilih E Money</span>
                  </div>
                </div>

                <div className="p-4 pt-5.5 space-y-4">
                  <div className="grid grid-cols-2 gap-2.5">
                    {EMONEY_ITEMS.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedEmoney(item)}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer ${
                          selectedEmoney.id === item.id
                            ? "border-[#ED1C24] bg-red-50/40 ring-1 ring-red-400"
                            : "border-zinc-200 bg-white hover:border-zinc-300"
                        }`}
                      >
                        <Image
                          src={item.icon}
                          alt={item.title}
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                        <div>
                          <div className="text-xs font-bold text-zinc-800">{item.title}</div>
                          <div className="text-[10px] text-zinc-400">{item.issuer}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-800">Nomor Kartu (16 Digit)</label>
                    <div className="mt-1.5 border border-zinc-200 rounded-xl px-3 py-2.5 bg-white">
                      <input
                        type="text"
                        value={emoneyCardNumber}
                        onChange={(e) => setEmoneyCardNumber(e.target.value)}
                        placeholder="Contoh: 6032 xxxx xxxx xxxx"
                        className="text-xs font-semibold text-zinc-900 w-full outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-800">Nominal Isi Ulang</label>
                    <div className="grid grid-cols-3 gap-2 mt-1.5">
                      {[25000, 50000, 100000, 200000, 300000, 500000].map((nom) => (
                        <button
                          key={nom}
                          onClick={() => setEmoneyNominal(nom)}
                          className={`py-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                            emoneyNominal === nom
                              ? "bg-[#ED1C24] text-white border-[#ED1C24]"
                              : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                          }`}
                        >
                          {formatRupiah(nom)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() =>
                        initiateTransaction({
                          type: "emoney",
                          targetNumber: emoneyCardNumber,
                          title: `Isi Ulang ${selectedEmoney.title}`,
                          provider: selectedEmoney.title,
                          amount: emoneyNominal,
                          adminFee: 1500,
                          customerName: "Kartu Mandiri e-Money",
                        })
                      }
                      className="w-full py-3 rounded-xl bg-[#ED1C24] hover:bg-[#D3151D] text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      Lanjut Isi Saldo Kartu
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 8. FLOW: PDAM (PdamPage) */}
            {currentFlow === "pdam" && (
              <div className="min-h-full bg-white flex flex-col">
                <div className="relative h-[88px] w-full">
                  <Image
                    src="/assets/ppob/icons/backgroundtop.svg"
                    alt="Header Background"
                    fill
                    className="object-cover"
                    priority
                  />
                  <button
                    onClick={handleBack}
                    className="absolute top-8 left-2.5 p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer z-10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="absolute -bottom-2.5 left-5 right-5 bg-white py-1.5 px-4 rounded-xl border border-zinc-200 shadow-[0_4px_10px_rgba(0,0,0,0.06)] text-center">
                    <span className="text-xs font-bold text-[#ED1C24]">Pilih Layanan PDAM</span>
                  </div>
                </div>

                <div className="p-4 pt-5.5 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-800">Wilayah / Kabupaten PDAM</label>
                    <select
                      value={pdamRegion}
                      onChange={(e) => setPdamRegion(e.target.value)}
                      className="w-full mt-1.5 border border-zinc-200 rounded-xl px-3 py-2.5 bg-white text-xs font-semibold text-zinc-800 outline-none"
                    >
                      <option>PDAM Tirta Moedal Semarang</option>
                      <option>PDAM Surya Sembada Surabaya</option>
                      <option>PAM Jaya DKI Jakarta</option>
                      <option>PDAM Tirtawening Bandung</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-800">Nomor Sambungan / ID Pelanggan</label>
                    <div className="mt-1.5 border border-zinc-200 rounded-xl px-3 py-2.5 bg-white">
                      <input
                        type="text"
                        value={pdamId}
                        onChange={(e) => setPdamId(e.target.value)}
                        placeholder="Contoh: 1092819201"
                        className="text-xs font-semibold text-zinc-900 w-full outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Nama Pelanggan</span>
                      <span className="font-semibold text-zinc-800">Abel Thareq</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Tagihan Air</span>
                      <span className="font-mono text-zinc-800">Rp 84.000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Biaya Admin</span>
                      <span className="font-mono text-zinc-800">Rp 2.500</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-200 flex justify-between font-bold text-sm">
                      <span className="text-zinc-900">Total Pembayaran</span>
                      <span className="text-[#ED1C24] font-mono">Rp 86.500</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() =>
                        initiateTransaction({
                          type: "pdam",
                          targetNumber: pdamId,
                          title: `Tagihan ${pdamRegion}`,
                          provider: pdamRegion,
                          amount: 84000,
                          adminFee: 2500,
                          customerName: "Abel Thareq",
                        })
                      }
                      className="w-full py-3 rounded-xl bg-[#ED1C24] hover:bg-[#D3151D] text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      Bayar Tagihan PDAM
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 9. FLOW: TOP UP GAME (TopUpGamePage) */}
            {currentFlow === "topupgame" && (
              <div className="min-h-full bg-white flex flex-col">
                <div className="relative h-[88px] w-full">
                  <Image
                    src="/assets/ppob/icons/backgroundtop.svg"
                    alt="Header Background"
                    fill
                    className="object-cover"
                    priority
                  />
                  <button
                    onClick={handleBack}
                    className="absolute top-8 left-2.5 p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer z-10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="absolute -bottom-2.5 left-5 right-5 bg-white py-1.5 px-4 rounded-xl border border-zinc-200 shadow-[0_4px_10px_rgba(0,0,0,0.06)] text-center">
                    <span className="text-xs font-bold text-[#ED1C24]">Pilih Game Favorit</span>
                  </div>
                </div>

                <div className="p-4 pt-5.5 space-y-4">
                  <div className="grid grid-cols-4 gap-2">
                    {GAME_ITEMS.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedGame(item)}
                        className={`p-1.5 rounded-xl border flex flex-col items-center cursor-pointer ${
                          selectedGame.id === item.id
                            ? "border-[#ED1C24] bg-red-50/40 ring-1 ring-red-400"
                            : "border-zinc-200 bg-white"
                        }`}
                      >
                        <Image
                          src={item.icon}
                          alt={item.title}
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                        <span className="text-[9px] font-semibold text-zinc-800 mt-1 text-center line-clamp-1">
                          {item.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-zinc-700">User ID</label>
                      <input
                        type="text"
                        value={gameUserId}
                        onChange={(e) => setGameUserId(e.target.value)}
                        className="w-full mt-1 border border-zinc-200 rounded-lg px-2.5 py-2 text-xs font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-zinc-700">Zone ID</label>
                      <input
                        type="text"
                        value={gameZoneId}
                        onChange={(e) => setGameZoneId(e.target.value)}
                        className="w-full mt-1 border border-zinc-200 rounded-lg px-2.5 py-2 text-xs font-mono outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-800">Pilih Paket Diamond</label>
                    <div className="grid grid-cols-2 gap-2 mt-1.5">
                      {[
                        { title: "86 Diamonds", price: 21500 },
                        { title: "172 Diamonds", price: 43000 },
                        { title: "257 Diamonds", price: 64500 },
                        { title: "Weekly Pass", price: 28000 },
                      ].map((pkg) => (
                        <div
                          key={pkg.title}
                          onClick={() => setGamePackage(pkg)}
                          className={`p-2.5 rounded-xl border cursor-pointer ${
                            gamePackage.title === pkg.title
                              ? "border-[#ED1C24] bg-red-50/40 ring-1 ring-red-400"
                              : "border-zinc-200 bg-white"
                          }`}
                        >
                          <div className="text-xs font-bold text-zinc-800">{pkg.title}</div>
                          <div className="text-[11px] font-bold text-[#ED1C24] mt-0.5 font-mono">
                            {formatRupiah(pkg.price)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() =>
                        initiateTransaction({
                          type: "game",
                          targetNumber: `${gameUserId} (${gameZoneId})`,
                          title: `Top Up ${selectedGame.title} - ${gamePackage.title}`,
                          provider: selectedGame.title,
                          amount: gamePackage.price,
                          adminFee: 1000,
                          customerName: "Abel Gaming (VIP)",
                        })
                      }
                      className="w-full py-3 rounded-xl bg-[#ED1C24] hover:bg-[#D3151D] text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      Top Up Game Sekarang
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 10. FLOW: E-VOUCHER (VoucherPage) */}
            {currentFlow === "evoucher" && (
              <div className="min-h-full bg-white flex flex-col">
                <div className="relative h-[88px] w-full">
                  <Image
                    src="/assets/ppob/icons/backgroundtop.svg"
                    alt="Header Background"
                    fill
                    className="object-cover"
                    priority
                  />
                  <button
                    onClick={handleBack}
                    className="absolute top-8 left-2.5 p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer z-10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="absolute -bottom-2.5 left-5 right-5 bg-white py-1.5 px-4 rounded-xl border border-zinc-200 shadow-[0_4px_10px_rgba(0,0,0,0.06)] text-center">
                    <span className="text-xs font-bold text-[#ED1C24]">Pilih E-Voucher</span>
                  </div>
                </div>

                <div className="p-4 pt-5.5 space-y-3">
                  {[
                    { title: "Google Play Rp 50.000", price: 50000, desc: "Voucher Game & Aplikasi" },
                    { title: "Spotify Premium 1 Bulan", price: 55000, desc: "Bebas Iklan & Download" },
                    { title: "Netflix Standar 1 Bulan", price: 120000, desc: "Nonton Film HD 2 Perangkat" },
                    { title: "Indomaret Digital Rp 100.000", price: 100000, desc: "Belanja Kebutuhan Harian" },
                  ].map((v) => (
                    <div
                      key={v.title}
                      onClick={() =>
                        initiateTransaction({
                          type: "voucher",
                          targetNumber: "Digital Voucher",
                          title: v.title,
                          provider: "E-Voucher",
                          amount: v.price,
                          adminFee: 1500,
                          tokenNumber: "VCH-" + Math.floor(10000000 + Math.random() * 90000000),
                        })
                      }
                      className="p-3.5 rounded-2xl border border-zinc-200 bg-white hover:border-red-400 hover:shadow-xs cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-xs text-zinc-900">{v.title}</div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">{v.desc}</div>
                      </div>
                      <div className="text-xs font-bold text-[#ED1C24] font-mono">{formatRupiah(v.price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 11. FLOW: LAINNYA (LainnyaPage) */}
            {currentFlow === "lainnya" && (
              <div className="min-h-full bg-white flex flex-col">
                <div className="relative h-[88px] w-full">
                  <Image
                    src="/assets/ppob/icons/backgroundtop.svg"
                    alt="Header Background"
                    fill
                    className="object-cover"
                    priority
                  />
                  <button
                    onClick={handleBack}
                    className="absolute top-8 left-2.5 p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer z-10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="absolute -bottom-2.5 left-5 right-5 bg-white py-1.5 px-4 rounded-xl border border-zinc-200 shadow-[0_4px_10px_rgba(0,0,0,0.06)] text-center">
                    <span className="text-xs font-bold text-[#ED1C24]">Layanan Lainnya</span>
                  </div>
                </div>

                <div className="p-4 pt-5.5 grid grid-cols-4 gap-3 text-center">
                  {[
                    { title: "Top Up Game", icon: "/assets/ppob/images/game.png", action: () => navigateTo("topupgame") },
                    { title: "E-Voucher", icon: "/assets/ppob/images/voucher.png", action: () => navigateTo("evoucher") },
                    { title: "Emas", icon: "/assets/ppob/images/gold.png", action: () => alert("Investasi Emas Batangan Antam") },
                    { title: "Donasi", icon: "/assets/ppob/images/donation.png", action: () => alert("Donasi Kemanusiaan & Bencana") },
                    { title: "Zakat", icon: "/assets/ppob/images/zakat.png", action: () => alert("Zakat Mal & Fitrah BAZNAS") },
                    { title: "Wakaf", icon: "/assets/ppob/images/wakaf.png", action: () => alert("Wakaf Produktif Indonesia") },
                    { title: "Reksa Dana", icon: "/assets/ppob/images/mutual_fund.png", action: () => alert("Investasi Pasar Uang") },
                  ].map((item) => (
                    <div
                      key={item.title}
                      onClick={item.action}
                      className="flex flex-col items-center cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200/90 shadow-xs flex items-center justify-center p-1.5 group-hover:scale-105 group-hover:border-red-400 transition-all">
                        <Image
                          src={item.icon}
                          alt={item.title}
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-[10px] font-medium text-zinc-800 mt-1 line-clamp-2">
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 12. FLOW: PULSA & DATA */}
            {currentFlow === "pulsa" && (
              <div className="p-4 bg-[#F8F8FF] min-h-full">
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={handleBack}
                    className="p-1.5 rounded-full hover:bg-zinc-200 text-zinc-700 cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="font-semibold text-zinc-900 text-sm">Beli Pulsa / Paket Data</h3>
                </div>

                {/* Input No HP */}
                <div className="bg-white p-3.5 rounded-2xl border border-zinc-200 shadow-xs mb-3.5">
                  <label className="text-[11px] font-medium text-zinc-500">Nomor Handphone</label>
                  <div className="mt-1 flex items-center justify-between">
                    <input
                      type="text"
                      value={pulsaPhone}
                      onChange={(e) => setPulsaPhone(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="text-base font-semibold text-zinc-900 w-full outline-none font-mono"
                    />
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {pulsaProvider}
                    </span>
                  </div>
                </div>

                {/* Provider Chips */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-3">
                  {["Telkomsel", "Indosat", "XL", "Tri", "Smartfren", "Axis"].map((prov) => (
                    <button
                      key={prov}
                      onClick={() => setPulsaProvider(prov)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        pulsaProvider === prov
                          ? "bg-[#ED1C24] text-white shadow-xs"
                          : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>

                {/* Nominal Chips Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: "Pulsa 15.000", amount: 15000, price: 15200 },
                    { label: "Pulsa 25.000", amount: 25000, price: 25200 },
                    { label: "Pulsa 50.000", amount: 50000, price: 50200 },
                    { label: "Pulsa 100.000", amount: 100000, price: 99800 },
                    { label: "Data 5GB / 7 Hari", amount: 28000, price: 28200 },
                    { label: "Data 25GB / 30 Hari", amount: 75000, price: 75500 },
                  ].map((nom) => (
                    <div
                      key={nom.label}
                      onClick={() => setPulsaNominal(nom)}
                      className={`p-3 rounded-xl border bg-white cursor-pointer transition-all ${
                        pulsaNominal.label === nom.label
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

                <div className="mt-6 pt-3 border-t border-zinc-200 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-zinc-500">Total Bayar</div>
                    <div className="text-base font-bold text-[#ED1C24] font-mono">
                      {formatRupiah(pulsaNominal.price)}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      initiateTransaction({
                        type: "pulsa",
                        targetNumber: pulsaPhone,
                        title: pulsaNominal.label,
                        provider: pulsaProvider,
                        amount: pulsaNominal.amount,
                        adminFee: pulsaNominal.price - pulsaNominal.amount,
                        customerName: "Abel Thareq",
                      })
                    }
                    className="px-6 py-2.5 rounded-full bg-[#ED1C24] hover:bg-[#D3151D] text-white text-xs font-semibold cursor-pointer shadow-md"
                  >
                    Beli Sekarang
                  </button>
                </div>
              </div>
            )}

            {/* 13. FLOW: LISTRIK PLN */}
            {currentFlow === "listrik" && (
              <div className="p-4 bg-[#F8F8FF] min-h-full">
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={handleBack}
                    className="p-1.5 rounded-full hover:bg-zinc-200 text-zinc-700 cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="font-semibold text-zinc-900 text-sm">Listrik PLN</h3>
                </div>

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

                {listrikType === "token" ? (
                  <>
                    <h4 className="text-xs font-semibold text-zinc-800 mb-2">Pilih Nominal Token</h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { label: "Token 20.000", amount: 20000, price: 22500 },
                        { label: "Token 50.000", amount: 50000, price: 52500 },
                        { label: "Token 100.000", amount: 100000, price: 102500 },
                        { label: "Token 200.000", amount: 200000, price: 202500 },
                      ].map((nom) => (
                        <div
                          key={nom.label}
                          onClick={() => setListrikTokenNominal(nom)}
                          className={`p-3 rounded-xl border bg-white cursor-pointer transition-all ${
                            listrikTokenNominal.label === nom.label
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
                      <span className="text-[#ED1C24] font-mono">Rp 166.700</span>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-3 border-t border-zinc-200 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-zinc-500">Total Pembayaran</div>
                    <div className="text-base font-bold text-[#ED1C24] font-mono">
                      {listrikType === "token"
                        ? formatRupiah(listrikTokenNominal.price)
                        : "Rp 166.700"}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      initiateTransaction({
                        type: "listrik",
                        targetNumber: meterInput,
                        title:
                          listrikType === "token"
                            ? listrikTokenNominal.label
                            : "Tagihan Listrik PLN Pasca",
                        provider: "PLN",
                        amount: listrikType === "token" ? listrikTokenNominal.amount : 164200,
                        adminFee: 2500,
                        tokenNumber:
                          listrikType === "token"
                            ? "4819-2041-8891-2374-9012"
                            : undefined,
                        customerName: "Abel Thareq / R1M-900VA",
                      })
                    }
                    className="px-6 py-2.5 rounded-full bg-[#ED1C24] hover:bg-[#D3151D] text-white text-xs font-semibold cursor-pointer shadow-md"
                  >
                    Lanjutkan Bayar
                  </button>
                </div>
              </div>
            )}

            {/* 14. FLOW: by.U PROMO */}
            {currentFlow === "byu" && (
              <div className="min-h-full bg-white flex flex-col">
                <div className="relative h-[88px] w-full">
                  <Image
                    src="/assets/ppob/icons/backgroundtop.svg"
                    alt="Header Background"
                    fill
                    className="object-cover"
                    priority
                  />
                  <button
                    onClick={handleBack}
                    className="absolute top-8 left-2.5 p-1.5 text-white hover:bg-white/10 rounded-full cursor-pointer z-10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="absolute -bottom-2.5 left-5 right-5 bg-white py-1.5 px-4 rounded-xl border border-zinc-200 shadow-[0_4px_10px_rgba(0,0,0,0.06)] text-center">
                    <span className="text-xs font-bold text-[#ED1C24]">by.U Special Promo</span>
                  </div>
                </div>

                <div className="p-4 pt-5.5 space-y-3">
                  {[
                    { label: "Yang Bikin Kumat 10GB / 30 Hari", price: 35000, desc: "Kuota Utama 24 Jam Non-stop" },
                    { label: "Yang Bikin Nyaman 25GB / 30 Hari", price: 65000, desc: "Bonus Kuota Malam 10GB" },
                    { label: "Yang Bikin Nagih 50GB / 30 Hari", price: 110000, desc: "Bebas FUP & Prioritas Jaringan" },
                  ].map((pkg) => (
                    <div
                      key={pkg.label}
                      onClick={() =>
                        initiateTransaction({
                          type: "byu",
                          targetNumber: "0851-9982-1049",
                          title: pkg.label,
                          provider: "by.U Telkomsel",
                          amount: pkg.price,
                          adminFee: 500,
                          customerName: "Abel by.U User",
                        })
                      }
                      className="p-4 rounded-2xl border border-zinc-200 bg-white hover:border-red-400 hover:shadow-xs cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <div className="font-bold text-xs text-zinc-900">{pkg.label}</div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">{pkg.desc}</div>
                      </div>
                      <div className="text-xs font-bold text-[#ED1C24] font-mono">{formatRupiah(pkg.price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 15. FLOW: SHOP DETAIL (DetailShopPage) */}
            {currentFlow === "shop_detail" && selectedShopProduct && (
              <div className="min-h-full bg-white flex flex-col pb-20">
                {/* Native Authentic AppBar for DetailShopPage */}
                <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-zinc-200/80 px-3 pt-8 pb-2.5 h-16 flex items-center justify-between">
                  <button
                    onClick={handleBack}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 text-zinc-800 transition cursor-pointer"
                    aria-label="Kembali"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-bold text-zinc-900">Detail Produk</span>
                  <div className="flex items-center gap-1">
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 text-zinc-700 transition cursor-pointer"
                      aria-label="Bagikan"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleBack}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 text-zinc-700 transition cursor-pointer relative"
                      aria-label="Keranjang"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#ED1C24] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        1
                      </span>
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  <div className="w-full h-44 relative rounded-2xl bg-zinc-50 border border-zinc-200/80 overflow-hidden flex items-center justify-center p-3">
                    <Image
                      src={selectedShopProduct.image}
                      alt={selectedShopProduct.title}
                      fill
                      className="object-contain p-3"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <span className="flex items-center gap-1 font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {selectedShopProduct.rating}
                      </span>
                      <span>•</span>
                      <span>{selectedShopProduct.sales}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-zinc-400">
                        <MapPin className="w-3 h-3" /> {selectedShopProduct.location}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-zinc-900 mt-1">{selectedShopProduct.title}</h3>

                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="text-lg font-bold text-[#ED1C24] font-mono">
                        {formatRupiah(selectedShopProduct.price)}
                      </span>
                      <span className="text-xs text-zinc-400 line-through font-mono">
                        {formatRupiah(selectedShopProduct.originalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Spesifikasi Card */}
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Kategori</span>
                      <span className="font-semibold text-zinc-800">{selectedShopProduct.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Berat Pengiriman</span>
                      <span className="font-semibold text-zinc-800">{selectedShopProduct.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Kondisi & Garansi</span>
                      <span className="font-semibold text-zinc-800">Baru • Garansi 1 Tahun</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Stok Tersedia</span>
                      <span className="font-semibold text-emerald-600">{selectedShopProduct.stock} unit</span>
                    </div>
                  </div>

                  {/* Deskripsi */}
                  <div>
                    <h4 className="text-xs font-bold text-zinc-800 mb-1">Deskripsi Produk</h4>
                    <p className="text-xs text-zinc-600 leading-relaxed">{selectedShopProduct.description}</p>
                  </div>

                  {/* Qty Selector */}
                  <div className="flex items-center justify-between p-3 bg-white border border-zinc-200 rounded-xl">
                    <span className="text-xs font-bold text-zinc-800">Jumlah Beli</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShopQty((q) => Math.max(1, q - 1))}
                        className="w-7 h-7 rounded-lg border border-zinc-300 flex items-center justify-center hover:bg-zinc-100 cursor-pointer"
                      >
                        <Minus className="w-3 h-3 text-zinc-700" />
                      </button>
                      <span className="text-xs font-bold font-mono w-6 text-center">{shopQty}</span>
                      <button
                        onClick={() => setShopQty((q) => Math.min(selectedShopProduct.stock, q + 1))}
                        className="w-7 h-7 rounded-lg border border-zinc-300 flex items-center justify-center hover:bg-zinc-100 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-zinc-700" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        setCartToast(`"${selectedShopProduct.title}" (${shopQty}x) berhasil masuk keranjang!`);
                        handleBack();
                        setTimeout(() => setCartToast(null), 3000);
                      }}
                      className="flex-1 py-3 rounded-xl border border-zinc-300 hover:bg-zinc-50 text-zinc-800 text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      + Keranjang
                    </button>
                    <button
                      onClick={handleStartShopCheckout}
                      className="flex-1 py-3 rounded-xl bg-[#ED1C24] hover:bg-[#D3151D] text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      Beli Sekarang
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 16. FLOW: SHOP CHECKOUT (CheckoutPage) */}
            {currentFlow === "shop_checkout" && selectedShopProduct && (
              <div className="min-h-full bg-white flex flex-col pb-20">
                {/* Native Authentic AppBar for CheckoutPage */}
                <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-zinc-200/80 px-3 pt-8 pb-2.5 h-16 flex items-center justify-between">
                  <button
                    onClick={handleBack}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 text-zinc-800 transition cursor-pointer"
                    aria-label="Kembali"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-bold text-zinc-900">Checkout Pesanan</span>
                  <div className="w-8" />
                </div>

                <div className="p-4 space-y-3.5">
                  {/* Alamat Pengiriman */}
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#ED1C24]" />
                      <span>Alamat Pengiriman (Utama)</span>
                    </div>
                    <div className="text-xs font-semibold text-zinc-800">Abel Thareq | (+62) 812-3456-7890</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                      Jl. Merdeka No. 45, RT 02/RW 05, Cihideung, Kota Tasikmalaya, Jawa Barat 46115
                    </div>
                  </div>

                  {/* Ringkasan Barang */}
                  <div className="p-3 border border-zinc-200 rounded-xl bg-white flex gap-3 items-center">
                    <div className="w-14 h-14 relative bg-zinc-50 rounded-lg shrink-0 overflow-hidden border border-zinc-100">
                      <Image
                        src={selectedShopProduct.image}
                        alt={selectedShopProduct.title}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-zinc-900 truncate">{selectedShopProduct.title}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Jumlah: {shopQty} unit</div>
                      <div className="text-xs font-bold text-[#ED1C24] font-mono mt-0.5">
                        {formatRupiah(selectedShopProduct.price * shopQty)}
                      </div>
                    </div>
                  </div>

                  {/* Kurir Pengiriman */}
                  <div className="p-3 bg-white border border-zinc-200 rounded-xl">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-zinc-800">
                        <Truck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Opsi Pengiriman</span>
                      </div>
                      <span className="font-mono font-bold text-zinc-900">Rp 12.000</span>
                    </div>
                    <div className="text-[11px] text-zinc-600">J&T Express - Reguler</div>
                    <div className="text-[10px] text-emerald-600 mt-0.5">Estimasi tiba: 2 - 3 Hari Kerja</div>
                  </div>

                  {/* Metode Pembayaran */}
                  <div className="p-3 bg-white border border-zinc-200 rounded-xl">
                    <div className="text-xs font-bold text-zinc-800 mb-1">Metode Pembayaran</div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ED1C24]" />
                        <span className="text-xs font-semibold text-zinc-800">Saldo Merah Putih Pay</span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500">
                        Sisa: {formatRupiah(saldo)}
                      </span>
                    </div>
                  </div>

                  {/* Rincian Biaya */}
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between text-zinc-500">
                      <span>Subtotal Produk</span>
                      <span className="font-mono">{formatRupiah(selectedShopProduct.price * shopQty)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                      <span>Ongkos Kirim</span>
                      <span className="font-mono">Rp 12.000</span>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                      <span>Biaya Layanan</span>
                      <span className="font-mono">Rp 1.000</span>
                    </div>
                    <div className="pt-1.5 border-t border-zinc-200 flex justify-between font-bold text-zinc-900">
                      <span>Total Pembayaran</span>
                      <span className="text-sm text-[#ED1C24] font-mono">
                        {formatRupiah(selectedShopProduct.price * shopQty + 13000)}
                      </span>
                    </div>
                  </div>

                  {/* Tombol Bayar Sekarang */}
                  <button
                    onClick={handleStartShopPayment}
                    className="w-full py-3.5 rounded-xl bg-[#ED1C24] hover:bg-[#D3151D] text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    Bayar Sekarang ({formatRupiah(selectedShopProduct.price * shopQty + 13000)})
                  </button>
                </div>
              </div>
            )}

            {/* 17. FLOW: SHOP SUCCESS (ShopBerhasilPage) */}
            {currentFlow === "shop_success" && activeShopOrder && (
              <div className="min-h-full bg-zinc-50 p-4 flex flex-col justify-between">
                <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-sm space-y-4">
                  <div className="text-center pb-3 border-b border-dashed border-zinc-200">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mb-2">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div className="text-xs font-semibold text-emerald-600 tracking-wider">
                      TRANSAKSI BELANJA BERHASIL
                    </div>
                    <div className="text-lg font-bold text-zinc-900 mt-1 font-mono">
                      {formatRupiah(activeShopOrder.total)}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">{activeShopOrder.date}</div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-zinc-500">
                      <span>Nomor Pesanan</span>
                      <span className="font-mono font-bold text-zinc-900">{activeShopOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                      <span>Produk</span>
                      <span className="font-medium text-zinc-800 text-right">{activeShopOrder.product.title}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                      <span>Jumlah</span>
                      <span className="font-mono text-zinc-800">{activeShopOrder.qty} unit</span>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                      <span>Metode Pengiriman</span>
                      <span className="font-medium text-zinc-800 text-right">{activeShopOrder.courier}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                      <span>Estimasi Pengiriman</span>
                      <span className="text-emerald-600 font-semibold">2 - 3 Hari Kerja</span>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-[11px] text-zinc-600">
                    <span className="font-bold text-zinc-800">Alamat Tujuan:</span>
                    <p className="mt-0.5">Abel Thareq - Jl. Merdeka No. 45, Kota Tasikmalaya, Jawa Barat</p>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <button
                    onClick={() => {
                      setNavStack(["home"]);
                      setActiveTab(0);
                    }}
                    className="w-full py-3 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 cursor-pointer"
                  >
                    Kembali ke Shop
                  </button>
                  <button
                    onClick={() => {
                      setNavStack(["home"]);
                      setActiveTab(1);
                    }}
                    className="w-full py-3 rounded-xl bg-white border border-zinc-200 text-zinc-800 text-xs font-semibold hover:bg-zinc-50 cursor-pointer"
                  >
                    Lihat Riwayat Transaksi
                  </button>
                </div>
              </div>
            )}

            {/* 18. FLOW: CHANGE PIN (ChangePINPage) */}
            {currentFlow === "change_pin" && (
              <div className="min-h-full bg-white flex flex-col pb-20">
                {/* Native Authentic AppBar for ChangePINPage */}
                <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-zinc-200/80 px-3 pt-8 pb-2.5 h-16 flex items-center justify-between">
                  <button
                    onClick={handleBack}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 text-zinc-800 transition cursor-pointer"
                    aria-label="Kembali"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-bold text-zinc-900">Pengaturan PIN Keamanan</span>
                  <div className="w-8" />
                </div>

                <div className="p-4 space-y-4">
                  <div className="text-center py-2">
                    <div className="w-14 h-14 rounded-full bg-red-50 text-[#ED1C24] mx-auto flex items-center justify-center mb-2">
                      <KeyRound className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-sm text-zinc-900">Ubah 6-Digit PIN Akun</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      PIN digunakan untuk mengotorisasi setiap transaksi dan transfer.
                    </p>
                  </div>

                  {pinChangeSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>PIN berhasil diperbarui! Gunakan PIN baru untuk transaksi berikutnya.</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-zinc-800">PIN Lama</label>
                      <input
                        type="password"
                        maxLength={6}
                        value={oldPinInput}
                        onChange={(e) => setOldPinInput(e.target.value.replace(/\D/g, ""))}
                        placeholder="••••••"
                        className="mt-1 w-full p-3 rounded-xl border border-zinc-200 text-center font-mono text-base tracking-widest outline-none focus:border-[#ED1C24]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-800">PIN Baru (6 Digit)</label>
                      <input
                        type="password"
                        maxLength={6}
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ""))}
                        placeholder="••••••"
                        className="mt-1 w-full p-3 rounded-xl border border-zinc-200 text-center font-mono text-base tracking-widest outline-none focus:border-[#ED1C24]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-800">Konfirmasi PIN Baru</label>
                      <input
                        type="password"
                        maxLength={6}
                        value={confirmPinInput}
                        onChange={(e) => setConfirmPinInput(e.target.value.replace(/\D/g, ""))}
                        placeholder="••••••"
                        className="mt-1 w-full p-3 rounded-xl border border-zinc-200 text-center font-mono text-base tracking-widest outline-none focus:border-[#ED1C24]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!oldPinInput || oldPinInput.length !== 6) {
                        alert("Harap masukkan 6 digit PIN lama Anda!");
                        return;
                      }
                      if (!newPinInput || newPinInput.length !== 6) {
                        alert("PIN baru harus terdiri dari 6 angka!");
                        return;
                      }
                      if (newPinInput !== confirmPinInput) {
                        alert("Konfirmasi PIN baru tidak sesuai!");
                        return;
                      }
                      setPinChangeSuccess(true);
                      setOldPinInput("");
                      setNewPinInput("");
                      setConfirmPinInput("");
                      setTimeout(() => {
                        handleBack();
                        setPinChangeSuccess(false);
                      }, 1800);
                    }}
                    className="w-full py-3.5 rounded-xl bg-[#ED1C24] hover:bg-[#D3151D] text-white text-xs font-bold shadow-md cursor-pointer mt-2"
                  >
                    Simpan PIN Baru
                  </button>
                </div>
              </div>
            )}

            {/* 19. FLOW: MY DEVICES (MyDevicesPage) */}
            {currentFlow === "my_devices" && (
              <div className="min-h-full bg-white flex flex-col pb-20">
                {/* Native Authentic AppBar for MyDevicesPage */}
                <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-zinc-200/80 px-3 pt-8 pb-2.5 h-16 flex items-center justify-between">
                  <button
                    onClick={handleBack}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 text-zinc-800 transition cursor-pointer"
                    aria-label="Kembali"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-bold text-zinc-900">Perangkat Terhubung</span>
                  <div className="w-8" />
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Daftar perangkat yang saat ini memiliki sesi aktif ke akun Merah Putih Pay Anda:
                  </p>

                  <div className="space-y-2">
                    {connectedDevices.map((dev) => (
                      <div
                        key={dev.id}
                        className={`p-3 rounded-xl border flex items-start justify-between ${
                          dev.isCurrent ? "bg-emerald-50/50 border-emerald-200" : "bg-white border-zinc-200"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                              dev.isCurrent ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"
                            }`}
                          >
                            {dev.name.includes("iPhone") ? (
                              <Smartphone className="w-4 h-4" />
                            ) : dev.name.includes("MacBook") ? (
                              <Laptop className="w-4 h-4" />
                            ) : (
                              <Monitor className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-zinc-900 flex items-center gap-1.5">
                              <span>{dev.name}</span>
                              {dev.isCurrent && (
                                <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-full font-semibold">
                                  Perangkat Ini
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-zinc-400 mt-0.5">{dev.os}</div>
                            <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                              {dev.ip} • {dev.location}
                            </div>
                            <div className="text-[9px] text-zinc-400 mt-1">{dev.lastActive}</div>
                          </div>
                        </div>

                        {!dev.isCurrent && (
                          <button
                            onClick={() => {
                              setConnectedDevices((prev) => prev.filter((d) => d.id !== dev.id));
                              alert(`Sesi ${dev.name} berhasil diputuskan!`);
                            }}
                            className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Putuskan Akses"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setConnectedDevices((prev) => prev.filter((d) => d.isCurrent));
                      alert("Semua sesi perangkat lain telah berhasil di-logout!");
                    }}
                    className="w-full py-2.5 rounded-xl border border-red-200 bg-red-50 text-[#ED1C24] hover:bg-red-100 text-xs font-bold cursor-pointer mt-2"
                  >
                    Keluar dari Semua Perangkat Lain
                  </button>
                </div>
              </div>
            )}

            {/* 20. FLOW: PENGATURAN STRUK (PengaturanStrukPage) */}
            {currentFlow === "pengaturan_struk" && (
              <div className="min-h-full bg-white flex flex-col pb-20">
                {/* Native Authentic AppBar for PengaturanStrukPage */}
                <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-zinc-200/80 px-3 pt-8 pb-2.5 h-16 flex items-center justify-between">
                  <button
                    onClick={handleBack}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 text-zinc-800 transition cursor-pointer"
                    aria-label="Kembali"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-bold text-zinc-900">Pengaturan Format Struk</span>
                  <div className="w-8" />
                </div>

                <div className="p-4 space-y-3.5">
                  {receiptSavedFeedback && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Format struk berhasil disimpan! Struk transaksi berikutnya akan menggunakan data ini.</span>
                    </div>
                  )}

                  {/* Form inputs */}
                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-zinc-700">Nama Loket / Toko</label>
                      <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="mt-1 w-full p-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-900 outline-none focus:border-[#ED1C24]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-zinc-700">Alamat Loket</label>
                      <input
                        type="text"
                        value={storeAddress}
                        onChange={(e) => setStoreAddress(e.target.value)}
                        className="mt-1 w-full p-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-[#ED1C24]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-zinc-700">No. WhatsApp / HP</label>
                      <input
                        type="text"
                        value={storePhone}
                        onChange={(e) => setStorePhone(e.target.value)}
                        className="mt-1 w-full p-2.5 rounded-xl border border-zinc-200 text-xs font-mono text-zinc-900 outline-none focus:border-[#ED1C24]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-zinc-700">Pesan Footer Struk</label>
                      <input
                        type="text"
                        value={receiptFooter}
                        onChange={(e) => setReceiptFooter(e.target.value)}
                        className="mt-1 w-full p-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 outline-none focus:border-[#ED1C24]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-zinc-700">Ukuran Printer Thermal</label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {(["58mm", "80mm"] as const).map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setReceiptPaper(sz)}
                            className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                              receiptPaper === sz
                                ? "bg-[#ED1C24] text-white border-[#ED1C24]"
                                : "bg-white text-zinc-700 border-zinc-200"
                            }`}
                          >
                            Thermal {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Live Thermal Preview */}
                  <div className="p-3 bg-zinc-100 rounded-xl border border-dashed border-zinc-300">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 text-center mb-1.5">
                      Preview Cetak Struk ({receiptPaper})
                    </div>
                    <div className="bg-white p-3 rounded-lg font-mono text-[10px] text-zinc-800 space-y-1 shadow-xs">
                      <div className="text-center font-bold text-xs">{storeName}</div>
                      <div className="text-center text-[9px] text-zinc-500">{storeAddress}</div>
                      <div className="text-center text-[9px] text-zinc-500">Telp: {storePhone}</div>
                      <div className="border-t border-dashed border-zinc-300 my-1" />
                      <div className="flex justify-between">
                        <span>TOKEN LISTRIK PLN</span>
                        <span>Rp 52.500</span>
                      </div>
                      <div className="flex justify-between text-zinc-500">
                        <span>ADMIN BANK</span>
                        <span>Rp 2.500</span>
                      </div>
                      <div className="border-t border-dashed border-zinc-300 my-1" />
                      <div className="text-center text-[9px] text-zinc-500">{receiptFooter}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setReceiptSavedFeedback(true);
                      setTimeout(() => setReceiptSavedFeedback(false), 3000);
                    }}
                    className="w-full py-3.5 rounded-xl bg-[#ED1C24] hover:bg-[#D3151D] text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    Simpan Format Struk
                  </button>
                </div>
              </div>
            )}

            {/* 21. FLOW: HELP CENTER (PilihPusatBantuanPage) */}
            {currentFlow === "help_center" && (
              <div className="min-h-full bg-white flex flex-col pb-20">
                {/* Native Authentic AppBar for HelpCenterPage */}
                <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-zinc-200/80 px-3 pt-8 pb-2.5 h-16 flex items-center justify-between">
                  <button
                    onClick={handleBack}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-100 text-zinc-800 transition cursor-pointer"
                    aria-label="Kembali"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-bold text-zinc-900">Pusat Bantuan 24/7</span>
                  <div className="w-8" />
                </div>

                <div className="p-4 space-y-4">
                  {/* Saluran Kontak CS */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <a
                      href="https://wa.me/6281234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors flex flex-col items-center cursor-pointer"
                    >
                      <MessageCircle className="w-5 h-5 text-emerald-600 mb-1" />
                      <span className="text-[10px] font-bold text-emerald-800">WhatsApp CS</span>
                      <span className="text-[9px] text-emerald-600">24 Jam</span>
                    </a>
                    <a
                      href="mailto:support@merahputihpay.id"
                      className="p-3 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors flex flex-col items-center cursor-pointer"
                    >
                      <Mail className="w-5 h-5 text-blue-600 mb-1" />
                      <span className="text-[10px] font-bold text-blue-800">Email Help</span>
                      <span className="text-[9px] text-blue-600">Respon &lt;1 Jam</span>
                    </a>
                    <div
                      onClick={() => alert("Call Center Bebas Pulsa: 1500-888 (Aktif 24/7)")}
                      className="p-3 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors flex flex-col items-center cursor-pointer"
                    >
                      <Phone className="w-5 h-5 text-purple-600 mb-1" />
                      <span className="text-[10px] font-bold text-purple-800">Call Center</span>
                      <span className="text-[9px] text-purple-600">1500-888</span>
                    </div>
                  </div>

                  {/* FAQ Section */}
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 mb-2">Pertanyaan Populer (FAQ)</h4>
                    <div className="space-y-2">
                      {[
                        {
                          q: "Berapa lama transaksi saldo masuk ke rekening tujuan?",
                          a: "Transaksi transfer antar bank dan e-wallet diproses realtime (1-5 detik) melalui jaringan BI-FAST dan switching resmi.",
                        },
                        {
                          q: "Bagaimana jika transaksi gagal tapi saldo terpotong?",
                          a: "Sistem otomatis merefund saldo 100% ke Saldo Deposito dalam waktu maksimal 5 menit tanpa potongan biaya.",
                        },
                        {
                          q: "Bagaimana cara mencetak struk transaksi?",
                          a: "Buka tab Riwayat / Mutasi, klik transaksi yang diinginkan, lalu pilih 'Unduh Struk' atau hubungkan printer Bluetooth thermal Anda.",
                        },
                        {
                          q: "Berapa limit maksimal transfer harian?",
                          a: "Untuk akun Verified KYC seperti milik Anda, limit transaksi harian mencapai Rp 50.000.000 per hari.",
                        },
                      ].map((faq, i) => (
                        <div
                          key={i}
                          onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                          className="border border-zinc-200 rounded-xl p-3 bg-white hover:border-zinc-300 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-zinc-800">
                            <span>{faq.q}</span>
                            <ChevronRight
                              className={`w-4 h-4 text-zinc-400 transition-transform ${
                                openFaqIndex === i ? "rotate-90 text-[#ED1C24]" : ""
                              }`}
                            />
                          </div>
                          {openFaqIndex === i && (
                            <p className="text-xs text-zinc-600 mt-2 pt-2 border-t border-zinc-100 leading-relaxed">
                              {faq.a}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 22. FLOW: MAIN TABS (Home, Mutasi, Akun, Shop, Mitra) */}
            {currentFlow === "home" && (
              <>
                {/* TAB 2: HOME FEED (100% Visual Parity with Flutter) */}
                {activeTab === 2 && (
                  <div className="space-y-3">
                    {/* Flutter AppHeader with backgroundtop.svg */}
                    <div className="sticky top-0 z-30 h-[80px] w-full overflow-hidden bg-[#ED1C24] shadow-xs">
                      <Image
                        src="/assets/ppob/icons/backgroundtop.svg"
                        alt="Curved App Header"
                        fill
                        className="object-cover"
                        priority
                      />
                      {/* Topbar Content: Centered Title + Right Action Buttons */}
                      <div className="absolute inset-0 flex items-center justify-between px-4 pt-7 pb-0.5 z-10">
                        {/* Left balancing spacer */}
                        <div className="w-12" />

                        {/* Title: 'Merah Putih Pay' */}
                        <span className="text-[15px] font-bold text-white tracking-wide">
                          Merah Putih Pay
                        </span>

                        {/* Notif & CS Icons in Top Right */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => alert("Notifikasi: Transaksi Anda berjalan lancar!")}
                            className="p-1 rounded-full hover:bg-white/10 text-white cursor-pointer"
                            title="Notifikasi"
                          >
                            <Bell className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => alert("Pusat Bantuan CS Merah Putih Pay siap 24/7!")}
                            className="p-1 rounded-full hover:bg-white/10 text-white cursor-pointer"
                            title="Pusat Bantuan"
                          >
                            <Headset className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Card Saldo + Quick Menu (Overlapping Header by -mt-2.5) */}
                    <div className="-mt-2.5 mx-4 bg-white rounded-2xl p-3 border-2 border-[#E2E0E7] shadow-[0_6px_16px_rgba(0,0,0,0.06)] relative z-20">
                      {/* BalanceCardBackground with background_saldo.svg */}
                      <div className="relative h-[75px] w-full rounded-xl overflow-hidden shadow-xs flex items-center px-3 text-white">
                        <Image
                          src="/assets/ppob/icons/background_saldo.svg"
                          alt="Card Background"
                          fill
                          className="object-cover"
                          priority
                        />

                        {/* Content inside Balance Card */}
                        <div className="relative z-10 flex items-center justify-between w-full">
                          {/* QR Button + Saldo text */}
                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={() => alert("Simulasi QRIS Scanner aktif!")}
                              className="w-7 h-7 rounded-lg bg-white text-zinc-900 flex items-center justify-center shadow-xs cursor-pointer"
                            >
                              <QrCode className="w-4 h-4 text-zinc-900" />
                            </button>
                            <div>
                              <div className="text-[10px] text-white/90">Saldo Deposito</div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[17px] font-bold font-mono">
                                  {isBalanceVisible ? formatRupiah(saldo) : "Rp •••••••"}
                                </span>
                                <button
                                  onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                                  className="text-white hover:opacity-80 cursor-pointer"
                                >
                                  {isBalanceVisible ? (
                                    <Eye className="w-3.5 h-3.5" />
                                  ) : (
                                    <EyeOff className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* + Isi Deposit Button */}
                          <button
                            onClick={handleOpenIsiDeposit}
                            className="bg-white text-zinc-900 px-2 py-1.5 rounded-lg text-[10px] font-bold hover:bg-zinc-100 cursor-pointer shadow-xs flex items-center gap-1"
                          >
                            <span className="text-[#ED1C24] text-xs font-bold">+</span>
                            <span>Isi Deposit</span>
                          </button>
                        </div>
                      </div>

                      {/* 4 Quick Actions Row */}
                      <div className="grid grid-cols-4 gap-2 pt-3 text-center">
                        {[
                          { label: "Transfer", icon: "/assets/ppob/images/transfer.png", action: () => navigateTo("transfer") },
                          { label: "Pulsa/Data", icon: "/assets/ppob/images/pulsa.png", action: () => navigateTo("pulsa") },
                          { label: "E Wallet", icon: "/assets/ppob/images/ewallet.png", action: () => navigateTo("ewallet") },
                          { label: "Lainnya", icon: "/assets/ppob/images/lainnya.png", action: () => navigateTo("lainnya") },
                        ].map((item) => (
                          <div
                            key={item.label}
                            onClick={item.action}
                            className="flex flex-col items-center cursor-pointer group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                              <Image
                                src={item.icon}
                                alt={item.label}
                                width={34}
                                height={34}
                                className="object-contain"
                              />
                            </div>
                            <span className="text-[10px] font-medium text-zinc-700 mt-0.5">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Search Bar + Grid Fitur Container */}
                    <div className="mx-4 bg-white rounded-2xl p-3 border-2 border-[#E2E0E7] shadow-xs">
                      {/* Search Bar matching Flutter TextField */}
                      <div className="relative flex items-center h-11 rounded-xl border border-[#E2E0E7] px-3 bg-white">
                        <Search className="w-4 h-4 text-zinc-500 mr-2 flex-shrink-0" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Cari fitur"
                          className="w-full text-xs font-semibold text-zinc-800 bg-transparent outline-none placeholder:text-zinc-400"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="text-zinc-400 hover:text-zinc-600"
                          >
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
                                  onClick={item.action}
                                  className="flex flex-col items-center cursor-pointer p-1 rounded-lg hover:bg-zinc-50"
                                >
                                  <div className="w-11 h-11 rounded-[13px] border border-zinc-200 p-1 flex items-center justify-center bg-white shadow-xs">
                                    <Image
                                      src={item.icon}
                                      alt={item.title}
                                      width={34}
                                      height={34}
                                      className="object-contain"
                                    />
                                  </div>
                                  <span className="text-[9px] font-medium text-zinc-700 mt-1 text-center line-clamp-1 w-14">
                                    {item.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Default: 8 Main Service Icons Grid (2 Rows of 4) */
                        <div className="grid grid-cols-4 gap-y-2.5 gap-x-1 mt-3">
                          {[
                            { label: "Tagihan", icon: "/assets/ppob/images/tagihan.png", action: () => navigateTo("tagihan") },
                            { label: "Cash Service", icon: "/assets/ppob/images/atm.png", action: () => navigateTo("tariktunai") },
                            { label: "E Money", icon: "/assets/ppob/images/emoney.png", action: () => navigateTo("emoney") },
                            { label: "PDAM", icon: "/assets/ppob/images/pdam.png", action: () => navigateTo("pdam") },
                            { label: "E Voucher", icon: "/assets/ppob/images/evoucher.png", action: () => navigateTo("evoucher") },
                            { label: "Top Up Game", icon: "/assets/ppob/images/topup.png", action: () => navigateTo("topupgame") },
                            { label: "Listrik", icon: "/assets/ppob/images/listrik.png", action: () => navigateTo("listrik") },
                            { label: "by.U Promo", icon: "/assets/ppob/images/byu.png", action: () => navigateTo("byu") },
                          ].map((item) => (
                            <div
                              key={item.label}
                              onClick={item.action}
                              className="flex flex-col items-center cursor-pointer group"
                            >
                              <div className="w-[52px] h-[52px] rounded-[13px] bg-white border border-zinc-200 shadow-xs flex items-center justify-center p-1.5 group-hover:scale-105 group-hover:border-red-400 transition-all">
                                <Image
                                  src={item.icon}
                                  alt={item.label}
                                  width={36}
                                  height={36}
                                  className="object-contain"
                                />
                              </div>
                              <span className="text-[10px] font-medium text-zinc-700 mt-1 text-center line-clamp-1 w-14">
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Promo Banner Section */}
                    <div className="px-4">
                      <div className="text-xs font-bold text-zinc-800 mb-2 flex items-center justify-between">
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

                {/* TAB 1: MUTASI / RIWAYAT */}
                {activeTab === 1 && (
                  <div className="p-4 pt-11 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-zinc-900 text-sm">Riwayat Transaksi</h3>
                      <button
                        onClick={() => setTransactions(INITIAL_TRANSACTIONS)}
                        className="text-[10px] font-medium text-[#ED1C24] flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Reset Data</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {transactions.map((tx) => (
                        <div
                          key={tx.id}
                          onClick={() => {
                            setActiveReceipt(tx);
                            navigateTo("receipt");
                          }}
                          className="bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-xs hover:border-red-300 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-red-50 text-[#ED1C24] flex items-center justify-center font-bold">
                              <Receipt className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-semibold text-xs text-zinc-900 line-clamp-1">{tx.title}</div>
                              <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                                {tx.targetNumber} • {tx.date}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-xs text-zinc-900 font-mono">
                              -{formatRupiah(tx.total)}
                            </div>
                            <span className="inline-block text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded mt-0.5">
                              {tx.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 0: SHOP (Aksesoris & Gadget PPOB) */}
                {activeTab === 0 && (
                  <div className="p-4 pt-11 space-y-3 pb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-zinc-900 text-sm">Shop Peralatan Loket PPOB</h3>
                        <p className="text-[10px] text-zinc-400">Peralatan resmi mitra loket kasir & aksesoris</p>
                      </div>
                      <button
                        onClick={() => alert("Keranjang belanja kosong. Silakan pilih produk!")}
                        className="p-2 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 relative cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Filter Kategori Chips */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {["Semua", "Elektronik", "Office & Stationery"].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setShopCategory(cat)}
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                            shopCategory === cat
                              ? "bg-[#ED1C24] text-white shadow-xs"
                              : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Toast Notification */}
                    {cartToast && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{cartToast}</span>
                      </div>
                    )}

                    {/* 2-Column Product Grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {SHOP_PRODUCTS.filter(
                        (p) => shopCategory === "Semua" || p.category === shopCategory
                      ).map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => openShopProductDetail(prod)}
                          className="bg-white p-2.5 rounded-2xl border border-zinc-200/90 shadow-xs hover:border-red-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                        >
                          <div>
                            <div className="w-full h-28 relative rounded-xl bg-zinc-50 overflow-hidden mb-2">
                              <Image
                                src={prod.image}
                                alt={prod.title}
                                fill
                                className="object-contain p-2 group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mb-0.5">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span>{prod.rating}</span>
                              <span className="text-zinc-400 font-normal ml-1">• {prod.sales}</span>
                            </div>
                            <div className="font-semibold text-xs text-zinc-800 line-clamp-2 leading-tight">
                              {prod.title}
                            </div>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-zinc-100">
                            <div className="text-[10px] text-zinc-400 line-through font-mono">
                              {formatRupiah(prod.originalPrice)}
                            </div>
                            <div className="text-xs font-bold text-[#ED1C24] font-mono">
                              {formatRupiah(prod.price)}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openShopProductDetail(prod);
                              }}
                              className="mt-2 w-full py-1.5 rounded-lg bg-zinc-900 text-white text-[10px] font-semibold group-hover:bg-[#ED1C24] transition-colors cursor-pointer"
                            >
                              Beli Produk
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: AGEN CENTER (AgentCenterPage - 100% Authentic to Flutter repo) */}
                {activeTab === 3 && (
                  <div className="pb-8 space-y-4">
                    {/* Fixed/Sticky AppHeader with red wave background */}
                    <div className="sticky top-0 z-30">
                      <div className="relative h-[115px] w-full bg-[#ED1C24] overflow-hidden flex flex-col justify-center items-center pt-5 shadow-xs">
                        <Image
                          src="/assets/ppob/icons/backgroundtop.svg"
                          alt="Header Background"
                          fill
                          className="object-cover"
                          priority
                        />
                        <span className="relative z-10 text-[15px] font-bold text-white tracking-wide">
                          Merah Putih Pay
                        </span>
                      </div>

                      {/* Floating Agen Center Pill Card (Pinned at top overlapping header) */}
                      <div className="mx-4 -mt-5 relative z-20">
                        <div className="bg-white py-2.5 px-4 rounded-2xl border-2 border-[#E2E0E7] shadow-[0_4px_12px_rgba(0,0,0,0.06)] text-center">
                          <span className="text-base font-bold text-[#ED1C24]">Agen Center</span>
                        </div>
                      </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="px-4 space-y-3 pt-2">
                      {/* Agent 3D Illustration & Message */}
                      <div className="text-center pt-1 pb-2">
                        <div className="relative w-36 h-36 mx-auto">
                          <Image
                            src="/assets/ppob/images/agent.png"
                            alt="Agen Center Illustration"
                            fill
                            className="object-contain"
                            priority
                          />
                        </div>
                        <p className="mt-2 text-xs font-medium text-[#2D2D2D] max-w-xs mx-auto leading-relaxed">
                          Mohon Maaf, Halaman Agen Center hanya dapat diakses oleh Master
                        </p>
                      </div>

                      {/* 3 Expandable Q&A FAQ Cards matching Flutter _buildExpandableCard */}
                      <div className="space-y-2">
                        {/* FAQ 1: Apa itu Agen Center? */}
                        <div className="bg-white rounded-xl border border-zinc-200/80 shadow-xs overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedAgentFaq((prev) => ({
                                ...prev,
                                "Apa itu Agen Center?": !prev["Apa itu Agen Center?"],
                              }))
                            }
                            className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-zinc-50/80 transition-colors"
                          >
                            <span className="text-xs font-semibold text-[#2D2D2D]">
                              Apa itu Agen Center?
                            </span>
                            <ChevronRight
                              className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                                expandedAgentFaq["Apa itu Agen Center?"] ? "rotate-90" : ""
                              }`}
                            />
                          </button>
                          {expandedAgentFaq["Apa itu Agen Center?"] && (
                            <div className="px-3.5 pb-3.5 pt-1 text-[11px] text-zinc-500 leading-relaxed border-t border-zinc-100">
                              Agen Center adalah halaman yang berfungsi sebagai pusat informasi yang memungkinkan master untuk mengelola bisnis secara lebih efisien dengan adanya informasi seperti Total transaksi, Cashback, Profit tertulis, dan lainnya.
                            </div>
                          )}
                        </div>

                        {/* FAQ 2: Apa Kelebihan menjadi Master? */}
                        <div className="bg-white rounded-xl border border-zinc-200/80 shadow-xs overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedAgentFaq((prev) => ({
                                ...prev,
                                "Apa Kelebihan menjadi Master?": !prev["Apa Kelebihan menjadi Master?"],
                              }))
                            }
                            className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-zinc-50/80 transition-colors"
                          >
                            <span className="text-xs font-semibold text-[#2D2D2D]">
                              Apa Kelebihan menjadi Master?
                            </span>
                            <ChevronRight
                              className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                                expandedAgentFaq["Apa Kelebihan menjadi Master?"] ? "rotate-90" : ""
                              }`}
                            />
                          </button>
                          {expandedAgentFaq["Apa Kelebihan menjadi Master?"] && (
                            <div className="px-3.5 pb-3.5 pt-1 text-[11px] text-zinc-500 leading-relaxed border-t border-zinc-100 space-y-1.5">
                              <p className="font-medium text-zinc-700">Fitur-fitur yang diperbolehkan oleh Master Yaitu:</p>
                              <div className="space-y-1 pl-1">
                                <div className="flex items-start gap-1.5">
                                  <span className="text-zinc-400">•</span>
                                  <span><strong className="text-zinc-700">Fitur Cashback:</strong> Dapat memperoleh cashback dari setiap transaksi sukses</span>
                                </div>
                                <div className="flex items-start gap-1.5">
                                  <span className="text-zinc-400">•</span>
                                  <span><strong className="text-zinc-700">Fitur Referal:</strong> Dapat merekrut Agen secara langsung untuk menjadi downline</span>
                                </div>
                                <div className="flex items-start gap-1.5">
                                  <span className="text-zinc-400">•</span>
                                  <span><strong className="text-zinc-700">Fitur Utang:</strong> Dapat mencatat transaksi yang diutangkan</span>
                                </div>
                              </div>
                              <p className="text-[10px] text-[#ED1C24] font-medium pt-1">
                                * Cashback diberikan per admin dan setiap harga produk hanya memiliki 1 jenis cashback
                              </p>
                            </div>
                          )}
                        </div>

                        {/* FAQ 3: Bagaimana Cara menjadi Master? */}
                        <div className="bg-white rounded-xl border border-zinc-200/80 shadow-xs overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedAgentFaq((prev) => ({
                                ...prev,
                                "Bagaimana Cara menjadi Master?": !prev["Bagaimana Cara menjadi Master?"],
                              }))
                            }
                            className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-zinc-50/80 transition-colors"
                          >
                            <span className="text-xs font-semibold text-[#2D2D2D]">
                              Bagaimana Cara menjadi Master?
                            </span>
                            <ChevronRight
                              className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                                expandedAgentFaq["Bagaimana Cara menjadi Master?"] ? "rotate-90" : ""
                              }`}
                            />
                          </button>
                          {expandedAgentFaq["Bagaimana Cara menjadi Master?"] && (
                            <div className="px-3.5 pb-3.5 pt-1 text-[11px] text-zinc-500 leading-relaxed border-t border-zinc-100">
                              Admin berhak untuk mengubah status agen ke Master apabila total transaksi agen selama 30 hari terakhir telah mencapai Rp1.000.000.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Interactive Demo Mode Toggle */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setIsMasterMode(!isMasterMode)}
                          className="w-full py-2.5 px-3 rounded-xl border border-dashed border-red-300 bg-red-50/60 hover:bg-red-50 text-[#ED1C24] text-[11px] font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>{isMasterMode ? "Tutup Mode Master (Kembali ke Info Agen)" : "Simulasi Akses Dashboard Master (Demo)"}</span>
                        </button>
                      </div>

                      {/* Master Agent Dashboard (Shown when Demo Mode active) */}
                      {isMasterMode && (
                        <div className="bg-gradient-to-br from-[#ED1C24] to-[#C4121A] text-white p-4 rounded-2xl shadow-sm space-y-3 mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-mono tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                              AKSES MASTER AKTIF
                            </span>
                            <span className="text-[10px] text-white/80">ID Master: #MPP-8819</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-center text-xs">
                            <div className="bg-white/10 rounded-xl p-2.5">
                              <div className="text-[10px] text-white/70">Saldo Komisi</div>
                              <div className="font-bold font-mono text-sm mt-0.5">
                                {komisiClaimed ? "Rp 0" : "Rp 842.500"}
                              </div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-2.5">
                              <div className="text-[10px] text-white/70">Downline Aktif</div>
                              <div className="font-bold font-mono text-sm mt-0.5">14 Toko</div>
                            </div>
                          </div>

                          {!komisiClaimed ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSaldo((prev) => prev + 842500);
                                setKomisiClaimed(true);
                              }}
                              className="w-full py-2 rounded-xl bg-white text-[#ED1C24] text-xs font-bold hover:bg-zinc-100 transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Cairkan Komisi ke Saldo Utama (+Rp 842.500)</span>
                            </button>
                          ) : (
                            <div className="py-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-200 text-[11px] font-medium text-center flex items-center justify-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                              <span>Komisi Rp 842.500 berhasil ditambahkan ke saldo!</span>
                            </div>
                          )}

                          <div className="pt-2 border-t border-white/20 text-[10px] text-white/80 space-y-1">
                            <div className="font-semibold text-white">4 Downline Teratas:</div>
                            <div className="flex justify-between">
                              <span>Toko Berkah Cell (Tasikmalaya)</span>
                              <span className="font-mono">+Rp 320.000</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Loket Sentosa Jaya (Bandung)</span>
                              <span className="font-mono">+Rp 245.000</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Agen Barokah PPOB (Ciamis)</span>
                              <span className="font-mono">+Rp 182.500</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Abel Cell 2 (Garut)</span>
                              <span className="font-mono">+Rp 95.000</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: AKUN / PROFIL */}
                {activeTab === 4 && (
                  <div className="p-4 pt-11 space-y-3 pb-6">
                    <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-red-100 text-[#ED1C24] flex items-center justify-center font-bold text-sm">
                        AT
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900 text-sm flex items-center gap-1.5">
                          <span>Abel Thareq</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-mono font-semibold">
                            VERIFIED KYC
                          </span>
                        </div>
                        <div className="text-xs text-zinc-500 font-mono">+62 812-3456-7890</div>
                        <div className="text-[10px] text-zinc-400">abel.thareq88@gmail.com</div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden text-xs">
                      <div className="p-3 bg-zinc-50/80 border-b border-zinc-100 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                        Pengaturan Akun & Keamanan
                      </div>
                      {[
                        { label: "Pengaturan Keamanan & PIN", desc: "Ubah 6-digit PIN otorisasi", icon: KeyRound, onClick: () => navigateTo("change_pin") },
                        { label: "Kelola Perangkat Saya", desc: "Lihat 3 perangkat aktif", icon: Smartphone, onClick: () => navigateTo("my_devices") },
                        { label: "Pengaturan Format Struk", desc: "Nama loket & ukuran thermal", icon: Printer, onClick: () => navigateTo("pengaturan_struk") },
                        { label: "Pusat Bantuan & Layanan CS", desc: "FAQ & WhatsApp 24 jam", icon: HelpCircle, onClick: () => navigateTo("help_center") },
                        { label: "Riwayat Transaksi Lengkap", desc: "Lihat semua mutasi saldo", icon: History, onClick: () => setActiveTab(1) },
                      ].map((item, idx) => (
                        <div
                          key={item.label}
                          onClick={item.onClick}
                          className={`p-3.5 flex items-center justify-between hover:bg-zinc-50 transition-colors cursor-pointer ${
                            idx > 0 ? "border-t border-zinc-100" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-50 text-[#ED1C24] flex items-center justify-center">
                              <item.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-semibold text-zinc-800">{item.label}</div>
                              <div className="text-[10px] text-zinc-400">{item.desc}</div>
                            </div>
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

          {/* ================= FLUTTER CUSTOM NAVBAR ================= */}
          {/* Authentic scooping notch with floating circular gradient button, NO text labels */}
          {currentFlow === "home" && (
            <div className="absolute bottom-0 left-0 right-0 h-[68px] z-40 select-none">
              {/* White scooped navbar background matching Flutter NavBarPainter */}
              <div className="absolute inset-0 bg-white border-t border-zinc-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]" />

              {/* 5 Bottom Nav Items (Shop: 0, Mutasi: 1, Home: 2, Mitra: 3, Akun: 4) */}
              <div className="relative h-full flex items-center justify-around px-2 z-10">
                {[
                  { icon: "/assets/ppob/images/navbar_shop.png", tab: 0 },
                  { icon: "/assets/ppob/images/navbar_mutasi.png", tab: 1 },
                  { icon: "/assets/ppob/images/navbar_homepage.png", tab: 2 },
                  { icon: "/assets/ppob/images/navbar_komunitas.png", tab: 3 },
                  { icon: "/assets/ppob/images/navbar_akun.png", tab: 4 },
                ].map((item) => {
                  const isSelected = activeTab === item.tab;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => setActiveTab(item.tab as TabIndex)}
                      className="relative w-12 h-full flex items-center justify-center cursor-pointer outline-none focus:outline-none focus-visible:outline-none select-none"
                    >
                      {isSelected ? (
                        /* Floating Highlight Circle matching Flutter CustomNavBar (gradient #F57478 to #F03E45, top -20) */
                        <div className="absolute -top-4 w-14 h-14 rounded-full bg-gradient-to-br from-[#F57478] to-[#F03E45] shadow-[0_4px_12px_rgba(240,62,69,0.4)] flex items-center justify-center pointer-events-none">
                          <Image
                            src={item.icon}
                            alt="Active Tab"
                            width={28}
                            height={28}
                            className="object-contain brightness-0 invert"
                          />
                        </div>
                      ) : (
                        <Image
                          src={item.icon}
                          alt="Inactive Tab"
                          width={26}
                          height={26}
                          className="object-contain opacity-40 grayscale hover:opacity-60 transition-opacity"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Home Indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-400 rounded-full z-50 pointer-events-none" />
        </div>
      </div>
    </div>

      {/* ================= MODALS ================= */}

      {/* 1. Payment Confirmation Modal */}
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
                  className="p-1 rounded-full text-zinc-400 hover:bg-zinc-100 cursor-pointer"
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

              <p className="text-xs text-zinc-500">
                Ketik 6 digit PIN akun Merah Putih Pay Anda untuk otorisasi transaksi.
              </p>

              {/* PIN Bullets Display */}
              <div className="flex justify-center gap-3 my-3">
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const filled = idx < pinDigits.length;
                  return (
                    <div
                      key={idx}
                      className={`w-3.5 h-3.5 rounded-full transition-all ${
                        filled ? "bg-[#ED1C24] scale-110" : "bg-zinc-200"
                      }`}
                    />
                  );
                })}
              </div>

              {isProcessing ? (
                <div className="py-6 flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-[#ED1C24] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-zinc-500">Memproses Transaksi...</span>
                </div>
              ) : (
                /* Numeric Keypad */
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                    <button
                      key={num}
                      onClick={() => handlePinInput(num)}
                      className="h-12 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-base cursor-pointer active:scale-95 transition-transform"
                    >
                      {num}
                    </button>
                  ))}
                  <div />
                  <button
                    onClick={() => handlePinInput("0")}
                    className="h-12 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold text-base cursor-pointer active:scale-95 transition-transform"
                  >
                    0
                  </button>
                  <button
                    onClick={handlePinBackspace}
                    className="h-12 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center cursor-pointer active:scale-95 transition-transform text-xs font-semibold"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
