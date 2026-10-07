'use client';

import { useState, useEffect } from 'react';
import GlassCard from './ui/GlassCard';
import Button from './ui/Button';
import { Search, Calculator, Info } from 'lucide-react';

type Bahan = {
  id: string;
  nama: string;
  kalori_per_100g: number;
  protein_per_100g: number;
  lemak_per_100g: number;
  karbohidrat_per_100g: number;
};

export default function NutritionChecker() {
  const [bahanList, setBahanList] = useState<Bahan[]>([]);
  const [selectedBahan, setSelectedBahan] = useState<Bahan | null>(null);
  const [porsi, setPorsi] = useState<number>(100);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bahan')
      .then(res => res.json())
      .then(data => {
        setBahanList(data);
        setLoading(false);
      });
  }, []);

  const filteredBahan = bahanList.filter(b => 
    b.nama.toLowerCase().includes(search.toLowerCase())
  );

  const result = selectedBahan ? {
    kalori: (selectedBahan.kalori_per_100g * porsi) / 100,
    protein: (selectedBahan.protein_per_100g * porsi) / 100,
    lemak: (selectedBahan.lemak_per_100g * porsi) / 100,
    karbo: (selectedBahan.karbohidrat_per_100g * porsi) / 100,
  } : null;

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-[var(--text-muted)]" size={18} />
            <input
              type="text"
              placeholder="Cari bahan makanan (misal: Ikan, Nasi...)"
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl focus:outline-none focus:border-[var(--accent-primary)] transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="max-h-56 overflow-y-auto space-y-2 pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {loading ? (
              <p className="text-center py-4 text-sm text-[var(--text-muted)]">Memuat data...</p>
            ) : filteredBahan.length > 0 ? (
              filteredBahan.map(b => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBahan(b)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all border ${
                    selectedBahan?.id === b.id 
                    ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white' 
                    : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--accent-primary)]'
                  }`}
                >
                  <p className="font-medium">{b.nama}</p>
                  <p className={`text-xs ${selectedBahan?.id === b.id ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                    {b.kalori_per_100g} kkal / 100g
                  </p>
                </button>
              ))
            ) : (
              <p className="text-center py-4 text-sm text-[var(--text-muted)]">Bahan tidak ditemukan</p>
            )}
          </div>

          {selectedBahan && (
            <div className="space-y-2 transition-all duration-300">
              <label className="block text-sm font-medium text-[var(--text-muted)]">Porsi (gram)</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  className="flex-1 px-4 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg focus:outline-none focus:border-[var(--accent-primary)]"
                  value={porsi}
                  onChange={(e) => setPorsi(Number(e.target.value))}
                />
                <div className="flex bg-[var(--glass-bg)] rounded-lg border border-[var(--glass-border)] overflow-hidden">
                  {[50, 100, 200].map(v => (
                    <button
                      key={v}
                      onClick={() => setPorsi(v)}
                      className={`px-3 py-2 text-xs font-medium border-r border-[var(--glass-border)] last:border-0 hover:bg-[var(--accent-primary)] hover:text-white transition-all ${porsi === v ? 'bg-[var(--accent-primary)] text-white' : ''}`}
                    >
                      {v}g
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Result Section */}
        <div className="glass-card-premium p-6 rounded-2xl flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Calculator size={80} />
          </div>
          
          {!selectedBahan ? (
            <div className="text-center space-y-3 py-10">
              <div className="w-16 h-16 bg-[var(--glass-bg)] rounded-full flex items-center justify-center mx-auto border border-[var(--glass-border)]">
                <Info className="text-[var(--accent-primary)]" size={32} />
              </div>
              <p className="text-[var(--text-secondary)] font-medium">Pilih bahan makanan untuk melihat kandungan gizinya</p>
            </div>
          ) : (
            <div className="space-y-6 transition-all duration-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gradient-premium">{selectedBahan.nama}</h3>
                <p className="text-sm text-[var(--text-muted)]">{porsi} gram</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--glass-bg)] p-4 rounded-xl border border-[var(--glass-border)]">
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Energi</p>
                  <p className="text-2xl font-bold">{result?.kalori.toFixed(1)} <span className="text-sm font-normal text-[var(--text-muted)]">kkal</span></p>
                </div>
                <div className="bg-[var(--glass-bg)] p-4 rounded-xl border border-[var(--glass-border)]">
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Protein</p>
                  <p className="text-2xl font-bold">{result?.protein.toFixed(1)} <span className="text-sm font-normal text-[var(--text-muted)]">g</span></p>
                </div>
                <div className="bg-[var(--glass-bg)] p-4 rounded-xl border border-[var(--glass-border)]">
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Lemak</p>
                  <p className="text-2xl font-bold">{result?.lemak.toFixed(1)} <span className="text-sm font-normal text-[var(--text-muted)]">g</span></p>
                </div>
                <div className="bg-[var(--glass-bg)] p-4 rounded-xl border border-[var(--glass-border)]">
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Karbohidrat</p>
                  <p className="text-2xl font-bold">{result?.karbo.toFixed(1)} <span className="text-sm font-normal text-[var(--text-muted)]">g</span></p>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--glass-border)]">
                <p className="text-xs text-center text-[var(--text-muted)]">
                  * Data gizi dihitung berdasarkan porsi {porsi}g.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
