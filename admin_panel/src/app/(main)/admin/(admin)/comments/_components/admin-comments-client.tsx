'use client';

// =============================================================
// FILE: src/app/(main)/admin/(admin)/comments/_components/admin-comments-client.tsx
// Admin Comments Management — List + Approve/Reject + Delete
// =============================================================

import * as React from 'react';
import { toast } from 'sonner';
import {
  RefreshCcw,
  Search,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Image as ImageIcon,
} from 'lucide-react';

import { useAdminT } from '@/app/(main)/admin/_components/common/useAdminT';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import type { AdminCommentDto, AdminCommentListParams } from '@/integrations/shared/comment_admin.types';
import {
  useListCommentsAdminQuery,
  useUpdateCommentAdminMutation,
  useDeleteCommentAdminMutation,
} from '@/integrations/hooks';

type ApprovedFilter = 'all' | 'approved' | 'unapproved';

function fmtDate(val: string | null | undefined) {
  if (!val) return '-';
  try {
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return String(val);
    return d.toLocaleString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(val);
  }
}

function truncate(text: string | null | undefined, max = 80) {
  const t = text || '';
  if (t.length <= max) return t || '-';
  return t.slice(0, max - 1) + '\u2026';
}

function getErrMsg(e: unknown, fallback: string): string {
  const anyErr = e as any;
  return anyErr?.data?.error?.message || anyErr?.data?.message || anyErr?.message || fallback;
}

export default function AdminCommentsClient() {
  const t = useAdminT();

  const [search, setSearch] = React.useState('');
  const [approvedFilter, setApprovedFilter] = React.useState<ApprovedFilter>('all');
  const [targetTypeFilter, setTargetTypeFilter] = React.useState('');

  const queryParams = React.useMemo((): AdminCommentListParams => ({
    search: search || undefined,
    is_approved:
      approvedFilter === 'approved'
        ? true
        : approvedFilter === 'unapproved'
          ? false
          : undefined,
    target_type: targetTypeFilter || undefined,
    limit: 100,
    sort: 'created_at',
    order: 'desc',
  }), [search, approvedFilter, targetTypeFilter]);

  const { data: items = [], isLoading, isFetching, refetch } = useListCommentsAdminQuery(queryParams);
  const [updateComment] = useUpdateCommentAdminMutation();
  const [deleteComment] = useDeleteCommentAdminMutation();

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<AdminCommentDto | null>(null);

  const handleToggleApproved = async (item: AdminCommentDto) => {
    try {
      await updateComment({
        id: item.id,
        patch: { is_approved: !item.is_approved },
      }).unwrap();
      toast.success(item.is_approved ? 'Onay kaldırıldı' : 'Onaylandı');
      refetch();
    } catch (err) {
      toast.error(getErrMsg(err, 'Hata oluştu'));
    }
  };

  const handleToggleActive = async (item: AdminCommentDto) => {
    try {
      await updateComment({
        id: item.id,
        patch: { is_active: !item.is_active },
      }).unwrap();
      toast.success(item.is_active ? 'Pasif yapıldı' : 'Aktif yapıldı');
      refetch();
    } catch (err) {
      toast.error(getErrMsg(err, 'Hata oluştu'));
    }
  };

  const handleDeleteClick = (item: AdminCommentDto) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await deleteComment({ id: itemToDelete.id }).unwrap();
      toast.success('Yorum silindi');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      refetch();
    } catch (err) {
      toast.error(getErrMsg(err, 'Silme hatası'));
    }
  };

  const busy = isLoading || isFetching;

  const targetTypeLabel = (type: string) => {
    switch (type) {
      case 'project': return 'Proje';
      case 'news': return 'Haber';
      case 'custom_page': return 'Blog';
      case 'service': return 'Hizmet';
      default: return type;
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1.5">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="size-5" />
                  Yorumlar
                </CardTitle>
                <CardDescription>
                  Kullanıcı yorumlarını yönetin. Onaylayın, reddedin veya silin.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => refetch()}
                disabled={busy}
                className="gap-2"
              >
                <RefreshCcw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
                Yenile
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Search */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="comment-search" className="text-sm">Ara</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="comment-search"
                    placeholder="Yazar, e-posta veya içerik ara..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    disabled={busy}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Approved filter */}
              <div className="space-y-2">
                <Label className="text-sm">Onay Durumu</Label>
                <Select
                  value={approvedFilter}
                  onValueChange={(v) => setApprovedFilter(v as ApprovedFilter)}
                  disabled={busy}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="approved">Onaylı</SelectItem>
                    <SelectItem value="unapproved">Onay Bekliyor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Target type filter */}
              <div className="space-y-2">
                <Label className="text-sm">Hedef Tipi</Label>
                <Select
                  value={targetTypeFilter || 'all'}
                  onValueChange={(v) => setTargetTypeFilter(v === 'all' ? '' : v)}
                  disabled={busy}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tümü</SelectItem>
                    <SelectItem value="project">Proje</SelectItem>
                    <SelectItem value="news">Haber/Blog</SelectItem>
                    <SelectItem value="service">Hizmet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
              <span>Toplam {items.length} yorum</span>
              {isFetching && (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span>Yükleniyor...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Table (Desktop) */}
        <Card className="hidden xl:block">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Yazar</TableHead>
                  <TableHead>Yorum</TableHead>
                  <TableHead className="w-[100px]">Tip</TableHead>
                  <TableHead className="w-[60px] text-center">Resim</TableHead>
                  <TableHead className="w-[80px] text-center">Onay</TableHead>
                  <TableHead className="w-[80px] text-center">Aktif</TableHead>
                  <TableHead className="w-[140px]">Tarih</TableHead>
                  <TableHead className="w-[80px] text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="size-5 animate-spin" />
                        <span>Yükleniyor...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      Yorum bulunamadı
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id} className={!item.is_active ? 'opacity-50' : ''}>
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="font-medium text-sm">{item.author_name}</div>
                          <div className="text-xs text-muted-foreground">{item.author_email || '-'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm" title={item.content}>
                          {truncate(item.content)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {targetTypeLabel(item.target_type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.image_url ? (
                          <a
                            href={item.image_url.startsWith('http') ? item.image_url : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8086'}${item.image_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Resmi görüntüle"
                          >
                            <ImageIcon className="size-4 text-primary mx-auto" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleApproved(item)}
                          disabled={busy}
                          title={item.is_approved ? 'Onayı Kaldır' : 'Onayla'}
                        >
                          {item.is_approved ? (
                            <CheckCircle2 className="size-4 text-green-600" />
                          ) : (
                            <XCircle className="size-4 text-muted-foreground" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={item.is_active}
                          onCheckedChange={() => handleToggleActive(item)}
                          disabled={busy}
                        />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {fmtDate(item.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(item)}
                          disabled={busy}
                          title="Sil"
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Cards (Mobile) */}
        <div className="space-y-3 xl:hidden">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="size-5 animate-spin" />
              </CardContent>
            </Card>
          ) : items.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Yorum bulunamadı
              </CardContent>
            </Card>
          ) : (
            items.map((item) => (
              <Card key={item.id} className={!item.is_active ? 'opacity-50' : ''}>
                <CardContent className="space-y-3 pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="font-medium text-sm">{item.author_name}</div>
                      <div className="text-xs text-muted-foreground">{item.author_email || '-'}</div>
                      <Badge variant="outline" className="text-xs">
                        {targetTypeLabel(item.target_type)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleApproved(item)}
                        disabled={busy}
                      >
                        {item.is_approved ? (
                          <CheckCircle2 className="size-4 text-green-600" />
                        ) : (
                          <XCircle className="size-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Switch
                        checked={item.is_active}
                        onCheckedChange={() => handleToggleActive(item)}
                        disabled={busy}
                      />
                    </div>
                  </div>
                  <p className="text-sm">{truncate(item.content, 200)}</p>
                  {item.image_url && (
                    <a
                      href={item.image_url.startsWith('http') ? item.image_url : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8086'}${item.image_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary flex items-center gap-1"
                    >
                      <ImageIcon className="size-3" /> Resmi Görüntüle
                    </a>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{fmtDate(item.created_at)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(item)}
                      disabled={busy}
                      className="text-destructive"
                    >
                      <Trash2 className="size-3.5 mr-1" /> Sil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yorumu Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{itemToDelete?.author_name}</strong> adlı kullanıcının yorumunu silmek
              istediğinize emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Sil</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
