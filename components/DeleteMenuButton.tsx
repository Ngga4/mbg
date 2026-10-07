'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

type Props = {
  menuId: string;
};

export default function DeleteMenuButton({ menuId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/menu/delete/${menuId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        alert('Gagal menghapus menu');
      }
    } catch (err) {
      alert('Error menghapus menu');
    } finally {
      setLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex gap-2">
        <Button
          variant="primary"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? 'Menghapus...' : 'Ya, Hapus'}
        </Button>
        <Button
          variant="ghost"
          onClick={() => setShowConfirm(false)}
          disabled={loading}
        >
          Batal
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={() => setShowConfirm(true)}
    >
      Hapus Menu
    </Button>
  );
}
