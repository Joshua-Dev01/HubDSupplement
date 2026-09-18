import PageLeafLoader from "@/components/ui/Pageleafloader";

export default function ProductLoading() {
  return (
    <div className="pt-32 pb-20">
      <PageLeafLoader label="Loading Product..." />
    </div>
  )
}