"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  upsertMenu, addMenuItem, deleteMenuItem,
} from "@/lib/cms/content-actions";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ChevronRight } from "lucide-react";

interface MenuItemData {
  id: string;
  label: string;
  url: string;
  target: string;
  sortOrder: number;
  isActive: boolean;
  children: {
    id: string;
    label: string;
    url: string;
    target: string;
    sortOrder: number;
    isActive: boolean;
  }[];
}

interface MenuData {
  id: string;
  name: string;
  key: string;
  isActive: boolean;
  items: MenuItemData[];
}

interface Props { menus: MenuData[] }

function AddMenuItemForm({
  menuId,
  parentId,
  onDone,
}: {
  menuId: string;
  parentId?: string;
  onDone: () => void;
}) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [target, setTarget] = useState("_self");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!label || !url) return;
    startTransition(async () => {
      await addMenuItem(menuId, { label, url, target, parentId });
      router.refresh();
      onDone();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-wrap items-end gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
      <div className="space-y-1">
        <Label className="text-xs">Etiket</Label>
        <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Hizmetler" className="h-8 w-32 text-xs" required />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">URL</Label>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/hizmetler" className="h-8 w-40 text-xs" required />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Hedef</Label>
        <select value={target} onChange={(e) => setTarget(e.target.value)}
          className="h-8 rounded-md border border-gray-300 px-2 text-xs">
          <option value="_self">Aynı sekme</option>
          <option value="_blank">Yeni sekme</option>
        </select>
      </div>
      <Button type="submit" size="sm" className="h-8 text-xs" disabled={isPending}>
        {isPending ? "..." : "Ekle"}
      </Button>
      <Button type="button" size="sm" variant="outline" className="h-8 text-xs" onClick={onDone}>
        İptal
      </Button>
    </form>
  );
}

export function MenuManager({ menus }: Props) {
  const [addingMenuItemFor, setAddingMenuItemFor] = useState<{ menuId: string; parentId?: string } | null>(null);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuKey, setNewMenuKey] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleAddMenu(e: React.FormEvent) {
    e.preventDefault();
    if (!newMenuName || !newMenuKey) return;
    startTransition(async () => {
      await upsertMenu(newMenuName, newMenuKey);
      router.refresh();
      setShowNewMenu(false);
      setNewMenuName("");
      setNewMenuKey("");
    });
  }

  function handleDeleteItem(id: string) {
    if (!confirm("Bu menü öğesini silmek istiyor musunuz?")) return;
    startTransition(async () => { await deleteMenuItem(id); router.refresh(); });
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        {!showNewMenu && (
          <Button onClick={() => setShowNewMenu(true)}><Plus className="mr-2 h-4 w-4" />Yeni Menü</Button>
        )}
        {showNewMenu && (
          <form onSubmit={handleAddMenu} className="flex flex-wrap items-end gap-2 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="space-y-1">
              <Label className="text-xs">Menü Adı</Label>
              <Input value={newMenuName} onChange={(e) => setNewMenuName(e.target.value)} placeholder="Ana Menü" className="h-8 w-36 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Anahtar</Label>
              <Input value={newMenuKey} onChange={(e) => setNewMenuKey(e.target.value)} placeholder="main_nav" className="h-8 w-32 text-xs" />
              <p className="text-xs text-gray-400">Kod&apos;dan erişim için</p>
            </div>
            <Button type="submit" size="sm" className="h-8 text-xs" disabled={isPending}>Oluştur</Button>
            <Button type="button" size="sm" variant="outline" className="h-8 text-xs" onClick={() => setShowNewMenu(false)}>İptal</Button>
          </form>
        )}
      </div>

      {menus.length === 0 && <p className="py-10 text-center text-gray-400">Henüz menü yok.</p>}

      {menus.map((menu) => (
        <div key={menu.id} className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
            <div>
              <span className="font-semibold text-gray-900">{menu.name}</span>
              <span className="ml-2 font-mono text-xs text-gray-400">{menu.key}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAddingMenuItemFor(addingMenuItemFor?.menuId === menu.id && !addingMenuItemFor.parentId ? null : { menuId: menu.id })}
            >
              <Plus className="mr-1 h-3 w-3" />Üst Öğe Ekle
            </Button>
          </div>

          <div className="p-4">
            {addingMenuItemFor?.menuId === menu.id && !addingMenuItemFor.parentId && (
              <AddMenuItemForm menuId={menu.id} onDone={() => setAddingMenuItemFor(null)} />
            )}

            {menu.items.length === 0 && !addingMenuItemFor && (
              <p className="py-4 text-center text-sm text-gray-400">Bu menüde öğe yok.</p>
            )}

            <div className="space-y-1 mt-2">
              {menu.items.map((item) => (
                <div key={item.id}>
                  <div className="flex items-center gap-2 rounded px-3 py-2 hover:bg-gray-50">
                    <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                    <span className="text-xs text-gray-400 font-mono">{item.url}</span>
                    <span className="text-xs text-gray-300">{item.target}</span>
                    <Button variant="ghost" size="sm"
                      onClick={() => setAddingMenuItemFor(addingMenuItemFor?.parentId === item.id ? null : { menuId: menu.id, parentId: item.id })}>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(item.id)} disabled={isPending}>
                      <Trash2 className="h-3.5 w-3.5 text-red-400" />
                    </Button>
                  </div>

                  {addingMenuItemFor?.parentId === item.id && (
                    <div className="ml-6">
                      <AddMenuItemForm menuId={menu.id} parentId={item.id} onDone={() => setAddingMenuItemFor(null)} />
                    </div>
                  )}

                  {item.children.map((child) => (
                    <div key={child.id} className="ml-6 flex items-center gap-2 rounded px-3 py-1.5 hover:bg-gray-50">
                      <ChevronRight className="h-3 w-3 text-gray-300" />
                      <span className="text-sm text-gray-600 flex-1">{child.label}</span>
                      <span className="text-xs text-gray-400 font-mono">{child.url}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteItem(child.id)} disabled={isPending}>
                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                      </Button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
