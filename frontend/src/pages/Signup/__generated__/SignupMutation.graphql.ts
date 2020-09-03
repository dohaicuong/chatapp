/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type SignupInput = {
    email: string;
    password: string;
    name?: string | null;
    avatar?: string | null;
};
export type SignupMutationVariables = {
    input: SignupInput;
};
export type SignupMutationResponse = {
    readonly signup: {
        readonly token: string;
        readonly user: {
            readonly name: string | null;
        };
    };
};
export type SignupMutation = {
    readonly response: SignupMutationResponse;
    readonly variables: SignupMutationVariables;
};



/*
mutation SignupMutation(
  $input: SignupInput!
) {
  signup(input: $input) {
    token
    user {
      name
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "token",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SignupMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AuthPayload",
        "kind": "LinkedField",
        "name": "signup",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
              (v3/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SignupMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "AuthPayload",
        "kind": "LinkedField",
        "name": "signup",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "14fac6a1d919ce2f0afcd835dfc36f49",
    "id": null,
    "metadata": {},
    "name": "SignupMutation",
    "operationKind": "mutation",
    "text": "mutation SignupMutation(\n  $input: SignupInput!\n) {\n  signup(input: $input) {\n    token\n    user {\n      name\n      id\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '0cdc24f405b09cb5f98720fb2826addf';
export default node;
