import Link from 'next/link';

export default function model({
  src,
  alt,
  href,
  children,
}: {
  src: string;
  alt: string;
  href: string;
  children: React.ReactNode;
}) {
  return (    
    <Link href={href}>
      <div className="flex flex-col items-center gap-2 p-2 border border-neutral-300 rounded-2xl">
        <img src={src} alt={alt} className="max-w-72 rounded-2xl"/>
        <p className="font-medium">{children}</p>
      </div>
    </Link>
  );
}
