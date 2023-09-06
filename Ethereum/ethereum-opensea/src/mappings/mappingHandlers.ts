import { OrderFulfilled } from "../types";
import { OrderFulfilledLog } from "../types/abi-interfaces/SeaportAbi";
import assert from "assert";

export async function handleLog(log: OrderFulfilledLog): Promise<void> {
  logger.info(`New transfer transaction log at block ${log.blockNumber}`);
  logger.info(`${log.topics}`);
  // logger.info(`Log info ${log}`);
  assert(log.args, "No log.args");

  const transaction = OrderFulfilled.create({
    id: log.transactionHash,
    blockHeight: BigInt(log.blockNumber),
    orderHash: log.args.orderHash,
    offerer: log.args.offerer,
    zone: log.args.zone,
    recipient: log.args.recipient,
    contractAddress: log.address,
  });

  await transaction.save();
}

// export async function handleTransaction(tx: ApproveTransaction): Promise<void> {
//   logger.info(`New Approval transaction at block ${tx.blockNumber}`);
//   assert(tx.args, "No tx.args");

//   const approval = Approval.create({
//     id: tx.hash,
//     owner: tx.from,
//     spender: await tx.args[0],
//     value: BigInt(await tx.args[1].toString()),
//     contractAddress: tx.to,
//   });

// await approval.save();
// }
