import React, { createContext, useContext } from "react";


import { useAddress, useContract, useContractWrite, useMetamask } from "@thirdweb-dev/react"
import {ethers} from "ethers"

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract("0xC336558e38562314F923d13501151830438CAB34")
    const { mutateAsync: createCampaign } = useContractWrite(contract, "createCampaign")

    const address = useAddress()
    const connect = useMetamask()

    const publishCampaign = async (form) => {
        try {
            console.log(createCampaign)
            const data = await createCampaign({args: [
                address,
                form.title,
                form.description,
                form.target,
                new Date(form.deadline).getTime(),
                form.image
            ]})
            // console.log({mutateAsync, address, connect})
            console.log("contract call success", data)
        } catch (error) {
            console.log("contract call failure", error);
        }
        
    }

    const getCampaigns = async () => {
        const campaigns = await contract.call('getCampaigns')

        const parsedCampaigns = campaigns.map(campaign => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            image: campaign.image,
            pId: 1
        }))

        return parsedCampaigns
    }

    const getUserCampaigns = async () => {
        const allCampaigns = await getCampaigns()

        const filteredCampaigns = allCampaigns.filter(campaign => campaign.owner === address)

        return filteredCampaigns
    }

    const getDonations = async (pId) => {
        const donations = await contract.call('getDonators', [pId])

        const numberOfDonations = donations[0].length;

        const parsedDonations = []

        for (let i = 0; i < numberOfDonations; i++) {
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString())
            })
        }
        return parsedDonations
    }

    const donate = async (pId, amount) => {
        const data = await contract.call('donateToCampaign', [pId], {value: ethers.utils.parseEther(amount)})

        return data;
    }

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connect, 
                createCampaign: publishCampaign,
                getCampaigns,
                getUserCampaigns,
                getDonations,
                donate
            }}
        >
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)