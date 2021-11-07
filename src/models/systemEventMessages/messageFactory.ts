import { Blob } from "buffer";
import type { createMessageOptions } from './interface'

export const createDataObject = (
  event: string,
  payload: Object,
  metadata: Object,
  options: createMessageOptions = { text: true }
): string => JSON.stringify({ event, payload, metadata });

export const createBlobMessage = (
  event: string,
  payload: Object,
  metadata: Object,
  options: createMessageOptions = { text: true }
): Blob => new Blob([createDataObject(event, payload, metadata)]);

export const createTextMessage = (
  event: string,
  payload: Object,
  metadata: Object,
  options: createMessageOptions = { text: true }
): string => createDataObject(event, payload, metadata);
