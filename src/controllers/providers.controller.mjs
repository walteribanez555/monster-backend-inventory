import {
  deleteProvider,
  getProvider,
  postProvider,
  putProvider,
} from "../models/providers.model.mjs";

export async function getProviders({ id }) {
  return getProvider({ id, schema: "monster" });
}

export async function postProviders({ data }) {
  return postProvider({ data, schema: "monster" });
}

export async function putProviders({ id, data }) {
  return putProvider({ id, data, schema: "monster" });
}

export async function deleteProviders({ id }) {
  return deleteProvider({ id, schema: "monster" });
}
