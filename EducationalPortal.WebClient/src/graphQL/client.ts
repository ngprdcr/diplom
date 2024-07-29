import {ApolloClient, HttpLink, InMemoryCache} from '@apollo/client';
import {schema} from './schema';
import {setContext} from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';

const authLink = setContext((_, {headers}) => ({
    headers: {
        ...headers,
        authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
    },
}));

const httpLink = createUploadLink({uri: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? process.env.REACT_APP_GRAPH_QL_API_URL : '/graphql'});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            errorPolicy: 'all',
            notifyOnNetworkStatusChange: true,
        },
        query: {
            errorPolicy: 'all',
            notifyOnNetworkStatusChange: true,
        },
    },
    typeDefs: schema,
});
