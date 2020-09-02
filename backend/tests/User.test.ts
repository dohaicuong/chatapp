require('dotenv').config({
  path: '.env.test'
})

import { createTestClient } from "apollo-server-testing";
import { server } from "../src/server";

const { query } = createTestClient(server);

// const util = require('util')
// const unlink = util.promisify(require('fs').unlink)
afterAll(() => {
  console.log(`${__dirname}/${process.env.DATABASE_URL}`)
})
it("should return user connection", async () => {
  const request = await query({
    query: `
      query {
        userConnection(first: 10) {
          edges {
            node {
              id
              email
              name
              avatar
            }
          }
        }
      }
    `,
  });

  expect(request.data).toMatchInlineSnapshot(`
    Object {
      "userConnection": Object {
        "edges": Array [
          Object {
            "node": Object {
              "avatar": null,
              "email": "beatyshot@gmail.com",
              "id": "VXNlcjpja2VrcTQ2M2YwMDAxenUwOXRmbHVmZjVi",
              "name": "Yuki",
            },
          },
        ],
      },
    }
  `);
});
