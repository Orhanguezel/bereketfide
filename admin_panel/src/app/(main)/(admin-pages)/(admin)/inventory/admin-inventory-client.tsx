'use client';

// =============================================================
// FILE: src/app/(main)/(admin-pages)/(admin)/inventory/admin-inventory-client.tsx
// Bereketfide Admin – Envanter İzleme
//   Tabs: envanter listesi | sync logları
//   Stats: toplam ürün, toplam stok, son sync zamanı, son sync durumu
// =============================================================

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  PackageSearch,
  RefreshCcw,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  TrendingUp,
  AlertCircle,
  Loader2,
} from 'lucide-react';

import { Button }                                           from '@/components/ui/button';
import { Input }                                            from '@/components/ui/input';
import { Badge }                                            from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger }         from '@/components/ui/tabs';
import { Skeleton }                                         from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { useAdminT } from '@/app/(main)/(admin-pages)/_components/common/useAdminT';
import {
  useGetInventoryStatsAdminQuery,
  useListInventoryAdminQuery,
  useListInventorySyncLogsAdminQuery,
} from '@/integrations/hooks';

// ─── helpers ─────────────────────────────────────────────────────────────────

function fmtDate(v: string | null | undefined) {
  if (!v) return '—';
  return new Date(v).toLocaleString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function fmtNum(v: number | string | null | undefined) {
  if (v == null || v === '') return '—';
  return Number(v).toLocaleString('tr-TR');
}

function fmtMs(ms: number) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

// ─── Stats Cards ─────────────────────────────────────────────────────────────

function StatsSection() {
  const q = useGetInventoryStatsAdminQuery();

  if (q.isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}><CardContent className="pt-6"><Skeleton className="h-16 w-full" /></CardContent></Card>
        ))}
      </div>
    );
  }

  const s = q.data;
  const lastSync = s?.last_sync;
  const syncOk   = lastSync?.status === 'ok';

  const cards = [
    {
      icon: <PackageSearch className="h-5 w-5 text-primary" />,
      label: 'Toplam Ürün',
      value: fmtNum(s?.total_products),
    },
    {
      icon: <Database className="h-5 w-5 text-primary" />,
      label: 'Toplam Stok',
      value: fmtNum(s?.total_stock),
    },
    {
      icon: <Clock className="h-5 w-5 text-muted-foreground" />,
      label: 'Son Sync',
      value: fmtDate(s?.last_synced_at),
    },
    {
      icon: syncOk
        ? <CheckCircle2 className="h-5 w-5 text-green-500" />
        : <XCircle className="h-5 w-5 text-destructive" />,
      label: 'Sync Durumu',
      value: lastSync
        ? (
          <div className="flex flex-col gap-1">
            <Badge variant={syncOk ? 'default' : 'destructive'} className="w-fit text-xs">
              {syncOk ? 'Başarılı' : 'Hata'}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {fmtMs(lastSync.duration_ms)} · {fmtNum(lastSync.total_rows)} kayıt
            </span>
          </div>
        )
        : '—',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <Card key={i}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1 min-w-0">
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <div className="text-sm font-semibold truncate">{c.value}</div>
              </div>
              <div className="shrink-0 mt-0.5">{c.icon}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Inventory List Tab ───────────────────────────────────────────────────────

const LIMIT = 50;

function InventoryListTab() {
  const router      = useRouter();
  const sp          = useSearchParams();
  const [search, setSearch] = React.useState(sp.get('search') ?? '');
  const [submitted, setSubmitted] = React.useState(sp.get('search') ?? '');
  const offset = parseInt(sp.get('offset') ?? '0');

  const params = {
    search:  submitted || undefined,
    limit:   LIMIT,
    offset,
  };

  const q = useListInventoryAdminQuery(params);
  const items = q.data?.items ?? [];
  const total = q.data?.total ?? 0;
  const canPrev = offset > 0;
  const canNext = offset + LIMIT < total;

  function push(next: Record<string, string | number>) {
    const p = new URLSearchParams(sp.toString());
    Object.entries(next).forEach(([k, v]) => p.set(k, String(v)));
    router.push(`?${p.toString()}`);
  }

  function applySearch() {
    setSubmitted(search);
    push({ search, offset: 0 });
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Malzeme kodu veya adı ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applySearch()}
          />
        </div>
        <Button variant="outline" onClick={applySearch}>Ara</Button>
        {submitted && (
          <Button variant="ghost" onClick={() => { setSearch(''); setSubmitted(''); push({ search: '', offset: 0 }); }}>
            Temizle
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              {q.isFetching ? (
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> Yükleniyor...
                </span>
              ) : (
                `${fmtNum(total)} ürün`
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {q.isError ? (
            <div className="flex items-center gap-2 p-6 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" /> Veri yüklenemedi.
              <Button variant="ghost" size="sm" onClick={() => q.refetch()}>Tekrar dene</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Kod</TableHead>
                  <TableHead>Ürün Adı</TableHead>
                  <TableHead className="text-right">Giriş</TableHead>
                  <TableHead className="text-right">Çıkış</TableHead>
                  <TableHead className="text-right font-semibold">Stok</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Son Sync</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {q.isLoading
                  ? [...Array(8)].map((_, i) => (
                      <TableRow key={i}>
                        {[...Array(6)].map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  : items.map((item) => (
                      <TableRow key={item.malzeme_kodu}>
                        <TableCell className="font-mono text-xs">{item.malzeme_kodu}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm">{item.malzeme_adi}</TableCell>
                        <TableCell className="text-right text-sm tabular-nums">{fmtNum(item.girisler)}</TableCell>
                        <TableCell className="text-right text-sm tabular-nums">{fmtNum(item.cikislar)}</TableCell>
                        <TableCell className="text-right font-semibold tabular-nums">
                          <Badge variant={item.envanter_miktari > 0 ? 'default' : 'secondary'} className="tabular-nums">
                            {fmtNum(item.envanter_miktari)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground hidden md:table-cell">
                          {fmtDate(item.synced_at)}
                        </TableCell>
                      </TableRow>
                    ))
                }
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {!q.isLoading && !q.isError && (
            <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
              <span>{offset + 1}–{Math.min(offset + LIMIT, total)} / {fmtNum(total)}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={!canPrev} onClick={() => push({ offset: offset - LIMIT })}>
                  Önceki
                </Button>
                <Button variant="outline" size="sm" disabled={!canNext} onClick={() => push({ offset: offset + LIMIT })}>
                  Sonraki
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Sync Logs Tab ────────────────────────────────────────────────────────────

function SyncLogsTab() {
  const q = useListInventorySyncLogsAdminQuery({ limit: 30 });
  const logs = q.data?.items ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Sync Geçmişi</CardTitle>
        <CardDescription>Her 10 dakikada bir otomatik çalışır.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {q.isError ? (
          <div className="flex items-center gap-2 p-6 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" /> Yüklenemedi.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zaman</TableHead>
                <TableHead className="text-right">Toplam</TableHead>
                <TableHead className="text-right">Yeni</TableHead>
                <TableHead className="text-right">Değişen</TableHead>
                <TableHead className="text-right">Süre</TableHead>
                <TableHead>Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {q.isLoading
                ? [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(6)].map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                : logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs">{fmtDate(log.synced_at)}</TableCell>
                      <TableCell className="text-right tabular-nums">{fmtNum(log.total_rows)}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {log.new_rows > 0
                          ? <Badge variant="default" className="tabular-nums text-xs">+{log.new_rows}</Badge>
                          : <span className="text-muted-foreground">—</span>
                        }
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {log.changed_rows > 0
                          ? <Badge variant="secondary" className="tabular-nums text-xs">{log.changed_rows}</Badge>
                          : <span className="text-muted-foreground">—</span>
                        }
                      </TableCell>
                      <TableCell className="text-right text-xs tabular-nums">{fmtMs(log.duration_ms)}</TableCell>
                      <TableCell>
                        {log.status === 'ok'
                          ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                          : (
                            <div className="flex items-center gap-1">
                              <XCircle className="h-4 w-4 text-destructive" />
                              <span className="text-xs text-destructive truncate max-w-[120px]">{log.error_msg}</span>
                            </div>
                          )
                        }
                      </TableCell>
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminInventoryClient() {
  const [tab, setTab] = React.useState<'list' | 'logs'>('list');
  const statsQ        = useGetInventoryStatsAdminQuery();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PackageSearch className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base">Envanter İzleme</CardTitle>
                <CardDescription>Kaynak: ScriptCase (88.250.38.79:8092) · Her 10 dakikada güncellenir</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => statsQ.refetch()} disabled={statsQ.isFetching}>
              <RefreshCcw className={`h-4 w-4 mr-2 ${statsQ.isFetching ? 'animate-spin' : ''}`} />
              Yenile
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <StatsSection />

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'list' | 'logs')}>
        <TabsList>
          <TabsTrigger value="list">
            <PackageSearch className="h-4 w-4 mr-2" />
            Envanter
          </TabsTrigger>
          <TabsTrigger value="logs">
            <TrendingUp className="h-4 w-4 mr-2" />
            Sync Geçmişi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          <InventoryListTab />
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <SyncLogsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
