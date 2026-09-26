// craco.config.js
const path = require("path");
require("dotenv").config();

// Vercel par build ke time CI=1 hota hai, jisse CRA chhoti-chhoti eslint warnings ko
// error maan kar build fail kar deta hai. Isliye yahan band kar diya.
process.env.CI = "false";

// Agar REACT_APP_SITE_URL set nahi hai to Vercel ka production domain use karo
// (canonical URL, Open Graph, sitemap.xml aur robots.txt ke liye).
if (!process.env.REACT_APP_SITE_URL && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  process.env.REACT_APP_SITE_URL = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
}

require("./scripts/generate-seo-files");

// Project me webpack-dev-server v5 hai, par react-scripts v4 wale options bhejta hai.
// Ye function purane options ko v5 ke format me badal deta hai (yarn start ke liye zaruri).
function makeDevServerV5Compatible(devServerConfig) {
  const { https, onAfterSetupMiddleware, onBeforeSetupMiddleware, onListening, setupMiddlewares, ...compatibleConfig } = devServerConfig;

  compatibleConfig.server = typeof https === "object" ? { type: "https", options: https } : https ? "https" : "http";

  if (onBeforeSetupMiddleware || setupMiddlewares) {
    compatibleConfig.setupMiddlewares = (middlewares, devServer) => {
      if (onBeforeSetupMiddleware) onBeforeSetupMiddleware(devServer);
      return setupMiddlewares ? setupMiddlewares(middlewares, devServer) : middlewares;
    };
  }

  compatibleConfig.onListening = (devServer) => {
    devServer.close ??= (callback) => devServer.stopCallback(callback);
    if (onListening) onListening(devServer);
    if (onAfterSetupMiddleware) onAfterSetupMiddleware(devServer);
  };

  return compatibleConfig;
}

module.exports = {
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  devServer: (devServerConfig) => makeDevServerV5Compatible(devServerConfig),
};
