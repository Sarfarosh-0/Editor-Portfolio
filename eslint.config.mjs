import nextConfig from "eslint-config-next";

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "public/**"],
  },
  ...nextConfig,
];

export default eslintConfig;
