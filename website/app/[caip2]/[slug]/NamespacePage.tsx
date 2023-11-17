import { clsx } from 'clsx';
import { getIndex } from 'crypto-frontmatter';
import { Metadata } from 'next';
import Link from 'next/link';
import { ReactElement } from 'react';

export async function generateMetadata(caip2: string, namespace: string): Promise<Metadata> {
  const title = `${caip2}/${namespace}`;

  return {
    title: title,
    openGraph: {
      title: title,
      url: `${process.env.BASE_URL}/${caip2}/${namespace}`,
      siteName: `Crypto Frontmatter`,
      locale: 'en_US',
      type: 'article',
    },
  };
}

export async function Page(props: { caip2: string; namespace: string }): Promise<ReactElement> {
  const index = await getIndex(props.caip2, props.namespace);
  return (
    <main>
      <div className="mx-auto w-full overflow-x-auto pb-48">
        <table
          className={clsx(
            'min-w-full',
            'whitespace-nowrap text-left lg:whitespace-normal',
            '[&_tr_:is(th,td)]:font-normal',
            '[&_tr_:is(th,td)]:px-2 [&_tr_:is(th,td)]:py-2.5',
            'divide-mono-900 divide-y',
            '[&_tbody]:divide-mono-900 [&_tbody]:divide-y',
          )}
        >
          <thead className="text-mono-600 text-sm">
            <tr>
              <th>CAIP19</th>
              <th>SYMBOL</th>
              <th>DECIMALS</th>
              <th>TITLE</th>
            </tr>
          </thead>

          <tbody>
            {index.map((item) => (
              <tr key={item.path} className="text-mono-200 hover:bg-mono-900 relative cursor-pointer">
                <td>
                  <Link href={`/${item.path}`}>
                    {item.path}
                    <div className="absolute inset-0" />
                  </Link>
                </td>
                <td>{item.fields.symbol}</td>
                <td>{item.fields.decimals}</td>
                <td>{item.fields.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
