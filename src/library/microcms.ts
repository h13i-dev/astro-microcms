import { createClient } from "microcms-js-sdk";
import type {
  MicroCMSImage,
  MicroCMSContentId,
  MicroCMSDate,
  MicroCMSQueries,
} from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

export interface Category {
  name: string;
}
export type CategoryContent = Category & MicroCMSContentId & MicroCMSDate;

export interface Tag {
  name: string;
}
export type TagContent = Tag & MicroCMSContentId & MicroCMSDate;

export interface News {
  title: string;
  description: string;
  content: string;
  category: CategoryContent;
  tags: TagContent[];
  thumbnail?: MicroCMSImage;
}
export type NewsContent = News & MicroCMSContentId & MicroCMSDate;

/**
 * microCMSリッチエディタが出力する `data-custom-class-value="xxx"` を
 * `class="xxx"` に変換し、CSS側で `.xxx` セレクタを使えるようにする。
 * 既存の class 属性がある場合は値を末尾に追記する。
 */
export const transformRichText = (html: string): string => {
  if (!html) return html;
  return html.replace(
    /<([a-zA-Z][\w-]*)([^>]*?)\sdata-custom-class-value="([^"]+)"([^>]*)>/g,
    (_match, tag, before, value, after) => {
      const rest = `${before}${after}`;
      const classMatch = rest.match(/\sclass="([^"]*)"/);
      if (classMatch) {
        const merged = `${classMatch[1]} ${value}`.trim();
        const replaced = rest.replace(/\sclass="[^"]*"/, ` class="${merged}"`);
        return `<${tag}${replaced}>`;
      }
      return `<${tag}${rest} class="${value}">`;
    },
  );
};

export const getNewsList = async (queries?: MicroCMSQueries) =>
  client.getList<News>({ endpoint: "news", queries });

export const getNewsDetail = async (
  contentId: string,
  queries?: MicroCMSQueries,
) =>
  client.getListDetail<News>({ endpoint: "news", contentId, queries });

export const getTagsList = async (queries?: MicroCMSQueries) =>
  client.getList<Tag>({ endpoint: "tag", queries });

export const getTagDetail = async (
  contentId: string,
  queries?: MicroCMSQueries,
) =>
  client.getListDetail<Tag>({ endpoint: "tag", contentId, queries });

export const getCategoriesList = async (queries?: MicroCMSQueries) =>
  client.getList<Category>({ endpoint: "category", queries });

export const getCategoryDetail = async (
  contentId: string,
  queries?: MicroCMSQueries,
) =>
  client.getListDetail<Category>({ endpoint: "category", contentId, queries });

export interface Info {
  title: string;
  link?: string;
  content?: string;
}
export type InfoContent = Info & MicroCMSContentId & MicroCMSDate;

export const getInfoList = async (queries?: MicroCMSQueries) =>
  client.getList<Info>({ endpoint: "info", queries });

export const getInfoDetail = async (
  contentId: string,
  queries?: MicroCMSQueries,
) =>
  client.getListDetail<Info>({ endpoint: "info", contentId, queries });
