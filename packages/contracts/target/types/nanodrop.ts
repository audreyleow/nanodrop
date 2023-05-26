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
          "name": "authority",
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
          "name": "paymentMint",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sysvarInstructions",
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
          "name": "nanoMachineAuthorityAta",
          "isMut": true,
          "isSigner": true,
          "isOptional": true
        },
        {
          "name": "paymentMint",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
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
          "name": "nftMinterAta",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
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
          "name": "tokenProgram",
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
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "recentSlothashes",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "update",
      "accounts": [
        {
          "name": "nanoMachine",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "paymentMint",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "updateParams",
          "type": {
            "defined": "UpdateParams"
          }
        }
      ]
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
          "name": "authority",
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
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "collectionMint",
            "type": "publicKey"
          },
          {
            "name": "baseName",
            "docs": [
              "base name for each NFT"
            ],
            "type": "string"
          },
          {
            "name": "baseUri",
            "docs": [
              "nft assets base uri"
            ],
            "type": "string"
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
            "type": "u64"
          },
          {
            "name": "itemsAvailable",
            "type": "u64"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "symbol",
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
            "name": "creators",
            "docs": [
              "List of creators"
            ],
            "type": {
              "vec": {
                "defined": "Creator"
              }
            }
          },
          {
            "name": "goLiveDate",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "paymentMint",
            "type": "publicKey"
          },
          {
            "name": "merkleTree",
            "type": "publicKey"
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
            "name": "itemsAvailable",
            "docs": [
              "Number of assets available"
            ],
            "type": "u64"
          },
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
            "name": "creators",
            "docs": [
              "List of creators"
            ],
            "type": {
              "vec": {
                "defined": "Creator"
              }
            }
          },
          {
            "name": "baseName",
            "docs": [
              "base name for each NFT"
            ],
            "type": "string"
          },
          {
            "name": "baseUri",
            "docs": [
              "nft assets base uri"
            ],
            "type": "string"
          },
          {
            "name": "backgroundImageUri",
            "docs": [
              "background image for the collection mint page"
            ],
            "type": "string"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "goLiveDate",
            "type": {
              "option": "i64"
            }
          }
        ]
      }
    },
    {
      "name": "UpdateParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "goLiveDate",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "price",
            "type": {
              "option": "u64"
            }
          }
        ]
      }
    },
    {
      "name": "Creator",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "publicKey"
          },
          {
            "name": "verified",
            "type": "bool"
          },
          {
            "name": "percentageShare",
            "type": "u8"
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
      "name": "TooManyCreators",
      "msg": "Can only provide up to 4 creators"
    },
    {
      "code": 6002,
      "name": "FeeBasisPointTooHigh",
      "msg": "Fee basis point cannot exceed 10000"
    },
    {
      "code": 6003,
      "name": "InstructionBuilderFailed",
      "msg": "Instruction could not be created"
    },
    {
      "code": 6004,
      "name": "NanoMachineEmpty",
      "msg": "Nano machine is empty!"
    },
    {
      "code": 6005,
      "name": "NanoMachineNotLive",
      "msg": "Nano machine is not live!"
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
          "name": "authority",
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
          "name": "paymentMint",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "sysvarInstructions",
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
          "name": "nanoMachineAuthorityAta",
          "isMut": true,
          "isSigner": true,
          "isOptional": true
        },
        {
          "name": "paymentMint",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
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
          "name": "nftMinterAta",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
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
          "name": "tokenProgram",
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
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "recentSlothashes",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "update",
      "accounts": [
        {
          "name": "nanoMachine",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "paymentMint",
          "isMut": false,
          "isSigner": false,
          "isOptional": true
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "updateParams",
          "type": {
            "defined": "UpdateParams"
          }
        }
      ]
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
          "name": "authority",
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
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "collectionMint",
            "type": "publicKey"
          },
          {
            "name": "baseName",
            "docs": [
              "base name for each NFT"
            ],
            "type": "string"
          },
          {
            "name": "baseUri",
            "docs": [
              "nft assets base uri"
            ],
            "type": "string"
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
            "type": "u64"
          },
          {
            "name": "itemsAvailable",
            "type": "u64"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "symbol",
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
            "name": "creators",
            "docs": [
              "List of creators"
            ],
            "type": {
              "vec": {
                "defined": "Creator"
              }
            }
          },
          {
            "name": "goLiveDate",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "paymentMint",
            "type": "publicKey"
          },
          {
            "name": "merkleTree",
            "type": "publicKey"
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
            "name": "itemsAvailable",
            "docs": [
              "Number of assets available"
            ],
            "type": "u64"
          },
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
            "name": "creators",
            "docs": [
              "List of creators"
            ],
            "type": {
              "vec": {
                "defined": "Creator"
              }
            }
          },
          {
            "name": "baseName",
            "docs": [
              "base name for each NFT"
            ],
            "type": "string"
          },
          {
            "name": "baseUri",
            "docs": [
              "nft assets base uri"
            ],
            "type": "string"
          },
          {
            "name": "backgroundImageUri",
            "docs": [
              "background image for the collection mint page"
            ],
            "type": "string"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "goLiveDate",
            "type": {
              "option": "i64"
            }
          }
        ]
      }
    },
    {
      "name": "UpdateParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "goLiveDate",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "price",
            "type": {
              "option": "u64"
            }
          }
        ]
      }
    },
    {
      "name": "Creator",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "publicKey"
          },
          {
            "name": "verified",
            "type": "bool"
          },
          {
            "name": "percentageShare",
            "type": "u8"
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
      "name": "TooManyCreators",
      "msg": "Can only provide up to 4 creators"
    },
    {
      "code": 6002,
      "name": "FeeBasisPointTooHigh",
      "msg": "Fee basis point cannot exceed 10000"
    },
    {
      "code": 6003,
      "name": "InstructionBuilderFailed",
      "msg": "Instruction could not be created"
    },
    {
      "code": 6004,
      "name": "NanoMachineEmpty",
      "msg": "Nano machine is empty!"
    },
    {
      "code": 6005,
      "name": "NanoMachineNotLive",
      "msg": "Nano machine is not live!"
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
