const broadcaster = createBroadcaster({
  producers: slices,
  dispatch: (player, actions) => {
    Network.dispatch.server.fire(player, actions);
  },
});

Network.start.server.connect((player) => {
  broadcaster.start(player);
});

store.applyMiddleware(broadcaster.middleware);
