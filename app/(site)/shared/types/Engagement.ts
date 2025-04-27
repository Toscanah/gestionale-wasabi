export type CommonPayload = {
  textAbove?: string;
  textBelow?: string;
};

export type QrPayload = CommonPayload & {
  url: string;
};

export type ImagePayload = CommonPayload & {
  imageUrl: string;
};
