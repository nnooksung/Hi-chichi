const { GraphQLServer, PubSub } = require('graphql-yoga');

let defaultName = "NOOKSUNG";

const pubsub = new PubSub();

const typeDefs = `
	type Query {
		hello(name: String): String!
		sayhi: String!
		continue: String!
	}

	type Mutation {
		changeDefaultName(name: String!): String!
	}

	type Subscription {
		updateName: String!
	}
`;

const resolvers = {
	Query: {
		hello: (root, { name }, ctx, info) => {
			if (!name)
				name = defaultName;
			return `Hello purple world, my name is ${name}!`;
		},
		sayhi: () => "Hello purple world, my name is",
		continue:() => "This is the second time studied with you, You are the greatest teacher!"
	},
	Mutation: {
		changeDefaultName: (root, { name }, ctx, info) => {
			defaultName = name;
			pubsub.publish('update_name', {
				updateName: `Notify Update Default Name to ${name}`
			})
			return `Ok change the default name to ${defaultName}`;
		}
	},
	Subscription: {
		updateName: {
			subscribe(root, args, ctx, info) {
				return pubsub.asyncIterator('update_name');
			}
		}
	}
};

const server = new GraphQLServer({
	typeDefs,
	resolvers
});

const options = {
	port: 4000,
	endpoint: '/graphql'
};

server.start(options, (args) => { 
	const { port } = args;
  console.log(`Server start on port: ${port}`)
});