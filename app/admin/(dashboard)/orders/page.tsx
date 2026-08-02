'use client'

import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import Image from 'next/image'
import {
  Download,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  Printer,
  Tag,
  Eye,
} from 'lucide-react'
import { getAllOrders, updateOrderStatus, updateOrderTracking } from '@/actions/admin-orders'
import { createClient } from '@/lib/supabase/client'
import { formatNaira } from '@/lib/utils'

type OrderItem = {
  id: string
  product_image?: string | null
  product_name: string
  quantity: number
  price: number
}

type Order = {
  id: string
  full_name: string
  email: string
  phone: string
  created_at: string
  status: string
  address: string
  city: string
  state: string
  order_items?: OrderItem[]
  subtotal: number
  shipping_fee: number
  tax: number
  total: number
  tracking_number?: string | null
}

const STATUS_OPTIONS = ['pending', 'paid', 'shipped', 'delivered', 'failed', 'cancelled']

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-200 text-gray-600',
}

const TABS = [
  { label: 'All Orders', filter: null },
  { label: 'Pending', filter: 'pending' },
  { label: 'Shipped', filter: 'shipped' },
  { label: 'Delivered', filter: 'delivered' },
  { label: 'Cancelled', filter: 'cancelled' },
] as const

const PAGE_SIZE = 10

function itemSummary(items: OrderItem[] | undefined) {
  if (!items || items.length === 0) return '—'
  const first = `${items[0].product_name}${items[0].quantity > 1 ? ` (x${items[0].quantity})` : ''}`
  if (items.length === 1) return first
  return `${first} +${items.length - 1} more`
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['filter']>(null)
  const [page, setPage] = useState(1)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [trackingInput, setTrackingInput] = useState('')
  const [savingTracking, setSavingTracking] = useState(false)
  const [confirmingCancel, setConfirmingCancel] = useState(false)

  async function loadOrders() {
    const data = await getAllOrders()
    setOrders(data)
    setLoading(false)
  }

  useEffect(() => {
    const initializeOrders = async () => {
      await loadOrders()
    }
    initializeOrders()

    const supabase = createClient()
    const channel = supabase
      .channel('admin-orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => loadOrders())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  // Keep the open drawer in sync if the underlying order updates (e.g. via realtime)
  useEffect(() => {
    if (!selectedOrder) return
    const fresh = orders.find((o) => o.id === selectedOrder.id)
    if (!fresh || fresh === selectedOrder) return

    const timeout = window.setTimeout(() => setSelectedOrder(fresh), 0)
    return () => window.clearTimeout(timeout)
  }, [orders, selectedOrder])

  const filteredOrders = useMemo(() => {
    if (!activeTab) return orders
    return orders.filter((o) => o.status === activeTab)
  }, [orders, activeTab])

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredOrders.slice(start, start + PAGE_SIZE)
  }, [filteredOrders, page])

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE))

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => ['paid', 'shipped', 'delivered'].includes(o.status))
      .reduce((sum, o) => sum + Number(o.total), 0)
    const pending = orders.filter((o) => o.status === 'pending').length
    const delivered = orders.filter((o) => o.status === 'delivered').length
    const cancelled = orders.filter((o) => o.status === 'cancelled' || o.status === 'failed').length
    return { revenue, pending, delivered, cancelled }
  }, [orders])

  async function handleStatusChange(orderId: string, status: string) {
    const result = await updateOrderStatus(orderId, status)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success('Order status updated')
    setOpenMenuId(null)
    setConfirmingCancel(false)
  }

  function openOrder(order: Order) {
    setSelectedOrder(order)
    setTrackingInput(order.tracking_number ?? '')
    setConfirmingCancel(false)
    setOpenMenuId(null)
  }

  async function handleSaveTracking() {
    if (!selectedOrder) return
    if (!trackingInput.trim()) {
      toast.error('Enter a tracking number first')
      return
    }
    setSavingTracking(true)
    const result = await updateOrderTracking(selectedOrder.id, trackingInput.trim())
    setSavingTracking(false)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success('Tracking number saved')
  }

  function handlePrintPackingSlip(order: Order) {
    const win = window.open('', '_blank', 'width=700,height=900')
    if (!win) {
      toast.error('Enable pop-ups to print the packing slip')
      return
    }

    const itemsHtml = (order.order_items ?? [])
      .map(
        (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${item.product_name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${formatNaira(item.price * item.quantity)}</td>
        </tr>`
      )
      .join('')

    win.document.write(`
      <html>
        <head>
          <title>Packing Slip — #${order.id.slice(0, 8).toUpperCase()}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #1F2421; }
            h1 { font-size: 18px; margin-bottom: 4px; }
            p { font-size: 13px; color: #555; margin: 2px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 24px; }
            th { text-align: left; font-size: 11px; text-transform: uppercase; color: #888; padding-bottom: 8px; border-bottom: 1px solid #ccc; }
          </style>
        </head>
        <body>
          <h1>Packing Slip — Order #${order.id.slice(0, 8).toUpperCase()}</h1>
          <p>${new Date(order.created_at).toLocaleDateString()}</p>
          <br />
          <p><strong>${order.full_name}</strong></p>
          <p>${order.address}</p>
          <p>${order.city}, ${order.state}</p>
          <p>${order.phone}</p>
          <table>
            <thead>
              <tr><th>Item</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Price</th></tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <p style="margin-top:16px;font-size:15px;"><strong>Total: ${formatNaira(order.total)}</strong></p>
        </body>
      </html>
    `)
    win.document.close()
    win.focus()
    win.print()
  }

  function handleExportCSV() {
    if (filteredOrders.length === 0) {
      toast.error('No orders to export')
      return
    }

    const header = ['Order ID', 'Date', 'Customer', 'Email', 'Items', 'Total', 'Status']
    const rows = filteredOrders.map((o) => [
      o.id,
      new Date(o.created_at).toLocaleDateString('en-NG'),
      o.full_name,
      o.email,
      itemSummary(o.order_items),
      o.total,
      o.status,
    ])

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Orders exported')
  }

  if (loading) return <p className="text-sm text-[#8A928E]">Loading orders...</p>

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2421]">Order Management</h1>
          <p className="text-sm text-[#8A928E] mt-1">Review and process your customer supplement orders.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-white border border-black/10 text-[#1F2421] text-sm font-medium px-4 py-2.5 rounded-full hover:bg-[#F7F5F0] transition-colors"
          >
            <Download size={15} />
            Export CSV
          </button>
          <button
            onClick={() => toast('Manual order creation is coming soon')}
            className="flex items-center gap-2 bg-[#1F2421] hover:bg-[#2E3634] text-white text-sm font-medium px-4 py-2.5 rounded-full transition-colors"
          >
            <Plus size={15} />
            Create Manual Order
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5">
          <p className="text-xs uppercase tracking-widest text-[#8A928E] mb-2">Total Revenue</p>
          <p className="text-2xl font-bold text-[#1F2421]">{formatNaira(stats.revenue)}</p>
          <p className="text-xs text-[#8A928E] mt-1">From paid, shipped &amp; delivered orders</p>
        </div>
        <div className="bg-white rounded-2xl p-5">
          <p className="text-xs uppercase tracking-widest text-[#8A928E] mb-2">Pending Orders</p>
          <p className="text-2xl font-bold text-[#1F2421]">{stats.pending}</p>
          {stats.pending > 0 && <p className="text-xs text-yellow-600 mt-1">Awaiting fulfillment</p>}
        </div>
        <div className="bg-white rounded-2xl p-5">
          <p className="text-xs uppercase tracking-widest text-[#8A928E] mb-2">Delivered Orders</p>
          <p className="text-2xl font-bold text-[#1F2421]">{stats.delivered}</p>
          <p className="text-xs text-[#5F7A5B] mt-1">Successfully completed</p>
        </div>
        <div className="bg-white rounded-2xl p-5">
          <p className="text-xs uppercase tracking-widest text-[#8A928E] mb-2">Cancelled / Failed</p>
          <p className="text-2xl font-bold text-[#1F2421]">{stats.cancelled}</p>
          <p className="text-xs text-[#8A928E] mt-1">
            {orders.length > 0 ? `${((stats.cancelled / orders.length) * 100).toFixed(1)}% of total` : '—'}
          </p>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center justify-between px-6 pt-5 border-b border-black/5">
          <div className="flex gap-6">
            {TABS.map((tab) => (
              <button
                key={tab.label}
                onClick={() => { setActiveTab(tab.filter); setPage(1) }}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.filter
                    ? 'border-[#1F2421] text-[#1F2421]'
                    : 'border-transparent text-[#8A928E] hover:text-[#1F2421]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <SlidersHorizontal size={16} className="text-[#8A928E] mb-3" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-black/5 text-left text-xs uppercase tracking-widest text-[#8A928E]">
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => openOrder(order)}
                  className="border-b border-black/5 last:border-0 cursor-pointer hover:bg-[#F7F5F0]/60 transition-colors"
                >
                  <td className="p-4 font-medium text-[#1F2421]">#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="p-4 text-[#8A928E] whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#DCE5D3] text-[#3F5C42] text-xs font-bold flex items-center justify-center shrink-0">
                        {order.full_name.charAt(0).toUpperCase()}
                      </span>
                      <span className="text-[#1F2421] whitespace-nowrap">{order.full_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#8A928E] max-w-[220px] truncate">{itemSummary(order.order_items)}</td>
                  <td className="p-4 font-medium text-[#1F2421] whitespace-nowrap">{formatNaira(order.total)}</td>
                  <td className="p-4">
                    <span className={`text-xs font-medium uppercase tracking-wider px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 relative" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === order.id ? null : order.id)}
                        className="p-1 text-[#8A928E] hover:text-[#1F2421] transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    {openMenuId === order.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                        <div className="absolute right-4 top-11 z-20 bg-white rounded-xl shadow-lg border border-black/5 py-2 w-44">
                          <button
                            onClick={() => openOrder(order)}
                            className="w-full flex items-center gap-2 text-left px-4 py-1.5 text-sm text-[#1F2421] hover:bg-[#F7F5F0] transition-colors"
                          >
                            <Eye size={13} />
                            View Details
                          </button>
                          <p className="px-4 pt-2 pb-1 text-xs uppercase tracking-widest text-[#8A928E] border-t border-black/5 mt-1">Set status</p>
                          {STATUS_OPTIONS.map((s) => (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(order.id, s)}
                              className="w-full text-left px-4 py-1.5 text-sm text-[#3F4744] hover:bg-[#F7F5F0] capitalize transition-colors"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <p className="text-center py-16 text-sm text-[#8A928E]">No orders in this view yet</p>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-black/5">
            <p className="text-xs text-[#8A928E]">
              Showing <span className="font-medium text-[#1F2421]">{(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filteredOrders.length)}</span> of{' '}
              <span className="font-medium text-[#1F2421]">{filteredOrders.length}</span> orders
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-black/10 text-[#3F4744] disabled:opacity-40 hover:bg-[#F7F5F0] transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-black/10 text-[#3F4744] disabled:opacity-40 hover:bg-[#F7F5F0] transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order detail drawer */}
      {selectedOrder && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#F7F5F0] z-50 flex flex-col shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="bg-white p-6 border-b border-black/5">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h2 className="text-lg font-bold text-[#1F2421]">
                    Order #{selectedOrder.id.slice(0, 8).toUpperCase()}
                  </h2>
                  <p className="text-xs text-[#8A928E] mt-1">
                    Placed on {new Date(selectedOrder.created_at).toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' })}
                    {' '}at {new Date(selectedOrder.created_at).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-[#8A928E] hover:text-[#1F2421] transition-colors">
                  <X size={20} />
                </button>
              </div>
              <span className={`inline-block mt-2 text-xs font-medium uppercase tracking-wider px-2.5 py-1 rounded-full ${STATUS_STYLES[selectedOrder.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {selectedOrder.status}
              </span>
            </div>

            <div className="p-6 flex flex-col gap-5">
              {/* Customer details */}
              <div className="bg-white rounded-2xl p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#8A928E] mb-4">Customer Details</h3>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-9 h-9 rounded-full bg-[#DCE5D3] text-[#3F5C42] text-sm font-bold flex items-center justify-center shrink-0">
                    {selectedOrder.full_name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[#1F2421]">{selectedOrder.full_name}</p>
                    <p className="text-xs text-[#8A928E]">{selectedOrder.email}</p>
                  </div>
                </div>
                <p className="text-xs text-[#8A928E]">{selectedOrder.phone}</p>
              </div>

              {/* Addresses */}
              <div className="bg-white rounded-2xl p-5 grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#8A928E] mb-2">Shipping Address</h3>
                  <p className="text-sm text-[#1F2421]">{selectedOrder.address}</p>
                  <p className="text-sm text-[#1F2421]">{selectedOrder.city}, {selectedOrder.state}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#8A928E] mb-2">Billing Address</h3>
                  <p className="text-sm text-[#8A928E] italic">Same as shipping</p>
                </div>
              </div>

              {/* Order items */}
              <div className="bg-white rounded-2xl p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#8A928E] mb-4">Order Items</h3>
                <div className="flex flex-col gap-3">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-[#EFEDE6] shrink-0">
                        {item.product_image && <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1F2421] truncate">{item.product_name}</p>
                        <p className="text-xs text-[#8A928E]">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-[#1F2421] shrink-0">{formatNaira(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-black/5 mt-4 pt-4 space-y-1.5">
                  <div className="flex justify-between text-sm text-[#8A928E]">
                    <span>Subtotal</span>
                    <span>{formatNaira(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#8A928E]">
                    <span>Shipping</span>
                    <span>{selectedOrder.shipping_fee === 0 ? 'Free' : formatNaira(selectedOrder.shipping_fee)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#8A928E]">
                    <span>Tax</span>
                    <span>{formatNaira(selectedOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#1F2421] pt-2 border-t border-black/5">
                    <span>Total Amount</span>
                    <span>{formatNaira(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Fulfillment actions */}
              <div className="bg-white rounded-2xl p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#8A928E] mb-3">Fulfillment Actions</h3>

                <label className="text-xs text-[#8A928E] mb-1.5 block">Tracking Number</label>
                <div className="flex gap-2 mb-4">
                  <input
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="Enter carrier tracking ID"
                    className="flex-1 bg-[#EFEDE6] border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#5F7A5B] transition-all"
                  />
                  <button
                    onClick={handleSaveTracking}
                    disabled={savingTracking}
                    className="bg-[#1F2421] hover:bg-[#2E3634] disabled:opacity-50 text-white text-sm font-medium px-4 rounded-xl transition-colors shrink-0"
                  >
                    {savingTracking ? '...' : 'Submit'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handlePrintPackingSlip(selectedOrder)}
                    className="flex items-center justify-center gap-2 border border-black/10 text-[#1F2421] text-sm font-medium py-2.5 rounded-full hover:bg-[#F7F5F0] transition-colors"
                  >
                    <Printer size={14} />
                    Print Packing Slip
                  </button>
                  <button
                    onClick={() => toast('Shipping label generation needs a courier integration (e.g. Shippo) — not connected yet')}
                    className="flex items-center justify-center gap-2 border border-black/10 text-[#1F2421] text-sm font-medium py-2.5 rounded-full hover:bg-[#F7F5F0] transition-colors"
                  >
                    <Tag size={14} />
                    Generate Label
                  </button>
                </div>
              </div>

              {/* Bottom actions */}
              {confirmingCancel ? (
                <div className="bg-white rounded-2xl p-4 flex items-center justify-between gap-3">
                  <p className="text-sm text-[#1F2421]">Cancel this order?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmingCancel(false)}
                      className="text-xs font-medium text-[#8A928E] hover:text-[#1F2421] px-3 py-2 transition-colors"
                    >
                      No
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                      className="text-xs font-medium bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors"
                    >
                      Yes, Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmingCancel(true)}
                    className="flex-1 border border-red-200 text-red-500 text-sm font-medium py-3 rounded-full hover:bg-red-50 transition-colors"
                  >
                    Cancel Order
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, 'shipped')}
                    className="flex-1 bg-[#1F2421] hover:bg-[#2E3634] text-white text-sm font-medium py-3 rounded-full transition-colors"
                  >
                    Mark as Shipped
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}