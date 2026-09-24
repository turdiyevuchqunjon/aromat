import RahmatRedirect from "./RahmatRedirect";

export const metadata = {
  title: "Rahmat! — AromaLux",
};

export default function RahmatPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-5 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke="#C9A24B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1 className="font-display text-3xl text-white md:text-4xl">Rahmat!</h1>
      <p className="mt-4 max-w-md text-white/60">
        So'rovingiz muvaffaqiyatli qabul qilindi. Mutaxassisimiz tez orada siz bilan bog'lanadi.
      </p>
      <RahmatRedirect />
    </main>
  );
}
