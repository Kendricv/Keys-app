'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';

const TEMPORAL_CRENDENTIALS = {
  username: 'admin',
  password: 'admin',
};

const CreateUserLoginScheme = z.object({
  username: z.string(),
  password: z.string(),
});

const CreateEntryFormScheme = z.object({
  dpiVisitor: z.string(),
  nameVisitor: z.string(),
  lastnameVisitor: z.string(),
  resident: z.string(),
});

type LoginFormState = {
  message: string;
};

export async function handleLoginAction(formState: LoginFormState, formData: FormData) {
  try {
    const { username, password } = CreateUserLoginScheme.parse({
      username: formData.get('username'),
      password: formData.get('password'),
    });

    // Validamos usuario
    if (username === TEMPORAL_CRENDENTIALS.username && password === TEMPORAL_CRENDENTIALS.password) {
      return {
        message: 'Usuario correcto',
      };
    } else {
      return {
        message: 'Error: Usuario inválido.',
      };
    }
  } catch (error) {
    console.error(error);
    return {
      message: 'Error: Usuario inválido.',
    };
  }
}

export async function getUsers() {
  const usersPromise = sql`SELECT * FROM Usuario`;
  const users = await Promise.all([usersPromise]);

  console.log('la data es', users[0].rows[0]);
}

type EntryFormState = {
  message: string;
};

export async function submitEntryRegistrationForm(formState: EntryFormState, formData: FormData) {
  try {
    const { dpiVisitor, nameVisitor, lastnameVisitor, resident } = CreateEntryFormScheme.parse({
      dpiVisitor: formData.get('dpiVisitor'),
      nameVisitor: formData.get('nameVisitor'),
      lastnameVisitor: formData.get('lastnameVisitor'),
      resident: formData.get('resident'),
    });

    // Obtenemos el id del residente
    const residentId = resident.split(' ')[0];

    const visitorResponse = await sql`INSERT INTO Visitante (nombre, apellido, identificacion)
      VALUES (${nameVisitor}, ${lastnameVisitor}, ${dpiVisitor})
      RETURNING visitante_id;
    `;

    const visitorId = visitorResponse.rows[0].visitante_id;
    const currentDate = new Date().toISOString();

    const autorizationResponse = await sql`INSERT INTO Autorizacion_Visita (residente_id, visitante_id, fecha_visita, estado)
        VALUES (${residentId}, ${visitorId}, ${currentDate}, 'pendiente')
        RETURNING autorizacion_id;`;

    const autorizationId = autorizationResponse.rows[0].autorizacion_id;

    await sql`INSERT INTO Registro_Acceso (visitante_id, autorizacion_id, usuario_seguridad_id, tipo)
        VALUES (${visitorId}, ${autorizationId}, ${residentId}, 'entrada');`;

    return {
      message: 'Entrada ingresada exitósamente.',
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'Error: No se pudo registrar la entrada.',
    };
  }
}
