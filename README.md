# FORGE ERP — Manufacturing Operations System

A full-featured ERP for Assembly / Make-to-Order manufacturing.  
Modules: Command Center · Manufacturing & BOM · Inventory · Sales Orders · Production · Procurement

---

## 🚀 Deploy in 5 Minutes (Vercel — Recommended)

### Step 1 — Install prerequisites (one time only)
- Install **Node.js** from https://nodejs.org (choose "LTS" version)
- Install **Git** from https://git-scm.com
- Create a free account at https://vercel.com (sign up with GitHub)

### Step 2 — Put the project on GitHub
1. Go to https://github.com and create a **New Repository** (name it `forge-erp`)
2. On your computer, open a terminal / command prompt in this folder and run:
```
git init
git add .
git commit -m "Initial FORGE ERP deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/forge-erp.git
git push -u origin main
```

### Step 3 — Deploy to Vercel
1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Click **"Import"** next to your `forge-erp` GitHub repo
4. Leave all settings as default — Vercel auto-detects Vite
5. Click **"Deploy"**
6. In ~60 seconds you get a live URL like: `https://forge-erp-yourname.vercel.app`

### Step 4 — Share with colleagues
- Send them the Vercel URL — that's it!
- Works on any browser: Chrome, Edge, Firefox, Safari
- Works on PC, tablet, and phone

---

## 🌐 Deploy to Netlify (Alternative)

1. Go to https://app.netlify.com
2. Drag and drop the **`dist`** folder (after running `npm run build` locally)
   — OR connect your GitHub repo same as Vercel above
3. Netlify auto-reads `netlify.toml` and deploys

---

## 💻 Run Locally (for testing before deploying)

```bash
# Install dependencies (one time)
npm install

# Start local dev server
npm run dev
# Opens at http://localhost:3000

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
forge-erp/
├── index.html          # App entry point
├── vite.config.js      # Build configuration
├── vercel.json         # Vercel deployment config
├── netlify.toml        # Netlify deployment config
├── package.json        # Dependencies
└── src/
    ├── main.jsx        # React bootstrap
    └── App.jsx         # Full ERP application
```

---

## 🏭 Modules

| Module | Description |
|---|---|
| Command Center | Live KPIs, alerts, pipeline overview |
| Manufacturing & BOM | Bill of Materials, feasibility check, margin calculator |
| Inventory | Raw materials stock, reorder alerts, adjustments |
| Sales Orders | MTO quote-to-delivery with priority tracking |
| Production | Work orders, assembly line management, progress |
| Procurement | Purchase orders, supplier management |

---

## 🔒 Notes

- Data currently resets on page refresh (in-memory only)
- For permanent data storage, a database backend upgrade is available
- For user logins / access control, an auth layer can be added

---

Built with React + Vite · Deployable on Vercel / Netlify (free tier)
