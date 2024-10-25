import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  const currentVisitsResponse = await sql`SELECT vp.visita_programada_id, CONCAT(tv.nombre, ' ', tv.apellidos) AS full_name
    FROM table_visitas_programadas AS vp
    INNER JOIN table_visitantes as tv 
    ON vp.visitante_id = tv.visitante_id
    WHERE vp.estado = '1';`;
  const currentVisits = currentVisitsResponse.rows;

  return NextResponse.json( currentVisits );
}
