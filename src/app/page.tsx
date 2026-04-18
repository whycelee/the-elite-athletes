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
// SHIPPING_OPTIONS replaced by RajaOngkir API
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
        ?<img src={p.image_url} alt={p.name} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',transition:'opacity 0.3s'}} loading="lazy"/>
        :<span style={{fontSize:72,position:'relative',zIndex:1}}>{p.emoji}</span>
      }
      <div style={{position:'absolute',top:12,left:12}}><PBadge label={p.badge}/></div>
      {disc&&<div style={{position:'absolute',top:12,right:12,background:C.white,color:'#C0392B',fontSize:10,fontWeight:800,padding:'4px 8px',borderRadius:5,border:'1px solid #F5C6C2'}}>−{disc}%</div>}
    </div>
    <div style={{padding:'14px 16px 16px',display:'flex',flexDirection:'column',gap:6,flex:1}}>
      <span style={{fontSize:10,fontWeight:700,color:C.g500,letterSpacing:'0.1em',textTransform:'uppercase'}}>{p.sport}</span>
      <p style={{margin:0,fontSize:14,fontWeight:700,color:C.ink,lineHeight:1.25}} onClick={onView}>{p.name}</p>
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
      <span style={{fontSize:10,color:C.g100,fontWeight:500}} dangerouslySetInnerHTML={{__html:SITE_CONTENT.announcement}}/>
    </div>
    <div style={{maxWidth:1280,margin:'0 auto',height:56,padding:'0 5vw',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      {/* LOGO */}
      <button onClick={()=>nav('home')} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:8,padding:0}}>
        <img src="/logo.png" alt="The Elite Athletes" style={{width:36,height:36,objectFit:'contain'}}/>
        <div style={{lineHeight:1}}><div style={{fontSize:12,fontWeight:700,color:C.g800,letterSpacing:'0.12em',textTransform:'uppercase'}}>The Elite</div><div style={{fontSize:9,fontWeight:500,color:C.g500,letterSpacing:'0.22em',textTransform:'uppercase'}}>Athletes</div></div>
      </button>
      {/* DESKTOP MENU */}
      <div className="desktop-only" style={{display:'flex',gap:28}}>
        {[['Home','home'],['Catalog','catalog'],['Our Athletes','athletes'],['About','about']].map(([l,p])=><button key={l} onClick={()=>nav(p)} style={{background:'none',border:'none',cursor:'pointer',fontSize:13,fontWeight:500,color:C.ink2,padding:0}}>{l}</button>)}
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
      {[['🏠','Home','home'],['🛍️','Catalog','catalog'],['🏅','Our Athletes','athletes'],['ℹ️','About','about']].map(([ic,label,page])=>(
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
                <div style={{width:52,height:52,background:C.cream,borderRadius:8,overflow:'hidden',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {item.image_url?<img src={item.image_url} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:26}}>{item.emoji}</span>}
                </div>
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
const HERO_SLIDES = [
  {id:1,bg:'#1F3B24',label:'New Season 2025',title:'Gear Built for',titleItalic:'Elite Athletes',subtitle:'Premium sport wear untuk Tennis, Badminton, Padel, Hyrox, Running, Golf, dan lebih.',cta:'Shop Collection',emoji:'👟',image:null as string|null},
  {id:2,bg:'#1A2E1E',label:'New Arrival',title:'Court Precision',titleItalic:'Polo Series',subtitle:'Engineered for match-day performance. Moisture-wicking, UV Protection.',cta:'Lihat Koleksi',emoji:'🎾',image:null as string|null},
  {id:3,bg:'#2D4A35',label:'Best Seller',title:'Run Further,',titleItalic:'Run Faster',subtitle:'AeroStride collection — 4-way stretch, reflective details.',cta:'Shop Running',emoji:'🏃',image:null as string|null},
  {id:4,bg:'#1F3B24',label:'New Sport',title:'Badminton',titleItalic:'Performance Wear',subtitle:'Lightweight, breathable, built for the court.',cta:'Explore Now',emoji:'🏸',image:null as string|null},
  {id:5,bg:'#243D2A',label:'Limited Edition',title:'Hyrox Ready',titleItalic:'Collection',subtitle:'Built for the toughest workouts. Anti-odor, seamless construction.',cta:'Shop Hyrox',emoji:'🏋️',image:null as string|null},
]

function HeroCarousel({nav,heroSlide,setHeroSlide,handleAdd}:{nav:(p:string,d?:any)=>void,heroSlide:number,setHeroSlide:(n:any)=>void,handleAdd:(p:any)=>void}){
  return(
    <section style={{paddingTop:56+28,background:C.cream,position:'relative',overflow:'hidden'}}>
      <div style={{position:'relative',height:'min(85vh,600px)',overflow:'hidden'}}>
        {HERO_SLIDES.map((slide,idx)=>(
          <div key={slide.id} style={{position:'absolute',inset:0,transition:'opacity 0.6s ease',opacity:heroSlide===idx?1:0,pointerEvents:heroSlide===idx?'auto':'none'}}>
            <div style={{position:'absolute',top:0,right:0,width:'44%',height:'100%',background:slide.bg,clipPath:'polygon(12% 0, 100% 0, 100% 100%, 0 100%)'}}/>
            <div style={{maxWidth:1280,margin:'0 auto',padding:'clamp(28px,5vw,60px) 5vw',width:'100%',height:'100%',display:'grid',gridTemplateColumns:'1fr 1fr',gap:0,alignItems:'center',position:'relative',zIndex:1,boxSizing:'border-box'}}>
              <div style={{paddingRight:'8%'}}>
                <p style={{margin:'0 0 14px',fontSize:11,fontWeight:600,color:C.g500,letterSpacing:'0.18em',textTransform:'uppercase',display:'flex',alignItems:'center',gap:8}}><span style={{display:'inline-block',width:22,height:1.5,background:C.g500}}/>{slide.label}</p>
                <h1 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:'clamp(1.8rem,5vw,3.8rem)',fontWeight:400,lineHeight:1.08,margin:'0 0 16px',letterSpacing:'-0.02em',color:C.ink}}>{slide.title}<br/><em style={{color:C.g700,fontStyle:'italic'}}>{slide.titleItalic}</em></h1>
                <p style={{fontSize:14,color:C.ink3,lineHeight:1.8,margin:'0 0 28px',maxWidth:400}}>{slide.subtitle}</p>
                <button onClick={()=>nav('catalog')} style={{background:C.g800,color:C.cream,border:'none',borderRadius:10,padding:'13px 26px',fontSize:14,fontWeight:600,cursor:'pointer'}}>{slide.cta}</button>
              </div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',paddingLeft:'6%'}}>
                {slide.image
                  ?<img src={slide.image} alt={slide.title} style={{width:'min(340px,55vw)',height:'min(380px,55vw)',objectFit:'cover',borderRadius:24}}/>
                  :<div style={{width:'min(300px,55vw)',height:'min(340px,55vw)',background:'rgba(255,255,255,0.06)',borderRadius:24,border:'1px solid rgba(255,255,255,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'clamp(60px,12vw,100px)'}}>{slide.emoji}</div>
                }
              </div>
            </div>
          </div>
        ))}
        <div style={{position:'absolute',bottom:20,left:'50%',transform:'translateX(-50%)',display:'flex',gap:8,zIndex:10}}>
          {HERO_SLIDES.map((_,i)=>(
            <button key={i} onClick={()=>setHeroSlide(i)} style={{width:i===heroSlide?24:8,height:8,borderRadius:4,background:i===heroSlide?C.g400:'rgba(255,255,255,0.4)',border:'none',cursor:'pointer',transition:'all 0.3s',padding:0}}/>
          ))}
        </div>
        <button onClick={()=>setHeroSlide((s:number)=>(s-1+HERO_SLIDES.length)%HERO_SLIDES.length)} style={{position:'absolute',left:16,top:'50%',transform:'translateY(-50%)',width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.3)',color:'#fff',cursor:'pointer',fontSize:20,display:'flex',alignItems:'center',justifyContent:'center',zIndex:10}}>‹</button>
        <button onClick={()=>setHeroSlide((s:number)=>(s+1)%HERO_SLIDES.length)} style={{position:'absolute',right:16,top:'50%',transform:'translateY(-50%)',width:40,height:40,borderRadius:'50%',background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.3)',color:'#fff',cursor:'pointer',fontSize:20,display:'flex',alignItems:'center',justifyContent:'center',zIndex:10}}>›</button>
      </div>

    </section>
  )
}

// ── LANDING ATHLETES SECTION (editable via Admin > Content) ──
const DEFAULT_ATHLETES = [
  {id:1,name:'Rina Susanti',sport:'Tennis',quote:'The Elite Athletes gear gives me confidence to perform at my best every match.',img:null as string|null,initials:'RS'},
  {id:2,name:'Bagas Wicaksono',sport:'Hyrox',quote:'Training gets harder every day, but with the right gear I push through every WOD.',img:null as string|null,initials:'BW'},
  {id:3,name:'Citra Andriani',sport:'Yoga',quote:'Comfort and style combined — exactly what I need for every practice session.',img:null as string|null,initials:'CA'},
]
// Global editable content (updated from Admin Panel)
const SITE_CONTENT = {
  announcement: 'FREE SHIPPING di atas Rp 500.000 · Kode <strong style="color:#86BC91">ELITE20</strong> diskon 20%',
  athletes: DEFAULT_ATHLETES,
  aboutTitle: 'The Elite Athletes',
  aboutSubtitle: 'Born from passion, built for performance.',
  aboutDesc: 'The Elite Athletes adalah brand sport wear premium Indonesia yang dirancang untuk para atlet modern — dari lapangan tenis hingga gym, dari lintasan lari hingga studio yoga. Setiap produk kami dibuat dengan teknologi fabric terkini, memastikan performa optimal dan kenyamanan maksimal dalam setiap gerakan.',
  aboutMission: 'Misi kami sederhana: menghadirkan gear berkualitas dunia untuk atlet Indonesia.',
  aboutValues: [
    {icon:'🏆', title:'Performance First', desc:'Setiap desain dioptimalkan untuk mendukung performa terbaik kamu'},
    {icon:'🌿', title:'Sustainable', desc:'Dibuat dengan bahan ramah lingkungan tanpa mengorbankan kualitas'},
    {icon:'💚', title:'Made for Indonesia', desc:'Dirancang memahami iklim dan gaya hidup aktif orang Indonesia'},
  ],
}

function LandingAthletes({nav}:{nav:(p:string,d?:any)=>void}) {
  return (
    <section style={{padding:'52px 5vw',background:C.white}}>
      <div style={{maxWidth:1280,margin:'0 auto'}}>
        <div style={{marginBottom:36,display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:14}}>
          <div>
            <p style={{margin:'0 0 6px',fontSize:11,fontWeight:600,color:C.g500,letterSpacing:'0.14em',textTransform:'uppercase'}}>Our Athletes</p>
            <h2 style={{margin:0,fontFamily:"'DM Serif Display',Georgia,serif",fontSize:'clamp(1.5rem,3vw,2.2rem)',fontWeight:400,color:C.ink}}>Worn & Trusted by Athletes</h2>
          </div>
          <button onClick={()=>nav('athletes')} style={{fontSize:13,fontWeight:600,color:C.g600,background:'none',border:'none',cursor:'pointer'}}>Meet All Athletes →</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20}}>
          {SITE_CONTENT.athletes.map(a=>(
            <div key={a.id} style={{background:C.cream,border:`1px solid ${C.ink6}`,borderRadius:16,padding:'22px',display:'flex',flexDirection:'column',gap:14}}>
              <div style={{display:'flex',gap:3}}>{[1,2,3,4,5].map(i=><svg key={i} width="12" height="12" viewBox="0 0 12 12"><polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9.2,11 6,9.2 2.8,11 3.5,7.5 1,5 4.5,4.5" fill={C.gold2}/></svg>)}</div>
              <p style={{margin:0,fontSize:14,color:C.ink2,lineHeight:1.75,fontStyle:'italic',flex:1}}>"{a.quote}"</p>
              <div style={{display:'flex',alignItems:'center',gap:11}}>
                {a.img
                  ?<img src={a.img} alt={a.name} style={{width:42,height:42,borderRadius:'50%',objectFit:'cover',border:`2px solid ${C.g200}`}}/>
                  :<div style={{width:42,height:42,borderRadius:'50%',background:C.g100,border:`2px solid ${C.g200}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:C.g700,flexShrink:0}}>{a.initials}</div>
                }
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:C.ink}}>{a.name}</div>
                  <div style={{fontSize:11,color:C.g500,fontWeight:500}}>{a.sport} Athlete</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── ABOUT PAGE ────────────────────────────────────────────────
function AboutPage({nav,cartCount}:{nav:(p:string,d?:any)=>void,cartCount:number}) {
  return <div style={{background:C.cream,minHeight:'100vh'}}>
    <StoreNavbar nav={nav} cartCount={cartCount} onCartClick={()=>nav('checkout')} scrolled={true}/>
    {/* HERO */}
    <div style={{background:C.g800,marginTop:56+28,padding:'60px 5vw 52px'}}>
      <div style={{maxWidth:900,margin:'0 auto',textAlign:'center'}}>
        <p style={{margin:'0 0 10px',fontSize:11,fontWeight:600,color:C.g300,letterSpacing:'0.18em',textTransform:'uppercase'}}>Our Story</p>
        <h1 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:'clamp(2rem,5vw,3.5rem)',fontWeight:400,color:'#fff',margin:'0 0 20px',lineHeight:1.1}}>{SITE_CONTENT.aboutTitle}</h1>
        <p style={{fontSize:16,color:C.g300,margin:0,lineHeight:1.8,fontStyle:'italic'}}>{SITE_CONTENT.aboutSubtitle}</p>
      </div>
    </div>
    {/* MAIN CONTENT */}
    <div style={{maxWidth:900,margin:'0 auto',padding:'52px 5vw'}}>
      <p style={{fontSize:16,color:C.ink2,lineHeight:1.9,marginBottom:48,textAlign:'center'}}>{SITE_CONTENT.aboutDesc}</p>
      {/* VALUES */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:20,marginBottom:48}}>
        {SITE_CONTENT.aboutValues.map(v=>(
          <div key={v.title} style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:16,padding:'24px',textAlign:'center'}}>
            <div style={{fontSize:36,marginBottom:12}}>{v.icon}</div>
            <h3 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:18,fontWeight:400,color:C.ink,margin:'0 0 10px'}}>{v.title}</h3>
            <p style={{margin:0,fontSize:13,color:C.ink3,lineHeight:1.7}}>{v.desc}</p>
          </div>
        ))}
      </div>
      {/* MISSION */}
      <div style={{background:C.g800,borderRadius:20,padding:'36px',textAlign:'center'}}>
        <p style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:'clamp(1.2rem,3vw,1.8rem)',fontWeight:400,color:'#fff',margin:'0 0 20px',lineHeight:1.4,fontStyle:'italic'}}>"{SITE_CONTENT.aboutMission}"</p>
        <button onClick={()=>nav('catalog')} style={{background:C.gold2,color:C.g900,border:'none',borderRadius:10,padding:'12px 28px',fontSize:14,fontWeight:700,cursor:'pointer'}}>Shop the Collection</button>
      </div>
    </div>
    <footer style={{background:C.g900,borderTop:'1px solid rgba(255,255,255,0.06)',padding:'26px 5vw',textAlign:'center'}}>
      <p style={{margin:0,fontSize:12,color:C.g600}}>© 2025 The Elite Athletes. Made with 💚 in Indonesia.</p>
    </footer>
  </div>
}

function LandingPage({nav,addToCart,cartCount,products:extProducts}:{nav:(p:string,d?:any)=>void,addToCart:(item:any)=>void,cartCount:number,products?:any[]}) {
  const [scrolled,setScrolled]=useState(false)
  const [heroSlide,setHeroSlide]=useState(0)
  const [showCart,setShowCart]=useState(false)
  const [cart,setCart]=useState<any[]>([])
  const [toast,setToast]=useState<string|null>(null)
  const dbProducts=extProducts&&extProducts.length>0?extProducts:ALL_PRODUCTS
  useEffect(()=>{const fn=()=>setScrolled(window.scrollY>30);window.addEventListener('scroll',fn);return()=>window.removeEventListener('scroll',fn)},[])
  useEffect(()=>{
    const timer=setInterval(()=>setHeroSlide((s:number)=>(s+1)%5),5000)
    return()=>clearInterval(timer)
  },[])
  function handleAdd(p:any){const item={...p,qty:1,size:(p.sizes&&p.sizes.length>0)?p.sizes[0]:'M',image_url:p.image_url||null};setCart(c=>[...c,item]);addToCart(item);setToast(p.name)}
  const cats=[{icon:'🎾',label:'Tennis',count:48},{icon:'🏸',label:'Badminton',count:22},{icon:'🏓',label:'Padel',count:36},{icon:'🏋️',label:'Hyrox',count:29},{icon:'💪',label:'Gym',count:112},{icon:'🏃',label:'Running',count:94},{icon:'⛳',label:'Golf',count:41},{icon:'🧘',label:'Pilates',count:33},{icon:'🪷',label:'Yoga',count:57},{icon:'👟',label:'Footwear',count:18},{icon:'🎒',label:'Aksesoris',count:24}]
  return <div style={{background:C.cream,minHeight:'100vh'}}>
    {toast&&<Toast msg={toast} onDone={()=>setToast(null)}/>}
    {showCart&&<CartDrawer cart={cart} onClose={()=>setShowCart(false)} onRemove={i=>setCart(c=>c.filter((_,idx)=>idx!==i))} onCheckout={()=>{setShowCart(false);nav('checkout')}}/>}
    <StoreNavbar nav={nav} cartCount={cartCount} onCartClick={()=>setShowCart(true)} scrolled={scrolled}/>
    {/* HERO CAROUSEL */}
    {/* HERO CAROUSEL */}
    <HeroCarousel nav={nav} heroSlide={heroSlide} setHeroSlide={setHeroSlide} handleAdd={handleAdd}/>
    {/* SPORT CATEGORIES */}
    <section style={{padding:'52px 5vw',background:C.white}}>
      <div style={{maxWidth:1280,margin:'0 auto'}}>
        <div style={{marginBottom:28,display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:14}}>
          <div><p style={{margin:'0 0 6px',fontSize:11,fontWeight:600,color:C.g500,letterSpacing:'0.14em',textTransform:'uppercase'}}>Browse by Sport</p><h2 style={{margin:0,fontFamily:"'DM Serif Display',Georgia,serif",fontSize:'clamp(1.5rem,3vw,2.2rem)',fontWeight:400,color:C.ink}}>Your Sport, Your Gear.</h2></div>
          <button onClick={()=>nav('catalog')} style={{fontSize:13,fontWeight:600,color:C.g600,background:'none',border:'none',cursor:'pointer'}}>All Categories →</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(100px,1fr))',gap:10}}>
          {cats.map(cat=>(
            <button key={cat.label} onClick={()=>nav('catalog')} style={{background:C.cream,border:`1px solid ${C.ink6}`,borderRadius:12,padding:'14px 8px 12px',cursor:'pointer',textAlign:'center',transition:'all 0.2s'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.g400;(e.currentTarget as HTMLElement).style.background=C.g50}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.ink6;(e.currentTarget as HTMLElement).style.background=C.cream}}>
              <div style={{fontSize:22,marginBottom:5}}>{cat.icon}</div>
              <div style={{fontSize:11,fontWeight:600,color:C.ink2}}>{cat.label}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
    {/* FEATURED PRODUCTS - show more */}
    <section style={{padding:'52px 5vw',background:C.cream}}>
      <div style={{maxWidth:1280,margin:'0 auto'}}>
        <div style={{marginBottom:28,display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:14}}>
          <div><p style={{margin:'0 0 5px',fontSize:11,fontWeight:600,color:C.g500,letterSpacing:'0.14em',textTransform:'uppercase'}}>Best Sellers</p><h2 style={{margin:0,fontFamily:"'DM Serif Display',Georgia,serif",fontSize:'clamp(1.5rem,3vw,2.2rem)',fontWeight:400,color:C.ink}}>Top Picks This Week</h2></div>
          <button onClick={()=>nav('catalog')} style={{fontSize:13,fontWeight:600,color:C.g600,background:'none',border:'none',cursor:'pointer'}}>View All →</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:16}}>
          {dbProducts.slice(0,24).map((p:any,i:number)=><MiniCard key={p.id+'-'+i} p={p} onView={()=>nav('detail',p)} onAdd={()=>handleAdd(p)}/>)}
        </div>
        <div style={{textAlign:'center',marginTop:24}}>
          <button onClick={()=>nav('catalog')} style={{background:C.g800,color:'#fff',border:'none',borderRadius:10,padding:'12px 32px',fontSize:14,fontWeight:600,cursor:'pointer'}}>Lihat Semua Produk →</button>
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
function CatalogPage({nav,addToCart,cartCount,products:extProducts}:{nav:(p:string,d?:any)=>void,addToCart:(item:any)=>void,cartCount:number,products?:any[]}) {
  const [sports,setSports]=useState<string[]>([])
  const [genders,setGenders]=useState<string[]>([])
  const [priceR,setPriceR]=useState<string[]>([])
  const [inStock,setInStock]=useState(false)
  const [sortBy,setSortBy]=useState('newest')
  const [view,setView]=useState('grid')
  const [toast,setToast]=useState<string|null>(null)
  const allProducts=extProducts&&extProducts.length>0?extProducts:ALL_PRODUCTS
  const loading=false
  const PRICE_RANGES=[{label:'< Rp 400K',min:0,max:400000},{label:'Rp 400K–600K',min:400000,max:600000},{label:'Rp 600K–800K',min:600000,max:800000},{label:'> Rp 800K',min:800000,max:Infinity}]
  const tog=(arr:string[],set:(a:string[])=>void,v:string)=>set(arr.includes(v)?arr.filter(x=>x!==v):[...arr,v])
  const filtered=useMemo(()=>{
    let p=[...allProducts]
    if(sports.length) p=p.filter(x=>sports.some(sel=>sel.toLowerCase()===( x.sport||'').toLowerCase())||(x.sports&&x.sports.some((s:string)=>sports.some(sel=>sel.toLowerCase()===s.toLowerCase()))))
    if(genders.length) p=p.filter(x=>genders.includes(x.gender))
    if(inStock) p=p.filter(x=>totStock(x)>0)
    if(sortBy==='price_asc') p.sort((a,b)=>a.price-b.price)
    else if(sortBy==='price_desc') p.sort((a,b)=>b.price-a.price)
    else if(sortBy==='bestseller') p.sort((a,b)=>b.reviews-a.reviews)
    return p
  },[allProducts,sports,genders,inStock,sortBy])
  const activeCount=sports.length+genders.length+(inStock?1:0)
  const clearAll=()=>{setSports([]);setGenders([]);setInStock(false)}
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
      <div style={{maxWidth:1280,margin:'0 auto',padding:'12px 5vw'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <h1 style={{margin:0,fontFamily:"'DM Serif Display',Georgia,serif",fontSize:'clamp(1.1rem,4vw,1.6rem)',fontWeight:400,color:C.ink,flexShrink:0}}>Katalog</h1>
          <span style={{fontSize:11,color:C.ink4,flexShrink:0}}>{loading?"...":`(${filtered.length})`}</span>
          <div style={{flex:1}}/>
          {/* SORT */}
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{padding:'7px 10px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:12,fontFamily:'inherit',outline:'none',background:C.white,cursor:'pointer',color:C.ink,maxWidth:120}}>
            <option value='newest'>Terbaru</option>
            <option value='bestseller'>Best Seller</option>
            <option value='price_asc'>Harga ↑</option>
            <option value='price_desc'>Harga ↓</option>
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

              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <label style={{display:'flex',alignItems:'center',gap:7,cursor:'pointer',fontSize:12,color:C.ink2}}>
                  <div onClick={()=>setInStock(v=>!v)} style={{width:34,height:18,borderRadius:9,background:inStock?C.g600:C.ink5,position:'relative',transition:'background 0.2s',cursor:'pointer',flexShrink:0}}>
                    <div style={{position:'absolute',top:2,left:inStock?16:2,width:14,height:14,borderRadius:'50%',background:'#fff',transition:'left 0.2s'}}/>
                  </div>
                  Stok tersedia saja
                </label>
                {activeCount>0&&<button onClick={()=>{clearAll();setShowFilters(false)}} style={{background:'none',border:'none',cursor:'pointer',fontSize:11,color:C.red,fontWeight:600}}>Reset semua</button>}
              </div>
              <button onClick={()=>setShowFilters(false)} style={{width:'100%',marginTop:14,padding:'10px',background:C.g800,color:'#fff',border:'none',borderRadius:9,fontSize:13,fontWeight:700,cursor:'pointer'}}>Tampilkan {filtered.length} Produk</button>
            </div>}
          </div>
        </div>
      </div>
    </div>
    {/* Click outside to close filter */}
    {showFilters&&<div style={{position:'fixed',inset:0,zIndex:150}} onClick={()=>setShowFilters(false)}/>}

    {/* PRODUCTS GRID — 2 kolom di mobile */}
    <div style={{maxWidth:1280,margin:'0 auto',padding:'14px 5vw 60px'}}>
      {filtered.length===0
        ?<div style={{textAlign:'center',padding:'52px 0',color:C.ink4}}><div style={{fontSize:36,marginBottom:10}}>🔍</div><p style={{fontSize:14,fontWeight:600,color:C.ink2,margin:'0 0 14px'}}>Tidak ada produk</p><button onClick={clearAll} style={{background:C.g800,color:'#fff',border:'none',borderRadius:9,padding:'10px 22px',fontSize:13,fontWeight:600,cursor:'pointer'}}>Reset Filter</button></div>
        :<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:16}}>
          {filtered.map(p=><MiniCard key={p.id} p={p} onView={()=>nav('detail',p)} onAdd={()=>{addToCart({...p,qty:1,size:(p.sizes&&p.sizes.length>0)?p.sizes[0]:'M',image_url:p.image_url||null});setToast(p.name)}}/>)}
        </div>
      }
    </div>
  </div>
}

// ═══════════════════════════════════════════════════════════
// PAGE: PRODUCT DETAIL
// ═══════════════════════════════════════════════════════════
function DetailPage({product:p,nav,addToCart,cartCount,allProducts:extAll}:{product:any,nav:(pg:string,d?:any)=>void,addToCart:(item:any)=>void,cartCount:number,allProducts?:any[]}) {
  const [selSize,setSelSize]=useState<string|null>(null)
  const [showSizeGuide,setShowSizeGuide]=useState(false)
  const [activeImg,setActiveImg]=useState<string|null>(null)
  const [selColor,setSelColor]=useState(p.colors[0])
  const [qty,setQty]=useState(1)
  const [tab,setTab]=useState('description')
  const [added,setAdded]=useState(false)
  const [toast,setToast]=useState<string|null>(null)
  const disc=p.original?Math.round((1-p.price/p.original)*100):null
  const allProds=extAll&&extAll.length>0?extAll:ALL_PRODUCTS
  const related=useMemo(()=>{
    const sameSportGender=allProds.filter((x:any)=>x.sport===p.sport&&x.gender===p.gender&&x.id!==p.id)
    const sameSportOnly=allProds.filter((x:any)=>x.sport===p.sport&&x.gender!==p.gender&&x.id!==p.id)
    return [...sameSportGender,...sameSportOnly].slice(0,4)
  },[allProds,p.id,p.sport,p.gender])
  const SWATCH:Record<string,string>={Forest:'#2D5134',White:'#F8F8F6',Navy:'#1B2A4A',Black:'#1C1C1A',Charcoal:'#3A3A3A',Olive:'#5A6045',Sage:'#7A9E7E',Blush:'#E8B4B8',Khaki:'#C3B89A',Cream:'#FAF8F4',Sand:'#D4C4A0'}
  function handleAdd(){if(!selSize){alert('Pilih ukuran terlebih dahulu.');return}addToCart({...p,qty,size:selSize,color:selColor,image_url:p.image_url||null});setAdded(true);setToast(p.name);setTimeout(()=>setAdded(false),2000)}
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
          {/* MARKETPLACE STYLE - thumbnails left, main right */}
          {(()=>{
            const allImgs=[p.image_url,...(p.gallery||[])].filter(Boolean)
            const mainImg=activeImg||(allImgs[0]||null)
            return <>
              <div style={{display:'flex',gap:10}}>
                {/* LEFT: thumbnail strip */}
                {allImgs.length>1&&<div style={{display:'flex',flexDirection:'column',gap:7,width:64,flexShrink:0}}>
                  {allImgs.slice(0,5).map((img:string,i:number)=>(
                    <div key={i} onClick={()=>setActiveImg(img)} style={{width:64,height:64,borderRadius:8,overflow:'hidden',border:`2px solid ${mainImg===img?C.g600:C.ink6}`,cursor:'pointer',flexShrink:0,background:C.cream,transition:'border-color 0.15s'}}>
                      <img src={img} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    </div>
                  ))}
                </div>}
                {/* RIGHT: main image */}
                <div style={{flex:1,borderRadius:16,overflow:'hidden',border:`1.5px solid ${C.ink6}`,aspectRatio:'1/1',background:C.cream,position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {mainImg
                    ?<img src={mainImg} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    :<><div style={{position:'absolute',bottom:0,right:0,width:'55%',height:'55%',background:C.g50,borderRadius:'50% 0 16px 0'}}/><span style={{fontSize:100,position:'relative',zIndex:1}}>{p.emoji}</span></>
                  }
                  <div style={{position:'absolute',top:12,left:12}}><PBadge label={p.badge}/></div>
                  {disc&&<span style={{position:'absolute',top:12,right:12,background:'#FEF2F2',color:'#C0392B',fontSize:10,fontWeight:800,padding:'3px 8px',borderRadius:4,border:'1px solid #FCA5A5'}}>−{disc}% OFF</span>}
                </div>
              </div>
              {/* BOTTOM thumbnails if only 1 image */}
              {allImgs.length===1&&<div style={{display:'flex',gap:8}}>
                <div style={{width:64,height:64,borderRadius:8,overflow:'hidden',border:`2px solid ${C.g600}`,background:C.cream}}>
                  <img src={allImgs[0]} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                </div>
              </div>}
            </>
          })()}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          <div style={{display:'flex',gap:8,alignItems:'center'}}><span style={{fontSize:11,fontWeight:700,color:C.g500,letterSpacing:'0.12em',textTransform:'uppercase'}}>{p.sport}</span><span style={{color:C.ink5}}>·</span><span style={{fontSize:11,color:C.ink4,fontWeight:500,textTransform:'uppercase',letterSpacing:'0.06em'}}>{p.gender}</span></div>
          <h1 style={{margin:0,fontFamily:"'DM Serif Display',Georgia,serif",fontSize:'clamp(1.5rem,3.5vw,2.2rem)',fontWeight:400,color:C.ink,lineHeight:1.15,letterSpacing:'-0.02em'}}>{p.name}</h1>
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

        </div>
      </div>
      <div style={{marginBottom:36}}>
        <p style={{fontSize:14,color:C.ink2,lineHeight:1.85,maxWidth:620,margin:0}}>{p.desc||p.description||''}</p>
      </div>
      {related.length>0&&<div>
        <h2 style={{margin:'0 0 20px',fontFamily:"'DM Serif Display',Georgia,serif",fontSize:'clamp(1.3rem,2.5vw,1.7rem)',fontWeight:400,color:C.ink}}>You Might Also Like</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:16}}>{related.map((r:any)=><MiniCard key={r.id} p={r} onView={()=>nav('detail',r)} onAdd={()=>{addToCart({...r,qty:1,size:(r.sizes&&r.sizes[0])||'M',image_url:r.image_url||null});setToast(r.name)}}/>)}</div>
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
  const [cart,setCart]=useState(initCart)
  const [shippingData,setShippingData]=useState<any>({})
  const [paymentMethod,setPaymentMethod]=useState('')
  const [coupon,setCoupon]=useState('')
  const [couponInput,setCouponInput]=useState('')
  const [couponErr,setCouponErr]=useState('')
  const [placing,setPlacing]=useState(false)
  const [confirmedOrder,setConfirmedOrder]=useState<any>(null)
  // RajaOngkir states
  const [destSearch,setDestSearch]=useState('')
  const [destResults,setDestResults]=useState<any[]>([])
  const [destLoading,setDestLoading]=useState(false)
  const [selectedDest,setSelectedDest]=useState<any>(null)
  const [jneServices,setJneServices]=useState<any[]>([])
  const [shippingLoading,setShippingLoading]=useState(false)
  const [selectedService,setSelectedService]=useState<any>(null)
  const subtotal=cart.reduce((s:number,i:any)=>s+i.price*(i.qty||1),0)
  const shippingCost=selectedService?.cost||0
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
          items:cart.map((i:any)=>({id:i.id,sku:i.sku,name:i.name,size:i.size,color:i.color||'',qty:i.qty||1,price:i.price,image_url:i.image_url||null,emoji:i.emoji||''})),
          shipping:{courier:'JNE',service:selectedService?.service||'',etd:selectedService?.etd||''},
          phone:shippingData.phone,
          province:selectedDest?.province_name||shippingData.province||'',
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
            setConfirmedOrder({id:data.order_id,date:new Date().toISOString(),email:shippingData.email,customerName:shippingData.firstName+' '+shippingData.lastName,phone:shippingData.phone,address:shippingData.address+', '+shippingData.city,province:selectedDest?.province_name||shippingData.province||'',payment:result.payment_type||paymentMethod,items:cart,total,status:'processing'})
            setPlacing(false);setStep(4)
          },
          onPending:()=>{
            setConfirmedOrder({id:data.order_id,date:new Date().toISOString(),email:shippingData.email,customerName:shippingData.firstName+' '+shippingData.lastName,phone:shippingData.phone,address:shippingData.address+', '+shippingData.city,province:selectedDest?.province_name||shippingData.province||'',payment:paymentMethod,items:cart,total,status:'pending'})
            setPlacing(false);setStep(4)
          },
          onError:(err:any)=>{alert('Pembayaran gagal: '+(err.message||'Coba lagi'));setPlacing(false)},
          onClose:()=>{setPlacing(false)},
        })
      } else {
        setConfirmedOrder({id:data.order_id,date:new Date().toISOString(),email:shippingData.email,customerName:shippingData.firstName+' '+shippingData.lastName,phone:shippingData.phone,address:shippingData.address+', '+shippingData.city,province:selectedDest?.province_name||shippingData.province||'',payment:paymentMethod,items:cart,total,status:'pending'})
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
              <div style={{width:44,height:44,background:C.cream,borderRadius:8,overflow:'hidden',flexShrink:0,position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
                {item.image_url?<img src={item.image_url} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:22}}>{item.emoji}</span>}
                <span style={{position:'absolute',top:-5,right:-5,background:C.g700,color:'#fff',width:15,height:15,borderRadius:'50%',fontSize:8,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center'}}>{item.qty}</span>
              </div>
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
              <div key={i} style={{width:36,height:36,background:C.cream,borderRadius:7,overflow:'hidden',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                {item.image_url?<img src={item.image_url} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:18}}>{item.emoji}</span>}
              </div>
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
                  <div style={{width:68,height:68,background:C.cream,borderRadius:10,overflow:'hidden',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    {item.image_url?<img src={item.image_url} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:36}}>{item.emoji}</span>}
                  </div>
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
              {/* RAJAONGKIR DESTINATION SEARCH */}
              <div style={{position:'relative'}}>
                <label style={{fontSize:12,fontWeight:600,color:C.ink3,display:'block',marginBottom:4}}>Kota / Kecamatan Tujuan <span style={{color:C.red}}>*</span></label>
                <input value={destSearch} onChange={async e=>{
                  const val=e.target.value
                  setDestSearch(val)
                  setSelectedDest(null)
                  setJneServices([])
                  setSelectedService(null)
                  if(val.length<2){setDestResults([]);return}
                  setDestLoading(true)
                  try{
                    const res=await fetch(`/api/destination?search=${encodeURIComponent(val)}`)
                    const d=await res.json()
                    setDestResults(d.data||[])
                  }catch(e){}
                  setDestLoading(false)
                }} placeholder="Ketik nama kota/kecamatan..." style={{width:'100%',padding:'10px 13px',border:`1.5px solid ${selectedDest?C.g400:C.ink5}`,borderRadius:9,fontSize:13,fontFamily:'inherit',outline:'none',color:C.ink,boxSizing:'border-box' as any}}/>
                {destLoading&&<div style={{position:'absolute',right:12,top:34,fontSize:11,color:C.ink4}}>🔍</div>}
                {destResults.length>0&&!selectedDest&&<div style={{position:'absolute',top:'100%',left:0,right:0,background:C.white,border:`1px solid ${C.ink5}`,borderRadius:9,zIndex:200,boxShadow:'0 8px 24px rgba(0,0,0,0.1)',maxHeight:200,overflowY:'auto'}}>
                  {destResults.map((r:any)=>(
                    <div key={r.id} onClick={async()=>{
                      setSelectedDest(r)
                      setDestSearch(`${r.subdistrict_name}, ${r.city_name}, ${r.province_name}`)
                      setDestResults([])
                      setShippingData((d:any)=>({...d,city:r.city_name,province:r.province_name,destId:r.id}))
                      // Fetch JNE rates
                      setShippingLoading(true)
                      try{
                        const res=await fetch('/api/shipping',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({destination:r.id,weight:cart.reduce((s:number,item:any)=>(s+(item.weight||500)*(item.qty||1)),0)})})
                        const data=await res.json()
                        setJneServices(data.data||[])
                      }catch(e){}
                      setShippingLoading(false)
                    }} style={{padding:'10px 14px',cursor:'pointer',borderBottom:`1px solid ${C.ink6}`,fontSize:12}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=C.cream} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=''}>
                      <span style={{fontWeight:600,color:C.ink}}>{r.subdistrict_name}</span>
                      <span style={{color:C.ink4}}>, {r.city_name}, {r.province_name}</span>
                    </div>
                  ))}
                </div>}
                {selectedDest&&<div style={{marginTop:6,fontSize:11,color:C.g600,fontWeight:600}}>✓ {selectedDest.subdistrict_name}, {selectedDest.city_name}</div>}
              </div>
            </div>
            {/* JNE SERVICES */}
            <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:13,padding:'18px 20px',display:'flex',flexDirection:'column',gap:9}}>
              <p style={{margin:'0 0 3px',fontSize:11,fontWeight:700,color:C.ink4,letterSpacing:'0.08em',textTransform:'uppercase'}}>Layanan JNE</p>
              {!selectedDest&&<p style={{margin:0,fontSize:12,color:C.ink4,fontStyle:'italic'}}>Pilih kota tujuan dulu untuk melihat tarif JNE</p>}
              {shippingLoading&&<div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:16,height:16,border:`2px solid ${C.g300}`,borderTopColor:C.g700,borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/><span style={{fontSize:12,color:C.ink4}}>Mengambil tarif JNE...</span></div>}
              {jneServices.map((svc:any)=>(
                <label key={svc.service} onClick={()=>{setSelectedService(svc);setShippingData((d:any)=>({...d,shipping:svc.service,shippingLabel:`JNE ${svc.service}`}))}} style={{display:'flex',alignItems:'center',gap:11,padding:'12px 14px',border:`1.5px solid ${selectedService?.service===svc.service?C.g500:C.ink6}`,background:selectedService?.service===svc.service?C.g50:C.white,borderRadius:11,cursor:'pointer',transition:'all 0.15s'}}>
                  <div style={{width:17,height:17,borderRadius:'50%',border:`2px solid ${selectedService?.service===svc.service?C.g600:C.ink4}`,background:selectedService?.service===svc.service?C.g600:'transparent',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>{selectedService?.service===svc.service&&<div style={{width:6,height:6,borderRadius:'50%',background:'#fff'}}/>}</div>
                  <span style={{fontSize:16}}>📦</span>
                  <div style={{flex:1}}>
                    <p style={{margin:'0 0 1px',fontSize:13,fontWeight:700,color:C.ink}}>JNE {svc.service}</p>
                    <p style={{margin:0,fontSize:11,color:C.ink4}}>{svc.description} · {svc.etd}</p>
                  </div>
                  <span style={{fontSize:13,fontWeight:800,color:selectedService?.service===svc.service?C.g700:C.ink}}>{fmt(svc.cost)}</span>
                </label>
              ))}
            </div>
            <div style={{display:'flex',gap:11}}>
              <button onClick={()=>setStep(0)} style={{padding:'12px 20px',background:C.white,color:C.ink2,border:`1px solid ${C.ink5}`,borderRadius:10,fontSize:13,fontWeight:600,cursor:'pointer'}}>← Back</button>
              <button onClick={()=>{if(!shippingData.firstName||!shippingData.email||!shippingData.address||!selectedService||!selectedDest){alert('Lengkapi semua field wajib termasuk kota dan layanan pengiriman.')}else{setStep(2)}}} style={{flex:1,padding:'12px',background:C.g800,color:'#fff',border:'none',borderRadius:10,fontSize:13,fontWeight:700,cursor:'pointer'}}>Lanjut ke Pembayaran →</button>
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
              <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:11,padding:'13px 14px'}}><p style={{margin:'0 0 7px',fontSize:10,fontWeight:700,color:C.ink4,letterSpacing:'0.08em',textTransform:'uppercase'}}>Pembayaran</p><p style={{margin:'0 0 3px',fontSize:12,fontWeight:700,color:C.ink}}>{PAYMENT_METHODS.find(p=>p.id===paymentMethod)?.icon} {PAYMENT_METHODS.find(p=>p.id===paymentMethod)?.label}</p><p style={{margin:0,fontSize:12,fontWeight:600,color:C.g700}}>📦 {shippingData.shippingLabel||'JNE'}</p></div>
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
const ADMIN_NAV=[{id:'overview',icon:'◈',label:'Overview'},{id:'orders',icon:'📋',label:'Orders'},{id:'inventory',icon:'📦',label:'Inventory'},{id:'customers',icon:'👥',label:'Customers'},{id:'financial',icon:'📊',label:'Financial'},{id:'content',icon:'🖼️',label:'Content'},{id:'integrations',icon:'🔌',label:'Integrations'}]
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

function AdminOrders({orders:initO,products:allProds=[]}:{orders:any[],products?:any[]}) {
  const [orders,setOrders]=useState<any[]>(initO)
  const [search,setSearch]=useState('')
  const [dateFrom,setDateFrom]=useState('')
  const [dateTo,setDateTo]=useState('')
  const [provSearch,setProvSearch]=useState('')
  const [showProvDrop,setShowProvDrop]=useState(false)
  const [filterProv,setFilterProv]=useState('')
  const [filterPaid,setFilterPaid]=useState('all') // all/paid/unpaid
  const [selected,setSelected]=useState<any>(null)
  const [resiInputs,setResiInputs]=useState<Record<string,string>>({})
  const [resiSaved,setResiSaved]=useState<Record<string,string>>({})
  const [printMode,setPrintMode]=useState<null|'packing'|'label'>(null)
  const [manualProduct,setManualProduct]=useState('')

  useEffect(()=>{
  },[]) // orders pre-loaded from App level

  const allProvs=useMemo(()=>Array.from(new Set(orders.map((o:any)=>o.province||o.address?.split(',').pop()?.trim()||''))).filter(Boolean).sort(),[orders])

  const filtered=useMemo(()=>{
    let o=[...orders].sort((a:any,b:any)=>{const da=new Date(a.date||0).getTime(),db=new Date(b.date||0).getTime();return db-da})
    if(search) o=o.filter((x:any)=>(x.customerName||'').toLowerCase().includes(search.toLowerCase())||(x.id||'').toLowerCase().includes(search.toLowerCase())||(x.phone||'').includes(search))
    if(dateFrom) o=o.filter((x:any)=>new Date(x.date)>=new Date(dateFrom))
    if(dateTo) o=o.filter((x:any)=>new Date(x.date)<=new Date(dateTo+'T23:59:59'))
    if(filterProv) o=o.filter((x:any)=>(x.province||x.address||'').toLowerCase().includes(filterProv.toLowerCase()))
    if(filterPaid==='paid') o=o.filter((x:any)=>['processing','shipped','delivered'].includes(x.status))
    if(filterPaid==='unpaid') o=o.filter((x:any)=>['pending','cancelled'].includes(x.status))
    return o
  },[orders,search,dateFrom,dateTo,filterProv,filterPaid])

  function updateStatus(id:string,status:string){
    setOrders(prev=>prev.map((o:any)=>o.id===id?{...o,status}:o))
    if(selected?.id===id) setSelected((s:any)=>({...s,status}))
    fetch('/api/orders',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status})}).catch(()=>{})
  }

  function saveResi(id:string){
    const resi=resiInputs[id]||''
    if(!resi) return
    setResiSaved(s=>({...s,[id]:resi}))
    setOrders(prev=>prev.map((o:any)=>o.id===id?{...o,resi}:o))
    if(selected?.id===id) setSelected((s:any)=>({...s,resi}))
    fetch('/api/orders',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,resi})}).catch(()=>{})
  }

  const STATUS_ORDER=['pending','processing','shipped','delivered','cancelled','refund']
  const STATUS_LABEL:Record<string,string>={pending:'Pending',processing:'Processing',shipped:'Shipped',delivered:'Done',cancelled:'Cancelled',refund:'Refund'}
  const STATUS_COLOR:Record<string,string>={pending:C.amber,processing:C.blue,shipped:C.g500,delivered:C.g700,cancelled:C.red,refund:C.ink4}
  const STATUS_BG:Record<string,string>={pending:C.amberBg,processing:C.blueBg,shipped:C.g50,delivered:'#D1FAE5',cancelled:C.redBg,refund:C.ink6}

  function isPaid(o:any){return ['processing','shipped','delivered'].includes(o.status)}

  // PRINT functions
  function printPackingList(o:any){
    const w=window.open('','_blank','width=600,height=800')!
    w.document.write(`<!DOCTYPE html><html><head><title>Packing List ${o.id}</title>
    <style>body{font-family:Arial,sans-serif;padding:24px;color:#000}h2{margin:0 0 4px}hr{border:1px dashed #ccc;margin:12px 0}table{width:100%;border-collapse:collapse}th,td{padding:8px;border:1px solid #ddd;font-size:13px}th{background:#f5f5f5}@media print{.no-print{display:none}}</style>
    </head><body>
    <h2>PACKING LIST — ${o.id}</h2>
    <p style="font-size:12px;color:#666">Tanggal: ${(o.date&&!isNaN(new Date(o.date).getTime())?new Date(o.date).toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'}):new Date().toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'}))}</p>
    <hr/>
    <table><thead><tr><th>SKU</th><th>Nama Produk</th><th>Size</th><th>Warna</th><th>Qty</th></tr></thead>
    <tbody>${(o.items||[]).map((item:any)=>`<tr><td>${item.sku||'-'}</td><td>${item.name}</td><td>${item.size||'-'}</td><td>${item.color||'-'}</td><td style="text-align:center;font-weight:bold">${item.qty||1}</td></tr>`).join('')}
    </tbody></table>
    <hr/>
    <p style="font-size:11px;color:#888">Dicetak: ${new Date().toLocaleString('id-ID')}</p>
    <button class="no-print" onclick="window.print()" style="margin-top:12px;padding:8px 20px;background:#1F3B24;color:#fff;border:none;border-radius:6px;cursor:pointer">🖨️ Print</button>
    </body></html>`)
    w.document.close()
  }

  function printLabel(o:any){
    const prod=manualProduct||(o.items||[]).map((i:any)=>`${i.name} (${i.size||''} ${i.color||''} x${i.qty||1})`).join(', ')
    const w=window.open('','_blank','width=600,height=500')!
    w.document.write(`<!DOCTYPE html><html><head><title>Label ${o.id}</title>
    <style>body{font-family:Arial,sans-serif;padding:0;margin:0}
    .label{width:10cm;min-height:7cm;border:2px solid #000;padding:14px;box-sizing:border-box;font-size:12px}
    .header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;border-bottom:2px solid #000;padding-bottom:8px}
    .brand{font-size:15px;font-weight:bold}
    .order-id{font-size:11px;background:#000;color:#fff;padding:3px 8px;border-radius:4px}
    .section{margin:6px 0}
    .label-title{font-size:9px;color:#666;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:2px}
    .label-val{font-size:13px;font-weight:bold;color:#000}
    .product-box{border:1px dashed #ccc;padding:6px;border-radius:4px;font-size:11px;margin-top:6px}
    @media print{.no-print{display:none}}</style>
    </head><body>
    <div class="label">
      <div class="header">
        <span class="brand">THE ELITE ATHLETES</span>
        <span class="order-id">${o.id}</span>
      </div>
      <div class="section">
        <div class="label-title">Kepada / Tujuan</div>
        <div class="label-val">${o.customerName}</div>
        <div style="font-size:12px;margin-top:2px">${o.address||''}</div>
        <div style="font-size:12px;font-weight:bold;margin-top:2px">📱 ${o.phone||'-'}</div>
      </div>
      <div style="border-top:1px dashed #ccc;margin:6px 0"></div>
      <div class="section">
        <div class="label-title">Pengirim</div>
        <div class="label-val">The Elite Athletes</div>
        <div style="font-size:11px">Tangerang Selatan, Banten</div>
      </div>
      <div class="product-box">
        <span style="font-size:9px;color:#666">ISI PAKET:</span><br/>
        ${prod}
      </div>
    </div>
    <button class="no-print" onclick="window.print()" style="margin:12px;padding:8px 20px;background:#1F3B24;color:#fff;border:none;border-radius:6px;cursor:pointer">🖨️ Print Label</button>
    </body></html>`)
    w.document.close()
  }

  const provSuggestions=allProvs.filter(p=>p.toLowerCase().includes(provSearch.toLowerCase())).slice(0,8)

  return <div style={{display:'flex',flexDirection:'column',gap:14}}>

    {/* FILTER BAR */}
    <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:12,padding:'14px 16px',display:'flex',gap:10,flexWrap:'wrap',alignItems:'flex-end'}}>
      <div style={{display:'flex',flexDirection:'column',gap:3,flex:2,minWidth:160}}>
        <label style={{fontSize:10,fontWeight:600,color:C.ink4}}>Cari Order / Customer / HP</label>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ORD-001 / Sarah / 08xx" style={{padding:'7px 11px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:12,fontFamily:'inherit',outline:'none',color:C.ink}}/>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:3}}>
        <label style={{fontSize:10,fontWeight:600,color:C.ink4}}>Dari Tanggal</label>
        <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} style={{padding:'7px 10px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:12,fontFamily:'inherit',outline:'none',color:C.ink}}/>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:3}}>
        <label style={{fontSize:10,fontWeight:600,color:C.ink4}}>Sampai Tanggal</label>
        <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} style={{padding:'7px 10px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:12,fontFamily:'inherit',outline:'none',color:C.ink}}/>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:3,position:'relative'}}>
        <label style={{fontSize:10,fontWeight:600,color:C.ink4}}>Provinsi</label>
        <input value={provSearch} onChange={e=>{setProvSearch(e.target.value);setShowProvDrop(true)}} onFocus={()=>setShowProvDrop(true)} placeholder="Ketik provinsi..." style={{padding:'7px 10px',border:`1px solid ${filterProv?C.g400:C.ink5}`,borderRadius:8,fontSize:12,fontFamily:'inherit',outline:'none',color:C.ink,width:140}}/>
        {filterProv&&<button onClick={()=>{setFilterProv('');setProvSearch('')}} style={{position:'absolute',right:8,top:28,background:'none',border:'none',cursor:'pointer',fontSize:12,color:C.ink4}}>✕</button>}
        {showProvDrop&&provSuggestions.length>0&&<div style={{position:'absolute',top:'100%',left:0,right:0,background:C.white,border:`1px solid ${C.ink5}`,borderRadius:8,zIndex:200,boxShadow:'0 6px 20px rgba(0,0,0,0.1)',maxHeight:160,overflowY:'auto'}}>
          {provSuggestions.map(p=><div key={p} onClick={()=>{setFilterProv(p);setProvSearch(p);setShowProvDrop(false)}} style={{padding:'8px 12px',cursor:'pointer',fontSize:12,borderBottom:`1px solid ${C.ink6}`}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=C.cream} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=''}>{p}</div>)}
        </div>}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:3}}>
        <label style={{fontSize:10,fontWeight:600,color:C.ink4}}>Status Bayar</label>
        <select value={filterPaid} onChange={e=>setFilterPaid(e.target.value)} style={{padding:'7px 10px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:12,fontFamily:'inherit',outline:'none',color:C.ink,background:C.white}}>
          <option value="all">Semua</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>
      {(search||dateFrom||dateTo||filterProv||filterPaid!=='all')&&<button onClick={()=>{setSearch('');setDateFrom('');setDateTo('');setFilterProv('');setProvSearch('');setFilterPaid('all')}} style={{padding:'7px 12px',background:C.cream,border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:11,fontWeight:600,color:C.ink3,cursor:'pointer',alignSelf:'flex-end'}}>Reset</button>}
    </div>

    {/* SUMMARY COUNTS */}
    <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
      {[['Semua',orders.length,C.ink],['Pending',orders.filter((o:any)=>o.status==='pending').length,C.amber],['Processing',orders.filter((o:any)=>o.status==='processing').length,C.blue],['Shipped',orders.filter((o:any)=>o.status==='shipped').length,C.g500],['Done',orders.filter((o:any)=>o.status==='delivered').length,C.g700]].map(([l,v,col])=>(
        <div key={String(l)} style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:9,padding:'8px 14px',textAlign:'center'}}>
          <div style={{fontSize:18,fontWeight:800,color:String(col)}}>{v}</div>
          <div style={{fontSize:10,color:C.ink4,fontWeight:600}}>{l}</div>
        </div>
      ))}
    </div>

    <div style={{display:'grid',gridTemplateColumns:selected?'1fr 380px':'1fr',gap:14,alignItems:'start'}}>
      {/* ORDER TABLE */}
      <div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:12,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
          <thead><tr style={{background:C.g800,color:'#fff'}}>
            {['Order ID','Tanggal','Customer','No HP','Total','Provinsi','Bayar','Resi / Tracking','Status Order'].map(h=><th key={h} style={{padding:'10px 12px',textAlign:'left',fontWeight:600,whiteSpace:'nowrap',fontSize:11}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((o:any,idx:number)=>{
              const paid=isPaid(o)
              const resi=resiSaved[o.id]||o.resi||''
              return <tr key={o.id} onClick={()=>setSelected(selected?.id===o.id?null:o)} style={{borderBottom:`1px solid ${C.ink6}`,background:selected?.id===o.id?C.g50:idx%2===0?C.white:C.cream,cursor:'pointer',transition:'background 0.15s'}}
                onMouseEnter={e=>{if(selected?.id!==o.id)(e.currentTarget as HTMLElement).style.background=C.g50}}
                onMouseLeave={e=>{if(selected?.id!==o.id)(e.currentTarget as HTMLElement).style.background=idx%2===0?C.white:C.cream}}>
                <td style={{padding:'9px 12px',fontWeight:700,color:C.g700,whiteSpace:'nowrap'}}>{o.id}</td>
                <td style={{padding:'9px 12px',color:C.ink3,whiteSpace:'nowrap'}}>{(o.date&&!isNaN(new Date(o.date).getTime())?new Date(o.date).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'2-digit'}):'-')}</td>
                <td style={{padding:'9px 12px',fontWeight:600,color:C.ink,whiteSpace:'nowrap'}}>{o.customerName}</td>
                <td style={{padding:'9px 12px',whiteSpace:'nowrap'}}>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <span style={{fontSize:11,color:C.ink3}}>{o.phone||'-'}</span>
                    {o.phone&&<a href={`https://wa.me/62${(o.phone||'').replace(/^0/,'').replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{display:'flex',alignItems:'center',justifyContent:'center',width:22,height:22,borderRadius:5,background:'#25D366',color:'#fff',textDecoration:'none',fontSize:12,fontWeight:700,flexShrink:0}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>}
                  </div>
                </td>
                <td style={{padding:'9px 12px',fontWeight:700,color:C.ink,whiteSpace:'nowrap'}}>{fmt(o.total)}</td>
                <td style={{padding:'9px 12px',fontSize:11,color:C.ink3,maxWidth:100,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.province||o.address?.split(',').pop()?.trim()||'-'}</td>
                <td style={{padding:'9px 12px'}}>
                  <span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:5,background:paid?'#D1FAE5':C.amberBg,color:paid?C.g700:C.amber,whiteSpace:'nowrap'}}>{paid?'PAID':'UNPAID'}</span>
                </td>
                <td style={{padding:'9px 12px',minWidth:180}} onClick={e=>e.stopPropagation()}>
                  {resi
                    ?<div style={{display:'flex',alignItems:'center',gap:6}}>
                      <span style={{fontSize:11,fontWeight:700,color:C.g700}}>{resi}</span>
                      <a href={`https://www.jne.co.id/id/tracking/trace/${resi}`} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:C.blue,fontWeight:600,textDecoration:'none',whiteSpace:'nowrap'}}>🔗 Track</a>
                      <button onClick={()=>{setResiSaved(s=>{const n={...s};delete n[o.id];return n});setOrders(prev=>prev.map((x:any)=>x.id===o.id?{...x,resi:''}:x))}} style={{fontSize:9,color:C.ink4,background:'none',border:'none',cursor:'pointer'}}>✕</button>
                    </div>
                    :<div style={{display:'flex',gap:5}}>
                      <input value={resiInputs[o.id]||''} onChange={e=>setResiInputs(s=>({...s,[o.id]:e.target.value}))} onKeyDown={e=>{if(e.key==='Enter')saveResi(o.id)}} placeholder="Ketik resi + Enter" style={{width:120,padding:'5px 8px',border:`1px solid ${C.ink5}`,borderRadius:7,fontSize:11,fontFamily:'inherit',outline:'none',color:C.ink}}/>
                      <button onClick={()=>saveResi(o.id)} style={{padding:'5px 9px',background:C.g800,color:'#fff',border:'none',borderRadius:7,fontSize:10,fontWeight:700,cursor:'pointer'}}>✓</button>
                    </div>
                  }
                </td>
                <td style={{padding:'9px 12px'}} onClick={e=>e.stopPropagation()}>
                  <select value={o.status} onChange={e=>updateStatus(o.id,e.target.value)} style={{padding:'5px 8px',border:`1px solid ${STATUS_COLOR[o.status]||C.ink5}`,borderRadius:7,fontSize:11,fontFamily:'inherit',outline:'none',background:STATUS_BG[o.status]||C.white,color:STATUS_COLOR[o.status]||C.ink,fontWeight:700,cursor:'pointer'}}>
                    {STATUS_ORDER.map(s=><option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                  </select>
                </td>
              </tr>
            })}
          </tbody>
        </table>
        {filtered.length===0&&<div style={{padding:'32px',textAlign:'center',color:C.ink4}}><p style={{margin:0,fontSize:13}}>Tidak ada order ditemukan</p></div>}
      </div>

      {/* ORDER DETAIL PANEL */}
      {selected&&<div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:12,padding:'16px',display:'flex',flexDirection:'column',gap:14,position:'sticky',top:80}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div>
            <p style={{margin:'0 0 2px',fontSize:11,color:C.ink4,fontWeight:600,letterSpacing:'0.06em'}}>ORDER DETAIL</p>
            <h3 style={{margin:0,fontSize:16,fontWeight:800,color:C.g700}}>{selected.id}</h3>
          </div>
          <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',cursor:'pointer',fontSize:16,color:C.ink4}}>✕</button>
        </div>

        {/* CUSTOMER INFO */}
        <div style={{background:C.cream,borderRadius:10,padding:'12px 14px',display:'flex',flexDirection:'column',gap:7}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:12,fontWeight:700,color:C.ink}}>{selected.customerName}</span>
            <span style={{fontSize:10,fontWeight:700,padding:'3px 9px',borderRadius:5,background:isPaid(selected)?'#D1FAE5':C.amberBg,color:isPaid(selected)?C.g700:C.amber}}>{isPaid(selected)?'PAID':'UNPAID'}</span>
          </div>
          {selected.phone&&<div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:12,color:C.ink3}}>📱 {selected.phone}</span>
            <a href={`https://wa.me/62${(selected.phone||'').replace(/^0/,'').replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',gap:4,padding:'3px 9px',background:'#25D366',color:'#fff',borderRadius:6,fontSize:11,fontWeight:700,textDecoration:'none'}}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat WA
            </a>
          </div>}
          <div style={{fontSize:11,color:C.ink3}}>📅 {(selected.date&&!isNaN(new Date(selected.date).getTime())?new Date(selected.date).toLocaleDateString('id-ID',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}):'-')}</div>
          <div style={{fontSize:11,color:C.ink3}}>💳 Bayar via: <strong>{selected.payment||'-'}</strong>{selected.paid_at&&<span style={{fontSize:10,color:C.g500,marginLeft:8}}>✓ Lunas {new Date(selected.paid_at).toLocaleDateString('id-ID',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</span>}</div>
          <div style={{fontSize:11,color:C.ink3}}>📍 {selected.address||'-'}</div>
          {selected.resi&&<div style={{fontSize:11,color:C.g600,fontWeight:600}}>📦 Resi: {selected.resi} · <a href={`https://www.jne.co.id/id/tracking/trace/${selected.resi}`} target="_blank" rel="noopener noreferrer" style={{color:C.blue}}>Track JNE →</a></div>}
        </div>

        {/* ITEMS */}
        <div>
          <p style={{margin:'0 0 8px',fontSize:11,fontWeight:700,color:C.ink4,letterSpacing:'0.06em',textTransform:'uppercase'}}>Item yang Dibeli</p>
          {(selected.items||[]).map((item:any,i:number)=>(
            <div key={i} style={{display:'flex',gap:10,padding:'9px 0',borderBottom:`1px solid ${C.ink6}`}}>
              <div style={{width:44,height:44,borderRadius:8,overflow:'hidden',background:C.cream,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
{(()=>{const img=item.image_url||item.imageUrl||allProds.find((p:any)=>p.sku===item.sku||p.id===item.id)?.image_url;return img?<img src={img} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:20}}>{item.emoji||'👕'}</span>})()}
              </div>
              <div style={{flex:1}}>
                <p style={{margin:'0 0 2px',fontSize:12,fontWeight:700,color:C.ink}}>{item.name}</p>
                <p style={{margin:'0 0 1px',fontSize:11,color:C.ink4}}>Size: <strong>{item.size||'-'}</strong> · Warna: <strong>{item.color||'-'}</strong></p>
                <p style={{margin:0,fontSize:11,color:C.ink4}}>SKU: {item.sku||'-'} · Qty: <strong>{item.qty||1}</strong></p>
              </div>
              <span style={{fontSize:12,fontWeight:700,color:C.ink,whiteSpace:'nowrap'}}>{fmt((item.price||0)*(item.qty||1))}</span>
            </div>
          ))}
          <div style={{display:'flex',justifyContent:'space-between',padding:'9px 0 0',borderTop:`1px solid ${C.ink}`,marginTop:2}}>
            <span style={{fontSize:13,fontWeight:700,color:C.ink}}>Total</span>
            <span style={{fontSize:15,fontWeight:800,color:C.g700}}>{fmt(selected.total)}</span>
          </div>
        </div>

        {/* STATUS UPDATE */}
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          <label style={{fontSize:11,fontWeight:600,color:C.ink4}}>Update Status Order</label>
          <select value={selected.status} onChange={e=>updateStatus(selected.id,e.target.value)} style={{padding:'9px 12px',border:`1px solid ${STATUS_COLOR[selected.status]||C.ink5}`,borderRadius:9,fontSize:13,fontFamily:'inherit',outline:'none',background:STATUS_BG[selected.status]||C.white,color:STATUS_COLOR[selected.status]||C.ink,fontWeight:700,cursor:'pointer'}}>
            {STATUS_ORDER.map(s=><option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </div>

        {/* PRINT BUTTONS */}
        <div style={{borderTop:`1px solid ${C.ink6}`,paddingTop:12,display:'flex',flexDirection:'column',gap:9}}>
          <p style={{margin:'0 0 4px',fontSize:11,fontWeight:700,color:C.ink4,letterSpacing:'0.06em',textTransform:'uppercase'}}>Print</p>
          <button onClick={()=>printPackingList(selected)} style={{padding:'9px',background:C.g50,border:`1px solid ${C.g200}`,borderRadius:9,fontSize:12,fontWeight:700,color:C.g700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:7}}>
            📋 Print Packing List
          </button>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <textarea value={manualProduct} onChange={e=>setManualProduct(e.target.value)} placeholder="Override isi paket (opsional)..." rows={2} style={{padding:'8px 10px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:11,fontFamily:'inherit',outline:'none',color:C.ink,resize:'none'}}/>
            <button onClick={()=>printLabel(selected)} style={{padding:'9px',background:C.g800,border:'none',borderRadius:9,fontSize:12,fontWeight:700,color:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:7}}>
              🏷️ Print Label Paket
            </button>
          </div>
          <p style={{margin:0,fontSize:10,color:C.ink4}}>Label berisi: Nama, Alamat, HP Customer + info pengirim. Bawa ke counter JNE untuk scan & kirim.</p>
        </div>
      </div>}
    </div>
  </div>
}

// ═══════════════════════════════════════════════════════════
// PRODUCT FORM TYPES & SHARED COMPONENT
// ═══════════════════════════════════════════════════════════
type PFData = {
  sku:string; name:string; hargaAwal:string; disc:string; hargaJual:string; hpp:string;
  weight:string;
  desc:string; sport:string; gender:string; extraSports:string;
  apparelColors:Record<string,string>;
  footwearColors:Record<string,string>;
  apparelOn:boolean; footwearOn:boolean;
  imgs:(string|null)[]; sizeGuideImg:string|null;
}
type PFStock = Record<string,number>

function mkPFData(ep?:any):PFData {
  const apparelSizes=['XS','S','M','L','XL','XXL','XXXL']
  const footSizes=['36','37','38','39','40','41','42','43','44','45']
  const apparelColors:Record<string,string>={}
  const footwearColors:Record<string,string>={}
  if(ep?.stock){
    Object.keys(ep.stock).forEach((k:string)=>{
      const [sz,...rest]=k.split('-')
      const color=rest.join('-')
      if(apparelSizes.includes(sz)) apparelColors[sz]=(apparelColors[sz]?apparelColors[sz]+',':'')+color
      else if(footSizes.includes(sz)) footwearColors[sz]=(footwearColors[sz]?footwearColors[sz]+',':'')+color
    })
  }
  const price=ep?.price||0
  const original=ep?.original_price||ep?.original||0
  const disc=original&&price?Math.round((1-price/original)*100):0
  return {
    sku:ep?.sku||'',name:ep?.name||'',
    hargaAwal:String(original||''),disc:String(disc||''),
    hargaJual:String(price||''),hpp:String(ep?.hpp||''),
    weight:String(ep?.weight||'500'),
    desc:ep?.description||ep?.desc||'',
    sport:ep?.sport||'Tennis',gender:ep?.gender||'Men',
    extraSports:(ep?.tags||[]).join(', '),
    apparelColors:Object.keys(apparelColors).length>0?apparelColors:{},
    footwearColors:Object.keys(footwearColors).length>0?footwearColors:{},
    apparelOn:ep?Object.keys(ep.stock||{}).some((k:string)=>['XS','S','M','L','XL','XXL','XXXL'].includes(k.split('-')[0])):true,
    footwearOn:ep?Object.keys(ep.stock||{}).some((k:string)=>['36','37','38','39','40','41','42','43','44','45'].includes(k.split('-')[0])):false,
    imgs:[ep?.image_url||null,...(ep?.gallery||[null,null,null,null])].slice(0,5) as (string|null)[],
    sizeGuideImg:ep?.size_guide_img||null,
  }
}

function mkPFStock(ep?:any):PFStock {
  if(!ep?.stock) return {}
  const res:PFStock={}
  Object.entries(ep.stock).forEach(([k,v])=>{res[k]=v as number})
  return res
}

function ProductForm({data,setData,stock,setStock,uploadFn,saving,onSave,onDelete,onCancel,isEdit}:{
  data:PFData,setData:(d:PFData)=>void,
  stock:PFStock,setStock:(s:PFStock)=>void,
  uploadFn:(f:File,name:string)=>Promise<string|null>,
  saving:boolean,onSave:()=>void,onDelete?:()=>void,onCancel:()=>void,isEdit:boolean
}){
  const [uploading,setUploading]=useState(false)
  const [uploadingSG,setUploadingSG]=useState(false)
  const [confirmDel,setConfirmDel]=useState(false)
  const APPAREL=['XS','S','M','L','XL','XXL','XXXL']
  const FOOTWEAR=['36','37','38','39','40','41','42','43','44','45']

  function onHargaAwalChange(val:string){
    const ha=parseInt(val)||0;const d=parseInt(data.disc)||0
    const hj=d>0?Math.round(ha*(1-d/100)):ha
    setData({...data,hargaAwal:val,hargaJual:hj>0?String(hj):''})
  }
  function onDiscChange(val:string){
    const ha=parseInt(data.hargaAwal)||0;const d=parseInt(val)||0
    const hj=ha>0&&d>0?Math.round(ha*(1-d/100)):ha
    setData({...data,disc:val,hargaJual:hj>0?String(hj):''})
  }
  function updateColors(size:string,colorStr:string,isFootwear:boolean){
    const newData={...data}
    if(isFootwear) newData.footwearColors={...data.footwearColors,[size]:colorStr}
    else newData.apparelColors={...data.apparelColors,[size]:colorStr}
    setData(newData)
    const newStock={...stock}
    Object.keys(newStock).forEach(k=>{if(k.startsWith(size+'-')||k===size)delete newStock[k]})
    const colors=colorStr.split(',').map(c=>c.trim()).filter(Boolean)
    colors.forEach(c=>{const key=`${size}-${c}`;if(!(key in newStock))newStock[key]=0})
    setStock(newStock)
  }
  function toggleSize(size:string,isFootwear:boolean){
    const newData={...data}
    const colorMap=isFootwear?{...data.footwearColors}:{...data.apparelColors}
    const newStock={...stock}
    if(size in colorMap){delete colorMap[size];Object.keys(newStock).forEach(k=>{if(k.startsWith(size+'-')||k===size)delete newStock[k]})}
    else{colorMap[size]=''}
    if(isFootwear) newData.footwearColors=colorMap; else newData.apparelColors=colorMap
    setData(newData);setStock(newStock)
  }
  const ha=parseInt(data.hargaAwal)||0,hj=parseInt(data.hargaJual)||0,hpp=parseInt(data.hpp)||0
  const laba=hj-hpp,labaPct=hj>0?Math.round(laba/hj*100):0
  async function handleUploadImg(file:File,idx:number){
    setUploading(true)
    const url=await uploadFn(file,`${data.sku||'prod'}-img${idx}-${Date.now()}`)
    if(url){const imgs=[...data.imgs];imgs[idx]=url;setData({...data,imgs})}
    setUploading(false)
  }
  async function handleUploadSG(file:File){
    setUploadingSG(true)
    const url=await uploadFn(file,`${data.sku||'prod'}-sg-${Date.now()}`)
    if(url)setData({...data,sizeGuideImg:url})
    setUploadingSG(false)
  }
  function SizeSection({sizes,colorMap,isFootwear}:{sizes:string[],colorMap:Record<string,string>,isFootwear:boolean}){
    return <div style={{display:'flex',flexDirection:'column',gap:10}}>
      {sizes.map(sz=>{
        const checked=sz in colorMap
        const colorStr=colorMap[sz]||''
        const colors=colorStr.split(',').map(c=>c.trim()).filter(Boolean)
        return <div key={sz} style={{background:C.white,borderRadius:9,padding:'10px 12px',border:`1px solid ${checked?C.g300:C.ink6}`}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:checked?8:0}}>
            <input type="checkbox" checked={checked} onChange={()=>toggleSize(sz,isFootwear)} style={{width:15,height:15,cursor:'pointer',accentColor:C.g700}}/>
            <span style={{fontSize:13,fontWeight:700,color:checked?C.ink:C.ink4,minWidth:36}}>{sz}</span>
            {checked&&<input value={colorStr} onChange={e=>updateColors(sz,e.target.value,isFootwear)} placeholder="Black, White, Navy" style={{flex:1,padding:'5px 9px',border:`1px solid ${C.ink5}`,borderRadius:7,fontSize:12,fontFamily:'inherit',outline:'none',color:C.ink}}/>}
          </div>
          {checked&&colors.length>0&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:7}}>
            {colors.map(c=>{
              const key=`${sz}-${c}`
              return <div key={key} style={{display:'flex',alignItems:'center',gap:6,background:C.cream,borderRadius:7,padding:'5px 9px'}}>
                <span style={{fontSize:11,fontWeight:600,color:C.ink2,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{sz} {c}</span>
                <button type="button" onClick={()=>setStock({...stock,[key]:Math.max(0,(stock[key]||0)-1)})} style={{width:20,height:20,borderRadius:4,background:C.ink6,border:'none',cursor:'pointer',fontSize:12,color:C.ink2,display:'flex',alignItems:'center',justifyContent:'center'}}>−</button>
                <span style={{fontSize:12,fontWeight:700,color:C.ink,minWidth:20,textAlign:'center'}}>{stock[key]||0}</span>
                <button type="button" onClick={()=>setStock({...stock,[key]:(stock[key]||0)+1})} style={{width:20,height:20,borderRadius:4,background:C.g100,border:'none',cursor:'pointer',fontSize:12,color:C.g700,display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
              </div>
            })}
          </div>}
          {checked&&colors.length===0&&<p style={{margin:0,fontSize:11,color:C.ink4,fontStyle:'italic'}}>Ketik warna di atas untuk menambah stok</p>}
        </div>
      })}
    </div>
  }
  return <div style={{display:'flex',flexDirection:'column',gap:14}}>
    {/* ① FOTO */}
    <div style={{background:C.cream,borderRadius:10,padding:'12px 14px'}}>
      <label style={{fontSize:12,fontWeight:700,color:C.ink3,display:'block',marginBottom:10}}>① Foto Produk</label>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        {[0,1,2,3,4].map(i=>(
          <div key={i} style={{display:'flex',flexDirection:'column',gap:4,alignItems:'center'}}>
            <div style={{width:i===0?90:64,height:i===0?90:64,borderRadius:9,overflow:'hidden',border:`2px ${data.imgs[i]?'solid '+C.g300:'dashed '+C.ink5}`,background:C.white,display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
              {data.imgs[i]?<><img src={data.imgs[i]!} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/><button type="button" onClick={()=>{const imgs=[...data.imgs];imgs[i]=null;setData({...data,imgs})}} style={{position:'absolute',top:2,right:2,width:15,height:15,borderRadius:'50%',background:C.red,color:'#fff',border:'none',cursor:'pointer',fontSize:8}}>✕</button></>:<span style={{fontSize:i===0?24:18}}>📷</span>}
              {uploading&&<div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:9,color:'#fff'}}>⏳</span></div>}
            </div>
            <label style={{fontSize:9,color:C.g600,fontWeight:600,cursor:'pointer'}}>{i===0?'Utama':`Det.${i}`}<input type="file" accept="image/*" style={{display:'none'}} onChange={async e=>{const f=e.target.files?.[0];if(f)await handleUploadImg(f,i)}}/></label>
          </div>
        ))}
      </div>
      <p style={{margin:'6px 0 0',fontSize:10,color:C.ink4}}>Utama tampil di catalog. Det.1–4 jadi carousel di halaman produk.</p>
    </div>
    {/* ② SKU + ③ NAMA */}
    <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:11}}>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <label style={{fontSize:12,fontWeight:600,color:C.ink3}}>② SKU *</label>
        <input value={data.sku} onChange={e=>setData({...data,sku:e.target.value})} placeholder="TEA-TEN-001" disabled={isEdit} style={{padding:'9px 12px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:13,fontFamily:'inherit',outline:'none',color:isEdit?C.ink4:C.ink,background:isEdit?C.cream:C.white}}/>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <label style={{fontSize:12,fontWeight:600,color:C.ink3}}>③ Nama Produk *</label>
        <input value={data.name} onChange={e=>setData({...data,name:e.target.value})} placeholder="Court Precision Polo" style={{padding:'9px 12px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:13,fontFamily:'inherit',outline:'none',color:C.ink}}/>
      </div>
    </div>
    {/* ④ HARGA */}
    <div style={{background:C.cream,borderRadius:10,padding:'12px 14px'}}>
      <label style={{fontSize:12,fontWeight:700,color:C.ink3,display:'block',marginBottom:10}}>④ Harga</label>
      <div style={{display:'grid',gridTemplateColumns:'1fr 0.6fr 1fr 1fr',gap:9,marginBottom:10}}>
        {([['Harga Awal (Rp)','hargaAwal','890000',false,(v:string)=>onHargaAwalChange(v)],['Disc (%)','disc','20',false,(v:string)=>onDiscChange(v)],['Harga Jual (auto)','hargaJual','712000',true,null],['HPP / Modal (Rp)','hpp','280000',false,(v:string)=>setData({...data,hpp:v})]] as any[]).map((f:any)=>(
          <div key={f[1]} style={{display:'flex',flexDirection:'column',gap:4}}>
            <label style={{fontSize:10,fontWeight:600,color:C.ink4}}>{f[0]}</label>
            <input type="number" readOnly={f[3]} value={(data as any)[f[1]]} onChange={e=>f[4]&&f[4](e.target.value)} placeholder={f[2]} style={{padding:'8px 10px',border:`1px solid ${f[3]?C.g200:C.ink5}`,borderRadius:7,fontSize:13,fontFamily:'inherit',outline:'none',color:f[3]?C.g600:C.ink,background:f[3]?C.g50:C.white,fontWeight:f[3]?700:400}}/>
          </div>
        ))}
      </div>
      {hj>0&&hpp>0&&<div style={{display:'flex',gap:14,padding:'8px 12px',background:laba>0?C.g50:C.redBg,borderRadius:8,border:`1px solid ${laba>0?C.g200:C.redLight}`}}>
        <span style={{fontSize:12,color:C.ink3}}>Laba per unit:</span>
        <span style={{fontSize:13,fontWeight:800,color:laba>0?C.g700:C.red}}>{fmt(laba)}</span>
        <span style={{fontSize:11,color:laba>0?C.g500:C.red}}>({labaPct}% margin)</span>
      </div>}
      <div style={{display:'flex',alignItems:'flex-end',gap:10,marginTop:10}}>
        <div style={{display:'flex',flexDirection:'column',gap:4,flex:1}}>
          <label style={{fontSize:10,fontWeight:600,color:C.ink4}}>Berat Produk (gram)</label>
          <input type="number" min={1} value={data.weight} onChange={e=>setData({...data,weight:e.target.value})} placeholder="500" style={{padding:'8px 10px',border:`1px solid ${C.ink5}`,borderRadius:7,fontSize:13,fontFamily:'inherit',outline:'none',color:C.ink}}/>
        </div>
        <div style={{display:'flex',gap:5,paddingBottom:1}}>
          {[['Kaos','250'],['Celana','350'],['Jaket','500'],['Sepatu','800']].map(([l,w])=>(
            <button key={l} type="button" onClick={()=>setData({...data,weight:w})} style={{padding:'5px 8px',borderRadius:6,fontSize:10,fontWeight:600,cursor:'pointer',background:data.weight===w?C.g800:C.cream,color:data.weight===w?'#fff':C.ink2,border:`1px solid ${data.weight===w?C.g800:C.ink5}`,whiteSpace:'nowrap'}}>{l}<br/>{w}g</button>
          ))}
        </div>
      </div>
    </div>
    {/* SPORT & GENDER */}
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:11}}>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <label style={{fontSize:12,fontWeight:600,color:C.ink3}}>Sport</label>
        <select value={data.sport} onChange={e=>setData({...data,sport:e.target.value})} style={{padding:'9px 12px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:13,fontFamily:'inherit',outline:'none',color:C.ink}}>
          {['Tennis','Badminton','Padel','Hyrox','Gym','Running','Golf','Pilates','Yoga','Footwear','Aksesoris','Lainnya'].map(s=><option key={s}>{s}</option>)}
        </select>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        <label style={{fontSize:12,fontWeight:600,color:C.ink3}}>Gender</label>
        <select value={data.gender} onChange={e=>setData({...data,gender:e.target.value})} style={{padding:'9px 12px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:13,fontFamily:'inherit',outline:'none',color:C.ink}}>
          {['Men','Women','Unisex'].map(s=><option key={s}>{s}</option>)}
        </select>
      </div>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:4}}>
      <label style={{fontSize:12,fontWeight:600,color:C.ink3}}>Sport Tambahan (pisahkan koma)</label>
      <input value={data.extraSports} onChange={e=>setData({...data,extraSports:e.target.value})} placeholder="Gym, Running" style={{padding:'9px 12px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:13,fontFamily:'inherit',outline:'none',color:C.ink}}/>
    </div>
    {/* ⑤ DESKRIPSI */}
    <div style={{display:'flex',flexDirection:'column',gap:4}}>
      <label style={{fontSize:12,fontWeight:600,color:C.ink3}}>⑤ Deskripsi</label>
      <textarea value={data.desc} onChange={e=>setData({...data,desc:e.target.value})} rows={3} placeholder="Deskripsi produk..." style={{padding:'9px 12px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:13,fontFamily:'inherit',outline:'none',color:C.ink,resize:'vertical'}}/>
    </div>
    {/* ⑥ SIZE GUIDE */}
    <div style={{background:C.cream,borderRadius:10,padding:'12px 14px'}}>
      <label style={{fontSize:12,fontWeight:700,color:C.ink3,display:'block',marginBottom:8}}>⑥ Size Guide</label>
      <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
        <div style={{width:80,height:80,borderRadius:9,overflow:'hidden',border:`2px ${data.sizeGuideImg?'solid '+C.g300:'dashed '+C.ink5}`,background:C.white,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          {data.sizeGuideImg?<img src={data.sizeGuideImg} alt="sg" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:24}}>📐</span>}
        </div>
        <div style={{flex:1}}>
          <label style={{display:'block',padding:'8px 14px',background:uploadingSG?C.ink5:C.g800,color:'#fff',borderRadius:8,fontSize:12,fontWeight:600,cursor:uploadingSG?'not-allowed':'pointer',textAlign:'center',marginBottom:5}}>
            {uploadingSG?'Uploading...':'📤 Upload Size Guide'}
            <input type="file" accept="image/*" disabled={uploadingSG} style={{display:'none'}} onChange={async e=>{const f=e.target.files?.[0];if(f)handleUploadSG(f)}}/>
          </label>
          {data.sizeGuideImg&&<button type="button" onClick={()=>setData({...data,sizeGuideImg:null})} style={{width:'100%',padding:'5px',background:'none',border:`1px solid ${C.ink5}`,borderRadius:7,fontSize:11,color:C.red,cursor:'pointer'}}>Hapus</button>}
        </div>
      </div>
    </div>
    {/* ⑦ BAJU */}
    <div style={{background:C.cream,borderRadius:10,padding:'12px 14px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:data.apparelOn?12:0}}>
        <label style={{fontSize:12,fontWeight:700,color:C.ink3}}>⑦ Ukuran Baju (XS–XXXL)</label>
        <div onClick={()=>setData({...data,apparelOn:!data.apparelOn})} style={{width:36,height:20,borderRadius:10,background:data.apparelOn?C.g600:C.ink5,position:'relative',cursor:'pointer',transition:'background 0.2s',flexShrink:0}}>
          <div style={{position:'absolute',top:2,left:data.apparelOn?16:2,width:16,height:16,borderRadius:'50%',background:'#fff',transition:'left 0.2s'}}/>
        </div>
      </div>
      {data.apparelOn&&<SizeSection sizes={APPAREL} colorMap={data.apparelColors} isFootwear={false}/>}
    </div>
    {/* ⑧ SEPATU */}
    <div style={{background:C.cream,borderRadius:10,padding:'12px 14px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:data.footwearOn?12:0}}>
        <label style={{fontSize:12,fontWeight:700,color:C.ink3}}>⑧ Ukuran Kaki (36–45)</label>
        <div onClick={()=>setData({...data,footwearOn:!data.footwearOn})} style={{width:36,height:20,borderRadius:10,background:data.footwearOn?C.g600:C.ink5,position:'relative',cursor:'pointer',transition:'background 0.2s',flexShrink:0}}>
          <div style={{position:'absolute',top:2,left:data.footwearOn?16:2,width:16,height:16,borderRadius:'50%',background:'#fff',transition:'left 0.2s'}}/>
        </div>
      </div>
      {data.footwearOn&&<SizeSection sizes={FOOTWEAR} colorMap={data.footwearColors} isFootwear={true}/>}
    </div>
    {/* DELETE */}
    {confirmDel&&onDelete&&<div style={{background:C.redBg,border:`1px solid ${C.redLight}`,borderRadius:10,padding:'12px 14px'}}>
      <p style={{margin:'0 0 8px',fontSize:13,fontWeight:700,color:C.red}}>⚠️ Hapus produk ini?</p>
      <div style={{display:'flex',gap:8}}>
        <button onClick={()=>setConfirmDel(false)} style={{flex:1,padding:'8px',background:'none',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:12,fontWeight:600,color:C.ink2,cursor:'pointer'}}>Batal</button>
        <button onClick={onDelete} style={{flex:1,padding:'8px',background:C.red,color:'#fff',border:'none',borderRadius:8,fontSize:12,fontWeight:700,cursor:'pointer'}}>Ya, Hapus</button>
      </div>
    </div>}
    {/* BUTTONS */}
    <div style={{display:'flex',gap:9,justifyContent:'space-between',paddingTop:4,borderTop:`1px solid ${C.ink6}`}}>
      {isEdit&&onDelete?<button onClick={()=>setConfirmDel(true)} style={{padding:'10px 16px',background:C.redBg,border:`1px solid ${C.redLight}`,borderRadius:9,fontSize:13,fontWeight:600,color:C.red,cursor:'pointer'}}>🗑️ Hapus</button>:<div/>}
      <div style={{display:'flex',gap:9}}>
        <button onClick={onCancel} style={{padding:'10px 18px',background:'none',border:`1px solid ${C.ink5}`,borderRadius:9,fontSize:13,fontWeight:600,color:C.ink2,cursor:'pointer'}}>Batal</button>
        <button onClick={onSave} disabled={saving} style={{padding:'10px 22px',background:saving?C.ink5:C.g800,color:'#fff',border:'none',borderRadius:9,fontSize:13,fontWeight:700,cursor:saving?'not-allowed':'pointer'}}>{saving?'Menyimpan...':(isEdit?'Simpan Perubahan':'+ Tambah Produk')}</button>
      </div>
    </div>
  </div>
}

function EditProductModal({product:ep,onSave,onDelete,onClose,uploadImageFn}:{product:any,onSave:(id:string,data:any)=>void,onDelete:(id:string)=>void,onClose:()=>void,uploadImageFn:(f:File,sku:string)=>Promise<string|null>}){
  const [data,setData]=useState<PFData>(()=>mkPFData(ep))
  const [stock,setStock]=useState<PFStock>(()=>mkPFStock(ep))
  const [saving,setSaving]=useState(false)
  async function handleSave(){
    setSaving(true)
    const allSizes=[...Object.keys(data.apparelColors),...Object.keys(data.footwearColors)]
    const colorsArr=Array.from(new Set(Object.values({...data.apparelColors,...data.footwearColors}).join(',').split(',').map((c:string)=>c.trim()).filter(Boolean)))
    const payload={name:data.name,price:parseInt(data.hargaJual)||0,original:data.hargaAwal?parseInt(data.hargaAwal):null,hpp:parseInt(data.hpp)||0,description:data.desc,sport:data.sport,gender:data.gender,tags:data.extraSports?data.extraSports.split(',').map((s:string)=>s.trim()).filter(Boolean):[],sizes:allSizes,colors:colorsArr,weight:parseInt(data.weight)||500,image_url:data.imgs[0]||ep.image_url,gallery:data.imgs.filter(Boolean),size_guide_img:data.sizeGuideImg,stock}
    await fetch(`/api/products/${ep.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    onSave(ep.id,{...ep,...payload,stock})
    setSaving(false);onClose()
  }
  return <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.45)',display:'flex',alignItems:'center',justifyContent:'center',padding:12}}>
    <div style={{background:C.white,borderRadius:16,width:'min(600px,98vw)',maxHeight:'92vh',overflowY:'auto',padding:'20px 22px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <h3 style={{margin:0,fontSize:16,fontWeight:700,color:C.ink}}>Edit Produk</h3>
        <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',fontSize:18,color:C.ink3}}>✕</button>
      </div>
      <ProductForm data={data} setData={setData} stock={stock} setStock={setStock} uploadFn={uploadImageFn} saving={saving} onSave={handleSave} onDelete={()=>{fetch(`/api/products/${ep.id}`,{method:'DELETE'});onDelete(ep.id);onClose()}} onCancel={onClose} isEdit={true}/>
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
  const [addData,setAddData]=useState<PFData>(()=>mkPFData())
  const [addStock,setAddStock]=useState<PFStock>({})
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

  const [addSaving,setAddSaving]=useState(false)
  async function handleAddProduct(){
    if(!addData.name||!addData.sku||!addData.hargaJual){alert('Isi nama, SKU, dan harga dulu.');return}
    setAddSaving(true)
    try{
      const allSizes=[...Object.keys(addData.apparelColors),...Object.keys(addData.footwearColors)]
      const colorsArr=Array.from(new Set(Object.values({...addData.apparelColors,...addData.footwearColors}).join(',').split(',').map((c:string)=>c.trim()).filter(Boolean)))
      const tagsArr=addData.extraSports?addData.extraSports.split(',').map((s:string)=>s.trim()).filter(Boolean):[]
      const imageUrl=addData.imgs[0]||null
      const galleryUrls=addData.imgs.filter(Boolean)
      const res=await fetch('/api/products',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        name:addData.name,sku:addData.sku,sport:addData.sport,gender:addData.gender,
        price:parseInt(addData.hargaJual)||0,hpp:parseInt(addData.hpp)||0,
        original:addData.hargaAwal?parseInt(addData.hargaAwal):null,
        desc:addData.desc,sizes:allSizes,colors:colorsArr,
        tags:tagsArr,image_url:imageUrl,gallery:galleryUrls,
        weight:parseInt(addData.weight)||500,
        size_guide_img:addData.sizeGuideImg,
        initial_stock:addStock
      })})
      const d=await res.json()
      if(res.ok){
        if(d.data) setProducts((p:any[])=>[...p,{...d.data,stock:addStock,status:'active',image_url:imageUrl}])
        setShowAdd(false)
        setAddData(mkPFData())
        setAddStock({})
      } else { alert('Gagal: '+(d.error||'Unknown')) }
    }catch(e:any){alert('Error: '+e.message)}
    finally{setAddSaving(false)}
  }

  return <div style={{display:'flex',flexDirection:'column',gap:16}}>
    {editProd&&<EditProductModal product={editProd} onSave={saveProduct} onDelete={(id:string)=>setProducts((p:any[])=>p.filter((x:any)=>x.id!==id))} onClose={()=>setEditProd(null)} uploadImageFn={uploadImage}/>}
    {showAdd&&(
      <div style={{background:C.white,border:`1px solid ${C.ink5}`,borderRadius:16,padding:'18px 20px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <h3 style={{margin:0,fontSize:16,fontWeight:700,color:C.ink}}>Tambah Produk Baru</h3>
          <button onClick={()=>setShowAdd(false)} style={{background:'none',border:'none',cursor:'pointer',fontSize:18,color:C.ink3}}>✕</button>
        </div>
        <ProductForm data={addData} setData={setAddData} stock={addStock} setStock={setAddStock} uploadFn={uploadImage} saving={addSaving} onSave={handleAddProduct} onCancel={()=>setShowAdd(false)} isEdit={false}/>
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
              <td style={{padding:'10px 13px'}}><div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:44,height:44,borderRadius:8,overflow:'hidden',background:C.cream,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {p.image_url?<img src={p.image_url} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:20}}>{p.emoji}</span>}
                </div>
                <div><p style={{margin:'0 0 1px',fontSize:13,fontWeight:700,color:C.ink}}>{p.name}</p><p style={{margin:0,fontSize:10,color:C.ink4}}>{p.gender}</p></div>
              </div></td>
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

function AdminFinancial({orders=[],products=[]}:{orders?:any[],products?:any[]}) {
  const [unlocked,setUnlocked]=useState(false)
  const [pin,setPin]=useState('')
  const [error,setError]=useState('')
  const [shake,setShake]=useState(false)
  const [tab,setTab]=useState('summary')
  const [period,setPeriod]=useState('all')

  function pressPin(d:string){
    if(pin.length>=6)return
    const next=pin+d;setPin(next);setError('')
    if(next.length===6){setTimeout(()=>{
      if(next===SUPERIOR_PIN){setUnlocked(true)}
      else{setShake(true);setTimeout(()=>{setShake(false);setPin('');setError('PIN salah')},600)}
    },200)}
  }

  // Compute from REAL orders data
  const paidOrders=orders.filter((o:any)=>['processing','shipped','delivered'].includes(o.status))
  const revenue=paidOrders.reduce((s:number,o:any)=>s+(o.total||0),0)
  const shippingRevenue=paidOrders.reduce((s:number,o:any)=>s+(o.shipping_cost||0),0)
  const productRevenue=revenue-shippingRevenue

  // HPP from products matched to order items
  function getHPP(o:any){
    const items=Array.isArray(o.items)?o.items:(typeof o.items==='string'?JSON.parse(o.items||'[]'):[])
    return items.reduce((s:number,item:any)=>{
      const prod=products.find((p:any)=>p.sku===item.sku||p.id===item.id)
      const hpp=(prod?.hpp||0)*(item.qty||1)
      return s+hpp
    },0)
  }
  const totalHPP=paidOrders.reduce((s:number,o:any)=>s+getHPP(o),0)
  const grossProfit=productRevenue-totalHPP
  const grossMargin=productRevenue>0?Math.round(grossProfit/productRevenue*100):0

  // Monthly breakdown
  const monthlyData=MONTHS.map(m=>{
    const mOrders=paidOrders.filter((o:any)=>{
      const d=new Date(o.date||o.created_at||'')
      return !isNaN(d.getTime())&&['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]===m
    })
    const rev=mOrders.reduce((s:number,o:any)=>s+(o.total||0),0)
    const hpp=mOrders.reduce((s:number,o:any)=>s+getHPP(o),0)
    return {month:MONTH_ID[m]||m,rev,hpp,profit:rev-hpp,orders:mOrders.length}
  }).filter(m=>m.orders>0)

  // Product performance
  const prodPerf:Record<string,{name:string,sku:string,qty:number,revenue:number,hpp:number}>={}
  paidOrders.forEach((o:any)=>{
    const items=Array.isArray(o.items)?o.items:(typeof o.items==='string'?JSON.parse(o.items||'[]'):[])
    items.forEach((item:any)=>{
      const key=item.sku||item.id||item.name
      if(!prodPerf[key]) prodPerf[key]={name:item.name,sku:item.sku||'-',qty:0,revenue:0,hpp:0}
      const prod=products.find((p:any)=>p.sku===item.sku||p.id===item.id)
      prodPerf[key].qty+=(item.qty||1)
      prodPerf[key].revenue+=(item.price||0)*(item.qty||1)
      prodPerf[key].hpp+=(prod?.hpp||0)*(item.qty||1)
    })
  })
  const topProducts=Object.values(prodPerf).sort((a:any,b:any)=>b.revenue-a.revenue).slice(0,10)

  if(!unlocked) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:400,gap:20}}>
      <div style={{textAlign:'center',marginBottom:8}}>
        <div style={{fontSize:36,marginBottom:8}}>🔐</div>
        <h3 style={{margin:'0 0 4px',fontSize:18,fontWeight:700,color:C.ink}}>Financial Report</h3>
        <p style={{margin:0,fontSize:13,color:C.ink4}}>Masukkan PIN untuk akses laporan keuangan</p>
      </div>
      <div style={{display:'flex',gap:10,marginBottom:4}}>
        {[0,1,2,3,4,5].map(i=><div key={i} style={{width:14,height:14,borderRadius:'50%',background:pin.length>i?C.g700:C.ink6,transition:'background 0.15s'}}/>)}
      </div>
      {error&&<p style={{margin:0,fontSize:12,color:C.red,fontWeight:600}}>{error}</p>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,72px)',gap:10,animation:shake?'shake 0.6s':''}} >
        {['1','2','3','4','5','6','7','8','9','','0','⌫'].map(d=>(
          <button key={d} onClick={()=>d==='⌫'?setPin(p=>p.slice(0,-1)):d?pressPin(d):null} disabled={!d} style={{height:72,borderRadius:14,background:d?C.white:C.cream,border:`1px solid ${C.ink5}`,fontSize:d==='⌫'?20:22,fontWeight:600,cursor:d?'pointer':'default',color:C.ink,transition:'all 0.1s'}}>{d}</button>
        ))}
      </div>
    </div>
  )

  const hasData=paidOrders.length>0

  return <div style={{display:'flex',flexDirection:'column',gap:16}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <h3 style={{margin:0,fontSize:16,fontWeight:700,color:C.ink}}>📊 Financial Report</h3>
      <button onClick={()=>{setUnlocked(false);setPin('')}} style={{padding:'6px 12px',background:C.cream,border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:11,fontWeight:600,color:C.ink3,cursor:'pointer'}}>🔒 Lock</button>
    </div>

    {!hasData&&<div style={{background:C.amberBg,border:`1px solid ${C.amber}30`,borderRadius:12,padding:'20px',textAlign:'center'}}>
      <div style={{fontSize:32,marginBottom:8}}>📭</div>
      <p style={{margin:'0 0 4px',fontSize:14,fontWeight:700,color:C.amber}}>Belum ada data transaksi</p>
      <p style={{margin:0,fontSize:12,color:C.ink4}}>Data laporan akan muncul otomatis setelah ada order dengan status Paid (Processing/Shipped/Done)</p>
    </div>}

    {hasData&&<>
      {/* SUMMARY CARDS */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12}}>
        {[
          {l:'Total Revenue',v:fmt(revenue),sub:`${paidOrders.length} order paid`,col:C.g700,bg:'#D1FAE5'},
          {l:'HPP / Modal',v:fmt(totalHPP),sub:'Cost of goods sold',col:C.amber,bg:C.amberBg},
          {l:'Gross Profit',v:fmt(grossProfit),sub:`${grossMargin}% margin`,col:grossProfit>0?C.g700:C.red,bg:grossProfit>0?'#D1FAE5':C.redBg},
          {l:'Ongkir Collected',v:fmt(shippingRevenue),sub:'Total biaya kirim customer',col:C.blue,bg:C.blueBg},
        ].map(card=>(
          <div key={card.l} style={{background:card.bg,borderRadius:12,padding:'16px 18px',border:`1px solid ${card.col}20`}}>
            <p style={{margin:'0 0 4px',fontSize:10,fontWeight:700,color:C.ink4,letterSpacing:'0.06em',textTransform:'uppercase'}}>{card.l}</p>
            <p style={{margin:'0 0 2px',fontSize:22,fontWeight:800,color:card.col}}>{card.v}</p>
            <p style={{margin:0,fontSize:11,color:C.ink4}}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{display:'flex',gap:7}}>
        {[['summary','📋 Summary'],['monthly','📅 Per Bulan'],['products','📦 Per Produk'],['orders','🧾 Order List']].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{padding:'7px 14px',borderRadius:9,fontSize:12,fontWeight:tab===id?700:500,cursor:'pointer',background:tab===id?C.g800:C.white,color:tab===id?'#fff':C.ink2,border:`1px solid ${tab===id?C.g800:C.ink5}`}}>{label}</button>
        ))}
      </div>

      {/* SUMMARY TAB */}
      {tab==='summary'&&<div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:12,padding:'18px 20px'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
          <tbody>
            {[
              ['Total Orders Paid',String(paidOrders.length)+' order'],
              ['Gross Revenue',fmt(revenue)],
              ['Shipping Revenue',fmt(shippingRevenue)],
              ['Product Revenue',fmt(productRevenue)],
              ['',''],
              ['Total HPP',fmt(totalHPP)],
              ['Gross Profit',fmt(grossProfit)],
              ['Gross Margin',grossMargin+'%'],
            ].map(([l,v],i)=>l?
              <tr key={i} style={{borderBottom:`1px solid ${C.ink6}`,background:l.includes('Profit')||l.includes('Margin')?'#F0FDF4':C.white}}>
                <td style={{padding:'10px 14px',color:C.ink3,fontWeight:500}}>{l}</td>
                <td style={{padding:'10px 14px',textAlign:'right',fontWeight:700,color:l.includes('Profit')?C.g700:C.ink}}>{v}</td>
              </tr>
              :<tr key={i}><td colSpan={2} style={{padding:'4px'}}></td></tr>
            )}
          </tbody>
        </table>
      </div>}

      {/* MONTHLY TAB */}
      {tab==='monthly'&&<div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:12,overflow:'auto'}}>
        {monthlyData.length===0
          ?<p style={{padding:'24px',textAlign:'center',color:C.ink4,margin:0}}>Belum ada data per bulan</p>
          :<table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
            <thead><tr style={{background:C.g800,color:'#fff'}}>
              {['Bulan','Orders','Revenue','HPP','Gross Profit','Margin'].map(h=><th key={h} style={{padding:'10px 14px',textAlign:h==='Bulan'?'left':'right',fontWeight:600,fontSize:11}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {monthlyData.map((m:any,i:number)=>{
                const margin=m.rev>0?Math.round(m.profit/m.rev*100):0
                return <tr key={m.month} style={{borderBottom:`1px solid ${C.ink6}`,background:i%2===0?C.white:C.cream}}>
                  <td style={{padding:'10px 14px',fontWeight:600,color:C.ink}}>{m.month}</td>
                  <td style={{padding:'10px 14px',textAlign:'right',color:C.ink3}}>{m.orders}</td>
                  <td style={{padding:'10px 14px',textAlign:'right',fontWeight:700,color:C.ink}}>{fmt(m.rev)}</td>
                  <td style={{padding:'10px 14px',textAlign:'right',color:C.amber}}>{fmt(m.hpp)}</td>
                  <td style={{padding:'10px 14px',textAlign:'right',fontWeight:700,color:m.profit>0?C.g700:C.red}}>{fmt(m.profit)}</td>
                  <td style={{padding:'10px 14px',textAlign:'right',color:margin>30?C.g700:margin>15?C.amber:C.red}}>{margin}%</td>
                </tr>
              })}
            </tbody>
          </table>
        }
      </div>}

      {/* PRODUCTS TAB */}
      {tab==='products'&&<div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:12,overflow:'auto'}}>
        {topProducts.length===0
          ?<p style={{padding:'24px',textAlign:'center',color:C.ink4,margin:0}}>Belum ada data produk</p>
          :<table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
            <thead><tr style={{background:C.g800,color:'#fff'}}>
              {['SKU','Nama Produk','Qty Terjual','Revenue','HPP','Profit','Margin'].map(h=><th key={h} style={{padding:'10px 14px',textAlign:h==='SKU'||h==='Nama Produk'?'left':'right',fontWeight:600,fontSize:11}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {topProducts.map((p:any,i:number)=>{
                const margin=p.revenue>0?Math.round(p.profit/p.revenue*100):0
                return <tr key={p.sku} style={{borderBottom:`1px solid ${C.ink6}`,background:i%2===0?C.white:C.cream}}>
                  <td style={{padding:'10px 14px',fontSize:11,color:C.ink4,fontFamily:'monospace'}}>{p.sku}</td>
                  <td style={{padding:'10px 14px',fontWeight:600,color:C.ink}}>{p.name}</td>
                  <td style={{padding:'10px 14px',textAlign:'right',fontWeight:700,color:C.g700}}>{p.qty}</td>
                  <td style={{padding:'10px 14px',textAlign:'right',color:C.ink}}>{fmt(p.revenue)}</td>
                  <td style={{padding:'10px 14px',textAlign:'right',color:C.amber}}>{fmt(p.hpp)}</td>
                  <td style={{padding:'10px 14px',textAlign:'right',fontWeight:700,color:p.profit>0?C.g700:C.red}}>{fmt(p.profit)}</td>
                  <td style={{padding:'10px 14px',textAlign:'right',color:margin>30?C.g700:margin>15?C.amber:C.red}}>{margin}%</td>
                </tr>
              })}
            </tbody>
          </table>
        }
      </div>}

      {/* ORDERS TAB */}
      {tab==='orders'&&<div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:12,overflow:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
          <thead><tr style={{background:C.g800,color:'#fff'}}>
            {['Order ID','Tanggal','Customer','Payment','Subtotal','Ongkir','Total','HPP','Profit'].map(h=><th key={h} style={{padding:'10px 12px',textAlign:h==='Order ID'||h==='Tanggal'||h==='Customer'||h==='Payment'?'left':'right',fontWeight:600,fontSize:11,whiteSpace:'nowrap'}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {paidOrders.map((o:any,i:number)=>{
              const hpp=getHPP(o)
              const profit=(o.total||0)-hpp
              return <tr key={o.id} style={{borderBottom:`1px solid ${C.ink6}`,background:i%2===0?C.white:C.cream}}>
                <td style={{padding:'9px 12px',fontWeight:700,color:C.g700,fontSize:12}}>{o.id}</td>
                <td style={{padding:'9px 12px',color:C.ink3,fontSize:11,whiteSpace:'nowrap'}}>{o.date&&!isNaN(new Date(o.date).getTime())?new Date(o.date).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'2-digit'}):'-'}</td>
                <td style={{padding:'9px 12px',fontWeight:600,color:C.ink}}>{o.customerName||'-'}</td>
                <td style={{padding:'9px 12px',fontSize:11,color:C.ink3}}>{o.payment||'-'}</td>
                <td style={{padding:'9px 12px',textAlign:'right',color:C.ink}}>{fmt((o.total||0)-(o.shipping_cost||0))}</td>
                <td style={{padding:'9px 12px',textAlign:'right',color:C.ink3}}>{fmt(o.shipping_cost||0)}</td>
                <td style={{padding:'9px 12px',textAlign:'right',fontWeight:700,color:C.ink}}>{fmt(o.total||0)}</td>
                <td style={{padding:'9px 12px',textAlign:'right',color:C.amber}}>{fmt(hpp)}</td>
                <td style={{padding:'9px 12px',textAlign:'right',fontWeight:700,color:profit>0?C.g700:C.red}}>{fmt(profit)}</td>
              </tr>
            })}
          </tbody>
        </table>
      </div>}
    </>}
  </div>
}

function AdminContent() {
  const [tab,setTab]=useState('announcement')
  const [announcement,setAnnouncement]=useState(SITE_CONTENT.announcement.replace(/<[^>]+>/g,'').replace(/&#39;/g,"'"))
  const [annSaved,setAnnSaved]=useState(false)
  const [slides,setSlides]=useState(HERO_SLIDES.map(s=>({...s})))
  const [activeSlide,setActiveSlide]=useState(0)
  const [uploadingSlide,setUploadingSlide]=useState(false)
  const [athletes,setAthletes]=useState(SITE_CONTENT.athletes.map(a=>({...a})))
  const [about,setAbout]=useState({title:SITE_CONTENT.aboutTitle,subtitle:SITE_CONTENT.aboutSubtitle,desc:SITE_CONTENT.aboutDesc,mission:SITE_CONTENT.aboutMission})
  const [saved,setSaved]=useState(false)
  const [uploadingAth,setUploadingAth]=useState<number|null>(null)

  async function uploadFile(file:File, path:string):Promise<string|null>{
    try{
      const {createClient}=await import('@supabase/supabase-js')
      const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
      const {error}=await sb.storage.from('product-images').upload(path,file,{upsert:true})
      if(error)throw error
      const {data}=sb.storage.from('product-images').getPublicUrl(path)
      return data.publicUrl
    }catch(e){alert('Upload gagal: '+e);return null}
  }

  function saveAnn(){
    SITE_CONTENT.announcement=announcement
    setAnnSaved(true);setTimeout(()=>setAnnSaved(false),2500)
  }
  function saveAbout(){
    Object.assign(SITE_CONTENT,{aboutTitle:about.title,aboutSubtitle:about.subtitle,aboutDesc:about.desc,aboutMission:about.mission})
    setSaved(true);setTimeout(()=>setSaved(false),2500)
  }
  function saveAthletes(){
    SITE_CONTENT.athletes=[...athletes]
    setSaved(true);setTimeout(()=>setSaved(false),2500)
  }

  const TABS=[['announcement','📢 Announcement'],['carousel','🖼️ Hero Banner'],['athletes','🏅 Our Athletes'],['about','📖 About Us']]

  return <div style={{display:'flex',flexDirection:'column',gap:0}}>
    {/* TAB BAR */}
    <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>
      {TABS.map(([id,label])=>(
        <button key={id} onClick={()=>setTab(id)} style={{padding:'8px 16px',borderRadius:9,fontSize:12,fontWeight:tab===id?700:500,cursor:'pointer',background:tab===id?C.g800:C.white,color:tab===id?'#fff':C.ink2,border:`1px solid ${tab===id?C.g800:C.ink5}`}}>{label}</button>
      ))}
    </div>

    {/* ANNOUNCEMENT */}
    {tab==='announcement'&&<div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:14,padding:'22px'}}>
      <h3 style={{margin:'0 0 4px',fontSize:15,fontWeight:700,color:C.ink}}>📢 Announcement Bar</h3>
      <p style={{margin:'0 0 14px',fontSize:12,color:C.ink4}}>Teks hijau di paling atas website</p>
      <div style={{background:C.g800,borderRadius:9,padding:'10px 16px',marginBottom:14,textAlign:'center'}}>
        <span style={{fontSize:12,color:C.g100}}>{announcement}</span>
      </div>
      <textarea value={announcement} onChange={e=>setAnnouncement(e.target.value)} rows={3} style={{width:'100%',padding:'10px 12px',border:`1px solid ${C.ink5}`,borderRadius:9,fontSize:13,fontFamily:'inherit',outline:'none',color:C.ink,resize:'vertical',boxSizing:'border-box' as any}} placeholder="FREE SHIPPING di atas Rp 500.000..."/>
      <div style={{display:'flex',gap:10,alignItems:'center',marginTop:10}}>
        <button onClick={saveAnn} style={{padding:'9px 20px',background:C.g800,color:'#fff',border:'none',borderRadius:9,fontSize:13,fontWeight:700,cursor:'pointer'}}>{annSaved?'✓ Tersimpan!':'Simpan'}</button>
        <span style={{fontSize:11,color:C.ink4}}>Perubahan langsung aktif di sesi ini</span>
      </div>
    </div>}

    {/* HERO CAROUSEL */}
    {tab==='carousel'&&<div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:14,padding:'22px'}}>
      <h3 style={{margin:'0 0 4px',fontSize:15,fontWeight:700,color:C.ink}}>🖼️ Hero Banner (5 Slide)</h3>
      <p style={{margin:'0 0 16px',fontSize:12,color:C.ink4}}>Upload foto dan edit teks untuk setiap slide</p>
      <div style={{display:'flex',gap:7,marginBottom:18,flexWrap:'wrap'}}>
        {slides.map((s,i)=>(
          <button key={i} onClick={()=>setActiveSlide(i)} style={{padding:'7px 14px',borderRadius:8,fontSize:12,fontWeight:activeSlide===i?700:500,cursor:'pointer',background:activeSlide===i?C.g800:C.cream,color:activeSlide===i?'#fff':C.ink2,border:`1px solid ${activeSlide===i?C.g800:C.ink5}`}}>
            Slide {i+1}{s.image?' 📷':''}
          </button>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {(['label','title','titleItalic','subtitle','cta','emoji'] as const).map(k=>(
            <div key={k}>
              <label style={{fontSize:11,fontWeight:600,color:C.ink4,display:'block',marginBottom:3}}>{k==='label'?'Label kecil':k==='titleItalic'?'Judul italic (hijau)':k==='cta'?'Teks tombol':k==='emoji'?'Emoji (jika no foto)':k.charAt(0).toUpperCase()+k.slice(1)}</label>
              <input value={(slides[activeSlide] as any)[k]||''} onChange={e=>setSlides(prev=>prev.map((s,i)=>i===activeSlide?{...s,[k]:e.target.value}:s))} style={{width:'100%',padding:'8px 10px',border:`1px solid ${C.ink5}`,borderRadius:8,fontSize:12,fontFamily:'inherit',outline:'none',color:C.ink,boxSizing:'border-box' as any}}/>
            </div>
          ))}
        </div>
        <div>
          <div style={{height:160,background:C.g800,borderRadius:12,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:10,position:'relative'}}>
            {slides[activeSlide].image
              ?<><img src={slides[activeSlide].image!} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/><button onClick={()=>setSlides(prev=>prev.map((s,i)=>i===activeSlide?{...s,image:null}:s))} style={{position:'absolute',top:8,right:8,background:'rgba(0,0,0,0.5)',color:'#fff',border:'none',borderRadius:6,padding:'3px 8px',fontSize:11,cursor:'pointer'}}>✕</button></>
              :<span style={{fontSize:52}}>{slides[activeSlide].emoji}</span>
            }
          </div>
          <input type="file" accept="image/*" id={`sl-${activeSlide}`} style={{display:'none'}} onChange={async e=>{
            const f=e.target.files?.[0];if(!f)return
            setUploadingSlide(true)
            const url=await uploadFile(f,`banners/slide-${activeSlide+1}-${Date.now()}.${f.name.split('.').pop()}`)
            if(url)setSlides(prev=>prev.map((s,i)=>i===activeSlide?{...s,image:url}:s))
            setUploadingSlide(false)
          }}/>
          <label htmlFor={`sl-${activeSlide}`} style={{display:'block',padding:'10px',background:uploadingSlide?C.ink5:C.g50,color:uploadingSlide?C.ink4:C.g700,border:`1px solid ${C.g200}`,borderRadius:9,fontSize:13,fontWeight:600,cursor:uploadingSlide?'not-allowed':'pointer',textAlign:'center'}}>
            {uploadingSlide?'⏳ Uploading...':'📤 Upload Foto Banner'}
          </label>
          <p style={{margin:'6px 0 0',fontSize:10,color:C.ink4}}>Rekomendasi: 1440×600px JPG/PNG</p>
        </div>
      </div>
      <div style={{borderTop:`1px solid ${C.ink6}`,paddingTop:14,marginTop:16}}>
        <p style={{margin:0,fontSize:11,color:C.ink4}}>💡 Foto tersimpan di Supabase Storage. Untuk teks permanen, update array HERO_SLIDES di kode setelah deploy.</p>
      </div>
    </div>}

    {/* OUR ATHLETES */}
    {tab==='athletes'&&<div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:14,padding:'22px'}}>
      <h3 style={{margin:'0 0 4px',fontSize:15,fontWeight:700,color:C.ink}}>🏅 Our Athletes</h3>
      <p style={{margin:'0 0 16px',fontSize:12,color:C.ink4}}>Testimoni athlete yang tampil di landing page & halaman Our Athletes</p>
      {athletes.map((a,idx)=>(
        <div key={a.id} style={{background:C.cream,borderRadius:12,padding:'16px',marginBottom:12}}>
          <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
            {/* PHOTO */}
            <div style={{flexShrink:0}}>
              <div style={{width:60,height:60,borderRadius:'50%',overflow:'hidden',background:C.g100,border:`2px solid ${C.g200}`,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:6}}>
                {a.img?<img src={a.img} alt={a.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span style={{fontSize:16,fontWeight:700,color:C.g700}}>{a.initials}</span>}
              </div>
              <input type="file" accept="image/*" id={`ath-${idx}`} style={{display:'none'}} onChange={async e=>{
                const f=e.target.files?.[0];if(!f)return
                setUploadingAth(idx)
                const url=await uploadFile(f,`athletes/ath-${idx+1}-${Date.now()}.${f.name.split('.').pop()}`)
                if(url)setAthletes(prev=>prev.map((at,i)=>i===idx?{...at,img:url}:at))
                setUploadingAth(null)
              }}/>
              <label htmlFor={`ath-${idx}`} style={{display:'block',fontSize:9,color:C.g600,fontWeight:600,cursor:'pointer',textAlign:'center'}}>{uploadingAth===idx?'..':'📷 Foto'}</label>
            </div>
            {/* FIELDS */}
            <div style={{flex:1,display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {(['name','sport','initials'] as const).map(k=>(
                <div key={k}>
                  <label style={{fontSize:10,fontWeight:600,color:C.ink4,display:'block',marginBottom:2}}>{k.charAt(0).toUpperCase()+k.slice(1)}</label>
                  <input value={a[k]||''} onChange={e=>setAthletes(prev=>prev.map((at,i)=>i===idx?{...at,[k]:e.target.value}:at))} style={{width:'100%',padding:'6px 9px',border:`1px solid ${C.ink5}`,borderRadius:7,fontSize:12,fontFamily:'inherit',outline:'none',color:C.ink,boxSizing:'border-box' as any}}/>
                </div>
              ))}
              <div style={{gridColumn:'1/-1'}}>
                <label style={{fontSize:10,fontWeight:600,color:C.ink4,display:'block',marginBottom:2}}>Quote</label>
                <textarea value={a.quote} onChange={e=>setAthletes(prev=>prev.map((at,i)=>i===idx?{...at,quote:e.target.value}:at))} rows={2} style={{width:'100%',padding:'6px 9px',border:`1px solid ${C.ink5}`,borderRadius:7,fontSize:12,fontFamily:'inherit',outline:'none',color:C.ink,resize:'vertical',boxSizing:'border-box' as any}}/>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button onClick={saveAthletes} style={{padding:'9px 20px',background:C.g800,color:'#fff',border:'none',borderRadius:9,fontSize:13,fontWeight:700,cursor:'pointer'}}>{saved?'✓ Tersimpan!':'Simpan Semua'}</button>
    </div>}

    {/* ABOUT US */}
    {tab==='about'&&<div style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:14,padding:'22px'}}>
      <h3 style={{margin:'0 0 4px',fontSize:15,fontWeight:700,color:C.ink}}>📖 About Us</h3>
      <p style={{margin:'0 0 16px',fontSize:12,color:C.ink4}}>Konten halaman About yang tampil saat klik "About" di navbar</p>
      {([['title','Brand Name','The Elite Athletes'],['subtitle','Tagline / Subtitle','Born from passion, built for performance.'],['mission','Misi (kutipan besar)','Misi kami...']] as const).map(([k,label,ph])=>(
        <div key={k} style={{marginBottom:14}}>
          <label style={{fontSize:12,fontWeight:600,color:C.ink3,display:'block',marginBottom:4}}>{label}</label>
          <input value={(about as any)[k]} onChange={e=>setAbout(p=>({...p,[k]:e.target.value}))} placeholder={ph} style={{width:'100%',padding:'9px 12px',border:`1px solid ${C.ink5}`,borderRadius:9,fontSize:13,fontFamily:'inherit',outline:'none',color:C.ink,boxSizing:'border-box' as any}}/>
        </div>
      ))}
      <div style={{marginBottom:14}}>
        <label style={{fontSize:12,fontWeight:600,color:C.ink3,display:'block',marginBottom:4}}>Deskripsi Lengkap</label>
        <textarea value={about.desc} onChange={e=>setAbout(p=>({...p,desc:e.target.value}))} rows={4} style={{width:'100%',padding:'9px 12px',border:`1px solid ${C.ink5}`,borderRadius:9,fontSize:13,fontFamily:'inherit',outline:'none',color:C.ink,resize:'vertical',boxSizing:'border-box' as any}}/>
      </div>
      <div style={{display:'flex',gap:10,alignItems:'center'}}>
        <button onClick={saveAbout} style={{padding:'9px 20px',background:C.g800,color:'#fff',border:'none',borderRadius:9,fontSize:13,fontWeight:700,cursor:'pointer'}}>{saved?'✓ Tersimpan!':'Simpan'}</button>
        <span style={{fontSize:11,color:C.ink4}}>Aktif di sesi ini. Untuk permanen edit SITE_CONTENT di kode.</span>
      </div>
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
// ═══════════════════════════════════════════════════════════
// PAGE: OUR ATHLETES
// ═══════════════════════════════════════════════════════════
const ATHLETES_DATA = [
  {id:1,name:'Rina Susanti',sport:'Tennis',rank:'National Athlete',quote:'The Elite Athletes gear gives me the confidence to perform at my best every single match.',img:null,initials:'RS',achievement:'Juara 1 Turnamen Nasional 2024'},
  {id:2,name:'Bagas Wicaksono',sport:'Hyrox',rank:'Elite Athlete',quote:'Training gets harder every day, but with the right gear, I push through every WOD.',img:null,initials:'BW',achievement:'Top 10 Hyrox World Series 2024'},
  {id:3,name:'Citra Andriani',sport:'Yoga',rank:'Certified Instructor',quote:'Comfort and style combined — exactly what I need for every practice session.',img:null,initials:'CA',achievement:'500h Yoga Alliance Certified'},
  {id:4,name:'Dewi Rahayu',sport:'Running',rank:'Marathon Runner',quote:'The AeroStride tights are my go-to for every long run. Absolutely game-changing.',img:null,initials:'DR',achievement:'Finisher Jakarta Marathon 2024'},
  {id:5,name:'Rizky Firmansyah',sport:'Badminton',rank:'Club Champion',quote:'Fast, lightweight, breathable — The Elite Athletes knows what athletes need.',img:null,initials:'RF',achievement:'Juara Klub Badminton Serpong 2024'},
  {id:6,name:'Andi Pratama',sport:'Gym',rank:'Personal Trainer',quote:'My clients and I trust The Elite Athletes gear for every session in the gym.',img:null,initials:'AP',achievement:'NASM Certified Personal Trainer'},
]

function OurAthletesPage({nav,cartCount}:{nav:(p:string,d?:any)=>void,cartCount:number}) {
  return <div style={{background:C.cream,minHeight:'100vh'}}>
    <StoreNavbar nav={nav} cartCount={cartCount} onCartClick={()=>nav('checkout')} scrolled={true}/>
    <div style={{background:C.g800,marginTop:56+28,padding:'52px 5vw 48px'}}>
      <div style={{maxWidth:1280,margin:'0 auto',textAlign:'center'}}>
        <p style={{margin:'0 0 10px',fontSize:11,fontWeight:600,color:C.g300,letterSpacing:'0.18em',textTransform:'uppercase'}}>The Elite Community</p>
        <h1 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:'clamp(2rem,5vw,3.5rem)',fontWeight:400,color:'#fff',margin:'0 0 16px',lineHeight:1.1}}>Our <em style={{color:C.gold2,fontStyle:'italic'}}>Athletes</em></h1>
        <p style={{fontSize:15,color:C.g300,maxWidth:520,margin:'0 auto',lineHeight:1.8}}>Meet the real athletes who wear and trust The Elite Athletes gear every day — in competition, training, and life.</p>
      </div>
    </div>
    <div style={{maxWidth:1280,margin:'0 auto',padding:'48px 5vw 68px'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:24}}>
        {ATHLETES_DATA.map(a=>(
          <div key={a.id} style={{background:C.white,border:`1px solid ${C.ink6}`,borderRadius:18,overflow:'hidden',transition:'transform 0.2s'}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.transform='translateY(-4px)'} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform='translateY(0)'}>
            <div style={{height:200,background:`linear-gradient(135deg, ${C.g700} 0%, ${C.g900} 100%)`,display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
              {a.img
                ?<img src={a.img} alt={a.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                :<div style={{width:90,height:90,borderRadius:'50%',background:'rgba(255,255,255,0.15)',border:'3px solid rgba(255,255,255,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:700,color:'#fff'}}>{a.initials}</div>
              }
              <div style={{position:'absolute',top:14,right:14,background:'rgba(0,0,0,0.4)',borderRadius:20,padding:'4px 10px',backdropFilter:'blur(4px)'}}><span style={{fontSize:11,fontWeight:600,color:C.gold2}}>{a.sport}</span></div>
            </div>
            <div style={{padding:'20px 22px'}}>
              <h3 style={{margin:'0 0 3px',fontSize:17,fontWeight:700,color:C.ink}}>{a.name}</h3>
              <p style={{margin:'0 0 6px',fontSize:12,color:C.g500,fontWeight:600}}>{a.rank}</p>
              <p style={{margin:'0 0 14px',fontSize:11,color:C.ink4,background:C.cream,borderRadius:6,padding:'5px 9px',display:'inline-block'}}>🏆 {a.achievement}</p>
              <p style={{margin:0,fontSize:13,color:C.ink3,lineHeight:1.75,fontStyle:'italic'}}>"{a.quote}"</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{textAlign:'center',marginTop:52,padding:'40px',background:C.g800,borderRadius:20}}>
        <p style={{margin:'0 0 8px',fontSize:12,fontWeight:600,color:C.g300,letterSpacing:'0.1em',textTransform:'uppercase'}}>Join Our Community</p>
        <h2 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:'clamp(1.5rem,3vw,2.2rem)',fontWeight:400,color:'#fff',margin:'0 0 14px'}}>Become an Elite Athlete</h2>
        <p style={{fontSize:14,color:C.g400,margin:'0 0 24px',maxWidth:420,marginLeft:'auto',marginRight:'auto'}}>Tag us @theeliteathletes di Instagram dan jadilah bagian dari komunitas kami.</p>
        <button onClick={()=>nav('catalog')} style={{background:C.gold2,color:C.g900,border:'none',borderRadius:10,padding:'13px 30px',fontSize:14,fontWeight:700,cursor:'pointer'}}>Shop the Collection</button>
      </div>
    </div>
    <footer style={{background:C.g900,borderTop:'1px solid rgba(255,255,255,0.06)',padding:'26px 5vw',textAlign:'center'}}>
      <p style={{margin:0,fontSize:12,color:C.g600}}>© 2025 The Elite Athletes. Made with 💚 in Indonesia.</p>
    </footer>
  </div>
}

export default function App() {
  const [route,      setRoute]      = useState('home')
  const [routeData,  setRouteData]  = useState<any>(null)
  const [adminPage,  setAdminPage]  = useState('overview')
  const [collapsed,  setCollapsed]  = useState(false)
  const [globalCart, setGlobalCart] = useState<any[]>([])
  const [cartCount,  setCartCount]  = useState(0)
  const [globalProducts,setGlobalProducts]=useState<any[]>(()=>{
    try{
      if(typeof window!=='undefined'){
        const c=sessionStorage.getItem('tea_products')
        if(c){const p=JSON.parse(c);if(p&&p.length>0)return p}
      }
    }catch(e){}
    return ALL_PRODUCTS
  })
  const [globalOrders,setGlobalOrders]=useState<any[]>(()=>{
    try{
      if(typeof window!=='undefined'){
        const c=sessionStorage.getItem('tea_orders')
        if(c){const p=JSON.parse(c);if(p&&p.length>0)return p}
      }
    }catch(e){}
    return INIT_ORDERS
  })
  const [productsFetched,setProductsFetched]=useState(false)

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
    const handler=(e:KeyboardEvent)=>{
      if(e.ctrlKey&&e.shiftKey&&e.key==='A'){setRoute('admin');window.scrollTo(0,0)}
    }
    window.addEventListener('keydown',handler)
    return()=>window.removeEventListener('keydown',handler)
  },[])
  // Fetch products ONCE at app level - cache in sessionStorage
  useEffect(()=>{
    fetch('/api/products').then(r=>r.json()).then(d=>{
      if(d.data&&d.data.length>0){
        const norm=d.data.map((p:any)=>({
          ...p,
          sport:p.sport||'',
          original:p.original_price||p.original||null,
          reviews:p.review_count||0,
          sports:Array.isArray(p.tags)?p.tags:[],
          image_url:p.image_url||null,
          gallery:Array.isArray(p.gallery)?p.gallery:[],
          desc:p.description||p.desc||'',
          sizes:Array.isArray(p.sizes)?p.sizes:[],
          colors:Array.isArray(p.colors)?p.colors:[],
          weight:p.weight||500,
          stock:Object.fromEntries((p.stock||[]).map((s:any)=>[s.size,s.quantity]))
        }))
        setGlobalProducts(norm)
        try{sessionStorage.setItem('tea_products',JSON.stringify(norm))}catch(e){}
      }
      setProductsFetched(true)
    }).catch(()=>setProductsFetched(true))
    fetch('/api/orders').then(r=>r.json()).then(d=>{
      if(d.data&&d.data.length>0){
        const norm=d.data.map((o:any)=>({
          ...o,
          id:o.id||o.order_id,
          customerName:o.customerName||o.customer_name||o.customers?.name||'',
          date:o.date||o.created_at||o.createdAt||new Date().toISOString(),
          phone:o.phone||o.customers?.phone||'',
          address:o.address||o.customers?.address||'',
          province:o.province||o.customers?.province||'',
          payment:o.payment||o.payment_method||'',
          total:o.total||o.grand_total||0,
          status:o.status||'pending',
          resi:o.resi||'',
          paid_at:o.paid_at||null,
          items:typeof o.items==='string'?JSON.parse(o.items||'[]'):(o.items||[]),
        }))
        setGlobalOrders(norm)
        try{sessionStorage.setItem('tea_orders',JSON.stringify(norm))}catch(e){}
      }
    }).catch(()=>{})
  },[])
  function addToCart(item: any) {
    setGlobalCart(c=>{
      const key=(x:any)=>x.id+'-'+(x.size||'')+(x.color||'')
      const existing=c.find(x=>key(x)===key(item))
      if(existing){return c.map(x=>key(x)===key(item)?{...x,qty:(x.qty||1)+(item.qty||1)}:x)}
      return [...c,{...item,cartId:'c'+Date.now(),qty:item.qty||1}]
    })
    setCartCount(n=>n+(item.qty||1))
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

    {route==='home'    && <LandingPage  nav={nav} addToCart={addToCart} cartCount={cartCount} products={globalProducts}/>}
    {route==='catalog' && <CatalogPage  nav={nav} addToCart={addToCart} cartCount={cartCount} products={globalProducts}/>}
    {route==='about'    && <AboutPage nav={nav} cartCount={globalCart.length}/>}
    {route==='athletes' && <OurAthletesPage nav={nav} cartCount={globalCart.length}/>}
    {route==='detail'  && routeData && <DetailPage product={routeData} nav={nav} addToCart={addToCart} cartCount={cartCount} allProducts={globalProducts}/>}
    {route==='checkout'&& <CheckoutPage nav={nav} cart={globalCart} addToCart={addToCart}/>}

    {route==='admin' && (
      <AdminLayout page={adminPage} setPage={setAdminPage} nav={nav} collapsed={collapsed} setCollapsed={setCollapsed}>
        {adminPage==='overview'     && <AdminOverview     products={globalProducts} orders={globalOrders} customers={INIT_CUSTOMERS}/>}
        {adminPage==='orders'       && <AdminOrders       orders={globalOrders} products={globalProducts}/>}
        {adminPage==='inventory'    && <AdminInventory    products={globalProducts}/>}
        {adminPage==='customers'    && <AdminCustomers    customers={INIT_CUSTOMERS} orders={globalOrders}/>}
        {adminPage==='financial'    && <AdminFinancial orders={globalOrders} products={globalProducts}/>}
        {adminPage==='content'      && <AdminContent/>}
        {adminPage==='integrations' && <AdminIntegrations/>}
      </AdminLayout>
    )}
  </>
}
