"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { MenuCategory, MenuItem, MenuOptionGroup } from "@/types";
import { cn } from "@/lib/utils";
import { api, ApiError } from "@/lib/api";

type FormState = {
  name: string;
  nameEn: string;
  categoryId: string;
  description: string;
  basePrice: string;
  costPrice: string;
  image: string;
  available: boolean;
  seasonal: boolean;
  staffPick: boolean;
  optionGroups: MenuOptionGroup[];
};

function toFormState(item?: MenuItem): FormState {
  return {
    name: item?.name ?? "",
    nameEn: item?.nameEn ?? "",
    categoryId: item?.categoryId ?? "",
    description: item?.description ?? "",
    basePrice: item?.basePrice != null ? String(item.basePrice) : "",
    costPrice: item?.costPrice != null ? String(item.costPrice) : "",
    image: item?.image ?? "",
    available: item?.available ?? true,
    seasonal: item?.seasonal ?? false,
    staffPick: item?.staffPick ?? false,
    optionGroups: item?.optionGroups ? structuredClone(item.optionGroups) : [],
  };
}

export default function MenuItemForm({
  item,
  categories,
  onSaved,
  onCancel,
}: {
  item?: MenuItem;
  categories: MenuCategory[];
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => toFormState(item));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-lg border border-graphite-200 bg-white px-3 py-2.5 text-sm focus:border-ink-900 focus:outline-none";

  function updateGroup(gi: number, patch: Partial<MenuOptionGroup>) {
    setForm((f) => ({
      ...f,
      optionGroups: f.optionGroups.map((g, i) => (i === gi ? { ...g, ...patch } : g)),
    }));
  }

  function addGroup() {
    setForm((f) => ({
      ...f,
      optionGroups: [...f.optionGroups, { title: "", required: true, choices: [] }],
    }));
  }

  function removeGroup(gi: number) {
    setForm((f) => ({ ...f, optionGroups: f.optionGroups.filter((_, i) => i !== gi) }));
  }

  function addChoice(gi: number) {
    setForm((f) => ({
      ...f,
      optionGroups: f.optionGroups.map((g, i) =>
        i === gi
          ? { ...g, choices: [...g.choices, { id: `c${g.choices.length}`, label: "", priceDelta: 0 }] }
          : g
      ),
    }));
  }

  function updateChoice(gi: number, ci: number, patch: Partial<MenuOptionGroup["choices"][number]>) {
    setForm((f) => ({
      ...f,
      optionGroups: f.optionGroups.map((g, i) =>
        i === gi
          ? { ...g, choices: g.choices.map((c, j) => (j === ci ? { ...c, ...patch } : c)) }
          : g
      ),
    }));
  }

  function removeChoice(gi: number, ci: number) {
    setForm((f) => ({
      ...f,
      optionGroups: f.optionGroups.map((g, i) =>
        i === gi ? { ...g, choices: g.choices.filter((_, j) => j !== ci) } : g
      ),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.categoryId) {
      setError("نام و دسته‌بندی محصول الزامی است");
      return;
    }

    setSubmitting(true);
    setError(null);

    const cleanGroups = form.optionGroups
      .filter((g) => g.title.trim() && g.choices.length > 0)
      .map((g) => ({
        ...g,
        choices: g.choices.filter((c) => c.label.trim()),
      }));

    const payload = {
      name: form.name.trim(),
      nameEn: form.nameEn.trim() || undefined,
      categoryId: form.categoryId,
      description: form.description.trim(),
      basePrice: Number(form.basePrice) || 0,
      costPrice: form.costPrice ? Number(form.costPrice) : undefined,
      image: form.image.trim() || undefined,
      available: form.available,
      seasonal: form.seasonal,
      staffPick: form.staffPick,
      optionGroups: cleanGroups.length ? cleanGroups : undefined,
    };

    try {
      if (item) {
        await api.updateMenuItem(item.id, payload);
      } else {
        await api.createMenuItem(payload);
      }
      onSaved();
    } catch (err) {
      setError(
        err instanceof ApiError ? "ذخیره‌سازی با خطا مواجه شد" : "اتصال به سرور برقرار نشد"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink-950/50 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-bone-50 p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink-900">
            {item ? "ویرایش محصول" : "افزودن محصول جدید"}
          </h2>
          <button onClick={onCancel} className="rounded-full p-1.5 hover:bg-graphite-100" aria-label="بستن">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-graphite-600">نام محصول</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={inputClass}
                placeholder="مثلاً کاپوچینو"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-graphite-600">نام انگلیسی</label>
              <input
                value={form.nameEn}
                onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                dir="ltr"
                className={inputClass}
                placeholder="Cappuccino"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-graphite-600">دسته‌بندی</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              className={inputClass}
            >
              <option value="">انتخاب کنید</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-graphite-600">
              توضیحات (ترکیبات)
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className={inputClass}
              placeholder="از چه ترکیباتی ساخته شده..."
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-graphite-600">قیمت پایه (تومان)</label>
              <input
                value={form.basePrice}
                onChange={(e) => setForm((f) => ({ ...f, basePrice: e.target.value.replace(/[^0-9]/g, "") }))}
                inputMode="numeric"
                dir="ltr"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-graphite-600">
                قیمت تمام‌شده <span className="text-graphite-400">(اختیاری)</span>
              </label>
              <input
                value={form.costPrice}
                onChange={(e) => setForm((f) => ({ ...f, costPrice: e.target.value.replace(/[^0-9]/g, "") }))}
                inputMode="numeric"
                dir="ltr"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-graphite-600">
              آدرس عکس محصول <span className="text-graphite-400">(اختیاری)</span>
            </label>
            <input
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              dir="ltr"
              className={inputClass}
              placeholder="https://..."
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-1.5 text-xs text-graphite-700">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
              />
              موجود است
            </label>
            <label className="flex items-center gap-1.5 text-xs text-graphite-700">
              <input
                type="checkbox"
                checked={form.seasonal}
                onChange={(e) => setForm((f) => ({ ...f, seasonal: e.target.checked }))}
              />
              فصلی
            </label>
            <label className="flex items-center gap-1.5 text-xs text-graphite-700">
              <input
                type="checkbox"
                checked={form.staffPick}
                onChange={(e) => setForm((f) => ({ ...f, staffPick: e.target.checked }))}
              />
              پیشنهاد باریستا
            </label>
          </div>

          <div className="rounded-xl border border-graphite-200 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-graphite-700">انواع / حجم‌ها</p>
              <button
                type="button"
                onClick={addGroup}
                className="flex items-center gap-1 rounded-full border border-graphite-300 px-2.5 py-1 text-[11px] text-ink-900 hover:border-ink-900"
              >
                <Plus size={12} /> گروه جدید
              </button>
            </div>

            {form.optionGroups.length === 0 && (
              <p className="text-[11px] text-graphite-400">این محصول گزینه‌ی نوع/حجم ندارد</p>
            )}

            <div className="flex flex-col gap-3">
              {form.optionGroups.map((group, gi) => (
                <div key={gi} className="rounded-lg bg-bone-100 p-2.5">
                  <div className="mb-2 flex items-center gap-2">
                    <input
                      value={group.title}
                      onChange={(e) => updateGroup(gi, { title: e.target.value })}
                      placeholder="عنوان گروه (مثلاً حجم)"
                      className="flex-1 rounded-lg border border-graphite-200 bg-white px-2 py-1.5 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeGroup(gi)}
                      className="rounded-full p-1 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    {group.choices.map((choice, ci) => (
                      <div key={ci} className="flex items-center gap-1.5">
                        <input
                          value={choice.label}
                          onChange={(e) => updateChoice(gi, ci, { label: e.target.value })}
                          placeholder="مثلاً بزرگ"
                          className="flex-1 rounded-lg border border-graphite-200 bg-white px-2 py-1.5 text-xs"
                        />
                        <input
                          value={choice.priceDelta}
                          onChange={(e) =>
                            updateChoice(gi, ci, { priceDelta: Number(e.target.value.replace(/[^0-9-]/g, "")) || 0 })
                          }
                          inputMode="numeric"
                          dir="ltr"
                          placeholder="+قیمت"
                          className="w-24 rounded-lg border border-graphite-200 bg-white px-2 py-1.5 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => removeChoice(gi, ci)}
                          className="rounded-full p-1 text-graphite-400 hover:bg-graphite-100"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addChoice(gi)}
                      className="mt-1 self-start text-[11px] font-medium text-ink-900 underline"
                    >
                      + افزودن گزینه
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                "flex-1 rounded-full border border-graphite-300 py-2.5 text-sm font-medium text-graphite-700"
              )}
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-full bg-ink-900 py-2.5 text-sm font-semibold text-bone-50 disabled:opacity-60"
            >
              {submitting ? "در حال ذخیره..." : "ذخیره"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
