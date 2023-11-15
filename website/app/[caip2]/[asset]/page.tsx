import { computeFileId, FrontmatterContent } from 'crypto-frontmatter';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { ReactElement } from 'react';
import { Highlighter } from 'shiki';

import { ContentedProse } from '@/components/contented/ContentedProse';
import { loadHighlighter, ShikiHighlighter } from '@/components/contented/ShikiHighlighter';

async function getFrontmatterContent(params: {
  caip2: string;
  asset: string;
}): Promise<FrontmatterContent | undefined> {
  const caip19 = `${decodeURIComponent(params.caip2)}/${decodeURIComponent(params.asset)}`;
  const fileId = computeFileId(caip19);
  const response = await fetch(`${process.env.BASE_URL}/_crypto-frontmatter/${fileId}.json`);
  if (!response.ok) {
    return undefined;
  }
  return await response.json();
}

export async function generateMetadata(props: Parameters<typeof Page>[0]): Promise<Metadata> {
  const frontmatter = await getFrontmatterContent(props.params);
  if (frontmatter === undefined) {
    return notFound();
  }

  const title = frontmatter.fields.title ?? frontmatter.fields.symbol;

  return {
    title: title,
    description: frontmatter.fields.description,
    openGraph: {
      title: title,
      description: frontmatter.fields.description,
      url: `${process.env.BASE_URL}/${frontmatter.path}`,
      siteName: `Crypto Frontmatter`,
      locale: 'en_US',
      type: 'article',
      modifiedTime: new Date(frontmatter.modifiedDate).toISOString(),
    },
  };
}

export default async function Page(props: {
  params: {
    caip2: string;
    asset: string;
  };
}): Promise<ReactElement> {
  const frontmatter = await getFrontmatterContent(props.params);
  if (frontmatter === undefined) {
    return notFound();
  }

  const highlighter = await loadHighlighter();
  const image = frontmatter.fields.images?.find((image) => image.type === 'logo');

  return (
    <main className="flex h-full min-w-0 flex-grow flex-col">
      <div className="flex-auto pb-48">
        {image !== undefined && (
          <div className="mb-6 h-12 w-12">
            <Image
              src={`/_crypto-frontmatter/${image.path}`}
              alt={`${frontmatter.fields.symbol} Logo`}
              width={image.size.width}
              height={image.size.height}
            />
          </div>
        )}

        <ContentedProse html={frontmatter.html} />

        <FrontmatterJson content={frontmatter} highlighter={highlighter} />
      </div>
    </main>
  );
}

function FrontmatterJson(props: { content: FrontmatterContent; highlighter: Highlighter }): ReactElement {
  return (
    <div className="border-mono-800 group/json mt-8 rounded border">
      <header className="bg-mono-950 text-mono-500 relative flex items-center justify-between rounded-t border-b px-4 py-2 text-sm">
        <div>Frontmatter.json</div>
        <div>
          <button>
            <div className="block group-focus-within/json:hidden">▲</div>
            <div className="hidden group-focus-within/json:block">▼</div>
          </button>
          <span className="absolute inset-0 hidden cursor-pointer group-focus-within/json:block" />
        </div>
      </header>

      <div tabIndex={1}>
        <ShikiHighlighter
          className="max-h-40 overflow-hidden px-4 py-3 text-sm group-focus-within/json:max-h-full group-focus-within/json:overflow-x-auto"
          highlighter={props.highlighter}
          code={JSON.stringify(props.content, null, 2)}
          language="json"
        />
      </div>
    </div>
  );
}
