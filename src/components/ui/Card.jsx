export function Card({ children }) {
  return <div className="rounded-xl bg-gray-900 p-6 shadow-lg">{children}</div>;
}

export function CardContent({ children }) {
  return <div className="text-white">{children}</div>;
}
