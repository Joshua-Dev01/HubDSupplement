// 'use client'

// import { useRef, useState } from 'react'
// import Image from 'next/image'
// import { toast } from 'sonner'
// import { Plus, Pencil, Trash2, X, Loader2, AlertTriangle, Upload } from 'lucide-react'
// import { createProduct, updateProduct, deleteProduct, uploadProductImage } from '@/actions/admin-products'
// import { formatNaira } from '@/lib/utils'
// import { CATEGORIES } from '@/lib/constants'
// import type { Product } from '@/types/product'

// const EMPTY_FORM = {
//   name: '',
//   slug: '',
//   price: '',
//   category: 'vitamins',
//   images: [] as string[],
//   description: '',
//   is_new: false,
//   in_stock: true,
// }

// export default function ProductsAdminClient({ initialProducts }: { initialProducts: Product[] }) {
//   const [products, setProducts] = useState(initialProducts)
//   const [showForm, setShowForm] = useState(false)
//   const [editingId, setEditingId] = useState<string | null>(null)
//   const [form, setForm] = useState(EMPTY_FORM)
//   const [saving, setSaving] = useState(false)
//   const [uploading, setUploading] = useState(false)
//   const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
//   const [deleting, setDeleting] = useState(false)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   function openCreate() {
//     setForm(EMPTY_FORM)
//     setEditingId(null)
//     setShowForm(true)
//   }

//   function openEdit(product: Product) {
//     setForm({
//       name: product.name,
//       slug: product.slug,
//       price: String(product.price),
//       category: product.category,
//       images: product.images ?? [],
//       description: product.description ?? '',
//       is_new: product.is_new,
//       in_stock: product.in_stock,
//     })
//     setEditingId(product.id)
//     setShowForm(true)
//   }

//   async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
//     const files = e.target.files
//     if (!files || files.length === 0) return

//     setUploading(true)

//     const uploadedUrls: string[] = []

//     for (const file of Array.from(files)) {
//       const formData = new FormData()
//       formData.append('file', file)

//       const result = await uploadProductImage(formData)

//       if (result.error) {
//         toast.error(`${file.name}: ${result.error}`)
//         continue
//       }

//       if (result.url) uploadedUrls.push(result.url)
//     }

//     setForm((f) => ({ ...f, images: [...f.images, ...uploadedUrls] }))
//     setUploading(false)

//     // reset the input so selecting the same file again still fires onChange
//     if (fileInputRef.current) fileInputRef.current.value = ''
//   }

//   function removeImage(url: string) {
//     setForm((f) => ({ ...f, images: f.images.filter((img) => img !== url) }))
//   }

//   async function handleSave() {
//     if (!form.name.trim() || !form.slug.trim() || !form.price) {
//       toast.error('Name, slug, and price are required')
//       return
//     }

//     setSaving(true)

//     const payload = {
//       name: form.name,
//       slug: form.slug,
//       price: parseFloat(form.price),
//       category: form.category,
//       images: form.images,
//       description: form.description,
//       is_new: form.is_new,
//       in_stock: form.in_stock,
//     }

//     const result = editingId
//       ? await updateProduct(editingId, payload)
//       : await createProduct(payload)

//     setSaving(false)

//     if (result.error) {
//       toast.error(result.error)
//       return
//     }

//     toast.success(editingId ? 'Product updated' : 'Product created')
//     setShowForm(false)
//     window.location.reload() // simplest way to refresh server-fetched list
//   }

//   function askDelete(id: string, name: string) {
//     setDeleteTarget({ id, name })
//   }

//   async function confirmDelete() {
//     if (!deleteTarget) return
//     setDeleting(true)

//     const result = await deleteProduct(deleteTarget.id)

//     setDeleting(false)

//     if (result.error) {
//       toast.error(result.error)
//       return
//     }

//     setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
//     toast.success('Product deleted')
//     setDeleteTarget(null)
//   }

//   const inputClass = "w-full bg-[#EFEDE6] border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#5F7A5B] transition-all"

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="text-2xl font-bold text-[#1F2421]">Products</h1>
//         <button
//           onClick={openCreate}
//           className="flex items-center gap-2 bg-[#5F7A5B] hover:bg-[#4F6A4B] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
//         >
//           <Plus size={15} />
//           Add Product
//         </button>
//       </div>

//       <div className="bg-white rounded-2xl overflow-hidden">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b border-black/5 text-left text-xs uppercase tracking-widest text-[#8A928E]">
//               <th className="p-4">Product</th>
//               <th className="p-4">Category</th>
//               <th className="p-4">Price</th>
//               <th className="p-4">Stock</th>
//               <th className="p-4 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((product) => (
//               <tr key={product.id} className="border-b border-black/5 last:border-0">
//                 <td className="p-4">
//                   <div className="flex items-center gap-3">
//                     <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#EFEDE6] shrink-0">
//                       {product.images?.[0] && (
//                         <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
//                       )}
//                     </div>
//                     <span className="font-medium text-[#1F2421]">{product.name}</span>
//                   </div>
//                 </td>
//                 <td className="p-4 text-[#8A928E] capitalize">{product.category}</td>
//                 <td className="p-4 font-medium text-[#1F2421]">{formatNaira(product.price)}</td>
//                 <td className="p-4">
//                   <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
//                     product.in_stock ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
//                   }`}>
//                     {product.in_stock ? 'In Stock' : 'Sold Out'}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <div className="flex justify-end gap-2">
//                     <button onClick={() => openEdit(product)} className="p-2 text-[#8A928E] hover:text-[#5F7A5B] transition-colors">
//                       <Pencil size={15} />
//                     </button>
//                     <button onClick={() => askDelete(product.id, product.name)} className="p-2 text-[#8A928E] hover:text-red-500 transition-colors">
//                       <Trash2 size={15} />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {products.length === 0 && (
//           <p className="text-center py-16 text-sm text-[#8A928E]">No products yet — add your first one above.</p>
//         )}
//       </div>

//       {showForm && (
//         <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-6">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-lg font-bold text-[#1F2421]">
//                 {editingId ? 'Edit Product' : 'Add Product'}
//               </h2>
//               <button onClick={() => setShowForm(false)} className="text-[#8A928E] hover:text-[#1F2421]">
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="flex flex-col gap-4">
//               <div>
//                 <label className="text-xs uppercase tracking-widest text-[#8A928E] mb-1.5 block">Name</label>
//                 <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
//               </div>

//               <div>
//                 <label className="text-xs uppercase tracking-widest text-[#8A928E] mb-1.5 block">Slug</label>
//                 <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} placeholder="e.g. daily-multivitamin" />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-xs uppercase tracking-widest text-[#8A928E] mb-1.5 block">Price (₦)</label>
//                   <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass} />
//                 </div>
//                 <div>
//                   <label className="text-xs uppercase tracking-widest text-[#8A928E] mb-1.5 block">Category</label>
//                   <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
//                     {CATEGORIES.map((c) => (
//                       <option key={c.value} value={c.value}>{c.label}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="text-xs uppercase tracking-widest text-[#8A928E] mb-1.5 block">Product Images</label>

//                 {form.images.length > 0 && (
//                   <div className="grid grid-cols-4 gap-2 mb-3">
//                     {form.images.map((url) => (
//                       <div key={url} className="relative aspect-square rounded-lg overflow-hidden bg-[#EFEDE6] group">
//                         <Image src={url} alt="" fill className="object-cover" />
//                         <button
//                           onClick={() => removeImage(url)}
//                           className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                         >
//                           <X size={12} />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/jpeg,image/png,image/webp,image/gif"
//                   multiple
//                   onChange={handleFilesSelected}
//                   className="hidden"
//                   id="product-image-upload"
//                 />
//                 <label
//                   htmlFor="product-image-upload"
//                   className={`flex items-center justify-center gap-2 border-2 border-dashed border-black/10 rounded-xl py-6 text-sm text-[#8A928E] cursor-pointer hover:border-[#5F7A5B] hover:text-[#5F7A5B] transition-colors ${
//                     uploading ? 'pointer-events-none opacity-50' : ''
//                   }`}
//                 >
//                   {uploading ? (
//                     <>
//                       <Loader2 size={16} className="animate-spin" />
//                       Uploading...
//                     </>
//                   ) : (
//                     <>
//                       <Upload size={16} />
//                       Click to upload images
//                     </>
//                   )}
//                 </label>
//               </div>

//               <div>
//                 <label className="text-xs uppercase tracking-widest text-[#8A928E] mb-1.5 block">Description</label>
//                 <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${inputClass} resize-none`} />
//               </div>

//               <div className="flex gap-6">
//                 <label className="flex items-center gap-2 text-sm text-[#1F2421]">
//                   <input type="checkbox" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} className="accent-[#5F7A5B]" />
//                   Mark as New
//                 </label>
//                 <label className="flex items-center gap-2 text-sm text-[#1F2421]">
//                   <input type="checkbox" checked={form.in_stock} onChange={(e) => setForm({ ...form, in_stock: e.target.checked })} className="accent-[#5F7A5B]" />
//                   In Stock
//                 </label>
//               </div>

//               <button
//                 onClick={handleSave}
//                 disabled={saving || uploading}
//                 className="flex items-center justify-center gap-2 bg-[#5F7A5B] hover:bg-[#4F6A4B] disabled:opacity-50 text-white font-medium py-3 rounded-full transition-colors mt-2"
//               >
//                 {saving && <Loader2 size={15} className="animate-spin" />}
//                 {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Product'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {deleteTarget && (
//         <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-6">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
//             <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-5 mx-auto">
//               <AlertTriangle size={20} />
//             </div>

//             <h2 className="text-lg font-bold text-[#1F2421] text-center mb-2">
//               Delete this product?
//             </h2>
//             <p className="text-sm text-[#8A928E] text-center mb-6">
//               <span className="font-medium text-[#3F4744]">&rdquo;{deleteTarget.name}&rdquo;</span> will be
//               permanently removed. This cannot be undone.
//             </p>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => setDeleteTarget(null)}
//                 disabled={deleting}
//                 className="flex-1 border border-black/10 text-[#3F4744] font-medium py-2.5 rounded-full transition-colors hover:bg-[#F7F5F0] disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDelete}
//                 disabled={deleting}
//                 className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-medium py-2.5 rounded-full transition-colors"
//               >
//                 {deleting && <Loader2 size={15} className="animate-spin" />}
//                 {deleting ? 'Deleting...' : 'Delete'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }