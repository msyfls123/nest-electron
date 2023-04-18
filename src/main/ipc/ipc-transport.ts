import {
  IpcEventPayload,
  IpcInvokePayload,
  Transport,
} from 'src/common/interfaces/transport';

export const invokeTransport: Transport<IpcInvokePayload> = (
  handler,
  payload,
) => {
  const { channel, args, event } = payload;
  const ctx = {};
  return handler(
    {
      event,
      args,
      channel,
    },
    ctx,
  );
};

export const eventTransport: Transport<IpcEventPayload> = (
  handler,
  payload,
) => {
  const { channel, args, event } = payload;
  const ctx = {};
  handler(
    {
      args,
      channel,
      event,
    },
    ctx,
  );
};
