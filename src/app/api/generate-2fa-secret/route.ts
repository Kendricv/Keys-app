import { sql } from '@vercel/postgres';
import * as OTPAuth from 'otpauth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email no proporcionado' }, { status: 400 });
  }

  const secret = new OTPAuth.Secret({ size: 20 });

  const totp = new OTPAuth.TOTP({
    issuer: 'keys-app.com',
    label: email,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: secret,
  });

  const uri = totp.toString();

  // Guardamos el secreto en el usuario
  const temporalSecret = `temporal-${secret.base32}`
  await sql`UPDATE table_usuarios SET two_fa_secret=${temporalSecret} WHERE correo=${email}`;

  return NextResponse.json({ uri });
}
