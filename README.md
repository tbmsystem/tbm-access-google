# WebApp React + Vite + Firebase

Questa è una WebApp moderna realizzata con React, Vite, Tailwind CSS e Firebase, configurata per il deploy automatico su GitHub Pages.

## 🚀 Funzionalità

- **Setup Moderno**: Vite + React + Tailwind CSS
- **Autenticazione**: Login/Registrazione Email & Password, Login Google (Firebase Auth)
- **Database**: Firestore Database per salvataggio dati
- **Dashboard**: Visualizzazione dati, Tabelle CRUD, Statistiche
- **Grafici**: Visualizzazione dati dinamica con Recharts
- **CI/CD**: Deploy automatico su GitHub Pages tramite GitHub Actions

## 🛠️ Configurazione Iniziale

### 1. Prerequisiti
- Node.js installato (versione 18+)
- Account Google (per Firebase)
- Account GitHub

### 2. Setup Firebase
1. Vai su [Firebase Console](https://console.firebase.google.com/) e crea un nuovo progetto.
2. **Authentication**:
   - Vai su "Build" > "Authentication".
   - Clicca "Get Started".
   - Attiva "Email/Password" e "Google".
3. **Firestore Database**:
   - Vai su "Build" > "Firestore Database".
   - Clicca "Create Database".
   - Scegli la location (es. `eur3` per Europa).
   - Imposta le regole di sicurezza (per test puoi iniziare in "Test Mode", ma per produzione vedi sotto).
4. **Ottieni le chiavi**:
   - Vai su "Project Overview" (icona ingranaggio) > "Project settings".
   - Scorri in basso fino a "Your apps" e crea una Web App.
   - Copia la configurazione `firebaseConfig`.

### 3. Installazione Locale
1. Clona il repository o scarica i file.
2. Installa le dipendenze:
   ```bash
   npm install
   ```
3. Crea un file `.env.local` nella root del progetto copiando `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
4. Inserisci le tue chiavi Firebase nel file `.env.local`.

### 4. Avvio Sviluppo
```bash
npm run dev
```
Apri il browser all'indirizzo indicato (solitamente `http://localhost:5173`).

## 🔒 Regole di Sicurezza Firestore

Per proteggere i tuoi dati, usa queste regole in Firestore (tab "Rules"):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transazioni/{document=**} {
      // Solo utenti autenticati possono leggere/scrivere
      allow read, write: if request.auth != null;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 📦 Deploy su GitHub Pages

### Configurazione Repository
1. Pusha il codice su un repository GitHub.
2. Vai su "Settings" > "Secrets and variables" > "Actions".
3. Aggiungi i seguenti "Repository secrets" con i valori del tuo `.env.local`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### Workflow CI/CD
Il progetto include un workflow GitHub Actions (`.github/workflows/deploy.yml`) che farà automaticamente il build e il deploy ogni volta che fai push sul branch `main`.

Assicurati che in "Settings" > "Pages", la source sia impostata su "Deploy from a branch" e il branch sia `gh-pages` (verrà creato automaticamente dopo il primo deploy).

**Nota**: Potrebbe essere necessario modificare `vite.config.js` aggiungendo `base: '/nome-repo/'` se il deploy non avviene su un dominio custom.

## 📁 Struttura Progetto

```
src/
  ├── components/
  │   ├── charts/       # Componenti grafici (Recharts)
  │   ├── common/       # Componenti condivisi (Layout, PrivateRoute)
  │   └── dashboard/    # Componenti specifici dashboard (Stats, Tables)
  ├── context/          # React Context (Auth)
  ├── hooks/            # Custom Hooks (useFirestore)
  ├── lib/              # Configurazioni e utility (Firebase)
  ├── pages/            # Pagine dell'applicazione
  └── App.jsx           # Routing principale
```
