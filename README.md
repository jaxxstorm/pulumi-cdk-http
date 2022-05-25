# AWS CDK Over HTTP

This example is based heavily on the following examples:

- Deploying a fargate app with CDK constructs: https://github.com/pulumi/pulumi-cdk/tree/main/examples/fargate
- Pulumi over HTTP automation API example: https://github.com/pulumi/automation-api-examples/tree/main/nodejs/pulumiOverHttp-ts

It has been modified to make a little more sense for this example.

You can see it in action here:

[![asciicast](https://asciinema.org/a/TagTpyjefwwjESuV5lerwIf87.svg)](https://asciinema.org/a/TagTpyjefwwjESuV5lerwIf87)

## Prerequisites

To get this running, ensure:

- You have valid AWS credentials
- You've got the [Pulumi CLI installed](https://www.pulumi.com/docs/get-started/install/)
- You have a recentish version of node.

## Running

Once you've done that, simply install the deps:

```bash
yarn install
```

Wait a few minutes for the server to start on port 1337.

Then send some data to the server, including an `image` in the content:

```bash
curl --header "Content-Type: application/json" --request POST --data '{"id":"helloworld","image":"nginx"}' http://localhost:1337/sites
```

You can then delete this site by sending a delete request:

```bash
curl --header "Content-Type: application/json" --request DELETE http://localhost:1337/sites/helloworld
```

## Frontend
You can run the frontend with

```bash
yarn start-frontend
```

The frontend will communicate directly with your server running on port 1337.  Ensure that your frontend is running on port 3000 or port 3001, or you may encounter CORS errors when making requests.