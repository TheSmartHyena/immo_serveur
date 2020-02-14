// Setting routes var to be used dynamically
const routes = {
  index: "/",
  query: "/query",

  default: "/"
};

// Setting triggers for middlewares
const checkSessionTriggers = new Set();
checkSessionTriggers.add(routes.index);
checkSessionTriggers.add(routes.query);

const checkRolesTriggers = new Set();
checkRolesTriggers.add(routes.index);
checkRolesTriggers.add(routes.query);

// for routes, sets allowed group for each routes
// 1 admin, 2 user lambda
const routeAllowedGroup = new Map();
routeAllowedGroup.set(routes.stats, new Set([1, 2]));
routeAllowedGroup.set(routes.users, new Set([1, 2]));

exports.routes = routes;
exports.checkSessionTriggers = checkSessionTriggers;
exports.checkRolesTriggers = checkRolesTriggers;
exports.routeAllowedGroup = routeAllowedGroup;
