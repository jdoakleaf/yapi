import { getMenus } from "@/lib/cms/content-actions";
import { MenuManager } from "./menu-manager";


export default async function MenulerPage() {
  const menus = await getMenus();
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Menü Yönetimi</h1>
        <p className="mt-1 text-sm text-gray-500">{menus.length} menü</p>
      </div>
      <MenuManager menus={menus} />
    </div>
  );
}
