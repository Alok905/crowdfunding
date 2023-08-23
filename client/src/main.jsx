import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter as Router} from "react-router-dom"
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react"
import { Sepolia } from "@thirdweb-dev/chains";
import { StateContextProvider } from './context'
import App from "./App";
import './index.css'

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <ThirdwebProvider activeChain={Sepolia}
        clientId="20248417f6f4421b0cc9ab20e50d8798"
        // clientId={process.env.THIRDWEB_CLIENT_ID}
    >
        <Router>
            <StateContextProvider>
                <App />
            </StateContextProvider>
        </Router>
    </ThirdwebProvider>
)
