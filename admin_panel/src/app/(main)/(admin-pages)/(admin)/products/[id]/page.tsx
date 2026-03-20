import ProductDetailClient from '../_components/product-detail-client';
import type { ProductItemType } from '@/integrations/shared/product_admin.types';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}

export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const { type } = await searchParams;
  const validTypes: ProductItemType[] = ['product', 'sparepart', 'bereketfide'];
  const itemType: ProductItemType | undefined =
    validTypes.includes(type as ProductItemType) ? (type as ProductItemType) : undefined;
  return <ProductDetailClient id={id} itemType={itemType} />;
}
