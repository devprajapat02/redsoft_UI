# React App README

This repository contains a React app that interacts with a smart contract, allowing users to mint, stake, and unstake CAT tokens. The app integrates with MetaMask for account management.

The application is deployed using vercel. It can be accessed at : https://redsoft-ui.vercel.app/.

## Smart Contract
- Address: 0x32e2F17ef39636432c22A2dFb41C734402D2db77
- Network: https://rpc-mumbai.maticvigil.com/
- Github: https://github.com/devprajapat02/truffle_redsoft

## Prerequisites

Before getting started, make sure you have the following prerequisites installed on your machine:

- Node.js (version 12 or later)
- MetaMask extension for your browser
- A metamask account that has some MATIC on Mumbai Polygon Testnet

## Installation

1. Clone this repository to your local machine:
   ```
   git clone https://github.com/devprajapat02/redsoft_UI.git
   ```

2. Install the project dependencies:
   ```
   cd redsoft_UI
   npm install
   ```

## Building the App

To build the React app, run the following command:
```
npm run build
```

This will generate a production-ready build of the app in the `build` directory.

## Usage

1. Start the development server:
   ```
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000` to access the app.

## Features

The React app includes the following features:

1. **Connect MetaMask Button**: Clicking this button prompts the user to connect their MetaMask account. The app requires a connected MetaMask account to interact with the smart contract.

2. **Mint 5 CAT Button**: Clicking this button triggers a transaction to mint 5 CAT tokens to the user's account. The transaction is signed with the connected MetaMask account.

3. **Stake Button**: Clicking this button allows the user to stake their CAT tokens. Using the textbox, the user can enter the desired amount of tokens to stake and triggers a transaction to stake the tokens.

4. **Unstake Button**: Clicking this button allows the user to unstake all their previously staked CAT tokens.
5. **Stake Details Section**: This section displays information about the user's current stake, including the staked amount and stake time.

6. **Error Log Box**: If any errors occur during the interaction with the smart contract, they will be displayed in the error log box.

Feel free to explore and test these features in the React app. Modify the app as per your requirements or add additional functionality based on your needs.

## Additional Resources

For more information about React and its features, refer to the official React documentation: [React Documentation](https://reactjs.org/docs)

For information on integrating MetaMask with your React app, refer to the official MetaMask documentation: [MetaMask Docs](https://docs.metamask.io/)
