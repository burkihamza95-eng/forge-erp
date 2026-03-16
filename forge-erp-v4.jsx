import { useState, useReducer, useEffect, useRef } from "react";

// ─── GLOBAL STYLES (Odoo 19 Light) ────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; background: #f5f5f5; font-family: 'Inter', sans-serif; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #f0f0f0; }
    ::-webkit-scrollbar-thumb { background: #c8c8c8; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #aaa; }
    input, select, textarea { font-family: 'Inter', sans-serif; }
    button { font-family: 'Inter', sans-serif; }
    @keyframes slide-in { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.3} }
    @keyframes spin { to{transform:rotate(360deg)} }
  `}</style>
);


const SEED = {
  rawMaterials: [
    { id:"H01 / 0020-1711-0010", internalRef:"H01 / 0020-1711-0010", name:"M2X10 HEX SOCKET FLAT HEAD SCREW EBONOL Ss48 (DIN 7991)", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 2362 - A", internalRef:"CA01 / 2362 - A", name:"Wifi Module Extension Top Part", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4363", internalRef:"CA01 / 4363", name:"Battery Terminal Nut IN", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E01 / 0075", internalRef:"E01 / 0075", name:"RCA Receptacle", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"V595", internalRef:"V595", name:"DC DC Boost Converter(Ali baba)", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4364", internalRef:"CA01 / 4364", name:"Battery Compartment Gasket", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4368", internalRef:"CA01 / 4368", name:"RCA Connector Gasket", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"36-240-ND", internalRef:"36-240-ND", name:"BATTERY CONTACT SPRING AA PC PIN (H03 / 0075)", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0081", internalRef:"E02 / 0081", name:"WIFI ANTENNA PULSE ELECTRONICS (W3334B0150) - E02 / 0081 - 553W3334B0150-ND", category:"Electronics", unit:"m", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3379", internalRef:"CA01 / 3379", name:"WIFI Module Extension Bottom Part", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0099", internalRef:"E02 / 0099", name:"WIFI MODULE CARD (LC208B) Link Card", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4369", internalRef:"CA01 / 4369", name:"Intermediate Gasket", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-3810-0004", internalRef:"H01 / 0020-3810-0004", name:"M2X4 POZIDRIVE PAN HEAD SELF TAPPING SCREW (DIN 7981 F)", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4631", internalRef:"CA01 / 4631", name:"MK WIFI PIN CABLE (comes with WIFI)", category:"Electronics", unit:"m", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4371 - A", internalRef:"CA01 / 4371 - A", name:"Battery Door CAP", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4372 - A", internalRef:"CA01 / 4372 - A", name:"Battery Door Handle", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4373", internalRef:"CA01 / 4373", name:"Battery Terminal Screw IN", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170076", internalRef:"H02 / 170076", name:"O RING ø 16 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0025-1711-0006", internalRef:"H01 / 0025-1711-0006", name:"M2.5X6 HEX SOCKET FLAT HEAD SCREW EBONOL Ss48 (DIN 7991)", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0015-0310-0010", internalRef:"H01 / 0015-0310-0010", name:"1.5 X 10 Dowel Pin (DIN 7)", category:"Fasteners / Pin", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"401-2001-ND", internalRef:"401-2001-ND", name:"SUB MINIATURE SLIDE SWITCH (P/N: JS202011CQN; C&K)", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4377", internalRef:"CA01 / 4377", name:"SLIDE SW Holder", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4378", internalRef:"CA01 / 4378", name:"SLIDE SW SLIDER", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170114", internalRef:"H02 / 170114", name:"O-RINGS ø 7 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-1710-0006", internalRef:"H01 / 0020-1710-0006", name:"M2X6 HEX SOCKET FLAT HEAD SCREW", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B01 / 3103", internalRef:"B01 / 3103", name:"NECK BELT 2", category:"Accessories", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 1252", internalRef:"B04 / 1252", name:"EYESHEILD MASK", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4711", internalRef:"B04 / 4711", name:"LABEL (CARRYING CASE BRANDING SKUA LR)", category:"Label", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 2031", internalRef:"B04 / 2031", name:"BATTERY PACK  - PLASTIC CASE", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4032", internalRef:"B04 / 4032", name:"CONTACT PLATE LEFT", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4036", internalRef:"B04 / 4036", name:"CONTACT PLATE RIGHT", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4037", internalRef:"B04 / 4037", name:"AA SPECIAL SPRING CONTACT WITH FEED THRU FEATURE", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4703", internalRef:"B04 / 4703", name:"LABEL (BATTERY PACK INSTRUCTIONS FRONT)", category:"Label", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4704", internalRef:"B04 / 4704", name:"LABEL (BATTERY PACK BRANDING REAR)", category:"Label", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H04 / 0013", internalRef:"H04 / 0013", name:"RIVET ø2.26 (TYPE: 36-34-ND KEYSTONE)", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H04 / 0015", internalRef:"H04 / 0015", name:"RIVET ø4.50 (TYPE: ME4530 DTP SUPPLIES, BRASS)", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H03 / 0014", internalRef:"H03 / 0014", name:"AA BATTERY SPRING CONTACT (TYPE: BC-AA MPD)", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E03 / 0001", internalRef:"E03 / 0001", name:"USB CABLE 2 Meter", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H04 / 0008", internalRef:"H04 / 0008", name:"Ø 12 HEAT SHRINKABLE BLACK SLEEVE", category:"Electronics", unit:"mm", cost:0, stock:0, minStock:5 },
    { id:"H04 / 0009", internalRef:"H04 / 0009", name:"Ø  6  HEAT SHRINKABLE TRANSPERENT SLEEVE", category:"Electronics", unit:"mm", cost:0, stock:0, minStock:5 },
    { id:"H04 / 0010", internalRef:"H04 / 0010", name:"Ø1.5 HEAT SHRINKABLE BLACK SLEEVE", category:"Electronics", unit:"mm", cost:0, stock:0, minStock:5 },
    { id:"H04 / 0011", internalRef:"H04 / 0011", name:"Ø 3 HEAT SHRINKABLE BLACK SLEEVE", category:"Electronics", unit:"mm", cost:0, stock:0, minStock:5 },
    { id:"E03 / 0002", internalRef:"E03 / 0002", name:"BLACK CO AXIAL CABLE CLHF-179", category:"Electronics", unit:"m", cost:0, stock:0, minStock:5 },
    { id:"E03 / 0003", internalRef:"E03 / 0003", name:"Fischer CABLE BEND RELIEF ASSEMBLY UB07 A1BK Ø 1.9", category:"Fischer", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E01 / 0015", internalRef:"E01 / 0015", name:"FISCHER MALE CONNECTOR UP01L07 M007S BK1 Z2ZB", category:"Fischer", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E01 / 0016-LOCAL", internalRef:"E01 / 0016-LOCAL", name:"RCA MALE CONNECTOR - Local", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B01 / 3111", internalRef:"B01 / 3111", name:"FRONT COVER", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B01 / 3112", internalRef:"B01 / 3112", name:"COVER HOLDER", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B01 / 4101", internalRef:"B01 / 4101", name:"Cover Cord (Aglet Assembly)", category:"Accessories", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"M01 / 0806", internalRef:"M01 / 0806", name:"Ear Buds (5x)", category:"Accessories", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"M01 / 0804", internalRef:"M01 / 0804", name:"Woolen Tissue", category:"Accessories", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"M01 / 0803", internalRef:"M01 / 0803", name:"Small Pump With Brush", category:"Accessories", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"M01 / 0201", internalRef:"M01 / 0201", name:"Cleaning Liquid Bottle - 40ml", category:"Accessories", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"M01 / 0404", internalRef:"M01 / 0404", name:"PLASTIC BAG 90mm x 35mm", category:"Accessories", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0030-1111-0008", internalRef:"H01 / 0030-1111-0008", name:"SCREW CHC M3 x 8 A2-70 - ABONOL SS48", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3172", internalRef:"B04 / 3172", name:"BATTERY COVER LOCK", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3173", internalRef:"B04 / 3173", name:"COVER CARD C17C2 - S", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4601", internalRef:"B04 / 4601", name:"CARD C17C2 (401412-00)", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170082", internalRef:"H02 / 170082", name:"O-RING ø 56 X 2.5", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-1111-0008", internalRef:"H01 / 0020-1111-0008", name:"SCREWS CHC M2 x 8 A2-70 - ABONOL SS48", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4175", internalRef:"B04 / 4175", name:"Sealing Screw - S", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170097", internalRef:"H02 / 170097", name:"O-RING ø 3 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 2181", internalRef:"B04 / 2181", name:"BATTERY HATCH", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 2182", internalRef:"B04 / 2182", name:"LOCKING UNIT", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3183", internalRef:"B04 / 3183", name:"HANDLE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4184", internalRef:"B04 / 4184", name:"SPRING STOPPER", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4185", internalRef:"B04 / 4185", name:"STOPPER", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4186", internalRef:"B04 / 4186", name:"HANDLE PIN", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3187", internalRef:"B04 / 3187", name:"HINGE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4188", internalRef:"B04 / 4188", name:"HINGE PIN", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4196", internalRef:"B04 / 4196", name:"RUBBER PAD LEFT", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4197", internalRef:"B04 / 4197", name:"RUBBER PAD RIGHT", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0030-1110-0012", internalRef:"H01 / 0030-1110-0012", name:"Screws CHC M3 x 12 A2-70", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170102", internalRef:"H02 / 170102", name:"O-RING ø 91.7 X 1.78", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0058", internalRef:"E02 / 0058", name:"FLEX 14, PITCH 0.5, 2 INCHES, MOLEX LLC 0152660141", category:"Flex", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0012", internalRef:"E02 / 0012", name:"FLEX 20, PITCH 0.5, 6 INCHES, MOLEX LLC", category:"Flex", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0040-1110-0010", internalRef:"H01 / 0040-1110-0010", name:"SCREW CHC M4 x 10 A2-70", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170083", internalRef:"H02 / 170083", name:"O-RING ø 104.4 X 1.78", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0030-1111-0010", internalRef:"H01 / 0030-1111-0010", name:"Screws CHC M3 x 10 A2-70 - ABONOL SS48", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0006", internalRef:"E02 / 0006", name:"FLEX FFC 0.3-21P-50", category:"Flex", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0051", internalRef:"E02 / 0051", name:"IR DETECTOR 640 17μ (P/N: H6417C1S; HV)", category:"Detector", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3058", internalRef:"B04 / 3058", name:"HV Diaphragm", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4057", internalRef:"B04 / 4057", name:"HV DETECTOR CLAMP", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-1110-0004", internalRef:"H01 / 0020-1110-0004", name:"Screws CHC M2 x 4 A2-70", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3615", internalRef:"B04 / 3615", name:"CARD E1 (401473-00)", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4168", internalRef:"B04 / 4168", name:"CARD SPACER", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-1110-0018", internalRef:"H01 / 0020-1110-0018", name:"Screws CHC M2 x 18 A2-70", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-7410", internalRef:"H01 / 0020-7410", name:"ø2 SPRING WASHER A2-70", category:"Fasteners / Washer", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3614", internalRef:"B04 / 3614", name:"CARD C17A4 (401420-04)", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3612", internalRef:"B04 / 3612", name:"CARD C17B3_HV (401409-01a)", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0011", internalRef:"E02 / 0011", name:"FLEX 6, PITCH 0.5, 5 INCHES, MOLEX LLC", category:"Flex", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4701", internalRef:"B04 / 4701", name:"SKUA-LR BRANDING)", category:"Label", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 0171", internalRef:"B04 / 0171", name:"MAIN BODY", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0030-1110-0006", internalRef:"H01 / 0030-1110-0006", name:"Screws CHC M3 x 6 A2-70", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3511", internalRef:"B04 / 3511", name:"IR LENS L1", category:"Optics / Ge Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3512", internalRef:"B04 / 3512", name:"IR LENS L2", category:"Optics / Ge Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170108", internalRef:"H02 / 170108", name:"O-RING ø 78.6 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170066", internalRef:"H02 / 170066", name:"O-RING ø 45 X 1.5", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170089", internalRef:"H02 / 170089", name:"O-RING ø 50 X 2.5", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170104", internalRef:"H02 / 170104", name:"O-RING ø 2.5 X 1.5", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170095", internalRef:"H02 / 170095", name:"O-RING ø 28 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170006", internalRef:"H02 / 170006", name:"O-RING ø 28 X 1.5", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3269", internalRef:"B04 / 3269", name:"DIOPTER RING - S", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0025-3010-0004", internalRef:"H01 / 0025-3010-0004", name:"TAPERED END SCREWS HC M2.5 X 4 A2-70 FLAT POINT", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E01 / 0005", internalRef:"E01 / 0005", name:"APEM 11136 X408 ON-OFF SWITCH", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E03 / 0004", internalRef:"E03 / 0004", name:"PTFE WIRE MULTICORE 28AWG, WHITE", category:"Electronics", unit:"mm", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0001", internalRef:"E02 / 0001", name:"CONNECTOR (MOLEX 51021-0200) Juscom(1090-085-020)", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0009", internalRef:"E02 / 0009", name:"CRIMP TERMINAL MOLEX 50058-8100", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 1056", internalRef:"B04 / 1056", name:"IR-CORE STRUCTURE SKUA (HV)", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3165", internalRef:"B04 / 3165", name:"Shutter Blade", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4164", internalRef:"B04 / 4164", name:"Blade Interface", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4111", internalRef:"B04 / 4111", name:"Coil Shaft", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170077", internalRef:"H02 / 170077", name:"O-RING ø 8 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-1110-0014", internalRef:"H01 / 0020-1110-0014", name:"SCREW CHC M2 x 14 A2-70", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-6010", internalRef:"H01 / 0020-6010", name:"M2 NORMAL NUT A2-70", category:"Fasteners", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 2131", internalRef:"B04 / 2131", name:"OBJECTIVE L1 ENCLOSURE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3132", internalRef:"B04 / 3132", name:"LOCKING NUT L1", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3133", internalRef:"B04 / 3133", name:"FOCUSING RING", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3134", internalRef:"B04 / 3134", name:"THREAD GUIDE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3135", internalRef:"B04 / 3135", name:"ENCLOSURE L2", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4136", internalRef:"B04 / 4136", name:"LOCKING NUT L2", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 0152", internalRef:"B04 / 0152", name:"Objective Interface Plate", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E01 / 0011", internalRef:"E01 / 0011", name:"Fischer Cap UCR 07C 1A1 A200", category:"Fischer", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4154", internalRef:"B04 / 4154", name:"Neck Belt Pin", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4238", internalRef:"B04 / 4238", name:"OLED INSULATOR", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0004", internalRef:"E02 / 0004", name:"MICROOLED MICRODISPLAY MDPP01CPFC", category:"Oled", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3531", internalRef:"B04 / 3531", name:"Doublet D1", category:"Optics / Visible Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3534", internalRef:"B04 / 3534", name:"Lens L3", category:"Optics / Visible Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3535", internalRef:"B04 / 3535", name:"Doublet D2", category:"Optics / Visible Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170031", internalRef:"H02 / 170031", name:"O-RING ø 19x3", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4115", internalRef:"B04 / 4115", name:"Coil", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E03 / 0006", internalRef:"E03 / 0006", name:"MAGNET WIRE TYPE: MW35-C", category:"Electronics", unit:"m", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4163", internalRef:"B04 / 4163", name:"Magnet Shaft", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4117", internalRef:"B04 / 4117", name:"MODIFIED MAGNET  (HKCM 9962-34084)", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4116", internalRef:"B04 / 4116", name:"Shuter Base", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3113", internalRef:"B04 / 3113", name:"Shutter Cover", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4112", internalRef:"B04 / 4112", name:"Magnet Mount", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E01 / 0006", internalRef:"E01 / 0006", name:"FISCHER FEMALE CONNECTOR UR02W07 F007 PBK1E2AB", category:"Fischer", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4606", internalRef:"B04 / 4606", name:"CARD_C17FS (401411-00)", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 0191", internalRef:"B04 / 0191", name:"OCULAR INTERFACE PLATE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4194", internalRef:"B04 / 4194", name:"Mask Screw", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4192", internalRef:"B04 / 4192", name:"Interface Push Button", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4193", internalRef:"B04 / 4193", name:"BUTTON SPACER", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-1110-0008", internalRef:"H01 / 0020-1110-0008", name:"Screws CHC M2 x 8 A2-70", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3605", internalRef:"B04 / 3605", name:"CARD C17H2S (401410-01)", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 2259", internalRef:"B04 / 2259", name:"Ocular Tube", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4235", internalRef:"B04 / 4235", name:"Enclosure Stopper", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170110", internalRef:"H02 / 170110", name:"O-RING ø 37 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0025-1110-0006", internalRef:"H01 / 0025-1110-0006", name:"Screws CHC M2.5 x 6 A2-70", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0025-7410", internalRef:"H01 / 0025-7410", name:"ø2.5 SPRING WASHER A2-70", category:"Fasteners / Washer", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3236", internalRef:"B04 / 3236", name:"Lens Enclosure", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3265", internalRef:"B04 / 3265", name:"Lens Interface", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4266", internalRef:"B04 / 4266", name:"Spacer D1-L3", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4267", internalRef:"B04 / 4267", name:"Spacer L3-D2", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0105 - A", internalRef:"E02 / 0105 - A", name:"IR DETECTOR 640 12um (P/N: H6412C1SH; HV) - Gen 2 - VA", category:"Detector", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3247", internalRef:"CA01 / 3247", name:"SHUTTER HOLDER CLAMP", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-1710-0005", internalRef:"H01 / 0020-1710-0005", name:"M2 X 5 HEX SOCKET FLAT HEAD SCREWS", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"D01-4-00", internalRef:"D01-4-00", name:"Analog board for SKUA LR", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-1110-0006", internalRef:"H01 / 0020-1110-0006", name:"M2X6 HEXAGON SOCKET HEAD CAP SCREW", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4248 - A", internalRef:"CA01 / 4248 - A", name:"Shutter Holder - A", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B01-1-00", internalRef:"B01-1-00", name:"B01-1-00", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0086", internalRef:"E02 / 0086", name:"SHUTTER METAL V-LIGHT, XL-SU-464T1", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0016-1110-0004", internalRef:"H01 / 0016-1110-0004", name:"M1.6X4 HEXAGON SOCKET HEAD CAP SCREW (DIN 912)", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-1110-0025", internalRef:"H01 / 0020-1110-0025", name:"M2X25 HEXAGON SOCKET HEAD CAP SCREW (DIN 912)", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 3071", internalRef:"B04 / 3071", name:"IR CORE STRUCTURE-12µ WIFI", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 4073", internalRef:"B04 / 4073", name:"WIFI MODULE INTERFACE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E03 / 0004-2", internalRef:"E03 / 0004-2", name:"PTFE WIRE MULTICORE 28AWG, Orange 2842/19OR005-ND (100ft)", category:"Electronics", unit:"mm", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0031", internalRef:"E02 / 0031", name:"PICOBLADE RECEPTABLE CRIMP HOUSING 6 PIN CONNECTOR (Juscom) 1090-085-060 (MolexPN: 51021-0600)", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0101", internalRef:"E02 / 0101", name:"PICOBLADE RECEPTABLE CRIMP HOUSING 10 PIN CONNECTOR Juscom(1090-085-100) (MOLEX PN: 51021-1000)", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"ZFG.0U03Q.GSH.006-60=UCR 07C 1A1 A200", internalRef:"ZFG.0U03Q.GSH.006-60=UCR 07C 1A1 A200", name:"metal dust cover cap for socketUR02, ash color", category:"Fischer", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"F07-1-00", internalRef:"F07-1-00", name:"Card C17FS (7 PIN - wifi)", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"RM-FG3-0U1Q-P07KPUR02W07 F007 PBK1E2AB", internalRef:"RM-FG3-0U1Q-P07KPUR02W07 F007 PBK1E2AB", name:"0U FG3 panel socket code 1,7pinsfemale PCB contacts, ash color (Raymo)", category:"Fischer", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B04 / 0201", internalRef:"B04 / 0201", name:"OCULAR INTERFACE PLATE WIFI", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 4146", internalRef:"B10 / 4146", name:"WIFI ANTENNA COVER", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170126", internalRef:"H02 / 170126", name:"O RING ø 15 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0030-1111-0006", internalRef:"H01 / 0030-1111-0006", name:"SCREW CHC M3 X 6 A2-70 EBONOL Ss48", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3122", internalRef:"A03 / 3122", name:"COVER CARD C17C2 - T", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"P07-2-00", internalRef:"P07-2-00", name:"BATTERY PACK POWER PCB", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170200", internalRef:"H02 / 170200", name:"O-RING ø 69 X 2.5", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-1111-0006", internalRef:"H01 / 0020-1111-0006", name:"SCREW CHC M2 X 6 A2-70 EBONOL Ss48", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 2181", internalRef:"B10 / 2181", name:"BATTERY DOOR HATCH", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B08 / 4182 - A", internalRef:"B08 / 4182 - A", name:"Rubber Pad", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0098", internalRef:"E02 / 0098", name:"FLEX 20, PITCH 0.5, 7 INCHES, MOLEX LLC: 152660217", category:"Flex", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170202", internalRef:"H02 / 170202", name:"O-RING ø 131 X 1.78", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0097", internalRef:"E02 / 0097", name:"CABLE FFC/FPC 16POS 0.5MM 5\" (Digikey:0152660169)", category:"Flex", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170201", internalRef:"H02 / 170201", name:"O-RING ø 126 X 1.78", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A1X-1-00", internalRef:"A1X-1-00", name:"CARD C17A5", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"M03-2-00", internalRef:"M03-2-00", name:"Auxiliary MCU Power & Interface PCB - B10", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B08 / 4196", internalRef:"B08 / 4196", name:"CARD SPACER", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"FFC-14-0.5-30MM-5", internalRef:"FFC-14-0.5-30MM-5", name:"FLEX 14 PIN, PITCH 0.5MM, 30 MM, MOLEX LLC; 0151660141(CABLE FFC/FPC 14POS 0.5MM 2\")", category:"Flex", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 0102 - A", internalRef:"B10 / 0102 - A", name:"MAIN BODY", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B08 / 4701", internalRef:"B08 / 4701", name:"Label SKUA-MP-PRO", category:"Accessories", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0060", internalRef:"E02 / 0060", name:"FLEX 6, PITCH 0.5, 7 INCHES, MOLEX LLC 0152660063", category:"Flex", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0102", internalRef:"E02 / 0102", name:"PICOBLADE RECEPTABLE CRIMP HOUSING 4 PIN CONNECTOR (MOLEX PN: 51021-0400)(WM1722-ND))", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0113", internalRef:"E02 / 0113", name:"RECEPTABLE CRIMP HOUSING WITH LATCH 8 PIN CONNECTOR (TE PN: 2367198-8)(17-2367198-8-ND)", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0103", internalRef:"E02 / 0103", name:"PICOBLADE RECEPTABLE CRIMP HOUSING 14 PIN CONNECTOR (MOLEX PN: 51021-1400)(WM17001-ND)", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0107", internalRef:"E02 / 0107", name:"RECEPTABLE CRIMP HOUSING WITH LATCH 14 PIN CONNECTOR (TE PN: 1-2367198-4)", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0115", internalRef:"E02 / 0115", name:"PICOBLADE FEMALE CRIMP TERMINAL (TE PN: 2367199-1)(PICOBLADE FEMALE CRIMP TERMINAL (TE PN: 2367199-1))", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 4113", internalRef:"B10 / 4113", name:"MP PRO RADOM", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0088", internalRef:"E02 / 0088", name:"DMC 14663-R01 TARGET POINT3 MODULE", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B08 / 4163", internalRef:"B08 / 4163", name:"DMC INTERFACE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-1140-0008", internalRef:"H01 / 0020-1140-0008", name:"M2X8 HEXAGON SOCKET HEAD CAP SCREW- BRASS (DIN 912)", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0025-1140-0008", internalRef:"H01 / 0025-1140-0008", name:"M2.5X8 HEXAGON SOCKET HEAD CAP SCREW - BRASS (DIN 912)", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0025-1110-0014", internalRef:"H01 / 0025-1110-0014", name:"M2.5X14 HEXAGON SOCKET HEAD CAP SCREW (DIN 912)", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 4171", internalRef:"B10 / 4171", name:"8K LRF INTERFACE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0146", internalRef:"E02 / 0146", name:"LASER RANGE FINDER MODULE LR-8000", category:"Detector", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0030-1710-0008", internalRef:"H01 / 0030-1710-0008", name:"M3X8 HEX SOCKET FLAT HEAD SCREW (DIN 7991)", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170119", internalRef:"H02 / 170119", name:"O RING ø 31 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"R03-1-00", internalRef:"R03-1-00", name:"GPS CARRIER BPARD FOR SKUA MP PRO", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"FFC-06-0.5-114-4", internalRef:"FFC-06-0.5-114-4", name:"FLEX 6 PIN, PITCH 0.5MM,114MM", category:"Flex", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-1110-0005", internalRef:"H01 / 0020-1110-0005", name:"SCREW CHC M2 X 5 A2-70", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 3167 - A", internalRef:"B10 / 3167 - A", name:"IR CORE STRUCTURE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0105", internalRef:"E02 / 0105", name:"IR DETECTOR 640 12um (P/N: H6412C1SH; HV) - Gen 2", category:"Detector", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4248", internalRef:"CA01 / 4248", name:"Shutter Holder", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"D02-4-00", internalRef:"D02-4-00", name:"12um PROXY BOARD - V4", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0067", internalRef:"E02 / 0067", name:"FLEX 39, PITCH 0.3, 51MM, MOLEX LLC 150150239", category:"Flex", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0025-1110-0012", internalRef:"H01 / 0025-1110-0012", name:"M2.5X12 HEXAGON SOCKET HEAD CAP SCREW (DIN 912)", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 0112 - A", internalRef:"B10 / 0112 - A", name:"OBJECTIVE INTERFACE PLATE LRF", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 4501", internalRef:"B10 / 4501", name:"LRF RECIEVER WINDOW", category:"Optics / Ge Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 4502", internalRef:"B10 / 4502", name:"LRF TRANSMITTER WINDOW", category:"Optics / Ge Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 4503", internalRef:"B10 / 4503", name:"LD WINDOW", category:"Optics / Ge Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 4123 - A", internalRef:"B10 / 4123 - A", name:"USB C CAP", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 3161", internalRef:"B10 / 3161", name:"STEPPER MOTOR HOLDER", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E01 / 0084", internalRef:"E01 / 0084", name:"HANPOSE STEPPER MOTOR 20HS24", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 4162", internalRef:"B10 / 4162", name:"TRANSLATION SCREW", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 4163", internalRef:"B10 / 4163", name:"TRANSLATION NUT", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"O02-1-00", internalRef:"O02-1-00", name:"PHOTOSENSOR PCB FOR SKUA MP PRO", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H03 / 0095", internalRef:"H03 / 0095", name:"SPRING OD7.0 WD0.40 L34.0 VANEL C.070.040.0340.I", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0025-2910-0003", internalRef:"H01 / 0025-2910-0003", name:"M2.5X3 HEXAGON SOCKET SET SCREW WITH FLAT POINT (DIN 913)", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 4128", internalRef:"B10 / 4128", name:"LR LASER MODULE INTERFACE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0111", internalRef:"E02 / 0111", name:"INFRARED LASER MODULE MZHB385010D", category:"Detector", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170163", internalRef:"H02 / 170163", name:"O-RING ø 11 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-2910-0003", internalRef:"H01 / 0020-2910-0003", name:"M2X3 HEXAGON SOCKET SET SCREW WITH FLAT POINT (DIN 913)", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"F11-1-00", internalRef:"F11-1-00", name:"Fischer PCB MMP80", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E01 / 0026", internalRef:"E01 / 0026", name:"FISCHER FEMALE CONNECTOR - (10 PIN)", category:"Fischer", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 3121", internalRef:"B10 / 3121", name:"USB C INTERFACE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B07 / 4127", internalRef:"B07 / 4127", name:"C01 Retainer", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B07 / 4177", internalRef:"B07 / 4177", name:"C01 SPECIAL SCREW", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 4122", internalRef:"B10 / 4122", name:"USB C INTERFACE NUT", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H04 / 0055", internalRef:"H04 / 0055", name:"ROUND PLASTIC SPACER ID2.2 OD 4 L8.0 (732-12686-ND)(732-12686-ND)", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170049", internalRef:"H02 / 170049", name:"O-RING ø 14 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"C04-1-00", internalRef:"C04-1-00", name:"RIGID FLEX USB C BOARD MMP80", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A05 / 4503", internalRef:"A05 / 4503", name:"MK IR LENS L1 80 F1.2", category:"Optics / Ge Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A05 / 4504", internalRef:"A05 / 4504", name:"MK IR LENS L2 80 F1.2", category:"Optics / Ge Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170156", internalRef:"H02 / 170156", name:"O-RING ø 26 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170174", internalRef:"H02 / 170174", name:"O-RING ø 66 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170162", internalRef:"H02 / 170162", name:"O-RING ø 67 X 1.5", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 2157", internalRef:"B10 / 2157", name:"OBJECTIVE L1 ENCLOSURE 80 - MK", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 3153", internalRef:"B10 / 3153", name:"OBJECTIVE L2 ENCLOSURE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A05 / 4152", internalRef:"A05 / 4152", name:"L1 LOCKING NUT", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 4154", internalRef:"B10 / 4154", name:"L2 LOCKING NUT", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 0142 - B", internalRef:"B10 / 0142 - B", name:"OCULAR INTERFACE PLATE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B08 / 4210 - A", internalRef:"B08 / 4210 - A", name:"Interface Push Button SKUA MP Pro", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B08 / 4211 - A", internalRef:"B08 / 4211 - A", name:"INTERFACE PUSH BUTTON SPACER", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"S07 - 2 - 00", internalRef:"S07 - 2 - 00", name:"Buttons + OLED PCB - B10", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-1110-0010", internalRef:"H01 / 0020-1110-0010", name:"M2X10 HEXAGON SOCKET HEAD CAP SCREW (DIN 912)", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0025-1110-0005", internalRef:"H01 / 0025-1110-0005", name:"M2.5X5 HEXAGON SOCKET HEAD CAP SCREW (DIN 912)", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"S08-1-00", internalRef:"S08-1-00", name:"ON/OFF SWITCH PCB", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B07 / 4183 - A", internalRef:"B07 / 4183 - A", name:"ON OFF PUSH BUTTON", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B07 / 4184", internalRef:"B07 / 4184", name:"ON / OFF BUTTON SPACER", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 4144", internalRef:"B10 / 4144", name:"FOCUS PUSH BUTTON", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"B10 / 4145", internalRef:"B10 / 4145", name:"FOCUS PUSH BUTTON SPACER", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"S12-1-00", internalRef:"S12-1-00", name:"FOCUS SWITCH PCB FOR SKUA MP PRO", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H04 / 0045", internalRef:"H04 / 0045", name:"HARDCASE - SHENZEN FOAMTECH, PN G9262B - MINI", category:"Accessories", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3709", internalRef:"CA01 / 3709", name:"TARSIER Mini Black Soft POUCH", category:"Accessories", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 0602", internalRef:"CA01 / 0602", name:"System Cable TWS Mini", category:"Accessories", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3269", internalRef:"CA01 / 3269", name:"EYE RELIEF", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4712", internalRef:"CA01 / 4712", name:"LABEL (Mini Tarsier BRANDING(50 MF))", category:"Label", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"LAB / TM50-CCB", internalRef:"LAB / TM50-CCB", name:"LABEL - CARRYING CASE BRANDING Back (TM)", category:"Accessories", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"LAB / TM50-CCF", internalRef:"LAB / TM50-CCF", name:"LABEL - CARRYING CASE BRANDING Front (TM)", category:"Accessories", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3081", internalRef:"CA01 / 3081", name:"FRONT COVER RING 50MF", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4082", internalRef:"CA01 / 4082", name:"FRONT COVER 50MF", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0025-1111-0006", internalRef:"H01 / 0025-1111-0006", name:"SCREW CHC M2.5 X 6 A2-70 EBONOL SS48", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 2201", internalRef:"CA01 / 2201", name:"BATTERY PACK", category:"Accessories", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4202", internalRef:"CA01 / 4202", name:"BATTERY CONTACT LEFT", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4203", internalRef:"CA01 / 4203", name:"BATTERY CONTACT RIGHT", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4204", internalRef:"CA01 / 4204", name:"SPECIAL SPRING CONTACT 123", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A06 / 4704", internalRef:"A06 / 4704", name:"LABEL (BATTERY PACK BRANDING REAR)", category:"Label", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H04 / 0043", internalRef:"H04 / 0043", name:"RIVET ø5 (TYPE:; BRASS)", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4703", internalRef:"CA01 / 4703", name:"LABEL - BATTERY PACK (INSTRUCTION FRONT)", category:"Label", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170145", internalRef:"H02 / 170145", name:"O RING ø 29 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0025-1111-0005", internalRef:"H01 / 0025-1111-0005", name:"M2.5X5 HEXAGON SOCKET HEAD CAP SCREW EBONOL SS48", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-1111-0005", internalRef:"H01 / 0020-1111-0005", name:"M2X5 HEXAGON SOCKET HEAD CAP SCREW EBONOL Ss48", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-2710-0004", internalRef:"H01 / 0020-2710-0004", name:"M2X4 HEXAGON SOCKET SET SCREW WITH CONE POINT", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170112", internalRef:"H02 / 170112", name:"O-RING ø 2.5 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3521", internalRef:"CA01 / 3521", name:"OBJECTIVE LENS L1 50MF", category:"Optics / Ge Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3522", internalRef:"CA01 / 3522", name:"OBJECTIVE LENS L2 50MF", category:"Optics / Ge Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170106", internalRef:"H02 / 170106", name:"O-RING ø 36 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170061", internalRef:"H02 / 170061", name:"O-RING ø 32 X 1.5", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170125", internalRef:"H02 / 170125", name:"O-RING ø 33 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170160", internalRef:"H02 / 170160", name:"O RING ø 41 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170159", internalRef:"H02 / 170159", name:"O RING ø 23 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3191", internalRef:"CA01 / 3191", name:"BOTTOM COVER", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3192", internalRef:"CA01 / 3192", name:"USB C COVER", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4604", internalRef:"CA01 / 4604", name:"CC02-1-00", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170113", internalRef:"H02 / 170113", name:"O RING ø 5 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0025-1711-0008", internalRef:"H01 / 0025-1711-0008", name:"M2.5 X 8 HEX SOCKET FLAT HEAD SCREWS EBONOL Ss48", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4222", internalRef:"CA01 / 4222", name:"FOCUSING RING", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4225", internalRef:"CA01 / 4225", name:"THREAD GUIDE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3321", internalRef:"CA01 / 3321", name:"OBJECTIVE ENCLOSURE 50MF", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4323", internalRef:"CA01 / 4323", name:"FOCUSING RING STOPPER 50MF", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3324", internalRef:"CA01 / 3324", name:"LENS ENCLOSURE 50MF", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4325", internalRef:"CA01 / 4325", name:"L2 Enclosure 50MF", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4326", internalRef:"CA01 / 4326", name:"L1 LOCKING NUT 50MF", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4327", internalRef:"CA01 / 4327", name:"LOCKING NUT L2 50 MF", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3603", internalRef:"CA01 / 3603", name:"CI02-1-00 / interface board", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0047", internalRef:"E02 / 0047", name:"FLEX 8, PITCH 0.5, 102MM, MOLEX LLC 0152660079", category:"Flex", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0048", internalRef:"E02 / 0048", name:"FLEX 14, PITCH 0.5, 127MM, MOLEX LLC 0151660147", category:"Flex", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0069", internalRef:"E02 / 0069", name:"FLEX FFC 10POS, PITCH 0.5, 4 INCHES, MOLEX LLC 0152660101", category:"Flex", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-1110-0016", internalRef:"H01 / 0020-1110-0016", name:"M2X16 HEXAGON SOCKET HEAD CAP SCREW", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170155", internalRef:"H02 / 170155", name:"O-RING ø 50 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0060-1711-0014", internalRef:"H01 / 0060-1711-0014", name:"SCREW M6X14 MILLED FLAT HEAD HEXAGONAL HOLLOW A2-70 EBONOL", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0019", internalRef:"E02 / 0019", name:"FLEX 21, PITCH 0.3, 3.54 INCHES (90 mm) 1330-021-090", category:"Flex", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4261", internalRef:"CA01 / 4261", name:"OLED INTERFACE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4262", internalRef:"CA01 / 4262", name:"OLED CLAMP", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A06 / 4263", internalRef:"A06 / 4263", name:"OLED LOCKING NUT", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-1111-0004", internalRef:"H01 / 0020-1111-0004", name:"M2X4 HEXAGON SOCKET HEAD CAP SCREW Ebonol Ss48", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170062", internalRef:"H02 / 170062", name:"O-RING ø 35 X 1.5", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A06 / 4290", internalRef:"A06 / 4290", name:"OCULAR STOPPER", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3187", internalRef:"CA01 / 3187", name:"DIOPTER RING (MECHANICAL PART), CA01 / 3188 VA FOR MARKING", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0025-2710-0004", internalRef:"H01 / 0025-2710-0004", name:"TAPERED END SCREWS HC M 2.5 x 4 A2-70 cone point", category:"Fasteners", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3242", internalRef:"CA01 / 3242", name:"DAMPING INTERFACE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4245", internalRef:"CA01 / 4245", name:"FLEXURE LOCKING NUT", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4246", internalRef:"CA01 / 4246", name:"CONNECTOR RETAINER", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3254", internalRef:"CA01 / 3254", name:"FLEXURE METAL PLATE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0016-1110-0003", internalRef:"H01 / 0016-1110-0003", name:"M1.6X3 HEXAGON SOCKET HEAD CAP SCREW", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 2181", internalRef:"CA01 / 2181", name:"TOP COVER", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3182", internalRef:"CA01 / 3182", name:"BUTTONS SPACER", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A06 / 3183", internalRef:"A06 / 3183", name:"INTERFACE RUBBER PUSH BUTTON", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3601 - V2", internalRef:"CA01 / 3601 - V2", name:"S04-2-00", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3251", internalRef:"A03 / 3251", name:"PICATINNY INTERFACE BODY", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3252", internalRef:"A03 / 3252", name:"SCREW KNOB", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4253", internalRef:"A03 / 4253", name:"CLAMP", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4254", internalRef:"A03 / 4254", name:"CLAMP SCREW", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4255", internalRef:"A03 / 4255", name:"KNOB HEXAGON", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0050-8210", internalRef:"H01 / 0050-8210", name:"M5 NARROW CONTACT WASHER OD10 SS48", category:"Fasteners / Washer", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0025-2410-0004", internalRef:"H01 / 0025-2410-0004", name:"M2.5X4 FLANGED SOCKET BUTTON HEAD SCREW", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0050-8190", internalRef:"H01 / 0050-8190", name:"NL5SP NORD LOCK LARGE WASHER PAIR", category:"Fasteners / Washer", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4174", internalRef:"CA01 / 4174", name:"Battery Door Pin", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4112", internalRef:"A03 / 4112", name:"SEALING SCREW - T", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 1151", internalRef:"CA01 / 1151", name:"MAIN BODY", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-1711-0005", internalRef:"H01 / 0020-1711-0005", name:"M2 X 5 HEX SOCKET FLAT HEAD SCREWS ebanol ss48", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170094", internalRef:"H02 / 170094", name:"O RING ø 33 X 1.5 Rectangular", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A04 / 3506", internalRef:"A04 / 3506", name:"DOUBLET D1", category:"Optics / Visible Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A04 / 3503", internalRef:"A04 / 3503", name:"LENS L3", category:"Optics / Visible Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A04 / 3507", internalRef:"A04 / 3507", name:"DOUBLET D2", category:"Optics / Visible Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170148", internalRef:"H02 / 170148", name:"O-RING ø 29 X 2", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 2241", internalRef:"CA01 / 2241", name:"IR CORE STRUCTURE - A1", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4243", internalRef:"CA01 / 4243", name:"THERMAL CONTACT LARGE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4244", internalRef:"CA01 / 4244", name:"THERMAL CONTACT SMALL", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H03 / 0079", internalRef:"H03 / 0079", name:"SPRING OD3.0 WD0.18 L12 VANEL C.030.018.0120.I", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H03 / 0080", internalRef:"H03 / 0080", name:"SPRING OD1.6 WD0.18 L08 VANEL C.016.018.0080.I", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3171", internalRef:"CA01 / 3171", name:"BATTERY DOOR", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3172", internalRef:"CA01 / 3172", name:"BATTERY DOOR LOCK", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4173", internalRef:"CA01 / 4173", name:"RUBBER PAD", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4175", internalRef:"CA01 / 4175", name:"SPECIAL SCREW M2", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H03 / 0078", internalRef:"H03 / 0078", name:"SPRING OD2.2 WD0.4 L13 VANEL C.022.040.0130.I", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3162", internalRef:"CA01 / 3162", name:"PINS COVER NEW", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170099", internalRef:"H02 / 170099", name:"O-RING ø 10 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3271", internalRef:"CA01 / 3271", name:"OCULAR LENS ENCLOSURE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A04 / 4182", internalRef:"A04 / 4182", name:"SPACER D1_L3", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A04 / 4183", internalRef:"A04 / 4183", name:"SPACER L3-D2 (MINI)", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A06 / 4271", internalRef:"A06 / 4271", name:"OCULAR LOCKING NUT", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"P01-2-00", internalRef:"P01-2-00", name:"P01-2-00", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"ED8181-ND", internalRef:"ED8181-ND", name:"Contact Spring Loaded T/H Gold 0906-1-15-20-75-14-11-0", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"ED8182-ND", internalRef:"ED8182-ND", name:"Contact Spring Loaded T/H Gold 0906-2-15-20-75-14-11-0", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3086", internalRef:"CA01 / 3086", name:"OBJECTIVE L1 ENCLOSURE 50MK", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4087", internalRef:"CA01 / 4087", name:"L1 LOCKING NUT 50MK", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3088", internalRef:"CA01 / 3088", name:"OBJECTIVE L2 ENCLOSURE 50MK", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4089", internalRef:"CA01 / 4089", name:"L2 LOCKING NUT 50MK", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4525", internalRef:"CA01 / 4525", name:"OBJECTIVE LENS L1 50MK", category:"Optics / Ge Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4526", internalRef:"CA01 / 4526", name:"OBJECTIVE LENS L2 50MK", category:"Optics / Ge Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4314", internalRef:"CA01 / 4314", name:"THREAD GUIDE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4315", internalRef:"CA01 / 4315", name:"FOCUSING RING", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170149", internalRef:"H02 / 170149", name:"O RING ø 19 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"3P-CORE-SNG-01", internalRef:"3P-CORE-SNG-01", name:"MK INTERCONNECT CARD", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"3P-OLED-IF-01", internalRef:"3P-OLED-IF-01", name:"OLED CARD", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0125", internalRef:"E02 / 0125", name:"CIC FPC-14550", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3391", internalRef:"CA01 / 3391", name:"M CARD STACK INTERFACE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-1710-0014", internalRef:"H01 / 0020-1710-0014", name:"M2X14 HEXAGON SOCKET FLAT HEAD SCREW", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0123", internalRef:"E02 / 0123", name:"FLEX 35, PITCH 0.3, 60MM", category:"Flex", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4399", internalRef:"CA01 / 4399", name:"MK Thermal Pad", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4387", internalRef:"CA01 / 4387", name:"M DETECTOR CLAMP", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"3P-IR-PROXY-01", internalRef:"3P-IR-PROXY-01", name:"MK PROXY CARD", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0121", internalRef:"E02 / 0121", name:"IR DETECTOR 640 12μ (P/N: RTD6122CH; RT)", category:"Detector", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0122", internalRef:"E02 / 0122", name:"MK SHUTTER (P/N: SHT640-D)", category:"Electronics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-1710-0008", internalRef:"H01 / 0020-1710-0008", name:"M2X8 HEXAGON SOCKET FLAT HEAD SCREW (DIN 7991)", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-7210", internalRef:"H01 / 0020-7210", name:"ø2 Plan  WASHER A2-70", category:"Fasteners / Washer", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 1151 - H", internalRef:"CA01 / 1151 - H", name:"MAIN BODY", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 2386", internalRef:"CA01 / 2386", name:"M IR CORE STRUCTURE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4703", internalRef:"A03 / 4703", name:"LABEL - CARRYING CASE BRANDING TARSIER LR", category:"Label", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3055", internalRef:"A03 / 3055", name:"EYE RELIEF", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H04 / 0041", internalRef:"H04 / 0041", name:"Ø1 HEAT SHRINKABLE BLACK SLEEVE", category:"Electronics", unit:"mm", cost:0, stock:0, minStock:5 },
    { id:"E01 / 0027", internalRef:"E01 / 0027", name:"FISCHER MALE CONNECTOR (UP01L07 M010S BK1 Z2ZB)", category:"Fischer", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170121", internalRef:"H02 / 170121", name:"O-RING ø 52 X 2", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4159", internalRef:"A03 / 4159", name:"THERMAL CONDUCTION CONTACT", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4160", internalRef:"A03 / 4160", name:"CONTACT STOPPER", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4114", internalRef:"A03 / 4114", name:"FLEXURE LOCKING NUT STOPPER", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0020-1110-0003", internalRef:"H01 / 0020-1110-0003", name:"SCREW CHC M2 X 3 A2-70", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170129", internalRef:"H02 / 170129", name:"O-RING ø 60.04 X 1.78", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0063", internalRef:"E02 / 0063", name:"FLEX 14, PITCH 0.5, 6 INCHES, MOLEX LLC 0152660149", category:"Flex", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0025-1110-0008", internalRef:"H01 / 0025-1110-0008", name:"SCREW CHC M2.5 X 8 A2-70", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3187", internalRef:"A03 / 3187", name:"DIOPTER RING  - T", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0025-3010-0003", internalRef:"H01 / 0025-3010-0003", name:"TAPERED END SCREWS HC M 2.5 x 3 A2-70", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H03 / 0049", internalRef:"H03 / 0049", name:"SPRING OD 3 L 10.3", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 0121", internalRef:"A03 / 0121", name:"REAR BODY", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4172", internalRef:"A03 / 4172", name:"SWITCH INTERFACE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4173", internalRef:"A03 / 4173", name:"FLEX CLAMP", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"E02 / 0062", internalRef:"E02 / 0062", name:"FLEX 8, PITCH 0.5, 8 INCHES, MOLEX LLC 0152660087", category:"Flex", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4701", internalRef:"A03 / 4701", name:"LABEL - TARSIER BRANDING", category:"Label", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0025-2911-0004", internalRef:"H01 / 0025-2911-0004", name:"SCREW WITHOUT HEAD CHC M2.5 X 4 A2-70 EBONOL Ss48", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170122", internalRef:"H02 / 170122", name:"O-RING ø 68 X 1.5", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4133", internalRef:"A03 / 4133", name:"BATTERY DOOR PIN", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4137", internalRef:"A03 / 4137", name:"BATTERY DOOR CLAMP PIN", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3508", internalRef:"A03 / 3508", name:"LENS L8 - T", category:"Optics / Visible Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3513", internalRef:"A03 / 3513", name:"Doublet D2", category:"Optics / Visible Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3511", internalRef:"A03 / 3511", name:"LENS L11 - T", category:"Optics / Visible Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170063", internalRef:"H02 / 170063", name:"O-Ring Ø 36 x 1.5", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0030-2210-0006", internalRef:"H01 / 0030-2210-0006", name:"Screw Low Cylindrical Head CHC M3 X 6 A2-70", category:"Fasteners / Screw", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 0206", internalRef:"A03 / 0206", name:"TOP COVER", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3207", internalRef:"A03 / 3207", name:"INTERFACE RUBBER PUSH BUTTON - T", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3208", internalRef:"A03 / 3208", name:"BUTTONS SPACER", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3601", internalRef:"A03 / 3601", name:"CARD_STPB3 (401463-00)", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3135", internalRef:"A03 / 3135", name:"Battery Door Clamp", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3136", internalRef:"A03 / 3136", name:"BATTERY DOOR CLIP", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4138", internalRef:"A03 / 4138", name:"Special Screw M2 x 4", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H03 / 0050", internalRef:"H03 / 0050", name:"SPRING OD 4 L 25", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3131", internalRef:"A03 / 3131", name:"BATTERY DOOR", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4132", internalRef:"A03 / 4132", name:"RUBBER PAD", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H01 / 0025-0010-0014", internalRef:"H01 / 0025-0010-0014", name:"Pin D2.5 Length 14 A2-70", category:"Fasteners / Pin", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3181", internalRef:"A03 / 3181", name:"Enclosure", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4182", internalRef:"A03 / 4182", name:"Spacer L8-D2", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4183", internalRef:"A03 / 4183", name:"Spacer D2-L11", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4184", internalRef:"A03 / 4184", name:"Locking Nut L11-D2-L8", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4185", internalRef:"A03 / 4185", name:"Enclosure Stopper Cylinder", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4186", internalRef:"A03 / 4186", name:"ENCLOSURE STOPPER - T", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4145", internalRef:"A03 / 4145", name:"DIAPHRAGM", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3107", internalRef:"A03 / 3107", name:"FLEXURE ASSEMBLY", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4111", internalRef:"A03 / 4111", name:"FLEXURE ASSEMBLY LOCKING NUT", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3501", internalRef:"A03 / 3501", name:"LENS L1 - T", category:"Optics / Visible Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3507", internalRef:"A03 / 3507", name:"LENS L7 - T", category:"Optics / Visible Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3506", internalRef:"A03 / 3506", name:"LENS L6 - T", category:"Optics / Visible Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3512", internalRef:"A03 / 3512", name:"DOUBLET D1", category:"Optics / Visible Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3503", internalRef:"A03 / 3503", name:"LENS L3 - T", category:"Optics / Visible Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3502", internalRef:"A03 / 3502", name:"LENS L2 - T", category:"Optics / Visible Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4197", internalRef:"A03 / 4197", name:"ADJUSTABLE SPACER", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 2106", internalRef:"A03 / 2106", name:"FRONT BODY", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3190", internalRef:"A03 / 3190", name:"INTERMEDIATE LENSES ENCLOSURE", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4196", internalRef:"A03 / 4196", name:"SPACER L6-L7", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4195", internalRef:"A03 / 4195", name:"SPACER D1-L6", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4194", internalRef:"A03 / 4194", name:"SPACER L3-D1", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4193", internalRef:"A03 / 4193", name:"SPACER L2-L3", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4192", internalRef:"A03 / 4192", name:"SPACER L1-L2", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4191", internalRef:"A03 / 4191", name:"INTERMEDIATE LOCKING NUT 1", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4605", internalRef:"A03 / 4605", name:"CARD_C17FT (10 PIN) (401430-01)", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4164", internalRef:"A03 / 4164", name:"OLED INSULATOR - T", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4163", internalRef:"A03 / 4163", name:"OLED CLAMP", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4143", internalRef:"A03 / 4143", name:"OLED CLAMP SCREW", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4202", internalRef:"A03 / 4202", name:"HV DETECTOR CLAMP - T", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 3166", internalRef:"A03 / 3166", name:"SHUTTER BLADE - T", category:"Mechanical Accessory", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4167", internalRef:"A03 / 4167", name:"BLADE INTERFACE GEN 1", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 0201", internalRef:"A03 / 0201", name:"HV IR CORE STRUCTURE - T", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"A03 / 4168", internalRef:"A03 / 4168", name:"MAGNET SHAFT - T", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4605", internalRef:"CA01 / 4605", name:"A01-2-00 / analog board", category:"Pcb", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4711", internalRef:"CA01 / 4711", name:"LABEL (Mini Tarsier BRANDING(35 MF))", category:"Label", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3061", internalRef:"CA01 / 3061", name:"FRONT COVER RING 35A", category:"Rubber Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4062", internalRef:"CA01 / 4062", name:"FRONT COVER 35A", category:"Plastic", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3531", internalRef:"CA01 / 3531", name:"OBJECTIVE LENS L1 35MF", category:"Optics / Ge Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3532", internalRef:"CA01 / 3532", name:"OBJECTIVE LENS L2 35MF", category:"Optics / Ge Optics", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170124", internalRef:"H02 / 170124", name:"O-RING ø 31 X 1.5", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170142", internalRef:"H02 / 170142", name:"O-RING ø 25 X 1", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"H02 / 170092", internalRef:"H02 / 170092", name:"O RING ø 33 X 1.5", category:"O-Ring", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3221", internalRef:"CA01 / 3221", name:"OBJECTIVE ENCLOSURE 35MF", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4223", internalRef:"CA01 / 4223", name:"FOCUSING RING STOPPER 35MF", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 3281", internalRef:"CA01 / 3281", name:"LENS ENCLOSURE 35MF", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4282", internalRef:"CA01 / 4282", name:"L1 LOCKING NUT 35MF", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 },
    { id:"CA01 / 4283", internalRef:"CA01 / 4283", name:"L2 LOCKING NUT 35MF", category:"Mech Part", unit:"Units", cost:0, stock:0, minStock:5 }
  ],
  finishedGoods: [
    { id:"FG001", name:"External WiFi Module Final Assembly",          category:"Electronics",  leadDays:3, basePrice:320  },
    { id:"FG002", name:"G3 Picatinny Mount - ( C Interface )",         category:"Mounts",       leadDays:4, basePrice:185  },
    { id:"FG003", name:"G3 Picatinny Mount - Local",                   category:"Mounts",       leadDays:4, basePrice:165  },
    { id:"FG004", name:"HMG Picatinny Mount - ( Chair Interface )",    category:"Mounts",       leadDays:4, basePrice:210  },
    { id:"FG005", name:"LMG Picatinny Mount - ( Hinge Interface )",    category:"Mounts",       leadDays:4, basePrice:220  },
    { id:"FG006", name:"NVG / Low Light Telescope - P45 Tube",         category:"Optics",       leadDays:5, basePrice:890  },
    { id:"FG007", name:"Night Vision Goggles",                         category:"Optics",       leadDays:7, basePrice:2400 },
    { id:"FG008", name:"ORCA NV",                                      category:"Optics",       leadDays:6, basePrice:1950 },
    { id:"FG009", name:"SKUA Complete with accessories",               category:"SKUA Systems", leadDays:8, basePrice:3200 },
    { id:"FG010", name:"SKUA Complete with accessories (12um Wifi)",   category:"SKUA Systems", leadDays:8, basePrice:3600 },
    { id:"FG011", name:"SKUA Complete with accessories (12um)",        category:"SKUA Systems", leadDays:8, basePrice:3400 },
    { id:"FG012", name:"SKUA MP - MINI - DAY LASER RANGE FINDER",      category:"SKUA Systems", leadDays:6, basePrice:2800 },
    { id:"FG013", name:"SKUA MP PRO",                                  category:"SKUA Systems", leadDays:7, basePrice:4100 },
    { id:"FG014", name:"SMG Picatinny Mount - ( Cover Rail )",         category:"Mounts",       leadDays:4, basePrice:195  },
    { id:"FG015", name:"SMG Picatinny Mount - ( Cover Rail ) (Local)", category:"Mounts",       leadDays:4, basePrice:175  },
    { id:"FG016", name:"SSR Picatinny Mount - ( Dovetail Interface )", category:"Mounts",       leadDays:4, basePrice:230  },
    { id:"FG017", name:"TARSIER LR 80 Assembly",                      category:"TARSIER",      leadDays:9, basePrice:5200 },
    { id:"FG018", name:"TARSIER LR 80 LRF Assembly",                  category:"TARSIER",      leadDays:9, basePrice:5800 },
    { id:"FG019", name:"TARSIER LR Final with accessories",           category:"TARSIER",      leadDays:10,basePrice:6400 },
    { id:"FG020", name:"TWS Mini Final 35MF",                         category:"TWS",          leadDays:6, basePrice:2100 },
    { id:"FG021", name:"TWS Mini Final 50MF",                         category:"TWS",          leadDays:6, basePrice:2300 },
    { id:"FG022", name:"TWS Mini Final 50MF 12um",                    category:"TWS",          leadDays:6, basePrice:2600 },
    { id:"FG023", name:"TWS Mini Final 50MF 12um - MK",               category:"TWS",          leadDays:7, basePrice:2750 },
    { id:"FG024", name:"Video Extension Cable 10 M",                  category:"Cables",       leadDays:2, basePrice:95   },
    { id:"FG025", name:"Video Extension Cable 10 M - Local",          category:"Cables",       leadDays:2, basePrice:85   },
    { id:"FG026", name:"Video Extension Cable 18 M",                  category:"Cables",       leadDays:2, basePrice:140  },
    { id:"FG027", name:"Video Extension Cable 18 M ( Local RCA )",    category:"Cables",       leadDays:2, basePrice:125  },
    { id:"FG028", name:"Video Extension Cable 4.1 M",                 category:"Cables",       leadDays:2, basePrice:65   },
    { id:"FG029", name:"Video Extension Cable 4.1 M ( Local RCA )",   category:"Cables",       leadDays:2, basePrice:58   },
    { id:"FG030", name:"Video Extension Cable 50 M",                  category:"Cables",       leadDays:3, basePrice:310  },
    { id:"FG031", name:"Video Extension Cable 50 M ( Local RCA )",    category:"Cables",       leadDays:3, basePrice:280  },
    { id:"FG032", name:"Video Extension Cable 6.1 M",                 category:"Cables",       leadDays:2, basePrice:72   },
    { id:"FG033", name:"Video Extension Cable 6.1 M ( Local RCA )",   category:"Cables",       leadDays:2, basePrice:65   },
  ],
  bom: {
    FG001: [
      { materialId:"H01 / 0020-1711-0010", qty:4 },
      { materialId:"CA01 / 2362 - A", qty:1 },
      { materialId:"CA01 / 4363", qty:1 },
      { materialId:"E01 / 0075", qty:1 },
      { materialId:"V595", qty:1 },
      { materialId:"CA01 / 4364", qty:1 },
      { materialId:"CA01 / 4368", qty:1 },
      { materialId:"36-240-ND", qty:1 },
      { materialId:"E02 / 0081", qty:1 },
      { materialId:"CA01 / 3379", qty:1 },
      { materialId:"E02 / 0099", qty:1 },
      { materialId:"CA01 / 4369", qty:1 },
      { materialId:"H01 / 0020-3810-0004", qty:4 },
      { materialId:"CA01 / 4631", qty:1 },
      { materialId:"CA01 / 4371 - A", qty:1 },
      { materialId:"CA01 / 4372 - A", qty:1 },
      { materialId:"CA01 / 4373", qty:1 },
      { materialId:"H02 / 170076", qty:1 },
      { materialId:"H01 / 0025-1711-0006", qty:1 },
      { materialId:"H01 / 0015-0310-0010", qty:2 },
      { materialId:"401-2001-ND", qty:1 },
      { materialId:"CA01 / 4377", qty:1 },
      { materialId:"CA01 / 4378", qty:1 },
      { materialId:"H02 / 170114", qty:1 },
      { materialId:"H01 / 0020-1710-0006", qty:2 }
    ],
    FG009: [
      { materialId:"B01 / 3103", qty:1 },
      { materialId:"B04 / 1252", qty:1 },
      { materialId:"B04 / 4711", qty:2 },
      { materialId:"B04 / 2031", qty:2 },
      { materialId:"B04 / 4032", qty:2 },
      { materialId:"B04 / 4036", qty:2 },
      { materialId:"B04 / 4037", qty:6 },
      { materialId:"B04 / 4703", qty:2 },
      { materialId:"B04 / 4704", qty:2 },
      { materialId:"H04 / 0013", qty:2 },
      { materialId:"H04 / 0015", qty:8 },
      { materialId:"H03 / 0014", qty:2 },
      { materialId:"E03 / 0001", qty:1 },
      { materialId:"H04 / 0008", qty:100 },
      { materialId:"H04 / 0009", qty:30 },
      { materialId:"H04 / 0010", qty:36 },
      { materialId:"H04 / 0011", qty:60 },
      { materialId:"E03 / 0002", qty:2 },
      { materialId:"E03 / 0003", qty:1 },
      { materialId:"E01 / 0015", qty:1 },
      { materialId:"E01 / 0016-LOCAL", qty:1 },
      { materialId:"B01 / 3111", qty:1 },
      { materialId:"B01 / 3112", qty:1 },
      { materialId:"B01 / 4101", qty:2 },
      { materialId:"M01 / 0806", qty:1 },
      { materialId:"M01 / 0804", qty:1 },
      { materialId:"M01 / 0803", qty:1 },
      { materialId:"M01 / 0201", qty:1 },
      { materialId:"M01 / 0404", qty:1 },
      { materialId:"H01 / 0030-1111-0008", qty:4 },
      { materialId:"B04 / 3172", qty:1 },
      { materialId:"B04 / 3173", qty:1 },
      { materialId:"B04 / 4601", qty:1 },
      { materialId:"H02 / 170082", qty:1 },
      { materialId:"H01 / 0020-1111-0008", qty:2 },
      { materialId:"B04 / 4175", qty:1 },
      { materialId:"H02 / 170097", qty:1 },
      { materialId:"B04 / 2181", qty:1 },
      { materialId:"B04 / 2182", qty:1 },
      { materialId:"B04 / 3183", qty:1 },
      { materialId:"B04 / 4184", qty:1 },
      { materialId:"B04 / 4185", qty:1 },
      { materialId:"B04 / 4186", qty:2 },
      { materialId:"B04 / 3187", qty:1 },
      { materialId:"B04 / 4188", qty:1 },
      { materialId:"B04 / 4196", qty:1 },
      { materialId:"B04 / 4197", qty:1 },
      { materialId:"H01 / 0030-1110-0012", qty:4 },
      { materialId:"H02 / 170102", qty:1 },
      { materialId:"E02 / 0058", qty:1 },
      { materialId:"E02 / 0012", qty:1 },
      { materialId:"H01 / 0040-1110-0010", qty:4 },
      { materialId:"H02 / 170083", qty:1 },
      { materialId:"H01 / 0030-1111-0010", qty:4 },
      { materialId:"E02 / 0006", qty:2 },
      { materialId:"E02 / 0051", qty:1 },
      { materialId:"B04 / 3058", qty:1 },
      { materialId:"B04 / 4057", qty:2 },
      { materialId:"H01 / 0020-1110-0004", qty:8 },
      { materialId:"B04 / 3615", qty:1 },
      { materialId:"B04 / 4168", qty:8 },
      { materialId:"H01 / 0020-1110-0018", qty:4 },
      { materialId:"H01 / 0020-7410", qty:13 },
      { materialId:"B04 / 3614", qty:1 },
      { materialId:"B04 / 3612", qty:1 },
      { materialId:"E02 / 0011", qty:1 },
      { materialId:"B04 / 4701", qty:1 },
      { materialId:"B04 / 0171", qty:1 },
      { materialId:"H01 / 0030-1110-0006", qty:4 },
      { materialId:"B04 / 3511", qty:1 },
      { materialId:"B04 / 3512", qty:1 },
      { materialId:"H02 / 170108", qty:1 },
      { materialId:"H02 / 170066", qty:2 },
      { materialId:"H02 / 170089", qty:1 },
      { materialId:"H02 / 170104", qty:3 },
      { materialId:"H02 / 170095", qty:1 },
      { materialId:"H02 / 170006", qty:2 },
      { materialId:"B04 / 3269", qty:2 },
      { materialId:"H01 / 0025-3010-0004", qty:6 },
      { materialId:"E01 / 0005", qty:1 },
      { materialId:"E03 / 0004", qty:246 },
      { materialId:"E02 / 0001", qty:2 },
      { materialId:"E02 / 0009", qty:4 },
      { materialId:"B04 / 1056", qty:1 },
      { materialId:"B04 / 3165", qty:1 },
      { materialId:"B04 / 4164", qty:1 },
      { materialId:"B04 / 4111", qty:1 },
      { materialId:"H02 / 170077", qty:2 },
      { materialId:"H01 / 0020-1110-0014", qty:2 },
      { materialId:"H01 / 0020-6010", qty:1 },
      { materialId:"B04 / 2131", qty:1 },
      { materialId:"B04 / 3132", qty:1 },
      { materialId:"B04 / 3133", qty:1 },
      { materialId:"B04 / 3134", qty:3 },
      { materialId:"B04 / 3135", qty:1 },
      { materialId:"B04 / 4136", qty:1 },
      { materialId:"B04 / 0152", qty:1 },
      { materialId:"E01 / 0011", qty:1 },
      { materialId:"B04 / 4154", qty:4 },
      { materialId:"B04 / 4238", qty:2 },
      { materialId:"E02 / 0004", qty:2 },
      { materialId:"B04 / 3531", qty:2 },
      { materialId:"B04 / 3534", qty:2 },
      { materialId:"B04 / 3535", qty:2 },
      { materialId:"H02 / 170031", qty:2 },
      { materialId:"B04 / 4115", qty:1 },
      { materialId:"E03 / 0006", qty:11 },
      { materialId:"B04 / 4163", qty:1 },
      { materialId:"B04 / 4117", qty:1 },
      { materialId:"B04 / 4116", qty:1 },
      { materialId:"B04 / 3113", qty:1 },
      { materialId:"B04 / 4112", qty:2 },
      { materialId:"E01 / 0006", qty:1 },
      { materialId:"B04 / 4606", qty:1 },
      { materialId:"B04 / 0191", qty:1 },
      { materialId:"B04 / 4194", qty:8 },
      { materialId:"B04 / 4192", qty:2 },
      { materialId:"B04 / 4193", qty:2 },
      { materialId:"H01 / 0020-1110-0008", qty:6 },
      { materialId:"B04 / 3605", qty:1 },
      { materialId:"B04 / 2259", qty:2 },
      { materialId:"B04 / 4235", qty:2 },
      { materialId:"H02 / 170110", qty:2 },
      { materialId:"H01 / 0025-1110-0006", qty:6 },
      { materialId:"H01 / 0025-7410", qty:6 },
      { materialId:"B04 / 3236", qty:2 },
      { materialId:"B04 / 3265", qty:2 },
      { materialId:"B04 / 4266", qty:2 },
      { materialId:"B04 / 4267", qty:2 }
    ],
    FG010: [
      { materialId:"B01 / 3103", qty:1 },
      { materialId:"B04 / 1252", qty:1 },
      { materialId:"B04 / 4711", qty:2 },
      { materialId:"B04 / 2031", qty:2 },
      { materialId:"B04 / 4032", qty:2 },
      { materialId:"B04 / 4036", qty:2 },
      { materialId:"B04 / 4037", qty:6 },
      { materialId:"B04 / 4703", qty:2 },
      { materialId:"B04 / 4704", qty:2 },
      { materialId:"H04 / 0013", qty:2 },
      { materialId:"H04 / 0015", qty:8 },
      { materialId:"H03 / 0014", qty:2 },
      { materialId:"E03 / 0001", qty:1 },
      { materialId:"H04 / 0008", qty:100 },
      { materialId:"H04 / 0009", qty:30 },
      { materialId:"H04 / 0010", qty:30 },
      { materialId:"H04 / 0011", qty:60 },
      { materialId:"E03 / 0002", qty:2 },
      { materialId:"E03 / 0003", qty:1 },
      { materialId:"E01 / 0015", qty:1 },
      { materialId:"E01 / 0016-LOCAL", qty:1 },
      { materialId:"B01 / 3111", qty:1 },
      { materialId:"B01 / 3112", qty:1 },
      { materialId:"B01 / 4101", qty:2 },
      { materialId:"M01 / 0806", qty:1 },
      { materialId:"M01 / 0804", qty:1 },
      { materialId:"M01 / 0803", qty:1 },
      { materialId:"M01 / 0201", qty:1 },
      { materialId:"M01 / 0404", qty:1 },
      { materialId:"H01 / 0030-1111-0008", qty:4 },
      { materialId:"B04 / 3172", qty:1 },
      { materialId:"B04 / 3173", qty:1 },
      { materialId:"B04 / 4601", qty:1 },
      { materialId:"H02 / 170082", qty:1 },
      { materialId:"H01 / 0020-1111-0008", qty:2 },
      { materialId:"B04 / 4175", qty:1 },
      { materialId:"H02 / 170097", qty:1 },
      { materialId:"B04 / 2181", qty:1 },
      { materialId:"B04 / 2182", qty:1 },
      { materialId:"B04 / 3183", qty:1 },
      { materialId:"B04 / 4184", qty:1 },
      { materialId:"B04 / 4185", qty:1 },
      { materialId:"B04 / 4186", qty:2 },
      { materialId:"B04 / 3187", qty:1 },
      { materialId:"B04 / 4188", qty:1 },
      { materialId:"B04 / 4196", qty:1 },
      { materialId:"B04 / 4197", qty:1 },
      { materialId:"H01 / 0030-1110-0012", qty:4 },
      { materialId:"H02 / 170102", qty:1 },
      { materialId:"E02 / 0058", qty:1 },
      { materialId:"E02 / 0012", qty:1 },
      { materialId:"H01 / 0040-1110-0010", qty:4 },
      { materialId:"H02 / 170083", qty:1 },
      { materialId:"H01 / 0030-1111-0010", qty:4 },
      { materialId:"E02 / 0006", qty:2 },
      { materialId:"E02 / 0105 - A", qty:1 },
      { materialId:"CA01 / 3247", qty:1 },
      { materialId:"H01 / 0020-1710-0005", qty:2 },
      { materialId:"D01-4-00", qty:1 },
      { materialId:"B04 / 4168", qty:8 },
      { materialId:"H01 / 0020-1110-0008", qty:10 },
      { materialId:"H01 / 0020-1110-0006", qty:4 },
      { materialId:"CA01 / 4248 - A", qty:1 },
      { materialId:"B04 / 3614", qty:1 },
      { materialId:"B01-1-00", qty:1 },
      { materialId:"E02 / 0086", qty:1 },
      { materialId:"H01 / 0016-1110-0004", qty:4 },
      { materialId:"H01 / 0020-1110-0025", qty:4 },
      { materialId:"B04 / 3071", qty:1 },
      { materialId:"B04 / 4073", qty:1 },
      { materialId:"E02 / 0099", qty:1 },
      { materialId:"E02 / 0081", qty:1 },
      { materialId:"E02 / 0011", qty:1 },
      { materialId:"B04 / 4701", qty:1 },
      { materialId:"B04 / 0171", qty:1 },
      { materialId:"H01 / 0030-1110-0006", qty:4 },
      { materialId:"B04 / 3511", qty:1 },
      { materialId:"B04 / 3512", qty:1 },
      { materialId:"H02 / 170108", qty:1 },
      { materialId:"H02 / 170066", qty:2 },
      { materialId:"H02 / 170089", qty:1 },
      { materialId:"H02 / 170104", qty:3 },
      { materialId:"H02 / 170095", qty:1 },
      { materialId:"E02 / 0001", qty:2 },
      { materialId:"E02 / 0009", qty:18 },
      { materialId:"E03 / 0004-2", qty:656 },
      { materialId:"E02 / 0031", qty:1 },
      { materialId:"E02 / 0101", qty:1 },
      { materialId:"H02 / 170006", qty:2 },
      { materialId:"B04 / 3269", qty:2 },
      { materialId:"H01 / 0025-3010-0004", qty:6 },
      { materialId:"E01 / 0005", qty:1 },
      { materialId:"E03 / 0004", qty:136 },
      { materialId:"B04 / 2131", qty:1 },
      { materialId:"B04 / 3132", qty:1 },
      { materialId:"B04 / 3133", qty:1 },
      { materialId:"B04 / 3134", qty:3 },
      { materialId:"B04 / 3135", qty:1 },
      { materialId:"B04 / 4136", qty:1 },
      { materialId:"B04 / 0152", qty:1 },
      { materialId:"ZFG.0U03Q.GSH.006-60=UCR 07C 1A1 A200", qty:1 },
      { materialId:"B04 / 4154", qty:4 },
      { materialId:"B04 / 4238", qty:2 },
      { materialId:"E02 / 0004", qty:2 },
      { materialId:"B04 / 3531", qty:2 },
      { materialId:"B04 / 3534", qty:2 },
      { materialId:"B04 / 3535", qty:2 },
      { materialId:"H02 / 170031", qty:2 },
      { materialId:"F07-1-00", qty:1 },
      { materialId:"RM-FG3-0U1Q-P07KPUR02W07 F007 PBK1E2AB", qty:1 },
      { materialId:"B04 / 0201", qty:1 },
      { materialId:"B04 / 4194", qty:8 },
      { materialId:"B04 / 4192", qty:2 },
      { materialId:"B04 / 4193", qty:2 },
      { materialId:"H01 / 0020-7410", qty:10 },
      { materialId:"B04 / 3605", qty:1 },
      { materialId:"B04 / 2259", qty:2 },
      { materialId:"B04 / 4235", qty:2 },
      { materialId:"H02 / 170110", qty:2 },
      { materialId:"H01 / 0025-1110-0006", qty:6 },
      { materialId:"H01 / 0025-7410", qty:6 },
      { materialId:"H01 / 0020-1110-0004", qty:4 },
      { materialId:"B10 / 4146", qty:1 },
      { materialId:"H02 / 170126", qty:1 },
      { materialId:"B04 / 3236", qty:2 },
      { materialId:"B04 / 3265", qty:2 },
      { materialId:"B04 / 4266", qty:2 },
      { materialId:"B04 / 4267", qty:2 }
    ],
    FG011: [
      { materialId:"B01 / 3103", qty:1 },
      { materialId:"B04 / 1252", qty:1 },
      { materialId:"B04 / 4711", qty:2 },
      { materialId:"B04 / 2031", qty:2 },
      { materialId:"B04 / 4032", qty:2 },
      { materialId:"B04 / 4036", qty:2 },
      { materialId:"B04 / 4037", qty:6 },
      { materialId:"B04 / 4703", qty:2 },
      { materialId:"B04 / 4704", qty:2 },
      { materialId:"H04 / 0013", qty:2 },
      { materialId:"H04 / 0015", qty:8 },
      { materialId:"H03 / 0014", qty:2 },
      { materialId:"E03 / 0001", qty:1 },
      { materialId:"H04 / 0008", qty:100 },
      { materialId:"H04 / 0009", qty:30 },
      { materialId:"H04 / 0010", qty:30 },
      { materialId:"H04 / 0011", qty:60 },
      { materialId:"E03 / 0002", qty:2 },
      { materialId:"E03 / 0003", qty:1 },
      { materialId:"E01 / 0015", qty:1 },
      { materialId:"E01 / 0016-LOCAL", qty:1 },
      { materialId:"B01 / 3111", qty:1 },
      { materialId:"B01 / 3112", qty:1 },
      { materialId:"B01 / 4101", qty:2 },
      { materialId:"M01 / 0806", qty:1 },
      { materialId:"M01 / 0804", qty:1 },
      { materialId:"M01 / 0803", qty:1 },
      { materialId:"M01 / 0201", qty:1 },
      { materialId:"M01 / 0404", qty:1 },
      { materialId:"H01 / 0030-1111-0008", qty:4 },
      { materialId:"B04 / 3172", qty:1 },
      { materialId:"B04 / 3173", qty:1 },
      { materialId:"B04 / 4601", qty:1 },
      { materialId:"H02 / 170082", qty:1 },
      { materialId:"H01 / 0020-1111-0008", qty:2 },
      { materialId:"B04 / 4175", qty:1 },
      { materialId:"H02 / 170097", qty:1 },
      { materialId:"B04 / 2181", qty:1 },
      { materialId:"B04 / 2182", qty:1 },
      { materialId:"B04 / 3183", qty:1 },
      { materialId:"B04 / 4184", qty:1 },
      { materialId:"B04 / 4185", qty:1 },
      { materialId:"B04 / 4186", qty:2 },
      { materialId:"B04 / 3187", qty:1 },
      { materialId:"B04 / 4188", qty:1 },
      { materialId:"B04 / 4196", qty:1 },
      { materialId:"B04 / 4197", qty:1 },
      { materialId:"H01 / 0030-1110-0012", qty:4 },
      { materialId:"H02 / 170102", qty:1 },
      { materialId:"E02 / 0058", qty:1 },
      { materialId:"E02 / 0012", qty:1 },
      { materialId:"H01 / 0040-1110-0010", qty:4 },
      { materialId:"H02 / 170083", qty:1 },
      { materialId:"H01 / 0030-1111-0010", qty:4 },
      { materialId:"E02 / 0006", qty:2 },
      { materialId:"E02 / 0011", qty:1 },
      { materialId:"B04 / 4701", qty:1 },
      { materialId:"B04 / 0171", qty:1 },
      { materialId:"H01 / 0030-1110-0006", qty:4 },
      { materialId:"B04 / 3511", qty:1 },
      { materialId:"B04 / 3512", qty:1 },
      { materialId:"H02 / 170108", qty:1 },
      { materialId:"H02 / 170066", qty:2 },
      { materialId:"H02 / 170089", qty:1 },
      { materialId:"H02 / 170104", qty:3 },
      { materialId:"H02 / 170095", qty:1 },
      { materialId:"E02 / 0105 - A", qty:1 },
      { materialId:"CA01 / 3247", qty:1 },
      { materialId:"H01 / 0020-1710-0005", qty:2 },
      { materialId:"D01-4-00", qty:1 },
      { materialId:"B04 / 4168", qty:8 },
      { materialId:"H01 / 0020-1110-0008", qty:10 },
      { materialId:"H01 / 0020-7410", qty:10 },
      { materialId:"CA01 / 4248 - A", qty:1 },
      { materialId:"B04 / 3614", qty:1 },
      { materialId:"B04 / 3612", qty:1 },
      { materialId:"E02 / 0086", qty:1 },
      { materialId:"H01 / 0016-1110-0004", qty:4 },
      { materialId:"H01 / 0020-1110-0018", qty:4 },
      { materialId:"B04 / 3071", qty:1 },
      { materialId:"H02 / 170006", qty:2 },
      { materialId:"B04 / 3269", qty:2 },
      { materialId:"H01 / 0025-3010-0004", qty:6 },
      { materialId:"E01 / 0005", qty:1 },
      { materialId:"E03 / 0004", qty:136 },
      { materialId:"E02 / 0001", qty:1 },
      { materialId:"E02 / 0009", qty:2 },
      { materialId:"B04 / 2131", qty:1 },
      { materialId:"B04 / 3132", qty:1 },
      { materialId:"B04 / 3133", qty:1 },
      { materialId:"B04 / 3134", qty:3 },
      { materialId:"B04 / 3135", qty:1 },
      { materialId:"B04 / 4136", qty:1 },
      { materialId:"B04 / 0152", qty:1 },
      { materialId:"E01 / 0011", qty:1 },
      { materialId:"B04 / 4154", qty:4 },
      { materialId:"B04 / 4238", qty:2 },
      { materialId:"E02 / 0004", qty:2 },
      { materialId:"B04 / 3531", qty:2 },
      { materialId:"B04 / 3534", qty:2 },
      { materialId:"B04 / 3535", qty:2 },
      { materialId:"H02 / 170031", qty:2 },
      { materialId:"E01 / 0006", qty:1 },
      { materialId:"B04 / 4606", qty:1 },
      { materialId:"B04 / 0191", qty:1 },
      { materialId:"B04 / 4194", qty:8 },
      { materialId:"B04 / 4192", qty:2 },
      { materialId:"B04 / 4193", qty:2 },
      { materialId:"B04 / 3605", qty:1 },
      { materialId:"B04 / 2259", qty:2 },
      { materialId:"B04 / 4235", qty:2 },
      { materialId:"H02 / 170110", qty:2 },
      { materialId:"H01 / 0025-1110-0006", qty:6 },
      { materialId:"H01 / 0025-7410", qty:6 },
      { materialId:"B04 / 3236", qty:2 },
      { materialId:"B04 / 3265", qty:2 },
      { materialId:"B04 / 4266", qty:2 },
      { materialId:"B04 / 4267", qty:2 }
    ],
    FG013: [
      { materialId:"B04 / 4175", qty:1 },
      { materialId:"H02 / 170097", qty:1 },
      { materialId:"H01 / 0030-1111-0006", qty:2 },
      { materialId:"A03 / 3122", qty:1 },
      { materialId:"P07-2-00", qty:1 },
      { materialId:"H02 / 170200", qty:1 },
      { materialId:"H01 / 0020-1111-0006", qty:2 },
      { materialId:"B10 / 2181", qty:1 },
      { materialId:"B04 / 2182", qty:1 },
      { materialId:"B04 / 3183", qty:1 },
      { materialId:"B04 / 4184", qty:1 },
      { materialId:"B04 / 4185", qty:1 },
      { materialId:"B04 / 4186", qty:2 },
      { materialId:"B04 / 3187", qty:1 },
      { materialId:"B04 / 4188", qty:1 },
      { materialId:"B08 / 4182 - A", qty:2 },
      { materialId:"E02 / 0099", qty:1 },
      { materialId:"H01 / 0020-7410", qty:29 },
      { materialId:"H01 / 0040-1110-0010", qty:4 },
      { materialId:"E02 / 0081", qty:1 },
      { materialId:"E02 / 0098", qty:1 },
      { materialId:"H02 / 170202", qty:1 },
      { materialId:"H01 / 0030-1111-0010", qty:4 },
      { materialId:"E02 / 0097", qty:1 },
      { materialId:"H02 / 170201", qty:1 },
      { materialId:"A1X-1-00", qty:1 },
      { materialId:"B01-1-00", qty:1 },
      { materialId:"M03-2-00", qty:1 },
      { materialId:"B04 / 4168", qty:12 },
      { materialId:"B08 / 4196", qty:4 },
      { materialId:"FFC-14-0.5-30MM-5", qty:1 },
      { materialId:"H01 / 0020-1110-0025", qty:4 },
      { materialId:"H01 / 0020-1110-0018", qty:4 },
      { materialId:"B10 / 0102 - A", qty:1 },
      { materialId:"B08 / 4701", qty:1 },
      { materialId:"E02 / 0060", qty:1 },
      { materialId:"E03 / 0004", qty:2564 },
      { materialId:"E02 / 0001", qty:5 },
      { materialId:"E02 / 0102", qty:2 },
      { materialId:"E02 / 0113", qty:1 },
      { materialId:"E02 / 0101", qty:1 },
      { materialId:"E02 / 0103", qty:1 },
      { materialId:"E02 / 0107", qty:1 },
      { materialId:"E02 / 0115", qty:16 },
      { materialId:"E02 / 0009", qty:40 },
      { materialId:"H04 / 0010", qty:40 },
      { materialId:"H01 / 0020-1110-0006", qty:10 },
      { materialId:"B10 / 4113", qty:1 },
      { materialId:"E02 / 0088", qty:1 },
      { materialId:"B08 / 4163", qty:1 },
      { materialId:"H01 / 0020-1140-0008", qty:3 },
      { materialId:"H01 / 0025-1140-0008", qty:2 },
      { materialId:"H01 / 0025-1110-0014", qty:2 },
      { materialId:"B10 / 4171", qty:1 },
      { materialId:"E02 / 0146", qty:1 },
      { materialId:"H01 / 0030-1110-0006", qty:3 },
      { materialId:"H01 / 0030-1710-0008", qty:4 },
      { materialId:"H02 / 170119", qty:1 },
      { materialId:"H01 / 0025-1110-0006", qty:12 },
      { materialId:"R03-1-00", qty:1 },
      { materialId:"FFC-06-0.5-114-4", qty:1 },
      { materialId:"E02 / 0006", qty:2 },
      { materialId:"H01 / 0020-1110-0005", qty:7 },
      { materialId:"B10 / 3167 - A", qty:1 },
      { materialId:"E02 / 0105", qty:1 },
      { materialId:"CA01 / 3247", qty:1 },
      { materialId:"CA01 / 4248", qty:1 },
      { materialId:"E02 / 0086", qty:1 },
      { materialId:"D02-4-00", qty:1 },
      { materialId:"E02 / 0067", qty:1 },
      { materialId:"H01 / 0016-1110-0004", qty:4 },
      { materialId:"H01 / 0020-1710-0005", qty:2 },
      { materialId:"H01 / 0025-1110-0012", qty:3 },
      { materialId:"B04 / 4154", qty:4 },
      { materialId:"E01 / 0011", qty:1 },
      { materialId:"B10 / 0112 - A", qty:1 },
      { materialId:"B10 / 4501", qty:1 },
      { materialId:"B10 / 4502", qty:1 },
      { materialId:"B10 / 4503", qty:1 },
      { materialId:"B10 / 4123 - A", qty:1 },
      { materialId:"H01 / 0020-1110-0004", qty:12 },
      { materialId:"B10 / 3161", qty:1 },
      { materialId:"E01 / 0084", qty:1 },
      { materialId:"B10 / 4162", qty:1 },
      { materialId:"B10 / 4163", qty:1 },
      { materialId:"O02-1-00", qty:1 },
      { materialId:"H03 / 0095", qty:1 },
      { materialId:"H01 / 0025-2910-0003", qty:1 },
      { materialId:"B10 / 4128", qty:1 },
      { materialId:"E02 / 0111", qty:1 },
      { materialId:"H02 / 170163", qty:2 },
      { materialId:"H01 / 0020-2910-0003", qty:4 },
      { materialId:"F11-1-00", qty:1 },
      { materialId:"E01 / 0026", qty:1 },
      { materialId:"B10 / 3121", qty:1 },
      { materialId:"B07 / 4127", qty:1 },
      { materialId:"B07 / 4177", qty:1 },
      { materialId:"B10 / 4122", qty:1 },
      { materialId:"H04 / 0055", qty:1 },
      { materialId:"H02 / 170049", qty:1 },
      { materialId:"C04-1-00", qty:1 },
      { materialId:"A05 / 4503", qty:1 },
      { materialId:"A05 / 4504", qty:1 },
      { materialId:"H02 / 170156", qty:1 },
      { materialId:"H02 / 170174", qty:1 },
      { materialId:"H02 / 170162", qty:1 },
      { materialId:"H01 / 0025-3010-0004", qty:7 },
      { materialId:"B04 / 3269", qty:2 },
      { materialId:"H02 / 170006", qty:2 },
      { materialId:"B10 / 2157", qty:1 },
      { materialId:"B10 / 3153", qty:1 },
      { materialId:"A05 / 4152", qty:1 },
      { materialId:"B10 / 4154", qty:1 },
      { materialId:"B04 / 4238", qty:2 },
      { materialId:"E02 / 0004", qty:2 },
      { materialId:"B04 / 3531", qty:2 },
      { materialId:"B04 / 3534", qty:2 },
      { materialId:"B04 / 3535", qty:2 },
      { materialId:"H02 / 170031", qty:2 },
      { materialId:"B10 / 0142 - B", qty:1 },
      { materialId:"H02 / 170110", qty:2 },
      { materialId:"B08 / 4210 - A", qty:2 },
      { materialId:"B08 / 4211 - A", qty:2 },
      { materialId:"S07 - 2 - 00", qty:1 },
      { materialId:"B10 / 4146", qty:1 },
      { materialId:"B04 / 4194", qty:8 },
      { materialId:"H02 / 170076", qty:1 },
      { materialId:"H01 / 0025-7410", qty:6 },
      { materialId:"H01 / 0020-1110-0010", qty:8 },
      { materialId:"H01 / 0025-1110-0005", qty:6 },
      { materialId:"B04 / 2259", qty:2 },
      { materialId:"B04 / 4235", qty:2 },
      { materialId:"S08-1-00", qty:1 },
      { materialId:"B07 / 4183 - A", qty:1 },
      { materialId:"B07 / 4184", qty:1 },
      { materialId:"B10 / 4144", qty:2 },
      { materialId:"B10 / 4145", qty:2 },
      { materialId:"S12-1-00", qty:2 },
      { materialId:"B04 / 3236", qty:2 },
      { materialId:"B04 / 3265", qty:2 },
      { materialId:"B04 / 4266", qty:2 },
      { materialId:"B04 / 4267", qty:2 },
      { materialId:"E03 / 0004-2", qty:160 }
    ],
    FG022: [
      { materialId:"H04 / 0045", qty:1 },
      { materialId:"CA01 / 3709", qty:1 },
      { materialId:"CA01 / 0602", qty:1 },
      { materialId:"CA01 / 3269", qty:1 },
      { materialId:"CA01 / 4712", qty:1 },
      { materialId:"LAB / TM50-CCB", qty:1 },
      { materialId:"LAB / TM50-CCF", qty:1 },
      { materialId:"CA01 / 3081", qty:1 },
      { materialId:"CA01 / 4082", qty:1 },
      { materialId:"H01 / 0025-1111-0006", qty:2 },
      { materialId:"CA01 / 2201", qty:2 },
      { materialId:"CA01 / 4202", qty:2 },
      { materialId:"CA01 / 4203", qty:2 },
      { materialId:"CA01 / 4204", qty:2 },
      { materialId:"A06 / 4704", qty:2 },
      { materialId:"H03 / 0014", qty:2 },
      { materialId:"H04 / 0013", qty:2 },
      { materialId:"H04 / 0043", qty:4 },
      { materialId:"CA01 / 4703", qty:2 },
      { materialId:"M01 / 0806", qty:1 },
      { materialId:"M01 / 0804", qty:1 },
      { materialId:"M01 / 0803", qty:1 },
      { materialId:"M01 / 0201", qty:1 },
      { materialId:"M01 / 0404", qty:1 },
      { materialId:"H02 / 170145", qty:1 },
      { materialId:"H01 / 0025-1111-0005", qty:1 },
      { materialId:"H01 / 0020-1111-0005", qty:4 },
      { materialId:"H01 / 0020-2710-0004", qty:2 },
      { materialId:"H02 / 170112", qty:4 },
      { materialId:"CA01 / 3521", qty:1 },
      { materialId:"CA01 / 3522", qty:1 },
      { materialId:"H02 / 170106", qty:1 },
      { materialId:"H02 / 170061", qty:1 },
      { materialId:"H02 / 170125", qty:1 },
      { materialId:"H02 / 170160", qty:1 },
      { materialId:"H02 / 170159", qty:1 },
      { materialId:"CA01 / 3191", qty:1 },
      { materialId:"CA01 / 3192", qty:1 },
      { materialId:"CA01 / 4604", qty:1 },
      { materialId:"H02 / 170114", qty:1 },
      { materialId:"H02 / 170113", qty:1 },
      { materialId:"H01 / 0025-1711-0008", qty:2 },
      { materialId:"CA01 / 4222", qty:1 },
      { materialId:"CA01 / 4225", qty:3 },
      { materialId:"CA01 / 3321", qty:1 },
      { materialId:"CA01 / 4323", qty:1 },
      { materialId:"CA01 / 3324", qty:1 },
      { materialId:"CA01 / 4325", qty:1 },
      { materialId:"CA01 / 4326", qty:1 },
      { materialId:"H01 / 0020-1110-0005", qty:10 },
      { materialId:"CA01 / 4327", qty:1 },
      { materialId:"CA01 / 3603", qty:1 },
      { materialId:"B04 / 3614", qty:1 },
      { materialId:"B04 / 3612", qty:1 },
      { materialId:"B04 / 4168", qty:8 },
      { materialId:"E02 / 0047", qty:1 },
      { materialId:"E02 / 0048", qty:1 },
      { materialId:"E02 / 0069", qty:1 },
      { materialId:"H01 / 0020-1110-0016", qty:4 },
      { materialId:"H01 / 0020-7410", qty:10 },
      { materialId:"H01 / 0020-1111-0006", qty:6 },
      { materialId:"H02 / 170155", qty:1 },
      { materialId:"H01 / 0060-1711-0014", qty:2 },
      { materialId:"E02 / 0019", qty:1 },
      { materialId:"CA01 / 4261", qty:1 },
      { materialId:"CA01 / 4262", qty:1 },
      { materialId:"A06 / 4263", qty:1 },
      { materialId:"E02 / 0004", qty:1 },
      { materialId:"H01 / 0020-1111-0004", qty:2 },
      { materialId:"H02 / 170062", qty:1 },
      { materialId:"A06 / 4290", qty:1 },
      { materialId:"CA01 / 3187", qty:1 },
      { materialId:"H01 / 0025-2710-0004", qty:3 },
      { materialId:"CA01 / 3242", qty:1 },
      { materialId:"CA01 / 4245", qty:1 },
      { materialId:"CA01 / 4246", qty:1 },
      { materialId:"CA01 / 3247", qty:1 },
      { materialId:"CA01 / 3254", qty:1 },
      { materialId:"E02 / 0086", qty:1 },
      { materialId:"H01 / 0020-1110-0006", qty:2 },
      { materialId:"H01 / 0020-1710-0006", qty:7 },
      { materialId:"H01 / 0016-1110-0003", qty:4 },
      { materialId:"E02 / 0067", qty:1 },
      { materialId:"E02 / 0105", qty:1 },
      { materialId:"D02-4-00", qty:1 },
      { materialId:"CA01 / 2181", qty:1 },
      { materialId:"CA01 / 3182", qty:1 },
      { materialId:"A06 / 3183", qty:1 },
      { materialId:"CA01 / 3601 - V2", qty:1 },
      { materialId:"A03 / 3251", qty:1 },
      { materialId:"A03 / 3252", qty:1 },
      { materialId:"A03 / 4253", qty:1 },
      { materialId:"A03 / 4254", qty:1 },
      { materialId:"A03 / 4255", qty:1 },
      { materialId:"H01 / 0050-8210", qty:2 },
      { materialId:"H01 / 0025-2410-0004", qty:1 },
      { materialId:"H01 / 0050-8190", qty:1 },
      { materialId:"CA01 / 4174", qty:1 },
      { materialId:"A03 / 4112", qty:1 },
      { materialId:"CA01 / 1151", qty:1 },
      { materialId:"H01 / 0020-1711-0005", qty:2 },
      { materialId:"H02 / 170094", qty:1 },
      { materialId:"A04 / 3506", qty:1 },
      { materialId:"A04 / 3503", qty:1 },
      { materialId:"A04 / 3507", qty:1 },
      { materialId:"H02 / 170148", qty:1 },
      { materialId:"CA01 / 2241", qty:1 },
      { materialId:"CA01 / 4243", qty:2 },
      { materialId:"CA01 / 4244", qty:2 },
      { materialId:"H03 / 0079", qty:4 },
      { materialId:"H03 / 0080", qty:4 },
      { materialId:"CA01 / 3171", qty:1 },
      { materialId:"CA01 / 3172", qty:1 },
      { materialId:"CA01 / 4173", qty:1 },
      { materialId:"CA01 / 4175", qty:1 },
      { materialId:"H03 / 0078", qty:1 },
      { materialId:"CA01 / 3162", qty:1 },
      { materialId:"H02 / 170099", qty:1 },
      { materialId:"CA01 / 3271", qty:1 },
      { materialId:"A04 / 4182", qty:1 },
      { materialId:"A04 / 4183", qty:1 },
      { materialId:"A06 / 4271", qty:1 },
      { materialId:"P01-2-00", qty:1 },
      { materialId:"ED8181-ND", qty:1 },
      { materialId:"ED8182-ND", qty:1 }
    ],
    FG023: [
      { materialId:"H04 / 0045", qty:1 },
      { materialId:"CA01 / 3709", qty:1 },
      { materialId:"CA01 / 0602", qty:1 },
      { materialId:"CA01 / 3269", qty:1 },
      { materialId:"CA01 / 4712", qty:1 },
      { materialId:"LAB / TM50-CCB", qty:1 },
      { materialId:"LAB / TM50-CCF", qty:1 },
      { materialId:"CA01 / 3081", qty:1 },
      { materialId:"CA01 / 4082", qty:1 },
      { materialId:"H01 / 0025-1111-0006", qty:2 },
      { materialId:"CA01 / 2201", qty:2 },
      { materialId:"CA01 / 4202", qty:2 },
      { materialId:"CA01 / 4203", qty:2 },
      { materialId:"CA01 / 4204", qty:2 },
      { materialId:"A06 / 4704", qty:2 },
      { materialId:"H03 / 0014", qty:2 },
      { materialId:"H04 / 0013", qty:2 },
      { materialId:"H04 / 0043", qty:4 },
      { materialId:"CA01 / 4703", qty:2 },
      { materialId:"M01 / 0806", qty:1 },
      { materialId:"M01 / 0804", qty:1 },
      { materialId:"M01 / 0803", qty:1 },
      { materialId:"M01 / 0201", qty:1 },
      { materialId:"M01 / 0404", qty:1 },
      { materialId:"H02 / 170145", qty:1 },
      { materialId:"H01 / 0025-1111-0005", qty:1 },
      { materialId:"H01 / 0020-1111-0005", qty:8 },
      { materialId:"H01 / 0020-2710-0004", qty:2 },
      { materialId:"CA01 / 3086", qty:1 },
      { materialId:"CA01 / 4087", qty:1 },
      { materialId:"CA01 / 3088", qty:1 },
      { materialId:"CA01 / 4089", qty:1 },
      { materialId:"CA01 / 4525", qty:1 },
      { materialId:"CA01 / 4526", qty:1 },
      { materialId:"CA01 / 4314", qty:3 },
      { materialId:"CA01 / 4315", qty:1 },
      { materialId:"CA01 / 4323", qty:1 },
      { materialId:"H02 / 170112", qty:4 },
      { materialId:"H02 / 170149", qty:1 },
      { materialId:"H02 / 170106", qty:1 },
      { materialId:"H02 / 170160", qty:1 },
      { materialId:"H02 / 170061", qty:1 },
      { materialId:"CA01 / 3191", qty:1 },
      { materialId:"CA01 / 3192", qty:1 },
      { materialId:"CA01 / 4604", qty:1 },
      { materialId:"H02 / 170114", qty:1 },
      { materialId:"H02 / 170113", qty:1 },
      { materialId:"H01 / 0025-1711-0008", qty:2 },
      { materialId:"E02 / 0047", qty:1 },
      { materialId:"E02 / 0069", qty:1 },
      { materialId:"H01 / 0020-1111-0006", qty:6 },
      { materialId:"H01 / 0060-1711-0014", qty:2 },
      { materialId:"3P-CORE-SNG-01", qty:1 },
      { materialId:"3P-OLED-IF-01", qty:1 },
      { materialId:"E02 / 0125", qty:1 },
      { materialId:"CA01 / 3391", qty:1 },
      { materialId:"H01 / 0020-1710-0014", qty:4 },
      { materialId:"H01 / 0020-1110-0004", qty:4 },
      { materialId:"H02 / 170155", qty:1 },
      { materialId:"B04 / 4168", qty:4 },
      { materialId:"E02 / 0019", qty:1 },
      { materialId:"CA01 / 4261", qty:1 },
      { materialId:"CA01 / 4262", qty:1 },
      { materialId:"A06 / 4263", qty:1 },
      { materialId:"E02 / 0004", qty:1 },
      { materialId:"H01 / 0020-1111-0004", qty:2 },
      { materialId:"H02 / 170062", qty:1 },
      { materialId:"A06 / 4290", qty:1 },
      { materialId:"CA01 / 3187", qty:1 },
      { materialId:"H01 / 0025-2710-0004", qty:3 },
      { materialId:"H01 / 0020-7410", qty:10 },
      { materialId:"CA01 / 3242", qty:1 },
      { materialId:"CA01 / 4245", qty:1 },
      { materialId:"CA01 / 4246", qty:1 },
      { materialId:"CA01 / 3254", qty:1 },
      { materialId:"H01 / 0020-1110-0006", qty:6 },
      { materialId:"H01 / 0020-1710-0006", qty:2 },
      { materialId:"E02 / 0123", qty:1 },
      { materialId:"CA01 / 4399", qty:1 },
      { materialId:"CA01 / 4387", qty:1 },
      { materialId:"CA01 / 4248 - A", qty:1 },
      { materialId:"3P-IR-PROXY-01", qty:1 },
      { materialId:"E02 / 0121", qty:1 },
      { materialId:"E02 / 0122", qty:1 },
      { materialId:"H01 / 0016-1110-0004", qty:4 },
      { materialId:"H01 / 0020-1710-0008", qty:3 },
      { materialId:"H01 / 0020-7210", qty:3 },
      { materialId:"CA01 / 2181", qty:1 },
      { materialId:"CA01 / 3182", qty:1 },
      { materialId:"A06 / 3183", qty:1 },
      { materialId:"CA01 / 3601 - V2", qty:1 },
      { materialId:"H01 / 0020-1110-0005", qty:6 },
      { materialId:"A03 / 3251", qty:1 },
      { materialId:"A03 / 3252", qty:1 },
      { materialId:"A03 / 4253", qty:1 },
      { materialId:"A03 / 4254", qty:1 },
      { materialId:"A03 / 4255", qty:1 },
      { materialId:"H01 / 0050-8210", qty:2 },
      { materialId:"H01 / 0025-2410-0004", qty:1 },
      { materialId:"H01 / 0050-8190", qty:1 },
      { materialId:"CA01 / 4174", qty:1 },
      { materialId:"A03 / 4112", qty:1 },
      { materialId:"CA01 / 1151 - H", qty:1 },
      { materialId:"H01 / 0020-1711-0005", qty:2 },
      { materialId:"H02 / 170094", qty:1 },
      { materialId:"A04 / 3506", qty:1 },
      { materialId:"A04 / 3503", qty:1 },
      { materialId:"A04 / 3507", qty:1 },
      { materialId:"H02 / 170148", qty:1 },
      { materialId:"CA01 / 4243", qty:2 },
      { materialId:"CA01 / 4244", qty:2 },
      { materialId:"H03 / 0079", qty:4 },
      { materialId:"H03 / 0080", qty:4 },
      { materialId:"CA01 / 2386", qty:1 },
      { materialId:"CA01 / 3171", qty:1 },
      { materialId:"CA01 / 3172", qty:1 },
      { materialId:"CA01 / 4173", qty:1 },
      { materialId:"CA01 / 4175", qty:1 },
      { materialId:"H03 / 0078", qty:1 },
      { materialId:"CA01 / 3162", qty:1 },
      { materialId:"H02 / 170099", qty:1 },
      { materialId:"CA01 / 3271", qty:1 },
      { materialId:"A04 / 4182", qty:1 },
      { materialId:"A04 / 4183", qty:1 },
      { materialId:"A06 / 4271", qty:1 },
      { materialId:"P01-2-00", qty:1 },
      { materialId:"ED8181-ND", qty:1 },
      { materialId:"ED8182-ND", qty:1 }
    ],
    FG017: [
      { materialId:"A03 / 4703", qty:2 },
      { materialId:"A03 / 3055", qty:1 },
      { materialId:"E03 / 0001", qty:1 },
      { materialId:"H04 / 0008", qty:100 },
      { materialId:"H04 / 0009", qty:30 },
      { materialId:"H04 / 0041", qty:30 },
      { materialId:"H04 / 0010", qty:24 },
      { materialId:"H04 / 0011", qty:48 },
      { materialId:"E03 / 0002", qty:2 },
      { materialId:"E03 / 0003", qty:1 },
      { materialId:"E01 / 0027", qty:1 },
      { materialId:"E01 / 0016-LOCAL", qty:1 },
      { materialId:"B04 / 2031", qty:2 },
      { materialId:"B04 / 4032", qty:2 },
      { materialId:"B04 / 4036", qty:2 },
      { materialId:"B04 / 4037", qty:6 },
      { materialId:"B04 / 4703", qty:2 },
      { materialId:"B04 / 4704", qty:2 },
      { materialId:"H04 / 0013", qty:2 },
      { materialId:"H04 / 0015", qty:8 },
      { materialId:"H03 / 0014", qty:2 },
      { materialId:"B01 / 3111", qty:1 },
      { materialId:"B01 / 3112", qty:1 },
      { materialId:"B01 / 4101", qty:2 },
      { materialId:"M01 / 0806", qty:1 },
      { materialId:"M01 / 0804", qty:1 },
      { materialId:"M01 / 0803", qty:1 },
      { materialId:"M01 / 0201", qty:1 },
      { materialId:"M01 / 0404", qty:1 },
      { materialId:"A03 / 3122", qty:1 },
      { materialId:"B04 / 4601", qty:1 },
      { materialId:"H01 / 0020-1111-0006", qty:4 },
      { materialId:"H02 / 170121", qty:1 },
      { materialId:"A03 / 4159", qty:4 },
      { materialId:"A03 / 4160", qty:4 },
      { materialId:"A03 / 4114", qty:1 },
      { materialId:"H01 / 0020-1110-0003", qty:8 },
      { materialId:"H02 / 170129", qty:1 },
      { materialId:"H01 / 0030-1111-0006", qty:4 },
      { materialId:"E02 / 0063", qty:1 },
      { materialId:"H01 / 0025-1110-0008", qty:12 },
      { materialId:"A03 / 3187", qty:1 },
      { materialId:"H01 / 0025-3010-0003", qty:3 },
      { materialId:"H03 / 0049", qty:4 },
      { materialId:"H01 / 0060-1711-0014", qty:2 },
      { materialId:"A03 / 0121", qty:1 },
      { materialId:"A03 / 4172", qty:1 },
      { materialId:"A03 / 4173", qty:1 },
      { materialId:"E02 / 0060", qty:1 },
      { materialId:"E02 / 0062", qty:1 },
      { materialId:"A03 / 4701", qty:2 },
      { materialId:"H01 / 0025-2911-0004", qty:1 },
      { materialId:"H01 / 0020-1110-0004", qty:3 },
      { materialId:"H02 / 170122", qty:1 },
      { materialId:"H01 / 0025-1111-0006", qty:4 },
      { materialId:"A03 / 4133", qty:1 },
      { materialId:"A03 / 4137", qty:1 },
      { materialId:"A03 / 3508", qty:1 },
      { materialId:"A03 / 3513", qty:1 },
      { materialId:"A03 / 3511", qty:1 },
      { materialId:"H02 / 170063", qty:1 },
      { materialId:"H02 / 170125", qty:1 },
      { materialId:"H01 / 0020-7410", qty:9 },
      { materialId:"H01 / 0020-1110-0005", qty:5 },
      { materialId:"H01 / 0030-2210-0006", qty:8 },
      { materialId:"B04 / 3511", qty:1 },
      { materialId:"B04 / 3512", qty:1 },
      { materialId:"H02 / 170108", qty:1 },
      { materialId:"H02 / 170066", qty:2 },
      { materialId:"H02 / 170089", qty:1 },
      { materialId:"H02 / 170104", qty:3 },
      { materialId:"H02 / 170095", qty:1 },
      { materialId:"A03 / 3251", qty:1 },
      { materialId:"A03 / 3252", qty:1 },
      { materialId:"A03 / 4253", qty:1 },
      { materialId:"A03 / 4254", qty:1 },
      { materialId:"A03 / 4255", qty:1 },
      { materialId:"H01 / 0050-8210", qty:2 },
      { materialId:"H01 / 0025-2410-0004", qty:1 },
      { materialId:"H01 / 0050-8190", qty:1 },
      { materialId:"E01 / 0005", qty:1 },
      { materialId:"E03 / 0004", qty:290 },
      { materialId:"E02 / 0001", qty:2 },
      { materialId:"E02 / 0009", qty:4 },
      { materialId:"A03 / 0206", qty:1 },
      { materialId:"A03 / 3207", qty:1 },
      { materialId:"A03 / 3208", qty:1 },
      { materialId:"A03 / 3601", qty:1 },
      { materialId:"A03 / 3135", qty:1 },
      { materialId:"A03 / 3136", qty:1 },
      { materialId:"A03 / 4138", qty:1 },
      { materialId:"H03 / 0050", qty:1 },
      { materialId:"A03 / 3131", qty:1 },
      { materialId:"A03 / 4132", qty:1 },
      { materialId:"H01 / 0025-0010-0014", qty:1 },
      { materialId:"A03 / 3181", qty:1 },
      { materialId:"A03 / 4182", qty:1 },
      { materialId:"A03 / 4183", qty:1 },
      { materialId:"A03 / 4184", qty:1 },
      { materialId:"A03 / 4185", qty:1 },
      { materialId:"A03 / 4186", qty:1 },
      { materialId:"A03 / 4145", qty:1 },
      { materialId:"A03 / 3107", qty:1 },
      { materialId:"H01 / 0025-1110-0006", qty:3 },
      { materialId:"A03 / 4111", qty:1 },
      { materialId:"A03 / 3501", qty:1 },
      { materialId:"A03 / 3507", qty:1 },
      { materialId:"A03 / 3506", qty:1 },
      { materialId:"A03 / 3512", qty:1 },
      { materialId:"A03 / 3503", qty:1 },
      { materialId:"A03 / 3502", qty:1 },
      { materialId:"A03 / 4197", qty:1 },
      { materialId:"A03 / 2106", qty:1 },
      { materialId:"E01 / 0011", qty:1 },
      { materialId:"A03 / 4112", qty:1 },
      { materialId:"H02 / 170112", qty:1 },
      { materialId:"B04 / 2131", qty:1 },
      { materialId:"B04 / 3132", qty:1 },
      { materialId:"B04 / 3133", qty:1 },
      { materialId:"B04 / 3134", qty:3 },
      { materialId:"B04 / 3135", qty:1 },
      { materialId:"B04 / 4136", qty:1 },
      { materialId:"A03 / 3190", qty:1 },
      { materialId:"A03 / 4196", qty:1 },
      { materialId:"A03 / 4195", qty:1 },
      { materialId:"A03 / 4194", qty:1 },
      { materialId:"A03 / 4193", qty:1 },
      { materialId:"A03 / 4192", qty:1 },
      { materialId:"A03 / 4191", qty:1 },
      { materialId:"E01 / 0026", qty:1 },
      { materialId:"A03 / 4605", qty:1 },
      { materialId:"A03 / 4164", qty:1 },
      { materialId:"E02 / 0004", qty:1 },
      { materialId:"A03 / 4163", qty:2 },
      { materialId:"A03 / 4143", qty:2 },
      { materialId:"E02 / 0051", qty:1 },
      { materialId:"A03 / 4202", qty:2 },
      { materialId:"B04 / 3615", qty:1 },
      { materialId:"B04 / 4168", qty:8 },
      { materialId:"H01 / 0020-1110-0018", qty:4 },
      { materialId:"A03 / 3166", qty:1 },
      { materialId:"A03 / 4167", qty:1 },
      { materialId:"B04 / 4111", qty:1 },
      { materialId:"A03 / 0201", qty:1 },
      { materialId:"H02 / 170077", qty:2 },
      { materialId:"H01 / 0020-1110-0014", qty:2 },
      { materialId:"H01 / 0020-6010", qty:1 },
      { materialId:"E02 / 0019", qty:1 },
      { materialId:"B04 / 3614", qty:1 },
      { materialId:"B04 / 3612", qty:1 },
      { materialId:"B04 / 4115", qty:1 },
      { materialId:"E03 / 0006", qty:11 },
      { materialId:"A03 / 4168", qty:1 },
      { materialId:"B04 / 4117", qty:1 },
      { materialId:"B04 / 4116", qty:1 },
      { materialId:"B04 / 3113", qty:1 },
      { materialId:"B04 / 4112", qty:2 }
    ],
    FG021: [
      { materialId:"H04 / 0045", qty:1 },
      { materialId:"CA01 / 3709", qty:1 },
      { materialId:"CA01 / 0602", qty:1 },
      { materialId:"CA01 / 3269", qty:1 },
      { materialId:"CA01 / 4712", qty:1 },
      { materialId:"LAB / TM50-CCB", qty:1 },
      { materialId:"LAB / TM50-CCF", qty:1 },
      { materialId:"CA01 / 3081", qty:1 },
      { materialId:"CA01 / 4082", qty:1 },
      { materialId:"H01 / 0025-1111-0006", qty:2 },
      { materialId:"CA01 / 2201", qty:2 },
      { materialId:"CA01 / 4202", qty:2 },
      { materialId:"CA01 / 4203", qty:2 },
      { materialId:"CA01 / 4204", qty:2 },
      { materialId:"A06 / 4704", qty:2 },
      { materialId:"H03 / 0014", qty:2 },
      { materialId:"H04 / 0013", qty:2 },
      { materialId:"H04 / 0043", qty:4 },
      { materialId:"CA01 / 4703", qty:2 },
      { materialId:"M01 / 0806", qty:1 },
      { materialId:"M01 / 0804", qty:1 },
      { materialId:"M01 / 0803", qty:1 },
      { materialId:"M01 / 0201", qty:1 },
      { materialId:"M01 / 0404", qty:1 },
      { materialId:"H02 / 170145", qty:1 },
      { materialId:"H01 / 0025-1111-0005", qty:1 },
      { materialId:"H01 / 0020-1111-0005", qty:4 },
      { materialId:"H01 / 0020-2710-0004", qty:2 },
      { materialId:"H02 / 170112", qty:4 },
      { materialId:"CA01 / 3521", qty:1 },
      { materialId:"CA01 / 3522", qty:1 },
      { materialId:"H02 / 170106", qty:1 },
      { materialId:"H02 / 170061", qty:1 },
      { materialId:"H02 / 170125", qty:1 },
      { materialId:"H02 / 170160", qty:1 },
      { materialId:"H02 / 170159", qty:1 },
      { materialId:"CA01 / 3191", qty:1 },
      { materialId:"CA01 / 3192", qty:1 },
      { materialId:"CA01 / 4604", qty:1 },
      { materialId:"H02 / 170114", qty:1 },
      { materialId:"H02 / 170113", qty:1 },
      { materialId:"H01 / 0025-1711-0008", qty:2 },
      { materialId:"CA01 / 4222", qty:1 },
      { materialId:"CA01 / 4225", qty:3 },
      { materialId:"CA01 / 3321", qty:1 },
      { materialId:"CA01 / 4323", qty:1 },
      { materialId:"CA01 / 3324", qty:1 },
      { materialId:"CA01 / 4325", qty:1 },
      { materialId:"CA01 / 4326", qty:1 },
      { materialId:"H01 / 0020-1110-0005", qty:10 },
      { materialId:"CA01 / 4327", qty:1 },
      { materialId:"CA01 / 3603", qty:1 },
      { materialId:"B04 / 3614", qty:1 },
      { materialId:"B04 / 3612", qty:1 },
      { materialId:"B04 / 4168", qty:8 },
      { materialId:"E02 / 0047", qty:1 },
      { materialId:"E02 / 0048", qty:1 },
      { materialId:"E02 / 0069", qty:1 },
      { materialId:"H01 / 0020-1110-0016", qty:4 },
      { materialId:"H01 / 0020-7410", qty:10 },
      { materialId:"H01 / 0020-1111-0006", qty:6 },
      { materialId:"H02 / 170155", qty:1 },
      { materialId:"H01 / 0060-1711-0014", qty:2 },
      { materialId:"E02 / 0019", qty:1 },
      { materialId:"CA01 / 4261", qty:1 },
      { materialId:"CA01 / 4262", qty:1 },
      { materialId:"A06 / 4263", qty:1 },
      { materialId:"E02 / 0004", qty:1 },
      { materialId:"H01 / 0020-1111-0004", qty:2 },
      { materialId:"H02 / 170062", qty:1 },
      { materialId:"A06 / 4290", qty:1 },
      { materialId:"CA01 / 3187", qty:1 },
      { materialId:"H01 / 0025-2710-0004", qty:3 },
      { materialId:"CA01 / 3242", qty:1 },
      { materialId:"CA01 / 4245", qty:1 },
      { materialId:"CA01 / 4246", qty:1 },
      { materialId:"CA01 / 3247", qty:1 },
      { materialId:"CA01 / 4605", qty:1 },
      { materialId:"E02 / 0067", qty:1 },
      { materialId:"CA01 / 3254", qty:1 },
      { materialId:"E02 / 0051", qty:1 },
      { materialId:"E02 / 0086", qty:1 },
      { materialId:"H01 / 0020-1710-0006", qty:7 },
      { materialId:"H01 / 0016-1110-0003", qty:4 },
      { materialId:"H01 / 0020-1110-0006", qty:2 },
      { materialId:"CA01 / 2181", qty:1 },
      { materialId:"CA01 / 3182", qty:1 },
      { materialId:"A06 / 3183", qty:1 },
      { materialId:"CA01 / 3601 - V2", qty:1 },
      { materialId:"A03 / 3251", qty:1 },
      { materialId:"A03 / 3252", qty:1 },
      { materialId:"A03 / 4253", qty:1 },
      { materialId:"A03 / 4254", qty:1 },
      { materialId:"A03 / 4255", qty:1 },
      { materialId:"H01 / 0050-8210", qty:2 },
      { materialId:"H01 / 0025-2410-0004", qty:1 },
      { materialId:"H01 / 0050-8190", qty:1 },
      { materialId:"CA01 / 4174", qty:1 },
      { materialId:"A03 / 4112", qty:1 },
      { materialId:"CA01 / 1151", qty:1 },
      { materialId:"H01 / 0020-1711-0005", qty:2 },
      { materialId:"H02 / 170094", qty:1 },
      { materialId:"A04 / 3506", qty:1 },
      { materialId:"A04 / 3503", qty:1 },
      { materialId:"A04 / 3507", qty:1 },
      { materialId:"H02 / 170148", qty:1 },
      { materialId:"CA01 / 2241", qty:1 },
      { materialId:"CA01 / 4243", qty:2 },
      { materialId:"CA01 / 4244", qty:2 },
      { materialId:"H03 / 0079", qty:4 },
      { materialId:"H03 / 0080", qty:4 },
      { materialId:"CA01 / 3171", qty:1 },
      { materialId:"CA01 / 3172", qty:1 },
      { materialId:"CA01 / 4173", qty:1 },
      { materialId:"CA01 / 4175", qty:1 },
      { materialId:"H03 / 0078", qty:1 },
      { materialId:"CA01 / 3162", qty:1 },
      { materialId:"H02 / 170099", qty:1 },
      { materialId:"CA01 / 3271", qty:1 },
      { materialId:"A04 / 4182", qty:1 },
      { materialId:"A04 / 4183", qty:1 },
      { materialId:"A06 / 4271", qty:1 },
      { materialId:"P01-2-00", qty:1 },
      { materialId:"ED8181-ND", qty:1 },
      { materialId:"ED8182-ND", qty:1 }
    ],
    FG020: [
      { materialId:"H04 / 0045", qty:1 },
      { materialId:"CA01 / 3709", qty:1 },
      { materialId:"CA01 / 0602", qty:1 },
      { materialId:"CA01 / 3269", qty:1 },
      { materialId:"CA01 / 4711", qty:1 },
      { materialId:"LAB / TM50-CCB", qty:1 },
      { materialId:"LAB / TM50-CCF", qty:1 },
      { materialId:"CA01 / 3061", qty:1 },
      { materialId:"CA01 / 4062", qty:1 },
      { materialId:"H01 / 0025-1111-0006", qty:2 },
      { materialId:"CA01 / 2201", qty:2 },
      { materialId:"CA01 / 4202", qty:2 },
      { materialId:"CA01 / 4203", qty:2 },
      { materialId:"CA01 / 4204", qty:2 },
      { materialId:"A06 / 4704", qty:2 },
      { materialId:"H03 / 0014", qty:2 },
      { materialId:"H04 / 0013", qty:2 },
      { materialId:"H04 / 0043", qty:4 },
      { materialId:"CA01 / 4703", qty:2 },
      { materialId:"M01 / 0806", qty:1 },
      { materialId:"M01 / 0804", qty:1 },
      { materialId:"M01 / 0803", qty:1 },
      { materialId:"M01 / 0201", qty:1 },
      { materialId:"M01 / 0404", qty:1 },
      { materialId:"H02 / 170145", qty:2 },
      { materialId:"H01 / 0025-1111-0005", qty:1 },
      { materialId:"H01 / 0020-1111-0005", qty:4 },
      { materialId:"H01 / 0020-2710-0004", qty:2 },
      { materialId:"H02 / 170112", qty:4 },
      { materialId:"CA01 / 3531", qty:1 },
      { materialId:"CA01 / 3532", qty:1 },
      { materialId:"H02 / 170124", qty:1 },
      { materialId:"H02 / 170142", qty:1 },
      { materialId:"H02 / 170092", qty:1 },
      { materialId:"H02 / 170125", qty:1 },
      { materialId:"CA01 / 3191", qty:1 },
      { materialId:"CA01 / 3192", qty:1 },
      { materialId:"CA01 / 4604", qty:1 },
      { materialId:"H02 / 170114", qty:1 },
      { materialId:"H02 / 170113", qty:1 },
      { materialId:"H01 / 0025-1711-0008", qty:2 },
      { materialId:"CA01 / 4222", qty:1 },
      { materialId:"CA01 / 4225", qty:3 },
      { materialId:"CA01 / 3221", qty:1 },
      { materialId:"CA01 / 4223", qty:1 },
      { materialId:"CA01 / 3281", qty:1 },
      { materialId:"CA01 / 4282", qty:1 },
      { materialId:"H01 / 0020-1110-0005", qty:10 },
      { materialId:"CA01 / 4283", qty:1 },
      { materialId:"CA01 / 3603", qty:1 },
      { materialId:"B04 / 3614", qty:1 },
      { materialId:"B04 / 3612", qty:1 },
      { materialId:"B04 / 4168", qty:8 },
      { materialId:"E02 / 0047", qty:1 },
      { materialId:"E02 / 0048", qty:1 },
      { materialId:"E02 / 0069", qty:1 },
      { materialId:"H01 / 0020-1110-0016", qty:4 },
      { materialId:"H01 / 0020-7410", qty:10 },
      { materialId:"H01 / 0020-1111-0006", qty:6 },
      { materialId:"H02 / 170155", qty:1 },
      { materialId:"H01 / 0060-1711-0014", qty:2 },
      { materialId:"E02 / 0019", qty:1 },
      { materialId:"CA01 / 4261", qty:1 },
      { materialId:"CA01 / 4262", qty:1 },
      { materialId:"A06 / 4263", qty:1 },
      { materialId:"E02 / 0004", qty:1 },
      { materialId:"H01 / 0020-1111-0004", qty:2 },
      { materialId:"H02 / 170062", qty:1 },
      { materialId:"A06 / 4290", qty:1 },
      { materialId:"CA01 / 3187", qty:1 },
      { materialId:"H01 / 0025-2710-0004", qty:3 },
      { materialId:"CA01 / 3242", qty:1 },
      { materialId:"CA01 / 4245", qty:1 },
      { materialId:"CA01 / 4246", qty:1 },
      { materialId:"CA01 / 3247", qty:1 },
      { materialId:"CA01 / 4605", qty:1 },
      { materialId:"E02 / 0067", qty:1 },
      { materialId:"CA01 / 3254", qty:1 },
      { materialId:"E02 / 0051", qty:1 },
      { materialId:"E02 / 0086", qty:1 },
      { materialId:"H01 / 0020-1710-0006", qty:7 },
      { materialId:"H01 / 0016-1110-0003", qty:4 },
      { materialId:"H01 / 0020-1110-0006", qty:2 },
      { materialId:"CA01 / 2181", qty:1 },
      { materialId:"CA01 / 3182", qty:1 },
      { materialId:"A06 / 3183", qty:1 },
      { materialId:"CA01 / 3601 - V2", qty:1 },
      { materialId:"A03 / 3251", qty:1 },
      { materialId:"A03 / 3252", qty:1 },
      { materialId:"A03 / 4253", qty:1 },
      { materialId:"A03 / 4254", qty:1 },
      { materialId:"A03 / 4255", qty:1 },
      { materialId:"H01 / 0050-8210", qty:2 },
      { materialId:"H01 / 0025-2410-0004", qty:1 },
      { materialId:"H01 / 0050-8190", qty:1 },
      { materialId:"CA01 / 4174", qty:1 },
      { materialId:"A03 / 4112", qty:1 },
      { materialId:"CA01 / 1151", qty:1 },
      { materialId:"H01 / 0020-1711-0005", qty:2 },
      { materialId:"H02 / 170094", qty:1 },
      { materialId:"A04 / 3506", qty:1 },
      { materialId:"A04 / 3503", qty:1 },
      { materialId:"A04 / 3507", qty:1 },
      { materialId:"H02 / 170148", qty:1 },
      { materialId:"CA01 / 2241", qty:1 },
      { materialId:"CA01 / 4243", qty:2 },
      { materialId:"CA01 / 4244", qty:2 },
      { materialId:"H03 / 0079", qty:4 },
      { materialId:"H03 / 0080", qty:4 },
      { materialId:"CA01 / 3171", qty:1 },
      { materialId:"CA01 / 3172", qty:1 },
      { materialId:"CA01 / 4173", qty:1 },
      { materialId:"CA01 / 4175", qty:1 },
      { materialId:"H03 / 0078", qty:1 },
      { materialId:"CA01 / 3162", qty:1 },
      { materialId:"H02 / 170099", qty:1 },
      { materialId:"CA01 / 3271", qty:1 },
      { materialId:"A04 / 4182", qty:1 },
      { materialId:"A04 / 4183", qty:1 },
      { materialId:"A06 / 4271", qty:1 },
      { materialId:"P01-2-00", qty:1 },
      { materialId:"ED8181-ND", qty:1 },
      { materialId:"ED8182-ND", qty:1 }
    ]
  },
  salesOrders: [
    { id:"SO-0041", customer:"Meridian Defence",     fgId:"FG017", qty:2, date:"2024-01-14", dueDate:"2024-01-28", status:"In Production", priority:"HIGH",   total:10400, notes:"Urgent delivery — field deployment" },
    { id:"SO-0042", customer:"Delta Optics Ltd",     fgId:"FG009", qty:3, date:"2024-01-16", dueDate:"2024-01-25", status:"Picking",       priority:"NORMAL", total:9600,  notes:"" },
    { id:"SO-0043", customer:"Nexus Security",       fgId:"FG007", qty:2, date:"2024-01-18", dueDate:"2024-01-30", status:"Pending",       priority:"NORMAL", total:4800,  notes:"" },
    { id:"SO-0044", customer:"Apex Systems",         fgId:"FG020", qty:4, date:"2024-01-20", dueDate:"2024-01-28", status:"Pending",       priority:"HIGH",   total:8400,  notes:"Urgent — training exercise deadline" },
    { id:"SO-0045", customer:"Ironfield Tactical",   fgId:"FG008", qty:1, date:"2024-01-22", dueDate:"2024-02-05", status:"Quote",         priority:"NORMAL", total:1950,  notes:"" },
  ],
  workOrders: [
    { id:"WO-0019", soId:"SO-0041", fgId:"FG017", qty:2, line:"Line A", status:"In Progress", stage:"Assembly",    progress:72, startDate:"2024-01-20", endDate:"2024-01-28" },
    { id:"WO-0020", soId:"SO-0042", fgId:"FG009", qty:3, line:"Line B", status:"In Progress", stage:"Fabrication", progress:35, startDate:"2024-01-22", endDate:"2024-01-25" },
    { id:"WO-0021", soId:"SO-0043", fgId:"FG007", qty:2, line:"Line A", status:"Scheduled",   stage:"Pending",     progress:0,  startDate:"2024-01-26", endDate:"2024-01-30" },
  ],
  purchaseOrders: [
    { id:"PO-0088", supplier:"MetalCore Ltd",    materialId:"RM001", qty:800,  unitCost:2.20, status:"In Transit", orderDate:"2024-01-12", etaDate:"2024-01-25", total:1760 },
    { id:"PO-0089", supplier:"SealTech GmbH",    materialId:"RM007", qty:80,   unitCost:9.00, status:"Ordered",    orderDate:"2024-01-18", etaDate:"2024-01-28", total:720  },
    { id:"PO-0090", supplier:"BearingWorld",     materialId:"RM005", qty:150,  unitCost:4.50, status:"Ordered",    orderDate:"2024-01-19", etaDate:"2024-02-01", total:675  },
    { id:"PO-0091", supplier:"PCB Express",      materialId:"RM006", qty:30,   unitCost:36.00,status:"Confirmed",  orderDate:"2024-01-20", etaDate:"2024-01-30", total:1080 },
  ],
  suppliers: [
    { id:"SUP01", name:"MetalCore Ltd",      contact:"James Wu",       email:"j.wu@metalcore.com",   phone:"+44 161 500 1201", rating:4.8, leadDays:8,  category:"Raw Metal" },
    { id:"SUP02", name:"SealTech GmbH",      contact:"Petra Braun",    email:"p.braun@sealtech.de",  phone:"+49 89 4400 7700", rating:4.2, leadDays:10, category:"Seals & Gaskets" },
    { id:"SUP03", name:"BearingWorld",       contact:"Karen Mills",    email:"k.mills@bworld.co.uk", phone:"+44 117 930 4455", rating:4.6, leadDays:7,  category:"Mechanical" },
    { id:"SUP04", name:"PCB Express",        contact:"Tony Reyes",     email:"t.reyes@pcbexpress.io", phone:"+1 512 700 9900", rating:4.9, leadDays:9,  category:"Electronics" },
    { id:"SUP05", name:"AlumaTech Corp",     contact:"Rachel Ford",    email:"r.ford@alumatech.com", phone:"+1 416 844 3322", rating:4.3, leadDays:12, category:"Aluminum" },
  ],
};


// ─── REDUCER ──────────────────────────────────────────────────────────────────
function appReducer(state, { type, payload }) {
  switch(type) {
    case "ADD_SO":        return { ...state, salesOrders: [payload, ...state.salesOrders] };
    case "UPDATE_SO":     return { ...state, salesOrders: state.salesOrders.map(o => o.id===payload.id ? {...o,...payload} : o) };
    case "ADD_WO":        return { ...state, workOrders: [payload, ...state.workOrders] };
    case "UPDATE_WO":     return { ...state, workOrders: state.workOrders.map(w => w.id===payload.id ? {...w,...payload} : w) };
    case "ADD_PO":        return { ...state, purchaseOrders: [payload, ...state.purchaseOrders] };
    case "ADJUST_STOCK":  return { ...state, rawMaterials: state.rawMaterials.map(m => m.id===payload.id ? {...m, stock:payload.stock} : m) };
    case "ADD_PRODUCT":   return { ...state, finishedGoods: [...state.finishedGoods, payload] };
    case "UPDATE_PRODUCT":return { ...state, finishedGoods: state.finishedGoods.map(p => p.id===payload.id ? {...p,...payload} : p) };
    case "DELETE_PRODUCT":return { ...state, finishedGoods: state.finishedGoods.filter(p=>p.id!==payload.id) };
    case "SET_BOM":       return { ...state, bom: { ...state.bom, [payload.fgId]: payload.lines } };
    case "ADD_RM":        return { ...state, rawMaterials: [...state.rawMaterials, payload] };
    case "UPDATE_RM":     return { ...state, rawMaterials: state.rawMaterials.map(m => m.id===payload.id ? {...m,...payload} : m) };
    default: return state;
  }
}

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const fmt$  = n => "$" + Number(n||0).toLocaleString("en-US", {minimumFractionDigits:0, maximumFractionDigits:0});
const fmtDt = d => d ? new Date(d).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}) : "—";
const genId = p => `${p}-${String(Math.floor(Math.random()*90000)+10000)}`;

// ─── COLORS & THEME ───────────────────────────────────────────────────────────
const C = {
  bg:         "#f5f5f5",
  surface:    "#ffffff",
  border:     "#e0e0e0",
  borderMid:  "#d0d0d0",
  text:       "#212529",
  textMid:    "#6c757d",
  textLight:  "#adb5bd",
  primary:    "#714b67",    // Odoo purple
  primaryHov: "#5c3d55",
  primaryLight:"#f3eef1",
  success:    "#28a745",
  successBg:  "#d4edda",
  warning:    "#ffc107",
  warningBg:  "#fff3cd",
  danger:     "#dc3545",
  dangerBg:   "#f8d7da",
  info:       "#17a2b8",
  infoBg:     "#d1ecf1",
  orange:     "#e07b39",
  orangeBg:   "#fdebd0",
};

const STATUS_COLORS = {
  "Quote":        { bg:"#f0f0f0",  text:"#6c757d", dot:"#adb5bd" },
  "Pending":      { bg:"#fff3cd",  text:"#856404", dot:"#ffc107" },
  "Picking":      { bg:"#fdebd0",  text:"#7d3c00", dot:"#e07b39" },
  "In Progress":  { bg:"#cce5ff",  text:"#004085", dot:"#007bff" },
  "In Production":{ bg:"#cce5ff",  text:"#004085", dot:"#007bff" },
  "Assembly":     { bg:"#cce5ff",  text:"#004085", dot:"#007bff" },
  "Scheduled":    { bg:"#d1ecf1",  text:"#0c5460", dot:"#17a2b8" },
  "Confirmed":    { bg:"#d1ecf1",  text:"#0c5460", dot:"#17a2b8" },
  "Ordered":      { bg:"#d1ecf1",  text:"#0c5460", dot:"#17a2b8" },
  "In Transit":   { bg:"#d1ecf1",  text:"#0c5460", dot:"#17a2b8" },
  "Completed":    { bg:"#d4edda",  text:"#155724", dot:"#28a745" },
  "Shipped":      { bg:"#d4edda",  text:"#155724", dot:"#28a745" },
  "Received":     { bg:"#d4edda",  text:"#155724", dot:"#28a745" },
  "Delivered":    { bg:"#d4edda",  text:"#155724", dot:"#28a745" },
  "Cancelled":    { bg:"#f8d7da",  text:"#721c24", dot:"#dc3545" },
  "Low Stock":    { bg:"#f8d7da",  text:"#721c24", dot:"#dc3545" },
  "Critical":     { bg:"#f8d7da",  text:"#721c24", dot:"#dc3545" },
  "Normal":       { bg:"#d4edda",  text:"#155724", dot:"#28a745" },
  "HIGH":         { bg:"#f8d7da",  text:"#721c24", dot:"#dc3545" },
  "NORMAL":       { bg:"#f0f0f0",  text:"#6c757d", dot:"#adb5bd" },
};

// ─── PRIMITIVE UI COMPONENTS ─────────────────────────────────────────────────

const Badge = ({ label, size="sm" }) => {
  const s = STATUS_COLORS[label] || { bg:"#f0f0f0", text:"#6c757d", dot:"#adb5bd" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5,
      background:s.bg, color:s.text, borderRadius:20,
      padding: size==="sm" ? "2px 10px" : "4px 12px",
      fontSize: size==="sm" ? 11 : 12, fontWeight:500, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:s.dot, flexShrink:0 }}/>
      {label}
    </span>
  );
};

const Btn = ({ children, onClick, variant="primary", size="md", icon, disabled=false, style={} }) => {
  const variants = {
    primary:  { bg:C.primary, hover:C.primaryHov, text:"#fff",     border:C.primary },
    secondary:{ bg:"#fff",    hover:"#f8f9fa",    text:C.text,     border:C.border },
    danger:   { bg:"#fff",    hover:"#f8d7da",    text:C.danger,   border:C.danger },
    success:  { bg:"#fff",    hover:C.successBg,  text:C.success,  border:C.success },
    ghost:    { bg:"transparent", hover:"#f5f5f5", text:C.textMid, border:"transparent" },
  };
  const v = variants[variant] || variants.primary;
  const pad = size==="sm" ? "4px 10px" : size==="lg" ? "10px 20px" : "6px 14px";
  const fs  = size==="sm" ? 12 : 13;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ display:"inline-flex", alignItems:"center", gap:6,
        background:v.bg, color:v.text, border:`1px solid ${v.border}`,
        borderRadius:6, padding:pad, fontSize:fs, fontWeight:500,
        cursor:disabled?"not-allowed":"pointer", opacity:disabled?.5:1,
        transition:"all .15s", whiteSpace:"nowrap", ...style }}
      onMouseEnter={e=>{ if(!disabled){ e.currentTarget.style.background=v.hover; }}}
      onMouseLeave={e=>{ e.currentTarget.style.background=v.bg; }}>
      {icon && <span style={{fontSize:13}}>{icon}</span>}
      {children}
    </button>
  );
};

const Input = ({ label, ...p }) => (
  <div>
    {label && <div style={{fontSize:12,fontWeight:500,color:C.textMid,marginBottom:4}}>{label}</div>}
    <input {...p} style={{ width:"100%", border:`1px solid ${C.border}`,
      borderRadius:6, padding:"7px 10px", fontSize:13, color:C.text,
      background:"#fff", outline:"none", transition:"border .15s",
      boxSizing:"border-box", ...p.style }}
      onFocus={e=>{e.target.style.borderColor=C.primary; e.target.style.boxShadow=`0 0 0 3px ${C.primary}22`;}}
      onBlur={e=>{e.target.style.borderColor=C.border; e.target.style.boxShadow="none";}} />
  </div>
);

const Sel = ({ label, children, ...p }) => (
  <div>
    {label && <div style={{fontSize:12,fontWeight:500,color:C.textMid,marginBottom:4}}>{label}</div>}
    <select {...p} style={{ width:"100%", border:`1px solid ${C.border}`,
      borderRadius:6, padding:"7px 10px", fontSize:13, color:C.text,
      background:"#fff", outline:"none", cursor:"pointer",
      boxSizing:"border-box", ...p.style }}
      onFocus={e=>{e.target.style.borderColor=C.primary;}}
      onBlur={e=>{e.target.style.borderColor=C.border;}}>
      {children}
    </select>
  </div>
);

const Card = ({ children, style={}, pad=true }) => (
  <div style={{ background:C.surface, border:`1px solid ${C.border}`,
    borderRadius:8, boxShadow:"0 1px 3px rgba(0,0,0,.06)",
    padding: pad ? 20 : 0, ...style }}>
    {children}
  </div>
);

const PageHeader = ({ title, subtitle, actions }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
    marginBottom:20, paddingBottom:16, borderBottom:`1px solid ${C.border}` }}>
    <div>
      <h1 style={{ fontSize:20, fontWeight:600, color:C.text, margin:0 }}>{title}</h1>
      {subtitle && <p style={{ fontSize:13, color:C.textMid, marginTop:4 }}>{subtitle}</p>}
    </div>
    {actions && <div style={{ display:"flex", gap:8 }}>{actions}</div>}
  </div>
);

const StatCard = ({ label, value, sub, icon, color=C.primary, trend }) => (
  <Card style={{ padding:"18px 20px" }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <div>
        <div style={{ fontSize:12, color:C.textMid, fontWeight:500, marginBottom:8 }}>{label}</div>
        <div style={{ fontSize:24, fontWeight:700, color:C.text, lineHeight:1 }}>{value}</div>
        {sub && <div style={{ fontSize:12, color:C.textMid, marginTop:6 }}>{sub}</div>}
        {trend && <div style={{ fontSize:12, marginTop:6, color: trend>0?C.success:C.danger, fontWeight:500 }}>
          {trend>0?"↑":"↓"} {Math.abs(trend)}% vs last month
        </div>}
      </div>
      <div style={{ width:42, height:42, borderRadius:10, background:`${color}18`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:20, color:color }}>{icon}</div>
    </div>
  </Card>
);

const Modal = ({ title, onClose, children, width=560 }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:999,
    display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
    onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
    <div style={{ background:C.surface, borderRadius:10, width:"100%", maxWidth:width,
      maxHeight:"90vh", overflow:"auto", boxShadow:"0 20px 60px rgba(0,0,0,.2)",
      animation:"slide-in .2s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"16px 20px", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ fontSize:15, fontWeight:600, color:C.text }}>{title}</div>
        <button onClick={onClose} style={{ background:"none", border:"none",
          cursor:"pointer", color:C.textMid, fontSize:20, lineHeight:1,
          padding:"2px 6px", borderRadius:4 }}>×</button>
      </div>
      <div style={{ padding:20 }}>{children}</div>
    </div>
  </div>
);

const Table = ({ heads, children, style={} }) => (
  <div style={{ overflowX:"auto", ...style }}>
    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
      <thead>
        <tr style={{ borderBottom:`2px solid ${C.border}` }}>
          {heads.map(h => (
            <th key={h} style={{ padding:"10px 14px", textAlign:"left",
              color:C.textMid, fontWeight:500, fontSize:12,
              background:"#fafafa", whiteSpace:"nowrap" }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

const TR = ({ cells, onClick }) => (
  <tr onClick={onClick} style={{ borderBottom:`1px solid ${C.border}`,
    cursor:onClick?"pointer":"default", transition:"background .1s" }}
    onMouseEnter={e=>{if(onClick)e.currentTarget.style.background="#f8f9fa"}}
    onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}>
    {cells.map((c,i) => (
      <td key={i} style={{ padding:"10px 14px", color:C.text, verticalAlign:"middle" }}>{c}</td>
    ))}
  </tr>
);

const Progress = ({ value, color=C.primary }) => (
  <div style={{ background:"#e9ecef", borderRadius:20, height:6, overflow:"hidden", minWidth:60 }}>
    <div style={{ width:`${Math.min(value,100)}%`, height:"100%", background:color,
      borderRadius:20, transition:"width .4s ease" }} />
  </div>
);

const Divider = ({ label }) => (
  <div style={{ display:"flex", alignItems:"center", gap:12, margin:"16px 0" }}>
    {label && <span style={{ fontSize:11, color:C.textLight, whiteSpace:"nowrap", fontWeight:500 }}>{label}</span>}
    <div style={{ flex:1, height:1, background:C.border }} />
  </div>
);

const Alert = ({ type="info", children }) => {
  const s = { info:{bg:C.infoBg,text:C.info,icon:"ℹ"}, warning:{bg:C.warningBg,text:"#856404",icon:"⚠"},
    danger:{bg:C.dangerBg,text:C.danger,icon:"✕"}, success:{bg:C.successBg,text:C.success,icon:"✓"} };
  const t = s[type]||s.info;
  return (
    <div style={{ background:t.bg, borderRadius:6, padding:"10px 14px",
      display:"flex", gap:8, alignItems:"flex-start", fontSize:13, color:t.text }}>
      <span style={{fontWeight:700, marginTop:1}}>{t.icon}</span>
      <span>{children}</span>
    </div>
  );
};

const Tabs = ({ tabs, active, onChange }) => (
  <div style={{ display:"flex", borderBottom:`1px solid ${C.border}`, marginBottom:20 }}>
    {tabs.map(t => (
      <button key={t.id} onClick={()=>onChange(t.id)}
        style={{ padding:"10px 18px", background:"none", border:"none",
          borderBottom: active===t.id ? `2px solid ${C.primary}` : "2px solid transparent",
          color: active===t.id ? C.primary : C.textMid, fontWeight: active===t.id ? 600 : 400,
          fontSize:13, cursor:"pointer", transition:"all .15s", marginBottom:-1 }}>
        {t.icon && <span style={{marginRight:6}}>{t.icon}</span>}
        {t.label}
      </button>
    ))}
  </div>
);



// ════════════════════════════════════════════════════════════════════════════
// MODULE: DASHBOARD
// ════════════════════════════════════════════════════════════════════════════
const Dashboard = ({ S }) => {
  const { salesOrders, workOrders, rawMaterials, purchaseOrders, finishedGoods } = S;
  const activeWOs  = workOrders.filter(w=>w.status==="In Progress");
  const pendingSOs = salesOrders.filter(o=>["Pending","Quote","Picking"].includes(o.status));
  const critStock  = rawMaterials.filter(m=>m.stock <= m.minStock);
  const openPOs    = purchaseOrders.filter(p=>p.status!=="Received");
  const revenue    = salesOrders.filter(o=>["Delivered","Shipped"].includes(o.status)).reduce((s,o)=>s+o.total,0);
  const pipeline   = salesOrders.filter(o=>o.status!=="Cancelled").reduce((s,o)=>s+o.total,0);
  const highPrio   = salesOrders.filter(o=>o.priority==="HIGH"&&!["Delivered","Cancelled"].includes(o.status));

  return (
    <div style={{ animation:"slide-in .3s ease" }}>
      <PageHeader title="Dashboard" subtitle="Real-time operations overview" />

      {/* KPI Row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:20 }}>
        <StatCard label="Pipeline Value"     value={fmt$(pipeline)}         icon="📈" color={C.primary}  sub={`${salesOrders.filter(o=>o.status!=="Cancelled").length} active orders`} />
        <StatCard label="Revenue Shipped"    value={fmt$(revenue)}          icon="💰" color={C.success}  sub="Invoiced this period" />
        <StatCard label="Active Work Orders" value={activeWOs.length}       icon="⚙️" color={C.info}     sub={`${workOrders.filter(w=>w.status==="Scheduled").length} scheduled`} />
        <StatCard label="Pending Orders"     value={pendingSOs.length}      icon="📦" color={C.orange}   sub="Awaiting processing" />
        <StatCard label="Low Stock Items"    value={critStock.length}       icon="⚠️" color={C.danger}   sub="Below minimum level" />
        <StatCard label="Open POs"           value={openPOs.length}         icon="🛒" color="#6f42c1"    sub={fmt$(openPOs.reduce((s,p)=>s+p.total,0))+" committed"} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:16, marginBottom:16 }}>
        {/* Active Work Orders */}
        <Card style={{ padding:20 }}>
          <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:16 }}>Active Work Orders</div>
          {activeWOs.length===0 && <div style={{color:C.textMid,fontSize:13}}>No active work orders</div>}
          {activeWOs.map(wo => {
            const fg = finishedGoods.find(f=>f.id===wo.fgId);
            const so = salesOrders.find(s=>s.id===wo.soId);
            return (
              <div key={wo.id} style={{ padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <div>
                    <span style={{ fontSize:11, color:C.textMid, fontWeight:500 }}>{wo.id} · </span>
                    <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{fg?.name}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <Badge label={wo.stage||wo.status} />
                    <span style={{ fontSize:13, fontWeight:600, color:C.primary }}>{wo.progress}%</span>
                  </div>
                </div>
                <div style={{ fontSize:12, color:C.textMid, marginBottom:6 }}>
                  Qty {wo.qty} · {wo.line} · {so?.customer}
                </div>
                <Progress value={wo.progress} color={wo.progress>=80?C.success:wo.progress>=50?C.info:C.orange} />
              </div>
            );
          })}
        </Card>

        {/* Alerts */}
        <Card style={{ padding:20 }}>
          <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:16 }}>Alerts & Actions</div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {critStock.slice(0,4).map(m => (
              <div key={m.id} style={{ background:C.dangerBg, borderLeft:`3px solid ${C.danger}`,
                borderRadius:6, padding:"8px 12px" }}>
                <div style={{ fontSize:12, fontWeight:600, color:C.danger }}>Low Stock</div>
                <div style={{ fontSize:12, color:"#721c24", marginTop:2 }}>
                  {m.name.length>40?m.name.substring(0,40)+"...":m.name} — {m.stock} {m.unit} left
                </div>
              </div>
            ))}
            {highPrio.slice(0,3).map(o => (
              <div key={o.id} style={{ background:C.warningBg, borderLeft:`3px solid ${C.warning}`,
                borderRadius:6, padding:"8px 12px" }}>
                <div style={{ fontSize:12, fontWeight:600, color:"#856404" }}>High Priority</div>
                <div style={{ fontSize:12, color:"#856404", marginTop:2 }}>
                  {o.id} · {o.customer} · Due {fmtDt(o.dueDate)}
                </div>
              </div>
            ))}
            {openPOs.filter(p=>p.status==="In Transit").slice(0,2).map(p => (
              <div key={p.id} style={{ background:C.infoBg, borderLeft:`3px solid ${C.info}`,
                borderRadius:6, padding:"8px 12px" }}>
                <div style={{ fontSize:12, fontWeight:600, color:C.info }}>In Transit</div>
                <div style={{ fontSize:12, color:C.info, marginTop:2 }}>
                  {p.id} · ETA {fmtDt(p.etaDate)}
                </div>
              </div>
            ))}
            {critStock.length===0 && highPrio.length===0 &&
              <Alert type="success">All systems nominal — no alerts</Alert>}
          </div>
        </Card>
      </div>

      {/* Order Pipeline */}
      <Card style={{ padding:20 }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:16 }}>Order Pipeline</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {["Quote","Pending","Picking","In Production","Shipped","Delivered","Cancelled"].map(status => {
            const n = salesOrders.filter(o=>o.status===status).length;
            const s = STATUS_COLORS[status]||{bg:"#f0f0f0",text:"#666"};
            return (
              <div key={status} style={{ background:s.bg, borderRadius:8,
                padding:"14px 20px", minWidth:90, textAlign:"center" }}>
                <div style={{ fontSize:26, fontWeight:700, color:s.text, lineHeight:1 }}>{n}</div>
                <div style={{ fontSize:11, color:s.text, marginTop:4, fontWeight:500 }}>{status}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE: ANALYSIS
// ════════════════════════════════════════════════════════════════════════════
const Analysis = ({ S }) => {
  const { salesOrders, workOrders, rawMaterials, purchaseOrders, finishedGoods } = S;
  const [tab, setTab] = useState("revenue");

  // Revenue by product
  const revenueByProduct = finishedGoods.map(fg => {
    const orders = salesOrders.filter(o => o.fgId===fg.id && ["Shipped","Delivered"].includes(o.status));
    return { name: fg.name, id:fg.id, total: orders.reduce((s,o)=>s+o.total,0), qty: orders.reduce((s,o)=>s+o.qty,0) };
  }).filter(x=>x.total>0).sort((a,b)=>b.total-a.total);

  const totalRev = revenueByProduct.reduce((s,x)=>s+x.total,0);

  // Orders by status
  const orderStats = ["Quote","Pending","Picking","In Production","Shipped","Delivered","Cancelled"].map(s=>({
    status:s, count: salesOrders.filter(o=>o.status===s).length,
    value: salesOrders.filter(o=>o.status===s).reduce((acc,o)=>acc+o.total,0)
  }));

  // Production efficiency
  const woStats = {
    completed: workOrders.filter(w=>w.status==="Completed").length,
    active:    workOrders.filter(w=>w.status==="In Progress").length,
    scheduled: workOrders.filter(w=>w.status==="Scheduled").length,
    avgProgress: workOrders.length ? Math.round(workOrders.reduce((s,w)=>s+w.progress,0)/workOrders.length) : 0,
  };

  // Inventory health
  const invStats = {
    total:    rawMaterials.length,
    critical: rawMaterials.filter(m=>m.stock<=m.minStock).length,
    healthy:  rawMaterials.filter(m=>m.stock>m.minStock*2).length,
    zero:     rawMaterials.filter(m=>m.stock===0).length,
    byCategory: [...new Set(rawMaterials.map(m=>m.category))].map(cat => ({
      cat, count: rawMaterials.filter(m=>m.category===cat).length
    })).sort((a,b)=>b.count-a.count).slice(0,10)
  };

  // Procurement
  const procStats = {
    total:     purchaseOrders.length,
    pending:   purchaseOrders.filter(p=>["Ordered","Confirmed"].includes(p.status)).length,
    transit:   purchaseOrders.filter(p=>p.status==="In Transit").length,
    received:  purchaseOrders.filter(p=>p.status==="Received").length,
    totalValue: purchaseOrders.reduce((s,p)=>s+p.total,0),
  };

  const maxBar = (arr, key) => Math.max(...arr.map(x=>x[key]), 1);

  return (
    <div style={{ animation:"slide-in .3s ease" }}>
      <PageHeader title="Analysis & Reports" subtitle="Business intelligence across all operations" />

      {/* Summary KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        <StatCard label="Total Revenue"    value={fmt$(salesOrders.filter(o=>["Shipped","Delivered"].includes(o.status)).reduce((s,o)=>s+o.total,0))} icon="💰" color={C.success} />
        <StatCard label="Order Conversion" value={`${salesOrders.length ? Math.round(salesOrders.filter(o=>["Shipped","Delivered"].includes(o.status)).length/salesOrders.length*100) : 0}%`} icon="📊" color={C.primary} />
        <StatCard label="Avg Work Order Progress" value={`${woStats.avgProgress}%`} icon="⚙️" color={C.info} />
        <StatCard label="Inventory Health" value={`${rawMaterials.length ? Math.round((rawMaterials.length-invStats.critical)/rawMaterials.length*100):0}%`} icon="📦" color={invStats.critical>10?C.warning:C.success} />
      </div>

      <Tabs
        tabs={[
          {id:"revenue",    label:"Revenue", icon:"💰"},
          {id:"production", label:"Production", icon:"⚙️"},
          {id:"inventory",  label:"Inventory", icon:"📦"},
          {id:"procurement",label:"Procurement", icon:"🛒"},
        ]}
        active={tab} onChange={setTab}
      />

      {tab==="revenue" && (
        <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:16 }}>
          {/* Revenue by product bar chart */}
          <Card style={{ padding:20 }}>
            <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:16 }}>Revenue by Product</div>
            {revenueByProduct.length===0 && <div style={{color:C.textMid}}>No shipped/delivered orders yet</div>}
            {revenueByProduct.slice(0,10).map((x,i) => (
              <div key={x.id} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:12, color:C.text, fontWeight:500,
                    maxWidth:240, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {x.name}
                  </span>
                  <span style={{ fontSize:12, fontWeight:600, color:C.primary }}>{fmt$(x.total)}</span>
                </div>
                <div style={{ background:"#e9ecef", borderRadius:20, height:8, overflow:"hidden" }}>
                  <div style={{ width:`${(x.total/maxBar(revenueByProduct,"total"))*100}%`,
                    height:"100%", borderRadius:20,
                    background:`hsl(${280-i*20},50%,${55-i*3}%)`, transition:"width .4s" }} />
                </div>
                <div style={{ fontSize:11, color:C.textMid, marginTop:2 }}>{x.qty} unit{x.qty!==1?"s":""} sold</div>
              </div>
            ))}
          </Card>

          {/* Order value by status */}
          <Card style={{ padding:20 }}>
            <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:16 }}>Orders by Status</div>
            <Table heads={["Status","Orders","Value"]}>
              {orderStats.filter(s=>s.count>0).map(s => (
                <TR key={s.status} cells={[
                  <Badge label={s.status} />,
                  <span style={{fontWeight:600}}>{s.count}</span>,
                  <span style={{color:C.primary,fontWeight:500}}>{fmt$(s.value)}</span>
                ]} />
              ))}
            </Table>
          </Card>
        </div>
      )}

      {tab==="production" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <Card style={{ padding:20 }}>
            <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:16 }}>Work Order Summary</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              {[
                {label:"Completed", value:woStats.completed, color:C.success},
                {label:"In Progress", value:woStats.active, color:C.info},
                {label:"Scheduled", value:woStats.scheduled, color:C.orange},
                {label:"Avg Progress", value:`${woStats.avgProgress}%`, color:C.primary},
              ].map(x => (
                <div key={x.label} style={{ background:"#fafafa", borderRadius:8,
                  padding:"14px 16px", border:`1px solid ${C.border}` }}>
                  <div style={{ fontSize:11, color:C.textMid, fontWeight:500 }}>{x.label}</div>
                  <div style={{ fontSize:22, fontWeight:700, color:x.color, marginTop:4 }}>{x.value}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:12 }}>All Work Orders</div>
            <Table heads={["WO","Product","Progress","Status"]}>
              {workOrders.map(wo => {
                const fg = finishedGoods.find(f=>f.id===wo.fgId);
                return (
                  <TR key={wo.id} cells={[
                    <span style={{fontSize:11,color:C.textMid,fontFamily:"monospace"}}>{wo.id}</span>,
                    <span style={{fontSize:12,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{fg?.name}</span>,
                    <div style={{minWidth:80}}>
                      <div style={{fontSize:11,marginBottom:3}}>{wo.progress}%</div>
                      <Progress value={wo.progress} color={wo.progress>=80?C.success:wo.progress>=50?C.info:C.orange}/>
                    </div>,
                    <Badge label={wo.status}/>
                  ]}/>
                );
              })}
            </Table>
          </Card>

          <Card style={{ padding:20 }}>
            <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:16 }}>Products by Orders Volume</div>
            {finishedGoods.map(fg => {
              const n = salesOrders.filter(o=>o.fgId===fg.id).length;
              const maxN = Math.max(...finishedGoods.map(f=>salesOrders.filter(o=>o.fgId===f.id).length),1);
              return n>0 && (
                <div key={fg.id} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:12, color:C.text,
                      maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {fg.name}
                    </span>
                    <span style={{ fontSize:12, fontWeight:600, color:C.textMid }}>{n} orders</span>
                  </div>
                  <Progress value={(n/maxN)*100} color={C.primary} />
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {tab==="inventory" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <Card style={{ padding:20 }}>
            <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:16 }}>Inventory Health</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:20 }}>
              {[
                {label:"Total Parts", value:invStats.total, color:C.primary},
                {label:"Low Stock", value:invStats.critical, color:C.danger},
                {label:"Zero Stock", value:invStats.zero, color:C.danger},
                {label:"Well Stocked", value:invStats.healthy, color:C.success},
                {label:"Categories", value:[...new Set(rawMaterials.map(m=>m.category))].length, color:C.info},
                {label:"Health %", value:`${rawMaterials.length?Math.round((rawMaterials.length-invStats.critical)/rawMaterials.length*100):0}%`, color:C.success},
              ].map(x=>(
                <div key={x.label} style={{background:"#fafafa",borderRadius:8,padding:"12px 14px",border:`1px solid ${C.border}`}}>
                  <div style={{fontSize:11,color:C.textMid,fontWeight:500}}>{x.label}</div>
                  <div style={{fontSize:20,fontWeight:700,color:x.color,marginTop:4}}>{x.value}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:12 }}>Parts by Category</div>
            {invStats.byCategory.map((x,i) => (
              <div key={x.cat} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontSize:12, color:C.text }}>{x.cat}</span>
                  <span style={{ fontSize:12, fontWeight:600, color:C.textMid }}>{x.count}</span>
                </div>
                <Progress value={(x.count/invStats.byCategory[0].count)*100} color={`hsl(${220+i*15},60%,55%)`}/>
              </div>
            ))}
          </Card>

          <Card style={{ padding:20 }}>
            <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:16 }}>Critical Stock Items</div>
            {rawMaterials.filter(m=>m.stock<=m.minStock).length===0
              ? <Alert type="success">All materials above minimum stock levels</Alert>
              : <Table heads={["Ref","Part","Stock","Min"]}>
                  {rawMaterials.filter(m=>m.stock<=m.minStock).map(m=>(
                    <TR key={m.id} cells={[
                      <span style={{fontSize:11,color:C.textMid,fontFamily:"monospace"}}>{m.internalRef}</span>,
                      <span style={{fontSize:12,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{m.name}</span>,
                      <span style={{fontWeight:600,color:m.stock===0?C.danger:C.warning}}>{m.stock}</span>,
                      <span style={{color:C.textMid}}>{m.minStock}</span>
                    ]}/>
                  ))}
                </Table>
            }
          </Card>
        </div>
      )}

      {tab==="procurement" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <Card style={{ padding:20 }}>
            <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:16 }}>Procurement Summary</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
              {[
                {label:"Total POs", value:procStats.total, color:C.primary},
                {label:"Pending", value:procStats.pending, color:C.warning},
                {label:"In Transit", value:procStats.transit, color:C.info},
                {label:"Received", value:procStats.received, color:C.success},
              ].map(x=>(
                <div key={x.label} style={{background:"#fafafa",borderRadius:8,padding:"14px 16px",border:`1px solid ${C.border}`}}>
                  <div style={{fontSize:11,color:C.textMid,fontWeight:500}}>{x.label}</div>
                  <div style={{fontSize:22,fontWeight:700,color:x.color,marginTop:4}}>{x.value}</div>
                </div>
              ))}
            </div>
            <div style={{ background:C.primaryLight, borderRadius:8, padding:"14px 16px" }}>
              <div style={{ fontSize:12, color:C.textMid }}>Total Procurement Value</div>
              <div style={{ fontSize:24, fontWeight:700, color:C.primary, marginTop:4 }}>
                {fmt$(procStats.totalValue)}
              </div>
            </div>
          </Card>
          <Card style={{ padding:20 }}>
            <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:16 }}>Purchase Orders</div>
            <Table heads={["PO","Status","Value","ETA"]}>
              {purchaseOrders.map(po=>(
                <TR key={po.id} cells={[
                  <span style={{fontFamily:"monospace",fontSize:11}}>{po.id}</span>,
                  <Badge label={po.status}/>,
                  <span style={{fontWeight:600,color:C.primary}}>{fmt$(po.total)}</span>,
                  <span style={{color:C.textMid,fontSize:12}}>{fmtDt(po.etaDate)}</span>
                ]}/>
              ))}
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
};



// ════════════════════════════════════════════════════════════════════════════
// MODULE: PRODUCT & BOM EDITOR
// ════════════════════════════════════════════════════════════════════════════
const ProductEditor = ({ S, dispatch }) => {
  const { finishedGoods, bom, rawMaterials } = S;
  const [tab, setTab] = useState("products");
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [editBomFg, setEditBomFg] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importMsg, setImportMsg] = useState(null);
  const fileRef = useRef();

  const filtered = finishedGoods.filter(fg =>
    fg.name.toLowerCase().includes(search.toLowerCase()) ||
    fg.id.toLowerCase().includes(search.toLowerCase()) ||
    fg.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(finishedGoods.map(f=>f.category))];

  // ── ADD/EDIT PRODUCT FORM ──
  const ProductForm = ({ initial, onSave, onClose }) => {
    const [form, setForm] = useState(initial || { id:"", name:"", category:"", leadDays:5, basePrice:0 });
    const isNew = !initial?.id;
    return (
      <Modal title={isNew?"Add New Product":"Edit Product"} onClose={onClose} width={480}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {isNew && (
            <Input label="Product ID (e.g. FG034)" value={form.id}
              onChange={e=>setForm({...form,id:e.target.value.toUpperCase()})} placeholder="FG034" />
          )}
          <Input label="Product Name" value={form.name}
            onChange={e=>setForm({...form,name:e.target.value})} />
          <div style={{ display:"flex", gap:12 }}>
            <div style={{flex:1}}>
              <Sel label="Category" value={form.category}
                onChange={e=>setForm({...form,category:e.target.value})}>
                <option value="">Select or type below</option>
                {[...categories,"Electronics","Mounts","Optics","SKUA Systems","TARSIER","TWS","Cables","Other"].map(c=>(
                  <option key={c} value={c}>{c}</option>
                ))}
              </Sel>
            </div>
            <div style={{flex:1}}>
              <Input label="Custom Category" value={form.category}
                onChange={e=>setForm({...form,category:e.target.value})} placeholder="or type custom..." />
            </div>
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <div style={{flex:1}}>
              <Input label="Lead Days" type="number" value={form.leadDays}
                onChange={e=>setForm({...form,leadDays:parseInt(e.target.value)||0})} />
            </div>
            <div style={{flex:1}}>
              <Input label="Base Price (USD)" type="number" value={form.basePrice}
                onChange={e=>setForm({...form,basePrice:parseFloat(e.target.value)||0})} />
            </div>
          </div>
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:4 }}>
            <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
            <Btn onClick={()=>{ if(!form.name||(!initial?.id&&!form.id)) return; onSave(form); onClose(); }}>
              {isNew?"Add Product":"Save Changes"}
            </Btn>
          </div>
        </div>
      </Modal>
    );
  };

  // ── BOM EDITOR ──
  const BomEditor = ({ fg, onClose }) => {
    const currentBom = bom[fg.id] || [];
    const [lines, setLines] = useState(currentBom.map(l=>({...l})));
    const [rmSearch, setRmSearch] = useState("");
    const [showRmPicker, setShowRmPicker] = useState(false);

    const filteredRm = rawMaterials.filter(m =>
      m.name.toLowerCase().includes(rmSearch.toLowerCase()) ||
      m.internalRef.toLowerCase().includes(rmSearch.toLowerCase())
    ).slice(0,30);

    const addLine = (rm) => {
      if(!lines.find(l=>l.materialId===rm.id)) {
        setLines([...lines, { materialId:rm.id, qty:1 }]);
      }
      setShowRmPicker(false);
      setRmSearch("");
    };

    const removeLine = (idx) => setLines(lines.filter((_,i)=>i!==idx));

    const updateQty = (idx, qty) => setLines(lines.map((l,i)=>i===idx?{...l,qty:Math.max(1,parseInt(qty)||1)}:l));

    return (
      <Modal title={`BOM Editor — ${fg.name}`} onClose={onClose} width={760}>
        <div style={{ marginBottom:16 }}>
          <Alert type="info">
            {lines.length} component{lines.length!==1?"s":""} in BOM for {fg.id}
          </Alert>
        </div>

        {/* Add component button */}
        <div style={{ marginBottom:12 }}>
          <Btn icon="+" onClick={()=>setShowRmPicker(!showRmPicker)}>Add Component</Btn>
        </div>

        {/* RM picker */}
        {showRmPicker && (
          <div style={{ background:"#fafafa", border:`1px solid ${C.border}`,
            borderRadius:8, padding:14, marginBottom:14 }}>
            <Input placeholder="Search by part name or reference..." value={rmSearch}
              onChange={e=>setRmSearch(e.target.value)} style={{marginBottom:10}} />
            <div style={{ maxHeight:200, overflowY:"auto" }}>
              {filteredRm.length===0 && <div style={{color:C.textMid,fontSize:13}}>No matching parts</div>}
              {filteredRm.map(rm=>(
                <div key={rm.id} onClick={()=>addLine(rm)}
                  style={{ padding:"8px 10px", cursor:"pointer", borderRadius:6,
                    display:"flex", justifyContent:"space-between", alignItems:"center" }}
                  onMouseEnter={e=>e.currentTarget.style.background=C.primaryLight}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div>
                    <span style={{ fontSize:11, color:C.textMid, fontFamily:"monospace" }}>{rm.internalRef}</span>
                    <span style={{ fontSize:13, color:C.text, marginLeft:8 }}>
                      {rm.name.length>60?rm.name.substring(0,60)+"...":rm.name}
                    </span>
                  </div>
                  <span style={{ fontSize:11, color:C.textMid }}>{rm.category}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOM Lines */}
        <div style={{ maxHeight:380, overflowY:"auto", border:`1px solid ${C.border}`, borderRadius:8 }}>
          <Table heads={["Internal Ref","Part Name","Category","Unit","Qty",""]}>
            {lines.map((line, idx) => {
              const rm = rawMaterials.find(m=>m.id===line.materialId);
              return (
                <tr key={idx} style={{ borderBottom:`1px solid ${C.border}` }}>
                  <td style={{padding:"8px 14px"}}>
                    <span style={{fontSize:11,fontFamily:"monospace",color:C.textMid}}>{rm?.internalRef||line.materialId}</span>
                  </td>
                  <td style={{padding:"8px 14px", maxWidth:220}}>
                    <span style={{fontSize:12,color:C.text}}>
                      {rm ? (rm.name.length>45?rm.name.substring(0,45)+"...":rm.name) : line.materialId}
                    </span>
                  </td>
                  <td style={{padding:"8px 14px"}}>
                    <span style={{fontSize:11,color:C.textMid}}>{rm?.category||"—"}</span>
                  </td>
                  <td style={{padding:"8px 14px"}}>
                    <span style={{fontSize:11,color:C.textMid}}>{rm?.unit||"Units"}</span>
                  </td>
                  <td style={{padding:"8px 14px", width:80}}>
                    <input type="number" min={1} value={line.qty}
                      onChange={e=>updateQty(idx,e.target.value)}
                      style={{ width:60, border:`1px solid ${C.border}`, borderRadius:4,
                        padding:"4px 8px", fontSize:13, textAlign:"center" }} />
                  </td>
                  <td style={{padding:"8px 14px"}}>
                    <button onClick={()=>removeLine(idx)}
                      style={{ background:"none", border:"none", color:C.danger,
                        cursor:"pointer", fontSize:16, padding:"2px 6px" }}>×</button>
                  </td>
                </tr>
              );
            })}
            {lines.length===0 && (
              <tr><td colSpan={6} style={{padding:"20px",textAlign:"center",color:C.textMid}}>
                No components — click "Add Component" to start
              </td></tr>
            )}
          </Table>
        </div>

        <div style={{ display:"flex", gap:8, justifyContent:"flex-end", marginTop:16 }}>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn onClick={()=>{ dispatch({type:"SET_BOM",payload:{fgId:fg.id,lines}}); onClose(); }}>
            Save BOM ({lines.length} lines)
          </Btn>
        </div>
      </Modal>
    );
  };

  // ── EXCEL IMPORT ──
  const handleFileImport = async (e) => {
    const file = e.target.files[0];
    if(!file) return;
    setImportMsg({type:"info", text:"Reading file..."});

    try {
      // Read file as text (CSV) or use SheetJS if available
      const text = await file.text();
      const rows = text.split("\n").map(r=>r.split(",").map(c=>c.replace(/^"|"$/g,"").trim()));
      const header = rows[0].map(h=>h.toLowerCase());

      // Try to detect columns: internal_ref, name, category, unit, stock, min_stock
      const refIdx  = header.findIndex(h=>h.includes("ref")||h.includes("id"));
      const nameIdx = header.findIndex(h=>h.includes("name")||h.includes("description")||h.includes("material"));
      const catIdx  = header.findIndex(h=>h.includes("cat")||h.includes("type"));
      const unitIdx = header.findIndex(h=>h.includes("unit")||h.includes("uom"));
      const qtyIdx  = header.findIndex(h=>h.includes("qty")||h.includes("quantity"));

      if(nameIdx===-1) { setImportMsg({type:"danger",text:"Could not find a 'name' or 'description' column. Please ensure your CSV has a header row."}); return; }

      let added=0, skipped=0;
      rows.slice(1).forEach(row=>{
        if(!row[nameIdx]) return;
        const ref = refIdx!==-1 ? row[refIdx] : `IMP-${Math.random().toString(36).substr(2,6).toUpperCase()}`;
        const existing = S.rawMaterials.find(m=>m.id===ref||m.internalRef===ref);
        if(existing) { skipped++; return; }
        dispatch({ type:"ADD_RM", payload:{
          id:ref, internalRef:ref,
          name: row[nameIdx]||"",
          category: catIdx!==-1 ? row[catIdx] : "Imported",
          unit: unitIdx!==-1 ? row[unitIdx] : "Units",
          cost:0, stock:0, minStock:5
        }});
        added++;
      });
      setImportMsg({type:"success", text:`Import complete: ${added} parts added, ${skipped} already existed.`});
    } catch(err) {
      setImportMsg({type:"danger", text:`Error reading file: ${err.message}. Please use CSV format.`});
    }
    e.target.value="";
  };

  return (
    <div style={{ animation:"slide-in .3s ease" }}>
      <PageHeader title="Products & BOMs"
        subtitle="Add products, edit bills of materials, import parts"
        actions={
          <>
            <Btn variant="secondary" icon="📥" onClick={()=>setShowImport(!showImport)}>Import Parts</Btn>
            <Btn icon="+" onClick={()=>setShowAddProduct(true)}>Add Product</Btn>
          </>
        }
      />

      {/* Import panel */}
      {showImport && (
        <Card style={{ padding:20, marginBottom:20, background:"#f8f9fa" }}>
          <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:12 }}>Import Raw Materials from CSV / Excel</div>
          <div style={{ fontSize:13, color:C.textMid, marginBottom:12 }}>
            Upload a <strong>CSV file</strong> with columns: <code>Internal Ref, Name, Category, Unit, Stock, Min Stock</code>.
            For Excel (.xlsx), save as CSV first in Excel (File → Save As → CSV).
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls"
              onChange={handleFileImport} style={{ display:"none" }} />
            <Btn icon="📂" onClick={()=>fileRef.current?.click()}>Choose File</Btn>
            <span style={{ fontSize:12, color:C.textMid }}>Accepts .csv, .xlsx, .xls</span>
          </div>
          {importMsg && <div style={{ marginTop:12 }}><Alert type={importMsg.type}>{importMsg.text}</Alert></div>}
          <div style={{ marginTop:12, background:"#fff", borderRadius:6, padding:12, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:12, fontWeight:600, color:C.textMid, marginBottom:6 }}>Expected CSV Format:</div>
            <code style={{ fontSize:11, color:C.text, display:"block" }}>
              Internal Ref,Name,Category,Unit,Stock,Min Stock<br/>
              H01 / 0020,M2X10 Screw,Fasteners,Units,100,10<br/>
              CA01 / 4363,Battery Terminal Nut,Mech Part,Units,50,5
            </code>
          </div>
        </Card>
      )}

      <Tabs
        tabs={[{id:"products",label:"Finished Goods",icon:"🏭"},{id:"boms",label:"Bills of Materials",icon:"📋"}]}
        active={tab} onChange={setTab}
      />

      {/* Search */}
      <div style={{ marginBottom:16 }}>
        <Input placeholder="Search products by name, ID, or category..."
          value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      {tab==="products" && (
        <Card pad={false}>
          <Table heads={["ID","Product Name","Category","Lead Days","Base Price","BOM","Actions"]}>
            {filtered.map(fg => {
              const bomLines = bom[fg.id]||[];
              return (
                <TR key={fg.id} cells={[
                  <span style={{fontFamily:"monospace",fontSize:11,color:C.textMid}}>{fg.id}</span>,
                  <span style={{fontWeight:500,color:C.text}}>{fg.name}</span>,
                  <span style={{fontSize:12,color:C.textMid}}>{fg.category}</span>,
                  <span style={{fontSize:12}}>{fg.leadDays}d</span>,
                  <span style={{fontWeight:600,color:C.primary}}>{fmt$(fg.basePrice)}</span>,
                  <span style={{ fontSize:12, color: bomLines.length>0?C.success:C.warning, fontWeight:500 }}>
                    {bomLines.length>0 ? `${bomLines.length} parts` : "No BOM"}
                  </span>,
                  <div style={{display:"flex",gap:6}}>
                    <Btn size="sm" variant="secondary" onClick={()=>setEditProduct(fg)}>Edit</Btn>
                    <Btn size="sm" variant="secondary" onClick={()=>setEditBomFg(fg)}>BOM</Btn>
                    <Btn size="sm" variant="danger" onClick={()=>{
                      if(window.confirm(`Delete ${fg.name}?`))
                        dispatch({type:"DELETE_PRODUCT",payload:{id:fg.id}});
                    }}>Del</Btn>
                  </div>
                ]} />
              );
            })}
          </Table>
          {filtered.length===0 && (
            <div style={{ padding:30, textAlign:"center", color:C.textMid }}>
              No products found. <button onClick={()=>setShowAddProduct(true)}
                style={{color:C.primary,background:"none",border:"none",cursor:"pointer",fontSize:13,fontWeight:500}}>
                Add one now →
              </button>
            </div>
          )}
        </Card>
      )}

      {tab==="boms" && (
        <Card pad={false}>
          <Table heads={["Product","Category","BOM Lines","Coverage","Actions"]}>
            {filtered.map(fg => {
              const lines = bom[fg.id]||[];
              const covered = lines.filter(l=>rawMaterials.find(m=>m.id===l.materialId)).length;
              const pct = lines.length>0 ? Math.round((covered/lines.length)*100) : 0;
              return (
                <TR key={fg.id} cells={[
                  <div>
                    <div style={{fontWeight:500,color:C.text,fontSize:13}}>{fg.name}</div>
                    <div style={{fontSize:11,color:C.textMid,fontFamily:"monospace"}}>{fg.id}</div>
                  </div>,
                  <span style={{fontSize:12,color:C.textMid}}>{fg.category}</span>,
                  <span style={{fontWeight:600}}>{lines.length}</span>,
                  <div style={{minWidth:100}}>
                    <div style={{fontSize:11,marginBottom:3,color:pct===100?C.success:pct>50?C.warning:C.danger}}>
                      {pct}% matched
                    </div>
                    <Progress value={pct} color={pct===100?C.success:pct>50?C.warning:C.danger}/>
                  </div>,
                  <Btn size="sm" variant="secondary" icon="✏️" onClick={()=>setEditBomFg(fg)}>Edit BOM</Btn>
                ]}/>
              );
            })}
          </Table>
        </Card>
      )}

      {showAddProduct && (
        <ProductForm
          onSave={form=>dispatch({type:"ADD_PRODUCT",payload:{...form,id:form.id||genId("FG")}})}
          onClose={()=>setShowAddProduct(false)} />
      )}

      {editProduct && (
        <ProductForm
          initial={editProduct}
          onSave={form=>dispatch({type:"UPDATE_PRODUCT",payload:form})}
          onClose={()=>setEditProduct(null)} />
      )}

      {editBomFg && (
        <BomEditor fg={editBomFg} onClose={()=>setEditBomFg(null)} />
      )}
    </div>
  );
};



// ════════════════════════════════════════════════════════════════════════════
// MODULE: MANUFACTURING
// ════════════════════════════════════════════════════════════════════════════
const Manufacturing = ({ S }) => {
  const { finishedGoods, bom, rawMaterials } = S;
  const [selectedFG, setSelectedFG] = useState(finishedGoods[0]?.id);
  const [buildQty, setBuildQty] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = finishedGoods.filter(fg =>
    fg.name.toLowerCase().includes(search.toLowerCase()) ||
    fg.category.toLowerCase().includes(search.toLowerCase())
  );

  const fg       = finishedGoods.find(f=>f.id===selectedFG);
  const bomLines = bom[selectedFG] || [];

  const feasibility = bomLines.map(line => {
    const mat  = rawMaterials.find(m=>m.id===line.materialId);
    const need = line.qty * buildQty;
    const has  = mat?.stock || 0;
    const ok   = has >= need;
    const pct  = need > 0 ? Math.min((has/need)*100, 100) : 100;
    return { ...line, mat, need, has, ok, pct };
  });

  const canBuild   = feasibility.length > 0 && feasibility.every(f=>f.ok);
  const shortfalls = feasibility.filter(f=>!f.ok);
  const materialCost = bomLines.reduce((s,l)=>{
    const m = rawMaterials.find(r=>r.id===l.materialId);
    return s + (m?.cost||0)*l.qty;
  }, 0) * buildQty;
  const margin = fg && fg.basePrice > 0 ? ((fg.basePrice - materialCost/buildQty)/fg.basePrice*100).toFixed(1) : "N/A";

  return (
    <div style={{ animation:"slide-in .3s ease" }}>
      <PageHeader title="Manufacturing & BOM" subtitle="Bill of Materials · Feasibility · Material Requirements" />
      <div style={{ display:"grid", gridTemplateColumns:"320px 1fr", gap:16 }}>
        {/* Product list */}
        <div>
          <Input placeholder="Search products..." value={search}
            onChange={e=>setSearch(e.target.value)} style={{ marginBottom:12 }} />
          <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:"calc(100vh - 240px)", overflowY:"auto" }}>
            {filtered.map(fg => (
              <div key={fg.id} onClick={()=>setSelectedFG(fg.id)}
                style={{ padding:"12px 14px", borderRadius:8, cursor:"pointer",
                  border:`1px solid ${selectedFG===fg.id?C.primary:C.border}`,
                  background: selectedFG===fg.id ? C.primaryLight : C.surface,
                  transition:"all .15s" }}>
                <div style={{ fontWeight:500, fontSize:13, color:C.text }}>{fg.name}</div>
                <div style={{ fontSize:11, color:C.textMid, marginTop:3 }}>
                  {fg.id} · {fg.category} · {fmt$(fg.basePrice)} · Lead {fg.leadDays}d
                </div>
                <div style={{ fontSize:11, marginTop:4, color: (bom[fg.id]||[]).length>0?C.success:C.warning, fontWeight:500 }}>
                  {(bom[fg.id]||[]).length} BOM lines
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {fg ? (
            <>
              {/* Feasibility */}
              <Card style={{ padding:20 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:C.text }}>Feasibility Check — {fg.name}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:120 }}>
                      <Input type="number" value={buildQty} min={1}
                        onChange={e=>setBuildQty(Math.max(1,parseInt(e.target.value)||1))} />
                    </div>
                    <span style={{ fontSize:12, color:C.textMid }}>units</span>
                    <div style={{ padding:"8px 16px", borderRadius:6, fontWeight:600, fontSize:13,
                      background: canBuild ? C.successBg : C.dangerBg,
                      color: canBuild ? C.success : C.danger }}>
                      {bomLines.length===0 ? "No BOM" : canBuild ? "✓ Feasible" : `✗ ${shortfalls.length} shortfall${shortfalls.length>1?"s":""}`}
                    </div>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
                  <div style={{ background:"#fafafa", borderRadius:8, padding:"12px 16px", border:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:11, color:C.textMid }}>Material Cost</div>
                    <div style={{ fontSize:20, fontWeight:700, color:C.danger, marginTop:4 }}>{fmt$(materialCost)}</div>
                    <div style={{ fontSize:11, color:C.textMid }}>for {buildQty} unit{buildQty>1?"s":""}</div>
                  </div>
                  <div style={{ background:"#fafafa", borderRadius:8, padding:"12px 16px", border:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:11, color:C.textMid }}>Est. Margin</div>
                    <div style={{ fontSize:20, fontWeight:700, color:C.success, marginTop:4 }}>{margin}%</div>
                    <div style={{ fontSize:11, color:C.textMid }}>at base price {fmt$(fg.basePrice)}</div>
                  </div>
                  <div style={{ background:"#fafafa", borderRadius:8, padding:"12px 16px", border:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:11, color:C.textMid }}>BOM Lines</div>
                    <div style={{ fontSize:20, fontWeight:700, color:C.primary, marginTop:4 }}>{bomLines.length}</div>
                    <div style={{ fontSize:11, color:C.textMid }}>{shortfalls.length} shortfalls</div>
                  </div>
                </div>
              </Card>

              {/* BOM Table */}
              <Card pad={false}>
                <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, fontSize:14, fontWeight:600 }}>
                  Bill of Materials · {fg.name} ×{buildQty}
                </div>
                {bomLines.length===0
                  ? <div style={{padding:24,textAlign:"center",color:C.textMid}}>No BOM defined for this product</div>
                  : <Table heads={["Ref","Part Name","Category","Per Unit","Required","In Stock","Status"]}>
                      {feasibility.map((f,i) => (
                        <TR key={i} cells={[
                          <span style={{fontSize:11,fontFamily:"monospace",color:C.textMid}}>{f.mat?.internalRef||f.materialId}</span>,
                          <span style={{fontSize:12,maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>
                            {f.mat?.name||f.materialId}
                          </span>,
                          <span style={{fontSize:11,color:C.textMid}}>{f.mat?.category||"—"}</span>,
                          <span style={{fontSize:12}}>{f.qty} {f.mat?.unit||""}</span>,
                          <span style={{fontWeight:600,color:f.ok?C.text:C.danger}}>{f.need}</span>,
                          <span style={{fontWeight:600,color:f.has===0?C.danger:f.ok?C.success:C.warning}}>{f.has}</span>,
                          <Badge label={f.ok?"Normal":"Low Stock"} />
                        ]}/>
                      ))}
                    </Table>
                }
              </Card>
            </>
          ) : (
            <Card><div style={{color:C.textMid,textAlign:"center",padding:40}}>Select a product to view BOM</div></Card>
          )}
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE: INVENTORY
// ════════════════════════════════════════════════════════════════════════════
const Inventory = ({ S, dispatch }) => {
  const { rawMaterials } = S;
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editStock, setEditStock] = useState(null);
  const [newStock, setNewStock] = useState(0);
  const [catFilter, setCatFilter] = useState("all");

  const categories = ["all", ...new Set(rawMaterials.map(m=>m.category))].sort();

  const filtered = rawMaterials
    .filter(m => filter==="low" ? m.stock<=m.minStock : filter==="zero" ? m.stock===0 : true)
    .filter(m => catFilter==="all" || m.category===catFilter)
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) ||
                 m.internalRef.toLowerCase().includes(search.toLowerCase()));

  const critCount = rawMaterials.filter(m=>m.stock<=m.minStock).length;
  const zeroCount = rawMaterials.filter(m=>m.stock===0).length;

  return (
    <div style={{ animation:"slide-in .3s ease" }}>
      <PageHeader title="Inventory" subtitle={`${rawMaterials.length} raw materials · ${critCount} low stock`} />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        <StatCard label="Total SKUs"    value={rawMaterials.length}       icon="📦" color={C.primary} />
        <StatCard label="Low Stock"     value={critCount}                 icon="⚠️" color={C.warning} />
        <StatCard label="Zero Stock"    value={zeroCount}                 icon="🚫" color={C.danger} />
        <StatCard label="Categories"    value={categories.length-1}       icon="🏷️" color={C.info} />
      </div>

      <Card style={{ marginBottom:16, padding:14 }}>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
          <div style={{ flex:2, minWidth:200 }}>
            <Input placeholder="Search by name or internal ref..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <div style={{ flex:1, minWidth:140 }}>
            <Sel value={filter} onChange={e=>setFilter(e.target.value)}>
              <option value="all">All stock levels</option>
              <option value="low">Low / Critical</option>
              <option value="zero">Zero stock</option>
            </Sel>
          </div>
          <div style={{ flex:1, minWidth:140 }}>
            <Sel value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
              {categories.map(c=><option key={c} value={c}>{c==="all"?"All categories":c}</option>)}
            </Sel>
          </div>
          <div style={{ fontSize:12, color:C.textMid, whiteSpace:"nowrap" }}>
            {filtered.length} results
          </div>
        </div>
      </Card>

      <Card pad={false}>
        <Table heads={["Internal Ref","Part Name","Category","Unit","Stock","Min Stock","Status","Action"]}>
          {filtered.slice(0,200).map(m => (
            <TR key={m.id} cells={[
              <span style={{fontSize:11,fontFamily:"monospace",color:C.textMid}}>{m.internalRef}</span>,
              <span style={{fontSize:12,maxWidth:260,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{m.name}</span>,
              <span style={{fontSize:11,color:C.textMid}}>{m.category}</span>,
              <span style={{fontSize:12}}>{m.unit}</span>,
              <span style={{fontWeight:700,fontSize:14,color:m.stock===0?C.danger:m.stock<=m.minStock?C.warning:C.success}}>{m.stock}</span>,
              <span style={{fontSize:12,color:C.textMid}}>{m.minStock}</span>,
              <Badge label={m.stock===0?"Critical":m.stock<=m.minStock?"Low Stock":"Normal"} />,
              <Btn size="sm" variant="secondary" onClick={()=>{setEditStock(m);setNewStock(m.stock);}}>Adjust</Btn>
            ]}/>
          ))}
        </Table>
        {filtered.length>200 && <div style={{padding:"12px 20px",color:C.textMid,fontSize:12}}>
          Showing 200 of {filtered.length} results. Use search/filter to narrow down.
        </div>}
      </Card>

      {editStock && (
        <Modal title={`Adjust Stock — ${editStock.internalRef}`} onClose={()=>setEditStock(null)} width={400}>
          <div style={{ marginBottom:12, fontSize:13, color:C.textMid }}>
            {editStock.name.length>60?editStock.name.substring(0,60)+"...":editStock.name}
          </div>
          <div style={{ display:"flex", gap:12, alignItems:"flex-end" }}>
            <div style={{flex:1}}>
              <Input label={`New stock (${editStock.unit})`} type="number" min={0}
                value={newStock} onChange={e=>setNewStock(parseInt(e.target.value)||0)} />
            </div>
            <Btn onClick={()=>{ dispatch({type:"ADJUST_STOCK",payload:{id:editStock.id,stock:newStock}}); setEditStock(null); }}>
              Update
            </Btn>
          </div>
          <div style={{ marginTop:10, fontSize:12, color:C.textMid }}>
            Current: {editStock.stock} · Min: {editStock.minStock}
          </div>
        </Modal>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE: SALES ORDERS
// ════════════════════════════════════════════════════════════════════════════
const SalesOrders = ({ S, dispatch }) => {
  const { salesOrders, finishedGoods } = S;
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ customer:"", fgId:"", qty:1, dueDate:"", priority:"NORMAL", notes:"" });

  const filtered = salesOrders.filter(o => filter==="all" || o.status===filter);

  const statusOptions = ["Quote","Pending","Picking","In Production","Shipped","Delivered","Cancelled"];

  return (
    <div style={{ animation:"slide-in .3s ease" }}>
      <PageHeader title="Sales Orders"
        subtitle={`${salesOrders.length} total · ${fmt$(salesOrders.reduce((s,o)=>s+o.total,0))} pipeline`}
        actions={<Btn icon="+" onClick={()=>setShowAdd(true)}>New Order</Btn>}
      />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        <StatCard label="Total Orders"   value={salesOrders.length} icon="📋" color={C.primary} />
        <StatCard label="Pipeline"       value={fmt$(salesOrders.filter(o=>!["Cancelled"].includes(o.status)).reduce((s,o)=>s+o.total,0))} icon="📈" color={C.info} />
        <StatCard label="Shipped"        value={salesOrders.filter(o=>["Shipped","Delivered"].includes(o.status)).length} icon="🚚" color={C.success} />
        <StatCard label="High Priority"  value={salesOrders.filter(o=>o.priority==="HIGH"&&!["Delivered","Cancelled"].includes(o.status)).length} icon="🔴" color={C.danger} />
      </div>

      <Card style={{ marginBottom:16, padding:12 }}>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {["all",...statusOptions].map(s=>(
            <button key={s} onClick={()=>setFilter(s)}
              style={{ padding:"5px 14px", borderRadius:20, border:`1px solid ${filter===s?C.primary:C.border}`,
                background: filter===s?C.primaryLight:"#fff", color:filter===s?C.primary:C.textMid,
                fontSize:12, cursor:"pointer", fontWeight:filter===s?600:400 }}>
              {s==="all"?"All":s} ({s==="all"?salesOrders.length:salesOrders.filter(o=>o.status===s).length})
            </button>
          ))}
        </div>
      </Card>

      <Card pad={false}>
        <Table heads={["Order ID","Customer","Product","Qty","Total","Due","Priority","Status","Action"]}>
          {filtered.map(o => {
            const fg = finishedGoods.find(f=>f.id===o.fgId);
            return (
              <TR key={o.id} cells={[
                <span style={{fontFamily:"monospace",fontSize:11}}>{o.id}</span>,
                <span style={{fontWeight:500}}>{o.customer}</span>,
                <span style={{fontSize:12,color:C.textMid,maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{fg?.name||o.fgId}</span>,
                <span style={{fontWeight:600}}>{o.qty}</span>,
                <span style={{fontWeight:600,color:C.primary}}>{fmt$(o.total)}</span>,
                <span style={{fontSize:12,color:C.textMid}}>{fmtDt(o.dueDate)}</span>,
                <Badge label={o.priority}/>,
                <Badge label={o.status}/>,
                <Sel value={o.status} onChange={e=>dispatch({type:"UPDATE_SO",payload:{...o,status:e.target.value}})}
                  style={{width:130,padding:"4px 8px",fontSize:12}}>
                  {statusOptions.map(s=><option key={s} value={s}>{s}</option>)}
                </Sel>
              ]}/>
            );
          })}
        </Table>
      </Card>

      {showAdd && (
        <Modal title="New Sales Order" onClose={()=>setShowAdd(false)}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Input label="Customer Name" value={form.customer} onChange={e=>setForm({...form,customer:e.target.value})} />
            <Sel label="Product" value={form.fgId} onChange={e=>setForm({...form,fgId:e.target.value,
              price:finishedGoods.find(f=>f.id===e.target.value)?.basePrice||0})}>
              <option value="">Select product...</option>
              {finishedGoods.map(f=><option key={f.id} value={f.id}>{f.name} — {fmt$(f.basePrice)}</option>)}
            </Sel>
            <div style={{display:"flex",gap:12}}>
              <div style={{flex:1}}><Input label="Quantity" type="number" min={1} value={form.qty}
                onChange={e=>setForm({...form,qty:parseInt(e.target.value)||1})} /></div>
              <div style={{flex:1}}><Input label="Due Date" type="date" value={form.dueDate}
                onChange={e=>setForm({...form,dueDate:e.target.value})} /></div>
            </div>
            <Sel label="Priority" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
            </Sel>
            <Input label="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <Btn variant="secondary" onClick={()=>setShowAdd(false)}>Cancel</Btn>
              <Btn onClick={()=>{
                if(!form.customer||!form.fgId) return;
                const fg = finishedGoods.find(f=>f.id===form.fgId);
                dispatch({type:"ADD_SO",payload:{
                  ...form, id:genId("SO"),
                  date: new Date().toISOString().split("T")[0],
                  status:"Quote",
                  total: (fg?.basePrice||0)*form.qty
                }});
                setShowAdd(false);
                setForm({customer:"",fgId:"",qty:1,dueDate:"",priority:"NORMAL",notes:""});
              }}>Create Order</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE: PRODUCTION
// ════════════════════════════════════════════════════════════════════════════
const Production = ({ S, dispatch }) => {
  const { workOrders, salesOrders, finishedGoods } = S;
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ soId:"", fgId:"", qty:1, line:"Line A", startDate:"", endDate:"" });

  return (
    <div style={{ animation:"slide-in .3s ease" }}>
      <PageHeader title="Production Floor"
        subtitle={`${workOrders.filter(w=>w.status==="In Progress").length} active · ${workOrders.filter(w=>w.status==="Scheduled").length} scheduled`}
        actions={<Btn icon="+" onClick={()=>setShowAdd(true)}>New Work Order</Btn>}
      />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
        <StatCard label="In Progress"  value={workOrders.filter(w=>w.status==="In Progress").length}  icon="⚙️" color={C.info} />
        <StatCard label="Scheduled"    value={workOrders.filter(w=>w.status==="Scheduled").length}    icon="📅" color={C.orange} />
        <StatCard label="Completed"    value={workOrders.filter(w=>w.status==="Completed").length}    icon="✅" color={C.success} />
        <StatCard label="Avg Progress" value={`${workOrders.length?Math.round(workOrders.reduce((s,w)=>s+w.progress,0)/workOrders.length):0}%`} icon="📊" color={C.primary} />
      </div>

      <Card pad={false}>
        <Table heads={["WO ID","Sales Order","Product","Qty","Line","Progress","Stage","Status","Action"]}>
          {workOrders.map(wo => {
            const fg = finishedGoods.find(f=>f.id===wo.fgId);
            const so = salesOrders.find(s=>s.id===wo.soId);
            return (
              <TR key={wo.id} cells={[
                <span style={{fontFamily:"monospace",fontSize:11}}>{wo.id}</span>,
                <span style={{fontSize:11,color:C.textMid}}>{wo.soId}</span>,
                <span style={{fontSize:12,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{fg?.name}</span>,
                <span style={{fontWeight:600}}>{wo.qty}</span>,
                <span style={{fontSize:12}}>{wo.line}</span>,
                <div style={{minWidth:100}}>
                  <div style={{fontSize:11,marginBottom:3,display:"flex",justifyContent:"space-between"}}>
                    <span>{wo.progress}%</span>
                  </div>
                  <Progress value={wo.progress} color={wo.progress>=80?C.success:wo.progress>=50?C.info:C.orange}/>
                </div>,
                <span style={{fontSize:12,color:C.textMid}}>{wo.stage}</span>,
                <Badge label={wo.status}/>,
                <Btn size="sm" variant="secondary" onClick={()=>{
                  const p = Math.min(100, wo.progress+10);
                  dispatch({type:"UPDATE_WO",payload:{...wo,progress:p,status:p>=100?"Completed":wo.status}});
                }}>+10%</Btn>
              ]}/>
            );
          })}
        </Table>
      </Card>

      {showAdd && (
        <Modal title="New Work Order" onClose={()=>setShowAdd(false)}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Sel label="Sales Order" value={form.soId}
              onChange={e=>{
                const so=salesOrders.find(s=>s.id===e.target.value);
                setForm({...form,soId:e.target.value,fgId:so?.fgId||"",qty:so?.qty||1});
              }}>
              <option value="">Select sales order...</option>
              {salesOrders.filter(o=>!["Delivered","Cancelled"].includes(o.status)).map(o=>(
                <option key={o.id} value={o.id}>{o.id} — {o.customer}</option>
              ))}
            </Sel>
            <div style={{display:"flex",gap:12}}>
              <div style={{flex:1}}><Input label="Quantity" type="number" min={1} value={form.qty}
                onChange={e=>setForm({...form,qty:parseInt(e.target.value)||1})} /></div>
              <div style={{flex:1}}>
                <Sel label="Assembly Line" value={form.line} onChange={e=>setForm({...form,line:e.target.value})}>
                  <option>Line A</option><option>Line B</option><option>Line C</option>
                </Sel>
              </div>
            </div>
            <div style={{display:"flex",gap:12}}>
              <div style={{flex:1}}><Input label="Start Date" type="date" value={form.startDate}
                onChange={e=>setForm({...form,startDate:e.target.value})}/></div>
              <div style={{flex:1}}><Input label="End Date" type="date" value={form.endDate}
                onChange={e=>setForm({...form,endDate:e.target.value})}/></div>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <Btn variant="secondary" onClick={()=>setShowAdd(false)}>Cancel</Btn>
              <Btn onClick={()=>{
                if(!form.soId) return;
                dispatch({type:"ADD_WO",payload:{
                  ...form, id:genId("WO"), status:"Scheduled",
                  stage:"Preparation", progress:0
                }});
                setShowAdd(false);
              }}>Create Work Order</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
// MODULE: PROCUREMENT
// ════════════════════════════════════════════════════════════════════════════
const Procurement = ({ S, dispatch }) => {
  const { purchaseOrders, rawMaterials, suppliers } = S;
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ supplierId:"", materialId:"", qty:1, unitPrice:0, etaDate:"" });

  const statusOptions = ["Confirmed","Ordered","In Transit","Received","Cancelled"];
  const critMats = rawMaterials.filter(m=>m.stock<=m.minStock);

  return (
    <div style={{ animation:"slide-in .3s ease" }}>
      <PageHeader title="Procurement"
        subtitle={`${purchaseOrders.length} purchase orders · ${critMats.length} materials need restocking`}
        actions={<Btn icon="+" onClick={()=>setShowAdd(true)}>New PO</Btn>}
      />

      {critMats.length>0 && (
        <Alert type="warning" style={{marginBottom:16}}>
          {critMats.length} material{critMats.length>1?"s":""} at or below minimum stock level — consider raising POs
        </Alert>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
        <Card pad={false}>
          <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`, fontSize:14, fontWeight:600 }}>
            Purchase Orders
          </div>
          <Table heads={["PO","Supplier","Material","Qty","Total","ETA","Status","Action"]}>
            {purchaseOrders.map(po => {
              const m = rawMaterials.find(r=>r.id===po.materialId);
              const s = suppliers?.find(s=>s.id===po.supplierId);
              return (
                <TR key={po.id} cells={[
                  <span style={{fontFamily:"monospace",fontSize:11}}>{po.id}</span>,
                  <span style={{fontSize:12}}>{s?.name||po.supplierId||"—"}</span>,
                  <span style={{fontSize:11,color:C.textMid,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>
                    {m?.name||po.materialId||"—"}
                  </span>,
                  <span style={{fontSize:12}}>{po.qty}</span>,
                  <span style={{fontWeight:600,color:C.primary}}>{fmt$(po.total)}</span>,
                  <span style={{fontSize:11,color:C.textMid}}>{fmtDt(po.etaDate)}</span>,
                  <Badge label={po.status}/>,
                  <Sel value={po.status} onChange={e=>dispatch({type:"ADD_PO",payload:{...po,status:e.target.value}})}
                    style={{width:100,padding:"3px 6px",fontSize:11}}>
                    {statusOptions.map(s=><option key={s}>{s}</option>)}
                  </Sel>
                ]}/>
              );
            })}
          </Table>
        </Card>

        <Card style={{ padding:20 }}>
          <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:12 }}>Critical Stock — Needs Restocking</div>
          {critMats.length===0
            ? <Alert type="success">All materials are adequately stocked</Alert>
            : <div style={{ maxHeight:400, overflowY:"auto" }}>
                {critMats.map(m=>(
                  <div key={m.id} style={{ padding:"10px 12px", background:"#fafafa",
                    borderRadius:6, marginBottom:8, border:`1px solid ${C.border}`,
                    display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:12, fontWeight:500, color:C.text,
                        maxWidth:220, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize:11, color:C.textMid, marginTop:2 }}>
                        {m.internalRef} · {m.stock}/{m.minStock} {m.unit}
                      </div>
                    </div>
                    <Btn size="sm" onClick={()=>setForm({...form,materialId:m.id})&&setShowAdd(true)}>Order</Btn>
                  </div>
                ))}
              </div>
          }
        </Card>
      </div>

      {showAdd && (
        <Modal title="New Purchase Order" onClose={()=>setShowAdd(false)}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Sel label="Supplier" value={form.supplierId} onChange={e=>setForm({...form,supplierId:e.target.value})}>
              <option value="">Select supplier...</option>
              {(suppliers||[]).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </Sel>
            <Sel label="Material" value={form.materialId} onChange={e=>setForm({...form,materialId:e.target.value})}>
              <option value="">Select material...</option>
              {rawMaterials.filter((_,i)=>i<200).map(m=>(
                <option key={m.id} value={m.id}>{m.internalRef} — {m.name.substring(0,50)}</option>
              ))}
            </Sel>
            <div style={{display:"flex",gap:12}}>
              <div style={{flex:1}}><Input label="Quantity" type="number" min={1} value={form.qty}
                onChange={e=>setForm({...form,qty:parseInt(e.target.value)||1})}/></div>
              <div style={{flex:1}}><Input label="Unit Price (USD)" type="number" value={form.unitPrice}
                onChange={e=>setForm({...form,unitPrice:parseFloat(e.target.value)||0})}/></div>
            </div>
            <Input label="ETA Date" type="date" value={form.etaDate}
              onChange={e=>setForm({...form,etaDate:e.target.value})}/>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <Btn variant="secondary" onClick={()=>setShowAdd(false)}>Cancel</Btn>
              <Btn onClick={()=>{
                if(!form.materialId) return;
                dispatch({type:"ADD_PO",payload:{
                  ...form, id:genId("PO"), status:"Confirmed",
                  total:form.qty*form.unitPrice,
                  date:new Date().toISOString().split("T")[0]
                }});
                setShowAdd(false);
                setForm({supplierId:"",materialId:"",qty:1,unitPrice:0,etaDate:""});
              }}>Create PO</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};



// ════════════════════════════════════════════════════════════════════════════
// NAVIGATION CONFIG
// ════════════════════════════════════════════════════════════════════════════
const NAV = [
  { id:"dash",     label:"Dashboard",        icon:"⊞",  group:"Main" },
  { id:"analysis", label:"Analysis",         icon:"📊", group:"Main" },
  { id:"sales",    label:"Sales Orders",     icon:"📋", group:"Operations" },
  { id:"mfg",      label:"Manufacturing",    icon:"⚙️", group:"Operations" },
  { id:"prod",     label:"Production",       icon:"🏭", group:"Operations" },
  { id:"inv",      label:"Inventory",        icon:"📦", group:"Operations" },
  { id:"proc",     label:"Procurement",      icon:"🛒", group:"Operations" },
  { id:"editor",   label:"Products & BOMs",  icon:"✏️", group:"Configuration" },
];

// ════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [S, dispatch] = useReducer(appReducer, SEED);
  const [active, setActive] = useState("dash");
  const [clock, setClock] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(()=>{ const t=setInterval(()=>setClock(new Date()),1000); return ()=>clearInterval(t); },[]);

  const critAlerts = S.rawMaterials.filter(m=>m.stock<=m.minStock).length +
    S.salesOrders.filter(o=>o.priority==="HIGH"&&!["Delivered","Cancelled"].includes(o.status)).length;

  const groups = [...new Set(NAV.map(n=>n.group))];

  return (
    <>
      <GlobalStyles />
      <div style={{ display:"flex", height:"100vh", background:C.bg, fontFamily:"'Inter',sans-serif", overflow:"hidden" }}>

        {/* ── SIDEBAR ── */}
        <div style={{ width: sidebarCollapsed ? 56 : 230, background:"#fff",
          borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column",
          flexShrink:0, transition:"width .2s ease", overflow:"hidden" }}>

          {/* Logo */}
          <div style={{ padding: sidebarCollapsed?"14px 10px":"14px 16px",
            borderBottom:`1px solid ${C.border}`,
            display:"flex", alignItems:"center", justifyContent:"space-between", minHeight:56 }}>
            {!sidebarCollapsed && (
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:30, height:30, background:C.primary, borderRadius:6,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:"#fff", fontSize:15, fontWeight:700, flexShrink:0 }}>F</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:C.text, lineHeight:1 }}>FORGE ERP</div>
                  <div style={{ fontSize:10, color:C.textMid, marginTop:1 }}>Manufacturing</div>
                </div>
              </div>
            )}
            {sidebarCollapsed && (
              <div style={{ width:30, height:30, background:C.primary, borderRadius:6,
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"#fff", fontSize:15, fontWeight:700, margin:"0 auto" }}>F</div>
            )}
          </div>

          {/* Nav */}
          <nav style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
            {groups.map(group => (
              <div key={group}>
                {!sidebarCollapsed && (
                  <div style={{ padding:"10px 16px 4px", fontSize:10, fontWeight:600,
                    color:C.textLight, textTransform:"uppercase", letterSpacing:"0.08em" }}>
                    {group}
                  </div>
                )}
                {NAV.filter(n=>n.group===group).map(item => {
                  const on = active===item.id;
                  const badge = (item.id==="inv"||item.id==="dash") && critAlerts>0 ? critAlerts : 0;
                  return (
                    <button key={item.id} onClick={()=>setActive(item.id)} title={item.label}
                      style={{ display:"flex", alignItems:"center",
                        gap: sidebarCollapsed?0:10, width:"100%",
                        padding: sidebarCollapsed?"10px":"8px 12px 8px 16px",
                        justifyContent: sidebarCollapsed?"center":"flex-start",
                        background: on?C.primaryLight:"transparent",
                        border:"none", borderRadius:6,
                        color: on?C.primary:C.textMid,
                        cursor:"pointer", fontSize:13,
                        fontWeight: on?600:400,
                        transition:"all .12s",
                        margin: sidebarCollapsed?"2px 4px":"1px 8px" }}
                      onMouseEnter={e=>{ if(!on) e.currentTarget.style.background="#f5f5f5"; }}
                      onMouseLeave={e=>{ if(!on) e.currentTarget.style.background="transparent"; }}>
                      <span style={{ fontSize:15, flexShrink:0 }}>{item.icon}</span>
                      {!sidebarCollapsed && (
                        <>
                          <span style={{ flex:1, textAlign:"left" }}>{item.label}</span>
                          {badge>0 && (
                            <span style={{ background:C.danger, color:"#fff", borderRadius:10,
                              padding:"1px 6px", fontSize:10, fontWeight:600 }}>{badge}</span>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Sidebar footer */}
          {!sidebarCollapsed && (
            <div style={{ padding:"12px 16px", borderTop:`1px solid ${C.border}` }}>
              <div style={{ fontSize:11, color:C.textMid, marginBottom:2 }}>
                {clock.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})} ·{" "}
                {clock.toLocaleDateString([],{weekday:"short",day:"2-digit",month:"short"})}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:C.success,
                  animation:"pulse-dot 2s infinite" }}/>
                <span style={{ fontSize:10, color:C.textMid }}>Systems online</span>
              </div>
            </div>
          )}
        </div>

        {/* ── TOPBAR + CONTENT ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

          {/* Topbar */}
          <div style={{ height:56, background:"#fff", borderBottom:`1px solid ${C.border}`,
            display:"flex", alignItems:"center", padding:"0 20px",
            gap:12, flexShrink:0 }}>
            <button onClick={()=>setSidebarCollapsed(v=>!v)}
              style={{ background:"none", border:"none", cursor:"pointer",
                color:C.textMid, fontSize:18, padding:"4px 8px", borderRadius:6,
                lineHeight:1 }}>
              ☰
            </button>
            <div style={{ flex:1 }}>
              <span style={{ fontSize:13, fontWeight:600, color:C.text }}>
                {NAV.find(n=>n.id===active)?.label}
              </span>
            </div>
            {critAlerts>0 && (
              <div style={{ background:C.dangerBg, color:C.danger, borderRadius:20,
                padding:"4px 12px", fontSize:12, fontWeight:500,
                display:"flex", alignItems:"center", gap:6 }}>
                <span>⚠</span> {critAlerts} alert{critAlerts>1?"s":""}
              </div>
            )}
            <div style={{ fontSize:12, color:C.textMid }}>
              FORGE Manufacturing ERP
            </div>
          </div>

          {/* Main content */}
          <div style={{ flex:1, overflowY:"auto", padding:24 }}>
            {active==="dash"     && <Dashboard     S={S} />}
            {active==="analysis" && <Analysis      S={S} />}
            {active==="mfg"      && <Manufacturing S={S} />}
            {active==="inv"      && <Inventory     S={S} dispatch={dispatch} />}
            {active==="sales"    && <SalesOrders   S={S} dispatch={dispatch} />}
            {active==="prod"     && <Production    S={S} dispatch={dispatch} />}
            {active==="proc"     && <Procurement   S={S} dispatch={dispatch} />}
            {active==="editor"   && <ProductEditor S={S} dispatch={dispatch} />}
          </div>
        </div>
      </div>
    </>
  );
}
