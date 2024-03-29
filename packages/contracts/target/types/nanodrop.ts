export type Nanodrop = {
  "version": "0.1.0",
  "name": "nanodrop",
  "instructions": [
    {
      "name": "setup",
      "accounts": [
        {
          "name": "programAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programData",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "coSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "nanoMachine",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "coSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "initializationParams",
          "type": {
            "defined": "InitializationParams"
          }
        }
      ]
    },
    {
      "name": "mint",
      "accounts": [
        {
          "name": "nanoMachine",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nanoMachinePdaAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treeAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "merkleTree",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMinter",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "collectionMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMasterEdition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collectionAuthorityRecord",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "coSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "bubblegumSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "bubblegumProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "logWrapper",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "compressionProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "close",
      "accounts": [
        {
          "name": "nanoMachine",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": {
              "defined": "ConfigVersion"
            }
          },
          {
            "name": "coSigner",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "nanoMachine",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": {
              "defined": "AccountVersion"
            }
          },
          {
            "name": "creator",
            "docs": [
              "The creator of the nano machine"
            ],
            "type": "publicKey"
          },
          {
            "name": "itemsRedeemed",
            "docs": [
              "Number of NFTs minted"
            ],
            "type": "u64"
          },
          {
            "name": "sellerFeeBasisPoints",
            "docs": [
              "Secondary sales royalty basis points (0-10000)"
            ],
            "type": "u16"
          },
          {
            "name": "isPrivate",
            "docs": [
              "Is this a private drop"
            ],
            "type": "bool"
          },
          {
            "name": "phases",
            "docs": [
              "Minting phases"
            ],
            "type": {
              "vec": {
                "defined": "Phase"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitializationParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sellerFeeBasisPoints",
            "docs": [
              "Secondary sales royalty basis points (0-10000)"
            ],
            "type": "u16"
          },
          {
            "name": "isPrivate",
            "docs": [
              "Is this a private drop"
            ],
            "type": "bool"
          },
          {
            "name": "phases",
            "docs": [
              "Minting phases"
            ],
            "type": {
              "vec": {
                "defined": "Phase"
              }
            }
          }
        ]
      }
    },
    {
      "name": "Phase",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startDate",
            "type": "i64"
          },
          {
            "name": "index",
            "type": "u32"
          },
          {
            "name": "nftName",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "ConfigVersion",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "V1"
          }
        ]
      }
    },
    {
      "name": "AccountVersion",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "V1"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "ExceededLengthError",
      "msg": "Value longer than expected maximum value"
    },
    {
      "code": 6001,
      "name": "Unauthorized",
      "msg": "User is not permitted to mint"
    },
    {
      "code": 6002,
      "name": "NoMintPhaseFound",
      "msg": "At least one mint phase is required"
    },
    {
      "code": 6003,
      "name": "InvalidPhaseDates",
      "msg": "Invalid phase dates"
    },
    {
      "code": 6004,
      "name": "FeeBasisPointTooHigh",
      "msg": "Fee basis point cannot exceed 10000"
    },
    {
      "code": 6005,
      "name": "InstructionBuilderFailed",
      "msg": "Instruction could not be created"
    },
    {
      "code": 6006,
      "name": "MintHasNotStarted",
      "msg": "Mint has not started or has already ended!"
    },
    {
      "code": 6007,
      "name": "CollectionKeyMismatch",
      "msg": "Collection public key mismatch"
    },
    {
      "code": 6008,
      "name": "NoPriceUpdatesAfterMintOrGoLiveDate",
      "msg": "Cannot update price after mint has started or begun"
    },
    {
      "code": 6009,
      "name": "InvalidPayerAta",
      "msg": "Invalid payer ATA"
    },
    {
      "code": 6010,
      "name": "InvalidAuthorityAta",
      "msg": "Invalid Nano Machine authority ATA"
    },
    {
      "code": 6011,
      "name": "InvalidPaymentMint",
      "msg": "Invalid payment mint"
    },
    {
      "code": 6012,
      "name": "UnableToCreateAuthorityAta",
      "msg": "Unable to create Nano Machine authority ATA"
    },
    {
      "code": 6013,
      "name": "InvalidCollectionUpdateAuthority",
      "msg": "Collection Update Authority is invalid"
    }
  ]
};

export const IDL: Nanodrop = {
  "version": "0.1.0",
  "name": "nanodrop",
  "instructions": [
    {
      "name": "setup",
      "accounts": [
        {
          "name": "programAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "program",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programData",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "coSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "nanoMachine",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creator",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "coSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "initializationParams",
          "type": {
            "defined": "InitializationParams"
          }
        }
      ]
    },
    {
      "name": "mint",
      "accounts": [
        {
          "name": "nanoMachine",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nanoMachinePdaAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treeAuthority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "merkleTree",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMinter",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "collectionMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionMasterEdition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collectionAuthorityRecord",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "coSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "bubblegumSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "bubblegumProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "logWrapper",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "compressionProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "close",
      "accounts": [
        {
          "name": "nanoMachine",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": {
              "defined": "ConfigVersion"
            }
          },
          {
            "name": "coSigner",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "nanoMachine",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": {
              "defined": "AccountVersion"
            }
          },
          {
            "name": "creator",
            "docs": [
              "The creator of the nano machine"
            ],
            "type": "publicKey"
          },
          {
            "name": "itemsRedeemed",
            "docs": [
              "Number of NFTs minted"
            ],
            "type": "u64"
          },
          {
            "name": "sellerFeeBasisPoints",
            "docs": [
              "Secondary sales royalty basis points (0-10000)"
            ],
            "type": "u16"
          },
          {
            "name": "isPrivate",
            "docs": [
              "Is this a private drop"
            ],
            "type": "bool"
          },
          {
            "name": "phases",
            "docs": [
              "Minting phases"
            ],
            "type": {
              "vec": {
                "defined": "Phase"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitializationParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sellerFeeBasisPoints",
            "docs": [
              "Secondary sales royalty basis points (0-10000)"
            ],
            "type": "u16"
          },
          {
            "name": "isPrivate",
            "docs": [
              "Is this a private drop"
            ],
            "type": "bool"
          },
          {
            "name": "phases",
            "docs": [
              "Minting phases"
            ],
            "type": {
              "vec": {
                "defined": "Phase"
              }
            }
          }
        ]
      }
    },
    {
      "name": "Phase",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "startDate",
            "type": "i64"
          },
          {
            "name": "index",
            "type": "u32"
          },
          {
            "name": "nftName",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "ConfigVersion",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "V1"
          }
        ]
      }
    },
    {
      "name": "AccountVersion",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "V1"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "ExceededLengthError",
      "msg": "Value longer than expected maximum value"
    },
    {
      "code": 6001,
      "name": "Unauthorized",
      "msg": "User is not permitted to mint"
    },
    {
      "code": 6002,
      "name": "NoMintPhaseFound",
      "msg": "At least one mint phase is required"
    },
    {
      "code": 6003,
      "name": "InvalidPhaseDates",
      "msg": "Invalid phase dates"
    },
    {
      "code": 6004,
      "name": "FeeBasisPointTooHigh",
      "msg": "Fee basis point cannot exceed 10000"
    },
    {
      "code": 6005,
      "name": "InstructionBuilderFailed",
      "msg": "Instruction could not be created"
    },
    {
      "code": 6006,
      "name": "MintHasNotStarted",
      "msg": "Mint has not started or has already ended!"
    },
    {
      "code": 6007,
      "name": "CollectionKeyMismatch",
      "msg": "Collection public key mismatch"
    },
    {
      "code": 6008,
      "name": "NoPriceUpdatesAfterMintOrGoLiveDate",
      "msg": "Cannot update price after mint has started or begun"
    },
    {
      "code": 6009,
      "name": "InvalidPayerAta",
      "msg": "Invalid payer ATA"
    },
    {
      "code": 6010,
      "name": "InvalidAuthorityAta",
      "msg": "Invalid Nano Machine authority ATA"
    },
    {
      "code": 6011,
      "name": "InvalidPaymentMint",
      "msg": "Invalid payment mint"
    },
    {
      "code": 6012,
      "name": "UnableToCreateAuthorityAta",
      "msg": "Unable to create Nano Machine authority ATA"
    },
    {
      "code": 6013,
      "name": "InvalidCollectionUpdateAuthority",
      "msg": "Collection Update Authority is invalid"
    }
  ]
};
