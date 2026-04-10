export default function ComingSoon() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[--color-warm-cream] text-[--color-sea-navy] px-6 text-center">
      <div className="max-w-xl">
        <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4 leading-tight">
          Yn dod yn fuan
          <span className="block text-2xl md:text-3xl font-normal mt-2 text-[--color-mountain-green]">
            Coming soon
          </span>
        </h1>

        <p className="text-lg text-[--color-sea-navy]/70 mb-2">
          Rydym yn gweithio ar rywbeth cyffrous.
        </p>
        <p className="text-lg text-[--color-sea-navy]/70">
          We&apos;re working on something exciting.
        </p>

        <div className="mt-10 w-16 h-1 bg-[--color-solar-gold] mx-auto rounded-full" />

        <p className="mt-8 text-sm text-[--color-sea-navy]/50">
          Ynni Cymunedol Llanfairfechan Community Energy
        </p>
      </div>
    </main>
  );
}
