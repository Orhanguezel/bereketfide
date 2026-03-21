'use client';

import * as React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export type HomeStatItem = { value: number; label: string };

export type HomeStatsStructuredFormProps = {
  value: HomeStatItem[];
  onChange: (next: HomeStatItem[]) => void;
  disabled?: boolean;
};

export function homeStatsObjToForm(raw: unknown): HomeStatItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x) => x && typeof x === 'object')
    .map((x: any) => ({
      value: typeof x.value === 'number' ? x.value : Number(x.value) || 0,
      label: String(x.label || ''),
    }));
}

export function homeStatsFormToObj(items: HomeStatItem[]): HomeStatItem[] {
  return items.map((item) => ({
    value: Number(item.value) || 0,
    label: item.label.trim(),
  }));
}

export const HomeStatsStructuredForm: React.FC<HomeStatsStructuredFormProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const handleItemChange = (idx: number, field: keyof HomeStatItem, val: string) => {
    const next = [...value];
    if (field === 'value') {
      next[idx] = { ...next[idx], value: Number(val) || 0 };
    } else {
      next[idx] = { ...next[idx], label: val };
    }
    onChange(next);
  };

  const handleAdd = () => {
    onChange([...value, { value: 0, label: '' }]);
  };

  const handleRemove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const handleMove = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Anasayfada gösterilecek istatistik rakamlarını düzenleyin.
      </p>

      {value.length === 0 && (
        <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
          Henüz istatistik eklenmemiş.
        </div>
      )}

      <div className="space-y-3">
        {value.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2 rounded-lg border bg-card p-3"
          >
            <div className="flex flex-col gap-1 pt-2">
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                onClick={() => handleMove(idx, idx - 1)}
                disabled={disabled || idx === 0}
                title="Yukarı"
              >
                <GripVertical className="h-4 w-4" />
              </button>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-[120px_1fr]">
              <div className="space-y-1">
                <Label className="text-xs">Rakam</Label>
                <Input
                  type="number"
                  value={item.value}
                  onChange={(e) => handleItemChange(idx, 'value', e.target.value)}
                  disabled={disabled}
                  className="font-semibold"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Etiket</Label>
                <Input
                  value={item.label}
                  onChange={(e) => handleItemChange(idx, 'label', e.target.value)}
                  disabled={disabled}
                  placeholder="ör: Mutlu Müşteri"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-5 shrink-0 text-destructive hover:text-destructive"
              onClick={() => handleRemove(idx)}
              disabled={disabled}
              title="Sil"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        disabled={disabled}
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        İstatistik Ekle
      </Button>
    </div>
  );
};
