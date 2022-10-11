export const userSchema = {
  name: "users",
  title: "Users",
  type: "document",
  fields: [
    {
      name: "walletAddress",
      title: "Wallet Address",
      type: "string",
    },
    {
      name: "userName",
      title: "User Name",
      type: "string",
    },
    {
      name: "transactions",
      title: "Transactions",
      type: "array", // relaction with 'transactionSchema' and 'usersSchema'
      of: [
        {
          type: "reference", // relation with ...
          to: [{ type: "transactions" }], // with Whom ? 'transactions' schema
        },
      ],
    },
  ],
};
