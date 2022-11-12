import sanityClient from "@sanity/client";

/*
 * ./Transactions.json file is like generated schema in contentful ?
 * we generating API schema requests for sanity ?
 */

export const client = sanityClient({
  projectId: "z69tpipz",
  dataset: "production",
  apiVersion: "v1",
  token:
    "sksDVKVevDp1tHAKRvrVhip6EOpdouE6HWLVG5lpbJyTlvbpBoquvPnGB9EoP6rjH4EWIhfQrPQITCn6BgWmJdid7eXzMtbDCfMWyDcA7XT7cGvYAPhpMvRa8DhUZGO4Ey3lMI2tIvtNX4TKZxCfNss7WdaZEue406yGCcGbqLhoIdBnLJ4K",
  useCdn: false,
});
