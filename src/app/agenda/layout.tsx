import { getSession } from '../lib/loginActions';
import { redirect } from "next/navigation";
import AgendaDashboardAppShell from "../ui/DashboardAgenda";
import { UserType } from '../lib/userType';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session.isLoggedIn) {
    redirect('/login');
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

  return (
    <AgendaDashboardAppShell session={user}>
      {children}
    </AgendaDashboardAppShell>
  );
}
