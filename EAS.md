# Get attestation metadata via UID

``` lua
query Attestations($where: AttestationWhereInput) {
  attestations(where: $where) {,
    id
    data
    decodedDataJson
    recipient
    attester
    time
    timeCreated
    expirationTime
    revocationTime
    refUID
    revocable
    revoked
    txid
    schemaId
    ipfsHash
    isOffchain
  }
}
```

``` json
{
  "where": {
    "id": {
      "equals": "0x324897cee471ac2670f8c56d31a691bd542add1f4a88bcfe2494193e397554fa"
    }
  }
}
```


# Get all attestations with that match the schema

``` lua

query Query($where: AttestationWhereInput) {
  attestations(where: $where) {
    id
    data
    decodedDataJson
    recipient
    attester
    time
    timeCreated
    expirationTime
    revocationTime
    refUID
    revocable
    revoked
    txid
    schemaId
    ipfsHash
    isOffchain
  }
}
```

``` JSON
{
  "where": {
    "schemaId": {
      "equals": "0x9908e8cf7836eb73b29fb0d6d946cda72ffa75f903d094c64752f44c0e63f7cf"
    }
  }
}
```

# 

``` bash

curl 'https://sepolia.easscan.org/graphql' \
  -H 'Accept: */*' \
  -H 'Accept-Language: en-US,en;q=0.9' \
  -H 'Connection: keep-alive' \
  -H 'Origin: https://studio.apollographql.com' \
  -H 'Referer: https://studio.apollographql.com/sandbox/explorer' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Site: cross-site' \
  -H 'Sec-GPC: 1' \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' \
  -H 'content-type: application/json' \
  -H 'dnt: 1' \
  -H 'sec-ch-ua: "Chromium";v="130", "Brave";v="130", "Not?A_Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Linux"' \
  --data-raw '{"query":"\n    query IntrospectionQuery {\n      __schema {\n        \n        queryType { name }\n        mutationType { name }\n        subscriptionType { name }\n        types {\n          ...FullType\n        }\n        directives {\n          name\n          description\n          \n          locations\n          args(includeDeprecated: true) {\n            ...InputValue\n          }\n        }\n      }\n    }\n\n    fragment FullType on __Type {\n      kind\n      name\n      description\n      \n      fields(includeDeprecated: true) {\n        name\n        description\n        args(includeDeprecated: true) {\n          ...InputValue\n        }\n        type {\n          ...TypeRef\n        }\n        isDeprecated\n        deprecationReason\n      }\n      inputFields(includeDeprecated: true) {\n        ...InputValue\n      }\n      interfaces {\n        ...TypeRef\n      }\n      enumValues(includeDeprecated: true) {\n        name\n        description\n        isDeprecated\n        deprecationReason\n      }\n      possibleTypes {\n        ...TypeRef\n      }\n    }\n\n    fragment InputValue on __InputValue {\n      name\n      description\n      type { ...TypeRef }\n      defaultValue\n      isDeprecated\n      deprecationReason\n    }\n\n    fragment TypeRef on __Type {\n      kind\n      name\n      ofType {\n        kind\n        name\n        ofType {\n          kind\n          name\n          ofType {\n            kind\n            name\n            ofType {\n              kind\n              name\n              ofType {\n                kind\n                name\n                ofType {\n                  kind\n                  name\n                  ofType {\n                    kind\n                    name\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  ","operationName":"IntrospectionQuery"}' | jq > curl.graphql.json

```

``` js

fetch("https://sepolia.easscan.org/graphql", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-ch-ua": "\"Chromium\";v=\"130\", \"Brave\";v=\"130\", \"Not?A_Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "sec-gpc": "1"
  },
  "referrer": "https://studio.apollographql.com/sandbox/explorer",
  "referrerPolicy": "no-referrer-when-downgrade",
  "body": "{\"query\":\"\\n    query IntrospectionQuery {\\n      __schema {\\n        \\n        queryType { name }\\n        mutationType { name }\\n        subscriptionType { name }\\n        types {\\n          ...FullType\\n        }\\n        directives {\\n          name\\n          description\\n          \\n          locations\\n          args(includeDeprecated: true) {\\n            ...InputValue\\n          }\\n        }\\n      }\\n    }\\n\\n    fragment FullType on __Type {\\n      kind\\n      name\\n      description\\n      \\n      fields(includeDeprecated: true) {\\n        name\\n        description\\n        args(includeDeprecated: true) {\\n          ...InputValue\\n        }\\n        type {\\n          ...TypeRef\\n        }\\n        isDeprecated\\n        deprecationReason\\n      }\\n      inputFields(includeDeprecated: true) {\\n        ...InputValue\\n      }\\n      interfaces {\\n        ...TypeRef\\n      }\\n      enumValues(includeDeprecated: true) {\\n        name\\n        description\\n        isDeprecated\\n        deprecationReason\\n      }\\n      possibleTypes {\\n        ...TypeRef\\n      }\\n    }\\n\\n    fragment InputValue on __InputValue {\\n      name\\n      description\\n      type { ...TypeRef }\\n      defaultValue\\n      isDeprecated\\n      deprecationReason\\n    }\\n\\n    fragment TypeRef on __Type {\\n      kind\\n      name\\n      ofType {\\n        kind\\n        name\\n        ofType {\\n          kind\\n          name\\n          ofType {\\n            kind\\n            name\\n            ofType {\\n              kind\\n              name\\n              ofType {\\n                kind\\n                name\\n                ofType {\\n                  kind\\n                  name\\n                  ofType {\\n                    kind\\n                    name\\n                  }\\n                }\\n              }\\n            }\\n          }\\n        }\\n      }\\n    }\\n  \",\"operationName\":\"IntrospectionQuery\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
});

```