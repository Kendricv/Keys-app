'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { getSession } from './loginActions';

const CreateEntryFormScheme = z.object({
  dpiVisitor: z.string(),
  nameVisitor: z.string(),
  lastnameVisitor: z.string(),
  resident: z.string(),
  currentDate: z.string(),
});

const CreateExitFormScheme = z.object({
  currentVisit: z.string(),
});

export async function getIronSessionData() {
  const session = await getIronSession(cookies(), { password: '...', cookieName: '...' });
  return session;
}

export async function getUsers() {
  const usersPromise = sql`SELECT * FROM Usuario`;
  const users = await Promise.all([usersPromise]);

  console.log(users[0].rows[0]);
}

type EntryFormState = {
  message: string;
};

export async function submitEntryRegistrationForm(formState: EntryFormState, formData: FormData) {
  try {
    const { dpiVisitor, nameVisitor, lastnameVisitor, resident, currentDate } = CreateEntryFormScheme.parse({
      dpiVisitor: formData.get('dpiVisitor'),
      nameVisitor: formData.get('nameVisitor'),
      lastnameVisitor: formData.get('lastnameVisitor'),
      resident: formData.get('resident'),
      currentDate: formData.get('currentDate'),
    });

    // Obtenemos el id del residente
    const invitedBy = resident.split(' ')[0];
    const session = await getSession();
    const createdBy = session.userId;

    const visitorResponse =
      await sql`INSERT INTO table_visitantes (nombre, apellidos, identificacion, invitado_por_id, creado_por_id, fecha_registro)
      VALUES (${nameVisitor}, ${lastnameVisitor}, ${dpiVisitor}, ${invitedBy}, ${createdBy}, ${currentDate})
      RETURNING visitante_id;
    `;

    const visitorId = visitorResponse.rows[0].visitante_id;

    const visitProgammingResponse =
      await sql`INSERT INTO table_visitas_programadas (residente_id, visitante_id, fecha_visita, autorizado_por_id, estado)
      VALUES (${invitedBy}, ${visitorId}, ${currentDate}, ${createdBy}, '1')
      RETURNING visita_programada_id;
    `;

    const visitProgrammingId = visitProgammingResponse.rows[0].visita_programada_id;

    await sql`INSERT INTO table_bitacora_de_visitas (tipo, visita_programada_id)
      VALUES ('Ingreso', ${visitProgrammingId});`;
    revalidatePath('/dashboard');
    revalidatePath('/api/current-visits');

    return {
      message: 'Entrada ingresada exitósamente.',
      visitProgrammingId,
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'Error: No se pudo registrar la entrada.',
    };
  }
}

export async function submitExitRegistrationForm(formState: EntryFormState, formData: FormData) {
  try {
    const { currentVisit } = CreateExitFormScheme.parse({
      currentVisit: formData.get('currentVisit'),
    });

    const currentVisitId = currentVisit.split(' ')[0];

    await sql`UPDATE table_visitas_programadas
      SET estado = 0
      WHERE visita_programada_id = ${currentVisitId};`;

    await sql`INSERT INTO table_bitacora_de_visitas (tipo, visita_programada_id)
      VALUES ('Salida', ${currentVisitId});`;
    revalidatePath('/dashboard');
    revalidatePath('/api/current-visits');

    return {
      message: 'Salida registrada exitósamente.',
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'Error: No se pudo registrar la salida.',
    };
  }
}

export async function getEntrancesAndExits() {
  const entriesPromise = await sql`SELECT 
    DATE(fecha_registro) AS fecha,
    COUNT(CASE WHEN tipo = 'Ingreso' THEN 1 END) AS total_ingresos,
    COUNT(CASE WHEN tipo = 'Salida' THEN 1 END) AS total_salidas
  FROM 
    table_bitacora_de_visitas
  GROUP BY 
    DATE(fecha_registro)
  ORDER BY 
    DATE(fecha_registro) ASC
  LIMIT 10;`;
  const dataResponse = await Promise.all([entriesPromise]);
  revalidatePath('/dashboard');

  const data = dataResponse[0].rows.map((entry) => {
    const formattedDate = new Date(entry.fecha).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    return {
      date: formattedDate,
      Ingresos: entry.total_ingresos,
      Salidas: entry.total_salidas,
    };
  });

  return data;
}

const CreateNewUserFormScheme = z.object({
  dpi: z.string(),
  name: z.string(),
  lastname: z.string(),
  email: z.string(),
  tel: z.string(),
  password: z.string(),
  rol: z.string(),
});

export async function createNewUser(formState: EntryFormState, formData: FormData) {
  try {
    const { dpi, name, lastname, email, tel, password, rol } = CreateNewUserFormScheme.parse({
      dpi: formData.get('dpi'),
      name: formData.get('name'),
      lastname: formData.get('lastname'),
      email: formData.get('email'),
      tel: formData.get('tel'),
      password: formData.get('password'),
      rol: formData.get('rol'),
    });
    await sql`INSERT INTO table_usuarios (identificacion, nombre, apellidos, correo, telefono, contrasenia, rol)
      VALUES (${dpi}, ${name}, ${lastname}, ${email}, ${tel}, ${password}, ${rol});`;
    revalidatePath('/dashboard');

    return {
      message: 'Usuario creado con éxito.',
    };
  } catch (error) {
    console.error('Error al crear el usuario', error);
    return {
      message: 'Error al crear el usuario.',
    };
  }
}

const EditUserFormScheme = z.object({
  dpi: z.string(),
  name: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  tel: z.string(),
  password: z.string().optional(), 
  rol: z.string(),
});

export async function editUser(formState: EntryFormState, formData: FormData) {
  try {
    const { dpi, name, lastname, email, tel, password, rol } = EditUserFormScheme.parse({
      dpi: formData.get('dpi'),
      name: formData.get('name'),
      lastname: formData.get('lastname'),
      email: formData.get('email'),
      tel: formData.get('tel'),
      password: formData.get('password'),
      rol: formData.get('rol'),
    });
    if (password) {
      await sql`UPDATE table_usuarios SET
      nombre=${name}, apellidos=${lastname}, telefono=${tel}, contrasenia=${password}, rol=${rol}
      WHERE correo=${email};`  
    } else {
      console.log("es aquí")
      await sql`UPDATE table_usuarios SET
      nombre=${name}, apellidos=${lastname}, telefono=${tel}, rol=${rol}
      WHERE correo=${email};`
    }
    revalidatePath('/dashboard');

    return {
      message: 'Usuario editado con éxito.',
    };
  } catch (error) {
    console.error('Error al editar el usuario', error);
    return {
      message: 'Error al editar el usuario.',
    };
  }
}

const DeleteUserFormScheme = z.object({
  email: z.string().email(),
});

export async function deleteUser(formState: EntryFormState, formData: FormData) {
  try {
    const { email } = DeleteUserFormScheme.parse({
      email: formData.get('email'),
    });
    const deleteState = '0';
    await sql`UPDATE table_usuarios SET
    estado=${deleteState}
    WHERE correo=${email};`  
    revalidatePath('/dashboard');

    return {
      message: 'Usuario eliminado.',
    };
  } catch (error) {
    console.error('Error al eliminar el usuario', error);
    return {
      message: 'Error al eliminar el usuario.',
    };
  }
}

export async function submitScheduleVisitForm(formState: EntryFormState, formData: FormData) {
  try {
    const { dpiVisitor, nameVisitor, lastnameVisitor, resident, currentDate } = CreateEntryFormScheme.parse({
      dpiVisitor: formData.get('dpiVisitor'),
      nameVisitor: formData.get('nameVisitor'),
      lastnameVisitor: formData.get('lastnameVisitor'),
      resident: formData.get('resident'),
      currentDate: formData.get('currentDate'),
    });

    // Obtenemos el id del residente
    const invitedBy = resident.split(' ')[0];
    const session = await getSession();
    const createdBy = session.userId;

    const visitorResponse =
      await sql`INSERT INTO table_visitantes (nombre, apellidos, identificacion, invitado_por_id, creado_por_id, fecha_registro)
      VALUES (${nameVisitor}, ${lastnameVisitor}, ${dpiVisitor}, ${invitedBy}, ${createdBy}, ${currentDate})
      RETURNING visitante_id;
    `;

    const visitorId = visitorResponse.rows[0].visitante_id;

    const visitProgammingResponse =
      await sql`INSERT INTO table_visitas_programadas (residente_id, visitante_id, fecha_visita, autorizado_por_id, estado)
      VALUES (${invitedBy}, ${visitorId}, ${currentDate}, ${createdBy}, '1')
      RETURNING visita_programada_id;
    `;

    const visitProgrammingId = visitProgammingResponse.rows[0].visita_programada_id;

    revalidatePath('/agenda');
    revalidatePath('/api/current-visits');

    return {
      message: 'Visita programada exitósamente.',
      dpiVisitor,
      nameVisitor,
      lastnameVisitor,
      resident,
      currentDate,
      visitProgrammingId,
      visitorId
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'Error: No se pudo programar la visita.',
    };
  }
}

