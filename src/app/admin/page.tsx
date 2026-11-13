export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Yönetim paneli Faz 5&apos;te tam olarak geliştirilecektir.
      </p>

      {/* Placeholder kartlar */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Hizmetler", value: "12", color: "bg-blue-50 text-blue-700" },
          { label: "Projeler", value: "0", color: "bg-green-50 text-green-700" },
          { label: "Blog Yazıları", value: "0", color: "bg-purple-50 text-purple-700" },
          { label: "Teklif Talepleri", value: "0", color: "bg-amber-50 text-amber-700" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <p className={`mt-2 text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
