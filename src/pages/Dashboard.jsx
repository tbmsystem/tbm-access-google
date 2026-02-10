import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import StatsCard from '../components/dashboard/StatsCard';
import RevenueChart from '../components/charts/RevenueChart';
import TransactionTable from '../components/dashboard/TransactionTable';
import { DollarSign, TrendingDown, TrendingUp, Wallet, Plus, Euro } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { data: transactions, loading, add, remove, update } = useFirestore('transazioni');
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    description: '', 
    amount: '', 
    status: 'completed',
    type: 'expense', // 'income' or 'expense'
    date: format(new Date(), 'yyyy-MM-dd')
  });

  // Calcolo statistiche
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalBalance = totalIncome - totalExpense;
  
  // Dati per il grafico (raggruppati per mese - semplificato per demo)
  // In un'app reale, useremmo una libreria o una logica più complessa per raggruppare per data
  const chartData = transactions.slice(0, 10).map(t => ({
    name: t.date ? new Date(t.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }) : 'N/A',
    income: t.type === 'income' ? Number(t.amount) : 0,
    expense: t.type === 'expense' ? Number(t.amount) : 0,
    timestamp: t.date ? new Date(t.date).getTime() : 0
  })).sort((a, b) => a.timestamp - b.timestamp);

  const handleOpenModal = (transaction = null) => {
    if (transaction) {
      setEditingId(transaction.id);
      setFormData({
        description: transaction.description,
        amount: transaction.amount,
        status: transaction.status,
        type: transaction.type || 'expense',
        date: transaction.date || format(transaction.createdAt, 'yyyy-MM-dd')
      });
    } else {
      setEditingId(null);
      setFormData({ 
        description: '', 
        amount: '', 
        status: 'completed', 
        type: 'expense',
        date: format(new Date(), 'yyyy-MM-dd')
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        amount: Number(formData.amount),
        date: formData.date || format(new Date(), 'yyyy-MM-dd'),
        userId: user?.uid || null,
        userEmail: user?.email || null
      };

      if (editingId) {
        await update(editingId, data);
      } else {
        await add(data);
      }
      
      setShowModal(false);
      setFormData({ description: '', amount: '', status: 'completed', type: 'expense', date: format(new Date(), 'yyyy-MM-dd') });
      setEditingId(null);
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
      alert("Errore durante il salvataggio: " + error.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Caricamento...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuova Transazione
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Transazioni Totali" 
          value={transactions.length}
          color="purple" 
        />
        <StatsCard 
          title="Entrate" 
          value={`€${totalIncome.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`} 
          icon={TrendingUp} 
          color="green" 
        />
        <StatsCard 
          title="Uscite" 
          value={`€${totalExpense.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`} 
          icon={TrendingDown} 
          color="red" 
        />
        <StatsCard 
          title="Saldo Totale" 
          value={`€${totalBalance.toLocaleString('it-IT', { minimumFractionDigits: 2 })}`} 
          icon={Wallet} 
          color="blue" 
        />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <RevenueChart data={chartData} />
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionTable 
        transactions={transactions} 
        onDelete={remove} 
        onEdit={handleOpenModal}
      />

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Modifica Transazione' : 'Aggiungi Transazione'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Tipo Transazione */}
              <div className="flex gap-4 mb-4">
                <label className={`flex-1 cursor-pointer p-3 rounded-lg border-2 text-center transition ${
                  formData.type === 'income' 
                    ? 'border-green-500 bg-green-50 text-green-700 font-bold' 
                    : 'border-gray-200 text-gray-500'
                }`}>
                  <input 
                    type="radio" 
                    name="type" 
                    value="income" 
                    className="hidden" 
                    checked={formData.type === 'income'}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  />
                  Entrata 💰
                </label>
                <label className={`flex-1 cursor-pointer p-3 rounded-lg border-2 text-center transition ${
                  formData.type === 'expense' 
                    ? 'border-red-500 bg-red-50 text-red-700 font-bold' 
                    : 'border-gray-200 text-gray-500'
                }`}>
                  <input 
                    type="radio" 
                    name="type" 
                    value="expense" 
                    className="hidden" 
                    checked={formData.type === 'expense'}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  />
                  Uscita 💸
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione</label>
                <input
                  type="text"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Importo (€)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stato</label>
                <select
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="completed">Completato</option>
                  <option value="pending">In attesa</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Annulla
                </button>
                <button 
                  type="submit"
                  className={`px-4 py-2 text-white rounded hover:opacity-90 transition ${
                    formData.type === 'income' ? 'bg-green-600' : 'bg-red-600'
                  }`}
                >
                  {editingId ? 'Salva Modifiche' : 'Crea Transazione'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
