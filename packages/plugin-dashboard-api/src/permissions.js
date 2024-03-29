module.exports = {
  dashboardz: {
    name: "dashboardz",
    description: "Dashboardz",
    actions: [
      {
        name: "dashboardsAll",
        description: "All",
        use: [
          "showDashboards",
          "dashboardAdd",
          "dashboardEdit",
          "dashboardRemove",
          "dashboardItemAdd",
          "dashboardItemEdit",
          "dashboardItemRemove",
        ],
      },
      {
        name: "dashboardAdd",
        description: "Add dashboard",
      },
      {
        name: "dashboardEdit",
        description: "Edit dashboard",
      },
      {
        name: "dashboardRemove",
        description: "Remove dashboard",
      },
      {
        name: "dashboardItemAdd",
        description: "Add dashboard item",
      },
      {
        name: "dashboardItemEdit",
        description: "Edit dashboard item",
      },
      {
        name: "dashboardItemRemove",
        description: "Remove dashboard item",
      },
      {
        name: "showDashboards",
        description: "Show dashboards",
      },
    ],
  },
};