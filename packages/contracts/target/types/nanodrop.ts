export type Nanodrop = {
  "version": "0.1.0",
  "name": "nanodrop",
  "instructions": [
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
          "isSigner": true
        },
        {
          "name": "collectionMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collectionMasterEdition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collectionAuthorityRecord",
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
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "merkleTree",
          "isMut": false,
          "isSigner": false
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
          "name": "nanoMachineAuthority",
          "isMut": true,
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
            "name": "collectionMint",
            "docs": [
              "The collection mint for this nano machine"
            ],
            "type": "publicKey"
          },
          {
            "name": "backgroundImageUri",
            "docs": [
              "background image for the collection mint page"
            ],
            "type": "string"
          },
          {
            "name": "itemsRedeemed",
            "docs": [
              "Number of NFTs minted"
            ],
            "type": "u64"
          },
          {
            "name": "symbol",
            "docs": [
              "Symbol for the NFTs in this collection"
            ],
            "type": "string"
          },
          {
            "name": "sellerFeeBasisPoints",
            "docs": [
              "Secondary sales royalty basis points (0-10000)"
            ],
            "type": "u16"
          },
          {
            "name": "merkleTree",
            "docs": [
              "Merkle tree for compression"
            ],
            "type": "publicKey"
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
            "name": "symbol",
            "docs": [
              "Symbol for the asset"
            ],
            "type": "string"
          },
          {
            "name": "sellerFeeBasisPoints",
            "docs": [
              "Secondary sales royalty basis points (0-10000)"
            ],
            "type": "u16"
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
          },
          {
            "name": "backgroundImageUri",
            "docs": [
              "background image for the collection mint page"
            ],
            "type": "string"
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
            "name": "endDate",
            "type": "i64"
          },
          {
            "name": "metadataUri",
            "type": "string"
          },
          {
            "name": "nftName",
            "type": "string"
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
      "name": "NoMintPhaseFound",
      "msg": "At least one mint phase is required"
    },
    {
      "code": 6002,
      "name": "InvalidPhaseDates",
      "msg": "Invalid phase dates"
    },
    {
      "code": 6003,
      "name": "FeeBasisPointTooHigh",
      "msg": "Fee basis point cannot exceed 10000"
    },
    {
      "code": 6004,
      "name": "InstructionBuilderFailed",
      "msg": "Instruction could not be created"
    },
    {
      "code": 6005,
      "name": "MintHasNotStarted",
      "msg": "Mint has not started or has already ended!"
    },
    {
      "code": 6006,
      "name": "CollectionKeyMismatch",
      "msg": "Collection public key mismatch"
    },
    {
      "code": 6007,
      "name": "NoPriceUpdatesAfterMintOrGoLiveDate",
      "msg": "Cannot update price after mint has started or begun"
    },
    {
      "code": 6008,
      "name": "InvalidPayerAta",
      "msg": "Invalid payer ATA"
    },
    {
      "code": 6009,
      "name": "InvalidAuthorityAta",
      "msg": "Invalid Nano Machine authority ATA"
    },
    {
      "code": 6010,
      "name": "InvalidPaymentMint",
      "msg": "Invalid payment mint"
    },
    {
      "code": 6011,
      "name": "UnableToCreateAuthorityAta",
      "msg": "Unable to create Nano Machine authority ATA"
    }
  ]
};

export const IDL: Nanodrop = {
  "version": "0.1.0",
  "name": "nanodrop",
  "instructions": [
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
          "isSigner": true
        },
        {
          "name": "collectionMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collectionMetadata",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collectionMasterEdition",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "collectionAuthorityRecord",
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
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "merkleTree",
          "isMut": false,
          "isSigner": false
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
          "name": "nanoMachineAuthority",
          "isMut": true,
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
            "name": "collectionMint",
            "docs": [
              "The collection mint for this nano machine"
            ],
            "type": "publicKey"
          },
          {
            "name": "backgroundImageUri",
            "docs": [
              "background image for the collection mint page"
            ],
            "type": "string"
          },
          {
            "name": "itemsRedeemed",
            "docs": [
              "Number of NFTs minted"
            ],
            "type": "u64"
          },
          {
            "name": "symbol",
            "docs": [
              "Symbol for the NFTs in this collection"
            ],
            "type": "string"
          },
          {
            "name": "sellerFeeBasisPoints",
            "docs": [
              "Secondary sales royalty basis points (0-10000)"
            ],
            "type": "u16"
          },
          {
            "name": "merkleTree",
            "docs": [
              "Merkle tree for compression"
            ],
            "type": "publicKey"
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
            "name": "symbol",
            "docs": [
              "Symbol for the asset"
            ],
            "type": "string"
          },
          {
            "name": "sellerFeeBasisPoints",
            "docs": [
              "Secondary sales royalty basis points (0-10000)"
            ],
            "type": "u16"
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
          },
          {
            "name": "backgroundImageUri",
            "docs": [
              "background image for the collection mint page"
            ],
            "type": "string"
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
            "name": "endDate",
            "type": "i64"
          },
          {
            "name": "metadataUri",
            "type": "string"
          },
          {
            "name": "nftName",
            "type": "string"
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
      "name": "NoMintPhaseFound",
      "msg": "At least one mint phase is required"
    },
    {
      "code": 6002,
      "name": "InvalidPhaseDates",
      "msg": "Invalid phase dates"
    },
    {
      "code": 6003,
      "name": "FeeBasisPointTooHigh",
      "msg": "Fee basis point cannot exceed 10000"
    },
    {
      "code": 6004,
      "name": "InstructionBuilderFailed",
      "msg": "Instruction could not be created"
    },
    {
      "code": 6005,
      "name": "MintHasNotStarted",
      "msg": "Mint has not started or has already ended!"
    },
    {
      "code": 6006,
      "name": "CollectionKeyMismatch",
      "msg": "Collection public key mismatch"
    },
    {
      "code": 6007,
      "name": "NoPriceUpdatesAfterMintOrGoLiveDate",
      "msg": "Cannot update price after mint has started or begun"
    },
    {
      "code": 6008,
      "name": "InvalidPayerAta",
      "msg": "Invalid payer ATA"
    },
    {
      "code": 6009,
      "name": "InvalidAuthorityAta",
      "msg": "Invalid Nano Machine authority ATA"
    },
    {
      "code": 6010,
      "name": "InvalidPaymentMint",
      "msg": "Invalid payment mint"
    },
    {
      "code": 6011,
      "name": "UnableToCreateAuthorityAta",
      "msg": "Unable to create Nano Machine authority ATA"
    }
  ]
};
