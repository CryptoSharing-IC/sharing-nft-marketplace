import Array "mo:base/Array";
import Bool "mo:base/Bool";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Nat16 "mo:base/Nat16";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Nat8 "mo:base/Nat8";
import Option "mo:base/Option";
import Principal "mo:base/Principal";

import Types "./Types";

shared actor class NFT(custodian: Principal, init : Types.NonFungibleToken) = Self {
  stable var transactionId: Types.TransactionId = 0;
  stable var nfts = List.nil<Types.Nft>();
  stable var custodians = List.make<Principal>(custodian);
  stable var _logo : Types.LogoResult = init.logo;
  stable var _name : Text = init.name;
  stable var _symbol : Text = init.symbol;
  stable var _maxLimit : Nat64 = init.maxLimit;

  // https://forum.dfinity.org/t/is-there-any-address-0-equivalent-at-dfinity-motoko/5445/3
  let null_address : Principal = Principal.fromText("aaaaa-aa");

  public query func balanceOf(user: Principal) : async Nat64 {
    return Nat64.fromNat(
      List.size(
        List.filter(nfts, func(token: Types.Nft) : Bool { token.owner == user })
      )
    );
  };

  public query func ownerOf(token_id: Types.TokenId) : async Types.OwnerResult {
    let item = List.get(nfts, Nat64.toNat(token_id));
    switch (item) {
      case (null) {
        return #Err(#InvalidTokenId);
      };
      case (?token) {
        return #Ok(token.owner);
      };
    };
  };

  public shared({ caller }) func safeTransferFrom(from: Principal, to: Principal, token_id: Types.TokenId) : async Types.TxReceipt {  
    if (to == null_address) {
      return #Err(#ZeroAddress);
    } else {
      return transfer(from, to, token_id, caller);
    };
  };

  public shared({ caller }) func transferFrom(from: Principal, to: Principal, token_id: Types.TokenId) : async Types.TxReceipt {
    return transfer(from, to, token_id, caller);
  };

  func transfer(from: Principal, to: Principal, token_id: Types.TokenId, caller: Principal) : Types.TxReceipt {
    let item = List.get(nfts, Nat64.toNat(token_id));
    switch (item) {
      case null {
        return #Err(#InvalidTokenId);
      };
      case (?token) {
        if (
          caller != token.owner and
          caller != token.approved and
          not List.some(custodians, func (custodian : Principal) : Bool { custodian == caller })
        ) {
          return #Err(#Unauthorized);
        } else if (Principal.notEqual(from, token.owner)) {
          return #Err(#Other);
        } else {
          nfts := List.map(nfts, func (item : Types.Nft) : Types.Nft {
            if (item.id == token.id) {
              let update : Types.Nft = {
                id = token.id;
                owner = to;
                approved = null;
                createdAt = token.createdAt;
                startTime = token.startTime;
                endTime = token.endTime;
                data = token.data;
                properties = token.properties;
              };
              return update;
            } else {
              return item;
            };
          });
          transactionId += 1;
          return #Ok(transactionId);   
        };
      };
    };
  };

  public query func supportedInterfaces() : async [Types.InterfaceId] {
    return [#TransferNotification, #Burn, #Mint];
  };

  public query func logo() : async Types.LogoResult {
    return _logo;
  };

  public query func name() : async Text {
    return _name;
  };

  public query func symbol() : async Text {
    return _symbol;
  };

  public query func totalSupply() : async Nat64 {
    return Nat64.fromNat(
      List.size(nfts)
    );
  };

  public query func getMetadata(token_id: Types.TokenId) : async Types.MetadataResult {
    let item = List.get(nfts, Nat64.toNat(token_id));
    switch (item) {
      case null {
        return #Err(#InvalidTokenId);
      };
      case (?token) {
        return #Ok(token.metadata);
      }
    };
  };

  public query func getMaxLimit() : async Nat64 {
    return _maxLimit;
  };

  public func getMetadataForUser(user: Principal) : async Types.ExtendedMetadataResult {
    let item = List.find(nfts, func(token: Types.Nft) : Bool { token.owner == user });
    switch (item) {
      case null {
        return #Err(#Other); 
      };
      case (?token) {
        return #Ok({
          metadata_desc = token.metadata;
          token_id = token.id;
        });
      }
    };
  };
  // public func getMetadataForUser(user: Principal) : async [Types.ExtendedMetadataResult] {
  //   let items = List.filter(nfts, func(token: Types.Nft) : Bool { token.owner == user });
  //   let metadatas = List.map(items, func(token: Types.Nft) : Types.ExtendedMetadataResult {
  //     return {
  //       metadata_desc = token.metadata;
  //       token_id = token.id;
  //     }
  //   });
  //   return List.toArray(metadatas);
  // };

  public query func getTokenIdsForUser(user: Principal) : async [Types.TokenId] {
    let items = List.filter(nfts, func(token: Types.Nft) : Bool { token.owner == user });
    let tokenIds = List.map(items, func (item : Types.Nft) : Types.TokenId { item.id });
    return List.toArray(tokenIds);
  };

  public shared({ caller }) func mint(to: Principal, metadata: Types.MetadataDesc) : async Types.MintReceipt {
    if (not List.some(custodians, func (custodian : Principal) : Bool { custodian == caller })) {
      return #Err(#Unauthorized);
    };

    let newId = Nat64.fromNat(List.size(nfts));
    let nft : Types.Nft = {
      owner = to;
      id = newId;
      approved = null;
      metadata = metadata;
    };

    nfts := List.push(nft, nfts);

    transactionId += 1;

    return #Ok({
      token_id = newId;
      id = transactionId;
    });
  };

  public shared({caller}) func burn(token_id: Nat64) : async Types.TxReceipt {
    let item = List.get(nfts, Nat64.toNat(token_id));
    switch(item) {
        case null {
          return #Err(#InvalidTokenId);
        };
        case (?token) {
          if (
            caller != token.owner and
            not List.some(custodians, func (custodian : Principal) : Bool { custodian == caller })
          ) {
          return #Err(#Unauthorized);
          } else {
             return transfer(caller, null_address, token_id, caller);
          }
        };
   
    };
  };

  public shared({caller}) func approve(user: Principal, token_id: Nat64): async Types.TxReceipt {
      let item = List.get(nfts, Nat64.toNat(token_id));
      switch(item) {
        case null {
          return #Err(#InvalidTokenId);
        };
        case (?token) {
          if (
            caller != token.owner and
            caller != token.approved and
            not List.some(custodians, func (custodian : Principal) : Bool { custodian == caller })
          ) {
             return #Err(#Unauthorized);
          } else {
            nfts := List.map(nfts, func (item : Types.Nft) : Types.Nft {
            if (item.id == token.id) {
              let update : Types.Nft = {
                owner = item.owner;
                id = item.id;
                approved = ?user;
                metadata = token.metadata;
              };
              return update;
            } else {
              return item;
            };
          });
          transactionId += 1;
          return #Ok(transactionId);   
          }
        };
      }
  }
}