import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'شورای صنفی دانشجویان',
  tagline: ' در دست ساخت ⏱️',
  favicon: 'img/maini_colors.png',

  future: {
    v4: true,
  },

  url: 'https://senfi-sharif.ir',
  baseUrl: '/',

  // url: 'https://aryatrb.github.io',
  // baseUrl: '/senfi.sharif.ir/',

  organizationName: 'aryatrb',
  projectName: 'senfi.sharif.ir',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'fa',
    locales: ['fa'],
    localeConfigs: {
      fa: {
        label: 'فارسی',
        direction: 'rtl',
      },
    },
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: 'https://github.com/senfi-sharif/senfi-sharif.ir/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/senfi-sharif/senfi-sharif.ir/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/maini_colors.png',
    navbar: {
      title: 'شورای صنفی دانشجویان دانشگاه صنعتی شریف',
      logo: {
        alt: 'My Site Logo',
        src: 'img/maini_colors.png',
      },
      items: [
        {to: '/tree', label: 'شجره‌نامه', position: 'left'},
        {to: '/publications', label: 'نشریه شورا', position: 'left'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Telegram channels',
          items: [
            {
              label: 'sharif_senfi@',
              to: 'https://t.me/sharif_senfi',
            },
            {
              label: 'sharif_senfi_media@',
              to: 'https://t.me/sharif_senfi_media',
            },
          ],
        },
        {
          title: 'Telegram Groups',
          items: [
            {
              label: 'مسائل صنفی دانشگاه شریف',
              href: 'https://t.me/shora_sharif',
            }
          ],
        },
        {
          title: 'تماس با ما',
          items: [
            {
              label: 'پشتیبانی تلگرام',
              to: 'https://t.me/sharif_senfi_dabir',
            },
            {
              label: 'stu.senfi@sharif.edu',
              href: 'mailto:stu.senfi@sharif.edu',
            },
          ],
        },
      ],
      copyright: `کپی‌رایت © ${new Date().getFullYear()} آریا ترابی. ساخته‌شده با داکوساروس.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
