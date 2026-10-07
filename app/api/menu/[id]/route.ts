import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  // Fetch menu with details
  const { data: menu, error: menuError } = await supabase
    .from('menu')
    .select('*')
    .eq('id', id)
    .single();

  if (menuError) {
    return NextResponse.json({ error: menuError.message }, { status: 500 });
  }

  // Fetch menu details with bahan
  const { data: details, error: detailsError } = await supabase
    .from('menu_detail')
    .select(`
      *,
      bahan:bahan_makanan(*)
    `)
    .eq('menu_id', id);

  if (detailsError) {
    return NextResponse.json({ error: detailsError.message }, { status: 500 });
  }

  return NextResponse.json({ menu, details });
}
