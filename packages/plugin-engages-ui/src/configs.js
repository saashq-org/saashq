module.exports = {
  srcDir: __dirname,
  name: "engages",
  port: 3001,
  exposes: {
    "./routes": "./src/routes.tsx",
  },
  routes: {
    url: "http://localhost:3001/remoteEntry.js",
    scope: "engages",
    module: "./routes",
  },
  menus: [
    {
      text: "XM Broadcast",
      url: "/campaigns",
      icon: "icon-megaphone",
      location: "mainNavigation",
      permission: "showEngagesMessages",
    },
    {
      text: "XM Broadcast settings",
      to: "/settings/campaign-configs",
      image: "/images/icons/saashq-08.svg",
      location: "settings",
      scope: "engages",
      action: "engagesAll",
      permissions: ["showEngagesMessages"],
    },
  ],
};
