// Chargeur d'images pour l'export statique (GitHub Pages) : images servies telles quelles, préfixées du chemin de base.
export default function loader({ src }: { src: string; width: number; quality?: number }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return src.startsWith('/') ? `${base}${src}` : src;
}
