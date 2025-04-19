export type CommonPayload = {
  testAbove?: string;
  testBelow?: string;
};

export type QrPayload = CommonPayload & {
  url: string;
};

export type ImagePayload = CommonPayload & {
  imageUrl: string;
};
