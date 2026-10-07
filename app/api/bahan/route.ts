import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET() {
  const supabase = await createClient();

  const { data: bahan, error } = await supabase
    .from('bahan_makanan')
    .select('*')
    .order('nama', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(bahan);
}
