module.exports = {
    extends: "next/core-web-vitals",
    rules: {
      // Disable some of the problematic rules for now
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "warn"
    }
  };