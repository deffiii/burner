export const DAPP = "DhhMHW3W1VkCDB9E11DGHbRNsdfr17zfJ7ovQRFcLp4P";

export type Burner = {
  version: "0.1.0";
  name: "burner";
  instructions: [
    {
      name: "createFurnace";
      accounts: [
        {
          name: "furnace";
          isMut: true;
          isSigner: true;
        },
        {
          name: "furnaceAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rewardMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rewardVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "coalMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "rewardFrom";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "lifetime";
          type: "u64";
        }
      ];
    },
    {
      name: "burn";
      accounts: [
        {
          name: "furnace";
          isMut: true;
          isSigner: false;
        },
        {
          name: "coalMint";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stoker";
          isMut: true;
          isSigner: true;
        },
        {
          name: "stokerCoalFrom";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "clock";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "claim";
      accounts: [
        {
          name: "furnace";
          isMut: false;
          isSigner: false;
        },
        {
          name: "furnaceAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rewardMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rewardVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "stoker";
          isMut: false;
          isSigner: false;
        },
        {
          name: "stokerRewardAta";
          isMut: true;
          isSigner: false;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "associatedTokenProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "clock";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "furnace";
      type: {
        kind: "struct";
        fields: [
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "rewardVaultBump";
            type: "u8";
          },
          {
            name: "rewardMint";
            type: "publicKey";
          },
          {
            name: "coalMint";
            type: "publicKey";
          },
          {
            name: "lifetime";
            type: "u64";
          },
          {
            name: "lastBurn";
            type: "u64";
          },
          {
            name: "lastStoker";
            type: "publicKey";
          }
        ];
      };
    }
  ];
  events: [
    {
      name: "CreateFurnaceEvent";
      fields: [
        {
          name: "furnace";
          type: "publicKey";
          index: false;
        },
        {
          name: "amount";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "BurnEvent";
      fields: [
        {
          name: "furnace";
          type: "publicKey";
          index: false;
        },
        {
          name: "stoker";
          type: "publicKey";
          index: false;
        },
        {
          name: "slot";
          type: "u64";
          index: false;
        }
      ];
    },
    {
      name: "ClaimEvent";
      fields: [
        {
          name: "furnace";
          type: "publicKey";
          index: false;
        },
        {
          name: "stoker";
          type: "publicKey";
          index: false;
        }
      ];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "Unauthorized";
      msg: "You are not authorized to perform this action";
    },
    {
      code: 6001;
      name: "FurnaceCompleted";
      msg: "Furnace is already completed";
    },
    {
      code: 6002;
      name: "FurnaceNotCompleted";
      msg: "Furnace is not completed";
    }
  ];
};

export const IDL: Burner = {
  version: "0.1.0",
  name: "burner",
  instructions: [
    {
      name: "createFurnace",
      accounts: [
        {
          name: "furnace",
          isMut: true,
          isSigner: true,
        },
        {
          name: "furnaceAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rewardMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rewardVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "coalMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "rewardFrom",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "lifetime",
          type: "u64",
        },
      ],
    },
    {
      name: "burn",
      accounts: [
        {
          name: "furnace",
          isMut: true,
          isSigner: false,
        },
        {
          name: "coalMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stoker",
          isMut: true,
          isSigner: true,
        },
        {
          name: "stokerCoalFrom",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "claim",
      accounts: [
        {
          name: "furnace",
          isMut: false,
          isSigner: false,
        },
        {
          name: "furnaceAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rewardMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rewardVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stoker",
          isMut: false,
          isSigner: false,
        },
        {
          name: "stokerRewardAta",
          isMut: true,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "associatedTokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "furnace",
      type: {
        kind: "struct",
        fields: [
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "rewardVaultBump",
            type: "u8",
          },
          {
            name: "rewardMint",
            type: "publicKey",
          },
          {
            name: "coalMint",
            type: "publicKey",
          },
          {
            name: "lifetime",
            type: "u64",
          },
          {
            name: "lastBurn",
            type: "u64",
          },
          {
            name: "lastStoker",
            type: "publicKey",
          },
        ],
      },
    },
  ],
  events: [
    {
      name: "CreateFurnaceEvent",
      fields: [
        {
          name: "furnace",
          type: "publicKey",
          index: false,
        },
        {
          name: "amount",
          type: "u64",
          index: false,
        },
      ],
    },
    {
      name: "BurnEvent",
      fields: [
        {
          name: "furnace",
          type: "publicKey",
          index: false,
        },
        {
          name: "stoker",
          type: "publicKey",
          index: false,
        },
        {
          name: "slot",
          type: "u64",
          index: false,
        },
      ],
    },
    {
      name: "ClaimEvent",
      fields: [
        {
          name: "furnace",
          type: "publicKey",
          index: false,
        },
        {
          name: "stoker",
          type: "publicKey",
          index: false,
        },
      ],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "Unauthorized",
      msg: "You are not authorized to perform this action",
    },
    {
      code: 6001,
      name: "FurnaceCompleted",
      msg: "Furnace is already completed",
    },
    {
      code: 6002,
      name: "FurnaceNotCompleted",
      msg: "Furnace is not completed",
    },
  ],
};
