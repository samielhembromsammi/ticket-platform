
import DashboardLayout from './../../layout/dashboard/index';

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}