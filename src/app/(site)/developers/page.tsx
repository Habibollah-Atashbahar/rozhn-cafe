import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "درباره تیم توسعه",
  description: "تیم برنامه نویس ماکا به آدرس makateam.ir",
};

const values = [
  {
    name: "حبیب الله آتش بهار",
    title: "برنامه نویس فرانت ",
    desc: "فرانت اند دولوپر. آشنا به مفاهیم React&Next JS, Typescript, TailwindCSS, JSON-SERVER, PostgreSQL, Basic's Of Rust",
  },
  {
    name: "پوریا صمیمی",
    title: "برنامه نویس بک اند",
    desc: "بک اند دولوپر. آشنا به مفاهیم Python, Django, FastAPI, Automation-Tools, GO, SERVER, DB",
  },
  // {
  //   name: "Habib"
  //   title: "همیشه در دسترس",
  //   desc: "از صبح زود تا پاسی از شب، روژن فضایی برای کار، گفتگو و لحظات آرام شماست.",
  // },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-xs font-medium tracking-[0.3em] text-graphite-400">
        ABOUT DEVELOPERS
      </p>
      <h1 className="mt-3 text-2xl font-bold text-ink-900 sm:text-3xl">
        درباره تیم توسعه
      </h1>
      <p className="mt-5 text-sm leading-8 text-graphite-600 sm:text-[15px]">
        تیم برنامه نویس ماکا به آدرس
        <a href="https://www.makateam.ir/" target="_blank" className="pr-2">
          makateam.ir
        </a>
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {values.map(({ name, title, desc }) => (
          <div
            key={title}
            className="rounded-card border border-graphite-200/70 bg-white/60 p-5"
          >
            <h3 className="mt-3 text-sm font-semibold text-ink-900">{name}</h3>
            <p className="mt-1.5 text-xs leading-6 text-graphite-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
