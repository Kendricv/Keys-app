import { getSession } from '@/app/lib/loginActions';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { dpiVisitor, nameVisitor, lastnameVisitor, resident, currentDate } = (await request.json()) as {
    dpiVisitor: string;
    nameVisitor: string;
    lastnameVisitor: string;
    resident: string;
    currentDate: string;
    visitProgrammingId: string;
    visitorId: string;
  };

  const invitedBy = resident.split(' ')[0];
  const session = await getSession();
  const createdBy = session.userId;

  console.log("fue creado por", createdBy)

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

  return NextResponse.json({ message: 'Entrada ingresada exitósamente.', visitProgrammingId }, { status: 200 });
}

export function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
