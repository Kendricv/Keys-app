import { getSession } from '@/app/lib/loginActions';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const username = url.searchParams.get('username');
  const email = url.searchParams.get('email');

  if (!username) {
    return NextResponse.json({ valid: false, error: 'Username no proporcionado' }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ valid: false, error: 'Correo no proporcionado' }, { status: 400 });
  }

  const userResponse = await sql`SELECT usuario_id, rol FROM table_usuarios WHERE correo=${email}`
  const { usuario_id, rol } = userResponse.rows[0];

  const session = await getSession();
  session.username = username ?? 'No username';
  session.isLoggedIn = true;
  session.userId = usuario_id;
  session.rol = rol;
  await session.save();

  return NextResponse.json({ valid: true }, { status: 200 });
}
