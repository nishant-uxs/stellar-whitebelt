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
  
  // Add timeout to prevent hanging
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Transaction submission timed out after 30 seconds")), 30000);
  });
  
  try {
    const result = await Promise.race([
      server.submitTransaction(transaction),
      timeoutPromise
    ]);
    return result.hash;
  } catch (error: any) {
    // Better error messages
    if (error.response?.data?.extras?.result_codes) {
      const codes = error.response.data.extras.result_codes;
      if (codes.operations?.includes('op_no_destination')) {
        throw new Error('op_no_destination: Destination account does not exist. Fund it first via Friendbot.');
      }
      if (codes.operations?.includes('op_underfunded')) {
        throw new Error('op_underfunded: Insufficient balance for this transaction.');
      }
    }
    throw error;
  }
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
