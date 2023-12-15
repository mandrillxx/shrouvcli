const receiver = createBroadcastReceiver({
  start: () => {
    Network.start.client.fire();
  },
});

clientStore.applyMiddleware(receiver.middleware);

Network.dispatch.client.connect((actions) => {
  receiver.dispatch(actions);
});
