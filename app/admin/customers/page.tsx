import { getAllCustomers } from '@/actions/admin-customers'
import { formatNaira } from '@/lib/utils'

export default async function AdminCustomersPage() {
  const customers = await getAllCustomers()

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1F2421] mb-8">Customers</h1>

      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-xs uppercase tracking-widest text-[#8A928E]">
              <th className="p-4">Customer</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Orders</th>
              <th className="p-4 text-right">Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-black/5 last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#5F7A5B] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {(c.name || c.email).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-[#1F2421]">{c.name || c.email}</p>
                      {c.name && <p className="text-xs text-[#8A928E]">{c.email}</p>}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-[#8A928E]">
                  {new Date(c.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="p-4 text-[#8A928E]">{c.order_count}</td>
                <td className="p-4 text-right font-medium text-[#1F2421]">{formatNaira(c.total_spent)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {customers.length === 0 && (
          <p className="text-center py-16 text-sm text-[#8A928E]">No customers yet</p>
        )}
      </div>
    </div>
  )
}