'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

type Bahan = {
  id: string;
  nama: string;
  kalori_per_100g: number;
  protein_per_100g: number;
  lemak_per_100g: number;
  karbohidrat_per_100g: number;
};

export default function BahanPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bahans, setBahans] = useState<Bahan[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama: '',
    kalori_per_100g: 0,
    protein_per_100g: 0,
    lemak_per_100g: 0,
    karbohidrat_per_100g: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchBahans();
    }
  }, [user]);

  const fetchBahans = async () => {
    const res = await fetch('/api/bahan');
    const data = await res.json();
    setBahans(data);
    setLoadingData(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        // Update
        const { error } = await supabase
          .from('bahan_makanan')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('bahan_makanan')
          .insert([formData]);

        if (error) throw error;
      }

      fetchBahans();
      resetForm();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (bahan: Bahan) => {
    setEditingId(bahan.id);
    setFormData({
      nama: bahan.nama,
      kalori_per_100g: bahan.kalori_per_100g,
      protein_per_100g: bahan.protein_per_100g,
      lemak_per_100g: bahan.lemak_per_100g,
      karbohidrat_per_100g: bahan.karbohidrat_per_100g,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin hapus bahan ini?')) return;

    const { error } = await supabase
      .from('bahan_makanan')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Gagal menghapus');
    } else {
      fetchBahans();
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      nama: '',
      kalori_per_100g: 0,
      protein_per_100g: 0,
      lemak_per_100g: 0,
      karbohidrat_per_100g: 0,
    });
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-muted)]">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Kelola Bahan Makanan</h1>
            <p className="text-sm text-[var(--text-muted)]">
              Database komposisi gizi per 100 gram
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Tutup Form' : '+ Tambah Bahan'}
            </Button>
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              Kembali
            </Button>
          </div>
        </div>

        {showForm && (
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Bahan' : 'Tambah Bahan Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nama Bahan"
                placeholder="Contoh: Nasi Putih"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                required
              />
              <div className="grid grid-cols-4 gap-4">
                <Input
                  type="number"
                  step="0.01"
                  label="Kalori (kkal)"
                  value={formData.kalori_per_100g}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      kalori_per_100g: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
                <Input
                  type="number"
                  step="0.01"
                  label="Protein (g)"
                  value={formData.protein_per_100g}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      protein_per_100g: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
                <Input
                  type="number"
                  step="0.01"
                  label="Lemak (g)"
                  value={formData.lemak_per_100g}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lemak_per_100g: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
                <Input
                  type="number"
                  step="0.01"
                  label="Karbohidrat (g)"
                  value={formData.karbohidrat_per_100g}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      karbohidrat_per_100g: parseFloat(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={saving}
                >
                  {saving ? 'Menyimpan...' : editingId ? 'Update' : 'Tambah'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={resetForm}
                  >
                    Batal Edit
                  </Button>
                )}
              </div>
            </form>
          </GlassCard>
        )}

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Daftar Bahan ({bahans.length})
          </h2>
          <div className="space-y-2">
            {bahans.map((bahan) => (
              <GlassCard key={bahan.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{bahan.nama}</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                      Per 100g: {bahan.kalori_per_100g} kkal • {bahan.protein_per_100g}g protein • {bahan.lemak_per_100g}g lemak • {bahan.karbohidrat_per_100g}g karbo
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleEdit(bahan)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleDelete(bahan.id)}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
