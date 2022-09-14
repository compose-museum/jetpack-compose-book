// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const config = {
  title: '你好 Compose',
  tagline: '',
  url: 'https://jetpackcompose.cn',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.svg',
  organizationName: 'compose-museum',
  projectName: 'jetpack-compose-book',
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans']
  },
  presets: [
    [
      'classic',
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/compose-museum/jetpack-compose-book/tree/master/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'daily',
          priority: 0.5,
        },
      }),
    ],
  ],

  // plugins: [
  //   [
  //   require.resolve("@cmfcmf/docusaurus-search-local"),
  //     {
  //       indexDocs: true,
  //       language: "zh"
  //     },
  //   ]
  // ],

  themeConfig:
    ({
      algolia: {
        appId: 'K4O6BUBOZJ',
        apiKey: 'e84c43272842c279d23fe39c9d8464bb',
        indexName: 'jetpackcompose'
      },
      navbar: {
        title: 'Jetpack Compose 博物馆',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'index',
            position: 'left',
            label: '文档'
          },
          {
            type: 'docSidebar',
            position: 'left',
            sidebarId: 'opensourceProject',
            label: '开源项目',
          },
          {
            href: 'https://github.com/compose-museum/jetpack-compose-book',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '社区',
            items: [
              {
                label: 'Github',
                href: 'https://github.com/compose-museum',
              },
            ],
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Jetpack Compose 博物馆, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['kotlin', 'groovy']
      },
    }),
};

module.exports = config;
