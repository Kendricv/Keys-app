import DashboardAppShell from '@/app/ui/Dashboard';
import { getSession } from '../lib/loginActions';
import { redirect } from 'next/navigation';
import { UserType } from '../lib/userType';
import { sql } from '@vercel/postgres';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect('/login');
  }
  if (session.rol === 'Residente') {
    redirect('/agenda');
  }

  const user: UserType = {
    user_id: session.userId,
    full_name: session.username,
    email: session.userId,
    rol: session.rol,
    dpi: '',
    lastname: '',
    tel: '',
    username: '',
  };

  const usersResponse = await sql`SELECT usuario_id AS user_id, CONCAT(nombre, ' ', apellidos) AS full_name, 
    correo as email, rol, identificacion as dpi, telefono AS tel,
    nombre as username,
    apellidos as lastname
    FROM table_usuarios WHERE estado = 1;`;
  const users = usersResponse.rows.map((row) => row as UserType);

  return (
    <DashboardAppShell session={user} users={users}>
      {children}
    </DashboardAppShell>
  );
}
