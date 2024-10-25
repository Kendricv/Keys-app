'use server';

import { SessionData } from './lib';
import { defaultSession, sessionOptions, sleep } from './lib';
import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { sql } from '@vercel/postgres';

type LoginFormState = {
  message: string;
};

const CreateUserLoginScheme = z.object({
  username: z.string(),
  password: z.string(),
});

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
    session.username = defaultSession.username;
    session.userId = defaultSession.userId;
    session.rol = defaultSession.rol;
  }

  return session;
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  revalidatePath('/login');
}

export async function login(formState: LoginFormState, formData: FormData) {
  const { username, password } = CreateUserLoginScheme.parse({
    username: formData.get('username'),
    password: formData.get('password'),
  });

  try {
    const usersPromise = sql`SELECT correo, nombre, rol, two_fa_secret FROM table_usuarios WHERE correo=${username} AND contrasenia=${password}`;
    const user = await Promise.all([usersPromise]);

    if (!user) throw new Error('Usuario inválido.');

    const data = user[0].rows;

    if (data.length === 0) throw new Error('Usuario inválido.');

    const { nombre, rol, correo, two_fa_secret } = user[0].rows[0];

    // const session = await getSession();
    // session.username = (nombre as string) ?? 'No username';
    // session.isLoggedIn = true;
    // await session.save();
    // revalidatePath('/login');

    return {
      message: 'Usuario correcto',
      nombre,
      correo,
      two_fa_secret
    };
  } catch (error) {
    // console.error(error);
    return {
      message: 'Error: Usuario inválido.',
    };
  }
}

export async function validaliteUser() {
  const session = await getSession();
  if (session.isLoggedIn) return;
  revalidatePath('/login');
  redirect('/login');
}
