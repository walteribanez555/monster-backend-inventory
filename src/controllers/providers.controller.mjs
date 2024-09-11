import {
  deleteProvider,
  getProvider,
  postProvider,
  putProvider,
} from "../models/providers.model.mjs";

export async function getProviders({ id }) {
  return getProvider({ id, schema: "redcard" });
}

export async function postProviders({ data }) {
  return postProvider({ data, schema: "redcard" });
}

export async function putProviders({ id, data }) {
  return putProvider({ id, data, schema: "redcard" });
}

export async function deleteProviders({ id }) {
  return deleteProvider({ id, schema: "redcard" });
}
