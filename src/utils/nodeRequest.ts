import axios from "axios";
import { NODES } from "@src/constants";

const nodeRequest = async (request: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    let nodeIndex = 0;
    let success = false;
    while (!success) {
      const url = NODES[nodeIndex] + request;
      try {
        const { data } = await axios.get(url);
        success = true;
        resolve(data);
      } catch (reason) {
        if (nodeIndex === NODES.length - 1) {
          success = true;
          reject(reason);
        } else {
          nodeIndex = nodeIndex + 1;
        }
      }
    }
  });
};

export default nodeRequest;
