import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DiscountApprovalManager from '@/components/discount/DiscountApprovalManager';

export default async function DiscountsPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DiscountApprovalManager />
    </div>
  );
}
