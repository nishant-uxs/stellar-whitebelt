import * as StellarSdk from "@stellar/stellar-sdk";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

const server = new StellarSdk.Horizon.Server(HORIZON_URL);

export async function fetchBalance(publicKey: string): Promise<string> {
  const account = await server.loadAccount(publicKey);
  const nativeBalance = account.balances.find(
    (b: any) => b.asset_type === "native"
  );
  return nativeBalance ? nativeBalance.balance : "0";
}

export async function buildPaymentTransaction(
  senderPublicKey: string,
  destinationAddress: string,
  amount: string
): Promise<string> {
  const account = await server.loadAccount(senderPublicKey);

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: destinationAddress,
        asset: StellarSdk.Asset.native(),
        amount: amount,
      })
    )
    .setTimeout(30)
    .build();

  return transaction.toXDR();
}

export async function submitTransaction(signedXdr: string): Promise<string> {
  const transaction = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    NETWORK_PASSPHRASE
  );
  const result = await server.submitTransaction(transaction);
  return result.hash;
}

export function isValidStellarAddress(address: string): boolean {
  try {
    StellarSdk.Keypair.fromPublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
}

export function getExplorerUrl(hash: string): string {
  return `https://stellar.expert/explorer/testnet/tx/${hash}`;
}
