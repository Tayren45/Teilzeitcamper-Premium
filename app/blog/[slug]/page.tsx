import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { blogPosts } from "@/lib/content";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.teaser,
    openGraph: { title: post.title, description: post.teaser, images: [post.image], type: "article" },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.teaser,
    datePublished: post.date,
    image: post.image,
    author: { "@type": "Person", name: "David Bruderer" },
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="relative flex min-h-[55vh] items-end overflow-hidden">
        <Image src={post.image} alt={post.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-950/90 via-pine-950/30 to-pine-950/20" />
        <div className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-12 pt-40 sm:px-6">
          <p className="text-sm font-bold uppercase tracking-widest text-terra-300">
            {post.tags.join(" · ")}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-white sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-white/75">
            {new Date(post.date).toLocaleDateString("de-CH", { day: "numeric", month: "long", year: "numeric" })} · {post.readMin} Min. Lesezeit · von David
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <Reveal>
          <div className="space-y-6 text-lg leading-relaxed text-pine-900 dark:text-sand-100/90">
            {post.body.map((para, i) => (
              <p key={i} className={i === 0 ? "font-display text-xl leading-relaxed first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.85] first-letter:text-terra-500" : ""}>
                {para}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14 rounded-3xl bg-pine-950 p-8 text-center text-sand-100">
            <h2 className="font-display text-2xl font-semibold">Lust auf genau diese Reise?</h2>
            <p className="mt-2 text-sm text-sand-100/70">
              Der Teilzeitcamper wartet — prüfe die Verfügbarkeit für deine Wunschdaten.
            </p>
            <Link href="/buchung" className="btn-primary mt-5 !bg-terra-500 hover:!bg-terra-400">
              Jetzt buchen →
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 flex justify-between text-sm font-semibold">
          <Link href="/blog" className="text-terra-500 hover:underline">← Alle Artikel</Link>
        </div>
      </div>
    </article>
  );
}
