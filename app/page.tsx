import DocumentList from "../components/DocumentList";

export default function Home() {
  return (
    <div className="grid align-top">
      <div className="grid justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 sm:items-start">
          <div className="flex flex-col gap-1">
            <h1 className="font-semibold text-4xl">Documentos</h1>

            <div className="flex gap-2 items-center text-neutral-500">
              <p>Você pode clicar em qualquer modelo de documento para preenchê-lo.</p>
            </div>
          </div>

          <DocumentList></DocumentList>
        </main>
      </div>
    </div>
  );
}
