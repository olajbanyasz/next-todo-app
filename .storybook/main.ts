import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "path";
import webpack from "webpack";

const config: StorybookConfig = {
  stories: [
    "../app/**/*.mdx",
    "../app/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    const serverMockPath = path.resolve(__dirname, "mocks/server-mock.js");
    const navMockPath = path.resolve(__dirname, "mocks/next-navigation-mock.js");

    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "../"),
        "@/lib/prisma": serverMockPath,
        "@/lib/auth": serverMockPath,
        "next/navigation": navMockPath, // Alias next/navigation
      };

      config.resolve.fallback = {
        ...config.resolve.fallback,
        dns: false,
        net: false,
        tls: false,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        os: false,
        url: false,
        vm: false,
        string_decoder: false,
        "@opentelemetry/api": false,
      };
    }

    config.plugins = [
      ...(config.plugins || []),
      new webpack.NormalModuleReplacementPlugin(
        /app\/actions\/.*/,
        serverMockPath
      ),
      new webpack.NormalModuleReplacementPlugin(
        /lib\/prisma/,
        serverMockPath
      ),
      new webpack.NormalModuleReplacementPlugin(
        /lib\/auth/,
        serverMockPath
      ),
    ];
    
    if (config.module?.rules) {
      config.module.rules = config.module.rules.filter(
        (rule) => !(rule && typeof rule === 'object' && rule.test && rule.test.toString().includes('css'))
      );
    }

    config.module?.rules?.push({
      test: /\.css$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: { 
            importLoaders: 1,
            url: false,
          },
        },
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: [
                ["@tailwindcss/postcss", {}],
              ],
            },
          },
        },
      ],
      include: path.resolve(__dirname, "../"),
    });

    return config;
  },
};
export default config;
