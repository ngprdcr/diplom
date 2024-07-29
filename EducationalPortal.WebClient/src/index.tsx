import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './App';
import {store} from "./store/store";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import {ApolloProvider} from "@apollo/client";
import {ConfigProvider} from "antd";
import {client} from "./graphQL/client";
import ukUA from 'antd/lib/locale/uk_UA';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <ApolloProvider client={client}>
                    <ConfigProvider locale={ukUA}>
                        <App/>
                    </ConfigProvider>
                </ApolloProvider>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);