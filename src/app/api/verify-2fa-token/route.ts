import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';
import * as OTPAuth from 'otpauth';

export async function POST(request: NextRequest) {
  const { email, token } = (await request.json()) as { email: string; token: string };

  // Recupera el secreto TOTP del usuario desde la base de datos
  const result = await sql`SELECT two_fa_secret FROM table_usuarios WHERE correo=${email}`;
  let secretBase32 = result.rows[0]?.two_fa_secret;

  if (!secretBase32) {
    return NextResponse.json({ error: 'Secreto no encontrado' }, { status: 404 });
  }

  if (secretBase32.startsWith('temporal-')) {
    secretBase32 = secretBase32.slice('temporal-'.length);
    await sql`UPDATE table_usuarios SET two_fa_secret=${secretBase32} WHERE correo=${email}`;
  }

  // Crea el objeto TOTP usando el secreto recuperado
  const totp = new OTPAuth.TOTP({
    issuer: 'keys-app.com',
    algorithm: 'SHA1',
    digits: 6,
    period: 30, // Tiempo de 30 segundos
    secret: OTPAuth.Secret.fromBase32(secretBase32),
  });

  // Valida el token proporcionado por el usuario
  // Si delta es:
  // 0 = El token es el actual y es válido
  // 1 / -1 = El token está desfasado por un intervalo (en este caso, de 30 segundos) pero seguirá siendo válido porque hemos puesto un window de 1
  const delta = totp.validate({ token, window: 1 });

  if (delta !== null) {
    return NextResponse.json({ valid: true }, { status: 200 });
  } else {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}

export function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
