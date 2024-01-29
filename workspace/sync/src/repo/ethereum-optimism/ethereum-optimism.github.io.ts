import { copyFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { README } from '../../README';
import { hasFile, SyncCommand } from '../../SyncCommand';

interface Data {
  name: string;
  symbol: string;
  decimals: number;
  website?: string;
  twitter?: `@${string}`;
  tokens: Record<
    string,
    {
      address: string;
    }
  >;
}

export class EthereumOptimism extends SyncCommand<Data> {
  static override paths = [[`ethereum-optimism/ethereum-optimism.github.io`]];

  async execute(): Promise<number | void> {
    await this.walkDir('repo/data', {
      filter: (data) => !!data.tokens.ethereum,
      toPath: (data) => `../../packages/eip155-1/frontmatter/erc20/${data.tokens.ethereum.address}`,
    });
  }

  async readData(fromPath: string): Promise<Data | undefined> {
    return JSON.parse(
      await readFile(join(fromPath, 'data.json'), {
        encoding: 'utf-8',
      }),
    ) as Data;
  }

  async write(data: Data, fromPath: string, toPath: string, readme: README): Promise<void> {
    await super.write(data, fromPath, toPath, readme);

    const logoPng = join(fromPath, 'logo.png');
    if (await hasFile(logoPng)) {
      await copyFile(logoPng, join(toPath, 'icon.png'));
    }

    const logoSvg = join(fromPath, 'logo.svg');
    if (await hasFile(logoSvg)) {
      await copyFile(logoSvg, join(toPath, 'icon.svg'));
    }
  }

  async shouldWrite(data: Data, fromPath: string, toPath: string): Promise<boolean> {
    return !(await hasFile(join(toPath, 'README.md')));
  }

  toREADME(data: Data): README {
    return {
      frontmatter: {
        symbol: data.symbol,
        decimals: data.decimals,
        links: createLinks(data),
      },
      title: data.name,
    };
  }
}

function createLinks(data: Partial<Data>): README['frontmatter']['links'] {
  const links: README['frontmatter']['links'] = [];
  if (data.website) links.push({ name: 'website', url: data.website });
  if (data.twitter)
    links.push({
      name: 'twitter',
      url: `https://twitter.com/${data.twitter.replace('@', '')}`,
    });
  return links;
}
