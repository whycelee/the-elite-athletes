'use client'

import { useState, useMemo, useEffect } from 'react'

// ═══════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════
const C = {
  cream:'#FAF8F4', cream2:'#F4F1EB', white:'#FFFFFF',
  g900:'#1A2E1E', g800:'#1F3B24', g700:'#2D5134',
  g600:'#3B6B44', g500:'#4A8555', g400:'#5C9E68',
  g300:'#86BC91', g200:'#B8D9BF', g100:'#DDF0E1', g50:'#F0F9F2',
  ink:'#1C1C1A', ink2:'#3A3A36', ink3:'#6B6B63',
  ink4:'#A8A89E', ink5:'#D4D4CC', ink6:'#EDECEA',
  gold:'#B5924C', gold2:'#D4AF72', goldBg:'#FFFBEB',
  red:'#C0392B', redBg:'#FEF2F2', redLight:'#FCA5A5',
  blue:'#1D6FAA', blueBg:'#EFF6FF',
  amber:'#92400E', amberBg:'#FFFBEB',
}

// ═══════════════════════════════════════════════════════════
// SEED DATA
// ═══════════════════════════════════════════════════════════
const ALL_PRODUCTS = [
  { id:'TEA-001', sku:'TEA-TEN-001', sport:'Tennis',  gender:'Men',    name:'Court Precision Polo',  price:649000, hpp:280000, original:890000,  rating:4.9, reviews:214, badge:'Best Seller', emoji:'🎾', tags:['Moisture-Wicking','UV Protection'], sports:['Tennis','Padel'], desc:'Engineered for match-day performance with advanced moisture-wicking technology.', sizes:['S','M','L','XL','XXL'], colors:['Forest','White','Navy'],    stock:{S:12,M:24,L:18,XL:8,XXL:3},  status:'active',   reorder:5 },
  { id:'TEA-002', sku:'TEA-RUN-002', sport:'Running', gender:'Women',  name:'AeroStride Tights',     price:549000, hpp:230000, original:null,    rating:4.8, reviews:178, badge:'New',         emoji:'🏃', tags:['4-Way Stretch','Reflective'],    desc:'Unrestricted movement for every stride. High-waist with hidden pocket.',        sizes:['XS','S','M','L','XL'],   colors:['Black','Forest','Charcoal'],stock:{XS:5,S:14,M:20,L:11,XL:4},   status:'active',   reorder:5 },
  { id:'TEA-003', sku:'TEA-HYR-003', sport:'Hyrox',   gender:'Men',    name:'Elite Training Tee',    price:389000, hpp:150000, original:520000,  rating:4.7, reviews:132, badge:'Sale',        emoji:'🏋️', tags:['Anti-Odor','Seamless'],          desc:'Built for the toughest workouts. Seamless construction eliminates chafing.',    sizes:['S','M','L','XL','XXL'], colors:['Black','Olive','White'],    stock:{S:2,M:5,L:3,XL:1,XXL:0},  status:'low',      reorder:8 },
  { id:'TEA-004', sku:'TEA-GOL-004', sport:'Golf',    gender:'Men',    name:'Course Ready Shorts',   price:729000, hpp:310000, original:null,    rating:5.0, reviews:89,  badge:'Limited',     emoji:'⛳', tags:['Quick-Dry','Stretch Waist'],     desc:'Refined comfort from tee to green.',                                            sizes:['S','M','L','XL'],       colors:['Khaki','Navy','Forest'], stock:{S:9,M:15,L:10,XL:6},      status:'active',   reorder:4 },
  { id:'TEA-005', sku:'TEA-YOG-005', sport:'Yoga',    gender:'Women',  name:'Flow State Leggings',   price:499000, hpp:200000, original:620000,  rating:4.9, reviews:305, badge:'Best Seller', emoji:'🪷', tags:['Buttery Soft','High Waist'],     desc:'Our softest fabric yet, designed for flow-based practices.',                    sizes:['XS','S','M','L','XL'],   colors:['Sage','Black','Blush'], stock:{XS:0,S:0,M:2,L:1,XL:0},   status:'critical', reorder:8 },
  { id:'TEA-006', sku:'TEA-PAD-006', sport:'Padel',   gender:'Unisex', name:'Padel Court Jacket',    price:890000, hpp:380000, original:null,    rating:4.6, reviews:54,  badge:'New',         emoji:'🏓', tags:['Wind-Resistant','Packable'],     desc:'Lightweight wind-resistant jacket that packs into its own pocket.',             sizes:['S','M','L','XL','XXL'], colors:['Forest','Black'],        stock:{S:7,M:13,L:9,XL:5,XXL:2},status:'active',   reorder:3 },
  { id:'TEA-007', sku:'TEA-RUN-007', sport:'Running', gender:'Men',    name:'Pace Setter Shorts',    price:429000, hpp:170000, original:null,    rating:4.7, reviews:143, badge:'New',         emoji:'🏃', tags:['2-in-1','Liner Pocket'],        desc:'2-in-1 running shorts with built-in compression liner.',                       sizes:['S','M','L','XL','XXL'], colors:['Black','Navy','Forest'], stock:{S:18,M:22,L:16,XL:9,XXL:4},status:'active', reorder:6 },
  { id:'TEA-008', sku:'TEA-GYM-008', sport:'Gym',     gender:'Unisex', name:'Power Flex Hoodie',     price:699000, hpp:290000, original:850000,  rating:4.8, reviews:201, badge:'Sale',        emoji:'💪', tags:['Fleece-Lined','Thumb Holes'],   desc:'Post-workout essential. Fleece-lined interior with thumb holes.',              sizes:['S','M','L','XL','XXL'], colors:['Charcoal','Forest','Cream'],stock:{S:6,M:11,L:8,XL:4,XXL:1},status:'active',  reorder:4 },
  { id:'TEA-009', sku:'TEA-PIL-009', sport:'Pilates', gender:'Women',  name:'Studio Crop Top',       price:329000, hpp:130000, original:null,    rating:4.8, reviews:178, badge:null,          emoji:'🧘', tags:['Scoop Back','Supportive'],       desc:'Minimal, supportive, and effortlessly stylish.',                               sizes:['XS','S','M','L'],       colors:['Sage','Black','Sand'],   stock:{XS:3,S:8,M:12,L:7},       status:'active',   reorder:5 },
  { id:'TEA-010', sku:'TEA-GOL-010', sport:'Golf',    gender:'Women',  name:'Performance Polo Women',price:620000, hpp:260000, original:780000,  rating:4.7, reviews:62,  badge:'Sale',        emoji:'⛳', tags:['UV Protection','Stretch'],       desc:'Feminine cut meets performance fabric.',                                        sizes:['XS','S','M','L','XL'],   colors:['White','Blush','Navy'], stock:{XS:0,S:0,M:0,L:0,XL:0},   status:'out',      reorder:5 },
]

const INIT_CUSTOMERS = [
  { id:'CUS-001', name:'Sarah Kusuma',     phone:'0812-3456-7890', email:'sarah.k@gmail.com',  address:'Jl. Sudirman No.12, Jakarta Selatan',    totalSpent:2847000, orders:['ORD-001','ORD-007'], joinDate:'2024-03-15', lastOrder:'2025-03-28' },
  { id:'CUS-002', name:'Bagas Wicaksono',  phone:'0821-9876-5432', email:'bagas.w@gmail.com',  address:'Jl. Kemang Raya No.45, Jakarta Selatan',  totalSpent:1390000, orders:['ORD-002'],           joinDate:'2024-07-22', lastOrder:'2025-03-25' },
  { id:'CUS-003', name:'Citra Andriani',   phone:'0856-7654-3210', email:'citra.a@yahoo.com',  address:'Jl. Tebet Barat No.8, Jakarta Selatan',   totalSpent:4128000, orders:['ORD-003','ORD-005'], joinDate:'2023-11-08', lastOrder:'2025-03-30' },
  { id:'CUS-004', name:'Rizky Firmansyah', phone:'0877-1234-5678', email:'rizky.f@gmail.com',  address:'Jl. Fatmawati No.33, Jakarta Selatan',    totalSpent:729000,  orders:['ORD-004'],           joinDate:'2025-01-10', lastOrder:'2025-03-20' },
  { id:'CUS-005', name:'Dewi Rahayu',      phone:'0838-9012-3456', email:'dewi.r@outlook.com', address:'Jl. Puri Indah No.22, Jakarta Barat',     totalSpent:3278000, orders:['ORD-006'],           joinDate:'2024-05-18', lastOrder:'2025-04-01' },
  { id:'CUS-006', name:'Andi Pratama',     phone:'0815-5678-9012', email:'andi.p@gmail.com',   address:'Jl. Kelapa Gading No.55, Jakarta Utara',  totalSpent:1948000, orders:['ORD-008'],           joinDate:'2024-09-03', lastOrder:'2025-03-15' },
  { id:'CUS-007', name:'Nadia Putri',      phone:'0896-3456-7890', email:'nadia.p@gmail.com',  address:'Jl. BSD Serpong No.7, Tangerang Selatan', totalSpent:5670000, orders:['ORD-011'],           joinDate:'2023-08-14', lastOrder:'2025-04-01' },
]

const INIT_ORDERS = [
  { id:'ORD-001', customerId:'CUS-001', customerName:'Sarah Kusuma',     date:'2025-03-28', status:'delivered',  payment:'Transfer', total:1847000, address:'Jl. Sudirman No.12, Jaksel',    items:[{sku:'TEA-TEN-001',name:'Court Precision Polo',size:'M',qty:2,price:649000},{sku:'TEA-RUN-002',name:'AeroStride Tights',size:'S',qty:1,price:549000}] },
  { id:'ORD-002', customerId:'CUS-002', customerName:'Bagas Wicaksono',  date:'2025-03-25', status:'shipped',    payment:'QRIS',     total:1088000, address:'Jl. Kemang Raya No.45, Jaksel', items:[{sku:'TEA-HYR-003',name:'Elite Training Tee',size:'L',qty:1,price:389000},{sku:'TEA-GYM-008',name:'Power Flex Hoodie',size:'L',qty:1,price:699000}] },
  { id:'ORD-003', customerId:'CUS-003', customerName:'Citra Andriani',   date:'2025-03-30', status:'processing', payment:'Midtrans', total:1656000, address:'Jl. Tebet Barat No.8, Jaksel',  items:[{sku:'TEA-YOG-005',name:'Flow State Leggings',size:'M',qty:2,price:499000},{sku:'TEA-PIL-009',name:'Studio Crop Top',size:'S',qty:2,price:329000}] },
  { id:'ORD-004', customerId:'CUS-004', customerName:'Rizky Firmansyah', date:'2025-03-20', status:'delivered',  payment:'Transfer', total:729000,  address:'Jl. Fatmawati No.33, Jaksel',   items:[{sku:'TEA-GOL-004',name:'Course Ready Shorts',size:'M',qty:1,price:729000}] },
  { id:'ORD-005', customerId:'CUS-003', customerName:'Citra Andriani',   date:'2025-02-14', status:'delivered',  payment:'QRIS',     total:1319000, address:'Jl. Tebet Barat No.8, Jaksel',  items:[{sku:'TEA-PAD-006',name:'Padel Court Jacket',size:'S',qty:1,price:890000}] },
  { id:'ORD-006', customerId:'CUS-005', customerName:'Dewi Rahayu',      date:'2025-03-31', status:'pending',    payment:'Midtrans', total:1298000, address:'Jl. Puri Indah No.22, Jakbar',  items:[{sku:'TEA-TEN-001',name:'Court Precision Polo',size:'L',qty:2,price:649000}] },
  { id:'ORD-007', customerId:'CUS-001', customerName:'Sarah Kusuma',     date:'2025-01-10', status:'delivered',  payment:'Transfer', total:1028000, address:'Jl. Sudirman No.12, Jaksel',    items:[{sku:'TEA-GYM-008',name:'Power Flex Hoodie',size:'M',qty:1,price:699000}] },
  { id:'ORD-008', customerId:'CUS-006', customerName:'Andi Pratama',     date:'2025-03-15', status:'shipped',    payment:'Transfer', total:1876000, address:'Jl. Kelapa Gading No.55, Jakut',items:[{sku:'TEA-RUN-002',name:'AeroStride Tights',size:'M',qty:2,price:549000}] },
]

const SPORTS_LIST = ['Tennis','Badminton','Padel','Hyrox','Gym','Running','Golf','Pilates','Yoga','Footwear','Aksesoris','Lainnya']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MONTH_ID: Record<string,string> = {Jan:'Januari',Feb:'Februari',Mar:'Maret',Apr:'April',May:'Mei',Jun:'Juni',Jul:'Juli',Aug:'Agustus',Sep:'September',Oct:'Oktober',Nov:'November',Dec:'Desember'}
const PPN = 0.11
const SUPERIOR_PIN = '082505'
const SHIPPING_OPTIONS = [
  {id:'regular',label:'Regular Delivery',desc:'3–5 hari kerja',price:25000,icon:'📦'},
  {id:'express',label:'Express Delivery',desc:'1–2 hari kerja',price:45000,icon:'⚡'},
  {id:'same',label:'Same-Day',desc:'Hari ini (order <12:00)',price:75000,icon:'🚀'},
]
const PAYMENT_METHODS = [
  {id:'transfer',label:'Bank Transfer',icons:['BCA','BNI','Mandiri'],desc:'Virtual Account',icon:'🏦'},
  {id:'qris',label:'QRIS',icons:['GoPay','OVO','Dana'],desc:'Scan QR e-wallet',icon:'⬛'},
  {id:'midtrans',label:'Kartu Kredit/Debit',icons:['Visa','MC'],desc:'Visa, Mastercard',icon:'💳'},
  {id:'cod',label:'Bayar di Tempat',icons:['COD'],desc:'Jakarta only',icon:'💵'},
]
const PROVINCES = [
  'Aceh','Sumatera Utara','Sumatera Barat','Riau','Kepulauan Riau',
  'Jambi','Sumatera Selatan','Kepulauan Bangka Belitung','Bengkulu','Lampung',
  'DKI Jakarta','Jawa Barat','Banten','Jawa Tengah','DI Yogyakarta','Jawa Timur',
  'Bali','Nusa Tenggara Barat','Nusa Tenggara Timur',
  'Kalimantan Barat','Kalimantan Tengah','Kalimantan Selatan','Kalimantan Timur','Kalimantan Utara',
  'Sulawesi Utara','Gorontalo','Sulawesi Tengah','Sulawesi Barat','Sulawesi Selatan','Sulawesi Tenggara',
  'Maluku','Maluku Utara',
  'Papua','Papua Barat','Papua Selatan','Papua Tengah','Papua Pegunungan','Papua Barat Daya'
]
const INTEGRATIONS_DATA = [
  {id:'midtrans', name:'Midtrans',         category:'Payment Gateway', logo:'💳', color:C.blue,   colorBg:C.blueBg,  tagline:'QRIS + Virtual Account + Kartu Kredit', fee:'0.7–2% per transaksi', channels:['QRIS','BCA VA','BNI VA','Mandiri VA','GoPay','ShopeePay'], docs:'https://docs.midtrans.com', signup:'https://dashboard.midtrans.com/register', steps:['Daftar di midtrans.com — sandbox langsung aktif tanpa dokumen','Settings → Access Keys → Copy Server Key & Client Key','Isi credentials di bawah → Save → Test Connection','Settings → Payment Notification → isi URL webhook','Copy kode API route ke project Next.js'], creds:[{key:'MIDTRANS_SERVER_KEY',label:'Server Key',type:'password',placeholder:'SB-Mid-server-xxxx',hint:'Settings → Access Keys'},{key:'MIDTRANS_CLIENT_KEY',label:'Client Key',type:'text',placeholder:'SB-Mid-client-xxxx',hint:'Untuk Snap popup di frontend'},{key:'MIDTRANS_ENVIRONMENT',label:'Environment',type:'select',options:['sandbox','production'],hint:'Gunakan sandbox untuk testing dulu'}], env:['MIDTRANS_SERVER_KEY=SB-Mid-server-xxxx','MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxx','NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxx','MIDTRANS_ENVIRONMENT=sandbox']},
  {id:'rajaongkir',name:'RajaOngkir',      category:'Shipping',        logo:'📦', color:C.g600,   colorBg:C.g50,     tagline:'JNE, J&T, SiCepat & 20+ kurir Indonesia', fee:'Gratis 5.000 req/hari', channels:['JNE','J&T Express','SiCepat','AnterAja','Pos Indonesia'], docs:'https://rajaongkir.com/dokumentasi', signup:'https://rajaongkir.com/daftar', steps:['Daftar di rajaongkir.com — Starter tier gratis langsung aktif','Dashboard → API Key → Copy key kamu','Isi API Key di bawah → Save → Test','Pastikan setiap produk ada data berat (gram)','Copy kode API route ke /api/shipping/'], creds:[{key:'RAJAONGKIR_API_KEY',label:'API Key',type:'password',placeholder:'xxxxxxxxxxxxxxxx',hint:'Dashboard RajaOngkir → API Key'},{key:'RAJAONGKIR_TIER',label:'Tier',type:'select',options:['starter','basic','pro'],hint:'Starter gratis, Basic/Pro untuk lebih banyak kurir'}], env:['RAJAONGKIR_API_KEY=xxxxxxxxxxxxxxxx','RAJAONGKIR_TIER=starter']},
  {id:'meta',     name:'Meta Pixel',        category:'Ads & Analytics', logo:'📘', color:'#1877F2',colorBg:'#EFF6FF', tagline:'Facebook & Instagram — Retargeting & Conversion', fee:'Gratis (biaya iklan terpisah)', channels:['Facebook Feed','Instagram Feed','Reels','Stories'], docs:'https://developers.facebook.com/docs/meta-pixel', signup:'https://business.facebook.com', steps:['Buat Meta Business Account di business.facebook.com','Events Manager → Connect Data Sources → Web → Meta Pixel → Copy Pixel ID','Isi Pixel ID di bawah → Save','Tambahkan <MetaPixel /> ke src/app/layout.tsx','Events Manager → Test Events → verifikasi PageView muncul'], creds:[{key:'NEXT_PUBLIC_META_PIXEL_ID',label:'Pixel ID',type:'text',placeholder:'1234567890123456',hint:'Events Manager → Data Sources → Pixel ID'},{key:'META_CONVERSION_API_TOKEN',label:'Conversion API Token',type:'password',placeholder:'EAAxxxx',hint:'Opsional. Events Manager → Settings → Generate Token'}], env:['NEXT_PUBLIC_META_PIXEL_ID=1234567890123456','META_CONVERSION_API_TOKEN=EAAxxxx']},
  {id:'tiktok',   name:'TikTok Pixel',      category:'Ads & Analytics', logo:'🎵', color:'#010101',colorBg:'#F3F0FF', tagline:'TikTok Ads — In-Feed, Shopping & Spark Ads', fee:'Gratis (min. budget $20/hari untuk iklan)', channels:['TikTok In-Feed','TopView','TikTok Shop','Spark Ads'], docs:'https://ads.tiktok.com/help/article/tiktok-pixel', signup:'https://ads.tiktok.com', steps:['Buat TikTok Ads Manager di ads.tiktok.com','Assets → Events → Web Events → Create Pixel → Copy Pixel ID','Setup Events API: Assets → Events → Set Up Events API → Access Token','Isi Pixel ID & Token → Save → Test','Install Chrome ext "TikTok Pixel Helper" → verifikasi events muncul'], creds:[{key:'NEXT_PUBLIC_TIKTOK_PIXEL_ID',label:'Pixel ID',type:'text',placeholder:'XXXXXXXXXXXXXXXXXX',hint:'Ads Manager → Assets → Events → Pixel ID'},{key:'TIKTOK_EVENTS_API_TOKEN',label:'Events API Token',type:'password',placeholder:'xxxxxxxxxxxxxxxx',hint:'Events → Set Up Events API → Access Token'}], env:['NEXT_PUBLIC_TIKTOK_PIXEL_ID=XXXXXXXXXXXXXXXXXX','TIKTOK_EVENTS_API_TOKEN=xxxxxxxxxxxxxxxx']},
  {id:'google',   name:'Google GA4 & Ads',  category:'Ads & Analytics', logo:'🔍', color:'#EA4335',colorBg:'#FEF2F2', tagline:'Google Search, Shopping & YouTube Conversion Tracking', fee:'Gratis (biaya iklan terpisah)', channels:['Google Search','Google Shopping','YouTube','Display Network'], docs:'https://developers.google.com/analytics', signup:'https://analytics.google.com', steps:['Buat GA4 property → analytics.google.com → Copy Measurement ID (G-XXXXXXXXXX)','GA4 → Admin → Google Ads Links → Link akun Google Ads kamu','Isi Measurement ID di bawah → Save','npm install @next/third-parties → tambah <GoogleAnalytics /> ke layout.tsx','Verifikasi di GA4 DebugView dengan Chrome extension "GA Debugger"'], creds:[{key:'NEXT_PUBLIC_GA4_MEASUREMENT_ID',label:'GA4 Measurement ID',type:'text',placeholder:'G-XXXXXXXXXX',hint:'GA4 → Admin → Data Streams → Web → Measurement ID'},{key:'NEXT_PUBLIC_GADS_CONVERSION_ID',label:'Google Ads Conversion ID',type:'text',placeholder:'AW-XXXXXXXXXX',hint:'Google Ads → Tools → Conversions → Tag Setup'}], env:['NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX','NEXT_PUBLIC_GADS_CONVERSION_ID=AW-XXXXXXXXXX']},
  {id:'whatsapp', name:'WhatsApp Business', category:'Notifikasi & CRM',logo:'💬', color:'#25D366',colorBg:'#F0FFF4', tagline:'Notifikasi Order Otomatis — Open rate 98%', fee:'Gratis 1.000 conversation/bulan', channels:['Order Confirmation','Shipping Update','Delivery Notice','Abandoned Cart'], docs:'https://developers.facebook.com/docs/whatsapp', signup:'https://business.whatsapp.com', steps:['Verifikasi Meta Business Account di business.facebook.com','Business Assets → WhatsApp Accounts → Add → masukkan nomor HP bisnis baru','System Users → Generate permanent access token dengan permission whatsapp_business_messaging','WhatsApp Manager → Phone Numbers → Copy Phone Number ID (bukan nomor HP)','Buat & submit message templates di WA Manager → tunggu approval Meta (1–24 jam)'], creds:[{key:'WHATSAPP_ACCESS_TOKEN',label:'Access Token',type:'password',placeholder:'EAAxxxx',hint:'Meta Business → System Users → Generate Token'},{key:'WHATSAPP_PHONE_ID',label:'Phone Number ID',type:'text',placeholder:'1234567890123456',hint:'WA Manager → Phone Numbers → Phone Number ID'},{key:'WHATSAPP_VERIFY_TOKEN',label:'Webhook Verify Token',type:'text',placeholder:'my_secret_token',hint:'String random untuk verifikasi webhook dari Meta'}], env:['WHATSAPP_ACCESS_TOKEN=EAAxxxx','WHATSAPP_PHONE_ID=1234567890123456','WHATSAPP_VERIFY_TOKEN=my_secret_token']},
]

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════
const fmt     = (n: number) => 'Rp ' + Number(n).toLocaleString('id-ID')
const fmtM    = (n: number) => { const a=Math.abs(n); return (n<0?'-':'')+'Rp '+(a>=1e6?(a/1e6).toFixed(1)+'Jt':(a/1e3).toFixed(0)+'K') }
const fmtDate = (d: string) => {
  if(!d) return '-'
  const dt = new Date(d)
  if(isNaN(dt.getTime())) return '-'
  return dt.toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})
}
const pct     = (a: number,b: number) => b===0?0:(a/b)*100
const totStock= (p: any) => Object.values(p.stock as Record<string,number>).reduce((s,n)=>s+n,0)

// Export to Excel (CSV format, opens in Excel)
function exportCSV(filename: string, headers: string[], rows: any[][]) {
  const BOM = '﻿'
  const csv = BOM + [headers, ...rows].map(r => r.map((c:any) => `"${String(c??'').replace(/"/g,'""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href=url; a.download=filename+'.csv'; a.click()
  URL.revokeObjectURL(url)
}

const STATUS_CFG: Record<string,{bg:string,text:string,label:string}> = {
  active:    {bg:C.g50,    text:C.g700,  label:'Active'},
  low:       {bg:C.amberBg,text:C.amber, label:'Low Stock'},
  critical:  {bg:'#FFF7ED',text:'#C2410C',label:'Critical'},
  out:       {bg:C.redBg,  text:C.red,   label:'Out of Stock'},
  pending:   {bg:C.amberBg,text:'#B45309',label:'Pending'},
  processing:{bg:C.blueBg, text:C.blue,  label:'Processing'},
  shipped:   {bg:'#EEF2FF',text:'#4338CA',label:'Shipped'},
  delivered: {bg:C.g50,    text:C.g700,  label:'Delivered'},
  cancelled: {bg:C.redBg,  text:C.red,   label:'Cancelled'},
}

// ═══════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════
function SBadge({status}:{status:string}) {
  const s=STATUS_CFG[status]||{bg:C.ink6,text:C.ink3,label:status}
  return <span style={{background:s.bg,color:s.text,fontSize:10,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',padding:'3px 9px',borderRadius:20,whiteSpace:'nowrap'}}>{s.label}</span>
}
function PBadge({label}:{label:string|null}) {
  if(!label) return null
  const m:Record<string,{bg:string,color:string}>={'Best Seller':{bg:C.g700,color:'#fff'},'New':{bg:C.ink,color:'#fff'},'Sale':{bg:'#C0392B',color:'#fff'},'Limited':{bg:C.gold,color:'#fff'}}
  const s=m[label]||{bg:C.ink5,color:C.ink}
  return <span style={{fontSize:9,fontWeight:800,letterSpacing:'0.1em',textTransform:'uppercase',padding:'4px 9px',borderRadius:4,background:s.bg,color:s.color,display:'inline-block'}}>{label}</span>
}
function Stars({r=5,size=11}:{r?:number,size?:number}) {
  return <span style={{display:'inline-flex',alignItems:'center',gap:2}}>
    {[1,2,3,4,5].map(i=><svg key={i} width={size} height={size} viewBox="0 0 12 12"><polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9.2,11 6,9.2 2.8,11 3.5,7.5 1,5 4.5,4.5" fill={i<=Math.round(r)?C.gold2:C.ink5}/></svg>)}
    <span style={{fontSize:size,color:C.ink3,marginLeft:3,fontWeight:600}}>{r}</span>
  </span>
}
function Toast({msg,onDone}:{msg:string,onDone:()=>void}) {
  useEffect(()=>{const t=setTimeout(onDone,2600);return()=>clearTimeout(t)},[])
  return <div style={{position:'fixed',top:20,right:20,zIndex:9999,background:C.g800,color:C.g100,padding:'12px 18px',borderRadius:12,fontSize:13,display:'flex',alignItems:'center',gap:10,boxShadow:'0 8px 32px rgba(0,0,0,0.18)'}}>
    <span style={{color:C.g400}}>✓</span><span><strong style={{color:'#fff'}}>{msg}</strong> ditambahkan ke keranjang</span>
  </div>
}
function MiniCard({p,onView,onAdd}:{p:any,onView:()=>void,onAdd:()=>void}) {
  const [hov,setHov]=useState(false)
  const disc=p.original?Math.round((1-p.price/p.original)*100):null
  return <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
    style={{background:C.white,border:`1px solid ${hov?C.g300:C.ink6}`,borderRadius:16,overflow:'hidden',transform:hov?'translateY(-4px)':'none',boxShadow:hov?'0 12px 36px rgba(42,80,50,0.10)':'none',transition:'all 0.25s',display:'flex',flexDirection:'column',cursor:'pointer'}}>
    <div onClick={onView} style={{height:200,background:C.cream,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
      {p.image_url
        ?<img src={p.image_url} alt={p.name} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}}/>
        :<span style={{fontSize:72,position:'relative',zIndex:1}}>{p.emoji}</span>
      }
      <div style={{position:'absolute',top:12,left:12}}><PBadge label={p.badge}/></div>
      {disc&&<div style={{position:'absolute',top:12,right:12,background:C.white,color:'#C0392B',fontSize:10,fontWeight:800,padding:'4px 8px',borderRadius:5,border:'1px solid #F5C6C2'}}>−{disc}%</div>}
    </div>
    <div style={{padding:'14px 16px 16px',display:'flex',flexDirection:'column',gap:6,flex:1}}>
      <span style={{fontSize:10,fontWeight:700,color:C.g500,letterSpacing:'0.1em',textTransform:'uppercase'}}>{p.sport}</span>
      <p style={{margin:0,fontSize:14,fontWeight:700,color:C.ink,lineHeight:1.25}} onClick={onView}>{p.name}</p>
      <Stars r={p.rating}/>
      <div style={{display:'flex',alignItems:'baseline',gap:7,marginTop:2}}>
        <span style={{fontSize:16,fontWeight:800,color:C.ink}}>{fmt(p.price)}</span>
        {p.original&&<span style={{fontSize:11,color:C.ink4,textDecoration:'line-through'}}>{fmt(p.original)}</span>}
      </div>
      <div style={{display:'flex',gap:7,marginTop:5}}>
        <button onClick={onView} style={{flex:1,padding:'9px 0',background:C.white,color:C.ink2,border:`1px solid ${C.ink5}`,borderRadius:9,fontSize:11,fontWeight:600,cursor:'pointer'}}>Detail</button>
        <button onClick={e=>{e.stopPropagation();onAdd()}} style={{flex:1,padding:'9px 0',background:hov?C.g700:C.white,color:hov?'#fff':C.g700,border:`1.5px solid ${hov?C.g700:C.g300}`,borderRadius:9,fontSize:11,fontWeight:700,cursor:'pointer',transition:'all 0.2s'}}>+ Cart</button>
      </div>
    </div>
  </div>
}
function StoreNavbar({nav,cartCount,onCartClick,scrolled}:{nav:(p:string,d?:any)=>void,cartCount:number,onCartClick:()=>void,scrolled:boolean}) {
  const [mobileMenu,setMobileMenu]=useState(false)
  return <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:500,background:scrolled||mobileMenu?'rgba(250,248,244,0.97)':' transparent',backdropFilter:scrolled||mobileMenu?'blur(12px)':'none',borderBottom:scrolled||mobileMenu?`1px solid ${C.ink6}`:'none',transition:'all 0.3s'}}>
    <div style={{background:C.g800,padding:'6px 5vw',textAlign:'center'}}>
      <span style={{fontSize:10,color:C.g100,fontWeight:500}}>FREE SHIPPING di atas Rp 500.000 · Kode <strong style={{color:C.g300}}>ELITE20</strong> diskon 20%</span>
    </div>
    <div style={{maxWidth:1280,margin:'0 auto',height:56,padding:'0 5vw',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      {/* LOGO */}
      <button onClick={()=>nav('home')} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:8,padding:0}}>
        <img src="/logo.png" alt="The Elite Athletes" style={{width:36,height:36,objectFit:'contain'}}/>
        <div style={{lineHeight:1}}><div style={{fontSize:12,fontWeight:700,color:C.g800,letterSpacing:'0.12em',textTransform:'uppercase'}}>The Elite</div><div style={{fontSize:9,fontWeight:500,color:C.g500,letterSpacing:'0.22em',textTransform:'uppercase'}}>Athletes</div></div>
      </button>
      {/* DESKTOP MENU */}
      <div className="desktop-only" style={{display:'flex',gap:28}}>
        {['Collection','Sports','About'].map(l=><button key={l} onClick={()=>l==='Collection'&&nav('catalog')} style={{background:'none',border:'none',cursor:'pointer',fontSize:13,fontWeight:500,color:C.ink2,padding:0}}>{l}</button>)}
      </div>
      {/* RIGHT ICONS */}
      <div style={{display:'flex',alignItems:'center',gap:6}}>

        <button onClick={onCartClick} style={{background:'none',border:`1px solid ${C.ink6}`,borderRadius:8,padding:'6px 9px',cursor:'pointer',position:'relative'}}>
          <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke={C.ink3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 2H4l2 8h8l2-6H5.5"/><circle cx="8" cy="15" r="1.2" fill={C.ink3} stroke="none"/><circle cx="14" cy="15" r="1.2" fill={C.ink3} stroke="none"/></svg>
          {cartCount>0&&<span style={{position:'absolute',top:-5,right:-5,background:C.g700,color:'#fff',width:17,height:17,borderRadius:'50%',fontSize:9,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center'}}>{cartCount}</span>}
        </button>
        {/* HAMBURGER — mobile only */}
        <button className="mobile-only" onClick={()=>setMobileMenu(m=>!m)} style={{background:'none',border:`1px solid ${C.ink6}`,borderRadius:8,padding:'6px 9px',cursor:'pointer',display:'none',flexDirection:'column',gap:4,alignItems:'center',justifyContent:'center',width:34,height:34}}>
          <span style={{display:'block',width:16,height:1.5,background:mobileMenu?C.red:C.ink3,transform:mobileMenu?'rotate(45deg) translate(4px,4px)':'none',transition:'all 0.2s'}}/>
          <span style={{display:'block',width:16,height:1.5,background:C.ink3,opacity:mobileMenu?0:1,transition:'all 0.2s'}}/>
          <span style={{display:'block',width:16,height:1.5,background:mobileMenu?C.red:C.ink3,transform:mobileMenu?'rotate(-45deg) translate(4px,-4px)':'none',transition:'all 0.2s'}}/>
        </button>
      </div>
    </div>
    {/* MOBILE DROPDOWN MENU */}
    {mobileMenu&&<div style={{background:'rgba(250,248,244,0.98)',borderTop:`1px solid ${C.ink6}`,padding:'16px 5vw 20px',animation:'slideDown 0.2s ease'}}>
      {[['🛍️','Collection','catalog'],['⚽','Sports','catalog'],['ℹ️','About','home']].map(([ic,label,page])=>(
        <button key={label} onClick={()=>{nav(page);setMobileMenu(false)}} style={{width:'100%',display:'flex',alignItems:'center',gap:12,padding:'13px 0',background:'none',border:'none',cursor:'pointer',borderBottom:`1px solid ${C.ink6}`,fontSize:15,fontWeight:500,color:C.ink2}}>
          <span style={{fontSize:18}}>{ic}</span>{label}
        </button>
      ))}
    </div>}
  </nav>
}
function CartDrawer({cart,onClose,onRemove,onCheckout}:{cart:any[],onClose:()=>void,onRemove:(i:number)=>void,onCheckout:()=>void}) {
  const total=cart.reduce((s:number,i:any)=>s+i.price*(i.qty||1),0)
  return <div style={{position:'fixed',inset:0,zIndex:800,display:'flex',justifyContent:'flex-end'}} onClick={onClose}>
    <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.25)'}}/>
    <div onClick={e=>e.stopPropagation()} style={{position:'relative',width:'min(420px,100vw)',background:C.white,height:'100vh',overflowY:'auto',display:'flex',flexDirection:'column',boxShadow:'-8px 0 40px rgba(0,0,0,0.12)'}}>
      <div style={{padding:'20px 22px 14px',borderBottom:`1px solid ${C.ink6}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2 style={{margin:0,fontSize:17,fontWeight:700,color:C.ink}}>Keranjang ({cart.length})</h2>
        <button onClick={onClose} style={{background:'none',border:`1px solid ${C.ink6}`,borderRadius:8,padding:'6px 11px',cursor:'pointer',fontSize:15,color:C.ink3}}>✕</button>
      </div>
      {cart.length===0
        ?<div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:12}}><span style={{fontSize:44}}>🛍️</span><p style={{fontWeight:600,fontSize:14,color:C.ink3,margin:0}}>Keranjang masih kosong</p></div>
        :<>
          <div style={{flex:1,overflowY:'auto',padding:'14px 22px',display:'flex',flexDirection:'column',gap:10}}>
            {cart.map((item:any,i:number)=>(
              <div key={i} style={{display:'flex',gap:12,background:C.cream,borderRadius:12,padding:12}}>
                <div style={{width:52,height:52,background:C.white,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,flexShrink:0}}>{item.emoji}</div>
                <div style={{flex:1}}><p style={{margin:'0 0 2px',fontSize:13,fontWeight:700,color:C.ink}}>{item.name}</p><p style={{margin:'0 0 3px',fontSize:11,color:C.ink4}}>{item.sport} · Size {item.size}</p><p style={{margin:0,fontSize:13,fontWeight:700,color:C.g700}}>{fmt(item.price)}</p></div>
                <button onClick={()=>onRemove(i)} style={{background:'none',border:'none',cursor:'pointer',color:C.ink4,fontSize:16,padding:'2px',alignSelf:'flex-start'}}>✕</button>
              </div>
            ))}
          </div>
          <div style={{padding:'14px 22px 26px',borderTop:`1px solid ${C.ink6}`}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}><span style={{fontSize:14,color:C.ink3}}>Subtotal</span><span style={{fontSize:16,fontWeight:800,color:C.ink}}>{fmt(total)}</span></div>
            <button onClick={onCheckout} style={{width:'100%',background:C.g800,color:'#fff',border:'none',borderRadius:11,padding:'13px',fontSize:14,fontWeight:700,cursor:'pointer'}}>Checkout →</button>
          </div>
        </>
      }
    </div>
  </div>
}

// ═══════════════════════════════════════════════════════════
// PAGE: LANDING
// ═══════════════════════════════════════════════════════════
function LandingPage({nav,addToCart,cartCount}:{nav:(p:string,d?:any)=>void,addToCart:(item:any)=>void,cartCount:number}) {
  const [scrolled,setScrolled]=useState(false)
  const [showCart,setShowCart]=useState(false)
  const [cart,setCart]=useState<any[]>([])
  const [toast,setToast]=useState<string|null>(null)
  useEffect(()=>{const fn=()=>setScrolled(window.scrollY>30);window.addEventListener('scroll',fn);return()=>window.removeEventListener('scroll',fn)},[])
  function handleAdd(p:any){const item={...p,qty:1,size:p.sizes[0]};setCart(c=>[...c,item]);addToCart(item);setToast(p.name)}
  const cats=[{icon:'🎾',label:'Tennis',count:48},{icon:'🏸',label:'Badminton',count:22},{icon:'🏓',label:'Padel',count:36},{icon:'🏋️',label:'Hyrox',count:29},{icon:'💪',label:'Gym',count:112},{icon:'🏃',label:'Running',count:94},{icon:'⛳',label:'Golf',count:41},{icon:'🧘',label:'Pilates',count:33},{icon:'🪷',label:'Yoga',count:57},{icon:'👟',label:'Footwear',count:18},{icon:'🎒',label:'Aksesoris',count:24}]
  return <div style={{background:C.cream,minHeight:'100vh'}}>
    {toast&&<Toast msg={toast} onDone={()=>setToast(null)}/>}
    {showCart&&<CartDrawer cart={cart} onClose={()=>setShowCart(false)} onRemove={i=>setCart(c=>c.filter((_,idx)=>idx!==i))} onCheckout={()=>{setShowCart(false);nav('checkout')}}/>}
    <StoreNavbar nav={nav} cartCount={cartCount} onCartClick={()=>setShowCart(true)} scrolled={scrolled}/>
    {/* HERO */}
    <section style={{paddingTop:56+28,minHeight:'85vh',display:'flex',alignItems:'center',background:C.cream,position:'relative',overflow:'hidden'}}>
      <div className="hero-bg" style={{position:'absolute',top:0,right:0,width:'44%',height:'100%',background:C.g800,clipPath:'polygon(12% 0, 100% 0, 100% 100%, 0 100%)'}}/>
      <div className="hero-grid" style={{maxWidth:1280,margin:'0 auto',padding:'48px 5vw',width:'100%',display:'grid',gridTemplateColumns:'1fr 1fr',gap:0,alignItems:'center',position:'relative',zIndex:1}}>
        <div style={{paddingRight:'8%'}}>
          <p style={{margin:'0 0 14px',fontSize:11,fontWeight:600,color:C.g500,letterSpacing:'0.18em',textTransform:'uppercase',display:'flex',alignItems:'center',gap:8}}><span style={{display:'inline-block',width:22,height:1.5,background:C.g500}}/>New Season 2025</p>
          <h1 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:'clamp(2rem,7vw,4rem)',fontWeight:400,lineHeight:1.08,margin:'0 0 18px',letterSpacing:'-0.02em',color:C.ink}}>Gear Built for<br/><em style={{color:C.g700,fontStyle:'italic'}}>Elite</em> Athletes</h1>
          <p style={{fontSize:14,color:C.ink3,lineHeight:1.8,margin:'0 0 28px',maxWidth:400}}>Premium sport wear untuk Tennis, Badminton, Padel, Hyrox, Running, Golf, dan lebih. Dirancang untuk performa, nyaman dipakai seharian.</p>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:36}}>
            <button onClick={()=>nav('catalog')} style={{background:C.g800,color:C.cream,border:'none',borderRadius:10,padding:'13px 26px',fontSize:14,fontWeight:600,cursor:'pointer'}}>Shop Collection</button>
          </div>
          <div className="stats-row" style={{display:'flex',gap:0,paddingTop:22,borderTop:`1px solid ${C.ink6}`}}>
            {[['15K+','Athletes'],['12','Sports'],['4.9 ★','Rating'],['2 Jam','Pengiriman']].map(([v,l],i)=>(
              <div key={l} style={{flex:1,paddingLeft:i>0?14:0,paddingRight:14,borderLeft:i>0?`1px solid ${C.ink6}`:'none'}}>
                <div style={{fontSize:'clamp(14px,4vw,19px)',fontWeight:700,color:C.g700}}>{v}</div>
                <div style={{fontSize:10,color:C.ink4,fontWeight:500,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-right" style={{display:'flex',alignItems:'center',justifyContent:'center',paddingLeft:'6%'}}>
          <div style={{width:'min(300px,60vw)',height:'min(340px,60vw)',background:'rgba(255,255,255,0.06)',borderRadius:24,border:'1px solid rgba(255,255,255,0.12)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:14,position:'relative'}}>
            <span style={{fontSize:'clamp(60px,12vw,90px)'}}>👟</span>
            <div style={{textAlign:'center'}}><p style={{margin:0,fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.5)',letterSpacing:'0.08em',textTransform:'uppercase'}}>Featured</p><p style={{margin:'4px 0 0',fontSize:15,fontWeight:700,color:'#fff'}}>Court Precision Polo</p><p style={{margin:'5px 0 0',fontSize:14,fontWeight:600,color:C.g300}}>{fmt(649000)}</p></div>
            <button onClick={()=>handleAdd(ALL_PRODUCTS[0])} style={{background:C.g400,color:'#fff',border:'none',borderRadius:9,padding:'8px 20px',fontSize:12,fontWeight:700,cursor:'pointer'}}>Add to Cart</button>
            <div style={{position:'absolute',top:14,right:-10,background:C.cream,borderRadius:10,padding:'6px 10px',boxShadow:'0 4px 16px rgba(0,0,0,0.12)'}}><div style={{fontSize:9,fontWeight:700,color:C.g700,letterSpacing:'0.06em',textTransform:'uppercase'}}>Best Seller</div><div style={{fontSize:10,color:C.ink3,marginTop:1}}>214 reviews</div></div>
          </div>
        </div>
      </div>
    </section>
    {/* CATEGORIES */}
    <section style={{padding:'68px 5vw',background:C.white}}>
      <div style={{maxWidth:1280,margin:'0 auto'}}>
        <div style={{marginBottom:36,display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:14}}>
          <div><p style={{margin:'0 0 6px',fontSize:11,fontWeight:600,color:C.g500,letterSpacing:'0.14em',textTransform:'uppercase'}}>Browse by Sport</p><h2 style={{margin:0,fontFamily:"'DM Serif Display',Georgia,serif",fontSize:'clamp(1.5rem,3vw,2.2rem)',fontWeight:400,color:C.ink}}>Your Sport, Your Gear.</h2></div>
          <button onClick={()=>nav('catalog')} style={{fontSize:13,fontWeight:600,color:C.g600,background:'none',border:'none',cursor:'pointer'}}>All Categories →</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))',gap:10}}>
          {cats.map(cat=>(
            <button key={cat.label} onClick={()=>nav('catalog')} style={{background:C.cream,border:`1px solid ${C.ink6}`,borderRadius:12,padding:'14px 8px 12px',cursor:'pointer',textAlign:'center',transition:'all 0.2s'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.g400;(e.currentTarget as HTMLElement).style.background=C.g50}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.ink6;(e.currentTarget as HTMLElement).style.background=C.cream}}>
              <div style={{fontSize:24,marginBottom:5}}>{cat.icon}</div>
              <div style={{fontSize:11,fontWeight:600,color:C.ink2}}>{cat.label}</div>
              <div style={{fontSize:9,color:C.ink4,marginTop:1}}>{cat.count} items</div>
            </button>
          ))}
        </div>
      </div>
    </section>
    {/* FEATURED PRODUCTS */}
    <section style={{padding:'68px 5vw',background:C.cream}}>
      <div style={{maxWidth:1280,margin:'0 auto'}}>
        <div style={{marginBottom:32,display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:14}}>
          <div><p style={{margin:'0 0 5px',fontSize:11,fontWeight:600,color:C.g500,letterSpacing:'0.14em',textTransform:'uppercase'}}>Best Sellers</p><h2 style={{margin:0,fontFamily:"'DM Serif Display',Georgia,serif",fontSize:'clamp(1.5rem,3vw,2.2rem)',fontWeight:400,color:C.ink}}>Top Picks This Week</h2></div>
          <button onClick={()=>nav('catalog')} style={{fontSize:13,fontWeight:600,color:C.g600,background:'none',border:'none',cursor:'pointer'}}>View All →</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:14}}>
          {ALL_PRODUCTS.slice(0,4).map(p=><MiniCard key={p.id} p={p} onView={()=>nav('detail',p)} onAdd={()=>handleAdd(p)}/>)}
        </div>
      </div>
    </section>
    {/* BRAND STRIP */}
    <section style={{background:C.g800,padding:'26px 5vw'}}>
      <div style={{maxWidth:1280,margin:'0 auto',display:'flex',justifyContent:'space-around',flexWrap:'wrap',gap:18}}>
        {[['⚡','Performance Tech','Advanced fabrics'],['🌿','Sustainably Made','Eco-conscious'],['📦','Fast Delivery','2-hour same-day'],['↩️','30-Day Returns','No questions']].map(([ic,t,s])=>(
          <div key={t} style={{display:'flex',alignItems:'center',gap:12}}><span style={{fontSize:20}}>{ic}</span><div><div style={{fontSize:13,fontWeight:700,color:C.g100}}>{t}</div><div style={{fontSize:11,color:C.g300}}>{s}</div></div></div>
        ))}
      </div>
    </section>
    {/* TESTIMONIALS */}
    <section style={{padding:'68px 5vw',background:C.white}}>
      <div style={{maxWidth:1280,margin:'0 auto'}}>
        <div style={{textAlign:'center',marginBottom:44}}><p style={{margin:'0 0 7px',fontSize:11,fontWeight:600,color:C.g500,letterSpacing:'0.14em',textTransform:'uppercase'}}>Athlete Reviews</p><h2 style={{margin:0,fontFamily:"'DM Serif Display',Georgia,serif",fontSize:'clamp(1.5rem,3vw,2.2rem)',fontWeight:400,color:C.ink}}>Worn & Trusted by Athletes</h2></div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))',gap:18}}>
          {[{name:'Rina S.',sport:'Tennis',text:'Kualitas polo-nya luar biasa. Tetap segar bahkan di set terakhir.',avatar:'RS'},{name:'Bagas W.',sport:'Hyrox',text:'Paling nyaman buat WOD. Gerakan bebas total, tidak pernah gerah.',avatar:'BW'},{name:'Citra A.',sport:'Yoga',text:'Bahan leggings-nya terasa premium di kulit. Worth every penny.',avatar:'CA'}].map(t=>(
            <div key={t.name} style={{background:C.cream,border:`1px solid ${C.ink6}`,borderRadius:16,padding:'24px'}}>
              <div style={{display:'flex',gap:3,marginBottom:12}}>{[1,2,3,4,5].map(i=><svg key={i} width="12" height="12" viewBox="0 0 12 12"><polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9.2,11 6,9.2 2.8,11 3.5,7.5 1,5 4.5,4.5" fill={C.gold2}/></svg>)}</div>
              <p style={{margin:'0 0 18px',fontSize:14,color:C.ink2,lineHeight:1.75,fontStyle:'italic'}}>"{t.text}"</p>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:34,height:34,borderRadius:'50%',background:C.g100,border:`1px solid ${C.g200}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:C.g700}}>{t.avatar}</div>
                <div><div style={{fontSize:13,fontWeight:700,color:C.ink}}>{t.name}</div><div style={{fontSize:11,color:C.g500,fontWeight:500}}>{t.sport} Athlete</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    {/* FOOTER */}
    <footer style={{background:C.g900,borderTop:'1px solid rgba(255,255,255,0.06)',padding:'26px 5vw',textAlign:'center'}}>
      <p style={{margin:0,fontSize:12,color:C.g600}}>© 2025 The Elite Athletes. Made with 💚 in Indonesia.</p>
    </footer>
  </div>
}

// ═══════════════════════════════════════════════════════════
// PAGE: CATALOG
// ═══════════════════════════════════════════════════════════
function CatalogPage({nav,addToCart,cartCount}:{nav:(p:string,d?:any)=>void,addToCart:(item:any)=>void,cartCount:number}) {
  const [sports,setSports]=useState<string[]>([])
  const [genders,setGenders]=useState<string[]>([])
  const [priceR,setPriceR]=useState<string[]>([])
  const [inStock,setInStock]=useState(false)
  const [sortBy,setSortBy]=useState('newest')
  const [view,setView]=useState('grid')
  const [toast,setToast]=useState<string|null>(null)
  const PRICE_RANGES=[{label:'< Rp 400K',min:0,max:400000},{label:'Rp 400K–600K',min:400000,max:600000},{label:'Rp 600K–800K',min:600000,max:800000},{label:'> Rp 800K',min:800000,max:Infinity}]
  const tog=(arr:string[],set:(a:string[])=>void,v:string)=>set(arr.includes(v)?arr.filter(x=>x!==v):[...arr,v])
  const filtered=useMemo(()=>{
    let p=[...ALL_PRODUCTS]
    if(sports.length) p=p.filter(x=>sports.includes(x.sport)||(x.sports&&x.sports.some((s:string)=>sports.includes(s))))
    if(genders.length) p=p.filter(x=>genders.includes(x.gender))
    if(priceR.length) p=p.filter(x=>priceR.some(r=>{const rng=PRICE_RANGES.find(pr=>pr.label===r);return rng&&x.price>=rng.min&&x.price<rng.max}))
    if(inStock) p=p.filter(x=>totStock(x)>0)
    if(sortBy==='price_asc') p.sort((a,b)=>a.price-b.price)
    else if(sortBy==='price_desc') p.sort((a,b)=>b.price-a.price)
    else if(sortBy==='rating') p.sort((a,b)=>b.rating-a.rating)
    else if(sortBy==='bestseller') p.sort((a,b)=>b.reviews-a.reviews)
    return p
  },[sports,genders,priceR,inStock,sortBy])
  const activeCount=sports.length+genders.length+priceR.length+(inStock?1:0)
  const clearAll=()=>{setSports([]);setGenders([]);setPriceR([]);setInStock(false)}
  const Chk=({label,checked,onChange}:{label:string,checked:boolean,onChange:()=>void})=>(
    <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',marginBottom:9}}>
      <div onClick={onChange} style={{width:16,height:16,borderRadius:4,flexShrink:0,border:`1.5px solid ${checked?C.g600:C.ink5}`,background:checked?C.g700:'transparent',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 0.15s'}}>
        {checked&&<svg width="9" height="9" viewBox="0 0 10 10" fill="none"><polyline points="2,5 4.2,7.5 8,3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <span style={{fontSize:13,color:C.ink2,fontWeight:500}}>{label}</span>
    </label>
  )
  const Sec=({title,children}:{title:string,children:React.ReactNode})=>{
    const [open,setOpen]=useState(true)
    return <div style={{borderBottom:`1px solid ${C.ink6}`,paddingBottom:14,marginBottom:14}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:'100%',background:'none',border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0 0 10px'}}>
        <span style={{fontSize:11,fontWeight:700,color:C.ink2,letterSpacing:'0.08em',textTransform:'uppercase'}}>{title}</span>
        <span style={{color:C.ink4,fontSize:12}}>{open?'▲':'▼'}</span>
      </button>
      {open&&children}
    </div>
  }
  const [showFilters,setShowFilters]=useState(false)

  return <div style={{background:C.cream,minHeight:'100vh'}}>
    {toast&&<Toast msg={toast} onDone={()=>setToast(null)}/>}
    <StoreNavbar nav={nav} cartCount={cartCount} onCartClick={()=>nav('checkout')} scrolled={true}/>

    {/* FILTER TOOLBAR */}
    <div style={{background:C.white,borderBottom:`1px solid ${C.ink6}`,marginTop:56+28,position:'sticky',top:56+28,zIndex:100}}>
      <div style={{maxWidth:1280,margin:'0 auto',padding:'12px 4vw'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <h1 style={{margin:0,fontFamily:"'DM Serif Display',Georgia,serif",fontSize:'clamp(1.1rem,4vw,1.6rem)',fontWeight:400,color:C.ink,flexShrink:0}}>Katalog</h1>
          <span style={{fontSize:11,color:C.ink4,flexShrink:0}}>({filtered.length})</span>
          <div style={{flex:1}}/>
          {/* SORT */}
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{padding:'7px 10px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:12,fontFamily:'inherit',outline:'none',background:C.white,cursor:'pointer',color:C.ink,maxWidth:120}}>
            <option value='newest'>Terbaru</option>
            <option value='bestseller'>Best Seller</option>
            <option value='price_asc'>Harga ↑</option>
            <option value='price_desc'>Harga ↓</option>
            <option value='rating'>Rating</option>
          </select>
          {/* FILTER DROPDOWN */}
          <div style={{position:'relative'}}>
            <button onClick={()=>setShowFilters(v=>!v)} style={{padding:'7px 12px',border:`1px solid ${activeCount>0?C.g600:C.ink5}`,borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',background:activeCount>0?C.g50:C.white,color:activeCount>0?C.g700:C.ink2,display:'flex',alignItems:'center',gap:5}}>
              <svg width='13' height='13' viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5'><line x1='2' y1='4' x2='14' y2='4'/><line x1='4' y1='8' x2='12' y2='8'/><line x1='6' y1='12' x2='10' y2='12'/></svg>
              Filter{activeCount>0?` (${activeCount})`:''}
            </button>
            {showFilters&&<div style={{position:'absolute',top:'calc(100% + 8px)',right:0,width:280,background:C.white,border:`1px solid ${C.ink5}`,borderRadius:12,padding:'16px',zIndex:200,boxShadow:'0 8px 32px rgba(0,0,0,0.12)',animation:'slideDown 0.15s ease'}}>
              <div style={{marginBottom:14}}>
                <p style={{margin:'0 0 8px',fontSize:10,fontWeight:700,color:C.ink4,letterSpacing:'0.08em',textTransform:'uppercase'}}>Sport</p>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {SPORTS_LIST.map(s=>(<button key={s} onClick={()=>tog(sports,setSports,s)} style={{padding:'5px 11px',borderRadius:6,fontSize:11,fontWeight:sports.includes(s)?700:400,cursor:'pointer',background:sports.includes(s)?C.g800:C.cream,color:sports.includes(s)?'#fff':C.ink2,border:`1px solid ${sports.includes(s)?C.g800:C.ink5}`,transition:'all 0.12s'}}>{s}</button>))}
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <p style={{margin:'0 0 8px',fontSize:10,fontWeight:700,color:C.ink4,letterSpacing:'0.08em',textTransform:'uppercase'}}>Gender</p>
                <div style={{display:'flex',gap:6}}>
                  {['Men','Women','Unisex'].map(g=>(<button key={g} onClick={()=>tog(genders,setGenders,g)} style={{flex:1,padding:'7px',borderRadius:6,fontSize:11,fontWeight:genders.includes(g)?700:400,cursor:'pointer',background:genders.includes(g)?C.ink:C.cream,color:genders.includes(g)?'#fff':C.ink2,border:`1px solid ${genders.includes(g)?C.ink:C.ink5}`,transition:'all 0.12s'}}>{g}</button>))}
                </div>
              </div>
              <div style={{marginBottom:14}}>
                <p style={{margin:'0 0 8px',fontSize:10,fontWeight:700,color:C.ink4,letterSpacing:'0.08em',textTransform:'uppercase'}}>Harga</p>
                <select value={priceR[0]||''} onChange={e=>{if(e.target.value)setPriceR([e.target.value]);else setPriceR([])}} style={{width:'100%',padding:'8px 10px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:12,fontFamily:'inherit',outline:'none',background:C.white,cursor:'pointer',color:C.ink}}>
                  <option value=''>Semua Harga</option>
                  {PRICE_RANGES.map(r=><option key={r.label} value={r.label}>{r.label}</option>)}
                </select>
              </div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <label style={{display:'flex',alignItems:'center',gap:7,cursor:'pointer',fontSize:12,color:C.ink2}}>
                  <div onClick={()=>setInStock(v=>!v)} style={{width:34,height:18,borderRadius:9,background:inStock?C.g600:C.ink5,position:'relative',transition:'background 0.2s',cursor:'pointer',flexShrink:0}}>
                    <div style={{position:'absolute',top:2,left:inStock?16:2,width:14,height:14,borderRadius:'50%',background:'#fff',transition:'left 0.2s'}}/>
                  </div>
                  Stok tersedia saja
                </label>
                {activeCount>0&&<button onClick={()=>{clearAll();setShowFilters(false)}} style={{background:'none',border:'none',cursor:'pointer',fontSize:11,color:C.red,fontWeight:600}}>Reset semua</button>}
              </div>
              <button onClick={()=>setShowFilters(false)} style={{width:'100%',marginTop:14,padding:'10px',background:C.g800,color:'#fff',border:'none',borderRadius:9,fontSize:13,fontWeight:700,cursor:'pointer'}}>Lihat {filtered.length} Produk</button>
            </div>}
          </div>
        </div>
      </div>
    </div>
    {/* Click outside to close filter */}
    {showFilters&&<div style={{position:'fixed',inset:0,zIndex:150}} onClick={()=>setShowFilters(false)}/>}

    {/* PRODUCTS GRID — 2 kolom di mobile */}
    <div style={{maxWidth:1280,margin:'0 auto',padding:'14px 3vw 60px'}}>
      {filtered.length===0
        ?<div style={{textAlign:'center',padding:'52px 0',color:C.ink4}}><div style={{fontSize:36,marginBottom:10}}>🔍</div><p style={{fontSize:14,fontWeight:600,color:C.ink2,margin:'0 0 14px'}}>Tidak ada produk</p><button onClick={clearAll} style={{background:C.g800,color:'#fff',border:'none',borderRadius:9,padding:'10px 22px',fontSize:13,fontWeight:600,cursor:'pointer'}}>Reset Filter</button></div>
        :<div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'10px'}}>
          {filtered.map(p=><MiniCard key={p.id} p={p} onView={()=>nav('detail',p)} onAdd={()=>{addToCart({...p,qty:1,size:p.sizes[0]});setToast(p.name)}}/>)}
        </div>
      }
    </div>
  </div>
}

// ═══════════════════════════════════════════════════════════
// PAGE: PRODUCT DETAIL
// ═══════════════════════════════════════════════════════════
function DetailPage({product:p,nav,addToCart,cartCount}:{product:any,nav:(pg:string,d?:any)=>void,addToCart:(item:any)=>void,cartCount:number}) {
  const [selSize,setSelSize]=useState<string|null>(null)
  const [showSizeGuide,setShowSizeGuide]=useState(false)
  const [activeImg,setActiveImg]=useState<string|null>(null)
  const [selColor,setSelColor]=useState(p.colors[0])
  const [qty,setQty]=useState(1)
  const [tab,setTab]=useState('description')
  const [added,setAdded]=useState(false)
  const [toast,setToast]=useState<string|null>(null)
  const disc=p.original?Math.round((1-p.price/p.original)*100):null
  const related=ALL_PRODUCTS.filter((x:any)=>x.sport===p.sport&&x.id!==p.id).slice(0,4)
  const SWATCH:Record<string,string>={Forest:'#2D5134',White:'#F8F8F6',Navy:'#1B2A4A',Black:'#1C1C1A',Charcoal:'#3A3A3A',Olive:'#5A6045',Sage:'#7A9E7E',Blush:'#E8B4B8',Khaki:'#C3B89A',Cream:'#FAF8F4',Sand:'#D4C4A0'}
  function handleAdd(){if(!selSize){alert('Pilih ukuran terlebih dahulu.');return}addToCart({...p,qty,size:selSize,color:selColor});setAdded(true);setToast(p.name);setTimeout(()=>setAdded(false),2000)}
  return <div style={{background:C.cream,minHeight:'100vh'}}>
    {toast&&<Toast msg={toast} onDone={()=>setToast(null)}/>}
    {showSizeGuide&&(
      <div style={{position:'fixed',inset:0,zIndex:900,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}} onClick={()=>setShowSizeGuide(false)}>
        <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:16,width:'min(560px,95vw)',maxHeight:'85vh',overflowY:'auto',padding:'24px 28px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
            <h3 style={{margin:0,fontSize:17,fontWeight:700,color:C.ink}}>Size Guide</h3>
            <button onClick={()=>setShowSizeGuide(false)} style={{background:'none',border:'none',cursor:'pointer',fontSize:18,color:C.ink3}}>✕</button>
          </div>
          <div style={{marginBottom:20}}>
            <p style={{margin:'0 0 12px',fontSize:13,fontWeight:700,color:C.ink2}}>👕 Pakaian (Tops & Bottoms)</p>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
              <thead><tr style={{background:C.g800}}>{['Size','Lingkar Dada','Lingkar Pinggang','Panjang','Tinggi Badan'].map(h=><th key={h} style={{padding:'8px 10px',textAlign:'left',color:C.g100,fontWeight:600,whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
              <tbody>
                {[['XS','80–84 cm','64–68 cm','65 cm','155–160 cm'],['S','84–88 cm','68–72 cm','67 cm','160–165 cm'],['M','88–92 cm','72–76 cm','69 cm','165–170 cm'],['L','92–96 cm','76–80 cm','71 cm','170–175 cm'],['XL','96–102 cm','80–86 cm','73 cm','175–180 cm'],['XXL','102–108 cm','86–92 cm','75 cm','180–185 cm'],['XXXL','108–116 cm','92–100 cm','77 cm','185+ cm']].map((r,i)=>(
                  <tr key={r[0]} style={{background:i%2===0?C.white:C.cream,borderBottom:`1px solid ${C.ink6}`}}>
                    {r.map((v,j)=><td key={j} style={{padding:'8px 10px',fontWeight:j===0?700:400,color:j===0?C.g700:C.ink2}}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{marginBottom:20}}>
            <p style={{margin:'0 0 12px',fontSize:13,fontWeight:700,color:C.ink2}}>👟 Sepatu (EU Size)</p>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
              <thead><tr style={{background:C.g800}}>{['EU','US Men','US Women','UK','Panjang Kaki'].map(h=><th key={h} style={{padding:'8px 10px',textAlign:'left',color:C.g100,fontWeight:600}}>{h}</th>)}</tr></thead>
              <tbody>
                {[['36','4','5.5','3','22.5 cm'],['37','4.5','6','3.5','23 cm'],['38','5.5','7','4.5','24 cm'],['39','6','7.5','5','24.5 cm'],['40','7','8.5','6','25 cm'],['41','7.5','9','6.5','25.5 cm'],['42','8.5','10','7.5','26.5 cm'],['43','9','10.5','8','27 cm'],['44','10','11.5','9','28 cm'],['45','10.5','12','9.5','28.5 cm']].map((r,i)=>(
                  <tr key={r[0]} style={{background:i%2===0?C.white:C.cream,borderBottom:`1px solid ${C.ink6}`}}>
                    {r.map((v,j)=><td key={j} style={{padding:'8px 10px',fontWeight:j===0?700:400,color:j===0?C.g700:C.ink2}}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{background:C.g50,border:`1px solid ${C.g100}`,borderRadius:9,padding:'11px 14px'}}>
            <p style={{margin:0,fontSize:12,color:C.g700,lineHeight:1.7}}>💡 <strong>Tips:</strong> Kalau ukuranmu di antara dua size, pilih yang lebih besar. Untuk olahraga, ukuran yang sedikit longgar memberikan kenyamanan gerak lebih baik.</p>
          </div>
        </div>
      </div>
    )}
    <StoreNavbar nav={nav} cartCount={cartCount} onCartClick={()=>nav('checkout')} scrolled={true}/>
    <div style={{background:C.white,borderBottom:`1px solid ${C.ink6}`,padding:'11px 5vw',marginTop:56+28}}>
      <div style={{maxWidth:1280,margin:'0 auto',display:'flex',alignItems:'center',gap:6,fontSize:12}}>
        {[{label:'Home',fn:()=>nav('home')},{label:'Collection',fn:()=>nav('catalog')},{label:p.sport,fn:()=>nav('catalog')},{label:p.name,fn:null}].map((b,i)=>(
          <span key={i} style={{display:'flex',alignItems:'center',gap:5}}>{i>0&&<span style={{color:C.ink5}}>›</span>}{b.fn?<button onClick={b.fn} style={{background:'none',border:'none',padding:0,cursor:'pointer',color:C.g600,fontWeight:500}}>{b.label}</button>:<span style={{color:C.ink3,fontWeight:500}}>{b.label}</span>}</span>
        ))}
      </div>
    </div>
    <div style={{maxWidth:1280,margin:'0 auto',padding:'20px 5vw 48px'}}>
      <div className="detail-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'start',marginBottom:52}}>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div style={{background:C.white,borderRadius:20,border:`1px solid ${C.ink6}`,aspectRatio:'1/1',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',bottom:0,right:0,width:'55%',height:'55%',background:C.g50,borderRadius:'50% 0 20px 0'}}/>
            <span style={{fontSize:120,position:'relative',zIndex:1}}>{p.emoji}</span>
            <div style={{position:'absolute',top:16,left:16}}><PBadge label={p.badge}/></div>
            {disc&&<span style={{position:'absolute',top:16,right:16,background:'#FEF2F2',color:'#C0392B',fontSize:10,fontWeight:800,padding:'4px 10px',borderRadius:4,border:'1px solid #FCA5A5'}}>−{disc}% OFF</span>}
          </div>
          <div style={{display:'flex',gap:10}}>{[p.emoji,'📦','🏷️'].map((e,i)=><div key={i} style={{flex:1,aspectRatio:'1/1',background:i===0?C.white:C.cream2,borderRadius:10,border:`1.5px solid ${i===0?C.g400:C.ink6}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:24}}>{e}</div>)}</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{display:'flex',gap:8,alignItems:'center'}}><span style={{fontSize:11,fontWeight:700,color:C.g500,letterSpacing:'0.12em',textTransform:'uppercase'}}>{p.sport}</span><span style={{color:C.ink5}}>·</span><span style={{fontSize:11,color:C.ink4,fontWeight:500,textTransform:'uppercase',letterSpacing:'0.06em'}}>{p.gender}</span></div>
          <h1 style={{margin:0,fontFamily:"'DM Serif Display',Georgia,serif",fontSize:'clamp(1.5rem,3.5vw,2.2rem)',fontWeight:400,color:C.ink,lineHeight:1.15,letterSpacing:'-0.02em'}}>{p.name}</h1>
          <div style={{display:'flex',alignItems:'center',gap:10}}><Stars r={p.rating} size={14}/><span style={{fontSize:13,color:C.ink3}}>{p.reviews} reviews</span></div>
          <div style={{display:'flex',alignItems:'baseline',gap:10,padding:'14px 0',borderTop:`1px solid ${C.ink6}`,borderBottom:`1px solid ${C.ink6}`}}>
            <span style={{fontSize:28,fontWeight:800,color:C.ink,letterSpacing:'-0.03em'}}>{fmt(p.price)}</span>
            {p.original&&<><span style={{fontSize:15,color:C.ink4,textDecoration:'line-through'}}>{fmt(p.original)}</span><span style={{fontSize:12,fontWeight:700,color:'#C0392B',background:'#FEF2F2',padding:'3px 8px',borderRadius:5}}>Hemat {fmt(p.original-p.price)}</span></>}
          </div>
          <div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:9}}><span style={{fontSize:11,fontWeight:700,color:C.ink2,letterSpacing:'0.06em',textTransform:'uppercase'}}>Warna</span><span style={{fontSize:11,color:C.g600,fontWeight:600}}>{selColor}</span></div>
            <div style={{display:'flex',gap:7}}>{p.colors.map((c:string)=><button key={c} onClick={()=>setSelColor(c)} title={c} style={{width:28,height:28,borderRadius:'50%',background:SWATCH[c]||C.ink5,cursor:'pointer',border:`2.5px solid ${selColor===c?C.g600:'transparent'}`,outline:selColor===c?`2px solid ${C.g300}`:'none',outlineOffset:2,transition:'all 0.15s',boxShadow:'0 1px 4px rgba(0,0,0,0.12)'}}/>)}</div>
          </div>
          <div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:9}}><span style={{fontSize:11,fontWeight:700,color:C.ink2,letterSpacing:'0.06em',textTransform:'uppercase'}}>Ukuran</span><button onClick={()=>setShowSizeGuide(true)} style={{background:'none',border:'none',cursor:'pointer',fontSize:11,color:C.g600,fontWeight:600,padding:0}}>Size Guide →</button></div>
            <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>{p.sizes.map((s:string)=><button key={s} onClick={()=>setSelSize(s)} style={{minWidth:44,padding:'8px 12px',borderRadius:9,background:selSize===s?C.g800:C.white,color:selSize===s?'#fff':C.ink2,border:`1.5px solid ${selSize===s?C.g800:C.ink5}`,fontSize:12,fontWeight:600,cursor:'pointer',transition:'all 0.15s'}}>{s}</button>)}</div>
            {!selSize&&<p style={{margin:'6px 0 0',fontSize:11,color:'#C0392B',fontWeight:500}}>Pilih ukuran untuk melanjutkan</p>}
          </div>
          <div style={{display:'flex',gap:10}}>
            <div style={{display:'flex',alignItems:'center',border:`1px solid ${C.ink5}`,borderRadius:10,overflow:'hidden',background:C.white}}>
              <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{width:38,height:46,background:'none',border:'none',cursor:'pointer',fontSize:18,color:C.ink2}}>−</button>
              <span style={{width:32,textAlign:'center',fontSize:14,fontWeight:700,color:C.ink}}>{qty}</span>
              <button onClick={()=>setQty(q=>q+1)} style={{width:38,height:46,background:'none',border:'none',cursor:'pointer',fontSize:18,color:C.ink2}}>+</button>
            </div>
            <button onClick={handleAdd} style={{flex:1,padding:'0 18px',height:46,background:added?C.g600:C.g800,color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:700,cursor:'pointer',transition:'background 0.2s'}}>{added?'✓ Added!':'Add to Cart'}</button>
            <button style={{width:46,height:46,background:C.white,border:`1px solid ${C.ink5}`,borderRadius:10,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke={C.ink3} strokeWidth="1.5" strokeLinecap="round"><path d="M9 15.5S2 11 2 6a4 4 0 017-2.6A4 4 0 0116 6c0 5-7 9.5-7 9.5z"/></svg></button>
          </div>
          <div style={{display:'flex',gap:12,padding:'12px 0',borderTop:`1px solid ${C.ink6}`,flexWrap:'wrap'}}>
            {[['📦','Free Shipping','Di atas Rp 500K'],['↩️','30-Day Returns','Tanpa pertanyaan'],['✓','100% Asli','Garansi produk']].map(([ic,t,s])=>(
              <div key={t} style={{display:'flex',alignItems:'center',gap:7,flex:1,minWidth:90}}><span style={{fontSize:14}}>{ic}</span><div><div style={{fontSize:11,fontWeight:700,color:C.ink2}}>{t}</div><div style={{fontSize:10,color:C.ink4}}>{s}</div></div></div>
            ))}
          </div>
        </div>
      </div>
      <div style={{marginBottom:36}}>
        <div style={{display:'flex',borderBottom:`2px solid ${C.ink6}`,gap:0,marginBottom:24}}>
          {[['description','Deskripsi'],['features','Fitur'],['reviews',`Reviews (${p.reviews})`]].map(([v,l])=>(
            <button key={v} onClick={()=>setTab(v)} style={{background:'none',border:'none',cursor:'pointer',padding:'10px 20px',fontSize:13,fontWeight:tab===v?700:500,color:tab===v?C.g700:C.ink3,borderBottom:`2px solid ${tab===v?C.g600:'transparent'}`,marginBottom:-2,transition:'all 0.15s'}}>{l}</button>
          ))}
        </div>
        {tab==='description'&&<p style={{fontSize:14,color:C.ink2,lineHeight:1.85,maxWidth:620,margin:0}}>{p.desc} Crafted with our latest performance fabric technology, this piece delivers the perfect balance of athletic function and refined style.</p>}
        {tab==='features'&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))',gap:10}}>{[...p.tags,'Quick-Dry Fabric','Flatlock Seams','Machine Washable'].map((f:string)=>(
          <div key={f} style={{display:'flex',alignItems:'center',gap:10,background:C.white,border:`1px solid ${C.ink6}`,borderRadius:10,padding:'11px 13px'}}>
            <div style={{width:24,height:24,borderRadius:'50%',background:C.g50,border:`1px solid ${C.g100}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><svg width="11" height="11" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke={C.g600} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
            <span style={{fontSize:13,fontWeight:500,color:C.ink2}}>{f}</span>
          </div>
        ))}</div>}
        {tab==='reviews'&&<div style={{display:'flex',gap:28,flexWrap:'wrap'}}>
          <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:14,padding:'22px 26px',textAlign:'center',minWidth:160}}>
            <div style={{fontSize:44,fontWeight:800,color:C.ink,letterSpacing:'-0.04em'}}>{p.rating}</div>
            <Stars r={p.rating} size={14}/>
            <div style={{fontSize:12,color:C.ink4,marginTop:7}}>{p.reviews} reviews</div>
          </div>
          <div style={{flex:1,display:'flex',flexDirection:'column',gap:12,minWidth:260}}>
            {[{name:'Sarah K.',date:'2 minggu lalu',text:'Perfect fit and incredibly comfortable!',rating:5},{name:'Michael T.',date:'1 bulan lalu',text:'Great quality. Fast shipping too.',rating:4}].map((r,i)=>(
              <div key={i} style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:12,padding:'16px 18px'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,flexWrap:'wrap',gap:7}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:30,height:30,borderRadius:'50%',background:C.g100,border:`1px solid ${C.g200}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:C.g700}}>{r.name.split(' ').map(w=>w[0]).join('')}</div><div><div style={{fontSize:12,fontWeight:700,color:C.ink}}>{r.name}</div><div style={{fontSize:10,color:C.ink4}}>{r.date}</div></div></div>
                  <Stars r={r.rating} size={11}/>
                </div>
                <p style={{margin:0,fontSize:13,color:C.ink2,lineHeight:1.65,fontStyle:'italic'}}>"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>}
      </div>
      {related.length>0&&<div>
        <h2 style={{margin:'0 0 20px',fontFamily:"'DM Serif Display',Georgia,serif",fontSize:'clamp(1.3rem,2.5vw,1.7rem)',fontWeight:400,color:C.ink}}>You Might Also Like</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:16}}>{related.map((r:any)=><MiniCard key={r.id} p={r} onView={()=>nav('detail',r)} onAdd={()=>{addToCart({...r,qty:1,size:r.sizes[0]});setToast(r.name)}}/>)}</div>
      </div>}
    </div>
    <footer style={{background:C.g900,borderTop:'1px solid rgba(255,255,255,0.06)',padding:'22px 5vw',textAlign:'center'}}><p style={{margin:0,fontSize:12,color:C.g600}}>© 2025 The Elite Athletes.</p></footer>
  </div>
}

// ═══════════════════════════════════════════════════════════
// PAGE: CHECKOUT
// ═══════════════════════════════════════════════════════════
function Field({label,id,required,error,...props}:any){
  return(
    <div style={{display:'flex',flexDirection:'column',gap:4}}>
      <label style={{fontSize:12,fontWeight:600,color:error?C.red:C.ink3,letterSpacing:'0.04em'}}>{label}{required&&<span style={{color:C.red}}> *</span>}</label>
      <input id={id} {...props} style={{padding:'10px 13px',border:`1px solid ${error?C.red:C.ink5}`,borderRadius:9,fontSize:13,fontFamily:'inherit',outline:'none',background:C.white,color:C.ink}}/>
      {error&&<span style={{fontSize:11,color:C.red}}>{error}</span>}
    </div>
  )
}

function CheckoutPage({nav,cart:initCart,addToCart}:{nav:(p:string,d?:any)=>void,cart:any[],addToCart:(item:any)=>void}) {
  const [step,setStep]=useState(0)
  const [cart,setCart]=useState(initCart.length>0?initCart:[{cartId:'c1',id:'TEA-001',name:'Court Precision Polo',sport:'Tennis',emoji:'🎾',price:649000,size:'M',color:'Forest',qty:1},{cartId:'c2',id:'TEA-007',name:'Pace Setter Shorts',sport:'Running',emoji:'🏃',price:429000,size:'L',color:'Black',qty:1}])
  const [shippingData,setShippingData]=useState<any>({})
  const [paymentMethod,setPaymentMethod]=useState('')
  const [coupon,setCoupon]=useState('')
  const [couponInput,setCouponInput]=useState('')
  const [couponErr,setCouponErr]=useState('')
  const [placing,setPlacing]=useState(false)
  const [confirmedOrder,setConfirmedOrder]=useState<any>(null)
  const subtotal=cart.reduce((s:number,i:any)=>s+i.price*(i.qty||1),0)
  const shippingCost=SHIPPING_OPTIONS.find(o=>o.id===shippingData.shipping)?.price||0
  const discount=coupon==='ELITE20'?Math.round(subtotal*0.2):coupon==='MEMBER10'?Math.round(subtotal*0.1):0
  const total=subtotal+shippingCost-discount
  function applyCoupon(){const c=couponInput.trim().toUpperCase();if(['ELITE20','MEMBER10'].includes(c)){setCoupon(c);setCouponErr('')}else setCouponErr('Kode tidak valid')}
  async function placeOrder(){
    setPlacing(true)
    try {
      const res=await fetch('/api/orders',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          customer:{name:shippingData.firstName+' '+shippingData.lastName,email:shippingData.email,phone:shippingData.phone,address:shippingData.address,city:shippingData.city,province:shippingData.province},
          items:cart.map((i:any)=>({id:i.id,sku:i.sku,name:i.name,size:i.size,qty:i.qty||1,price:i.price})),
          shipping:{courier:shippingData.shipping},
          promo_code:coupon||null,
          subtotal,discount,shipping_cost:shippingCost,total,
        }),
      })
      const data=await res.json()
      if(!res.ok) throw new Error(data.error||'Gagal membuat order')
      const snap=(window as any).snap
      if(snap&&data.snap_token){
        snap.pay(data.snap_token,{
          onSuccess:(result:any)=>{
            setConfirmedOrder({id:data.order_id,date:new Date().toISOString(),email:shippingData.email,customerName:shippingData.firstName+' '+shippingData.lastName,address:shippingData.address+', '+shippingData.city,payment:result.payment_type||paymentMethod,items:cart,total,status:'processing'})
            setPlacing(false);setStep(4)
          },
          onPending:()=>{
            setConfirmedOrder({id:data.order_id,date:new Date().toISOString(),email:shippingData.email,customerName:shippingData.firstName+' '+shippingData.lastName,address:shippingData.address+', '+shippingData.city,payment:paymentMethod,items:cart,total,status:'pending'})
            setPlacing(false);setStep(4)
          },
          onError:(err:any)=>{alert('Pembayaran gagal: '+(err.message||'Coba lagi'));setPlacing(false)},
          onClose:()=>{setPlacing(false)},
        })
      } else {
        setConfirmedOrder({id:data.order_id,date:new Date().toISOString(),email:shippingData.email,customerName:shippingData.firstName+' '+shippingData.lastName,address:shippingData.address+', '+shippingData.city,payment:paymentMethod,items:cart,total,status:'pending'})
        setPlacing(false);setStep(4)
      }
    } catch(err:any){
      alert('Error: '+err.message)
      setPlacing(false)
    }
  }

  const Summary=()=>(
    <aside className="checkout-summary" style={{width:300,flexShrink:0}}>
      <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:14,overflow:'hidden',position:'sticky',top:80}}>
        <div style={{padding:'13px 18px',borderBottom:`1px solid ${C.ink6}`,background:C.g800}}><h3 style={{margin:0,fontSize:13,fontWeight:700,color:C.g100}}>Order Summary</h3></div>
        <div style={{padding:'12px 18px',borderBottom:`1px solid ${C.ink6}`,display:'flex',flexDirection:'column',gap:9}}>
          {cart.map((item:any,i:number)=>(
            <div key={i} style={{display:'flex',gap:9,alignItems:'flex-start'}}>
              <div style={{width:44,height:44,background:C.cream,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0,position:'relative'}}>{item.emoji}<span style={{position:'absolute',top:-5,right:-5,background:C.g700,color:'#fff',width:15,height:15,borderRadius:'50%',fontSize:8,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center'}}>{item.qty}</span></div>
              <div style={{flex:1}}><p style={{margin:'0 0 1px',fontSize:11,fontWeight:700,color:C.ink}}>{item.name}</p><p style={{margin:0,fontSize:10,color:C.ink4}}>Size {item.size}</p><p style={{margin:'1px 0 0',fontSize:12,fontWeight:700,color:C.g700}}>{fmt(item.price*(item.qty||1))}</p></div>
            </div>
          ))}
        </div>
        {step<3&&<div style={{padding:'10px 18px',borderBottom:`1px solid ${C.ink6}`}}>
          <div style={{display:'flex',gap:7}}><input value={couponInput} onChange={e=>{setCouponInput(e.target.value);setCouponErr('')}} placeholder="Kode promo" style={{flex:1,padding:'8px 10px',border:`1px solid ${couponErr?C.red:C.ink5}`,borderRadius:8,fontSize:12,fontFamily:'inherit',outline:'none'}}/><button onClick={applyCoupon} style={{background:C.g800,color:'#fff',border:'none',borderRadius:8,padding:'8px 12px',fontSize:11,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>Apply</button></div>
          {couponErr&&<p style={{margin:'4px 0 0',fontSize:11,color:C.red}}>{couponErr}</p>}
          {coupon&&<p style={{margin:'4px 0 0',fontSize:11,color:C.g500,fontWeight:600}}>✓ Kode <strong>{coupon}</strong> aktif!</p>}
        </div>}
        <div style={{padding:'12px 18px 16px',display:'flex',flexDirection:'column',gap:7}}>
          {[['Subtotal',fmt(subtotal)],shippingData.shipping&&['Ongkos Kirim',fmt(shippingCost)],discount>0&&['Diskon ('+coupon+')','-'+fmt(discount)]].filter(Boolean).map((row:any)=>(
            <div key={row[0]} style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:12,color:C.ink3}}>{row[0]}</span><span style={{fontSize:12,fontWeight:600,color:C.ink}}>{row[1]}</span></div>
          ))}
          <div style={{borderTop:`1px solid ${C.ink6}`,paddingTop:9,marginTop:3,display:'flex',justifyContent:'space-between'}}><span style={{fontSize:13,fontWeight:700,color:C.ink}}>Total</span><span style={{fontSize:15,fontWeight:800,color:C.g800}}>{fmt(total)}</span></div>
        </div>
      </div>
    </aside>
  )
  if(step===4&&confirmedOrder){
    return <div style={{background:C.cream,minHeight:'100vh'}}>
      <StoreNavbar nav={nav} cartCount={0} onCartClick={()=>{}} scrolled={true}/>
      <div style={{maxWidth:560,margin:'0 auto',padding:'56px 5vw',textAlign:'center',marginTop:62+32}}>
        <div style={{width:68,height:68,borderRadius:'50%',background:C.g100,border:`3px solid ${C.g400}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none"><polyline points="5,16 12,23 27,9" stroke={C.g600} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h1 style={{margin:'0 0 7px',fontFamily:"'DM Serif Display',Georgia,serif",fontSize:'1.9rem',fontWeight:400,color:C.ink}}>Order Confirmed! 🎉</h1>
        <p style={{margin:'0 0 5px',fontSize:14,color:C.ink3}}>Terima kasih sudah belanja di <strong>The Elite Athletes</strong>.</p>
        <p style={{margin:'0 0 26px',fontSize:13,color:C.ink4}}>Konfirmasi dikirim ke <strong style={{color:C.g700}}>{confirmedOrder.email}</strong></p>
        <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:14,padding:'18px 20px',textAlign:'left',marginBottom:20}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12,paddingBottom:10,borderBottom:`1px solid ${C.ink6}`}}>
            <div><p style={{margin:'0 0 2px',fontSize:14,fontWeight:800,color:C.g700}}>{confirmedOrder.id}</p><p style={{margin:0,fontSize:11,color:C.ink4}}>{fmtDate(confirmedOrder.date)}</p></div>
            <span style={{fontSize:10,fontWeight:800,letterSpacing:'0.08em',textTransform:'uppercase',padding:'4px 11px',borderRadius:20,background:C.blueBg,color:C.blue}}>Processing</span>
          </div>
          {confirmedOrder.items.map((item:any,i:number)=>(
            <div key={i} style={{display:'flex',gap:9,marginBottom:7}}><span style={{fontSize:24}}>{item.emoji}</span><div style={{flex:1}}><p style={{margin:'0 0 1px',fontSize:12,fontWeight:700,color:C.ink}}>{item.name}</p><p style={{margin:0,fontSize:10,color:C.ink4}}>Size {item.size} · Qty {item.qty}</p></div><span style={{fontSize:12,fontWeight:700,color:C.ink}}>{fmt(item.price*(item.qty||1))}</span></div>
          ))}
          <div style={{borderTop:`1px solid ${C.ink6}`,paddingTop:9,marginTop:3,display:'flex',justifyContent:'space-between'}}><span style={{fontSize:13,fontWeight:700,color:C.ink}}>Total</span><span style={{fontSize:14,fontWeight:800,color:C.g700}}>{fmt(confirmedOrder.total)}</span></div>
        </div>
        <div style={{display:'flex',gap:11,justifyContent:'center',flexWrap:'wrap'}}>
          <button onClick={()=>nav('home')} style={{background:C.g800,color:'#fff',border:'none',borderRadius:10,padding:'12px 24px',fontSize:13,fontWeight:700,cursor:'pointer'}}>Kembali Belanja</button>
          <button onClick={()=>nav('admin')} style={{background:C.white,color:C.ink2,border:`1px solid ${C.ink5}`,borderRadius:10,padding:'12px 24px',fontSize:13,fontWeight:600,cursor:'pointer'}}>Admin Panel</button>
        </div>
      </div>
    </div>
  }
  return <div style={{background:C.cream,minHeight:'100vh'}}>
    <StoreNavbar nav={nav} cartCount={cart.length} onCartClick={()=>{}} scrolled={true}/>
    <div style={{maxWidth:1060,margin:'0 auto',padding:'26px 5vw 56px',marginTop:62+32}}>
      {/* MINI ORDER SUMMARY — compact, always visible */}
      {cart.length>0&&step<4&&(
        <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:12,padding:'12px 16px',marginBottom:20,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <div style={{display:'flex',gap:6,alignItems:'center',overflow:'hidden'}}>
            {cart.slice(0,3).map((item:any,i:number)=>(
              <div key={i} style={{width:36,height:36,background:C.cream,borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>{item.emoji}</div>
            ))}
            {cart.length>3&&<span style={{fontSize:11,color:C.ink4}}>+{cart.length-3}</span>}
            <span style={{fontSize:12,color:C.ink3,marginLeft:4}}>{cart.length} item{cart.length>1?'s':''}</span>
          </div>
          <div style={{textAlign:'right',flexShrink:0}}>
            <div style={{fontSize:11,color:C.ink4}}>Total</div>
            <div style={{fontSize:15,fontWeight:800,color:C.g800}}>{fmt(total)}</div>
          </div>
        </div>
      )}
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginBottom:28,gap:0}}>
        {['Keranjang','Pengiriman','Pembayaran','Konfirmasi'].map((s,i)=>{
          const done=i<step,active=i===step
          return <div key={s} style={{display:'flex',alignItems:'center'}}>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <div style={{width:24,height:24,borderRadius:'50%',background:done?C.g500:active?C.g800:C.ink5,color:done||active?'#fff':C.ink4,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,transition:'all 0.3s'}}>
                {done?<svg width="11" height="11" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>:i+1}
              </div>
              <span style={{fontSize:12,fontWeight:active?700:500,color:active?C.g800:done?C.g500:C.ink4}}>{s}</span>
            </div>
            {i<3&&<div style={{width:26,height:1,background:done?C.g300:C.ink5,margin:'0 5px',transition:'background 0.3s'}}/>}
          </div>
        })}
      </div>
      <div style={{maxWidth:620,margin:'0 auto'}}>
        <div>
          {step===0&&<div style={{display:'flex',flexDirection:'column',gap:12}}>
            <h2 style={{margin:'0 0 4px',fontSize:19,fontWeight:700,color:C.ink}}>Keranjang Belanja</h2>
            {cart.length===0
              ?<div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:14,padding:'48px 22px',textAlign:'center'}}>
                <span style={{fontSize:40}}>🛍️</span>
                <p style={{fontSize:14,fontWeight:600,color:C.ink2,margin:'12px 0 6px'}}>Keranjang kosong</p>
                <p style={{fontSize:12,color:C.ink4,margin:'0 0 18px'}}>Yuk tambahkan produk dulu!</p>
                <button onClick={()=>nav('catalog')} style={{background:C.g800,color:'#fff',border:'none',borderRadius:10,padding:'11px 24px',fontSize:13,fontWeight:700,cursor:'pointer'}}>Shop Collection →</button>
              </div>
              :<>{cart.map((item:any,i:number)=>(
                <div key={i} style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:13,padding:'14px 16px',display:'flex',gap:12,alignItems:'center'}}>
                  <div style={{width:68,height:68,background:C.cream,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,flexShrink:0}}>{item.emoji}</div>
                  <div style={{flex:1,minWidth:0}}><p style={{margin:'0 0 2px',fontSize:9,fontWeight:700,color:C.g500,letterSpacing:'0.1em',textTransform:'uppercase'}}>{item.sport}</p><p style={{margin:'0 0 3px',fontSize:13,fontWeight:700,color:C.ink}}>{item.name}</p><p style={{margin:0,fontSize:11,color:C.ink4}}>Size {item.size} · {item.color}</p></div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
                    <button onClick={()=>setCart((c:any[])=>c.filter((_,idx)=>idx!==i))} style={{background:'none',border:'none',cursor:'pointer',color:C.ink4,fontSize:15,padding:'2px',lineHeight:1}}>✕</button>
                    <div style={{display:'flex',alignItems:'center',border:`1px solid ${C.ink5}`,borderRadius:8,overflow:'hidden',background:C.cream}}>
                      <button onClick={()=>setCart((c:any[])=>c.map((x,idx)=>idx===i?{...x,qty:Math.max(1,(x.qty||1)-1)}:x))} style={{width:28,height:28,background:'none',border:'none',cursor:'pointer',fontSize:14,color:C.ink2}}>−</button>
                      <span style={{width:26,textAlign:'center',fontSize:12,fontWeight:700,color:C.ink}}>{item.qty||1}</span>
                      <button onClick={()=>setCart((c:any[])=>c.map((x,idx)=>idx===i?{...x,qty:(x.qty||1)+1}:x))} style={{width:28,height:28,background:'none',border:'none',cursor:'pointer',fontSize:14,color:C.ink2}}>+</button>
                    </div>
                    <span style={{fontSize:14,fontWeight:800,color:C.ink}}>{fmt(item.price*(item.qty||1))}</span>
                  </div>
                </div>
              ))}{/* PROMO CODE in cart step */}
              <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:12,padding:'14px 16px'}}>
                <p style={{margin:'0 0 8px',fontSize:11,fontWeight:700,color:C.ink4,letterSpacing:'0.07em',textTransform:'uppercase'}}>Kode Promo</p>
                <div style={{display:'flex',gap:8}}>
                  <input value={couponInput} onChange={e=>{setCouponInput(e.target.value);setCouponErr('')}} placeholder="Contoh: ELITE20" style={{flex:1,padding:'9px 12px',border:`1px solid ${couponErr?C.red:C.ink5}`,borderRadius:8,fontSize:13,fontFamily:'inherit',outline:'none',color:C.ink}}/>
                  <button onClick={applyCoupon} style={{background:C.g800,color:'#fff',border:'none',borderRadius:8,padding:'9px 14px',fontSize:12,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>Apply</button>
                </div>
                {couponErr&&<p style={{margin:'5px 0 0',fontSize:11,color:C.red}}>{couponErr}</p>}
                {coupon&&<p style={{margin:'5px 0 0',fontSize:11,color:C.g500,fontWeight:600}}>✓ Kode <strong>{coupon}</strong> aktif! Hemat {fmt(discount)}</p>}
              </div>
              {/* TOTAL SUMMARY */}
              <div style={{background:C.g50,border:`1px solid ${C.g200}`,borderRadius:12,padding:'14px 16px'}}>
                {discount>0&&<div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{fontSize:13,color:C.ink3}}>Subtotal</span><span style={{fontSize:13,color:C.ink}}>{fmt(subtotal)}</span></div>}
                {discount>0&&<div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:13,color:C.g600}}>Diskon ({coupon})</span><span style={{fontSize:13,color:C.g600,fontWeight:700}}>-{fmt(discount)}</span></div>}
                <div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:15,fontWeight:700,color:C.ink}}>Total</span><span style={{fontSize:16,fontWeight:800,color:C.g800}}>{fmt(subtotal-discount)}</span></div>
                <p style={{margin:'5px 0 0',fontSize:11,color:C.ink4}}>Belum termasuk ongkos kirim</p>
              </div>
              <div style={{display:'flex',gap:10}}>
                <button onClick={()=>nav('catalog')} style={{flex:1,padding:'13px',background:C.white,color:C.ink2,border:`1px solid ${C.ink5}`,borderRadius:11,fontSize:13,fontWeight:600,cursor:'pointer'}}>← Lanjut Belanja</button>
                <button onClick={()=>setStep(1)} style={{flex:2,padding:'13px',background:C.g800,color:'#fff',border:'none',borderRadius:11,fontSize:14,fontWeight:700,cursor:'pointer'}}>Checkout →</button>
              </div></>

            }
          </div>}
          {step===1&&<div style={{display:'flex',flexDirection:'column',gap:18}}>
            <h2 style={{margin:'0 0 4px',fontSize:19,fontWeight:700,color:C.ink}}>Detail Pengiriman</h2>
            <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:13,padding:'18px 20px',display:'flex',flexDirection:'column',gap:13}}>
              <p style={{margin:'0 0 3px',fontSize:11,fontWeight:700,color:C.ink4,letterSpacing:'0.08em',textTransform:'uppercase'}}>Informasi Penerima</p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:11}}>
                <Field label="Nama Depan" id="fn" required placeholder="Sarah" value={shippingData.firstName||''} onChange={(e:any)=>setShippingData((d:any)=>({...d,firstName:e.target.value}))}/>
                <Field label="Nama Belakang" id="ln" required placeholder="Kusuma" value={shippingData.lastName||''} onChange={(e:any)=>setShippingData((d:any)=>({...d,lastName:e.target.value}))}/>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:11}}>
                <Field label="Nomor HP" id="ph" required placeholder="08123456789" type="tel" value={shippingData.phone||''} onChange={(e:any)=>setShippingData((d:any)=>({...d,phone:e.target.value}))}/>
                <Field label="Email" id="em" required placeholder="sarah@gmail.com" type="email" value={shippingData.email||''} onChange={(e:any)=>setShippingData((d:any)=>({...d,email:e.target.value}))}/>
              </div>
            </div>
            <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:13,padding:'18px 20px',display:'flex',flexDirection:'column',gap:13}}>
              <p style={{margin:'0 0 3px',fontSize:11,fontWeight:700,color:C.ink4,letterSpacing:'0.08em',textTransform:'uppercase'}}>Alamat Pengiriman</p>
              <Field label="Alamat Lengkap" id="addr" required placeholder="Jl. Sudirman No. 12, RT/RW 001/002" value={shippingData.address||''} onChange={(e:any)=>setShippingData((d:any)=>({...d,address:e.target.value}))}/>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:11}}>
                <Field label="Kota" id="city" required placeholder="Jakarta Selatan" value={shippingData.city||''} onChange={(e:any)=>setShippingData((d:any)=>({...d,city:e.target.value}))}/>
                <div style={{display:'flex',flexDirection:'column',gap:4}}>
                  <label style={{fontSize:12,fontWeight:600,color:C.ink3,letterSpacing:'0.04em'}}>Provinsi <span style={{color:C.red}}>*</span></label>
                  <select value={shippingData.province||''} onChange={(e:any)=>setShippingData((d:any)=>({...d,province:e.target.value}))} style={{padding:'10px 13px',border:`1px solid ${C.ink5}`,borderRadius:9,fontSize:13,fontFamily:'inherit',outline:'none',background:C.white,cursor:'pointer',color:C.ink}}>
                    <option value="">Pilih Provinsi</option>
                    {PROVINCES.map(p=><option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:13,padding:'18px 20px',display:'flex',flexDirection:'column',gap:9}}>
              <p style={{margin:'0 0 3px',fontSize:11,fontWeight:700,color:C.ink4,letterSpacing:'0.08em',textTransform:'uppercase'}}>Metode Pengiriman</p>
              {SHIPPING_OPTIONS.map(opt=>(
                <label key={opt.id} onClick={()=>setShippingData((d:any)=>({...d,shipping:opt.id}))} style={{display:'flex',alignItems:'center',gap:11,padding:'12px 14px',border:`1.5px solid ${shippingData.shipping===opt.id?C.g500:C.ink6}`,background:shippingData.shipping===opt.id?C.g50:C.white,borderRadius:11,cursor:'pointer',transition:'all 0.15s'}}>
                  <div style={{width:17,height:17,borderRadius:'50%',border:`2px solid ${shippingData.shipping===opt.id?C.g600:C.ink4}`,background:shippingData.shipping===opt.id?C.g600:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{shippingData.shipping===opt.id&&<div style={{width:6,height:6,borderRadius:'50%',background:'#fff'}}/>}</div>
                  <span style={{fontSize:18}}>{opt.icon}</span>
                  <div style={{flex:1}}><p style={{margin:'0 0 1px',fontSize:13,fontWeight:700,color:C.ink}}>{opt.label}</p><p style={{margin:0,fontSize:11,color:C.ink4}}>{opt.desc}</p></div>
                  <span style={{fontSize:13,fontWeight:800,color:shippingData.shipping===opt.id?C.g700:C.ink}}>{fmt(opt.price)}</span>
                </label>
              ))}
            </div>
            <div style={{display:'flex',gap:11}}>
              <button onClick={()=>setStep(0)} style={{padding:'12px 20px',background:C.white,color:C.ink2,border:`1px solid ${C.ink5}`,borderRadius:10,fontSize:13,fontWeight:600,cursor:'pointer'}}>← Back</button>
              <button onClick={()=>{if(!shippingData.firstName||!shippingData.email||!shippingData.address||!shippingData.shipping){alert('Lengkapi semua field wajib.')}else{setStep(2)}}} style={{flex:1,padding:'12px',background:C.g800,color:'#fff',border:'none',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer'}}>Lanjut ke Pembayaran →</button>
            </div>
          </div>}
          {step===2&&<div style={{display:'flex',flexDirection:'column',gap:18}}>
            <h2 style={{margin:'0 0 4px',fontSize:19,fontWeight:700,color:C.ink}}>Metode Pembayaran</h2>
            <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:13,padding:'18px 20px',display:'flex',flexDirection:'column',gap:9}}>
              {PAYMENT_METHODS.map(pm=>(
                <label key={pm.id} onClick={()=>setPaymentMethod(pm.id)} style={{display:'flex',alignItems:'center',gap:11,padding:'13px 14px',border:`1.5px solid ${paymentMethod===pm.id?C.g500:C.ink6}`,background:paymentMethod===pm.id?C.g50:C.white,borderRadius:11,cursor:'pointer',transition:'all 0.15s'}}>
                  <div style={{width:17,height:17,borderRadius:'50%',border:`2px solid ${paymentMethod===pm.id?C.g600:C.ink4}`,background:paymentMethod===pm.id?C.g600:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{paymentMethod===pm.id&&<div style={{width:6,height:6,borderRadius:'50%',background:'#fff'}}/>}</div>
                  <span style={{fontSize:21}}>{pm.icon}</span>
                  <div style={{flex:1}}><p style={{margin:'0 0 2px',fontSize:13,fontWeight:700,color:C.ink}}>{pm.label}</p><div style={{display:'flex',gap:5,alignItems:'center',flexWrap:'wrap'}}>{pm.icons.map(ic=><span key={ic} style={{fontSize:10,background:C.cream2,color:C.ink3,padding:'1px 6px',borderRadius:3,fontWeight:600,border:`1px solid ${C.ink6}`}}>{ic}</span>)}<span style={{fontSize:11,color:C.ink4}}>— {pm.desc}</span></div></div>
                </label>
              ))}
            </div>
            <div style={{display:'flex',gap:11}}>
              <button onClick={()=>setStep(1)} style={{padding:'12px 20px',background:C.white,color:C.ink2,border:`1px solid ${C.ink5}`,borderRadius:10,fontSize:13,fontWeight:600,cursor:'pointer'}}>← Back</button>
              <button onClick={()=>{if(!paymentMethod){alert('Pilih metode pembayaran.')}else{setStep(3)}}} style={{flex:1,padding:'12px',background:C.g800,color:'#fff',border:'none',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer'}}>Review Order →</button>
            </div>
          </div>}
          {step===3&&<div style={{display:'flex',flexDirection:'column',gap:16}}>
            <h2 style={{margin:'0 0 4px',fontSize:19,fontWeight:700,color:C.ink}}>Review & Konfirmasi</h2>
            <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:13,padding:'16px 18px'}}>
              <p style={{margin:'0 0 10px',fontSize:10,fontWeight:700,color:C.ink4,letterSpacing:'0.08em',textTransform:'uppercase'}}>Items</p>
              {cart.map((item:any,i:number)=>(
                <div key={i} style={{display:'flex',gap:9,paddingBottom:9,marginBottom:9,borderBottom:`1px solid ${C.ink6}`}}>
                  <div style={{width:40,height:40,background:C.cream,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>{item.emoji}</div>
                  <div style={{flex:1}}><p style={{margin:'0 0 1px',fontSize:12,fontWeight:700,color:C.ink}}>{item.name}</p><p style={{margin:0,fontSize:10,color:C.ink4}}>Size {item.size} · Qty {item.qty}</p></div>
                  <span style={{fontSize:12,fontWeight:700,color:C.ink}}>{fmt(item.price*(item.qty||1))}</span>
                </div>
              ))}
              <div style={{display:'flex',justifyContent:'space-between',paddingTop:7}}><span style={{fontSize:13,fontWeight:700,color:C.ink}}>Total Pembayaran</span><span style={{fontSize:15,fontWeight:800,color:C.g800}}>{fmt(total)}</span></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:11}}>
              <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:11,padding:'13px 14px'}}><p style={{margin:'0 0 7px',fontSize:10,fontWeight:700,color:C.ink4,letterSpacing:'0.08em',textTransform:'uppercase'}}>Dikirim ke</p><p style={{margin:'0 0 2px',fontSize:12,fontWeight:700,color:C.ink}}>{shippingData.firstName} {shippingData.lastName}</p><p style={{margin:'0 0 2px',fontSize:11,color:C.ink3,lineHeight:1.5}}>{shippingData.address}</p><p style={{margin:0,fontSize:11,color:C.ink3}}>{shippingData.city}, {shippingData.province}</p></div>
              <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:11,padding:'13px 14px'}}><p style={{margin:'0 0 7px',fontSize:10,fontWeight:700,color:C.ink4,letterSpacing:'0.08em',textTransform:'uppercase'}}>Pembayaran</p><p style={{margin:'0 0 3px',fontSize:12,fontWeight:700,color:C.ink}}>{PAYMENT_METHODS.find(p=>p.id===paymentMethod)?.icon} {PAYMENT_METHODS.find(p=>p.id===paymentMethod)?.label}</p><p style={{margin:0,fontSize:12,fontWeight:600,color:C.g700}}>📦 {SHIPPING_OPTIONS.find(o=>o.id===shippingData.shipping)?.label}</p></div>
            </div>
            <div style={{background:C.g50,border:`1px solid ${C.g100}`,borderRadius:11,padding:'12px 16px',display:'flex',gap:9}}><span style={{fontSize:15}}>🔒</span><p style={{margin:0,fontSize:12,color:C.g700,lineHeight:1.6}}>Dengan menekan "Place Order", kamu menyetujui Syarat & Ketentuan The Elite Athletes.</p></div>
            <div style={{display:'flex',gap:11}}>
              <button onClick={()=>setStep(2)} style={{padding:'12px 20px',background:C.white,color:C.ink2,border:`1px solid ${C.ink5}`,borderRadius:10,fontSize:13,fontWeight:600,cursor:'pointer'}}>← Back</button>
              <button onClick={placeOrder} disabled={placing} style={{flex:1,padding:'13px',background:placing?C.g500:C.g800,color:'#fff',border:'none',borderRadius:10,fontSize:13,fontWeight:700,cursor:placing?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:9}}>
                {placing?<><span style={{display:'inline-block',width:13,height:13,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>Memproses…</>:'Place Order →'}
              </button>
            </div>
          </div>}
        </div>
      </div>
    </div>
  </div>
}

// ═══════════════════════════════════════════════════════════
// ADMIN LAYOUT + PAGES
// ═══════════════════════════════════════════════════════════
const ADMIN_NAV=[{id:'overview',icon:'◈',label:'Overview'},{id:'orders',icon:'📋',label:'Orders'},{id:'inventory',icon:'📦',label:'Inventory'},{id:'customers',icon:'👥',label:'Customers'},{id:'financial',icon:'📊',label:'Financial'},{id:'integrations',icon:'🔌',label:'Integrations'}]
const STATUS_FLOW:Record<string,string[]>={pending:['processing','cancelled'],processing:['shipped','cancelled'],shipped:['delivered'],delivered:[],cancelled:[]}

function AdminLayout({page,setPage,children,nav,collapsed,setCollapsed}:{page:string,setPage:(p:string)=>void,children:React.ReactNode,nav:(p:string,d?:any)=>void,collapsed:boolean,setCollapsed:(c:boolean)=>void}) {
  const titles:Record<string,string>={overview:'Overview',orders:'Orders',inventory:'Inventory',customers:'Customers',financial:'Financial Reports',integrations:'Integration Hub'}
  return <div style={{display:'flex',minHeight:'100vh'}}>
    <aside style={{width:collapsed?64:216,flexShrink:0,background:C.g900,minHeight:'100vh',display:'flex',flexDirection:'column',transition:'width 0.25s',overflow:'hidden'}}>
      <div style={{padding:'16px 14px 14px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:33,height:33,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,overflow:'hidden'}}><img src="/logo.png" alt="TEA" style={{width:33,height:33,objectFit:'contain'}}/></div>
        {!collapsed&&<div style={{lineHeight:1.1}}><div style={{fontSize:11,fontWeight:700,color:C.g100,letterSpacing:'0.1em',textTransform:'uppercase'}}>The Elite</div><div style={{fontSize:9,color:C.g400,letterSpacing:'0.16em',textTransform:'uppercase'}}>Admin</div></div>}
      </div>
      <nav style={{flex:1,paddingTop:8}}>
        {ADMIN_NAV.map(item=>(
          <button key={item.id} onClick={()=>setPage(item.id)} style={{width:'100%',display:'flex',alignItems:'center',gap:11,padding:collapsed?'12px 0':'10px 16px',justifyContent:collapsed?'center':'flex-start',background:page===item.id?'rgba(255,255,255,0.09)':'transparent',border:'none',cursor:'pointer',transition:'background 0.15s',borderLeft:page===item.id?`3px solid ${C.g300}`:'3px solid transparent'}}>
            <span style={{fontSize:16,flexShrink:0}}>{item.icon}</span>
            {!collapsed&&<span style={{fontSize:13,fontWeight:page===item.id?700:500,color:page===item.id?C.g100:'rgba(255,255,255,0.45)',whiteSpace:'nowrap'}}>{item.label}</span>}
          </button>
        ))}
      </nav>
      <div style={{paddingBottom:10,borderTop:'1px solid rgba(255,255,255,0.07)'}}>
        {!collapsed&&<button onClick={()=>nav('home')} style={{width:'100%',background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.3)',fontSize:11,padding:'9px 0',textAlign:'center',letterSpacing:'0.05em'}}>← Kembali ke Toko</button>}
        <div style={{display:'flex',justifyContent:'center'}}><button onClick={()=>setCollapsed(!collapsed)} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.3)',fontSize:18,padding:'5px 12px'}}>{collapsed?'›':'‹'}</button></div>
      </div>
    </aside>
    <main style={{flex:1,minWidth:0,overflow:'auto',background:C.cream}}>
      <div style={{background:'rgba(250,248,244,0.97)',backdropFilter:'blur(8px)',borderBottom:`1px solid ${C.ink6}`,padding:'0 26px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:7}}><span style={{fontSize:12,color:C.ink4}}>Admin</span><span style={{color:C.ink5}}>›</span><span style={{fontSize:13,fontWeight:600,color:C.ink}}>{titles[page]}</span></div>
        <div style={{display:'flex',alignItems:'center',gap:11}}><span style={{fontSize:12,color:C.ink4}}>admin@theeliteathletes.id</span><div style={{width:32,height:32,borderRadius:'50%',background:C.g800,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:C.g200}}>AD</div></div>
      </div>
      <div style={{padding:26}}>{children}</div>
    </main>
  </div>
}

function AdminOverview({products,orders,customers}:{products:any[],orders:any[],customers:any[]}) {
  const revenue=orders.filter((o:any)=>o.status==='delivered').reduce((s:number,o:any)=>s+o.total,0)
  const pending=orders.filter((o:any)=>['pending','processing'].includes(o.status)).length
  const lowStock=products.filter((p:any)=>['low','critical','out'].includes(p.status)).length
  const recent=[...orders].sort((a:any,b:any)=>new Date(b.date).getTime()-new Date(a.date).getTime()).slice(0,5)
  const alerts=products.filter((p:any)=>p.status!=='active').slice(0,5).map((p:any)=>({...p,total:totStock(p)}))
  const KPI=({label,value,sub,accent}:{label:string,value:any,sub?:string,accent:string})=>(
    <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:14,padding:'16px 18px',borderLeft:`3px solid ${accent}`}}>
      <p style={{margin:'0 0 7px',fontSize:10,fontWeight:700,color:C.ink4,letterSpacing:'0.08em',textTransform:'uppercase'}}>{label}</p>
      <p style={{margin:'0 0 3px',fontSize:23,fontWeight:800,color:C.ink,letterSpacing:'-0.03em'}}>{value}</p>
      {sub&&<p style={{margin:0,fontSize:11,color:C.ink4}}>{sub}</p>}
    </div>
  )
  return <div style={{display:'flex',flexDirection:'column',gap:20}}>
    <div><h1 style={{margin:'0 0 3px',fontSize:21,fontWeight:700,color:C.ink}}>Dashboard</h1><p style={{margin:0,fontSize:13,color:C.ink4}}>Selamat datang — ringkasan hari ini.</p></div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:12}}>
      <KPI label="Total Revenue" value={fmtM(revenue)} sub="dari order delivered" accent={C.g600}/>
      <KPI label="Pending Orders" value={pending} sub="perlu diproses" accent={pending>3?C.red:C.g500}/>
      <KPI label="Customers" value={customers.length} sub="total terdaftar" accent={C.blue}/>
      <KPI label="Stock Alerts" value={lowStock} sub="perlu restock" accent={lowStock>2?C.red:C.amber}/>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
      <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:14,overflow:'hidden'}}>
        <div style={{padding:'14px 18px',borderBottom:`1px solid ${C.ink6}`}}><h3 style={{margin:0,fontSize:14,fontWeight:700,color:C.ink}}>Order Terbaru</h3></div>
        <div style={{padding:'10px 14px',display:'flex',flexDirection:'column',gap:7}}>
          {recent.map((o:any)=>(
            <div key={o.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 10px',background:C.cream,borderRadius:9}}>
              <div><p style={{margin:'0 0 1px',fontSize:12,fontWeight:700,color:C.ink}}>{o.customerName}</p><p style={{margin:0,fontSize:10,color:C.ink4}}>{o.id} · {fmtDate(o.date)}</p></div>
              <div style={{textAlign:'right'}}><div style={{marginBottom:3}}><SBadge status={o.status}/></div><p style={{margin:0,fontSize:12,fontWeight:700,color:C.g700}}>{fmt(o.total)}</p></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:14,overflow:'hidden'}}>
        <div style={{padding:'14px 18px',borderBottom:`1px solid ${C.ink6}`}}><h3 style={{margin:0,fontSize:14,fontWeight:700,color:C.ink}}>Peringatan Stok</h3></div>
        <div style={{padding:'10px 14px',display:'flex',flexDirection:'column',gap:7}}>
          {alerts.map((p:any)=>(
            <div key={p.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 10px',background:p.status==='out'?C.redBg:p.status==='critical'?'#FFF7ED':C.amberBg,borderRadius:9}}>
              <div style={{display:'flex',alignItems:'center',gap:7}}><span style={{fontSize:18}}>{p.emoji}</span><div><p style={{margin:'0 0 1px',fontSize:12,fontWeight:700,color:C.ink}}>{p.name}</p><p style={{margin:0,fontSize:10,color:C.ink4}}>{p.sku}</p></div></div>
              <div style={{textAlign:'right'}}><SBadge status={p.status}/><p style={{margin:'2px 0 0',fontSize:11,fontWeight:700,color:p.status==='out'?C.red:C.amber}}>{p.total} unit</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:14,padding:'16px 18px'}}>
      <h3 style={{margin:'0 0 12px',fontSize:14,fontWeight:700,color:C.ink}}>Revenue — 7 Hari Terakhir</h3>
      <div style={{display:'flex',alignItems:'flex-end',gap:5,height:70}}>
        {[42,58,38,75,91,67,84].map((v,i)=>(
          <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
            <div style={{width:'100%',background:i===6?C.g600:C.g200,borderRadius:'4px 4px 0 0',height:v*0.65,transition:'height 0.4s'}}/>
            <span style={{fontSize:9,color:C.ink4}}>{'SMTWTFS'[i]}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
}

function AdminOrders({orders:initO}:{orders:any[]}) {
  const [orders,setOrders]=useState(initO)
  useEffect(()=>{
    fetch('/api/orders').then(r=>r.json()).then(d=>{if(d.data&&d.data.length>0)setOrders(d.data)}).catch(()=>{})
  },[])
  const [search,setSearch]=useState('')
  const [filter,setFilter]=useState('all')
  const [selected,setSelected]=useState<any>(null)
  const filtered=useMemo(()=>{
    let o=[...orders].sort((a:any,b:any)=>new Date(b.date).getTime()-new Date(a.date).getTime())
    if(search) o=o.filter((x:any)=>x.customerName.toLowerCase().includes(search.toLowerCase())||x.id.includes(search))
    if(filter!=='all') o=o.filter((x:any)=>x.status===filter)
    return o
  },[orders,search,filter])
  function updateStatus(id:string,status:string){setOrders((o:any[])=>o.map((x:any)=>x.id===id?{...x,status}:x));if(selected?.id===id)setSelected((s:any)=>({...s,status}))}
  return <div style={{display:'flex',gap:16,height:'calc(100vh - 120px)'}}>
    <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',gap:12}}>
      <div style={{display:'flex',gap:9,flexWrap:'wrap'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari order atau customer…" style={{flex:1,minWidth:160,padding:'9px 13px',border:`1px solid ${C.ink5}`,borderRadius:9,fontSize:13,fontFamily:'inherit',outline:'none',background:C.white,color:C.ink}}/>
        <select value={filter} onChange={e=>setFilter(e.target.value)} style={{padding:'9px 13px',border:`1px solid ${C.ink5}`,borderRadius:9,fontSize:13,fontFamily:'inherit',outline:'none',background:C.white,cursor:'pointer',color:C.ink2}}>
          <option value="all">Semua Status</option>
          {['pending','processing','shipped','delivered','cancelled'].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
      </div>
      <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:12,flex:1,overflowY:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
          <thead><tr style={{background:C.cream,borderBottom:`1px solid ${C.ink6}`}}>{['Order ID','Customer','Tanggal','Total','Status','Ubah'].map(h=><th key={h} style={{padding:'10px 13px',textAlign:'left',fontSize:10,fontWeight:700,color:C.ink4,letterSpacing:'0.07em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((o:any,i:number)=>(
              <tr key={o.id} onClick={()=>setSelected(o)} style={{borderBottom:`1px solid ${C.ink6}`,background:selected?.id===o.id?C.g50:i%2===0?C.white:C.cream,cursor:'pointer'}}>
                <td style={{padding:'10px 13px',fontWeight:700,color:C.g700,fontSize:12}}>{o.id}</td>
                <td style={{padding:'10px 13px',fontWeight:600,color:C.ink}}>{o.customer_name||o.customerName||'-'}</td>
                <td style={{padding:'10px 13px',color:C.ink3,whiteSpace:'nowrap'}}>{fmtDate(o.date)}</td>
                <td style={{padding:'10px 13px',fontWeight:700,color:C.ink}}>{fmt(o.total)}</td>
                <td style={{padding:'10px 13px'}}><SBadge status={o.status}/></td>
                <td style={{padding:'10px 13px'}}>
                  <select onClick={e=>e.stopPropagation()} value={o.status} onChange={e=>{e.stopPropagation();updateStatus(o.id,e.target.value)}} disabled={!STATUS_FLOW[o.status]?.length} style={{padding:'4px 9px',border:`1px solid ${C.ink5}`,borderRadius:7,fontSize:11,fontFamily:'inherit',cursor:'pointer',background:C.white,color:C.ink2,outline:'none'}}>
                    <option value={o.status}>{o.status.charAt(0).toUpperCase()+o.status.slice(1)}</option>
                    {(STATUS_FLOW[o.status]||[]).map((s:string)=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0&&<p style={{textAlign:'center',padding:36,color:C.ink4,fontSize:13}}>Tidak ada order</p>}
      </div>
    </div>
    {selected&&(
      <div style={{width:280,flexShrink:0,background:C.white,border:`1px solid ${C.ink6}`,borderRadius:12,padding:18,overflowY:'auto',display:'flex',flexDirection:'column',gap:13}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}><div><p style={{margin:'0 0 2px',fontSize:14,fontWeight:700,color:C.ink}}>{selected.id}</p><p style={{margin:0,fontSize:11,color:C.ink4}}>{fmtDate(selected.date)}</p></div><SBadge status={selected.status}/></div>
        <div style={{borderTop:`1px solid ${C.ink6}`,paddingTop:11}}>
          <p style={{margin:'0 0 5px',fontSize:10,fontWeight:700,color:C.ink4,letterSpacing:'0.07em',textTransform:'uppercase'}}>Customer</p>
          <p style={{margin:'0 0 2px',fontSize:13,fontWeight:700,color:C.ink}}>{selected.customer_name||selected.customerName||'-'}</p>
          <p style={{margin:'0 0 2px',fontSize:12,color:C.ink3,lineHeight:1.5}}>{selected.address}</p>
          <p style={{margin:0,fontSize:11,color:C.ink4}}>Bayar: {selected.payment_method||selected.payment||'-'}</p>
        </div>
        <div style={{borderTop:`1px solid ${C.ink6}`,paddingTop:11}}>
          <p style={{margin:'0 0 8px',fontSize:10,fontWeight:700,color:C.ink4,letterSpacing:'0.07em',textTransform:'uppercase'}}>Items</p>
          {selected.items.map((item:any,i:number)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:`1px solid ${C.ink6}`}}>
              <div><p style={{margin:'0 0 1px',fontSize:12,fontWeight:600,color:C.ink}}>{item.name}</p><p style={{margin:0,fontSize:10,color:C.ink4}}>Size {item.size} · Qty {item.qty}</p></div>
              <p style={{margin:0,fontSize:12,fontWeight:700,color:C.g700}}>{fmt(item.price*item.qty)}</p>
            </div>
          ))}
          <div style={{display:'flex',justifyContent:'space-between',paddingTop:9}}><span style={{fontSize:13,fontWeight:700,color:C.ink}}>Total</span><span style={{fontSize:14,fontWeight:800,color:C.g700}}>{fmt(selected.total)}</span></div>
        </div>
      </div>
    )}
  </div>
}

function EditProductModal({product:ep,onSave,onClose,uploadImageFn}:{product:any,onSave:(id:string,data:any)=>void,onClose:()=>void,uploadImageFn:(f:File,sku:string)=>Promise<string|null>}){
  const sizesFromStock=Object.keys(ep.stock||{})
  const [form,setForm]=useState({
    name:ep.name||'',price:String(ep.price||''),original:String(ep.original||ep.original_price||''),
    hpp:String(ep.hpp||''),desc:ep.description||ep.desc||'',sport:ep.sport||'Tennis',
    gender:ep.gender||'Men',extraSports:(ep.tags||[]).join(', '),
    sizes:sizesFromStock.length>0?sizesFromStock.join(','):(ep.sizes||[]).join(','),
    colors:(ep.colors||[]).join(','),hasSizes:true,hasColors:true,
  })
  const [stock,setStock]=useState<Record<string,number>>({...ep.stock})
  const [imgs,setImgs]=useState<(string|null)[]>([ep.image_url||null,null,null,null,null,null])
  const [saving,setSaving]=useState(false)
  const stockTotal=Object.values(stock).reduce((s:number,n:number)=>s+n,0)

  async function handleImgUpload(idx:number,file:File){
    const url=await uploadImageFn(file,ep.sku+'-img'+idx)
    if(url)setImgs(arr=>{const a=[...arr];a[idx]=url;return a})
  }

  async function handleSave(){
    setSaving(true)
    const payload={
      name:form.name,price:parseInt(form.price),
      original:form.original?parseInt(form.original):null,
      hpp:parseInt(form.hpp)||0,description:form.desc,
      sport:form.sport,gender:form.gender,
      tags:form.extraSports?form.extraSports.split(',').map((s:string)=>s.trim()).filter(Boolean):[],
      sizes:form.sizes.split(',').map((s:string)=>s.trim()).filter(Boolean),
      colors:form.colors.split(',').map((s:string)=>s.trim()).filter(Boolean),
      image_url:imgs[0]||ep.image_url,
      gallery:imgs.filter(Boolean),
      stock,
    }
    await fetch(`/api/products/${ep.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    onSave(ep.id,{...ep,...payload,stock})
    setSaving(false)
    onClose()
  }

  const ImgSlot=({idx,label}:{idx:number,label:string})=>(
    <div style={{display:'flex',flexDirection:'column',gap:5,alignItems:'center'}}>
      <div style={{width:idx===0?100:72,height:idx===0?100:72,borderRadius:10,overflow:'hidden',border:`2px ${imgs[idx]?'solid '+C.g300:'dashed '+C.ink5}`,background:C.cream,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,position:'relative'}}>
        {imgs[idx]?<img src={imgs[idx]!} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:idx===0?28:20}}>📷</span>}
        {imgs[idx]&&<button onClick={()=>setImgs(a=>{const b=[...a];b[idx]=null;return b})} style={{position:'absolute',top:2,right:2,width:16,height:16,borderRadius:'50%',background:C.red,color:'#fff',border:'none',cursor:'pointer',fontSize:9,display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>}
      </div>
      <label style={{fontSize:10,color:C.g700,fontWeight:600,cursor:'pointer',textAlign:'center'}}>
        {label}
        <input type="file" accept="image/*" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)handleImgUpload(idx,f)}}/>
      </label>
    </div>
  )

  return <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.45)',display:'flex',alignItems:'center',justifyContent:'center',padding:12}}>
    <div style={{background:C.white,borderRadius:16,width:'min(560px,98vw)',maxHeight:'92vh',overflowY:'auto',padding:'20px 22px',display:'flex',flexDirection:'column',gap:13}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3 style={{margin:0,fontSize:16,fontWeight:700,color:C.ink}}>Edit Produk</h3>
        <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:18,color:C.ink3}}>✕</button>
      </div>

      {/* FOTO — 1 utama + 5 detail */}
      <div style={{background:C.cream,borderRadius:10,padding:'12px 14px'}}>
        <p style={{margin:'0 0 10px',fontSize:12,fontWeight:700,color:C.ink3}}>Foto Produk</p>
        <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'flex-end'}}>
          <ImgSlot idx={0} label="📌 Utama"/>
          {[1,2,3,4,5].map(i=><ImgSlot key={i} idx={i} label={`Detail ${i}`}/>)}
        </div>
        <p style={{margin:'7px 0 0',fontSize:10,color:C.ink4}}>Foto Utama tampil di catalog. Detail tampil sebagai carousel di halaman produk.</p>
      </div>

      {/* BASIC FIELDS */}
      {[
        {label:'Nama Produk *',key:'name',placeholder:'Court Precision Polo'},
        {label:'Harga Jual *',key:'price',placeholder:'649000',type:'number'},
        {label:'Harga Asli / Sebelum Diskon',key:'original',placeholder:'890000',type:'number'},
        {label:'HPP / Modal',key:'hpp',placeholder:'280000',type:'number'},
        {label:'Deskripsi',key:'desc',placeholder:'Deskripsi singkat produk...'},
        {label:'Sport Tambahan (pisahkan koma)',key:'extraSports',placeholder:'Gym, Running'},
      ].map(f=>(
        <div key={f.key} style={{display:'flex',flexDirection:'column',gap:4}}>
          <label style={{fontSize:12,fontWeight:600,color:C.ink3}}>{f.label}</label>
          <input type={f.type||'text'} value={(form as any)[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.placeholder} style={{padding:'9px 12px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:13,fontFamily:'inherit',outline:'none',color:C.ink}}/>
        </div>
      ))}

      {/* DISCOUNT PREVIEW */}
      {form.price&&form.original&&parseInt(form.original)>parseInt(form.price)&&(
        <div style={{background:C.g50,border:`1px solid ${C.g200}`,borderRadius:9,padding:'10px 14px',display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:13,fontWeight:700,color:C.g700}}>{fmt(parseInt(form.price))}</span>
          <span style={{fontSize:12,color:C.ink4,textDecoration:'line-through'}}>{fmt(parseInt(form.original))}</span>
          <span style={{fontSize:11,fontWeight:700,background:C.red,color:'#fff',padding:'2px 7px',borderRadius:5}}>-{Math.round((1-parseInt(form.price)/parseInt(form.original))*100)}% OFF</span>
        </div>
      )}

      {/* SPORT & GENDER */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:11}}>
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          <label style={{fontSize:12,fontWeight:600,color:C.ink3}}>Sport</label>
          <select value={form.sport} onChange={e=>setForm(p=>({...p,sport:e.target.value}))} style={{padding:'9px 12px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:13,fontFamily:'inherit',outline:'none',color:C.ink}}>
            {['Tennis','Badminton','Padel','Hyrox','Gym','Running','Golf','Pilates','Yoga','Footwear','Aksesoris','Lainnya'].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:4}}>
          <label style={{fontSize:12,fontWeight:600,color:C.ink3}}>Gender</label>
          <select value={form.gender} onChange={e=>setForm(p=>({...p,gender:e.target.value}))} style={{padding:'9px 12px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:13,fontFamily:'inherit',outline:'none',color:C.ink}}>
            {['Men','Women','Unisex'].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* UKURAN & WARNA */}
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <label style={{fontSize:12,fontWeight:600,color:C.ink3}}>Ukuran (pisahkan koma)</label>
        <input value={form.sizes} onChange={e=>setForm(p=>({...p,sizes:e.target.value}))} placeholder="S,M,L,XL" style={{padding:'9px 12px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:13,fontFamily:'inherit',outline:'none',color:C.ink}}/>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <label style={{fontSize:12,fontWeight:600,color:C.ink3}}>Warna (pisahkan koma)</label>
        <input value={form.colors} onChange={e=>setForm(p=>({...p,colors:e.target.value}))} placeholder="Black,White,Forest" style={{padding:'9px 12px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:13,fontFamily:'inherit',outline:'none',color:C.ink}}/>
      </div>

      {/* STOK */}
      <div style={{background:C.cream,borderRadius:10,padding:'12px 14px'}}>
        <p style={{margin:'0 0 10px',fontSize:12,fontWeight:700,color:C.ink3}}>Stok per Ukuran</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(90px,1fr))',gap:9}}>
          {Object.entries(stock).map(([sz,qty])=>(
            <div key={sz} style={{textAlign:'center'}}>
              <label style={{display:'block',fontSize:10,fontWeight:700,color:C.ink4,marginBottom:4,textTransform:'uppercase'}}>{sz}</label>
              <div style={{display:'flex',alignItems:'center',border:`1.5px solid ${C.ink5}`,borderRadius:8,overflow:'hidden',background:C.white}}>
                <button onClick={()=>setStock(s=>({...s,[sz]:Math.max(0,(s[sz]||0)-1)}))} style={{width:26,background:'none',border:'none',cursor:'pointer',fontSize:15,color:C.ink2}}>−</button>
                <input type="number" min={0} value={qty} onFocus={e=>e.target.select()} onChange={e=>setStock(s=>({...s,[sz]:Math.max(0,parseInt(e.target.value)||0)}))} style={{flex:1,width:0,textAlign:'center',border:'none',background:'transparent',fontSize:13,fontWeight:700,color:C.ink,fontFamily:'inherit',outline:'none',padding:'6px 0'}}/>
                <button onClick={()=>setStock(s=>({...s,[sz]:(s[sz]||0)+1}))} style={{width:26,background:'none',border:'none',cursor:'pointer',fontSize:15,color:C.ink2}}>+</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:9,padding:'8px 10px',background:C.g50,borderRadius:7,display:'flex',justifyContent:'space-between'}}>
          <span style={{fontSize:12,color:C.ink3}}>Total stok</span>
          <span style={{fontSize:13,fontWeight:800,color:C.g700}}>{stockTotal} unit</span>
        </div>
      </div>

      <div style={{display:'flex',gap:9,justifyContent:'flex-end',paddingTop:4,borderTop:`1px solid ${C.ink6}`}}>
        <button onClick={onClose} style={{padding:'10px 18px',background:'none',border:`1px solid ${C.ink5}`,borderRadius:9,fontSize:13,fontWeight:600,color:C.ink2,cursor:'pointer'}}>Batal</button>
        <button onClick={handleSave} disabled={saving} style={{padding:'10px 22px',background:saving?C.ink5:C.g800,color:'#fff',border:'none',borderRadius:9,fontSize:13,fontWeight:700,cursor:saving?'not-allowed':'pointer'}}>
          {saving?'Menyimpan...':'Simpan Perubahan'}
        </button>
      </div>
    </div>
  </div>
}

function AdminInventory({products:initP}:{products:any[]}) {
  const [products,setProducts]=useState(initP)
  useEffect(()=>{
    fetch('/api/products').then(r=>r.json()).then(d=>{
      if(d.data&&d.data.length>0){
        const norm=d.data.map((p:any)=>({...p,original:p.original_price,reviews:p.review_count,sports:p.tags||[],image_url:p.image_url||null,stock:Object.fromEntries((p.stock||[]).map((s:any)=>[s.size,s.quantity]))}))
        setProducts(norm)
      }
    }).catch(()=>{})
  },[])
  const [search,setSearch]=useState('')
  const [sportF,setSportF]=useState('all')
  const [statusF,setStatusF]=useState('all')
  const [editProd,setEditProd]=useState<any>(null)
  const [showAdd,setShowAdd]=useState(false)
  const [newProd,setNewProd]=useState({name:'',sku:'',sport:'Tennis',gender:'Men',price:'',hpp:'',original:'',emoji:'👕',sizes:'S,M,L,XL',colors:'Black,White',desc:'',extraSports:'',hasSizes:true,hasColors:true})
  const [imageFile,setImageFile]=useState<File|null>(null)
  const [imagePreview,setImagePreview]=useState<string|null>(null)
  const [uploadingImg,setUploadingImg]=useState(false)
  const [previewImg,setPreviewImg]=useState<string|null>(null)
  const sports=['all',...new Set(products.map((p:any)=>p.sport))]
  const filtered=useMemo(()=>{
    let p=products
    if(search) p=p.filter((x:any)=>x.name.toLowerCase().includes(search.toLowerCase())||x.sku.includes(search))
    if(sportF!=='all') p=p.filter((x:any)=>x.sport===sportF)
    if(statusF!=='all') p=p.filter((x:any)=>x.status===statusF)
    return p
  },[products,search,sportF,statusF])
  function saveProduct(id:string,updated:any){
    setProducts((ps:any[])=>ps.map((p:any)=>{
      if(p.id!==id)return p
      const tot=Object.values(updated.stock||p.stock as Record<string,number>).reduce((s:number,n:any)=>s+(n||0),0)
      const status=tot===0?'out':tot<=(p.reorder||5)?'critical':tot<=(p.reorder||5)*2?'low':'active'
      return{...p,...updated,stock:updated.stock||p.stock,status}
    }))
    setEditProd(null)
  }

  const sums=[{l:'Total SKUs',v:products.length,col:C.ink},{l:'Active',v:products.filter((p:any)=>p.status==='active').length,col:C.g600},{l:'Low/Critical',v:products.filter((p:any)=>['low','critical'].includes(p.status)).length,col:C.amber},{l:'Out of Stock',v:products.filter((p:any)=>p.status==='out').length,col:C.red},{l:'Total Units',v:products.reduce((s:number,p:any)=>s+totStock(p),0),col:C.blue}]
  async function uploadImage(file:File, sku:string):Promise<string|null>{
    try{
      const ext = file.name.split('.').pop()
      const fileName = `${sku.toLowerCase().replace(/[^a-z0-9]/g,'-')}-${Date.now()}.${ext}`
      const { data, error } = await (await import('@supabase/supabase-js')).createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ).storage.from('product-images').upload(fileName, file, {upsert:true})
      if(error) throw error
      const { data: urlData } = (await import('@supabase/supabase-js')).createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ).storage.from('product-images').getPublicUrl(fileName)
      return urlData.publicUrl
    }catch(e){console.error('Upload error:',e);return null}
  }

  async function handleAddProduct(){
    if(!newProd.name||!newProd.sku||!newProd.price){alert('Isi nama, SKU, dan harga dulu.');return}
    try{
      const sizesArr=newProd.hasSizes?newProd.sizes.split(',').map((s:string)=>s.trim()).filter(Boolean):['One Size']
      const colorsArr=newProd.hasColors?newProd.colors.split(',').map((s:string)=>s.trim()).filter(Boolean):['Default']
      const tagsArr=newProd.extraSports?newProd.extraSports.split(',').map((s:string)=>s.trim()).filter(Boolean):[]
      // Read initial stock from inputs
      const initialStock:Record<string,number>={}
      sizesArr.forEach((sz:string)=>{
        const el=document.getElementById(`stock-${sz}`) as HTMLInputElement
        initialStock[sz]=el?parseInt(el.value)||0:0
      })
      // Upload image first if any
      let imageUrl:string|null=null
      if(imageFile) imageUrl=await uploadImage(imageFile, newProd.sku||'product')
      const res=await fetch('/api/products',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        name:newProd.name,sku:newProd.sku,sport:newProd.sport,gender:newProd.gender,
        price:parseInt(newProd.price),hpp:parseInt(newProd.hpp)||0,
        original:newProd.original?parseInt(newProd.original):null,
        emoji:newProd.emoji,desc:newProd.desc,
        sizes:sizesArr,colors:colorsArr,
        tags:tagsArr,image_url:imageUrl,
        initial_stock:initialStock
      })})
      const d=await res.json()
      if(res.ok){
        if(d.data) setProducts((p:any[])=>[...p,{...d.data,stock:{},status:'active',image_url:imageUrl}])
        setShowAdd(false)
        setNewProd({name:'',sku:'',sport:'Tennis',gender:'Men',price:'',hpp:'',original:'',emoji:'👕',sizes:'S,M,L,XL',colors:'Black,White',desc:'',extraSports:'',hasSizes:true,hasColors:true})
        setImageFile(null)
        setImagePreview(null)
        alert('Produk berhasil ditambahkan!')
      } else {
        alert('Gagal tambah produk: '+(d.error||'Unknown error'))
      }
    }catch(e:any){alert('Error: '+e.message)}
  }

  return <div style={{display:'flex',flexDirection:'column',gap:16}}>
    {editProd&&<EditProductModal product={editProd} onSave={saveProduct} onClose={()=>setEditProd(null)} uploadImageFn={uploadImage}/>}
    {showAdd&&(
      <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.35)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
        <div style={{background:C.white,borderRadius:16,width:'min(520px,95vw)',maxHeight:'90vh',overflowY:'auto',padding:'22px 24px',display:'flex',flexDirection:'column',gap:14}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h3 style={{margin:0,fontSize:16,fontWeight:700,color:C.ink}}>Tambah Produk Baru</h3><button onClick={()=>setShowAdd(false)} style={{background:'none',border:'none',cursor:'pointer',fontSize:18,color:C.ink3}}>✕</button></div>
          {[
            {label:'Nama Produk *',key:'name',placeholder:'Court Precision Polo'},
            {label:'SKU *',key:'sku',placeholder:'TEA-TEN-011'},
            {label:'Harga Jual *',key:'price',placeholder:'649000',type:'number'},
            {label:'Harga Asli / Sebelum Diskon (opsional)',key:'original',placeholder:'890000',type:'number'},
            {label:'HPP / Modal',key:'hpp',placeholder:'280000',type:'number'},

            {label:'Deskripsi',key:'desc',placeholder:'Deskripsi singkat produk...'},
            {label:'Sport Tambahan (opsional, pisahkan koma)',key:'extraSports',placeholder:'Gym, Running'},
          ].map(f=>(
            <div key={f.key} style={{display:'flex',flexDirection:'column',gap:4}}>
              <label style={{fontSize:12,fontWeight:600,color:C.ink3}}>{f.label}</label>
              <input type={f.type||'text'} value={(newProd as any)[f.key]} placeholder={f.placeholder} onChange={e=>setNewProd(p=>({...p,[f.key]:e.target.value}))} style={{padding:'9px 12px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:13,fontFamily:'inherit',outline:'none',color:C.ink}}/>
            </div>
          ))}
          {/* DISCOUNT PREVIEW */}
          {newProd.price&&newProd.original&&parseInt(newProd.original)>parseInt(newProd.price)&&(
            <div style={{background:C.g50,border:`1px solid ${C.g200}`,borderRadius:9,padding:'10px 14px',display:'flex',alignItems:'center',gap:10}}>
              <span style={{fontSize:13,fontWeight:700,color:C.g700}}>{fmt(parseInt(newProd.price))}</span>
              <span style={{fontSize:12,color:C.ink4,textDecoration:'line-through'}}>{fmt(parseInt(newProd.original))}</span>
              <span style={{fontSize:11,fontWeight:700,background:C.red,color:'#fff',padding:'2px 7px',borderRadius:5}}>
                -{Math.round((1-parseInt(newProd.price)/parseInt(newProd.original))*100)}% OFF
              </span>
            </div>
          )}

          {/* IMAGE UPLOAD */}
          <div style={{background:C.cream,borderRadius:10,padding:'12px 14px'}}>
            <label style={{fontSize:12,fontWeight:700,color:C.ink3,display:'block',marginBottom:8}}>Foto Produk</label>
            <div style={{display:'flex',gap:12,alignItems:'center'}}>
              <div style={{width:80,height:80,background:C.white,borderRadius:10,border:`2px dashed ${C.ink5}`,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',flexShrink:0}}>
                {previewImg
                  ?<img src={previewImg} alt="preview" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  :<span style={{fontSize:28}}>{newProd.emoji||'📷'}</span>
                }
              </div>
              <div style={{flex:1}}>
                <label style={{display:'block',padding:'8px 14px',background:uploadingImg?C.ink5:C.g800,color:'#fff',borderRadius:8,fontSize:12,fontWeight:700,cursor:uploadingImg?'not-allowed':'pointer',textAlign:'center',marginBottom:6}}>
                  {uploadingImg?'Mengupload...':'📷 Upload Foto'}
                  <input type="file" accept="image/*" disabled={uploadingImg} onChange={async e=>{
                    const file=e.target.files?.[0]
                    if(!file)return
                    const preview=URL.createObjectURL(file)
                    setPreviewImg(preview)
                    const url=await uploadImage(file, newProd.sku||'product')
                    if(url)setPreviewImg(url)
                  }} style={{display:'none'}}/>
                </label>
                <p style={{margin:0,fontSize:10,color:C.ink4}}>JPG, PNG, WebP. Maks 5MB.<br/>Disarankan 800×800px.</p>
              </div>
            </div>
          </div>

          {/* DISCOUNT PREVIEW */}
          {newProd.price&&newProd.original&&parseInt(newProd.original)>parseInt(newProd.price)&&(
            <div style={{background:C.g50,border:`1px solid ${C.g200}`,borderRadius:9,padding:'10px 14px',display:'flex',alignItems:'center',gap:10}}>
              <span style={{fontSize:13,fontWeight:700,color:C.g700}}>{fmt(parseInt(newProd.price))}</span>
              <span style={{fontSize:12,color:C.ink4,textDecoration:'line-through'}}>{fmt(parseInt(newProd.original))}</span>
              <span style={{fontSize:11,fontWeight:700,background:C.red,color:'#fff',padding:'2px 7px',borderRadius:5}}>
                -{Math.round((1-parseInt(newProd.price)/parseInt(newProd.original))*100)}% OFF
              </span>
            </div>
          )}

          {/* IMAGE UPLOAD */}
          <div style={{background:C.cream,borderRadius:10,padding:'12px 14px'}}>
            <label style={{fontSize:12,fontWeight:700,color:C.ink3,display:'block',marginBottom:8}}>Foto Produk</label>
            <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
              {imagePreview
                ?<div style={{position:'relative',flexShrink:0}}>
                  <img src={imagePreview} alt="preview" style={{width:80,height:80,objectFit:'cover',borderRadius:8,border:`1px solid ${C.ink5}`}}/>
                  <button onClick={()=>{setImageFile(null);setImagePreview(null)}} style={{position:'absolute',top:-6,right:-6,width:18,height:18,borderRadius:'50%',background:C.red,color:'#fff',border:'none',cursor:'pointer',fontSize:10,display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
                </div>
                :<div style={{width:80,height:80,background:C.white,border:`2px dashed ${C.ink5}`,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:24}}>📷</div>
              }
              <div style={{flex:1}}>
                <input type="file" accept="image/*" id="img-upload" style={{display:'none'}} onChange={e=>{
                  const file=e.target.files?.[0]
                  if(file){
                    setImageFile(file)
                    const reader=new FileReader()
                    reader.onload=ev=>setImagePreview(ev.target?.result as string)
                    reader.readAsDataURL(file)
                  }
                }}/>
                <label htmlFor="img-upload" style={{display:'block',padding:'8px 14px',background:C.g800,color:'#fff',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',textAlign:'center',marginBottom:6}}>Pilih Foto</label>
                <p style={{margin:0,fontSize:10,color:C.ink4}}>JPG, PNG, WEBP. Maks 5MB.</p>
              </div>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:11}}>
            <div style={{display:'flex',flexDirection:'column',gap:4}}>
              <label style={{fontSize:12,fontWeight:600,color:C.ink3}}>Sport</label>
              <select value={newProd.sport} onChange={e=>setNewProd(p=>({...p,sport:e.target.value}))} style={{padding:'9px 12px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:13,fontFamily:'inherit',outline:'none',color:C.ink}}>
                {['Tennis','Badminton','Padel','Hyrox','Gym','Running','Golf','Pilates','Yoga','Footwear','Aksesoris','Lainnya'].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:4}}>
              <label style={{fontSize:12,fontWeight:600,color:C.ink3}}>Gender</label>
              <select value={newProd.gender} onChange={e=>setNewProd(p=>({...p,gender:e.target.value}))} style={{padding:'9px 12px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:13,fontFamily:'inherit',outline:'none',color:C.ink}}>
                {['Men','Women','Unisex'].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {/* SIZES SECTION */}
          <div style={{background:C.cream,borderRadius:10,padding:'12px 14px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:newProd.hasSizes?10:0}}>
              <label style={{fontSize:12,fontWeight:700,color:C.ink3}}>Ukuran</label>
              <label style={{display:'flex',alignItems:'center',gap:7,cursor:'pointer'}}>
                <div onClick={()=>setNewProd(p=>({...p,hasSizes:!p.hasSizes}))} style={{width:36,height:20,borderRadius:10,background:newProd.hasSizes?C.g600:C.ink5,position:'relative',transition:'background 0.2s',cursor:'pointer'}}>
                  <div style={{position:'absolute',top:2,left:newProd.hasSizes?16:2,width:16,height:16,borderRadius:'50%',background:'#fff',transition:'left 0.2s'}}/>
                </div>
                <span style={{fontSize:11,color:C.ink3}}>{newProd.hasSizes?'Aktif':'Tidak ada ukuran'}</span>
              </label>
            </div>
            {newProd.hasSizes&&<>
              <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
                {['All Size','XS','S','M','L','XL','XXL','XXXL','36','37','38','39','40','41','42','43','44','45'].map(sz=>(
                  <button key={sz} type="button" onClick={()=>{
                    const curr=newProd.sizes.split(',').map((s:string)=>s.trim()).filter(Boolean)
                    const next=curr.includes(sz)?curr.filter((s:string)=>s!==sz):[...curr,sz]
                    setNewProd(p=>({...p,sizes:next.join(',')}))
                  }} style={{padding:'4px 10px',borderRadius:6,fontSize:11,fontWeight:600,cursor:'pointer',background:newProd.sizes.split(',').map((s:string)=>s.trim()).includes(sz)?C.g800:C.white,color:newProd.sizes.split(',').map((s:string)=>s.trim()).includes(sz)?'#fff':C.ink2,border:`1px solid ${newProd.sizes.split(',').map((s:string)=>s.trim()).includes(sz)?C.g800:C.ink5}`}}>{sz}</button>
                ))}
              </div>
              <input value={newProd.sizes} onChange={e=>setNewProd(p=>({...p,sizes:e.target.value}))} placeholder="Atau ketik custom: 38,39,40 / S,M,L / One Size" style={{width:'100%',padding:'8px 11px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:12,fontFamily:'inherit',outline:'none',color:C.ink,boxSizing:'border-box'}}/>
              <span style={{fontSize:10,color:C.ink4,marginTop:4,display:'block'}}>Klik quick-select di atas atau ketik manual. Pisahkan dengan koma.</span>
            </>}
          </div>

          {/* INITIAL STOCK */}
          {newProd.hasSizes&&newProd.sizes&&(
            <div style={{background:C.cream,borderRadius:10,padding:'12px 14px'}}>
              <label style={{fontSize:12,fontWeight:700,color:C.ink3,display:'block',marginBottom:8}}>Stok Awal per Ukuran</label>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(80px,1fr))',gap:8}}>
                {newProd.sizes.split(',').map((s:string)=>s.trim()).filter(Boolean).map((sz:string)=>(
                  <div key={sz} style={{textAlign:'center'}}>
                    <label style={{display:'block',fontSize:10,fontWeight:700,color:C.ink4,marginBottom:4,textTransform:'uppercase'}}>{sz}</label>
                    <input
                      type="number" min={0} defaultValue={0}
                      id={`stock-${sz}`}
                      style={{width:'100%',padding:'7px 4px',border:`1px solid ${C.ink5}`,borderRadius:7,fontSize:13,fontWeight:700,textAlign:'center',fontFamily:'inherit',outline:'none',color:C.ink,background:C.white}}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COLORS SECTION */}
          <div style={{background:C.cream,borderRadius:10,padding:'12px 14px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:newProd.hasColors?10:0}}>
              <label style={{fontSize:12,fontWeight:700,color:C.ink3}}>Warna</label>
              <label style={{display:'flex',alignItems:'center',gap:7,cursor:'pointer'}}>
                <div onClick={()=>setNewProd(p=>({...p,hasColors:!p.hasColors}))} style={{width:36,height:20,borderRadius:10,background:newProd.hasColors?C.g600:C.ink5,position:'relative',transition:'background 0.2s',cursor:'pointer'}}>
                  <div style={{position:'absolute',top:2,left:newProd.hasColors?16:2,width:16,height:16,borderRadius:'50%',background:'#fff',transition:'left 0.2s'}}/>
                </div>
                <span style={{fontSize:11,color:C.ink3}}>{newProd.hasColors?'Aktif':'Tidak ada warna'}</span>
              </label>
            </div>
            {newProd.hasColors&&<>
              <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
                {['Black','White','Forest','Navy','Charcoal','Olive','Sage','Blush','Khaki','Cream','Sand','Red','Blue','Yellow','Pink','Purple','Grey','Brown'].map(cl=>(
                  <button key={cl} type="button" onClick={()=>{
                    const curr=newProd.colors.split(',').map((s:string)=>s.trim()).filter(Boolean)
                    const next=curr.includes(cl)?curr.filter((s:string)=>s!==cl):[...curr,cl]
                    setNewProd(p=>({...p,colors:next.join(',')}))
                  }} style={{padding:'4px 10px',borderRadius:6,fontSize:11,fontWeight:600,cursor:'pointer',background:newProd.colors.split(',').map((s:string)=>s.trim()).includes(cl)?C.g800:C.white,color:newProd.colors.split(',').map((s:string)=>s.trim()).includes(cl)?'#fff':C.ink2,border:`1px solid ${newProd.colors.split(',').map((s:string)=>s.trim()).includes(cl)?C.g800:C.ink5}`}}>{cl}</button>
                ))}
              </div>
              <input value={newProd.colors} onChange={e=>setNewProd(p=>({...p,colors:e.target.value}))} placeholder="Atau ketik custom warna..." style={{width:'100%',padding:'8px 11px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:12,fontFamily:'inherit',outline:'none',color:C.ink,boxSizing:'border-box'}}/>
            </>}
          </div>
          <div style={{display:'flex',gap:9,justifyContent:'flex-end',paddingTop:6,borderTop:`1px solid ${C.ink6}`}}>
            <button onClick={()=>setShowAdd(false)} style={{padding:'9px 18px',background:'none',border:`1px solid ${C.ink5}`,borderRadius:9,fontSize:13,fontWeight:600,color:C.ink2,cursor:'pointer'}}>Batal</button>
            <button onClick={handleAddProduct} style={{padding:'9px 22px',background:C.g800,color:'#fff',border:'none',borderRadius:9,fontSize:13,fontWeight:700,cursor:'pointer'}}>+ Tambah Produk</button>
          </div>
        </div>
      </div>
    )}
    <div style={{display:'flex',gap:9,flexWrap:'wrap',alignItems:'center'}}>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari produk atau SKU…" style={{flex:1,minWidth:180,padding:'9px 13px',border:`1px solid ${C.ink5}`,borderRadius:9,fontSize:13,fontFamily:'inherit',outline:'none',background:C.white,color:C.ink}}/>
      <select value={sportF} onChange={e=>setSportF(e.target.value)} style={{padding:'9px 12px',border:`1px solid ${C.ink5}`,borderRadius:9,fontSize:13,fontFamily:'inherit',outline:'none',background:C.white,cursor:'pointer',color:C.ink2}}>{sports.map((s:any)=><option key={s} value={s}>{s==='all'?'Semua Sport':s}</option>)}</select>
      <select value={statusF} onChange={e=>setStatusF(e.target.value)} style={{padding:'9px 12px',border:`1px solid ${C.ink5}`,borderRadius:9,fontSize:13,fontFamily:'inherit',outline:'none',background:C.white,cursor:'pointer',color:C.ink2}}>{['all','active','low','critical','out'].map(s=><option key={s} value={s}>{s==='all'?'Semua Status':s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</select>
      <button onClick={()=>setShowAdd(true)} style={{background:C.g800,color:'#fff',border:'none',borderRadius:9,padding:'9px 14px',fontSize:12,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap'}}>+ Tambah Produk</button>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))',gap:9}}>{sums.map((m:any)=><div key={m.l} style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:11,padding:'11px 13px'}}><p style={{margin:'0 0 3px',fontSize:10,fontWeight:600,color:C.ink4,letterSpacing:'0.07em',textTransform:'uppercase'}}>{m.l}</p><p style={{margin:0,fontSize:20,fontWeight:800,color:m.col}}>{m.v}</p></div>)}</div>
    <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:12,overflow:'auto'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
        <thead><tr style={{background:C.cream,borderBottom:`1px solid ${C.ink6}`}}>{['Produk','SKU','Sport','Stok per Size','Total','Status','Aksi'].map(h=><th key={h} style={{padding:'10px 13px',textAlign:'left',fontSize:10,fontWeight:700,color:C.ink4,letterSpacing:'0.07em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
        <tbody>
          {filtered.map((p:any,i:number)=>{
            const tot=totStock(p)
            return <tr key={p.id} style={{borderBottom:`1px solid ${C.ink6}`,background:i%2===0?C.white:C.cream}}>
              <td style={{padding:'10px 13px'}}><div style={{display:'flex',alignItems:'center',gap:7}}><span style={{fontSize:19}}>{p.emoji}</span><div><p style={{margin:'0 0 1px',fontSize:13,fontWeight:700,color:C.ink}}>{p.name}</p><p style={{margin:0,fontSize:10,color:C.ink4}}>{p.gender}</p></div></div></td>
              <td style={{padding:'10px 13px',fontSize:11,fontWeight:700,color:C.ink2,fontFamily:'monospace'}}>{p.sku}</td>
              <td style={{padding:'10px 13px'}}><span style={{fontSize:11,fontWeight:600,background:C.g50,color:C.g700,padding:'2px 8px',borderRadius:4,border:`1px solid ${C.g100}`}}>{p.sport}</span></td>
              <td style={{padding:'10px 13px'}}>
                <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                  {Object.entries(p.stock as Record<string,number>).map(([sz,qty])=>(
                    <div key={sz} style={{textAlign:'center',minWidth:28}}>
                      <div style={{fontSize:9,color:C.ink4,fontWeight:600,marginBottom:2}}>{sz}</div>
                      <div style={{fontSize:11,fontWeight:700,padding:'2px 4px',borderRadius:4,background:qty===0?C.redBg:qty<=2?C.amberBg:C.g50,color:qty===0?C.red:qty<=2?C.amber:C.g700}}>{qty}</div>
                    </div>
                  ))}
                </div>
              </td>
              <td style={{padding:'10px 13px',fontWeight:800,fontSize:14,color:tot===0?C.red:tot<=5?C.amber:C.ink}}>{tot}</td>
              <td style={{padding:'10px 13px'}}><SBadge status={p.status}/></td>
              <td style={{padding:'10px 13px'}}><button onClick={()=>setEditProd(p)} style={{padding:'5px 12px',background:C.g800,color:'#fff',border:'none',borderRadius:7,fontSize:11,fontWeight:700,cursor:'pointer'}}>Edit Produk</button></td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  </div>
}

function AdminCustomers({customers:initC,orders}:{customers:any[],orders:any[]}) {
  const [customers,setCustomers]=useState(initC)
  useEffect(()=>{
    fetch('/api/customers').then(r=>r.json()).then(d=>{if(d.data&&d.data.length>0)setCustomers(d.data)}).catch(()=>{})
  },[])
  const [search,setSearch]=useState('')
  const [sortBy,setSortBy]=useState('totalSpent')
  const [selected,setSelected]=useState<any>(null)
  const filtered=useMemo(()=>{
    let c=[...customers]
    if(search) c=c.filter((x:any)=>x.name.toLowerCase().includes(search.toLowerCase())||x.phone.includes(search)||x.email.toLowerCase().includes(search.toLowerCase()))
    c.sort((a:any,b:any)=>sortBy==='totalSpent'?b.totalSpent-a.totalSpent:sortBy==='orders'?b.orders.length-a.orders.length:new Date(b.joinDate).getTime()-new Date(a.joinDate).getTime())
    return c
  },[customers,search,sortBy])
  const getTier=(s:number)=>s>=4000000?'Elite':s>=2000000?'Pro':s>=500000?'Member':'New'
  const TIER:Record<string,any>={Elite:{bg:'#FEF3C7',color:'#92400E'},Pro:{bg:C.g50,color:C.g700},Member:{bg:C.blueBg,color:C.blue},New:{bg:C.ink6,color:C.ink3}}
  const getOrd=(cid:string)=>orders.filter((o:any)=>o.customerId===cid)
  const ini=(name:string)=>name.split(' ').map((w:string)=>w[0]).join('').slice(0,2)
  return <div style={{display:'flex',gap:16,height:'calc(100vh - 120px)'}}>
    <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',gap:12}}>
      <div style={{display:'flex',gap:9,flexWrap:'wrap'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari nama, HP, atau email…" style={{flex:1,minWidth:180,padding:'9px 13px',border:`1px solid ${C.ink5}`,borderRadius:9,fontSize:13,fontFamily:'inherit',outline:'none',background:C.white,color:C.ink}}/>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{padding:'9px 12px',border:`1px solid ${C.ink5}`,borderRadius:9,fontSize:13,fontFamily:'inherit',outline:'none',background:C.white,cursor:'pointer',color:C.ink2}}>
          <option value="totalSpent">Total Belanja</option><option value="orders">Banyak Order</option><option value="joinDate">Member Terbaru</option>
        </select>
        <button onClick={()=>{
          exportCSV('customers_'+new Date().toISOString().slice(0,10),
            ['ID','Nama','Email','Phone','Alamat','Total Belanja','Jumlah Order','Tier','Join Date','Last Order'],
            filtered.map((c:any)=>[c.id,c.name,c.email,c.phone||'',c.address||'',c.totalSpent||c.total_spent||0,c.orders?.length||c.order_count||0,getTier(c.totalSpent||c.total_spent||0),fmtDate(c.joinDate||c.created_at||''),fmtDate(c.lastOrder||c.updated_at||'')])
          )
        }} style={{background:C.g800,color:'#fff',border:'none',borderRadius:9,padding:'9px 14px',fontSize:12,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:6}}>
          📥 Export Excel
        </button>
      </div>
      <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:12,flex:1,overflowY:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
          <thead><tr style={{background:C.cream,borderBottom:`1px solid ${C.ink6}`}}>{['Customer','Kontak','Total Belanja','Orders','Tier','Last Order'].map(h=><th key={h} style={{padding:'10px 13px',textAlign:'left',fontSize:10,fontWeight:700,color:C.ink4,letterSpacing:'0.07em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((c:any,i:number)=>{
              const tier=getTier(c.totalSpent),tc=TIER[tier]
              return <tr key={c.id} onClick={()=>setSelected(c)} style={{borderBottom:`1px solid ${C.ink6}`,background:selected?.id===c.id?C.g50:i%2===0?C.white:C.cream,cursor:'pointer'}}>
                <td style={{padding:'10px 13px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:9}}>
                    <div style={{width:30,height:30,borderRadius:'50%',background:C.g100,border:`1px solid ${C.g200}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:C.g700,flexShrink:0}}>{ini(c.name)}</div>
                    <div><p style={{margin:'0 0 1px',fontSize:12,fontWeight:700,color:C.ink}}>{c.name}</p><p style={{margin:0,fontSize:10,color:C.ink4}}>{c.id}</p></div>
                  </div>
                </td>
                <td style={{padding:'10px 13px'}}><p style={{margin:'0 0 1px',fontSize:12,color:C.ink2}}>{c.phone}</p><p style={{margin:0,fontSize:11,color:C.ink4}}>{c.email}</p></td>
                <td style={{padding:'10px 13px',fontWeight:800,color:C.g700}}>{fmt(c.totalSpent)}</td>
                <td style={{padding:'10px 13px',fontWeight:700,color:C.ink,textAlign:'center'}}>{c.orders.length}</td>
                <td style={{padding:'10px 13px'}}><span style={{fontSize:10,fontWeight:800,letterSpacing:'0.07em',textTransform:'uppercase',padding:'3px 9px',borderRadius:20,background:tc.bg,color:tc.color}}>{tier}</span></td>
                <td style={{padding:'10px 13px',fontSize:12,color:C.ink3,whiteSpace:'nowrap'}}>{fmtDate(c.lastOrder)}</td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
    {selected&&(
      <div style={{width:280,flexShrink:0,background:C.white,border:`1px solid ${C.ink6}`,borderRadius:12,padding:16,overflowY:'auto',display:'flex',flexDirection:'column',gap:13}}>
        <div style={{textAlign:'center',paddingBottom:12,borderBottom:`1px solid ${C.ink6}`}}>
          <div style={{width:46,height:46,borderRadius:'50%',background:C.g100,border:`2px solid ${C.g300}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:800,color:C.g700,margin:'0 auto 9px'}}>{ini(selected.name)}</div>
          <p style={{margin:'0 0 5px',fontSize:14,fontWeight:700,color:C.ink}}>{selected.name}</p>
          <span style={{fontSize:10,fontWeight:800,letterSpacing:'0.08em',textTransform:'uppercase',padding:'3px 11px',borderRadius:20,...TIER[getTier(selected.totalSpent)]}}>{getTier(selected.totalSpent)} Member</span>
        </div>
        <div>
          <p style={{margin:'0 0 7px',fontSize:10,fontWeight:700,color:C.ink4,letterSpacing:'0.08em',textTransform:'uppercase'}}>Kontak</p>
          {[['📱',selected.phone],['✉️',selected.email],['📍',selected.address]].map(([ic,val])=>(
            <div key={ic} style={{display:'flex',gap:7,alignItems:'flex-start',marginBottom:5}}><span style={{fontSize:12}}>{ic}</span><span style={{fontSize:12,color:C.ink2,lineHeight:1.5}}>{val}</span></div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,padding:'11px 0',borderTop:`1px solid ${C.ink6}`,borderBottom:`1px solid ${C.ink6}`}}>
          {[['Total Belanja',fmt(selected.totalSpent),C.g700],['Orders',selected.orders.length,C.ink],['Member Sejak',fmtDate(selected.joinDate),C.ink3],['Last Order',fmtDate(selected.lastOrder),C.ink3]].map(([l,v,col])=>(
            <div key={l}><p style={{margin:'0 0 2px',fontSize:10,color:C.ink4,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>{l as string}</p><p style={{margin:0,fontSize:12,fontWeight:700,color:col as string}}>{v as string}</p></div>
          ))}
        </div>
        <div>
          <p style={{margin:'0 0 8px',fontSize:10,fontWeight:700,color:C.ink4,letterSpacing:'0.08em',textTransform:'uppercase'}}>Riwayat Pembelian</p>
          {getOrd(selected.id).map((o:any)=>(
            <div key={o.id} style={{background:C.cream,borderRadius:9,padding:'9px 11px',marginBottom:7}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span style={{fontSize:11,fontWeight:700,color:C.g700}}>{o.id}</span><SBadge status={o.status}/></div>
              <p style={{margin:'0 0 3px',fontSize:10,color:C.ink4}}>{fmtDate(o.date)} · {o.payment}</p>
              {o.items.map((item:any,ii:number)=><p key={ii} style={{margin:'2px 0',fontSize:11,color:C.ink2}}>• {item.name} ({item.size}) ×{item.qty}</p>)}
              <p style={{margin:'5px 0 0',fontSize:12,fontWeight:800,color:C.ink,textAlign:'right'}}>{fmt(o.total)}</p>
            </div>
          ))}
          {getOrd(selected.id).length===0&&<p style={{fontSize:12,color:C.ink4,textAlign:'center'}}>Belum ada order</p>}
        </div>
      </div>
    )}
  </div>
}

function AdminFinancial() {
  const [unlocked,setUnlocked]=useState(false)
  const [pin,setPin]=useState('')
  const [error,setError]=useState('')
  const [shake,setShake]=useState(false)
  const [tab,setTab]=useState('pl')
  const [period,setPeriod]=useState('ytd')
  const [selMonth,setSelMonth]=useState('Mar')
  function pressPin(d:string){
    if(pin.length>=6)return
    const next=pin+d;setPin(next);setError('')
    if(next.length===6){setTimeout(()=>{if(next===SUPERIOR_PIN){setUnlocked(true)}else{setShake(true);setTimeout(()=>setShake(false),500);setError('PIN salah. Coba lagi.');setPin('')}},200)}
  }
  function getMF(month:string){
    const base:Record<string,number>={Jan:0.8,Feb:0.9,Mar:1.1,Apr:0.85,May:1.0,Jun:0.95,Jul:0.8,Aug:1.2,Sep:1.0,Oct:0.9,Nov:1.3,Dec:1.5}
    const m=base[month]||1
    const revenue=ALL_PRODUCTS.reduce((s,p)=>s+Math.floor((20+Math.random()*10)*m)*p.price,0)
    const hpp=ALL_PRODUCTS.reduce((s,p)=>s+Math.floor((20+Math.random()*10)*m)*p.hpp,0)
    const gross=revenue-hpp,opex=18000000+Math.random()*4000000,ppn=revenue*PPN,net=gross-opex-ppn
    return{revenue,hpp,gross,grossMargin:pct(gross,revenue),opex,ppn,net,netMargin:pct(net,revenue)}
  }
  const months=period==='ytd'?MONTHS:period==='monthly'?[selMonth]:MONTHS.slice(0,3)
  const data=months.map(m=>({month:m,...getMF(m)}))
  const T={revenue:data.reduce((s,d)=>s+d.revenue,0),hpp:data.reduce((s,d)=>s+d.hpp,0),gross:data.reduce((s,d)=>s+d.gross,0),opex:data.reduce((s,d)=>s+d.opex,0),ppn:data.reduce((s,d)=>s+d.ppn,0),net:data.reduce((s,d)=>s+d.net,0)}
  const KPI2=({label,value,accent,icon}:{label:string,value:string,accent?:string,icon?:string})=>(
    <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:11,padding:'14px 16px',borderLeft:`3px solid ${accent||C.ink5}`}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><p style={{margin:0,fontSize:10,fontWeight:700,color:C.ink4,letterSpacing:'0.08em',textTransform:'uppercase'}}>{label}</p>{icon&&<span style={{fontSize:14}}>{icon}</span>}</div>
      <p style={{margin:0,fontSize:21,fontWeight:800,color:C.ink,letterSpacing:'-0.03em'}}>{value}</p>
    </div>
  )
  if(!unlocked) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'65vh'}}>
    <div style={{width:'min(340px,90vw)',display:'flex',flexDirection:'column',alignItems:'center',gap:22}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:50,height:50,background:C.g600,borderRadius:13,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}><svg width="25" height="25" viewBox="0 0 20 20" fill="none"><path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" fill={C.g200}/></svg></div>
        <h2 style={{margin:'0 0 4px',fontSize:19,fontWeight:700,color:C.ink}}>Financial Reports</h2>
        <p style={{margin:0,fontSize:13,color:C.ink4}}>Superior Admin — Masukkan PIN 6 digit</p>
      </div>
      <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:16,padding:'22px 26px 24px',width:'100%'}}>
        <div style={{display:'flex',justifyContent:'center',gap:12,marginBottom:error?10:18,animation:shake?'shake 0.4s ease':'none'}}>
          {[0,1,2,3,4,5].map(i=><div key={i} style={{width:12,height:12,borderRadius:'50%',background:i<pin.length?C.g400:'rgba(0,0,0,0.08)',border:`2px solid ${i<pin.length?C.g400:C.ink5}`,transition:'all 0.15s',transform:i<pin.length?'scale(1.15)':'scale(1)'}}/>)}
        </div>
        {error&&<p style={{textAlign:'center',fontSize:12,color:C.red,marginBottom:12,fontWeight:500}}>{error}</p>}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
          {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k,i)=>(
            <button key={i} onClick={()=>k==='⌫'?setPin(p=>p.slice(0,-1)):k!==''&&pressPin(String(k))} style={{height:50,borderRadius:11,border:`1px solid ${C.ink6}`,cursor:k===''?'default':'pointer',background:k===''?'transparent':C.white,color:C.ink2,fontSize:18,fontWeight:600,fontFamily:'inherit',opacity:k===''?0:1,transition:'background 0.12s'}}
              onMouseEnter={e=>{if(k!=='')(e.currentTarget as HTMLElement).style.background=C.cream}}
              onMouseLeave={e=>{if(k!=='')(e.currentTarget as HTMLElement).style.background=C.white}}
            >{k}</button>
          ))}
        </div>
      </div>
      <p style={{fontSize:11,color:C.ink5,margin:0}}>Demo PIN: 0 8 2 5 0 5</p>
    </div>
  </div>
  return <div style={{display:'flex',flexDirection:'column',gap:18}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
      <div><div style={{display:'flex',alignItems:'center',gap:9,marginBottom:3}}><h1 style={{margin:0,fontSize:19,fontWeight:700,color:C.ink}}>Financial Reports</h1><span style={{fontSize:10,fontWeight:800,background:C.gold,color:'#fff',padding:'2px 8px',borderRadius:4,letterSpacing:'0.06em'}}>SUPERIOR</span></div><p style={{margin:0,fontSize:13,color:C.ink4}}>P&L, analisis produk, PPN, dan cash flow</p></div>
      <div style={{display:'flex',gap:7,alignItems:'center',flexWrap:'wrap'}}>
        {['ytd','monthly'].map(p=><button key={p} onClick={()=>setPeriod(p)} style={{padding:'7px 13px',borderRadius:8,fontSize:12,fontWeight:600,cursor:'pointer',background:period===p?C.g800:C.white,color:period===p?'#fff':C.ink3,border:`1px solid ${period===p?C.g800:C.ink5}`,transition:'all 0.15s'}}>{{ytd:'Year-to-Date',monthly:'Bulanan'}[p]}</button>)}
        {period==='monthly'&&<select value={selMonth} onChange={e=>setSelMonth(e.target.value)} style={{padding:'7px 11px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:12,fontFamily:'inherit',outline:'none',background:C.white,cursor:'pointer',color:C.ink2}}>{MONTHS.map(m=><option key={m} value={m}>{MONTH_ID[m]} 2025</option>)}</select>}
        <button onClick={()=>{
          if(tab==='pl'){
            exportCSV('financial_pl_'+new Date().toISOString().slice(0,10),
              ['Item','Jumlah','Persen Revenue'],
              [['Revenue Bersih',T.revenue,'100%'],['HPP / COGS',T.hpp,pct(T.hpp,T.revenue).toFixed(1)+'%'],['Gross Profit',T.gross,pct(T.gross,T.revenue).toFixed(1)+'%'],['OPEX',T.opex,pct(T.opex,T.revenue).toFixed(1)+'%'],['PPN 11%',T.ppn,'11.0%'],['Net Profit',T.net,pct(T.net,T.revenue).toFixed(1)+'%']]
            )
          } else if(tab==='products'){
            exportCSV('financial_products_'+new Date().toISOString().slice(0,10),
              ['Produk','Harga','HPP','Gross Margin %','PPN/Unit','Net/Unit'],
              ALL_PRODUCTS.map(p=>{const gm=p.price-p.hpp;return[p.name,p.price,p.hpp,pct(gm,p.price).toFixed(1)+'%',Math.round(p.price*PPN),Math.round(gm-p.price*PPN)]})
            )
          } else {
            exportCSV('financial_monthly_'+new Date().toISOString().slice(0,10),
              ['Bulan','Revenue','HPP','Gross Profit','GP%','OPEX','PPN','Net Profit','Net%'],
              MONTHS.map(m=>{const d=getMF(m);return[MONTH_ID[m],d.revenue,d.hpp,d.gross,d.grossMargin.toFixed(1)+'%',d.opex,d.ppn,d.net,d.netMargin.toFixed(1)+'%']})
            )
          }
        }} style={{background:C.g800,color:'#fff',border:'none',borderRadius:8,padding:'7px 13px',fontSize:11,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>📥 Export Excel</button>
        <button onClick={()=>setUnlocked(false)} style={{background:'none',border:`1px solid ${C.ink5}`,borderRadius:8,padding:'7px 13px',fontSize:11,fontWeight:600,color:C.ink4,cursor:'pointer'}}>🔒 Lock</button>
      </div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:9}}>
      <KPI2 label="Revenue" value={fmtM(T.revenue)} accent={C.g600} icon="📈"/>
      <KPI2 label="Gross Profit" value={fmtM(T.gross)} accent={C.g500}/>
      <KPI2 label="Net Profit" value={fmtM(T.net)} accent={T.net>0?C.g400:C.red}/>
      <KPI2 label="HPP / COGS" value={fmtM(T.hpp)} icon="🏭"/>
      <KPI2 label="PPN Terutang" value={fmtM(T.ppn)} accent={C.amber} icon="🏛️"/>
      <KPI2 label="OPEX Est." value={fmtM(T.opex)} icon="💼"/>
    </div>
    <div style={{display:'flex',gap:2,background:C.white,border:`1px solid ${C.ink6}`,borderRadius:11,padding:3,width:'fit-content'}}>
      {[['pl','📊 P&L'],['products','📦 Per Produk'],['monthly','📅 Bulanan']].map(([id,label])=>(
        <button key={id} onClick={()=>setTab(id)} style={{padding:'7px 14px',borderRadius:8,border:'none',cursor:'pointer',background:tab===id?C.g800:'transparent',color:tab===id?'#fff':C.ink3,fontSize:12,fontWeight:tab===id?700:500,transition:'all 0.15s'}}>{label}</button>
      ))}
    </div>
    {tab==='pl'&&<div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:12,overflow:'auto'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
        <thead><tr style={{background:C.cream,borderBottom:`1px solid ${C.ink6}`}}>{['Item','Jumlah','% Revenue'].map(h=><th key={h} style={{padding:'10px 15px',textAlign:'left',fontSize:10,fontWeight:700,color:C.ink4,letterSpacing:'0.07em',textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
        <tbody>
          {[['Revenue Bersih',T.revenue,'100%',C.ink,false],['(-) HPP / COGS',T.hpp,pct(T.hpp,T.revenue).toFixed(1)+'%',C.red,false],['= Gross Profit',T.gross,pct(T.gross,T.revenue).toFixed(1)+'%',C.g700,true],['(-) OPEX',T.opex,pct(T.opex,T.revenue).toFixed(1)+'%',C.amber,false],['(-) PPN 11%',T.ppn,'11.0%',C.amber,false],['= Net Profit',T.net,pct(T.net,T.revenue).toFixed(1)+'%',T.net>0?C.g700:C.red,true]].map(([label,val,pctVal,color,bold]:any,i:number)=>(
            <tr key={i} style={{borderBottom:`1px solid ${C.ink6}`,background:bold?C.g50:i%2===0?C.white:C.cream}}>
              <td style={{padding:'10px 15px',fontWeight:bold?700:500,color:C.ink}}>{label}</td>
              <td style={{padding:'10px 15px',fontWeight:bold?800:600,color,textAlign:'right'}}>{label.includes('(')?`(${fmt(val)})`:fmt(val)}</td>
              <td style={{padding:'10px 15px',fontSize:12,color:C.ink4,textAlign:'right'}}>{pctVal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>}
    {tab==='products'&&<div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:12,overflow:'auto'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
        <thead><tr style={{background:C.cream,borderBottom:`1px solid ${C.ink6}`}}>{['Produk','Harga','HPP','Gross Margin','PPN/Unit','Net/Unit'].map(h=><th key={h} style={{padding:'10px 13px',textAlign:'left',fontSize:10,fontWeight:700,color:C.ink4,letterSpacing:'0.07em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
        <tbody>
          {ALL_PRODUCTS.map((p,i)=>{
            const gm=p.price-p.hpp,gmPct=pct(gm,p.price),ppnPer=p.price*PPN,netPer=gm-ppnPer
            return <tr key={p.id} style={{borderBottom:`1px solid ${C.ink6}`,background:i%2===0?C.white:C.cream}}>
              <td style={{padding:'10px 13px'}}><div style={{display:'flex',alignItems:'center',gap:7}}><span style={{fontSize:17}}>{p.emoji}</span><span style={{fontWeight:700,color:C.ink}}>{p.name}</span></div></td>
              <td style={{padding:'10px 13px',fontWeight:600,color:C.ink}}>{fmt(p.price)}</td>
              <td style={{padding:'10px 13px',color:C.red}}>({fmt(p.hpp)})</td>
              <td style={{padding:'10px 13px'}}><span style={{fontWeight:700,fontSize:12,color:gmPct>55?C.g500:gmPct>40?C.gold:C.red,background:gmPct>55?C.g50:gmPct>40?C.goldBg:C.redBg,padding:'2px 7px',borderRadius:4}}>{gmPct.toFixed(1)}%</span></td>
              <td style={{padding:'10px 13px',color:C.amber}}>({fmt(ppnPer)})</td>
              <td style={{padding:'10px 13px',fontWeight:700,color:netPer>0?C.g700:C.red}}>{fmt(netPer)}</td>
            </tr>
          })}
        </tbody>
      </table>
    </div>}
    {tab==='monthly'&&<div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:12,overflow:'auto'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
        <thead><tr style={{background:C.cream,borderBottom:`1px solid ${C.ink6}`}}>{['Bulan','Revenue','HPP','Gross','GP%','OPEX','PPN','Net','Net%'].map(h=><th key={h} style={{padding:'9px 12px',textAlign:'left',fontSize:10,fontWeight:700,color:C.ink4,letterSpacing:'0.07em',textTransform:'uppercase',whiteSpace:'nowrap'}}>{h}</th>)}</tr></thead>
        <tbody>
          {MONTHS.map((m,i)=>{const d=getMF(m);return(
            <tr key={m} style={{borderBottom:`1px solid ${C.ink6}`,background:i%2===0?C.white:C.cream}}>
              <td style={{padding:'9px 12px',fontWeight:600,color:C.ink}}>{MONTH_ID[m]}</td>
              <td style={{padding:'9px 12px',fontWeight:600,color:C.g600}}>{fmtM(d.revenue)}</td>
              <td style={{padding:'9px 12px',color:C.red}}>({fmtM(d.hpp)})</td>
              <td style={{padding:'9px 12px',color:C.g700,fontWeight:600}}>{fmtM(d.gross)}</td>
              <td style={{padding:'9px 12px'}}><span style={{fontSize:11,fontWeight:700,color:d.grossMargin>55?C.g500:d.grossMargin>40?C.gold:C.red}}>{d.grossMargin.toFixed(1)}%</span></td>
              <td style={{padding:'9px 12px',color:C.amber}}>({fmtM(d.opex)})</td>
              <td style={{padding:'9px 12px',color:C.ink4}}>({fmtM(d.ppn)})</td>
              <td style={{padding:'9px 12px',fontWeight:700,color:d.net>0?C.g700:C.red}}>{fmtM(d.net)}</td>
              <td style={{padding:'9px 12px'}}><span style={{fontSize:11,fontWeight:700,color:d.netMargin>15?C.g500:d.netMargin>5?C.amber:C.red}}>{d.netMargin.toFixed(1)}%</span></td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>}
  </div>
}

function AdminIntegrations() {
  const [saved,setSaved]=useState<Record<string,any>>({})
  const [active,setActive]=useState<any>(null)
  const [creds,setCreds]=useState<Record<string,string>>({})
  const [modalTab,setModalTab]=useState('setup')
  const [showSecrets,setShowSecrets]=useState<Record<string,boolean>>({})
  const [testing,setTesting]=useState(false)
  const [connStatus,setConnStatus]=useState('disconnected')
  const [search,setSearch]=useState('')
  const connected=INTEGRATIONS_DATA.filter(ig=>saved[ig.id]?.status==='connected').length
  const filtered=INTEGRATIONS_DATA.filter(ig=>ig.name.toLowerCase().includes(search.toLowerCase())||ig.category.toLowerCase().includes(search.toLowerCase()))
  const cats=[...new Set(INTEGRATIONS_DATA.map(ig=>ig.category))]
  function openModal(ig:any){setActive(ig);setCreds(saved[ig.id]||{});setConnStatus(saved[ig.id]?.status||'disconnected');setModalTab('setup');setShowSecrets({})}
  function handleSave(){setSaved((s:any)=>({...s,[active.id]:{...creds,status:connStatus}}));alert('Credentials disimpan!')}
  function handleTest(){setTesting(true);setConnStatus('testing');setTimeout(()=>{const ok=active.creds.some((c:any)=>creds[c.key]&&creds[c.key].length>5);const s=ok?'connected':'error';setConnStatus(s);setSaved((prev:any)=>({...prev,[active.id]:{...creds,status:s}}));setTesting(false)},1600)}
  const StatusPill=({st}:{st:string})=>{
    const m:Record<string,any>={connected:{bg:C.g50,color:C.g700,label:'Connected'},disconnected:{bg:C.ink6,color:C.ink4,label:'Not Connected'},error:{bg:C.redBg,color:C.red,label:'Error'},testing:{bg:C.amberBg,color:C.amber,label:'Testing...'}}
    const s=m[st]||m.disconnected
    return <span style={{display:'inline-flex',alignItems:'center',gap:5,background:s.bg,padding:'3px 9px',borderRadius:20,fontSize:10,fontWeight:700,color:s.color}}><span style={{width:5,height:5,borderRadius:'50%',background:s.color,display:'inline-block'}}/>{s.label}</span>
  }
  return <div style={{display:'flex',flexDirection:'column',gap:18}}>
    {active&&(
      <div style={{position:'fixed',inset:0,zIndex:900,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',padding:12}}>
        <div style={{background:C.white,borderRadius:18,width:'min(800px,97vw)',maxHeight:'90vh',display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <div style={{padding:'16px 20px 12px',borderBottom:`1px solid ${C.ink6}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{display:'flex',gap:11,alignItems:'center'}}>
              <div style={{width:42,height:42,background:active.colorBg,borderRadius:11,display:'flex',alignItems:'center',justifyContent:'center',fontSize:21}}>{active.logo}</div>
              <div><div style={{display:'flex',alignItems:'center',gap:8}}><h2 style={{margin:0,fontSize:16,fontWeight:700,color:C.ink}}>{active.name}</h2><StatusPill st={connStatus}/></div><p style={{margin:'2px 0 0',fontSize:11,color:C.ink4}}>{active.tagline}</p></div>
            </div>
            <button onClick={()=>setActive(null)} style={{background:'none',border:`1px solid ${C.ink6}`,borderRadius:8,padding:'5px 11px',cursor:'pointer',fontSize:14,color:C.ink3}}>✕</button>
          </div>
          <div style={{display:'flex',borderBottom:`1px solid ${C.ink6}`,padding:'0 20px'}}>
            {['setup','credentials','env'].map(t=><button key={t} onClick={()=>setModalTab(t)} style={{background:'none',border:'none',cursor:'pointer',padding:'9px 13px',fontSize:12,fontWeight:modalTab===t?700:500,color:modalTab===t?active.color:C.ink3,borderBottom:`2px solid ${modalTab===t?active.color:'transparent'}`,marginBottom:-1,transition:'all 0.15s',textTransform:'capitalize'}}>{t==='env'?'.env.local':t}</button>)}
          </div>
          <div style={{flex:1,overflowY:'auto',padding:'18px 20px'}}>
            {modalTab==='setup'&&<div style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{background:active.colorBg,borderRadius:11,padding:'12px 15px',border:`1px solid ${active.color}22`}}>
                <p style={{margin:'0 0 5px',fontSize:12,fontWeight:700,color:active.color}}>{active.name}</p>
                <p style={{margin:'0 0 8px',fontSize:12,color:C.ink2,lineHeight:1.7}}>{active.tagline}</p>
                <div style={{display:'flex',gap:7,flexWrap:'wrap'}}><span style={{fontSize:11,color:C.ink4}}>💰 {active.fee}</span><span style={{color:C.ink5}}>·</span><a href={active.docs} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:active.color,fontWeight:600,textDecoration:'none'}}>📄 Docs →</a><span style={{color:C.ink5}}>·</span><a href={active.signup} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:active.color,fontWeight:600,textDecoration:'none'}}>🔗 Daftar →</a></div>
              </div>
              <div>
                <p style={{margin:'0 0 10px',fontSize:11,fontWeight:700,color:C.ink4,letterSpacing:'0.08em',textTransform:'uppercase'}}>Langkah Integrasi</p>
                {active.steps.map((s:string,i:number)=>(
                  <div key={i} style={{display:'flex',gap:11,marginBottom:11}}>
                    <div style={{width:24,height:24,borderRadius:'50%',background:active.color,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,flexShrink:0}}>{i+1}</div>
                    <p style={{margin:'2px 0 0',fontSize:12,color:C.ink2,lineHeight:1.65}}>{s}</p>
                  </div>
                ))}
              </div>
              <div><p style={{margin:'0 0 8px',fontSize:11,fontWeight:700,color:C.ink4,letterSpacing:'0.08em',textTransform:'uppercase'}}>Channels</p><div style={{display:'flex',flexWrap:'wrap',gap:6}}>{active.channels.map((c:string)=><span key={c} style={{fontSize:11,fontWeight:600,background:active.colorBg,color:active.color,padding:'3px 8px',borderRadius:5,border:`1px solid ${active.color}22`}}>{c}</span>)}</div></div>
            </div>}
            {modalTab==='credentials'&&<div style={{display:'flex',flexDirection:'column',gap:14}}>
              <div style={{background:C.amberBg,border:'1px solid #FDE68A',borderRadius:9,padding:'10px 13px',display:'flex',gap:9}}><span>⚠️</span><p style={{margin:0,fontSize:12,color:C.amber,lineHeight:1.6}}>Simpan di <code style={{background:'rgba(255,255,255,0.6)',padding:'1px 4px',borderRadius:3}}>.env.local</code> — jangan commit ke Git!</p></div>
              {active.creds.map((cred:any)=>(
                <div key={cred.key}>
                  <label style={{display:'block',fontSize:12,fontWeight:700,color:C.ink3,marginBottom:5}}>{cred.label}</label>
                  {cred.type==='select'
                    ?<select value={creds[cred.key]||''} onChange={e=>setCreds(c=>({...c,[cred.key]:e.target.value}))} style={{width:'100%',padding:'9px 12px',border:`1px solid ${C.ink5}`,borderRadius:9,fontSize:13,fontFamily:'inherit',outline:'none',background:C.white,cursor:'pointer'}}><option value="">Pilih…</option>{cred.options?.map((o:string)=><option key={o} value={o}>{o}</option>)}</select>
                    :<div style={{position:'relative'}}><input type={cred.type==='password'&&!showSecrets[cred.key]?'password':'text'} value={creds[cred.key]||''} placeholder={cred.placeholder} onChange={e=>setCreds(c=>({...c,[cred.key]:e.target.value}))} style={{width:'100%',padding:'9px 40px 9px 12px',border:`1px solid ${C.ink5}`,borderRadius:9,fontSize:12,fontFamily:'monospace',outline:'none',background:C.white,boxSizing:'border-box'}}/>{cred.type==='password'&&<button onClick={()=>setShowSecrets(s=>({...s,[cred.key]:!s[cred.key]}))} style={{position:'absolute',right:9,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:C.ink4,fontSize:13}}>{showSecrets[cred.key]?'🙈':'👁️'}</button>}</div>
                  }
                  <p style={{margin:'4px 0 0',fontSize:11,color:C.ink4}}>💡 {cred.hint}</p>
                </div>
              ))}
              <div style={{display:'flex',gap:9,paddingTop:6,borderTop:`1px solid ${C.ink6}`}}>
                <button onClick={handleSave} style={{flex:1,background:C.g800,color:'#fff',border:'none',borderRadius:9,padding:'10px',fontSize:13,fontWeight:700,cursor:'pointer'}}>💾 Save</button>
                <button onClick={handleTest} disabled={testing} style={{padding:'10px 18px',background:C.white,color:C.ink2,border:`1px solid ${C.ink5}`,borderRadius:9,fontSize:13,fontWeight:600,cursor:'pointer'}}>{testing?'Testing…':'🔌 Test'}</button>
              </div>
              {connStatus==='connected'&&<div style={{background:C.g50,border:`1px solid ${C.g200}`,borderRadius:9,padding:'9px 13px',display:'flex',gap:7}}><span>✅</span><p style={{margin:0,fontSize:12,color:C.g700,fontWeight:500}}>Koneksi berhasil!</p></div>}
              {connStatus==='error'&&<div style={{background:C.redBg,border:`1px solid ${C.redLight}`,borderRadius:9,padding:'9px 13px',display:'flex',gap:7}}><span>❌</span><p style={{margin:0,fontSize:12,color:C.red,fontWeight:500}}>Koneksi gagal — cek API key kamu.</p></div>}
            </div>}
            {modalTab==='env'&&<div>
              <div style={{background:C.cream,border:`1px solid ${C.ink6}`,borderRadius:9,padding:'10px 13px',marginBottom:11}}><p style={{margin:'0 0 3px',fontSize:12,fontWeight:700,color:C.ink2}}>Tambahkan ke <code>.env.local</code></p><p style={{margin:0,fontSize:12,color:C.ink3,lineHeight:1.7}}>Buat file di root project dan isi dengan credentials asli.</p></div>
              <pre style={{background:'#0D1710',borderRadius:11,padding:'14px 16px',margin:0,fontSize:12,lineHeight:2,color:'#A3E4B5',fontFamily:"'Consolas','Courier New',monospace",overflowX:'auto'}}>
                {active.env.map((v:string,i:number)=>(
                  <div key={i}><span style={{color:'#86BC91'}}>{v.split('=')[0]}</span><span style={{color:'rgba(255,255,255,0.25)'}}>=</span><span style={{color:'#D4AF72'}}>{v.split('=').slice(1).join('=')}</span></div>
                ))}
              </pre>
            </div>}
          </div>
        </div>
      </div>
    )}
    <div><h1 style={{margin:'0 0 3px',fontSize:19,fontWeight:700,color:C.ink}}>Integration Hub</h1><p style={{margin:0,fontSize:13,color:C.ink4}}>Kelola semua koneksi third-party — payment, shipping, ads, dan notifikasi.</p></div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:9}}>
      {[{l:'Total',v:INTEGRATIONS_DATA.length,col:C.ink,ic:'🔌'},{l:'Connected',v:connected,col:C.g600,ic:'✅'},{l:'Remaining',v:INTEGRATIONS_DATA.length-connected,col:connected===INTEGRATIONS_DATA.length?C.ink4:C.amber,ic:'⏳'},{l:'Est. Setup',v:'~3 jam',col:C.blue,ic:'⏱️'}].map(k=>(
        <div key={k.l} style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:11,padding:'12px 14px',display:'flex',alignItems:'center',gap:9}}><span style={{fontSize:18}}>{k.ic}</span><div><p style={{margin:'0 0 1px',fontSize:10,fontWeight:600,color:C.ink4,letterSpacing:'0.07em',textTransform:'uppercase'}}>{k.l}</p><p style={{margin:0,fontSize:18,fontWeight:800,color:k.col}}>{k.v}</p></div></div>
      ))}
    </div>
    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari integrasi…" style={{width:'min(270px,100%)',padding:'9px 13px',border:`1px solid ${C.ink5}`,borderRadius:9,fontSize:13,fontFamily:'inherit',outline:'none',background:C.white,display:'block'}}/>
    {cats.map(cat=>{
      const items=filtered.filter(ig=>ig.category===cat)
      if(!items.length)return null
      return <div key={cat}>
        <p style={{margin:'0 0 10px',fontSize:11,fontWeight:700,color:C.ink4,letterSpacing:'0.1em',textTransform:'uppercase',display:'flex',alignItems:'center',gap:7}}><span style={{display:'inline-block',width:16,height:1.5,background:C.ink5}}/>{cat}</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:11}}>
          {items.map(ig=>{
            const st=saved[ig.id]?.status||'disconnected'
            const isNew=ig.id==='tiktok'||ig.id==='whatsapp'
            return <div key={ig.id} onClick={()=>openModal(ig)} style={{background:C.white,border:`1.5px solid ${st==='connected'?ig.color+'55':C.ink6}`,borderRadius:15,padding:'15px 16px',cursor:'pointer',transition:'all 0.2s',position:'relative'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-2px)';(e.currentTarget as HTMLElement).style.boxShadow=`0 7px 22px ${ig.color}15`}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='none';(e.currentTarget as HTMLElement).style.boxShadow='none'}}>
              {isNew&&<div style={{position:'absolute',top:11,right:11,background:C.g700,color:'#fff',fontSize:9,fontWeight:800,padding:'2px 7px',borderRadius:4,letterSpacing:'0.08em'}}>NEW</div>}
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:9}}>
                <div style={{width:38,height:38,background:ig.colorBg,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:19,flexShrink:0}}>{ig.logo}</div>
                <div><p style={{margin:'0 0 2px',fontSize:13,fontWeight:700,color:C.ink}}>{ig.name}</p><StatusPill st={st}/></div>
              </div>
              <p style={{margin:'0 0 9px',fontSize:12,color:C.ink3,lineHeight:1.5}}>{ig.tagline}</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:5,marginBottom:9}}>{ig.channels.slice(0,3).map((c:string)=><span key={c} style={{fontSize:10,background:ig.colorBg,color:ig.color,padding:'2px 6px',borderRadius:4,fontWeight:600}}>{c}</span>)}{ig.channels.length>3&&<span style={{fontSize:10,color:C.ink4,padding:'2px 5px'}}>+{ig.channels.length-3}</span>}</div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:9,borderTop:`1px solid ${C.ink6}`}}><span style={{fontSize:11,color:C.ink4}}>💰 {ig.fee}</span><span style={{fontSize:12,fontWeight:700,color:ig.color}}>{st==='connected'?'Kelola →':'Setup →'}</span></div>
            </div>
          })}
        </div>
      </div>
    })}
  </div>
}

// ═══════════════════════════════════════════════════════════
// ROOT APP — ROUTER
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [route,      setRoute]      = useState('home')
  const [routeData,  setRouteData]  = useState<any>(null)
  const [adminPage,  setAdminPage]  = useState('overview')
  const [collapsed,  setCollapsed]  = useState(false)
  const [globalCart, setGlobalCart] = useState<any[]>([])
  const [cartCount,  setCartCount]  = useState(0)

  function nav(page: string, data?: any) {
    setRoute(page); setRouteData(data||null); window.scrollTo(0,0)
  }
  // Secret admin URL check on load + keyboard shortcut
  useEffect(()=>{
    if(typeof window !== 'undefined'){
      const path = window.location.hash || window.location.search
      if(path.includes('admin-tea-2025') || window.location.pathname.includes('admin-tea-2025')){
        setRoute('admin')
      }
    }
    // Ctrl+Shift+A = open admin
    const handler=(e:KeyboardEvent)=>{
      if(e.ctrlKey&&e.shiftKey&&e.key==='A'){
        setRoute('admin'); window.scrollTo(0,0)
      }
    }
    window.addEventListener('keydown',handler)
    return()=>window.removeEventListener('keydown',handler)
  },[])
  function addToCart(item: any) {
    setGlobalCart(c=>[...c,{...item,cartId:'c'+Date.now()}]); setCartCount(n=>n+1)
  }

  return <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Serif+Display:ital@0;1&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'DM Sans',system-ui,sans-serif}
      select{appearance:none}
      input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
      ::placeholder{color:#A8A89E}
      @keyframes spin{to{transform:rotate(360deg)}}
      @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}
      @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
      ::-webkit-scrollbar{width:5px;height:5px}
      ::-webkit-scrollbar-thumb{background:#D4D4CC;border-radius:3px}
      ::-webkit-scrollbar-track{background:transparent}
      @media(max-width:768px){
        .desktop-only{display:none!important}
        .mobile-only{display:flex!important}
        .hero-grid{grid-template-columns:1fr!important;padding:28px 5vw 40px!important}
        .hero-right{display:none!important}
        .hero-bg{display:none!important}
        .detail-grid{grid-template-columns:1fr!important;gap:24px!important}
        .catalog-layout{flex-direction:column!important}
        .catalog-sidebar{width:100%!important;display:none}
        .catalog-sidebar.open{display:block!important}
        .checkout-layout{flex-direction:column!important}
        .checkout-summary{width:100%!important;position:static!important}
        .stats-row{gap:0!important}
        .stats-row>div{padding:0 10px!important}
      }
    `}</style>

    {route==='home'    && <LandingPage  nav={nav} addToCart={addToCart} cartCount={cartCount}/>}
    {route==='catalog' && <CatalogPage  nav={nav} addToCart={addToCart} cartCount={cartCount}/>}
    {route==='detail'  && routeData && <DetailPage product={routeData} nav={nav} addToCart={addToCart} cartCount={cartCount}/>}
    {route==='checkout'&& <CheckoutPage nav={nav} cart={globalCart} addToCart={addToCart}/>}

    {route==='admin' && (
      <AdminLayout page={adminPage} setPage={setAdminPage} nav={nav} collapsed={collapsed} setCollapsed={setCollapsed}>
        {adminPage==='overview'     && <AdminOverview     products={ALL_PRODUCTS} orders={INIT_ORDERS} customers={INIT_CUSTOMERS}/>}
        {adminPage==='orders'       && <AdminOrders       orders={INIT_ORDERS}/>}
        {adminPage==='inventory'    && <AdminInventory    products={ALL_PRODUCTS}/>}
        {adminPage==='customers'    && <AdminCustomers    customers={INIT_CUSTOMERS} orders={INIT_ORDERS}/>}
        {adminPage==='financial'    && <AdminFinancial/>}
        {adminPage==='integrations' && <AdminIntegrations/>}
      </AdminLayout>
    )}
  </>
}