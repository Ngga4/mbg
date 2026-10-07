import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  // Delete menu (cascade will delete menu_detail automatically)
  const { error } = await supabase
    .from('menu')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
